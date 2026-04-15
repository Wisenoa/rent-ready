#!/usr/bin/env node
/**
 * link-checker.js — Broken link detection for CI
 *
 * Usage:
 *   node seo-checks/link-checker.js [--only-changed] [--base-url=<url>]
 *
 * Options:
 *   --only-changed    Only check links in files changed by the PR (git diff)
 *   --base-url        Base URL for internal links (default: http://localhost:3000)
 *   --cache-file      Path to cache file for known-good external links
 *   --fail-on-internal  Exit non-zero if any broken internal link found
 *
 * Exit codes:
 *   0  All links OK
 *   1  Broken internal links found (or --fail-on-internal)
 *   2  Configuration / runtime error
 */

const { URL } = require("url");
const { readFileSync, existsSync } = require("fs");
const { execSync } = require("child_process");
const path = require("path");

// ── CLI argument parsing ──────────────────────────────────────────────────────

const args = process.argv.slice(2);
const onlyChanged = args.includes("--only-changed");
const failOnInternal = args.includes("--fail-on-internal");

let baseUrl = "http://localhost:3000";
let cacheFile = path.join(__dirname, ".link-checker-cache.json");

for (const arg of args) {
  if (arg.startsWith("--base-url=")) baseUrl = arg.slice("--base-url=".length);
  if (arg.startsWith("--cache-file=")) cacheFile = arg.slice("--cache-file=".length);
}

// ── Link extraction helpers ─────────────────────────────────────────────────────

/**
 * Extract all href values from an HTML string.
 */
function extractLinks(html) {
  const links = new Set();
  // Match href="..." and href='...'
  const hrefRe = /href=["']([^"']+)["']/gi;
  let m;
  while ((m = hrefRe.exec(html)) !== null) {
    links.add(m[1]);
  }
  return links;
}

/**
 * Classify a URL as internal, external, or anchor-only.
 */
function classifyUrl(href, base) {
  // Strip hash
  const clean = href.split("#")[0];
  if (!clean) return { type: "anchor", href };

  try {
    const parsed = new URL(clean, base);
    if (parsed.origin === new URL(base).origin) {
      return { type: "internal", href: parsed.pathname + parsed.search };
    }
    return { type: "external", href: clean };
  } catch {
    return { type: "unknown", href: clean };
  }
}

/**
 * Check a single URL via HTTP HEAD (follows redirects).
 */
async function checkUrl(url, timeout = 10_000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "RentReady-LinkChecker/1.0" },
    });
    clearTimeout(timeoutId);
    return { ok: res.ok, status: res.status, url };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      return { ok: false, status: 0, url, error: "TIMEOUT" };
    }
    return { ok: false, status: 0, url, error: err.code || err.message };
  }
}

/**
 * Get the list of marketing page files that were changed in this PR.
 */
