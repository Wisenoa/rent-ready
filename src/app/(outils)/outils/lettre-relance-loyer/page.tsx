import type { Metadata } from "next";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowRight, FileText, Copy, Check } from "lucide-react";
import { SchemaMarkup, webApplicationSchema } from "@/components/seo/schema-markup";
import { FollowUpLetterTemplate } from "./letter-template";

export const metadata: Metadata = {
  title: "Lettre de Relance Loyer Impayé — Modèle Gratuit",
  description:
    "Modèle gratuit de lettre de relance pour loyer impayé. Appropriez notre modèle pour rappel de loyer, première relance, deuxième relance et mise en demeure.",
  alternates: {
    canonical: "https://www.rentready.fr/outils/lettre-relance-loyer",
  },
  openGraph: {
    title: "Lettre de Relance Loyer Impayé — Modèle Gratuit",
    description:
      "Modèle gratuit de lettre de relance pour loyer impayé. Premier rappel, deuxième relance et mise en demeure conformes à la loi française.",
    url: "https://www.rentready.fr/outils/lettre-relance-loyer",
    type: "website",
  },
};

const faqs = [
  {
    question: "Quand envoyer une lettre de relance pour un loyer impayé ?",
    answer:
      "La première relance doit être envoyée dès que le loyer est en retard, généralement quelques jours après la date d'échéance. Il est recommandé d'envoyer un rappel amiable avant toute procédure formelle. La loi n'impose pas de délai minimum, mais l'article 24 de la loi de 1989 prévoit une procédure spécifique.",
  },
  {
    question: "Quelle est la différence entre relance et mise en demeure ?",
    answer:
      "La relance (ou rappel) est une démarche amiable pour demander le paiement. La mise en demeure est un courrier formel qui fait courir les délais légaux et peut servir de preuve en cas de procédure. La mise en demeure doit être envoyée en lettre recommandée avec accusé de réception.",
  },
  {
    question: "Combien de relances avant la mise en demeure ?",
    answer:
      "Il n'y a pas de nombre légal de relances obligatoires. Cependant, il est conseillé d'envoyer au moins 2 relances amiables (par email ou courrier simple) avant la mise en demeure. Cela démontre votre bonne foi et peut faciliter une résolution à l'amiable.",
  },
  {
    question: "Quels délais pour une procédure d'expulsion ?",
    answer:
      "Après une mise en demeure restée sans effet pendant 2 mois (art. 24 loi 1989), le propriétaire peut saisir le tribunal. Le juge peut accorder des délais de paiement au locataire. L'expulsion ne peut intervenir qu'après un jugement et pendant la période hivernale (du 1er novembre au 31 mars), l'expulsion est suspendue.",
  },
  {
    question: "Puis-je réclamer des pénalités de retard ?",
    answer:
      "Oui, si le bail prévoit une clause de pénalités de retard. Ces dernières ne peuvent excéder un montant équivalent à un mois de loyer. De plus, vous pouvez réclamer des intérêts au taux légal sur les sommes dues à partir de la mise en demeure.",
  },
];

export default function LettreRelancePage() {
  return (
    <>
      <SchemaMarkup
        data={webApplicationSchema(
          "Lettre de Relance Loyer",
          "/outils/lettre-relance-loyer",
          "Modèle gratuit de lettre de relance pour loyer impayé. Premier rappel, deuxième relance et mise en demeure.",
          faqs
        )}
      />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <header className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-700">
            <FileText className="size-4" />
            Modèle gratuit et personnalisable
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Lettre de Relance pour Loyer Impayé — Modèle Gratuit
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-stone-600">
            Utilisez nos <strong>modèles de lettres de relance</strong> pour
            réclamer un loyer impayé. Premier rappel amiable, deuxième relance et
            mise en demeure conformes à la loi française.
          </p>
        </header>

        <FollowUpLetterTemplate />

        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Procédure de recouvrement des loyers impayés
          </h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-green-200 bg-green-50/50 p-4">
              <h3 className="mb-2 font-semibold text-green-800">
                Étape 1 — Premier rappel (amiable)
              </h3>
              <p className="text-sm text-green-700">
                Envoyez un rappel amiable par email ou courrier simple dans les
                premiers jours suivant l'impayé. Mentionnez le montant dû, la date
                d'échéance et les coordonnées bancaires pour le régularisation.
              </p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
              <h3 className="mb-2 font-semibold text-amber-800">
                Étape 2 — Deuxième relance (formelle)
              </h3>
              <p className="text-sm text-amber-700">
                Si aucun règlement sous 8-15 jours, envoyez une relance formelle
                par courrier simple avec accusé de réception. Rappelez les
                obligations du locataire et les conséquences en cas de
                non-paiement.
              </p>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
              <h3 className="mb-2 font-semibold text-red-800">
                Étape 3 — Mise en demeure (LRAR)
              </h3>
              <p className="text-sm text-red-700">
                Après 2 relances sans effet, envoyez une mise en demeure par
                lettre recommandée avec accusé de réception. Ce courrier fait
                courir les délais légaux et peut servir de preuve en justice.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Questions fréquentes sur les loyers impayés
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
            Droits et obligations du propriétaire bailleur
          </h2>
          <div className="rounded-xl border border-stone-200/60 bg-white p-6 sm:p-8">
            <div className="prose prose-stone max-w-none text-sm">
              <h3 className="text-lg font-semibold text-stone-800">Obligations du locataire</h3>
              <ul className="text-stone-600">
                <li>Payer le loyer et les charges aux dates prévues</li>
                <li>Assurer le logement (obligation légale)</li>
                <li>Effectuer les petites réparations et l'entretien courant</li>
                <li>Ne pas transformer le logement sans accord du propriétaire</li>
              </ul>

              <h3 className="mt-4 text-lg font-semibold text-stone-800">Recours du propriétaire</h3>
              <p className="text-stone-600">
                En cas d'impayés persistants, le propriétaire peut:
              </p>
              <ul className="text-stone-600">
                <li>Saisir le tribunal judiciaire pour obtenir une ordonnance d'expulsion</li>
                <li>Réclamer les loyers impayés, les intérêts et les frais de procédure</li>
                <li>Conserver le dépôt de garantie en déduction des sommes dues</li>
                <li>Inscripre le locataire au fichier national des impayés de loyers (FCLT)</li>
              </ul>

              <h3 className="mt-4 text-lg font-semibold text-stone-800">Protection du locataire</h3>
              <p className="text-stone-600">
                Le locataire bénéficie de protections:
              </p>
              <ul className="text-stone-600">
                <li>Trêve hivernale (expulsion suspendue du 1er novembre au 31 mars)</li>
                <li>Délais de paiement accordés par le juge selon la situation</li>
                <li>Procédure contradictoire avec droit à un défenseur</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-blue-200/60 bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 text-center sm:p-10">
          <h2 className="mb-3 text-xl font-bold text-stone-900 sm:text-2xl">
            Automatisez le suivi de vos loyers
          </h2>
          <p className="mx-auto mb-6 max-w-lg text-stone-600">
            RentReady détecte automatiquement les impayés, envoie les relances et
            génère les mises en demeure. Essai gratuit 14 jours.
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