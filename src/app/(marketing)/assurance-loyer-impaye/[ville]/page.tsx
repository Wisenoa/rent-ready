import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import cities from "@/data/cities.json";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { baseMetadata } from "@/lib/seo/metadata";

// ISR: revalidate monthly
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

/* ---------- Zone tendue ---------- */

const ZONES_TENDUES = new Set([
  "paris", "lyon", "lille", "bordeaux", "montpellier",
  "marseille", "nice", "toulouse", "nantes", "strasbourg",
  "rennes", "grenoble",
]);

/* ---------- Helpers ---------- */

function getCityContext(city: City) {
  const isZoneTendue = ZONES_TENDUES.has(city.slug);
  const pop = city.population;
  // Risk level based on population density and market size
  let riskLevel: "high" | "medium" | "low";
  if (pop > 500000) riskLevel = "high";
  else if (pop > 200000) riskLevel = "medium";
  else riskLevel = "low";
  return { isZoneTendue, riskLevel };
}

/* ---------- Metadata ---------- */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ville } = await params;
  const city = cities.find((c) => c.slug === ville);
  if (!city) return {};

  const title = `Assurance loyer impayé à ${city.name} (GLI) — Protégez vos revenus 2026`;
  const description = `Souscrivez une Garantie des Loyers Impayés (GLI) pour votre bien à ${city.name}. Couverture jusqu'à 90 % des loyers impayés, prise en charge des frais d'expulsion. Comparatif et devis en ligne.`;

  return baseMetadata({
    title,
    description,
    url: `/assurance-loyer-impaye/${city.slug}`,
    ogType: "template",
  });
}

/* ---------- Local paragraphs ---------- */

function getLocalParagraphs(city: City) {
  const ctx = getCityContext(city);
  const pop = city.population;

  const intro =
    pop > 500000
      ? `${city.name} compte ${new Intl.NumberFormat("fr-FR").format(pop)} habitants. Avec un marché locatif de cette taille, le risque d'impayés existe même avec une sélection rigoureuse des locataires. En zone${ctx.isZoneTendue ? " tendue" : ""}, les délais d'expulsion peuvent dépasser 12 mois — sans GLI, vous couvrez ce risque sur vos fonds propres.`
      : pop > 200000
        ? `Avec ${new Intl.NumberFormat("fr-FR").format(pop)} habitants, ${city.name} possède un marché locatif actif dans le département ${city.department}. La GLI (Garantie des Loyers Impayés) vous protège contre les locataires défaillants — un risque que même les meilleurs propriétaires peuvent rencontrer.`
        : pop > 100000
          ? `${city.name} (${new Intl.NumberFormat("fr-FR").format(pop)} habitants, ${city.region}) : même une commune de taille moyenne n'échappe pas au risque d'impayé. La GLI est un filet de sécurité indispensable pour tout propriétaire bailleur.`
          : `Située dans le département ${city.department} (${city.region}), ${city.name} compte ${new Intl.NumberFormat("fr-FR").format(pop)} habitants. Une assurance loyer impayé vous protège contre les imprévus — un seul impayé de 6 mois peut représenter plusieurs milliers d'euros.`;

  const whyGli =
    ctx.riskLevel === "high"
      ? `À ${city.name}, le coût élevé du marché locatif signifie que chaque impayé représente un manque à gagner significatif. Un loyer mensuel de 1 200 € sur 12 mois d'impayé = 14 400 € non recouvrés. La GLI rembourse jusqu'à 90 % de cette somme — soit environ 13 000 € récupérés.`
      : ctx.riskLevel === "medium"
        ? `À ${city.name}, le marché locatif reste tendu malgré une taille modérée. Un impayé prolongé peut rapidement impacter votre trésorerie personnelle. La GLI prend en charge le remboursement des loyers et les frais de procédure.`
        : `Même si ${city.name} présente un risque modéré, un impayé de quelques mois peut survenir pour des raisons indépendantes de votre volonté (perte d'emploi du locataire, divorce, maladie). La GLI vous couvre sans effort.`;

  const closing = `Avec RentReady, détectez automatiquement les paiements manquants et soyez alerté en temps réel. Combinez une gestion locative intelligente avec une assurance loyer impayé pour une protection complète de vos revenus à ${city.name}.`;

  return { intro, whyGli, closing };
}

