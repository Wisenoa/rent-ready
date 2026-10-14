/**
 * "Litige sur le dépôt de garantie : procédure et recours" was published under
 * two slugs. The kept URL has more internal links and the plainer slug; the
 * other one is a 301. Kept separate from the technical cleanup so the merge can
 * be reverted alone if Search Console shows the other URL carried the traffic.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

import { articleMeta } from "@/data/articles-meta";

const NEXT_CONFIG = readFileSync(join(process.cwd(), "next.config.ts"), "utf8");

describe("article en double", () => {
  it("redirects the removed slug to the kept article", () => {
    expect(NEXT_CONFIG).toMatch(
      /source: '\/blog\/litige-depot-garantie-procedure',\s*destination: '\/blog\/litige-depot-garantie',\s*permanent: true/
    );
    const slugs = articleMeta.map((a) => a.slug);
    expect(slugs).toContain("litige-depot-garantie");
    expect(slugs).not.toContain("litige-depot-garantie-procedure");
  });

  it("leaves no two articles with the same title", () => {
    const seen = new Map<string, string>();
    const duplicates: string[] = [];
    for (const a of articleMeta) {
      const other = seen.get(a.title);
      if (other) duplicates.push(`${other} / ${a.slug}`);
      seen.set(a.title, a.slug);
    }
    expect(duplicates).toEqual([]);
  });
});
