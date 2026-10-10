import { SchemaMarkup } from "./schema-markup";
import { FOUNDING_YEAR, SAME_AS, SITE_NAME, SITE_URL } from "@/data/entity";
import { BRAND } from "@/lib/brand";

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: "Logiciel de gestion locative pour propriétaires bailleurs indépendants en France.",
    foundingDate: String(FOUNDING_YEAR),
    logo: `${SITE_URL}/logo.svg`,
    address: {
      "@type": "PostalAddress",
      addressCountry: "FR",
      addressLocality: "Paris",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: BRAND.contactEmail,
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
    name: SITE_NAME,
    url: SITE_URL,
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
      item: `${SITE_URL}${item.url}`,
    })),
  };

  return <SchemaMarkup data={schema} />;
}