import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import cities from "@/data/cities.json";
import { SchemaMarkup, paidOffer } from "@/components/seo/schema-markup";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { baseMetadata } from "@/lib/seo/metadata";
import { formatEntryPrice, formatProPrice, formatProAnnualPrice, SITE_NAME, SITE_URL } from "@/data/entity";

// Rendered on demand. SEO/marketing content, not product surface: prerendering the
// ~135-page content suite exhausted the Node heap during `next build`
// ("Ineffective mark-compacts near heap limit"). All data is local, so rendering
// per request costs ~ms and every URL keeps working.
export const revalidate = 3600;

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

/* ---------- Prefecture URLs for zone tendue reference ---------- */

const PREFECTURE_URLS: Record<string, string> = {
  paris:       "https://www.prefecture-de-region.gouv.fr/ile-de-france",
  lyon:        "https://www.rhone.gouv.fr",
  lille:       "https://www.nord.gouv.fr",
  bordeaux:    "https://www.gironde.gouv.fr",
  montpellier: "https://www.herault.gouv.fr",
  marseille:   "https://www.bouches-du-rhone.gouv.fr",
  nice:        "https://www.alpes-maritimes.gouv.fr",
  toulouse:    "https://www.haute-garonne.gouv.fr",
  nantes:      "https://www.loire-atlantique.gouv.fr",
  strasbourg:  "https://www.bas-rhin.gouv.fr",
  rennes:      "https://www.ille-et-vilaine.gouv.fr",
  grenoble:    "https://www.isere.gouv.fr",
};

// Rendered on demand. SEO/marketing content, not product surface: prerendering the
// ~135-page content suite exhausted the Node heap during `next build`
// ("Ineffective mark-compacts near heap limit"). All data is local, so rendering
// per request costs ~ms and every URL keeps working.

/* ---------- Metadata ---------- */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ville } = await params;
  const city = cities.find((c) => c.slug === ville);
  if (!city) return {};

  const title = `Gestion locative à ${city.name} (${city.department})`;
  const description = `Gérez vos locations à ${city.name} sans effort : quittances légales, suivi des loyers, révision IRL. Essai gratuit 14 jours, sans carte bancaire.`;

  return baseMetadata({
    title,
    description,
    url: `/gestion-locative/${city.slug}`,
    ogType: "location",
  });
}

/* ---------- Helpers ---------- */

function formatPopulation(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n);
}

function getCityContext(city: City) {
  const pop = city.population;
  const isZoneTendue = ZONES_TENDUES.has(city.slug);

  let bracketLabel: string;
  if (pop > 500000) {
    bracketLabel = "métropole";
  } else if (pop > 200000) {
    bracketLabel = "grande ville";
  } else if (pop > 100000) {
    bracketLabel = "ville moyenne";
  } else {
    bracketLabel = "ville";
  }

  return { isZoneTendue, bracketLabel };
}

/* ---------- Features ---------- */

function getFeatures(city: City) {
  const ctx = getCityContext(city);
  return [
    {
      icon: "📄",
      title: "Quittances automatiques",
      description: `La quittance est générée lorsque vous enregistrez le paiement qui solde le mois de votre locataire à ${city.name}. Conforme à l'article 21 de la loi du 6 juillet 1989, avec distinction obligatoire entre loyer et provisions pour charges ; un paiement partiel donne un reçu.`,
    },
    {
      icon: "💶",
      title: "Suivi des paiements",
      description: `Vous enregistrez les paiements reçus de vos locataires dans le ${city.department} ; Lokna les impute sur les loyers attendus, calcule le reste dû et distingue les mois payés, partiels et impayés.`,
    },
    {
      icon: "📈",
      title: "Révision IRL",
      description: `Pour vos biens à ${city.name}, Lokna calcule la révision annuelle avec l'indice de référence des loyers publié par l'INSEE, selon la formule légale. Le nouveau loyer s'applique après votre validation.`,
    },
    {
      icon: "📊",
      title: "Retards visibles",
      description: `Un loyer en retard à ${city.name} reste affiché avec son reste dû et sa date d'échéance : vous relancez votre locataire avec les bons montants.`,
    },
    {
      icon: "🏠",
      title: "Quittances en PDF",
      description: `Les quittances et reçus de vos locataires à ${city.name} se téléchargent en PDF, à la demande. Lokna ne les envoie pas : vous les transmettez vous-même.`,
    },
    {
      icon: ctx.isZoneTendue ? "⚖️" : "📑",
      title: ctx.isZoneTendue ? "Encadrement des loyers" : "Analyse fiscale",
      description: ctx.isZoneTendue
        ? `${city.name} est en zone tendue : à la mise en location ou au renouvellement, l'évolution du loyer est encadrée. Vérifiez les règles applicables à votre commune avant de fixer le loyer du bail.`
        : `Visualisez vos revenus fonciers, charges déductibles et simulez le régime fiscal le plus avantageux pour vos biens à ${city.name} — micro-foncier, réel, LMNP classique ou dispositif Jeanbrun 2026.`,
    },
  ];
}

