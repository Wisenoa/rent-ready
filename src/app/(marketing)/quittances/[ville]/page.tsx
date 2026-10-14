import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import cities from "@/data/cities.json";
import { SchemaMarkup, paidOffer } from "@/components/seo/schema-markup";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { baseMetadata } from "@/lib/seo/metadata";
import { SITE_NAME, SITE_URL } from "@/data/entity";

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

// Rendered on demand. SEO/marketing content, not product surface: prerendering the
// ~135-page content suite exhausted the Node heap during `next build`
// ("Ineffective mark-compacts near heap limit"). All data is local, so rendering
// per request costs ~ms and every URL keeps working.

/* ---------- Helpers ---------- */

function getCityContext(city: City) {
  const isZoneTendue = ZONES_TENDUES.has(city.slug);
  return { isZoneTendue };
}

/* ---------- Metadata ---------- */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ville } = await params;
  const city = cities.find((c) => c.slug === ville);
  if (!city) return {};

  const title = `Quittance de loyer à ${city.name} — Générez en 1 clic 2026`;
  const description = `Générez une quittance de loyer conforme à ${city.name}. PDF générée au paiement, reçu en cas de paiement partiel, espace locataire. Essai gratuit 14 jours — sans carte bancaire.`;

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

  const intro =
    pop > 500000
      ? `${city.name} est l'une des principales métropoles françaises avec ${new Intl.NumberFormat("fr-FR").format(pop)} habitants. Le marché locatif y est très actif — chaque mois, des milliers de propriétaires doivent générer des quittances de loyer conformes à la loi du 6 juillet 1989.`
      : pop > 200000
        ? `Avec ${new Intl.NumberFormat("fr-FR").format(pop)} habitants, ${city.name} (département ${city.department}, ${city.region}) possède un marché locatif dynamique. Propriétaires et gestionnaires doivent y produire des quittances régulières pour chaque paiement reçu.`
        : pop > 100000
          ? `${city.name} (${new Intl.NumberFormat("fr-FR").format(pop)} habitants, ${city.region}) est une ville à taille humaine où le marché locatif reste actif. Quittance manuelle ou automatisée — la conformité légale reste la même.`
          : `Située dans le département ${city.department} (${city.region}), ${city.name} compte ${new Intl.NumberFormat("fr-FR").format(pop)} habitants. Même pour un petit patrimoine locatif, le bailleur doit remettre une quittance au locataire qui la demande.`;

  const regulation = ctx.isZoneTendue
    ? `${city.name} est en zone tendue : l'encadrement des loyers porte sur le montant fixé dans le bail, à la mise en location ou au renouvellement, et non sur la quittance. Celle-ci reprend les sommes versées en distinguant le loyer et les charges ; après une révision IRL, elle reflète simplement le nouveau montant.`
    : `Pour toute location soumise à la loi du 6 juillet 1989, le bailleur doit remettre gratuitement une quittance au locataire qui la demande (article 21). Elle détaille les sommes versées en distinguant le loyer et les charges ; en pratique, elle indique aussi la période couverte et la date du paiement.`;

  const closing = `Avec Lokna, la quittance PDF est générée lorsque vous enregistrez le paiement qui solde le mois — sans tableau Excel, sans modèle Word. Chaque quittance est archivée, et votre locataire la retrouve dans son espace en ligne si vous l'y avez invité.`;

  return { intro, regulation, closing };
}

/* ---------- Features ---------- */

function getFeatures(city: City) {
  return [
    {
      icon: "⚡",
      title: "Générée au paiement",
      description: `Enregistrez le paiement de votre locataire à ${city.name} : quand le mois est soldé, la quittance est générée avec les montants du bail. Aucune ressaisie.`,
    },
    {
      icon: "📋",
      title: "PDF conforme à la loi",
      description: `Chaque quittance distingue le loyer et les charges, comme l'exige l'article 21 de la loi du 6 juillet 1989, et indique la période couverte et la date du paiement.`,
    },
    {
      icon: "🧾",
      title: "Reçu de paiement partiel",
      description: `Si votre locataire ne règle qu'une partie du loyer, Lokna émet un reçu, pas une quittance. La quittance suit quand le mois est soldé.`,
    },
    {
      icon: "🏠",
      title: "Espace locataire",
      description: `Votre locataire retrouve ses quittances dans son espace en ligne, si vous l'y avez invité. Vous pouvez aussi télécharger chaque PDF.`,
    },
    {
      icon: "🗄️",
      title: "Archivage illimité",
      description: `Toutes vos quittances pour vos biens à ${city.name} sont stockées en ligne, accessibles à tout moment. Historique complet pour vos déclarations fiscales.`,
    },
    {
      icon: "🔒",
      title: "Preuve de paiement",
      description: `La quittance atteste que le loyer et les charges de la période ont été payés. Elle sert de justificatif au locataire comme au bailleur à ${city.name}.`,
    },
  ];
}

