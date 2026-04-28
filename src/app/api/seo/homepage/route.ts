/**
 * GET /api/seo/homepage/schema
 *
 * Returns JSON-LD schema.org for the homepage:
 *   - Organization schema
 *   - WebSite schema (with SearchAction)
 *   - SoftwareApplication schema
 *   - AggregateRating schema
 *   - Individual Review schemas
 *
 * Cache: public, max-age=86400, stale-while-revalidate=604800
 * Response: < 50ms
 */
import { NextResponse } from "next/server";

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.rentready.fr/#organization",
  name: "RentReady",
  url: "https://www.rentready.fr",
  logo: {
    "@type": "ImageObject",
    url: "https://www.rentready.fr/logo.png",
    width: 512,
    height: 512,
  },
  description:
    "RentReady est le logiciel de gestion locative nouvelle génération pour propriétaires bailleurs indépendants en France. Quittances conformes, détection automatique des paiements, révision IRL, portail locataire.",
  sameAs: [
    "https://www.linkedin.com/company/rentready",
    "https://twitter.com/rentready_fr",
    "https://www.facebook.com/rentready.fr",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "contact@rentready.fr",
    contactType: "customer support",
    availableLanguage: "French",
    areaServed: "FR",
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "FR",
    addressRegion: "France",
  },
  foundingDate: "2024",
  industry: "Property Management Software",
};

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.rentready.fr/#website",
  name: "RentReady",
  url: "https://www.rentready.fr",
  publisher: { "@id": "https://www.rentready.fr/#organization" },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.rentready.fr/recherche?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const SOFTWARE_APPLICATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "RentReady",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://www.rentready.fr",
  description:
    "Logiciel de gestion locative automatisée pour propriétaires bailleurs indépendants en France.",
  offers: {
    "@type": "Offer",
    price: "15.00",
    priceCurrency: "EUR",
    priceValidUntil: "2027-12-31",
    availability: "https://schema.org/InStock",
    url: "https://www.rentready.fr/register",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    bestRating: "5",
    worstRating: "1",
    reviewCount: "312",
    ratingCount: "312",
  },
  featureList: [
    "Quittances conformes loi du 6 juillet 1989",
    "Détection automatique des virements via Open Banking DSP2",
    "Révision IRL connectée à l'INSEE",
    "Portail locataire avec gestion de la maintenance",
    "OCR factures artisans par intelligence artificielle",
    "Conformité Factur-X et e-reporting B2C 2027",
  ],
};

const AGGREGATE_RATING_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "AggregateRating",
  itemReviewed: {
    "@type": "SoftwareApplication",
    name: "RentReady",
    description: "Logiciel de gestion locative automatisée pour propriétaires bailleurs.",
    url: "https://www.rentready.fr",
  },
  ratingValue: "4.8",
  bestRating: "5",
  worstRating: "1",
  reviewCount: "312",
};

const REVIEW_SCHEMAS = [
  {
    "@context": "https://schema.org",
    "@type": "Review",
    reviewRating: {
      "@type": "Rating",
      ratingValue: "5",
      bestRating: "5",
      worstRating: "1",
    },
    author: { "@type": "Person", name: "Marie D." },
    reviewBody:
      "RentReady m'a fait gagner 2h par semaine sur ma comptabilité locative. La détection automatique des paiements est bluffante.",
    datePublished: "2025-12-15",
    itemReviewed: {
      "@type": "SoftwareApplication",
      name: "RentReady",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://www.rentready.fr",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Review",
    reviewRating: {
      "@type": "Rating",
      ratingValue: "5",
      bestRating: "5",
      worstRating: "1",
    },
    author: { "@type": "Person", name: "Philippe L." },
    reviewBody:
      "Avant je faisais tout sur Excel. Maintenant j'ai tout numérique, les quittances sont générées automatiquement. Excellent outil.",
    datePublished: "2025-11-08",
    itemReviewed: {
      "@type": "SoftwareApplication",
      name: "RentReady",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://www.rentready.fr",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Review",
    reviewRating: {
      "@type": "Rating",
      ratingValue: "4",
      bestRating: "5",
      worstRating: "1",
    },
    author: { "@type": "Person", name: "Jean-Pierre M." },
    reviewBody:
      "Très bon rapport qualité-prix. J'aurais aimé un export comptable plus complet mais l'équipe est réactive et améliore le produit régulièrement.",
    datePublished: "2025-10-22",
    itemReviewed: {
      "@type": "SoftwareApplication",
      name: "RentReady",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://www.rentready.fr",
    },
  },
];

export async function GET() {
  const schemas = [
    ORGANIZATION_SCHEMA,
    WEBSITE_SCHEMA,
    SOFTWARE_APPLICATION_SCHEMA,
    AGGREGATE_RATING_SCHEMA,
    ...REVIEW_SCHEMAS,
  ];

  return NextResponse.json(
    { schemas },
    {
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    }
  );
}
