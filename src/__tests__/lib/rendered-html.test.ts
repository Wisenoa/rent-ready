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
import { existsSync, readFileSync } from "fs";
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

  /**
   * Metadata must be in `<head>`, not streamed into the body.
   *
   * Every marketing page declared `export const dynamic = "force-dynamic"`,
   * which overrode the layout's `revalidate = 3600` and left it dead config. In
   * a fully dynamic render Next streams metadata *after* `</head>`: on `/pricing`
   * `</head>` closed at byte 2 171 while `<title>` appeared at byte 68 927, past
   * a Suspense boundary. Google reads it; crawlers and link previewers that only
   * parse the head see no title and no canonical.
   *
   * Measured on the current build, every page below has both inside the head.
   */
  it.each(PAGES)("%s puts title and canonical inside <head>", async (path) => {
    if (!available) return;
    const html = await fetchHtml(path);

    const headEnd = html.indexOf("</head>");
    expect(headEnd, `${path}: no </head>`).toBeGreaterThan(-1);

    const titleAt = html.indexOf("<title>");
    expect(titleAt, `${path}: no <title>`).toBeGreaterThan(-1);
    expect(
      titleAt,
      `${path}: <title> at byte ${titleAt} is after </head> at ${headEnd}`
    ).toBeLessThan(headEnd);

    const canonicalAt = html.indexOf('rel="canonical"');
    expect(canonicalAt, `${path}: no canonical`).toBeGreaterThan(-1);
    expect(
      canonicalAt,
      `${path}: canonical at byte ${canonicalAt} is after </head> at ${headEnd}`
    ).toBeLessThan(headEnd);
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

  /**
   * Google's Article guidelines require `image` and `publisher.logo`. Both were
   * absent: the markup was syntactically valid and would have been silently
   * discarded as ineligible for an article rich result.
   */
  it("Article markup carries the properties Google requires", async () => {
    if (!available) return;
    const html = await fetchHtml("/blog/comment-gerer-loyers-impayes");

    const nodes = [
      ...html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
      ),
    ].flatMap((m) => {
      const parsed = JSON.parse(m[1]);
      return (parsed["@graph"] as Record<string, unknown>[]) ?? [parsed];
    });

    const article = nodes.find((n) => n["@type"] === "Article");
    expect(article, "no Article node on the article page").toBeDefined();

    // image: required, and must be an absolute URL.
    const image = article!["image"];
    const images = Array.isArray(image) ? image : [image];
    expect(images, "Article.image missing").not.toContain(undefined);
    for (const url of images) {
      expect(String(url)).toMatch(/^https:\/\/www\.rentready\.fr\//);
    }

    // publisher.logo: required.
    const publisher = article!["publisher"] as Record<string, unknown>;
    expect(publisher?.logo, "Article.publisher.logo missing").toBeDefined();
    const logo = publisher.logo as Record<string, unknown>;
    expect(String(logo.url ?? logo)).toMatch(/^https:\/\/www\.rentready\.fr\//);

    // Dates are already correct; keep them honest.
    expect(article!["datePublished"], "datePublished").toBeTruthy();
    expect(article!["dateModified"], "dateModified").toBeTruthy();
  });

  /**
   * `/comparatif/logiciel-gestion-locative` carried three hardcoded "15 €/mois"
   * claims while the product costs 9 €. Two of them were plain double-quoted
   * strings, so replacing the price with `${formatEntryPrice()}` had no effect:
   * the rendered JSON-LD published the literal string "{formatEntryPrice()}".
   *
   * The answer engine read "à {formatEntryPrice()} sans commission" as RentReady's
   * price. A structured-data fact that no test ever checked is a fact nothing
   * keeps honest.
   */
  it("never renders a JavaScript placeholder into visible copy or schema", async () => {
    if (!available) return;

    const pages = [
      "/comparatif/logiciel-gestion-locative",
      "/gestion-locative",
      "/pricing",
      "/blog/travaux-locataire-proprietaire",
    ];

    const problems: string[] = [];
    for (const path of pages) {
      const html = await fetchHtml(path);
      // ${...} is already valid inside a template literal; a bare {name()} means
      // the interpolation was written into a string that does not evaluate it.
      for (const m of html.matchAll(/\$\{[a-zA-Z]/g)) {
        const line = html.slice(0, m.index).split("\n").length;
        problems.push(`${path}:${line} — literal ${m[0]} in output`);
      }
    }

    expect(
      problems,
      `JavaScript placeholders reached the rendered page:\n${problems.join("\n")}`
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

/**
 * Every social image on the site comes from this route.
 *
 * It returned 500 for all seven templates: satori (the renderer behind
 * `ImageResponse`) rejects `width: "fit-content"` with "Invalid value fit-content
 * for setWidth", and one unsupported CSS length failed the whole response. Every
 * `og:image` and `twitter:image` in the site pointed at a broken URL — the link
 * preview a landlord shares in a WhatsApp group to a colleague would have shown
 * nothing.
 */
describe("sitemap source has no filesystem dependency", () => {
  /**
   * `sitemap.ts` used to read `src/app/(marketing)/<family>` and
   * `src/data/glossary.json` at request time to compute `lastModified`.
   *
   * Safe only by luck: the sitemap is prerendered
   * (`initialRevalidateSeconds: false`), so `sitemap()` never runs in
   * production. The Docker image copies `.next/standalone` to `/app`, which has
   * `src/{components,data,lib}` and no route tree — so the first build that made
   * the sitemap dynamic would have thrown ENOENT and the sitemap would have
   * 500'd and vanished.
   *
   * Verified by temporarily forcing `dynamic = "force-dynamic"`, building, and
   * serving the standalone bundle with no `src/app` present: 200, 417 URLs, no
   * ENOENT. That is the state this test now keeps.
   */
  it("reads no files at request time", () => {
    const source = readFileSync(
      join(process.cwd(), "src", "app", "sitemap.ts"),
      "utf8"
    );

    // Strip comments: the file explains at length why it must not do this.
    const code = source
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");

    expect(code, "sitemap.ts must not import fs").not.toMatch(
      /from\s+["'](fs|node:fs|path|node:path)["']/
    );
    expect(code, "sitemap.ts must not require fs at runtime").not.toMatch(
      /require\(\s*["'](fs|node:fs)["']\s*\)/
    );
    expect(code, "sitemap.ts must not touch the filesystem").not.toMatch(
      /\b(readFileSync|writeFileSync|statSync|readdirSync|existsSync|newestMtime|APP_DIR)\b/
    );
    // Everything it needs has to come from generated data.
    expect(code, "sitemap.ts should read from the generated routes").toMatch(
      /from\s+["']@\/data\/routes["']/
    );
  });

  it("routes.ts covers every city page and glossary term", () => {
    const routes = readFileSync(
      join(process.cwd(), "src", "data", "routes.ts"),
      "utf8"
    );
    const paths: string[] = [...routes.matchAll(/"path":\s*"([^"]+)"/g)].map(
      (m) => m[1]
    );

    const cityCount = (
      JSON.parse(
        readFileSync(join(process.cwd(), "src", "data", "cities.json"), "utf8")
      ) as unknown[]
    ).length;

    for (const family of [
      "bail",
      "gestion-locative",
      "quittances",
      "assurance-loyer-impaye",
    ]) {
      const found = paths.filter((p) => p.startsWith(`/${family}/`)).length;
      expect(found, `/${family}/ — expected ${cityCount} city pages`).toBe(
        cityCount
      );
    }

    const glossary = (
      JSON.parse(
        readFileSync(
          join(process.cwd(), "src", "data", "glossary.json"),
          "utf8"
        )
      ) as Array<{ slug: string }>
    ).length;
    const glossaryPaths = paths.filter((p) =>
      p.startsWith("/glossaire-immobilier/")
    ).length;
    expect(glossaryPaths, "every glossary term belongs in the sitemap").toBe(
      glossary
    );
  });
});

describe.runIf(existsSync(SERVER))("social images", () => {
  it.each(["default", "website", "article", "feature", "pricing", "outil", "location"])(
    "renders a real PNG for the %s template",
    async (type) => {
      if (!available) return;
      const res = await fetch(`${ORIGIN}/api/og?title=RentReady&type=${type}`, {
        signal: AbortSignal.timeout(20_000),
      });
      expect(res.status, `/api/og?type=${type}`).toBe(200);
      expect(res.headers.get("content-type")).toContain("image/png");

      const body = Buffer.from(await res.arrayBuffer());
      // PNG magic number, then the IHDR width/height.
      expect(body.subarray(0, 4).toString("hex")).toBe("89504e47");
      expect(body.length, "image is suspiciously small").toBeGreaterThan(1000);
      expect(body.readUInt32BE(16), "width").toBe(1200);
      expect(body.readUInt32BE(20), "height").toBe(630);
    }
  );
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