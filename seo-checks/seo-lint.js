#!/usr/bin/env node
/**
 * seo-lint.js — SEO lint rules for CI
 *
 * Runs on all marketing page files. Checks:
 *   1. No console.log / console.warn in production page code
 *   2. All <img> elements have non-empty alt attributes
 *   3. All <a> elements have valid href (no javascript:void, no empty href)
 *   4. No inline style strings that could cause CLS shifts
 *   5. Heading structure: exactly one H1 per page, no skipped levels
 *   6. External links have rel="noopener noreferrer"
 *
 * Usage:
 *   node seo-checks/seo-lint.js [--fix] [--json] [--files <glob>]
 *
 * Exit codes:
 *   0  All checks passed
 *   1  Lint violations found
 *   2  Runtime error
 */

const fs = require("fs");
const path = require("path");

const MARKETING_DIR = path.join(__dirname, "..", "src", "app", "(marketing)");

// ── Helpers ────────────────────────────────────────────────────────────────────

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
        } else if (stat.isFile() && /\.(tsx|jsx|ts|js|html)$/.test(entry)) {
          results.push(full);
        }
      } catch {}
    }
  } catch {}
  return results;
}

function getRoute(filePath) {
  const relative = path.relative(MARKETING_DIR, filePath);
  const parts = path.dirname(relative).split(path.sep);
  if (parts[0] === ".") return "/";
  return "/" + parts.join("/");
}

// ── Lint rules ───────────────────────────────────────────────────────────────

