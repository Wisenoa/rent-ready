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

export const metadata: Metadata = {
  title: "RentReady — Logiciel de Gestion Locative pour Particuliers | Quittances, IRL, Open Banking",
  description:
    "Le logiciel de gestion locative pour propriétaires indépendants (1 à 10 biens). Quittances conformes loi 1989, révision IRL automatique INSEE, détection des loyers via Open Banking DSP2, portail locataire. 15 €/mois.",
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
    title: "RentReady — Le logiciel de gestion locative qui automatise tout",
    description:
      "Quittances légales, détection des virements, révision IRL, portail locataire. Le pilote automatique pour propriétaires bailleurs. 15 €/mois.",
    type: "website",
    locale: "fr_FR",
    siteName: "RentReady",
  },
  alternates: {
    canonical: "https://www.rentready.fr",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
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
