import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { buildHreflang } from "@/lib/seo/metadata";


export const metadata: Metadata = {
  title: "Modèles de Bail de Location — Tous nos Contrats Gratuits 2026",
  description:
    "Tous nos modèles de bail de location gratuits et conformes : bail vide, meublé, mobilité, parking, saisonnier, précaire, étudiant. Téléchargez en PDF. Mise à jour 2026.",
  keywords: [
    "modele bail location",
    "bail gratuit",
    "contrat location",
    "bail 2026",
    "tous les bails",
  ],
  openGraph: {
    title: "Modèles de Bail de Location — RentReady",
    description:
      "Tous nos modèles de bail gratuits et conformes. Bail vide, meublé, mobilité, parking, saisonnier et plus encore.",
    type: "website",
    url: "https://www.rentready.fr/templates/lease",
    siteName: "RentReady",
  },
  alternates: buildHreflang("/templates/lease"),
};


/* ─── JSON-LD: FAQPage + BreadcrumbList ─── */
const leaseFaqs = [
  { question: "Quel bail choisir pour une location vide ?", answer: "Pour une location vide non meublée, le bail Vide (3 ans minimum) est le plus courant. En zone tendue, la durée minimale est de 3 ans. Le dépôt de garantie ne peut pas dépasser 1 mois de loyer hors charges." },
  { question: "Le bail meublé est-il plus avantageux ?", answer: "Le bail meublé offre plus de flexibilité (1 an minimum) et un loyer généralement plus élevé. Il permet aussi le statut LMNP avec amortissement. Le dépôt de garantie est limité à 2 mois hors charges." },
  { question: "Le bail mobilité est-il adapté aux étudiants ?", answer: "Le bail mobilité est réservé aux locataires en mutation professionnelle, CDD, stage ou formation. Il dure de 1 à 10 mois et ne peut pas être reconduit automatiquement. Il n'y a pas de dépôt de garantie." },
];

function LeaseTemplatesJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        name: "Modèles de Bail de Location — FAQ",
        description: "Questions fréquentes sur les modèles de bail de location gratuits et conformes de RentReady.",
        url: "https://www.rentready.fr/templates/lease",
        mainEntity: leaseFaqs.map(faq => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer }
        })),
      },
      {
        "@type": "BreadcrumbList",
        name: "Fil d'Ariane",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.rentready.fr" },
          { "@type": "ListItem", position: 2, name: "Modèles", item: "https://www.rentready.fr/templates" },
          { "@type": "ListItem", position: 3, name: "Tous les Bails", item: "https://www.rentready.fr/templates/lease" },
        ],
      },
    ],
  };
  return <SchemaMarkup data={data} />;
}

const leaseTypes = [
  {
    href: "/templates/bail-vide",
    label: "Bail Vide",
    desc: "Location non meublée de 3 ans minimum. Dépôt de garantie 1 mois.",
    badge: "Le plus courant",
    icon: "🏠",
    color: "blue",
  },
  {
    href: "/templates/bail-meuble",
    label: "Bail Meublé",
    desc: "Location meublée de 1 an minimum. Équipement obligatoire selon décret.",
    badge: "Flexible",
    icon: "🛋️",
    color: "indigo",
  },
  {
    href: "/templates/bail-mobilite",
    label: "Bail Mobilité",
    desc: "Courte durée 1-10 mois. Sans dépôt de garantie. Réservé mutations/CDD/stages.",
    badge: "Sans garantie",
    icon: "🚚",
    color: "amber",
  },
  {
    href: "/templates/lease/bail-parking",
    label: "Bail Parking",
    desc: "Location de parking, garage ou box. Charges et durée personnalisables.",
    badge: "Nouveau",
    icon: "🚗",
    color: "emerald",
  },
  {
    href: "/templates/lease/bail-saisonnier",
    label: "Bail Saisonnier",
    desc: "Location de vacances de courte durée. Meublé de tourisme classé.",
    badge: "Nouveau",
    icon: "🌊",
    color: "cyan",
  },
  {
    href: "/templates/lease/bail-precaire",
    label: "Bail Précaire",
    desc: "Location temporaire avec délai de préavis réduit. Motif obligatoire.",
    badge: "Nouveau",
    icon: "⏱️",
    color: "orange",
  },
  {
    href: "/templates/lease/bail-etudiant",
    label: "Bail Étudiant",
    desc: " Bail meublé adapté aux étudiants. Garantie VISALE ou garant acceptée.",
    badge: "Nouveau",
    icon: "🎓",
    color: "purple",
  },
  {
    href: "/templates/lease/acte-caution",
    label: "Acte de Caution",
    desc: "Acte de caution solidaire pour garant. Téléchargez et remplissez.",
    badge: "Nouveau",
    icon: "✍️",
    color: "rose",
  },
  {
    href: "/templates/bail-commercial",
    label: "Bail Commercial",
    desc: "Location de local commercial. Baux 3/6/9 ans selon commerce.",
    icon: "🏪",
    color: "slate",
  },
  {
    href: "/templates/colocation",
    label: "Bail Colocation",
    desc: "Colocation avec ou sans clause de solidarité. Un ou plusieurs baux.",
    icon: "👥",
    color: "teal",
  },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  indigo: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
  amber: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  cyan: "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100",
  orange: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
  purple: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
  rose: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
  slate: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
  teal: "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100",
};

