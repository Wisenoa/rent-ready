import { SchemaMarkup } from "./schema-markup";
import { FOUNDING_YEAR, SAME_AS } from "@/data/entity";

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RentReady",
    alternateName: "RentReady SAS",
    url: "https://www.rentready.fr",
    logo: "https://www.rentready.fr/logo.svg",
    description: "Logiciel de gestion locative automatisée pour propriétaires bailleurs indépendants en France.",
    foundingDate: String(FOUNDING_YEAR),
    address: {
      "@type": "PostalAddress",
      addressCountry: "FR",
      addressLocality: "Paris",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "contact@rentready.fr",
      availableLanguage: "French",
    },
    sameAs: SAME_AS,
    knowsAbout: [
      "Gestion locative",
      "Quittance de loyer",
      "Révision IRL",
      "Indice de référence des loyers",
      "Location immobilière France",
      "Logiciel immobilier SaaS",
    ],
  };

  return <SchemaMarkup data={schema} />;
}

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RentReady",
    url: "https://www.rentready.fr",
  };

  return <SchemaMarkup data={schema} />;
}

export function BreadcrumbSchema({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://www.rentready.fr${item.url}`,
    })),
  };

  return <SchemaMarkup data={schema} />;
}