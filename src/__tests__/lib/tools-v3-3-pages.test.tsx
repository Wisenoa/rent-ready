/**
 * SSR / DOM tests for all 14 refactored V3.3 free tool pages:
 * verifies single <h1>, single JSON-LD BreadcrumbList & WebApplication,
 * worked examples rendered server-side before JS runs, and official legal references.
 */
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import GenerateurQuittancePage from "@/app/(marketing)/outils/generateur-quittance/page";
import ModeleQuittancePdfPage from "@/app/(outils)/outils/modele-quittance-loyer-pdf/page";
import LettreRelancePage from "@/app/(marketing)/outils/lettre-relance-loyer/page";
import CongeVentePage from "@/app/(marketing)/outils/generateur-conge-vente/page";
import RendementPage from "@/app/(marketing)/outils/calculateur-rendement/page";
import CalculateurLoyerPage from "@/app/(marketing)/outils/calculateur-loyer/page";
import PretImmobilierPage from "@/app/(marketing)/outils/simulateur-pret-immobilier/page";
import PlusValuePage from "@/app/(marketing)/outils/calculateur-plus-value/page";
import FiscaliteLmnpPage from "@/app/(marketing)/outils/simulateur-fiscalite-lmnp/page";
import LoiJeanbrunPage from "@/app/(outils)/outils/simulateur-loi-jeanbrun/page";
import DepotGarantiePage from "@/app/(marketing)/outils/calculateur-depot-garantie/page";
import PreavisPage from "@/app/(marketing)/outils/calculateur-preavis/page";
import ChecklistEtatLieuxPage from "@/app/(marketing)/outils/checklist-etat-lieux/page";
import SurfaceHabitablePage from "@/app/(marketing)/outils/calculateur-surface-habitable/page";

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

const PAGES = [
  {
    slug: "/outils/generateur-quittance",
    Component: GenerateurQuittancePage,
    expectedH1: "Générateur de quittance de loyer PDF",
    expectedSnippet: "article 21 de la loi n° 89-462 du 6 juillet 1989",
  },
  {
    slug: "/outils/modele-quittance-loyer-pdf",
    Component: ModeleQuittancePdfPage,
    expectedH1: "Modèle de quittance de loyer PDF gratuit (conforme loi de 1989)",
    expectedSnippet: "reçu de paiement partiel",
  },
  {
    slug: "/outils/lettre-relance-loyer",
    Component: LettreRelancePage,
    expectedH1: "Générateur de lettre de relance de loyer impayé",
    expectedSnippet: "article 24 de la loi du 6 juillet 1989",
  },
  {
    slug: "/outils/generateur-conge-vente",
    Component: CongeVentePage,
    expectedH1: "Générateur de congé pour vente (bail vide et meublé)",
    expectedSnippet: "article 15 II de la loi du 6 juillet 1989",
  },
  {
    slug: "/outils/calculateur-rendement",
    Component: RendementPage,
    expectedH1: "Calculateur de rentabilité et rendement locatif",
    expectedSnippet: "Rendement brut",
  },
  {
    slug: "/outils/calculateur-loyer",
    Component: CalculateurLoyerPage,
    expectedH1: "Calculateur de prorata de loyer et de loyer au m²",
    expectedSnippet: "jours calendaires",
  },
  {
    slug: "/outils/simulateur-pret-immobilier",
    Component: PretImmobilierPage,
    expectedH1: "Simulateur de prêt immobilier et tableau d'amortissement",
    expectedSnippet: "Tableau d'amortissement annuel",
  },
  {
    slug: "/outils/calculateur-plus-value",
    Component: PlusValuePage,
    expectedH1: "Calculateur de plus-value immobilière",
    expectedSnippet: "22 ans",
  },
  {
    slug: "/outils/simulateur-fiscalite-lmnp",
    Component: FiscaliteLmnpPage,
    expectedH1: "Simulateur de fiscalité LMNP (Micro-BIC vs Régime Réel)",
    expectedSnippet: "article 39 C du CGI",
  },
  {
    slug: "/outils/simulateur-loi-jeanbrun",
    Component: LoiJeanbrunPage,
    expectedH1: "Simulateur loi Jeanbrun : amortissement dégressif sur 9 ans vs LMNP",
    expectedSnippet: "5,5 %",
  },
  {
    slug: "/outils/calculateur-depot-garantie",
    Component: DepotGarantiePage,
    expectedH1: "Calculateur de dépôt de garantie : plafond légal et restitution",
    expectedSnippet: "article 22 de la loi du 6 juillet 1989",
  },
  {
    slug: "/outils/calculateur-preavis",
    Component: PreavisPage,
    expectedH1: "Calculateur de préavis de location (locataire et propriétaire)",
    expectedSnippet: "quantième à quantième",
  },
  {
    slug: "/outils/checklist-etat-lieux",
    Component: ChecklistEtatLieuxPage,
    expectedH1: "Checklist d'état des lieux d'entrée et de sortie",
    expectedSnippet: "décret n° 2016-382 du 30 mars 2016",
  },
  {
    slug: "/outils/calculateur-surface-habitable",
    Component: SurfaceHabitablePage,
    expectedH1: "Calculateur de surface habitable (loi Boutin)",
    expectedSnippet: "1,80 m",
  },
] as const;

describe("V3.3 free tool pages — SSR & SEO integrity", () => {
  it.each(PAGES)(
    "$slug renders a single H1, non-duplicated JSON-LD, and its server-side worked example",
    ({ Component, expectedH1, expectedSnippet }) => {
      const html = text(renderToStaticMarkup(<Component />));

      // Exactly 1 H1
      expect(html.match(/<h1/g)).toHaveLength(1);
      expect(html).toContain(expectedH1);

      // Worked example / regulatory content present before JS runs
      expect(html).toContain(expectedSnippet);

      // JSON-LD has exactly 1 BreadcrumbList and 1 WebApplication
      const types = jsonLdTypes(html);
      expect(types.filter((t) => t === "BreadcrumbList")).toHaveLength(1);
      expect(types.filter((t) => t === "WebApplication")).toHaveLength(1);
    }
  );
});
