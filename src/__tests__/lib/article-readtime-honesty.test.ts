/**
 * Article metadata must be derived, not asserted.
 *
 * `readTime` was a hand-written string in `articles.ts`, copied verbatim into
 * `articles-meta.ts` by the generator. Thirty of the 119 articles declared
 * between 6 and 11 minutes for bodies of 100 to 250 words — `statut-lmnp-2026`
 * announced 11 minutes and delivered 119 words. The number is rendered beside
 * the title in the SERP and at the top of the page, so it is a claim a visitor
 * checks within three seconds of clicking.
 *
 * `scripts/gen-article-meta.mjs` now computes it from the body at
 * 200 words/minute. This suite makes sure that stays true, and makes the thin
 * part of the corpus visible instead of letting a hand-edited number hide it.
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { articles } from "@/data/articles";
import { articleMeta } from "@/data/articles-meta";

const WORDS_PER_MINUTE = 200;

function wordCount(body: string): number {
  return body.match(/[\wÀ-ÿ'’-]+/g)?.length ?? 0;
}

describe("readTime is honest", () => {
  it("every article's stated read time matches its actual length", () => {
    const offenders: string[] = [];

    for (const article of articles) {
      const words = wordCount(article.content ?? "");
      const actual = Math.max(1, Math.round(words / WORDS_PER_MINUTE));

      const meta = articleMeta.find((m) => m.slug === article.slug);
      if (!meta) {
        offenders.push(`${article.slug} — absent from articles-meta.ts`);
        continue;
      }

      const stated = Number(meta.readTime.replace(/\D/g, ""));
      // One minute of slack absorbs rounding, not a 10x overstatement.
      if (Math.abs(stated - actual) > 1) {
        offenders.push(
          `${article.slug} — ${words} words, states "${meta.readTime}", is ~${actual} min`
        );
      }
    }

    expect(
      offenders,
      `readTime must be generated from the body:\n${offenders.join("\n")}`
    ).toEqual([]);
  });

  it("never claims more minutes than the page can justify", () => {
    for (const article of articles) {
      const meta = articleMeta.find((m) => m.slug === article.slug)!;
      const stated = Number(meta.readTime.replace(/\D/g, ""));
      const words = wordCount(article.content ?? "");
      expect(stated, `${article.slug}`).toBeLessThanOrEqual(
        Math.max(1, Math.ceil(words / WORDS_PER_MINUTE)) + 1
      );
    }
  });
});

describe("articles-meta stays in sync with articles", () => {
  it("has one entry per article", () => {
    expect(articleMeta.length).toBe(articles.length);
    expect(articleMeta.map((m) => m.slug).sort()).toEqual(
      articles.map((a) => a.slug).sort()
    );
  });

  it("keeps generated metadata free of article bodies", () => {
    // articles-meta.ts exists so listing components do not pull 636 KB into the
    // build graph. A body leaking in would undo that.
    const source = readFileSync(
      join(process.cwd(), "src", "data", "articles-meta.ts"),
      "utf8"
    );
    expect(source).not.toContain("content:");
    expect(source.length).toBeLessThan(200_000);
  });
});

/**
 * Not a failure — a measurement.
 *
 * Thirty articles are under 300 words. Several duplicate a tool that already
 * answers the question better. This test prints the number so the trend is
 * visible when the suite runs, and fails only if the corpus gets meaningfully
 * worse, which would mean new padding rather than new writing.
 */
describe("corpus thickness (informational)", () => {
  it("does not add more one-paragraph articles than the baseline", () => {
    const thin = articles.filter((a) => wordCount(a.content ?? "") < 300);
    // Baseline established 2026-10-04. Raise it only after deleting thin pages,
    // never after adding them.
    expect(thin.length, `thin articles: ${thin.length}`).toBeLessThanOrEqual(45);

    const medians = articles
      .map((a) => wordCount(a.content ?? ""))
      .sort((x, y) => x - y);
    const median = medians[Math.floor(medians.length / 2)];
    // eslint-disable-next-line no-console
    console.log(
      `corpus: ${articles.length} articles · ${thin.length} under 300 words · median ${median} words`
    );
    expect(median).toBeGreaterThan(0);
  });
});