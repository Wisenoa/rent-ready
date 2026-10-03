/**
 * Reusable JSON-LD schema markup components for SEO.
 * Render as <script type="application/ld+json"> in any page.
 */

import {
  FEATURE_LIST,
  PRICE_VALID_UNTIL,
  SITE_DESCRIPTION,
  SITE_URL,
  getEntryPrice,
} from "@/data/entity";

/**
 * Entity types that belong to the site, not to a page.
 *
 * `src/app/layout.tsx` renders `<OrganizationSchema />` and `<WebSiteSchema />`
 * on every request, so the site-level entity is already declared once per page.
 * Thirty-two page schemas also declared their own copy — and `SchemaMarkup` was
 * called from 30+ files, so cleaning them up one at a time was 32 chances to
 * break a page.
 *
 * Stripping them here makes the root layout the single source of truth for the
 * organisation and the website, at every call site, with no behaviour left to
 * remember.
 *
 * What a page may still declare: SoftwareApplication, Article, FAQPage,
 * HowTo, DefinedTerm, ItemList, Service, and so on. What it must not: the site
 * entity, which is identical everywhere.
 */
const SITE_LEVEL_TYPES = new Set(["Organization", "WebSite"]);

interface SchemaMarkupProps {
  data: Record<string, unknown>;
  /**
   * Set when the page also renders `<Breadcrumb>`, which emits its own
   * BreadcrumbList from the same items. The two were identical in content but
   * not in shape: the component omits `item` on the current page, the page
   * schema included it. Two conflicting breadcrumbs on one page is worse than
   * the page schema being the redundant one.
   */
  breadcrumbRenderedByComponent?: boolean;
}

function stripSiteLevelNodes(
  data: Record<string, unknown>,
  dropBreadcrumb: boolean
): unknown {
  const isRedundant = (node: unknown): boolean => {
    const type = (node as Record<string, unknown>)?.["@type"];
    if (typeof type !== "string") return false;
    if (SITE_LEVEL_TYPES.has(type)) return true;
    return dropBreadcrumb && type === "BreadcrumbList";
  };

  const graph = data["@graph"];
  if (Array.isArray(graph)) {
    const kept = graph.filter((node) => !isRedundant(node));
    // A graph of only redundant nodes carries nothing of its own.
    if (kept.length === 0) return null;
    return { ...data, "@graph": kept };
  }

  if (isRedundant(data)) return null;
  return data;
}

export function SchemaMarkup({ data, breadcrumbRenderedByComponent }: SchemaMarkupProps) {
  const cleaned = stripSiteLevelNodes(data, breadcrumbRenderedByComponent === true);
  if (cleaned === null) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleaned) }}
    />
  );
}

/* ─── Pre-built schema factories ─── */

/**
 * The standard paid-offer shape.
 *
 * The price used to be a literal "15.00" repeated in eleven files while the
 * cheapest plan cost 9 €/mois, so every page advertised a price that did not
 * exist. It is now derived from `PLANS`, and `pricing-consistency.test.ts`
 * fails the build if a page reintroduces a hand-typed price.
 */
export function paidOffer(overrides?: Record<string, unknown>) {
  return {
    "@type": "Offer",
    price: getEntryPrice().toFixed(2),
    priceCurrency: "EUR",
    priceValidUntil: PRICE_VALID_UNTIL,
    availability: "https://schema.org/InStock",
    url: `${SITE_URL}/register`,
    ...overrides,
  };
}

export function softwareApplicationSchema(overrides?: Record<string, unknown>) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "RentReady",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    offers: paidOffer(),
    featureList: FEATURE_LIST,
    ...overrides,
  };
}

export function faqPageSchema(
  faqs: Array<{ question: string; answer: string }>
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
  };
}

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
    offers: paidOffer(),
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

export function webApplicationSchema(
  name: string,
  url: string,
  description: string,
  faqs?: Array<{ question: string; answer: string }>
) {
  const schemas: Record<string, unknown>[] = [
    {
      "@type": "WebApplication",
      name,
      url: `https://www.rentready.fr${url}`,
      description,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
      },
      isPartOf: {
        "@type": "WebSite",
        name: "RentReady",
        url: "https://www.rentready.fr",
      },
    },
  ];

  if (faqs) {
    schemas.push({
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": schemas,
  };
}

/**
 * HowTo schema for step-by-step calculator / tool pages.
 * Use for: IRL calculator, depot-garantie calculator, rent increase simulator, etc.
 */
export function howToSchema({
  name,
  description,
  url,
  steps,
  faqs,
}: {
  name: string;
  description: string;
  url: string;
  steps: Array<{ name: string; text: string }>;
  faqs?: Array<{ question: string; answer: string }>;
}) {
  const schemas: Record<string, unknown>[] = [
    {
      "@type": "HowTo",
      name,
      description,
      url: `https://www.rentready.fr${url}`,
      steps: steps.map((step, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: step.name,
        text: step.text,
      })),
      isPartOf: {
        "@type": "WebSite",
        name: "RentReady",
        url: "https://www.rentready.fr",
      },
    },
  ];

  if (faqs) {
    schemas.push({
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": schemas,
  };
}

/**
 * BreadcrumbList schema for inner marketing pages.
 * Use on: feature pages, template pages, tool pages, city guide pages.
 */
export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `https://www.rentready.fr${item.url}`,
    })),
  };
}
