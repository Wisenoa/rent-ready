/**
 * Regenerates src/data/articles-meta.ts from src/data/articles.ts.
 *
 * articles.ts embeds every article body as a template literal (~636 KB). Modules
 * that only need titles/excerpts must not import it, or the whole payload lands in
 * the build graph and exhausts the Node heap during `next build`.
 *
 * Run: pnpm gen:article-meta
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ROOT = process.cwd();

const header = `/**
 * Article metadata (slug, title, excerpt, category, dates) — no article bodies.
 *
 * GENERATED from \`src/data/articles.ts\`. Do not edit by hand; run
 *   pnpm gen:article-meta
 * after changing an article.
 *
 * Why this file exists: \`articles.ts\` is ~636 KB because each entry embeds its
 * full body as a template literal. Components that only list or cross-link posts
 * (related links, article cards, feeds) used to import that whole payload, which
 * is what exhausted the Node heap during \`next build\` prerendering. They import
 * this module instead.
 */
export interface ArticleMeta {
  slug: string;
  title: string;
  /** Optional: some source articles have no excerpt. */
  excerpt?: string;
  category: string;
  date: string;
  updatedAt: string;
  readTime: string;
}

export const articleMeta: ArticleMeta[] = [
`;

async function readArticles() {
  const dir = mkdtempSync(join(tmpdir(), "article-meta-"));
  const testPath = join(ROOT, "src/__tests__/lib/_gen_article_meta.test.ts");
  try {
    writeFileSync(
      testPath,
      `import { describe, it } from "vitest";
import { writeFileSync } from "fs";
describe("gen", () => {
  it("dumps metadata", async () => {
    const mod: any = await import("@/data/articles");
    // readTime is COMPUTED from the body, never copied from the hand-written
    // field. 30 articles declared 6-11 minutes for bodies of 100-250 words:
    // an article that announces "11 min" and delivers one is worse than a thin
    // article that admits it, and the number is shown next to the title in the
    // SERP and on the page.
    const WORDS_PER_MINUTE = 200; // usual reading pace for technical French
    const meta = mod.articles.map((a: any) => {
      // ESCAPING: this block is a JS template literal written to a temporary
      // .ts file. A single backslash is consumed by the outer template, so
      // "\\w" here must be written "\\\\w" or the generated file sees /w/.
      const words = ((a.content ?? "").match(/[\\w\\u00C0-\\u024F'’-]+/g) ?? []).length;
      const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
      return {
        slug: a.slug, title: a.title, excerpt: a.excerpt,
        category: a.category, date: a.date, updatedAt: a.updatedAt,
        readTime: minutes + " min",
      };
    });
    writeFileSync(${JSON.stringify(join(dir, "meta.json"))}, JSON.stringify(meta));
  });
});
`
    );
    execFileSync("npx", ["vitest", "run", "src/__tests__/lib/_gen_article_meta.test.ts"], {
      cwd: ROOT,
      stdio: "pipe",
    });
    return JSON.parse(readFileSync(join(dir, "meta.json"), "utf8"));
  } finally {
    rmSync(testPath, { force: true });
    rmSync(dir, { recursive: true, force: true });
  }
}

const articles = await readArticles();

const body = articles
  .map((a) => "  " + JSON.stringify(a) + ",")
  .join("\n");

writeFileSync(
  join(ROOT, "src/data/articles-meta.ts"),
  `${header}${body}\n];\n`
);

console.log(`Generated src/data/articles-meta.ts (${articles.length} articles)`);