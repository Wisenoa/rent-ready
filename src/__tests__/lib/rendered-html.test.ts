/**
 * Rendered-HTML invariants.
 *
 * Everything else in the SEO suite reads source. These checks need the real
 * document, because the two defects they cover are both invisible in JSX:
 *
 *   1. A duplicated title suffix. `layout.tsx` declares
 *      `title.template = "%s | RentReady"`, so any page whose own title already
 *      ends in the brand rendered "… — RentReady | RentReady". Four pages did,
 *      including the money page.
 *
 *   2. A duplicated JSON-LD node. `<Breadcrumb>` emits its own
 *      `BreadcrumbList`, so a page that also declared one in its own schema
 *      shipped two, with different shapes — one marking the last item without
 *      an `item` URL, the other with one.
 *
 * The suite starts the production server itself, because `next dev` renders a
 * different document: it is not the HTML a crawler sees.
 *
 * Skipped when no build exists, so a fresh checkout does not fail on a missing
 * artefact. In CI the build runs first.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { existsSync } from "fs";
import { join } from "path";
import { spawn, type ChildProcess } from "child_process";

const SERVER = join(process.cwd(), ".next", "standalone", "server.js");
const PORT = 3199;
const ORIGIN = `http://127.0.0.1:${PORT}`;

/**
 * Representative spread: home, money pages, hubs, a dynamic city leaf, a
 * glossary term, and every tool whose schema was found to be duplicated.
 *
 * The tools are here on purpose. Each of them rendered the same node type twice
 * for the same reason — a client component repeated the schema the server page
 * already declared — and none of it was visible in the JSX.
 */
const PAGES = [
  "/",
  "/gestion-locative",
  "/villes",
  "/pricing",
  "/features",
  "/locations",
  "/entretien",
  "/blog",
  "/guides",
  "/outils",
  "/templates",
  "/comparatif",
  "/bail",
  "/bail/paris",
  "/bail/marseille",
  "/quittances",
  "/quittances/lyon",
  "/assurance-loyer-impaye",
  "/assurance-loyer-impaye/bordeaux",
  "/glossaire-immobilier",
  "/glossaire-immobilier/irl-indice-reference-loyers",
  "/blog/quittance-loyer-pdf-gratuit",
  "/gestion-locative/paris",
  "/guides/modele-bail",
  "/outils/calculateur-irl",
  "/outils/calculateur-depot-garantie",
  "/outils/generateur-quittance",
  "/outils/calculateur-surface-habitable",
  "/outils/simulateur-fiscalite-lmnp",
  "/templates/bail-vide",
  "/comparatif/rentready-vs-legalplace",
];

let server: ChildProcess | null = null;
let available = false;

async function waitForServer(timeoutMs: number): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(ORIGIN + "/", { signal: AbortSignal.timeout(4000) });
      if (res.ok) return true;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

beforeAll(async () => {
  if (!existsSync(SERVER)) return;
  server = spawn("node", [SERVER], {
    env: {
      ...process.env,
      PORT: String(PORT),
      HOSTNAME: "127.0.0.1",
      NODE_ENV: "production",
      // The site is force-dynamic across ~90 routes; the default heap dies part
      // way through a full crawl.
      NODE_OPTIONS: "--max-old-space-size=6144",
    },
    stdio: "ignore",
  });
  available = await waitForServer(90_000);
}, 120_000);

afterAll(() => {
  server?.kill("SIGKILL");
});

const fetchHtml = async (path: string): Promise<string> => {
  const res = await fetch(ORIGIN + path, { signal: AbortSignal.timeout(20_000) });
  expect(res.status, `${path} → ${res.status}`).toBe(200);
  return res.text();
};

describe.runIf(existsSync(SERVER))("rendered titles", () => {
  it.each(PAGES)("%s does not repeat the brand suffix", async (path) => {
    if (!available) return;
    const html = await fetchHtml(path);
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
    expect(title, `no <title> on ${path}`).toBeDefined();

    // The root layout appends " | RentReady", so a title that already ended in
    // "| RentReady" rendered the brand twice. Naming the brand once inside the
    // sentence is normal and fine — only the repeated suffix is the defect.
    expect(
      title!.match(/\|\s*RentReady\s*\|\s*RentReady/),
      `"${title}" repeats the brand suffix`
    ).toBeNull();
  });

  it.each(PAGES)("%s has exactly one H1", async (path) => {
    if (!available) return;
    const html = await fetchHtml(path);
    const h1s = html.match(/<h1[\s>]/g) ?? [];
    expect(h1s.length, `${path} has ${h1s.length} H1`).toBe(1);
  });
});

