/**
 * V3.1.1 — pillar guides linked from their clusters, no unverifiable review
 * claims, and the legal rules on rent revision and deposits stated correctly.
 *
 * Sources (checked 14/10/2026): service-public.gouv.fr F13723 (révision: within
 * one year, from the date of the request, not retroactive); ANIL (registered
 * letter "vivement conseillé", i.e. advised, not required); loi n° 89-462
 * art. 17-1 (révision), art. 22 (dépôt: 1 or 2 months, +10 % per month late),
 * art. 7-1 (three-year limitation).
 */
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

import glossary from "@/data/glossary.json";
import { NAV_GROUPS } from "@/components/marketing/site/nav-data";
import { TOOL_LINKS } from "@/components/marketing/site/tool-links";

const ROOT = process.cwd();
const read = (path: string) => readFileSync(join(ROOT, path), "utf8");
/** Source without comments: a comment may quote a removed wording on purpose. */
const code = (path: string) =>
  read(path)
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");

function files(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(join(ROOT, dir))) {
    const full = join(ROOT, dir, entry);
    if (statSync(full).isDirectory()) out.push(...files(relative(ROOT, full)));
    else if (/\.(tsx?|json)$/.test(entry)) out.push(relative(ROOT, full));
  }
  return out;
}
const PUBLIC = [
  ...files("src/app/(marketing)"),
  ...files("src/app/(outils)"),
  ...files("src/app/(templates)"),
  ...files("src/components/seo"),
  ...files("src/components/marketing"),
  "src/data/articles.ts",
  "src/data/glossary.json",
];
const offenders = (pattern: RegExp) => PUBLIC.filter((f) => pattern.test(code(f)));

const QUITTANCE = "/guides/quittance-loyer";
const DEPOT = "/guides/depot-garantie";

describe("guides piliers", () => {
  it("both guides are in the Guides & ressources menu (one click from any page)", () => {
    const hrefs = NAV_GROUPS.find((g) => g.id === "ressources")!.links.map((l) => l.href);
    expect(hrefs).toContain(QUITTANCE);
    expect(hrefs).toContain(DEPOT);
  });

  it.each([
    ["src/app/(marketing)/guides/page.tsx", QUITTANCE],
    ["src/app/(marketing)/guides/page.tsx", DEPOT],
    ["src/app/(marketing)/quittances/page.tsx", QUITTANCE],
    ["src/app/(templates)/templates/recu-loyer/page.tsx", QUITTANCE],
    ["src/app/(marketing)/bail/page.tsx", DEPOT],
    ["src/app/(templates)/templates/bail-vide/page.tsx", DEPOT],
    ["src/app/(templates)/templates/bail-meuble/page.tsx", DEPOT],
    ["src/app/(templates)/templates/etat-des-lieux/page.tsx", DEPOT],
    ["src/app/(templates)/templates/protocol-etat-des-lieux/page.tsx", DEPOT],
  ])("%s links %s", (file, guide) => {
    expect(read(file)).toMatch(new RegExp(`href(?:=|: )"${guide}"`));
  });

  it("their tools point back to them", () => {
    expect(TOOL_LINKS["/outils/generateur-quittance"].learn?.href).toBe(QUITTANCE);
    expect(TOOL_LINKS["/outils/modele-quittance-loyer-pdf"].learn?.href).toBe(QUITTANCE);
    expect(TOOL_LINKS["/outils/calculateur-depot-garantie"].learn?.href).toBe(DEPOT);
    expect(TOOL_LINKS["/outils/checklist-etat-lieux"].learn?.href).toBe(DEPOT);
  });

  it("the matching glossary entries link them", () => {
    const links = (slug: string) => glossary.find((e) => e.slug === slug)?.seeFurtherLinks ?? [];
    expect(links("quittance-loyer")).toContain(QUITTANCE);
    expect(links("depot-garantie")).toContain(DEPOT);
    expect(links("etat-des-lieux")).toContain(DEPOT);
  });
});

describe("aucune validation experte inventée", () => {
  it("the content badge states a date, not a review", () => {
    const badge = code("src/components/seo/ContentReviewBadge.tsx");
    expect(badge).not.toMatch(/expert-vérifié|Définition vérifiée|Contenu juridique revu|Outil recalculé|ShieldCheck/);
  });

  it("no public page claims lawyers drafted or reviewed the content", () => {
    expect(offenders(/expert-vérifié|juristes spécialisés|préparé par des juristes|élaborés? en collaboration avec des juristes/i)).toEqual([]);
  });
});

describe("règles juridiques", () => {
  it("the IRL revision has no mandatory registered letter and no notice period", () => {
    expect(offenders(/doit informer le locataire de la révision par (?:lettre recommandée|LRAR)/i)).toEqual([]);
    expect(offenders(/révision[^.]{0,80}doit être notifiée[^.]{0,60}recommandée/i)).toEqual([]);
    expect(
      offenders(/au moins [123] mois avant la date (?:d'application|d'anniversaire|anniversaire|de révision)|délai d'information \(en général 1 mois/i)
    ).toEqual([]);
  });

  it("deposit restitution is one or two months, and lateness costs 10 % per month, not legal interest", () => {
    const guide = read("src/app/(marketing)/guides/depot-garantie/page.tsx");
    expect(guide).not.toMatch(/intérêts au taux légal|des intérêts s'appliquent|2 mois après sortie|Restituer le dépôt dans les 2 mois/);
    expect(guide).toMatch(/10 % du loyer mensuel hors charges/);
    expect(guide).toMatch(/un mois/);
  });

  it("the deposit cap depends on furnished or not, never on zone tendue", () => {
    expect(offenders(/2 mois en zone tendue/i)).toEqual([]);
  });

  it("the quittance guide does not claim Lokna emails the quittance", () => {
    const guide = read("src/app/(marketing)/guides/quittance-loyer/page.tsx");
    expect(guide).not.toMatch(/envoyer directement au locataire par email|Envoyez-les directement par email/);
  });
});