export default function LeaseTemplatesPage() {
  return (
    <>
      <LeaseTemplatesJsonLd />
      <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Hero */}
        <header className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
            📋 Modèles de bail de location
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Tous nos Modèles de Bail
            <br />
            <span className="text-blue-600">Gratuits &amp; Conformes 2026</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Choisissez le modèle adapté à votre situation. Chaque modèle est
            gratuit, conforme à la loi française, et prêt à télécharger en PDF.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              Générer un bail en ligne
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-sm border border-blue-200 transition-colors hover:bg-blue-50"
            >
              ← Tous les modèles
            </Link>
          </div>
        </header>

        {/* Intro */}
        <section className="mb-16 rounded-2xl bg-blue-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Quel bail choisir pour votre location ?
          </h2>
          <p className="text-stone-700">
            Le choix du bail dépend de la nature du bien, de sa durée de
            location, et du profil du locataire. Utilisez le tableau ci-dessous
            pour trouver le modèle adapté. En cas de doute, consultez un
            professionnel de l&apos;immobilier.
          </p>
        </section>

        {/* Grid of lease types */}
        <section className="mb-20">
          <h2 className="mb-8 text-2xl font-bold text-stone-900">
            Nos modèles de bail
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {leaseTypes.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group rounded-2xl border p-6 transition-colors ${colorMap[item.color] ?? "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"}`}
              >
                <div className="mb-3 flex items-start justify-between">
                  <span className="text-3xl">{item.icon}</span>
                  {item.badge && (
                    <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-medium">
                      {item.badge}
                    </span>
                  )}
                </div>
                <h3 className="mb-1 text-base font-semibold">{item.label}</h3>
                <p className="text-sm opacity-80">{item.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-sm font-medium opacity-60 group-hover:opacity-100">
                  <span>Voir le modèle</span>
                  <ArrowRight className="size-3" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Legal disclaimer */}
        <section className="mb-16 rounded-2xl bg-amber-50 border border-amber-200 p-8">
          <h2 className="mb-3 text-lg font-bold text-stone-900">
            ⚠️ Avertissement juridique
          </h2>
          <p className="text-sm text-stone-700">
            Les modèles de bail proposés sur RentReady sont fournis à titre
            indicatif et informational. Ils ne constituent pas un conseil
            juridique personnalisé. La législation immobilière évoluant
            régulièrement, nous vous recommandons de faire valider votre bail
            par un professionnel (avocat, notaire, agent immobilier) avant
            toute signature. RentReady ne saurait être tenu responsable de
            l&apos;utilisation qui serait faite de ces modèles.
          </p>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Créez et gérez vos bails en ligne
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            Générez des bails conformes, envoyez-les pour signature
            électronique, et archiver-les en toute sécurité.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
            >
              Essai gratuit 14 jours
            </Link>
            <Link
              href="/pricing"
              className="inline-block rounded-lg border border-stone-600 px-6 py-3 font-medium text-stone-300 transition-colors hover:bg-stone-800"
            >
              Voir les tarifs →
            </Link>
          </div>
        </section>
      </article>
      </div>
    </>
  );
}