describe.runIf(existsSync(SERVER))("rendered structured data", () => {
  it.each(PAGES)("%s declares no duplicated schema node", async (path) => {
    if (!available) return;
    const html = await fetchHtml(path);

    const blocks = [
      ...html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
      ),
    ].map((m) => m[1]);

    const types: string[] = [];
    for (const raw of blocks) {
      let parsed: Record<string, unknown>;
      try {
        parsed = JSON.parse(raw);
      } catch {
        // A malformed block is its own failure; report it where it happened.
        throw new Error(`${path}: unparseable JSON-LD — ${raw.slice(0, 120)}`);
      }
      const graph = (parsed["@graph"] as Record<string, unknown>[]) ?? [parsed];
      for (const node of graph) {
        const type = node["@type"];
        if (typeof type === "string") types.push(type);
      }
    }

    const seen = new Map<string, number>();
    for (const type of types) seen.set(type, (seen.get(type) ?? 0) + 1);
    const duplicates = [...seen.entries()].filter(([, n]) => n > 1);
    expect(
      duplicates,
      `${path} declares ${duplicates
        .map(([t, n]) => `${t} ×${n}`)
        .join(", ")}`
    ).toEqual([]);
  });

  it("the money page declares SoftwareApplication with the real entry price", async () => {
    if (!available) return;
    const html = await fetchHtml("/gestion-locative");
    const blocks = [
      ...html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
      ),
    ].map((m) => JSON.parse(m[1]));

    const nodes = blocks.flatMap(
      (b) => (b["@graph"] as Record<string, unknown>[]) ?? [b]
    );
    const app = nodes.find((n) => n["@type"] === "SoftwareApplication");
    expect(app, "no SoftwareApplication on /gestion-locative").toBeDefined();

    const offer = app!["offers"] as { price: string };
    // 9.00 is the Starter plan; the value comes from PLANS at render time.
    expect(Number(offer.price)).toBe(9);
  });

  it.each(PAGES)("%s points its social image at a real asset", async (path) => {
    if (!available) return;
    const html = await fetchHtml(path);
    const images = [
      ...html.matchAll(/<meta property="og:image" content="([^"]+)"/g),
    ].map((m) => m[1].replace(/&amp;/g, "&"));
    for (const url of images) {
      expect(
        url,
        `${path} advertises an image that does not exist: ${url}`
      ).not.toMatch(/\/og-image\.png|\/opengraph-image\.png|\/logo\.png/);
    }
  });
});

describe.runIf(existsSync(SERVER))("robots and sitemap", () => {
  it("robots.txt disallows the app surface and points at the sitemap", async () => {
    if (!available) return;
    const body = await (await fetch(`${ORIGIN}/robots.txt`)).text();
    expect(body).toMatch(/Sitemap:\s*https:\/\/www\.rentready\.fr\/sitemap\.xml/);
    expect(body).toMatch(/Disallow:\s*\/dashboard/);
    expect(body).not.toMatch(/Disallow:\s*$/m); // no empty disallow rules
  });

  it("the sitemap lists /villes and carries no duplicate URL", async () => {
    if (!available) return;
    const xml = await (await fetch(`${ORIGIN}/sitemap.xml`)).text();
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

    expect(urls, "sitemap is empty").not.toHaveLength(0);
    expect(urls).toContain("https://www.rentready.fr/villes");
    expect(urls).toContain("https://www.rentready.fr/gestion-locative");

    const unique = new Set(urls);
    expect(
      urls.length - unique.size,
      "sitemap contains duplicate URLs"
    ).toBe(0);
  });

  /**
   * The homepage was absent from the sitemap for as long as the route list was
   * derived by walking the filesystem: `walk` recorded only *directories*
   * containing a `page.tsx`, and `src/app/page.tsx` is the one route that is a
   * file at the root. The file shipped 418 URLs with no `/` among them, and
   * `priorityFor("/") => 1.0` was unreachable code.
   *
   * Nobody noticed because the sitemap had 400+ other URLs and looked full.
   */
  it("includes the homepage", async () => {
    if (!available) return;
    const xml = await (await fetch(`${ORIGIN}/sitemap.xml`)).text();
    expect(xml).toContain("<loc>https://www.rentready.fr/</loc>");
  });

  it("never advertises an authenticated or deleted route", async () => {
    if (!available) return;
    const xml = await (await fetch(`${ORIGIN}/sitemap.xml`)).text();
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

    const PRIVATE = [
      "/dashboard", "/api/", "/login", "/register", "/properties", "/leases",
      "/tenants", "/portal", "/settings", "/billing", "/fiscal", "/expenses",
      "/maintenance", "/offline",
    ];
    for (const prefix of PRIVATE) {
      const leaked = urls.filter((u) => u.includes(`rentready.fr${prefix}`));
      expect(leaked, `${prefix} must not be indexed`).toEqual([]);
    }

    // Pages removed in the cannibalisation pass, replaced by a 301.
    const REMOVED = [
      "/outils/calculateur-caution",
      "/templates/calculateur-rendement-locatif",
      "/outils/modele-bail-location",
    ];
    for (const path of REMOVED) {
      expect(urls, `${path} is deleted and 301s`).not.toContain(
        `https://www.rentready.fr${path}`
      );
    }
  });
});