/**
 * GET /api/seo/calculator/[slug]/schema
 * Returns WebApplication schema.org JSON-LD for calculator pages.
 *
 * Slugs: calculateur-irl-2026, calculateur-depot-garantie,
 *        lettre-relance-loyer, modele-bail-location,
 *        modele-quittance-loyer-pdf, simulateur-loi-jeanbrun,
 *        calculateur-rendement-locatif
 *
 * Cache: public, max-age=3600, stale-while-revalidate=86400
 * Response: < 50ms
 */
import { NextRequest, NextResponse } from "next/server";

const VALID_CALCULATORS = [
  "calculateur-irl-2026",
  "calculateur-depot-garantie",
  "lettre-relance-loyer",
  "modele-bail-location",
  "modele-quittance-loyer-pdf",
  "simulateur-loi-jeanbrun",
  "calculateur-rendement-locatif",
] as const;

type CalculatorSlug = (typeof VALID_CALCULATORS)[number];

interface CalculatorSchema {
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: { price: string; priceCurrency: string };
}

const CALCULATOR_DATA: Record<CalculatorSlug, CalculatorSchema> = {
  "calculateur-irl-2026": {
    name: "Calculateur IRL 2026 — Révision de Loyer",
    description:
      "Calculez gratuitement la révision de votre loyer avec l'IRL INSEE 2026. Formule légale, données officielles du 4e trimestre 2025.",
    url: "/outils/calculateur-irl-2026",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { price: "0", priceCurrency: "EUR" },
  },
  "calculateur-depot-garantie": {
    name: "Calculateur Dépôt de Garantie — Location Vide et Meublée",
    description:
      "Calculez le dépôt de garantie maximum légal pour votre location. Outil gratuit pour propriétaires et locataires.",
    url: "/outils/calculateur-depot-garantie",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { price: "0", priceCurrency: "EUR" },
  },
  "lettre-relance-loyer": {
    name: "Modèle Lettre de Relance Loyer Impayé",
    description:
      "Générez une lettre de relance pour loyer impayé. Téléchargement gratuit et personnalisable. Conforme aux démarches amiables avant procédure judiciaire.",
    url: "/outils/lettre-relance-loyer",
    applicationCategory: "LegalServiceApplication",
    operatingSystem: "Web",
    offers: { price: "0", priceCurrency: "EUR" },
  },
  "modele-bail-location": {
    name: "Modèle Bail de Location — contrat Conforme 2026",
    description:
      "Téléchargez un modèle de bail de location conforme à la loi du 6 juillet 1989. Personnalisable, imprimable, avec signature électronique.",
    url: "/outils/modele-bail-location",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: { price: "0", priceCurrency: "EUR" },
  },
  "modele-quittance-loyer-pdf": {
    name: "Modèle Quittance de Loyer PDF — Téléchargement Gratuit",
    description:
      "Générez une quittance de loyer PDF conforme. Mentionne automatiquement les informations obligatoires. Outil gratuit pour propriétaires.",
    url: "/outils/modele-quittance-loyer-pdf",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { price: "0", priceCurrency: "EUR" },
  },
  "simulateur-loi-jeanbrun": {
    name: "Simulateur Loi Jean-Louis Bourlanges — Encadrement des Loyers",
    description:
      "Simulez l'encadrement des loyers appliqué dans les zones tendues. Vérifiez si votre loyer est conforme à la réglementation.",
    url: "/outils/simulateur-loi-jeanbrun",
    applicationCategory: "GovernmentApplication",
    operatingSystem: "Web",
    offers: { price: "0", priceCurrency: "EUR" },
  },
  "calculateur-rendement-locatif": {
    name: "Calculateur Rendement Locatif — Rentabilité Investissement",
    description:
      "Calculez le rendement brut et net de votre investissement immobilier locatif. Outil gratuit pour investisseurs immobiliers.",
    url: "/templates/calculateur-rendement-locatif",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { price: "0", priceCurrency: "EUR" },
  },
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!VALID_CALCULATORS.includes(slug as CalculatorSlug)) {
    return NextResponse.json(
      { error: `Unknown calculator slug: ${slug}` },
      { status: 404 }
    );
  }

  const calc = CALCULATOR_DATA[slug as CalculatorSlug];

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: calc.name,
    description: calc.description,
    url: `https://www.rentready.fr${calc.url}`,
    applicationCategory: calc.applicationCategory,
    operatingSystem: calc.operatingSystem,
    offers: {
      "@type": "Offer",
      price: calc.offers.price,
      priceCurrency: calc.offers.priceCurrency,
      availability: "https://schema.org/InStock",
    },
    isPartOf: {
      "@type": "WebSite",
      name: "RentReady",
      url: "https://www.rentready.fr",
    },
    browserRequirements: "Requires JavaScript. Works on all modern browsers.",
  };

  return NextResponse.json(schema, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