/* ---------- FAQs ---------- */

function getFaqs(city: City) {
  const ctx = getCityContext(city);
  return [
    {
      question: `Pourquoi utiliser un logiciel de gestion locative à ${city.name} ?`,
      answer: `Gérer des biens locatifs à ${city.name} implique de respecter la législation française (quittances conformes à la loi de 1989, diagnostics obligatoires${ctx.isZoneTendue ? ", respect de l'encadrement des loyers en zone tendue" : ""}). Lokna automatise ces tâches pour vous faire gagner du temps et rester en conformité, quelle que soit la taille de votre patrimoine.` },
    {
      question: `Quel est le loyer moyen à ${city.name} en 2026 ?`,
      answer: `Lokna ne publie pas de loyer moyen par ville. Pour connaître les loyers pratiqués à ${city.name}, consultez l'observatoire local des loyers s'il en existe un, ou la carte des loyers publiée par le ministère chargé du Logement. Le loyer réel dépend de l'état, de l'emplacement et des équipements du bien.`,
    },
    {
      question: `La gestion locative à ${city.name} est-elle obligatoire ?`,
      answer: `Aucun texte n'oblige les propriétaires à utiliser un logiciel de gestion locative. En revanche, la loi leur impose des obligations précises : remettre gratuitement une quittance au locataire qui la demande, en distinguant le loyer et les charges ; régulariser chaque année les provisions pour charges ; déclarer les revenus fonciers. Un logiciel comme Lokna vous aide à respecter ces échéances sans y consacrer du temps chaque mois.`,
    },
    {
      question: `Lokna est-il adapté au marché locatif de ${city.name} ?`,
      answer: `Oui. Avec environ ${formatPopulation(city.population)} habitants, ${city.name} (${city.region}) présente un marché locatif ${ctx.bracketLabel === "métropole" ? "très dynamique avec une forte demande" : ctx.bracketLabel === "grande ville" ? "actif et concurrentiel" : "stable avec une demande régulière"}. Lokna s'adapte à tous les types de biens — du studio meublé à l'immeuble en SCI familiale — avec des outils pensés pour le contexte réglementaire français.`,
    },
    {
      question: `Combien coûte la gestion locative à ${city.name} avec Lokna ?`,
      answer: `Lokna coûte ${formatEntryPrice()} par mois pour 3 biens, ou ${formatProPrice()} pour 10 biens (${formatProAnnualPrice()} par an, soit 2 mois offerts). Une agence facture en général un pourcentage des loyers encaissés : à 7 %, un loyer de 800 € par mois coûte 672 € par an en frais de gestion. Essai gratuit de 14 jours sans carte bancaire.`,
    },
    {
      question: `Comment démarrer la gestion locative de mes biens à ${city.name} ?`,
      answer: `Créez votre compte gratuitement en 2 minutes, ajoutez vos biens situés à ${city.name} et vos locataires, puis enregistrez les paiements reçus : Lokna calcule le reste dû, génère les quittances et les reçus, montre les retards et calcule la révision IRL. Aucune installation n'est nécessaire, tout fonctionne depuis votre navigateur ou votre smartphone.`,
    },
    ...(ctx.isZoneTendue ? [{
      question: `L'encadrement des loyers s'applique-t-il à ${city.name} ?`,
      answer: `Oui. ${city.name} est en zone tendue : à la relocation, le loyer du nouveau bail ne peut en principe pas dépasser celui du précédent locataire, sauf exceptions prévues par décret (travaux importants, loyer manifestement sous-évalué). Certaines communes appliquent en plus un plafonnement par des loyers de référence fixés par arrêté préfectoral. Pour savoir si c'est le cas à ${city.name}, consultez la préfecture du ${city.department} ou l'ADIL.`,
    }] : []),
  ];
}

