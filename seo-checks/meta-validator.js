#!/usr/bin/env node
/**
 * meta-validator.js — Meta tag validation for CI
 *
 * Validates that every marketing page in src/app/(marketing)/*
 * exports a complete, valid metadata object or generateMetadata() function.
 *
 * Checks:
 *   - metadata.title exists and is non-empty
 *   - metadata.description exists and is non-empty
 *   - No duplicate titles across marketing routes
 *   - og:title, og:description, og:image are set
 *   - canonical URL (via metadata.alternates.canonical or baseMetadata)
 *   - robots: index, follow for marketing pages
 *   - No console.log / debugger in page files
 *
 * Usage:
 *   node seo-checks/meta-validator.js [--json]
 */

const fs = require("fs");
const path = require("path");

const MARKETING_DIR = path.join(__dirname, "..", "src", "app", "(marketing)");

// ── Helpers ───────────────────────────────────────────────────────────────────

function walkDir(dir) {
  const results = [];
  try {
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      try {
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          results.push(...walkDir(full));
        } else if (stat.isFile() && entry === "page.tsx") {
          results.push(full);
        }
      } catch {}
    }
  } catch {}
  return results;
}

/**
 * Extract a quoted or identifier string value respecting quotes and escape sequences.
 */
function extractValue(text, startIndex) {
  let i = startIndex;
  while (i < text.length && /\s/.test(text[i])) i++;
  if (i >= text.length) return null;

  const quote = text[i];
  if (quote === '"' || quote === "'" || quote === "`") {
    let j = i + 1;
    let res = "";
    while (j < text.length) {
      if (text[j] === "\\") {
        res += text[j + 1] || "";
        j += 2;
      } else if (text[j] === quote) {
        return { value: res, raw: text.slice(i, j + 1), endIndex: j + 1 };
      } else {
        res += text[j];
        j++;
      }
    }
    return null;
  }

  const match = /^([^\s,\n\r}]+)/.exec(text.slice(i));
  if (match) {
    return { value: match[1], raw: match[1], endIndex: i + match[0].length };
  }
  return null;
}

function extractTopLevelProperties(objText) {
  const props = {};
  let depth = 0;
  let i = 0;
  while (i < objText.length) {
    const c = objText[i];
    if (c === "{" || c === "(") {
      depth++;
      i++;
    } else if (c === "}" || c === ")") {
      depth--;
      i++;
    } else if (depth === 1) {
      const match = /^([a-zA-Z_$][\w$]*)\s*:\s*/.exec(objText.slice(i));
      if (match) {
        const key = match[1];
        let valStart = i + match[0].length;
        while (valStart < objText.length && /\s/.test(objText[valStart])) valStart++;

        if (objText[valStart] === "{") {
          let objDepth = 0;
          let j = valStart;
          for (; j < objText.length; j++) {
            if (objText[j] === "{") objDepth++;
            else if (objText[j] === "}") {
              objDepth--;
              if (objDepth === 0) { j++; break; }
            }
          }
          props[key] = { value: "[Object]", raw: objText.slice(valStart, j), endIndex: j };
          i = j;
          continue;
        } else if (objText[valStart] === "[") {
          let arrDepth = 0;
          let j = valStart;
          for (; j < objText.length; j++) {
            if (objText[j] === "[") arrDepth++;
            else if (objText[j] === "]") {
              arrDepth--;
              if (arrDepth === 0) { j++; break; }
            }
          }
          props[key] = { value: "[Array]", raw: objText.slice(valStart, j), endIndex: j };
          i = j;
          continue;
        } else {
          const v = extractValue(objText, valStart);
          if (v) {
            props[key] = v;
            i = v.endIndex;
            continue;
          }
        }
      }
      i++;
    } else {
      i++;
    }
  }
  return props;
}

/**
 * Extract the metadata export from a Next.js page file.
 * Handles:
 *   1. Static: `export const metadata = {...}` or `const metadata = {...}`
 *   2. Dynamic: `export async function generateMetadata(...) {...}` or `export function generateMetadata(...) {...}`
 */
