import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import cities from "@/data/cities.json";

export const dynamic = "force-dynamic";

/* ---------- Types ---------- */

type City = (typeof cities)[number];

type Props = {
  params: Promise<{ ville: string }>;
};

/* ---------- Static generation ---------- */

export function generateStaticParams() {
  return cities.map((city) => ({ ville: city.slug }));
}

/* ---------- Metadata (Title ≤60, Description ≤155) ---------- */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ville } = await params;
  const city = cities.find((c) => c.slug === ville);
  if (!city) return {};

  const title = `Gestion locative à ${city.name} (${city.department})`;
  const fullTitle = `${title} | RentReady`;
  const description = `Gérez vos locations à ${city.name} sans effort : quittances légales, détection des loyers, révision IRL. Essai gratuit 14 jours, sans carte bancaire.`;

  return {
    title,
    description,
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      url: `https://www.rentready.fr/gestion-locative/${city.slug}`,
      siteName: "RentReady",
      images: [
        {
          url: "https://www.rentready.fr/og-image.png",
          width: 1200,
          height: 630,
          alt: `Gestion locative à ${city.name} — RentReady`,
        },
      ],
    },
    alternates: {
      canonical: `https://www.rentready.fr/gestion-locative/${city.slug}`,
    },
  };
}

/* ---------- Helpers ---------- */

function formatPopulation(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n);
}

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
  const pop = city.population;
  const isZoneTendue = ZONES_TENDUES.has(city.slug);

  // Population-based rent estimate (for content variation)
  let avgRent: number;
  let bracketLabel: string;
  if (pop > 500000) {
    avgRent = 14;
    bracketLabel = "métropole";
  } else if (pop > 200000) {
    avgRent = 12;
    bracketLabel = "grande ville";
  } else if (pop > 100000) {
    avgRent = 10;
    bracketLabel = "ville moyenne";
  } else {
    avgRent = 9;
    bracketLabel = "ville";
  }

  return { isZoneTendue, avgRent, bracketLabel };
}

function getFeatures(city: City) {
  const ctx = getCityContext(city);
  return [
    {
      icon: "📄",
      title: "Quittances automatiques",
      description: `Générez et envoyez les quittances de loyer à vos locataires à ${city.name} en un clic. Conformes à l'article 21 de la loi du 6 juillet 1989, avec distinction obligatoire entre loyer nu et provisions pour charges.`,
    },
    {
      icon: "💶",
      title: "Détection des loyers",
      description: `Connectez votre compte bancaire en lecture seule via Open Banking (DSP2). RentReady détecte automatiquement les virements de vos locataires dans le ${city.department} et marque les loyers comme encaissés.`,
    },
    {
      icon: "📈",
      title: "Révision IRL automatique",
      description: `Le calcul de l'Indice de Référence des Loyers est connecté à l'INSEE. Pour vos biens à ${city.name}, RentReady applique la formule légale et notifie vos locataires de la révision annuelle.`,
    },
    {
      icon: "📊",
      title: "Conformité Factur-X 2026",
      description: `Préparez dès maintenant le e-reporting B2C obligatoire en septembre 2027. RentReady génère vos documents au format Factur-X (norme EN 16931), compatible avec la plateforme publique de facturation.`,
    },
    {
      icon: "🏠",
      title: "Portail locataire",
      description: `Offrez à vos locataires à ${city.name} un espace personnel pour consulter leurs quittances, signaler un problème technique avec photo ou vidéo, et suivre l'avancement des interventions.`,
    },
    {
      icon: "🔍",
      title: ctx.isZoneTendue
        ? "Encadrement des loyers"
        : "Analyse fiscale",
      description: ctx.isZoneTendue
        ? `${city.name} fait partie des zones tendues soumises à l'encadrement des loyers. RentReady vérifie que vos montants respectent les plafonds et vous alerte en cas de dépassement du loyer de référence majoré.`
        : `Visualisez vos revenus fonciers, charges déductibles et simulez le régime fiscal le plus avantageux pour vos biens à ${city.name} — micro-foncier, réel, LMNP classique ou dispositif Jeanbrun 2026.`,
    },
  ];
}

