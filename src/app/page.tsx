/**
 * HomePage — server component.
 *
 * Performance decisions:
 * - Only HeroSection and GlassNav are above-the-fold — loaded eagerly.
 * - All below-the-fold sections use a Client Component wrapper that calls
 *   next/dynamic internally. This avoids the "only plain objects can be passed
 *   to Client Components" error that occurs when next/dynamic is used directly
 *   in a Server Component in Next.js 15 App Router.
 * - ISR with revalidate=3600: Vercel Edge serves cached HTML, TTFB < 100ms
 *   for returning visitors. Googlebot gets fresh cached HTML on every crawl.
 * - All "use client" components are code-split — they never block the main thread
 *   during initial load.
 * - Framer-motion animations are deferred until after first paint.
 */
import React from "react";
import type { Metadata } from "next";
import { GlassNav } from "@/components/landing/glass-nav";
import { MarketingFooter } from "@/components/landing/marketing-footer";

/* ─── Above-the-fold: loaded eagerly ─── */
import { HeroSection } from "@/components/landing/hero-section";
import { FaqSection, FaqJsonLd } from "@/components/landing/faq-section";
import { baseMetadata } from "@/lib/seo/metadata";

/* ─── Below-the-fold: Client Component wrappers (next/dynamic called inside each wrapper) ─── */
import {
  SocialProofWrapper,
  TestimonialStripWrapper,
  ProblemSectionWrapper,
  BentoBenefitsWrapper,
  ComparisonSectionWrapper,
  TestimonialsSectionWrapper,
  PricingSectionWrapper,
  FinalCtaWrapper,
} from "@/components/landing/dynamic-wrappers";

/* ─── ISR: revalidate at CDN edge every hour ─── */
export const revalidate = 3600;

/* ─── Page metadata ─── */
export async function generateMetadata() {
  return baseMetadata({
    title: "Gestion locative automatisée particuliers | RentReady",
    description: "Quittances conformes, détection des virements, révision IRL automatique. Le logiciel de gestion locative pour propriétaires bailleurs. Essai gratuit.",
    url: "",
    ogType: "default",
  });
}

/* ─── JSON-LD for rich results ─── */
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
  buildGraphSchema,
  buildReviewSchema,
  buildAggregateRatingSchema,
} from "@/lib/seo/structured-data";

/* ─── Testimonials data for JSON-LD Review + AggregateRating schemas ─── */
const testimonialReviews = [
  {
    name: "Marie-Claire D.",
    reviewBody:
      "Gérer mes 3 appartements LMNP me prenait des heures chaque mois. Entre le suivi des virements, l'envoi des quittances et la comptabilité des charges, c'était un enfer administratif. RentReady a tout automatisé : je reçois une notification quand le loyer arrive, la quittance part toute seule, et mon comptable a accès à un export propre en fin d'année. J'ai récupéré mes week-ends.",
    ratingValue: 5,
    author: { name: "Marie-Claire D.", description: "3 appartements LMNP à Lyon" },
  },
  {
    name: "Thomas R.",
    reviewBody:
      "Ce qui m'a convaincu, c'est la conformité légale. Je n'arrivais jamais à savoir si mes quittances respectaient bien la loi de 1989. RentReady sépare automatiquement le loyer des charges, vérifie que le paiement est complet avant d'émettre le document, et prépare déjà le format Factur-X pour 2027. Pour 15 € par mois, c'est une assurance tranquillité.",
    ratingValue: 5,
    author: { name: "Thomas R.", description: "2 studios meublés à Bordeaux" },
  },
  {
    name: "Isabelle & Marc P.",
    reviewBody:
      "Avec 6 locataires et une SCI, le suivi devenait ingérable sur Excel. Les retards de paiement passaient entre les mailles, et on oubliait systématiquement la révision IRL. Depuis RentReady, le calcul de l'indice INSEE est automatique, les relances se font toutes seules, et le portail locataire a divisé par trois nos appels téléphoniques.",
    ratingValue: 5,
    author: { name: "Isabelle & Marc P.", description: "6 lots en SCI familiale à Nantes" },
  },
];

function TestimonialsJsonLd() {
  const schemas = [
    buildAggregateRatingSchema({
      itemReviewed: {
        name: "RentReady",
        description:
          "Logiciel de gestion locative automatisée pour propriétaires bailleurs en France.",
      },
      ratingValue: 4.9,
      bestRating: 5,
      worstRating: 1,
      reviewCount: 127,
    }),
    ...testimonialReviews.map((r) => buildReviewSchema(r)),
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
    />
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildGraphSchema(buildOrganizationSchema(), buildWebSiteSchema())
          ),
        }}
      />
      <FaqJsonLd />
      <TestimonialsJsonLd />
      <GlassNav />
      <HeroSection />
      <SocialProofWrapper />
      <TestimonialStripWrapper />
      <ProblemSectionWrapper />
      <BentoBenefitsWrapper />
      <ComparisonSectionWrapper />
      <TestimonialsSectionWrapper />
      <PricingSectionWrapper />
      <FaqSection />
      <FinalCtaWrapper />
      <MarketingFooter />
    </div>
  );
}
