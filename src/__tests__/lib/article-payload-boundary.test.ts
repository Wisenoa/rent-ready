/**
 * Guards the build-heap regression.
 *
 * `src/data/articles.ts` is ~636 KB because every article embeds its full body as
 * a template literal. Any module that only needs titles/excerpts must import
 * `src/data/articles-meta.ts` (40 KB) instead. A single server component importing
 * the heavy module is enough to pull the payload into the build graph for every
 * page that renders it, which is what made `next build` die with
 * "Ineffective mark-compacts near heap limit" at ~100/135 static pages.
 *
 * Modules that legitimately need article bodies (the [slug] page) are
 * allow-listed below.
 */

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

const SRC = join(process.cwd(), "src");

/** Files permitted to import the heavy article module. */
const ALLOWED = new Set([
  // Renders a single article body.
  "app/(marketing)/blog/[slug]/page.tsx",
  // The data module and the metadata generator must read it.
  "data/articles.ts",
]);

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(entry) && !full.includes("__tests__")) out.push(full);
  }
  return out;
}

describe("article payload boundaries", () => {
  const offenders: string[] = [];

  for (const file of walk(SRC)) {
    const source = readFileSync(file, "utf8");
    const importsHeavy =
      source.includes('from "@/data/articles"') ||
      source.includes('require("../data/articles")') ||
      source.includes("require('@/data/articles')");

    if (!importsHeavy) continue;
    const rel = relative(SRC, file);
    if (!ALLOWED.has(rel)) offenders.push(rel);
  }

  it("only allow-listed modules import the full article bodies", () => {
    expect(
      offenders,
      `these modules import @/data/articles but appear to need metadata only — ` +
        `switch them to @/data/articles-meta: ${offenders.join(", ")}`
    ).toEqual([]);
  });

  it("the metadata module stays far smaller than the article module", () => {
    const heavy = readFileSync(join(SRC, "data/articles.ts"), "utf8").length;
    const meta = readFileSync(join(SRC, "data/articles-meta.ts"), "utf8").length;
    expect(meta).toBeLessThan(heavy / 5);
  });

  it("metadata stays in sync with the articles", async () => {
    const { articles } = await import("@/data/articles");
    const { articleMeta } = await import("@/data/articles-meta");
    expect(articleMeta).toHaveLength(articles.length);
    for (const a of articles) {
      const m = articleMeta.find((x) => x.slug === a.slug);
      expect(m, `missing metadata for ${a.slug}`).toBeDefined();
      expect(m!.title).toBe(a.title);
      expect(m!.readTime).toBe(a.readTime);
    }
  });
});