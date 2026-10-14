import type { Metadata } from "next";

import Decimal from "decimal.js";
import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";
import { baseMetadata } from "@/lib/seo/metadata";
import {
  IRL_INDICES,
  IRL_SOURCE_URL,
  calculateRentRevision,
  findIrlIndex,
  formatQuarterLabel,
  getLatestIrl,
  type IrlIndexEntry,
} from "@/lib/irl-calculator";

// Rendered on demand. SEO/marketing content, not product surface: prerendering the
// ~135-page content suite exhausted the Node heap during `next build`
// ("Ineffective mark-compacts near heap limit"). All data is local, so rendering
// per request costs ~ms and every URL keeps working.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata({
    title:
      "IRL 2026 — Indice de Référence des Loyers & Révision de Loyer",
    description:
      "Indice de Référence des Loyers (IRL) 2026 : dernière valeur officielle INSEE, comment calculer la révision de loyer annuelle, délai et méthode correcte.",
    url: "/guides/irl-2026",
    ogType: "website",
  });
}

// Every index shown on this page comes from IRL_INDICES, the table the
// calculator and the product use. Adding the next INSEE publication there
// updates this guide; nothing here may be typed by hand.
const formatIndex = (value: number) => value.toFixed(2).replace(".", ",");
const shortQuarter = (entry: IrlIndexEntry) => `T${entry.trimester} ${entry.year}`;

function yearOnYear(entry: IrlIndexEntry): string | null {
  const previous = findIrlIndex(`T${entry.trimester}-${entry.year - 1}`);
  if (!previous) return null;
  const change = new Decimal(entry.value).div(previous.value).minus(1).times(100).toDecimalPlaces(2);
  return `${change.isNegative() ? "−" : "+"}${change.abs().toFixed(2).replace(".", ",")} %`;
}

const latest = getLatestIrl();
const latestChange = yearOnYear(latest);
const latestPublished = new Intl.DateTimeFormat("fr-FR", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
}).format(new Date(`${latest.publicationDate}T00:00:00Z`));
const recentIndices = IRL_INDICES.slice(-4).reverse();

// Worked example on the latest year-on-year pair, computed by the same function
// as the calculator.
// irl-published-data.test.ts guarantees the year-ago index of the latest one exists.
const exampleReference = findIrlIndex(`T${latest.trimester}-${latest.year - 1}`)!;
const example = calculateRentRevision({
  currentRent: "800.00",
  referenceIrlQuarter: exampleReference.quarter,
  newIrlQuarter: latest.quarter,
});
const exampleFormula = `800 × (${formatIndex(latest.value)} / ${formatIndex(exampleReference.value)}) = ${example.newRent.toFixed(2).replace(".", ",")} €`;

const latestAnswer = `Le dernier IRL publié par l'INSEE est de ${formatIndex(latest.value)} au titre du ${formatQuarterLabel(latest.quarter)} (Journal officiel de ${latestPublished})${latestChange ? `, soit ${latestChange} sur un an` : ""}. Il n'existe pas un IRL unique pour l'année : la révision compare l'indice du trimestre de référence prévu au bail (à défaut, celui du dernier indice publié à la signature) à celui du même trimestre un an plus tôt.`;

