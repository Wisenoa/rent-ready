import Link from "next/link";
import type { Metadata } from "next";
import { GlassNav } from "@/components/landing/glass-nav";
import { HeroSection } from "@/components/landing/hero-section";
import { SocialProof } from "@/components/landing/social-proof";
import { BentoBenefits } from "@/components/landing/bento-benefits";
import { ComparisonSection } from "@/components/landing/comparison-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FinalCta } from "@/components/landing/final-cta";

export const metadata: Metadata = {
  title: "RentReady — Gestion Locative Automatisée pour Propriétaires Indépendants",
  description:
    "Encaissement automatique, quittances légales et gestion des urgences. RentReady est le pilote automatique qui sécurise vos revenus locatifs pour 15 €/mois.",
  openGraph: {
    title: "RentReady — Libérez-vous de la gestion locative",
    description:
      "Le pilote automatique pour propriétaires bailleurs. Quittances, IRL, portail locataire. 15 €/mois.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <GlassNav />
      <HeroSection />
      <SocialProof />
      <BentoBenefits />
      <ComparisonSection />
      <PricingSection />
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
