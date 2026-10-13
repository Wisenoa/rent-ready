import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import cities from "@/data/cities.json";
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
    answer: `L'offre Starter commence à ${formatEntryPrice()} et l'offre Pro à ${formatProPrice()}. Les deux proposent un essai gratuit de 14 jours sans carte bancaire. Les détails sont disponibles sur la page des tarifs.`,
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

      <section className="mx-auto grid max-w-6xl items-center gap-9 px-5 pb-14 pt-9 sm:px-8 sm:pb-20 sm:pt-12 lg:min-h-[620px] lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:py-14">
        <div className="max-w-xl">
          <p className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#315B48] sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-[#7FA68E]" aria-hidden="true" />
            Le logiciel de gestion locative des indépendants
          </p>
          <h1 className="max-w-[13ch] font-[family-name:var(--font-serif)] text-[clamp(3rem,6.2vw,5.15rem)] font-normal leading-[0.99] tracking-[-0.045em] text-[#0B3B2C]">
            Le bon suivi, du bail à la quittance.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#4F5D56] sm:text-lg sm:leading-8">
            Lokna rassemble vos logements, vos locataires et vos baux. Vous
            voyez le loyer attendu, ce qui a été versé et le document à remettre
            — sans refaire le point dans un tableur.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/register"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#0B3B2C] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#174C39] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3B2C]"
            >
              Essayer Lokna <span aria-hidden="true">↗</span>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#B9C2B9] px-6 text-sm font-semibold text-[#173F30] transition-colors hover:border-[#0B3B2C] hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3B2C]"
            >
              Voir les tarifs
            </Link>
          </div>
          <p className="mt-4 text-sm text-[#647069]">
            14 jours d&apos;essai · Sans carte bancaire · Dès {formatEntryPrice()}
          </p>
        </div>

        <figure className="relative mx-auto w-full max-w-[650px] lg:ml-auto">
          <div className="relative aspect-[1.12/1] overflow-hidden rounded-[2rem] rounded-bl-[5rem] bg-[#DED9CF] sm:aspect-[1.28/1]">
            <Image
              src="/images/gestion-locative/hero.webp"
              alt="Salon lumineux d'un appartement français, avec des clés posées sur une console en bois."
              fill
              priority
              sizes="(max-width: 768px) 100vw, 52vw"
              className="object-cover object-[70%_center] sm:object-center"
            />
          </div>
          <figcaption className="mt-3 flex items-center justify-between gap-4 px-1 text-xs text-[#66716B] sm:text-sm">
            <span>Un logement bien suivi commence par une vue claire.</span>
            <span className="hidden shrink-0 font-medium text-[#315B48] sm:inline">
              Lokna · France
            </span>
          </figcaption>
        </figure>
      </section>

      <section
        id="cycle-mensuel"
        className="scroll-mt-20 border-y border-[#E3E0D8] bg-[#FBFAF7]"
      >
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr] md:items-end md:gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#52725E]">
                Une seule continuité
              </p>
              <h2 className="mt-3 max-w-lg font-[family-name:var(--font-serif)] text-3xl font-normal leading-tight tracking-[-0.03em] text-[#0B3B2C] sm:text-4xl">
                Tout part du logement. Tout reste relié.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#5A6660] sm:text-base">
              Le bail définit ce qui est attendu. Chaque paiement met à jour la
              situation du mois. Vous gardez le fil, de l&apos;arrivée du
              locataire au document correspondant.
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

      <section id="fonctionnalites" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-5 pb-14 pt-16 sm:px-8 sm:pb-20 sm:pt-24">
          <div className="mb-10 max-w-2xl sm:mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#52725E]">
              Une gestion utile au quotidien
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-serif)] text-3xl font-normal leading-tight tracking-[-0.03em] text-[#0B3B2C] sm:text-5xl">
              Les chiffres restent justes. Les prochaines étapes restent visibles.
            </h2>
          </div>

          <div className="grid items-center gap-9 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            <figure className="relative aspect-[4/4.3] overflow-hidden rounded-[1.75rem] rounded-tr-[5rem] bg-[#D9D1C2] sm:aspect-[4/3.5] lg:aspect-[0.95/1]">
              <Image
                src="/images/gestion-locative/keys-and-documents.webp"
                alt="Clés et dossier vierge posés sur un bureau en bois baigné de soleil."
                fill
                sizes="(max-width: 768px) 100vw, 48vw"
                className="object-cover"
              />
            </figure>
            <div className="max-w-xl lg:py-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#52725E]">
                01 / Le suivi des loyers
              </p>
              <h3 className="mt-4 font-[family-name:var(--font-serif)] text-3xl font-normal leading-tight tracking-[-0.03em] text-[#0B3B2C] sm:text-4xl">
                Dû, reçu, restant : trois montants qui ne se confondent pas.
              </h3>
              <p className="mt-5 text-base leading-7 text-[#5A6660]">
                À partir du bail, Lokna suit l&apos;échéance attendue et les
                paiements enregistrés. Un mois réglé, un versement incomplet ou
                un retard ne racontent pas la même chose : leur état et le solde
                à régler restent distincts.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-[#30483A]">
                <li className="flex gap-3">
                  <span aria-hidden="true" className="text-[#63836D]">↳</span>
                  Loyer et charges prévus par le bail
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="text-[#63836D]">↳</span>
                  Paiements reçus, y compris les versements partiels
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="text-[#63836D]">↳</span>
                  Retards à relancer depuis le suivi
                </li>
              </ul>
            </div>
          </div>

          <div className="my-16 border-y border-[#DCD9D1] py-8 sm:my-20 sm:py-10">
            <p className="font-[family-name:var(--font-serif)] text-2xl leading-snug text-[#0B3B2C] sm:text-3xl">
              Un paiement complet ouvre la voie à la quittance. Un paiement
              partiel garde son reçu et son solde dû.
            </p>
            <p className="mt-3 text-sm text-[#647069]">
              Une distinction utile pour le bailleur comme pour le locataire.
            </p>
          </div>

          <div className="grid items-center gap-9 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div className="order-2 max-w-xl lg:order-1 lg:py-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#52725E]">
                02 / Documents et échéances
              </p>
              <h3 className="mt-4 font-[family-name:var(--font-serif)] text-3xl font-normal leading-tight tracking-[-0.03em] text-[#0B3B2C] sm:text-4xl">
                Le bon document, au bon moment.
              </h3>
              <p className="mt-5 text-base leading-7 text-[#5A6660]">
                Pour un loyer réglé en totalité, générez la quittance avec les
                mentions prévues par la loi. Pour un versement partiel, Lokna
                distingue le reçu d&apos;acompte et laisse apparaître le solde
                restant dû. Les quittances disponibles se retrouvent aussi dans
                l&apos;espace dédié du locataire.
              </p>
              <p className="mt-5 border-l-2 border-[#7FA68E] pl-4 text-sm leading-6 text-[#385141]">
                Vous gardez la main : la quittance est générée à votre demande,
                après enregistrement du paiement complet.
              </p>
              <Link
                href="/quittances"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#174C39] underline decoration-[#AAB9AC] underline-offset-4 hover:decoration-[#174C39] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B3B2C]"
              >
                Comprendre les quittances <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <figure className="relative order-1 aspect-[4/4.3] overflow-hidden rounded-[1.75rem] rounded-bl-[5rem] bg-[#D9D1C2] sm:aspect-[4/3.5] lg:order-2 lg:aspect-[0.95/1]">
              <Image
                src="/images/gestion-locative/courtyard-entry.webp"
                alt="Porte ouverte sur une cour intérieure lumineuse d'un immeuble français."
                fill
                sizes="(max-width: 768px) 100vw, 48vw"
                className="object-cover object-center"
              />
            </figure>
          </div>

          <div className="mt-14 grid gap-8 border-t border-[#DCD9D1] pt-8 sm:mt-20 sm:grid-cols-3 sm:gap-10 sm:pt-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#52725E]">
                Révision IRL
              </p>
              <p className="mt-2 text-sm leading-6 text-[#526058]">
                Recevez une notification 30 jours avant la date anniversaire
                du bail. Le calcul s&apos;appuie sur l&apos;indice officiel de
                l&apos;INSEE ; vous validez son application.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#52725E]">
                Relance des retards
              </p>
              <p className="mt-2 text-sm leading-6 text-[#526058]">
                Préparez et envoyez une relance depuis le suivi lorsque le
                paiement tarde. Le ton reste votre choix.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#52725E]">
                Outils ponctuels
              </p>
              <p className="mt-2 text-sm leading-6 text-[#526058]">
                Un calcul ou un document à préparer ? Les outils gratuits de
                Lokna restent accessibles sans ouvrir votre espace.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="simulateurs"
        className="scroll-mt-20 border-y border-[#E3E0D8] bg-[#FBFAF7]"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-10 sm:px-8 sm:py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#52725E]">
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

      <section
        id="tarifs"
        className="scroll-mt-20 bg-[#0B3B2C] text-[#F8F6F1]"
      >
        <div className="mx-auto grid max-w-6xl gap-7 px-5 py-14 sm:px-8 sm:py-18 md:grid-cols-[1fr_auto] md:items-center md:gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#B6C8B8]">
              Pour les propriétaires qui gèrent eux-mêmes
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-serif)] text-3xl font-normal leading-tight tracking-[-0.03em] sm:text-5xl">
              Reprenez le fil de votre prochaine échéance.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#D3DED4] sm:text-base">
              Starter dès {formatEntryPrice()} · Pro {formatProPrice()} · Essai
              de 14 jours, sans carte bancaire.
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

      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mb-7 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#52725E]">
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
