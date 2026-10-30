import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.join(process.cwd(), "app", "admin");
const sourceExtensions = new Set([".tsx", ".jsx"]);
const violations = [];

async function scan(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await scan(filePath);
      continue;
    }
    if (!sourceExtensions.has(path.extname(entry.name))) continue;

    const source = await readFile(filePath, "utf8");
    const lines = source.split(/\r?\n/);
    lines.forEach((line, index) => {
      // JSX text nodes must not contain the two-character escaped newline sequence.
      if (/>[^<]*\\n[^<]*</.test(line)) {
        violations.push(path.relative(process.cwd(), filePath) + ":" + (index + 1));
      }
    });
  }
}

await scan(root);

if (violations.length) {
  console.error("Found literal \\n text in admin JSX. Use a real line break or a formatted text value instead:");
  for (const violation of violations) console.error("- " + violation);
  process.exitCode = 1;
} else {
  console.log("Admin JSX text check passed.");
}
