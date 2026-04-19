import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import React from "react";

import { TrustLogos } from "@/components/seo/TrustLogos";
import { ContentReviewBadge } from "@/components/seo/ContentReviewBadge";
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
    title: "Tarifs — Logiciel gestion locative 15€/mois | RentReady",
    description: "15€/mois pour gérer jusqu'à 10 biens. Quittances conformes, détection des loyers, révision IRL, portail locataire. Essai gratuit 14 jours, sans engagement.",
    url: "/pricing",
    ogType: "pricing",
  });
}

/* ─── JSON-LD: BreadcrumbList + Organization + WebPage + SoftwareApplication + FAQPage ─── */
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
  buildWebPageSchema,
  buildSoftwareAppSchema,
  buildFAQPageSchema,
  buildBreadcrumbSchema,
  buildGraphSchema,
} from "@/lib/seo/structured-data";

const pricingFaqs = [
  {
    question: "Combien coûte RentReady et y a-t-il un engagement ?",
    answer: "RentReady coûte 15 € par mois sans engagement, ou 150 € par an (2 mois offerts). Ce tarif unique inclut la gestion de 10 biens maximum, un nombre illimité de locataires, toutes les fonctionnalités et les mises à jour légales. Essai gratuit 14 jours sans carte bancaire.",
  },
  {
    question: "Que se passe-t-il si je dépasse 10 biens ?",
    answer: "Si vous dépassez 10 biens, vous pouvez contacter notre équipe pour un abonnement adapté à votre portfolio. Aucun frais caché, aucune commission sur les loyers encaissés.",
  },
  {
    question: "Puis-je résilier à tout moment ?",
    answer: "Oui, vous pouvez résilier en un clic depuis votre espace, sans préavis ni pénalité. Vous conservez l'accès à vos données pendant 30 jours après la résiliation.",
  },
  {
    question: "Le prix inclut-il les mises à jour légales ?",
    answer: "Oui, toutes les mises à jour liées aux évolutions légales et réglementaires françaises (Loi Alur, IRL, Factur-X, e-reporting B2C) sont incluses dans votre abonnement, sans frais supplémentaires.",
  },
  {
    question: "Y a-t-il des frais d'installation ou de mise en service ?",
    answer: "Non, il n'y a aucun frais d'installation. Vous créez votre compte, connectez votre compte bancaire via Open Banking, et votre espace de gestion est opérationnel en quelques minutes.",
  },
];

function PricingJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Tarifs", url: "https://www.rentready.fr/pricing" },
    ]),
    buildOrganizationSchema({ "@id": "https://www.rentready.fr/#organization" }),
    buildWebPageSchema({
      name: "Tarifs RentReady",
      description:
        "15 €/mois pour gérer jusqu'à 10 biens. Quittances conformes, détection des loyers, révision IRL, portail locataire.",
      url: "https://www.rentready.fr/pricing",
    }),
    buildSoftwareAppSchema({
      name: "RentReady",
      description:
        "Logiciel de gestion locative automatisée pour propriétaires bailleurs indépendants en France (1 à 10 biens).",
      applicationCategory: "BusinessApplication",
      offers: [
        {
          name: "Essai gratuit",
          description: "14 jours d'essai gratuit sans carte bancaire",
          price: "0.00",
          priceCurrency: "EUR",
        },
        {
          name: "Abonnement mensuel",
          description:
            "15 €/mois pour gérer jusqu'à 10 biens. Quittances conformes, détection des loyers, révision IRL, portail locataire.",
          price: "15.00",
          priceCurrency: "EUR",
        },
        {
          name: "Abonnement annuel",
          description: "150 €/an — 2 mois offerts par rapport au tarif mensuel",
          price: "150.00",
          priceCurrency: "EUR",
        },
      ],
      features: [
        "Quittances de loyer conformes loi 1989",
        "Détection automatique des loyers via Open Banking DSP2",
        "Révision IRL connectée à l'INSEE",
        "Portail locataire avec gestion de la maintenance",
        "OCR factures artisans par intelligence artificielle",
        "Conformité Factur-X et e-reporting B2C 2027",
        "Export comptable",
        "Relance automatique impayés",
      ],
    }),
    buildFAQPageSchema(pricingFaqs)
  );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

const includedFeatures = [
"Jusqu'à 10 biens immobiliers",
"Locataires illimités",
"Quittances et reçus conformes loi 1989",
"Détection automatique des loyers (Open Banking DSP2)",
"Révision IRL connectée INSEE",
"Portail locataire avec gestion maintenance",
"OCR factures artisans (IA)",
"Conformité Factur-X et e-reporting B2C 2026",
"Support email prioritaire",
"Mises à jour légales incluses",
"Export comptable",
"Relance automatique impayés",
];

