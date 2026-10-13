import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import Decimal from "decimal.js";
import cities from "@/data/cities.json";
import demoHomes from "@/data/gestion-locative-demo.json";
import { ProductScreenshot } from "@/components/landing/product-screenshot";
import { RentTrackingDemo } from "@/components/landing/rent-tracking-demo";
import { settlePeriodPayments } from "@/lib/domain/period-settlement";
import { formatCurrency } from "@/lib/format";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { SchemaMarkup, paidOffer } from "@/components/seo/schema-markup";
import {
  FEATURE_LIST,
  SAME_AS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  formatEntryPrice,
  formatProPrice,
} from "@/data/entity";
import { baseMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;

const GESTION_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    {
      "@type": "Organization",
      name: SITE_NAME,
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
        email: "contact@lokna.fr",
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
      name: `${SITE_NAME} — Logiciel de gestion locative`,
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
      areaServed: { "@type": "Country", name: "France" },
    },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata({
    title: "Logiciel de gestion locative pour propriétaires bailleurs",
    description: `Suivez vos logements, vos baux et vos loyers dans un logiciel clair. Quittance après paiement complet, reçu en cas de versement partiel et rappels de révision IRL. Dès ${formatEntryPrice()}.`,
    url: "/gestion-locative",
    ogType: "feature",
  });
}

type City = (typeof cities)[number];

function groupByRegion(data: City[]): Record<string, City[]> {
  const groups: Record<string, City[]> = {};

  for (const city of data) {
    (groups[city.region] ??= []).push(city);
  }

  return Object.fromEntries(
    Object.entries(groups).sort(([left], [right]) =>
      left.localeCompare(right, "fr")
    )
  );
}

const REGIONS = groupByRegion(cities);

// Same fictional portfolio used to capture the real application. All sums use
// the existing settlement implementation; the landing makes no payment decision.
const DEMO_TOTALS = demoHomes.reduce((totals, home) => {
  const settlement = settlePeriodPayments({
    rentAmount: home.rent,
    chargesAmount: home.charges,
    payments: home.paid ? [{ amount: home.total, paidAt: new Date("2026-10-03") }] : [],
  });
  return {
    expected: totals.expected.plus(settlement.totalDue),
    received: totals.received.plus(settlement.paid),
    outstanding: totals.outstanding.plus(settlement.outstanding),
  };
}, { expected: new Decimal(0), received: new Decimal(0), outstanding: new Decimal(0) });

const PRODUCT_SHOTS = {
  overview: { src: "/images/gestion-locative/v3/dashboard-focus-1100.webp", width: 1528, height: 912 },
  arrearsDesktop: { src: "/images/gestion-locative/v3/arrears-focus-1440.webp", width: 2048, height: 404 },
  arrearsMobile: { src: "/images/gestion-locative/v3/arrears-focus-390.webp", width: 684, height: 608 },
  receiptsDesktop: { src: "/images/gestion-locative/v3/receipts-focus-1440.webp", width: 2048, height: 564 },
  receiptsMobile: { src: "/images/gestion-locative/v3/receipts-focus-390.webp", width: 684, height: 1090 },
};

const JOURNEY = [
  "Le logement",
  "Le locataire",
  "Le bail",
  "Le loyer attendu",
  "Le paiement reçu",
  "Le bon document",
];

const FAQ = [
  {
    question: "À qui s'adresse Lokna ?",
    answer:
      "Lokna est pensé pour les propriétaires bailleurs qui gèrent eux-mêmes de 1 à 10 logements. Les informations du bien, du locataire et du bail alimentent ensuite le suivi mensuel des loyers.",
  },
  {
    question: "Que se passe-t-il si le paiement est partiel ?",
    answer:
      "Lokna conserve le solde restant dû et distingue le reçu de paiement partiel de la quittance. La quittance correspond au paiement intégral du loyer et des charges.",
  },
  {
    question: "Les quittances sont-elles envoyées automatiquement ?",
    answer:
      "Non. Vous générez la quittance lorsque le paiement intégral est enregistré. Vous pouvez ensuite la télécharger ou la mettre à disposition du locataire dans son espace dédié.",
  },
  {
    question: "Combien coûte Lokna ?",
    answer: `L'offre Starter commence à ${formatEntryPrice()} et l'offre Pro à ${formatProPrice()}. L'inscription ne demande pas de carte bancaire. Retrouvez les limites de chaque offre et leurs conditions sur la page des tarifs.`,
  },
];

