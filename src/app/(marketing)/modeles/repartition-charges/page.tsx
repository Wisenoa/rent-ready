import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import React from "react";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { baseMetadata } from "@/lib/seo/metadata";

const FinalCta = dynamic(
  () => import("@/components/landing/final-cta"),
  { ssr: true, loading: () => <div style={{ minHeight: 400 }} aria-hidden="true" /> }
);

export async function generateMetadata() {
  return baseMetadata({
    title: "Modèle Répartition des Charges Locatives — Calcul et Contrat | RentReady",
    description: "Modèle de convention de répartition des charges locatives. Document officiel pour partager les coûts entre propriétaire et locataire de manière claire.",
    url: "/modeles/repartition-charges",
    ogType: "template",
  });
}
;

const typesCharges = [
  {
    titre: "Charges récupérables (locatives)",
    description:
      "Ces charges sont supportées par le locataire. Le bailleur les récupère via des provisions mensuelles : eau froide, eau chaude, chauffage collectif, ascenseur, entretien des parties communes, taxe d'enlèvement des ordures ménagères.",
  },
  {
    titre: "Travaux de grosse réparation",
    description:
      "Les travaux de gros entretien (ravalement, couverture, fondations) sont à la charge du bailleur. Ils ne peuvent pas être répercutés sur le locataire sauf clause expresse dans le bail.",
  },
  {
    titre: "Charges non récupérables",
    description:
      "Certaines charges ne sont jamais récupérables : les frais de gestion, l'assurance loyers impayés, les travaux de mise aux normes, les charges de travaux exceptionnels.",
  },
];

const modalitesRegul = [
  { titre: "Provision mensuelle", detail: "Le montant mensuel est estimé en fonction des charges de l'année précédente, divisé par 12." },
  { titre: "Appel de fonds", detail: "Le bailleur envoie un appel de provisions avec un acompte trimestriel ou mensuel intégré au loyer." },
  { titre: "Régularisation annuelle", detail: "Chaque année, le bailleur compare les provisions versées aux charges réelles. Le trop-perçu est remboursé, le déficit est appelé." },
  { titre: "Justificatifs fournis", detail: "Le locataire peut demander les factures et justificatifs des charges réelles dans un délai de 1 mois après la régularisation." },
];

const chargesList = [
  { nom: "Eau froide et chaude", type: "Récupérable", plafond: "Réel sans plafond" },
  { nom: "Chauffage collectif", type: "Récupérable", plafond: "Réel sans plafond" },
  { nom: "Ascenseur", type: "Récupérable", plafond: "Réel sans plafond" },
  { nom: "Entretien parties communes", type: "Récupérable", plafond: "Réel sans plafond" },
  { nom: "Taxe ordures ménagères", type: "Récupérable", plafond: "Réel sans plafond" },
  { nom: "Frais de gestion", type: "Non récupérable", plafond: "Non récupérable" },
  { nom: "Assurance propriétaire", type: "Non récupérable", plafond: "Non récupérable" },
];

const faqData = [
  {
    question: "Quelles charges peuvent être récupérées auprès du locataire ?",
    answer:
      "Les charges récupérables sont listées dans le décret n° 82-955 de 1982. Elles incluent : l'eau, le chauffage collectif, l'ascenseur, l'entretien des parties communes, la taxe d'enlèvement des ordures ménagères. Les frais de gestion, l'assurance propriétaire et les travaux ne sont pas récupérables.",
  },
  {
    question: "Comment calculer la provision pour charges ?",
    answer:
      "La provision mensuelle est calculée sur la base des charges de l'année précédente (ou estimées). On divise le total annuel par 12 pour obtenir le montant mensuel. Ce montant apparaît sur l'appel de loyer comme une provision distincte du loyer principal.",
  },
  {
    question: "Quand doit-on faire la régularisation des charges ?",
    answer:
      "La régularisation des charges doit intervenir au moins une fois par an, généralement à l'anniversaire du bail ou à la fin de l'exercice comptable. Le bailleur doit informer le locataire du montant réel des charges et ajuster les provisions dans un délai de 1 mois.",
  },
  {
    question: "Le locataire peut-il contester les charges ?",
    answer:
      "Oui, le locataire dispose de 1 mois après réception du décompte pour contester les charges. Le bailleur doit alors fournir les factures et justificatifs. En cas de désaccord, les parties peuvent saisir la commission de conciliation ou le juge des contentieux de la juridiction de proximité.",
  },
  {
    question: "Que se passe-t-il si le locataire ne paie pas les provisions de charges ?",
    answer:
      "Les provisions de charges impayées peuvent entraîner des charges supplémentaires (intérêts de retard). En cas de non-paiement persistant, le bailleur peut appliquer une augmentation de la provision pour charges ou engager une procédure de paiement.",
  },
  {
    question: "La taxe foncière est-elle récupérable ?",
    answer:
      "Non, la taxe foncière n'est pas récupérable auprès du locataire, même si elle figure parmi les charges du propriétaire. Elle doit être absorbée dans le rendement global du bien et ne peut pas être ajoutée aux provisions de charges locatives.",
  },
];

function RepartitionChargesJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.rentready.fr/" },
          { "@type": "ListItem", position: 2, name: "Modèles", item: "https://www.rentready.fr/modeles" },
          { "@type": "ListItem", position: 3, name: "Répartition des Charges", item: "https://www.rentready.fr/modeles/repartition-charges" },
        ],
      },
      {
        "@type": "HowTo",
        name: "Comment faire la répartition des charges locatives",
        description: "Modèle gratuit de répartition des charges. Provisions, régularisation annuelle, justificatifs pour propriétaire et locataire.",
        step: [
          { "@type": "HowToStep", name: "Identifier les charges récupérables", text: "Listez les charges récupérables selon le décret de 1982 : eau, chauffage, ascenseur, TEOM, entretien parties communes." },
          { "@type": "HowToStep", name: "Calculer la provision mensuelle", text: "Estimez le coût annuel de chaque charge et divisez par 12. Ajoutez au loyer net la provision pour charges." },
          { "@type": "HowToStep", name: "Faire la régularisation annuelle", text: "Comparez les provisions versées aux dépenses réelles. Créez un décompte annuel avec tous les éléments." },
          { "@type": "HowToStep", name: "Envoyer le décompte au locataire", text: "Adressez le décompte annuel au locataire avec les justificatifs. Remboursez le trop-perçu ou réclamez le complément." },
        ],
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Répartition des Charges",
        mainEntity: faqData.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
  return <SchemaMarkup data={data} />;
}

export default function RepartitionChargesPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <RepartitionChargesJsonLd />
      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Hero */}
        <header className="mb-16 text-center">
          <div className="mb-4 inline-block rounded-lg bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
            Modèle gratuit — Téléchargement instantané
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Répartition des Charges Locatives
            <br />
            <span className="text-emerald-600">Provisions et Régularisation Annuelle</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Téléchargez notre modèle de répartition des charges. Provisions mensuelles, régularisation annuelle, justificatifs. Conforme loi ALUR et décret 2024.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register" className="inline-block rounded-lg bg-emerald-600 px-8 py-3.5 font-medium text-white shadow transition-colors hover:bg-emerald-700 w-full sm:w-auto">
              Utiliser avec RentReady →
            </Link>
            <Link href="/modeles" className="inline-block rounded-lg border border-stone-300 bg-white px-8 py-3.5 font-medium text-stone-700 shadow-sm transition-colors hover:bg-stone-50 w-full sm:w-auto">
              Tous les modèles →
            </Link>
          </div>
        </header>

        {/* Définition */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">La répartition des charges locatives : comment ça marche ?</h2>
          <p className="mb-4 text-stone-700">
            En location vide ou meublée, le locataire participe aux charges de la vie courante du bâtiment via des <strong>provisions mensuelles</strong>. Ces provisions sont ensuite régularisées une fois par an pour refléter les dépenses réelles.
          </p>
          <p className="mb-4 text-stone-700">
            La <strong>loi ALUR</strong> (2014) et le <strong>décret de 2024</strong> ont renforcé les obligations d'information du bailleur. Notre modèle vous aide à établir une répartition claire et conforme.
          </p>
        </section>

        {/* Types de charges */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">Les 3 types de charges en location</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {typesCharges.map((c) => (
              <div key={c.titre} className="rounded-xl border border-stone-200 bg-white p-6">
                <h3 className="mb-3 text-lg font-semibold text-stone-900">✓ {c.titre}</h3>
                <p className="text-sm text-stone-600">{c.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Modalités */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">Modalités de régularisation des charges</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {modalitesRegul.map((m) => (
              <div key={m.titre} className="flex items-start gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4">
                <span className="mt-0.5 text-emerald-600 font-bold">✓</span>
                <div>
                  <p className="font-semibold text-stone-900">{m.titre}</p>
                  <p className="text-sm text-stone-600">{m.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tableau charges */}
        <section className="mb-16 rounded-2xl bg-emerald-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">Tableau récapitulatif des charges récupérables</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-300">
                  <th className="text-left py-2 px-3 font-semibold text-stone-700">Charge</th>
                  <th className="text-left py-2 px-3 font-semibold text-stone-700">Type</th>
                  <th className="text-left py-2 px-3 font-semibold text-stone-700">Plafond</th>
                </tr>
              </thead>
              <tbody>
                {chargesList.map((c) => (
                  <tr key={c.nom} className="border-b border-stone-200 bg-white">
                    <td className="py-2 px-3 text-stone-700">{c.nom}</td>
                    <td className="py-2 px-3">
                      <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${c.type === "Récupérable" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        {c.type}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-stone-600">{c.plafond}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">Questions fréquentes sur la répartition des charges</h2>
          <div className="space-y-4">
            {faqData.map((item) => (
              <details key={item.question} className="group rounded-xl border border-stone-200 bg-white">
                <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-stone-900">
                  {item.question}
                  <span className="ml-4 text-stone-400 transition-transform group-open:rotate-180">▼</span>
                </summary>
                <div className="border-t border-stone-100 p-5 text-sm text-stone-600">{item.answer}</div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-16 rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
          <h2 className="text-2xl font-bold sm:text-3xl">Automatisez la répartition des charges avec RentReady</h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            Provisions, régularisation, décompte annuel. RentReady gère tout automatiquement pour vous. Essai gratuit 14 jours.
          </p>
          <Link href="/register" className="mt-8 inline-block rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-emerald-700">
            Essai gratuit 14 jours →
          </Link>
        </section>

        {/* Internal links */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
          <Link href="/modeles/bail-vide" className="text-blue-600 hover:underline">Bail vide →</Link>
          <Link href="/modeles/etat-des-lieux" className="text-blue-600 hover:underline">État des lieux →</Link>
          <Link href="/pricing" className="text-blue-600 hover:underline">Tarifs →</Link>
          <Link href="/modeles" className="text-blue-600 hover:underline">Tous les modèles →</Link>
        </nav>
      </article>
      <FinalCta />
    </div>
  );
}