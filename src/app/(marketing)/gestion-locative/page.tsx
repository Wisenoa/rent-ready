import type { Metadata } from "next";
import Link from "next/link";
import cities from "@/data/cities.json";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { SchemaMarkup, paidOffer } from "@/components/seo/schema-markup";
import { MonthLedger } from "@/components/marketing/gestion-locative/month-ledger";
import { ReceiptSheets } from "@/components/marketing/gestion-locative/receipt-sheets";
import { GESTION_FAQ_ITEMS } from "@/components/marketing/gestion-locative/faq-data";
import { baseMetadata } from "@/lib/seo/metadata";
import {
  FEATURE_LIST,
  PLANS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  formatEntryPrice,
} from "@/data/entity";

export const revalidate = 3600;

/**
 * The canonical page for « logiciel de gestion locative ».
 *
 * Built around one artefact a landlord recognises: the month. The hero shows a
 * month of three rentals as Lokna keeps it (two paid, one partly paid), then the
 * page answers, in order, what a landlord asks next: what do I enter (and why
 * not my spreadsheet), what documents come out, what else does it do, what does
 * it cost. Free tools and city pages close the page as an index.
 *
 * Every product statement here was checked against the code; the example month
 * is computed by the settlement rule the product uses (`example-month.ts`).
 */

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata({
    // The root layout appends " | Lokna"; naming the brand here doubled it.
    title: "Logiciel de gestion locative pour propriétaires bailleurs",
    description: `Loyers, locataires et baux suivis sans tableur : reste dû calculé, quittance après paiement complet, reçu si paiement partiel, révision IRL. Dès ${formatEntryPrice()}.`,
    url: "/gestion-locative",
    ogType: "feature",
  });
}

const GESTION_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
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
    {
      "@type": "FAQPage",
      mainEntity: GESTION_FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
};

const SETUP_STEPS = [
  {
    title: "Le logement",
    text: "Adresse, type de location, surface. Un logement ou dix, la fiche est la même.",
  },
  {
    title: "Le locataire",
    text: "Identité et coordonnées, pour les documents et les relances.",
  },
  {
    title: "Le bail",
    text: "Loyer, charges, dépôt de garantie, date de début. Le bail fixe ce qui est dû chaque mois.",
  },
];

const MONTHLY_STEPS = [
  {
    title: "Le loyer attendu",
    text: "L'échéance du mois est créée à partir du bail, loyer et charges séparés.",
  },
  {
    title: "Le paiement",
    text: "Vous enregistrez ce qui est arrivé, en une ou plusieurs fois. Le reste dû est recalculé.",
  },
  {
    title: "Le document",
    text: "La quittance si le mois est soldé, un reçu de paiement partiel s'il ne l'est pas.",
  },
];

const ALSO = [
  {
    term: "Relancer",
    text: "Quand un loyer manque, envoyez depuis le suivi un rappel, une relance formelle ou une mise en demeure par e-mail. Lokna vous dit si l'envoi est bien parti.",
    link: { href: "/outils/lettre-relance-loyer", label: "Modèle de lettre de relance" },
  },
  {
    term: "Réviser le loyer",
    text: "À la date anniversaire du bail, Lokna calcule le nouveau loyer avec l'indice de référence des loyers publié par l'INSEE. Vous vérifiez, puis vous validez.",
    link: { href: "/outils/calculateur-irl", label: "Calculateur de révision IRL" },
  },
  {
    term: "Partager",
    text: "Chaque locataire peut être invité dans son espace en ligne : il y retrouve ses quittances et peut vous signaler un problème dans le logement.",
  },
  {
    term: "Retrouver",
    text: "Logement, locataire, bail et documents restent rattachés. Pas de dossier à reconstituer quand on vous demande une pièce.",
  },
];

const FREE_TOOLS = [
  { href: "/outils/calculateur-irl", label: "Calculer une révision de loyer (IRL)" },
  { href: "/outils/generateur-quittance", label: "Générer une quittance de loyer" },
  { href: "/outils/calculateur-depot-garantie", label: "Plafond du dépôt de garantie" },
  { href: "/outils/calculateur-charges-locatives", label: "Régularisation des charges" },
  { href: "/outils/lettre-relance-loyer", label: "Lettre de relance pour loyer impayé" },
];

type City = (typeof cities)[number];

