import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { buildHreflang } from "@/lib/seo/metadata";


export const metadata: Metadata = {
  title: "Modèle Bail Précaire 2026 — Location Temporaire avec Préavis Court",
  description:
    "Modèle de bail précaire gratuit. Location temporaire avec délai de préavis réduit. Motif obligatoire. Téléchargez en PDF. Mise à jour 2026.",
  keywords: [
    "modele bail precaire",
    "bail temporaire",
    "location precaire",
    "preavis court bail",
    "bail accession",
    "occupation temporaire",
  ],
  openGraph: {
    title: "Modèle Bail Précaire 2026 — RentReady",
    description:
      "Bail précaire pour occupation temporaire. Gratuit, téléchargeable en PDF. Préavis réduit.",
    type: "website",
    url: "https://www.rentready.fr/templates/lease/bail-precaire",
    siteName: "RentReady",
  },
  alternates: buildHreflang("/templates/lease/bail-precaire"),
};

const features = [
  {
    title: "Durée déterminée",
    description:
      "Le bail précaire est conclu pour une durée ferme, renouvelable uniquement dans des cas limitatifs définis par la loi.",
    icon: "⏱️",
  },
  {
    title: "Préavis court",
    description:
      "En cas de résiliation anticipée, le préavis est réduit (1 à 3 mois selon les cas), ce qui offre une flexibilité précieuse.",
    icon: "📬",
  },
  {
    title: "Motif obligatoire",
    description:
      "Le bail précaire doit reposer sur un motif légitime prévu par la loi : accession à la propriété, travaux, occupation par le propriétaire, etc.",
    icon: "📋",
  },
  {
    title: "Pas de tacite reconduction",
    description:
      "Le bail précaire ne se reconduit pas tacitement. À échéance, le locataire doit quitter les lieux sauf accord explicite.",
    icon: "🚫",
  },
  {
    title: "Indemnité d'éviction",
    description:
      "En cas de non-renouvellement, une indemnité peut être due au locataire dans certaines conditions.",
    icon: "💶",
  },
  {
    title: "Encadrement strict",
    description:
      "Le bail précaire est encadré par la loi et ne peut pas être utilisé pour tourner l'encadrement des loyers.",
    icon: "⚖️",
  },
];

const motifs = [
  {
    motif: "Travaux",
    desc: "Le bien fait l'objet de travaux importants nécessitant son evacuation (rénovation, démolition, etc.)",
  },
  {
    motif: "Accession à la propriété",
    desc: "Le propriétaire prévoit de vendre ou d'occuper le bien à échéance du bail",
  },
  {
    motif: "Occupation personnelle",
    desc: "Le propriétaire ou un membre de sa famille proche prévoit d'occuper le bien",
  },
  {
    motif: "Destination du bien",
    desc: "Le bien doit être libéré pour permettre une destination différente (commerciale, agricole, etc.)",
  },
  {
    motif: "Fin de права",
    desc: "Le bail expire car le droit d'occupation du bailleur arrive à échéance (fin de bail rural, etc.)",
  },
];

