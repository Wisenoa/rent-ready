"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function B3FinalCta() {
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
          <Link
            href="/register"
            className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-lg bg-[#1E3A2F] text-white hover:bg-[#15241F] font-medium text-xs sm:text-sm transition-colors shadow-2xs inline-flex items-center justify-center gap-2"
          >
            Essayer gratuitement <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-[11px] sm:text-xs text-[#7C8782]">
            14 jours offerts · Sans carte bancaire · Annulation en un clic
          </p>
        </div>
      </div>
    </section>
  );
}