/* ---------- Features ---------- */

function getFeatures(city: City) {
  const ctx = getCityContext(city);
  return [
    {
      icon: "🛡️",
      title: "Remboursement jusqu'à 90 % des loyers",
      description: `En cas d'impayé à ${city.name}, la GLI rembourse jusqu'à 90 % du montant des loyers et charges impayés, dans la limite du plafond contractualisé. Vous preservez vos revenus locatifs.`,
    },
    {
      icon: "⚖️",
      title: "Frais d'expulsion pris en charge",
      description: `La GLI couvre également les honoraires d'avocat et les frais de procédure en cas d'expulsion à ${city.name}. Un procédurier peut rapidement dépasser 3 000 € — sans GLI, c'est à votre charge.`,
    },
    {
      icon: "📊",
      title: "Couverture en cas de dégradations",
      description: `Selon le contrat, la garantie peut inclure les dégradations du bien loué à ${city.name}. Vérifiez les conditions générales pour une couverture complète.`,
    },
    {
      icon: "📱",
      title: "Alerte impayé en temps réel",
      description: `Avec RentReady, détectez automatiquement les paiements manquants pour vos biens à ${city.name}. Alerte immédiate en cas de retard — pour agir vite et déclarer le sinistre à votre assureur dans les délais.`,
    },
    {
      icon: "📋",
      title: "Déclaration de sinistre simplifiée",
      description: `En cas d'impayé à ${city.name}, déclarez le sinistre en quelques clics. Nous vous accompagnons dans la constitution du dossier pour maximiser le remboursement.`,
    },
    {
      icon: ctx.isZoneTendue ? "⚠️" : "🏠",
      title: ctx.isZoneTendue ? "Obligation de protection en zone tendue" : "Couverture adaptée à votre bien",
      description: ctx.isZoneTendue
        ? `${city.name} est en zone tendue. Les délais d'expulsion y sont parmi les plus longs de France — 12 à 18 mois. Sans GLI, vous assumez l'intégralité du risque.`
        : `Que votre bien à ${city.name} soit loué vide ou meublé, la GLI s'adapte à votre situation : bail habitation, bail commercial, ou colocation.`,
    },
  ];
}

/* ---------- Coverage tiers ---------- */

function getCoverageTiers(city: City) {
  return [
    {
      name: "GLI Standard",
      price: "~2-3 % du loyer annuel",
      description: `Pour un bien à ${city.name} avec locataire en CDI. Couverture de base : remboursement loyers + charges impayés.`,
      features: [
        "Remboursement jusqu'à 80 % des loyers impayés",
        "Frais d'avocat jusqu'à 1 500 €",
        "Délai de carence de 1 à 2 mois",
        "Franchise de 1 mois par sinistre",
      ],
      cta: "Comparer les GLI",
    },
    {
      name: "GLI Premium",
      price: "~3-4 % du loyer annuel",
      description: `Couverture étendue pour les propriétaires de ${city.name} souhaitant une protection maximale.`,
      features: [
        "Remboursement jusqu'à 90 % des loyers impayés",
        "Frais d'expulsion et avocat illimités",
        "Garantie dégradations incluse",
        "Délai de carence réduit à 1 mois",
        "Sans franchise",
      ],
      cta: "Demander un devis",
    },
    {
      name: "Protection Juridique",
      price: "~10-20 €/mois",
      description: `Accompagnement procédural seul — ne rembourse pas les loyers. À combiner avec une GLI ou l'auto-assurance à ${city.name}.`,
      features: [
        "Prise en charge des frais d'avocat",
        "Accompagnement en cas de litige",
        "Ne rembourse PAS les loyers impayés",
        "Couverture large (voisinage, contractuel)",
      ],
      cta: "En savoir plus",
    },
  ];
}

