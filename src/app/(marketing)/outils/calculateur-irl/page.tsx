import Link from "next/link";
import Decimal from "decimal.js";
import { Check } from "lucide-react";

import { IrlCalculator } from "./IrlCalculator";
import { baseMetadata } from "@/lib/seo/metadata";
import {
  buildGraphSchema,
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
  buildHowToSchema,
} from "@/lib/seo/structured-data";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { IRL_INDICES, IRL_SOURCE_URL, getLatestIrl, type IrlIndexEntry } from "@/lib/irl-calculator";
import { formatEuros, formatIndex, formatSignedPercent } from "@/lib/tools/amount";
import { findPair, indexVariation, publicationMonth, quarterShortLabel, reviseRent, type Trimester } from "@/lib/tools/irl-revision";
import { ToolHeader } from "@/components/marketing/tools/ToolHeader";
import { ToolCta, ToolExplainer, ToolFaq, type FaqItem } from "@/components/marketing/tools/ToolContent";

// Rendered on demand. SEO/marketing content, not product surface: prerendering the
// ~135-page content suite exhausted the Node heap during `next build`
// ("Ineffective mark-compacts near heap limit"). All data is local, so rendering
// per request costs ~ms and every URL keeps working.
export const revalidate = 3600;

export async function generateMetadata() {
  return baseMetadata({
    title: "Calculateur IRL 2026 — Indice de Référence des Loyers",
    description:
      "Calculez la révision de loyer avec l'IRL 2026. Historique des indices INSEE, formule officielle et simulateur gratuit pour propriétaires et locataires.",
    url: "/outils/calculateur-irl",
    ogType: "outil",
  });
}

const breadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Calculateur IRL", href: "/outils/calculateur-irl" },
];

const SERVICE_PUBLIC_REVISION = "https://www.service-public.gouv.fr/particuliers/vosdroits/F13723";
const LINK = "text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest";

function CalculateurIRLJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://lokna.fr" },
      { name: "Outils", url: "https://lokna.fr/outils" },
      { name: "Calculateur IRL", url: "https://lokna.fr/outils/calculateur-irl" },
    ]),
    buildWebApplicationSchema({
      name: "Calculateur IRL — Indice de Référence des Loyers",
      description:
        "Outil gratuit qui calcule le loyer révisé avec l'Indice de Référence des Loyers publié par l'INSEE, et présente l'historique des indices.",
      url: "/outils/calculateur-irl",
    }),
    buildHowToSchema({
      name: "Comment utiliser le Calculateur IRL",
      description: "Calculez le nouveau loyer d'un bail avec la variation sur un an de l'IRL de son trimestre de référence.",
      url: "/outils/calculateur-irl",
      steps: [
        { name: "Saisissez le loyer actuel", text: "Indiquez le loyer mensuel hors charges payé aujourd'hui." },
        {
          name: "Choisissez le trimestre de référence",
          text: "Sélectionnez le trimestre inscrit dans la clause de révision du bail (T1, T2, T3 ou T4).",
        },
        {
          name: "Vérifiez l'indice appliqué",
          text: "Le dernier indice publié pour ce trimestre est comparé à celui du même trimestre un an plus tôt.",
        },
        {
          name: "Lisez le nouveau loyer",
          text: "Le calculateur affiche le nouveau loyer, la différence par mois et sur douze mois, et la formule détaillée.",
        },
      ],
    })
  );
  return <SchemaMarkup data={schema} breadcrumbRenderedByComponent />;
}

// service-public.gouv.fr F13723 (vérifié par Service-Public le 12/07/2026) and
// loi n° 89-462 art. 17-1, checked 14/10/2026.
const CONDITIONS = [
  "Le bail contient une clause de révision annuelle du loyer.",
  "La révision s'applique à la date prévue au bail ou, à défaut, à sa date anniversaire.",
  "Vous avez un an pour la demander. Elle s'applique à partir de votre demande, sans effet rétroactif ; passé ce délai, la révision de l'année est perdue.",
  "Logement classé F ou G au DPE : la révision est interdite pour un bail signé, renouvelé ou reconduit depuis le 24 août 2022 (1er juillet 2024 en outre-mer).",
  "La hausse ne peut pas dépasser la variation de l'IRL, y compris dans les communes où les loyers sont encadrés.",
];

