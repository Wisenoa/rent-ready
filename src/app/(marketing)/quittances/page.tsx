import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import React from "react";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { baseMetadata } from "@/lib/seo/metadata";

// ISR: revalidate marketing pages at CDN edge every hour
// Keeps content fresh while serving cached HTML for TTFB < 100ms
export const revalidate = 3600;

// Dynamic import: FinalCta uses framer-motion (heavy, below-fold)
// → code-split so it doesn't block initial JS bundle or INP
const FinalCta = dynamic(
  () => import("@/components/landing/final-cta"),
  { loading: () => <div style={{ minHeight: 400 }} aria-hidden="true" /> }
);

export async function generateMetadata() {
  return baseMetadata({
    title: "Quittances de loyer — Génération automatique et conforme | RentReady",
    description: "Générez des quittances de loyer conformes en 1 clic. Quittance PDF automatique, mention légale INSEE, envoyée au locataire. Logiciel pour propriétaires.",
    url: "/quittances",
    ogType: "template",
  });
}
;

const features = [
{
title: "Génération en 1 clic",
description:
"Sélectionnez le mois, le locataire, et la quittance est générée automatiquement. Zéro saisie manuelle.",
icon: "⚡",
},
{
title: "PDF conforme à la loi",
description:
"Chaque quittance respecte les mentions légales obligatoires (loyer, charges, période, nom du locataire).",
icon: "📋",
},
{
title: "Mention IRL INSEE intégrée",
description:
"La quittance affiche automatiquement l'indice IRL de référence pour l'année en cours.",
icon: "📊",
},
{
title: "Envoi automatique au locataire",
description:
"La quittance est envoyée par email au locataire ou disponible dans son portail.",
icon: "📧",
},
{
title: "Archivage illimité",
description:
"Toutes vos quittances stockées en ligne, accessibles à tout moment pour redevabilité.",
icon: "🗄️",
},
{
title: "Export comptable",
description:
"Exportez vos quittances pour votre expert-comptable. Compatible tous les cabinets.",
icon: "📤",
},
];

const legalRequirements = [
"Période couverte (mois et année)",
"Nom du locataire",
"Adresse du bien",
"Montant du loyer hors charges",
"Montant des charges",
"Date de paiement",
"Mode de paiement",
"Référence du bail",
"Signature du bailleur",
"Indice IRL INSEE (si applicable)",
];

const faqData = [
  {
    question: "Comment générer une quittance de loyer ?",
    answer:
      "Avec RentReady, sélectionnez simplement le locataire et le mois concerné. La quittance est générée automatiquement avec tous les montants pré-remplis depuis votre base. En 1 clic, elle est prête à être envoyée ou archivée.",
  },
  {
    question: "La quittance est-elle conforme à la loi ?",
    answer:
      "Oui. Chaque quittance générée respecte les mentions obligatoires de la loi du 6 juillet 1989 : période couverte, nom du locataire, adresse du bien, montant du loyer et des charges, date de paiement, mode de paiement, référence du bail, signature du bailleur et indice IRL INSEE.",
  },
  {
    question: "Comment envoyer la quittance au locataire ?",
    answer:
      "La quittance peut être envoyée automatiquement par email au locataire, ou rendue disponible dans son portail locataire dédié. Vous pouvez aussi la télécharger en PDF pour l'archiver ou la transmettre manuellement.",
  },
  {
    question: "Les quittances sont-elles horodatées ?",
    answer:
      "Oui. Chaque quittance est horodatée et archivée dans votre espace RentReady. Elles constituent une preuve légale en cas de litige avec un locataire et sont conservées conformément aux obligations fiscales.",
  },
];

/* ─── Structured Data ─── */

