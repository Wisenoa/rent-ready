import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import React from "react";
const FinalCta = dynamic(
  () => import("@/components/landing/final-cta") as unknown as Promise<React.ComponentType<unknown>>,
  { ssr: true, loading: () => <div style={{ minHeight: 400 }} aria-hidden="true" /> }
);
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { baseMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  return baseMetadata({
    title: "Modèle Bail Vide — Gratuit | RentReady",
    description: "Téléchargez notre modèle de bail vide gratuit et conforme au droit français. Bail résidentiel pour location non meublée avec clauses obligatoires.",
    url: "/modeles/bail-vide",
    ogType: "template",
  });
}
;

const caracteristiquesBailVide = [
  {
    titre: "Durée de 3 ans",
    description:
      "Le bail vide (non meublé) est conclu pour une durée de 3 ans minimum. Il est reconduit tacitement si aucune des parties ne donne congé.",
  },
  {
    titre: "Pas de meubles",
    description:
      "Le logement doit être vide de tout meuble. Il doit comporter les équipements nécessaires à la vie quotidienne mais sans mobilier.",
  },
  {
    titre: "Révision annuelle du loyer",
    description:
      "Le loyer peut être révisé chaque année selon la variation de l'IRL (Indice de Référence des Loyers). Sans clause de révision, le loyer reste fixe.",
  },
  {
    titre: "Dépôt de garantie",
    description:
      "Le dépôt de garantie est limité à 1 mois de loyer hors charges. Il doit être restitué dans les 2 mois après l'état des lieux de sortie.",
  },
  {
    titre: "Charges locatives",
    description:
      "Les charges sont récupérables sur le locataire selon les modalités définies dans le bail. Commonly called 'charges locatives' or 'provisions sur charges'.",
  },
  {
    titre: "Congé avec 6 mois de préavis",
    description:
      "Pour le bailleur : préavis de 6 mois (3 mois en zone tendue). Pour le locataire : préavis de 3 mois (1 mois en zone tendue ou bail meublé).",
  },
];

const obligationsBailleur = [
  { titre: "Remettre un logement décent", detail: "Le logement doit répondre aux critères de décence : surface minimum (9m² ou volume 20m³), installations électriques et de gaz aux normes." },
  { titre: "Délivrer le Diagnostic de Performance Énergétique (DPE)", detail: "Le DPE doit être remis au locataire avant la signature du bail. Un logement avec une note F ou G peut être interdit à la location." },
  { titre: "Assurer le remboursement de la caution", detail: "Le dépôt de garantie doit être restitué dans les 2 mois après l'état des lieux, déduction faite des sommes justifiées." },
  { titre: "Garantir la jouissance paisible", detail: "Le bailleur doit garantir le locataire contre tout trouble de voisinage et assurer l'entretien lourd du logement." },
];

const obligationsLocataire = [
  { titre: "Payer le loyer et les charges", detail: "Le locataire doit payer le loyer et les charges dans les délais prévus. En cas d'impayé, le bailleur peut engager une procédure." },
  { titre: "Utiliser le logement en bon père de famille", detail: "Le logement doit être utilisé conformément à sa destination (résidence principale). Pas d'activité commerciale sans accord." },
  { titre: "Entretenir le logement", detail: "Le locataire assure l'entretien courant et les petites réparations. L'usure normale est acceptée." },
  { titre: "Laisser l'assurance multirisque", detail: "Le locataire doit être assuré contre les risques locatifs pendant toute la durée du bail. Une attestation est requise." },
];

