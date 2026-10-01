/**
 * One-off: reposition the `force-dynamic` export so it always sits immediately
 * after the final `import` statement in each SEO/marketing page.
 *
 * Why this exists: `next build` prerendered ~135 static pages and died with
 * "Ineffective mark-compacts near heap limit". Bisecting showed no single page is
 * at fault — it is aggregate prerender cost. The content suite reads local JSON
 * only, so per-request rendering costs milliseconds and every URL keeps working.
 *
 * Placement rules learned the hard way:
 *   - Never at the very top: ESM hoists imports, so an export there still
 *     initialises in source order and produced "F is not a function" TDZ errors.
 *   - Never after the last `;`: some pages declare `const X = dynamic(...)`
 *     between imports, so "last top-level semicolon" is not an import boundary.
 * The only reliable anchor is the line index of the last `import` / `} from "…"`
 * statement, whichever comes later.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const SRC = join(process.cwd(), "src/app");
const GROUPS = ["(marketing)", "(templates)", "(outils)"];

const NOTE_LINES = [
  "// Rendered on demand. SEO/marketing content, not product surface: prerendering the",
  "// ~135-page content suite exhausted the Node heap during `next build`",
  '// ("Ineffective mark-compacts near heap limit"). All data is local, so rendering',
  "// per request costs ~ms and every URL keeps working.",
  'export const dynamic = "force-dynamic";',
];

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (e === "page.tsx") out.push(full);
  }
  return out;
}

const RE_EXPORT = /^\s*export\s+const\s+dynamic\s*=\s*"force-dynamic";\s*$/;

let moved = 0;
let skipped = 0;

for (const group of GROUPS) {
  let files = [];
  try {
    files = walk(join(SRC, group));
  } catch {
    continue;
  }

  for (const file of files.sort()) {
    const src = readFileSync(file, "utf8");
    const lines = src.split("\n");

    const exportIdx = lines.findIndex((l) => RE_EXPORT.test(l));
    if (exportIdx === -1) {
      skipped += 1;
      continue;
    }

    // Index of the last line that starts or continues an import statement.
    let lastImport = -1;
    for (let i = 0; i < lines.length; i++) {
      const t = lines[i].trim();
      if (t.startsWith("import ") || t.startsWith("} from \"")) lastImport = i;
    }
    if (lastImport === -1) {
      skipped += 1;
      continue;
    }

    if (exportIdx === lastImport + 1) continue; // already correct

    const rebuilt = [
      ...lines.slice(0, lastImport + 1),
      "",
      ...NOTE_LINES,
      ...lines.slice(lastImport + 1, exportIdx),
      ...lines.slice(exportIdx + 1),
    ].filter((l, i, arr) => !(l === "" && arr[i - 1] === ""));

    const out = rebuilt.join("\n");
    const tail = out.slice(out.indexOf('export const dynamic = "force-dynamic"'));
    if (/^\s*(import\s|\}\s+from\s)/m.test(tail)) {
      skipped += 1;
      continue;
    }

    writeFileSync(file, out);
    moved += 1;
  }
}

console.log(`Repositioned force-dynamic in ${moved} file(s); skipped ${skipped}.`);