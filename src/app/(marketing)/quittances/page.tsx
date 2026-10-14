import type { Metadata } from "next";
import { SAME_AS, SITE_NAME, SITE_URL } from "@/data/entity";
import Link from "next/link";
import dynamicImport from "next/dynamic";
import React from "react";
import { SchemaMarkup, paidOffer } from "@/components/seo/schema-markup";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { baseMetadata } from "@/lib/seo/metadata";
import cities from "@/data/cities.json";
import { ToolCallout } from "@/components/marketing/site/ToolCallout";

type City = (typeof cities)[number];

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


/** Cities grouped by region, as the other three hubs do. */
function groupByRegion(list: City[]) {
  return list.reduce<Record<string, City[]>>((acc, city) => {
    (acc[city.region] ??= []).push(city);
    return acc;
  }, {});
}


export async function generateMetadata() {
  return baseMetadata({
    title:
      "Quittances de Loyer 2026 — Génération Automatique PDF Conforme",
    description:
      "Quittances de loyer conformes à la loi de 1989, générées quand le paiement solde le mois. Reçu en cas de paiement partiel, PDF à télécharger. Essai gratuit sans engagement.",
    url: "/quittances",
    ogType: "template",
  });
}
;

const features = [
{
title: "Générée au paiement",
description:
"Enregistrez le paiement reçu : quand le mois est soldé, la quittance est générée avec les montants du bail. Zéro ressaisie.",
icon: "⚡",
},
{
title: "PDF conforme à la loi",
description:
"Chaque quittance distingue le loyer et les charges, comme l'exige l'article 21 de la loi du 6 juillet 1989.",
icon: "📋",
},
{
title: "Reçu de paiement partiel",
description:
"Un versement qui ne couvre pas tout le mois donne un reçu, pas une quittance. La quittance suit quand le solde est réglé.",
icon: "🧾",
},
{
title: "PDF à la demande",
description:
"Chaque quittance se télécharge quand vous en avez besoin. Lokna ne l'envoie pas : vous la transmettez à votre locataire.",
icon: "🏠",
},
{
title: "Archivage illimité",
description:
"Toutes vos quittances stockées en ligne, accessibles à tout moment pour redevabilité.",
icon: "🗄️",
},
{
title: "Export CSV",
description:
"Exportez les paiements de loyer de l'année au format CSV, par exemple pour votre déclaration de revenus fonciers.",
icon: "📤",
},
];

// Article 21 of loi n° 89-462 requires only the detail of the sums paid, rent
// and charges distinguished; the other items are standard practice. The IRL is
// not a quittance mention and must not be listed as one.
const legalRequirements = [
"Montant du loyer, distinct des charges (exigé par la loi)",
"Montant des charges (exigé par la loi)",
"Période couverte (mois et année)",
"Nom du bailleur et du locataire",
"Adresse du bien",
"Date de paiement",
];

const faqData = [
  {
    question: "Comment générer une quittance de loyer ?",
    answer:
      `Avec ${SITE_NAME}, enregistrez le paiement reçu depuis le suivi du mois. Quand le mois est soldé, la quittance est générée avec les montants du bail ; un paiement partiel donne un reçu. Sans compte, vous pouvez aussi utiliser notre générateur gratuit.`,
  },
  {
    question: "La quittance est-elle conforme à la loi ?",
    answer:
      "Oui. La loi du 6 juillet 1989 (article 21) exige que la quittance détaille les sommes versées en distinguant le loyer et les charges, ce que fait chaque quittance générée. Elle mentionne aussi les parties, l'adresse du bien, la période couverte et la date du paiement.",
  },
  {
    question: "Comment envoyer la quittance au locataire ?",
    answer:
      "Téléchargez la quittance en PDF et transmettez-la à votre locataire, par exemple par e-mail s'il a donné son accord. Lokna n'envoie pas la quittance par e-mail à votre place.",
  },
  {
    question: "Les quittances sont-elles horodatées ?",
    answer:
      `Oui. Chaque quittance est horodatée et archivée dans votre espace ${SITE_NAME}. Elles constituent une preuve légale en cas de litige avec un locataire et sont conservées conformément aux obligations fiscales.`,
  },
];

/* ─── Structured Data ─── */

const QUITTANCES_SCHEMA = {
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
          name: "Quittances de loyer",
          item: `${SITE_URL}/quittances`,
        },
      ],
    },
    {
      "@type": "SoftwareApplication",
      name: `${SITE_NAME} — Quittances de loyer`,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: `${SITE_URL}/quittances`,
      description:
        "Quittances de loyer conformes à la loi du 6 juillet 1989, générées quand le paiement enregistré solde le mois. Reçu en cas de paiement partiel, PDF à télécharger.",
      offers: {
        ...paidOffer(),
      },
      featureList: [
        "Quittance générée au paiement",
        "PDF conforme loi 1989",
        "Reçu de paiement partiel",
        "PDF à télécharger",
        "Archivage illimité",
        "Export CSV",
      ],
    },
    {
      "@type": "FAQPage",
      name: `FAQ — Quittances de loyer ${SITE_NAME}`,
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

export default function QuittancesPage() {
  return (
    <div className="min-h-screen bg-cream font-[family-name:var(--font-sans)] antialiased">
      <SchemaMarkup data={QUITTANCES_SCHEMA} breadcrumbRenderedByComponent />

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
<h1 className="text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl">
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
<h3 className="mb-2 text-lg font-semibold text-ink">
{feature.title}
</h3>
<p className="text-sm text-stone-600">{feature.description}</p>
</div>
))}
</div>
</section>

