import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Modèle Bail Étudiant Gratuit 2026 — Location Meublée Étudiant",
  description:
    "Modèle de bail étudiant gratuit. Bail meublé adapté aux locataires étudiants avec garantie VISALE. Téléchargez en PDF. Mise à jour 2026.",
  keywords: [
    "bail Etudiant",
    "modele bail Etudiant",
    "location Etudiant",
    "bail meublé Etudiant",
    "garant Etudiant",
    "VISALE Etudiant",
  ],
  openGraph: {
    title: "Modèle Bail Étudiant 2026 — RentReady",
    description:
      "Bail meublé pour étudiants. Gratuit, conforme, avec clause VISALE et garant. Téléchargeable en PDF.",
    type: "website",
    url: "https://www.rentready.fr/templates/lease/bail-etudiant",
    siteName: "RentReady",
  },
  alternates: {
    canonical: "https://www.rentready.fr/templates/lease/bail-etudiant",
  },
};

const features = [
  {
    title: "Garantie VISALE",
    description:
      "La garantie VISALE (Visa pour le Logement et l'Emploi) couvre les impayés de loyer pour les étudiants de moins de 30 ans. Clause de substitution prévue.",
    icon: "🛡️",
  },
  {
    title: "Bail meublé obligatoire",
    description:
      "Les propriétaires qui louent aux étudiants proposent généralement un bail meublé (durée de 1 an, préavis de 1 mois).",
    icon: "🛋️",
  },
  {
    title: "Clause de résiliation anticipée",
    description:
      "Pour les stages ou échanges universitaires, une clause de résiliation anticipée à 1 mois peut être prévue.",
    icon: "📅",
  },
  {
    title: "Meubles conformes",
    description:
      "L'inventaire mobilier doit respecter le décret n°2015-1370 (literie, électroménager, ustensiles, rangements).",
    icon: "🏠",
  },
  {
    title: "Proche enseignement",
    description:
      "Pas de condition de proximité avec l'établissement scolaire dans la loi, mais souvent un critère pratique pour l'étudiant.",
    icon: "🎓",
  },
  {
    title: "Dossier étudiant",
    description:
      "L'étudiant peut fournir un dossier simplifié. La garantie VISALE remplace souvent le garant traditionnel.",
    icon: "📁",
  },
];

const droits = [
  "Droit au的报告e du bail : 1 mois (locataire), 3 mois (propriétaire) en meublé",
  "Dépôt de garantie : maximum 2 mois de loyer hors charges",
  "État des lieux d'entrée et de sortie obligatoires",
  "DPE (Diagnostic de Performance Énergétique) obligatoire",
  "Garant VISALE accepté sans条件 supplémentaire",
  "Révision de loyer annuelle possible selon clause IRL",
  " Assurance habitation obligatoire pour le locataire",
];

