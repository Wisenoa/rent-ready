import type { Metadata } from "next";
import { SAME_AS, SITE_NAME, SITE_URL } from "@/data/entity";
import Link from "next/link";
import dynamicImport from "next/dynamic";
import React from "react";
import { SchemaMarkup, paidOffer } from "@/components/seo/schema-markup";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { baseMetadata } from "@/lib/seo/metadata";

// Rendered on demand. SEO/marketing content, not product surface: prerendering the
// ~135-page content suite exhausted the Node heap during `next build`
// ("Ineffective mark-compacts near heap limit"). All data is local, so rendering
// per request costs ~ms and every URL keeps working.
export const revalidate = 3600;

// Dynamic import: FinalCta uses framer-motion (heavy, below-fold)
// → code-split so it doesn't block initial JS bundle or INP
const FinalCta = dynamicImport(
  () => import("@/components/landing/final-cta").then((mod) => mod.FinalCta),
  { loading: () => <div style={{ minHeight: 400 }} aria-hidden="true" /> }
);

export async function generateMetadata() {
  return baseMetadata({
    title:
      "Gestion Locations 2026 — Tableau de bord unifié",
    description:
      `Gérez tous vos biens locatifs avec ${SITE_NAME} : tableau de bord, suivi des loyers et des retards, quittances et reçus centralisés. Essai gratuit 2026.`,
    url: "/locations",
    ogType: "feature",
  });
}
;

const features = [
{
title: "Tableau de bord unifié",
description:
"Visualisez tous vos biens, locataires et loyers en un clin d'œil. Fini les fichiers Excel dispersés.",
icon: "📊",
},
{
title: "Suivi des loyers du mois",
description:
"Enregistrez les paiements reçus : le reste dû et les impayés du mois s'affichent dans votre tableau de bord.",
icon: "💸",
},
{
title: "Documents centralisés",
description:
"Baux, états des lieux, quittances, attestations — tous vos documents stockés et accessibles à tout moment.",
icon: "📁",
},
{
title: "Quittances et reçus à télécharger",
description:
"Chaque document se télécharge en PDF, à la demande. Vous le transmettez vous-même à votre locataire.",
icon: "👤",
},
{
title: "Historique complet",
description:
"Consultez l'historique de chaque bien : travaux, locataires, loyers. Traçabilité totale.",
icon: "🕐",
},
{
title: "Alertes intelligentes",
description:
"Fin de bail, révision IRL, assurance expirée — soyez notifié automatiquement avant l'échéance.",
icon: "🔔",
},
];

const faqData = [
  {
    question: `Comment ajouter un bien immobilier dans ${SITE_NAME} ?`,
    answer:
      "Cliquez sur « Ajouter un bien » depuis votre tableau de bord. Renseignez l'adresse, le type de bien (vide ou meublé), le nombre de pièces et le loyer. Le bien apparaît immédiatement dans votre liste de locations.",
  },
  {
    question: "Comment suivre les paiements de mes locataires ?",
    answer:
      `Vous enregistrez chaque paiement reçu depuis le suivi du mois. ${SITE_NAME} l'impute sur le loyer attendu du locataire, calcule le reste dû et signale les mois partiellement payés ou impayés. Aucune connexion bancaire n'est nécessaire.`,
  },
  {
    question: "Puis-je gérer plusieurs biens avec des locataires différents ?",
    answer:
      `Oui. ${SITE_NAME} est conçu pour gérer de 1 à 10 biens. Chaque bien a ses propres locataires, baux, quittances et historique. Vous avez une vue unifiée ou détaillée par bien selon vos besoins.`,
  },
  {
    question: "Où retrouver les documents de mes locations ?",
    answer:
      "Vous les retrouvez tous dans votre tableau de bord. Vos locataires n'ont pas d'accès en ligne : vous téléchargez les quittances et reçus en PDF et les leur transmettez.",
  },
];

/* ─── Structured Data ─── */

