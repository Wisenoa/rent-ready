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

  const title = `Quittance de loyer à ${city.name} — Générez en 1 clic 2026`;
  const description = `Générez une quittance de loyer conforme à ${city.name}. PDF automatique, mention IRL INSEE intégrée, envoi direct au locataire. Essai gratuit 14 jours — sans carte bancaire.`;

  return baseMetadata({
    title,
    description,
    url: `/quittances/${city.slug}`,
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
      ? `${city.name} est l'une des principales métropoles françaises avec ${new Intl.NumberFormat("fr-FR").format(pop)} habitants. Le marché locatif y est très actif — chaque mois, des milliers de propriétaires doivent générer des quittances de loyer conformes à la loi du 6 juillet 1989. Le loyer moyen au m² à ${city.name} se situe autour de ${rentData ? `${rentData.studio}-${rentData.t2}` : "15-25"} €/m².`
      : pop > 200000
        ? `Avec ${new Intl.NumberFormat("fr-FR").format(pop)} habitants, ${city.name} (département ${city.department}, ${city.region}) possède un marché locatif dynamique. Propriétaires et gestionnaires doivent y produire des quittances régulières pour chaque paiement reçu.`
        : pop > 100000
          ? `${city.name} (${new Intl.NumberFormat("fr-FR").format(pop)} habitants, ${city.region}) est une ville à taille humaine où le marché locatif reste actif. Quittance manuelle ou automatisée — la conformité légale reste la même.`
          : `Située dans le département ${city.department} (${city.region}), ${city.name} compte ${new Intl.NumberFormat("fr-FR").format(pop)} habitants. Même pour les pequeños patrimoine locatifs, la quittance de loyer est une obligation légale vis-à-vis du locataire et du fisc.`;

  const regulation = ctx.isZoneTendue
    ? `En zone tendue comme ${city.name}, la quittance doit également mentionner, le cas échéant, le loyer de référence et le complément de loyer appliqué. En cas de révision de loyer IRL, la quittance doit refléter le nouveau montant.`
    : `La quittance de loyer est obligatoire dans tout location soumise à la loi du 6 juillet 1989. Elle doit mentionner le montant du loyer, des charges, la période couverte, la date de paiement et le mode de paiement.`;

  const closing = `Avec RentReady, générez des quittances PDF conformes en 1 clic — sans tableau Excel, sans modèle Word. Chaque quittance est horodatée, archivée et prête à être envoyée à votre locataire par email.`;

  return { intro, regulation, closing };
}

/* ---------- Features ---------- */

function getFeatures(city: City) {
  const ctx = getCityContext(city);
  return [
    {
      icon: "⚡",
      title: "Génération en 1 clic",
      description: `Sélectionnez le locataire à ${city.name} et le mois — la quittance est générée automatiquement avec tous les montants pré-remplis. Zéro saisie manuelle.`,
    },
    {
      icon: "📋",
      title: "PDF conforme à la loi",
      description: `Chaque quittance respecte les mentions obligatoires de la loi du 6 juillet 1989 : période, montant du loyer, charges, date, mode de paiement, signature du bailleur.`,
    },
    {
      icon: "📊",
      title: "Indice IRL INSEE intégré",
      description: `L'indice de référence des loyers de l'INSEE est automatiquement intégré à la quittance — indispensable pour les révisions annuelles à ${city.name}.`,
    },
    {
      icon: "📧",
      title: "Envoi automatique au locataire",
      description: `La quittance est envoyée par email au locataire ou stockée dans son portail — finies les transmissions manuelles par courrier ou photo.`,
    },
    {
      icon: "🗄️",
      title: "Archivage illimité",
      description: `Toutes vos quittances pour vos biens à ${city.name} sont stockées en ligne, accessibles à tout moment. Historique complet pour vos déclarations fiscales.`,
    },
    {
      icon: ctx.isZoneTendue ? "⚖️" : "🔒",
      title: ctx.isZoneTendue ? "Mention zone tendue intégrée" : "Preuve légale en cas de litige",
      description: ctx.isZoneTendue
        ? `Pour ${city.name}, la quittance peut intégrer la mention du loyer de référence et du complément atypie — conforme à l'encadrement des loyers.`
        : `Chaque quittance horodatée constitue une preuve légale de paiement. En cas de litige avec un locataire à ${city.name}, vous êtes couvert.`,
    },
  ];
}

/* ---------- FAQs ---------- */

function getFaqs(city: City) {
  const ctx = getCityContext(city);
  const rentData = AVG_RENT_DATA[city.slug];
  return [
    {
      question: `La quittance de loyer est-elle obligatoire à ${city.name} ?`,
      answer: `Oui. Tout bailleur doit remettre une quittance au locataire qui en fait la demande, conformément à l'article 21 de la loi du 6 juillet 1989. Cette obligation s'applique à ${city.name} comme sur tout le territoire français. La quittance peut être envoyée par email ou remise en main propre.`,
    },
    {
      question: `Que doit contenir une quittance de loyer à ${city.name} ?`,
      answer: `Une quittance doit mentionner : le nom du bailleur et du locataire, l'adresse du bien situé à ${city.name}, la période couverte, le montant du loyer hors charges et le montant des charges, la date de paiement, le mode de paiement utilisé, et la signature du bailleur. En zone tendue, la mention du loyer de référence peut être requise.`,
    },
    {
      question: `Quel est le délai pour envoyer une quittance à ${city.name} ?`,
      answer: `La loi impose de fournir la quittance dans les 24 heures suivant le paiement. Avec RentReady, l'envoi est automatique — dès que le virement est détecté (via Open Banking), la quittance est générée et transmise au locataire à ${city.name} sans délai.`,
    },
    {
      question: `Comment calculer le montant de la révision de loyer pour ${city.name} ?`,
      answer: rentData
        ? `La révision de loyer se fait via l'Indice de Référence des Loyers (IRL) publié par l'INSEE chaque trimestre. Pour un bien à ${city.name}, le nouveau loyer = ancien loyer × (IRL du trimestre / IRL du même trimestre de l'année précédente). Le loyer ne peut pas dépasser le loyer de référence majoré en zone tendue.`
        : `La révision de loyer utilise l'Indice de Référence des Loyers (IRL) de l'INSEE. Utilisez notre simulateur de révision IRL pour calculer le nouveau montant en quelques secondes, sans erreur de calcul.`,
    },
    {
      question: `L'encadrement des loyers impacte-t-il les quittances à ${city.name} ?`,
      answer: ctx.isZoneTendue
        ? `Oui. ${city.name} étant en zone tendue, toute quittance relative à un nouveau bail ou un renouvellement doit mentionner le loyer de référence et un éventuel complément pour atypie. En cas de dépassement du plafond, vous risquez un redressement. RentReady intègre automatiquement ces mentions.`
        : `${city.name} n'est actuellement pas soumise à l'encadrement des loyers à la relocation. Vous êtes libre de fixer le loyer dans les limites de la loi, sans plafonnement spécifique sur la quittance.`,
    },
    {
      question: `La quittance numérique est-elle valable à ${city.name} ?`,
      answer: `Oui. Depuis la loi du 24 mars 2024, la quittance de loyer électronique a la même valeur juridique que la version papier. Elle est parfaitement valable à ${city.name} — à condition de comporter toutes les mentions obligatoires et d'être transmise au locataire par voie électronique.`,
    },
  ];
}

/* ---------- HowTo steps ---------- */

function getHowToSteps(city: City) {
  return [
    {
      name: `Créer un compte RentReady`,
      text: `Inscrivez-vous gratuitement en 2 minutes. Aucune carte bancaire requise pour l'essai de 14 jours. Ajoutez votre bien situé à ${city.name}.`,
      url: "/register",
    },
    {
      name: `Ajouter votre locataire`,
      text: `Enregistrez les informations de votre locataire — nom, email, date d'entrée dans les lieux. Le bail et les montants sont pré-configurés.`,
      url: "/register",
    },
    {
      name: `Activer la détection automatique des paiements`,
      text: `Connectez votre compte bancaire en lecture seule via Open Banking. Chaque virement de votre locataire à ${city.name} est détecté automatiquement — la quittance est générée sans aucune action de votre part.`,
      url: "/register",
    },
    {
      name: `Recevoir et envoyer la quittance`,
      text: `La quittance est automatiquement archivée dans votre espace et envoyée par email à votre locataire. Téléchargeable en PDF à tout moment.`,
      url: "/register",
    },
  ];
}

/* ---------- Structured data ---------- */

function buildQuittanceVilleSchema(city: City) {
  const ctx = getCityContext(city);
  const faqs = getFaqs(city);
  const features = getFeatures(city);
  const howToSteps = getHowToSteps(city);
  const rentData = AVG_RENT_DATA[city.slug];

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
          { "@type": "ListItem", position: 2, name: "Quittances de loyer", item: "https://www.rentready.fr/quittances" },
          { "@type": "ListItem", position: 3, name: city.name, item: `https://www.rentready.fr/quittances/${city.slug}` },
        ],
      },
      /* HowTo */
      {
        "@type": "HowTo",
        name: `Comment générer une quittance de loyer à ${city.name}`,
        description: `Générez une quittance de loyer conforme à ${city.name} en 1 clic avec RentReady. PDF automatique, mention IRL INSEE, envoi email instantané.`,
        image: "https://www.rentready.fr/og-image.png",
        step: howToSteps.map((step, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: step.name,
          itemListElement: {
            "@type": "ItemList",
            itemListElement: [{ "@type": "HowToDirection", text: step.text }],
          },
          url: `https://www.rentready.fr${step.url}?utm_source=howto&utm_medium=organic&utm_campaign=quittances-${city.slug}`,
        })),
        totalTime: "PT5M",
        supply: [
          { "@type": "HowToSupply", name: "Compte RentReady (essai gratuit 14 jours)" },
          { "@type": "HowToSupply", name: `Bien immobilier à ${city.name}` },
          { "@type": "HowToSupply", name: "Informations du locataire" },
        ],
        tool: [
          { "@type": "HowToTool", name: "RentReady — Générateur de quittances de loyer" },
        ],
        about: { "@type": "City", name: city.name, containedInPlace: { "@type": "AdministrativeArea", name: city.region } },
      },
      /* FAQPage */
      {
        "@type": "FAQPage",
        name: `FAQ — Quittance de loyer ${city.name} 2026`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      /* SoftwareApplication */
      {
        "@type": "SoftwareApplication",
        name: `RentReady — Quittances de loyer ${city.name}`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: `https://www.rentready.fr/quittances/${city.slug}`,
        description: `Générez des quittances de loyer conformes à la loi en 1 clic pour vos biens à ${city.name}. PDF automatique, mention IRL INSEE, envoi email instantané.${ctx.isZoneTendue ? " Zone tendue : mention loyer de référence intégrée." : ""}`,
        offers: {
          "@type": "Offer",
          price: "15.00",
          priceCurrency: "EUR",
          priceValidUntil: "2027-12-31",
          availability: "https://schema.org/InStock",
          url: "https://www.rentready.fr/register",
        },
        featureList: features.map((f) => f.title),
        areaServed: {
          "@type": "City",
          name: city.name,
          containedInPlace: [
            { "@type": "AdministrativeArea", name: `Département ${city.department}` },
            { "@type": "AdministrativeArea", name: city.region },
            { "@type": "Country", name: "France" },
          ],
        },
      },
      /* LocalBusiness */
      {
        "@type": "LocalBusiness",
        name: `RentReady — Quittances de loyer ${city.name}`,
        description: `Service de génération de quittances de loyer pour propriétaires bailleurs à ${city.name}. PDF conformes, détection automatique des paiements via Open Banking, envoi email instantané.${ctx.isZoneTendue ? " Mention zone tendue intégrée." : ""}`,
        url: `https://www.rentready.fr/quittances/${city.slug}`,
        areaServed: {
          "@type": "City",
          name: city.name,
          containedInPlace: [
            { "@type": "AdministrativeArea", name: `Département ${city.department}` },
            { "@type": "AdministrativeArea", name: city.region },
            { "@type": "Country", name: "France" },
          ],
        },
        serviceType: "Génération de quittances de loyer",
        knowsAbout: [
          `quittance de loyer ${city.name}`,
          `générateur quittance ${city.name}`,
          `modèle quittance ${city.name}`,
          `quittance PDF ${city.name}`,
          `IRL ${city.name}`,
          `révision loyer ${city.name}`,
          ...(ctx.isZoneTendue ? [`encadrement loyers ${city.name}`, `loyer référence ${city.name}`] : []),
        ],
      },
      /* WebPage */
      {
        "@type": "WebPage",
        name: `Quittance de loyer à ${city.name} — Générateur PDF gratuit 2026`,
        description: `Générez une quittance de loyer PDF gratuite et conforme à ${city.name}. En 1 clic — sans inscription. Mention IRL INSEE intégrée, envoi email au locataire.${rentData ? ` Loyer moyen indicatif : ${rentData.studio}-${rentData.t2} €/m².` : ""}`,
        url: `https://www.rentready.fr/quittances/${city.slug}`,
        isPartOf: { "@type": "WebSite", name: "RentReady", url: "https://www.rentready.fr" },
        about: { "@type": "City", name: city.name, containedInPlace: { "@type": "AdministrativeArea", name: city.region } },
      },
    ],
  };
}

