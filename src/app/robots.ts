import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/entity";

/**
 * robots.txt
 *
 * Only *disallow* rules matter to crawlers. The previous version listed an
 * `allow` array of marketing paths, which is a no-op for Google and, worse,
 * listed `/maintenance` as allowed — a route that resolves to the
 * authenticated dashboard, not to any public page.
 *
 * Policy: allow crawling by default, disallow everything that is app surface
 * or has no search value. Every remaining marketing page is discoverable
 * through the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: [
          // Authenticated app surface (all under the (dashboard) group).
          "/dashboard",
          "/leases",
          "/properties",
          "/tenants",
          "/maintenance",
          "/billing",
          "/expenses",
          "/fiscal",
          "/portal",
      "/settings",
          // Auth routes — no search value, must not be indexed.
          "/login",
          "/register",
          // Internal API — never expose to crawlers.
          "/api",
          // Admin.
          "/admin",
          // PWA shell fallback, not a real page.
          "/offline",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
