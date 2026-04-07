import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import {
  SchemaMarkup,
  webApplicationSchema,
} from "@/components/seo/schema-markup";
import { IrlCalculator } from "./irl-calculator";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Calculateur IRL 2026 — Révision de loyer gratuit",
  description:
    "Calculez gratuitement la révision de votre loyer avec l'IRL INSEE 2026. Formule légale, données officielles du 4ᵉ trimestre 2025. Outil en ligne.",
  alternates: {
    canonical: "https://www.rentready.fr/outils/calculateur-irl-2026",
  },
  openGraph: {
    title: "Calculateur IRL 2026 — Révision de loyer gratuit",
    description:
      "Calculez gratuitement la révision de votre loyer avec l'IRL INSEE 2026. Formule légale, données officielles du 4ᵉ trimestre 2025. Outil en ligne.",
    url: "https://www.rentready.fr/outils/calculateur-irl-2026",
    type: "website",
  },
};

const irlData = [
  { trimestre: "T4", annee: 2025, valeur: 145.78 },
  { trimestre: "T3", annee: 2025, valeur: 144.51 },
  { trimestre: "T2", annee: 2025, valeur: 143.58 },
  { trimestre: "T1", annee: 2025, valeur: 143.46 },
  { trimestre: "T4", annee: 2024, valeur: 145.47 },
  { trimestre: "T3", annee: 2024, valeur: 144.51 },
  { trimestre: "T2", annee: 2024, valeur: 143.58 },
  { trimestre: "T1", annee: 2024, valeur: 143.46 },
  { trimestre: "T4", annee: 2023, valeur: 142.06 },
  { trimestre: "T3", annee: 2023, valeur: 141.03 },
  { trimestre: "T2", annee: 2023, valeur: 140.59 },
  { trimestre: "T1", annee: 2023, valeur: 138.61 },
];

const faqs = [
  {
    question: "Qu'est-ce que l'Indice de Référence des Loyers (IRL) ?",
    answer:
      "L'Indice de Référence des Loyers (IRL) est un indice publié chaque trimestre par l'INSEE. Il sert de base légale pour le calcul de la révision annuelle des loyers d'habitation en France. L'IRL plafonne l'augmentation que le bailleur peut appliquer, protégeant ainsi les locataires contre des hausses excessives. Il est calculé à partir de la moyenne de l'évolution des prix à la consommation hors tabac et hors loyers sur les douze derniers mois.",
  },
  {
    question: "Comment calculer la révision annuelle du loyer ?",
    answer:
      "La formule légale est : Nouveau loyer = Loyer actuel × (Nouvel IRL / IRL de référence). Par exemple, pour un loyer de 800 € avec un IRL de référence de 142,06 (T4 2023) et un nouvel IRL de 145,78 (T4 2025), le nouveau loyer est : 800 × (145,78 / 142,06) = 820,95 €, soit une augmentation de 20,95 € (+2,62 %).",
  },
  {
    question: "Quand peut-on appliquer la révision de loyer ?",
    answer:
      "La révision de loyer peut être appliquée à la date anniversaire du bail, c'est-à-dire chaque année à la date de signature du contrat de location. Le bailleur doit en informer le locataire. Si aucune clause de révision n'est prévue dans le bail, le loyer ne peut pas être révisé en cours de bail.",
  },
  {
    question:
      "L'IRL s'applique-t-il aux meublés et aux locations vides ?",
    answer:
      "Oui, l'IRL s'applique aussi bien aux locations vides (non meublées) qu'aux locations meublées à usage de résidence principale. Les deux types de baux sont soumis à la même règle de révision annuelle basée sur l'IRL, conformément à la loi du 6 juillet 1989.",
  },
  {
    question:
      "Que se passe-t-il si le bailleur oublie de réviser le loyer ?",
    answer:
      "Si le bailleur oublie d'appliquer la révision de loyer à la date anniversaire du bail, il peut réclamer rétroactivement l'augmentation, mais uniquement sur une période maximale d'un an. Au-delà de ce délai, les augmentations non réclamées sont perdues. Il est donc recommandé d'automatiser le suivi de la révision pour ne manquer aucune échéance.",
  },
];

