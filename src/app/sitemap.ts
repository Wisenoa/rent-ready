import type { MetadataRoute } from "next";
import { readdirSync, readFileSync, existsSync, statSync } from "fs";
import { join, relative, sep } from "path";
 
const { articleMeta } = require("../data/articles-meta") as {
  articleMeta: Array<{ slug: string; date: string; updatedAt: string }>;
};

const BASE_URL = "https://www.rentready.fr";
const APP_DIR = join(process.cwd(), "src", "app");

/**
 * Route groups — `(marketing)`, `(templates)`, `(outils)` — do not create URL
 * segments. Strip them when deriving routes from the filesystem.
 */
const ROUTE_GROUPS = new Set(["(dashboard)", "(marketing)", "(outils)", "(templates)"]);

/** Prefixes that must never appear in the sitemap. */
const PRIVATE_PREFIXES = [
  "/dashboard",
  "/leases",
  "/properties",
  "/tenants",
  "/billing",
  "/expenses",
  "/fiscal",
  "/maintenance",
  "/login",
  "/register",
  "/portal",
  "/offline",
  "/api",
];

function isPrivate(path: string): boolean {
  return PRIVATE_PREFIXES.some(
    (p) => path === p || path.startsWith(`${p}/`)
  );
}

type DiscoveredRoute = {
  /** URL path, e.g. "/templates/bail-vide" */
  path: string;
  /** Newest mtime of the route's files, used as lastModified. */
  mtime: Date;
};

/**
 * Walk the app directory and return every static page route.
 *
 * The sitemap used to be a 400-line hand-maintained list, which had drifted
 * out of sync with the real routes: it advertised `/modeles/*` pages that are
 * now 301-redirected, `/outils/calculateur-revision-irl` and
 * `/outils/calculateur-irl-2026` (both 301s to `/outils/calculateur-irl`), and
 * `/templates/colocation` (301 to `/templates/bail-colocation`), while omitting
 * live pages such as `/outils/modele-quittance-loyer-pdf` and
 * `/outils/simulateur-loi-jeanbrun`. Deriving the list from the filesystem
 * makes that class of drift impossible.
 */
function discoverStaticRoutes(): DiscoveredRoute[] {
  const found: DiscoveredRoute[] = [];

  function walk(dir: string, segments: string[]) {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);

      if (ROUTE_GROUPS.has(entry)) {
        walk(full, segments);
        continue;
      }

      // [slug] / [ville] style params are handled separately from static data.
      if (entry.startsWith("[")) continue;

      if (!statSync(full).isDirectory()) continue;

      const next = [...segments, entry];

      if (existsSync(join(full, "page.tsx"))) {
        const path = next.length ? `/${next.join("/")}` : "/";
        const newest = newestMtime(full);
        found.push({ path, mtime: newest });
      }

      walk(full, next);
    }
  }

  function newestMtime(dir: string): Date {
    // Compare timestamps, not a Date against a number: a directory's mtime is
    // already a Date and was being compared with `>`, which is never true, so a
    // directory's own mtime was discarded in favour of any file mtime beneath it.
    let newestMs = 0;
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const stats = statSync(full);
      const mtimeMs = stats.isDirectory() ? newestMtime(full).getTime() : stats.mtimeMs;
      if (mtimeMs > newestMs) newestMs = mtimeMs;
    }
    return new Date(newestMs);
  }

  walk(APP_DIR, []);
  return found;
}

type Entry = MetadataRoute.Sitemap[number];

/**
 * Priorities by depth. The homepage and the money pages matter; legal pages
 * exist to be findable, not to rank.
 */
function priorityFor(path: string): number {
  if (path === "/") return 1.0;
  if (["/pricing", "/features", "/gestion-locative", "/templates", "/outils"].includes(path)) {
    return 0.9;
  }
  if (path === "/blog" || path === "/guides" || path === "/locations" || path === "/bail" || path === "/quittances") {
    return 0.8;
  }
  if (path.startsWith("/comparatif")) return 0.7;
  if (path.startsWith("/glossaire-immobilier/")) return 0.6;
  if (
    path.startsWith("/mentions-legales") ||
    path.startsWith("/politique-") ||
    path.startsWith("/cgu")
  ) {
    return 0.3;
  }
  return 0.7;
}

function changeFrequencyFor(path: string): Entry["changeFrequency"] {
  if (
    path.startsWith("/mentions-legales") ||
    path.startsWith("/politique-") ||
    path.startsWith("/cgu")
  ) {
    return "yearly";
  }
  // Regulatory values (IRL, thresholds) can change; the rest is stable copy.
  if (path.includes("irl") || path.includes("loyer") || path.includes("bail") || path.includes("depot")) {
    return "monthly";
  }
  return "weekly";
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Fall back to a build-time stamp if the filesystem walk yields nothing
  // (e.g. a trimmed deployment image). An empty sitemap is worse than a stale one.
  const now = new Date();

  const staticEntries: Entry[] = discoverStaticRoutes()
    .filter((r) => !isPrivate(r.path))
    .map(({ path, mtime }) => ({
      url: `${BASE_URL}${path}`,
      lastModified: Number.isNaN(mtime.getTime()) ? now : mtime,
      changeFrequency: changeFrequencyFor(path),
      priority: priorityFor(path),
    }));

  // Blog posts — use real article data so the sitemap stays in sync with content.
  const blogEntries: Entry[] = articleMeta.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // City pages — bail, gestion-locative, quittances, assurance impayé.
   
  const cities = require("../data/cities.json") as Array<{ slug: string }>;
  const CITY_FAMILIES = [
    { prefix: "/gestion-locative", priority: 0.8 },
    { prefix: "/bail", priority: 0.8 },
    { prefix: "/quittances", priority: 0.7 },
    { prefix: "/assurance-loyer-impaye", priority: 0.7 },
  ];
  const cityEntries: Entry[] = cities.flatMap((city) =>
    CITY_FAMILIES.map(({ prefix, priority }) => ({
      url: `${BASE_URL}${prefix}/${city.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority,
    }))
  );

   
  const glossaryRaw = readFileSync(
    join(process.cwd(), "src", "data", "glossary.json"),
    "utf-8"
  );
  const glossarySlugs: string[] = Array.from(
    glossaryRaw.matchAll(/"slug":\s*"([^"]+)"/g),
    (m) => m[1]
  );
  const glossaryEntries: Entry[] = glossarySlugs.map((slug) => ({
    url: `${BASE_URL}/glossaire-immobilier/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const all = [...staticEntries, ...blogEntries, ...cityEntries, ...glossaryEntries];

  // A sitemap must not contain duplicates or redirect sources.
  const seen = new Set<string>();
  return all.filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}
