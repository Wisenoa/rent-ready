/**
 * Generates `src/data/routes.ts` — every public route, with its newest
 * content mtime — from the App Router directory tree.
 *
 * WHY THIS IS A BUILD STEP
 *
 * `sitemap.ts` used to walk `process.cwd()/src/app` at request time. That works
 * on a laptop and breaks in the place it matters:
 *
 *   - The Docker image copies `.next/standalone` to `/app`, and that bundle
 *     contains `src/{components,lib,data}` but NOT the route tree. With
 *     `CMD ["node", "server.js"]` and `WORKDIR /app`, `src/app` does not exist,
 *     so the walk silently found nothing and the sitemap would ship empty.
 *   - It also made the sitemap depend on the working directory, which is a
 *     property of how a process is launched rather than of the app.
 *   - And it missed the homepage: `walk` only recorded *directories* containing
 *     a `page.tsx`, so `src/app/page.tsx` — the one route that lives at the root
 *     — was skipped. The sitemap shipped 418 URLs with no `/` among them, and
 *     `priorityFor("/") => 1.0` was unreachable code.
 *
 * Enumerating routes is a build-time fact. This script makes it one.
 *
 * Why a generated module and not a generated JSON file: Next traces `.ts`
 * modules into the standalone bundle (it does the same for `articles-meta.ts`)
 * but a `.json` written by a pre-build step is not guaranteed to be traced, and
 * the sitemap runs at request time. Emitting TypeScript removes the runtime
 * file dependency entirely.
 *
 * Run: pnpm gen:routes   (wired into `pnpm build`)
 */

import { readdirSync, statSync, existsSync, readFileSync } from "node:fs";
import { writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const APP_DIR = join(ROOT, "src", "app");

/** Route groups do not create URL segments. */
const ROUTE_GROUPS = new Set(["(marketing)", "(outils)", "(templates)", "(dashboard)"]);

/** Never indexed: authenticated app surface and non-HTML endpoints. */
const PRIVATE_PREFIXES = [
  "/api",
  "/billing",
  "/dashboard",
  "/expenses",
  "/fiscal",
  "/leases",
  "/login",
  "/maintenance",
  "/offline",
  "/portal",
  "/properties",
  "/register",
  "/settings",
  "/tenants",
];

/** Newest mtime under a directory, used as the entry's lastModified. */
function newestMtime(dir) {
  let newest = 0;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const mtime = statSync(full).isDirectory()
      ? newestMtime(full)
      : statSync(full).mtimeMs;
    if (mtime > newest) newest = mtime;
  }
  return newest;
}

function isPrivate(path) {
  return PRIVATE_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

/**
 * URLs that `next.config.ts` permanently redirects away.
 *
 * The sitemap is the list of URLs to index, so a redirect source must never
 * appear in it: Google reports it as "Redirected URL" in Search Console and the
 * crawl budget is spent for nothing. `sitemap.ts` asserts this in a comment, and
 * the comment used to be the only enforcement — when
 * `/comparatif/rentready-vs-gerclegeo` was deleted and given a 301, the route
 * generator kept publishing it, because the generator only knew about
 * PRIVATE_PREFIXES and `next.config.ts` is TypeScript that cannot be imported.
 *
 * So the sources are parsed out of the config as text. That is deliberate: a
 * regex over the file is more robust here than an eval, and the shape of a
 * redirect rule is stable. The sitemap test fails if this list ever drifts out of
 * sync with the config.
 */
function redirectSources() {
  const configPath = join(ROOT, "next.config.ts");
  if (!existsSync(configPath)) return [];

  const config = readFileSync(configPath, "utf8");
  const sources = new Set();

  // A redirect rule is `{ source: '…', destination: '…', permanent: true }`.
  const blocks = config.split(/\{\s*source:/).slice(1);
  for (const block of blocks) {
    const source = /source:\s*'([^']+)'/.exec(`source:${block}`);
    if (!source) continue;
    // Stop at the end of this rule rather than matching a later one.
    const nextRule = block.search(/\{\s*source:/);
    const scope = nextRule >= 0 ? block.slice(0, nextRule) : block;
    sources.add(source[1]);
  }

  return [...sources];
}

const REDIRECT_SOURCES = redirectSources();

function isRedirectSource(path) {
  return REDIRECT_SOURCES.some((s) => {
    if (s.includes(":") || s.includes("*")) {
      // Skip dynamic patterns (`/:id`, `/blog/*`); this generator only walks
      // concrete filesystem routes, so they cannot collide with a literal path.
      return false;
    }
    return path === s;
  });
}

const routes = [];

// The homepage: the only route that is a file at the root rather than a
// directory containing a page. Easy to miss, and it was missed.
if (existsSync(join(APP_DIR, "page.tsx"))) {
  routes.push({ path: "/", mtime: newestMtime(APP_DIR) });
}

function walk(dir, segments) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);

    if (ROUTE_GROUPS.has(entry)) {
      walk(full, segments);
      continue;
    }

    // [slug] / [ville] routes are expanded from their own data at request time.
    if (entry.startsWith("[")) continue;

    if (!statSync(full).isDirectory()) continue;

    const next = [...segments, entry];

    if (existsSync(join(full, "page.tsx"))) {
      routes.push({ path: `/${next.join("/")}`, mtime: newestMtime(full) });
    }

    walk(full, next);
  }
}

walk(APP_DIR, []);

// A `not-found.tsx` at the root has no page.tsx above it and is not a route to
// advertise; the walk only records directories that contain a real page.