function IndexTable({ entries, latest, caption }: { entries: IrlIndexEntry[]; latest: IrlIndexEntry; caption: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white">
      <table className="w-full text-[14px]">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-paper text-left text-[12.5px] text-ink-muted">
          <tr>
            <th scope="col" className="px-4 py-2.5 font-medium">Trimestre</th>
            <th scope="col" className="px-4 py-2.5 text-right font-medium">Indice</th>
            <th scope="col" className="px-4 py-2.5 text-right font-medium">Sur un an</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line-soft">
          {entries.map((entry) => {
            const pair = findPair(entry.trimester as Trimester, entry.year);
            return (
              <tr key={entry.quarter} className={entry.quarter === latest.quarter ? "bg-sage-50/70" : undefined}>
                <th scope="row" className="px-4 py-2.5 text-left font-medium text-ink">
                  {quarterShortLabel(entry)}
                </th>
                <td className="px-4 py-2.5 text-right tabular-nums text-ink">{formatIndex(entry.value)}</td>
                <td className="px-4 py-2.5 text-right tabular-nums text-ink-muted">
                  {pair ? formatSignedPercent(indexVariation(pair)) : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function CalculateurIRLPage() {
  const latest = getLatestIrl();
  const latestPair = findPair(latest.trimester as Trimester, latest.year)!;
  const example = reviseRent(new Decimal(800), latestPair);
  const history = [...IRL_INDICES].reverse();

  const faq: FaqItem[] = [
    {
      question: "Qu'est-ce que l'IRL ?",
      answer:
        "L'Indice de Référence des Loyers est publié chaque trimestre par l'INSEE. Il correspond à la moyenne, sur les douze derniers mois, de l'indice des prix à la consommation hors tabac et hors loyers. Sa variation sur un an plafonne la révision annuelle des loyers d'habitation.",
    },
    {
      question: "Comment utiliser ce calculateur IRL ?",
      answer:
        "Saisissez le loyer hors charges et choisissez le trimestre de référence inscrit dans le bail : le calculateur prend le dernier indice publié pour ce trimestre, le compare au même trimestre un an plus tôt et affiche le nouveau loyer, la différence et la formule.",
    },
    {
      question: "Quand peut-on réviser un loyer avec l'IRL ?",
      answer:
        "Une fois par an, à la date prévue au bail ou, à défaut, à sa date anniversaire, et seulement si le bail contient une clause de révision. Aucun délai de prévenance n'est imposé : le bailleur a un an pour la demander, et le nouveau loyer s'applique à partir de sa demande, sans effet rétroactif (article 17-1 de la loi du 6 juillet 1989).",
    },
    {
      question: "Quelle est la valeur actuelle de l'IRL ?",
      answer: `Le dernier indice publié est celui du ${quarterShortLabel(latest)} : ${formatIndex(latest.value)}, soit ${formatSignedPercent(indexVariation(latestPair))} sur un an (Journal officiel de ${publicationMonth(latest)}). Pour un bail dont le trimestre de référence est différent, c'est le dernier indice publié pour ce trimestre qui s'applique.`,
    },
    {
      question: "Le loyer peut-il baisser si l'IRL baisse ?",
      answer:
        "Si l'IRL du trimestre de référence a baissé sur un an, la formule donne un loyer inférieur au loyer actuel. Le calculateur l'affiche alors comme une baisse.",
    },
  ];

  return (
    <>
      <CalculateurIRLJsonLd />
      <div className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
          <ToolHeader
            breadcrumb={breadcrumb}
            eyebrow="Outil gratuit · sans inscription"
            title="Calculateur IRL — Indice de Référence des Loyers"
            intro="Le nouveau loyer de votre bail en trois informations : le loyer actuel, le trimestre de référence et l'indice publié par l'INSEE."
            facts={[
              { label: "Dernier indice", value: `${quarterShortLabel(latest)} · ${formatIndex(latest.value)}` },
              { label: "Sur un an", value: formatSignedPercent(indexVariation(latestPair)) },
              { label: "Source", value: "INSEE" },
            ]}
          />

          <div className="mt-10">
            <IrlCalculator />
          </div>

          <section aria-labelledby="conditions-title" className="mt-8 rounded-2xl border border-line bg-paper px-5 py-6 sm:px-7">
            <h2 id="conditions-title" className="text-[17px] font-semibold text-ink">
              Avant d&apos;appliquer le nouveau loyer
            </h2>
            <ul className="mt-4 grid gap-x-8 gap-y-3 md:grid-cols-2">
              {CONDITIONS.map((condition) => (
                <li key={condition} className="flex gap-2.5 text-[14.5px] leading-6 text-ink">
                  <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-sage-600" strokeWidth={2.25} />
                  {condition}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[14px] leading-6 text-ink-muted">
              Sources :{" "}
              <a href={SERVICE_PUBLIC_REVISION} className={LINK} rel="noopener">
                Service-Public, révision du loyer
              </a>{" "}
              et article 17-1 de la loi du 6 juillet 1989. Toutes les règles dans le{" "}
              <Link href="/guides/irl-2026" className={LINK}>
                guide de la révision IRL
              </Link>
              .
            </p>
          </section>

          <div className="mt-16 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16">
            <div className="min-w-0 space-y-14">
              <ToolExplainer id="calcul-title" title="Comment ce montant est-il calculé ?">
                <p>
                  Le nouveau loyer est le loyer actuel multiplié par le rapport entre le nouvel indice et l&apos;ancien, pris au
                  même trimestre à un an d&apos;écart :
                </p>
                <p className="not-prose rounded-lg bg-white px-4 py-3.5 text-center text-[15px] font-medium text-ink ring-1 ring-line">
                  Nouveau loyer = loyer actuel × nouvel IRL ÷ ancien IRL
                </p>
                <p>
                  Avec le dernier indice publié, {quarterShortLabel(latestPair.current)} ({formatIndex(latestPair.current.value)}),
                  et celui du {quarterShortLabel(latestPair.previous)} ({formatIndex(latestPair.previous.value)}), un loyer de
                  800 € passe à {formatEuros(example.newRent)}. Les indices sont utilisés tels que publiés et leur rapport
                  n&apos;est jamais arrondi : seul le loyer final est arrondi au centime le plus proche.
                </p>
                <h3>Quand l&apos;IRL est-il publié ?</h3>
                <p>
                  L&apos;INSEE publie l&apos;indice de chaque trimestre dans le mois qui suit sa fin, puis il paraît au Journal
                  officiel. Tant qu&apos;un trimestre n&apos;est pas publié, le calculateur ne le propose pas : il n&apos;affiche
                  jamais d&apos;estimation.
                </p>
                <h3>Pourquoi l&apos;indice évolue-t-il ?</h3>
                <p>
                  L&apos;IRL suit la moyenne sur douze mois des prix à la consommation, hors tabac et hors loyers. Quand
                  l&apos;inflation ralentit, sa variation annuelle diminue ; elle peut devenir négative.
                </p>
                <p>
                  Pour faire la demande au locataire, partez de notre{" "}
                  <Link href="/templates/augmentation-de-loyer">lettre de révision de loyer</Link>. La clause de révision figure
                  dans le <Link href="/templates/bail-vide">modèle de bail vide</Link>, et le{" "}
                  <Link href="/glossaire-immobilier/irl-indice-reference-loyers">glossaire</Link> définit l&apos;IRL et les termes
                  employés.
                </p>
              </ToolExplainer>

              <ToolFaq items={faq} title="Questions fréquentes sur l'IRL" />
            </div>

            <section aria-labelledby="historique-title" className="min-w-0 lg:pt-10">
              <h2 id="historique-title" className="text-[1.25rem] font-semibold tracking-[-0.02em] text-ink">
                Historique des indices
              </h2>
              <p className="mt-1.5 text-[14px] leading-6 text-ink-muted">
                Valeurs publiées par l&apos;
                <a href={IRL_SOURCE_URL} className="underline decoration-line underline-offset-2 hover:text-ink" rel="noopener">
                  INSEE
                </a>
                , France métropolitaine.
              </p>
              <IndexTable entries={history.slice(0, 8)} latest={latest} caption="Huit derniers indices de référence des loyers et variation sur un an" />
              <details className="group mt-3">
                <summary className="cursor-pointer list-none text-[14px] font-medium text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest [&::-webkit-details-marker]:hidden">
                  <span className="group-open:hidden">Afficher les indices depuis {history[history.length - 1].year}</span>
                  <span className="hidden group-open:inline">Masquer les indices plus anciens</span>
                </summary>
                <div className="mt-3">
                  <IndexTable entries={history.slice(8)} latest={latest} caption="Indices de référence des loyers plus anciens" />
                </div>
              </details>
            </section>
          </div>

          <div className="mt-16">
            <ToolCta title="Vous révisez plusieurs loyers ?">
              Dans Lokna, chaque bail garde son loyer, ses charges et son trimestre de référence : le nouveau loyer se calcule
              depuis le bail avec les mêmes indices INSEE, et il ne s&apos;applique qu&apos;après votre validation.
            </ToolCta>
          </div>
        </div>
      </div>
    </>
  );
}