function getFaqs(city: City) {
  const ctx = getCityContext(city);
  return [
    {
      question: `Pourquoi utiliser un logiciel de gestion locative à ${city.name} ?`,
      answer: `Gérer des biens locatifs à ${city.name} implique de respecter la législation française (quittances conformes à la loi de 1989, diagnostics obligatoires${ctx.isZoneTendue ? ", respect de l'encadrement des loyers en zone tendue" : ""}). RentReady automatise ces tâches pour vous faire gagner du temps et rester en conformité, quelle que soit la taille de votre patrimoine.`,
    },
    {
      question: `RentReady est-il adapté au marché locatif de ${city.name} ?`,
      answer: `Oui. Avec environ ${formatPopulation(city.population)} habitants, ${city.name} (${city.region}) présente un marché locatif ${ctx.bracketLabel === "métropole" ? "très dynamique avec une forte demande" : ctx.bracketLabel === "grande ville" ? "actif et concurrentiel" : "stable avec une demande régulière"}. RentReady s'adapte à tous les types de biens — du studio meublé à l'immeuble en SCI familiale — avec des outils pensés pour le contexte réglementaire français.`,
    },
    {
      question: `Combien coûte la gestion locative à ${city.name} avec RentReady ?`,
      answer: `RentReady coûte 15 € par mois (ou 150 € par an, soit 2 mois offerts) quel que soit le nombre de biens (jusqu'à 10). C'est 4 à 5 fois moins cher qu'une agence immobilière à ${city.name} qui facture en moyenne 7 % du loyer, soit environ ${ctx.avgRent * 70} € par an pour un loyer de ${ctx.avgRent * 1000 / 10} € mensuels. Essai gratuit de 14 jours sans carte bancaire.`,
    },
    {
      question: `Comment démarrer la gestion locative de mes biens à ${city.name} ?`,
      answer: `Créez votre compte gratuitement en 2 minutes, ajoutez vos biens situés à ${city.name} et vos locataires, et RentReady s'occupe du reste : quittances automatiques, suivi des paiements, relances, révision IRL et préparation des documents fiscaux. Aucune installation n'est nécessaire, tout fonctionne depuis votre navigateur ou votre smartphone.`,
    },
  ];
}

function getLocalParagraphs(city: City) {
  const ctx = getCityContext(city);
  const pop = city.population;

  const intro =
    pop > 500000
      ? `${city.name} est l'une des principales métropoles françaises, avec ${formatPopulation(pop)} habitants et un marché locatif parmi les plus dynamiques de la région ${city.region}. La demande locative y est soutenue par un bassin d'emploi diversifié, une population étudiante importante et un réseau de transports en commun dense.`
      : pop > 200000
        ? `Avec ${formatPopulation(pop)} habitants, ${city.name} s'affirme comme une grande ville attractive de la région ${city.region} (département ${city.department}). Son marché locatif est porté par une croissance démographique régulière et des projets d'urbanisme qui renforcent l'attractivité des quartiers résidentiels.`
        : pop > 100000
          ? `${city.name} (${formatPopulation(pop)} habitants, département ${city.department}) est une ville moyenne dynamique de la région ${city.region}. Le marché locatif y offre un équilibre intéressant entre rendement et stabilité, avec une demande régulière portée par les actifs et les familles.`
          : `Située dans le département ${city.department} (${city.region}), ${city.name} compte ${formatPopulation(pop)} habitants. Le marché locatif local se caractérise par des loyers modérés et un taux de vacance faible, ce qui en fait un territoire de choix pour les investisseurs locatifs à la recherche de rendements réguliers.`;

  const regulation = ctx.isZoneTendue
    ? `En tant que zone tendue, ${city.name} est soumise à l'encadrement des loyers. Les propriétaires bailleurs doivent respecter le loyer de référence fixé par arrêté préfectoral, sous peine de sanctions. RentReady intègre ces contraintes et vous alerte si le montant du loyer dépasse le plafond autorisé. La législation évolue rapidement — obligation de facturation électronique Factur-X dès 2026, e-reporting B2C en 2027 — et le logiciel s'adapte automatiquement.`
    : `Que vous soyez propriétaire d'un appartement en centre-ville ou d'une maison en périphérie de ${city.name}, une gestion locative rigoureuse est essentielle pour sécuriser vos revenus et respecter vos obligations. La réglementation française évolue rapidement — obligation de facturation électronique Factur-X dès 2026, e-reporting B2C en septembre 2027 — et RentReady intègre ces évolutions pour que vous n'ayez pas à vous en soucier.`;

  const closing =
    pop > 200000
      ? `Pour un propriétaire bailleur à ${city.name}, automatiser la gestion locative représente un gain de temps considérable : fin du pointage manuel des virements, quittances conformes générées sans intervention, et révision de loyer calculée automatiquement. RentReady transforme une corvée mensuelle en un processus invisible qui tourne en arrière-plan.`
      : `Pour les propriétaires bailleurs à ${city.name} et dans le département ${city.department}, RentReady élimine les tâches répétitives : quittances automatiques conformes à la loi de 1989, détection des virements via Open Banking, et calcul de la révision IRL connecté à l'INSEE. Vous gardez le contrôle total de vos biens sans y consacrer des heures chaque mois.`;

  return { intro, regulation, closing };
}

