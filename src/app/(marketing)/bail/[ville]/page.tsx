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

/* ---------- Average rent data (€/m², 2025 source: CLAMEU/SeLoger) ---------- */

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

/* ---------- Prefecture URLs for legal reference ---------- */

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

/* ---------- Helpers ---------- */

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
  const description = `Téléchargez un modèle de bail de location adapté à ${city.name}. Vide, meublé, colocation — tous conformes à la loi 1989 et à la réglementation${city ? " "+city.name : ""} (${city ? city.department : ""}).`;

  return baseMetadata({
    title,
    description,
    url: `/bail/${city.slug}`,
    ogType: "template",
  });
}

/* ---------- Local paragraphs ---------- */

function getLocalParagraphs(city: City) {
  const ctx = getCityContext(city);
  const pop = city.population;
  const rentData = AVG_RENT_DATA[city.slug];

  const intro =
    pop > 500000
      ? `${city.name} compte ${new Intl.NumberFormat("fr-FR").format(pop)} habitants. Le marché locatif de la ${city.region} est l'un des plus dynamiques de France, avec une demande locative portée par un bassin d'emploi diversifié, une population étudiante massive et des transports en commun denses. Trouver un locataire n'y est pas difficile — encore faut-il que le bail soit parfaitement rédigé. Le loyer moyen au m² à ${city.name} se situe autour de ${rentData ? `${rentData.studio}-${rentData.t2}` : "15-25"} €/m² selon le type de bien.`
      : pop > 200000
        ? `Avec ${new Intl.NumberFormat("fr-FR").format(pop)} habitants, ${city.name} (département ${city.department}, ${city.region}) s'affirme comme une grande ville attractive. Son marché locatif est porté par une croissance démographique régulière et des projets urbains qui renforcent l'attractivité des quartiers résidentiels. Le loyer moyen à ${city.name} se situe aux alentours de ${rentData ? `${rentData.studio}-${rentData.t2}` : "11-15"} €/m².`
        : pop > 100000
          ? `${city.name} (${new Intl.NumberFormat("fr-FR").format(pop)} habitants, département ${city.department}) est une ville moyenne dynamique de la région ${city.region}. Le marché locatif y offre un équilibre intéressant entre rendement locatif et stabilité pour les propriétaires bailleurs. Le loyer moyen au m² à ${city.name} tourne autour de ${rentData ? `${rentData.studio}-${rentData.t2}` : "9-12"} €/m².`
          : `Située dans le département ${city.department} (${city.region}), ${city.name} compte ${new Intl.NumberFormat("fr-FR").format(pop)} habitants. Le marché locatif local se caractérise par des loyers accessibles et un taux de vacance faible.`;

  const regulation = ctx.isZoneTendue
    ? `En tant que commune en zone tendue, ${city.name} est soumise à l'encadrement des loyers à la relocation. Depuis 2024, le loyer de relocation ne peut pas dépasser le loyer de référence majoré fixé par le Préfet, sous peine de sanctions. Le bail doit intégrer les mentions obligatoires relatives à cet encadrement. Notre modèle est automatiquement mis à jour pour refléter les dernières évolutions réglementaires et les arrêtés préfectoraux applicables dans le ${city.department}.`
    : `Que vous soyez propriétaire d'un appartement en centre-ville ou d'une maison en périphérie de ${city.name}, la rédaction du bail est une étape déterminante. Elle conditionne la relation avec votre locataire pour toute la durée de la location. Notre modèle de bail vous garantit un document juridiquement valide, prêt à être signé en quelques minutes.`;

  const closing = `Les modèles de bail proposés par RentReady sont téléchargés gratuitement et mis à jour avec les dernières évolutions législatives. Que vous louiez à ${city.name} un logement vide ou meublé, en colocation ou en bail mobilité, vous trouverez le modèle adapté à votre situation.`;

  return { intro, regulation, closing };
}

/* ---------- Bail type cards ---------- */

