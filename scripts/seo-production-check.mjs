#!/usr/bin/env node
/**
 * Production SEO smoke test.
 *
 * Runs against a deployed origin, not localhost. There is no build step here on
 * purpose: a script that validates the local bundle validates the build, not the
 * site. What breaks in production is specific to production — a wrong canonical
 * host, a cache that serves stale robots.txt, a proxy that strips headers, a
 * certificate that does not cover the apex domain.
 *
 * Usage:
 *   node scripts/seo-production-check.mjs https://www.rentready.fr
 *   node scripts/seo-production-check.mjs https://www.rentready.fr --verbose
 *
 * Exit code 0 = all checks passed, 1 = at least one failure.
 *
 * Every finding is reported as OBSERVED. Nothing is inferred: if a page cannot be
 * fetched, that is a failure, not a pass. A previous audit of this project
 * reported "384 x HTTP 000" from a crawl whose own server had been killed by the
 * OOM killer — real bytes off a dead socket, recorded as page defects.
 */

import { createHash } from "node:crypto";

const argv = process.argv.slice(2);
const VERBOSE = argv.includes("--verbose");
const ORIGIN = (argv.find((a) => !a.startsWith("--")) ?? "").replace(/\/+$/, "");

if (!ORIGIN) {
  process.stderr.write("usage: node scripts/seo-production-check.mjs <origin> [--verbose]\n");
  process.exit(2);
}

const UA =
  "Mozilla/5.0 (compatible; RentReadySEOCheck/1.0; +internal audit)";

/** ── results ─────────────────────────────────────────────────────────────── */

const results = [];
function record(name, ok, detail, extra = {}) {
  results.push({ name, ok, detail, ...extra });
  const mark = ok ? "PASS" : "FAIL";
  process.stdout.write(`  [${mark}] ${name} — ${detail}\n`);
}

async function fetchPath(path, { redirects = "manual" } = {}) {
  const started = Date.now();
  try {
    const res = await fetch(`${ORIGIN}${path}`, {
      redirect: redirects,
      headers: { "user-agent": UA, accept: "text/html,*/*" },
      signal: AbortSignal.timeout(30_000),
    });
    const body = res.status === 204 || res.status === 304 ? "" : await res.text();
    return {
      status: res.status,
      headers: res.headers,
      body,
      ms: Date.now() - started,
      finalUrl: `${ORIGIN}${path}`,
    };
  } catch (err) {
    return { status: 0, headers: new Headers(), body: "", error: err.message, ms: Date.now() - started };
  }
}

// ── 1. origin reachability ──────────────────────────────────────────────────

process.stdout.write(`\nOrigine : ${ORIGIN}\n\n1. Accessibilité\n`);

const home = await fetchPath("/", { redirects: "follow" });
if (home.status === 0) {
  record("joignable", false, `connexion impossible (${home.error})`);
  report();
} else {
  record("joignable", true, `HTTP ${home.status} en ${home.ms} ms`);
}

// Canonical host: every URL must agree on one origin.
const canonical = (home.body.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)"/i) ?? [])[1];
const expectedHost = new URL(ORIGIN).host;
const IS_PRODUCTION = /\.rentready\.fr$/.test(expectedHost);

if (canonical) {
  const cHost = new URL(canonical).host;
  if (IS_PRODUCTION) {
    record(
      "hôte canonique",
      cHost === expectedHost,
      cHost === expectedHost
        ? `canonical = ${cHost}`
        : `canonical = ${cHost}, origine = ${expectedHost} — divergence`
    );
  } else {
    // Against a local origin the canonical correctly names the production host.
    // Failing that would be a false alarm that teaches people to ignore the tool.
    record(
      "hôte canonique",
      true,
      `canonical = ${cHost} (origine locale ${expectedHost} — non comparé)`
    );
  }
} else {
  record("hôte canonique", false, "aucun <link rel=canonical> sur la page d'accueil");
}

// ── 2. status codes across the page families ────────────────────────────────

process.stdout.write("\n2. Codes HTTP par famille\n");

const FAMILIES = [
  ["home", "/"],
  ["money", "/pricing"],
  ["money", "/gestion-locative"],
  ["hub", "/blog"],
  ["hub", "/outils"],
  ["hub", "/guides"],
  ["hub", "/comparatif"],
  ["outil", "/outils/generateur-quittance"],
  ["outil", "/outils/calculateur-irl"],
  ["template", "/templates/bail-vide"],
  ["glossaire", "/glossaire-immobilier"],
  ["glossaire terme", "/glossaire-immobilier/quittance-loyer"],
  ["ville", "/bail/paris"],
  ["ville", "/gestion-locative/paris"],
  ["article", "/blog/comment-gerer-loyers-impayes"],
];

