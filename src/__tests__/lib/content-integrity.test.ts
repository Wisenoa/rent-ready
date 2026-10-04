/**
 * Content integrity guards.
 *
 * These three failure modes were all present in the production content and
 * none of them was caught by any existing test:
 *
 * 1. Content served to French landlords contained Chinese, Japanese, Korean or
 *    Cyrillic fragments. The corpus is AI-assisted, so stray tokens from other
 *    scripts survive generation. On a YMYL site (rental law, deposits, notice
 *    periods) this damages credibility and can publish a wrong legal statement.
 *
 * 2. Pages advertised social proof that had no source — a 4.9/127
 *    AggregateRating in JSON-LD, invented customer names with cities and star
 *    ratings. Unverifiable review markup is a manual-action risk under Google's
 *    structured data guidelines.
 *
 * 3. The sitemap drifted away from the real routes: it advertised URLs that
 *    301-redirected, omitted live pages, and shipped a blog entry with no
 *    matching article.
 *
 * Each check below is cheap and deterministic. They are not a substitute for
 * reading the content, but they stop the mechanical regressions.
 *
 * WHY THIS READS SOURCE INSTEAD OF RENDERING
 *
 * Almost every claim here is about a value that must NOT appear anywhere in a
 * corpus: no CJK or Cyrillic fragment in French legal content, no AggregateRating
 * or invented review names, no sitemap URL without a matching route. "Does this
 * string appear in any of the 636 KB of articles" is not a question with a
 * runtime answer that means anything — rendering every page to find out would
 * require a database, a browser and a sitemap crawl, and would still only sample
 * what was rendered.
 *
 * The corpus is the artefact under test, and the corpus is a file on disk. One
 * check is genuinely a runtime concern and is treated as such elsewhere: article
 * payload weight is about the build graph, not the text (see
 * article-payload-boundary.test.ts for why that one also reads source).
 */

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

const SRC = join(process.cwd(), "src");

