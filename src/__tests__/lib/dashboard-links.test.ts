import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

/**
 * The dashboard's primary calls-to-action for a new landlord linked to routes that
 * do not exist:
 *
 *   /properties/new   -> 404
 *   /tenants/new      -> 404
 *   /maintenance/new  -> 404
 *
 * Only /leases/new exists as a standalone page. Properties and tenants are created
 * through dialogs on their list pages, so those CTAs now point at the list pages.
 *
 * Found by clicking them in a browser during onboarding, not by reading the code:
 * a `Link` to a non-existent route renders fine and only fails on navigation.
 */

const ROOT = join(process.cwd(), "src/app");
const DASHBOARD = join(ROOT, "(dashboard)");
const MARKETING = join(ROOT, "(marketing)");

function walk(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.tsx$/.test(entry.name)) out.push(full);
  }
  return out;
}

/** Does a route path resolve to a page or a route handler? */
function routeExists(href: string): boolean {
  const segments = href.split("/").filter(Boolean);
  for (const base of [DASHBOARD, ROOT, MARKETING]) {
    const target = join(base, ...segments);
    if (existsSync(target)) return true;
    if (existsSync(`${target}.tsx`)) return true;
    if (existsSync(join(target, "page.tsx"))) return true;
  }
  return false;
}

describe("dashboard links resolve", () => {
  const files = walk(DASHBOARD);

  it("has files to check", () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it("every internal href in the dashboard area points at a real route", () => {
    const broken: string[] = [];
    for (const file of files) {
      const source = readFileSync(file, "utf8");
      for (const m of source.matchAll(/href="(\/[^"]*)"/g)) {
        const href = m[1];
        if (href.startsWith("/api") || href.includes("{")) continue;
        if (!routeExists(href)) {
          broken.push(`${href}  (${relative(process.cwd(), file)})`);
        }
      }
    }
    expect(
      broken,
      `these dashboard links 404 when clicked:\n  ${broken.join("\n  ")}`
    ).toEqual([]);
  });

  it("the onboarding CTAs land on pages that can create the thing", () => {
    const dashboard = readFileSync(
      join(DASHBOARD, "dashboard/page.tsx"),
      "utf8"
    );
    // Not "link to a page that exists" but "lands where the creation UI is".
    expect(dashboard).toContain('href="/properties"');
    expect(dashboard).toContain('href="/tenants"');

    const properties = readFileSync(
      join(DASHBOARD, "properties/PropertiesPageClient.tsx"),
      "utf8"
    );
    expect(properties).toContain("PropertyForm");
    const tenants = readFileSync(
      join(DASHBOARD, "tenants/TenantsPageClient.tsx"),
      "utf8"
    );
    expect(tenants).toContain("TenantForm");
  });

  it("no CTA promises an action the product does not offer", () => {
    // Filing a maintenance ticket is only possible from the tenant portal; there
    // is no creation UI in the dashboard area. A landlord-facing button reading
    // "Signaler un problème" would promise something they cannot do.
    const owner = readFileSync(join(DASHBOARD, "dashboard/owner/page.tsx"), "utf8");
    const maintenanceCta = /href="\/maintenance"[\s\S]{0,220}?<\/Button>/.exec(owner);
    expect(maintenanceCta, "the maintenance CTA was not found").not.toBeNull();
    expect(maintenanceCta![0]).not.toMatch(/Signaler un problème/);
  });
});