export default function CalculateurIrlPage() {
  return (
    <>
      <SchemaMarkup
        data={webApplicationSchema(
          "Calculateur IRL 2026",
          "/outils/calculateur-irl-2026",
          "Calculez la révision de votre loyer avec la formule IRL légale et les données INSEE officielles.",
          faqs
        )}
      />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        {/* ---- Hero ---- */}
        <header className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
            Outil gratuit — Données INSEE 2025
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Calculateur IRL 2026&nbsp;: révisez votre loyer en ligne
            gratuitement
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-stone-600">
            Utilisez notre <strong>calculateur IRL</strong> pour effectuer la{" "}
            <strong>révision de loyer</strong> de vos biens locatifs en quelques
            secondes. Basé sur les données officielles de l&apos;
            <strong>INSEE</strong>, cet outil applique la formule légale avec les
            derniers indices de référence des loyers publiés, incluant le
            4ᵉ&nbsp;trimestre 2025 (IRL&nbsp;=&nbsp;145,78).
          </p>
        </header>

        {/* ---- Calculator ---- */}
        <section className="mb-16" aria-label="Calculateur IRL">
          <IrlCalculator />
        </section>

        {/* ---- How-to ---- */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Comment calculer la révision de votre loyer avec l&apos;IRL&nbsp;?
          </h2>
          <div className="rounded-xl border border-stone-200/60 bg-white p-6 sm:p-8">
            <p className="mb-4 text-stone-600">
              La révision annuelle du loyer est encadrée par la loi. Elle
              s&apos;appuie sur l&apos;Indice de Référence des Loyers (IRL)
              publié par l&apos;INSEE. Voici les étapes&nbsp;:
            </p>
            <ol className="mb-6 list-inside list-decimal space-y-3 text-stone-600">
              <li>
                <strong className="text-stone-800">
                  Identifiez l&apos;IRL de référence
                </strong>{" "}
                — C&apos;est l&apos;IRL du trimestre mentionné dans votre bail
                (généralement celui en vigueur à la date de signature).
              </li>
              <li>
                <strong className="text-stone-800">
                  Trouvez le nouvel IRL
                </strong>{" "}
                — C&apos;est le dernier IRL publié correspondant au même
                trimestre, un an (ou plus) après.
              </li>
              <li>
                <strong className="text-stone-800">
                  Appliquez la formule
                </strong>{" "}
                —{" "}
                <code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-sm text-stone-800">
                  Nouveau loyer = Loyer actuel × (Nouvel IRL ÷ IRL de
                  référence)
                </code>
              </li>
            </ol>
            <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4">
              <p className="flex items-start gap-2 text-sm text-blue-800">
                <Info className="mt-0.5 size-4 shrink-0" />
                <span>
                  <strong>Exemple&nbsp;:</strong> Pour un loyer de 900&nbsp;€
                  avec un IRL de référence de 142,06 (T4&nbsp;2023) et un nouvel
                  IRL de 145,78 (T4&nbsp;2025), le nouveau loyer est&nbsp;:
                  900&nbsp;×&nbsp;(145,78&nbsp;÷&nbsp;142,06)&nbsp;=&nbsp;
                  <strong>923,58&nbsp;€</strong>.
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* ---- Historical IRL table ---- */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Tableau des valeurs IRL officielles (INSEE 2023–2025)
          </h2>
          <div className="overflow-hidden rounded-xl border border-stone-200/60">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200/60 bg-stone-100/80">
                  <th className="px-4 py-3 font-semibold text-stone-700">
                    Trimestre
                  </th>
                  <th className="px-4 py-3 font-semibold text-stone-700">
                    Année
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-stone-700">
                    Valeur IRL
                  </th>
                </tr>
              </thead>
              <tbody>
                {irlData.map((row, i) => (
                  <tr
                    key={`${row.trimestre}-${row.annee}`}
                    className={i % 2 === 0 ? "bg-white" : "bg-stone-50"}
                  >
                    <td className="px-4 py-2.5 text-stone-700">
                      {row.trimestre}
                    </td>
                    <td className="px-4 py-2.5 text-stone-700">{row.annee}</td>
                    <td className="px-4 py-2.5 text-right font-medium text-stone-900">
                      {row.valeur.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-stone-400">
            Source&nbsp;: INSEE — Institut national de la statistique et des
            études économiques.
          </p>
        </section>

        {/* ---- FAQ ---- */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Questions fréquentes sur l&apos;IRL et la révision de loyer
          </h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-stone-200/60 bg-white"
              >
                <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-stone-800 select-none marker:text-stone-400">
                  {faq.question}
                </summary>
                <p className="px-5 pb-4 text-sm leading-relaxed text-stone-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ---- CTA Banner ---- */}
        <section
          className="rounded-xl border border-blue-200/60 bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 text-center sm:p-10"
          aria-label="Appel à l'action"
        >
          <h2 className="mb-3 text-xl font-bold text-stone-900 sm:text-2xl">
            Automatisez la révision de loyer chaque année
          </h2>
          <p className="mx-auto mb-6 max-w-lg text-stone-600">
            RentReady calcule et applique l&apos;IRL automatiquement pour tous
            vos biens. Essai gratuit 14&nbsp;jours.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Commencer l&apos;essai gratuit
            <ArrowRight className="size-4" />
          </Link>
        </section>
      </article>
    </>
  );
}
