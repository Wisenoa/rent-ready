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
    title: "RentReady — Logiciel gestion locative pour propriétaires | Essai gratuit",
    description:
      "Automatisez vos quittances, détectez les loyers automatiquement et révisez l'IRL en 1 clic. Essai gratuit 14 jours, sans carte bancaire.",
    url: "",
    ogType: "default",
  });
}

/* ─── JSON-LD for rich results ─── */
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
  buildGraphSchema,
} from "@/lib/seo/structured-data";

/**
 * No AggregateRating / Review markup here on purpose.
 *
 * The homepage previously shipped `ratingValue: 4.9`, `reviewCount: 127` and
 * three named testimonials in JSON-LD. None of it traced to a real review
 * source. Unverifiable review markup violates Google's structured data
 * guidelines and risks a manual action, and invented social proof is the
 * "fake success" pattern we refuse to ship. Add Review/AggregateRating only
 * once ratings come from a real, verifiable source.
 */

export default function HomePage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildGraphSchema(buildOrganizationSchema(), buildWebSiteSchema())
          ),
        }}
      />
      <FaqJsonLd />
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
    </main>
  );
}