<ToolCallout
className="mb-20"
title="Une quittance tout de suite, sans compte"
text="Le générateur gratuit produit le PDF d'une quittance conforme pour un mois donné."
tool={{ href: "/outils/generateur-quittance", label: "Générer une quittance" }}
secondary={{ href: "/outils/lettre-relance-loyer", label: "Lettre de relance" }}
/>

{/* Legal requirements */}
<section className="mb-20">
<h2 className="mb-6 text-2xl font-semibold text-ink">
Contenu d&apos;une quittance
</h2>
<p className="mb-6 text-stone-600">
La loi du 6 juillet 1989 exige que la quittance distingue le loyer et les
charges. Chaque quittance générée par {SITE_NAME} contient :
</p>
<div className="rounded-xl border border-stone-200 bg-white p-6">
<ul className="grid gap-2 sm:grid-cols-2">
{legalRequirements.map((req) => (
<li key={req} className="flex items-center gap-2 text-sm text-stone-700">
<span className="text-emerald-700">✓</span>
<span>{req}</span>
</li>
))}
</ul>
</div>
</section>

{/* Use cases */}
<section className="mb-20">
<h2 className="mb-8 text-2xl font-semibold text-ink">
Pourquoi automatiser vos quittances ?
</h2>
<div className="grid gap-6 sm:grid-cols-2">
<div className="rounded-xl border border-stone-200 bg-white p-6">
<h3 className="mb-3 text-lg font-semibold text-ink">
⏱️ Gagner du temps
</h3>
<p className="text-sm text-stone-600">
Générez une quittance en 30 secondes au lieu de 15 minutes de saisie
manuelle.
</p>
</div>
<div className="rounded-xl border border-stone-200 bg-white p-6">
<h3 className="mb-3 text-lg font-semibold text-ink">
✅ Zéro erreur
</h3>
<p className="text-sm text-stone-600">
Les montants sont pré-remplis depuis votre base. Plus d'erreurs de calcul
ou d'oubli de mentions.
</p>
</div>
<div className="rounded-xl border border-stone-200 bg-white p-6">
<h3 className="mb-3 text-lg font-semibold text-ink">
📤 Traçabilité
</h3>
<p className="text-sm text-stone-600">
Chaque quittance est horodatée et archivée. Preuve légale en cas de
litige.
</p>
</div>
<div className="rounded-xl border border-stone-200 bg-white p-6">
<h3 className="mb-3 text-lg font-semibold text-ink">
🧾 Paiement partiel
</h3>
<p className="text-sm text-stone-600">
Un versement incomplet donne un reçu, jamais une quittance : la
quittance n&apos;atteste que d&apos;un mois entièrement réglé.
</p>
</div>
</div>
</section>

{/* CTA */}
<section className="mb-16 rounded-2xl bg-forest px-6 py-14 text-center text-white shadow-lg">
<h2 className="text-2xl font-semibold sm:text-3xl">
Générez votre première quittance gratuitement
</h2>
<p className="mx-auto mt-3 max-w-xl text-cream/80">
Essai 14 jours sans carte bancaire. Créez vos quittances, envoyez-les à
vos locataires.
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
href="/locations"
className="text-forest hover:underline"
>
Gestion des locations →
</Link>
<Link
href="/bail"
className="text-forest hover:underline"
>
Gestion des baux →
</Link>
<Link
href="/pricing"
className="text-forest hover:underline"
>
Tarifs →
</Link>
</nav>
</article>


      {/* Cities.
          These 50 URLs are in the sitemap but nothing linked to them: this hub is
          the only one of the four that did not import `cities`, so every
          /quittances/<city> page was reachable only from its own breadcrumb. The
          other three hubs (bail, gestion-locative, assurance-loyer-impaye) all
          linked theirs. A page nothing links to is a page a crawler has no reason
          to keep, and the sitemap alone is not a recommendation.
          Same grouping by region, same Link pattern, so the hubs stay
          consistent rather than four slightly different lists. */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
          Quittances de loyer par ville
        </h2>
        <p className="mt-3 max-w-2xl text-stone-600">
          Modèles et mentions obligatoires adaptés aux pratiques locales de
          l'état des lieux dans votre commune.
        </p>
        <div className="mt-10 space-y-10">
          {Object.entries(groupByRegion(cities)).map(([region, regionCities]) => (
            <div key={region}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                {region}
              </h3>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 lg:grid-cols-4">
                {regionCities.map((city) => (
                  <li key={city.slug}>
                    <Link
                      href={`/quittances/${city.slug}`}
                      className="text-sm text-stone-700 underline-offset-4 hover:text-stone-900 hover:underline"
                    >
                      Quittance de loyer {city.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

<FinalCta />
</div>
);
}