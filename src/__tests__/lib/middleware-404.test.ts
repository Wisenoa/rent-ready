import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

import { PUBLIC_PATHS, PRIVATE_PATHS } from "../../middleware";

/**
 * An unknown URL used to answer `307 → /login`.
 *
 * The middleware redirected anything that was not in `PUBLIC_PATHS`, which was
 * written as a public allowlist. So every URL the app does not serve — a bad
 * internal link, a mistyped path, a URL a crawler invented — bounced to the sign-in
 * page instead of returning 404.
 *
 * That is a soft 404. A crawler following a broken link follows the redirect and
 * sees a 200 on /login, so the destination of garbage URLs is what gets indexed,
 * and the crawl budget is spent on pages nobody linked to. A human who mistypes a
 * URL gets a login form rather than being told the page does not exist.
 *
 * The middleware now decides from `PRIVATE_PATHS`: only the authenticated app
 * surface redirects, and everything else falls through to the router, which serves
 * `not-found.tsx` with a real 404.
 */
describe("unknown URLs must 404, not redirect to /login", () => {
  it("decides the auth redirect from PRIVATE_PATHS, not from the absence of a public match", () => {
    const source = readFileSync(
      join(process.cwd(), "src", "middleware.ts"),
      "utf8"
    );

    // The old form: `!sessionToken && !isPublicPath(...)`.
    expect(
      source,
      "the auth gate must not test the absence of a public match"
    ).not.toMatch(/!sessionToken\s*&&\s*!isPublicPath/);

    // The new form.
    expect(source, "the auth gate must test PRIVATE_PATHS").toMatch(
      /!sessionToken\s*&&\s*isPrivatePath/
    );
  });

  it("covers the whole authenticated surface and nothing else", () => {
    // Every private route the sitemap already treats as private must be gated here.
    // If one is missing, an anonymous visitor gets the app shell instead of /login.
    const required = [
      "/billing",
      "/dashboard",
      "/expenses",
      "/fiscal",
      "/leases",
      "/maintenance",
      "/offline",
      "/properties",
      "/settings",
      "/tenants",
    ];

    for (const path of required) {
      expect(PRIVATE_PATHS, `${path} must be gated`).toContain(path);
    }
  });

  /**
   * The first version of the fix put `/login` in PRIVATE_PATHS. That redirects an
   * anonymous visitor to `/login?callbackUrl=/login`, which is still private, which
   * redirects again — an infinite loop on the sign-in page, which also breaks
   * sign-up because Better Auth's routes live under /api/auth.
   *
   * These four are excluded from the sitemap and must stay out of the session gate.
   */
  it("does not gate the pages needed to sign in", () => {
    for (const path of ["/login", "/register", "/api", "/portal"]) {
      expect(
        PRIVATE_PATHS,
        `${path} must not require a session — gating it breaks sign-in`
      ).not.toContain(path);
    }
  });

  it("never lists the same path as public and private", () => {
    const overlap = PUBLIC_PATHS.filter((p) => PRIVATE_PATHS.includes(p));
    expect(
      overlap,
      `a path cannot be both public and private: ${overlap.join(", ")}`
    ).toEqual([]);
  });

  it("keeps the crawl surface reachable without a session", () => {
    // A public page family missing from PUBLIC_PATHS would be treated as unknown
    // the day the auth gate stops consulting the list.
    const crawlSurface = [
      "/blog",
      "/outils",
      "/guides",
      "/templates",
      "/comparatif",
      "/glossaire-immobilier",
      "/gestion-locative",
      "/bail",
      "/quittances",
      "/assurance-loyer-impaye",
      "/pricing",
      "/villes",
      "/locations",
    ];

    for (const path of crawlSurface) {
      expect(PUBLIC_PATHS, `${path} must stay public`).toContain(path);
    }
  });
});