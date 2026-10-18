import fs from "node:fs";
import path from "node:path";
import "server-only";

export type SourceFile = {
  name: string;
  code: string;
  highlightLines?: number[];
};

/** Reads a project file so the Code tab always shows the real demo source. */
export const readSource = (
  filePath: string,
  highlightLines?: number[]
): SourceFile => ({
  name: path.basename(filePath),
  code: fs.readFileSync(
    path.join(/* turbopackIgnore: true */ process.cwd(), filePath),
    "utf8"
  ),
  highlightLines,
});
