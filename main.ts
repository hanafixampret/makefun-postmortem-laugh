import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I asked the agent to make the error messages friendlier. It wrapped every failure in try/catch, and now the app cheerfully reports 'Everything is fine!' while the database is on fire.";

function main(): void {
  const text = ENTRY.trim();
  if (text.length < 1 || text.length > 400) {
    throw new Error(`entry must be 1-400 characters, got ${text.length}`);
  }
  if (/\s/.test(text) && text.trim() !== text) {
    throw new Error("entry has leading or trailing whitespace");
  }
  if (text.includes("  ")) {
    throw new Error("entry contains a double space");
  }
  const sentences = text.split(/(?<=[.!?])\s+/);
  if (sentences.length < 1 || sentences.length > 2) {
    throw new Error(`entry must be one or two sentences, got ${sentences.length}`);
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, text, "utf8");
  const roundTrip = readFileSync(outPath, "utf8");
  if (roundTrip !== text) {
    throw new Error("round-trip check failed: entry.txt differs from entry");
  }
}

main();
