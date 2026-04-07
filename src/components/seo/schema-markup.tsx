/**
 * Reusable JSON-LD schema markup components for SEO.
 * Render as <script type="application/ld+json"> in any page.
 */

interface SchemaMarkupProps {
  data: Record<string, unknown>;
}

export function SchemaMarkup({ data }: SchemaMarkupProps) {
  return (
    <script
      key={JSON.stringify(data)}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ─── Pre-built schema factories ─── */

export function softwareApplicationSchema(overrides?: Record<string, unknown>) {
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