const QUITTANCES_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
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
      "@type": "Organization",
      name: "RentReady",
      alternateName: "RentReady SAS",
      url: "https://www.rentready.fr",
      logo: "https://www.rentready.fr/logo.png",
      description: "Logiciel de gestion locative automatisée pour propriétaires bailleurs indépendants en France.",
      foundingDate: "2024",
      address: {
        "@type": "PostalAddress",
        addressCountry: "FR",
        addressLocality: "Paris",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "contact@rentready.fr",
        availableLanguage: "French",
      },
      sameAs: [
        "https://twitter.com/rentready_fr",
        "https://www.linkedin.com/company/rentready",
      ],
    },
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
          name: "Quittances de loyer",
          item: "https://www.rentready.fr/quittances",
        },
      ],
    },
    {
      "@type": "SoftwareApplication",
      name: "RentReady — Quittances de loyer",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://www.rentready.fr/quittances",
      description:
        "Générez des quittances de loyer conformes à la loi du 6 juillet 1989 en 1 clic. PDF automatique, mention IRL INSEE, envoi automatique au locataire.",
      offers: {
        "@type": "Offer",
        price: "15.00",
        priceCurrency: "EUR",
        priceValidUntil: "2027-12-31",
        availability: "https://schema.org/InStock",
        url: "https://www.rentready.fr/register",
      },
      featureList: [
        "Génération de quittance en 1 clic",
        "PDF conforme loi 1989",
        "Mention IRL INSEE intégrée",
        "Envoi automatique par email",
        "Archivage illimité",
        "Export comptable",
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
      name: "FAQ — Quittances de loyer RentReady",
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

export default function QuittancesPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <SchemaMarkup data={QUITTANCES_SCHEMA} />

<article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
{/* Breadcrumb */}
<Breadcrumb
  items={[
    { label: "Accueil", href: "/" },
    { label: "Quittances de loyer", href: "/quittances", isCurrentPage: true },
  ]}
/>
{/* Hero */}
<header className="mb-16 text-center">
<h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
Quittances de loyer
<br />
automatiques et conformes.
</h1>
<p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
Générez des quittances conformes à la loi en 1 clic. Fini les modèles
Excel et les calculs manuels. Zéro paperasse.
</p>
</header>

{/* Features grid */}
<section className="mb-20">
<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
{features.map((feature) => (
<div
key={feature.title}
className="rounded-2xl border border-stone-200/50 bg-white/60 p-6 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md"
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

{/* Legal requirements */}
<section className="mb-20">
<h2 className="mb-6 text-2xl font-bold text-stone-900">
Mentions légales obligatoires
</h2>
<p className="mb-6 text-stone-600">
Chaque quittance générée par RentReady respecte les mentions obligatoires
définies par la loi du 6 juillet 1989 :
</p>
<div className="rounded-xl border border-stone-200 bg-white p-6">
<ul className="grid gap-2 sm:grid-cols-2">
{legalRequirements.map((req) => (
<li key={req} className="flex items-center gap-2 text-sm text-stone-700">
<span className="text-emerald-600">✓</span>
<span>{req}</span>
</li>
))}
</ul>
</div>
</section>

{/* Use cases */}
<section className="mb-20">
<h2 className="mb-8 text-2xl font-bold text-stone-900">
Pourquoi automatiser vos quittances ?
</h2>
<div className="grid gap-6 sm:grid-cols-2">
<div className="rounded-xl border border-stone-200 bg-white p-6">
<h3 className="mb-3 text-lg font-semibold text-stone-900">
⏱️ Gagner du temps
</h3>
<p className="text-sm text-stone-600">
Générez une quittance en 30 secondes au lieu de 15 minutes de saisie
manuelle.
</p>
</div>
<div className="rounded-xl border border-stone-200 bg-white p-6">
<h3 className="mb-3 text-lg font-semibold text-stone-900">
✅ Zéro erreur
</h3>
<p className="text-sm text-stone-600">
Les montants sont pré-remplis depuis votre base. Plus d'erreurs de calcul
ou d'oubli de mentions.
</p>
</div>
<div className="rounded-xl border border-stone-200 bg-white p-6">
<h3 className="mb-3 text-lg font-semibold text-stone-900">
📤 Traçabilité
</h3>
<p className="text-sm text-stone-600">
Chaque quittance est horodatée et archivée. Preuve légale en cas de
litige.
</p>
</div>
<div className="rounded-xl border border-stone-200 bg-white p-6">
<h3 className="mb-3 text-lg font-semibold text-stone-900">
🧾 Conformité Factur-X
</h3>
<p className="text-sm text-stone-600">
Prêt pour la facture électronique B2C 2026. Format standardisé et
interopérable.
</p>
</div>
</div>
</section>

{/* CTA */}
<section className="mb-16 rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
<h2 className="text-2xl font-bold sm:text-3xl">
Générez votre première quittance gratuitement
</h2>
<p className="mx-auto mt-3 max-w-xl text-stone-300">
Essai 14 jours sans carte bancaire. Créez vos quittances, envoyez-les à
vos locataires.
</p>
<Link
href="/register"
className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
>
Essai gratuit 14 jours
</Link>
</section>

{/* Internal links */}
<nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
<Link
href="/locations"
className="text-blue-600 hover:underline"
>
Gestion des locations →
</Link>
<Link
href="/bail"
className="text-blue-600 hover:underline"
>
Gestion des baux →
</Link>
<Link
href="/pricing"
className="text-blue-600 hover:underline"
>
Tarifs →
</Link>
</nav>
</article>

<FinalCta />
</div>
);
}