/* ---------- Local paragraphs ---------- */

function getLocalParagraphs(city: City) {
  const ctx = getCityContext(city);
  const pop = city.population;

  const intro =
    pop > 500000
      ? `${city.name} est l'une des principales métropoles françaises, avec ${formatPopulation(pop)} habitants et un marché locatif parmi les plus dynamiques de la région ${city.region}. La demande locative y est soutenue par un bassin d'emploi diversifié, une population étudiante importante et un réseau de transports en commun dense.`
        : pop > 100000
          ? `${city.name} (${formatPopulation(pop)} habitants, département ${city.department}) est une ville moyenne dynamique de la région ${city.region}. Le marché locatif y offre un équilibre intéressant entre rendement et stabilité, avec une demande régulière portée par les actifs et les familles.`
          : `Située dans le département ${city.department} (${city.region}), ${city.name} compte ${formatPopulation(pop)} habitants. Le marché locatif local se caractérise par des loyers modérés et un taux de vacance faible, ce qui en fait un territoire de choix pour les investisseurs locatifs à la recherche de rendements réguliers.`;

  const regulation = ctx.isZoneTendue
    ? `En tant que zone tendue, ${city.name} est soumise à l'encadrement de l'évolution des loyers à la relocation. Certaines communes appliquent en plus des loyers de référence fixés par arrêté préfectoral ; la préfecture du ${city.department} et l'ADIL indiquent les règles en vigueur pour ${city.name}. Lokna, de son côté, tient le registre des loyers attendus, des paiements reçus et des documents qui en découlent.`
    : `Que vous soyez propriétaire d'un appartement en centre-ville ou d'une maison en périphérie de ${city.name}, une gestion locative rigoureuse est essentielle pour sécuriser vos revenus et respecter vos obligations légales : quittances, régularisation des charges, révision du loyer. Lokna tient le registre des loyers attendus, des paiements reçus et des documents qui en découlent.`;

  const closing =
    pop > 200000
      ? `Pour un propriétaire bailleur à ${city.name}, automatiser la gestion locative représente un gain de temps considérable : reste dû calculé à chaque paiement enregistré, quittances conformes générées dès que le mois est soldé, et révision de loyer calculée avec l'indice INSEE. Le marché de ${city.name} attire chaque année de nouveaux investisseurs — anticiper les obligations légales avec un outil dédié vous permet de rester concentré sur la sélection de vos locataires.`
      : `Pour les propriétaires bailleurs à ${city.name} et dans le département ${city.department}, Lokna élimine les tâches répétitives : quittances conformes à la loi de 1989 générées au paiement, calcul du reste dû, et calcul de la révision IRL avec l'indice INSEE. Vous gardez le contrôle total de vos biens sans y consacrer des heures chaque mois.`;

  return { intro, regulation, closing };
}

/* ---------- How-to steps ---------- */

function getHowToSteps(city: City) {
  return [
    {
      name: `Créer votre compte Lokna pour la gestion locative à ${city.name}`,
      text: `Inscrivez-vous gratuitement en 2 minutes. Aucune carte bancaire requise pour l'essai de 14 jours. Sélectionnez votre profil : propriétaire bailleur, SCI, ou gestionnaire de patrimoine.`,
      url: "/register",
    },
    {
      name: `Ajouter vos biens immobiliers situés à ${city.name}`,
      text: `Renseignez l'adresse, le type de bien (appartement, maison), le nombre de pièces, la surface, et le montant du loyer actuel. Précisez si le bien est vide ou meublé.`,
      url: "/register",
    },
    {
      name: `Enregistrer vos locataires et générer les quittances`,
      text: `Ajoutez les informations de vos locataires et utilisez la fonctionnalité de génération de quittances pour produire des documents conformes à la loi de 1989, téléchargeables en PDF à la demande.`,
      url: "/register",
    },
    {
      name: `Suivre les paiements chaque mois`,
      text: `Enregistrez les paiements reçus depuis le suivi du mois. Lokna met à jour le statut de chaque loyer — payé, partiel ou impayé — et le reste dû.`,
      url: "/register",
    },
  ];
}

