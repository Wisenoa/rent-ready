import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Modèle Bail Meublé Gratuit 2026 — Contrat Conforme Loi 1989",
  description:
    "Modèle de bail meublé gratuit et conforme à la loi du 6 juillet 1989. Téléchargez en PDF, personnalisez les clauses, signature électronique incluse.",
  keywords: [
    "modele bail meuble",
    "bail meuble 2026",
    "contrat location meublee",
    "bail meuble loi 1989",
    "depot garantie bail meuble",
    "inventaire mobilier",
  ],
  openGraph: {
    title: "Modèle Bail Meublé Gratuit 2026 — RentReady",
    description:
      "Bail meublé conforme et gratuit. Téléchargez, personnalisez, signez électronique. Modèle mis à jour 2026.",
    type: "website",
    url: "https://www.rentready.fr/templates/bail-meuble",
    siteName: "RentReady",
  },
  alternates: {
    canonical: "https://www.rentready.fr/templates/bail-meuble",
  },
};

const features = [
  {
    title: "Conforme loi 6 juillet 1989",
    description:
      "Toutes les mentions obligatoires sont incluses. Modèle mis à jour avec les dernières évolutions légales (loi Alur, ÉLAN, etc.).",
    icon: "⚖️",
  },
  {
    title: "Inventaire de meubles intégré",
    description:
      "La grille d'inventaire est incluse dans le bail. Décrivez chaque équipement meublant pièce par pièce.",
    icon: "🛋️",
  },
  {
    title: "Clause de révision du loyer",
    description:
      "Clause de révision annuelle liée à l'IRL (Indice de Référence des Loyers) de l'INSEE. Actualisation automatique.",
    icon: "📈",
  },
  {
    title: "Dépôt de garantie réglementé",
    description:
      "Le dépôt de garantie est limité à 2 mois de loyer hors charges (loi Alur). Clause de restitution avec justificatifs.",
    icon: "🔒",
  },
  {
    title: "Portal locataire",
    description:
      "Envoyez le bail directement à votre locataire. Il peut le consulter et le signer en ligne.",
    icon: "✍️",
  },
  {
    title: "Export PDF légal",
    description:
      "Téléchargez un PDF prêt à imprimer et à signer. Format conforme pour archivage et dépôt chez un notaire.",
    icon: "📄",
  },
];

const clauses = [
  {
    title: "Clause des équipements",
    description:
      "Liste exhaustive des équipements meublants avec état de fonctionnement.",
    required: true,
  },
  {
    title: "Clause de résidence principale",
    description:
      "Le locataire doit occuper le logement comme résidence principale (+8 mois/an).",
    required: true,
  },
  {
    title: "Clause animale",
    description:
      "Possibilité d'autoriser ou interdire les animaux dans le logement.",
    required: false,
  },
  {
    title: "Clause travaux",
    description:
      "Répartition des travaux entre propriétaire et locataire selon la loi.",
    required: false,
  },
  {
    title: "Clause de révision IRL",
    description:
      "Révision annuelle du loyer selon l'Indice de Référence des Loyers.",
    required: false,
  },
];

const faqData = [
  {
    question: "Quelle est la durée d'un bail meublé ?",
    answer:
      "Le bail meublé est conclu pour une durée de 1 an (reconduction tacite) ou 1 mois (bail mobilité). Il se reconduit tacitement pour la même durée sauf préavis de 1 mois par le locataire.",
  },
  {
    question: "Quel dépôt de garantie pour un bail meublé ?",
    answer:
      "Le dépôt de garantie est limité à 2 mois de loyer hors charges (contre 1 mois pour un bail vide). Il doit être restitué dans les 2 mois suivant la remise des clés, déduction faite des sommes dues.",
  },
  {
    question: "Le bail meublé doit-il contenir un état des lieux ?",
    answer:
      "Oui. L'état des lieux est obligatoire (loi du 6 juillet 1989) et doit être annexé au bail. Il décrit l'état du logement et du mobilier à l'entrée et à la sortie du locataire.",
  },
  {
    question: "Comment savoir si mon bail est aux normes ?",
    answer:
      "Le bail doit contenir les mentions obligatoires : identité des parties, description du bien, loyer, charges, dépôt de garantie, durée, date de début, et annexes (DPE, état des risques, inventaire mobilière). Notre modèle intègre automatiquement toutes ces mentions.",
  },
];

function BailMeubleJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Modèle Bail Meublé 2026 — RentReady",
        description:
          "Modèle de bail meublé gratuit et conforme à la loi du 6 juillet 1989. Téléchargeable en PDF.",
        url: "https://www.rentready.fr/templates/bail-meuble",
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Bail Meublé",
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

export default function BailMeublePage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <BailMeubleJsonLd />

      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Hero */}
        <header className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
            🏠 Bail de location meublée
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Modèle de Bail Meublé
            <br />
            <span className="text-blue-600">Gratuit &amp; Conforme 2026</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Bail meublé conforme à la loi du 6 juillet 1989, mis à jour avec la
            dernière IRL. Téléchargez en PDF, personnalisez les clauses,
            envoyez à votre locataire.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
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

        {/* Features */}
        <section className="mb-20">
          <h2 className="mb-8 text-2xl font-bold text-stone-900">
            Ce que contient le modèle
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

        {/* Clauses */}
        <section className="mb-20 rounded-2xl bg-white p-8 shadow-sm sm:p-10">
          <h2 className="mb-6 text-xl font-bold text-stone-900">
            Clauses disponibles
          </h2>
          <div className="space-y-4">
            {clauses.map((clause) => (
              <div
                key={clause.title}
                className="flex items-start gap-4 rounded-xl border border-stone-200 p-4"
              >
                <div
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    clause.required
                      ? "bg-blue-100 text-blue-600"
                      : "bg-stone-100 text-stone-400"
                  }`}
                >
                  {clause.required ? (
                    <Check className="size-4" />
                  ) : (
                    <span className="text-xs">○</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-stone-900">
                      {clause.title}
                    </h3>
                    {clause.required && (
                      <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700">
                        Obligatoire
                      </span>
                    )}
                    {!clause.required && (
                      <span className="rounded bg-stone-100 px-1.5 py-0.5 text-xs text-stone-500">
                        Optionnel
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-stone-600">
                    {clause.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Legal */}
        <section className="mb-20 rounded-2xl bg-blue-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Conformité légale
          </h2>
          <p className="mb-6 text-stone-700">
            Notre modèle de bail meublé intègre automatiquement les mentions
            obligatoires et respecte les évolutions légales récentes.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              "Loi du 6 juillet 1989 (baux d'habitation)",
              "Loi Alur (encadrement des loyers)",
              "Loi ÉLAN (garantie universelle loyer)",
              "Décret du 29 mai 2015 (état des lieux)",
              "IRL INSEE (révision annuelle)",
              "DPE obligatoire (diagnostic performance énergétique)",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-stone-600">
                <span className="text-emerald-600">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className="mb-16 rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Générez votre bail meublé en 5 minutes
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            Remplissez en ligne, téléchargez en PDF, envoyez à votre locataire.
            Signature électronique incluse.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
          >
            Essai gratuit 14 jours
          </Link>
        </section>

        {/* FAQ */}
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

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
          <Link
            href="/templates/bail-commercial"
            className="text-blue-600 hover:underline"
          >
            Bail commercial →
          </Link>
          <Link
            href="/templates/bail-mobilite"
            className="text-blue-600 hover:underline"
          >
            Bail mobilité →
          </Link>
          <Link
            href="/templates/etat-des-lieux"
            className="text-blue-600 hover:underline"
          >
            État des lieux →
          </Link>
          <Link
            href="/templates"
            className="text-blue-600 hover:underline"
          >
            ← Tous les modèles
          </Link>
        </nav>
      </article>
    </div>
  );
}
