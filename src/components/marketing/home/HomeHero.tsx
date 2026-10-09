import React from "react";
import { ArrowRight } from "lucide-react";
import { HomeDemo } from "./HomeDemo";
import { TrackedCtaLink } from "./TrackedCtaLink";

export function HomeHero() {
  return (
    <section id="demo" className="pt-5 sm:pt-10 pb-8 sm:pb-12 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto space-y-3 sm:space-y-4">
        <h1 className="text-2xl sm:text-4xl md:text-[2.75rem] font-semibold tracking-tight text-[#15241F] leading-[1.15]">
          Gérez vos locations sans tableur.
        </h1>
        <p className="text-xs sm:text-base text-[#5A6660] leading-relaxed max-w-xl mx-auto">
          Le logiciel pour propriétaires bailleurs : suivi des loyers, quittances prêtes en un clic et rappels de révision IRL. Vous n'intervenez que si une action est nécessaire.
        </p>

        {/* Primary CTA + Micro-proof */}
        <div className="pt-1 flex flex-col items-center gap-1.5">
          <TrackedCtaLink
            href="/register"
            event={{ name: "homepage_hero_cta_click", properties: { position: "hero" } }}
            className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-lg bg-[#1E3A2F] text-white hover:bg-[#15241F] font-medium text-xs sm:text-sm transition-colors shadow-2xs inline-flex items-center justify-center gap-2 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1E3A2F]"
          >
            Essayer gratuitement <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </TrackedCtaLink>
          <p className="text-[11px] sm:text-xs text-[#7C8782]">
            14 jours d'essai gratuit · Sans carte bancaire
          </p>
        </div>
      </div>

      {/* Embedded Product Demo */}
      <div className="mt-5 sm:mt-8">
        <HomeDemo initialState="attention" />
      </div>
    </section>
  );
}
