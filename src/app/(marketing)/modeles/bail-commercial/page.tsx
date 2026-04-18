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
  title: "Modèle Bail Commercial — Gratuit | RentReady",
  description:
    "Modèle bail commercial gratuit. Location professionnelle, bail 3-6-9 ans, clause résolution, charges locatives. Téléchargement PDF.",
  keywords: [
    "bail commercial",
    "contrat location professionnelle",
    "bail 3-6-9 ans",
    "loyer commercial",
    "charges locatives commerciales",
  ],
  openGraph: {
    title: "Modèle Bail Commercial — RentReady",
    description:
      "Modèle gratuit de bail commercial. Location professionnelle 3-6-9 ans, charges et maintenance. PDF instantané.",
    type: "website",
    url: "https://www.rentready.fr/modeles/bail-commercial",
    siteName: "RentReady",
  },
  robots: { index: true, follow: true },
  
  alternates: {
    canonical: "https://www.rentready.fr/modeles/bail-commercial",
  },
};

const typesBailCommercial = [
  {
    titre: "Bail de 3 ans (bail précaire)",
    description:
      "Durée minimale légale. Le bailleur peut reprendre le local à tout moment après 3 ans avec un préavis de 6 mois. Adapté aux locations temporaires ou test.",
  },
  {
    titre: "Bail de 6 ans",
    description:
      "Durée intermediaire. Le locataire peut résilier à tout moment après 3 ans avec un préavis de 6 mois. Bon équilibre entre sécurité et flexibilité.",
  },
  {
    titre: "Bail de 9 ans (bail loi 89)",
    description:
      "Durée légale maximale. Le locataire peut résilier à tout moment après chaque période triennale (tous les 3 ans) avec un préavis de 6 mois. Maximum de sécurité pour le locataire.",
  },
];

const chargesRepartition = [
  { categorie: "Charges récupérer par le bailleur", details: "Taxe foncière, assurance immeuble, entretienASC, gestion, travauxmins", repartition: "Proportionnelle à la surface louée" },
  { categorie: "Charges du locataire", details: "Consommations personnelles (eau, électricité, téléphone)", repartition: "100% locataire" },
  { categorie: "Travaux de maintenance", details: "Petites réparations,-Menuiserie, plomberie courante", repartition: "Locataire" },
  { categorie: "Gros travaux", details: "Ravalement, toiture, fondations,结构", repartition: "Bailleur" },
];

const faqData = [
  {
    question: "Quelle est la durée minimale d'un bail commercial ?",
    answer:
      "La durée minimale est de 3 ans. Un bail inférieur à 3 ans est qualifié de 'bail précaire' et ne bénéficie pas du statut de la commerciale. Il est cependant possible de signer un bail de courte durée (1 mois à 3 ans) mais sans les protections du statut commercial.",
  },
  {
    question: "Le locataire commercial peut-il résilier en cours de bail ?",
    answer:
      "Pour un bail de 9 ans, le locataire peut résilier à chaque période triennale (tous les 3 ans) avec un préavis de 6 mois. Pour un bail de 6 ans, la même règle s'applique après 3 ans. Pour un bail de 3 ans, le locataire est engagé jusqu'au terme.",
  },
  {
    question: "Quelles charges le bailleur commercial peut-il récupérer ?",
    answer:
      "Le bailleur peut récupérer la taxe foncière, les primes d'assurance, les frais de gestion, l'entretien des parties communes et les petits travaux de maintenance via les charges locatives. Attention : les charges doivent être justifiées et ne pas inclure les dépenses personnelles du propriétaire.",
  },
  {
    question: "La clause d'indexation du loyer est-elle obligatoire ?",
    answer:
      "Non, la clause d'indexation n'est pas obligatoire mais fortement recommandée. En son absence, le loyer reste fixe pendant toute la durée du bail. Avec une clause, le loyer peut être révisé annuellement selon un indice de référence (ILC, ILAT, ou indice communal).",
  },
  {
    question: "Peut-on signer un bail commercial sans bail de ключвые clauses ?",
    answer:
      "Non, le bail commercial doit imperatively contenir certaines clauses pour être valide : l'identité des parties, la description du bien, le montant du loyer, la durée, et la clause de solidarité si applicable. Sans ces éléments, le bail peut être déclaré nul.",
  },
];

function BailCommercialJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.rentready.fr/" },
          { "@type": "ListItem", position: 2, name: "Modèles", item: "https://www.rentready.fr/modeles" },
          { "@type": "ListItem", position: 3, name: "Bail Commercial", item: "https://www.rentready.fr/modeles/bail-commercial" },
        ],
      },
      {
        "@type": "HowTo",
        name: "Comment rédiger un bail commercial",
        description: "Modèle gratuit de bail commercial. Bail 3-6-9 ans, charges locatives, indexation, clause résolutoire.",
        step: [
          { "@type": "HowToStep", name: "Choisir la durée", text: "Définissez la durée du bail (3, 6 ou 9 ans). Ce choix impacte les droits de résiliation du locataire." },
          { "@type": "HowToStep", name: "Définir le loyer", text: "Fixez le montant du loyer, la périodicité (mensuel, trimestriel), et la clause d'indexation." },
          { "@type": "HowToStep", name: "Lister les charges", text: "Définissez précisément quelles charges sont à la charge du locataire." },
          { "@type": "HowToStep", name: "Signer le bail", text: "Signez le bail en 2 exemplaires (+ 1 pour le greffe si bail enregistré)." },
        ],
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Bail Commercial",
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

export default function BailCommercialPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <BailCommercialJsonLd />
      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Hero */}
        <header className="mb-16 text-center">
          <div className="mb-4 inline-block rounded-lg bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-700">
            Modèle gratuit — Professionnels
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Modèle Bail Commercial
            <br />
            <span className="text-amber-600">Location Professionnelle 3-6-9 ans</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Téléchargez notre modèle de bail commercial gratuit. Bail professionnel 3-6-9 ans, charges locatives, indexation, clauses obligatoires.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-block rounded-lg bg-amber-600 px-8 py-3.5 font-medium text-white shadow transition-colors hover:bg-amber-700 w-full sm:w-auto"
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

        {/* Types de bail */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Les 3 durées de bail commercial
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {typesBailCommercial.map((t) => (
              <div key={t.titre} className="rounded-xl border border-stone-200 bg-white p-6">
                <h3 className="mb-3 text-lg font-semibold text-stone-900">✓ {t.titre}</h3>
                <p className="text-sm text-stone-600">{t.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Charges */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Répartition des charges dans un bail commercial
          </h2>
          <p className="mb-6 text-stone-700">
            La répartition des charges entre bailleur et locataire commercial doit être clairement définie dans le bail. Voici la répartition standard :
          </p>
          <div className="space-y-4">
            {chargesRepartition.map((c) => (
              <div key={c.categorie} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-stone-900">{c.categorie}</p>
                  <span className="rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">{c.repartition}</span>
                </div>
                <p className="text-sm text-stone-600">{c.details}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Clause indexation */}
        <section className="mb-16 rounded-2xl bg-amber-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Clause d'indexation du loyer commercial
          </h2>
          <p className="mb-4 text-stone-700">
            La clause d'indexation permet de faire évoluer le loyer en fonction de l'indice officiel. Without this clause, the rent remains fixed throughout the lease.
          </p>
          <div className="rounded-xl border border-stone-200 bg-white p-6">
            <p className="mb-2 font-semibold text-stone-900">Indices utilisés pour le bail commercial :</p>
            <ul className="space-y-1 text-sm text-stone-700">
              <li>• <strong>ILC</strong> — Indice des Loyers Commerciaux (INSEE) — plus courant</li>
              <li>• <strong>ILAT</strong> — Indice des Loyers des Activités Tertiaires</li>
              <li>• <strong>Indice communal</strong> — parfois utilisé en zone franche</li>
            </ul>
          </div>
          <p className="mt-4 text-sm text-stone-500">
            💡 Notre modèle inclut par défaut une clause d'indexation basée sur l'ILC. L'indice est mis à jour automatiquement avec les données INSEE.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Questions fréquentes sur le bail commercial
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
            Générez vos baux commerciaux avec RentReady
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            Gestion locative commerciale : suivi des paiements, indexation automatique, alertes de renouvellement. Essai gratuit 14 jours.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-amber-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-amber-700"
          >
            Essai gratuit 14 jours →
          </Link>
        </section>

        {/* Internal links */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
          <Link href="/pricing" className="text-blue-600 hover:underline">Tarifs →</Link>
          <Link href="/modeles" className="text-blue-600 hover:underline">Tous les modèles →</Link>
          <Link href="/blog" className="text-blue-600 hover:underline">Blog →</Link>
        </nav>
      </article>
      <FinalCta />
    </div>
  );
}
