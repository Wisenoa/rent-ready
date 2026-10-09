"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { trackHomepageEvent } from "@/lib/analytics/homepage-tracker";

export function HomePricing() {
  const [annual, setAnnual] = useState(false);

  const handleToggle = (isAnnual: boolean) => {
    setAnnual(isAnnual);
  };

  const handlePlanClick = (plan: "starter" | "pro") => {
    trackHomepageEvent({
      name: "homepage_pricing_click",
      properties: {
        plan,
        billing: annual ? "annual" : "monthly",
      },
    });
  };

  return (
    <section id="tarifs" className="py-10 sm:py-16 border-t border-[#E5E2DA] bg-[#FAF8F5]/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#15241F]">
            Des tarifs simples, adaptés à vos logements
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6660]">
            14 jours d'essai gratuit sur chaque formule. Sans carte bancaire requise.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="pt-2 flex items-center justify-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleToggle(false)}
              className={`px-3 py-1 rounded-md font-medium transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1E3A2F] ${
                !annual
                  ? "bg-[#1E3A2F] text-white"
                  : "text-[#5A6660] hover:bg-[#E5E2DA]/50"
              }`}
            >
              Mensuel
            </button>
            <button
              type="button"
              onClick={() => handleToggle(true)}
              className={`px-3 py-1 rounded-md font-medium transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1E3A2F] ${
                annual
                  ? "bg-[#1E3A2F] text-white"
                  : "text-[#5A6660] hover:bg-[#E5E2DA]/50"
              }`}
            >
              Annuel <span className="text-[#A3E635] text-[11px] font-semibold">(2 mois offerts)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
          {/* Plan Starter */}
          <div className="p-5 rounded-xl border border-[#E5E2DA] bg-white flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-[#5A6660] uppercase tracking-wider">
                  Plan Starter
                </span>
                <p className="text-xs text-[#7C8782] mt-0.5">Pour 1 à 3 logements</p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-bold text-[#15241F] tabular-nums">
                    {annual ? "89 €" : "9 €"}
                  </span>
                  <span className="text-xs text-[#5A6660]">
                    {annual ? "/ an (soit 7,42 €/mois)" : "/ mois"}
                  </span>
                </div>
              </div>

              <ul className="space-y-1.5 text-xs text-[#15241F] pt-1">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1E3A2F] shrink-0" aria-hidden="true" />
                  <span>Suivi mensuel jusqu'à 3 logements</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1E3A2F] shrink-0" aria-hidden="true" />
                  <span>Quittances et reçus conformes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1E3A2F] shrink-0" aria-hidden="true" />
                  <span>Détection des retards et écarts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1E3A2F] shrink-0" aria-hidden="true" />
                  <span>Export CSV pour votre comptable</span>
                </li>
              </ul>
            </div>

            <Link
              href="/register?plan=starter"
              onClick={() => handlePlanClick("starter")}
              className="w-full py-2.5 rounded-lg border border-[#1E3A2F] text-[#1E3A2F] hover:bg-[#1E3A2F] hover:text-white font-medium text-xs text-center transition-colors block focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1E3A2F]"
            >
              Essayer Starter (14 jours offerts)
            </Link>
          </div>

          {/* Plan Pro */}
          <div className="p-5 rounded-xl border-2 border-[#1E3A2F] bg-white flex flex-col justify-between space-y-4 shadow-xs relative">
            <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-[#1E3A2F] text-white text-[10px] font-semibold tracking-wide uppercase">
              Recommandé
            </span>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-[#1E3A2F] uppercase tracking-wider">
                  Plan Pro
                </span>
                <p className="text-xs text-[#7C8782] mt-0.5">Pour 4 à 10 logements</p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-bold text-[#15241F] tabular-nums">
                    {annual ? "149 €" : "15 €"}
                  </span>
                  <span className="text-xs text-[#5A6660]">
                    {annual ? "/ an (soit 12,41 €/mois)" : "/ mois"}
                  </span>
                </div>
              </div>

              <ul className="space-y-1.5 text-xs text-[#15241F] pt-1">
                <li className="flex items-center gap-2 font-medium text-[#1E3A2F]">
                  <Check className="w-3.5 h-3.5 text-[#1E3A2F] shrink-0" aria-hidden="true" />
                  <span>Tout Starter jusqu'à 10 logements</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1E3A2F] shrink-0" aria-hidden="true" />
                  <span>Rappels & calcul révision IRL INSEE</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1E3A2F] shrink-0" aria-hidden="true" />
                  <span>Relances d'impayés en 1 clic</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1E3A2F] shrink-0" aria-hidden="true" />
                  <span>Analyse de conformité des baux</span>
                </li>
              </ul>
            </div>

            <Link
              href="/register?plan=pro"
              onClick={() => handlePlanClick("pro")}
              className="w-full py-2.5 rounded-lg bg-[#1E3A2F] text-white hover:bg-[#15241F] font-medium text-xs text-center transition-colors block shadow-2xs focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1E3A2F]"
            >
              Essayer Pro (14 jours offerts)
            </Link>
          </div>
        </div>

        <div className="text-center pt-1">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1 text-xs text-[#5A6660] hover:text-[#15241F] underline transition-colors focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[#1E3A2F]"
          >
            Consulter le comparatif détaillé des offres <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
