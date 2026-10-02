import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Both forms matter: the sidebar mixes JSX attributes (`href="/dashboard"`) with
 * nav object literals (`href: "/documents"`). Matching only the JSX form left the
 * whole toolsNav group unchecked, which is how a dead entry shipped.
 */
const HREF_RE = /href(?::\s*|=)"(\/[^"]*)"/g;

function sidebarHrefs(source: string): string[] {
  return [...source.matchAll(HREF_RE)].map((m) => m[1]);
}

/**
 * The sidebar linked to /settings, which does not exist: there is no settings page
 * anywhere in the app. A user clicking "Paramètres" got a 404, from the one piece
 * of navigation present on every authenticated screen.
 *
 * This walks the sidebar's links rather than asserting a fixed list, so a route
 * rename cannot make the check vacuous.
 */

const ROOT = join(process.cwd(), "src/app");
const GROUPS = ["(dashboard)", "(marketing)", "(outils)", "(templates)"];

function walk(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.tsx$/.test(entry.name)) out.push(full);
  }
  return out;
}

/**
 * A href resolves if a matching page or route handler exists under any app group.
 * Data-driven routes (the blog is generated from articles-meta) are checked by
 * the caller, since no directory corresponds to a slug.
 */
function resolves(href: string): boolean {
  const segments = href.split("/").filter(Boolean);
  for (const group of [...GROUPS, ""]) {
    const target = join(ROOT, group, ...segments);
    if (
      existsSync(target) ||
      existsSync(`${target}.tsx`) ||
      existsSync(join(target, "page.tsx")) ||
      existsSync(join(target, "route.ts"))
    ) {
      return true;
    }
  }
  return false;
}

describe("app sidebar navigation", () => {
  const sidebar = readFileSync(
    join(process.cwd(), "src/components/app-sidebar.tsx"),
    "utf8"
  );

  it("has links to check", () => {
    const hrefs = sidebarHrefs(sidebar);
    expect(hrefs.length).toBeGreaterThan(0);
  });

  it("every sidebar link points at a real route", () => {
    const broken: string[] = [];
    for (const href of sidebarHrefs(sidebar)) {
      if (href.includes("{")) continue; // dynamic, checked at render time
      if (!resolves(href)) broken.push(href);
    }
    expect(
      broken,
      `sidebar links that 404: ${broken.join(", ")}`
    ).toEqual([]);
  });

  it("has no documents or ai-assistant entry", () => {
    for (const href of sidebarHrefs(sidebar)) {
      expect(href).not.toBe("/documents");
      expect(href).not.toBe("/ai-assistant");
    }
  });

  it("links to a settings page that exists, never to a bare /settings", () => {
    // The sidebar previously offered "Paramètres" -> /settings, which 404'd from
    // every authenticated screen. The entry now points at the profile page.
    for (const href of sidebarHrefs(sidebar)) {
      expect(href).not.toBe("/settings");
    }
    expect(resolves("/settings/profile")).toBe(true);
  });
});