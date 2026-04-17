import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import React from "react";
const FinalCta = dynamic(
  () => import("@/components/landing/final-cta") as unknown as Promise<React.ComponentType<unknown>>,
  { ssr: true, loading: () => <div style={{ minHeight: 400 }} aria-hidden="true" /> }
);
import { SchemaMarkup } from "@/components/seo/schema-markup";

export const metadata: Metadata = {
  title: "Modèle Congé Locataire — Gratuit | RentReady",
  description:
    "Modèle congé locataire gratuit. Donner son préavis au propriétaire : délais selon bail,怎么做信,怎么做。 Téléchargement PDF.",
  keywords: [
    "congé locataire",
    "préavis bail",
    "donner son préavis",
    "lettre départ locataire",
    "fin de location",
  ],
  openGraph: {
    title: "Modèle Congé Locataire — RentReady",
    description:
      "Modèle gratuit de congé (préavis) du locataire. Délais selon type de bail, modèle de lettre recommandée. PDF instantané.",
    type: "website",
    url: "https://www.rentready.fr/modeles/conge-locataire",
    siteName: "RentReady",
  },
  alternates: {
    canonical: "https://www.rentready.fr/modeles/conge-locataire",
  },
};

const delaisParBail = [
  { type: "Bail vide (nu)", duree: "3 mois", precision: "En zone NON tendue. Délai légal national." },
  { type: "Bail vide", duree: "1 mois", precision: "En zone tendue (encadrement des loyers actif)." },
  { type: "Bail meublé", duree: "1 mois", precision: "Quel que soit le zona géographique. Toujours 1 mois." },
  { type: "Bail mobilité", duree: "1 mois", precision: "Le locataire peut partir à tout moment avec 1 mois de préavis." },
  { type: "Bail commercial", duree: "3 ou 6 mois", precision: "Selon la durée restante. Référez-vous à votre bail." },
];

const obligationsLocataire = [
  { titre: "Délai de préavis respecté", detail: "Le locataire doit respecter le délai légal de préavis selon le type de bail." },
  { titre: "Courrier en recommandée AR", detail: "Le congé doit être envoyé par lettre recommandée avec accusé de réception." },
  { titre: "Paiement du loyer pendant le préavis", detail: "Le locataire doit continuer à payer son loyer et charges jusqu'à la fin du préavis." },
  { titre: "États des lieux de sortie", detail: "Le locataire doit demander un état des lieux de sortie et récupérer le dépôt de garantie." },
  { titre: "Facturation des charges", detail: "Les charges locatives doivent être régularisées lors du départ." },
  { titre: "Clés rendues", detail: "Toutes les clés (entrée, boîtes aux lettres, parking) doivent être rendues." },
];

const faqData = [
  {
    question: "Quel délai de préavis pour un bail vide ?",
    answer:
      "Le délai de préavis pour un bail vide est de 3 mois en zone non tendue, et de 1 mois en zone tendue (communes où l'encadrement des loyers est actif : Paris, Lille, Lyon, Bordeaux, Montpellier, etc.). Ce délai court à partir de la date de réception de la lettre par le bailleur.",
  },
  {
    question: "Le dépôt de garantie doit-il être rendu immédiatement ?",
    answer:
      "Non. Le bailleur dispose d'un délai de 2 mois à compter de l'état des lieux de sortie pour restituer le dépôt de garantie, déduction faite des sommes justifiées (impayés de loyer, charges, dégradations). En cas de retenue, le bailleur doit fournir un relevé деталей.",
  },
  {
    question: "Le locataire peut-il partir avant la fin du préavis ?",
    answer:
      "Techniquement non, sauf si le bailleur accepte de libérer le locataire plus tôt (accord amiable). Sans accord, le locataire reste tenu de payer le loyer jusqu'à la fin du préavis, même s'il n'habite plus dans le logement.",
  },
  {
    question: "Le courrier de congé doit-il être envoyé en recommandée ?",
    answer:
      "Oui. Le congé du locataire doit être envoyé par lettre recommandée avec accusé de réception, ou signifié par acte d'huissier. L'envoi en courrier simple ou en main propre n'est pas valide sur le plan juridique.",
  },
  {
    question: "Le locataire peut-il donner son préavis pendant la période d'engagement ?",
    answer:
      "Oui. Quelle que soit la durée de l'engagement initial, le locataire peut donner son préavis à tout moment. En France, il n'existe pas de 'période de engagement mínima' qui empêche le locataire de partir.",
  },
  {
    question: "Le locataire doit-il payer les frais de remise en état ?",
    answer:
      "Le locataire est tenu de rendre le logement dans l'état où il l'a reçu, compte tenu de l'usure normale. Il n'est pas tenu de payer pour l'usure normale. En revanche, il doit payer pour les dégradations qu'il a causées. Notre modèle d'état des lieux de sortie peut vous aider à comparer.",
  },
];

function CongeLocataireJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.rentready.fr/" },
          { "@type": "ListItem", position: 2, name: "Modèles", item: "https://www.rentready.fr/modeles" },
          { "@type": "ListItem", position: 3, name: "Congé Locataire", item: "https://www.rentready.fr/modeles/conge-locataire" },
        ],
      },
      {
        "@type": "HowTo",
        name: "Comment donner son congé en tant que locataire",
        description: "Modèle gratuit de congé (préavis) du locataire. Délais selon bail, lettre recommandée, état des lieux.",
        step: [
          { "@type": "HowToStep", name: "Vérifier le délai", text: "Identifiez votre type de bail pour connaître le délai de préavis applicable (1 ou 3 mois)." },
          { "@type": "HowToStep", name: "Rédiger la lettre", text: "Utilisez notre modèle en указая la date de départ souhaitée et le motif (si souhaité)." },
          { "@type": "HowToStep", name: "Envoyer en recommandée AR", text: "Envoyez la lettre en lettre recommandée avec accusé de réception. Conservez l'accusé." },
          { "@type": "HowToStep", name: "Préparer le départ", text: "Planifiez l'état des lieux de sortie, la récupération du dépôt, et la remise des clés." },
        ],
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Congé Locataire",
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

export default function CongeLocatairePage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <CongeLocataireJsonLd />
      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Hero */}
        <header className="mb-16 text-center">
          <div className="mb-4 inline-block rounded-lg bg-teal-100 px-4 py-1.5 text-sm font-medium text-teal-700">
            Modèle gratuit — Téléchargement instantané
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Modèle Congé Locataire
            <br />
            <span className="text-teal-600">Donner son Préavis au Propriétaire</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Téléchargez notre modèle de congé locataire gratuit. Préavis de 1 ou 3 mois selon votre bail.
            Lettre recommandée avec accusé de réception. Conforme loi de 1989.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-block rounded-lg bg-teal-600 px-8 py-3.5 font-medium text-white shadow transition-colors hover:bg-teal-700 w-full sm:w-auto"
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

        {/* Délais */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Délais de préavis selon votre type de bail
          </h2>
          <p className="mb-6 text-stone-700">
            Le délai de préavis dépend du type de bail et de la zone géographique. Voici les délais légaux :
          </p>
          <div className="space-y-3">
            {delaisParBail.map((d) => (
              <div key={d.type} className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-4">
                <span className="w-36 shrink-0 text-sm font-semibold text-stone-900">{d.type}</span>
                <span className="flex h-8 w-20 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-sm font-bold text-teal-700">{d.duree}</span>
                <span className="text-sm text-stone-600">{d.precision}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Obligations */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Obligations du locataire lors du départ
          </h2>
          <p className="mb-6 text-stone-700">
            Voici les 6 obligations principales du locataire qui donne son congé :
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {obligationsLocataire.map((o) => (
              <div key={o.titre} className="flex items-start gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4">
                <span className="mt-0.5 text-teal-600 font-bold">✓</span>
                <div>
                  <p className="font-semibold text-stone-900">{o.titre}</p>
                  <p className="text-xs text-stone-600">{o.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Modèle de lettre */}
        <section className="mb-16 rounded-2xl bg-stone-900 px-6 py-14 text-white shadow-lg">
          <div className="max-w-3xl mx-auto">
            <h2 className="mb-4 text-xl font-bold text-white">
              Modèle de lettre de congé
            </h2>
            <p className="mb-6 text-stone-300">
              Voici le modèle de courrier à envoyer en lettre recommandée avec accusé de réception :
            </p>
            <div className="rounded-xl border border-stone-700 bg-stone-800 p-6 font-mono text-sm text-stone-300">
              <p className="mb-2 font-bold text-white">[Votre nom et adresse]</p>
              <p className="mb-2">[Code postal, Ville]</p>
              <p className="mb-2">Le [date]</p>
              <p className="mb-4 mt-4">[Nom du propriétaire / gérance]</p>
              <p className="mb-2">[Adresse du propriétaire / gérance]</p>
              <p className="mb-4 mt-4">
                <strong>Objet : Congé — Logement [adresse complète]</strong>
              </p>
              <p className="mb-4">
                Madame, Monsieur,
              </p>
              <p className="mb-4">
                Par la présente, je vous informe de mon intention de mettre fin au bail
                concernant le logement situé [adresse complète du logement], à compter
                du [date de départ souhaitée — respectez le délai de préavis].
              </p>
              <p className="mb-4">
                Je vous prie de trouver ci-joint une copie de ce courrier aux fins de
                notification, et vous demande de bien vouloir organiser un état des lieux
                de sortie à votre convenance.
              </p>
              <p className="mb-4">
                Je reste à votre disposition pour coordonner la remise des clés.
              </p>
              <p className="mb-4">Cordialement,</p>
              <p className="font-bold text-white">[Votre signature]</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Questions fréquentes sur le congé locataire
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
        <section className="mb-16 rounded-2xl bg-teal-50 px-6 py-14 text-center shadow-lg">
          <h2 className="text-2xl font-bold text-stone-900 sm:text-3xl">
            Gérez votre départ locatif avec RentReady
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-700">
            Calcul de votre préavis, génération de la lettre, état des lieux de sortie, suivi du dépôt de garantie. Tout pour un départ serein.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-teal-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-teal-700"
          >
            Essai gratuit 14 jours →
          </Link>
        </section>

        {/* Internal links */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
          <Link href="/modeles/etat-des-lieux" className="text-blue-600 hover:underline">État des lieux →</Link>
          <Link href="/modeles/quittance-de-loyer" className="text-blue-600 hover:underline">Quittance →</Link>
          <Link href="/pricing" className="text-blue-600 hover:underline">Tarifs →</Link>
          <Link href="/modeles" className="text-blue-600 hover:underline">Tous les modèles →</Link>
        </nav>
      </article>
      <FinalCta />
    </div>
  );
}
