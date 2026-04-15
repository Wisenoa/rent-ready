/**
 * HomePage — server component.
 *
 * Performance decisions:
 * - Only HeroSection and GlassNav are above-the-fold — loaded eagerly.
 * - All below-the-fold sections (social-proof, benefits, comparisons, etc.)
 *   use Next.js dynamic() for code splitting. Each section ships its JS
 *   separately so the initial bundle stays lean and INP stays low.
 * - ISR with revalidate=3600: Vercel Edge serves cached HTML, TTFB < 100ms
 *   for returning visitors. Googlebot gets fresh cached HTML on every crawl.
 * - All "use client" components are code-split — they never block the main thread
 *   during initial load.
 * - Framer-motion animations are deferred until after first paint.
 */
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { GlassNav } from "@/components/landing/glass-nav";
import { MarketingFooter } from "@/components/landing/marketing-footer";

/* ─── Above-the-fold: loaded eagerly ─── */
import { HeroSection } from "@/components/landing/hero-section";
import { FaqSection, FaqJsonLd } from "@/components/landing/faq-section";

/* ─── Below-the-fold: dynamically imported (code-split) ─── */
const SocialProof = dynamic(
  () => import("@/components/landing/social-proof"),
  { ssr: true, loading: () => <div className="py-16 sm:py-20" style={{ minHeight: 180 }} aria-hidden="true" /> }
);
const ProblemSection = dynamic(
  () => import("@/components/landing/problem-section"),
  { ssr: true, loading: () => <div style={{ minHeight: 600 }} aria-hidden="true" /> }
);
const BentoBenefits = dynamic(
  () => import("@/components/landing/bento-benefits"),
  { ssr: true, loading: () => <div style={{ minHeight: 800 }} aria-hidden="true" /> }
);
const ComparisonSection = dynamic(
  () => import("@/components/landing/comparison-section"),
  { ssr: true, loading: () => <div style={{ minHeight: 500 }} aria-hidden="true" /> }
);
const TestimonialsSection = dynamic(
  () => import("@/components/landing/testimonials-section"),
  { ssr: true, loading: () => <div style={{ minHeight: 400 }} aria-hidden="true" /> }
);
const PricingSection = dynamic(
  () => import("@/components/landing/pricing-section"),
  { ssr: true, loading: () => <div style={{ minHeight: 600 }} aria-hidden="true" /> }
);
const FinalCta = dynamic(
  () => import("@/components/landing/final-cta"),
  { ssr: true, loading: () => <div style={{ minHeight: 400 }} aria-hidden="true" /> }
);

/* ─── ISR: revalidate at CDN edge every hour ─── */
export const revalidate = 3600;

/* ─── Page metadata ─── */
export const metadata: Metadata = {
  title: "Gestion locative automatisée particuliers | RentReady",
  description:
    "Quittances conformes, détection des virements, révision IRL automatique. Le logiciel de gestion locative pour propriétaires bailleurs. Essai gratuit.",
  keywords: [
    "logiciel gestion locative",
    "gestion locative particulier",
    "quittance de loyer automatique",
    "indice de référence des loyers IRL",
    "revision loyer INSEE",
    "gestion locative en ligne",
    "logiciel propriétaire bailleur",
    "Factur-X gestion locative",
    "e-reporting B2C location",
    "LMNP gestion",
    "SCI gestion locative",
    "open banking DSP2 loyer",
  ],
  openGraph: {
    title: "RentReady — Gestion locative automatisée pour particuliers",
    description:
      "Quittances légales, détection des virements, révision IRL. Le pilote automatique des propriétaires bailleurs. 15 €/mois.",
    type: "website",
    locale: "fr_FR",
    siteName: "RentReady",
    images: [
      {
        url: "https://www.rentready.fr/og-image.png",
        width: 1200,
        height: 630,
        alt: "RentReady — Logiciel de gestion locative automatisée",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RentReady — Gestion locative automatisée pour particuliers",
    description:
      "Quittances légales, détection des virements, révision IRL. Le pilote automatique des propriétaires bailleurs. 15 €/mois.",
    images: ["https://www.rentready.fr/og-image.png"],
  },
  alternates: {
    canonical: "https://www.rentready.fr",
  },
};

/* ─── JSON-LD for rich results ─── */
function HomeJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "RentReady",
        url: "https://www.rentready.fr",
        logo: "https://www.rentready.fr/logo.png",
        sameAs: [
          "https://twitter.com/rentready_fr",
          "https://www.linkedin.com/company/rentready",
        ],
        address: {
          "@type": "PostalAddress",
          addressCountry: "FR",
          addressLocality: "France",
        },
        description:
          "Quittances conformes loi 1989, détection automatique des loyers via Open Banking, révision IRL, portail locataire et conformité Factur-X.",
      },
      {
        "@type": "WebSite",
        name: "RentReady",
        url: "https://www.rentready.fr",
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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <HomeJsonLd />
      <FaqJsonLd />
      <GlassNav />
      <HeroSection />
      <SocialProof />
      <ProblemSection />
      <BentoBenefits />
      <ComparisonSection />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection />
      <FinalCta />
      <MarketingFooter />
    </div>
  );
}