/* ---------- FAQs ---------- */

function getFaqs(city: City) {
  const ctx = getCityContext(city);
  return [
    {
      question: `La quittance de loyer est-elle obligatoire à ${city.name} ?`,
      answer: `Oui. Tout bailleur doit remettre gratuitement une quittance au locataire qui en fait la demande, conformément à l'article 21 de la loi du 6 juillet 1989. Cette obligation s'applique à ${city.name} comme sur tout le territoire français. La quittance peut être remise en main propre ou, avec l'accord exprès du locataire, transmise par voie dématérialisée.`,
    },
    {
      question: `Que doit contenir une quittance de loyer à ${city.name} ?`,
      answer: `La loi exige que la quittance détaille les sommes versées en distinguant le loyer et les charges. En pratique, elle mentionne aussi le nom du bailleur et du locataire, l'adresse du bien situé à ${city.name}, la période couverte et la date de paiement.`,
    },
    {
      question: `Quel est le délai pour envoyer une quittance à ${city.name} ?`,
      answer: `La loi ne fixe pas de délai précis : le bailleur doit transmettre la quittance au locataire qui la demande, une fois le loyer et les charges de la période payés. Avec Lokna, la quittance est générée dès que vous enregistrez le paiement qui solde le mois.`,
    },
    {
      question: `Comment calculer le montant de la révision de loyer pour ${city.name} ?`,
      answer: `Si le bail prévoit une clause de révision, le loyer peut être révisé une fois par an : nouveau loyer = loyer actuel × (dernier IRL publié par l'INSEE / IRL du même trimestre de l'année précédente). Les logements classés F ou G au diagnostic de performance énergétique ne peuvent plus être révisés. Notre calculateur IRL fait le calcul en quelques secondes.`,
    },
    {
      question: `L'encadrement des loyers impacte-t-il les quittances à ${city.name} ?`,
      answer: ctx.isZoneTendue
        ? `Pas directement. ${city.name} est en zone tendue : l'encadrement des loyers porte sur le montant fixé dans le bail, à la mise en location ou au renouvellement. Dans les communes où un arrêté préfectoral fixe des loyers de référence, c'est le bail qui doit les mentionner. La quittance, elle, reprend les sommes versées en distinguant le loyer et les charges.`
        : `Pas directement. L'encadrement des loyers porte sur le montant fixé dans le bail, à la mise en location ou au renouvellement, dans les communes en zone tendue. Là où un arrêté préfectoral fixe des loyers de référence, c'est le bail qui doit les mentionner, pas la quittance. Vérifiez la situation de ${city.name} auprès de la préfecture du ${city.department} ou de l'ADIL.`,
    },
    {
      question: `La quittance numérique est-elle valable à ${city.name} ?`,
      answer: `Oui. Depuis la loi ALUR du 24 mars 2014, le bailleur peut transmettre la quittance par voie dématérialisée, avec l'accord exprès du locataire (article 21 de la loi du 6 juillet 1989). Elle a la même valeur que la version papier à ${city.name}, à condition de détailler les sommes versées.`,
    },
  ];
}

/* ---------- HowTo steps ---------- */

