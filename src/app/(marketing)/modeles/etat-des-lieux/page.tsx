import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import React from "react";
// Dynamic import: FinalCta uses framer-motion (heavy, below-fold)
const FinalCta = dynamic(
  () => import("@/components/landing/final-cta") as unknown as Promise<React.ComponentType<unknown>>,
  { ssr: true, loading: () => <div style={{minHeight:400}} aria-hidden="true" /> }
);
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { baseMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  return baseMetadata({
    title: "Modèle État des Lieux — Gratuit | RentReady",
    description: "Téléchargez notre modèle détat des lieux gratuit et conforme. Document officiel pour inventorier le logement au début et fin de bail.",
    url: "/modeles/etat-des-lieux",
    ogType: "template",
  });
}
;

const contenuObligatoire = [
  "Date de réalisation (entrée ou sortie)",
  "Identité du bailleur et du locataire",
  "Adresse complète du bien",
  "État de chaque pièce : murs, sols, plafonds, fenêtres, portes",
  "Équipements présents : électricité, gaz, plomberie, appareils",
  "Type et état des meubles (pour meublé)",
  "Relevé des compteurs (électricité, gaz, eau)",
  "Signature des deux parties",
];

const erreursAViter = [
  "Ne pas décrire l'état de dégradation présent",
  "Oublier de noter l'absence de clé ou d'équipement",
  "Ne pas faire de photo de l'état des lieux",
  "Ne pas faire signer le document par le locataire",
  "Utiliser des termes vagues (« état correct », « bon état ») sans précision",
  "Ne pas comparer l'état de sortie avec l'état d'entrée",
  "Ne pas relever les compteurs le jour de l'entrée ou de la sortie",
];

const faqData = [
  {
    question:
      "L'état des lieux est-il obligatoire en France ?",
    answer:
      "Oui, l'état des lieux est obligatoire depuis la loi du 6 juillet 1989, aussi bien à l'entrée qu'à la sortie du locataire. Il doit être établi lors de la mise en location (entrée) et lors de la restitution des clés (sortie). Un état des lieux établi par huissier a valeur probante renforcée mais reste optionnel.",
  },
  {
    question:
      "Quelle est la différence entre l'état des lieux d'entrée et de sortie ?",
    answer:
      "L'état des lieux d'entrée documente l'état du bien au moment où le locataire prend possession des lieux. Il sert de référence pour évaluer les éventuelles dégradations lors du départ. L'état des lieux de sortie compare l'état actuel du bien avec celui de l'entrée : les dégradations, la usure normale (niveau d'usure) sont distinguées des véritables dommages.",
  },
  {
    question:
      "Peut-on réaliser l'état des lieux seul ou faut-il passer par un professionnel ?",
    answer:
      "L'état des lieux peut être réalisé par le bailleur ou le locataire lui-même, ou par un agent immobilier. Il n'est pas obligatoire de passer par un professionnel. Cependant, un état des lieux réalisé par un huissier offre une meilleure protection juridique en cas de litige, car il a valeur d'acte authentique.",
  },
];

function ETatDesLieuxJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.rentready.fr/" },
          { "@type": "ListItem", position: 2, name: "Modèles", item: "https://www.rentready.fr/modeles" },
          { "@type": "ListItem", position: 3, name: "État des lieux", item: "https://www.rentready.fr/modeles/etat-des-lieux" },
        ],
      },
      {
        "@type": "HowTo",
        name: "Comment réaliser un état des lieux conforme",
        description:
          "Guide pour rédiger un état des lieux valide pour la mise en location ou la restitution d'un bien immobilier.",
        step: [
          {
            "@type": "HowToStep",
            name: "Préparer le document",
            text: "Imprimez le modèle d'état des lieux et préparez un appareil photo.",
          },
          {
            "@type": "HowToStep",
            name: "Inspecter chaque pièce",
            text: "Visitez chaque pièce en notant l'état des murs, sols, plafonds, fenêtres et portes.",
          },
          {
            "@type": "HowToStep",
            name: "Relevé des compteurs",
            text: "Notez les index des compteurs d'électricité, gaz et eau.",
          },
          {
            "@type": "HowToStep",
            name: "Signature et photos",
            text: "Faites signer le document par les deux parties et joignez les photos.",
          },
        ],
        tool: {
          "@type": "SoftwareApplication",
          name: "RentReady",
          url: "https://www.rentready.fr",
        },
      },
      {
        "@type": "Article",
        name: "Modèle État des Lieux Gratuit — RentReady",
        description:
          "Modèle d'état des lieux gratuit et conforme. État des lieux entrée/sortie avec checklist complète.",
        author: {
          "@type": "Organization",
          name: "RentReady",
          url: "https://www.rentready.fr",
        },
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Modèle État des Lieux",
        mainEntity: faqData.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
  return <SchemaMarkup data={data} />;
}

