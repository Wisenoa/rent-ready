import React from "react";
import { ArrowRight, Calculator, FileText } from "lucide-react";
import { TrackedCtaLink } from "./TrackedCtaLink";

export function HomeTools() {
  return (
    <section id="outils" className="py-12 sm:py-16 border-t border-[#E5E2DA]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-xl font-semibold text-[#15241F] tracking-tight">
              Outils gratuits en accès libre
            </h2>
            <p className="text-xs sm:text-sm text-[#5A6660] mt-0.5">
              Utilisables immédiatement, sans inscription préalable.
            </p>
          </div>
        </div>

        {/* Editorial 2-column strip instead of bulky cards */}
        <div className="divide-y divide-[#E5E2DA] border-y border-[#E5E2DA]">
          {/* Tool 1 */}
          <TrackedCtaLink
            href="/outils/calculateur-irl"
            event={{ name: "homepage_tool_click", properties: { tool: "irl" } }}
            className="group py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#FAF8F5] px-2 rounded-sm transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1E3A2F]"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#1E3A2F]" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-semibold text-[#15241F] group-hover:text-[#1E3A2F] transition-colors">
                  Calculateur de révision IRL 2026
                </span>
              </div>
              <p className="text-xs text-[#5A6660]">
                Calculez l'augmentation légale exacte selon la formule INSEE et le trimestre de votre bail.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#1E3A2F] shrink-0 pt-1 sm:pt-0">
              Calculer une révision <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </span>
          </TrackedCtaLink>

          {/* Tool 2 */}
          <TrackedCtaLink
            href="/outils/modele-quittance-loyer-pdf"
            event={{ name: "homepage_tool_click", properties: { tool: "quittance_pdf" } }}
            className="group py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#FAF8F5] px-2 rounded-sm transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1E3A2F]"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#1E3A2F]" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-semibold text-[#15241F] group-hover:text-[#1E3A2F] transition-colors">
                  Modèle de quittance de loyer PDF
                </span>
              </div>
              <p className="text-xs text-[#5A6660]">
                Éditez une quittance conforme avec ventilation loyer/charges et mentions obligatoires de la loi de 1989.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#1E3A2F] shrink-0 pt-1 sm:pt-0">
              Générer une quittance <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </span>
          </TrackedCtaLink>
        </div>
      </div>
    </section>
  );
}
