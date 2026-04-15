/**
 * Reusable JSON-LD schema markup components for SEO.
 * Drop <JsonLd data={...} /> anywhere in a page to inject structured data.
 */
import type { ReactNode } from "react";

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ─── Organization ─── */
export function organizationSchema(overrides?: Record<string, unknown>) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RentReady",
    alternateName: "RentReady SAS",
    url: "https://www.rentready.fr",
    logo: "https://www.rentready.fr/logo.png",
    description:
      "Logiciel de gestion locative automatisée pour propriétaires bailleurs indépendants en France.",
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
    ...overrides,
  };
}

/* ─── WebSite + SearchAction ─── */
export function webSiteSchema(overrides?: Record<string, unknown>) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RentReady",
    url: "https://www.rentready.fr",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.rentready.fr/recherche?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    ...overrides,
  };
}

/* ─── SoftwareApplication ─── */
export function softwareApplicationSchema(
  overrides?: Record<string, unknown>
) {
  return {
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
    featureList: [
      "Quittances conformes loi du 6 juillet 1989",
      "Détection automatique des virements via Open Banking DSP2",
      "Révision IRL connectée à l'INSEE",
      "Portail locataire avec gestion de la maintenance",
      "OCR factures artisans par intelligence artificielle",
      "Conformité Factur-X et e-reporting B2C 2027",
    ],
    ...overrides,
  };
}

/* ─── BreadcrumbList ─── */
export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>,
  overrides?: Record<string, unknown>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://www.rentready.fr${item.url}`,
    })),
    ...overrides,
  };
}

/* ─── FAQPage ─── */
export function faqPageSchema(
  faqs: Array<{ question: string; answer: string }>,
  overrides?: Record<string, unknown>
) {
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
    ...overrides,
  };
}

/* ─── HowTo (step-by-step guides / templates) ─── */
export function howToSchema(
  title: string,
  description: string,
  steps: Array<{ name: string; text: string }>,
  url: string,
  overrides?: Record<string, unknown>
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    description,
    url: `https://www.rentready.fr${url}`,
    totalTime: `PT${steps.length * 5}M`,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      itemListElement: {
        "@type": "HowToStep",
        text: step.text,
      },
    })),
    ...overrides,
  };
}

/* ─── Article (blog posts) ─── */
export function articleSchema(
  article: {
    title: string;
    excerpt: string;
    date: string;
    category: string;
    readTime: string;
    slug: string;
  },
  overrides?: Record<string, unknown>
) {
  const wordCount = Math.round(Number(article.readTime.replace(" min", "")) * 200);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      "@type": "Organization",
      name: "RentReady",
      url: "https://www.rentready.fr",
    },
    publisher: {
      "@type": "Organization",
      name: "RentReady",
      url: "https://www.rentready.fr",
      logo: {
        "@type": "ImageObject",
        url: "https://www.rentready.fr/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.rentready.fr/blog/${article.slug}`,
    },
    articleSection: article.category,
    wordCount,
    timeRequired: `PT${article.readTime.replace(" min", "")}M`,
    inLanguage: "fr-FR",
    isAccessibleForFree: true,
    image: {
      "@type": "ImageObject",
      url: `https://www.rentready.fr/api/og?title=${encodeURIComponent(article.title)}&description=${encodeURIComponent(article.excerpt)}&type=article`,
      width: 1200,
      height: 630,
    },
    ...overrides,
  };
}

/* ─── Service ─── */
export function serviceSchema(city?: {
  name: string;
  region: string;
  department: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: city
      ? `Gestion locative à ${city.name}`
      : "RentReady — Gestion locative automatisée",
    serviceType: "Property Management Software",
    provider: {
      "@type": "Organization",
      name: "RentReady",
      url: "https://www.rentready.fr",
    },
    offers: {
      "@type": "Offer",
      price: "15.00",
      priceCurrency: "EUR",
    },
    areaServed: city
      ? {
          "@type": "City",
          name: city.name,
          containedInPlace: {
            "@type": "AdministrativeArea",
            name: city.region,
          },
        }
      : {
          "@type": "Country",
          name: "France",
        },
  };
}

/* ─── WebPage ─── */
export function webPageSchema(
  name: string,
  description: string,
  url: string,
  overrides?: Record<string, unknown>
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: `https://www.rentready.fr${url}`,
    isPartOf: {
      "@type": "WebSite",
      name: "RentReady",
      url: "https://www.rentready.fr",
    },
    ...overrides,
  };
}

/* ─── Blog ─── */
export function blogSchema(
  name: string,
  description: string,
  url: string,
  overrides?: Record<string, unknown>
) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name,
    description,
    url: `https://www.rentready.fr${url}`,
    publisher: {
      "@type": "Organization",
      name: "RentReady",
      url: "https://www.rentready.fr",
    },
    ...overrides,
  };
}
