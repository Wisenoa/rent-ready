import type { Metadata } from "next";
export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  SchemaMarkup,
  webApplicationSchema,
} from "@/components/seo/schema-markup";
import { QuittanceGenerator } from "./quittance-generator";

export const metadata: Metadata = {
  title: "Modèle quittance de loyer PDF gratuit 2026",
  description:
    "Générez une quittance de loyer PDF gratuite et conforme à la loi de 1989. Distinction loyer/charges, mentions légales obligatoires. Sans inscription.",
  alternates: {
    canonical: "https://www.rentready.fr/outils/modele-quittance-loyer-pdf",
  },
};

const faqs = [
  {
    question: "Une quittance de loyer est-elle obligatoire ?",
    answer:
      "Oui, dès lors que le locataire en fait la demande. L'article 21 de la loi n° 89-462 du 6 juillet 1989 oblige le bailleur à transmettre gratuitement une quittance après réception du paiement intégral du loyer et des charges.",
  },
  {
    question:
      "Quelles sont les mentions obligatoires d'une quittance de loyer ?",
    answer:
      "Une quittance de loyer conforme doit contenir : le nom et l'adresse du bailleur, le nom et l'adresse du locataire, la période concernée, le montant du loyer hors charges, le montant des provisions pour charges, le total payé, et la date de paiement.",
  },
  {
    question:
      "Peut-on émettre une quittance pour un paiement partiel ?",
    answer:
      "Non. Si le locataire n'a payé qu'une partie du loyer, le bailleur doit délivrer un reçu de paiement partiel, et non une quittance. La quittance atteste du paiement intégral du loyer et des charges pour la période donnée.",
  },
  {
    question: "Quel format pour une quittance de loyer en 2026 ?",
    answer:
      "Le format PDF reste le standard le plus courant et parfaitement valide. Pour anticiper les obligations de facturation électronique, certains logiciels comme RentReady génèrent également des quittances au format Factur-X.",
  },
  {
    question:
      "Comment automatiser l'envoi de quittances chaque mois ?",
    answer:
      "Avec RentReady, les quittances sont générées et envoyées automatiquement dès que le virement du locataire est détecté sur votre compte bancaire via l'Open Banking. Plus besoin de créer et envoyer manuellement chaque document.",
  },
];

const schemaData = webApplicationSchema(
  "Générateur de quittance de loyer PDF gratuit",
  "/outils/modele-quittance-loyer-pdf",
  "Générez une quittance de loyer PDF gratuite et conforme à la loi de 1989. Distinction loyer/charges, mentions légales obligatoires.",
  faqs
);

export default function ModeleQuittanceLoyerPdfPage() {
  return (
    <>
      <SchemaMarkup data={schemaData} />

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        {/* ─── Hero ─── */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Modèle de quittance de loyer PDF gratuit — Conforme 2026
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-stone-600">
            Générez votre <strong>quittance de loyer</strong> au format{" "}
            <strong>PDF</strong>, <strong>gratuit</strong> et sans inscription.
            Notre modèle respecte les mentions obligatoires de la{" "}
            <strong>loi n° 89-462 du 6 juillet 1989</strong> : distinction
            loyer / charges, identification du bailleur et du locataire, période
            et montant total. Téléchargez un document professionnel en quelques
            clics, prêt à envoyer à votre locataire.
          </p>
        </header>

        {/* ─── Form ─── */}
        <QuittanceGenerator />

        {/* ─── SEO Content ─── */}
        <section className="mt-16 space-y-12">
          {/* Mentions obligatoires */}
          <div>
            <h2 className="text-2xl font-semibold text-stone-900">
              Mentions obligatoires d&apos;une quittance de loyer
            </h2>
            <p className="mt-3 text-stone-600">
              Conformément à l&apos;article 21 de la loi n° 89-462 du 6 juillet
              1989, toute quittance de loyer doit comporter les éléments
              suivants :
            </p>
            <ul className="mt-4 list-inside list-disc space-y-2 text-stone-700">
              <li>Nom et adresse du bailleur</li>
              <li>Nom et adresse du locataire</li>
              <li>Adresse du logement loué</li>
              <li>Période de location concernée (mois et année)</li>
              <li>
                Détail des sommes versées :{" "}
                <strong>loyer hors charges</strong> et{" "}
                <strong>provisions pour charges</strong>, distingués
              </li>
              <li>Montant total acquitté</li>
              <li>Date de paiement</li>
            </ul>
          </div>

          {/* Quittance vs reçu */}
          <div>
            <h2 className="text-2xl font-semibold text-stone-900">
              Quittance ou reçu de paiement : quelle différence ?
            </h2>
            <p className="mt-3 leading-relaxed text-stone-600">
              Une <strong>quittance de loyer</strong> ne peut être délivrée que
              lorsque le locataire a payé <strong>l&apos;intégralité</strong> du
              loyer et des charges pour la période concernée. Elle atteste du
              paiement complet et libère le locataire de son obligation.
            </p>
            <p className="mt-3 leading-relaxed text-stone-600">
              En revanche, si le paiement est <strong>partiel</strong>, le
              bailleur est tenu de délivrer un simple{" "}
              <strong>reçu de paiement</strong> mentionnant le montant
              effectivement perçu. Le reçu ne vaut pas quittance et ne libère
              pas le locataire de la totalité de sa dette locative.
            </p>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-semibold text-stone-900">
              Questions fréquentes
            </h2>
            <div className="mt-4 divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
              {faqs.map((faq) => (
                <details key={faq.question} className="group px-5 py-4">
                  <summary className="flex cursor-pointer items-center justify-between font-medium text-stone-800 marker:[content:none] [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <span className="ml-2 shrink-0 text-stone-400 transition-transform duration-200 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA Banner ─── */}
        <section className="mt-16 rounded-2xl bg-blue-600 px-6 py-10 text-center text-white shadow-lg sm:px-10">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Automatisez vos quittances chaque mois
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-blue-100">
            RentReady génère et envoie automatiquement les quittances conformes
            dès que le loyer est détecté sur votre compte bancaire. Essai gratuit
            14&nbsp;jours.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-block rounded-xl bg-white px-8 py-3 font-semibold text-blue-600 shadow-sm transition-colors hover:bg-blue-50"
          >
            Essayer gratuitement
          </Link>
        </section>
      </article>
    </>
  );
}
