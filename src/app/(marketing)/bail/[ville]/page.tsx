import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import cities from "@/data/cities.json";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { baseMetadata } from "@/lib/seo/metadata";

// ISR: city pages use static city data — revalidate monthly
export const revalidate = 2592000;

/* ---------- Types ---------- */

type City = (typeof cities)[number];
type Props = {
  params: Promise<{ ville: string }>;
};

/* ---------- Static generation ---------- */

export function generateStaticParams() {
  return cities.map((city) => ({ ville: city.slug }));
}

/* ---------- Helpers ---------- */

/** Cities subject to rent control (encadrement des loyers) */
const ZONES_TENDUES = new Set([
  "paris",
  "lyon",
  "lille",
  "bordeaux",
  "montpellier",
  "marseille",
  "nice",
  "toulouse",
  "nantes",
  "strasbourg",
  "rennes",
  "grenoble",
]);

function getCityContext(city: City) {
  const isZoneTendue = ZONES_TENDUES.has(city.slug);
  const pop = city.population;
  let avgRent: number;
  if (pop > 500000) avgRent = 14;
  else if (pop > 200000) avgRent = 12;
  else if (pop > 100000) avgRent = 10;
  else avgRent = 9;
  return { isZoneTendue, avgRent };
}

/* ---------- Metadata ---------- */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ville } = await params;
  const city = cities.find((c) => c.slug === ville);
  if (!city) return {};
  const title = `Modèle bail de location à ${city.name} — Gratuit 2026`;
  return baseMetadata({
    title,
    description: `Téléchargez un modèle de bail de location adapté à ${city.name}. Vide, meublé, colocation — tous conformes à la loi 1989 et à la réglementation ${city.name} (${city.department}).`,
    url: `/bail/${city.slug}`,
    ogType: "template",
  });
}

/* ---------- Page content ---------- */

function getLocalParagraphs(city: City) {
  const ctx = getCityContext(city);
  const pop = city.population;

  const intro =
    pop > 500000
      ? `${city.name} compte ${new Intl.NumberFormat("fr-FR").format(pop)} habitants. Le marché locatif de la ${city.region} est l'un des plus dynamiques de France, avec une demande locative portée par un bassin d'emploi diversifié, une population étudiante massive et des transports en commun denses. Trouver un locataire n'y est pas difficile — encore faut-il que le bail soit parfaitement rédigé.`
      : pop > 200000
        ? `Avec ${new Intl.NumberFormat("fr-FR").format(pop)} habitants, ${city.name} (département ${city.department}, ${city.region}) s'affirme comme une grande ville attractive. Son marché locatif est porté par une croissance démographique régulière et des projets urbains qui renforcent l'attractivité des quartiers résidentiels.`
        : pop > 100000
          ? `${city.name} (${new Intl.NumberFormat("fr-FR").format(pop)} habitants, département ${city.department}) est une ville moyenne dynamique de la région ${city.region}. Le marché locatif y offre un équilibre intéressant entre rendement locatif et stabilité pour les propriétaires bailleurs.`
          : `Située dans le département ${city.department} (${city.region}), ${city.name} compte ${new Intl.NumberFormat("fr-FR").format(pop)} habitants. Le marché locatif local se caractérise par des loyers accessibles et un taux de vacance faible.`;

  const regulation = ctx.isZoneTendue
    ? `En tant que commune en zone tendue, ${city.name} est soumise à l'encadrement des loyers à la relocation. Depuis 2024, le loyer de relocation ne peut pas dépasser le loyer de référence majoré fixé par le Préfet, sous peine de sanctions. Le bail doit intégrer les mentions obligatoires relatives à cet encadrement. Notre modèle est automatiquement mis à jour pour refléter les dernières évolutions réglementaires.`
    : `Que vous soyez propriétaire d'un appartement en centre-ville ou d'une maison en périphérie de ${city.name}, la rédaction du bail est une étape déterminante. Elle conditionne la relation avec votre locataire pour toute la durée de la location. Notre modèle de bail vous garantit un document juridiquement valide, prêt à être signé en quelques minutes.`;

  const closing = `Les modèles de bail proposés par RentReady sont téléchargés gratuitement et mis à jour avec les dernières évolutions législatives. Que vous louiez à ${city.name} un logement vide ou meublé, en colocation ou en bail mobilité, vous trouverez le modèle adapté à votre situation.`;

  return { intro, regulation, closing };
}