/* ---------- FAQs ---------- */

function getFaqs(city: City) {
  const ctx = getCityContext(city);
  return [
    {
      question: `La GLI est-elle obligatoire pour un bien à ${city.name} ?`,
      answer: `Non, la GLI n'est pas obligatoire légalement — même en zone tendue comme ${city.name}. Elle reste cependant fortement recommandée. L'assurance habitation du locataire ne couvre pas les impayés, et sans GLI, vous assumez seul le risque de non-paiement.`,
    },
    {
      question: `Quel est le coût d'une GLI pour un bien à ${city.name} ?`,
      answer: `Une GLI coûte généralement entre 2 % et 4 % du montant annuel du loyer charges comprises. Par exemple, pour un loyer de 1 000 €/mois à ${city.name}, comptez entre 240 € et 480 €/an. Ce coût est déductible de vos revenus fonciers.`,
    },
    {
      question: `La GLI couvre-t-elle les impayés dès le premier mois à ${city.name} ?`,
      answer: `Non. Toute GLI applique un délai de carence (en général 1 à 3 mois) pendant lequel les impayés ne sont pas couverts. Ce délai commence à la date d'effet du contrat. Pensez à activer votre GLI dès la signature du bail à ${city.name}.`,
    },
    {
      question: `La GLI fonctionne-t-elle pour une colocation à ${city.name} ?`,
      answer: `Cela dépend du contrat. Certaines GLI couvrent les colocations avec clause de solidarité, d'autres non. Si vous louez en colocation à ${city.name}, vérifiez que le contrat intègre bien ce cas de figure.`,
    },
    {
      question: `Que se passe-t-il si mon locataire à ${city.name} est en difficulté temporaire (perte d'emploi, maladie) ?`,
      answer: `La GLI couvre les impayés pour raisons de bonne foi (perte d'emploi, divorce, maladie) — c'est d'ailleurs l'un de ses intérêts majeurs. Elle ne couvre en revanche pas les impayés si le locataire était déjà en difficulté financière à la signature du bail.`,
    },
    {
      question: `Comment déclarer un impayé à ${city.name} ?`,
      answer: ctx.isZoneTendue
        ? `La déclaration d'impayé doit se faire dans les conditions prévues au contrat — généralement sous 30 à 60 jours après la date d'échéance non payée. À ${city.name} (zone tendue),速度和 délai d'intervention sont cruciaux. Avec RentReady, l'alerte automatique vous permet de déclarer rapidement et de respecter les délais contractuels.`
        : `La déclaration d'impayé doit se faire dans les conditions prévues au contrat — généralement sous 30 à 60 jours. Avec RentReady, l'alerte automatique vous permet de détecter l'impayé rapidement et de constituer votre dossier sans délai.`,
    },
  ];
}

/* ---------- HowTo steps ---------- */

function getHowToSteps(city: City) {
  return [
    {
      name: `Évaluer le risque locatif à ${city.name}`,
      text: `Analysez votre locataire potentiel : vérification des revenus, fiches de paie, avis d'imposition. À ${city.name}, un dossier solide réduit considérablement le risque d'impayé.`,
      url: "/register",
    },
    {
      name: `Souscrire une GLI adaptée à ${city.name}`,
      text: `Comparez les offres de GLI sur le marché. Choisissez entre GLI standard et premium selon la valeur de votre bien et votre tolérance au risque.`,
      url: "/register",
    },
    {
      name: `Activer la détection automatique des paiements`,
      text: `Avec RentReady, connectez votre compte bancaire via Open Banking. Chaque échéance de loyer pour votre bien à ${city.name} est automatiquement vérifiée — alerte instantanée en cas d'impayé.`,
      url: "/register",
    },
    {
      name: `Déclarer le sinistre si nécessaire`,
      text: `En cas d'impayé détecté à ${city.name}, déclarez le sinistre à votre assureur GLI en joignant les pièces justificatives. RentReady vous accompagne dans la constitution du dossier.`,
      url: "/register",
    },
  ];
}

