import type { Metadata } from "next";
import Link from "next/link";
import cities from "@/data/cities.json";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { baseMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/data/entity";

// Rendered on demand. SEO/marketing content, not product surface: prerendering the
// ~135-page content suite exhausted the Node heap during `next build`
// ("Ineffective mark-compacts near heap limit"). All data is local, so rendering
// per request costs ~ms and every URL keeps working.
export const dynamic = "force-dynamic";

/**
 * The city directory.
 *
 * It used to be `/gestion-locative`, which meant the page meant to sell the
 * software was a list of 50 links — and the nav labelled it "Fonctionnalités".
 * `/gestion-locative` is now the product page; the directory lives here.
 */
type City = (typeof cities)[number];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Villes couvertes",
          item: `${SITE_URL}/villes`,
        },
      ],
    },
    {
      "@type": "ItemList",
      name: "Villes couvertes par RentReady",
      numberOfItems: cities.length,
      itemListElement: cities.map((city, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: city.name,
        url: `${SITE_URL}/gestion-locative/${city.slug}`,
      })),
    },
  ],
};

export async function generateMetadata() {
  return baseMetadata({
    title: `Gestion locative dans ${cities.length} villes françaises | RentReady`,
    description:
      "La réglementation locative varie d'une commune à l'autre. Trouvez la page RentReady de votre ville : encadrement des loyers, zone tendue, règles applicables.",
    url: "/villes",
    ogType: "website",
  });
}

function groupByRegion(data: City[]): Record<string, City[]> {
  const groups: Record<string, City[]> = {};
  for (const city of data) {
    (groups[city.region] ??= []).push(city);
  }
  return Object.fromEntries(
    Object.entries(groups).sort(([a], [b]) => a.localeCompare(b, "fr"))
  );
}

function formatPopulation(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n);
}

export default function VillesPage() {
  const regions = groupByRegion(cities);

  return (
    <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <SchemaMarkup data={schema} breadcrumbRenderedByComponent />

      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Villes couvertes", href: "/villes", isCurrentPage: true },
        ]}
      />

      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Gestion locative : la règle dépend de votre ville
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-stone-700">
          Le logiciel est identique partout, mais la réglementation ne l&apos;est
          pas : encadrement des loyers, zone tendue, arrêté préfectoral de
          référence. Ces pages indiquent la règle applicable dans votre commune et
          vous relient à RentReady.
        </p>
      </header>

      <div className="space-y-12">
        {Object.entries(regions).map(([region, regionCities]) => (
          <section key={region}>
            <h2 className="mb-4 border-b border-stone-200 pb-2 text-xl font-semibold text-stone-800">
              {region}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {regionCities
                .slice()
                .sort((a, b) => b.population - a.population)
                .map((city) => (
                  <li key={city.slug}>
                    <Link
                      href={`/gestion-locative/${city.slug}`}
                      className="group flex items-center justify-between rounded-lg border border-stone-200 bg-white px-4 py-3 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
                    >
                      <span className="font-medium text-stone-800 group-hover:text-blue-700">
                        {city.name}
                      </span>
                      <span className="text-xs text-stone-600">
                        {formatPopulation(city.population)}&nbsp;hab.
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="mt-16 rounded-2xl bg-stone-900 px-6 py-14 text-center text-white">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Gérez vos biens où que vous soyez en France
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-stone-300">
          Quittances automatiques, suivi des loyers, conformité Factur-X — tout en
          un seul logiciel.
        </p>
        <Link
          href="/register"
          className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
        >
          Essai gratuit 14 jours
        </Link>
      </section>
    </article>
  );
}