function getBailTypes(city: City) {
  const ctx = getCityContext(city);
  return [
    {
      type: "Vide",
      emoji: "🏠",
      badge: "Le + courant",
      title: `Bail ${city.name} — Location vide`,
      description: `Modèle classique pour une location non meublée à ${city.name}. Durée minimum de 3 ans en zone tendue, 1 an sinon. Dépôt de garantie limité à 1 mois hors charges. Révision de loyer annuelle indexée sur l'IRL.`,
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
      description: `Modèle pour logement meublé à ${city.name}. Durée d'un an minimum, reconductible tacitement. Dépôt de garantie limité à 2 mois hors charges. Inventaire de meubles détaillé intégré au bail.`,
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
      description: `Location partagée à ${city.name} avec clause de solidarité ou contrat individuel au choix. Idéal pour les appartements familiaux ou les logements étudiants, avec état des lieux et annexes adaptés.`,
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
      description: `Locations temporaires à ${city.name} pour professionnels en mutation,Stage ou formation. Pas de dépôt de garantie obligatoire, durée de 1 à 10 mois, non reconductible automatiquement.`,
      duration: "1 à 10 mois",
      deposit: "Aucun obligatoire",
      href: "/templates/bail-mobilite",
      popular: false,
    },
  ];
}

/* ---------- FAQs ---------- */

function getFaqs(city: City) {
  const ctx = getCityContext(city);
  const rentData = AVG_RENT_DATA[city.slug];
  return [
    {
      question: `Comment rédiger un bail de location à ${city.name} ?`,
      answer: `Téléchargez notre modèle gratuit de bail de location adapté à ${city.name}. Remplissez les champs obligatoires (identification des parties, description du bien, loyer, dépôt de garantie, durée), puis signez en deux exemplaires. Le modèle intègre les mentions légales spécifiques à la réglementation française et, si ${city.name} est en zone tendue, les obligations liées à l'encadrement des loyers${ctx.isZoneTendue ? ` — loyer de référence majoré du ${city.department}` : ""}.`,
    },
    {
      question: `Quel est le loyer moyen à ${city.name} en 2026 ?`,
      answer: rentData
        ? `Le loyer moyen à ${city.name} se situe autour de ${rentData.studio} à ${rentData.t3} €/m² selon le type de bien (studio à T3). En zone tendue, le loyer ne peut pas dépasser le loyer de référence majoré fixé par arrêté préfectoral. Source indicative : ${rentData.source}.`
        : `Le marché locatif de ${city.name} offre des opportunités intéressantes pour les propriétaires. Utilisez notre calculateur de loyer pour vérifier la conformité de votre loyer au regard des références locales.`,
    },
    {
      question: `L'encadrement des loyers s'applique-t-il à ${city.name} ?`,
      answer: ctx.isZoneTendue
        ? `Oui. ${city.name} figure parmi les communes en zone tendue soumises à l'encadrement des loyers à la relocation. Lors de la mise en location ou au renouvellement, le loyer ne peut pas dépasser le loyer de référence majoré fixé par arrêté préfectoral. Un complément pour atypie est possible dans la limite de 20 % au-dessus du loyer de référence. Consultez les arrêtés sur le site de la préfecture du ${city.department}.`
        : `Non. ${city.name} n'est actuellement pas soumise à l'encadrement des loyers à la relocation. Les propriétaires bailleurs sont libres de fixer le loyer dans le cadre de la loi du 6 juillet 1989, sans plafonnement spécifique.`,
    },
    {
      question: `Quel dépôt de garantie pour une location à ${city.name} ?`,
      answer: `Le dépôt de garantie est encadré par la loi : 1 mois de loyer hors charges pour une location vide, 2 mois pour une location meublée. Ces plafonds s'appliquent sur tout le territoire français, y compris à ${city.name}. Ils ne peuvent pas être dépassés, même avec l'accord du locataire.`,
    },
    {
      question: `Quelles annexes obligatoires pour un bail à ${city.name} ?`,
      answer: `Tout bail de location à ${city.name} doit不可或缺的 annexes : le DPE (Diagnostic de Performance Énergétique), l'état des lieux d'entrée, les diagnostics amiante, plomb, termites et ERNMT (risques naturels). En zone tendue, le dossier de diagnostic technique doit être remis au locataire avant la signature.`,
    },
    {
      question: `Comment utiliser le modèle de bail pour ${city.name} ?`,
      answer: `Sélectionnez le type de bail correspondant à votre situation (vide, meublé, colocation ou mobilité), téléchargez le modèle, puis personnalisez les champs : identité du bailleur et du locataire, adresse du bien, montant du loyer et des charges, date de début de location. Joignez les annexes obligatoires (DPE, état des lieux, diagnostics), puis signez les deux exemplaires.`,
    },
  ];
}

