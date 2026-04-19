import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import React from "react";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { baseMetadata } from "@/lib/seo/metadata";

const FinalCta = dynamic(
  () => import("@/components/landing/final-cta") as unknown as Promise<React.ComponentType<unknown>>,
  { ssr: true, loading: () => <div style={{ minHeight: 400 }} aria-hidden="true" /> }
);

export async function generateMetadata() {
  return baseMetadata({
    title: "Protocole État des Lieux — Guide Complet et Formulaire | RentReady",
    description: "Protocol officiel détat des lieux. Document de référence pour inventorier le logement au démarrage et à la fin de la période de location.",
    url: "/modeles/protocol-etat-des-lieux",
    ogType: "template",
  });
}
;

const etapesProtocole = [
  {
    titre: "Préparation du dossier",
    description:
      "Rassemblez les documents : bail en cours, précédent état des lieux, photos, diagnostics. Préparez le matériel : check-list imprimée, appareil photo, mètre laser.",
  },
  {
    titre: "Inspection pièce par pièce",
    description:
      "Parcourez chaque pièce dans le même ordre : entrées, séjour, cuisines, chambres, salle de bain, WC, balcon, parking. Notez systématiquement l'état des murs, sols, plafonds, fenêtres, équipements.",
  },
  {
    titre: "Documentation photographique",
    description:
      "Photographiez chaque pièce sous 3 angles minimum. Focalisez sur les zones à risque : murs, coins, équipements, joints, serrures. Horodatez toutes les photos.",
  },
  {
    titre: "Rédaction des observations",
    description:
      "Notez précisément chaque defect ou usure avec description textuelle. Distinguez ' état normal ' vs ' usure anormale ' vs ' defect '. Utilisez des termes factuels sans jugement.",
  },
  {
    titre: "Signature du document",
    description:
      "Les deux parties (bailleur et locataire) signent l'état des lieux. Chaque party reçoit un exemplaire. La signature peut être électronique avec accord des deux parties.",
  },
  {
    titre: "Conservation des preuves",
    description:
      "Conservez le document signé pendant au moins 2 ans après la fin du bail. Les photos font office de preuves en cas de litige. Stockez-les de manière sécurisée.",
  },
];

const zonesInspection = [
  { piece: "Entrée", elements: ["Mur et plafond", "Sols et revêtements", "Portes et serrures", "Interrupteurs et prises", "Boîte aux lettres"] },
  { piece: "Séjour / Salon", elements: ["Murs et papiers peints", "Sols et parquets", "Fenêtres et vitrages", "Volets et stores", "Prises électriques", "Chauffage"] },
  { piece: "Cuisine", elements: ["Équipements (plaques, four, réfrigérateur)", "Plans de travail", "Meubles de rangement", "Robinetterie", "Sols"] },
  { piece: "Chambres", elements: ["État des murs", "Sols (parquet, moquette)", "Fenêtres et double vitrage", "Garnitures de fenêtres", "Ampoules et prises"] },
  { piece: "Salle de bain", elements: ["Douche ou baignoire", "Robinetterie", "Carrelage et joints", "Équipements (WC, lavabo)", "VMC et ventilation"] },
  { piece: "Balcon / Terrasse", elements: ["Sols et gardiennage", "Garde-corps", "Menuiseries", "Éclairage"] },
];

