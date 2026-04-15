import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Modèle État des Lieux Gratuit 2026 — Checklist Conforme Décret 2015",
  description:
    "Modèle d'état des lieux gratuit et conforme au décret du 29 mai 2015. Checklist pièce par pièce, photos intégrées, comparez entrée et sortie.",
  keywords: [
    "etat des lieux",
    "modele etat des lieux",
    "checklist location",
    "etat des lieux entree sortie",
    "decret 29 mai 2015",
  ],
  openGraph: {
    title: "Modèle État des Lieux 2026 — RentReady",
    description:
      "État des lieux gratuit et conforme. Téléchargez la checklist pièce par pièce. Comparez entrée et sortie.",
    type: "website",
    url: "https://www.rentready.fr/templates/etat-des-lieux",
    siteName: "RentReady",
  },
  alternates: {
    canonical: "https://www.rentready.fr/templates/etat-des-lieux",
  },
};

const rooms = [
  { name: "Entrée", items: ["Mur / Plâtre", "Plafond", "Sol / Revêtement", "Porte", "Interrupteur", "Prises électriques"] },
  { name: "Séjour", items: ["Mur / Plâtre", "Plafond", "Sol / Parquet", "Fenêtres", "Volets", "Radiateur", "Prises TV/Tel"] },
  { name: "Cuisine", items: ["Mur / Carrelage", "Plafond", "Sol / Carrelage", "Meubles hauts", "Plan de travail", "Évier", "Plaque de cuisson"] },
  { name: "Chambre 1", items: ["Mur / Peinture", "Plafond", "Sol / Moquette", "Fenêtre", "Volets", "Radiateur", "Placard"] },
  { name: "Salle de bain", items: ["Mur / Carrelage", "Sol / Carrelage", "Lavabo", "Douche/Baignoire", "WC", "Ventilation"] },
  { name: "Toilettes", items: ["Mur", "Sol", "WC", "Lavabo"] },
];

const faqData = [
  {
    question: "L'état des lieux est-il obligatoire ?",
    answer:
      "Oui. L'état des lieux est obligatoire depuis la loi du 6 juillet 1989 pour toute location. Il doit être réalisé lors de l'entrée et de la sortie du locataire. Un état des lieux incomplet peut entraîner des litiges importants.",
  },
  {
    question: "Comment faire un état des lieux gratuit ?",
    answer:
      "Utilisez notre modèle gratuit : téléchargez la checklist, remplissez-la pièce par pièce ennotant l'état de chaque élément (neuf, bon état, état moyen, mauvais état, à rafraîchir), joignez des photos datées, puis faites signer les deux parties.",
  },
  {
    question: "Quelle est la différence entre état des lieux d'entrée et de sortie ?",
    answer:
      "L'état des lieux d'entrée décrit le logement tel qu'il est remis au locataire. L'état des lieux de sortie compare l'état du logement à la fin de la location avec l'état d'entrée. Les différences constatées permettent de justifier éventuelles retenues sur le dépôt de garantie.",
  },
  {
    question: "Qui paie l'état des lieux ?",
    answer:
      "L'état des lieux d'entrée est généralement payant s'il est réalisé par un expert (mais gratuit enDIY). La loi n'oblige pas à passer par un professionnel. Un état des lieux réalisé conjointement entre propriétaire et locataire est totalement légal.",
  },
];

const orgSchema = {
  "@type": "Organization",
  "@id": "https://www.rentready.fr/#organization",
  name: "RentReady",
  url: "https://www.rentready.fr",
  logo: "https://www.rentready.fr/logo.png",
  description:
    "Logiciel de gestion locative automatisée pour propriétaires bailleurs indépendants en France.",
  sameAs: [
    "https://twitter.com/rentready_fr",
    "https://www.linkedin.com/company/rentready",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "contact@rentready.fr",
    availableLanguage: "French",
  },
};
const webSiteSchema = {
  "@type": "WebSite",
  "@id": "https://www.rentready.fr/#website",
  name: "RentReady",
  url: "https://www.rentready.fr",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.rentready.fr/recherche?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

function EtatuDesLieuxJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      orgSchema,
      webSiteSchema,
      {
        "@type": "WebPage",
        name: "Modèle État des Lieux 2026 — RentReady",
        description:
          "Modèle d'état des lieux gratuit et conforme au décret du 29 mai 2015. Checklist pièce par pièce.",
        url: "https://www.rentready.fr/templates/etat-des-lieux",
        isPartOf: {
          "@type": "WebSite",
          name: "RentReady",
          url: "https://www.rentready.fr",
        },
      },
      {
        "@type": "FAQPage",
        name: "FAQ — État des Lieux",
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
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function EtatuDesLieuxPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <EtatuDesLieuxJsonLd />

      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <header className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
            📋 État des lieux
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Modèle d'État des Lieux
            <br />
            <span className="text-purple-600">Gratuit &amp; Conforme 2026</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Checklist complète pour un état des lieux recevable. Pièce par
            pièce, comparez entrée et sortie, joignez des photos, téléchargez
            en PDF.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-purple-700"
            >
              Utiliser ce modèle
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-700 shadow-sm transition-colors hover:bg-stone-50"
            >
              Voir tous les modèles
            </Link>
          </div>
        </header>

        <section className="mb-20">
          <h2 className="mb-8 text-2xl font-bold text-stone-900">
            Checklist par pièce
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <div
                key={room.name}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
              >
                <h3 className="mb-3 text-sm font-semibold text-stone-900">
                  {room.name}
                </h3>
                <ul className="space-y-1.5">
                  {room.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-xs text-stone-600"
                    >
                      <span className="h-3 w-3 shrink-0 rounded-full border border-stone-300" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20 rounded-2xl bg-purple-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Ce que contient le modèle
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Grille d'état des lieux pièce par pièce",
              "Échelle de notation : neuf, bon état, état moyen, mauvais état",
              "Zone de photos intégrée pour chaque pièce",
              "Comparaison automatique entrée / sortie",
              "Mention des compteurs (eau, électricité, gaz)",
              "Clause de signature double (propriétaire + locataire)",
              "PDF généré automatiquement",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="size-5 text-purple-600" />
                <span className="text-sm text-stone-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Évitez les litiges avec un état des lieux précis
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            Un état des lieux bien fait protège le propriétaire et le locataire.
            Téléchargez notre modèle gratuit et faites-le remplir dès l'entrée.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-purple-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-purple-700"
          >
            Essai gratuit 14 jours
          </Link>
        </section>

        <section className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-stone-900">
            Questions fréquentes
          </h2>
          <div className="mx-auto max-w-3xl space-y-4">
            {faqData.map((item, i) => (
              <details
                key={i}
                className="group rounded-xl border border-stone-200 bg-white"
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-medium text-stone-900 list-none">
                  {item.question}
                  <span className="ml-4 text-stone-400 transition-transform group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <div className="px-6 pb-4 text-sm leading-relaxed text-stone-600">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        <nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
          <Link href="/templates/bail-meuble" className="text-blue-600 hover:underline">
            Bail meublé →
          </Link>
          <Link href="/templates/recu-loyer" className="text-blue-600 hover:underline">
            Quittance de loyer →
          </Link>
          <Link href="/templates" className="text-blue-600 hover:underline">
            ← Tous les modèles
          </Link>
        </nav>
      </article>
    </div>
  );
}
