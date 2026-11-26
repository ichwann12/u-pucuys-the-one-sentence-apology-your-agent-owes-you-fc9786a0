import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const linePath = join(here, "line.txt");

const raw = readFileSync(linePath, "utf8");
const line = raw.replace(/\r\n/g, "\n").trim();

if (line.length === 0) {
  throw new Error("line.txt is empty: the apology must be a non-empty sentence.");
}
if (line.includes("\n")) {
  throw new Error("line.txt must contain exactly one line (a single sentence).");
}
if (line.length < 1 || line.length > 200) {
  throw new Error(`Apology must be 1-200 characters, got ${line.length}.`);
}
if (!line.endsWith(".")) {
  throw new Error("Apology must be a single sentence ending with a period.");
}
const innerTerminal = line.slice(0, -1).match(/[.!?]/);
if (innerTerminal) {
  throw new Error(
    `Apology must be exactly one sentence: found an extra sentence-ending "${innerTerminal[0]}" before the final period.`
  );
}

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR ||
  process.env.MAKEFUN_BOT_DIR ||
  join(here, "output");

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, line, "utf8");
console.log(`Wrote ${line.length} characters to ${outPath}`);