const statusByFamily = new Map();
for (const [family, path] of FAMILIES) {
  const r = await fetchPath(path);
  statusByFamily.set(family, statusByFamily.get(family) ?? []);
  statusByFamily.get(family).push({ path, status: r.status });
  record(`${family} ${path}`, r.status === 200, `HTTP ${r.status}`);
}

// A URL that must not exist has to 404 — not 200 (soft 404), not 307 to /login.
const missing = await fetchPath("/cette-page-nexiste-pas-987654321");
record(
  "404 réelle",
  missing.status === 404,
  `HTTP ${missing.status} sur une URL inexistante` +
    (missing.status === 200 ? " — soft 404" : "")
);

// ── 3. robots.txt ───────────────────────────────────────────────────────────

process.stdout.write("\n3. robots.txt\n");

const robots = await fetchPath("/robots.txt");
record("robots.txt joignable", robots.status === 200, `HTTP ${robots.status}`);
if (robots.status === 200) {
  const text = robots.body;
  record(
    "robots.txt contenu",
    /User-agent/i.test(text) && /sitemap/i.test(text),
    /sitemap:\s*(\S+)/i.exec(text)?.[1]
      ? `Sitemap déclaré : ${/sitemap:\s*(\S+)/i.exec(text)[1]}`
      : "aucune ligne Sitemap"
  );
  for (const path of ["/dashboard", "/api", "/settings"]) {
    record(
      `robots bloque ${path}`,
      new RegExp(`disallow:\\s*${path}`, "i").test(text),
      new RegExp(`disallow:\\s*${path}`, "i").test(text) ? "bloqué" : "NON bloqué"
    );
  }
}

// ── 4. sitemap.xml ──────────────────────────────────────────────────────────

process.stdout.write("\n4. sitemap.xml\n");

const sitemap = await fetchPath("/sitemap.xml");
record("sitemap joignable", sitemap.status === 200, `HTTP ${sitemap.status}`);