function getChangedMarketingFiles() {
  try {
    // Get list of files changed vs master/main
    const baseBranch = execSync("git origin/master..HEAD --name-only 2>/dev/null", {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    const changedFiles = baseBranch.trim().split("\n").filter(Boolean);

    // Filter to marketing pages (src/app/(marketing)/*)
    return changedFiles.filter((f) =>
      f.startsWith("src/app/(marketing)/") ||
      f.startsWith("src/app/(marketing)/")
    );
  } catch {
    // Fall back to all marketing files if git diff fails
    return getAllMarketingFiles();
  }
}

/**
 * Recursively get all HTML/TSX files in the marketing directory.
 */
function getAllMarketingFiles() {
  const { walkSync } = require("fs");
  const files = [];
  const marketingDir = path.join(__dirname, "..", "src", "app", "(marketing)");

  if (!existsSync(marketingDir)) return [];

  for (const entry of walkSync(marketingDir)) {
    if (entry.isFile() && /\.(html|tsx?|jsx?)$/.test(entry.name)) {
      files.push(entry.path);
    }
  }
  return files;
}

/**
 * Simple recursive walk for ESM-free Node
 */
function walkDir(dir, extensions) {
  const { readdirSync, statSync } = require("fs");
  const results = [];
  try {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      try {
        const stat = statSync(full);
        if (stat.isDirectory()) {
          results.push(...walkDir(full, extensions));
        } else if (stat.isFile() && extensions.test(full)) {
          results.push(full);
        }
      } catch {}
    }
  } catch {}
  return results;
}

// ── Cache management ───────────────────────────────────────────────────────────

function loadCache() {
  try {
    if (existsSync(cacheFile)) {
      return JSON.parse(readFileSync(cacheFile, "utf8"));
    }
  } catch {}
  return {};
}

function saveCache(cache) {
  try {
    const { writeFileSync } = require("fs");
    writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
  } catch {}
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  const base = baseUrl.replace(/\/$/, "");
  console.log(`\n🔗 RentReady Link Checker`);
  console.log(`   Base URL: ${base}`);
  console.log(`   Mode: ${onlyChanged ? "changed files only" : "all marketing pages"}\n`);

  // Collect marketing HTML files
  let marketingFiles;
  if (onlyChanged) {
    marketingFiles = getChangedMarketingFiles();
    console.log(`   Changed marketing files: ${marketingFiles.length}`);
  } else {
    marketingFiles = walkDir(
      path.join(__dirname, "..", "src", "app", "(marketing)"),
      /\.(tsx|jsx|ts|js|html)$/
    );
    console.log(`   Marketing pages found: ${marketingFiles.length}`);
  }

  if (marketingFiles.length === 0) {
    console.log("   ✅ No marketing files to check");
    process.exit(0);
  }

  // Also check sitemap.xml and robots.txt
  const extraFiles = [path.join(__dirname, "..", "src", "app", "sitemap.ts")];
  const allFiles = [...marketingFiles, ...extraFiles.filter(existsSync)];

  // Extract all links
  const internalLinks = new Map(); // path -> Set of hrefs
  const externalLinks = new Set();

  for (const file of allFiles) {
    try {
      let content = readFileSync(file, "utf8");

      // For Next.js page files (tsx/jsx), try to also check linked pages
      // Skip JSX content (complex), focus on actual HTML output
      if (/\.(tsx|jsx|ts|js)$/.test(file)) {
        // For source files, extract href values but skip JSX interpolation
        const hrefRe = /href=["']([^"']+)["']/g;
        let m;
        while ((m = hrefRe.exec(content)) !== null) {
          const href = m[1];
          if (!href.startsWith("/") && !href.startsWith(".")) continue;
          const { type, href: cleaned } = classifyUrl(href, `${base}/`);
          if (type === "internal") {
            if (!internalLinks.has(file)) internalLinks.set(file, new Set());
            internalLinks.get(file).add(cleaned);
          } else if (type === "external") {
            externalLinks.add(href);
          }
        }
      } else {
        // HTML files — full link extraction
        for (const href of extractLinks(content)) {
          const { type, href: cleaned } = classifyUrl(href, `${base}/`);
          if (type === "internal") {
            if (!internalLinks.has(file)) internalLinks.set(file, new Set());
            internalLinks.get(file).add(cleaned);
          } else if (type === "external") {
            externalLinks.add(href);
          }
        }
      }
    } catch (err) {
      console.warn(`   ⚠ Could not read ${file}: ${err.message}`);
    }
  }

  console.log(`   Internal paths to check: ${internalLinks.size}`);
  console.log(`   External links to check: ${externalLinks.size}`);

  // Check internal links
  const internalResults = [];
  let brokenInternal = 0;

  for (const [file, hrefs] of internalLinks) {
    for (const href of hrefs) {
      const fullUrl = `${base}${href}`;
      const result = await checkUrl(fullUrl, 10_000);
      if (!result.ok) {
        brokenInternal++;
        internalResults.push({
          file: file.replace(path.join(__dirname, "..") + "/", ""),
          href,
          url: fullUrl,
          status: result.status,
          error: result.error,
        });
      }
    }
  }

  // Check a sample of external links (don't want to hammer external sites in CI)
  // Cache helps: if we checked it recently and it was OK, skip it
  const cache = loadCache();
  const now = Date.now();
  const EXTERNAL_CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days
  const sampleExternal = Array.from(externalLinks).slice(0, 20); // limit to 20 in CI

  let externalWarnings = 0;
  for (const href of sampleExternal) {
    const cached = cache[href];
    if (cached && now - cached.time < EXTERNAL_CACHE_TTL) {
      if (!cached.ok) externalWarnings++;
      continue; // Use cached result
    }

    const result = await checkUrl(href, 10_000);
    cache[href] = { ok: result.ok, status: result.status, time: now };

    if (!result.ok) {
      externalWarnings++;
      console.log(`   ⚠ External broken (cached): ${href} → ${result.status || result.error}`);
    }
  }

  saveCache(cache);

  // Report
  console.log(`\n${"─".repeat(60)}`);
  console.log(`\n📊 Results:`);
  console.log(`   Broken internal links: ${brokenInternal}`);
  console.log(`   External link warnings: ${externalWarnings}`);

  if (brokenInternal > 0) {
    console.log(`\n❌ Broken internal links:`);
    for (const r of internalResults) {
      console.log(`   ${r.href}`);
      console.log(`     → ${r.status} ${r.error || ""} (${r.file})`);
    }
    console.log(`\n   Fix or add to next.config.ts redirects.`);
  }

  if (externalWarnings > 0) {
    console.log(`\n⚠️  Some external links have warnings (see above).`);
  }

  if (brokenInternal === 0) {
    console.log(`\n   ✅ All internal links are valid`);
  }

  // Exit code
  if (brokenInternal > 0) {
    console.log(`\n❌ CI FAILED: ${brokenInternal} broken internal link(s) found.`);
    process.exit(1);
  }

  if (externalWarnings > 0 && failOnInternal) {
    console.log(`\n❌ CI FAILED: external link warnings present.`);
    process.exit(1);
  }

  console.log(`\n✅ Link check passed.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(`\n❌ Error running link checker: ${err.message}`);
  process.exit(2);
});
