/**
 * Marketing claims must describe the product that exists (AGENTS.md §37).
 *
 * The SEO audit of October 2026 found a bank synchronisation ("Open Banking
 * DSP2") promised on 109 public pages while no screen lets a landlord connect a
 * bank; Pro advertised OCR, Factur-X and automatic reminders that no plan gates
 * and production does not run; and the quittance pages taught legal rules that
 * article 21 of the loi du 6 juillet 1989 does not contain.
 *
 * Payments are recorded by the landlord. The quittance is generated when the
 * recorded payments settle the month; a partial payment gets a receipt. Lokna
 * does not email the quittance. Starter and Pro differ only by the number of
 * properties.
 *
 * Legal pages (CGU, privacy, cookies) are excluded on purpose: their DSP2
 * wording is awaiting legal review and must not be rewritten by an engineer.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

import { PLANS } from "@/data/entity";

const ROOT = process.cwd();
const SRC = join(ROOT, "src");

/** Legal texts and internal mock-ups: not product claims, or not ours to edit. */
const EXCLUDED = [
  "src/app/(marketing)/cgu/",
  "src/app/(marketing)/politique-confidentialite/",
  "src/app/(marketing)/politique-cookies/",
  "src/app/design-preview/",
  // The provider webhook is code, not copy.
  "src/app/api/",
];

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (entry === "__tests__" || entry === "node_modules") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...sourceFiles(full));
    else if (/\.(tsx?|json)$/.test(entry)) out.push(full);
  }
  return out;
}

function marketingFiles(): Array<{ path: string; text: string }> {
  return sourceFiles(SRC)
    .map((full) => ({ path: relative(ROOT, full), full }))
    .filter(({ path }) => !EXCLUDED.some((prefix) => path.startsWith(prefix)))
    .map(({ path, full }) => ({ path, text: readFileSync(full, "utf8") }));
}

function offenders(pattern: RegExp): string[] {
  return marketingFiles()
    .filter(({ text }) => pattern.test(text))
    .map(({ path }) => path);
}

describe("promesses commerciales", () => {
  it("never promises a bank connection the product does not offer", () => {
    expect(offenders(/open ?banking|\bDSP2\b|synchroni[sz]ation bancaire/i)).toEqual([]);
    expect(
      // "Faut-il connecter son compte bancaire ? Non." is the honest answer and
      // must stay allowed; the imperative is the promise.
      offenders(/connectez (?:votre|son) compte bancaire|se connecte à votre banque/i)
    ).toEqual([]);
  });

  it("never claims payments are detected or reconciled automatically", () => {
    expect(
      offenders(
        /d[ée]tect\w* (?:automatiquement )?(?:les |des )?(?:virements|paiements entrants)|rapproch\w* automatiquement/i
      )
    ).toEqual([]);
  });

  it("never claims the quittance is emailed by Lokna", () => {
    expect(
      offenders(/envoi (?:email|e-mail) (?:instantané|automatique|direct)|envoyée? automatiquement par e-?mail/i)
    ).toEqual([]);
  });

  it("does not sell Starter and Pro on features that are not gated or not running", () => {
    const pro = PLANS.find((p) => p.id === "pro");
    expect(pro?.summary).not.toMatch(/OCR|Factur-X|relance automatique/i);

    const pricing = readFileSync(join(SRC, "app/(marketing)/pricing/page.tsx"), "utf8");
    expect(pricing).toContain(
      "Les deux formules donnent accès aux fonctionnalités de gestion locative actuellement disponibles dans Lokna."
    );
    // The comparison table must not mark any feature as missing from Starter.
    expect(pricing).not.toMatch(/❌/);
  });
});

describe("exactitude juridique des pages quittance", () => {
  const QUITTANCE_COPY = [
    "src/app/(marketing)/outils/generateur-quittance/calculator-client.tsx",
    "src/app/(marketing)/quittances/page.tsx",
    "src/app/(marketing)/quittances/[ville]/page.tsx",
    "src/app/(outils)/outils/modele-quittance-loyer-pdf/page.tsx",
  ];

  it.each(QUITTANCE_COPY)("%s invents no deadline and no IRL mention", (path) => {
    const text = readFileSync(join(ROOT, path), "utf8");
    // Article 21 sets no deadline for the quittance.
    expect(text).not.toMatch(/24 ?(?:heures|h)\b|dans un délai d'un mois/);
    // The IRL is not a mention of the quittance.
    expect(text).not.toMatch(/mention IRL|Indice IRL INSEE intégré|doit mentionner l'indice/i);
    // The reference rent belongs in the lease, not on the quittance.
    expect(text).not.toMatch(/quittance doit (?:également )?mentionner[^.]*loyer de référence/i);
  });

  it("dates the electronic quittance to the loi ALUR of 2014, not 2024", () => {
    const text = readFileSync(join(ROOT, "src/app/(marketing)/quittances/[ville]/page.tsx"), "utf8");
    expect(text).not.toContain("loi du 24 mars 2024");
  });
});

describe("contenu non sourcé", () => {
  it("publishes no rent figures attributed to an unverifiable source", () => {
    expect(offenders(/CLAMEU/)).toEqual([]);
  });

  it("contains no Spanish leftovers in French copy", () => {
    expect(offenders(/pequeños/)).toEqual([]);
  });
});