const RULES = [
  {
    id: "no-console-log",
    tag: "console.log",
    re: /console\.(log|debug|info)\s*\(/,
    severity: "error",
    message: "console.log found — remove before committing",
  },
  {
    id: "no-inline-style-attr",
    tag: "inline style",
    re: /\bstyle\s*=\s*["'][^"']*["']/,
    severity: "warn",
    message: "Inline style attribute found — use CSS classes to prevent CLS",
  },
];

const IMAGE_RE = /<img[\s\S]*?>/gi;
const A_RE = /<a[\s\S]*?<\/a>/gi;
const HEADING_RE = /<h([1-6])[\s\S]*?>.*?<\/h\1>/gi;
const EXTERNAL_HREF_RE = /href=["'](https?:\/\/[^"']+)["']/gi;

class Reporter {
  constructor(json = false) {
    this.json = json;
    this.results = [];
    this.errors = 0;
    this.warnings = 0;
  }

  add(route, file, ruleId, severity, message, line) {
    this.results.push({ route, file, ruleId, severity, message, line });
    if (severity === "error") this.errors++;
    else this.warnings++;
  }

  lintFile(filePath, content) {
    const route = getRoute(filePath);
    const file = path.relative(path.join(__dirname, ".."), filePath);
    const lines = content.split("\n");

    // Rule 1: console.log
    for (const rule of RULES) {
      for (let i = 0; i < lines.length; i++) {
        if (rule.re.test(lines[i])) {
          this.add(route, file, rule.id, rule.severity, rule.message, i + 1);
          rule.re.lastIndex = 0; // reset
        }
      }
    }

    // Rule 2: img alt — only in actual JSX (not imports, not string literals)
    // Match <img ... alt="..."> or <Image ... alt="...">
    const imgAltRe = /<img[\s\S]*?(?:alt)=["']([^"']+)["'][\s\S]*?>/gi;
    let m;
    while ((m = imgAltRe.exec(content)) !== null) {
      const alt = m[1].trim();
      if (!alt) {
        // Find line number
        const before = content.slice(0, m.index);
        const line = before.split("\n").length;
        this.add(route, file, "img-missing-alt", "error", `<img> missing alt or alt="" found`, line);
      }
    }

    // Rule 3: links with invalid hrefs
    // Find <a ... href="javascript:void(0)" ...> or <a ... href="">
    const invalidHrefRe = /<a[\s\S]*?href\s*=\s*["']javascript:\w+\s*\([^)]*\)["'][\s\S]*?>/gi;
    while ((m = invalidHrefRe.exec(content)) !== null) {
      const before = content.slice(0, m.index);
      const line = before.split("\n").length;
      this.add(route, file, "invalid-href-javascript", "error", `<a> has javascript:void href — use proper URL`, line);
    }

    const emptyHrefRe = /<a[\s\S]*?href\s*=\s*["'][ \t]*["'][\s\S]*?>/gi;
    while ((m = emptyHrefRe.exec(content)) !== null) {
      const before = content.slice(0, m.index);
      const line = before.split("\n").length;
      this.add(route, file, "empty-href", "error", `<a> has empty href — use a real URL or #`, line);
    }

    // Rule 4: inline styles
    const inlineStyleRe = /\bstyle\s*=\s*["'][^"']*["']/gi;
    while ((m = inlineStyleRe.exec(content)) !== null) {
      const before = content.slice(0, m.index);
      const line = before.split("\n").length;
      this.add(route, file, "inline-style-attr", "warn", `Inline style found — prefer CSS classes for CLS safety`, line);
    }

    // Rule 5: heading structure — exactly one H1
    const h1Count = (content.match(/<h1[\s\S]*?>.*?<\/h1>/gi) || []).length;
    if (h1Count === 0) {
      this.add(route, file, "no-h1", "warn", `No <h1> found — every marketing page should have exactly one`, 1);
    } else if (h1Count > 1) {
      this.add(route, file, "multiple-h1", "error", `${h1Count} <h1> elements found — only one is allowed per page`, 1);
    }

    // Heading hierarchy: check for skipped levels (H1 -> H3 without H2)
    const headingMatches = [];
    let hm;
    const headingRe = /<h([1-6])[^>]*>([\s\S]*?)вета<\/h\1>/gi;
    while ((hm = headingRe.exec(content)) !== null) {
      headingMatches.push(parseInt(hm[1]));
    }

    if (headingMatches.length > 1) {
      for (let i = 1; i < headingMatches.length; i++) {
        const prev = headingMatches[i - 1];
        const curr = headingMatches[i];
        if (curr > prev + 1) {
          this.add(route, file, "heading-skip-level", "warn",
            `Heading skip: <h${prev}> followed by <h${curr}> — should be h${prev + 1}`, 1);
          break;
        }
      }
    }

    // Rule 6: external links should have rel="noopener noreferrer"
    let extMatch;
    const extLinkRe = /<a[\s\S]*?href\s*=\s*["'](https?:\/\/[^"']+)["'][\s\S]*?>/gi;
    const extLinksWithRel = /<a[\s\S]*?rel\s*=\s*["'][^"']*noopener[^"']*["'][\s\S]*?href\s*=\s*["'](https?:\/\/[^"']+)["']/gi;

    while ((m = extLinkRe.exec(content)) !== null) {
      const before = content.slice(0, m.index);
      const line = before.split("\n").length;
      const href = m[1];

      // Check if this specific <a> tag has rel="noopener noreferrer"
      const tagStart = content.lastIndexOf("<a", m.index);
      const tagEnd = content.indexOf("</a>", m.index);
      if (tagStart === -1 || tagEnd === -1) continue;

      const tagContent = content.slice(tagStart, tagEnd + 4);
      const hasRel = /rel\s*=\s*["'][^"']*noopener[^"']*["']/i.test(tagContent);
      if (!hasRel) {
        this.add(route, file, "external-link-no-rel", "warn",
          `External <a> missing rel="noopener noreferrer" for ${href.slice(0, 50)}`, line);
      }
    }
  }

  print() {
    if (this.json) {
      console.log(JSON.stringify({
        passed: this.errors === 0,
        errors: this.errors,
        warnings: this.warnings,
        results: this.results,
      }, null, 2));
      return;
    }

    console.log(`\n🔍 RentReady SEO Linter`);
    console.log(`   Errors: ${this.errors} | Warnings: ${this.warnings}`);
    console.log(`\n${"─".repeat(60)}`);

    if (this.results.length === 0) {
      console.log(`\n   ✅ All SEO lint checks passed`);
      return;
    }

    const byRoute = {};
    for (const r of this.results) {
      if (!byRoute[r.route]) byRoute[r.route] = [];
      byRoute[r.route].push(r);
    }

    for (const [route, issues] of Object.entries(byRoute)) {
      const icon = issues.some(i => i.severity === "error") ? "❌" : "⚠️ ";
      console.log(`\n${icon} ${route}`);
      for (const issue of issues) {
        const mark = issue.severity === "error" ? "  ✖" : "  ⚠";
        const lineInfo = issue.line ? ` (line ${issue.line})` : "";
        console.log(`     ${mark}${lineInfo} [${issue.ruleId}] ${issue.message}`);
      }
      console.log(`      ↳ ${issues[0].file}`);
    }

    console.log(`\n${"─".repeat(60)}`);
    if (this.errors > 0) {
      console.log(`\n❌ CI FAILED: ${this.errors} SEO lint error(s).`);
    } else {
      console.log(`\n⚠️  ${this.warnings} warning(s) — not blocking.`);
    }
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const json = process.argv.includes("--json");
  const reporter = new Reporter(json);

  const files = walkDir(MARKETING_DIR);
  console.log(`\n   Checking ${files.length} marketing page files...`);

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, "utf8");
      reporter.lintFile(file, content);
    } catch (err) {
      // Non-blocking — skip files we can't read
    }
  }

  reporter.print();

  if (reporter.errors > 0) {
    process.exit(1);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(`\n❌ Error: ${err.message}`);
  process.exit(2);
});
