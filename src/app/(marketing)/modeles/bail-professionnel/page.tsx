import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import React from "react";
import { SchemaMarkup } from "@/components/seo/schema-markup";

const FinalCta = dynamic(
  () => import("@/components/landing/final-cta") as unknown as Promise<React.ComponentType<unknown>>,
  { ssr: true, loading: () => <div style={{ minHeight: 400 }} aria-hidden="true" /> }
);

export const metadata: Metadata = {
  title: "Modèle Bail Professionnel — Contrat Location Commerciale 2026 | RentReady",
  description: "Téléchargez notre modèle de bail professionnel gratuit. Contrat conforme au droit français, clauses essentielles et annexes pour location professionnelle.",
  keywords: [
    "bail professionnel",
    "bail commercial",
    "location commerciale",
    "contrat bail professionnel",
    "bail 3 ans",
    "loyer commercial",
  ],
  openGraph: {
    title: "Modèle Bail Professionnel — RentReady",
    description:
      "Modèle gratuit de bail professionnel. Location commerciale 3-6 ans, révision, résiliation. Conforme statut des baux commerciaux.",
    type: "website",
    url: "https://www.rentready.fr/modeles/bail-professionnel",
    siteName: "RentReady",
    images: [{ url: "https://www.rentready.fr/og-image.png", width: 1200, height: 630, alt: "Bail Professionnel" }],
  },
  robots: { index: true, follow: true },
  
  alternates: { canonical: "https://www.rentready.fr/modeles/bail-professionnel" },
};

const caracteristiques = [
  {
    titre: "Durée de 3 à 6 ans",
    description:
      "Le bail professionnel est conclu pour une durée minimale de 6 ans (3 ans pour les professions libérales). La tacite reconduction s'applique sauf congé donné 6 mois avant l'échéance.",
  },
  {
    titre: "Destiné aux professions libérales",
    description:
      "Le bail professionnel concerne les professions libérales : avocats, médecins, consultants, architectes, notaires, experts-comptables, et autres activités non commerciales réglementées.",
  },
  {
    titre: "Loyer librement négocié",
    description:
      "Le loyer du bail professionnel n'est pas encadré par la loi de 1989. Les parties fixent librement le montant, avec possibilité de révision selon une clause contractuelle.",
  },
  {
    titre: "Charges et travaux",
    description:
      "Le bail indique clairement la répartition des charges (entrepreneuriales,locatives, gros travaux). En bail professionnel, le locataire assume plus de travaux qu'en bail commercial.",
  },
  {
    titre: "Résiliation avec 3 mois de préavis",
    description:
      "Le locataire peut donner congé à tout moment avec un préavis de 3 mois. Le bailleur doit attendre l'échéance du bail pour récupérer le local.",
  },
  {
    titre: "Droit de cession du bail",
    description:
      "Le locataire professionnel peut céder son bail ou sous-louer avec l'accord du bailleur. La cession est souvent encadrée par une clause d'agrément.",
  },
];

const obligationsBailleur = [
  { titre: "Délivrer un local conforme", detail: "Le bailleur doit livrer un local conforme à sa destination, avec les autorisations administratives nécessaires à l'exercice de l'activité professionnelle." },
  { titre: "Garantir la jouissance paisible", detail: "Le bailleur garantit le locataire contre tout trouble de jouissance, notamment les difficultés liées à la destination du local." },
  { titre: "Entretenir les gros travaux", detail: "Le bailleur assure les grosses réparations structurelles : toiture, façade, fondations, installations structurelles." },
];

const obligationsLocataire = [
  { titre: "Exploiter personnellement le local", detail: "Le locataire doit exercer lui-même son activité professionnelle dans les lieux. L'exploitation par un tiers nécessite un accord préalable." },
  { titre: "Payer le loyer et les charges", detail: "Le loyer et les charges sont payés aux dates convenues. Le défaut de paiement peut entrainer la résiliation du bail." },
  { titre: "Restituer le local en bon état", detail: "En fin de bail, le locataire doit rendre les lieux en bon état de réparation locative, compte tenu de l'usure normale." },
];