const seen = new Set();
const unique = routes
  .filter((r) => !isPrivate(r.path) && !isRedirectSource(r.path))
  .filter((r) => (seen.has(r.path) ? false : (seen.add(r.path), true)))
  .sort((a, b) => a.path.localeCompare(b.path));

const hasHome = unique.some((r) => r.path === "/");
if (!hasHome) {
  throw new Error(
    "routes.ts does not contain the homepage — src/app/page.tsx is missing."
  );
}


/**
 * City and glossary entries, for the same reason the routes above are generated.
 *
 * `sitemap.ts` used to read `src/app/(marketing)/<family>` and
 * `src/data/glossary.json` at request time to compute a `lastModified`. Neither
 * path exists in the Docker image: the Dockerfile copies `.next/standalone` to
 * `/app`, which carries `src/{components,data,lib}` and then runs
 * `node server.js` — there is no route tree. The sitemap is prerendered today
 * (`initialRevalidateSeconds: false`), so nothing fails; the day anything makes
 * it dynamic, `newestMtime()` throws ENOENT and the sitemap 500s and vanishes.
 *
 * Reading the data at build time removes the trap rather than documenting it.
 */
const CITY_FAMILIES = [
  { prefix: "/gestion-locative", dir: "gestion-locative" },
  { prefix: "/bail", dir: "bail" },
  { prefix: "/quittances", dir: "quittances" },
  { prefix: "/assurance-loyer-impaye", dir: "assurance-loyer-impaye" },
];

/** Mirrors the priorities previously declared inside sitemap.ts. */
const CITY_PRIORITY = {
  "/gestion-locative": 0.8,
  "/bail": 0.8,
  "/quittances": 0.7,
  "/assurance-loyer-impaye": 0.7,
};

function buildCityEntries() {
  const marketingDir = join(APP_DIR, "(marketing)");
  const raw = JSON.parse(
    readFileSync(join(ROOT, "src", "data", "cities.json"), "utf8")
  );
  const cities = Array.isArray(raw) ? raw : raw.cities;

  const out = [];
  for (const family of CITY_FAMILIES) {
    const dir = join(marketingDir, family.dir);
    if (!existsSync(dir)) {
      throw new Error(`City family directory missing: ${dir}`);
    }
    // One mtime per family: these pages share one template, so a change to it
    // genuinely affects every city in the family.
    const mtime = new Date(newestMtime(dir)).toISOString();
    for (const city of cities) {
      out.push({
        path: `${family.prefix}/${city.slug}`,
        mtime,
        family: family.prefix,
        priority: CITY_PRIORITY[family.prefix],
      });
    }
  }
  return out;
}

function buildGlossaryEntries() {
  const file = join(ROOT, "src", "data", "glossary.json");
  const raw = readFileSync(file, "utf-8");
  const mtime = new Date(statSync(file).mtimeMs).toISOString();

  const slugs = [...raw.matchAll(/"slug"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);
  if (slugs.length === 0) {
    throw new Error("glossary.json yielded no slugs");
  }
  return slugs.map((slug) => ({
    // Leading slash: every path in this file is absolute, and a sitemap entry
    // without one produces a relative URL that no crawler can resolve.
    path: `/glossaire-immobilier/${slug}`,
    mtime,
    priority: 0.6,
  }));
}

const cityEntries = buildCityEntries();
const glossaryEntries = buildGlossaryEntries();
const derived = [...cityEntries, ...glossaryEntries];

/** Keep the newest mtime per path across both sources. */
const merged = new Map();
for (const r of [...unique, ...derived]) {
  const previous = merged.get(r.path);
  if (!previous || r.mtime > previous.mtime) merged.set(r.path, r);
}
const all = [...merged.values()].sort((a, b) => a.path.localeCompare(b.path));

// Every path is absolute. The glossary entries were once emitted without the
// leading slash, so they silently did not match anything keyed on the path —
// 30 URLs missing from the sitemap, and no error anywhere. A relative path in a
// sitemap is a URL no crawler can resolve.
const relativePaths = all.filter((r) => !r.path.startsWith("/"));
if (relativePaths.length > 0) {
  throw new Error(
    `routes.ts paths must start with "/": ${relativePaths
      .map((r) => r.path)
      .join(", ")}`
  );
}

const body = [
  "/**",
  " * GENERATED by scripts/gen-routes.mjs — do not edit by hand.",
  " *",
  " * Every public route in the App Router, with the newest mtime beneath it so the",
  " * sitemap can set a truthful lastModified. Run `pnpm gen:routes` after adding,",
  " * renaming or deleting a page; `pnpm build` does it for you.",
  " *",
  ` * ${all.length} routes.`,
  " */",
  "export interface RouteEntry {",
  "  path: string;",
  "  /** ISO date of the newest file under the route directory. */",
  "  mtime: string;",
  "  /**",
  "   * Sitemap priority. Only city pages and glossary entries carry one; a",
  "   * static route gets its priority from the table in sitemap.ts.",
  "   */",
  "  priority?: number;",
  "  /** Set on city entries so the sitemap can group them by family. */",
  "  family?: string;",
  "}",
  "",
  "export const routes: RouteEntry[] = " +
    JSON.stringify(
      all.map((r) => {
        const entry = { path: r.path, mtime: new Date(r.mtime).toISOString() };
        if (r.priority !== undefined) entry.priority = r.priority;
        if (r.family !== undefined) entry.family = r.family;
        return entry;
      }),
      null,
      2
    ) +
    ";",
  "",
].join("\n");

writeFileSync(join(ROOT, "src", "data", "routes.ts"), body);

console.log(
  `Generated src/data/routes.ts (${all.length} public routes, homepage ${
    hasHome ? "included" : "MISSING"
  })`
);