const faqData = [
  {
    question: "Un étudiant peut-il louer sans garant ?",
    answer:
      "Oui. La garantie VISALE (Visa pour le Logement et l'Emploi) est un dispositif gratuit qui garantit le paiement du loyer et des charges au propriétaire pour les étudiants de moins de 30 ans. Elle remplace le garant traditionnel. Pour en bénéficier, l'étudiant fait sa demande sur le site Visale.fr et reçoit un visa à présenter au propriétaire. Ce visa peut aussi accélérer l'accès au logement.",
  },
  {
    question: "Quel type de bail pour un étudiant ?",
    answer:
      "Les propriétaires louent généralement en bail meublé aux étudiants (1 an minimum, préavis de 1 mois pour le locataire). Le bail vide est aussi possible mais moins courant pour les étudiants. Le bail mobilité est réservé aux étudiants en mutation, CDD ou stage (1 à 10 mois, sans dépôt de garantie).",
  },
  {
    question: "L'étudiant peut-il résilier son bail avant la fin ?",
    answer:
      "Oui. En bail meublé, le locataire peut résilier à tout moment avec un préavis de 1 mois. En pratique, les propriétaires acceptent souvent une clause de résiliation anticipée pour les stages ou échanges universitaires. En bail vide, le préavis est de 3 mois.",
  },
  {
    question: "Le propriétaire peut-il refuser un étudiant ?",
    answer:
      "Un propriétaire ne peut pas refuser de louer à un étudiant uniquement parce qu'il est étudiant (c'est une discrimination). En revanche, il peut exiger des garanties de paiement (garant, VISALE, réservation de loyer). Le refus basé sur d'autres critères (CDD, stage) peut aussi constituer une discrimination.",
  },
  {
    question: "Que contient le dossier de location étudiant ?",
    answer:
      "Le dossier étudiant comprend généralement : pièce d'identité, justificatif de statut étudiant (carte d'étudiant ou certificat de scolarité), justificatif de ressources (bourse, revenus, aide familiale), garant (le cas échéant), et visa VISALE si applicable. Les owners ne peuvent pas exiger plus que pour un autre locataire.",
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

function BailEtudiantJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      orgSchema,
      webSiteSchema,
      {
        "@type": "WebPage",
        name: "Modèle Bail Étudiant 2026 — RentReady",
        description:
          "Modèle de bail meublé pour étudiants. Garantie VISALE, bail conforme loi 1989.",
        url: "https://www.rentready.fr/templates/lease/bail-etudiant",
        isPartOf: {
          "@type": "WebSite",
          name: "RentReady",
          url: "https://www.rentready.fr",
        },
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Bail Étudiant",
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

export default function BailEtudiantPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <BailEtudiantJsonLd />

      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Hero */}
        <header className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
            🎓 Bail de location étudiant
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Modèle de Bail Étudiant
            <br />
            <span className="text-purple-600">Location Meublée 2026</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Bail meublé pour étudiants, avec clause VISALE et clauses adaptées.
            Téléchargez en PDF, personnalisez selon votre situation.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-purple-700"
            >
              Télécharger le modèle PDF
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-purple-700 shadow-sm border border-purple-200 transition-colors hover:bg-purple-50"
            >
              Générer avec RentReady →
            </Link>
          </div>
        </header>

        {/* Features */}
        <section className="mb-20">
          <h2 className="mb-8 text-2xl font-bold text-stone-900">
            Ce modèle est adapté aux étudiants grâce à
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

        {/* VISALE */}
        <section className="mb-20 rounded-2xl bg-purple-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            La garantie VISALE pour les étudiants
          </h2>
          <p className="mb-4 text-stone-700">
            La VISALE (Visa pour le Logement et l&apos;Emploi) est une garantie
            gratuite de l&apos;État qui couvre les loyers impayés pour les locataires
            de moins de 30 ans. Elle remplace efficacement le garant traditionnel.
          </p>
          <div className="mb-4 space-y-2">
            {[
              ["Open à", "Étudiants de moins de 30 ans, salariés, apprentis"],
              ["Coverage", "Jusqu'à 36 mois de loyers impayés"],
              ["Coût", "Gratuit pour le locataire et le propriétaire"],
              ["Démarche", "Demande sur visale.fr avant signature du bail"],
              ["Pour le propriétaire", "Garantie de paiement sans条件的 de revenus"],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-3 text-sm">
                <span className="font-medium text-stone-900">{label} :</span>
                <span className="text-stone-600">{value}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-stone-500">
            Le visa VISALE doit être présenté au propriétaire avant la signature
            du bail. Téléchargez le modèle avec clause VISALE adaptée.
          </p>
        </section>

        {/* Rights */}
        <section className="mb-20 rounded-2xl bg-white p-8 shadow-sm sm:p-10">
          <h2 className="mb-6 text-xl font-bold text-stone-900">
            Droits et obligations dans un bail étudiant
          </h2>
          <div className="space-y-3">
            {droits.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <Check className="mt-0.5 size-4 shrink-0 text-purple-600" />
                <span className="text-sm text-stone-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-16 rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Louez à des étudiants en toute sérénité
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            Générez des baux conformes avec clause VISALE, gérez les paiements
            et les états des lieux en ligne.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-block rounded-lg bg-purple-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-purple-700"
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
              { href: "/templates/bail-meuble", label: "Modèle de bail meublé →" },
              { href: "/templates/bail-mobilite", label: "Modèle de bail mobilité →" },
              { href: "/templates/lease/acte-caution", label: "Acte de caution solidaire →" },
              { href: "/glossaire-immobilier", label: "Glossaire de la location →" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-purple-600 hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
          <Link href="/templates/lease/bail-precaire" className="text-purple-600 hover:underline">
            Bail précaire →
          </Link>
          <Link href="/templates/lease/acte-caution" className="text-purple-600 hover:underline">
            Acte de caution →
          </Link>
          <Link href="/templates/lease/bail-parking" className="text-purple-600 hover:underline">
            Bail parking →
          </Link>
          <Link href="/templates/lease" className="text-blue-600 hover:underline">
            ← Tous les baux de location
          </Link>
        </nav>
      </article>
    </div>
  );
}
