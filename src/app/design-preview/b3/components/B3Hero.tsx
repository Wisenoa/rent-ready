"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { B3InteractiveDemo } from "./B3InteractiveDemo";
import { B3DemoState } from "../types";

interface HeroProps {
  isMobile?: boolean;
  demoState?: B3DemoState;
}

export function B3Hero({ isMobile = false, demoState = "attention" }: HeroProps) {
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
          <Link
            href="/register"
            className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-lg bg-[#1E3A2F] text-white hover:bg-[#15241F] font-medium text-xs sm:text-sm transition-colors shadow-2xs inline-flex items-center justify-center gap-2"
          >
            Essayer gratuitement <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-[11px] sm:text-xs text-[#7C8782]">
            14 jours d'essai gratuit · Sans carte bancaire
          </p>
        </div>
      </div>

      {/* Embedded Product Demo */}
      <div className="mt-5 sm:mt-8">
        <B3InteractiveDemo isMobile={isMobile} initialState={demoState} />
      </div>
    </section>
  );
}