const faqData = [
  {
    question: "Qu'est-ce qu'un bail précaire ?",
    answer:
      "Le bail précaire (aussi appelé 'bail avec préavis' ou 'bail à待遇 réduite') est un contrat de location dont la durée est limitée et qui ne peut pas être renouvelé tacitement. Il est soumis à des conditions strictes : un motif légitime et temporaire doit justifier le recours à ce type de bail. Il ne peut pas servir à éviter les règles du bail d'habitation classique.",
  },
  {
    question: "Quand peut-on utiliser un bail précaire ?",
    answer:
      "Le bail précaire n'est legal que s'il repose sur un motif prévu par la loi. Les motifs les plus courants sont : travaux prévus sur le bien, accession à la propriété par le bailleur, occupation personnelle future, ou expiration imminente d'un droit. En pratique, ce type de bail est souvent utilisé par des agences ou des propriétaires qui ont un projet précis pour leur bien à court terme.",
  },
  {
    question: "Quelle est la durée d'un bail précaire ?",
    answer:
      "La durée du bail précaire est librement fixée entre les parties mais doit correspondre à la durée du motif invoqué. En pratique, elle est souvent de 1 à 2 ans. Le bail ne peut pas être reconduit tacitement et le locataire doit libérer les lieux à échéance sauf si un nouveau bail est signé.",
  },
  {
    question: "Le locataire a-t-il des droits à la fin du bail précaire ?",
    answer:
      "En fin de bail précaire, le locataire n'a pas de droit au maintien dans les lieux (sauf exceptions). En revanche, si le bailleur refuse de renouveler le bail sans proposer de relogement alors qu'il en avait l'obligation, une indemnité d'éviction peut être due. Le motif du bail précaire doit être réel et sérieux.",
  },
  {
    question: "Bail précaire ou bail de courte durée : quelle différence ?",
    answer:
      "Le bail précaire se distingue par son motif obligatoire et son encadrement légal strict. Un bail de courte durée (type bail mobilité) peut avoir des durées similaires mais n'est pas soumis aux mêmes conditions de motif. Le bail précaire est réservé à des situations spécifiques où le propriétaire a un besoin légitime de récupérer le bien.",
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

function BailPrecaireJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      orgSchema,
      webSiteSchema,
      {
        "@type": "WebPage",
        name: "Modèle Bail Précaire 2026 — RentReady",
        description:
          "Modèle de bail précaire pour occupation temporaire avec préavis réduit.",
        url: "https://www.rentready.fr/templates/lease/bail-precaire",
        isPartOf: {
          "@type": "WebSite",
          name: "RentReady",
          url: "https://www.rentready.fr",
        },
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Bail Précaire",
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

export default function BailPrecairePage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <BailPrecaireJsonLd />

      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Hero */}
        <header className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1.5 text-sm font-medium text-orange-700">
            ⏱️ Bail de location temporaire
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Modèle de Bail Précaire
            <br />
            <span className="text-orange-600">Location Temporaire 2026</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Bail précaire pour occupation temporaire justifiée par un motif
            légitime. Préavis réduit, durée limitée, fin de bail encadrée.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700"
            >
              Télécharger le modèle PDF
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-orange-700 shadow-sm border border-orange-200 transition-colors hover:bg-orange-50"
            >
              Générer avec RentReady →
            </Link>
          </div>
        </header>

        {/* Features */}
        <section className="mb-20">
          <h2 className="mb-8 text-2xl font-bold text-stone-900">
            Caractéristiques du bail précaire
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

        {/* Motifs */}
        <section className="mb-20 rounded-2xl bg-orange-50 p-8 sm:p-10">
          <h2 className="mb-6 text-xl font-bold text-stone-900">
            Motifs légitimes pour un bail précaire
          </h2>
          <p className="mb-6 text-stone-700">
            Le recours au bail précaire n&apos;est autorisé que pour des motifs
            précis, prévus par la loi. Le motif doit être mentionne dans le bail
            et être réel.
          </p>
          <div className="space-y-4">
            {motifs.map((m) => (
              <div key={m.motif} className="flex items-start gap-4 rounded-xl border border-orange-200 bg-white p-4">
                <Check className="mt-0.5 size-5 shrink-0 text-orange-600" />
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">{m.motif}</h3>
                  <p className="mt-1 text-sm text-stone-600">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison */}
        <section className="mb-20 rounded-2xl bg-stone-100 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Bail précaire vs bail classique vs bail mobilité
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-300">
                  <th className="text-left py-3 px-4 font-semibold text-stone-900">Critère</th>
                  <th className="text-left py-3 px-4 font-semibold text-stone-900">Bail Précaire</th>
                  <th className="text-left py-3 px-4 font-semibold text-stone-900">Bail Classique</th>
                  <th className="text-left py-3 px-4 font-semibold text-orange-700">Bail Mobilité</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {[
                  ["Motif obligatoire", "Non", "Non", "Oui (mutations, CDD, etc.)"],
                  ["Durée", "Limitee au motif", "3 ans (vide) / 1 an (meublé)", "1 à 10 mois"],
                  ["Préavis", "Court (1-3 mois)", "Long (3-6 mois)", "1 mois"],
                  ["Tacite reconduction", "Non", "Oui (6 mois préavis)", "Non"],
                  ["Dépôt de garantie", "Libre", "1-2 mois selon type", "Interdit"],
                  ["Encadrement loyer", "Oui en zone tendue", "Oui en zone tendue", "Non"],
                ].map(([critere, precaire, classique, mobilite]) => (
                  <tr key={critere} className="hover:bg-stone-50">
                    <td className="py-3 px-4 font-medium text-stone-700">{critere}</td>
                    <td className="py-3 px-4 text-stone-600">{precaire}</td>
                    <td className="py-3 px-4 text-stone-600">{classique}</td>
                    <td className="py-3 px-4 text-orange-700 font-medium">{mobilite}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-16 rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Gérez vos locations temporaires facilement
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            Créez des baux provisoires, suivez les échéances et gérez les
            sorties de locataires en toute conformité.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-block rounded-lg bg-orange-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-orange-700"
            >
              Essai gratuit 14 jours
            </Link>
            <Link
              href="/templates/lease"
              className="inline-block rounded-lg border border-stone-600 px-6 py-3 font-medium text-stone-300 transition-colors hover:bg-stone-800"
            >
              ← Tous les baux
            </Link>
          </div>
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

        {/* Related */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8">
          <h2 className="mb-4 text-lg font-bold text-stone-900">
            Ressources complémentaires
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { href: "/templates/bail-mobilite", label: "Modèle de bail mobilité →" },
              { href: "/templates/bail-vide", label: "Modèle de bail vide →" },
              { href: "/glossaire-immobilier", label: "Glossaire de la location →" },
              { href: "/templates", label: "Tous nos modèles de documents →" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-orange-600 hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
          <Link href="/templates/lease/bail-saisonnier" className="text-orange-600 hover:underline">
            Bail saisonnier →
          </Link>
          <Link href="/templates/lease/bail-etudiant" className="text-orange-600 hover:underline">
            Bail étudiant →
          </Link>
          <Link href="/templates/lease/acte-caution" className="text-orange-600 hover:underline">
            Acte de caution →
          </Link>
          <Link href="/templates/lease" className="text-blue-600 hover:underline">
            ← Tous les baux de location
          </Link>
        </nav>
      </article>
    </div>
  );
}
