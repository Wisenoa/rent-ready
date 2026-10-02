/**
 * Centralized typed Schema.org JSON-LD builders for RentReady marketing pages.
 *
 * Usage:
 *   import { buildOrganizationSchema, buildSoftwareAppSchema, ... } from "@/lib/seo/structured-data";
 *
 * Each builder returns a plain object compatible with JSON.stringify.
 * Render in a <script type="application/ld+json"> tag via a server component.
 *
 * All objects use French locale (fr-FR) where applicable.
 */

const BASE_URL = "https://www.rentready.fr";
const SITE_NAME = "RentReady";

/* ─────────────────────────────────────────────
   Shared types
───────────────────────────────────────────── */

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface HowToStep {
  name: string;
  text: string;
}

export interface SoftwareAppOffer {
  name: string;
  description: string;
  price: string;
  priceCurrency: string;
}

export interface OrganizationContact {
  email?: string;
  phone?: string;
  contactType?: string;
  availableLanguage?: string;
  areaServed?: string;
}

/* ─────────────────────────────────────────────
   buildOrganizationSchema
   Used on: Homepage
───────────────────────────────────────────── */

export interface OrganizationSchemaInput {
  "@id"?: string;
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
  contact?: OrganizationContact;
  addressCountry?: string;
  addressRegion?: string;
  foundingDate?: string;
  applicationCategory?: string;
}

export function buildOrganizationSchema(input: OrganizationSchemaInput = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    ...(input["@id"] ? { "@id": input["@id"] } : {}),
    name: input.name ?? SITE_NAME,
    url: input.url ?? BASE_URL,
    logo: input.logo ?? {
      "@type": "ImageObject",
      url: `${BASE_URL}/logo.png`,
      width: 512,
      height: 512,
    },
    description:
      input.description ??
      "RentReady est le logiciel de gestion locative nouvelle génération pour propriétaires bailleurs indépendants en France. Quittances conformes, détection automatique des paiements, révision IRL, portail locataire.",
    sameAs: input.sameAs ?? [
      "https://www.linkedin.com/company/rentready",
      "https://twitter.com/rentready_fr",
      "https://www.facebook.com/rentready.fr",
    ],
    contactPoint: input.contact ?? {
      "@type": "ContactPoint",
      email: "contact@rentready.fr",
      contactType: "customer service",
      availableLanguage: "French",
      areaServed: "FR",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: input.addressCountry ?? "FR",
      addressRegion: input.addressRegion ?? "France",
    },
    ...(input.foundingDate ? { foundingDate: input.foundingDate } : {}),
    industry: "Property Management Software",
  };
}

/* ─────────────────────────────────────────────
   buildWebSiteSchema
   Used on: All pages (included in @graph)
───────────────────────────────────────────── */

export function buildWebSiteSchema(name?: string, url?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: name ?? SITE_NAME,
    url: url ?? BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/recherche?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/* ─────────────────────────────────────────────
   buildSoftwareAppSchema
   Used on: Features, Property management, Lease management,
            Rent collection, Maintenance tracking, Pricing pages
───────────────────────────────────────────── */

export interface SoftwareAppSchemaInput {
  name?: string;
  description?: string;
  url?: string;
  applicationCategory?: string;
  operatingSystem?: string;
  offers?: SoftwareAppOffer[];
  features?: string[];
}

export function buildSoftwareAppSchema(input: SoftwareAppSchemaInput = {}) {
  const name = input.name ?? SITE_NAME;
  const description =
    input.description ??
    "Logiciel de gestion locative automatisée pour propriétaires bailleurs indépendants en France.";
  const url = input.url ?? BASE_URL;
  const applicationCategory = input.applicationCategory ?? "BusinessApplication";
  const operatingSystem = input.operatingSystem ?? "Web";

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    applicationCategory,
    operatingSystem,
    url,
    description,
  };

  if (input.offers && input.offers.length > 0) {
    schema.offers = input.offers.map((offer) => ({
      "@type": "Offer",
      name: offer.name,
      description: offer.description,
      price: offer.price,
      priceCurrency: offer.priceCurrency,
      availability: "https://schema.org/InStock",
      url,
    }));
  }

  if (input.features && input.features.length > 0) {
    schema.featuresSpecification = {
      "@type": "CreativeWork",
      name: "Fonctionnalités",
      description: input.features.join(" • "),
    };
  }

  return schema;
}

/* ─────────────────────────────────────────────
   buildWebApplicationSchema
   Used on: Calculator / Tool pages
───────────────────────────────────────────── */

export interface WebApplicationSchemaInput {
  name: string;
  description: string;
  url?: string;
  applicationCategory?: string;
  operatingSystem?: string;
  price?: string;
  priceCurrency?: string;
}

