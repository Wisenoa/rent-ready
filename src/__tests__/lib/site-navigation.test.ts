/**
 * The public site has one header, one footer and one palette (V3.1).
 *
 * Before: four headers and four footers, a navbar whose links were anchors to
 * sections that exist on no page, /features rendering its nav and footer twice,
 * ~830 Tailwind blue classes from a previous identity, and nested <main>
 * landmarks. These checks keep it that way.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, relative } from "path";

import { routes } from "@/data/routes";
import { articleMeta } from "@/data/articles-meta";
import { AUTH_LINKS, FOOTER_COLUMNS, NAV_GROUPS, NAV_PRICING } from "@/components/marketing/site/nav-data";
import { TOOL_LINKS } from "@/components/marketing/site/tool-links";

const ROOT = process.cwd();
const PUBLIC_PATHS = new Set(routes.map((r) => r.path));
const APP_ROUTES = new Set(["/login", "/register"]);
// Blog posts are one dynamic route; their slugs live in articles-meta, not routes.ts.
const BLOG_PATHS = new Set(articleMeta.map((a) => `/blog/${a.slug}`));
const isPublic = (path: string) => PUBLIC_PATHS.has(path) || BLOG_PATHS.has(path);

const PUBLIC_DIRS = [
  "src/app/(marketing)",
  "src/app/(outils)",
  "src/app/(templates)",
  "src/components/marketing",
  "src/components/seo",
  "src/components/landing",
];

function files(dir: string): string[] {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(abs)) {
    const full = join(abs, entry);
    if (statSync(full).isDirectory()) out.push(...files(relative(ROOT, full)));
    else if (/\.tsx?$/.test(entry)) out.push(relative(ROOT, full));
  }
  return out;
}

const publicFiles = () => PUBLIC_DIRS.flatMap(files);
const read = (path: string) => readFileSync(join(ROOT, path), "utf8");
const withoutHash = (href: string) => href.split("#")[0];

const allNavLinks = [
  ...NAV_GROUPS.flatMap((g) => [g.hub, ...g.links]),
  NAV_PRICING,
  ...FOOTER_COLUMNS.flatMap((c) => c.links),
];

describe("liens de navigation", () => {
  it.each(allNavLinks.map((l) => [l.href, l.label] as const))("%s (%s) is a real public route", (href) => {
    expect(isPublic(withoutHash(href))).toBe(true);
  });

  it("auth links point at the app routes", () => {
    expect(APP_ROUTES.has(AUTH_LINKS.login.href)).toBe(true);
    expect(APP_ROUTES.has(AUTH_LINKS.signup.href)).toBe(true);
  });

  it("every free tool has curated related resources pointing at real routes", () => {
    const toolPaths = routes.map((r) => r.path).filter((p) => /^\/outils\/[^/]+$/.test(p));
    expect(toolPaths.length).toBeGreaterThan(10);
    for (const path of toolPaths) {
      const links = TOOL_LINKS[path];
      expect(links, `${path} has no entry in tool-links.ts`).toBeDefined();
      for (const link of [links.learn, ...links.next, links.product].filter(Boolean)) {
        expect(isPublic(withoutHash(link!.href)), `${path} → ${link!.href}`).toBe(true);
        expect(withoutHash(link!.href), `${path} links to itself`).not.toBe(path);
      }
    }
  });
});

describe("un seul header, un seul footer", () => {
  it("only MarketingShell and the homepage render SiteHeader and SiteFooter", () => {
    const renderers = [...publicFiles(), "src/app/page.tsx"].filter((f) =>
      /<Site(Header|Footer)\b/.test(read(f))
    );
    expect(renderers.sort()).toEqual(["src/app/page.tsx", "src/components/marketing/site/MarketingShell.tsx"]);
  });

  it("the three public route groups use MarketingShell", () => {
    for (const group of ["(marketing)", "(outils)", "(templates)"]) {
      expect(read(`src/app/${group}/layout.tsx`)).toContain("<MarketingShell>");
    }
  });

  it("no public page renders its own <main> (the shell owns the landmark)", () => {
    const offenders = publicFiles().filter(
      (f) =>
        !f.includes("components/landing/directions") &&
        !f.endsWith("site/MarketingShell.tsx") &&
        /<main[\s>]/.test(read(f))
    );
    expect(offenders).toEqual([]);
  });

  it("the superseded navigation components are gone", () => {
    for (const path of [
      "src/components/landing/glass-nav.tsx",
      "src/components/landing/marketing-footer.tsx",
      "src/components/smart-header-cta.tsx",
      "src/components/marketing/home/HomeNavbar.tsx",
      "src/components/marketing/home/HomeFooter.tsx",
    ]) {
      expect(existsSync(join(ROOT, path)), path).toBe(false);
    }
  });
});

describe("palette marketing", () => {
  it("public pages use the marketing palette, not the old blue scale", () => {
    const OLD = /(?<![\w-])(?:[a-z-]+:)*(?:bg|text|border|from|via|to|ring|fill|stroke)-(?:blue|indigo|sky|purple|violet|teal|cyan)-\d{2,3}\b/;
    const offenders = publicFiles().filter((f) => !f.includes("components/landing/directions") && OLD.test(read(f)));
    expect(offenders).toEqual([]);
  });
});
