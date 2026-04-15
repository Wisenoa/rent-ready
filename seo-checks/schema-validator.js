#!/usr/bin/env node
/**
 * schema-validator.js — JSON-LD structured data validation for CI
 *
 * Validates that all JSON-LD scripts in marketing pages are valid,
 * well-formed, and include required properties per schema type.
 *
 * Supported types for this project:
 *   - SoftwareApplication (features/pricing pages)
 *   - WebApplication (homepage)
 *   - Organization (footer/global)
 *   - FAQPage (glossary, help pages)
 *   - BreadcrumbList (all pages)
 *
 * Usage:
 *   node seo-checks/schema-validator.js [--fix] [--json]
 *
 * Exit codes:
 *   0  All schemas valid
 *   1  Validation errors found
 *   2  Runtime error
 */

const fs = require("fs");
const path = require("path");

const MARKETING_DIR = path.join(__dirname, "..", "src", "app", "(marketing)");
const SEO_DIR = path.join(__dirname, "..", "src", "app");

// ── Helpers ─────────────────────────────────────────────────────────────────────

function walkDir(dir, extensions = /\.(tsx|jsx|ts|js)$/) {
  const { readdirSync, statSync } = require("fs");
  const results = [];
  try {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      try {
        const stat = statSync(full);
        if (stat.isDirectory()) {
          results.push(...walkDir(full, extensions));
        } else if (stat.isFile() && extensions.test(entry)) {
          results.push(full);
        }
      } catch {}
    }
  } catch {}
  return results;
}

/**
 * Extract all JSON-LD script blocks from HTML/TSX content.
 */
