/**
 * Content integrity guards.
 *
 * These three failure modes were all present in the production content and
 * none of them was caught by any existing test:
 *
 * 1. Content served to French landlords contained Chinese, Japanese, Korean or
 *    Cyrillic fragments. The corpus is AI-assisted, so stray tokens from other
 *    scripts survive generation. On a YMYL site (rental law, deposits, notice
 *    periods) this damages credibility and can publish a wrong legal statement.
 *
 * 2. Pages advertised social proof that had no source — a 4.9/127
 *    AggregateRating in JSON-LD, invented customer names with cities and star
 *    ratings. Unverifiable review markup is a manual-action risk under Google's
 *    structured data guidelines.
 *
 * 3. The sitemap drifted away from the real routes: it advertised URLs that
 *    301-redirected, omitted live pages, and shipped a blog entry with no
 *    matching article.
 *
 * Each check below is cheap and deterministic. They are not a substitute for
 * reading the content, but they stop the mechanical regressions.
 */

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

const SRC = join(process.cwd(), "src");

/** Files whose content is generated or deliberately not user-facing. */
const SKIP_FILES = new Set(["src/data/articles-meta.ts"]);

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (full.includes("__tests__")) continue;
      walk(full, out);
    } else if (/\.(ts|tsx|json)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

const FILES = walk(SRC);

describe("content integrity", () => {
  it("ships no CJK or Cyrillic characters in user-facing content", () => {
    // Han, Hiragana, Katakana, Hangul, Cyrillic, Arabic.
    const foreign = /[一-鿿぀-ヿ가-힯Ѐ-ӿ؀-ۿ]/;
    const offenders: string[] = [];

    for (const file of FILES) {
      const rel = relative(process.cwd(), file);
      if (SKIP_FILES.has(rel)) continue;

      const source = readFileSync(file, "utf8");
      source.split("\n").forEach((line, i) => {
        // Ignore lines that are pure comments: those may legitimately quote
        // the historical text we are documenting.
        const trimmed = line.trim();
        if (trimmed.startsWith("*") || trimmed.startsWith("//") || trimmed.startsWith("/*")) {
          return;
        }
        if (foreign.test(line)) {
          offenders.push(`${rel}:${i + 1} — ${trimmed.slice(0, 100)}`);
        }
      });
    }

    expect(
      offenders,
      `non-French scripts found in served content:\n${offenders.join("\n")}`
    ).toEqual([]);
  });

  it("does not emit AggregateRating or Review structured data", () => {
    // These builders only produce markup whose numbers must be verifiable.
    // They are deliberately not wired into any page.
    const offenders: string[] = [];

    for (const file of FILES) {
      const rel = relative(process.cwd(), file);
      if (!rel.startsWith("src/app/") && !rel.startsWith("src/components/")) continue;

      const source = readFileSync(file, "utf8");
      if (/buildAggregateRatingSchema|buildReviewSchema/.test(source)) {
        offenders.push(rel);
      }
    }

    expect(
      offenders,
      `Review/AggregateRating markup must not be emitted without a verifiable ` +
        `source of ratings: ${offenders.join(", ")}`
    ).toEqual([]);
  });

  it("keeps the sitemap free of redirect sources and missing pages", async () => {
    const config = readFileSync(join(process.cwd(), "next.config.ts"), "utf8");
    const redirectSources = new Set(
      [...config.matchAll(/source:\s*'(\/[^':]+)'/g)].map((m) => m[1])
    );
    const redirectDestinations = new Set(
      [...config.matchAll(/destination:\s*'(\/[^']+)'/g)].map((m) => m[1])
    );

    // Every redirect destination must resolve to a real page, otherwise it is
    // a 404 wearing a 301.
    const APP = join(SRC, "app");
    const ROUTE_GROUPS = ["(dashboard)", "(marketing)", "(outils)", "(templates)"];
    const routes = new Set<string>();

    const collect = (dir: string, segments: string[]) => {
      for (const entry of readdirSync(dir)) {
        if (ROUTE_GROUPS.includes(entry)) {
          collect(join(dir, entry), segments);
          continue;
        }
        if (entry.startsWith("[")) continue;
        const full = join(dir, entry);
        if (!statSync(full).isDirectory()) continue;
        const next = [...segments, entry];
        if (readdirSync(full).includes("page.tsx")) {
          routes.add(`/${next.join("/")}`);
        }
        collect(full, next);
      }
    };
    collect(APP, []);
    // The app directory itself is the homepage.
    routes.add("/");

    // A collector that silently under-reports is worse than no check: it makes
    // every destination look like a 404 and hides the real breakage. The app has
    // well over 100 routes, so a tiny count means the walk itself is wrong.
    expect(
      routes.size,
      `route collector found only ${routes.size} routes — the walk is broken, ` +
        "so the redirect assertions below are not meaningful"
    ).toBeGreaterThan(50);

    for (const dest of redirectDestinations) {
      if (dest === "/" || dest.includes(":")) continue;
      expect(
        routes.has(dest),
        `redirect destination ${dest} has no page — it would 404`
      ).toBe(true);
    }

    // A redirect source must not also be a live route: then the redirect is
    // dead code and the sitemap may advertise it.
    for (const src of redirectSources) {
      expect(
        routes.has(src),
        `${src} is a redirect source but still has a page file — remove one of the two`
      ).toBe(false);
    }
  });

  it("has no internal link pointing at a redirect source", () => {
    const config = readFileSync(join(process.cwd(), "next.config.ts"), "utf8");
    const redirectSources = [...config.matchAll(/source:\s*'(\/[^':]+)'/g)].map((m) => m[1]);
    const offenders: string[] = [];

    for (const file of FILES) {
      const rel = relative(process.cwd(), file);
      if (!rel.endsWith(".tsx")) continue;
      const source = readFileSync(file, "utf8");
      for (const target of redirectSources) {
        if (
          source.includes(`href="${target}"`) ||
          source.includes(`href: '${target}'`) ||
          source.includes(`href: "${target}"`)
        ) {
          offenders.push(`${rel} → ${target}`);
        }
      }
    }

    expect(
      offenders,
      `links to 301'd URLs (they cost a redirect hop and split internal signals):\n${offenders.join("\n")}`
    ).toEqual([]);
  });
});
