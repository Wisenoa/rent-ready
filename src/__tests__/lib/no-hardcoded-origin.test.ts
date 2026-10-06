/**
 * The canonical origin, and the literals that bypass it.
 *
 * `SITE_URL` in `src/data/entity.ts` has always existed and is documented as "used
 * for canonical URLs, schema `url`, sitemap, robots". Measured while looking for
 * it: it was imported by exactly ONE file — itself. `sitemap.ts` picked it up, but
 * `robots.ts` still named the origin twice as a literal, and the number of
 * hardcoded `https://www.rentready.fr` literals across `src/` was 372, in 76
 * files.
 *
 * That is the failure mode this guards: the constant was present, so the codebase
 * LOOKED like it had a single source of truth, and it did not. With no domain
 * chosen yet, changing the origin was a 372-site search-and-replace.
 *
 * Two jobs here, deliberately separated:
 *
 *   1. The infrastructure files must not lie. `robots.txt` naming a sitemap host
 *      is a contract with crawlers; it is derived from SITE_URL, so setting
 *      NEXT_PUBLIC_APP_URL is enough.
 *
 *   2. The remaining literals are made VISIBLE. They are not failed here — 372 of
 *      them sit in content and schema files owned by other work, and rewriting
 *      them is its own piece of work, not something to smuggle into a fix. So the
 *      count is pinned: it may only go DOWN. A silent regression back to
 *      copy-pasting an origin cannot happen again without this test failing and
 *      naming the number.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { SITE_URL } from "@/data/entity";

const SRC = join(process.cwd(), "src");

/** Every source file, tests excluded: a test may legitimately name the origin. */
function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (entry === "__tests__" || entry === "node_modules") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...sourceFiles(full));
    else if (/\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

const LITERAL = /["'`]https:\/\/(?:www\.)?rentready\.fr[^"'`]*["'`]/g;

function countHardcodedOrigins(): { total: number; files: number; worst: string[] } {
  const perFile: Array<[string, number]> = [];
  for (const file of sourceFiles(SRC)) {
    const n = (readFileSync(file, "utf8").match(LITERAL) ?? []).length;
    if (n > 0) perFile.push([file.replace(process.cwd() + "/", ""), n]);
  }
  perFile.sort((a, b) => b[1] - a[1]);
  return {
    total: perFile.reduce((s, [, n]) => s + n, 0),
    files: perFile.length,
    worst: perFile.slice(0, 5).map(([f, n]) => `${f} (${n})`),
  };
}

/**
 * 372 when this test was written. Lower is the only acceptable direction; the
 * number is raised deliberately as the content files are converted, never
 * silently.
 */
const KNOWN_HARDCODED_ORIGINS = 372;

describe("origine canonique", () => {
  it("SITE_URL is the single place the origin is decided", () => {
    expect(SITE_URL).toMatch(/^https?:\/\//);
    // No trailing slash: `${SITE_URL}/sitemap.xml` must not yield `//`.
    expect(SITE_URL.endsWith("/")).toBe(false);
  });

  it("robots.txt names a sitemap host derived from SITE_URL", () => {
    const robots = readFileSync(join(SRC, "app", "robots.ts"), "utf8");

    // The contract with crawlers: a sitemap URL and a host, both from the origin.
    expect(robots).toContain("import { SITE_URL } from \"@/data/entity\"");
    expect(robots).toContain("sitemap: `${SITE_URL}/sitemap.xml`");
    expect(robots).toContain("host: SITE_URL");

    // And no literal origin survives in the file that robots actually read.
    expect(
      robots,
      "robots.ts ne doit plus nommer l'origine en dur"
    ).not.toMatch(/https?:\/\/(?:www\.)?rentready\.fr/);
  });

  it("sitemap.ts builds its URLs from SITE_URL, not from a literal", () => {
    const sitemap = readFileSync(join(SRC, "app", "sitemap.ts"), "utf8");
    expect(sitemap).toContain('from "@/data/entity"');
    expect(
      sitemap,
      "sitemap.ts ne doit plus nommer l'origine en dur"
    ).not.toMatch(/https?:\/\/(?:www\.)?rentready\.fr/);
  });

  it("the remaining hardcoded origins can only shrink", () => {
    const { total, files, worst } = countHardcodedOrigins();

    // Visible on failure: the number, how many files, and where the worst are.
    expect(
      total,
      [
        `Hardcoded origins: ${total} in ${files} files.`,
        `Was ${KNOWN_HARDCODED_ORIGINS} when this test was written — the count may`,
        `only go DOWN. Convert a file by importing SITE_URL, then lower`,
        `KNOWN_HARDCODED_ORIGINS to the measured value.`,
        `Worst: ${worst.join(", ")}`,
      ].join("\n")
    ).toBeLessThanOrEqual(KNOWN_HARDCODED_ORIGINS);
  });
});