function extractJsonLd(content) {
  const blocks = [];
  // Match <script type="application/ld+json">...</script>
  const re = /<script\s[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script\s*>/gi;
  let m;
  while ((m = re.exec(content)) !== null) {
    blocks.push(m[1].trim());
  }
  return blocks;
}

/**
 * Parse JSON safely — returns null on failure.
 */
function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// ── Schema type definitions ────────────────────────────────────────────────────

/**
 * Required fields per @type. Also tracks recommended fields.
 */
const SCHEMA_REQUIREMENTS = {
  SoftwareApplication: {
    required: ["@type", "name", "applicationCategory", "operatingSystem", "offers"],
    recommended: ["description", "url", "screenshot", "aggregateRating"],
    atLeastOneOf: [["description", "offers"]],
  },
  WebApplication: {
    required: ["@type", "name", "applicationCategory", "offers"],
    recommended: ["description", "url"],
    atLeastOneOf: [["description", "offers"]],
  },
  Organization: {
    required: ["@type", "name"],
    recommended: ["url", "logo", "sameAs", "contactPoint"],
    atLeastOneOf: [["description", "url"]],
  },
  FAQPage: {
    required: ["@type", "mainEntity"],
    recommended: [],
    atLeastOneOf: [],
    nested: { mainEntity: { required: ["@type", "name", "acceptedAnswer"], recommended: [] } },
  },
  BreadcrumbList: {
    required: ["@type", "itemListElement"],
    recommended: [],
    atLeastOneOf: [],
    nested: { itemListElement: { required: ["@type", "name", "position"], recommended: ["item"] } },
  },
  WebPage: {
    required: ["@type", "name"],
    recommended: ["description", "url"],
    atLeastOneOf: [],
  },
  ItemList: {
    required: ["@type", "itemListElement"],
    recommended: ["name"],
    atLeastOneOf: [],
  },
  Product: {
    required: ["@type", "name", "offers"],
    recommended: ["description", "image", "brand", "sku"],
    atLeastOneOf: [["description"]],
  },
  Offer: {
    required: ["@type", "price", "priceCurrency"],
    recommended: ["priceValidUntil", "availability"],
    atLeastOneOf: [],
  },
  Person: {
    required: ["@type", "name"],
    recommended: ["jobTitle", "worksFor", "url"],
    atLeastOneOf: [["jobTitle", "url"]],
  },
};

/**
 * Check that a parsed object has all required properties.
 */
function validateSchema(schema, route, file, reporter) {
  const type = schema["@type"];
  if (!type) {
    reporter.add(route, file, "missing-type", "error", "JSON-LD object missing @type");
    return;
  }

  const reqs = SCHEMA_REQUIREMENTS[type];
  if (!reqs) {
    reporter.add(route, file, "unknown-type", "warn", `Unknown @type "${type}" — not in validated types`);
    return;
  }

  // Required fields
  for (const field of reqs.required || []) {
    if (!(field in schema) || schema[field] === "" || schema[field] === null) {
      reporter.add(route, file, "missing-required-field", "error",
        `[@type:${type}] Missing required field "${field}"`);
    }
  }

  // atLeastOneOf: at least one of the grouped fields must be present
  for (const group of reqs.atLeastOneOf || []) {
    const hasOne = group.some((f) => f in schema && schema[f] !== "" && schema[f] !== null);
    if (!hasOne) {
      reporter.add(route, file, "at-least-one-required", "error",
        `[@type:${type}] Must have at least one of: ${group.join(", ")}`);
    }
  }

  // Check nested structures (ItemList elements, FAQ mainEntity, etc.)
  if (reqs.nested) {
    for (const [nestedField, nestedReqs] of Object.entries(reqs.nested)) {
      const nested = schema[nestedField];
      if (!nested) continue;

      const items = Array.isArray(nested) ? nested : [nested];
      for (const item of items) {
        for (const field of nestedReqs.required || []) {
          if (!(field in item) || item[field] === "" || item[field] === null) {
            reporter.add(route, file, "missing-nested-field", "error",
              `[@type:${type}.${nestedField}] Missing "${field}" in ${Array.isArray(nested) ? "item" : "object"}`);
          }
        }
      }
    }
  }

  // Check Offer inside SoftwareApplication (inline offers)
  const offers = schema.offers;
  if (offers) {
    const offerItems = Array.isArray(offers) ? offers : [offers];
    for (const offer of offerItems) {
      if (typeof offer === "object" && offer !== null) {
        for (const field of (SCHEMA_REQUIREMENTS.Offer?.required || [])) {
          if (!(field in offer) || offer[field] === "" || offer[field] === null) {
            reporter.add(route, file, "missing-offer-field", "error",
              `[@type:${type}.offers] Missing "${field}"`);
          }
        }
      }
    }
  }
}

// ── Reporter ───────────────────────────────────────────────────────────────────

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
      console.log(JSON.stringify({
        passed: this.errors === 0,
        errors: this.errors,
        warnings: this.warnings,
        results: this.results,
      }, null, 2));
      return;
    }

    console.log(`\n📋 RentReady JSON-LD Schema Validator`);
    console.log(`   Errors: ${this.errors} | Warnings: ${this.warnings}`);
    console.log(`\n${"─".repeat(60)}`);

    if (this.results.length === 0) {
      console.log(`\n   ✅ No structured data issues found`);
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
        console.log(`     ${mark} [${issue.ruleId}] ${issue.message}`);
      }
      console.log(`      ↳ ${issues[0].file}`);
    }

    console.log(`\n${"─".repeat(60)}`);
    if (this.errors > 0) {
      console.log(`\n❌ CI FAILED: ${this.errors} schema error(s).`);
    } else if (this.warnings > 0) {
      console.log(`\n⚠️  ${this.warnings} warning(s).`);
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────────

function main() {
  const json = process.argv.includes("--json");
  const reporter = new Reporter(json);

  // Scan marketing pages + SEO docs directory for JSON-LD
  const marketingFiles = walkDir(MARKETING_DIR);
  const seoFiles = walkDir(SEO_DIR, /\.tsx?$/).filter(
    (f) => !f.includes("node_modules") && !f.includes(".next")
  );

  const files = [...marketingFiles, ...seoFiles].slice(0, 100); // safety cap

  console.log(`\n📋 Scanning ${files.length} files for JSON-LD...`);

  for (const file of files) {
    let content;
    try {
      content = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }

    const blocks = extractJsonLd(content);
    if (blocks.length === 0) continue;

    const route = file
      .replace(path.join(__dirname, ".."), "")
      .replace(/\\/g, "/");
    const fileDisplay = path.relative(path.join(__dirname, ".."), file);

    for (const block of blocks) {
      const parsed = parseJson(block);
      if (!parsed) {
        reporter.add(route, fileDisplay, "invalid-json", "error", `Invalid JSON: ${block.slice(0, 80)}...`);
        continue;
      }

      // Handle @graph arrays
      const items = parsed["@graph"] ? parsed["@graph"] : [parsed];
      for (const item of items) {
        if (typeof item !== "object" || item === null) continue;
        validateSchema(item, route, fileDisplay, reporter);
      }
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
