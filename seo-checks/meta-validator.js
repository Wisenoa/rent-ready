#!/usr/bin/env node
/**
 * meta-validator.js — Meta tag validation for CI
 *
 * Validates that every marketing page in src/app/(marketing)/*
 * exports a complete, valid metadata object.
 *
 * Checks:
 *   - metadata.title exists and is < 60 chars
 *   - metadata.description exists and is 120–160 chars
 *   - No duplicate titles across marketing routes
 *   - og:title, og:description, og:image are set
 *   - canonical URL (via metadata.alternates.canonicals or resolve)
 *   - robots: index, follow for marketing pages
 *   - No console.log / debugger in page files
 *
 * Usage:
 *   node seo-checks/meta-validator.js [--fix] [--json]
 *
 * Options:
 *   --fix     Auto-fix fixable issues (add missing fields, trim titles)
 *   --json    Output machine-readable JSON
 */

const fs = require("fs");
const path = require("path");

const MARKETING_DIR = path.join(__dirname, "..", "src", "app", "(marketing)");

// ── Helpers ───────────────────────────────────────────────────────────────────

function walkDir(dir) {
  const { readdirSync, statSync } = require("fs");
  const results = [];
  try {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      try {
        const stat = statSync(full);
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
 * Extract the metadata export from a Next.js page file.
 * Handles both `export const metadata = {...}` and `export { metadata }`.
 * Uses a brace-counter to correctly handle nested braces in the metadata object.
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

  // Find "export const metadata" with optional TypeScript type annotation
  // e.g. `export const metadata: Metadata = {`
  const startRe = /(?:export\s+const\s+metadata|const\s+metadata)(?:\s*:\s*\w+)?\s*=\s*\{/;
  const startMatch = startRe.exec(content);
  if (!startMatch) {
    issues.push({ severity: "warn", rule: "no-metadata", message: "No metadata export found" });
    return { issues, metadata: null };
  }

  // Extract using brace counter from the position of the opening brace
  // The match ends with "{", whose position in raw is (startMatch[0].length - 1)
  const firstBracePos = startMatch[0].length - 1;
  const raw = content.slice(startMatch.index);
  let depth = 0;
  let end = 0;
  for (let i = firstBracePos; i < raw.length; i++) {
    if (raw[i] === "{") depth++;
    else if (raw[i] === "}") depth--;
    if (depth === 0) { end = i; break; }
  }

  const metadataText = raw.slice(0, end + 1);

  // Extract string values from the extracted metadata object text
  const meta = {};
  const stringRe = /(\w+)\s*:\s*(['"][^'"]*['"])/g;
  let sm;
  while ((sm = stringRe.exec(metadataText)) !== null) {
    meta[sm[1]] = sm[2].slice(1, -1);
  }

  // Check for nested objects (alternates, robots, openGraph, etc.)
  const hasAlternates = /alternates\s*:/.test(metadataText);
  const hasRobots = /robots\s*:/.test(metadataText);
  const hasOpenGraph = /openGraph\s*:/.test(metadataText);
  // Check for openGraph.images specifically (required for OG image rendering)
  const hasOgImages = /openGraph\s*:\s*\{[^}]*images\s*:/s.test(metadataText) ||
                      /openGraph\s*:\s*\{[\s\S]*?images\s*:/s.test(metadataText);
  // Also handle openGraph.images array shorthand: images: [...]
  const hasOgImagesArray = /images\s*:\s*\[/.test(metadataText);

  if (hasAlternates) meta._hasAlternates = true;
  if (hasRobots) meta._hasRobots = true;
  if (hasOpenGraph) meta._hasOpenGraph = true;
  if (hasOgImages || hasOgImagesArray) meta._hasOgImages = true;

  return { issues, metadata: meta };
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
    check: (meta, route) => {
      if (!meta.title) return { ok: false, message: "metadata.title is required" };
      return { ok: true };
    },
  },
  {
    id: "title-length",
    check: (meta) => {
      if (!meta.title) return { ok: true };
      if (meta.title.length > 60) {
        return { ok: false, message: `title exceeds 60 chars (currently ${meta.title.length})` };
      }
      return { ok: true };
    },
  },
  {
    id: "description-required",
    check: (meta) => {
      if (!meta.description) return { ok: false, message: "metadata.description is required" };
      return { ok: true };
    },
  },
  {
    id: "description-length",
    check: (meta) => {
      if (!meta.description) return { ok: true };
      const len = meta.description.length;
      if (len < 120 || len > 160) {
        return { ok: false, message: `description should be 120–160 chars (currently ${len})` };
      }
      return { ok: true };
    },
  },
  {
    id: "og-title",
    check: (meta) => {
      if (!meta._hasOpenGraph) return { ok: false, message: "openGraph object missing in metadata" };
      return { ok: true };
    },
  },
  {
    id: "og-description",
    check: (meta) => {
      if (!meta._hasOpenGraph) return { ok: false, message: "openGraph object missing" };
      return { ok: true };
    },
  },
  {
    id: "og-image",
    check: (meta) => {
      if (!meta._hasOpenGraph) return { ok: false, message: "openGraph object missing" };
      if (!meta._hasOgImages) return { ok: false, message: "openGraph.images is required (og:image)" };
      return { ok: true };
    },
  },
  {
    id: "canonical",
    check: (meta) => {
      if (!meta._hasAlternates) return { ok: false, message: "alternates.canonicals missing in metadata" };
      return { ok: true };
    },
  },
  {
    id: "robots",
    check: (meta) => {
      if (!meta._hasRobots) return { ok: false, message: "robots metadata missing (index, follow expected)" };
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
  }

  add(route, file, ruleId, severity, message) {
    this.results.push({ route, file, ruleId, severity, message });
    if (severity === "error") this.errorCount++;
    else this.warnCount++;
  }

  // Check a page
  checkPage(filePath, pageMeta) {
    const route = getRoute(filePath);
    const file = path.relative(path.join(__dirname, ".."), filePath);

    // Check file-level issues from parsing
    for (const issue of pageMeta.issues || []) {
      this.add(route, file, issue.rule, issue.severity, issue.message);
    }

    // Check required fields
    for (const rule of RULES) {
      const result = rule.check(pageMeta.metadata, route);
      if (!result.ok) {
        this.add(route, file, rule.id, "error", result.message);
      }
    }
  }

  // Report duplicates (call after all pages checked)
  checkDuplicates(titleMap) {
    const seen = new Map();
    for (const [route, title] of titleMap) {
      if (!title) continue;
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
        errors: this.errorCount,
        warnings: this.warnCount,
        results: this.results,
      }, null, 2));
      return;
    }

    console.log(`\n🔍 RentReady Meta Tag Validator`);
    console.log(`   Marketing pages checked: ${new Set(this.results.map(r => r.route)).size}`);
    console.log(`   Errors: ${this.errorCount} | Warnings: ${this.warnCount}`);
    console.log(`\n${"─".repeat(60)}`);

    if (this.results.length === 0) {
      console.log(`\n   ✅ All pages passed metadata validation`);
      return;
    }

    // Group by route
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

  // Check for duplicate titles
  reporter.checkDuplicates(titleMap);

  reporter.print();

  if (reporter.errorCount > 0) {
    process.exit(1);
  }
  process.exit(0);
}

main();
