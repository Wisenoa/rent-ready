import type { Metadata } from "next";
import Link from "next/link";
import { FinalCta } from "@/components/landing/final-cta";

export const metadata: Metadata = {
title: "Tarifs — Logiciel gestion locative 15€/mois | RentReady",
description:
"15€/mois pour gérer jusqu'à 10 biens. Quittances conformes, détection des loyers, révision IRL, portail locataire. Essai gratuit 14 jours, sans engagement.",
keywords: [
"tarif gestion locative",
"prix logiciel locatif",
"abonnement gestion locative",
"gestion locative pas cher",
"essai gratuit gestion locative",
],
openGraph: {
title: "Tarifs RentReady — 15€/mois, zéro surprise",
description:
"Gérez jusqu'à 10 biens pour 15€/mois. Quittances conformes, détection automatique, révision IRL, portail locataire. Essai gratuit.",
type: "website",
url: "https://www.rentready.fr/pricing",
siteName: "RentReady",
images: [
{
url: "https://www.rentready.fr/og-image.png",
width: 1200,
height: 630,
alt: "RentReady Tarifs",
},
],
},
alternates: {
canonical: "https://www.rentready.fr/pricing",
},
};

/* ─── JSON-LD: SoftwareApplication + Offer ─── */
function PricingJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Tarifs RentReady",
        url: "https://www.rentready.fr/pricing",
        description:
          "15 €/mois pour gérer jusqu'à 10 biens. Quittances conformes, détection des loyers, révision IRL, portail locataire.",
        isPartOf: {
          "@type": "WebSite",
          name: "RentReady",
          url: "https://www.rentready.fr",
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "RentReady",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: "https://www.rentready.fr",
        description:
          "Logiciel de gestion locative automatisée pour propriétaires bailleurs indépendants en France (1 à 10 biens).",
        offers: [
          {
            "@type": "Offer",
            name: "Essai gratuit",
            description: "14 jours d'essai gratuit sans carte bancaire",
            price: "0.00",
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            url: "https://www.rentready.fr/register",
          },
          {
            "@type": "Offer",
            name: "Abonnement mensuel",
            description:
              "15 €/mois pour gérer jusqu'à 10 biens. Quittances conformes, détection des loyers, révision IRL, portail locataire.",
            price: "15.00",
            priceCurrency: "EUR",
            priceValidUntil: "2027-12-31",
            availability: "https://schema.org/InStock",
            url: "https://www.rentready.fr/register",
          },
          {
            "@type": "Offer",
            name: "Abonnement annuel",
            description: "150 €/an — 2 mois offerts par rapport au tarif mensuel",
            price: "150.00",
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            url: "https://www.rentready.fr/register",
          },
        ],
        featureList: [
          "Quittances de loyer conformes loi 1989",
          "Détection automatique des loyers via Open Banking DSP2",
          "Révision IRL connectée à l'INSEE",
          "Portail locataire avec gestion de la maintenance",
          "OCR factures artisans par intelligence artificielle",
          "Conformité Factur-X et e-reporting B2C 2027",
          "Export comptable",
          "Relance automatique impayés",
        ],
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
</header>

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