const faqData = [
  {
    question: "Quelle est la différence entre bail professionnel et bail commercial ?",
    answer:
      "Le bail commercial concerne les activités commerciales (commerces, restaurants, ateliers). Le bail professionnel concerne les professions libérales (avocats, médecins, consultants). Le bail commercial offre plus de protection au locataire avec le droit de reprise et l'encadrement du loyer. Le bail professionnel est plus flexible avec un préavis de 3 mois pour le locataire.",
  },
  {
    question: "Le bailleur peut-il augmenter librement le loyer ?",
    answer:
      "Non, l'augmentation du loyer en bail professionnel doit être prévue par une clause de révision. À défaut de clause, le loyer reste fixe pendant toute la durée du bail. Si une clause existe, l'augmentation ne peut pas dépasser la variation de l'ILC (Indice des Loyers Commerciaux) ou de l'IRL selon le type de bail.",
  },
  {
    question: "Le locataire professionnel peut-il céder son bail ?",
    answer:
      "Oui, le locataire professionnel peut céder son bail avec l'accord préalable et écrit du bailleur. Une clause d'agrément dans le bail peut conditionner la cession à l'approbation du bailleur. La demande doit être faite par lettre recommandée avec accusé de réception.",
  },
  {
    question: "Quand le locataire peut-il donner congé ?",
    answer:
      "Le locataire en bail professionnel peut donner congé à tout moment, avec un préavis minimum de 3 mois. Le congé doit être notifié par lettre recommandée avec accusé de réception ou par acte d'huissier.",
  },
  {
    question: "Le bailleur peut-il refuser la cession du bail ?",
    answer:
      "Le bailleur peut refuser la cession uniquement si le bail contient une clause d'agrément prévoyant un motif légitime et sérieux de refus. Sans clause, le bailleur ne peut pas s'opposer à la cession mais doit être informé et donner son accord écrit.",
  },
  {
    question: "Quelles assurances pour le locataire professionnel ?",
    answer:
      "Le locataire professionnel doit généralement souscrire une assurance multirisque professionnelle et une assurance responsabilité civile professionnelle. Ces assurances couvrent les dommages aux biens, la responsabilité civile et les risques locatifs.",
  },
];

function BailProfessionnelJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.rentready.fr/" },
          { "@type": "ListItem", position: 2, name: "Modèles", item: "https://www.rentready.fr/modeles" },
          { "@type": "ListItem", position: 3, name: "Bail Professionnel", item: "https://www.rentready.fr/modeles/bail-professionnel" },
        ],
      },
      {
        "@type": "HowTo",
        name: "Comment rédiger un bail professionnel",
        description: "Modèle gratuit de bail professionnel pour professions libérales. Durée 6 ans, préavis 3 mois, révision libre du loyer.",
        step: [
          { "@type": "HowToStep", name: "Vérifier la destination du local", text: "Confirmez que le local est autorisé pour l'activité professionnelle visée. Vérifiez les autorisations d'urbanisme et ERP." },
          { "@type": "HowToStep", name: "Définir les conditions financières", text: "Fixez le montant du loyer, la périodicité (mensuel, trimestriel), les charges, le dépôt de garantie éventuel." },
          { "@type": "HowToStep", name: "Rédiger le bail avec clauses", text: "Incluez la clause de révision, la clause de cession, les conditions d'assurance et les modalités de résiliation." },
          { "@type": "HowToStep", name: "Signer en 2 exemplaires", text: "Signez le bail en autant d'exemplaires que de parties. Remettez un exemplaire au locataire pour notification." },
        ],
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Bail Professionnel",
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

export default function BailProfessionnelPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <BailProfessionnelJsonLd />
      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Hero */}
        <header className="mb-16 text-center">
          <div className="mb-4 inline-block rounded-lg bg-teal-100 px-4 py-1.5 text-sm font-medium text-teal-700">
            Modèle gratuit — Téléchargement instantané
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Modèle Bail Professionnel
            <br />
            <span className="text-teal-600">Location pour Professions Libérales</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Téléchargez notre modèle de bail professionnel gratuit. Contrats de location commerciale pour professions libérales, durée 6 ans, préavis 3 mois, révision libre du loyer.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register" className="inline-block rounded-lg bg-teal-600 px-8 py-3.5 font-medium text-white shadow transition-colors hover:bg-teal-700 w-full sm:w-auto">
              Utiliser avec RentReady →
            </Link>
            <Link href="/modeles" className="inline-block rounded-lg border border-stone-300 bg-white px-8 py-3.5 font-medium text-stone-700 shadow-sm transition-colors hover:bg-stone-50 w-full sm:w-auto">
              Tous les modèles →
            </Link>
          </div>
        </header>

        {/* Définition */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">Le bail professionnel : c'est quoi ?</h2>
          <p className="mb-4 text-stone-700">
            Le <strong>bail professionnel</strong> est le contrat de location destiné aux professions libérales et aux activités non commerciales. Il concerne notamment les avocats, médecins, architectes, experts-comptables, consultants, notaires et autres métiers réglementés.
          </p>
          <p className="mb-4 text-stone-700">
            La durée minimale est de <strong>6 ans</strong> pour les activités commerciales légères et de <strong>3 ans</strong> pour les professions libérales strictes. Le locataire peut donner congé à tout moment avec un préavis de 3 mois.
          </p>
          <div className="mt-6 rounded-xl border border-teal-200 bg-teal-50 p-4">
            <p className="text-sm text-stone-700">
              <strong>⚠️ Bail professionnel vs Bail commercial :</strong> Le bail commercial offre plus de protection au locataire avec le droit au bail et l'encadrement du loyer. Le bail professionnel offre plus de flexibilité au locataire avec un préavis de 3 mois uniquement. Choisissez selon votre situation.
            </p>
          </div>
        </section>

        {/* Caractéristiques */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">Les 6 caractéristiques clés du bail professionnel</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {caracteristiques.map((c) => (
              <div key={c.titre} className="rounded-xl border border-stone-200 bg-white p-6">
                <h3 className="mb-3 text-lg font-semibold text-stone-900">✓ {c.titre}</h3>
                <p className="text-sm text-stone-600">{c.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Obligations */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">Obligations du bailleur en bail professionnel</h2>
          <p className="mb-6 text-stone-700">Le bailleur en location professionnelle doit respecter des obligations essentielles :</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {obligationsBailleur.map((o) => (
              <div key={o.titre} className="flex items-start gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4">
                <span className="mt-0.5 text-teal-600 font-bold">✓</span>
                <div>
                  <p className="font-semibold text-stone-900">{o.titre}</p>
                  <p className="text-sm text-stone-600">{o.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 rounded-2xl bg-teal-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">Obligations du locataire professionnel</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {obligationsLocataire.map((o) => (
              <div key={o.titre} className="flex items-start gap-3 rounded-xl border border-stone-200 bg-white p-4">
                <span className="mt-0.5 text-teal-600 font-bold">✓</span>
                <div>
                  <p className="font-semibold text-stone-900">{o.titre}</p>
                  <p className="text-sm text-stone-600">{o.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Documents */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">Documents à rassembler pour le bail professionnel</h2>
          <p className="mb-6 text-stone-700">Avant de signer un bail professionnel, vérifiez que tous les documents sont en ordre :</p>
          <ul className="space-y-2 text-sm text-stone-700">
            <li>• <strong>Autorisation d'exercice</strong> — Justificatif d'inscription à l'ordre professionnel ou diplôme</li>
            <li>• <strong>Conformité du local</strong> — Autorisation d'urbanisme, ERP (Établissement Recevant du Public)</li>
            <li>• <strong>DPE</strong> — Diagnostic de Performance Énergétique (obligatoire)</li>
            <li>• <strong>État des risques</strong> — ERP (inondation, séisme, pollution) obligatoire</li>
            <li>• <strong>Diagnostic technique</strong> — Amiante, plomb selon l'âge du bâtiment</li>
            <li>• <strong>Surface habitable</strong> — Mesure selon la Loi Boutin pour les bureaux</li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">Questions fréquentes sur le bail professionnel</h2>
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
          <h2 className="text-2xl font-bold sm:text-3xl">Gérez vos baux professionnels avec RentReady</h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            Suivi des baux, révisions de loyer, résiliations, cession. Tout pour une gestion locative professionnelle sereine. Essai gratuit 14 jours.
          </p>
          <Link href="/register" className="mt-8 inline-block rounded-lg bg-teal-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-teal-700">
            Essai gratuit 14 jours →
          </Link>
        </section>

        {/* Internal links */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
          <Link href="/modeles/bail-commercial" className="text-blue-600 hover:underline">Bail commercial →</Link>
          <Link href="/modeles/bail-vide" className="text-blue-600 hover:underline">Bail vide →</Link>
          <Link href="/pricing" className="text-blue-600 hover:underline">Tarifs →</Link>
          <Link href="/modeles" className="text-blue-600 hover:underline">Tous les modèles →</Link>
        </nav>
      </article>
      <FinalCta />
    </div>
  );
}
