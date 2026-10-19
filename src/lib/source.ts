import fs from "node:fs";
import path from "node:path";
import "server-only";

export type SourceFile = {
  name: string;
  code: string;
  highlightLines?: number[];
};

// Next.js file conventions share names, so show their route path instead.
const GENERIC_FILE_NAMES = new Set(["route.ts", "page.tsx"]);

/** Reads a project file so the Code tab always shows the real demo source. */
export const readSource = (
  filePath: string,
  highlightLines?: number[]
): SourceFile => ({
  name: GENERIC_FILE_NAMES.has(path.basename(filePath))
    ? filePath.replace(/^src\/app\//, "")
    : path.basename(filePath),
  code: fs.readFileSync(
    path.join(/* turbopackIgnore: true */ process.cwd(), filePath),
    "utf8"
  ),
  highlightLines,
});
