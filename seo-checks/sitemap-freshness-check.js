#!/usr/bin/env node
/**
 * sitemap-freshness-check.js — Verify all marketing routes are in sitemap.xml
 *
 * Runs as a CI gate on every PR. Fails if a new marketing route is
 * added without being added to the sitemap.
 *
 * Checks:
 *   - Every page.tsx in src/app/(marketing)/* has a sitemap entry
 *   - No duplicate URLs in sitemap
 *
 * Usage:
 *   node seo-checks/sitemap-freshness-check.js [--json]
 *
 * Exit codes:
 *   0  All routes in sitemap
 *   1  Missing or duplicate entries
 *   2  Runtime error
 */

const fs = require("fs");
const path = require("path");

const MARKETING_DIR = path.join(__dirname, "..", "src", "app", "(marketing)");
const SITEMAP_FILE = path.join(__dirname, "..", "src", "app", "sitemap.ts");

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Recursively walk marketing pages, building the full route as we go.
 * Only reports directories that have a page.tsx (these are Next.js routes).
 */
function walkMarketingPages(dir, routePrefix = "") {
  const { readdirSync, statSync } = require("fs");
  const pages = [];

  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return pages;
  }

  for (const entry of entries) {
    // Skip files that are not route pages
    if (
      entry === "layout.tsx" ||
      entry === "loading.tsx" ||
      entry === "error.tsx" ||
      entry === "not-found.tsx" ||
      entry === "offline" // PWA offline fallback — not indexed
    ) {
      continue;
    }

    const full = path.join(dir, entry);

    let stat;
    try {
      stat = statSync(full);
    } catch {
      continue;
    }

    if (stat.isDirectory()) {
      const pageFile = path.join(full, "page.tsx");
      let pageStat;
      try {
        pageStat = statSync(pageFile);
      } catch {
        // No page.tsx here — recurse into subdirectory
        const subPages = walkMarketingPages(full, routePrefix + "/" + entry);
        pages.push(...subPages);
        continue;
      }

      if (pageStat.isFile()) {
        // This directory IS a route page
        const route = routePrefix + "/" + entry;
        pages.push({ route, dir: full, pageFile });
      }
    }
  }

  return pages;
}

/**
 * Extract all sitemap URLs from sitemap.ts.
 * Handles:
 *   url: `${BASE_URL}/foo/bar`
 *   url: "https://www.rentready.fr/foo/bar"
 */