/** Files whose content is generated or deliberately not user-facing. */
const SKIP_FILES = new Set(["src/data/articles-meta.ts"]);

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (full.includes("__tests__")) continue;
      walk(full, out);
    } else if (/\.(ts|tsx|json)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

const FILES = walk(SRC);

/**
 * Collapse a body to comparable words: lowercase, no punctuation, single
 * spaces. Used to compare article bodies for duplication without being
 * defeated by differing markdown emphasis or line breaks.
 */
function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zà-ÿ0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

describe("content integrity", () => {
  it("ships no CJK or Cyrillic characters in user-facing content", () => {
    // Han, Hiragana, Katakana, Hangul, Cyrillic, Arabic.
    const foreign = /[一-鿿぀-ヿ가-힯Ѐ-ӿ؀-ۿ]/;
    const offenders: string[] = [];

    for (const file of FILES) {
      const rel = relative(process.cwd(), file);
      if (SKIP_FILES.has(rel)) continue;

      const source = readFileSync(file, "utf8");
      source.split("\n").forEach((line, i) => {
        // Ignore lines that are pure comments: those may legitimately quote
        // the historical text we are documenting.
        const trimmed = line.trim();
        if (trimmed.startsWith("*") || trimmed.startsWith("//") || trimmed.startsWith("/*")) {
          return;
        }
        if (foreign.test(line)) {
          offenders.push(`${rel}:${i + 1} — ${trimmed.slice(0, 100)}`);
        }
      });
    }

    expect(
      offenders,
      `non-French scripts found in served content:\n${offenders.join("\n")}`
    ).toEqual([]);
  });

  it("does not emit AggregateRating or Review structured data", () => {
    // These builders only produce markup whose numbers must be verifiable.
    // They are deliberately not wired into any page.
    const offenders: string[] = [];

    for (const file of FILES) {
      const rel = relative(process.cwd(), file);
      if (!rel.startsWith("src/app/") && !rel.startsWith("src/components/")) continue;

      const source = readFileSync(file, "utf8");
      if (/buildAggregateRatingSchema|buildReviewSchema/.test(source)) {
        offenders.push(rel);
      }
    }

    expect(
      offenders,
      `Review/AggregateRating markup must not be emitted without a verifiable ` +
        `source of ratings: ${offenders.join(", ")}`
    ).toEqual([]);
  });

  it("keeps the sitemap free of redirect sources and missing pages", async () => {
    const config = readFileSync(join(process.cwd(), "next.config.ts"), "utf8");
    const redirectSources = new Set(
      [...config.matchAll(/source:\s*'(\/[^':]+)'/g)].map((m) => m[1])
    );
    const redirectDestinations = new Set(
      [...config.matchAll(/destination:\s*'(\/[^']+)'/g)].map((m) => m[1])
    );

    // Every redirect destination must resolve to a real page, otherwise it is
    // a 404 wearing a 301.
    const APP = join(SRC, "app");
    const ROUTE_GROUPS = ["(dashboard)", "(marketing)", "(outils)", "(templates)"];
    const routes = new Set<string>();

    const collect = (dir: string, segments: string[]) => {
      for (const entry of readdirSync(dir)) {
        if (ROUTE_GROUPS.includes(entry)) {
          collect(join(dir, entry), segments);
          continue;
        }
        if (entry.startsWith("[")) continue;
        const full = join(dir, entry);
        if (!statSync(full).isDirectory()) continue;
        const next = [...segments, entry];
        if (readdirSync(full).includes("page.tsx")) {
          routes.add(`/${next.join("/")}`);
        }
        collect(full, next);
      }
    };
    collect(APP, []);
    // The app directory itself is the homepage.
    routes.add("/");

    // A collector that silently under-reports is worse than no check: it makes
    // every destination look like a 404 and hides the real breakage. The app has
    // well over 100 routes, so a tiny count means the walk itself is wrong.
    expect(
      routes.size,
      `route collector found only ${routes.size} routes — the walk is broken, ` +
        "so the redirect assertions below are not meaningful"
    ).toBeGreaterThan(50);

    // Dynamic routes are resolved by data, not by the filesystem: /blog/[slug]
    // has no per-slug directory, so a redirect to an article slug must be
    // checked against the article corpus instead of `routes`.
    const articleSlugs = new Set(
      [...readFileSync(join(SRC, "data", "articles.ts"), "utf8")
        .matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1])
    );

    for (const dest of redirectDestinations) {
      if (dest === "/" || dest.includes(":")) continue;
      const isArticle = dest.startsWith("/blog/") && articleSlugs.has(dest.slice("/blog/".length));
      expect(
        routes.has(dest) || isArticle,
        `redirect destination ${dest} has no page — it would 404`
      ).toBe(true);
    }

    // A redirect source must not also be a live route: then the redirect is
    // dead code and the sitemap may advertise it.
    for (const src of redirectSources) {
      expect(
        routes.has(src),
        `${src} is a redirect source but still has a page file — remove one of the two`
      ).toBe(false);
    }
  });

  it("has no internal link pointing at a redirect source", () => {
    const config = readFileSync(join(process.cwd(), "next.config.ts"), "utf8");
    const redirectSources = [...config.matchAll(/source:\s*'(\/[^':]+)'/g)].map((m) => m[1]);
    const offenders: string[] = [];

    for (const file of FILES) {
      const rel = relative(process.cwd(), file);
      if (!rel.endsWith(".tsx")) continue;
      const source = readFileSync(file, "utf8");
      for (const target of redirectSources) {
        if (
          source.includes(`href="${target}"`) ||
          source.includes(`href: '${target}'`) ||
          source.includes(`href: "${target}"`)
        ) {
          offenders.push(`${rel} → ${target}`);
        }
      }
    }

    expect(
      offenders,
      `links to 301'd URLs (they cost a redirect hop and split internal signals):\n${offenders.join("\n")}`
    ).toEqual([]);
  });

  it("has no internal link in article bodies pointing at a non-existent page", () => {
    // Article bodies carry markdown links like [voir le modèle](/modele-bail-nu).
    // These are rendered as-is by the blog renderer, so a stale path is a real
    // 404 for a reader. 18 of 26 such links were dead before this check existed.
    const articles = readFileSync(join(SRC, "data", "articles.ts"), "utf8");
    const slugs = new Set(
      [...articles.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1])
    );

    const APP = join(SRC, "app");
    const ROUTE_GROUPS = ["(dashboard)", "(marketing)", "(outils)", "(templates)"];
    const routes = new Set<string>(["/"]);
    const collect = (dir: string, segments: string[]) => {
      for (const entry of readdirSync(dir)) {
        if (ROUTE_GROUPS.includes(entry)) {
          collect(join(dir, entry), segments);
          continue;
        }
        if (entry.startsWith("[")) continue;
        const full = join(dir, entry);
        if (!statSync(full).isDirectory()) continue;
        const next = [...segments, entry];
        if (readdirSync(full).includes("page.tsx")) routes.add(`/${next.join("/")}`);
        collect(full, next);
      }
    };
    collect(APP, []);

    // Route groups are not URL segments: /outils/x exists, /(marketing)/outils/x does not.
    const PRIVATE = ["/dashboard", "/leases", "/properties", "/tenants", "/billing",
      "/expenses", "/fiscal", "/maintenance", "/login", "/register", "/portal",
      "/offline", "/settings", "/api"];

    const dead: string[] = [];
    for (const m of articles.matchAll(/\]\((\/[^)]+)\)/g)) {
      const link = m[1];
      const ok = link.startsWith("/blog/")
        ? slugs.has(link.split("/blog/")[1])
        : routes.has(link) && !PRIVATE.some((p) => link === p || link.startsWith(`${p}/`));
      if (!ok) {
        const line = articles.slice(0, m.index).split("\n").length;
        dead.push(`src/data/articles.ts:${line} → ${link}`);
      }
    }

    expect(dead, `dead internal links in article bodies:\n${dead.join("\n")}`).toEqual([]);
  });

  it("does not duplicate or near-duplicate article bodies", () => {
    // Four articles once shipped under a promising slug while serving another
    // article's text verbatim (a "bail de parking" article carrying the text
    // about charges locatives). That is the content-farm failure mode.
    const articles = readFileSync(join(SRC, "data", "articles.ts"), "utf8");

    const bodies: { slug: string; text: string }[] = [];
    for (const m of articles.matchAll(/slug:\s*"([^"]+)"/g)) {
      const start = articles.indexOf("content:", m.index);
      if (start === -1) continue;
      const open = articles.indexOf("`", start);
      const close = articles.indexOf("\n  },", open);
      if (open === -1 || close === -1) continue;
      const body = articles.slice(open + 1, close);
      bodies.push({ slug: m[1], text: normalise(body) });
    }

    expect(bodies.length).toBeGreaterThan(100);

    const exact = new Map<string, string[]>();
    for (const { slug, text } of bodies) {
      if (text.length < 400) continue;
      const existing = exact.get(text);
      if (existing) existing.push(slug);
      else exact.set(text, [slug]);
    }
    const exactDuplicates = [...exact.values()].filter((v) => v.length > 1);
    expect(
      exactDuplicates,
      `articles sharing an identical body:\n${exactDuplicates.map((v) => v.join(" = ")).join("\n")}`
    ).toEqual([]);

    // Near-duplicates: token-set overlap above 0.9 between distinct bodies.
    const sets = bodies
      .filter((b) => b.text.length >= 400)
      .map((b) => ({ slug: b.slug, tokens: new Set(b.text.split(" ")) }));
    const near: string[] = [];
    for (let i = 0; i < sets.length; i++) {
      for (let j = i + 1; j < sets.length; j++) {
        const a = sets[i];
        const b = sets[j];
        let shared = 0;
        for (const t of a.tokens) if (b.tokens.has(t)) shared++;
        const union = a.tokens.size + b.tokens.size - shared;
        if (union > 0 && shared / union > 0.9) near.push(`${a.slug} ≈ ${b.slug}`);
      }
    }
    expect(
      near,
      `articles whose bodies are near-identical:\n${near.join("\n")}`
    ).toEqual([]);
  });

  it("has no large untranslated English blocks in French content", () => {
    // A whole article once shipped in English under a French title, and an
    // English meta description on a French page.
    //
    // This deliberately looks only at *prose* — the `description:` / `title:`
    // fields of generateMetadata and the JSON-LD `text` / `answer` strings. It
    // must not scan JSX or JSON-LD scaffolding: class names, @type values and
    // URL keys carry no French stopwords and produce hundreds of false hits.
    const offenders: string[] = [];
    // Strings that are content, not code.
    const FIELDS = [
      /description:\s*\n?\s*"([^"]{40,})"/g,
      /question:\s*\n?\s*"([^"]{40,})"/g,
      /answer:\s*\n?\s*"([^"]{40,})"/g,
      /text:\s*"([^"]{40,})"/g,
      /reviewBody:\s*"([^"]{40,})"/g,
      /excerpt:\s*\n?\s*"([^"]{40,})"/g,
    ];
    const FRENCH = new Set([
      "le", "la", "les", "de", "des", "du", "et", "un", "une", "vous", "votre", "il",
      "elle", "pour", "avec", "sur", "est", "sont", "dans", "par", "au", "aux", "ce",
      "cette", "qui", "que", "nous", "notre", "leur", "plus", "sans", "entre", "sous",
      "être", "fait", "si", "ne", "pas", "on", "en", "y", "a", "ou", "peut", "aussi",
      "comme", "tout", "son", "sa", "ses", "cela", "doit", "c'est", "n'est", "donc",
      "où", "tant", "après", "avant", "même", "dès", "les", "une", "des", "vos",
    ]);

    for (const file of FILES) {
      const rel = relative(process.cwd(), file);
      if (SKIP_FILES.has(rel)) continue;
      if (!rel.endsWith(".ts") && !rel.endsWith(".tsx")) continue;

      const source = readFileSync(file, "utf8");
      for (const pattern of FIELDS) {
        for (const m of source.matchAll(pattern)) {
          const value = m[1];
          const words = value.toLowerCase().match(/[a-zà-ÿ']+/g);
          if (!words || words.length < 12) continue;
          const french = words.filter((w) => FRENCH.has(w)).length;
          if (french / words.length < 0.06) {
            const line = source.slice(0, m.index).split("\n").length;
            offenders.push(`${rel}:${line} — ${value.slice(0, 90)}`);
          }
        }
      }
    }

    expect(
      offenders,
      `untranslated English prose in French pages:\n${offenders.join("\n")}`
    ).toEqual([]);
  });

  it("keeps every article title in properly accented French", () => {
    // 38 of 121 titles shipped with no accents at all ("Modele de lettre de
    // relance loyer impaye gratuit"). A title is the most-read string on a
    // page; it is not a place to save typing.
    const articles = readFileSync(join(SRC, "data", "articles.ts"), "utf8");

    const ACCENTS = "àâäéèêëîïôöùûüçÀÂÉÈÊËÎÏÔÖÙÛÜÇœŒ";
    /**
     * Words that only look French but legitimately carry no accent. Several of
     * these are domain terms whose correct spelling is unaccented, or titles
     * whose subject needs no accent at all ("Dossier de location : que doit
     * contenir un dossier complet ?" is fully correct as written). Flagging
     * them would train the team to ignore the check.
     */
    /**
     * French words that carry no accent in their correct spelling. A title made
     * only of these needs no diacritic — "Logiciel de gestion locative pour
     * investisseurs immobiliers" is correct French as written, and flagging it
     * would only teach the team to ignore this check.
     */
    /**
     * Words whose correct French spelling *requires* a diacritic. A title
     * containing one of these without its accent is a defect.
     *
     * This inverts the naive check for good reason: most French words are
     * legitimately unaccented ("calculer", "formule", "prix", "garant"), so
     * "the title has no accents at all" is not evidence of a problem. Only a
     * known-misspelled word is.
     */
    /**
     * Words whose correct French spelling *requires* a diacritic, paired with
     * that exact misspelling. A title containing the misspelling is a defect.
     *
     * Inverting the naive check matters here: most French words are correctly
     * unaccented — "calculer", "formule", "prix", "garant", "solidaire",
     * "comparatif", "obligations". "The title has no accent anywhere" is
     * therefore no evidence of a problem, and flagging it would only train
     * the team to ignore this check. Only a known misspelling counts.
     */
    const MISSPELLED: Record<string, string> = {      modele: "modèle",
      modeles: "modèles",
      proprietaire: "propriétaire",
      proprietaires: "propriétaires",
      locataire: "locataire",
      locataires: "locataires",
      bailleur: "bailleur",
      bailleurs: "bailleurs",
      depot: "dépôt",
      recuperable: "récupérable",
      recuperables: "récupérables",
      deductible: "déductible",
      deductibles: "déductibles",
      deduction: "déduction",
      deductions: "déductions",
      impot: "impôt",
      imposition: "imposition",
      definition: "définition",
      definitions: "définitions",
      cle: "clé",
      acces: "accès",
      succes: "succès",
      proces: "procès",
      exces: "excès",
      necessaire: "nécessaire",
      necessaires: "nécessaires",
      regle: "règle",
      regles: "règles",
      reglementation: "réglementation",
      reference: "référence",
      references: "références",
      preavis: "préavis",
      conge: "congé",
      conges: "congés",
      etat: "état",
      etats: "états",
      degradation: "dégradation",
      degradations: "dégradations",
      amelioration: "amélioration",
      renovation: "rénovation",
      reparation: "réparation",
      reparations: "réparations",
      regularisation: "régularisation",
      decompte: "décompte",
      diagnostics: "diagnostics",
      energetique: "énergétique",
      fonciere: "foncière",
      foncieres: "foncières",
      deficit: "déficit",
      deficits: "déficits",
      benefice: "bénéfice",
      saisonniere: "saisonnière",
      etudiant: "étudiant",
      etudiante: "étudiante",
      duree: "durée",
      prealable: "préalable",
      derniere: "dernière",
      reponse: "réponse",
      delai: "délai",
      delais: "délais",
      exoneree: "exonérée",
      exonere: "exonéré",
      depose: "déposé",
      annee: "année",
      annees: "années",
      periode: "période",
      periodes: "périodes",
      critere: "critère",
      criteres: "critères",
    };




    const offenders: string[] = [];
    for (const m of articles.matchAll(/\n\s*title:\s*"([^"]*)"/g)) {
      const title = m[1];
      // A word is a defect only when it appears in the title in its
      // accentless spelling. Comparing the two forms explicitly is the only
      // reliable way: a character class like [a-zà-ÿ] matches accented letters,
      // so a naive key lookup flags correctly-written words.
      const written = (title.toLowerCase().match(/[\p{L}'’-]+/gu) ?? []).map((w) =>
        w.replace(/^[dl]['’]/, "")
      );
      const missed = written.filter(
        (w) =>
          MISSPELLED[w] !== undefined &&
          // The accentless spelling really is in the title…
          written.includes(w) &&
          // …and it is not the correctly accented form of the same word.
          !written.includes(MISSPELLED[w])
      );

      if (missed.length > 0) {
        const line = articles.slice(0, m.index).split("\n").length;
        offenders.push(
          `src/data/articles.ts:${line} — "${title}" (should be: ` +
            missed.map((w) => MISSPELLED[w]).join(", ") +
            `)`
        );
      }
    }

    expect(
      offenders,
      `article titles missing French accents:\n${offenders.join("\n")}`
    ).toEqual([]);
  });
  it("gives every article a meta description of a usable length", () => {
    // 16 articles shipped with no excerpt at all, which meant 16 pages
    // rendered with no <meta name="description"> — the snippet Google shows
    // was then invented from whatever text it liked.
    const articles = readFileSync(join(SRC, "data", "articles.ts"), "utf8");

    const problems: string[] = [];
    for (const m of articles.matchAll(/slug:\s*"([^"]+)"([\s\S]{0,3000}?)content:/g)) {
      const slug = m[1];
      const head = m[2];
      const ex = head.match(/excerpt:\s*\n?\s*"([^"]*)"/);
      if (!ex) {
        problems.push(`${slug}: no excerpt`);
        continue;
      }
      const value = ex[1].trim();
      // Google truncates around 155-160 characters; below 60 there is not
      // enough to say anything useful, and above 300 it will be cut anyway.
      if (value.length < 60) {
        problems.push(`${slug}: excerpt too short (${value.length} chars)`);
      } else if (value.length > 300) {
        problems.push(`${slug}: excerpt too long (${value.length} chars)`);
      }
      if (/\*/.test(value)) {
        problems.push(`${slug}: excerpt contains markdown`);
      }
    }

    expect(
      problems,
      `article excerpts unusable as meta descriptions:\n${problems.join("\n")}`
    ).toEqual([]);
  });
  it("renders article markdown without escaped newlines leaking as text", () => {
    // An automated edit wrote literal backslash-n sequences inside the
    // template literals instead of real newlines, so the FAQ rendered as one
    // run-on line with visible "\n\n## Question" in the page body.
    const articles = readFileSync(join(SRC, "data", "articles.ts"), "utf8");

    const offenders: string[] = [];
    for (const m of articles.matchAll(/slug:\s*"([^"]+)"([\s\S]{0,60000}?)content:\s*`([\s\S]*?)`,/g)) {
      const slug = m[1];
      const body = m[3];
      const literals = (body.match(/\\n/g) || []).length;
      if (literals > 0) {
        offenders.push(`${slug}: ${literals} literal \\n sequence(s) in body`);
      }
      if (body.includes("\\*\\*")) {
        offenders.push(`${slug}: escaped markdown bold in body`);
      }
    }

    expect(
      offenders,
      `article bodies with escaped newlines / markdown:\n${offenders.join("\n")}`
    ).toEqual([]);
  });
  it("keeps every article slug usable as a URL", () => {
    // Two slugs were broken as URLs and invisible in review:
    //  - "assurance-loyer-impaye-GLI" carried an uppercase letter. Next.js
    //    normalises the path to lowercase before matching, so the article could
    //    never resolve: the sitemap URL 301'd, then 404'd.
    //  - "gestion-compte-banque-séparé" carried a non-ASCII character, which
    //    breaks sitemap percent-encoding and URL normalisation.
    const articles = readFileSync(join(SRC, "data", "articles.ts"), "utf8");

    const problems: string[] = [];
    const seen = new Set<string>();
    for (const m of articles.matchAll(/slug:\s*"([^"]*)"/g)) {
      const slug = m[1];
      const line = articles.slice(0, m.index).split("\n").length;
      if (slug !== slug.toLowerCase()) {
        problems.push(`src/data/articles.ts:${line} — uppercase in slug "${slug}"`);
      }
      if (/[^\x21-\x7e]/.test(slug)) {
        problems.push(`src/data/articles.ts:${line} — non-ASCII character in slug "${slug}"`);
      }
      if (seen.has(slug)) {
        problems.push(`src/data/articles.ts:${line} — duplicate slug "${slug}"`);
      }
      seen.add(slug);
    }

    expect(problems, `article slugs unusable as URLs:\n${problems.join("\n")}`).toEqual([]);
  });
  it("keeps every worked rent example arithmetically correct", () => {
    // Worked examples are the most trusted content on a site that explains how
    // to raise a rent: a reader copies the number into their own lease. One
    // article published a whole table of IRL values that never existed
    // (144,77 / 144,52 / 144,27 / 143,99) and an example whose result did not
    // follow from its own inputs.
    //
    // This only checks arithmetic — that the stated result follows from the
    // stated inputs. Whether an index value is real is a separate question and
    // is maintained in KNOWN_REAL_IRL below.
    const REAL_IRL = new Set([
      "148,37", "146,60", // 2026
      "145,78", "145,77", "146,68", "145,47", // 2025
      "144,64", "144,51", "145,17", "143,46", // 2024
      "141,03", "140,59", "138,61", // 2023
    ]);

    const files: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) walk(full);
        else if (full.endsWith(".ts") || full.endsWith(".tsx")) files.push(full);
      }
    };
    walk(SRC);

    const problems: string[] = [];

    // 1. worked examples must compute
    const EXAMPLE = /(\d[\d\s]*)\s*(?:€)?\s*×\s*\(?(\d{1,3},\d{2})\s*[/÷]\s*(\d{1,3},\d{2})\)?\s*=\s*(\d[\d\s]*,\d{2})/g;
    for (const file of files) {
      const rel = relative(process.cwd(), file);
      // Skip this suite's own source. It quotes the fabricated figures it was
      // written to catch ("environ 145,0") in its explanatory comment, and a
      // guard that fires on the text describing the guard is useless.
      // `rel` is "src/__tests__/…", so the test is an `includes`, not a
      // `startsWith` — the earlier form silently matched nothing.
      if (rel.includes("__tests__")) continue;
      const source = readFileSync(file, "utf8");
      for (const m of source.matchAll(EXAMPLE)) {
        const rent = parseFloat(m[1].replace(/\s/g, ""));
        const a = parseFloat(m[2].replace(",", "."));
        const b = parseFloat(m[3].replace(",", "."));
        const stated = parseFloat(m[4].replace(/\s/g, "").replace(",", "."));
        const computed = (rent * a) / b;
        if (Math.abs(computed - stated) > 0.02) {
          const line = source.slice(0, m.index).split("\n").length;
          problems.push(
            `${rel}:${line} — ${m[1].trim()} × ${m[2]}/${m[3]} = ${computed.toFixed(2)}, page states ${m[4].trim()}`
          );
        }
      }
    }

    // 2. an IRL figure must be one the INSEE actually published. Only applies
    // where a value is presented as an index, not to arbitrary percentages.
    // Only a value that directly follows the word IRL as its index — "IRL T1
    // 2025 : 145,47". Matching any number within 160 characters also catches
    // the result of a calculation ("800 x (146,60 / 145,47) = 806,21"), which
    // is not an index.
    //
    // The number pattern accepts ONE decimal as well as two. It used to require
    // two, and that is precisely how an article published four invented
    // indices in a row ("IRL Q4 2025 : environ 145,0", "environ 144,2",
    // "environ 143,5", "environ 142,8"): the guard never fired on a
    // one-decimal value, so a fabricated index passed as review. One decimal is
    // in fact a warning sign on its own — INSEE always publishes two.
    const IRL_MENTION = /\bIRL\b[^\n]{0,40}?[\s:=-](?:[A-Za-z]\d\s*)?(\d{2,3},\d{1,2})\b/g;
    for (const file of files) {
      const rel = relative(process.cwd(), file);
      if (rel.includes("__tests__")) continue;
      const source = readFileSync(file, "utf8");
      for (const m of source.matchAll(IRL_MENTION)) {
        const value = m[1];
        if (!REAL_IRL.has(value)) {
          const line = source.slice(0, m.index).split("\n").length;
          problems.push(`${rel}:${line} — IRL ${value} is not a published INSEE value`);
        }
      }
    }

    expect(
      problems,
      `worked rent examples that do not compute, or unknown IRL values:\n${problems.join("\n")}`
    ).toEqual([]);
  });
});