export default function GestionLocativePage() {
  return (
    <article className="overflow-hidden bg-[#F5F3EF] text-[#15241F]">
      <SchemaMarkup data={GESTION_SCHEMA} breadcrumbRenderedByComponent />

      <div className="mx-auto max-w-6xl px-5 pt-5 sm:px-8">
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
      </div>

      <section className="mx-auto grid max-w-6xl items-center gap-7 px-5 pb-12 pt-6 sm:gap-10 sm:px-8 sm:pb-20 sm:pt-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:py-16">
        <div className="max-w-xl">
          <p className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#315B48]">
            <span className="h-2 w-2 rounded-full bg-[#7FA68E]" aria-hidden="true" />
            Pour les propriétaires qui gèrent eux-mêmes
          </p>
          <h1 className="max-w-[13ch] font-[family-name:var(--font-serif)] text-[clamp(3rem,5.8vw,4.8rem)] font-normal leading-[1.02] tracking-[-0.045em] text-[#0B3B2C]">
            Votre gestion locative, en clair.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#4F5D56] sm:text-lg sm:leading-8">
            Un seul endroit pour vos logements, vos locataires et vos baux.
            Voyez les loyers reçus, les paiements manquants et les quittances
            à remettre.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
            <Link href="/register" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#0B3B2C] px-6 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#174C39] active:bg-[#082F23] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3B2C]">
              Essayer Lokna <span aria-hidden="true">↗</span>
            </Link>
            <Link href="#demonstration" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#B9C2B9] px-5 text-sm font-semibold text-[#173F30] transition-colors duration-150 hover:border-[#0B3B2C] hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3B2C]">
              Voir le suivi en action <span aria-hidden="true">↓</span>
            </Link>
          </div>
          <p className="mt-4 text-sm leading-6 text-[#526058]">
            Créez votre espace, sans carte bancaire.
            <span className="block">Dès {formatEntryPrice()} · <Link href="/pricing" className="underline underline-offset-4 hover:text-[#0B3B2C]">Voir les tarifs</Link></span>
          </p>
        </div>

        <figure className="relative mx-auto w-full max-w-[650px] lg:ml-auto">
          <div className="relative h-36 overflow-hidden rounded-t-[2rem] bg-[#DED9CF] sm:h-64 lg:h-[320px] lg:rounded-[2rem] lg:rounded-bl-[5rem]">
            <Image src="/images/gestion-locative/hero.webp" alt="Un appartement français lumineux, ouvert sur un salon aux tons naturels." fill priority sizes="(min-width: 1024px) 42vw, (min-width: 640px) 80vw, 100vw" className="object-cover object-[center_45%]" />
          </div>
          <div className="relative z-10 mx-auto -mt-12 max-w-[390px] rounded-2xl border border-[#D8DDD4] bg-[#FAFAFA] p-3 shadow-[0_16px_48px_-24px_rgba(11,59,44,0.35)] sm:-mt-20 lg:-mt-24 lg:ml-5 lg:mr-0 lg:max-w-none lg:p-4">
            <div className="mb-3 flex items-center justify-between gap-3 px-1 text-xs text-[#526058]">
              <span className="font-semibold text-[#203D30]">Votre suivi dans Lokna</span>
              <span>Aperçu réel</span>
            </div>
            <ProductScreenshot desktop={PRODUCT_SHOTS.overview} mobile={PRODUCT_SHOTS.arrearsMobile} alt="Capture réelle de Lokna : 2 500 euros attendus, 1 600 euros perçus et 900 euros à percevoir. Le loyer manquant d’Emma Laurent est signalé avec les actions Relancer et Enregistrer." eager sizes="(min-width: 1024px) 45vw, 390px" />
          </div>
          <figcaption className="mt-4 px-1 text-xs leading-5 text-[#526058]">
            Capture du logiciel · Données de démonstration fictives.
          </figcaption>
        </figure>
      </section>

      <section
        id="cycle-mensuel"
        className="scroll-mt-20 border-y border-[#E3E0D8] bg-[#FBFAF7]"
      >
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
          <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr] md:items-end md:gap-12">
            <div>
              <p className="text-sm font-medium text-[#315B48]">
                Une seule continuité
              </p>
              <h2 className="mt-3 max-w-lg font-[family-name:var(--font-serif)] text-3xl font-normal leading-tight tracking-[-0.03em] text-[#0B3B2C] sm:text-4xl">
                Tout part du logement. Tout reste relié.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#5A6660] sm:text-base">
              Le bail fixe le montant et l&apos;échéance. Le paiement fait
              évoluer le solde ; le document reflète le règlement de la période.
            </p>
          </div>

          <ol className="mt-10 grid grid-cols-2 gap-x-5 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-6">
            {JOURNEY.map((step, index) => (
              <li
                key={step}
                className="border-t border-[#C8CEC6] py-4 first:border-t-2 first:border-[#7FA68E] sm:py-5"
              >
                <span className="text-[11px] font-semibold tabular-nums text-[#526058]">
                  0{index + 1}
                </span>
                <p className="mt-2 max-w-[10ch] text-sm font-semibold leading-5 text-[#203D30] sm:text-base">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="demonstration" className="scroll-mt-20 bg-[#EDF1E9]">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-12">
            <div>
              <p className="text-sm font-medium text-[#315B48]">Le suivi, en situation</p>
              <h2 className="mt-3 max-w-xl font-[family-name:var(--font-serif)] text-3xl font-normal leading-tight tracking-[-0.03em] text-[#0B3B2C] sm:text-5xl">
                Trois logements. Un loyer à vérifier.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[#526058] sm:text-base">
                Deux loyers sont réglés. Le troisième est encore à percevoir.
                Voyez ce qui manque et l&apos;action possible.
              </p>
            </div>
            <div>
              <p className="mb-3 text-xs text-[#526058]">Exemple fictif · octobre 2026 · loyers et charges inclus</p>
              <dl className="grid grid-cols-3 gap-3 border-y border-[#C8D1C3] py-5 tabular-nums">
                {[
                  { label: "Attendu", value: DEMO_TOTALS.expected },
                  { label: "Reçu", value: DEMO_TOTALS.received },
                  { label: "Reste à percevoir", value: DEMO_TOTALS.outstanding },
                ].map((metric) => (
                  <div key={metric.label}>
                    <dt className="text-xs leading-5 text-[#526058]">{metric.label}</dt>
                    <dd className="mt-2 whitespace-nowrap text-lg font-semibold tracking-tight text-[#203D30] sm:text-2xl">{formatCurrency(metric.value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <RentTrackingDemo steps={[
            {
              label: "Repérer le loyer manquant",
              title: "900 € attendus. Aucun règlement enregistré.",
              description: "Le logement et le locataire sont identifiés. Enregistrez le paiement s’il est arrivé, ou envoyez une relance depuis le suivi. Ici, l’échéance est passée sans règlement constaté.",
              screenshot: <ProductScreenshot desktop={PRODUCT_SHOTS.arrearsDesktop} mobile={PRODUCT_SHOTS.arrearsMobile} alt="Dans le tableau de bord Lokna, Emma Laurent et l’Appartement de la Cour sont signalés avec 900 euros dus, 8 jours de retard et les actions Relancer et Enregistrer." />,
            },
            {
              label: "Retrouver les quittances",
              title: "Le bon document, pour les loyers réglés.",
              description: "Dans Paiements & Quittances, les deux loyers payés donnent accès au téléchargement. Le loyer encore dû reste distinct. En cas de paiement partiel, le document est un reçu ; la quittance suppose le règlement intégral du loyer et des charges.",
              screenshot: <ProductScreenshot desktop={PRODUCT_SHOTS.receiptsDesktop} mobile={PRODUCT_SHOTS.receiptsMobile} alt="Journal réel Paiements et Quittances de Lokna : Léa Bernard, 850 euros payés, et Julien Moreau, 750 euros payés, avec leurs quittances à télécharger. Emma Laurent, 900 euros en retard, sans quittance." />,
            },
          ]} />
        </div>
      </section>

      <section id="fonctionnalites" className="scroll-mt-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <figure className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] rounded-bl-[4rem] bg-[#D9D1C2] lg:aspect-[4/3.6]">
              <Image src="/images/gestion-locative/courtyard-entry.webp" alt="Entrée d’un immeuble français donnant sur une cour lumineuse." fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover object-[center_55%]" />
            </figure>
            <h2 className="mt-7 max-w-lg font-[family-name:var(--font-serif)] text-3xl font-normal leading-tight tracking-[-0.03em] text-[#0B3B2C] sm:text-4xl">
              Un dossier clair pour chaque location.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[#526058] sm:text-base">
              Le logement, le locataire et le bail sont reliés. Retrouvez
              les coordonnées, les montants contractuels et les documents
              depuis votre espace, pour un bien comme pour plusieurs.
            </p>
          </div>
          <div className="lg:pt-2">
            <div className="grid items-start gap-6 sm:grid-cols-[1fr_140px]">
              <div>
                <h3 className="font-[family-name:var(--font-serif)] text-3xl font-normal leading-tight tracking-[-0.03em] text-[#0B3B2C]">
                  Les documents suivent les paiements.
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#526058] sm:text-base">
                  La quittance reprend les données du bail et de la période
                  réglée. Téléchargez le document depuis le suivi et retrouvez
                  les pièces disponibles dans le dossier de la location.
                </p>
              </div>
              <figure className="relative hidden aspect-[3/4] overflow-hidden rounded-t-[3rem] rounded-b-xl bg-[#D9D1C2] sm:block">
                <Image src="/images/gestion-locative/keys-and-documents.webp" alt="Clés et dossier papier sur un bureau en bois." fill sizes="140px" className="object-cover" />
              </figure>
            </div>
            <div className="mt-8 border-t border-[#DCD9D1] pt-8">
              <h3 className="font-[family-name:var(--font-serif)] text-3xl font-normal leading-tight tracking-[-0.03em] text-[#0B3B2C]">
                La révision de loyer, avec ses repères.
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#526058] sm:text-base">
                Consultez la date de révision du bail et le calcul fondé sur
                l&apos;indice IRL de référence. Vous validez l&apos;application
                du nouveau loyer ; Lokna ne décide pas à votre place.
              </p>
              <Link href="/outils/calculateur-irl" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[#174C39] underline decoration-[#AAB9AC] underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B3B2C]">
                Découvrir le calculateur IRL ↗
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="comparatif" className="border-y border-[#E3E0D8] bg-[#FBFAF7]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          <div className="grid gap-4 md:grid-cols-2 md:gap-16">
            <h2 className="max-w-lg font-[family-name:var(--font-serif)] text-3xl font-normal leading-tight tracking-[-0.03em] text-[#0B3B2C] sm:text-4xl">
              Quand votre suivi dépasse le tableur.
            </h2>
            <p className="max-w-xl text-sm leading-7 text-[#526058] sm:text-base">
              Excel permet de construire un suivi sur mesure. Lokna apporte
              un cadre déjà relié aux logements, aux baux et aux documents.
              Voici ce qui change dans les tâches du mois.
            </p>
          </div>
          <div className="mt-8 hidden grid-cols-[0.6fr_1fr_1fr] gap-8 border-b border-[#DCD9D1] pb-3 text-sm font-semibold text-[#315B48] md:grid" aria-hidden="true">
            <span>La tâche</span><span>Avec votre tableur</span><span>Dans Lokna</span>
          </div>
          <dl className="mt-6 divide-y divide-[#DCD9D1] md:mt-0">
            {[
              { task: "Relier les informations", excel: "Organiser vos onglets et maintenir les liens entre les données.", lokna: "Le logement, le locataire et le bail sont reliés dans leur dossier." },
              { task: "Suivre un règlement", excel: "Reporter le versement et mettre à jour votre solde et votre statut.", lokna: "Enregistrer le paiement pour retrouver le montant reçu et le reste dû." },
              { task: "Préparer le document", excel: "Reprendre les données du mois dans votre modèle de document.", lokna: "Télécharger le document correspondant au règlement de la période." },
            ].map((row) => (
              <div key={row.task} className="grid grid-cols-2 gap-x-6 gap-y-4 py-6 md:grid-cols-[0.6fr_1fr_1fr] md:gap-8">
                <dt className="col-span-2 text-base font-semibold text-[#203D30] md:col-span-1 md:text-sm">{row.task}</dt>
                <dd className="text-sm leading-6 text-[#526058]"><span className="mb-2 block text-xs font-semibold text-[#315B48] md:sr-only">Avec votre tableur</span>{row.excel}</dd>
                <dd className="text-sm leading-6 text-[#203D30]"><span className="mb-2 block text-xs font-semibold text-[#315B48] md:sr-only">Dans Lokna</span>{row.lokna}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section
        id="simulateurs"
        className="scroll-mt-20 border-y border-[#E3E0D8] bg-[#FBFAF7]"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-10 sm:px-8 sm:py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-[#315B48]">
              À utiliser dès maintenant
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-serif)] text-2xl font-normal text-[#0B3B2C] sm:text-3xl">
              Un outil ponctuel, sans créer de compte.
            </h2>
          </div>
          <div className="flex flex-col gap-3 text-sm sm:flex-row sm:gap-6">
            <Link
              href="/outils/calculateur-irl"
              className="font-semibold text-[#174C39] underline decoration-[#AAB9AC] underline-offset-4 hover:decoration-[#174C39]"
            >
              Calculer une révision IRL ↗
            </Link>
            <Link
              href="/outils/generateur-quittance"
              className="font-semibold text-[#174C39] underline decoration-[#AAB9AC] underline-offset-4 hover:decoration-[#174C39]"
            >
              Préparer une quittance ↗
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mb-7 max-w-xl">
          <p className="text-sm font-medium text-[#315B48]">
            Réponses claires
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-serif)] text-3xl font-normal tracking-[-0.03em] text-[#0B3B2C] sm:text-4xl">
            Questions fréquentes
          </h2>
        </div>
        <div className="divide-y divide-[#DCD9D1] border-y border-[#DCD9D1]">
          {FAQ.map((item, index) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-base font-semibold text-[#203D30] marker:hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B3B2C] sm:text-lg">
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#C8CEC6] text-lg font-normal text-[#315B48] transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-3xl pt-4 pr-10 text-sm leading-7 text-[#5A6660] sm:text-base">
                {item.answer}
              </p>
              <span className="sr-only">Question {index + 1}</span>
            </details>
          ))}
        </div>
      </section>

      <section
        id="tarifs"
        className="scroll-mt-20 bg-[#0B3B2C] text-[#F8F6F1]"
      >
        <div className="mx-auto grid max-w-6xl gap-7 px-5 py-14 sm:px-8 sm:py-18 md:grid-cols-[1fr_auto] md:items-center md:gap-12">
          <div>
            <p className="text-sm font-medium text-[#D3DED4]">
              Pour les propriétaires qui gèrent eux-mêmes
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-serif)] text-3xl font-normal leading-tight tracking-[-0.03em] sm:text-5xl">
              Votre prochain loyer, au bon endroit.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#D3DED4] sm:text-base">
              Starter dès {formatEntryPrice()} · Pro {formatProPrice()} ·
              Inscription sans carte bancaire.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <Link
              href="/register"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#F8F6F1] px-6 text-sm font-semibold text-[#0B3B2C] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Essayer gratuitement
            </Link>
            <Link
              href="/pricing"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#8DAA98] px-6 text-sm font-semibold text-[#F8F6F1] transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Comparer les tarifs
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-14 sm:px-8 sm:pb-20">
        <div className="flex flex-col gap-4 border-t border-[#DCD9D1] pt-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-serif)] text-2xl font-normal text-[#0B3B2C]">
              La gestion locative varie aussi selon la ville.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5A6660]">
              Retrouvez les règles locales et les informations utiles pour votre
              commune dans nos pages dédiées.
            </p>
          </div>
          <Link
            href="/villes"
            className="shrink-0 text-sm font-semibold text-[#174C39] underline decoration-[#AAB9AC] underline-offset-4 hover:decoration-[#174C39]"
          >
            Voir les villes ↗
          </Link>
        </div>

        <details className="mt-5 rounded-2xl border border-[#DCD9D1] bg-[#FBFAF7] px-5 sm:px-6">
          <summary className="cursor-pointer py-4 text-sm font-semibold text-[#30483A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B3B2C]">
            Parcourir les pages locales ({cities.length} villes)
          </summary>
          <div className="grid gap-x-8 gap-y-7 border-t border-[#E3E0D8] py-6 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(REGIONS).map(([region, regionCities]) => (
              <div key={region}>
                <h3 className="mb-2 text-sm font-semibold text-[#203D30]">
                  {region}
                </h3>
                <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
                  {regionCities
                    .slice()
                    .sort((left, right) => right.population - left.population)
                    .map((city) => (
                      <li key={city.slug}>
                        <Link
                          href={`/gestion-locative/${city.slug}`}
                          className="text-sm text-[#5A6660] underline decoration-transparent underline-offset-2 hover:text-[#174C39] hover:decoration-[#AAB9AC]"
                        >
                          {city.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </details>
      </section>
    </article>
  );
}