/* ---------- Structured data ---------- */

function buildGliVilleSchema(city: City) {
  const ctx = getCityContext(city);
  const faqs = getFaqs(city);
  const features = getFeatures(city);
  const howToSteps = getHowToSteps(city);

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
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.rentready.fr" },
          { "@type": "ListItem", position: 2, name: "Assurance loyer impayé", item: "https://www.rentready.fr/assurance-loyer-impaye" },
          { "@type": "ListItem", position: 3, name: city.name, item: `https://www.rentready.fr/assurance-loyer-impaye/${city.slug}` },
        ],
      },
      {
        "@type": "HowTo",
        name: `Comment se protéger des loyers impayés à ${city.name}`,
        description: `Guide complet : évaluation du risque, souscription GLI, détection automatique et déclaration de sinistre pour un bien locatif à ${city.name}.`,
        image: "https://www.rentready.fr/og-image.png",
        step: howToSteps.map((step, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: step.name,
          itemListElement: {
            "@type": "ItemList",
            itemListElement: [{ "@type": "HowToDirection", text: step.text }],
          },
          url: `https://www.rentready.fr${step.url}?utm_source=howto&utm_medium=organic&utm_campaign=gli-${city.slug}`,
        })),
        totalTime: "PT30M",
        supply: [
          { "@type": "HowToSupply", name: "Documents du locataire (fiches de paie, avis d'imposition)" },
          { "@type": "HowToSupply", name: `Contrat GLI souscrit` },
          { "@type": "HowToSupply", name: `Compte RentReady (essai gratuit 14 jours)` },
        ],
        tool: [
          { "@type": "HowToTool", name: "RentReady — Détection automatique des paiements" },
          { "@type": "HowToTool", name: `Comparateur GLI` },
        ],
        about: { "@type": "City", name: city.name, containedInPlace: { "@type": "AdministrativeArea", name: city.region } },
      },
      {
        "@type": "FAQPage",
        name: `FAQ — Assurance loyer impayé ${city.name} 2026`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "WebPage",
        name: `Assurance loyer impayé à ${city.name} — GLI 2026`,
        description: `Souscrivez une GLI pour votre bien à ${city.name}. Couverture jusqu'à 90 % des loyers impayés, frais d'expulsion pris en charge. Détection automatique des paiements avec RentReady.${ctx.isZoneTendue ? ` ${city.name} est en zone tendue — la GLI est fortement recommandée.` : ""}`,
        url: `https://www.rentready.fr/assurance-loyer-impaye/${city.slug}`,
        isPartOf: { "@type": "WebSite", name: "RentReady", url: "https://www.rentready.fr" },
        about: { "@type": "City", name: city.name, containedInPlace: { "@type": "AdministrativeArea", name: city.region } },
      },
    ],
  };
}

/* ---------- Page ---------- */

