import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { routes } from "@/data/routes";
import sitemap from "@/app/sitemap";

describe("Sitemap & Private Routes Leak Prevention (TECH-01)", () => {
  it("never includes /design-preview prototypes in src/data/routes.ts", () => {
    const leakedRoutes = routes.filter((r) => r.path.startsWith("/design-preview"));
    expect(leakedRoutes).toEqual([]);
  });

  it("never includes /design-preview prototypes in generated sitemap", () => {
    const entries = sitemap();
    const leakedEntries = entries.filter((e) => e.url.includes("/design-preview"));
    expect(leakedEntries).toEqual([]);
  });

  it("never includes private application routes in generated sitemap", () => {
    const entries = sitemap();
    const forbiddenPrefixes = [
      "/dashboard",
      "/login",
      "/register",
      "/properties",
      "/tenants",
      "/leases",
      "/maintenance",
      "/expenses",
      "/fiscal",
      "/portal",
      "/settings",
      "/api",
    ];

    for (const prefix of forbiddenPrefixes) {
      const leaked = entries.filter((e) => {
        const urlObj = new URL(e.url);
        return urlObj.pathname === prefix || urlObj.pathname.startsWith(`${prefix}/`);
      });
      expect(leaked, `Found leaked entries for private prefix ${prefix}`).toEqual([]);
    }
  });

  it("enforces /design-preview in PRIVATE_PREFIXES of scripts/gen-routes.mjs", () => {
    const scriptPath = join(process.cwd(), "scripts/gen-routes.mjs");
    const scriptContent = readFileSync(scriptPath, "utf8");
    expect(scriptContent).toContain('"/design-preview"');
  });
});
