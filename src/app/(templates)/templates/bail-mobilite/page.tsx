import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Modèle Bail Mobilité Gratuit 2026 — Sans Garantie Loyer",
  description:
    "Modèle de bail mobilité gratuit (1 à 10 mois). Location de courte durée sans garantie loyer. Idéal mutations, stages, CDD. Téléchargez en PDF.",
  keywords: [
    "bail mobilite",
    "modele bail mobilite",
    "location courte duree sans garantie",
    "bail mutation",
    "bail stage",
  ],
  openGraph: {
    title: "Modèle Bail Mobilité 2026 — Sans Garantie | RentReady",
    description:
      "Bail mobilité 1-10 mois sans garantie loyer. Téléchargez et personnalisez en ligne. Mise à jour 2026.",
    type: "website",
    url: "https://www.rentready.fr/templates/bail-mobilite",
    siteName: "RentReady",
  },
  alternates: {
    canonical: "https://www.rentready.fr/templates/bail-mobilite",
  },
};

const features = [
  {
    title: "Durée 1 à 10 mois",
    description:
      "Le bail mobilité est conclu pour une durée de 1 à 10 mois, sans tacite reconduction.",
    icon: "📅",
  },
  {
    title: "Sans garantie loyer",
    description:
      "Ce bail ne peut pas demander de dépôt de garantie ni de garantía universelle (VISALE).",
    icon: "🔓",
  },
  {
    title: "Publics visés",
    description:
      "Mutations professionnelles, CDD, missions, stages, formations. Le locataire doit Justifier d'un de ces motifs.",
    icon: "👔",
  },
  {
    title: "Non renouvelable",
    description:
      "Le bail mobilité ne peut pas être renouvelé ni transformé en bail meublé classique pour le même logement.",
    icon: "🚫",
  },
  {
    title: "Loyer libre",
    description:
      "Pas d'encadrement des loyers en zone tendue. Le propriétaire fixe librement le montant.",
    icon: "💶",
  },
  {
    title: "DPE obligatoire",
    description:
      "Le Diagnostic de Performance Énergétique doit être joint au bail mobilité.",
    icon: "⚡",
  },
];

const faqData = [
  {
    question: "Qui peut signer un bail mobilité ?",
    answer:
      "Le bail mobilité s'adresse aux personnes en mutation professionnelle, en CDD, enmission temporaire, en stage ou en formation. Le locataire doit fournir un justificatif au moment de la signature.",
  },
  {
    question: "Peut-on demander un dépôt de garantie ?",
    answer:
      "Non. Le bail mobilité interdit expressément de demander un dépôt de garantie ou une garantie Visale. C'est l'un de ses avantages pour le locataire.",
  },
  {
    question: "Le bail mobilité peut-il être reconduit ?",
    answer:
      "Non. Le bail mobilité ne peut pas être renouvelé, même par tacite reconduction. Il prend fin automatiquement à l'échéance. Il ne peut pas non plus être transformé en bail meublé classique pour le même logement.",
  },
  {
    question: "Quelle différence avec le bail meublé classique ?",
    answer:
      "Le bail meublé classique dure 1 an (reconduction tacite) et autorise un dépôt de garantie de 2 mois. Le bail mobilité est limité à 10 mois maximum, sans garantie, et réservé à des profils spécifiques.",
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

function BailMobiliteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      orgSchema,
      webSiteSchema,
      {
        "@type": "WebPage",
        name: "Modèle Bail Mobilité 2026 — RentReady",
        description:
          "Modèle de bail mobilité gratuit (1-10 mois) sans garantie loyer. Ideal pour mutations et stages.",
        url: "https://www.rentready.fr/templates/bail-mobilite",
        isPartOf: {
          "@type": "WebSite",
          name: "RentReady",
          url: "https://www.rentready.fr",
        },
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Bail Mobilité",
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

export default function BailMobilitePage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <BailMobiliteJsonLd />

      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <header className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-700">
            🚚 Bail de location mobilité
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Modèle de Bail Mobilité
            <br />
            <span className="text-amber-600">Sans Garantie Loyer</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Bail de courte durée (1 à 10 mois) réservé aux mutations, CDD,
            stages et formations. Sans dépôt de garantie, sans encadrement des
            loyers.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-700"
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
            Caractéristiques du bail mobilité
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-stone-200/50 bg-white/60 p-6 shadow-sm backdrop-blur-sm"
              >
                <div className="mb-3 text-3xl">{feature.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-stone-900">
                  {feature.title}
                </h3>
                <p className="text-sm text-stone-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20 rounded-2xl bg-amber-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Conditions d'accès au bail mobilité
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Mutation professionnelle documentée",
              "CDD ou contrat de mission",
              "Stage ou formation professionnelle",
              "Premiere installation (jeunes 18-30 ans)",
              "Situation médicale nécessitant un hébergement",
              "Accomplissement d'une duty civique",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="size-5 text-amber-600" />
                <span className="text-sm text-stone-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Louez pour une courte durée en toute sérénité
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            Le bail mobilité vous protège et protège votre locataire. Téléchargez
            notre modèle conforme et personnalisez-le.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-amber-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-amber-700"
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
          <Link href="/templates/bail-commercial" className="text-blue-600 hover:underline">
            Bail commercial →
          </Link>
          <Link href="/templates/colocation" className="text-blue-600 hover:underline">
            Colocation →
          </Link>
          <Link href="/templates" className="text-blue-600 hover:underline">
            ← Tous les modèles
          </Link>
        </nav>
      </article>
    </div>
  );
}