export default async function AssuranceLoyerImpayéVillePage({ params }: Props) {
  const { ville } = await params;
  const city = cities.find((c) => c.slug === ville);
  if (!city) notFound();

  const features = getFeatures(city);
  const faqs = getFaqs(city);
  const coverageTiers = getCoverageTiers(city);
  const local = getLocalParagraphs(city);
  const ctx = getCityContext(city);

  return (
    <>
      <SchemaMarkup data={buildGliVilleSchema(city)} />
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Assurance loyer impayé", href: "/assurance-loyer-impaye" },
          { label: city.name, href: `/assurance-loyer-impaye/${city.slug}`, isCurrentPage: true },
        ]}
      />

      <article>
        {/* ── Hero ── */}
        <section className="bg-gradient-to-b from-[#f8f7f4] to-white px-4 py-20 text-center sm:px-6 sm:py-28">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-sm font-medium tracking-wide text-blue-600 uppercase">
              Assurance loyer impayé · {city.region}
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
              GLI à&nbsp;{city.name}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-stone-600">
              Garantie des Loyers Impayés pour votre bien à {city.name}. Remboursement jusqu'à 90 % des loyers impayés, frais d'expulsion pris en charge.
            </p>
            {ctx.isZoneTendue && (
              <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2 text-sm text-amber-800">
                <span>⚠️</span>
                <span>
                  {city.name} est en zone tendue — sans GLI, vous assumez seul le risque d'impayé
                </span>
              </div>
            )}
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
              >
                Protéger mon bien — gratuit 14j
              </Link>
              <Link
                href="/assurance-loyer-impaye"
                className="text-sm font-medium text-stone-500 transition-colors hover:text-stone-700"
              >
                Voir toutes les villes →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Risk indicator ── */}
        <section className="bg-white border-y border-stone-200 px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Niveau de risque",
                  value: ctx.riskLevel === "high" ? "Élevé" : ctx.riskLevel === "medium" ? "Modéré" : "Faible",
                  color: ctx.riskLevel === "high" ? "text-red-700 bg-red-50 border-red-200" : ctx.riskLevel === "medium" ? "text-amber-700 bg-amber-50 border-amber-200" : "text-green-700 bg-green-50 border-green-200",
                },
                {
                  label: "Délai d'expulsion estimé",
                  value: ctx.riskLevel === "high" ? "12-18 mois" : ctx.riskLevel === "medium" ? "6-12 mois" : "3-6 mois",
                  color: "text-stone-700 bg-stone-50 border-stone-200",
                },
                {
                  label: "Coût GLI indicatif",
                  value: "~2-4 % / an",
                  color: "text-stone-700 bg-stone-50 border-stone-200",
                },
              ].map((stat) => (
                <div key={stat.label} className={`rounded-lg border p-4 text-center ${stat.color}`}>
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="mt-1 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-2 text-center text-2xl font-bold text-stone-900 sm:text-3xl">
              Ce que couvre la GLI pour votre bien à {city.name}
            </h2>
            <p className="mb-12 text-center text-stone-600">
              La Garantie des Loyers Impayés vous protège contre les défaillances de paiement de vos locataires.
            </p>
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

        {/* ── Coverage tiers ── */}
        <section className="bg-[#f8f7f4] px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-2 text-center text-2xl font-bold text-stone-900 sm:text-3xl">
              Quel niveau de couverture pour {city.name} ?
            </h2>
            <p className="mb-12 text-center text-stone-600">
              Comparez les options de GLI selon votre profil et la valeur de votre bien.
            </p>
            <div className="grid gap-6 lg:grid-cols-3">
              {coverageTiers.map((tier) => (
                <div
                  key={tier.name}
                  className="rounded-xl border border-stone-200/80 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-lg font-bold text-stone-900">{tier.name}</h3>
                  <p className="mt-1 text-2xl font-bold text-blue-600">{tier.price}</p>
                  <p className="mt-3 text-sm text-stone-600">{tier.description}</p>
                  <ul className="mt-4 space-y-2">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-stone-600">
                        <span className="mt-0.5 text-green-500">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className="mt-6 inline-block rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                  >
                    {tier.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Local context ── */}
        <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-2xl font-bold text-stone-900 sm:text-3xl">
              L'assurance loyer impayé à {city.name} en 2026
            </h2>
            <div className="space-y-4 text-stone-700 leading-relaxed">
              <p>{local.intro}</p>
              <p>{local.whyGli}</p>
              <p>{local.closing}</p>
            </div>

            {/* Key stats */}
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Population", value: new Intl.NumberFormat("fr-FR").format(city.population) },
                { label: "Département", value: city.department },
                { label: "Région", value: city.region },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-stone-200/80 bg-[#f8f7f4] p-5 text-center shadow-sm"
                >
                  <p className="text-2xl font-bold text-stone-900">{stat.value}</p>
                  <p className="mt-1 text-sm text-stone-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* ── Neighborhoods: Paris ── */}
            {city.slug === "paris" && (
              <div className="mt-10">
                <h3 className="mb-4 text-lg font-semibold text-stone-900">
                  Quartiers parisiens — GLI et risque d'impayé
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Le Marais (4e)", detail: "Loyers élevés, bonne sélection locataire", zone: "Risque modéré" },
                    { name: "11e arrondissement", detail: "Dynamique, forte demande locative", zone: "Risque modéré" },
                    { name: "18e (Montmartre)", detail: "Étudiants — risque impayé supérieur", zone: "Risque élevé" },
                    { name: "12e (Bercy)", detail: "Familial, bonne solvabilité", zone: "Risque faible" },
                    { name: "10e (Canal)", detail: "Jeune actif — turnover élevé", zone: "Risque modéré" },
                    { name: "15e (Vaugirard)", detail: "Résidentiel, stable", zone: "Risque faible" },
                  ].map((q) => (
                    <div key={q.name} className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-stone-900">{q.name}</p>
                          <p className="mt-1 text-sm text-stone-600">{q.detail}</p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                          q.zone === "Risque élevé"
                            ? "bg-red-100 text-red-800"
                            : q.zone === "Risque faible"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                        }`}>
                          {q.zone}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Neighborhoods: Lyon ── */}
            {city.slug === "lyon" && (
              <div className="mt-10">
                <h3 className="mb-4 text-lg font-semibold text-stone-900">
                  Quartiers lyonnais — niveau de risque d'impayé
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Presqu'île", detail: "Centre, bonne solvabilité" },
                    { name: "Croix-Rousse", detail: "Authentique, stable" },
                    { name: "Part-Dieu", detail: "Affaires, turnover" },
                    { name: "Vaise", detail: "En développement" },
                    { name: "Brotteaux", detail: "Prisé, premium" },
                    { name: "Gerland", detail: "En croissance" },
                  ].map((q) => (
                    <div key={q.name} className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
                      <p className="font-semibold text-stone-900">{q.name}</p>
                      <p className="mt-1 text-sm text-stone-600">{q.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Neighborhoods: Marseille ── */}
            {city.slug === "marseille" && (
              <div className="mt-10">
                <h3 className="mb-4 text-lg font-semibold text-stone-900">
                  Quartiers marseillais — GLI et protection du bailleur
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Le Prado", detail: "Familial, stable" },
                    { name: "Noailles / Centre", detail: "Central, diversifié" },
                    { name: "Vieux-Port", detail: "Premium, saisonnier" },
                    { name: "Saint-Giniez", detail: "Bourgeois, stable" },
                    { name: "La Plaine / Cours Julien", detail: "Jeune, turnover" },
                    { name: "Castellane", detail: "Commerçant, accessible" },
                  ].map((q) => (
                    <div key={q.name} className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
                      <p className="font-semibold text-stone-900">{q.name}</p>
                      <p className="mt-1 text-sm text-stone-600">{q.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related resources */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/assurance-loyer-impaye" className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900">
                🛡️ Comparatif GLI
              </Link>
              <Link href="/gestion-locative" className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900">
                🏠 Gestion locative
              </Link>
              <Link href="/bail" className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900">
                📝 Modèles de bail
              </Link>
              <Link href="/quittances" className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900">
                📄 Quittances de loyer
              </Link>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-[#f8f7f4] px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-2xl font-bold text-stone-900 sm:text-3xl">
              Questions fréquentes — GLI à {city.name}
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
        <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Protégez vos revenus locatifs à {city.name}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-stone-300">
              Ne laissez pas un impayé mettre en péril votre investissement. Combinez GLI et gestion intelligente avec RentReady.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
            >
              Essai gratuit 14 jours
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