function extractMetadata(content) {
  const issues = [];

  // Check for console.log / debugger in page files (bad for production)
  if (/console\.log\s*\(/.test(content)) {
    issues.push({ severity: "error", rule: "no-console-log", message: "console.log found in page file" });
  }
  if (/debugger;?/.test(content)) {
    issues.push({ severity: "error", rule: "debugger", message: "debugger statement found" });
  }

  // 1. Static metadata export
  const staticRe = /(?:export\s+const\s+metadata|const\s+metadata)(?:\s*:\s*[\w<>]+)?\s*=\s*\{/;
  const staticMatch = staticRe.exec(content);
  if (staticMatch) {
    const firstBracePos = staticMatch[0].length - 1;
    const raw = content.slice(staticMatch.index);
    let depth = 0;
    let end = 0;
    for (let i = firstBracePos; i < raw.length; i++) {
      if (raw[i] === "{") depth++;
      else if (raw[i] === "}") depth--;
      if (depth === 0) { end = i; break; }
    }

    const metadataText = raw.slice(0, end + 1);
    const meta = {};
    const props = extractTopLevelProperties(metadataText);

    if (props.title) {
      meta.title = props.title.value.trim();
    }
    if (props.description) {
      meta.description = props.description.value.replace(/\s+/g, " ").trim();
    }

    if (/alternates\s*:/.test(metadataText)) meta._hasAlternates = true;
    if (/robots\s*:/.test(metadataText)) meta._hasRobots = true;
    if (/openGraph\s*:/.test(metadataText)) meta._hasOpenGraph = true;
    if (/images\s*:/.test(metadataText)) meta._hasOgImages = true;

    return { issues, metadata: meta };
  }

  // 2. Dynamic generateMetadata function
  const genRe = /export\s+(?:async\s+)?function\s+generateMetadata(?:\s*<[^>]+>)?\s*\([^)]*\)(?:\s*:\s*[\w<>: ]+)?\s*\{/;
  const genConstRe = /export\s+const\s+generateMetadata\s*=\s*(?:async\s*)?\([^)]*\)[^{]*\{/;
  const genMatch = genRe.exec(content) || genConstRe.exec(content);

  if (genMatch) {
    const startPos = genMatch.index + genMatch[0].length - 1;
    let depth = 0;
    let end = 0;
    for (let i = startPos; i < content.length; i++) {
      if (content[i] === "{") depth++;
      else if (content[i] === "}") depth--;
      if (depth === 0) { end = i; break; }
    }

    const funcBody = content.slice(startPos, end + 1);
    const meta = { _isDynamic: true };

    const isBaseMetadata = /baseMetadata\s*\(/.test(funcBody);
    if (isBaseMetadata) {
      meta._hasAlternates = true;
      meta._hasRobots = true;
      meta._hasOpenGraph = true;
      meta._hasOgImages = true;
    } else {
      if (/alternates\s*:/.test(funcBody)) meta._hasAlternates = true;
      if (/robots\s*:/.test(funcBody)) meta._hasRobots = true;
      if (/openGraph\s*:/.test(funcBody)) meta._hasOpenGraph = true;
      if (/images\s*:/.test(funcBody)) meta._hasOgImages = true;
    }

    // Extract title & description from baseMetadata argument or local variable
    const baseMatch = /baseMetadata\s*\(\s*\{/.exec(funcBody);
    const targetText = baseMatch ? funcBody.slice(baseMatch.index + baseMatch[0].length - 1) : funcBody;
    const props = extractTopLevelProperties(targetText);

    if (props.title) {
      const v = props.title;
      if (v.raw[0] !== '"' && v.raw[0] !== "'" && v.raw[0] !== "`") {
        const varMatch = new RegExp(`(?:const|let|var)\\s+${v.value}\\s*=\\s*`).exec(funcBody);
        if (varMatch) {
          const varVal = extractValue(funcBody, varMatch.index + varMatch[0].length);
          if (varVal && (varVal.raw[0] === '"' || varVal.raw[0] === "'" || varVal.raw[0] === "`")) {
            meta.title = varVal.value.trim();
          } else {
            meta.title = `[Dynamic: ${v.value}]`;
          }
        } else {
          meta.title = `[Dynamic: ${v.value}]`;
        }
      } else {
        meta.title = v.value.trim();
      }
    }
    if (!meta.title) {
      const varTitleMatch = /(?:const|let|var)\s+title\s*=\s*/.exec(funcBody);
      if (varTitleMatch) {
        const v = extractValue(funcBody, varTitleMatch.index + varTitleMatch[0].length);
        if (v && (v.raw[0] === '"' || v.raw[0] === "'" || v.raw[0] === "`")) {
          meta.title = v.value.trim();
        } else if (v) {
          meta.title = `[Dynamic: ${v.value}]`;
        }
      }
    }
    if (!meta.title && /\btitle\b/.test(funcBody)) {
      meta.title = "[Dynamic Title]";
    }

    if (props.description) {
      const v = props.description;
      if (v.raw[0] !== '"' && v.raw[0] !== "'" && v.raw[0] !== "`") {
        const varMatch = new RegExp(`(?:const|let|var)\\s+${v.value}\\s*=\\s*`).exec(funcBody);
        if (varMatch) {
          const varVal = extractValue(funcBody, varMatch.index + varMatch[0].length);
          if (varVal && (varVal.raw[0] === '"' || varVal.raw[0] === "'" || varVal.raw[0] === "`")) {
            meta.description = varVal.value.replace(/\s+/g, " ").trim();
          } else {
            meta.description = `[Dynamic: ${v.value}]`;
          }
        } else {
          meta.description = `[Dynamic: ${v.value}]`;
        }
      } else {
        meta.description = v.value.replace(/\s+/g, " ").trim();
      }
    }
    if (!meta.description) {
      const varDescMatch = /(?:const|let|var)\s+description\s*=\s*/.exec(funcBody);
      if (varDescMatch) {
        const v = extractValue(funcBody, varDescMatch.index + varDescMatch[0].length);
        if (v && (v.raw[0] === '"' || v.raw[0] === "'" || v.raw[0] === "`")) {
          meta.description = v.value.replace(/\s+/g, " ").trim();
        } else if (v) {
          meta.description = `[Dynamic: ${v.value}]`;
        }
      }
    }
    if (!meta.description && /\bdescription\b/.test(funcBody)) {
      meta.description = "[Dynamic Description]";
    }

    return { issues, metadata: meta };
  }

  issues.push({ severity: "error", rule: "no-metadata", message: "No metadata or generateMetadata export found" });
  return { issues, metadata: null };
}

/**
 * Extract page route from file path.
 */
function getRoute(filePath) {
  const relative = path.relative(MARKETING_DIR, filePath);
  const parts = path.dirname(relative).split(path.sep);
  if (parts[0] === ".") return "/";
  return "/" + parts.join("/");
}

// ── Validation rules ───────────────────────────────────────────────────────────

const RULES = [
  {
    id: "title-required",
    check: (meta) => {
      if (!meta || !meta.title || meta.title.trim() === "") {
        return { ok: false, message: "metadata.title is required" };
      }
      return { ok: true };
    },
  },
  {
    id: "title-length",
    check: (meta) => {
      if (!meta || !meta.title) return { ok: true };
      if (meta._isDynamic && meta.title.startsWith("[")) return { ok: true };
      if (meta.title.length > 75) {
        return { ok: false, message: `title exceeds 75 chars (currently ${meta.title.length})` };
      }
      return { ok: true };
    },
  },
  {
    id: "description-required",
    check: (meta) => {
      if (!meta || !meta.description || meta.description.trim() === "") {
        return { ok: false, message: "metadata.description is required" };
      }
      return { ok: true };
    },
  },
  {
    id: "description-length",
    check: (meta) => {
      if (!meta || !meta.description) return { ok: true };
      if (meta._isDynamic && meta.description.startsWith("[")) return { ok: true };
      const len = meta.description.length;
      if (len < 50 || len > 220) {
        return { ok: false, message: `description should be reasonably concise between 50 and 220 chars (currently ${len})` };
      }
      return { ok: true };
    },
  },
  {
    id: "og-title",
    check: (meta) => {
      if (!meta || !meta._hasOpenGraph) return { ok: false, message: "openGraph object missing in metadata" };
      return { ok: true };
    },
  },
  {
    id: "og-description",
    check: (meta) => {
      if (!meta || !meta._hasOpenGraph) return { ok: false, message: "openGraph object missing" };
      return { ok: true };
    },
  },
  {
    id: "og-image",
    check: (meta) => {
      if (!meta || !meta._hasOpenGraph) return { ok: false, message: "openGraph object missing" };
      if (!meta._hasOgImages) return { ok: false, message: "openGraph.images is required (og:image)" };
      return { ok: true };
    },
  },
  {
    id: "canonical",
    check: (meta) => {
      if (!meta || !meta._hasAlternates) return { ok: false, message: "alternates.canonical missing in metadata" };
      return { ok: true };
    },
  },
  {
    id: "robots",
    check: (meta) => {
      if (!meta || !meta._hasRobots) return { ok: false, message: "robots metadata missing (index, follow expected)" };
      return { ok: true };
    },
  },
];

// ── Reporter ─────────────────────────────────────────────────────────────────

class Reporter {
  constructor(json = false) {
    this.json = json;
    this.results = [];
    this.errorCount = 0;
    this.warnCount = 0;
    this.checkedCount = 0;
  }

  add(route, file, ruleId, severity, message) {
    this.results.push({ route, file, ruleId, severity, message });
    if (severity === "error") this.errorCount++;
    else this.warnCount++;
  }

  checkPage(filePath, pageMeta) {
    this.checkedCount++;
    const route = getRoute(filePath);
    const file = path.relative(path.join(__dirname, ".."), filePath);

    // Check file-level issues from parsing
    for (const issue of pageMeta.issues || []) {
      this.add(route, file, issue.rule, issue.severity, issue.message);
    }

    if (!pageMeta.metadata) {
      // Do not attempt to run field rules when metadata export is missing
      return;
    }

    // Check required fields
    for (const rule of RULES) {
      const result = rule.check(pageMeta.metadata, route);
      if (!result.ok) {
        this.add(route, file, rule.id, "error", result.message);
      }
    }
  }

  checkDuplicates(titleMap) {
    const seen = new Map();
    for (const [route, title] of titleMap) {
      if (!title || title.startsWith("[")) continue;
      if (seen.has(title)) {
        const existingRoute = seen.get(title);
        this.add(route, "N/A", "duplicate-title", "error", `Duplicate title "${title}" also used by ${existingRoute}`);
        this.add(existingRoute, "N/A", "duplicate-title", "error", `Duplicate title "${title}" also used by ${route}`);
      } else {
        seen.set(title, route);
      }
    }
  }

  print() {
    if (this.json) {
      console.log(JSON.stringify({
        passed: this.errorCount === 0,
        checked: this.checkedCount,
        errors: this.errorCount,
        warnings: this.warnCount,
        results: this.results,
      }, null, 2));
      return;
    }

    console.log(`\n🔍 RentReady Meta Tag Validator`);
    console.log(`   Marketing pages checked: ${this.checkedCount}`);
    console.log(`   Errors: ${this.errorCount} | Warnings: ${this.warnCount}`);
    console.log(`\n${"─".repeat(60)}`);

    if (this.results.length === 0) {
      console.log(`\n   ✅ All pages passed metadata validation`);
      return;
    }

    const byRoute = {};
    for (const r of this.results) {
      if (!byRoute[r.route]) byRoute[r.route] = [];
      byRoute[r.route].push(r);
    }

    for (const [route, issues] of Object.entries(byRoute)) {
      const emoji = issues.some(i => i.severity === "error") ? "❌" : "⚠️ ";
      console.log(`\n${emoji} ${route}`);
      for (const issue of issues) {
        const icon = issue.severity === "error" ? "  ✖" : "  ⚠";
        console.log(`     ${icon} [${issue.ruleId}] ${issue.message}`);
      }
      console.log(`      ↳ ${issues[0].file}`);
    }

    console.log(`\n${"─".repeat(60)}`);
    if (this.errorCount > 0) {
      console.log(`\n❌ CI FAILED: ${this.errorCount} metadata error(s) found.`);
      console.log(`   Add/update metadata export in each marketing page.`);
      console.log(`   See: https://nextjs.org/docs/app/api-reference/functions/generate-metadata`);
    } else if (this.warnCount > 0) {
      console.log(`\n⚠️  ${this.warnCount} warning(s) — not blocking, but should be fixed.`);
    } else {
      console.log(`\n   ✅ All marketing pages validated successfully!`);
    }
  }
}

// ── Main ───────────────────────────────────────────────────────────────────────

function main() {
  const json = process.argv.includes("--json");
  const reporter = new Reporter(json);

  const files = walkDir(MARKETING_DIR);
  console.log(`   Found ${files.length} marketing page files`);

  const titleMap = new Map();

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, "utf8");
      const { issues, metadata } = extractMetadata(content);
      reporter.checkPage(file, { issues, metadata });

      if (metadata && metadata.title) {
        titleMap.set(getRoute(file), metadata.title);
      }
    } catch (err) {
      const route = getRoute(file);
      reporter.add(route, path.relative(path.join(__dirname, ".."), file), "read-error", "error", `Could not read file: ${err.message}`);
    }
  }

  reporter.checkDuplicates(titleMap);
  reporter.print();

  if (reporter.errorCount > 0) {
    process.exit(1);
  }
  process.exit(0);
}

if (require.main === module) {
  main();
}

module.exports = {
  extractMetadata,
  extractValue,
  getRoute,
  walkDir,
  RULES,
  Reporter,
  main,
};
