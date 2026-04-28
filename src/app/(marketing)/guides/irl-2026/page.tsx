import type { Metadata } from "next";
export const revalidate = 604800;

import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";
import { baseMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata({
    title:
      "IRL 2026 — Indice de Référence des Loyers & Révision de Loyer | RentReady",
    description:
      "Indice de Référence des Loyers (IRL) 2026 : dernière valeur officielle INSEE, comment calculer la révision de loyer annuelle, délai et méthode correcte.",
    url: "/guides/irl-2026",
    ogType: "website",
  });
}

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
      text: "Multipliez le loyer actuel par le rapport entre le nouvel IRL et l'ancien IRL : Nouveau loyer = Loyer actuel × (IRL nouveau / IRL ancien). Par exemple : 800 × (146,44 / 138,61) = 845,20 €.",
    },
    {
      "@type": "HowToStep",
      name: "Respecter le délai de révision annuelle",
      text: "La révision ne peut intervenir qu'une fois par an, à la date anniversaire du bail. Elle n'est jamais rétroactive. Informez le locataire par LRAR avec le détail du calcul.",
    },
    {
      "@type": "HowToStep",
      name: "Baisser le loyer si l'IRL diminue",
      text: "Si l'IRL a baissé depuis la dernière révision, le loyer doit diminuer proportionnellement. Le locataire peut exiger la baisse et le remboursement des trop-perçus.",
    },
    {
      "@type": "HowToStep",
      name: "Consulter les valeurs officielles de l'IRL",
      text: "Les valeurs de l'IRL sont disponibles gratuitement sur www.insee.fr, par trimestre et par année depuis 2008. Q4 2025 : 146,44 (+0,09 % sur un an).",
    },
    {
      "@type": "HowToStep",
      name: "Respecter l'encadrement des loyers en zone tendue",
      text: "Dans les communes soumises à l'encadrement (Paris, Lille, Lyon, Montpellier...), le loyer ne peut pas dépasser le loyer de référence majoré de 20 % lors d'une relocation ou révision.",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quelle est la valeur de l'IRL en 2026 ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L'IRL applicable pour les révisions de loyer en 2026 est de 146,44 au titre du quatrième trimestre 2025, publié par l'INSEE en janvier 2026. La variation annuelle est de +0,09 %.",
      },
    },
    {
      "@type": "Question",
      name: "Comment calculer une révision de loyer avec l'IRL ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La formule est : Nouveau loyer = Loyer actuel × (IRL nouveau / IRL ancien). Par exemple : 800 € × (146,44 / 138,61) = 845,20 €. Le résultat ne doit pas dépasser l'encadrement des loyers en zone tendue.",
      },
    },
    {
      "@type": "Question",
      name: "Peut-on réviser le loyer rétroactivement ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non, la révision de loyer n'est jamais rétroactive. Si le bailleur omet de réviser à la date anniversaire du bail, il ne peut pas rattraper les mois passés. La révision prend effet à la date anniversaire.",
      },
    },
    {
      "@type": "Question",
      name: "Que faire si l'IRL a baissé ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Si l'IRL a diminué depuis la dernière révision, le loyer doit diminuer proportionnellement. Le locataire peut exiger la baisse et le remboursement des trop-perçus des mois précédents.",
      },
    },
    {
      "@type": "Question",
      name: "L'encadrement des loyers limite-t-il la révision IRL ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, dans les communes soumises à l'encadrement (Paris, Lille, Lyon, Montpellier, etc.), le loyer révisé ne peut pas dépasser le loyer de référence majoré de 20 %. En cas de relocation, le loyer ne peut pas excéder le précédent loyer majoré de 20 %.",
      },
    },
    {
      "@type": "Question",
      name: "Comment informer le locataire de la révision ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le bailleur doit informer le locataire de la révision par lettre recommandée avec accusé de réception (LRAR), en joignant un tableau détaillé montrant le calcul effectué (ancien loyer, ancien IRL, nouvel IRL, nouveau loyer).",
      },
    },
  ],
};

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
        <nav className="mb-6 text-sm text-stone-500">
          <Link href="/" className="hover:text-stone-700">Accueil</Link>
          <span className="mx-2">›</span>
          <Link href="/guides" className="hover:text-stone-700">Guides pratiques</Link>
          <span className="mx-2">›</span>
          <span>Révision IRL 2026</span>
        </nav>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
          Mis à jour avril 2026
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl text-balance">
          Indice de Référence des Loyers (IRL) 2026
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-600">
          L&apos;IRL est utilisé pour réviser le loyer d&apos;un bail en cours. Voici la valeur
          officielle 2026, la méthode de calcul, et les pièges à éviter.
        </p>
      </header>

      {/* IRL Value Highlight */}
      <div className="mb-12 rounded-2xl border border-blue-200/60 bg-gradient-to-br from-blue-50 to-white p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wide text-blue-600">
              Valeur IRL 2026 (Q4 2025)
            </h2>
            <p className="mt-2 text-4xl font-bold text-stone-900">146,44</p>
            <p className="mt-1 text-sm text-stone-500">
              Source : INSEE — Indice de référence des loyers
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <div className="rounded-lg bg-green-50 px-4 py-2 text-center">
              <p className="text-xs text-green-600">Variation annuelle</p>
              <p className="text-lg font-bold text-green-700">+0,09 %</p>
            </div>
            <Link
              href="/templates/augmentation-de-loyer"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
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
          principale en France. Créé par la loi de finances de 2008, il vise à encadrer
          l&apos;évolution des loyers en limitant les hausses à l&apos;inflation constatée.
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
          Exemple : un loyer actuel de 800 € avec un IRL passé de 138,61 et un IRL
          actuel de 146,44 :
        </p>
        <div className="not-prose my-4 rounded-lg bg-stone-100 p-4 text-center font-mono text-sm">
          800 × (146,44 / 138,61) = 845,20 € / mois
        </div>

        <h2>Quand peut-on réviser le loyer ?</h2>
        <p>
          La révision ne peut intervenir qu&apos;<strong>une fois par an</strong>, à la date
          anniversaire du bail (ou à la date indiquée dans le bail si différente). Elle
          n&apos;est jamais rétroactive : si le bailleur oublie de réviser à la date
          anniversaire, il ne peut pas rattraper les mois passés.
        </p>
        <p>
          Le bailleur doit informer le locataire de la révision par lettre recommandée
          avec accusé de réception (LRAR), en joignant un tableau montrant le calcul
          effectué.
        </p>

        <h2>Que faire si l&apos;IRL baisse ?</h2>
        <p>
          Si l&apos;IRL a baissé depuis la dernière révision, le loyer doit logiquement
          diminuer également — la clause de révision s&apos;applique dans les deux sens. Le
          locataire peut exiger la baisse et le remboursement des trop-perçus.
        </p>

        <h2>Où trouver les valeurs de l&apos;IRL ?</h2>
        <p>
          Les valeurs de l&apos;IRL sont publiées par l&apos;INSEE et accessibles gratuitement sur
          <Link href="https://www.insee.fr" className="text-blue-600 hover:underline">
            www.insee.fr
          </Link>. Les valeurs sont disponibles par trimestre et par année depuis 2008.
        </p>
        <ul>
          <li><strong>Q4 2025 (utilisable en 2026)</strong> : 146,44 (+0,09 % sur un an)</li>
          <li><strong>Q3 2025</strong> : 146,22 (+0,69 % sur un an)</li>
          <li><strong>Q2 2025</strong> : 145,65 (+0,58 % sur un an)</li>
          <li><strong>Q1 2025</strong> : 145,18 (+0,89 % sur un an)</li>
        </ul>

        <h2>Locatifs en zone tendue : l&apos;encadrement des loyers</h2>
        <p>
          Dans les communes soumises à l&apos;encadrement des loyers (Paris, Lille, Lyon,
          Montpellier, etc.), la hausse du loyer lors de la relocation ou de la révision
          est limitée. Le bailleur ne peut pas demander un loyer supérieur au loyer de
          référence majoré de 20 %.
        </p>
      </div>

      {/* FAQ Section */}
      <section className="mt-16 rounded-2xl border border-stone-200/60 bg-white p-8">
        <h2 className="mb-6 text-2xl font-bold text-stone-900">Questions fréquentes sur l'IRL 2026</h2>
        <div className="space-y-4">
          {[
            {
              q: "Quelle est la valeur de l'IRL en 2026 ?",
              a: "L'IRL applicable pour les révisions de loyer en 2026 est de 146,44 au titre du quatrième trimestre 2025, publié par l'INSEE en janvier 2026. La variation annuelle est de +0,09 %.",
            },
            {
              q: "Comment calculer une révision de loyer avec l'IRL ?",
              a: "La formule est : Nouveau loyer = Loyer actuel × (IRL nouveau / IRL ancien). Par exemple : 800 € × (146,44 / 138,61) = 845,20 €. Le résultat ne doit pas dépasser l'encadrement des loyers en zone tendue.",
            },
            {
              q: "Peut-on réviser le loyer rétroactivement ?",
              a: "Non, la révision de loyer n'est jamais rétroactive. Si le bailleur omet de réviser à la date anniversaire du bail, il ne peut pas rattraper les mois passés.",
            },
            {
              q: "Que faire si l'IRL a baissé ?",
              a: "Si l'IRL a diminué depuis la dernière révision, le loyer doit diminuer proportionnellement. Le locataire peut exiger la baisse et le remboursement des trop-perçus des mois précédents.",
            },
            {
              q: "L'encadrement des loyers limite-t-il la révision IRL ?",
              a: "Oui, dans les communes soumises à l'encadrement (Paris, Lille, Lyon, Montpellier, etc.), le loyer révisé ne peut pas dépasser le loyer de référence majoré de 20 %.",
            },
            {
              q: "Comment informer le locataire de la révision ?",
              a: "Le bailleur doit informer le locataire de la révision par LRAR, en joignant un tableau détaillé du calcul (ancien loyer, ancien IRL, nouvel IRL, nouveau loyer).",
            },
          ].map((item, i) => (
            <details key={i} className="group rounded-lg border border-stone-200 bg-stone-50 open:bg-white">
              <summary className="flex cursor-pointer items-center justify-between gap-4 p-4 font-medium text-stone-900 hover:text-blue-600">
                {item.q}
                <span className="shrink-0 text-stone-400 transition-transform group-open:rotate-180">
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
        <h2 className="mb-3 text-xl font-bold text-stone-900">
          Calculez automatiquement vos révisions IRL
        </h2>
        <p className="mx-auto mb-6 max-w-md text-stone-600">
          With RentReady, l&apos;IRL est mis à jour automatiquement. La révision de loyer est
          calculée et envoyée au locataire en 2 clics.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
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
