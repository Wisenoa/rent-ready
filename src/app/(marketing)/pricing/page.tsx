import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import React from "react";

import { TrustLogos } from "@/components/seo/TrustLogos";
import { ContentReviewBadge } from "@/components/seo/ContentReviewBadge";
import { baseMetadata } from "@/lib/seo/metadata";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { SocialProof } from "@/components/landing/social-proof";

// ISR: revalidate marketing pages at CDN edge every hour
// Keeps content fresh while serving cached HTML for TTFB < 100ms
export const revalidate = 3600;

// Dynamic import: FinalCta uses framer-motion (heavy, below-fold)
// → code-split so it doesn't block initial JS bundle or INP
const FinalCta = dynamic(
  () => import("@/components/landing/final-cta").then((mod) => mod.FinalCta),
  { loading: () => <div style={{ minHeight: 400 }} aria-hidden="true" /> }
);

// Dynamic import: interactive pricing (uses client state — framer-motion)
const PricingSectionWrapper = dynamic(
  () =>
    import("@/components/landing/pricing-section-wrapper").then(
      (mod) => mod.PricingSectionWrapper
    ),
  {
    loading: () => (
      <div className="grid gap-6 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="skeleton rounded-[2rem] border border-stone-200/30 bg-white/40"
            style={{ height: 520 }}
          />
        ))}
      </div>
    ),
  }
);

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata({
    title:
      "Tarifs RentReady 2026 — À partir de 9 €/mois | Essai gratuit sans engagement",
    description:
      "Plans dès 9 €/mois — Starter (3 biens), Pro (10 biens), Agency. Quittances conformes, détection loyers DSP2, IRL automatique. 127 propriétaires. Essai gratuit 14 jours.",
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
    answer: "RentReady propose 3 plans : Starter à 9 €/mois, Pro à 15 €/mois, et Agency sur devis. Sans engagement sur les plans mensuels. Le tarif annuel offre 2 mois gratuits (89 €/an Starter, 149 €/an Pro). Essai gratuit 14 jours sans carte bancaire.",
  },
  {
    question: "Que se passe-t-il si je dépasse la limite de biens ?",
    answer: "Le plan Starter couvre jusqu'à 3 biens, le plan Pro jusqu'à 10 biens. Si vous dépassez cette limite, vous pouvez migrer vers le plan Agency (sur devis) ou contacter notre équipe pour un abonnement adapté à votre portfolio. Aucun frais caché.",
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
  {
    question: "Quelle est la différence entre le plan Starter et Pro ?",
    answer: "Le plan Starter est idéal pour commencer (3 biens max). Le plan Pro ajoute l'OCR par IA pour les factures artisans, la conformité Factur-X complète, l'export comptable et la relance automatique des impayés — indispensable pour une gestion locative professionnelle.",
  },
  {
    question: "Le plan Agency inclut-il un support dédié ?",
    answer: "Oui, le plan Agency inclut un support dédié avec SLA et un onboarding personnalisé. Vous avez également accès à l'API et aux intégrations, au multi-utilisateurs avec rôles, et à un reporting avancé.",
  },
];

function PricingJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Tarifs", url: "https://www.rentready.fr/tarifs" },
    ]),
    buildOrganizationSchema({ "@id": "https://www.rentready.fr/#organization" }),
    buildWebPageSchema({
      name: "Tarifs RentReady",
      description:
        "À partir de 9 €/mois. Gestion locative automatisée : quittances conformes, détection loyers, révision IRL, portail locataire.",
      url: "https://www.rentready.fr/tarifs",
    }),
    buildSoftwareAppSchema({
      name: "RentReady",
      description:
        "Logiciel de gestion locative automatisée pour propriétaires bailleurs indépendants en France (1 à 10+ biens).",
      applicationCategory: "BusinessApplication",
      offers: [
        {
          name: "Essai gratuit",
          description: "14 jours d'essai gratuit sans carte bancaire",
          price: "0.00",
          priceCurrency: "EUR",
        },
        {
          name: "Starter mensuel",
          description: "9 €/mois — jusqu'à 3 biens, gestion locative complète",
          price: "9.00",
          priceCurrency: "EUR",
        },
        {
          name: "Starter annuel",
          description: "89 €/an — 2 mois offerts",
          price: "89.00",
          priceCurrency: "EUR",
        },
        {
          name: "Pro mensuel",
          description:
            "15 €/mois — jusqu'à 10 biens, OCR IA, Factur-X, relance auto",
          price: "15.00",
          priceCurrency: "EUR",
        },
        {
          name: "Pro annuel",
          description: "149 €/an — 2 mois offerts",
          price: "149.00",
          priceCurrency: "EUR",
        },
      ],
      features: [
        "Quittances de loyer conformes loi 1989",
        "Détection automatique des loyers via Open Banking DSP2",
        "Révision IRL connectée à l'INSEE",
        "Portail locataire avec gestion de la maintenance",
        "OCR factures artisans par intelligence artificielle",
        "Conformité Factur-X et e-reporting B2C 2026",
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

const comparisonData = [
  {
    feature: "Nombre de biens",
    starter: "Jusqu'à 3",
    pro: "Jusqu'à 10",
    agency: "Illimité",
  },
  {
    feature: "Quittances conformes loi 1989",
    starter: "✅ Automatique",
    pro: "✅ Automatique",
    agency: "✅ Automatique",
  },
  {
    feature: "Détection des loyers",
    starter: "✅ Open Banking",
    pro: "✅ Open Banking DSP2",
    agency: "✅ Open Banking DSP2",
  },
  {
    feature: "Révision IRL INSEE",
    starter: "✅ Automatique",
    pro: "✅ Automatique",
    agency: "✅ Automatique",
  },
  {
    feature: "Portail locataire",
    starter: "✅ Inclus",
    pro: "✅ Inclus",
    agency: "✅ Inclus",
  },
  {
    feature: "OCR factures artisans (IA)",
    starter: "❌ Non disponible",
    pro: "✅ IA incluse",
    agency: "✅ IA incluse",
  },
  {
    feature: "Conformité Factur-X 2026",
    starter: "❌ Non conforme",
    pro: "✅ Prêt",
    agency: "✅ Prêt",
  },
  {
    feature: "Export comptable",
    starter: "❌ Non disponible",
    pro: "✅ Inclus",
    agency: "✅ Inclus",
  },
  {
    feature: "Relance automatique impayés",
    starter: "❌ Non disponible",
    pro: "✅ Incluse",
    agency: "✅ Incluse",
  },
  {
    feature: "Multi-utilisateurs & rôles",
    starter: "❌ Non disponible",
    pro: "❌ Non disponible",
    agency: "✅ Inclus",
  },
  {
    feature: "API & intégrations",
    starter: "❌ Non disponible",
    pro: "❌ Non disponible",
    agency: "✅ Inclus",
  },
  {
    feature: "Support",
    starter: "Email standard",
    pro: "Email prioritaire",
    agency: "Support dédié + SLA",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <PricingJsonLd />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <header className="mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl text-balance">
            Un tarif transparent.
            <br />
            Zéro surprise.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Tout ce dont vous avez besoin pour gérer vos locations, au prix
            d&apos;un café par jour. Essai gratuit, sans engagement.
          </p>

          {/* E-E-A-T: content review badge */}
          <div className="mt-6">
            <ContentReviewBadge updatedAt="2026-04-25" category="article" />
          </div>
        </header>

        {/* ── Social proof stats ──────────────────────────────── */}
        <div className="mb-12">
          <SocialProof />
        </div>

        {/* ── Trust signals ────────────────────────────────────── */}
        <div className="mb-16">
          <TrustLogos variant="full" showMedia={false} />
        </div>

        {/* ── Pricing section with toggle ─────────────────────── */}
        <section aria-label="Plans tarifaires">
          <PricingSectionWrapper />
        </section>

        {/* ── Comparison table ────────────────────────────────── */}
        <section className="mt-20" aria-label="Comparaison des plans">
          <h2 className="mb-8 text-center text-2xl font-bold text-stone-900">
            Tous les plans en un coup d&apos;œil
          </h2>
          <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-xl">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-stone-200 bg-stone-50/50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-stone-900">
                    Fonctionnalité
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-blue-600">
                    Starter
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-emerald-600">
                    Pro
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-amber-600">
                    Agency
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {comparisonData.map((row) => (
                  <tr key={row.feature} className="hover:bg-stone-50/50">
                    <td className="px-6 py-4 text-stone-700">{row.feature}</td>
                    <td className="px-6 py-4 text-center text-blue-600">
                      {row.starter}
                    </td>
                    <td className="px-6 py-4 text-center text-emerald-600">
                      {row.pro}
                    </td>
                    <td className="px-6 py-4 text-center text-amber-600">
                      {row.agency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Testimonials ─────────────────────────────────────── */}
        <section className="mt-20" aria-label="Témoignages clients">
          <TestimonialsSection />
        </section>

        {/* ── FAQ ─────────────────────────────────────────────── */}
        <section className="mt-20" aria-label="Questions fréquentes">
          <h2 className="mb-8 text-center text-2xl font-bold text-stone-900">
            Questions fréquentes
          </h2>
          <dl className="mx-auto max-w-2xl space-y-6">
            {pricingFaqs.map((faq) => (
              <div key={faq.question}>
                <dt className="text-base font-semibold text-stone-900">
                  {faq.question}
                </dt>
                <dd className="mt-2 text-stone-600">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </article>

      <FinalCta />
    </div>
  );
}
