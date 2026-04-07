import { SchemaMarkup } from "./schema-markup";

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RentReady",
    alternateName: "RentReady SAS",
    url: "https://www.rentready.fr",
    logo: "https://www.rentready.fr/logo.png",
    description: "Logiciel de gestion locative automatisée pour propriétaires bailleurs indépendants en France.",
    foundingDate: "2024",
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
    sameAs: [
      "https://twitter.com/rentready_fr",
      "https://www.linkedin.com/company/rentready",
    ],
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
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.rentready.fr/recherche?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
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