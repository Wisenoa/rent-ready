import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import React from "react";
import { baseMetadata } from "@/lib/seo/metadata";

// ISR: revalidate marketing pages at CDN edge every hour
export const revalidate = 3600;

// Dynamic import: FinalCta uses framer-motion (heavy, below-fold)
// → code-split so it doesn't block initial JS bundle or INP
const FinalCta = dynamic(
  () => import("@/components/landing/final-cta") as unknown as Promise<React.ComponentType<unknown>> as unknown as Promise<React.ComponentType<unknown>>,
  { loading: () => <div style={{ minHeight: 400 }} aria-hidden="true" /> }
);
// DemoForm has form state + validation (client-heavy)
const DemoForm = dynamic(
  () => import("@/components/landing/demo-form"),
  { loading: () => <div style={{ minHeight: 300 }} aria-hidden="true" /> }
);

export async function generateMetadata() {
  return baseMetadata({
    title: "Demandez une démo — RentReady",
    description: "Réservez une démo RentReady de 30 minutes. Découvrez comment automatiser votre gestion locative: quittances, détection loyer, révision IRL.",
    url: "/demo",
    ogType: "template",
  });
}
;

const benefits = [
  {
    title: "Quittances en 30 secondes",
    description:
      "Plus de generation manuelle. Chaque quittance est conforms a la loi du 6 juillet 1989 et archiv\u00e9e automatiquement.",
  },
  {
    title: "D\u00e9tection automatique des paiements",
    description:
      "Open Banking DSP2 reconnait vos locataires qui payent. Fini les rapprochements bancaires manuels.",
  },
  {
    title: "R\u00e9vision IRL connect\u00e9e INSEE",
    description:
      "L'indice de r\u00e9f\u00e9rence des loyers est mis \u00e0 jour automatiquement. Les notifications de r\u00e9vision sont envoy\u00e9es pour vous.",
  },
  {
    title: "Portail locataire clef en main",
    description:
      "Vos locataires acc\u00e8dent \u00e0 leurs documents, signalent des probl\u00e8mes et communiquent avec vous en un seul endroit.",
  },
];

const agendaItems = [
  "Tour d'horizon de 5 min sur RentReady et son positionnement",
  "D\u00e9couverte de 15 min de vos besoins et contexte",
  "D\u00e9mo personnalis\u00e9e de 10 min selon votre configuration",
];

const faqData = [
  {
    question: "Comment réserver une démo ?",
    answer:
      "Remplissez le formulaire sur cette page avec votre nom, email, nombre de biens et eventuelles questions. Nous vous repondons sous 24h pour fixer un creneau de 30 minutes.",
  },
  {
    question: "La démo est-elle payante ?",
    answer:
      "Non. La démo est entierement gratuite et sans engagement. Elle dure 30 minutes et est adaptee a votre configuration (nombre de biens, type de gestion, besoins specifiques).",
  },
  {
    question: "De quoi allons-nous parler pendant la démo ?",
    answer:
      "Nous faisons le tour de la plateforme ensemble : creation de bail, generation de quittances, detection des loyers, portail locataire. Nous répondons a toutes vos questions et discutons de votre configuration.",
  },
  {
    question: "Puis-je avoir une démo même si je gère déjà mes biens avec un autre outil ?",
    answer:
      "Bien sûr. La démo est aussi l'occasion de voir comment migrer vos données existantes vers RentReady. Nous vous montrons le processus d'import et répondons à vos questions de compatibilité.",
  },
];

function DemoJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        name: "Fil d'Ariane",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Accueil",
            item: "https://www.rentready.fr",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Démo",
            item: "https://www.rentready.fr/demo",
          },
        ],
      },
      {
        "@type": "SoftwareApplication",
        name: "RentReady — Demande de démo",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: "https://www.rentready.fr/demo",
        description:
          "Réservez une démo gratuite de 30 minutes avec l'équipe RentReady. Découvrez la gestion locative automatisée : quittances, détection loyer, révision IRL.",
        offers: {
          "@type": "Offer",
          price: "0.00",
          priceCurrency: "EUR",
          priceValidUntil: "2027-12-31",
          availability: "https://schema.org/InStock",
          url: "https://www.rentready.fr/demo",
        },
        featureList: [
          "Démo gratuite 30 minutes",
          "Personalisée selon votre configuration",
          "Réponse sous 24h",
          "Sans engagement",
        ],
      },
      {
        "@type": "Organization",
        name: "RentReady",
        url: "https://www.rentready.fr",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "contact@rentready.fr",
          availableLanguage: "French",
        },
      },
      {
        "@type": "WebSite",
        name: "RentReady",
        url: "https://www.rentready.fr",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://www.rentready.fr/recherche?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Démo RentReady",
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

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <DemoJsonLd />

      <main className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left column — pitch */}
          <div>
            <p className="mb-4 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              D\u00e9mo gratuite \u00b7 30 minutes
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
              Voyez RentReady en action.
              <br />
              Sans engagement.
            </h1>
            <p className="mt-6 text-lg text-stone-600 leading-relaxed">
              Reserver un cr\u00e9neau de 30 minutes avec notre \u00e9quipe. Pas de
              pitch agressif, pas de commerciaux — juste une d\u00e9mo honn\u00eate de
              ce qui vous ferait gagner du temps.
            </p>

            <ul className="mt-10 space-y-6">
              {benefits.map((b) => (
                <li key={b.title} className="flex gap-4">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] text-emerald-600">
                    \u2713
                  </span>
                  <div>
                    <strong className="text-sm font-semibold text-stone-900">
                      {b.title}
                    </strong>
                    <p className="mt-1 text-sm text-stone-500">{b.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-2xl border border-stone-200 bg-white/60 p-6">
              <p className="text-sm font-semibold text-stone-900">
                Ce qu'on couvre en 30 min :
              </p>
              <ul className="mt-4 space-y-2">
                {agendaItems.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-stone-600">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[10px] font-semibold text-stone-500">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right column — form */}
          <div>
            <div className="rounded-[2rem] border border-stone-200/30 bg-white/60 shadow-2xl shadow-stone-900/[0.04] backdrop-blur-xl p-8 sm:p-10">
              <h2 className="text-2xl font-bold text-stone-900">
                R\u00e9servez votre cr\u00e9neau
              </h2>
              <p className="mt-2 text-sm text-stone-500">
                On vous envoie un lien visio par email.
              </p>

              <div className="mt-8">
                <DemoForm />
              </div>
            </div>
          </div>
        </div>
      </main>

      <FinalCta />
    </div>
  );
}