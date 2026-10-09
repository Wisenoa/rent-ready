import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const require = createRequire(import.meta.url);
const ROOT = process.cwd();
const DATA_DIR = join(ROOT, "docs/seo-growth/data");

// 1. Load routes & data
const { routes } = require(join(ROOT, "src/data/routes.ts"));
const { articleMeta } = require(join(ROOT, "src/data/articles-meta.ts"));
const { articles } = require(join(ROOT, "src/data/articles.ts"));
const cities = require(join(ROOT, "src/data/cities.json"));
const glossary = require(join(ROOT, "src/data/glossary.json"));

console.log(`Loaded ${routes.length} routes, ${articleMeta.length} articles, ${cities.length} cities, ${glossary.length} glossary terms.`);

// 2. Classify URL types & Intent
function classifyUrl(path) {
  if (path === "/") return { type: "HOMEPAGE", intent: "COMMERCIAL" };
  if (path === "/pricing") return { type: "PRICING", intent: "TRANSACTIONAL" };
  if (path === "/features" || path === "/demo") return { type: "FEATURE", intent: "COMMERCIAL" };
  if (path.startsWith("/outils")) return { type: "FREE_TOOL", intent: path === "/outils" ? "NAVIGATIONAL" : "TRANSACTIONAL" };
  if (path.startsWith("/blog")) return { type: "BLOG", intent: "INFORMATIONAL" };
  if (path.startsWith("/guides")) return { type: "BLOG", intent: "INFORMATIONAL" };
  if (path.startsWith("/comparatif")) return { type: "COMPARISON", intent: "COMMERCIAL" };
  if (path.startsWith("/templates")) return { type: "TEMPLATE", intent: "TRANSACTIONAL" };
  if (path.startsWith("/glossaire-immobilier")) return { type: "GLOSSARY", intent: "INFORMATIONAL" };
  if (path.startsWith("/assurance-loyer-impaye/") ||
      path.startsWith("/bail/") ||
      path.startsWith("/gestion-locative/") ||
      path.startsWith("/quittances/")) {
    return { type: "CITY", intent: "COMMERCIAL" };
  }
  if (path === "/assurance-loyer-impaye" || path === "/bail" || path === "/gestion-locative" || path === "/quittances" || path === "/villes") {
    return { type: "PRODUCT", intent: "COMMERCIAL" };
  }
  if (path === "/cgu" || path === "/mentions-legales" || path.startsWith("/politique-")) {
    return { type: "LEGAL", intent: "NAVIGATIONAL" };
  }
  if (path.startsWith("/design-preview")) {
    return { type: "PROTOTYPE", intent: "NAVIGATIONAL" };
  }
  return { type: "OTHER", intent: "INFORMATIONAL" };
}

// 3. Build URL items list
const urlMap = new Map();

