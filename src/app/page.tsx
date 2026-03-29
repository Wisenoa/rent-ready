import Link from "next/link";
import type { Metadata } from "next";
import { GlassNav } from "@/components/landing/glass-nav";
import { HeroSection } from "@/components/landing/hero-section";
import { SocialProof } from "@/components/landing/social-proof";
import { ProblemSection } from "@/components/landing/problem-section";
import { BentoBenefits } from "@/components/landing/bento-benefits";
import { ComparisonSection } from "@/components/landing/comparison-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FaqSection, FaqJsonLd } from "@/components/landing/faq-section";
import { FinalCta } from "@/components/landing/final-cta";

/* ─── Metadata (Title ≤60, Description ≤155) ─── */

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
  alternates: {
    canonical: "https://www.rentready.fr",
  },
};

/* ─── JSON-LD: SoftwareApplication + Organization + Service ─── */

function HomeJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "RentReady",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: "https://www.rentready.fr",
        description:
          "Logiciel de gestion locative automatisée pour propriétaires bailleurs indépendants en France (1 à 10 biens).",
        offers: {
          "@type": "Offer",
          price: "15.00",
          priceCurrency: "EUR",
          priceValidUntil: "2027-12-31",
          availability: "https://schema.org/InStock",
          url: "https://www.rentready.fr/register",
        },
        featureList: [
          "Quittances de loyer conformes loi du 6 juillet 1989",
          "Détection automatique des virements via Open Banking DSP2",
          "Révision IRL connectée à l'INSEE",
          "Portail locataire avec gestion de la maintenance",
          "OCR factures artisans par intelligence artificielle",
          "Conformité Factur-X et e-reporting B2C 2027",
        ],
      },
      {
        "@type": "Organization",
        name: "RentReady",
        url: "https://www.rentready.fr",
        logo: "https://www.rentready.fr/logo.png",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "contact@rentready.fr",
          availableLanguage: "French",
        },
        address: {
          "@type": "PostalAddress",
          addressCountry: "FR",
        },
      },
      {
        "@type": "Service",
        name: "RentReady — Gestion locative automatisée",
        serviceType: "Property Management Software",
        provider: {
          "@type": "Organization",
          name: "RentReady",
        },
        offers: {
          "@type": "Offer",
          price: "15.00",
          priceCurrency: "EUR",
          eligibleDuration: {
            "@type": "QuantitativeValue",
            value: "1",
            unitCode: "MON",
          },
        },
        areaServed: {
          "@type": "Country",
          name: "France",
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

      {/* ─── Footer ─── */}
      <footer className="pb-12 pt-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-5 text-[13px] text-stone-400 sm:flex-row sm:justify-between sm:px-8">
          <p>&copy; {new Date().getFullYear()} RentReady. Tous droits réservés.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/gestion-locative"
              className="transition-colors hover:text-stone-600"
            >
              Gestion locative
            </Link>
            <Link
              href="/mentions-legales"
              className="transition-colors hover:text-stone-600"
            >
              Mentions légales
            </Link>
            <Link
              href="/politique-confidentialite"
              className="transition-colors hover:text-stone-600"
            >
              Confidentialité
            </Link>
            <Link
              href="/cgu"
              className="transition-colors hover:text-stone-600"
            >
              CGU
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