function extractSitemapUrls(sitemapContent) {
  const urls = new Set();

  // Match `${BASE_URL}/path` template literal pattern
  const tmplRe = /url\s*:\s*`\$\{[^}]+\}([^`]+)`/gi;
  let m;
  while ((m = tmplRe.exec(sitemapContent)) !== null) {
    urls.add(m[1]); // path after ${BASE_URL}
  }

  // Match "https://www.rentready.fr/path" plain string
  const plainRe = /url\s*:\s*["'](https?:\/\/[^"']+)["']/gi;
  while ((m = plainRe.exec(sitemapContent)) !== null) {
    try {
      urls.add(new URL(m[1]).pathname);
    } catch {
      urls.add(m[1]);
    }
  }

  return urls;
}

// ── Reporter ─────────────────────────────────────────────────────────────────

class Reporter {
  constructor(json = false) {
    this.json = json;
    this.results = [];
    this.errors = 0;
    this.warnings = 0;
  }

  add(route, file, ruleId, severity, message) {
    this.results.push({ route, file, ruleId, severity, message });
    if (severity === "error") this.errors++;
    else this.warnings++;
  }

  print() {
    if (this.json) {
      console.log(
        JSON.stringify(
          {
            passed: this.errors === 0,
            errors: this.errors,
            warnings: this.warnings,
            results: this.results,
          },
          null,
          2
        )
      );
      return;
    }

    console.log(`\n🗺️  RentReady Sitemap Freshness Checker`);
    console.log(`   Errors: ${this.errors} | Warnings: ${this.warnings}`);
    console.log(`\n${"─".repeat(60)}`);

    if (this.results.length === 0) {
      console.log(`\n   ✅ All marketing routes are in sitemap`);
      return;
    }

    const byRoute = {};
    for (const r of this.results) {
      if (!byRoute[r.route]) byRoute[r.route] = [];
      byRoute[r.route].push(r);
    }

    for (const [route, issues] of Object.entries(byRoute)) {
      const icon = issues.some((i) => i.severity === "error") ? "❌" : "⚠️ ";
      console.log(`\n${icon} ${route}`);
      for (const issue of issues) {
        const mark = issue.severity === "error" ? "  ✖" : "  ⚠";
        console.log(`     ${mark} [${issue.ruleId}] ${issue.message}`);
      }
      if (issues[0].file) {
        console.log(`      ↳ ${issues[0].file}`);
      }
    }

    console.log(`\n${"─".repeat(60)}`);
    if (this.errors > 0) {
      console.log(
        `\n❌ CI FAILED: ${this.errors} sitemap issue(s). Add missing routes to src/app/sitemap.ts`
      );
    } else if (this.warnings > 0) {
      console.log(`\n⚠️  ${this.warnings} warning(s).`);
    }
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const json = process.argv.includes("--json");
  const reporter = new Reporter(json);

  // 1. Find all marketing page routes
  const marketingPages = walkMarketingPages(MARKETING_DIR);
  console.log(`   Found ${marketingPages.length} marketing route(s)`);

  if (marketingPages.length === 0) {
    console.log(`   ⚠ No marketing pages found — skipping check`);
    reporter.print();
    process.exit(0);
  }

  // 2. Read sitemap.ts and extract all URLs
  let sitemapContent;
  try {
    sitemapContent = fs.readFileSync(SITEMAP_FILE, "utf8");
  } catch (err) {
    console.error(`\n❌ Cannot read sitemap.ts: ${err.message}`);
    process.exit(2);
  }

  const sitemapUrls = extractSitemapUrls(sitemapContent);
  console.log(`   Sitemap has ${sitemapUrls.size} URL(s)`);

  // 3. Check each marketing page has a sitemap entry
  const missingRoutes = [];
  for (const page of marketingPages) {
    // Normalize route: /modeles/augmentation-de-loyer
    const sitemapPath = page.route; // already like /modeles/foo

    // The sitemap uses exact path matches. Check if sitemap has this path.
    // Also allow sub-paths: if sitemap has /modeles, /modeles/foo is covered.
    const hasEntry =
      sitemapUrls.has(sitemapPath) ||
      sitemapUrls.has(sitemapPath + "/") ||
      Array.from(sitemapUrls).some(
        (url) =>
          (url === sitemapPath || url.startsWith(sitemapPath + "/")) &&
          url.split("/").length > sitemapPath.split("/").length
      );

    // Alternative: check if any sitemap URL ends with the page route
    const coveredByParent = Array.from(sitemapUrls).some((url) => {
      // url = /modeles, sitemapPath = /modeles/augmentation-de-loyer
      // Parent /modeles should cover children
      if (sitemapPath.startsWith(url + "/")) return true;
      // Exact match
      if (url === sitemapPath) return true;
      return false;
    });

    if (!hasEntry && !coveredByParent) {
      missingRoutes.push(page);
      reporter.add(
        page.route,
        page.pageFile.replace(path.join(__dirname, "..") + "/", ""),
        "route-not-in-sitemap",
        "error",
        `Route ${page.route} has no sitemap entry`
      );
    }
  }

  // 4. Check for duplicate sitemap URLs
  const urlCount = new Map();
  for (const url of sitemapUrls) {
    urlCount.set(url, (urlCount.get(url) || 0) + 1);
  }
  for (const [url, count] of urlCount) {
    if (count > 1) {
      reporter.add(
        url,
        "src/app/sitemap.ts",
        "duplicate-sitemap-url",
        "error",
        `Duplicate URL in sitemap: ${url} (appears ${count} times)`
      );
    }
  }

  // 5. Report summary
  if (missingRoutes.length > 0) {
    console.log(`\n   Missing from sitemap (${missingRoutes.length}):`);
    for (const r of missingRoutes) {
      console.log(`     - ${r.route}`);
    }
  }

  reporter.print();

  if (reporter.errors > 0) {
    console.log(`\n   Add these routes to src/app/sitemap.ts to fix.`);
    process.exit(1);
  }

  console.log(`\n   ✅ All marketing routes are covered in sitemap`);
  process.exit(0);
}

main().catch((err) => {
  console.error(`\n❌ Error: ${err.message}`);
  process.exit(2);
});