// A. Routes from routes.ts
for (const r of routes) {
  const path = r.path;
  const classification = classifyUrl(path);
  const fullUrl = `https://www.rentready.fr${path === "/" ? "" : path}`;

  let title = "";
  let metaDesc = "";
  let h1 = "";
  let indexability = "INDEX";
  let contentStatus = "PUBLISHED";

  if (classification.type === "PROTOTYPE") {
    indexability = "NOINDEX";
    contentStatus = "PROTOTYPE";
  }

  // Handle known static and template metadata
  if (path === "/") {
    title = "Logiciel de gestion locative pour propriétaires bailleurs | RentReady";
    metaDesc = "Gérez vos locations sans tableur. Suivi des encaissements, quittances et reçus conformes à la loi de 1989, rappels de révision de loyer IRL. Essai gratuit 14 jours.";
    h1 = "Gérez vos locations sans tableur.";
  } else if (path === "/pricing") {
    title = "Tarifs RentReady 2026 — à partir de 9 €/mois, essai gratuit sans engagement";
    metaDesc = "Plans dès 9 €/mois — Starter (3 biens), Pro (10 biens), Agency. Quittances conformes, détection des loyers par DSP2, révision IRL automatique. Essai gratuit 14 jours.";
    h1 = "Un tarif transparent. Zéro surprise.";
  } else if (path === "/features") {
    title = "Fonctionnalités RentReady — Gestion locative automatisée pour propriétaires";
    metaDesc = "Toutes les fonctionnalités : quittances conformes, détection automatique des loyers, révision IRL connectée INSEE, portail locataire. Essai gratuit 14 jours.";
    h1 = "Toutes les fonctionnalités pour automatiser votre gestion locative";
  } else if (path.startsWith("/gestion-locative/") && path !== "/gestion-locative") {
    const slug = path.replace("/gestion-locative/", "");
    const city = cities.find(c => c.slug === slug);
    if (city) {
      title = `Gestion locative à ${city.name} (${city.department})`;
      metaDesc = `Gérez vos locations à ${city.name} sans effort : quittances légales, détection des loyers, révision IRL. Essai gratuit 14 jours, sans carte bancaire.`;
      h1 = `Gestion locative à ${city.name}`;
    }
  } else if (path.startsWith("/bail/") && path !== "/bail") {
    const slug = path.replace("/bail/", "");
    const city = cities.find(c => c.slug === slug);
    if (city) {
      title = `Contrat de bail conforme à ${city.name} (${city.department})`;
      metaDesc = `Modèle de bail conforme loi Alur pour ${city.name}. Clauses obligatoires, encadrement des loyers, signature électronique.`;
      h1 = `Contrat de bail de location à ${city.name}`;
    }
  } else if (path.startsWith("/quittances/") && path !== "/quittances") {
    const slug = path.replace("/quittances/", "");
    const city = cities.find(c => c.slug === slug);
    if (city) {
      title = `Quittance de loyer conforme à ${city.name} (${city.department})`;
      metaDesc = `Édition et envoi automatique de quittances de loyer conformes loi 1989 à ${city.name}. Zéro saisie manuelle.`;
      h1 = `Quittance de loyer à ${city.name}`;
    }
  } else if (path.startsWith("/assurance-loyer-impaye/") && path !== "/assurance-loyer-impaye") {
    const slug = path.replace("/assurance-loyer-impaye/", "");
    const city = cities.find(c => c.slug === slug);
    if (city) {
      title = `Assurance loyer impayé (GLI) à ${city.name} (${city.department})`;
      metaDesc = `Protégez vos loyers à ${city.name} avec la Garantie Loyer Impayé (GLI). Taux de sinistralité local et comparatif.`;
      h1 = `Assurance loyer impayé à ${city.name}`;
    }
  } else if (path.startsWith("/glossaire-immobilier/") && path !== "/glossaire-immobilier") {
    const slug = path.replace("/glossaire-immobilier/", "");
    const term = glossary.find(t => t.slug === slug);
    if (term) {
      title = `${term.term} — Définition et explications juridiques | Glossaire RentReady`;
      metaDesc = term.shortDefinition || term.definition.slice(0, 150);
      h1 = term.term;
    }
  }

  urlMap.set(fullUrl, {
    url: fullUrl,
    path,
    type: classification.type,
    title,
    metaDesc,
    h1,
    canonical: fullUrl,
    indexability,
    sitemapPresence: classification.type === "PROTOTYPE" ? "YES (ANOMALY)" : "YES",
    lastModified: new Date(r.mtime).toISOString().split("T")[0],
    contentStatus,
    primaryIntent: classification.intent,
    family: r.family || "static",
  });
}

