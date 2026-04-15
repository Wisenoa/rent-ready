/**
 * GET /api/seo/organization
 * Returns Organization schema.org JSON-LD for the homepage.
 */
import { NextResponse } from "next/server";

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "RentReady",
  url: "https://www.rentready.fr",
  logo: {
    "@type": "ImageObject",
    url: "https://www.rentready.fr/logo.png",
    width: 300,
    height: 100,
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
    contactType: "customer support",
    email: "support@rentready.fr",
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
  offers: {
    "@type": "Offer",
    category: "SaaS",
    price: "15.00",
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    url: "https://www.rentready.fr/pricing",
  },
};

export async function GET() {
  return NextResponse.json(ORGANIZATION_SCHEMA, {
    headers: {
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
