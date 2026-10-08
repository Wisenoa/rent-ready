"use client";

import React from "react";
import { Scale, ShieldCheck, FileCheck } from "lucide-react";

export function B3LegalTrust() {
  return (
    <section className="py-10 sm:py-14 border-t border-[#E5E2DA] bg-[#FAF8F5]/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="max-w-md mx-auto text-center space-y-1">
          <h2 className="text-base sm:text-lg font-semibold text-[#15241F] tracking-tight">
            Rigueur juridique et protection des données
          </h2>
          <p className="text-xs text-[#5A6660]">
            Des règles précises, conformes aux textes légaux en vigueur.
          </p>
        </div>

        {/* 3 Open Columns without chunky cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 pt-1">
          {/* Item 1 */}
          <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-[#E5E2DA] pt-3 md:pt-0 md:pl-4 first:border-none first:pt-0 first:pl-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1E3A2F]">
              <FileCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Loi du 6 juillet 1989 · Art. 21</span>
            </div>
            <p className="text-xs text-[#5A6660] leading-relaxed">
              Quittance émise uniquement sur solde à 100 %. Reçu d'acompte avec reste dû en cas de versement partiel. Ventilation loyer nu et charges.
            </p>
          </div>

          {/* Item 2 */}
          <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-[#E5E2DA] pt-3 md:pt-0 md:pl-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1E3A2F]">
              <Scale className="w-3.5 h-3.5 shrink-0" />
              <span>Indices INSEE · Art. 17-1</span>
            </div>
            <p className="text-xs text-[#5A6660] leading-relaxed">
              Révision basée sur la série officielle INSEE (série 001515333). Surveillance du délai légal pour éviter la prescription annuelle.
            </p>
          </div>

          {/* Item 3 */}
          <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-[#E5E2DA] pt-3 md:pt-0 md:pl-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1E3A2F]">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Confidentialité & RGPD</span>
            </div>
            <p className="text-xs text-[#5A6660] leading-relaxed">
              Transmissions chiffrées (TLS 1.3), hébergement conforme RGPD. Données strictement privées, sans aucun usage commercial.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