function groupByRegion(data: City[]): [string, City[]][] {
  const groups: Record<string, City[]> = {};
  for (const city of data) {
    (groups[city.region] ??= []).push(city);
  }
  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b, "fr"))
    .map(([region, list]) => [
      region,
      list.slice().sort((a, b) => b.population - a.population),
    ]);
}

const REGIONS = groupByRegion(cities);

const PRICED_PLANS = PLANS.flatMap((plan) =>
  plan.monthlyPrice !== null && plan.properties !== null
    ? [{ ...plan, monthlyPrice: plan.monthlyPrice, properties: plan.properties }]
    : []
);

const container = "mx-auto max-w-6xl px-5 sm:px-8";
const h2 =
  "text-[1.85rem] font-semibold leading-[1.1] tracking-[-0.025em] text-[#15241F] sm:text-[2.4rem]";
const lead = "text-base leading-7 text-[#4F5D56] sm:text-[17px] sm:leading-8";
const primaryButton =
  "inline-flex min-h-12 items-center justify-center rounded-md bg-[#0B3B2C] px-6 text-[15px] font-medium text-[#F8F6F1] transition-colors hover:bg-[#174C39] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3B2C]";
const textLink =
  "font-medium text-[#0B3B2C] underline decoration-[#9DB3A3] underline-offset-[5px] transition-colors hover:decoration-[#0B3B2C] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B3B2C]";