/* ---------- Structured data ---------- */

function buildGestionLocativeVilleSchema(city: City) {
  const ctx = getCityContext(city);
  const faqs = getFaqs(city);
  const howToSteps = getHowToSteps(city);

  return {
    "@context": "https://schema.org",
    "@graph": [
      /* BreadcrumbList */
      {
        "@type": "BreadcrumbList",
        name: "Fil d'Ariane",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Gestion locative", item: `${SITE_URL}/gestion-locative` },
          { "@type": "ListItem", position: 3, name: city.name, item: `${SITE_URL}/gestion-locative/${city.slug}` },
        ],
      },
      /* HowTo — main action the page describes */
      {
        "@type": "HowTo",
        name: `Comment gérer ses locations à ${city.name} avec Lokna`,
        description: `Guide complet pour gérer vos locations à ${city.name} : quittances, suivi des paiements, révision IRL, encadrement des loyers${ctx.isZoneTendue ? " et conformité en zone tendue" : ""}.`,
        image: `${SITE_URL}/opengraph-image`,
        step: howToSteps.map((step, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: step.name,
          itemListElement: {
            "@type": "ItemList",
            itemListElement: [{ "@type": "HowToDirection", text: step.text }],
          },
          url: `${SITE_URL}/register?utm_source=howto&utm_medium=organic&utm_campaign=gestion-locative-${city.slug}`,
        })),
        totalTime: "PT10M",
        supply: [
          { "@type": "HowToSupply", name: "Compte Lokna (gratuit 14 jours)" },
          { "@type": "HowToSupply", name: `Biens immobiliers à ${city.name}` },
          { "@type": "HowToSupply", name: "Informations des locataires" },
        ],
        tool: [
          { "@type": "HowToTool", name: "Lokna — Logiciel de gestion locative" },
        ],
        about: {
          "@type": "City",
          name: city.name,
          containedInPlace: { "@type": "AdministrativeArea", name: city.region },
        },
      },
      /* SoftwareApplication */
      {
        "@type": "SoftwareApplication",
        name: "Lokna",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: `${SITE_URL}/gestion-locative/${city.slug}`,
        description: `Logiciel de gestion locative pour propriétaires bailleurs à ${city.name} (${city.department}). Quittances conformes, suivi des loyers, révision IRL${ctx.isZoneTendue ? ", encadrement des loyers" : ""}.`,
        offers: {
          ...paidOffer(),
        },
        areaServed: {
          "@type": "City",
          name: city.name,
          containedInPlace: [
            { "@type": "AdministrativeArea", name: `Département ${city.department}` },
            { "@type": "AdministrativeArea", name: city.region },
            { "@type": "Country", name: "France" },
          ],
        },
        featureList: getFeatures(city).map((f) => f.title),
      },
      /* LocalBusiness — enriched */
      {
        "@type": "LocalBusiness",
        name: `Lokna — Gestion locative ${city.name}`,
        description: `Service de gestion locative en ligne pour propriétaires bailleurs à ${city.name} (département ${city.department}, ${city.region}). Automatisation des quittances, suivi des paiements, révision IRL${ctx.isZoneTendue ? ", encadrement des loyers" : ""}.`,
        url: `${SITE_URL}/gestion-locative/${city.slug}`,
        image: `${SITE_URL}/opengraph-image`,
        areaServed: {
          "@type": "City",
          name: city.name,
          containedInPlace: [
            { "@type": "AdministrativeArea", name: `Département ${city.department}` },
            { "@type": "AdministrativeArea", name: city.region },
            { "@type": "Country", name: "France" },
          ],
        },
        serviceType: "Gestion locative",
        knowsAbout: [
          `gestion locative ${city.name}`,
          `loyer ${city.name}`,
          `dépôt de garantie ${city.name}`,
          `encadrement des loyers ${city.name}`,
          `quittance de loyer ${city.name}`,
          `révision IRL ${city.name}`,
          ...(ctx.isZoneTendue ? [`zone tendue ${city.name}`, `plafond loyer ${city.name}`, `arrêté préfectoral ${city.name}`] : []),
        ],
        ...(PREFECTURE_URLS[city.slug] ? {
          publishingPrinciples: PREFECTURE_URLS[city.slug],
        } : {}),
      },
      /* WebPage */
      {
        "@type": "WebPage",
        name: `Gestion locative à ${city.name} — Logiciel en ligne 2026`,
        description: `Découvrez comment Lokna simplifie la gestion locative à ${city.name}. Quittances légales, suivi des loyers, révision IRL${ctx.isZoneTendue ? ", encadrement des loyers" : ""}. Essai gratuit 14 jours.`,
        url: `${SITE_URL}/gestion-locative/${city.slug}`,
        isPartOf: { "@type": "WebSite", name: "Lokna", url: SITE_URL },
        about: { "@type": "City", name: city.name, containedInPlace: { "@type": "AdministrativeArea", name: city.region } },
      },
      /* FAQPage */
      {
        "@type": "FAQPage",
        name: `FAQ — Gestion locative ${city.name} 2026`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      /* Organization */
      {
        "@type": "Organization",
        name: "Lokna",
        url: SITE_URL,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "contact@lokna.fr",
          availableLanguage: "French",
        },
      },
      /* WebSite */
      {
        "@type": "WebSite",
        name: "Lokna",
        url: SITE_URL,
      },
    ],
  };
}

