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

/* ---------- Average rent data by city (€/m², 2025 source: CLAMEU/SeLoger) ---------- */

const AVG_RENT_DATA: Record<string, { studio: number; t2: number; t3: number; source: string }> = {
  paris:       { studio: 28, t2: 25, t3: 22, source: "SeLoger / CLAMEU 2025" },
  marseille:   { studio: 16, t2: 14, t3: 12, source: "SeLoger / CLAMEU 2025" },
  lyon:        { studio: 17, t2: 15, t3: 13, source: "SeLoger / CLAMEU 2025" },
  toulouse:    { studio: 14, t2: 12, t3: 11, source: "SeLoger / CLAMEU 2025" },
  nice:        { studio: 15, t2: 13, t3: 12, source: "SeLoger / CLAMEU 2025" },
  nantes:      { studio: 13, t2: 12, t3: 10, source: "SeLoger / CLAMEU 2025" },
  montpellier: { studio: 14, t2: 12, t3: 10, source: "SeLoger / CLAMEU 2025" },
  strasbourg:  { studio: 13, t2: 12, t3: 10, source: "SeLoger / CLAMEU 2025" },
  bordeaux:    { studio: 15, t2: 13, t3: 11, source: "SeLoger / CLAMEU 2025" },
  lille:       { studio: 14, t2: 12, t3: 11, source: "SeLoger / CLAMEU 2025" },
  rennes:      { studio: 13, t2: 11, t3: 10, source: "SeLoger / CLAMEU 2025" },
  grenoble:    { studio: 13, t2: 11, t3: 10, source: "SeLoger / CLAMEU 2025" },
};

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

/* ---------- Metadata ---------- */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ville } = await params;
  const city = cities.find((c) => c.slug === ville);
  if (!city) return {};

  const title = `Gestion locative à ${city.name} (${city.department})`;
  const description = `Gérez vos locations à ${city.name} sans effort : quittances légales, détection des loyers, révision IRL. Essai gratuit 14 jours, sans carte bancaire.`;

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

/* ---------- Features ---------- */

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
      title: "Détection des paiements",
      description: `Connectez votre compte bancaire en lecture seule via Open Banking (DSP2). RentReady détecte automatiquement les virements de vos locataires dans le ${city.department} et marque les loyers comme encaissés.`,
    },
    {
      icon: "📈",
      title: "Révision IRL automatique",
      description: `Le calcul de l'Indice de Référence des Loyers est connecté à l'INSEE. Pour vos biens à ${city.name}, RentReady applique la formule légale et notifie vos locataires de la révision annuelle.`,
    },
    {
      icon: "📊",
      title: "Conformité Factur-X",
      description: `Préparez dès maintenant le e-reporting B2C obligatoire en septembre 2027. RentReady génère vos documents au format Factur-X (norme EN 16931), compatible avec la plateforme publique de facturation.`,
    },
    {
      icon: "🏠",
      title: "Portail locataire",
      description: `Offrez à vos locataires à ${city.name} un espace personnel pour consulter leurs quittances, signaler un problème technique avec photo ou vidéo, et suivre l'avancement des interventions.`,
    },
    {
      icon: ctx.isZoneTendue ? "⚖️" : "📑",
      title: ctx.isZoneTendue ? "Encadrement des loyers" : "Analyse fiscale",
      description: ctx.isZoneTendue
        ? `${city.name} fait partie des zones tendues soumises à l'encadrement des loyers. RentReady vérifie que vos montants respectent les plafonds et vous alerte en cas de dépassement du loyer de référence majoré.`
        : `Visualisez vos revenus fonciers, charges déductibles et simulez le régime fiscal le plus avantageux pour vos biens à ${city.name} — micro-foncier, réel, LMNP classique ou dispositif Jeanbrun 2026.`,
    },
  ];
}

/* ---------- FAQs ---------- */