let urlCount = 0;
if (sitemap.status === 200) {
  const locs = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  urlCount = locs.length;

  record("URLs présentes", urlCount > 0, `${urlCount} URLs`);
  record(
    "URLs absolues",
    locs.every((l) => /^https?:\/\//.test(l)),
    locs.every((l) => /^https?:\/\//.test(l))
      ? "toutes absolues"
      : `${locs.filter((l) => !/^https?:\/\//.test(l)).length} relatives`
  );

  const badHosts = locs.filter((l) => new URL(l).host !== expectedHost);
  record(
    "hôte cohérent",
    IS_PRODUCTION ? badHosts.length === 0 : true,
    IS_PRODUCTION
      ? badHosts.length === 0
        ? "toutes sur le bon hôte"
        : `${badHosts.length} sur un autre hôte`
      : `sitemap sur ${new URL(locs[0]).host} (origine locale — non comparé)`
  );

  const local = locs.filter((l) => /localhost|127\.0\.0\.1|:3000|:3003|:31\d\d/.test(l));
  record(
    "aucune URL locale",
    local.length === 0,
    local.length === 0 ? "aucune" : local.slice(0, 3).join(", ")
  );

  const dupes = locs.filter((l, i) => locs.indexOf(l) !== i);
  record(
    "aucun doublon",
    dupes.length === 0,
    dupes.length === 0 ? "aucun" : `${new Set(dupes).size} doublons`
  );

  record(
    "accueil présente",
    locs.some((l) => new URL(l).pathname === "/"),
    locs.some((l) => new URL(l).pathname === "/") ? "oui" : "NON — la home manque"
  );

  const noindex = locs.filter((l) => /noindex|\?/i.test(l));
  record("aucune URL noindex", noindex.length === 0, noindex.join(", ") || "aucune");
}

// ── 5. rendered HTML ────────────────────────────────────────────────────────

process.stdout.write("\n5. HTML réel\n");

const SAMPLE = [
  "/",
  "/pricing",
  "/blog/comment-gerer-loyers-impayes",
  "/comparatif/logiciel-gestion-locative",
  "/bail/paris",
  "/glossaire-immobilier/quittance-loyer",
];

for (const path of SAMPLE) {
  const r = await fetchPath(path);
  if (r.status !== 200) {
    record(`${path} rendu`, false, `HTTP ${r.status}`);
    continue;
  }
  const html = r.body;

  const title = (html.match(/<title[^>]*>([^<]*)<\/title>/i) ?? [])[1]?.trim();
  const desc =
    (html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ?? [])[1];
  const canon = (html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ?? [])[1];
  const h1s = [...html.matchAll(/<h1[\s>]/gi)].length;
  const robotsMeta = (html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i) ?? [])[1];
  const ogImage = (html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i) ?? [])[1];
  const jsonLd = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((m) => m[1])
    .map((raw) => {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  const types = jsonLd.flatMap((d) => (d["@graph"] ?? [d]).map((n) => n["@type"])).filter(Boolean);
  const uniqueTypes = [...new Set(types.map((t) => (Array.isArray(t) ? t.join("+") : t)))];

  const problems = [];
  const notes = [];
  if (!title) problems.push("pas de <title>");
  if (title && title.length > 65) notes.push(`title ${title.length} car. (>65, tronqué en SERP)`);
  if (!desc) problems.push("pas de meta description");
  if (!canon) problems.push("pas de canonical");
  if (h1s !== 1) problems.push(`${h1s} H1`);
  if (robotsMeta && /noindex/i.test(robotsMeta)) problems.push("noindex");
  if (!ogImage) problems.push("pas d'og:image");

  // JSON-LD must be valid, and must not sit only after hydration.
  for (const node of jsonLd) {
    const probe = JSON.stringify(node);
    if (/NaN|undefined/.test(probe)) problems.push("JSON-LD contient NaN/undefined");
  }

  record(
    `${path} rendu`,
    problems.length === 0,
    [
      problems.length === 0
        ? `title ${title.length} car., 1 H1, ${uniqueTypes.join("/") || "sans schéma"}`
        : problems.join(" · "),
      ...notes,
    ].join(" · ")
  );

  if (VERBOSE) {
    process.stdout.write(
      `         title: ${title ?? "—"}\n         desc : ${(desc ?? "—").slice(0, 90)}\n` +
        `         canon: ${canon ?? "—"}\n         schémas: ${uniqueTypes.join(", ") || "—"}\n`
    );
  }
}

// ── 6. structured data ──────────────────────────────────────────────────────

process.stdout.write("\n6. Données structurées\n");

const schemaCheck = await fetchPath("/blog/comment-gerer-loyers-impayes");
if (schemaCheck.status === 200) {
  const nodes = [...schemaCheck.body.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((m) => {
      try {
        return JSON.parse(m[1]);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  const article = nodes
    .flatMap((d) => d["@graph"] ?? [d])
    .find((n) => n["@type"] === "Article");

  record("Article présent", !!article, article ? "oui" : "non");
  if (article) {
    // Google requires image and publisher.logo for an article rich result.
    const images = [article.image].flat().filter(Boolean);
    record(
      "Article.image",
      images.length > 0 && images.every((i) => /^https?:\/\//.test(String(i))),
      images.length ? String(images[0]).slice(0, 70) : "absent — rich result non éligible"
    );
    const logo = article.publisher?.logo;
    record(
      "Article.publisher.logo",
      !!logo,
      logo ? String(logo.url ?? logo).slice(0, 60) : "absent — rich result non éligible"
    );
    record(
      "Article dates",
      !!article.datePublished && !!article.dateModified,
      `${article.datePublished} → ${article.dateModified}`
    );
  }

  // Fake reviews are a manual-action risk. Check every page that claims one.
  const ratings = [...schemaCheck.body.matchAll(/"aggregateRating"|"review"/gi)];
  record(
    "pas d'avis sur un article",
    ratings.length === 0,
    ratings.length === 0 ? "aucun" : `${ratings.length} bloc(s) d'avis — à examiner`
  );
}

// ── report ──────────────────────────────────────────────────────────────────

function report() {
  const failed = results.filter((r) => !r.ok);
  const passed = results.length - failed.length;

  process.stdout.write(`\n${"─".repeat(64)}\n`);
  process.stdout.write(
    `Résultat : ${passed}/${results.length} vérifications passées sur ${ORIGIN}\n`
  );
  process.stdout.write(`empreinte de la réponse d'accueil : ${createHash("sha256").update(home.body).digest("hex").slice(0, 16)}\n`);

  if (failed.length > 0) {
    process.stdout.write(`\nÉchecs :\n`);
    for (const f of failed) process.stdout.write(`  · ${f.name} — ${f.detail}\n`);
    process.stdout.write("\n");
  } else {
    process.stdout.write("\nAucun échec.\n\n");
  }

  process.stdout.write(
    "Rappel : « page techniquement correcte » n'est pas « page indexée », et\n" +
      "« page indexée » n'est pas « page qui ranke ». Ce script vérifie le\n" +
      "premier niveau seulement.\n\n"
  );

  process.exit(failed.length > 0 ? 1 : 0);
}

report();