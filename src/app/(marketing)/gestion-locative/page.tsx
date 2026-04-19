import type { Metadata } from "next";
import Link from "next/link";
import cities from "@/data/cities.json";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { baseMetadata } from "@/lib/seo/metadata";

/* ─── Structured Data ─── */

const GESTION_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "RentReady",
      url: "https://www.rentready.fr",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://www.rentready.fr/recherche?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
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
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.rentready.fr" },
        { "@type": "ListItem", position: 2, name: "Gestion locative", item: "https://www.rentready.fr/gestion-locative" },
      ],
    },
    {
      "@type": "SoftwareApplication",
      name: "RentReady — Gestion locative",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://www.rentready.fr/gestion-locative",
      description:
        "Logiciel de gestion locative pour propriétaires bailleurs en France. Quittances automatiques, suivi des loyers, conformité légale 2026.",
      offers: {
        "@type": "Offer",
        price: "15.00",
        priceCurrency: "EUR",
        priceValidUntil: "2027-12-31",
        availability: "https://schema.org/InStock",
        url: "https://www.rentready.fr/register",
      },
      featureList: [
        "Quittances de loyer PDF",
        "Suivi des loyers en temps réel",
        "Révision IRL automatique",
        "État des lieux intégré",
        "Conformité Factur-X",
      ],
    },
    {
      "@type": "Organization",
      name: "RentReady",
      url: "https://www.rentready.fr",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "contact@rentready.fr",
        availableLanguage: "French",
      },
    },
  ],
};

// ISR: all-cities listing — revalidate monthly
export const revalidate = 2592000;

export async function generateMetadata() {
  return baseMetadata({
    title: "Gestion locative en France — 50 villes",
    description: "Logiciel de gestion locative dans les 50 plus grandes villes de France. Quittances, suivi des loyers, conformité 2026. Essai gratuit →",
    url: "/gestion-locative",
    ogType: "feature",
  });
}
;

type City = (typeof cities)[number];

function groupByRegion(data: City[]): Record<string, City[]> {
  const groups: Record<string, City[]> = {};
  for (const city of data) {
    (groups[city.region] ??= []).push(city);
  }
  return Object.fromEntries(
    Object.entries(groups).sort(([a], [b]) => a.localeCompare(b, "fr")),
  );
}

function formatPopulation(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n);
}

export default function GestionLocativeIndex() {
  const regions = groupByRegion(cities);

  return (
    <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <SchemaMarkup data={GESTION_SCHEMA} />

      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Gestion locative", href: "/gestion-locative", isCurrentPage: true },
        ]}
      />

      {/* Hero */}
      <header className="mb-16 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Gestion Locative en France
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
          RentReady accompagne les propriétaires bailleurs dans{" "}
          <strong>{cities.length}&nbsp;villes</strong> à travers toute la France.
          Trouvez votre ville et découvrez nos solutions.
        </p>
      </header>

      {/* Regions grid */}
      <div className="space-y-12">
        {Object.entries(regions).map(([region, regionCities]) => (
          <section key={region}>
            <h2 className="mb-4 border-b border-stone-200 pb-2 text-xl font-semibold text-stone-800">
              {region}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {regionCities
                .sort((a, b) => b.population - a.population)
                .map((city) => (
                  <li key={city.slug}>
                    <Link
                      href={`/gestion-locative/${city.slug}`}
                      className="group flex items-center justify-between rounded-lg border border-stone-200/80 bg-white px-4 py-3 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
                    >
                      <span className="font-medium text-stone-800 group-hover:text-blue-700">
                        {city.name}
                      </span>
                      <span className="text-xs text-stone-400">
                        {formatPopulation(city.population)}&nbsp;hab.
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>

      {/* CTA */}
      <section className="mt-20 rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Gérez vos biens où que vous soyez en France
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-stone-300">
          Quittances automatiques, suivi des loyers, conformité Factur-X — tout
          en un seul logiciel.
        </p>
        <Link
          href="/register"
          className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
        >
          Essai gratuit 14&nbsp;jours
        </Link>
      </section>
    </article>
  );
}
