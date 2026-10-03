import type { Metadata } from "next";
import Link from "next/link";
import cities from "@/data/cities.json";
import { SchemaMarkup, paidOffer } from "@/components/seo/schema-markup";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { baseMetadata } from "@/lib/seo/metadata";
import {
  E_REPORTING_YEAR,
  FEATURE_LIST,
  SAME_AS,
  SITE_DESCRIPTION,
  SITE_URL,
  formatEntryPrice,
} from "@/data/entity";

// Rendered on demand. SEO/marketing content, not product surface: prerendering the
// ~135-page content suite exhausted the Node heap during `next build`
// ("Ineffective mark-compacts near heap limit"). All data is local, so rendering
// per request costs ~ms and every URL keeps working.
export const dynamic = "force-dynamic";

/**
 * The canonical page for « logiciel de gestion locative ».
 *
 * This URL used to be a directory: an H1 reading "Gestion Locative en France", a
 * paragraph about 50 cities, and 50 links. It said nothing about the product —
 * and the nav labelled it "Fonctionnalités" while `/locations` carried the actual
 * product copy, so the one page that should have sold the software was a list of
 * city pages. The directory now lives at `/villes`.
 *
 * The page answers what a landlord is deciding, in blocks that stand on their
 * own: what the software is, who it is for, why not a spreadsheet, how the
 * money flows, what it costs, and what it takes to be compliant.
 */

const GESTION_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "RentReady",
      url: SITE_URL,
    },
    {
      "@type": "Organization",
      name: "RentReady",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.svg`,
      description: SITE_DESCRIPTION,
      foundingDate: "2024",
      sameAs: SAME_AS,
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
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Logiciel de gestion locative",
          item: `${SITE_URL}/gestion-locative`,
        },
      ],
    },
    {
      "@type": "SoftwareApplication",
      name: "RentReady — Logiciel de gestion locative",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: `${SITE_URL}/gestion-locative`,
      description: SITE_DESCRIPTION,
      offers: paidOffer(),
      featureList: FEATURE_LIST,
      audience: {
        "@type": "Audience",
        audienceType:
          "Propriétaires bailleurs indépendants en France (1 à 10 logements)",
      },
      areaServed: {
        "@type": "Country",
        name: "France",
      },
    },
  ],
};

export async function generateMetadata() {
  return baseMetadata({
    title:
      "Logiciel de gestion locative pour propriétaires bailleurs — RentReady",
    description:
      "Gérez vos loyers, vos locataires et vos documents de location dans un seul logiciel. Quittances automatiques, révision IRL, état des lieux. Dès 9 €/mois.",
    url: "/gestion-locative",
    ogType: "feature",
  });
}

const ANSWERS = [
  {
    question: "Qu'est-ce qu'un logiciel de gestion locative ?",
    answer:
      "C'est un logiciel qui rassemble, pour un propriétaire bailleur, ce qui se faisait auparavant dans un tableur et une pile de PDF : les biens, les locataires, les baux, les loyers attendus, les paiements reçus, et les documents qui en découlent. Son rôle n'est pas de remplacer le bailleur, mais de savoir à chaque instant qui devait payer, qui a payé, ce qui manque et quelle échéance approche.",
  },
  {
    question: "À qui s'adresse RentReady ?",
    answer:
      "Au propriétaire bailleur indépendant français qui gère lui-même un petit parc, généralement de 1 à 10 logements, et qui ne veut pas apprendre un logiciel d'agence. RentReady ne vise ni les professionnels de la gestion locative ni les agences : leurs contraintes ne sont pas les nôtres.",
  },
  {
    question: "En quoi est-ce différent d'un tableur ?",
    answer:
      "Un tableur enregistre ce que vous saisissez et ne calcule rien de fiable : une quittance y est recopiée, un prorata est approché, une révision de loyer se calcule sur un indice recopié depuis un site. RentReady déduit l'état à partir des données du bail : le montant du mois, la part déjà payée, le reste dû, la date anniversaire de la révision. Si une saisie manque, rien ne se recalcule seul — c'est la limite structurelle du tableur.",
  },
  {
    question: "Comment fonctionne le parcours de gestion dans RentReady ?",
    answer:
      "Un bien, un locataire, un bail, un loyer attendu chaque mois. RentReady sait alors qui doit payer quoi, et quand. À chaque paiement enregistré, il calcule l'état réel du mois — payé, partiel, impayé — et génère la quittance correspondante. Le propriétaire voit ce qui est réglé, ce qui ne l'est pas, et ce qui approche.",
  },
  {
    question: "Combien coûte RentReady ?",
    answer: `À partir de ${formatEntryPrice()} par mois pour le plan Starter, qui couvre jusqu'à 3 biens. Le plan Pro, à 15 €/mois, couvre jusqu'à 10 biens et ajoute l'OCR des factures artisans, la conformité Factur-X et la relance automatique. Essai gratuit 14 jours, sans carte bancaire.`,
  },
  {
    question: "Faut-il connaître la réglementation locative ?",
    answer: `Non, RentReady applique les règles que vous.:
- la quittance respecte les mentions obligatoires de la loi du 6 juillet 1989 ;
- le dépôt de garantie est plafonné selon le type de bail et la zone ;
- la révision de loyer utilise l'indice de référence des loyers publié par l'INSEE ;
- la facture respecte le format Factur-X et l'e-reporting B2C ${E_REPORTING_YEAR}.`,
  },
];

