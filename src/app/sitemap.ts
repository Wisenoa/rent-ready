import type { MetadataRoute } from "next";


import { SITE_URL as BASE_URL } from "@/data/entity";

import { routes } from "@/data/routes";

const { articleMeta } = require("../data/articles-meta") as {
  articleMeta: Array<{ slug: string; date: string; updatedAt: string }>;
};



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

  const staticEntries: Entry[] = routes.map(({ path, mtime, priority, family }) => {
    const lastModified = new Date(mtime);
    return {
      url: `${BASE_URL}${path}`,
      lastModified: Number.isNaN(lastModified.getTime()) ? now : lastModified,
      // City pages carry a `family`; their template mtime is shared across the
      // whole family and they only change when the template does, so a monthly
      // frequency is the honest claim. Everything else follows the path table.
      changeFrequency: family
        ? ("monthly" as const)
        : changeFrequencyFor(path),
      // The generator supplies the priority for city and glossary entries
      // because it is the only place that knows the family list.
      priority: priority ?? priorityFor(path),
    };
  });

  // Blog posts — use real article data so the sitemap stays in sync with content.
  const blogEntries: Entry[] = articleMeta.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // City pages and glossary entries come from `routes.ts` too: the generator
  // reads `src/app/(marketing)/<family>` and `src/data/glossary.json` at build
  // time and writes the mtime out. Nothing here touches the filesystem.
  //
  // It used to. That was safe only because the sitemap is prerendered — the day
  // anything makes it dynamic, `newestMtime()` hits ENOENT in the Docker image,
  // where `src/app` does not exist, and the sitemap 500s and disappears.

  const all = [...staticEntries, ...blogEntries];

  // A sitemap must not contain duplicates or redirect sources.
  const seen = new Set<string>();
  return all.filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}