function getFaqs(city: City) {
  const ctx = getCityContext(city);
  const rentData = AVG_RENT_DATA[city.slug];
  return [
    {
      question: `Pourquoi utiliser un logiciel de gestion locative à ${city.name} ?`,
      answer: `Gérer des biens locatifs à ${city.name} implique de respecter la législation française (quittances conformes à la loi de 1989, diagnostics obligatoires${ctx.isZoneTendue ? ", respect de l'encadrement des loyers en zone tendue" : ""}). RentReady automatise ces tâches pour vous faire gagner du temps et rester en conformité, quelle que soit la taille de votre patrimoine.` },
    {
      question: `Quel est le loyer moyen à ${city.name} en 2026 ?`,
      answer: rentData
        ? `Le loyer moyen à ${city.name} se situe autour de ${rentData.studio} à ${rentData.t3} €/m² selon le type de bien (studio à T3). Ces chiffres sont donné à titre indicatif — le loyer réel dépend de l'état, de l'emplacement et des équipements. Source : ${rentData.source}.`
        : `Le marché locatif de ${city.name} offre des opportunités intéressant pour les propriétaires. Utilisez notre calculateur pour estimer le rendement de votre bien et comparer avec les standards du marché local.`,
    },
    {
      question: `La gestion locative à ${city.name} est-elle obligatoire ?`,
      answer: `Aucun texte n'oblige les propriétaires à utiliser un logiciel de gestion locative. En revanche, la loi leur impose des obligations précises : remise d'une quittance dans les 24h suivant le paiement, notification de révision de loyer un mois avant la date d'anniversaire, transmission annuelle de la déclaration de revenus fonciers. Un logiciel comme RentReady vous aide à respecter ces échéances sans y consacrer du temps chaque mois.`,
    },
    {
      question: `RentReady est-il adapté au marché locatif de ${city.name} ?`,
      answer: `Oui. Avec environ ${formatPopulation(city.population)} habitants, ${city.name} (${city.region}) présente un marché locatif ${ctx.bracketLabel === "métropole" ? "très dynamique avec une forte demande" : ctx.bracketLabel === "grande ville" ? "actif et concurrentiel" : "stable avec une demande régulière"}. RentReady s'adapte à tous les types de biens — du studio meublé à l'immeuble en SCI familiale — avec des outils pensés pour le contexte réglementaire français.`,
    },
    {
      question: `Combien coûte la gestion locative à ${city.name} avec RentReady ?`,
      answer: `RentReady coûte 15 € par mois (ou 150 € par an, soit 2 mois offerts) quel que soit le nombre de biens (jusqu'à 10). C'est 4 à 5 fois moins cher qu'une agence immobilière à ${city.name} qui facture en moyenne 7 % du loyer annuel, soit environ ${ctx.avgRent * 70} € par an pour un loyer de ${ctx.avgRent * 1000 / 10} € mensuels. Essai gratuit de 14 jours sans carte bancaire.`,
    },
    {
      question: `Comment démarrer la gestion locative de mes biens à ${city.name} ?`,
      answer: `Créez votre compte gratuitement en 2 minutes, ajoutez vos biens situés à ${city.name} et vos locataires, et RentReady s'occupe du reste : quittances automatiques, suivi des paiements, relances, révision IRL et préparation des documents fiscaux. Aucune installation n'est nécessaire, tout fonctionne depuis votre navigateur ou votre smartphone.`,
    },
    ...(ctx.isZoneTendue ? [{
      question: `L'encadrement des loyers s'applique-t-il à ${city.name} ?`,
      answer: `Oui. ${city.name} est une commune en zone tendue soumise à l'encadrement des loyers. Lors de la mise en location ou au renouvellement du bail, le loyer ne peut pas dépasser le loyer de référence majoré fixé par arrêté préfectoral. Vous pouvez demander un complément de loyer pour atypie (vue exceptionnelle, surface significative, etc.) dans la limite de 20 % au-dessus du loyer de référence majoré. Consultez les arrêtés préfectoraux sur le site de la préfecture du ${city.department}.`,
    }] : []),
  ];
}