// B. Blog articles from articlesMeta & articles
for (const a of articleMeta) {
  const fullUrl = `https://www.rentready.fr/blog/${a.slug}`;
  const fullArticle = articles[a.slug] || {};
  const classification = classifyUrl(`/blog/${a.slug}`);

  urlMap.set(fullUrl, {
    url: fullUrl,
    path: `/blog/${a.slug}`,
    type: "BLOG",
    title: fullArticle.title || a.title || `Article : ${a.slug}`,
    metaDesc: fullArticle.excerpt || a.excerpt || "",
    h1: fullArticle.title || a.title || "",
    canonical: fullUrl,
    indexability: "INDEX",
    sitemapPresence: "YES",
    lastModified: a.updatedAt || a.date,
    contentStatus: "PUBLISHED",
    primaryIntent: "INFORMATIONAL",
    family: "blog",
    category: a.category || fullArticle.category || "General",
    wordCount: fullArticle.content ? fullArticle.content.split(/\s+/).length : 0,
  });
}

console.log(`Total indexed inventory URLs: ${urlMap.size}`);

// 4. Build Internal Link Graph
// Scan source files in src/app, src/data, and blog articles to find href occurrences
const internalLinks = [];
const inlinksCount = new Map();
const outlinksCount = new Map();

for (const [url] of urlMap) {
  inlinksCount.set(url, 0);
  outlinksCount.set(url, 0);
}

// Process blog article contents (both Markdown links [text](url) and HTML links href="url")
for (const [slug, art] of Object.entries(articles)) {
  const sourceUrl = `https://www.rentready.fr/blog/${slug}`;
  if (!art.content) continue;

  // Markdown links: [anchor](target)
  const mdRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let mm;
  while ((mm = mdRegex.exec(art.content)) !== null) {
    const anchor = mm[1].trim();
    let target = mm[2].trim();
    if (target.startsWith("/")) {
      const fullTarget = `https://www.rentready.fr${target.split("#")[0]}`;
      internalLinks.push({ source: sourceUrl, target: fullTarget, anchor });
      outlinksCount.set(sourceUrl, (outlinksCount.get(sourceUrl) || 0) + 1);
      if (inlinksCount.has(fullTarget)) {
        inlinksCount.set(fullTarget, inlinksCount.get(fullTarget) + 1);
      }
    }
  }

  // HTML links: href="..."
  const htmlRegex = /href=["']([^"']+)["']/g;
  let hm;
  while ((hm = htmlRegex.exec(art.content)) !== null) {
    let target = hm[1].trim();
    if (target.startsWith("/")) {
      const fullTarget = `https://www.rentready.fr${target.split("#")[0]}`;
      internalLinks.push({ source: sourceUrl, target: fullTarget, anchor: "html-link" });
      outlinksCount.set(sourceUrl, (outlinksCount.get(sourceUrl) || 0) + 1);
      if (inlinksCount.has(fullTarget)) {
        inlinksCount.set(fullTarget, inlinksCount.get(fullTarget) + 1);
      }
    }
  }
}