const STEPS = [
  {
    step: "1. Le bien",
    text: "Adresse, surface habitable, pièces. La surface sert au calcul du loyer au m².",
  },
  {
    step: "2. Le locataire",
    text: "Identité, coordonnées, situation du logement.",
  },
  {
    step: "3. Le bail",
    text: "Loyer, charges, dépôt de garantie, date de début, durée. Le bail produit l'échéancier.",
  },
  {
    step: "4. Le loyer attendu",
    text: "RentReady sait quel montant, quel mois, et à quelle échéance.",
  },
  {
    step: "5. Le paiement",
    text: "Complet, partiel ou en retard : l'état réel du mois est calculé, pas déclaré.",
  },
  {
    step: "6. La quittance",
    text: "Générée dès que le paiement le permet, avec les mentions obligatoires.",
  },
];

type City = (typeof cities)[number];

function groupByRegion(data: City[]): Record<string, City[]> {
  const groups: Record<string, City[]> = {};
  for (const city of data) {
    (groups[city.region] ??= []).push(city);
  }
  return Object.fromEntries(
    Object.entries(groups).sort(([a], [b]) => a.localeCompare(b, "fr"))
  );
}

export default function GestionLocativePage() {
  const regions = groupByRegion(cities);

  return (
    <article className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <SchemaMarkup data={GESTION_SCHEMA} breadcrumbRenderedByComponent />

      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          {
            label: "Logiciel de gestion locative",
            href: "/gestion-locative",
            isCurrentPage: true,
          },
        ]}
      />

      {/* What it is — the definition comes first and stands on its own. */}
      <header className="mb-14">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-700">
          Logiciel de gestion locative
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Gérer ses locations sans tableur ni dossiers de PDF
        </h1>
        <p className="mt-5 max-w-3xl text-lg text-stone-700">
          RentReady réunit vos biens, vos locataires, vos baux, vos loyers
          attendus et vos paiements dans un seul endroit. Il sait qui doit payer,
          qui a payé, ce qui reste dû et quelle échéance approche — puis génère la
          quittance. Conçu pour le propriétaire bailleur indépendant qui gère de 1
          à 10 logements.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/register"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
          >
            Essai gratuit 14 jours
          </Link>
          <Link
            href="/features"
            className="inline-block rounded-lg border border-stone-300 bg-white px-6 py-3 font-medium text-stone-800 transition-colors hover:border-stone-400"
          >
            Voir les fonctionnalités
          </Link>
        </div>
        <p className="mt-3 text-sm text-stone-600">
          Dès {formatEntryPrice()} par mois · sans carte bancaire
        </p>
      </header>

      {/* The loop, stated plainly. */}
      <section className="mb-14">
        <h2 className="mb-4 text-2xl font-bold text-stone-900">
          Le parcours que RentReady tient à jour pour vous
        </h2>
        <p className="mb-6 max-w-3xl text-stone-700">
          Une seule boucle, du bien à la quittance. Chaque étape alimente la
          suivante ; c&apos;est ce qui évite les oublis et les calculs refaits à la
          main.
        </p>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((item) => (
            <li
              key={item.step}
              className="rounded-xl border border-stone-200 bg-white p-5"
            >
              <h3 className="font-semibold text-stone-900">{item.step}</h3>
              <p className="mt-1.5 text-sm text-stone-700">{item.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* What it does for you. */}
      <section className="mb-14">
        <h2 className="mb-4 text-2xl font-bold text-stone-900">
          Ce que RentReady fait à votre place
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {FEATURE_LIST.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5">
              <span aria-hidden className="mt-0.5 text-blue-600">
                ✓
              </span>
              <span className="text-stone-700">{feature}</span>
            </li>
          ))}
        </ul>
        <Link
          href="/features"
          className="mt-4 inline-block text-blue-700 underline underline-offset-4"
        >
          Le détail des fonctionnalités
        </Link>
      </section>

      {/* Direct answers — each block readable out of context. */}
      <section className="mb-14">
        <h2 className="mb-5 text-2xl font-bold text-stone-900">
          Questions fréquentes
        </h2>
        <div className="space-y-6">
          {ANSWERS.map((item) => (
            <div key={item.question}>
              <h3 className="font-semibold text-stone-900">
                {item.question}
              </h3>
              <p className="mt-1.5 whitespace-pre-line text-stone-700">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Where it applies. */}
      <section className="mb-14">
        <h2 className="mb-2 text-2xl font-bold text-stone-900">
          RentReady dans {cities.length} villes françaises
        </h2>
        <p className="mb-6 max-w-3xl text-stone-700">
          Le logiciel est le même partout, mais la réglementation locative change
          d&apos;une commune à l&apos;autre : encadrement des loyers, zone tendue,
          arrêté préfectoral. Ces pages indiquent la règle applicable dans votre
          ville.
        </p>
        <div className="space-y-8">
          {Object.entries(regions).map(([region, regionCities]) => (
            <div key={region}>
              <h3 className="mb-3 border-b border-stone-200 pb-2 text-lg font-semibold text-stone-800">
                {region}
              </h3>
              <ul className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {regionCities
                  .slice()
                  .sort((a, b) => b.population - a.population)
                  .map((city) => (
                    <li key={city.slug}>
                      <Link
                        href={`/gestion-locative/${city.slug}`}
                        className="block rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 transition-colors hover:border-blue-300 hover:text-blue-700"
                      >
                        {city.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
        <Link
          href="/villes"
          className="mt-5 inline-block text-blue-700 underline underline-offset-4"
        >
          Voir toutes les villes et leur réglementation
        </Link>
      </section>

      {/* Conversion. */}
      <section className="rounded-2xl bg-stone-900 px-6 py-14 text-center text-white">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Commencez par configurer un bien
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-stone-300">
          Ajoutez un locataire, un bail : RentReady calcule le reste et vous dit
          ce qui manque.
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