/* ---------- HowTo steps ---------- */

function getHowToSteps(city: City) {
  return [
    {
      name: `Télécharger le modèle de bail adapté à ${city.name}`,
      text: `Choisissez le type de bail correspondant à votre location (vide, meublé, colocation ou mobilité). Téléchargez le modèle gratuit conforme à la réglementation en vigueur pour ${city.name}.`,
      url: `/bail/${city.slug}`,
    },
    {
      name: `Personnaliser le bail avec les informations du bien et du locataire`,
      text: `Remplissez les champs : identité complète du bailleur et du locataire, adresse exacte du bien, surface habitable, nombre de pièces, montant du loyer, dépôt de garantie, date d'entrée dans les lieux.`,
      url: `/bail/${city.slug}`,
    },
    {
      name: `Joindre les annexes obligatoires`,
      text: `Imprimez et joignez les diagnostics obligatoires : DPE, état des lieux d'entrée, diagnostics amiante, plomb, termites, ERNMT. En zone tendue, joignez également le formulaire d'information sur le loyer de référence.`,
      url: `/bail/${city.slug}`,
    },
    {
      name: `Signer et remettre le bail au locataire`,
      text: `Signez les deux exemplaires du bail (un pour chaque partie), datés et signés. Remettez un exemplaire au locataire contre émargement ou lettre recommandée avec AR. Conservez une copie dans vos archives.`,
      url: `/bail/${city.slug}`,
    },
  ];
}

/* ---------- Structured data ---------- */

