import fs from "node:fs";
import path from "node:path";
import "server-only";

export type SourceFile = {
  name: string;
  code: string;
  highlightLines?: number[];
};

/**
 * A line to highlight, found by text rather than line number so highlights
 * survive edits: a string marks the first line containing it, `{ from, to }`
 * marks the first line containing `from` through the next line containing `to`.
 */
export type Highlight = string | { from: string; to: string };

// Next.js file conventions share names, so show their route path instead.
const GENERIC_FILE_NAMES = new Set(["route.ts", "page.tsx"]);

const findLine = (
  lines: string[],
  text: string,
  start: number,
  filePath: string
) => {
  const index = lines.findIndex(
    (line, lineIndex) => lineIndex >= start && line.includes(text)
  );
  // Fail the build instead of silently highlighting the wrong lines.
  if (index === -1) {
    throw new Error(`Highlight "${text}" not found in ${filePath}`);
  }
  return index;
};

const resolveHighlights = (
  code: string,
  highlights: Highlight[],
  filePath: string
) => {
  const lines = code.split("\n");

  return highlights.flatMap((highlight) => {
    if (typeof highlight === "string") {
      return [findLine(lines, highlight, 0, filePath) + 1];
    }
    const from = findLine(lines, highlight.from, 0, filePath);
    const to = findLine(lines, highlight.to, from, filePath);
    return Array.from(
      { length: to - from + 1 },
      (_, offset) => from + offset + 1
    );
  });
};

/** Reads a project file so the Code tab always shows the real demo source. */
export const readSource = (
  filePath: string,
  highlights: Highlight[] = []
): SourceFile => {
  const code = fs.readFileSync(
    path.join(/* turbopackIgnore: true */ process.cwd(), filePath),
    "utf8"
  );

  return {
    name: GENERIC_FILE_NAMES.has(path.basename(filePath))
      ? filePath.replace(/^src\/app\//, "")
      : path.basename(filePath),
    code,
    highlightLines: resolveHighlights(code, highlights, filePath),
  };
};
