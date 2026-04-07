import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Modèle Bail Colocation Gratuit 2026 — Clause de Solidarité",
  description:
    "Modèle de bail colocation gratuit avec clause de solidarité. Gérez plusieurs locataires dans un même bien. Téléchargez en PDF, conformité loi 1989.",
  keywords: [
    "bail colocation",
    "modele colocation",
    "clause solidarite colocation",
    "bail plusieurs locataires",
    "colocation loi 1989",
  ],
  openGraph: {
    title: "Modèle Bail Colocation 2026 — Clause Solidarité | RentReady",
    description:
      "Bail colocation gratuit avec clause de solidarité. Téléchargeable en PDF, personnalisez les conditions.",
    type: "website",
    url: "https://www.rentready.fr/templates/colocation",
    siteName: "RentReady",
  },
  alternates: {
    canonical: "https://www.rentready.fr/templates/colocation",
  },
};

const features = [
  {
    title: "Clause de solidarité",
    description:
      "Chaque colocataire est responsable de l'intégralité du loyer. Protège le propriétaire en cas de défaillance d'un locataire.",
    icon: "🤝",
  },
  {
    title: "Loyers individualisés",
    description:
      "Possibilité de fixer des montants différents pour chaque chambre avec une clé de répartition claire.",
    icon: "💰",
  },
  {
    title: "OSP (Orientation de la Shared)",
    description:
      "Le bail colocation peut être conclu sans OSP, permettant à chaque colocataire de partir individuellement.",
    icon: "🚪",
  },
  {
    title: "Inventaire commun",
    description:
      "Un seul inventaire pour le bien complet. Chaque chambre peut avoir son propre état des lieux.",
    icon: "📋",
  },
  {
    title: "Charges partagées",
    description:
      "Répartition équilibrée des charges avec tableau de répartition joint au bail.",
    icon: "📊",
  },
  {
    title: "Ajout/retrait de colocataire",
    description:
      "Clause permettant le changement de colocataire sans rupture du bail principal.",
    icon: "🔄",
  },
];

const faqData = [
  {
    question: "Qu'est-ce que la clause de solidarité dans une colocation ?",
    answer:
      "La clause de solidarité signifie que chaque colocataire est tenue responsable de la totalité du loyer et des charges, pas seulement de sa part. Si un colocataire ne paie pas, le propriétaire peut réclamer l'intégralité des sommes dues à n'importe lequel des colocataires.",
  },
  {
    question: "Peut-on avoir des loyers différents dans une colocation ?",
    answer:
      "Oui. Il est possible de fixer des montants différents pour chaque chambre, avec une clé de répartition jointe au bail. Chaque locataire signe alors pour un montant individualisé tout en restant solidairement responsable des sommes totales.",
  },
  {
    question: "Qu'est-ce que l'OSP (Orientation de la Shared) ?",
    answer:
      "L'OSP permet à chaque colocataire de donner son congé individuellement (avec un préavis de 3 mois) sans que cela n'affecte les autres. Sans OSP, le départ d'un colocataire peut entrainner la fin du bail pour tous.",
  },
  {
    question: "Combien de colocataires maximum dans un bail ?",
    answer:
      "La loi ne fixe pas de nombre maximum explicite, mais un arrêté municipal peut encadrer la colocation (ex. : maximum 6 à Paris). En pratique, 2 à 5 colocataires est le plus courant.",
  },
];

function ColocationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Modèle Bail Colocation 2026 — RentReady",
        description:
          "Modèle de bail colocation gratuit avec clause de solidarité. PDF téléchargeable.",
        url: "https://www.rentready.fr/templates/colocation",
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Bail Colocation",
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

export default function ColocationPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <ColocationJsonLd />

      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <header className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
            👥 Bail de colocation
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Modèle de Bail Colocation
            <br />
            <span className="text-purple-600">Clause de Solidarité</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Gérez plusieurs locataires dans un même bien avec un bail unique.
            Clause de solidarité, loyers individualisés, ajout de colocataire
            en cours de bail.
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
            Caractéristiques du bail colocation
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

        <section className="mb-20 rounded-2xl bg-purple-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Clauses optionnelles disponibles
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Clause de solidarité limitée (15 mois max)",
              "OSP (Orientation de la Shared Peace)",
              "Clause d'individualisation du loyer",
              "Clause de sous-location interdite",
              "Clause de changement de colocataire",
              "Clause de répartition des charges locatives",
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
            Louez à plusieurs en toute sécurité
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            Notre modèle de bail colocation vous protège en cas de défaillance
            d'un colocataire grâce à la clause de solidarité.
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
          <Link href="/templates/bail-commercial" className="text-blue-600 hover:underline">
            Bail commercial →
          </Link>
          <Link href="/templates/bail-mobilite" className="text-blue-600 hover:underline">
            Bail mobilité →
          </Link>
          <Link href="/templates" className="text-blue-600 hover:underline">
            ← Tous les modèles
          </Link>
        </nav>
      </article>
    </div>
  );
}