/* ---------- Page ---------- */

export default async function GestionLocativeVille({ params }: Props) {
  const { ville } = await params;
  const city = cities.find((c) => c.slug === ville);
  if (!city) notFound();

  const features = getFeatures(city);
  const faqs = getFaqs(city);
  const local = getLocalParagraphs(city);
  const ctx = getCityContext(city);

  return (
    <>
      <SchemaMarkup data={buildGestionLocativeVilleSchema(city)} breadcrumbRenderedByComponent />
      <Breadcrumb
        className="mx-auto max-w-6xl flex-wrap px-4 pt-5 sm:px-6"
        items={[
          { label: "Accueil", href: "/" },
          { label: "Gestion locative", href: "/gestion-locative" },
          { label: city.name, href: `/gestion-locative/${city.slug}`, isCurrentPage: true },
        ]}
      />

      <article>
        {/* ── Hero ── */}
        <section className="bg-gradient-to-b from-[#f8f7f4] to-white px-4 py-20 text-center sm:px-6 sm:py-28">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-sm font-medium tracking-wide text-forest uppercase">
              Gestion locative · {city.region}
            </p>
            <h1 className="text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl">
              Gestion locative à&nbsp;{city.name}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-stone-600">
              Le logiciel de gestion locative qui automatise les quittances, le
              suivi des loyers et la conformité légale pour les propriétaires
              bailleurs à {city.name} ({city.department}). Essai gratuit.
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
                href="/register"
                className="rounded-lg bg-forest px-6 py-3 font-medium text-white shadow transition-colors hover:bg-forest-hover"
              >
                Essai gratuit 14&nbsp;jours
              </Link>
              <Link
                href="/gestion-locative"
                className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-700"
              >
                Voir toutes les villes&nbsp;→
              </Link>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-2xl font-semibold text-ink sm:text-3xl">
              Tout ce qu&apos;il vous faut pour gérer vos locations à&nbsp;{city.name}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border border-stone-200/80 bg-cream p-6 shadow-sm"
                >
                  <span className="text-2xl" role="img" aria-hidden="true">
                    {f.icon}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-ink">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Local context ── */}
        <section className="bg-cream px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-2xl font-semibold text-ink sm:text-3xl">
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
                  <p className="text-2xl font-bold text-ink">{stat.value}</p>
                  <p className="mt-1 text-sm text-stone-600">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* ── Neighborhoods: Paris ── */}
            {city.slug === "paris" && (
              <div className="mt-10">
                <h3 className="mb-4 text-lg font-semibold text-ink">
                  Quartiers populaires pour la location à Paris
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Le Marais (4e)", detail: "Typique, Loft, 20-30 €/m²", zone: "Zone modérée" },
                    { name: "11e arrondissement", detail: "Dynamique, T2/T3, 22-28 €/m²", zone: "Zone modérée" },
                    { name: "18e (Montmartre)", detail: "Charme, Petits studios, 18-24 €/m²", zone: "Zone tendue" },
                    { name: "12e (Bercy)", detail: "Familial, Grand, 20-26 €/m²", zone: "Zone modérée" },
                    { name: "10e (Canal)", detail: "Jeune, Mixte, 22-30 €/m²", zone: "Zone tendue" },
                    { name: "15e (Vaugirard)", detail: "Résidentiel, Grand, 18-24 €/m²", zone: "Zone modérée" },
                  ].map((q) => (
                    <div key={q.name} className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-ink">{q.name}</p>
                          <p className="mt-1 text-sm text-stone-600">{q.detail}</p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                          q.zone === "Zone tendue"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-green-100 text-green-800"
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
                <h3 className="mb-4 text-lg font-semibold text-ink">
                  Quartiers populaires pour la location à Lyon
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Presqu'île", detail: "Centre, T2/T3, 15-20 €/m²" },
                    { name: "Croix-Rousse", detail: "Authentique, T1/T2, 13-18 €/m²" },
                    { name: "Part-Dieu", detail: "Affaires, Studio/T1, 14-18 €/m²" },
                    { name: "Vaise", detail: "En hausse, T2/T3, 12-16 €/m²" },
                    { name: "Brotteaux", detail: "Bourgeois, Grand, 15-19 €/m²" },
                    { name: "Gerland", detail: "Dynamique, Mixte, 13-17 €/m²" },
                  ].map((q) => (
                    <div key={q.name} className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
                      <p className="font-semibold text-ink">{q.name}</p>
                      <p className="mt-1 text-sm text-stone-600">{q.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Neighborhoods: Marseille ── */}
            {city.slug === "marseille" && (
              <div className="mt-10">
                <h3 className="mb-4 text-lg font-semibold text-ink">
                  Quartiers populaires pour la location à Marseille
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Le Prado", detail: "Familial, T3/T4, 12-16 €/m²" },
                    { name: "Noailles / Centre", detail: "Central, Studio/T1, 10-15 €/m²" },
                    { name: "Vieux-Port", detail: "Touristique, T2/T3, 16-22 €/m²" },
                    { name: "Saint-Giniez", detail: "Bourgeois, Grand, 13-17 €/m²" },
                    { name: "La Plaine / Cours Julien", detail: "Jeune, T1/T2, 11-15 €/m²" },
                    { name: "Castellane", detail: "Commerçant, T2, 12-16 €/m²" },
                  ].map((q) => (
                    <div key={q.name} className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
                      <p className="font-semibold text-ink">{q.name}</p>
                      <p className="mt-1 text-sm text-stone-600">{q.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related resources */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/quittances" className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900">
                📄 Quittances de loyer
              </Link>
              <Link href="/outils/calculateur-surface-habitable" className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900">
                🧮 Calculateur surface habitable
              </Link>
              {ctx.isZoneTendue && (
                <Link href="/blog/encadrement-des-loyers" className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100">
                  ⚖️ Encadrement des loyers
                </Link>
              )}
              <Link href="/blog/regime-micro-foncier" className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900">
                📊 Simulateur fiscal LMNP
              </Link>
              <Link href="/bail" className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900">
                📝 Modèles de bail
              </Link>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-2xl font-semibold text-ink sm:text-3xl">
              Questions fréquentes — Gestion locative à&nbsp;{city.name}
            </h2>
            <div className="divide-y divide-stone-200">
              {faqs.map((faq) => (
                <details key={faq.question} className="group py-5">
                  <summary className="flex cursor-pointer items-center justify-between font-medium text-ink">
                    {faq.question}
                    <span className="ml-4 shrink-0 text-stone-600 transition-transform group-open:rotate-45">
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
        <section className="bg-cream px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl rounded-2xl bg-forest px-6 py-14 text-center text-white shadow-lg">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Commencez votre essai gratuit à&nbsp;{city.name}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-cream/80">
              Simplifiez la gestion de vos locations à{" "}
              {city.name} avec Lokna. Sans carte bancaire, sans engagement.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-block rounded-lg bg-forest px-6 py-3 font-medium text-white shadow transition-colors hover:bg-forest-hover"
            >
              Créer mon compte gratuitement
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
