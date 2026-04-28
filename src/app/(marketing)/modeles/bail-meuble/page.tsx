import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import React from "react";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { baseMetadata } from "@/lib/seo/metadata";

const FinalCta = dynamic(
  () => import("@/components/landing/final-cta").then((mod) => mod.FinalCta),
  { loading: () => <div style={{ minHeight: 400 }} aria-hidden="true" /> }
);

export async function generateMetadata() {
  return baseMetadata({
    title:
      "Modèle Bail Meublé 2026 — Gratuit & Conforme Loi 1989 | RentReady",
    description:
      "Téléchargez le modèle bail meublé gratuit et conforme à la loi de 1989. Bail 1 an résidence principale, inventaire mobilier intégré, dépôt de garantie. PDF instantané.",
    url: "/modeles/bail-meuble",
    ogType: "template",
  });
}

const caracteristiques = [
  {
    titre: "Durée de 1 an renouvelable",
    description:
      "Le bail meublé est conclu pour une durée minimum de 1 an. Il est renouvelable tacitement par période de 1 an si aucune partie ne donne congé au moins 3 mois avant l'échéance.",
  },
  {
    titre: "Logement meublé et équipé",
    description:
      "Le logement doit être équipé de tous les mobiliers nécessaires à une vie quotidienne normale : literie, électroménager, ustensiles de cuisine, place de cuisson, réfrigérateur, etc.",
  },
  {
    titre: "Dépôt de garantie limité",
    description:
      "Le dépôt de garantie pour un bail meublé est plafonné à 2 mois de loyer hors charges (contre 1 mois pour le bail vide en zone tendue).",
  },
  {
    titre: "Inventaire du mobilier",
    description:
      "Un état des lieux d'entrée avec inventaire du mobilier doit être établi de manière contradictoire. Il décrit chaque élément mobilier avec son état.",
  },
  {
    titre: "Loyer librement fixé",
    description:
      "Le loyer du bail meublé est librement négocié entre les parties. Il peut être révisé chaque année selon une clause de révision contractuelle.",
  },
  {
    titre: "Obligation de résultat du bailleur",
    description:
      "Le bailleur en location meublée est soumis à une obligation de résultat concernant la conformité du logement et des équipements.",
  },
];

const equipementsObligatoires = [
  "Literie avec couette ou couverture",
  "Plaques de cuisson (gaz ou électrique)",
  "Réfrigérateur ou freezer",
  "Ustensiles de cuisine (casseroles, plats, couverts)",
  "Table et chaises",
  "Étagères de rangement",
  "Luminaires",
  "Matériel d'entretien ménager",
];

const obligationsBailleur = [
  { titre: "Livrer un logement meublé conforme", detail: "Le bailleur doit livrer le logement avec tous les équipements requis par le décret. Le logement doit être conforme aux normes de décence." },
  { titre: "Garantir le droit de jouissance", detail: "Le bailleur garantit le locataire contre tout trouble de jouissance lié à un defect du logement ou des équipements." },
  { titre: "Assurer les grosses réparations", detail: "Les grosses réparations (structure, couverture, facade) sont à la charge du propriétaire bailleur." },
  { titre: "Délivrer un état des lieux inventaire", detail: "Un état des lieux d'entrée détaillé avec inventaire du mobilier doit être établi pour documenter l'état de chaque equipment." },
];

const obligationsLocataire = [
  { titre: "User paisiblement du logement", detail: "Le locataire doit user du logement en bon père de famille, l'entretenir et le rendre en bon état à la fin du bail." },
  { titre: "Signaler les defects rapidement", detail: "Le locataire doit signaler au bailleur tout defect ou besoin de réparation dans un délai raisonnable." },
  { titre: "Restituer le mobilier en bon état", detail: "En fin de bail, le locataire doit restituer tous les équipements listés dans l'inventaire avec une usure normale." },
  { titre: "Souscrire une assurance", detail: "Le locataire meublé doit généralement souscrire une assurance multirisque habitation avec extension risques locatifs." },
];

const faqData = [
  {
    question: "Quelle est la différence entre un bail meublé et un bail vide ?",
    answer:
      "Le bail meublé concerne les logements équipés de mobiliers permettant au locataire de s'y installer immédiatement. Il dure minimum 1 an (renouvelable), contre 3 ans minimum pour le bail vide. Le dépôt de garantie est de 2 mois en meublé vs 1 mois en vide. Le bail meublé offre une durée plus courte et plus de flexibilité.",
  },
  {
    question: "Le bailleur peut-il donner congé à son locataire meublé ?",
    answer:
      "Oui, le bailleur peut donner congé à la fin de la période initiale ou renouvelée, avec un préavis de 3 mois. Le congé doit être motivé : soit reprise du logement pour habiter, soit vente, soit motif légitime et sérieux. Sans motif, le congé est nul.",
  },
  {
    question: "Le locataire peut-il résilier le bail meublé avant la fin ?",
    answer:
      "Oui, le locataire peut donner congé à tout moment avec un préavis de 1 mois (contre 3 mois en bail vide). Ce préavis plus court offre plus de flexibilité au locataire meublé.",
  },
  {
    question: "Quels équipements sont obligatoires dans un logement meublé ?",
    answer:
      "Le décret de 2015 impose une liste précise : literie, plaque de cuisson, réfrigérateur, ustensiles de cuisine, table et chaises, étagères, luminaires, matériel d'entretien. L'absence d'un équipement obligatoire peut entraîner la requalification en bail vide.",
  },
  {
    question: "Le dépôt de garantie en bail meublé est-il récupérable ?",
    answer:
      "Oui, le dépôt de garantie de 2 mois maximum est restitué au locataire dans les 2 mois suivant la remise des clés, déduction faite des éventuelles dégradations. En cas de litige sur l'état du mobilier, le bailleur doit prouver la dégradations.",
  },
  {
    question: "Le bail meublé peut-il être reconduit automatiquement ?",
    answer:
      "Oui, le bail meublé se reconduit tacitement pour des périodes de 1 an sauf si l'une des parties donne congé dans les formes légales (lettre recommandée avec accusé de réception) au moins 3 mois avant l'échéance.",
  },
];

function BailMeubleJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.rentready.fr/" },
          { "@type": "ListItem", position: 2, name: "Modèles", item: "https://www.rentready.fr/modeles" },
          { "@type": "ListItem", position: 3, name: "Bail Meublé", item: "https://www.rentready.fr/modeles/bail-meuble" },
        ],
      },
      {
        "@type": "HowTo",
        name: "Comment rédiger un bail meublé conforme",
        description: "Modèle gratuit de bail meublé pour location de résidence principale. Durée 1 an, inventaire mobilier, préavis 1 mois pour le locataire.",
        step: [
          { "@type": "HowToStep", name: "Vérifier l'équipement du logement", text: "Confirmez que le logement contient tous les équipements obligatoires selon le décret de 2015 avant de proposer un bail meublé." },
          { "@type": "HowToStep", name: "Établir l'inventaire du mobilier", text: "Listez chaque meuble et équipement avec son état. Cet inventaire sera annexé au bail et servira de référence pour la restitution." },
          { "@type": "HowToStep", name: "Rédiger le bail avec les clauses obligatoires", text: "Incluez la clause de révision, la clause de restitution, les conditions d'assurance et les modalités de préavis." },
          { "@type": "HowToStep", name: "Signer et échanger les exemplaires", text: "Signez le bail en 2 exemplaires minimum. Remettez un exemplaire au locataire dès la remise des clés." },
        ],
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Bail Meublé",
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

export default function BailMeublePage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <BailMeubleJsonLd />
      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Hero */}
        <header className="mb-16 text-center">
          <div className="mb-4 inline-block rounded-lg bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700">
            Modèle gratuit — Téléchargement instantané
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Modèle Bail Meublé
            <br />
            <span className="text-indigo-600">Location Meublée Résidence Principale</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Téléchargez notre modèle de bail meublé gratuit. Location meublée résidence principale, durée 1 an renouvelable, inventaire mobilier intégré.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register" className="inline-block rounded-lg bg-indigo-600 px-8 py-3.5 font-medium text-white shadow transition-colors hover:bg-indigo-700 w-full sm:w-auto">
              Utiliser avec RentReady →
            </Link>
            <Link href="/modeles" className="inline-block rounded-lg border border-stone-300 bg-white px-8 py-3.5 font-medium text-stone-700 shadow-sm transition-colors hover:bg-stone-50 w-full sm:w-auto">
              Tous les modèles →
            </Link>
          </div>
        </header>

        {/* Définition */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">Le bail meublé : c'est quoi ?</h2>
          <p className="mb-4 text-stone-700">
            Le <strong>bail meublé</strong> est un contrat de location d'un logement équipé de tous les mobiliers nécessaires à la vie quotidienne. Il doit être Residence principale du locataire et respecter des critères stricts d'équipement définis par le <strong>décret de 2015</strong>.
          </p>
          <p className="mb-4 text-stone-700">
            Sa durée est de <strong>1 an minimum</strong> (contre 3 ans pour le bail vide), et le locataire peut donner congé avec seulement <strong>1 mois de préavis</strong> — ce qui en fait une formule plus flexible.
          </p>
          <div className="mt-6 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
            <p className="text-sm text-stone-700">
              <strong>⚠️ Équipement minimum obligatoire :</strong> Le logement doit contenir au minimum : literie, plaques de cuisson, réfrigérateur, ustensiles de cuisine, table, chaises, étagères, luminaires. Sans ces équipements, le bail peut être requalifié en bail vide.
            </p>
          </div>
        </section>

        {/* Caractéristiques */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">Les 6 caractéristiques clés du bail meublé</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {caracteristiques.map((c) => (
              <div key={c.titre} className="rounded-xl border border-stone-200 bg-white p-6">
                <h3 className="mb-3 text-lg font-semibold text-stone-900">✓ {c.titre}</h3>
                <p className="text-sm text-stone-600">{c.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Équipements */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">Liste des équipements obligatoires en location meublée</h2>
          <p className="mb-6 text-stone-700">Selon le décret du 5 novembre 2015, le logement meublé doit inclure :</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {equipementsObligatoires.map((e) => (
              <div key={e} className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2">
                <span className="text-indigo-600 font-bold">✓</span>
                <span className="text-sm text-stone-700">{e}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Obligations */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">Obligations du bailleur en location meublée</h2>
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

        <section className="mb-16 rounded-2xl bg-indigo-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">Obligations du locataire en bail meublé</h2>
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

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">Questions fréquentes sur le bail meublé</h2>
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
          <h2 className="text-2xl font-bold sm:text-3xl">Gérez vos baux meublés avec RentReady</h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            Inventaire mobilier, suivi du dépôt de garantie, état des lieux. Tout pour vos locations meublées. Essai gratuit 14 jours.
          </p>
          <Link href="/register" className="mt-8 inline-block rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-indigo-700">
            Essai gratuit 14 jours →
          </Link>
        </section>

        {/* Internal links */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
          <Link href="/modeles/bail-vide" className="text-blue-600 hover:underline">Bail vide →</Link>
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