const comparisonData = [
{
feature: "Nombre de biens",
us: "Jusqu'à 10",
competitors: "5-20 pour le même prix",
},
{
feature: "Quittances conformes loi 1989",
us: "✅ Automatique",
competitors: "Manuel ou semi-auto",
},
{
feature: "Détection des loyers",
us: "✅ Open Banking DSP2",
competitors: "❌ Manuel",
},
{
feature: "Révision IRL INSEE",
us: "✅ Automatique",
competitors: "❌ Calcul manuel",
},
{
feature: "Portail locataire",
us: "✅ Inclus",
competitors: "❌ Payant",
},
{
feature: "OCR factures artisans",
us: "✅ IA incluse",
competitors: "❌ Non disponible",
},
{
feature: "Conformité Factur-X 2026",
us: "✅ Prêt",
competitors: "❌ Non conforme",
},
{
feature: "Support",
us: "Email prioritaire",
competitors: "Email standard",
},
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <PricingJsonLd />

{/* Hero */}
<article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
<header className="mb-16 text-center">
<h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
Un tarif transparent.
<br />
Zéro surprise.
</h1>
<p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
Tout ce dont vous avez besoin pour gérer vos locations, au prix
d'un café par jour. Essai gratuit, sans engagement.
</p>

{/* E-E-A-T: content review badge */}
<div className="mt-6">
  <ContentReviewBadge updatedAt="2026-04-01" category="article" />
</div>
</header>

{/* Trust signals */}
<div className="mb-12">
  <TrustLogos variant="full" showMedia={false} />
</div>

{/* Single pricing card */}
<div className="mx-auto max-w-md">
<div className="relative overflow-hidden rounded-[2rem] border border-stone-200/30 bg-white/60 shadow-2xl shadow-stone-900/[0.04] backdrop-blur-xl">
{/* Decorative glow */}
<div
aria-hidden
className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-blue-100/30 blur-3xl"
/>
<div
aria-hidden
className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-teal-100/20 blur-3xl"
/>

<div className="relative p-8 sm:p-10">
{/* Price */}
<div className="mb-10 text-center">
<div className="flex items-baseline justify-center">
<span className="text-6xl font-extrabold tracking-tighter text-stone-900">
15
</span>
<span className="ml-1 text-xl font-semibold text-stone-400">
€
</span>
<span className="ml-1.5 text-base text-stone-400">/mois</span>
</div>
<p className="mt-3 text-sm text-stone-500">
ou{" "}
<strong className="text-stone-700">150&nbsp;€/an</strong>{" "}
<span className="ml-1 inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
2 mois offerts
</span>
</p>
</div>

{/* Features */}
<ul className="mb-10 space-y-3">
{includedFeatures.map((feature) => (
<li
key={feature}
className="flex items-start gap-3 text-sm text-stone-600"
>
<span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
✓
</span>
<span>{feature}</span>
</li>
))}
</ul>

{/* CTA */}
<Link
href="/register"
className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-stone-900 py-4 text-sm font-semibold text-white shadow-lg shadow-stone-900/10 transition-colors hover:bg-stone-800"
>
Essai gratuit — 14 jours
</Link>
<p className="mt-3 text-center text-xs text-stone-400">
Sans carte bancaire · Annulable en 1 clic
</p>
</div>
</div>
</div>

{/* Comparison table */}
<section className="mt-20">
<h2 className="mb-8 text-center text-2xl font-bold text-stone-900">
Pourquoi RentReady ?
</h2>
<div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
<table className="w-full text-left text-sm">
<thead className="border-b border-stone-200 bg-stone-50/50">
<tr>
<th className="px-6 py-4 font-semibold text-stone-900">Fonction</th>
<th className="px-6 py-4 font-semibold text-stone-900">
RentReady
</th>
<th className="px-6 py-4 font-semibold text-stone-500">
Logiciels classiques
</th>
</tr>
</thead>
<tbody className="divide-y divide-stone-100">
{comparisonData.map((row) => (
<tr key={row.feature}>
<td className="px-6 py-4 text-stone-700">{row.feature}</td>
<td className="px-6 py-4 font-medium text-blue-600">
{row.us}
</td>
<td className="px-6 py-4 text-stone-400">{row.competitors}</td>
</tr>
))}
</tbody>
</table>
</div>
</section>

{/* FAQ */}
<section className="mt-20">
<h2 className="mb-8 text-center text-2xl font-bold text-stone-900">
Questions fréquentes
</h2>
<dl className="mx-auto max-w-2xl space-y-6">
<div>
<dt className="text-base font-semibold text-stone-900">
Y a-t-il des frais cachés ?
</dt>
<dd className="mt-2 text-stone-600">
Non. Le tarif de 15€/mois inclut toutes les fonctionnalités ci-dessus.
Aucun frais supplémentaire pour les quittances, la détection des loyers,
ou le support.
</dd>
</div>
<div>
<dt className="text-base font-semibold text-stone-900">
Puis-je annuler à tout moment ?
</dt>
<dd className="mt-2 text-stone-600">
Oui. Vous pouvez annuler votre abonnement en un clic depuis votre
compte. Aucune période d'engagement minimum.
</dd>
</div>
<div>
<dt className="text-base font-semibold text-stone-900">
L'essai gratuit est-il vraiment sans carte bancaire ?
</dt>
<dd className="mt-2 text-stone-600">
Oui. L'essai de 14 jours ne nécessite aucune carte bancaire. Vous
serez invité à souscrire uniquement si vous souhaitez continuer après
la période d'essai.
</dd>
</div>
<div>
<dt className="text-base font-semibold text-stone-900">
Que se passe-t-il si j'ai plus de 10 biens ?
</dt>
<dd className="mt-2 text-stone-600">
Le plan actuel couvre jusqu'à 10 biens. Si vous avez plus de biens,
contactez-nous pour discuter d'un plan personnalisé.
</dd>
</div>
</dl>
</section>
</article>

<FinalCta />
</div>
);
}