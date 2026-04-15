import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Modèle Bail Commercial Gratuit 2026 — Bail Précaire Conforme",
  description:
    "Modèle de bail commercial gratuit pour local professionnel. Bail 3/6/9 ans conforme au Code de commerce. Téléchargez en PDF, clauses personnalisables.",
  keywords: [
    "bail commercial",
    "modele bail commercial",
    "location professionnelle",
    "bail 3 6 9 ans",
    "valeur locative",
  ],
  openGraph: {
    title: "Modèle Bail Commercial 2026 — RentReady",
    description:
      "Bail commercial gratuit pour local professionnel. PDF téléchargeable. Conforme Code de commerce.",
    type: "website",
    url: "https://www.rentready.fr/templates/bail-commercial",
    siteName: "RentReady",
  },
  alternates: {
    canonical: "https://www.rentready.fr/templates/bail-commercial",
  },
};

const features = [
  {
    title: "Bail 3 / 6 / 9 ans",
    description:
      "Conforme au statut des baux commerciaux (Code de commerce). Durée légale de 9 ans ou bail de 3/6 ans avec tacite reconduction.",
    icon: "📜",
  },
  {
    title: "Valeur locative",
    description:
      "Clause de révision de la valeur locative selon l'indice ILAT ou ILLC. Révision triennale obligatoire.",
    icon: "📊",
  },
  {
    title: "Droit au bail",
    description:
      "Le locataire commercial bénéficie du droit au bail et de la propriété commerciale. Pas de solidarité entre murs et fonds.",
    icon: "🏪",
  },
  {
    title: "Charges et travaux",
    description:
      "Répartition détaillée des charges et des travaux entre propriétaire et locataire commercial.",
    icon: "🔧",
  },
  {
    title: "Cession du bail",
    description:
      "Clause de cession du bail avec accord préalable du propriétaire. Dénonciation du bail possible tous les 3 ans.",
    icon: "🔄",
  },
  {
    title: "Dépôt de garantie",
    description:
      "Possibilité de demander un dépôt de garantie librement négocié (pas de plafonnement légal).",
    icon: "🔒",
  },
];

const faqData = [
  {
    question: "Quelle est la durée minimale d'un bail commercial ?",
    answer:
      "Le bail commercial est traditionnellement conclu pour 9 ans. Il est également possible de conclure un bail de 3 ans (bail exceptionnel) avec tacite reconduction, ou un bail de 6 ans avec tacite reconduction également. La durée ne peut pas être inférieure à 3 ans.",
  },
  {
    question: "Comment réviser le loyer d'un bail commercial ?",
    answer:
      "La révision triennale du loyer commercial se fait selon l'indice ILAT (Indice des Loyers des Activités Tertiaires) ou l'indice ILLC (Indice des Loyers Commerciaux). Le propriétaire peut demander la révision à chaque échéance triennale, avec un préavis.",
  },
  {
    question: "Le locataire commercial peut-il donner son congé ?",
    answer:
      "Oui. Le locataire commercial peut dénoncer le bail tous les 3 ans avec un préavis de 6 mois (article L145-9 du Code de commerce). Le propriétaire ne peut pas s'y opposer.",
  },
  {
    question: "Qu'est-ce que le droit au bail ?",
    answer:
      "Le droit au bail donne au locataire commercial le droit de se maintenir dans les lieux à l'expiration du bail. Ce droit est attaché au fonds de commerce et peut être cédé avec le fonds. Le propriétaire ne peut pas s'y opposer lors de la cession du bail.",
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

function BailCommercialJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      orgSchema,
      webSiteSchema,
      {
        "@type": "WebPage",
        name: "Modèle Bail Commercial 2026 — RentReady",
        description:
          "Modèle de bail commercial gratuit (3/6/9 ans). PDF téléchargeable. Conforme Code de commerce.",
        url: "https://www.rentready.fr/templates/bail-commercial",
        isPartOf: {
          "@type": "WebSite",
          name: "RentReady",
          url: "https://www.rentready.fr",
        },
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Bail Commercial",
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

export default function BailCommercialPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <BailCommercialJsonLd />

      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <header className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
            🏢 Bail de location commerciale
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Modèle de Bail Commercial
            <br />
            <span className="text-emerald-600">3 / 6 / 9 Ans</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Bail commercial conforme au Code de commerce. Gérez la valeur
            locative, le droit au bail, la cession et la révision triennale
            automatiquement.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
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
            Caractéristiques du bail commercial
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

        <section className="mb-20 rounded-2xl bg-emerald-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Conformité au Code de commerce
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Article L145-1 et suivants du Code de commerce",
              "Statut des baux commerciaux (loi du 18 juin 2014)",
              "Indice ILAT pour révision triennale",
              "Droit au bail et propriété commerciale",
              "Clause de cession et de sous-location",
              "Dépôt de garantie librement négociable",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="size-5 text-emerald-600" />
                <span className="text-sm text-stone-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Louez votre local commercial en toute conformité
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            Notre modèle de bail commercial intègre automatiquement les clauses
            obligatoires du Code de commerce.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-emerald-700"
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
          <Link href="/templates/bail-mobilite" className="text-blue-600 hover:underline">
            Bail mobilité →
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