/* ---------- Structured data ---------- */

function CityJsonLd({ city }: { city: City }) {
  const ctx = getCityContext(city);
  const faqs = getFaqs(city);

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "RentReady",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: `https://www.rentready.fr/gestion-locative/${city.slug}`,
        description: `Logiciel de gestion locative pour propriétaires bailleurs à ${city.name} (${city.department}). Quittances conformes, détection des loyers, révision IRL.`,
        offers: {
          "@type": "Offer",
          price: "15.00",
          priceCurrency: "EUR",
          priceValidUntil: "2027-12-31",
          availability: "https://schema.org/InStock",
        },
        areaServed: {
          "@type": "City",
          name: city.name,
          containedInPlace: [
            {
              "@type": "AdministrativeArea",
              name: `Département ${city.department}`,
            },
            {
              "@type": "AdministrativeArea",
              name: city.region,
            },
            {
              "@type": "Country",
              name: "France",
            },
          ],
        },
      },
      {
        "@type": "Service",
        name: `Gestion locative à ${city.name}`,
        serviceType: "Property Management Software",
        provider: {
          "@type": "Organization",
          name: "RentReady",
          url: "https://www.rentready.fr",
        },
        areaServed: {
          "@type": "City",
          name: city.name,
          containedInPlace: {
            "@type": "AdministrativeArea",
            name: city.region,
          },
        },
        offers: {
          "@type": "Offer",
          price: "15.00",
          priceCurrency: "EUR",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ---------- Page ---------- */

export default async function GestionLocativeVille({ params }: Props) {
  const { ville } = await params;
  const city = cities.find((c) => c.slug === ville);
  if (!city) notFound();

  const features = getFeatures(city);
  const faqs = getFaqs(city);
  const local = getLocalParagraphs(city);

  return (
    <>
      <CityJsonLd city={city} />

      <article>
        {/* ── Hero ── */}
        <section className="bg-gradient-to-b from-[#f8f7f4] to-white px-4 py-20 text-center sm:px-6 sm:py-28">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-sm font-medium tracking-wide text-blue-600 uppercase">
              Gestion locative · {city.region}
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
              Gestion locative à&nbsp;{city.name}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-stone-600">
              Le logiciel de gestion locative qui automatise les quittances, le
              suivi des loyers et la conformité légale pour les propriétaires
              bailleurs à {city.name} ({city.department}). Essai gratuit.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
              >
                Essai gratuit 14&nbsp;jours
              </Link>
              <Link
                href="/gestion-locative"
                className="text-sm font-medium text-stone-500 transition-colors hover:text-stone-700"
              >
                Voir toutes les villes&nbsp;→
              </Link>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-2xl font-bold text-stone-900 sm:text-3xl">
              Tout ce qu&apos;il vous faut pour gérer vos locations à&nbsp;{city.name}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border border-stone-200/80 bg-[#f8f7f4] p-6 shadow-sm"
                >
                  <span className="text-2xl" role="img" aria-hidden="true">
                    {f.icon}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-stone-900">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Local context (unique per city) ── */}
        <section className="bg-[#f8f7f4] px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-2xl font-bold text-stone-900 sm:text-3xl">
              Le marché locatif à&nbsp;{city.name} en 2026
            </h2>
            <div className="space-y-4 text-stone-700 leading-relaxed">
              <p>{local.intro}</p>
              <p>{local.regulation}</p>
              <p>{local.closing}</p>
            </div>

            {/* Key stats */}
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Population", value: formatPopulation(city.population) },
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
              Questions fréquentes — Gestion locative à&nbsp;{city.name}
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
                  <p className="mt-3 text-stone-600 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-[#f8f7f4] px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Commencez votre essai gratuit à&nbsp;{city.name}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-stone-300">
              Rejoignez les propriétaires qui simplifient leur gestion locative à{" "}
              {city.name} avec RentReady. Sans carte bancaire, sans engagement.
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