function getHowToSteps(city: City) {
  return [
    {
      name: `Créer un compte Lokna`,
      text: `Inscrivez-vous gratuitement en 2 minutes. Aucune carte bancaire requise pour l'essai de 14 jours. Ajoutez votre bien situé à ${city.name}.`,
      url: "/register",
    },
    {
      name: `Ajouter votre locataire`,
      text: `Enregistrez les informations de votre locataire — nom, email, date d'entrée dans les lieux. Le bail et les montants sont pré-configurés.`,
      url: "/register",
    },
    {
      name: `Enregistrer le paiement reçu`,
      text: `Quand votre locataire à ${city.name} paie, enregistrez le paiement depuis le suivi du mois. Lokna calcule le reste dû ; si le mois est soldé, la quittance est générée.`,
      url: "/register",
    },
    {
      name: `Télécharger ou partager la quittance`,
      text: `La quittance est archivée dans votre espace et téléchargeable en PDF à tout moment. Votre locataire la retrouve dans son espace en ligne si vous l'y avez invité.`,
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

  return {
    "@context": "https://schema.org",
    "@graph": [
      /* WebSite */
      {
        "@type": "WebSite",
        name: "Lokna",
        url: SITE_URL,
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
      /* BreadcrumbList */
      {
        "@type": "BreadcrumbList",
        name: "Fil d'Ariane",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Quittances de loyer", item: `${SITE_URL}/quittances` },
          { "@type": "ListItem", position: 3, name: city.name, item: `${SITE_URL}/quittances/${city.slug}` },
        ],
      },
      /* HowTo */
      {
        "@type": "HowTo",
        name: `Comment générer une quittance de loyer à ${city.name}`,
        description: `Générez une quittance de loyer conforme à ${city.name} avec Lokna : PDF générée au paiement, loyer et charges distingués, reçu en cas de paiement partiel.`,
        image: `${SITE_URL}/opengraph-image`,
        step: howToSteps.map((step, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: step.name,
          itemListElement: {
            "@type": "ItemList",
            itemListElement: [{ "@type": "HowToDirection", text: step.text }],
          },
          url: `${SITE_URL}${step.url}?utm_source=howto&utm_medium=organic&utm_campaign=quittances-${city.slug}`,
        })),
        totalTime: "PT5M",
        supply: [
          { "@type": "HowToSupply", name: "Compte Lokna (essai gratuit 14 jours)" },
          { "@type": "HowToSupply", name: `Bien immobilier à ${city.name}` },
          { "@type": "HowToSupply", name: "Informations du locataire" },
        ],
        tool: [
          { "@type": "HowToTool", name: "Lokna — Générateur de quittances de loyer" },
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
        name: `Lokna — Quittances de loyer ${city.name}`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: `${SITE_URL}/quittances/${city.slug}`,
        description: `Quittances de loyer conformes à la loi du 6 juillet 1989 pour vos biens à ${city.name} : générées au paiement, reçu en cas de paiement partiel, espace locataire.`,
        offers: {
          ...paidOffer(),
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
        name: `Lokna — Quittances de loyer ${city.name}`,
        description: `Service de génération de quittances de loyer pour propriétaires bailleurs à ${city.name}. PDF conformes à la loi du 6 juillet 1989, reçu en cas de paiement partiel, suivi des paiements.`,
        url: `${SITE_URL}/quittances/${city.slug}`,
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
        description: `Générez une quittance de loyer PDF gratuite et conforme à ${city.name}, sans inscription, avec notre générateur en ligne.`,
        url: `${SITE_URL}/quittances/${city.slug}`,
        isPartOf: { "@type": "WebSite", name: "Lokna", url: SITE_URL },
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

  return (
    <>
      <SchemaMarkup data={buildQuittanceVilleSchema(city)} breadcrumbRenderedByComponent />
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
              Générez gratuitement une quittance de loyer PDF conforme à la loi
              du 6 juillet 1989, sans inscription.
            </p>
            {ctx.isZoneTendue && (
              <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2 text-sm text-amber-800">
                <span>⚠️</span>
                <span>
                  {city.name} est en zone tendue — l&apos;encadrement des loyers s&apos;applique au bail, pas à la quittance
                </span>
              </div>
            )}
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/outils/generateur-quittance"
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
              >
                Générer ma quittance — gratuit
              </Link>
              <Link
                href="/quittances"
                className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-700"
              >
                Voir toutes les villes →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-2 text-center text-2xl font-bold text-stone-900 sm:text-3xl">
              Pourquoi utiliser Lokna pour vos quittances à {city.name}
            </h2>
            <p className="mb-12 text-center text-stone-600">
              Automatisez la génération — sans tableau Excel, sans oubli.
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
                  <p className="mt-1 text-sm text-stone-600">{stat.label}</p>
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
                    { name: "15e (Vaugirard)", detail: "Moins tendu — marché plus libre", zone: "Zone modérée" },
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
        <section className="bg-[#f8f7f4] px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Générez votre première quittance pour {city.name}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-stone-300">
              Automatisez vos quittances pour vos biens à {city.name} avec Lokna. Essai gratuit 14 jours, sans carte bancaire.
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