export function buildWebApplicationSchema(input: WebApplicationSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: input.name,
    description: input.description,
    url: input.url ?? `${BASE_URL}${input.url ?? ""}`,
    applicationCategory: input.applicationCategory ?? "FinanceApplication",
    operatingSystem: input.operatingSystem ?? "Web",
    offers: {
      "@type": "Offer",
      price: input.price ?? "0",
      priceCurrency: input.priceCurrency ?? "EUR",
      availability: "https://schema.org/InStock",
    },
    browserRequirements: "Requires JavaScript. Works on all modern browsers.",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: BASE_URL,
    },
  };
}

/* ─────────────────────────────────────────────
   buildFAQPageSchema
   Used on: Pricing, Features, Property management, Glossary, FAQ pages
───────────────────────────────────────────── */

export function buildFAQPageSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/* ─────────────────────────────────────────────
   buildHowToSchema
   Used on: Template pages (bail, quittance, état des lieux, etc.)
───────────────────────────────────────────── */

export interface HowToSchemaInput {
  name: string;
  description: string;
  url?: string;
  steps: HowToStep[];
  toolList?: string[];
  totalTime?: string;
}

export function buildHowToSchema(input: HowToSchemaInput) {
  const url = input.url ?? BASE_URL;

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: input.name,
    description: input.description,
    url: `${BASE_URL}${url}`,
    steps: input.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
    ...(input.toolList && input.toolList.length > 0
      ? {
          tool: input.toolList.map((tool) => ({
            "@type": "HowToTool",
            name: tool,
          })),
        }
      : {}),
    ...(input.totalTime ? { totalTime: input.totalTime } : {}),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: BASE_URL,
    },
  };
}

/* ─────────────────────────────────────────────
   buildBreadcrumbSchema
   Used on: All inner pages (pricing, features, templates, tools, etc.)
───────────────────────────────────────────── */

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    name: "Fil d'Ariane",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

/* ─────────────────────────────────────────────
   buildArticleSchema
   Used on: Blog post pages
───────────────────────────────────────────── */

export interface ArticleSchemaInput {
  title: string;
  description: string;
  authorName?: string;
  authorType?: string;
  publishedAt?: string;
  modifiedAt?: string;
  url?: string;
  imageUrl?: string;
  publisherName?: string;
  publisherLogo?: string;
}

export function buildArticleSchema(input: ArticleSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: input.url ?? BASE_URL,
    image: input.imageUrl ? [input.imageUrl] : [],
    author: {
      "@type": input.authorType ?? "Person",
      name: input.authorName ?? "RentReady",
    },
    publisher: {
      "@type": "Organization",
      name: input.publisherName ?? SITE_NAME,
      logo: input.publisherLogo
        ? {
            "@type": "ImageObject",
            url: input.publisherLogo,
          }
        : undefined,
    },
    ...(input.publishedAt
      ? { datePublished: input.publishedAt }
      : {}),
    ...(input.modifiedAt
      ? { dateModified: input.modifiedAt }
      : {}),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": input.url ?? BASE_URL,
    },
  };
}

/* ─────────────────────────────────────────────
   buildWebPageSchema
   Used on: Generic web pages (inner pages)
───────────────────────────────────────────── */

export interface WebPageSchemaInput {
  name: string;
  description: string;
  url?: string;
}

export function buildWebPageSchema(input: WebPageSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: input.url ?? `${BASE_URL}${input.url ?? ""}`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: BASE_URL,
    },
  };
}

/* ─────────────────────────────────────────────
   buildItemListSchema
   Used on: Glossary page
───────────────────────────────────────────── */

export interface ItemListElement {
  name: string;
  description?: string;
  url?: string;
}

export interface ItemListSchemaInput {
  name: string;
  description?: string;
  url?: string;
  items: ItemListElement[];
}

export function buildItemListSchema(input: ItemListSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: input.name,
    description: input.description,
    url: input.url,
    itemListElement: input.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      description: item.description,
      url: item.url,
    })),
  };
}

/* ─────────────────────────────────────────────
   buildGraphSchema
   Combines multiple schemas into a @graph array for a single <script> tag.
   Use for pages that need multiple schema types (e.g., pricing page).
───────────────────────────────────────────── */

export function buildGraphSchema(...schemas: unknown[]) {
  return {
    "@context": "https://schema.org",
    "@graph": schemas,
  };
}

/* ─────────────────────────────────────────────
   JsonLdComponent — React server component helper
   Usage: <JsonLd schema={buildBreadcrumbSchema(items)} />
───────────────────────────────────────────── */

export function JsonLd({ schema }: { schema: unknown }) {
  // This is a convenience wrapper — in practice, pages render this inline:
  //   <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  // Keeping the return shape simple so callers can inline it if they prefer.
  return null; // Server component — renders nothing on its own; caller handles the <script> tag
}
