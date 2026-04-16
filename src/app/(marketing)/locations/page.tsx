import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import React from "react";

// ISR: revalidate marketing pages at CDN edge every hour
// Keeps content fresh while serving cached HTML for TTFB < 100ms
export const revalidate = 3600;

// Dynamic import: FinalCta uses framer-motion (heavy, below-fold)
// → code-split so it doesn't block initial JS bundle or INP
const FinalCta = dynamic(
  () => import("@/components/landing/final-cta") as unknown as Promise<React.ComponentType<unknown>>,
  { ssr: true, loading: () => <div style={{ minHeight: 400 }} aria-hidden="true" /> }
);

export const metadata: Metadata = {
title: "Gestion des locations — Suivi de vos biens locatifs | RentReady",
description:
"Gérez tous vos biens locatifs : suivi des loyers, état des lieux, documents, contrats. Logiciel complet pour propriétaires bailleurs. Essai gratuit.",
keywords: [
"gestion locations",
"suivi biens immobiliers",
"gestion locative",
"suivi loyers",
"état des lieux",
"contrat location",
"gestion propriétaire",
],
openGraph: {
title: "Gestion des locations — RentReady",
description:
"Suivez vos biens, loyers, documents et contrats en un seul logiciel pour propriétaires.",
type: "website",
url: "https://www.rentready.fr/locations",
siteName: "RentReady",
images: [
{
url: "https://www.rentready.fr/og-image.png",
width: 1200,
height: 630,
alt: "RentReady — Gestion des locations",
},
],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gestion des locations — RentReady",
    description:
      "Suivez vos biens, loyers, documents et contrats en un seul logiciel pour propriétaires.",
    images: ["https://www.rentready.fr/og-image.png"],
  },
  alternates: {
    canonical: "https://www.rentready.fr/locations",
  },
};

const features = [
{
title: "Tableau de bord unifié",
description:
"Visualisez tous vos biens, locataires et loyers en un clin d'œil. Fini les fichiers Excel dispersés.",
icon: "📊",
},
{
title: "Suivi des loyers en temps réel",
description:
"Suivez les paiements automatiquement via Open Banking DSP2. Recevez des alertes pour les impayés.",
icon: "💸",
},
{
title: "Documents centralisés",
description:
"Baux, états des lieux, quittances, attestations — tous vos documents stockés et accessibles à tout moment.",
icon: "📁",
},
{
title: "Portail locataire intégré",
description:
"Vos locataires accèdent à leur espace pour déclarer les incidents, consulter leurs documents et communiquer.",
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
    question: "Comment ajouter un bien immobilier dans RentReady ?",
    answer:
      "Cliquez sur « Ajouter un bien » depuis votre tableau de bord. Renseignez l'adresse, le type de bien (vide ou meublé), le nombre de pièces et le loyer. Le bien apparaît immédiatement dans votre liste de locations.",
  },
  {
    question: "Comment suivre les paiements de mes locataires ?",
    answer:
      "RentReady détecte automatiquement les virements entrants via Open Banking DSP2. Chaque paiement est automatiquement rapproché avec le locataire et le bien correspondants. Vous recevez une alerte en cas d'impayé.",
  },
  {
    question: "Puis-je gérer plusieurs biens avec des locataires différents ?",
    answer:
      "Oui. RentReady est conçu pour gérer de 1 à 10 biens. Chaque bien a ses propres locataires, baux, quittances et historique. Vous avez une vue unifiée ou détaillée par bien selon vos besoins.",
  },
  {
    question: "Les documents sont-ils accessibles aux deux parties ?",
    answer:
      "Oui. Vos locataires accèdent à leur portail dédié pour consulter leurs baux, quittances et déclarer des incidents. Vous conservez l'accès complet à tous les documents depuis votre tableau de bord.",
  },
];

function LocationsJsonLd() {
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
            name: "Gestion des locations",
            item: "https://www.rentready.fr/locations",
          },
        ],
      },
      {
        "@type": "SoftwareApplication",
        name: "RentReady — Gestion des locations",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: "https://www.rentready.fr/locations",
        description:
          "Gérez tous vos biens locatifs : suivi des loyers en temps réel, état des lieux, documents centralisés, portail locataire intégré. Logiciel pour propriétaires bailleurs.",
        offers: {
          "@type": "Offer",
          price: "15.00",
          priceCurrency: "EUR",
          priceValidUntil: "2027-12-31",
          availability: "https://schema.org/InStock",
          url: "https://www.rentready.fr/register",
        },
        featureList: [
          "Tableau de bord unifié",
          "Suivi des loyers en temps réel via Open Banking",
          "Documents centralisés",
          "Portail locataire intégré",
          "Historique complet par bien",
          "Alertes intelligentes (IRL, fin de bail, assurance)",
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
        name: "FAQ — Gestion des locations RentReady",
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

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <LocationsJsonLd />

<article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
{/* Hero */}
<header className="mb-16 text-center">
<h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
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
<h3 className="mb-2 text-lg font-semibold text-stone-900">
{feature.title}
</h3>
<p className="text-sm text-stone-600">{feature.description}</p>
</div>
))}
</div>
</section>

{/* Use cases */}
<section className="mb-20">
<h2 className="mb-8 text-2xl font-bold text-stone-900">
Cas d'usage concrets
</h2>
<div className="grid gap-6 sm:grid-cols-2">
<div className="rounded-xl border border-stone-200 bg-white p-6">
<h3 className="mb-3 text-lg font-semibold text-stone-900">
📍 Propriétaires de 1 à 10 biens
</h3>
<p className="text-sm text-stone-600">
Le logiciel idéal pour les bailleurs indépendants avec un portefeuille
modeste. Ayez une vision claire sans complexité.
</p>
</div>
<div className="rounded-xl border border-stone-200 bg-white p-6">
<h3 className="mb-3 text-lg font-semibold text-stone-900">
🏢 Gestionnaires immobiliers
</h3>
<p className="text-sm text-stone-600">
Suivez plusieurs biens avec un système unifié. Mettez fin aux
navigateurs d'onglets et feuilles de calcul.
</p>
</div>
<div className="rounded-xl border border-stone-200 bg-white p-6">
<h3 className="mb-3 text-lg font-semibold text-stone-900">
📋 SCI et copropriétés
</h3>
<p className="text-sm text-stone-600">
Gérez les parties communes, répartitions de charges et documents
associés à chaque lot.
</p>
</div>
<div className="rounded-xl border border-stone-200 bg-white p-6">
<h3 className="mb-3 text-lg font-semibold text-stone-900">
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
<section className="mb-16 rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
<h2 className="text-2xl font-bold sm:text-3xl">
Commencez à gérer vos locations en 5 minutes
</h2>
<p className="mx-auto mt-3 max-w-xl text-stone-300">
Ajoutez vos biens, vos locataires, générez vos premières quittances.
Simple et rapide.
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
href="/bail"
className="text-blue-600 hover:underline"
>
Gestion des baux →
</Link>
<Link
href="/quittances"
className="text-blue-600 hover:underline"
>
Génération de quittances →
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