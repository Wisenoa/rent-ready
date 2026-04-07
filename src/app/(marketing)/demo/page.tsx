import type { Metadata } from "next";
import Link from "next/link";
import { FinalCta } from "@/components/landing/final-cta";

export const metadata: Metadata = {
  title: "Demandez une démo — RentReady",
  description:
    "Découvrez comment RentReady automatise votre gestion locative : quittances conformes, détection des loyers, révision IRL. Réservez un créneau de 30 min avec notre équipe.",
  keywords: [
    "demo gestion locative",
    "rdv rentready",
    "demonstration logiciel locatif",
    "visio gestion locative",
    "prise de rdv bailleur",
  ],
  openGraph: {
    title: "Réservez une démo RentReady — 30 min",
    description:
      "Découvrez en 30 minutes comment automatiser votre gestion locative. Quittances, détection loyer, révision IRL.",
    type: "website",
    url: "https://www.rentready.fr/demo",
    siteName: "RentReady",
    images: [
      {
        url: "https://www.rentready.fr/og-image.png",
        width: 1200,
        height: 630,
        alt: "Réserver une démo RentReady",
      },
    ],
  },
  alternates: {
    canonical: "https://www.rentready.fr/demo",
  },
};

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

              <form className="mt-8 space-y-5" action="#" method="POST">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-stone-700"
                  >
                    Votre nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="mt-1.5 block w-full rounded-xl border border-stone-200 bg-white/80 px-4 py-3 text-sm text-stone-900 placeholder-stone-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Jean Dupont"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-stone-700"
                  >
                    Email professionnel
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="mt-1.5 block w-full rounded-xl border border-stone-200 bg-white/80 px-4 py-3 text-sm text-stone-900 placeholder-stone-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="jean@exemple.fr"
                  />
                </div>

                <div>
                  <label
                    htmlFor="properties"
                    className="block text-sm font-medium text-stone-700"
                  >
                    Nombre de biens \u00e0 g\u00e9rer
                  </label>
                  <select
                    id="properties"
                    name="properties"
                    className="mt-1.5 block w-full rounded-xl border border-stone-200 bg-white/80 px-4 py-3 text-sm text-stone-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="1">1 \u00e0 3 biens</option>
                    <option value="2">4 \u00e0 10 biens</option>
                    <option value="3">Plus de 10 biens</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-stone-700"
                  >
                    Questions ou besoins sp\u00e9cifiques (optionnel)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    className="mt-1.5 block w-full rounded-xl border border-stone-200 bg-white/80 px-4 py-3 text-sm text-stone-900 placeholder-stone-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Par exemple : je g\u00e8re une SCI, je veux comprendre comment importer mes baux..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-stone-900 py-4 text-sm font-semibold text-white shadow-lg shadow-stone-900/10 transition-colors hover:bg-stone-800"
                >
                  Demander ma d\u00e9mo gratuite
                </button>

                <p className="text-center text-xs text-stone-400">
                  Sans engagement \u00b7 R\u00e9ponse sous 24h
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>

      <FinalCta />
    </div>
  );
}