import type { MetadataRoute } from "next";
import { readFileSync, statSync } from "fs";
import { join } from "path";

import { SITE_URL as BASE_URL } from "@/data/entity";

import { routes } from "@/data/routes";

const { articleMeta } = require("../data/articles-meta") as {
  articleMeta: Array<{ slug: string; date: string; updatedAt: string }>;
};

const APP_DIR = join(process.cwd(), "src", "app");

/**
 * Static routes come from `src/data/routes.ts`, generated at build time by
 * `scripts/gen-routes.mjs`.
 *
 * This used to walk `process.cwd()/src/app` on every request. Two problems,
 * both discovered by rendering the site rather than reading it:
 *
 *   - **It missed the homepage.** The walk recorded only *directories*
 *     containing a `page.tsx`, and `src/app/page.tsx` is the one route that is a
 *     file at the root. The shipped sitemap had 418 URLs and no `/` among them,
 *     and `priorityFor("/") => 1.0` was unreachable code.
 *
 *   - **It would have shipped an empty sitemap in production.** The Docker image
 *     copies `.next/standalone` to `/app`, which contains `src/{components,lib,data}`
 *     but not the route tree, and starts with `CMD ["node", "server.js"]` from
 *     `/app`. `src/app` does not exist there, so the walk had nothing to read.
 *
 * Enumerating routes is a build-time fact; this file is now a formatter.
 *
 * It is a generated TypeScript module rather than a JSON file: Next bundles
 * traced `.ts` modules into the standalone output, whereas a JSON written by a
 * pre-build step was not traced and would have been missing in Docker.
 */

/** Newest mtime under a directory, used for the city-page entries. */
function newestMtime(dir: string): Date {
  let newestMs = 0;
  for (const entry of require("fs").readdirSync(dir)) {
    const full = join(dir, entry);
    const mtime = statSync(full).isDirectory()
      ? newestMtime(full).getTime()
      : statSync(full).mtimeMs;
    if (mtime > newestMs) newestMs = mtime;
  }
  return new Date(newestMs);
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
  const now = new Date();

  if (routes.length === 0) {
    // routes.ts is written by `pnpm gen:routes`, wired into `pnpm build`.
    // An empty sitemap is worse than a stale one, so say so loudly rather than
    // shipping a file that quietly asks a crawler to index nothing.
    throw new Error(
      "src/data/routes.ts is empty. Run `pnpm gen:routes` before building."
    );
  }

  const staticEntries: Entry[] = routes.map(({ path, mtime }) => {
    const lastModified = new Date(mtime);
    return {
      url: `${BASE_URL}${path}`,
      lastModified: Number.isNaN(lastModified.getTime()) ? now : lastModified,
      changeFrequency: changeFrequencyFor(path),
      priority: priorityFor(path),
    };
  });

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
  /**
   * These pages are rendered from a single template per family, so their real
   * last-modified date is the template's mtime. Stamping them with `now` made
   * all 200 city URLs claim a fresh date on every build, which tells Google
   * "re-crawl me" for content that has not changed.
   */
  const cityMtime = (prefix: string): Date => {
    const mtime = newestMtime(join(APP_DIR, "(marketing)", prefix));
    return Number.isNaN(mtime.getTime()) ? now : mtime;
  };
  const cityEntries: Entry[] = cities.flatMap((city) =>
    CITY_FAMILIES.map(({ prefix, priority }) => ({
      url: `${BASE_URL}${prefix}/${city.slug}`,
      lastModified: cityMtime(prefix),
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
  const glossaryMtime = statSync(join(process.cwd(), "src", "data", "glossary.json")).mtime;
  const glossaryEntries: Entry[] = glossarySlugs.map((slug) => ({
    url: `${BASE_URL}/glossaire-immobilier/${slug}`,
    lastModified: glossaryMtime,
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