/* ---------- Local paragraphs ---------- */

function getLocalParagraphs(city: City) {
  const ctx = getCityContext(city);
  const pop = city.population;
  const rentData = AVG_RENT_DATA[city.slug];

  const intro =
    pop > 500000
      ? `${city.name} est l'une des principales métropoles françaises, avec ${formatPopulation(pop)} habitants et un marché locatif parmi les plus dynamiques de la région ${city.region}. La demande locative y est soutenue par un bassin d'emploi diversifié, une population étudiante importante et un réseau de transports en commun dense. Le loyer moyen au m² à ${city.name} se situe autour de ${rentData ? `${rentData.studio}-${rentData.t2}` : "12-16"} €/m² selon le type de bien.`
      : pop > 200000
        ? `Avec ${formatPopulation(pop)} habitants, ${city.name} s'affirme comme une grande ville attractive de la région ${city.region} (département ${city.department}). Son marché locatif est porté par une croissance démographique régulière et des projets d'urbanisme qui renforcent l'attractivité des quartiers résidentiels. Le loyer moyen à ${city.name} se situe aux alentours de ${rentData ? `${rentData.studio}-${rentData.t2}` : "10-13"} €/m².`
        : pop > 100000
          ? `${city.name} (${formatPopulation(pop)} habitants, département ${city.department}) est une ville moyenne dynamique de la région ${city.region}. Le marché locatif y offre un équilibre intéressant entre rendement et stabilité, avec une demande régulière portée par les actifs et les familles. Le loyer moyen au m² à ${city.name} tourne autour de ${rentData ? `${rentData.studio}-${rentData.t2}` : "8-11"} €/m².`
          : `Située dans le département ${city.department} (${city.region}), ${city.name} compte ${formatPopulation(pop)} habitants. Le marché locatif local se caractérise par des loyers modérés et un taux de vacance faible, ce qui en fait un territoire de choix pour les investisseurs locatifs à la recherche de rendements réguliers.`;

  const regulation = ctx.isZoneTendue
    ? `En tant que zone tendue, ${city.name} est soumise à l'encadrement des loyers. Les propriétaires bailleurs doivent respecter le loyer de référence fixé par arrêté préfectoral, sous peine de sanctions. Les arrêtés relatifs aux loyers de référence pour ${city.name} sont disponibles sur le site de la préfecture du ${city.department}. La législation évolue rapidement — obligation de facturation électronique Factur-X dès 2026, e-reporting B2C en 2027 — et RentReady intègre ces évolutions pour que vous n'ayez pas à vous en soucier.`
    : `Que vous soyez propriétaire d'un appartement en centre-ville ou d'une maison en périphérie de ${city.name}, une gestion locative rigoureuse est essentielle pour sécuriser vos revenus et respecter vos obligations légales. La réglementation française évolue rapidement — obligation de facturation électronique Factur-X dès 2026, e-reporting B2C en septembre 2027 — et RentReady intègre ces évolutions pour que vous n'ayez pas à vous en soucier.`;

  const closing =
    pop > 200000
      ? `Pour un propriétaire bailleur à ${city.name}, automatiser la gestion locative représente un gain de temps considérable : fin du pointage manuel des virements, quittances conformes générées sans intervention, et révision de loyer calculée automatiquement. Le marché de ${city.name} attire chaque année de nouveaux investisseurs — anticiper les obligations légales avec un outil dédié vous permet de rester concentré sur la sélection de vos locataires.`
      : `Pour les propriétaires bailleurs à ${city.name} et dans le département ${city.department}, RentReady élimine les tâches répétitives : quittances automatiques conformes à la loi de 1989, détection des virements via Open Banking, et calcul de la révision IRL connecté à l'INSEE. Vous gardez le contrôle total de vos biens sans y consacrer des heures chaque mois.`;

  return { intro, regulation, closing };
}