describe("French copy is actually French", () => {
  const ARTICLES_FILE = join(SRC, "data", "articles.ts");

  /** Article `content:` template literals, paired with their slug. */
  function articleBodies(): { slug: string; content: string }[] {
    const source = readFileSync(ARTICLES_FILE, "utf8");
    const out: { slug: string; content: string }[] = [];

    let cursor = 0;
    while (true) {
      const slugAt = source.indexOf('slug: "', cursor);
      if (slugAt < 0) break;
      const slug = /slug: "([^"]+)"/.exec(source.slice(slugAt, slugAt + 200))![1];

      const keyAt = source.indexOf("content: `", slugAt);
      if (keyAt < 0) {
        cursor = slugAt + 1;
        continue;
      }
      const start = keyAt + "content: `".length;
      const end = source.indexOf("`", start);
      if (end < 0) break;

      out.push({ slug, content: source.slice(start, end) });
      cursor = end;
    }
    return out;
  }

  /**
   * `travaux-locataire-proprietaire` shipped a list of the 1987 decree
   * maintenance obligations reading "Menus travaux de pintura et de tapisserie"
   * and "Remplacement desvitres cassées" — machine translation from Spanish, left
   * in a French article. Nothing caught it: the foreign-script guard passes on
   * Spanish, because Spanish uses Latin letters like French does.
   */
  it("contains no untranslated Spanish, Italian or Portuguese", () => {
    // Each is either wrong French or meaningless in this context, and none is a
    // legitimate French word.
    const FOREIGN = [
      /\bpintura\b/gi,
      /\bventanas\b/gi,
      /\binquilino\b/gi,
      /\bpropietario\b/gi,
      /\bcuidado\b/gi,
      /\bmanutenzione\b/gi,
      /\briparazioni\b/gi,
    ];

    const problems: string[] = [];
    for (const file of FILES) {
      const rel = relative(process.cwd(), file);
      if (rel.includes("__tests__")) continue;
      const source = readFileSync(file, "utf8");
      for (const pattern of FOREIGN) {
        for (const m of source.matchAll(pattern)) {
          const line = source.slice(0, m.index).split("\n").length;
          problems.push(`${rel}:${line} — "${m[0]}" is not French`);
        }
      }
    }

    expect(
      problems,
      `untranslated copy in French content:\n${problems.join("\n")}`
    ).toEqual([]);
  });

  /**
   * 40 of the 119 articles had lost accents on legal vocabulary: "preavis",
   * "delais", "etat des lieux", "proprietaire", "restitue", "recuperables".
   * Correct French is "préavis", "délais", "état des lieux", "propriétaire",
   * "restitué", "récupérables".
   *
   * Scoped to article bodies only. Slugs stay unaccented on purpose — they are
   * URLs, and /modele-bail must not become /modèle-bail.
   */
  it("keeps accents on legal vocabulary inside article bodies", () => {
    const MUST_BE_ACCENTED: Record<string, string> = {
      preavis: "préavis",
      delai: "délai",
      delais: "délais",
      proprietaire: "propriétaire",
      proprietaires: "propriétaires",
      restitue: "restitué",
      recuperables: "récupérables",
      echeance: "échéance",
      echeances: "échéances",
      prelevement: "prélèvement",
      reglement: "règlement",
      verification: "vérification",
      apres: "après",
      deja: "déjà",
      prealable: "préalable",
      prevu: "prévu",
      prevue: "prévue",
      prevus: "prévus",
      prevues: "prévues",
      cree: "créé",
      creee: "créée",
      genere: "généré",
      depose: "déposé",
      interet: "intérêt",
      cheque: "chèque",
      cheques: "chèques",
      reparations: "réparations",
      reparation: "réparation",
      evenement: "événement",
      evenements: "événements",
      // "etat" is deliberately absent: it also appears inside correct forms like
      // "restituee" in other scripts, and "Etat" starts some proper nouns. The
      // specific phrase is checked separately below.
    };

    const problems: string[] = [];
    for (const article of articleBodies()) {
      for (const [wrong, right] of Object.entries(MUST_BE_ACCENTED)) {
        const pattern = new RegExp(
          `(?<![\\wà-ÿ])${wrong}(?![\\wà-ÿ])`,
          "i"
        );
        const match = article.content.match(pattern);
        if (match) {
          problems.push(`${article.slug} — "${match[0]}" should be "${right}"`);
        }
      }
    }

    expect(
      problems,
      `missing accents in article bodies:\n${problems.join("\n")}`
    ).toEqual([]);
  });

  it("writes \"état des lieux\" with its accents", () => {
    const problems: string[] = [];
    for (const article of articleBodies()) {
      const match = article.content.match(/(?<![\wà-ÿ])etat des lieux(?![\wà-ÿ])/i);
      if (match) problems.push(`${article.slug} — "${match[0]}" should be "état des lieux"`);
    }
    expect(
      problems,
      `missing accents in article bodies:\n${problems.join("\n")}`
    ).toEqual([]);
  });

  /**
   * URLs are ASCII, without exception.
   *
   * Fixing the missing accents applied the same map to article bodies, and the
   * bodies contain markdown links — so `/guides/modele-bail` became
   * `/guides/modèle-bail` and `/templates/etat-des-lieux` became
   * `/templates/état-des-lieux`. Seven links in four articles pointed at pages
   * that do not exist: accents stripped, links broken. The existing dead-link
   * guard is what caught it.
   */
  it("keeps internal links ASCII, because slugs are", () => {
    const problems: string[] = [];

    for (const file of FILES) {
      const rel = relative(process.cwd(), file);
      if (rel.includes("__tests__")) continue;
      const source = readFileSync(file, "utf8");

      for (const m of source.matchAll(/\]\((\/[^)\s]*)\)/g)) {
        if ([...m[1]].some((c) => c.charCodeAt(0) > 127)) {
          const line = source.slice(0, m.index).split("\n").length;
          problems.push(`${rel}:${line} — link "${m[1]}" contains non-ASCII`);
        }
      }
    }

    expect(
      problems,
      `accents inside a URL make it a dead link:\n${problems.join("\n")}`
    ).toEqual([]);
  });

  it("does not fuse a French article with the next word", () => {
    // Machine translation also dropped the space: "desvitres" for "des vitres",
    // "Remplacement desvitres cassées".
    //
    // Scoped to "des" + a known French noun. A bare `des[a-z]{4,}` rule matches
    // perfectly good French — "desaccord", "dessous", "Description" — so it
    // reports noise rather than the defect it was written for.
    const NOUNS = [
      "vitres", "lieux", "reparations", "charges", "loyers", "locataires",
      "biens", "cles", "communes", "parties", "travaux", "comptes",
    ];

    const problems: string[] = [];
    for (const article of articleBodies()) {
      for (const noun of NOUNS) {
        const pattern = new RegExp(`(?<![\\wà-ÿ])des${noun}(?![\\wà-ÿ])`, "i");
        const match = article.content.match(pattern);
        if (match) problems.push(`${article.slug} — "${match[0]}" should be "des ${noun}"`);
      }
    }

    expect(
      problems,
      `words fused together, usually by machine translation:\n${problems.join("\n")}`
    ).toEqual([]);
  });
});
