/**
 * /outils/calculateur-irl, /outils/calculateur-charges-locatives and /outils as
 * the server renders them: what a visitor and a crawler get before any script
 * runs. The interactions are covered by e2e/premium-tools.spec.ts.
 */
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import IrlPage from "@/app/(marketing)/outils/calculateur-irl/page";
import ChargesPage from "@/app/(marketing)/outils/calculateur-charges-locatives/page";
import OutilsPage from "@/app/(marketing)/outils/page";

// React separates adjacent text nodes with comments; Intl uses no-break spaces.
const text = (html: string) =>
  html
    .replace(/<!-- -->/g, "")
    .replace(/[  ]/g, " ")
    .replace(/&#x27;/g, "'");

function jsonLdTypes(html: string): string[] {
  return [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].flatMap((m) => {
    const data = JSON.parse(m[1]);
    const nodes = data["@graph"] ?? [data];
    return nodes.map((node: { "@type": string }) => node["@type"]);
  });
}

describe("calculateur IRL", () => {
  const html = text(renderToStaticMarkup(<IrlPage />));

  it("keeps a single H1 with the same wording", () => {
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain("Calculateur IRL — Indice de Référence des Loyers</h1>");
  });

  it("renders the worked example with the latest published index before any script runs", () => {
    // Default quarter: the latest published, T3 2026 = 148,06 against T3 2025 = 145,77.
    expect(html).toContain("Exemple pour 800 €");
    expect(html).toContain("812,57 €");
    expect(html).toContain("+12,57 €");
    expect(html).toContain("+150,84 €");
    expect(html).toContain("+1,57 %");
    expect(html).toMatch(/800,00 € × 148,06 ÷ 145,77 =\s*<strong[^>]*>812,57 €/);
    // No Journal officiel date for T3 2026 yet: the source says INSEE released it.
    expect(html).toContain("T3 2026 publié par l'INSEE le 15 octobre 2026");
  });

  it("labels every field and offers the four quarters as radio buttons", () => {
    expect(html).toMatch(/<label for="loyer"[^>]*>Loyer mensuel hors charges<\/label>/);
    expect(html).toMatch(/<label for="indice"[^>]*>Indice de l'année de révision<\/label>/);
    expect(html.match(/type="radio"[^>]*name="trimestre"/g)).toHaveLength(4);
    expect(html).toContain('inputMode="decimal"');
  });

  it("states the conditions of a revision with their source", () => {
    expect(html).toContain("clause de révision annuelle");
    expect(html).toContain("sans effet rétroactif");
    expect(html).toContain("24 août 2022");
    expect(html).toContain("https://www.service-public.gouv.fr/particuliers/vosdroits/F13723");
  });

  it("shows the published history, latest first, and nothing beyond it", () => {
    expect(html).toMatch(/<th scope="row"[^>]*>T3 2026<\/th><td[^>]*>148,06<\/td>/);
    expect(html).not.toContain("T4 2026</th>");
  });

  it("links the guide, the letter, the lease template and the glossary in its text", () => {
    for (const href of ["/guides/irl-2026", "/templates/augmentation-de-loyer", "/templates/bail-vide", "/glossaire-immobilier/irl-indice-reference-loyers", "/register", "/gestion-locative"]) {
      expect(html, href).toContain(`href="${href}"`);
    }
  });

  it("keeps its structured data types", () => {
    expect(jsonLdTypes(html)).toEqual(expect.arrayContaining(["HowTo", "WebApplication", "BreadcrumbList"]));
  });

  it("promises nothing Lokna does not do", () => {
    expect(html).not.toMatch(/automatiquement|envoy(é|ée|er) au locataire|PDF|en 2 clics/i);
  });
});

describe("calculateur de charges", () => {
  const html = text(renderToStaticMarkup(<ChargesPage />));

  it("keeps a single H1 with the same wording", () => {
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain("Calculateur de Charges Locatives</h1>");
  });

  it("renders the example regularisation before any script runs", () => {
    expect(html).toContain(">Exemple<");
    expect(html).toContain("220,00 €");
    expect(html).toContain("à régler par le locataire");
    expect(html).toContain("100,00 € × 12 mois");
  });

  it("asks first whether the lease uses provisions or a forfait", () => {
    expect(html.match(/type="radio"[^>]*name="regime"/g)).toHaveLength(2);
    expect(html).toContain("Bail mobilité : toujours un forfait");
  });

  it("no longer treats taxe foncière, insurance or vacancy as rental charges", () => {
    expect(html).not.toMatch(/Vacance locative|~15% du loyer|Revenu net annuel|décret de 1982|décret du 30 août 1982/);
    expect(html).toContain("Ne sont pas récupérables : la taxe foncière");
  });

  it("cites the rules it applies", () => {
    expect(html).toContain("article 23 de la loi du 6 juillet 1989");
    expect(html).toContain("décret du 26 août 1987");
    expect(html).toContain("https://www.service-public.gouv.fr/particuliers/vosdroits/F947");
  });

  it("keeps its structured data types, with one breadcrumb list", () => {
    const types = jsonLdTypes(html);
    expect(types).toEqual(expect.arrayContaining(["HowTo", "WebApplication", "BreadcrumbList", "FAQPage"]));
    expect(types.filter((t) => t === "BreadcrumbList")).toHaveLength(1);
  });

  it("links the charges list, the template and the product pages in its text", () => {
    for (const href of ["/blog/charges-locatives-recuperables-liste-2026", "/templates/repartition-charges", "/bail", "/quittances", "/register"]) {
      expect(html, href).toContain(`href="${href}"`);
    }
  });
});

describe("hub /outils", () => {
  const html = text(renderToStaticMarkup(<OutilsPage />));

  it("puts the two calculators first, with a preview computed from their data", () => {
    const featured = html.slice(html.indexOf("essentiels-title"), html.indexOf('id="loyer"'));
    expect(featured).toContain('href="/outils/calculateur-irl"');
    expect(featured).toContain('href="/outils/calculateur-charges-locatives"');
    expect(featured).toContain("T3 2026 · 148,06");
    expect(featured).toContain("+1,57 % sur un an");
    expect(featured).toContain("= 220,00 € à régler");
  });

  it("still lists every tool once in its group", () => {
    for (const href of ["/outils/calculateur-loyer", "/outils/generateur-quittance", "/outils/simulateur-fiscalite-lmnp"]) {
      expect(html.split(`href="${href}"`).length - 1, href).toBe(1);
    }
  });
});