/* ---------- Page ---------- */

export default async function QuittanceVillePage({ params }: Props) {
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
      <SchemaMarkup data={buildQuittanceVilleSchema(city)} />
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Quittances de loyer", href: "/quittances" },
          { label: city.name, href: `/quittances/${city.slug}`, isCurrentPage: true },
        ]}
      />

      <article>
        {/* ── Hero ── */}
        <section className="bg-gradient-to-b from-[#f8f7f4] to-white px-4 py-20 text-center sm:px-6 sm:py-28">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-sm font-medium tracking-wide text-blue-600 uppercase">
              Quittances de loyer · {city.region}
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
              Quittance de loyer à&nbsp;{city.name}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-stone-600">
              Générez une quittance de loyer PDF gratuite et conforme à la loi en 1 clic.
              Mention IRL INSEE intégrée, envoi email instantané à votre locataire.
            </p>
            {ctx.isZoneTendue && (
              <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2 text-sm text-amber-800">
                <span>⚠️</span>
                <span>
                  {city.name} est en zone tendue — la quittance doit mentionner le loyer de référence
                </span>
              </div>
            )}
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
              >
                Générer ma quittance — gratuit
              </Link>
              <Link
                href="/quittances"
                className="text-sm font-medium text-stone-500 transition-colors hover:text-stone-700"
              >
                Voir toutes les villes →
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
            </div>
          </section>
        )}

        {/* ── Features ── */}
        <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-2 text-center text-2xl font-bold text-stone-900 sm:text-3xl">
              Pourquoi utiliser RentReady pour vos quittances à {city.name}
            </h2>
            <p className="mb-12 text-center text-stone-600">
              Automatisez la génération et l'envoi — sans tableau Excel, sans oubli.
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

        {/* ── Local context ── */}
        <section className="bg-[#f8f7f4] px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-2xl font-bold text-stone-900 sm:text-3xl">
              La quittance de loyer à {city.name} en 2026
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
                  Quartiers parisiens — Loyers et quittances
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Le Marais (4e)", detail: "Loyers élevés — quittances détaillées", zone: "Zone modérée" },
                    { name: "11e arrondissement", detail: "Encadrement strict — mention obligatoire", zone: "Zone tendue" },
                    { name: "18e (Montmartre)", detail: "Encadrement loyers 2025", zone: "Zone tendue" },
                    { name: "12e (Bercy)", detail: "Marché moins tendu", zone: "Zone modérée" },
                    { name: "10e (Canal)", detail: "Très tendu — plafond bas", zone: "Zone tendue" },
                    { name: "15e (Vaugirard)", detail: "Moins tendu — plus自由的 marché", zone: "Zone modérée" },
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
                  Quartiers lyonnais — loyer de référence et quittances
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Presqu'île", detail: "Centre, loyer de référence élevé" },
                    { name: "Croix-Rousse", detail: "Authentique, quittances détaillées" },
                    { name: "Part-Dieu", detail: "Affaires, forte demande" },
                    { name: "Vaise", detail: "En développement, attractif" },
                    { name: "Brotteaux", detail: "Prisé, loyer premium" },
                    { name: "Gerland", detail: "En hausse, loyer révisé IRL" },
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
                  Quartiers marseillais — quittances de loyer locales
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

            {/* Related resources */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/quittances" className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900">
                📄 Toutes les villes
              </Link>
              <Link href="/bail" className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900">
                📝 Modèles de bail
              </Link>
              <Link href="/outils/calculateur-irl" className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900">
                📊 Calculateur IRL
              </Link>
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
              Questions fréquentes — Quittance de loyer à {city.name}
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
              Générez votre première quittance pour {city.name}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-stone-300">
              Rejoignez les propriétaires de {city.name} qui automatisent leurs quittances avec RentReady. Essai gratuit 14 jours, sans carte bancaire.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
            >
              Commencer gratuitement
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