// 5. Write url_inventory.csv
function escapeCsv(str) {
  if (str === null || str === undefined) return '""';
  const s = String(str).replace(/"/g, '""');
  return `"${s}"`;
}

const csvHeader = [
  "URL",
  "TYPE",
  "TITLE",
  "META_DESCRIPTION",
  "H1",
  "CANONICAL",
  "INDEXABILITY",
  "SITEMAP_PRESENCE",
  "INTERNAL_INLINKS",
  "INTERNAL_OUTLINKS",
  "LAST_MODIFIED",
  "CONTENT_STATUS",
  "PRIMARY_INTENT"
].join(",");

const csvRows = [csvHeader];

for (const [url, item] of urlMap) {
  const inlinks = inlinksCount.get(url) || 0;
  const outlinks = outlinksCount.get(url) || 0;
  csvRows.push([
    escapeCsv(item.url),
    escapeCsv(item.type),
    escapeCsv(item.title || "Auto/Template"),
    escapeCsv(item.metaDesc || "Auto/Template"),
    escapeCsv(item.h1 || "Auto/Template"),
    escapeCsv(item.canonical),
    escapeCsv(item.indexability),
    escapeCsv(item.sitemapPresence),
    inlinks,
    outlinks,
    escapeCsv(item.lastModified),
    escapeCsv(item.contentStatus),
    escapeCsv(item.primaryIntent)
  ].join(","));
}

writeFileSync(join(DATA_DIR, "url_inventory.csv"), csvRows.join("\n"), "utf8");
console.log(`Wrote ${csvRows.length - 1} rows to docs/seo-growth/data/url_inventory.csv`);

// 6. Write content_inventory.csv (Focus on Blog + Guides + Tools + Comparison)
const contentHeader = [
  "URL",
  "TYPE",
  "CATEGORY",
  "TITLE",
  "WORD_COUNT",
  "LAST_MODIFIED",
  "PRIMARY_INTENT",
  "INLINKS",
  "OUTLINKS"
].join(",");

const contentRows = [contentHeader];

for (const [url, item] of urlMap) {
  if (["BLOG", "FREE_TOOL", "COMPARISON", "TEMPLATE", "PRODUCT", "PRICING", "HOMEPAGE"].includes(item.type)) {
    contentRows.push([
      escapeCsv(item.url),
      escapeCsv(item.type),
      escapeCsv(item.category || item.family || item.type),
      escapeCsv(item.title || item.h1 || "Template"),
      item.wordCount || 0,
      escapeCsv(item.lastModified),
      escapeCsv(item.primaryIntent),
      inlinksCount.get(url) || 0,
      outlinksCount.get(url) || 0
    ].join(","));
  }
}

writeFileSync(join(DATA_DIR, "content_inventory.csv"), contentRows.join("\n"), "utf8");
console.log(`Wrote ${contentRows.length - 1} rows to docs/seo-growth/data/content_inventory.csv`);

// 7. Write internal_links.csv
const linkHeader = ["SOURCE_URL", "TARGET_URL", "ANCHOR_TYPE"].join(",");
const linkRows = [linkHeader, ...internalLinks.map(l => [escapeCsv(l.source), escapeCsv(l.target), escapeCsv(l.anchor)].join(","))];
writeFileSync(join(DATA_DIR, "internal_links.csv"), linkRows.join("\n"), "utf8");
console.log(`Wrote ${internalLinks.length} rows to docs/seo-growth/data/internal_links.csv`);

// 8. Write keyword_opportunities.csv (Top Commercial & Transactional Queries)
const kwHeader = [
  "KEYWORD",
  "SEARCH_INTENT",
  "SERP_TYPE",
  "MONTHLY_VOLUME",
  "KEYWORD_DIFFICULTY",
  "TOP_COMPETITORS",
  "EXISTING_RENTREADY_URL",
  "ACTION_TYPE",
  "BUSINESS_VALUE",
  "CONFIDENCE"
].join(",");

const moneyKeywords = [
  {
    kw: "logiciel gestion locative particulier",
    intent: "COMMERCIAL",
    serp: "SaaS + Comparateurs",
    vol: "N/A (GSC_UNAVAILABLE)",
    kd: "High",
    comp: "Rentila, BailFacile, MonsieurHugo, Igestionlocative",
    url: "https://www.rentready.fr/comparatif/logiciel-gestion-locative",
    action: "OPTIMIZE",
    value: "HIGH",
    conf: "HIGH"
  },
  {
    kw: "logiciel gestion locative propriétaire",
    intent: "COMMERCIAL",
    serp: "SaaS + Comparateurs",
    vol: "N/A (GSC_UNAVAILABLE)",
    kd: "High",
    comp: "Rentila, BailFacile, Smovin",
    url: "https://www.rentready.fr",
    action: "OPTIMIZE",
    value: "HIGH",
    conf: "HIGH"
  },
  {
    kw: "logiciel gestion locative gratuit",
    intent: "COMMERCIAL",
    serp: "Freemium SaaS + Modèles Excel",
    vol: "N/A (GSC_UNAVAILABLE)",
    kd: "Medium",
    comp: "Rentila, Excel gratuit, BailFacile",
    url: "https://www.rentready.fr/pricing",
    action: "CREATE_OR_OPTIMIZE",
    value: "HIGH",
    conf: "MEDIUM"
  },
  {
    kw: "logiciel quittance de loyer",
    intent: "TRANSACTIONAL",
    serp: "Générateurs PDF + SaaS",
    vol: "N/A (GSC_UNAVAILABLE)",
    kd: "Medium",
    comp: "BailFacile, LegalPlace, Quittance-de-loyer.org",
    url: "https://www.rentready.fr/outils/modele-quittance-loyer-pdf",
    action: "OPTIMIZE",
    value: "VERY_HIGH",
    conf: "HIGH"
  },
  {
    kw: "suivi loyer propriétaire",
    intent: "COMMERCIAL",
    serp: "Tableurs Excel + SaaS",
    vol: "N/A (GSC_UNAVAILABLE)",
    kd: "Low-Medium",
    comp: "Rentila, Modèles Excel, Qonto/Banques",
    url: "https://www.rentready.fr",
    action: "OPTIMIZE",
    value: "VERY_HIGH",
    conf: "HIGH"
  },
  {
    kw: "alternative Rentila",
    intent: "COMMERCIAL",
    serp: "Comparateurs + Avis",
    vol: "N/A (GSC_UNAVAILABLE)",
    kd: "Low-Medium",
    comp: "BailFacile, Appvizer",
    url: "https://www.rentready.fr/comparatif/rentready-vs-legalplace",
    action: "CREATE (Page dédiée RentReady vs Rentila)",
    value: "VERY_HIGH",
    conf: "HIGH"
  },
  {
    kw: "alternative BailFacile",
    intent: "COMMERCIAL",
    serp: "Comparateurs + SaaS",
    vol: "N/A (GSC_UNAVAILABLE)",
    kd: "Low-Medium",
    comp: "Rentila, MonsieurHugo",
    url: "N/A",
    action: "CREATE (Page dédiée RentReady vs BailFacile)",
    value: "VERY_HIGH",
    conf: "HIGH"
  },
  {
    kw: "calculateur revision irl 2026",
    intent: "TRANSACTIONAL",
    serp: "Outils de calcul + Service-Public",
    vol: "N/A (GSC_UNAVAILABLE)",
    kd: "Medium",
    comp: "Service-Public.fr, ANIL, BailFacile",
    url: "https://www.rentready.fr/outils/calculateur-irl",
    action: "OPTIMIZE (Product gateway)",
    value: "HIGH",
    conf: "HIGH"
  },
  {
    kw: "modele quittance loyer pdf gratuit",
    intent: "TRANSACTIONAL",
    serp: "Téléchargements PDF + Formulaires",
    vol: "N/A (GSC_UNAVAILABLE)",
    kd: "High",
    comp: "LegalPlace, Service-Public, BailFacile",
    url: "https://www.rentready.fr/outils/modele-quittance-loyer-pdf",
    action: "OPTIMIZE",
    value: "HIGH",
    conf: "HIGH"
  },
  {
    kw: "gestion locative sans agence",
    intent: "INFORMATIONAL/COMMERCIAL",
    serp: "Guides + SaaS",
    vol: "N/A (GSC_UNAVAILABLE)",
    kd: "Medium",
    comp: "PAP, SeLoger, Rentila",
    url: "https://www.rentready.fr/gestion-locative",
    action: "OPTIMIZE",
    value: "VERY_HIGH",
    conf: "HIGH"
  }
];

const kwRows = [kwHeader, ...moneyKeywords.map(k => [
  escapeCsv(k.kw),
  escapeCsv(k.intent),
  escapeCsv(k.serp),
  escapeCsv(k.vol),
  escapeCsv(k.kd),
  escapeCsv(k.comp),
  escapeCsv(k.url),
  escapeCsv(k.action),
  escapeCsv(k.value),
  escapeCsv(k.conf)
].join(","))];

writeFileSync(join(DATA_DIR, "keyword_opportunities.csv"), kwRows.join("\n"), "utf8");
console.log(`Wrote ${moneyKeywords.length} rows to docs/seo-growth/data/keyword_opportunities.csv`);
