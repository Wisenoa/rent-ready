"use client";

import React from "react";
import { HomeDemo } from "@/components/marketing/home/HomeDemo";
import { Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

export function GestionInteractiveDemo() {
  return (
    <section id="demo-interactive" className="py-16 sm:py-24 bg-[#FAF9F5] border-b border-[#E5E2DA] scroll-mt-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D8D3C8] bg-white px-3 py-1 text-xs font-semibold text-[#1E3A2F]">
            <Sparkles className="size-3.5" aria-hidden="true" />
            <span>Simulation interactive du produit</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[#15241F]">
            Voyez comment Lokna gère votre mois locatif
          </h2>
          <p className="text-sm sm:text-base text-[#5A6660] leading-relaxed">
            Cliquez sur les actions ci-dessous pour voir comment les lignes de loyer se mettent à jour en temps réel et comment les quittances se débloquent.
          </p>
        </div>

        {/* Embedded Interactive Demo */}
        <div className="rounded-2xl border border-[#D5D0C5] bg-white p-2.5 sm:p-4 shadow-md">
          <HomeDemo initialState="attention" />
        </div>

        {/* 3 Key Product Invariants */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="rounded-xl border border-[#E5E2DA] bg-white p-4 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-[#1E3A2F]">
              <CheckCircle2 className="size-4 shrink-0 text-[#1E3A2F]" aria-hidden="true" />
              <span>1. Loyer 100% payé</span>
            </div>
            <p className="text-[#5A6660] leading-relaxed">
              La ligne se rétracte et devient silencieuse. La quittance officielle (loi 1989) est prête en un clic.
            </p>
          </div>

          <div className="rounded-xl border border-[#E5E2DA] bg-white p-4 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-[#D97706]">
              <AlertCircle className="size-4 shrink-0 text-[#D97706]" aria-hidden="true" />
              <span>2. Acompte ou retard</span>
            </div>
            <p className="text-[#5A6660] leading-relaxed">
              L&apos;écart reste affiché au centime près. Lokna propose l&apos;action contextuelle : reçu d&apos;acompte ou relance.
            </p>
          </div>

          <div className="rounded-xl border border-[#E5E2DA] bg-white p-4 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-[#15241F]">
              <CheckCircle2 className="size-4 shrink-0 text-[#1E3A2F]" aria-hidden="true" />
              <span>3. Zéro tableau opaque</span>
            </div>
            <p className="text-[#5A6660] leading-relaxed">
              Vous n&apos;avez pas à fouiller dans un dashboard complexe : ce qui demande votre attention est immédiatement clair.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