/* ---------- How-to steps ---------- */

function getHowToSteps(city: City) {
  return [
    {
      name: `Créer votre compte RentReady pour la gestion locative à ${city.name}`,
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
      text: `Ajoutez les informations de vos locataires et utilisez la fonctionnalité de génération de quittances pour produire des documents conformes à la loi de 1989, prêts à être envoyés par email depuis l'application.`,
      url: "/register",
    },
    {
      name: `Activer le suivi automatique des paiements`,
      text: `Connectez votre compte bancaire en lecture seule. RentReady détecte automatiquement les virements de vos locataires et met à jour le statut de chaque paiement, sans aucune manipulation de votre part.`,
      url: "/register",
    },
  ];
}

/* ---------- Structured data ---------- */

function buildGestionLocativeVilleSchema(city: City) {
  const ctx = getCityContext(city);
  const faqs = getFaqs(city);
  const howToSteps = getHowToSteps(city);
  const rentData = AVG_RENT_DATA[city.slug];

  const avgRentPerSqm = rentData ? (rentData.studio + rentData.t3) / 2 : null;

  return {
    "@context": "https://schema.org",
    "@graph": [
      /* BreadcrumbList */
      {
        "@type": "BreadcrumbList",
        name: "Fil d'Ariane",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.rentready.fr" },
          { "@type": "ListItem", position: 2, name: "Gestion locative", item: "https://www.rentready.fr/gestion-locative" },
          { "@type": "ListItem", position: 3, name: city.name, item: `https://www.rentready.fr/gestion-locative/${city.slug}` },
        ],
      },
      /* HowTo — main action the page describes */
      {
        "@type": "HowTo",
        name: `Comment gérer ses locations à ${city.name} avec RentReady`,
        description: `Guide complet pour gérer vos locations à ${city.name} : quittances, suivi des paiements, révision IRL, encadrement des loyers${ctx.isZoneTendue ? " et conformité en zone tendue" : ""}.`,
        image: "https://www.rentready.fr/og-image.png",
        step: howToSteps.map((step, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: step.name,
          itemListElement: {
            "@type": "ItemList",
            itemListElement: [{ "@type": "HowToDirection", text: step.text }],
          },
          url: `https://www.rentready.fr/register?utm_source=howto&utm_medium=organic&utm_campaign=gestion-locative-${city.slug}`,
        })),
        totalTime: "PT10M",
        supply: [
          { "@type": "HowToSupply", name: "Compte RentReady (gratuit 14 jours)" },
          { "@type": "HowToSupply", name: `Biens immobiliers à ${city.name}` },
          { "@type": "HowToSupply", name: "Informations des locataires" },
        ],
        tool: [
          { "@type": "HowToTool", name: "RentReady — Logiciel de gestion locative" },
          { "@type": "HowToTool", name: "Connexion Open Banking (optionnel)" },
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
        name: "RentReady",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: `https://www.rentready.fr/gestion-locative/${city.slug}`,
        description: `Logiciel de gestion locative pour propriétaires bailleurs à ${city.name} (${city.department}). Quittances conformes, détection des loyers, révision IRL${ctx.isZoneTendue ? ", encadrement des loyers" : ""}.`,
        offers: {
          "@type": "Offer",
          price: "15.00",
          priceCurrency: "EUR",
          priceValidUntil: "2027-12-31",
          availability: "https://schema.org/InStock",
          url: "https://www.rentready.fr/register",
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
        name: `RentReady — Gestion locative ${city.name}`,
        description: `Service de gestion locative en ligne pour propriétaires bailleurs à ${city.name} (département ${city.department}, ${city.region}). Automatisation des quittances, suivi des paiements, révision IRL${ctx.isZoneTendue ? ", encadrement des loyers" : ""}.`,
        url: `https://www.rentready.fr/gestion-locative/${city.slug}`,
        image: "https://www.rentready.fr/og-image.png",
        ...(avgRentPerSqm ? {
          priceRange: `€€`,
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `Loyers de référence ${city.name} 2026`,
            hasOfferCatalog: [
              {
                "@type": "OfferCatalog",
                name: "Estimation loyer au m²",
                hasOffer: [
                  { "@type": "Offer", description: "Studio / T1", priceSpecification: { "@type": "UnitPriceSpecification", price: avgRentPerSqm - 2, priceCurrency: "EUR", unitText: "€/m²/mois" } },
                  { "@type": "Offer", description: "T2 / T3", priceSpecification: { "@type": "UnitPriceSpecification", price: avgRentPerSqm, priceCurrency: "EUR", unitText: "€/m²/mois" } },
                  { "@type": "Offer", description: "T4 et plus", priceSpecification: { "@type": "UnitPriceSpecification", price: avgRentPerSqm - 3, priceCurrency: "EUR", unitText: "€/m²/mois" } },
                ],
              },
            ],
          },
        } : {}),
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
        description: `Découvrez comment RentReady simplifie la gestion locative à ${city.name}. Quittances légales, détection des loyers, révision IRL${ctx.isZoneTendue ? ", encadrement des loyers" : ""}. Essai gratuit 14 jours.`,
        url: `https://www.rentready.fr/gestion-locative/${city.slug}`,
        isPartOf: { "@type": "WebSite", name: "RentReady", url: "https://www.rentready.fr" },
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
        name: "RentReady",
        url: "https://www.rentready.fr",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "contact@rentready.fr",
          availableLanguage: "French",
        },
      },
      /* WebSite */
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
  const rentData = AVG_RENT_DATA[city.slug];

  return (
    <>
      <SchemaMarkup data={buildGestionLocativeVilleSchema(city)} />
      <Breadcrumb
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

        {/* ── Average rent reference (top 12 cities) ── */}
        {rentData && (
          <section className="bg-white border-y border-stone-200 px-4 py-8 sm:px-6">
            <div className="mx-auto max-w-4xl">
              <p className="mb-4 text-center text-sm font-medium text-stone-500 uppercase tracking-wide">
                Loyer moyen à {city.name} — estimation {rentData.source}
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Studio / T1", value: `~${rentData.studio} €/m²/mois` },
                  { label: "T2 / T3", value: `~${rentData.t2} €/m²/mois` },
                  { label: "T4 et plus", value: `~${rentData.t3} €/m²/mois` },
                ].map((r) => (
                  <div key={r.label} className="rounded-lg bg-[#f8f7f4] border border-stone-200 p-4 text-center">
                    <p className="text-lg font-bold text-stone-900">{r.value}</p>
                    <p className="mt-1 text-sm text-stone-500">{r.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-center text-xs text-stone-400">
                Estimation indicative — le loyer réel dépend de l&apos;état, de l&apos;emplacement et des équipements du bien.
                {ctx.isZoneTendue && ` Plafonds de loyer en zone tendue : consultez l'arrêté préfectoral du ${city.department}.`}
              </p>
            </div>
          </section>
        )}

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

        {/* ── Local context ── */}
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

            {/* ── Neighborhoods: Paris ── */}
            {city.slug === "paris" && (
              <div className="mt-10">
                <h3 className="mb-4 text-lg font-semibold text-stone-900">
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
                          <p className="font-semibold text-stone-900">{q.name}</p>
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
                <h3 className="mb-4 text-lg font-semibold text-stone-900">
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
                      <p className="font-semibold text-stone-900">{q.name}</p>
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
                <Link href="/guides/encadrement-loyers" className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100">
                  ⚖️ Encadrement des loyers
                </Link>
              )}
              <Link href="/guides/regime-fiscal-lmnp" className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900">
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
