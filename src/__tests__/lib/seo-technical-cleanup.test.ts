/**
 * Technical SEO defects found by the October 2026 crawl, pinned so they stay
 * fixed:
 *
 *   - nine glossary links to 404s and three to redirects or private routes;
 *   - seven /design-preview mock-ups indexable;
 *   - /entretien declaring the private /maintenance route as its canonical;
 *   - four public templates linked from nowhere.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

import glossary from "@/data/glossary.json";
import { routes } from "@/data/routes";
import robots from "@/app/robots";
import { metadata as designPreviewMetadata } from "@/app/design-preview/layout";

const ROOT = process.cwd();
const read = (path: string) => readFileSync(join(ROOT, path), "utf8");

const NEXT_CONFIG = read("next.config.ts");
const PUBLIC_PATHS = new Set(routes.map((r) => r.path));
const DISALLOWED = (() => {
  const rules = robots().rules;
  const list = Array.isArray(rules) ? rules : [rules];
  return list.flatMap((r) => (Array.isArray(r.disallow) ? r.disallow : r.disallow ? [r.disallow] : []));
})();

function isRedirectSource(path: string): boolean {
  return NEXT_CONFIG.includes(`source: '${path}'`);
}

describe("glossaire", () => {
  const slugs = new Set(glossary.map((e) => e.slug));
  const terms = new Set(glossary.map((e) => e.term.toLowerCase().replace(/\s+/g, "-")));

  it.each(glossary.map((e) => [e.slug, e.relatedTerms] as const))(
    "%s links only to existing glossary entries",
    (_slug, related) => {
      const unknown = related.filter((t) => !slugs.has(t) && !terms.has(t));
      expect(unknown).toEqual([]);
    }
  );

  it.each(glossary.map((e) => [e.slug, e.seeFurtherLinks ?? []] as const))(
    "%s points « Aller plus loin » at public, final URLs",
    (_slug, links) => {
      for (const href of links) {
        expect(PUBLIC_PATHS.has(href), `${href} is not a public route`).toBe(true);
        expect(isRedirectSource(href), `${href} is a redirect`).toBe(false);
        expect(
          DISALLOWED.some((prefix) => href.startsWith(prefix)),
          `${href} is private`
        ).toBe(false);
      }
    }
  );
});

describe("maquettes /design-preview", () => {
  it("are noindex through their shared layout", () => {
    expect(designPreviewMetadata.robots).toEqual({ index: false, follow: false });
  });

  it("stay crawlable, or the noindex would never be read", () => {
    expect(DISALLOWED.some((prefix) => prefix.startsWith("/design-preview"))).toBe(false);
  });
});

describe("/entretien", () => {
  it("is its own canonical and never points at the private /maintenance route", () => {
    const page = read("src/app/(marketing)/entretien/page.tsx");
    expect(page).toContain('url: "/entretien"');
    expect(page).not.toMatch(/url: "\/maintenance"|\$\{SITE_URL\}\/maintenance/);
  });
});

describe("pages orphelines", () => {
  it("are linked from the /templates hub", () => {
    const hub = read("src/app/(marketing)/templates/page.tsx");
    for (const slug of ["bail-professionnel", "contrat-de-location", "repartition-charges", "lease"]) {
      expect(hub, `/templates/${slug}`).toContain(`slug: "${slug}"`);
    }
    // The hub must not link to a URL that only redirects.
    expect(hub).not.toContain('slug: "calculateur-rendement-locatif"');
  });

  it("/comparatif is reachable from /pricing", () => {
    const pricing = read("src/app/(marketing)/pricing/page.tsx");
    expect(pricing).toContain('href="/comparatif"');
    expect(pricing).toContain('href="/comparatif/logiciel-gestion-locative"');
  });
});