function buildBailVilleSchema(city: City) {
  const faqs = getFaqs(city);
  const bailTypes = getBailTypes(city);
  const ctx = getCityContext(city);
  const rentData = AVG_RENT_DATA[city.slug];
  const howToSteps = getHowToSteps(city);

  return {
    "@context": "https://schema.org",
    "@graph": [
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
      /* BreadcrumbList */
      {
        "@type": "BreadcrumbList",
        name: "Fil d'Ariane",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.rentready.fr" },
          { "@type": "ListItem", position: 2, name: "Bail de location", item: "https://www.rentready.fr/bail" },
          { "@type": "ListItem", position: 3, name: city.name, item: `https://www.rentready.fr/bail/${city.slug}` },
        ],
      },
      /* HowTo */
      {
        "@type": "HowTo",
        name: `Comment rédiger un bail de location à ${city.name}`,
        description: `Guide pour rédiger un bail de location conforme à ${city.name}. Téléchargement gratuit du modèle, étapes de personnalisation, annexes obligatoires, signature.${ctx.isZoneTendue ? " Inclut les obligations d'encadrement des loyers en zone tendue." : ""}`,
        image: "https://www.rentready.fr/og-image.png",
        step: howToSteps.map((step, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: step.name,
          itemListElement: {
            "@type": "ItemList",
            itemListElement: [{ "@type": "HowToDirection", text: step.text }],
          },
          url: `https://www.rentready.fr${step.url}?utm_source=howto&utm_medium=organic&utm_campaign=bail-${city.slug}`,
        })),
        totalTime: "PT15M",
        supply: [
          { "@type": "HowToSupply", name: `Modèle de bail pour ${city.name} (téléchargeable)` },
          { "@type": "HowToSupply", name: "DPE, état des lieux, diagnostics" },
          { "@type": "HowToSupply", name: `${ctx.isZoneTendue ? "Formulaire information loyer de référence" : "Documents d'identité bailleur et locataire"}` },
        ],
        tool: [
          { "@type": "HowToTool", name: "Modèle bail RentReady" },
          ...(ctx.isZoneTendue ? [{ "@type": "HowToTool", name: `Arrêté préfectoral ${city.department} — loyer de référence` }] : []),
        ],
        about: { "@type": "City", name: city.name, containedInPlace: { "@type": "AdministrativeArea", name: city.region } },
      },
      /* FAQPage */
      {
        "@type": "FAQPage",
        name: `FAQ — Modèle bail de location ${city.name} 2026`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      /* SoftwareApplication */
      {
        "@type": "SoftwareApplication",
        name: `RentReady — Modèles de bail ${city.name}`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: `https://www.rentready.fr/bail/${city.slug}`,
        description: `Modèles de bail gratuits et conformes pour les propriétaires bailleurs à ${city.name}. Bail vide, meublé, colocation, mobilité. Téléchargez et personnalisez en ligne.${ctx.isZoneTendue ? " Mis à jour avec les obligations d'encadrement des loyers." : ""}`,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: `https://www.rentready.fr/register?template=bail`,
        },
        featureList: bailTypes.map((b) => `Modèle bail ${b.type.toLowerCase()} pour ${city.name}`),
      },
      /* Place / geographic target */
      ...(ctx.isZoneTendue ? [{
        "@type": "Place" as const,
        name: city.name,
        containedInPlace: { "@type": "Country", name: "France" },
        geo: {
          "@type": "GeoCoordinates",
          // Approximate coordinates for major cities (could be enriched via city data)
        },
      }] : [{
        "@type": "Organization" as const,
        name: city.name,
      }]),
      /* LocalBusiness */
      {
        "@type": "LocalBusiness",
        name: `RentReady — Modèles de bail ${city.name}`,
        description: `Téléchargement de modèles de bail gratuits et conformes pour propriétaires bailleurs à ${city.name}. Bail vide, meublé, colocation, mobilité. Téléchargez et personnalisez en ligne.${ctx.isZoneTendue ? " Zone tendue : encadrement des loyers intégré." : ""}`,
        url: `https://www.rentready.fr/bail/${city.slug}`,
        areaServed: {
          "@type": "City",
          name: city.name,
          containedInPlace: [
            { "@type": "AdministrativeArea", name: `Département ${city.department}` },
            { "@type": "AdministrativeArea", name: city.region },
            { "@type": "Country", name: "France" },
          ],
        },
        serviceType: "Modèle de bail de location",
        knowsAbout: [
          `bail de location ${city.name}`,
          `modèle bail ${city.name}`,
          `dépôt de garantie ${city.name}`,
          `encadrement loyers ${city.name}`,
          `loyer référence ${city.name}`,
          `bail meublé ${city.name}`,
          `bail vide ${city.name}`,
          `colocation bail ${city.name}`,
          ...(ctx.isZoneTendue ? [`zone tendue ${city.name}`, `plafond loyer ${city.name}`, `arrêté préfectoral ${city.department}`] : []),
        ],
        ...(PREFECTURE_URLS[city.slug] ? { publishingPrinciples: PREFECTURE_URLS[city.slug] } : {}),
      },
      /* WebPage */
      {
        "@type": "WebPage",
        name: `Modèle de bail à ${city.name} — Téléchargement gratuit 2026`,
        description: `Téléchargez un modèle de bail gratuit et conforme à ${city.name}. Bail vide, meublé, colocation, mobilité.${ctx.isZoneTendue ? " Zone tendue : encadrement des loyers applicable." : ""} Préparez votre location en 5 minutes.${rentData ? ` Loyer moyen indicatif : ${rentData.studio}-${rentData.t2} €/m².` : ""}`,
        url: `https://www.rentready.fr/bail/${city.slug}`,
        isPartOf: { "@type": "WebSite", name: "RentReady", url: "https://www.rentready.fr" },
        about: { "@type": "City", name: city.name, containedInPlace: { "@type": "AdministrativeArea", name: city.region } },
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
  const rentData = AVG_RENT_DATA[city.slug];

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

        {/* ── Average rent reference ── */}
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
              {ctx.isZoneTendue && (
                <p className="mt-3 text-center text-xs text-amber-700">
                  ⚠️ En zone tendue, votre loyer ne peut pas dépasser le loyer de référence majoré.{" "}
                  <a href={PREFECTURE_URLS[city.slug]} target="_blank" rel="noopener noreferrer" className="underline">
                    Consultez l'arrêté préfectoral du {city.department} →
                  </a>
                </p>
              )}
            </div>
          </section>
        )}

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

            {/* Internal links */}
            <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm text-stone-500">
              <Link href="/quittances" className="text-blue-600 hover:underline">
                Générer une quittance →
              </Link>
              <Link href="/outils/calculateur-depot-garantie" className="text-blue-600 hover:underline">
                Calculateur dépôt →
              </Link>
              <Link href="/gestion-locative" className="text-blue-600 hover:underline">
                Gestion locative →
              </Link>
              {ctx.isZoneTendue && (
                <Link href="/guides/encadrement-loyers" className="text-amber-600 hover:underline">
                  Encadrement des loyers →
                </Link>
              )}
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

            {/* Key stats */}
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

            {/* ── Neighborhoods: Paris ── */}
            {city.slug === "paris" && (
              <div className="mt-10">
                <h3 className="mb-4 text-lg font-semibold text-stone-900">
                  Quartiers parisiens — ce qu'un bailleur doit savoir
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Le Marais (4e)", detail: "Zones PSLA, Encadrement actif", zone: "Zone modérée" },
                    { name: "11e arrondissement", detail: "Loyers élevés, encadrement strict", zone: "Zone tendue" },
                    { name: "18e (Montmartre)", detail: "Encadrement loyers 2025", zone: "Zone tendue" },
                    { name: "12e (Bercy)", detail: "Familial, marché moins tendu", zone: "Zone modérée" },
                    { name: "10e (Canal)", detail: "Très tendu, plafonds bas", zone: "Zone tendue" },
                    { name: "15e (Vaugirard)", detail: "Grand arrondissement, moins tendu", zone: "Zone modérée" },
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
                  Quartiers lyonnais — bail et loyer de référence
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Presqu'île", detail: "Centre, loyer de référence élevé" },
                    { name: "Croix-Rousse", detail: "Authentique, marché actif" },
                    { name: "Part-Dieu", detail: "Affaires, forte demande" },
                    { name: "Vaise", detail: "En développement, attractif" },
                    { name: "Brotteaux", detail: "Prisé, loyer premium" },
                    { name: "Gerland", detail: "En hausse, biotech/tertiaire" },
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
                  Quartiers marseillais — marché locatif local
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Le Prado", detail: "Familial, loyer modéré" },
                    { name: "Noailles / Centre", detail: "Central, très diversifié" },
                    { name: "Vieux-Port", detail: "Premium, saisonnier" },
                    { name: "Saint-Giniez", detail: "Bourgeois, stable" },
                    { name: "La Plaine / Cours Julien", detail: "Jeune, en hausse" },
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

            {/* Related links */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/quittances" className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900">
                📄 Quittances de loyer
              </Link>
              <Link href="/guides/etat-des-lieux" className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900">
                📋 État des lieux
              </Link>
              <Link href="/outils/calculateur-surface-habitable" className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900">
                🧮 Calculateur surface habitable
              </Link>
              {ctx.isZoneTendue && (
                <Link href="/guides/encadrement-loyers" className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100">
                  ⚖️ Encadrement des loyers
                </Link>
              )}
              <Link href="/gestion-locative" className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900">
                🏠 Gestion locative
              </Link>
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