const LOCATIONS_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
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
        email: "contact@lokna.fr",
        availableLanguage: "French",
      },
      sameAs: SAME_AS,
    },
    {
      "@type": "BreadcrumbList",
      name: "Fil d'Ariane",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Accueil",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Gestion des locations",
          item: `${SITE_URL}/locations`,
        },
      ],
    },
    {
      "@type": "SoftwareApplication",
      name: `${SITE_NAME} — Gestion des locations`,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: `${SITE_URL}/locations`,
      description:
        "Gérez tous vos biens locatifs : suivi des loyers et des retards, quittances et reçus, dépenses par logement. Logiciel pour propriétaires bailleurs.",
      offers: {
        ...paidOffer(),
      },
      featureList: [
        "Tableau de bord unifié",
        "Suivi des loyers attendus et du reste dû",
        "Documents centralisés",
        "Quittances et reçus téléchargeables en PDF",
        "Historique complet par bien",
        "Révision IRL calculée avec l'indice INSEE",
      ],
    },
    {
      "@type": "FAQPage",
      name: `FAQ — Gestion des locations ${SITE_NAME}`,
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

// Rendered on demand. SEO/marketing content, not product surface: prerendering the
// ~135-page content suite exhausted the Node heap during `next build`
// ("Ineffective mark-compacts near heap limit"). All data is local, so rendering
// per request costs ~ms and every URL keeps working.

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-cream font-[family-name:var(--font-sans)] antialiased">
      <SchemaMarkup data={LOCATIONS_SCHEMA} breadcrumbRenderedByComponent />

<article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
{/* Breadcrumb */}
<Breadcrumb
  items={[
    { label: "Accueil", href: "/" },
    { label: "Gestion des locations", href: "/locations", isCurrentPage: true },
  ]}
/>

{/* Hero */}
<header className="mb-16 text-center">
<h1 className="text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl">
Gérez toutes vos locations
<br />
en un seul endroit.
</h1>
<p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
Suivez vos biens, vos locataires, vos loyers et vos documents sans
souci. Gagnez du temps et arrêtez de jongler entre fichiers Excel et
dossiers papier.
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
<h3 className="mb-2 text-lg font-semibold text-ink">
{feature.title}
</h3>
<p className="text-sm text-stone-600">{feature.description}</p>
</div>
))}
</div>
</section>

{/* Use cases */}
<section className="mb-20">
<h2 className="mb-8 text-2xl font-semibold text-ink">
Cas d'usage concrets
</h2>
<div className="grid gap-6 sm:grid-cols-2">
<div className="rounded-xl border border-stone-200 bg-white p-6">
<h3 className="mb-3 text-lg font-semibold text-ink">
📍 Propriétaires de 1 à 10 biens
</h3>
<p className="text-sm text-stone-600">
Le logiciel idéal pour les bailleurs indépendants avec un portefeuille
modeste. Ayez une vision claire sans complexité.
</p>
</div>
<div className="rounded-xl border border-stone-200 bg-white p-6">
<h3 className="mb-3 text-lg font-semibold text-ink">
🏢 Gestionnaires immobiliers
</h3>
<p className="text-sm text-stone-600">
Suivez plusieurs biens avec un système unifié. Mettez fin aux
navigateurs d'onglets et feuilles de calcul.
</p>
</div>
<div className="rounded-xl border border-stone-200 bg-white p-6">
<h3 className="mb-3 text-lg font-semibold text-ink">
📋 SCI et copropriétés
</h3>
<p className="text-sm text-stone-600">
Gérez les parties communes, répartitions de charges et documents
associés à chaque lot.
</p>
</div>
<div className="rounded-xl border border-stone-200 bg-white p-6">
<h3 className="mb-3 text-lg font-semibold text-ink">
🧾 Experts-comptables
</h3>
<p className="text-sm text-stone-600">
Accédez aux documents et à l'historique de vos clients. Exportez les
données pour la comptabilité.
</p>
</div>
</div>
</section>

{/* CTA */}
<section className="mb-16 rounded-2xl bg-forest px-6 py-14 text-center text-white shadow-lg">
<h2 className="text-2xl font-semibold sm:text-3xl">
Commencez à gérer vos locations en 5 minutes
</h2>
<p className="mx-auto mt-3 max-w-xl text-stone-700">
Ajoutez vos biens, vos locataires, générez vos premières quittances.
Simple et rapide.
</p>
<Link
href="/register"
className="mt-8 inline-block rounded-lg bg-forest px-6 py-3 font-medium text-white shadow transition-colors hover:bg-forest-hover"
>
Essai gratuit 14 jours
</Link>
</section>

{/* Internal links */}
<nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-600">
<Link
href="/bail"
className="text-forest hover:underline"
>
Gestion des baux →
</Link>
<Link
href="/quittances"
className="text-forest hover:underline"
>
Génération de quittances →
</Link>
<Link
href="/pricing"
className="text-forest hover:underline"
>
Tarifs →
</Link>
</nav>
</article>

<FinalCta />
</div>
);
}