function getBailTypes(city: City) {
  const ctx = getCityContext(city);
  return [
    {
      type: "Vide",
      emoji: "🏠",
      badge: "Le + courant",
      title: `Bail ${city.name} — Location vide`,
      description: `Modèle classique pour une location non meublée à ${city.name}. Durée minimum de 3 ans en zone tendue, 1 an sinon. Dépôt de garantie limité à 1 mois hors charges.`,
      duration: "3 ans minimum",
      deposit: "max 1 mois HT",
      href: "/templates/bail-vide",
      popular: true,
    },
    {
      type: "Meublé",
      emoji: "🛋️",
      badge: "1 an minimum",
      title: `Bail ${city.name} — Location meublée`,
      description: `Modèle pour logement meublé à ${city.name}. Durée d'un an minimum, reconductible. Dépôt de garantie limité à 2 mois hors charges. Inventaire de meubles intégré.`,
      duration: "1 an minimum",
      deposit: "max 2 mois HT",
      href: "/templates/bail-meuble",
      popular: true,
    },
    {
      type: "Colocation",
      emoji: "👥",
      badge: "Solidarité",
      title: `Bail ${city.name} — Colocation`,
      description: `Location partagée à ${city.name} avec clause de solidarité ou contrat individuel. Idéal pour les appartements familiaux ou les logements étudiants.`,
      duration: "3 ans (vide) / 1 an (meublé)",
      deposit: "max 2 mois × occupants",
      href: "/templates/colocation",
      popular: false,
    },
    {
      type: "Mobilité",
      emoji: "🔑",
      badge: "1 à 10 mois",
      title: `Bail ${city.name} — Mobilité`,
      description: `Locations temporaires à ${city.name} pour professionnels en mutation. Pas de dépôt de garantie, durée de 1 à 10 mois, non reconductible automatiquement.`,
      duration: "1 à 10 mois",
      deposit: "Aucun",
      href: "/templates/bail-mobilite",
      popular: false,
    },
  ];
}

function getFaqs(city: City) {
  const ctx = getCityContext(city);
  return [
    {
      question: `Comment rédiger un bail de location à ${city.name} ?`,
      answer: `Téléchargez notre modèle gratuit de bail de location adapté à ${city.name}. Remplissez les champs obligatoires (identification des parties, description du bien, loyer, dépôt de garantie, durée), puis signez en deux exemplaires. Le modèle intègre les mentions légales spécifiques à la réglementation française et, si ${city.name} est en zone tendue, les obligations liées à l'encadrement des loyers.`,
    },
    {
      question: `L'encadrement des loyers s'applique-t-il à ${city.name} ?`,
      answer: ctx.isZoneTendue
        ? `Oui. ${city.name} figure parmi les communes en zone tendue soumises à l'encadrement des loyers. Lors de la mise en location, le loyer ne peut pas dépasser le loyer de référence majoré fixé par arrêté préfectoral. Un complément pour atypie est possible dans la limite de 20 %% au-dessus du loyer de référence.`
        : `Non. ${city.name} n'est actuellement pas soumise à l'encadrement des loyers à la relocation. Les propriétaires bailleurs sont libres de fixer le loyer dans le cadre de la loi du 6 juillet 1989, sans plafonnement spécifique.`,
    },
    {
      question: `Quel dépôt de garantie pour une location à ${city.name} ?`,
      answer: `Le dépôt de garantie est encadré par la loi : 1 mois de loyer hors charges pour une location vide, 2 mois pour une location meublée. Ces plafonds s'appliquent sur tout le territoire français, y compris à ${city.name}. Ils ne peuvent pas être dépassés, même avec l'accord du locataire.`,
    },
    {
      question: `Comment utiliser le modèle de bail pour ${city.name} ?`,
      answer: `Sélectionnez le type de bail correspondant à votre situation (vide, meublé, colocation ou mobilité), téléchargez le modèle, puis personnalisez les champs : identité du bailleur et du locataire, adresse du bien, montant du loyer et des charges, date de début de location. Joignez les annexes obligatoires (DPE, état des lieux, diagnostics), puis signez les deux exemplaires.`,
    },
  ];
}

/* ---------- Structured data ---------- */

/* ─── Structured Data ─── */

function buildBailVilleSchema(city: City) {
  const faqs = getFaqs(city);
  const bailTypes = getBailTypes(city);
  const ctx = getCityContext(city);

  return {
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
          {
            "@type": "ListItem",
            position: 1,
            name: "Accueil",
            item: "https://www.rentready.fr",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Bail de location",
            item: "https://www.rentready.fr/bail",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: city.name,
            item: `https://www.rentready.fr/bail/${city.slug}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        name: `FAQ — Modèle bail de location ${city.name} 2026`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      {
        "@type": "SoftwareApplication",
        name: `RentReady — Modèles de bail ${city.name}`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: `https://www.rentready.fr/bail/${city.slug}`,
        description: `Modèles de bail gratuits et conformes pour les propriétaires bailleurs à ${city.name}. Bail vide, meublé, colocation, mobilité. Téléchargez et personnalisez en ligne.`,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: `https://www.rentready.fr/register?template=bail`,
        },
        featureList: bailTypes.map((b) => `Modèle bail ${b.type.toLowerCase()} pour ${city.name}`),
      },
      {
        "@type": ctx.isZoneTendue ? "Place" : "Organization",
        name: city.name,
        ...(ctx.isZoneTendue
          ? {
              containedInPlace: {
                "@type": "Country",
                name: "France",
              },
            }
          : {}),
      },
    ],
  };
}