const faqs = [
  { q: "Quelle est la valeur de l'IRL en 2026 ?", a: latestAnswer },
  {
    q: "Comment calculer une révision de loyer avec l'IRL ?",
    a: `La formule est : Nouveau loyer = Loyer actuel × (IRL nouveau / IRL ancien). Par exemple : ${exampleFormula}. La hausse ne peut pas dépasser la variation de l'IRL.`,
  },
  {
    q: "Peut-on réviser le loyer rétroactivement ?",
    a: "Non. Le bailleur a un an à compter de la date de révision prévue au bail pour la demander ; le nouveau loyer s'applique à partir de la date de la demande, sans rattrapage des mois passés. Passé ce délai d'un an, la révision de l'année est perdue (article 17-1 de la loi du 6 juillet 1989).",
  },
  {
    q: "Que faire si l'IRL a baissé ?",
    a: "Si l'IRL du trimestre de référence a baissé sur un an, l'application de la formule fait baisser le loyer dans la même proportion.",
  },
  {
    q: "L'encadrement des loyers limite-t-il la révision IRL ?",
    a: "Pas directement. Dans les communes soumises à l'encadrement (Paris, Lille, Lyon, Montpellier, etc.), le loyer de base inscrit au bail ne peut pas dépasser le loyer de référence majoré en vigueur à la date de signature du bail. La révision annuelle, elle, n'est pas plafonnée par ce majoré : elle est limitée à la variation de l'IRL (art. 17-1 I loi 89-462).",
  },
  {
    q: "Comment informer le locataire de la révision ?",
    a: "La loi n'impose pas de forme : le bailleur adresse sa demande de révision au locataire, et le nouveau loyer s'applique à partir de cette demande, sans effet rétroactif (article 17-1 de la loi du 6 juillet 1989). L'ANIL conseille une lettre recommandée avec avis de réception, qui prouve la date de la demande. Joindre le détail du calcul (ancien loyer, indices, nouveau loyer) évite les contestations.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Comment réviser un loyer avec l'IRL 2026",
  description:
    "Guide complet pour calculer et appliquer la révision de loyer annuelle avec l'Indice de Référence des Loyers 2026.",
  step: [
    {
      "@type": "HowToStep",
      name: "Comprendre l'IRL et son rôle",
      text: "L'Indice de Référence des Loyers (IRL) est un indice publié par l'INSEE chaque trimestre. Il sert de base pour la révision des loyers des baux d'habitation principale en France.",
    },
    {
      "@type": "HowToStep",
      name: "Appliquer la formule de révision",
      text: `Multipliez le loyer actuel par le rapport entre le nouvel IRL et l'ancien IRL : Nouveau loyer = Loyer actuel × (IRL nouveau / IRL ancien). Par exemple : ${exampleFormula}.`,
    },
    {
      "@type": "HowToStep",
      name: "Respecter le délai de révision annuelle",
      text: "La révision intervient une fois par an, à la date prévue au bail ou, à défaut, à sa date anniversaire. Le bailleur a un an pour la demander ; elle s'applique à partir de la demande, sans effet rétroactif. Une lettre recommandée avec avis de réception, conseillée, prouve la date de la demande.",
    },
    {
      "@type": "HowToStep",
      name: "Baisser le loyer si l'IRL diminue",
      text: "Si l'IRL du trimestre de référence a baissé sur un an, l'application de la formule fait baisser le loyer dans la même proportion.",
    },
    {
      "@type": "HowToStep",
      name: "Consulter les valeurs officielles de l'IRL",
      text: `Les valeurs de l'IRL sont publiées chaque trimestre par l'INSEE sur www.insee.fr. Dernier indice publié : ${shortQuarter(latest)} = ${formatIndex(latest.value)}${latestChange ? ` (${latestChange} sur un an)` : ""}.`,
    },
    {
      "@type": "HowToStep",
      name: "Respecter l'encadrement des loyers en zone tendue",
      text: "Dans les communes dotées d'un arrêté préfectoral (Paris, Lyon, Lille, Bordeaux, Montpellier, Grenoble, Nice, Marseille, Nantes, Strasbourg, Toulouse, Rennes), le loyer inscrit au bail ne peut pas dépasser le loyer de référence majoré (référence +20 %) en vigueur à la signature. Ce plafond régit le niveau du loyer, pas la révision annuelle, qui reste limitée à la variation de l'IRL. Cas particulier : dans un logement classé F ou G au DPE, la révision et la majoration sont interdites (art. 17-1 III, loi Climat et Résilience) et, en cas de relocation, le loyer ne peut pas excéder celui du précédent locataire.",
    },
  ],
};


// Rendered on demand. SEO/marketing content, not product surface: prerendering the
// ~135-page content suite exhausted the Node heap during `next build`
// ("Ineffective mark-compacts near heap limit"). All data is local, so rendering
// per request costs ~ms and every URL keeps working.

export default function IRL2026GuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <header className="mb-12">
        <nav className="mb-6 text-sm text-stone-600">
          <Link href="/" className="hover:text-stone-700">Accueil</Link>
          <span className="mx-2">›</span>
          <Link href="/guides" className="hover:text-stone-700">Guides pratiques</Link>
          <span className="mx-2">›</span>
          <span>Révision IRL 2026</span>
        </nav>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sage-100 px-3 py-1 text-xs font-medium text-forest">
          Mis à jour octobre 2026
        </div>
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl text-balance">
          Indice de Référence des Loyers (IRL) 2026
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-600">
          L&apos;IRL est utilisé pour réviser le loyer d&apos;un bail en cours. Voici le
          dernier indice publié par l&apos;INSEE, la méthode de calcul et les pièges à
          éviter.
        </p>
      </header>

      {/* IRL Value Highlight */}
      <div className="mb-12 rounded-2xl border border-sage-200/60 bg-gradient-to-br from-sage-50 to-white p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wide text-forest">
              Dernier IRL publié ({shortQuarter(latest)})
            </h2>
            <p className="mt-2 text-4xl font-bold text-ink">{formatIndex(latest.value)}</p>
            <p className="mt-1 text-sm text-stone-600">
              Source :{' '}
              <a href={IRL_SOURCE_URL} className="underline underline-offset-2 hover:text-forest">
                INSEE, série 001515333
              </a>{' '}
              — Journal officiel de {latestPublished}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <div className="rounded-lg bg-green-50 px-4 py-2 text-center">
              <p className="text-xs text-green-600">Variation annuelle</p>
              <p className="text-lg font-bold text-green-700">{latestChange ?? "—"}</p>
            </div>
            <Link
              href="/templates/augmentation-de-loyer"
              className="inline-flex items-center gap-2 rounded-lg bg-forest px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-hover"
            >
              Calculer la révision
            </Link>
          </div>
        </div>
      </div>

      <div className="prose prose-stone max-w-none">
        <h2>Qu&apos;est-ce que l&apos;IRL ?</h2>
        <p>
          L&apos;Indice de Référence des Loyers (IRL) est un indice publié par l&apos;INSEE chaque
          trimestre. Il sert de base pour la révision des loyers des baux d&apos;habitation
          principale en France. Depuis la loi du 8 février 2008 pour le pouvoir d&apos;achat,
          il correspond à la moyenne, sur les douze derniers mois, de l&apos;indice des prix
          à la consommation hors tabac et hors loyers.
        </p>
        <p>
          L&apos;IRL ne concerne que les baux en cours de location. Pour un nouveau locataire,
          le loyer est libre (sauf en zone tendue avec encadrement des loyers).
        </p>

        <h2>Comment calculer la révision de loyer ?</h2>
        <p>
          La formule est simple :
        </p>
        <div className="not-prose my-4 rounded-lg bg-stone-100 p-4 text-center font-mono text-sm">
          Nouveau loyer = Loyer actuel × (IRL nouveau / IRL ancien)
        </div>
        <p>
          Exemple : un loyer actuel de 800 € avec un IRL passé de{' '}
          {formatIndex(exampleReference.value)} ({shortQuarter(exampleReference)}) et un IRL
          actuel de {formatIndex(latest.value)} ({shortQuarter(latest)}) :
        </p>
        <div className="not-prose my-4 rounded-lg bg-stone-100 p-4 text-center font-mono text-sm">
          {exampleFormula} / mois
        </div>

        <h2>Quand peut-on réviser le loyer ?</h2>
        <p>
          La révision ne peut intervenir qu&apos;<strong>une fois par an</strong>, à la date
          anniversaire du bail (ou à la date indiquée dans le bail si différente). Elle
          n&apos;est jamais rétroactive : si le bailleur oublie de réviser à la date
          anniversaire, il ne peut pas rattraper les mois passés. Il dispose d&apos;un an
          pour la demander ; passé ce délai, la révision de l&apos;année est perdue.
        </p>
        <p>
          La loi n&apos;impose pas de forme pour demander la révision. Une lettre
          recommandée avec avis de réception est toutefois conseillée par
          l&apos;ANIL : elle prouve la date de la demande, à partir de laquelle le
          nouveau loyer s&apos;applique. Joignez-y le détail du calcul effectué.
        </p>

        <h2>Que faire si l&apos;IRL baisse ?</h2>
        <p>
          Si l&apos;IRL du trimestre de référence a baissé sur un an, l&apos;application de
          la formule fait baisser le loyer dans la même proportion.
        </p>

        <h2>Où trouver les valeurs de l&apos;IRL ?</h2>
        <p>
          Les valeurs de l&apos;IRL sont publiées par l&apos;INSEE et accessibles gratuitement sur{' '}
          <Link href="https://www.insee.fr" className="text-forest hover:underline">
            www.insee.fr
          </Link>. Les quatre derniers indices publiés :
        </p>
        <ul>
          {recentIndices.map((entry) => {
            const change = yearOnYear(entry);
            return (
              <li key={entry.quarter}>
                <strong>{shortQuarter(entry)}</strong> : {formatIndex(entry.value)}
                {change ? ` (${change} sur un an)` : ""}
              </li>
            );
          })}
        </ul>

        <h2>Locatifs en zone tendue : l&apos;encadrement des loyers</h2>
        <p>
          Dans les communes soumises à l&apos;encadrement des loyers (Paris, Lille, Lyon,
          Montpellier, etc.), la hausse du loyer lors de la relocation ou de la révision
          est limitée. Le bailleur ne peut pas demander un loyer supérieur au loyer de
référence majoré en vigueur à la date de signature du bail. Cette règle porte sur le niveau du loyer à la signature du bail, et non sur la révision annuelle, qui est plafonnée par la seule variation de l'IRL.
        </p>
      </div>

      {/* FAQ Section */}
      <section className="mt-16 rounded-2xl border border-stone-200/60 bg-white p-8">
        <h2 className="mb-6 text-2xl font-semibold text-ink">Questions fréquentes sur l'IRL 2026</h2>
        <div className="space-y-4">
          {faqs.map((item, i) => (
            <details key={i} className="group rounded-lg border border-stone-200 bg-stone-50 open:bg-white">
              <summary className="flex cursor-pointer items-center justify-between gap-4 p-4 font-medium text-ink hover:text-forest">
                {item.q}
                <span className="shrink-0 text-stone-600 transition-transform group-open:rotate-180">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="border-t border-stone-200 p-4 text-stone-600">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      <div className="mt-12 rounded-xl border border-stone-200/60 bg-stone-50 p-8 text-center">
        <h2 className="mb-3 text-xl font-semibold text-ink">
          Calculez automatiquement vos révisions IRL
        </h2>
        <p className="mx-auto mb-6 max-w-md text-stone-600">
          Lokna calcule la révision de chaque bail à partir des indices publiés par
          l&apos;INSEE.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-forest px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-hover"
          >
            Essai gratuit 14 jours
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/templates/augmentation-de-loyer"
            className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50"
          >
            <Calculator className="size-4" />
            Calculer la révision
          </Link>
        </div>
      </div>
    </article>
    </>
  );
}