export default function ETatDesLieuxPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <ETatDesLieuxJsonLd />

      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Hero */}
        <header className="mb-16 text-center">
          <div className="inline-block rounded-lg bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 mb-4">
            Modèle gratuit — Téléchargement instantané
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Modèle État des Lieux
            <br />
            <span className="text-blue-600">Gratuit et Conforme</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Téléchargez notre modèle d'état des lieux gratuit et conforme à la
            loi. État des lieux entrée и sortie, checklist complète, ready à
            personnaliser.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-block rounded-lg bg-blue-600 px-8 py-3.5 font-medium text-white shadow transition-colors hover:bg-blue-700 w-full sm:w-auto"
            >
              Créer mon état des lieux →
            </Link>
            <Link
              href="/blog/charges-locatives-guide-complet"
              className="inline-block rounded-lg border border-stone-300 bg-white px-8 py-3.5 font-medium text-stone-700 shadow-sm transition-colors hover:bg-stone-50 w-full sm:w-auto"
            >
              Guide sur les charges
            </Link>
          </div>
        </header>

        {/* Lead */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Qu'est-ce qu'un état des lieux ?
          </h2>
          <p className="mb-4 text-stone-700">
            L'état des lieux est un документ observant l'état d'un bien immobilier
            lors de la mise en location (entrée) и lors de la restitution des clés
            (sortie). Il Permet de comparer l'état du bien entre ces deux moments
            pour déterminer éventuelles dégradations imputables au locataire.
          </p>
          <p className="text-stone-700">
            Obligatoire depuis la{" "}
            <strong>loi du 6 juillet 1989</strong>, l'état des lieux doit être
            réalisé de manière contradictoire (bailleur et locataire ensemble) et
            signé par les deux parties. En cas de désaccord, un huissier peut être
            thérapeut.
          </p>
        </section>

        {/* Contenu obligatoire */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Contenu obligatoire de l'état des lieux
          </h2>
          <p className="mb-6 text-stone-600">
            Un état des lieux doit contenir les éléments suivants pour être
            juridiquement valide :
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {contenuObligatoire.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-xl border border-stone-200 bg-white p-4"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                  {index + 1}
                </div>
                <span className="text-sm text-stone-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Entrée vs sortie */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            État des lieux entrée vs sortie : comment comparer ?
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-stone-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-bold text-stone-900">
                📥 Estado de lieu d'entrée
              </h3>
              <p className="mb-4 text-sm text-stone-700">
                L'état des lieux d'entrée documente l'état initial du bien lors de
                la mise en location. Il constitue la référence de départ pour
                toute évaluation future de dégradations.
              </p>
              <ul className="space-y-2 text-sm text-stone-700">
                <li>• Décrire chaque pièce в деталях</li>
                <li>• Noter les équipements présents</li>
                <li>• Relevé précis des compteurs</li>
                <li>• Joindre des фотографии datées</li>
                <li>• Faire signer par les deux parties</li>
              </ul>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-bold text-stone-900">
                📤 État des lieux de sortie
              </h3>
              <p className="mb-4 text-sm text-stone-700">
                L'état des lieux de sortie est compare à celui d'entrée. Seules les
                dégradations allez-delà de l'usure normale donnent lieu à
                préjudiciaire.
              </p>
              <ul className="space-y-2 text-sm text-stone-700">
                <li>• Comparer chaque élément avec l'entrée</li>
                <li>• Distinguer usure normale vs dégâts</li>
                <li>• Nouveau relevé des compteurs</li>
                <li>• Photos de sortie imprescindible</li>
                <li>• Calcul des retenu sur le dépôt</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Erreurs fréquentes */}
        <section className="mb-16 rounded-2xl border border-red-200 bg-red-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            ⚠️ Erreurs fréquentes à éviter
          </h2>
          <p className="mb-6 text-stone-700">
            Un état des lieux mal rédigés peut vous coûter cher en cas de litige.
            Voici les erreurs les plus courante à éviter :
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {erreursAViter.map((erreur, index) => (
              <div
                key={index}
                className="flex items-start gap-2 rounded-lg bg-white p-3"
              >
                <span className="text-red-500">✗</span>
                <span className="text-sm text-stone-700">{erreur}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Qui peut réaliser */}
        <section className="mb-16 rounded-2xl bg-blue-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Qui peut réaliser l'état des lieux ?
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-stone-200 bg-white p-5">
              <div className="mb-3 text-3xl">🏠</div>
              <h3 className="mb-2 text-base font-semibold text-stone-900">
                Le propriétaire
              </h3>
              <p className="text-sm text-stone-600">
                Le bailleur peut réaliser seul ou avec le locataire. Gratuit, mais
                valeur probante limitée en cas de litige.
              </p>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white p-5">
              <div className="mb-3 text-3xl">🤝</div>
              <h3 className="mb-2 text-base font-semibold text-stone-900">
                Le locataire
              </h3>
              <p className="text-sm text-stone-600">
                Le locataire peut exiger un état des lieux et peut refuser de
                signer un document incomplet ou inexact.
              </p>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white p-5">
              <div className="mb-3 text-3xl">⚖️</div>
              <h3 className="mb-2 text-base font-semibold text-stone-900">
                L'huissier
              </h3>
              <p className="text-sm text-stone-600">
                Recommandé en cas de doute. Acte authentique，具有法律约束力
                force probante. Coût partagé entre les parties.
              </p>
            </div>
          </div>
        </section>

        {/* Notre modèle */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Utiliser notre modèle gratuit d'état des lieux
          </h2>
          <p className="mb-6 text-stone-700">
            Notre modèle d'état des lieux est gratuit, conforme à la loi du 6
            juillet 1989 et à la loi Elan. Complet avec checklist pièce par
            pièce, guide de photo, et modèle de comparaison entrée/sortie.
          </p>
          <ul className="mb-6 grid gap-3">
            {[
              "✓ Checklist complète pièce par pièce",
              "✓ Champs pour photos intégrées",
              "✓ Relevé de compteurs.inclus",
              "✓ Modèle de comparaison entrée/sortie",
              "✓ Export PDF prêt à signer",
              "✓ Archivage automatique avec RentReady",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-stone-700">
                <span className="text-emerald-600">{item.split(" ")[0]}</span>
                <span>{item.substring(2)}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
            >
              Utiliser le modèle gratuit →
            </Link>
            <Link
              href="/modeles/contrat-de-location"
              className="inline-block rounded-lg border border-stone-300 bg-white px-6 py-3 font-medium text-stone-700 shadow-sm transition-colors hover:bg-stone-50"
            >
              Voir aussi le modèle de bail →
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Questions fréquentes sur l'état des lieux
          </h2>
          <div className="space-y-4">
            {faqData.map((item) => (
              <details
                key={item.question}
                className="group rounded-xl border border-stone-200 bg-white"
              >
                <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-stone-900">
                  {item.question}
                  <span className="ml-4 text-stone-400 transition-transform group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <div className="border-t border-stone-100 p-5 text-sm text-stone-600">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="mb-16 rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Réalisez votre état des lieux en 5 minutes
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            Modèle gratuit, checklist complète, photos intégrées. Conforme et
            prêt à signer.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
          >
            Commencer gratuitement →
          </Link>
        </section>

        {/* Internal links */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
          <Link href="/bail" className="text-blue-600 hover:underline">
            Gestion des baux →
          </Link>
          <Link href="/quittances" className="text-blue-600 hover:underline">
            Quittances →
          </Link>
          <Link href="/blog" className="text-blue-600 hover:underline">
            Blog →
          </Link>
          <Link href="/pricing" className="text-blue-600 hover:underline">
            Tarifs →
          </Link>
        </nav>
      </article>

      <FinalCta />
    </div>
  );
}
