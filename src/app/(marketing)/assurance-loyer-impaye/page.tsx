import type { Metadata } from "next";
import Link from "next/link";
import cities from "@/data/cities.json";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { baseMetadata } from "@/lib/seo/metadata";

// ISR: all-cities listing — revalidate monthly
export const revalidate = 2592000;

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

const ZONES_TENDUES = new Set([
  "paris", "lyon", "lille", "bordeaux", "montpellier",
  "marseille", "nice", "toulouse", "nantes", "strasbourg",
  "rennes", "grenoble",
]);

export async function generateMetadata() {
  return baseMetadata({
    title: "Assurance loyer impayé (GLI) — 50 villes en France",
    description: "Garantie des Loyers Impayés (GLI) dans les 50 plus grandes villes de France. Protégez vos revenus locatifs contre les impayés. Couverture jusqu'à 90 %, frais d'expulsion pris en charge.",
    url: "/assurance-loyer-impaye",
    ogType: "feature",
  });
}

const GLI_SCHEMA = {
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
      url: "https://www.rentready.fr",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "contact@rentready.fr",
        availableLanguage: "French",
      },
    },
    {
      "@type": "BreadcrumbList",
      name: "Fil d'Ariane",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.rentready.fr" },
        { "@type": "ListItem", position: 2, name: "Assurance loyer impayé", item: "https://www.rentready.fr/assurance-loyer-impaye" },
      ],
    },
    {
      "@type": "SoftwareApplication",
      name: "RentReady — Assurance loyer impayé (GLI)",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://www.rentready.fr/assurance-loyer-impaye",
      description: "Garantie des Loyers Impayés (GLI) pour propriétaires bailleurs. Couverture jusqu'à 90 % des loyers impayés, prise en charge des frais d'expulsion, détection automatique des paiements.",
      offers: {
        "@type": "Offer",
        price: "15.00",
        priceCurrency: "EUR",
        priceValidUntil: "2027-12-31",
        availability: "https://schema.org/InStock",
        url: "https://www.rentready.fr/register",
      },
      featureList: [
        "Remboursement jusqu'à 90 % des loyers impayés",
        "Frais d'expulsion pris en charge",
        "Détection automatique des paiements",
        "Alerte impayé en temps réel",
        "Déclaration de sinistre simplifiée",
      ],
    },
  ],
};

export default function AssuranceLoyerImpayéIndex() {
  const regions = groupByRegion(cities);

  return (
    <>
      <SchemaMarkup data={GLI_SCHEMA} />
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Assurance loyer impayé", href: "/assurance-loyer-impaye", isCurrentPage: true },
        ]}
      />

      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Hero */}
        <header className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium tracking-wide text-blue-600 uppercase">
            Protection du propriétaire
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Assurance loyer impayé (GLI) en France
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
            La Garantie des Loyers Impayés vous protège contre les défaillances de vos locataires.
            Choisissez votre ville pour trouver la meilleure couverture GLI.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2 text-sm text-amber-800">
            <span>💡</span>
            <span>En zone tendue, les délais d'expulsion peuvent dépasser 12 mois — la GLI est fortement recommandée</span>
          </div>
        </header>

        {/* What is GLI */}
        <section className="mb-16 rounded-2xl bg-blue-50 p-8">
          <h2 className="mb-4 text-xl font-bold text-stone-900">Qu'est-ce que la GLI ?</h2>
          <p className="mb-4 text-stone-700 leading-relaxed">
            La <strong>Garantie des Loyers Impayés (GLI)</strong> est une assurance qui rembourse le bailleur
            en cas de loyers ou de charges impayés par son locataire. Elle couvre généralement :
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {[
              "Le montant des loyers et charges impayés (jusqu'à 90 %)",
              "Les frais de procédure et d'avocat en cas d'expulsion",
              "Éventuellement les dégradations du bien",
              "La protection en cas de locataire de bonne foi (perte d'emploi, divorce)",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-stone-700">
                <span className="mt-0.5 text-green-600">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

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
                        href={`/assurance-loyer-impaye/${city.slug}`}
                        className="group flex items-center justify-between rounded-lg border border-stone-200/80 bg-white px-4 py-3 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
                      >
                        <span className="font-medium text-stone-800 group-hover:text-blue-700">
                          {city.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-stone-400">
                            {formatPopulation(city.population)} hab.
                          </span>
                          {ZONES_TENDUES.has(city.slug) && (
                            <span className="text-xs" title="Zone tendue">⚠️</span>
                          )}
                        </div>
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
            Protégez vos revenus locatifs partout en France
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            GLI, détection automatique des paiements, alertes en temps réel — combinez gestion intelligente et assurance pour une protection complète.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
          >
            Essai gratuit 14 jours
          </Link>
        </section>
      </article>
    </>
  );
}
