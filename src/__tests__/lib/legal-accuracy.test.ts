/**
 * Legal-accuracy guards for statements that were published backwards.
 *
 * The corpus is AI-assisted and the failures are not typos: they are confident,
 * plausible, and inverted. Each rule below was a live error on a page a French
 * landlord reads to decide something with a deadline attached — how long they
 * have to give notice, whether a property can still be rented, what the deposit
 * ceiling is, which interest rate applies.
 *
 * This is deliberately narrow. It does not attempt to validate French rental
 * law in general: it pins the handful of statements that were wrong, because
 * those are the ones that were read and acted on. A rule that was right cannot
 * silently flip without someone noticing that the sentence moved.
 *
 * Sources, checked 2026-10-04:
 *  - loi n° 89-462 du 6 juillet 1989, art. 15 (délais de préavis) — legifrance
 *  - loi Climat et Résilience n° 2021-1104, art. 160 (calendrier DPE)
 *  - art. 22 loi 89-462 (dépôt de garantie, plafonds 1 mois / 2 mois)
 *  - arrêté du 26 juin 2026 (taux d'intérêt légal, 2e semestre 2026)
 *  - Action Logement / Visale, plafonds en vigueur depuis le 6 janvier 2026
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const ARTICLES = readFileSync(
  join(process.cwd(), "src", "data", "articles.ts"),
  "utf8"
);

/** Body of a single article, so a rule cannot be satisfied by another page. */
function articleBody(slug: string): string {
  const start = ARTICLES.indexOf(`slug: "${slug}"`);
  expect(start, `article ${slug} not found`).toBeGreaterThan(-1);
  const next = ARTICLES.indexOf('slug: "', start + 10);
  return ARTICLES.slice(start, next === -1 ? undefined : next);
}

describe("notice periods (article 15, loi 89-462)", () => {
  /**
   * The rule is not zone-dependent. Three months for the tenant, six for the
   * landlord, everywhere in France. The 1-month reduction is a personal
   * allowance (first job, transfer, job loss, over-60 on health grounds,
   * RMI beneficiary), not a geographic one.
   */
  it("never states that the tenant's notice depends on the zone", () => {
    const wrong = [
      /zone\s+tendue[^.\n]{0,80}pr[ée]avis\s+(?:est\s+)?de\s+3\s+mois/i,
      /zone\s+non[\s-]tendue[^.\n]{0,80}pr[ée]avis\s+(?:est\s+)?de\s+1\s+mois/i,
      /pr[ée]avis[^.\n]{0,60}est\s+toujours\s+r[ée]duit/i,
      /d[ée]lai\s+de\s+pr[ée]avis[^.\n]{0,60}varie\s+selon\s+la\s+zone/i,
    ];
    for (const re of wrong) {
      expect(ARTICLES, `found: ${re}`).not.toMatch(re);
    }
  });

  it("gives the tenant 3 months and the landlord 6 months", () => {
    const locataire = articleBody(
      "droits-et-obligations-locataire-guide-complet"
    );
    expect(locataire).toMatch(/3\s+mois/);
    expect(locataire).toMatch(/1\s+mois/);
    expect(locataire).toMatch(/article\s+15/i);

    const bailleur = articleBody("donner-conge-locataire-bailleur");
    expect(bailleur).toMatch(/6\s+mois/);
    expect(bailleur).toMatch(/3\s+mois/);
    expect(bailleur).toMatch(/article\s+15/i);
  });
});

describe("energy performance (DPE) rental bans", () => {
  /**
   * G is banned since 2025-01-01, F from 2028-01-01, E from 2034-01-01. The
   * corpus told a landlord that F and G had both been unbillable "since 2023",
   * which would have caused a landlord to refuse to rent a property that was
   * still perfectly legal to let.
   */
  it("does not claim F is already unbillable", () => {
    expect(ARTICLES).not.toMatch(
      /logements\s+F\s+et\s+G\s+sont\s+interdits\s+[àa]\s+la\s+location/i
    );
    expect(ARTICLES).not.toMatch(/F\s+ou\s+G[^.\n]{0,80}2023/i);
  });

  it("states the real calendar for the paris page", () => {
    const paris = articleBody("gestion-locative-paris");
    expect(paris).toMatch(/1er\s+janvier\s+2025/); // G
    expect(paris).toMatch(/1er\s+janvier\s+2028/); // F
    expect(paris).toMatch(/1er\s+janvier\s+2034/); // E
  });
});

describe("who is liable for tenant damage", () => {
  it("does not tell a landlord they are liable for the tenant's damage", () => {
    expect(ARTICLES).not.toMatch(
      /bailleur\s+peut-il\s+[êe]tre\s+tenu\s+responsable\s+des\s+d[ée]gradations\s*\?[\s\S]{0,40}?Oui/i
    );
  });

  it("puts the liability on the tenant and on the deposit", () => {
    const bailleur = articleBody(
      "droits-et-obligations-bailleur-guide-complet"
    );
    expect(bailleur).toMatch(/d[ée]gradations/);
    expect(bailleur).toMatch(/d[ée]p[ôo]t\s+de\s+garantie/);
    expect(bailleur).toMatch(/[ée]tat\s+des\s+lieux/i);
  });
});

describe("legal interest rate", () => {
  /**
   * Fixed by order every six months. 2nd half of 2026: 6.84 % for a private
   * creditor. The corpus published a flat "5 % in 2026", which matches no
   * semester and no creditor status.
   */
  it("never quotes a bare annual legal rate", () => {
    expect(ARTICLES).not.toMatch(
      /taux\s+l[ée]gal\s+de\s+5\s*%\s+en\s+2026/i
    );
  });

  it("quotes the rate in force for the second half of 2026", () => {
    expect(ARTICLES).toMatch(/6,84\s*%/);
    expect(ARTICLES).toMatch(/26\s+juin\s+2026/);
  });
});

describe("Visale", () => {
  it("uses the ceilings in force since 6 January 2026", () => {
    const visale = articleBody("garantie-visale-fonctionnement-eligibilite");
    expect(visale).toMatch(/1\s*940\s*€/);
    expect(visale).toMatch(/1\s*575\s*€/);
    expect(visale).toMatch(/1\s*365\s*€/);
    // The pre-2026 ceilings must be gone.
    expect(visale).not.toMatch(/1\s*500\s*€/);
    expect(visale).not.toMatch(/1\s*300\s*€/);
  });

  it("scopes the 36 months to the first three years of the lease", () => {
    const visale = articleBody("garantie-visale-fonctionnement-eligibilite");
    expect(visale).toMatch(/36\s+premiers\s+mois/i);
  });
});

describe("deposit ceiling", () => {
  /**
   * Article 22 of loi 89-462: 1 month for an unfurnished lease, 2 months for a
   * furnished one — in every zone, since ALUR 2014.
   */
  it("never grants 2 months to an unfurnished lease", () => {
    expect(ARTICLES).not.toMatch(
      /2\s+mois[^.\n]{0,90}location(?:s)?\s+vides?\s+et\s+meubl[ée]es?/i
    );
  });
});