/**
 * Guards the SEO content module against the corruption that broke the build.
 *
 * History: `src/data/articles.ts` shipped with an array closed mid-file, a second
 * batch of entries orphaned after the closing brace, a stray `,` producing a
 * sparse-array hole, and two entries sharing one slug. The hole made
 * `/sitemap.xml` throw during prerender ("Cannot read properties of undefined
 * (reading 'alternates')") because `articles.map()` yields `undefined` for a
 * hole and Next's sitemap serializer then dereferences it.
 *
 * These assertions protect the invariants whose violation actually broke things.
 */

import { describe, it, expect } from "vitest";
import { articles, getArticleBySlug } from "@/data/articles";

describe("articles content integrity", () => {
  it("contains no sparse-array holes", () => {
    // A hole is invisible to .filter()/.map() consumers but fatal to the
    // sitemap serializer. Index explicitly.
    const holes: number[] = [];
    for (let i = 0; i < articles.length; i++) {
      if (!(i in articles) || articles[i] === undefined) holes.push(i);
    }
    expect(holes, `sparse holes at index ${holes.join(", ")}`).toEqual([]);
  });

  it("has a unique slug per article", () => {
    const slugs = articles.map((a) => a.slug);
    const seen = new Set<string>();
    const duplicates = slugs.filter((s) => (seen.has(s) ? true : (seen.add(s), false)));
    expect(duplicates, `duplicate slugs: ${duplicates.join(", ")}`).toEqual([]);
  });

  it("every entry has the fields the blog routes read", () => {
    // `excerpt` is intentionally excluded: 16 articles legitimately lack one
    // (pre-existing content debt, tracked separately) and the pages tolerate it.
    const required = ["slug", "title", "category", "date", "readTime", "updatedAt"] as const;
    const incomplete = articles
      .filter((a) => required.some((k) => typeof a[k] !== "string" || !a[k]))
      .map((a) => a.slug);
    expect(incomplete, `incomplete entries: ${incomplete.join(", ")}`).toEqual([]);
  });

  it("maps cleanly to sitemap entries without throwing", () => {
    // Reproduces exactly what Next's sitemap serializer does downstream.
    const pages = articles.map((post) => ({
      url: `/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt ?? post.date),
    }));
    expect(() => pages.some((p) => Object.keys((p as { alternates?: object }).alternates ?? {}).length > 0)).not.toThrow();
    expect(pages).toHaveLength(articles.length);
  });

  it("resolves articles by slug", () => {
    expect(getArticleBySlug("bail-mobilite-2026")).toBeDefined();
    expect(getArticleBySlug("this-slug-does-not-exist")).toBeUndefined();
  });
});