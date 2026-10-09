import React from "react";
import { ArrowRight } from "lucide-react";
import { TrackedCtaLink } from "./TrackedCtaLink";

export function HomeFinalCTA() {
  return (
    <section className="py-12 sm:py-16 border-t border-[#E5E2DA] bg-[#FAF8F5]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-[#15241F]">
          Essayez RentReady sur votre prochaine échéance.
        </h2>
        <p className="text-xs sm:text-sm text-[#5A6660] max-w-lg mx-auto leading-relaxed">
          Ajoutez vos logements et découvrez une gestion locative sans tableur, où seule l'action nécessaire demande votre attention.
        </p>

        <div className="pt-2 flex flex-col items-center gap-1.5">
          <TrackedCtaLink
            href="/register"
            event={{ name: "homepage_final_cta_click", properties: { position: "footer_banner" } }}
            className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-lg bg-[#1E3A2F] text-white hover:bg-[#15241F] font-medium text-xs sm:text-sm transition-colors shadow-2xs inline-flex items-center justify-center gap-2 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1E3A2F]"
          >
            Essayer gratuitement <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </TrackedCtaLink>
          <p className="text-[11px] sm:text-xs text-[#7C8782]">
            14 jours offerts · Sans carte bancaire · Annulation en un clic
          </p>
        </div>
      </div>
    </section>
  );
}