/* ---------- Page ---------- */

export default async function BailVillePage({ params }: Props) {
  const { ville } = await params;
  const city = cities.find((c) => c.slug === ville);
  if (!city) notFound();

  const bailTypes = getBailTypes(city);
  const faqs = getFaqs(city);
  const local = getLocalParagraphs(city);
  const ctx = getCityContext(city);

  return (
    <>
      <SchemaMarkup data={buildBailVilleSchema(city)} />
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Bail de location", href: "/bail" },
          { label: city.name, href: `/bail/${city.slug}`, isCurrentPage: true },
        ]}
      />
      <article>
        {/* ── Hero ── */}
        <section className="bg-gradient-to-b from-[#f8f7f4] to-white px-4 py-20 text-center sm:px-6 sm:py-28">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-sm font-medium tracking-wide text-blue-600 uppercase">
              Modèles gratuits · {city.region}
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
              Modèle de bail à&nbsp;{city.name}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-stone-600">
              Téléchargez le modèle de bail adapté à votre location à {city.name}.
              Vide, meublé, colocation — gratuit et conforme à la réglementation
              en vigueur.
            </p>
            {ctx.isZoneTendue && (
              <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2 text-sm text-amber-800">
                <span>⚠️</span>
                <span>
                  {city.name} est en zone tendue — l&apos;encadrement des loyers
                  s&apos;applique à la relocation
                </span>
              </div>
            )}
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/bail"
                className="text-sm font-medium text-stone-500 transition-colors hover:text-stone-700"
              >
                ← Tous les modèles de bail
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
              >
                Essai gratuit 14 jours
              </Link>
            </div>
          </div>
        </section>

        {/* ── Bail type cards ── */}
        <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-2 text-center text-2xl font-bold text-stone-900 sm:text-3xl">
              Modèles de bail pour {city.name}
            </h2>
            <p className="mb-12 text-center text-stone-600">
              Sélectionnez le type de bail correspondant à votre location
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {bailTypes.map((card) => (
                <div
                  key={card.type}
                  className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-[#f8f7f4] p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {card.popular && (
                    <div className="absolute -right-1 -top-1">
                      <span className="inline-flex items-center rounded-bl-lg rounded-tr-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                        Populaire
                      </span>
                    </div>
                  )}
                  <span className="text-3xl" role="img" aria-hidden="true">
                    {card.emoji}
                  </span>
                  <div className="mt-3 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-stone-900">
                      {card.type}
                    </h3>
                    <span className="rounded border border-stone-300 bg-white px-2 py-0.5 text-xs text-stone-500">
                      {card.badge}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {card.description}
                  </p>
                  <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-stone-500">
                    <div>
                      <dt className="font-medium text-stone-700">Durée</dt>
                      <dd>{card.duration}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-stone-700">Dépôt</dt>
                      <dd>{card.deposit}</dd>
                    </div>
                  </dl>
                  <Link
                    href={card.href}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                  >
                    Télécharger →
                  </Link>
                </div>
              ))}
            </div>

            {/* Internal links to other resources */}
            <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm text-stone-500">
              <Link href="/quittances" className="text-blue-600 hover:underline">
                Générer une quittance →
              </Link>
              <Link
                href="/outils/calculateur-depot-garantie"
                className="text-blue-600 hover:underline"
              >
                Calculateur dépôt →
              </Link>
              <Link
                href="/gestion-locative"
                className="text-blue-600 hover:underline"
              >
                Gestion locative →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Local context ── */}
        <section className="bg-[#f8f7f4] px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-2xl font-bold text-stone-900 sm:text-3xl">
              Louer à {city.name} en 2026 — ce qu&apos;il faut savoir
            </h2>
            <div className="space-y-4 text-stone-700 leading-relaxed">
              <p>{local.intro}</p>
              <p>{local.regulation}</p>
              <p>{local.closing}</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Population", value: new Intl.NumberFormat("fr-FR").format(city.population) },
                { label: "Département", value: city.department },
                { label: "Région", value: city.region },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-stone-200/80 bg-white p-5 text-center shadow-sm"
                >
                  <p className="text-2xl font-bold text-stone-900">{stat.value}</p>
                  <p className="mt-1 text-sm text-stone-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-2xl font-bold text-stone-900 sm:text-3xl">
              Questions fréquentes — Bail à {city.name}
            </h2>
            <div className="divide-y divide-stone-200">
              {faqs.map((faq) => (
                <details key={faq.question} className="group py-5">
                  <summary className="flex cursor-pointer items-center justify-between font-medium text-stone-900">
                    {faq.question}
                    <span className="ml-4 shrink-0 text-stone-400 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-stone-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-[#f8f7f4] px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Gérez vos baux et vos quittances à {city.name} avec RentReady
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-stone-300">
              Créez vos baux en 10 minutes, générez automatiquement les
              quittances de loyer. Essai gratuit 14 jours, sans carte bancaire.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
            >
              Créer mon compte gratuitement
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
