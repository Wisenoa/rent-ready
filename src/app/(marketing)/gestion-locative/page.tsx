import type { Metadata } from "next";
import { SchemaMarkup, paidOffer } from "@/components/seo/schema-markup";
import { baseMetadata } from "@/lib/seo/metadata";
import {
  FEATURE_LIST,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/data/entity";
import {
  GestionHero,
  GestionTrustBar,
  GestionGoldenPath,
  GestionInteractiveDemo,
  GestionComparison,
  GestionPatrimoine,
  GestionFeaturesGrid,
  GestionCityExplorer,
  GestionPricingSection,
  GestionFaqSection,
  GestionFinalCta,
} from "@/components/marketing/gestion-locative";
import { GESTION_FAQ_ITEMS } from "@/components/marketing/gestion-locative/faq-data";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata({
    title:
      `Logiciel de gestion locative pour propriétaires bailleurs — ${SITE_NAME}`,
    description:
      "Gérez vos loyers, vos locataires et vos documents de location sans tableur. Quittances automatiques loi 1989, révision IRL, détection d'impayés. Dès 9 €/mois.",
    url: "/gestion-locative",
    ogType: "feature",
  });
}

const GESTION_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: `${SITE_NAME} — Logiciel de gestion locative`,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: `${SITE_URL}/gestion-locative`,
      description: SITE_DESCRIPTION,
      offers: paidOffer(),
      featureList: FEATURE_LIST,
      audience: {
        "@type": "Audience",
        audienceType:
          "Propriétaires bailleurs indépendants en France (1 à 10 logements)",
      },
      areaServed: {
        "@type": "Country",
        name: "France",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: GESTION_FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

export default function GestionLocativePage() {
  return (
    <article className="min-h-screen bg-[#FAF9F5] text-[#15241F] font-sans antialiased selection:bg-[#1E3A2F] selection:text-[#FAF9F5]">
      <SchemaMarkup data={GESTION_SCHEMA} breadcrumbRenderedByComponent />

      {/* 1. Hero Section with Architectural Visual & Product Preview */}
      <GestionHero />

      {/* 2. Trust, Compliance & Legal Grounding Bar */}
      <GestionTrustBar />

      {/* 3. The Golden Path (Du bien à la quittance) + Editorial Still Life */}
      <GestionGoldenPath />

      {/* 4. Interactive Product Demo (Real monthly simulation) */}
      <GestionInteractiveDemo />

      {/* 5. Objective Comparison (Tableur vs Agence vs Lokna) */}
      <GestionComparison />

      {/* 6. Patrimoine, Peace of Mind & Architectural Facade */}
      <GestionPatrimoine />

      {/* 7. Comprehensive Features Grid */}
      <GestionFeaturesGrid />

      {/* 8. Interactive City Regulation Explorer (50 French Cities) */}
      <GestionCityExplorer />

      {/* 9. Transparent Pricing Section */}
      <GestionPricingSection />

      {/* 10. Frequently Asked Questions (FAQ) */}
      <GestionFaqSection />

      {/* 11. Final High-Conversion Call-To-Action */}
      <GestionFinalCta />
    </article>
  );
}