const faqData = [
  {
    question: "Quelle est la durée minimale d'un bail vide ?",
    answer:
      "La durée minimale d'un bail vide est de 3 ans pour les particuliers bailleurs. Pour les personnes morales (SCI, entreprise), la durée peut être de 6 ans. Le bail est reconduit tacitement à son terme si aucune partie ne donne congé.",
  },
  {
    question: "Le bailleur peut-il augmenter le loyer chaque année ?",
    answer:
      "Oui, mais seulement si le bail contient une clause de révision. Without this clause, the rent is fixed for the entire duration. With a revision clause, the increase cannot exceed the variation of the IRL (Indice de Référence des Loyers) published quarterly by INSEE.",
  },
  {
    question: "Le dépôt de garantie est-il obligatoire et combien ?",
    answer:
      "Le dépôt de garantie n'est pas obligatoire mais est fortement recommandé. Son montant est plafonné à 1 mois de loyer hors charges (2 mois pour les mobiliers). Il doit être restitué dans les 2 mois suivant l'état des lieux de sortie.",
  },
  {
    question: "Le locataire peut-il sous-louer ?",
    answer:
      "Non, le locataire en bail vide ne peut pas sous-louer sans l'accord préalable et écrit du bailleur. En cas de sous-location non autorisée, le bailleur peut demander la résiliation du bail.",
  },
  {
    question: "Quand le bailleur peut-il donner congé ?",
    answer:
      "Le bailleur peut donner congé à l'échéance du bail (avec un préavis de 6 mois, soit 3 mois en zone tendue) pour : reprise du logement, vente, ou motif légitime et sérieux. Le congé doit être envoyé en lettre recommandée avec accusé de réception.",
  },
  {
    question: "Le locataire en bail vide peut-il faire des travaux ?",
    answer:
      "Le locataire ne peut pas faire de travaux lourds ou de modification sans l'accord du bailleur. En revanche, il a le droit de faire des travaux d'aménagement léger (peinture, papier peint) sans autorisation, mais doit remettre le logement en état au départ si les travaux ne sont pas标准的.",
  },
];

function BailVideJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.rentready.fr/" },
          { "@type": "ListItem", position: 2, name: "Modèles", item: "https://www.rentready.fr/modeles" },
          { "@type": "ListItem", position: 3, name: "Bail Vide", item: "https://www.rentready.fr/modeles/bail-vide" },
        ],
      },
      {
        "@type": "HowTo",
        name: "Comment rédiger un bail vide",
        description: "Modèle gratuit de bail vide (non meublé). Location résidentielle 3 ans, révision IRL, obligations,congés.",
        step: [
          { "@type": "HowToStep", name: "Préparer le Dossier DDT", text: "Rassemblez le DPE, diagnostic électrique, gaz, ERP, et état des risques. Tous obligatoires avant signature." },
          { "@type": "HowToStep", name: "Vérifier les conditions", text: "Confirmez que le logement est conforme : surface minimum 9m², décence énergétique, installations aux normes." },
          { "@type": "HowToStep", name: "Rédiger le bail", text: "Complétez le modèle en указая le montant du loyer, les charges, le dépôt de garantie, et les clauses de révision." },
          { "@type": "HowToStep", name: "Signer le bail", text: "Signez le bail en 2 exemplaires (+ 1 pour l'enregistrement). Remettez un exemplaire au locataire." },
        ],
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Bail Vide",
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

export default function BailVidePage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <BailVideJsonLd />
      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Hero */}
        <header className="mb-16 text-center">
          <div className="mb-4 inline-block rounded-lg bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700">
            Modèle gratuit — Téléchargement instantané
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Modèle Bail Vide
            <br />
            <span className="text-indigo-600">Location Non Meublée Résidentielle</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Téléchargez notre modèle de bail vide gratuit. Location non meublée 3 ans, révision IRL, obligations du bailleur et du locataire.
            Conforme loi de 1989 et décret décence.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-block rounded-lg bg-indigo-600 px-8 py-3.5 font-medium text-white shadow transition-colors hover:bg-indigo-700 w-full sm:w-auto"
            >
              Utiliser avec RentReady →
            </Link>
            <Link
              href="/modeles"
              className="inline-block rounded-lg border border-stone-300 bg-white px-8 py-3.5 font-medium text-stone-700 shadow-sm transition-colors hover:bg-stone-50 w-full sm:w-auto"
            >
              Tous les modèles →
            </Link>
          </div>
        </header>

        {/* Définition */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Le bail vide : c'est quoi ?
          </h2>
          <p className="mb-4 text-stone-700">
            Le <strong>bail vide</strong> (aussi appelé bail non meublé) est le contrat de location résidentielle le plus courant en France. Il concerne les logements loués <strong>sans mobilier</strong>, c'est-à-dire des biens dans lesquels le locataire apporte ses propres meubles et effets personnels.
          </p>
          <p className="mb-4 text-stone-700">
            La durée minimale est de <strong>3 ans</strong> pour les particuliers bailleurs. Le bail est tacitement reconduit à son échéance sauf si l'une des parties donne congé dans les formes légales.
          </p>
          <div className="mt-6 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
            <p className="text-sm text-stone-700">
              <strong>💡 Bail vide vs bail meublé :</strong> Le bail meublé offre plus de flexibilité (1 mois de préavis pour le locataire) mais exige que le logement soit entièrement équipé. Le bail vide offre plus de sécurité juridique pour le bailleur mais impose un préavis de 3 mois au locataire.
            </p>
          </div>
        </section>

        {/* Caractéristiques */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Les 6 caractéristiques clés du bail vide
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {caracteristiquesBailVide.map((c) => (
              <div key={c.titre} className="rounded-xl border border-stone-200 bg-white p-6">
                <h3 className="mb-3 text-lg font-semibold text-stone-900">✓ {c.titre}</h3>
                <p className="text-sm text-stone-600">{c.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Obligations du bailleur */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Obligations du bailleur en bail vide
          </h2>
          <p className="mb-6 text-stone-700">
            Le bailleur en location vide doit respecter des obligations légales strictes. Notre modèle de bail intègre automatiquement ces exigences :
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {obligationsBailleur.map((o) => (
              <div key={o.titre} className="flex items-start gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4">
                <span className="mt-0.5 text-indigo-600 font-bold">✓</span>
                <div>
                  <p className="font-semibold text-stone-900">{o.titre}</p>
                  <p className="text-sm text-stone-600">{o.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Obligations du locataire */}
        <section className="mb-16 rounded-2xl bg-indigo-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Obligations du locataire en bail vide
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {obligationsLocataire.map((o) => (
              <div key={o.titre} className="flex items-start gap-3 rounded-xl border border-stone-200 bg-white p-4">
                <span className="mt-0.5 text-indigo-600 font-bold">✓</span>
                <div>
                  <p className="font-semibold text-stone-900">{o.titre}</p>
                  <p className="text-sm text-stone-600">{o.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Documents obligatoires */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Documents obligatoires pour signer un bail vide
          </h2>
          <p className="mb-6 text-stone-700">
            Le bailleur doit remettre plusieurs documents au locataire avant la signature du bail. Ces documents font partie du Dossier de Diagnostics Techniques (DDT) :
          </p>
          <ul className="space-y-2 text-sm text-stone-700">
            <li>• <strong>DPE</strong> — Diagnostic de Performance Énergétique (obligatoire depuis 2006)</li>
            <li>• <strong>Constat de risque d'exposition au plomb</strong> — CREP (pour les bâtiments antérieurs à 1949)</li>
            <li>• <strong>État des risques et pollutions</strong> — ERP / ERNMT (inondation, séisme, pollution)</li>
            <li>• <strong>Diagnostic amiante</strong> — pour les bâtiments antérieurs à 1997</li>
            <li>• <strong>Surface habitable</strong> — Loi Boutin (obligatoire depuis 2009)</li>
            <li>• <strong>Diagnostic gaz et électricité</strong> — pour les installations de plus de 15 ans</li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Questions fréquentes sur le bail vide
          </h2>
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
          <h2 className="text-2xl font-bold sm:text-3xl">
            Générez vos baux vides avec RentReady
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            Bail vide, gestion des révisions IRL, suivi des congés, dépôt de garantie. Tout pour une gestion locative sereine. Essai gratuit 14 jours.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-indigo-700"
          >
            Essai gratuit 14 jours →
          </Link>
        </section>

        {/* Internal links */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
          <Link href="/modeles/contrat-de-location" className="text-blue-600 hover:underline">Bail standard →</Link>
          <Link href="/modeles/bail-mobilite" className="text-blue-600 hover:underline">Bail mobilité →</Link>
          <Link href="/modeles/bail-colocation" className="text-blue-600 hover:underline">Bail colocation →</Link>
          <Link href="/pricing" className="text-blue-600 hover:underline">Tarifs →</Link>
          <Link href="/modeles" className="text-blue-600 hover:underline">Tous les modèles →</Link>
        </nav>
      </article>
      <FinalCta />
    </div>
  );
}
