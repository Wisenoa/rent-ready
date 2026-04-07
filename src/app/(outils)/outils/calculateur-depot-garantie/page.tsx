import type { Metadata } from "next";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowRight, Info, Calculator } from "lucide-react";
import { SchemaMarkup, webApplicationSchema } from "@/components/seo/schema-markup";
import { SecurityDepositCalculator } from "./deposit-calculator";

export const metadata: Metadata = {
  title: "Calculateur Dépôt de Garantie — Caution Location",
  description:
    "Calculez le dépôt de garantie pour votre location. Outil gratuit pour connaître le montant maximal de la caution selon la loi française (bail vide ou meublé).",
  alternates: {
    canonical: "https://www.rentready.fr/outils/calculateur-depot-garantie",
  },
  openGraph: {
    title: "Calculateur Dépôt de Garantie — Caution Location",
    description:
      "Calculez le dépôt de garantie pour votre location. Outil gratuit pour connaître le montant maximal de la caution selon la loi française.",
    url: "https://www.rentready.fr/outils/calculateur-depot-garantie",
    type: "website",
  },
};

const faqs = [
  {
    question: "Qu'est-ce que le dépôt de garantie ?",
    answer:
      "Le dépôt de garantie (aussi appelé caution) est une somme d'argent versée par le locataire au propriétaire à la signature du bail. Elle sert de garantie en cas de dommages ou d'impayés. Le propriétaire doit le restituer à la fin du bail, déduction faite des éventuels manquants.",
  },
  {
    question: "Quel est le montant maximal du dépôt de garantie ?",
    answer:
      "Pour une location vide (non meublée), le dépôt de garantie est limité à 1 mois de loyer hors charges. Pour une location meublée, il peut aller jusqu'à 2 mois de loyer hors charges. Ces plafonds sont fixés par la loi ALUR de 2014.",
  },
  {
    question: "Quand le dépôt de garantie doit-il être restitué ?",
    answer:
      "Le propriétaire dispose d'un délai de 1 mois pour restituer le dépôt de garantie si l'état des lieux de sortie est conforme à l'état des lieux d'entrée. S'il existe des différences, le délai est de 2 mois. Au-delà, le montant dû produit des intérêts au taux légal.",
  },
  {
    question: "Le propriétaire peut-il garder le dépôt de garantie ?",
    answer:
      "Le propriétaire peut déduire du dépôt de garantie les sommes dues par le locataire: loyers impayés, charges impayées, réparations locatives, dégradations constatées lors de l'état des lieux de sortie. Il doit justifier chaque déduction par des factures ou devis.",
  },
  {
    question: "Le locataire peut-il utiliser le dépôt pour le dernier loyer ?",
    answer:
      "Non, le dépôt de garantie ne peut pas servir au paiement du dernier mois de loyer, sauf accord express du propriétaire. C'est une pratique illégale qui peut entraîner des poursuites pour trouble anormal de voisinage.",
  },
];

export default function CalculateurDepotGarantiePage() {
  return (
    <>
      <SchemaMarkup
        data={webApplicationSchema(
          "Calculateur Dépôt de Garantie",
          "/outils/calculateur-depot-garantie",
          "Calculez gratuitement le dépôt de garantie pour votre location selon la loi française (bail vide ou meublé).",
          faqs
        )}
      />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <header className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-700">
            <Calculator className="size-4" />
            Outil gratuit — Calcul en ligne
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Calculateur de Dépôt de Garantie — Caution Location
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-stone-600">
            Utilisez notre calculateur pour connaître le{" "}
            <strong>montant maximal du dépôt de garantie</strong> selon la loi
            française. Le calcul tient compte du type de bail (vide ou meublé) et
            des plafonds légaux.
          </p>
        </header>

        <section className="mb-16" aria-label="Calculateur">
          <SecurityDepositCalculator />
        </section>

        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Comment calculer le dépôt de garantie ?
          </h2>
          <div className="rounded-xl border border-stone-200/60 bg-white p-6 sm:p-8">
            <p className="mb-4 text-stone-600">
              Le calcul du dépôt de garantie (caution) dépend du type de location:
            </p>
            <div className="mb-6 space-y-4">
              <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4">
                <h3 className="mb-2 font-semibold text-stone-800">
                  Location vide (non meublée)
                </h3>
                <p className="text-sm text-stone-600">
                  <strong>Plafond légal: 1 mois de loyer hors charges</strong>
                  <br />
                  Exemple: Pour un loyer de 800 € + 100 € de charges, le dépôt
                  maximum est de <strong>800 €</strong>.
                </p>
              </div>
              <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-4">
                <h3 className="mb-2 font-semibold text-stone-800">
                  Location meublée
                </h3>
                <p className="text-sm text-stone-600">
                  <strong>Plafond légal: 2 mois de loyer hors charges</strong>
                  <br />
                  Exemple: Pour un loyer de 800 € + 100 € de charges, le dépôt
                  maximum est de <strong>1 600 €</strong> (800 € × 2).
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4">
              <p className="flex items-start gap-2 text-sm text-blue-800">
                <Info className="mt-0.5 size-4 shrink-0" />
                <span>
                  <strong>Rappel:</strong> Les charges ne sont jamais incluses
                  dans le calcul du dépôt de garantie. Seul le loyer principal
                  (hors charges) est pris en compte.
                </span>
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Questions fréquentes sur le dépôt de garantie
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

        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Restitution du dépôt de garantie — Délais légaux
          </h2>
          <div className="overflow-hidden rounded-xl border border-stone-200/60">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200/60 bg-stone-100/80">
                  <th className="px-4 py-3 font-semibold text-stone-700">
                    Situation
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-stone-700">
                    Délai de restitution
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="px-4 py-3 text-stone-700">
                    État des lieux identique (entrée = sortie)
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-green-700">
                    1 mois
                  </td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="px-4 py-3 text-stone-700">
                    Différences constatées dans l'état des lieux
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-amber-700">
                    2 mois
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-3 text-stone-700">
                    Retard injustifié du propriétaire
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-red-700">
                    Intérêts au taux légal
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-blue-200/60 bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 text-center sm:p-10">
          <h2 className="mb-3 text-xl font-bold text-stone-900 sm:text-2xl">
            Gérez vos dépôts de garantie automatiquement
          </h2>
          <p className="mx-auto mb-6 max-w-lg text-stone-600">
            RentReady suit vos dépôts, calcule les restitutions et génère les
            quittances associées. Essai gratuit 14 jours.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Commencer l'essai gratuit
            <ArrowRight className="size-4" />
          </Link>
        </section>
      </article>
    </>
  );
}