import type { Metadata } from "next";
import Link from "next/link";
import cities from "@/data/cities.json";

export const metadata: Metadata = {
  title: "Gestion Locative en France — Toutes les Villes",
  description:
    "Découvrez RentReady pour la gestion locative dans les 50 plus grandes villes de France. Quittances automatiques, suivi des loyers, conformité légale.",
  alternates: { canonical: "/gestion-locative" },
};

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
          href="/sign-up"
          className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
        >
          Essai gratuit 14&nbsp;jours
        </Link>
      </section>
    </article>
  );
}