const faqData = [
  {
    question: "Le protocole d'état des lieux est-il obligatoire ?",
    answer:
      "L'état des lieux est obligatoire depuis la loi ALUR de 2014. Il doit être établi jointly par le bailleur et le locataire lors de l'entrée dans le logement (état des lieux d'entrée) et lors de la sortie (état des lieux de sortie). Un protocole clair permet d'éviter les litiges sur la restitution du dépôt de garantie.",
  },
  {
    question: "Peut-on faire l'état des lieux soi-même sans professionnel ?",
    answer:
      "Oui, l'état des lieux peut être établi par les deux parties sans faire appel à un professionnel. Cependant, notre protocole guide vous permet de ne rien oublier. En cas de litige, un état des lieux réalisé seul a la même valeur juridique qu'un état réalisé par un professionnel, à condition d'être contradictoire.",
  },
  {
    question: "Comment protéger le dépôt de garantie avec le protocole ?",
    answer:
      "Le protocole d'état des lieux constitue la preuve de l'état du logement à l'entrée. Conservez-le précieusement avec les photos. En cas de contestation à la sortie, comparez l'état de sortie avec l'état d'entrée pour distinguer usure normale et dégradations. Le dépôt doit être restitué dans les 2 mois sauf justificatifs de dégradations.",
  },
  {
    question: "Combien de temps conserver l'état des lieux ?",
    answer:
      "Conservez l'état des lieux d'entrée et de sortie pendant au minimum 2 ans après la fin du bail. Les dégradations peuvent être réclamées pendant cette période. Les photos doivent être conservées au minimum 2 ans également pour servir de preuves.",
  },
  {
    question: "L'état des lieux peut-il être fait sur smartphone ?",
    answer:
      "Oui, l'état des lieux peut être réalisé sur smartphone ou tablette avec un outil dédié comme RentReady. Les avantages : signature électronique, photos horodatées, transmission instantanée aux deux parties. L'état des lieux numériques a la même valeur juridique qu'un document papier s'il est signé par les deux parties.",
  },
  {
    question: "Que faire si le locataire refuse de signer l'état des lieux ?",
    answer:
      "Si le locataire refuse de signer, vous pouvez lui envoyer l'état des lieux par lettre recommandée avec accusé de réception. Conservez la preuve de l'envoi. Sans contradicteur, l'état des lieux peut être contesté plus facilement. Il est préférable de faire un état des lieux contradictoire même si une partie est réticente.",
  },
];

function ProtocolEtatDesLieuxJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.rentready.fr/" },
          { "@type": "ListItem", position: 2, name: "Modèles", item: "https://www.rentready.fr/modeles" },
          { "@type": "ListItem", position: 3, name: "Protocole État des Lieux", item: "https://www.rentready.fr/modeles/protocol-etat-des-lieux" },
        ],
      },
      {
        "@type": "HowTo",
        name: "Comment realizar un état des lieux conforme",
        description: "Protocole gratuit d'état des lieux. Check-list pièce par pièce, photos commentées, signature électronique.",
        step: [
          { "@type": "HowToStep", name: "Préparer le dossier", text: "Rassemblez le bail, les précédents documents, l'appareil photo. Imprimez la check-list RentReady." },
          { "@type": "HowToStep", name: "Inspecter chaque pièce", text: "Parcourez le logement pièce par pièce, notez l'état de chaque élément avec description précise." },
          { "@type": "HowToStep", name: "Prendre des photos horodatées", text: "Photographiez chaque zone sous plusieurs angles. Horodatez automatiquement les clichés." },
          { "@type": "HowToStep", name: "Rédiger et signer", text: "Complétez le protocole avec les observations, faites signer les deux parties. Remettez un exemplaire." },
        ],
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Protocole État des Lieux",
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

export default function ProtocolEtatDesLieuxPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <ProtocolEtatDesLieuxJsonLd />
      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Hero */}
        <header className="mb-16 text-center">
          <div className="mb-4 inline-block rounded-lg bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-700">
            Modèle gratuit — Téléchargement instantané
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Protocole État des Lieux
            <br />
            <span className="text-amber-600">Guide Complet et Check-list PDF</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Utilisez notre protocole d'état des lieux détaillé pour une inspection complète et sans oubli. Check-list pièce par pièce, documentation photo, signature électronique.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register" className="inline-block rounded-lg bg-amber-600 px-8 py-3.5 font-medium text-white shadow transition-colors hover:bg-amber-700 w-full sm:w-auto">
              Utiliser avec RentReady →
            </Link>
            <Link href="/modeles" className="inline-block rounded-lg border border-stone-300 bg-white px-8 py-3.5 font-medium text-stone-700 shadow-sm transition-colors hover:bg-stone-50 w-full sm:w-auto">
              Tous les modèles →
            </Link>
          </div>
        </header>

        {/* Définition */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">Pourquoi utiliser un protocole d'état des lieux ?</h2>
          <p className="mb-4 text-stone-700">
            Le <strong>protocole d'état des lieux</strong> est un guide méthodique pour réaliser une inspection complète du logement. Il vous permet de documenter l'état du bien de manière objective et contradictoire, protégeant à la fois le bailleur et le locataire.
          </p>
          <p className="mb-4 text-stone-700">
            En cas de litige à la sortie, le protocole comparé avec l'état des lieux d'entrée permet de déterminer précisément les dégradations et d'ajuster la restitution du dépôt de garantie en conséquence.
          </p>
        </section>

        {/* Étapes */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">Les 6 étapes du protocole d'état des lieux</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {etapesProtocole.map((e, i) => (
              <div key={e.titre} className="rounded-xl border border-stone-200 bg-white p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-lg font-bold text-amber-700">
                  {i + 1}
                </div>
                <h3 className="mb-3 text-lg font-semibold text-stone-900">{e.titre}</h3>
                <p className="text-sm text-stone-600">{e.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Zones d'inspection */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">Zones d'inspection pièce par pièce</h2>
          <p className="mb-6 text-stone-700">Utilisez cette check-list pour ne rien oublier lors de l'inspection :</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {zonesInspection.map((z) => (
              <div key={z.piece} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                <h3 className="mb-2 font-semibold text-stone-900">{z.piece}</h3>
                <ul className="space-y-1">
                  {z.elements.map((el) => (
                    <li key={el} className="flex items-start gap-2 text-sm text-stone-600">
                      <span className="text-amber-600">•</span> {el}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Comparaison entrée/sortie */}
        <section className="mb-16 rounded-2xl bg-amber-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">État des lieux d'entrée vs de sortie</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-stone-200 bg-white p-6">
              <h3 className="mb-3 font-semibold text-emerald-700">✓ État des lieux d'entrée</h3>
              <ul className="space-y-2 text-sm text-stone-600">
                <li>• Établi jointly à la remise des clés</li>
                <li>• Documente l'état initial du logement</li>
                <li>• Sert de référence pour la comparaison</li>
                <li>• Photos horodatées de chaque pièce</li>
                <li>• Signature des deux parties obligatoire</li>
              </ul>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white p-6">
              <h3 className="mb-3 font-semibold text-amber-700">✓ État des lieux de sortie</h3>
              <ul className="space-y-2 text-sm text-stone-600">
                <li>• Établi lors de la restitution des clés</li>
                <li>• Comparé avec l'état d'entrée</li>
                <li>• Identifie les dégradations (vs usure normale)</li>
                <li>• Détermine les sommes à déduire du dépôt</li>
                <li>• Restitution du dépôt dans les 2 mois</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">Questions fréquentes sur le protocole d'état des lieux</h2>
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
          <h2 className="text-2xl font-bold sm:text-3xl">Générez vos états des lieux avec RentReady</h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            État des lieux interactif, signature électronique, photos intégrées. Protocole complet pour protéger votre dépôt de garantie. Essai gratuit 14 jours.
          </p>
          <Link href="/register" className="mt-8 inline-block rounded-lg bg-amber-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-amber-700">
            Essai gratuit 14 jours →
          </Link>
        </section>

        {/* Internal links */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
          <Link href="/modeles/etat-des-lieux" className="text-blue-600 hover:underline">État des lieux →</Link>
          <Link href="/modeles/bail-vide" className="text-blue-600 hover:underline">Bail vide →</Link>
          <Link href="/pricing" className="text-blue-600 hover:underline">Tarifs →</Link>
          <Link href="/modeles" className="text-blue-600 hover:underline">Tous les modèles →</Link>
        </nav>
      </article>
      <FinalCta />
    </div>
  );
}