export default function GestionLocativePage() {
  return (
    <article className="bg-[#F5F3EF] text-[#15241F]">
      <SchemaMarkup data={GESTION_SCHEMA} breadcrumbRenderedByComponent />

      {/* What it is, and the month it keeps. */}
      <section className={`${container} pb-20 pt-5 sm:pb-28`}>
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

        <div className="mt-10 grid gap-8 sm:mt-14 lg:grid-cols-12 lg:items-end lg:gap-10">
          <h1 className="text-[2.55rem] font-semibold leading-[1.02] tracking-[-0.04em] text-[#0B3B2C] sm:text-[3.6rem] lg:col-span-7 lg:text-[4.25rem]">
            <span className="lg:block">La gestion locative,</span>{" "}
            <span className="lg:block">mois par mois,</span>{" "}
            <span className="lg:block">sans tableur.</span>
          </h1>

          <div className="lg:col-span-5 lg:pb-1.5">
            <p className={lead}>
              {SITE_NAME} est un logiciel de gestion locative pour les
              propriétaires qui louent eux-mêmes un à dix logements. Chaque
              mois, il sait ce qui est attendu, ce qui a été payé et ce qui
              manque, et prépare la quittance quand le loyer est réglé.
            </p>
            <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7">
              <Link href="/register" className={primaryButton}>
                Commencer l&apos;essai gratuit
              </Link>
              <Link href="#tarifs" className={`${textLink} self-start text-[15px] sm:self-auto`}>
                Voir les tarifs
              </Link>
            </div>
            <p className="mt-4 text-[13px] text-[#5C6560]">
              14 jours d&apos;essai, sans carte bancaire. Ensuite dès{" "}
              <span className="whitespace-nowrap">{formatEntryPrice()}</span>.
            </p>
          </div>
        </div>

        <MonthLedger />
      </section>

      {/* What the landlord enters, and what Lokna derives. */}
      <section id="cycle-mensuel" className="scroll-mt-20 border-t border-[#D9D5CC]">
        <div className={`${container} py-20 sm:py-28`}>
          <div className="grid gap-5 lg:grid-cols-12 lg:gap-10">
            <h2 className={`${h2} lg:col-span-6`}>
              Vous décrivez la location une fois. {SITE_NAME} tient le mois.
            </h2>
            <p className={`${lead} lg:col-span-5 lg:col-start-8 lg:pt-2`}>
              Dans un tableur, chaque mois se recopie et chaque paiement partiel
              se recalcule à la main. Ici, le bail dit ce qui est dû et quand&nbsp;:
              chaque paiement enregistré met le mois à jour, et le bon document
              suit.
            </p>
          </div>

          <div className="mt-12 border-t-2 border-[#15241F] sm:mt-16">
            {[
              { label: "Une fois", detail: "à l'arrivée du locataire", steps: SETUP_STEPS, start: 1 },
              { label: "Chaque mois", detail: "sans rien ressaisir", steps: MONTHLY_STEPS, start: 4 },
            ].map((group) => (
              <div
                key={group.label}
                className="grid gap-6 border-b border-[#D9D5CC] py-8 sm:py-10 lg:grid-cols-12 lg:gap-10"
              >
                <p className="lg:col-span-3">
                  <span className="block text-lg font-semibold text-[#0B3B2C]">
                    {group.label}
                  </span>
                  <span className="text-sm text-[#5C6560]">{group.detail}</span>
                </p>
                <ol
                  start={group.start}
                  className="grid gap-7 sm:grid-cols-3 sm:gap-8 lg:col-span-9"
                >
                  {group.steps.map((step, i) => (
                    <li key={step.title}>
                      <span className="text-[13px] font-medium tabular-nums text-[#5C6560]">
                        {String(group.start + i).padStart(2, "0")}
                      </span>
                      <h3 className="mt-1 text-[17px] font-semibold text-[#15241F]">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-[15px] leading-6 text-[#4F5D56]">
                        {step.text}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The legal distinction, shown with the documents themselves. */}
      <section className="bg-[#E6ECE4]">
        <div className={`${container} grid gap-12 py-20 sm:py-28 lg:grid-cols-12 lg:gap-10`}>
          <div className="lg:col-span-4">
            <h2 className={h2}>Quittance ou reçu&nbsp;: le document suit le paiement.</h2>
            <p className={`${lead} mt-6`}>
              Quand le mois est soldé, {SITE_NAME} génère la quittance, loyer et
              charges détaillés. S&apos;il ne l&apos;est qu&apos;en partie, il
              émet un reçu qui indique le solde restant dû.
            </p>
            <p className={`${lead} mt-4`}>
              Une quittance atteste que tout a été payé&nbsp;; la loi du 6
              juillet 1989 la réserve au paiement intégral.
            </p>
            <p className="mt-7 text-[15px]">
              <Link href="/quittances" className={textLink}>
                Tout savoir sur la quittance de loyer
              </Link>
            </p>
          </div>
          <figure className="lg:col-span-8 lg:pl-6">
            <ReceiptSheets />
            <figcaption className="mt-5 text-[13px] text-[#4F5D56]">
              Documents abrégés, établis pour les deux locataires d&apos;octobre
              ci-dessus. Données fictives.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Beyond the monthly loop. */}
      <section id="fonctionnalites" className="scroll-mt-20">
        <div className={`${container} py-20 sm:py-28`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className={`${h2} max-w-[20ch]`}>Et le reste de la gestion, au même endroit.</h2>
            <Link href="/features" className={`${textLink} shrink-0 self-start text-[15px] sm:self-auto`}>
              Toutes les fonctionnalités
            </Link>
          </div>
          <dl className="mt-12 grid gap-x-12 sm:mt-14 md:grid-cols-2">
            {ALSO.map((item) => (
              <div key={item.term} className="border-t border-[#15241F] pb-10 pt-5">
                <dt className="text-[19px] font-semibold text-[#15241F]">{item.term}</dt>
                <dd className="mt-2 max-w-[48ch] text-[15px] leading-7 text-[#4F5D56]">
                  {item.text}
                  {item.link ? (
                    <Link href={item.link.href} className={`${textLink} mt-3 block w-fit text-[14px]`}>
                      {item.link.label}
                    </Link>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Questions. */}
      <section className="border-t border-[#D9D5CC]">
        <div className={`${container} grid gap-10 py-20 sm:py-28 lg:grid-cols-12`}>
          <h2 className={`${h2} lg:col-span-4`}>Questions fréquentes</h2>
          <div className="border-t-2 border-[#15241F] lg:col-span-8">
            {GESTION_FAQ_ITEMS.map((item) => (
              <details key={item.question} className="group border-b border-[#D9D5CC]">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 text-[16px] font-semibold text-[#15241F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3B2C] sm:text-[17px] [&::-webkit-details-marker]:hidden">
                  <h3>{item.question}</h3>
                  <span
                    aria-hidden="true"
                    className="relative size-3 shrink-0 before:absolute before:left-0 before:top-1/2 before:h-px before:w-3 before:bg-[#0B3B2C] after:absolute after:left-1/2 after:top-0 after:h-3 after:w-px after:bg-[#0B3B2C] after:transition-transform group-open:after:scale-y-0 motion-reduce:after:transition-none"
                  />
                </summary>
                <p className="max-w-[62ch] pb-6 text-[15px] leading-7 text-[#4F5D56]">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Price and start. */}
      <section id="tarifs" className="scroll-mt-16 bg-[#0B3B2C] text-[#F8F6F1]">
        <div className={`${container} grid gap-12 py-20 sm:py-24 lg:grid-cols-12 lg:gap-10`}>
          <div className="lg:col-span-5">
            <h2 className="text-[1.85rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[2.4rem]">
              Commencez par un logement.
            </h2>
            <p className="mt-5 max-w-[46ch] text-base leading-7 text-[#C9D6CD] sm:text-[17px] sm:leading-8">
              Ajoutez son locataire et son bail&nbsp;: le suivi des loyers se met
              en place. Le prix dépend ensuite du nombre de logements que vous
              gérez.
            </p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ul className="border-t border-[#F8F6F1]/70">
              {PRICED_PLANS.map((plan) => (
                <li
                  key={plan.id}
                  className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 border-b border-[#F8F6F1]/20 py-5"
                >
                  <h3 className="text-[19px] font-semibold">{plan.name}</h3>
                  <p className="text-right text-[19px] font-semibold tabular-nums">
                    {plan.monthlyPrice}&nbsp;€
                    <span className="text-[14px] font-normal text-[#A9BDB0]">/mois</span>
                  </p>
                  <p className="text-[14px] text-[#C9D6CD]">
                    Jusqu&apos;à {plan.properties} logements
                  </p>
                  {plan.annualPrice !== null ? (
                    <p className="text-right text-[13px] tabular-nums text-[#A9BDB0]">
                      ou {plan.annualPrice}&nbsp;€/an
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7">
              <Link
                href="/register"
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#F8F6F1] px-6 text-[15px] font-medium text-[#0B3B2C] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F8F6F1]"
              >
                Commencer l&apos;essai gratuit
              </Link>
              <Link
                href="/pricing"
                className="self-start text-[15px] font-medium text-[#F8F6F1] underline decoration-[#7FA68E] underline-offset-[5px] hover:decoration-[#F8F6F1] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F8F6F1] sm:self-auto"
              >
                Comparer les formules
              </Link>
            </div>
            <p className="mt-4 text-[13px] text-[#A9BDB0]">
              14 jours d&apos;essai sur chaque formule, sans carte bancaire.
            </p>
          </div>
        </div>
      </section>

      {/* Index: free tools and local pages. */}
      <section id="simulateurs" className="scroll-mt-20">
        <div className={`${container} grid gap-14 py-20 sm:py-24 lg:grid-cols-12 lg:gap-10`}>
          <div className="lg:col-span-4">
            <h2 className="text-[1.35rem] font-semibold tracking-[-0.015em] text-[#15241F]">
              Outils gratuits, sans compte
            </h2>
            <ul className="mt-5 border-t border-[#15241F]">
              {FREE_TOOLS.map((tool) => (
                <li key={tool.href} className="border-b border-[#D9D5CC]">
                  <Link
                    href={tool.href}
                    className="flex min-h-12 items-center justify-between gap-4 py-3 text-[15px] text-[#15241F] transition-colors hover:text-[#0B3B2C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3B2C]"
                  >
                    {tool.label}
                    <span aria-hidden="true" className="text-[#5C6560]">→</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[15px]">
              <Link href="/outils" className={textLink}>
                Tous les outils
              </Link>
            </p>
          </div>

          <div className="lg:col-span-8">
            <h2 className="text-[1.35rem] font-semibold tracking-[-0.015em] text-[#15241F]">
              {SITE_NAME} dans {cities.length} villes françaises
            </h2>
            <p className="mt-2 max-w-[60ch] text-[15px] leading-7 text-[#4F5D56]">
              Le logiciel est le même partout, mais la réglementation locative
              change d&apos;une commune à l&apos;autre&nbsp;: encadrement des loyers,
              zone tendue, arrêté préfectoral.
            </p>
            <div className="mt-5 columns-2 gap-8 border-t border-[#15241F] pt-5 sm:columns-3">
              {REGIONS.map(([region, regionCities]) => (
                <div key={region} className="mb-5 break-inside-avoid">
                  <h3 className="text-[13px] font-semibold text-[#15241F]">{region}</h3>
                  <ul className="mt-1">
                    {regionCities.map((city) => (
                      <li key={city.slug}>
                        <Link
                          href={`/gestion-locative/${city.slug}`}
                          className="inline-block py-[3px] text-[14px] text-[#4F5D56] underline decoration-transparent underline-offset-4 transition-colors hover:text-[#0B3B2C] hover:decoration-[#9DB3A3]"
                        >
                          {city.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[15px]">
              <Link href="/villes" className={textLink}>
                Voir toutes les villes et leur réglementation
              </Link>
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
