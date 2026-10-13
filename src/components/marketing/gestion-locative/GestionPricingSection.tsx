import React from "react";
import Link from "next/link";
import { Check, ArrowRight, ShieldCheck } from "lucide-react";
import { PLANS, formatEntryPrice } from "@/data/entity";

export function GestionPricingSection() {
  const starter = PLANS.find((p) => p.id === "starter");
  const pro = PLANS.find((p) => p.id === "pro");

  return (
    <section id="tarifs" className="py-16 sm:py-24 border-b border-[#E5E2DA] bg-white scroll-mt-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A2F]">
            Tarifs clairs & sans engagement
          </span>
          <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[#15241F]">
            Un prix juste, rentable dès le premier loyer
          </h2>
          <p className="text-sm sm:text-base text-[#5A6660] leading-relaxed">
            Pas de commission sur vos loyers, pas de frais cachés. 14 jours d&apos;essai gratuit pour configurer vos biens en toute liberté.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Plan Starter */}
          <div className="rounded-2xl border border-[#E5E2DA] bg-[#FAF8F5]/50 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#15241F]">
                  {starter?.name ?? "Starter"}
                </h3>
                <span className="text-xs font-medium text-[#5A6660] bg-white border border-[#E5E2DA] px-2.5 py-1 rounded-full">
                  1 à 3 logements
                </span>
              </div>
              <p className="text-xs text-[#5A6660]">
                Idéal pour démarrer et sécuriser la gestion de vos premiers biens.
              </p>
              <div className="pt-2 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-bold tracking-tight text-[#15241F] tabular-nums">
                  {starter?.monthlyPrice} €
                </span>
                <span className="text-xs text-[#7C8782]">/ mois</span>
              </div>
              <p className="text-[11px] text-[#7C8782]">
                ou {starter?.annualPrice} € / an (soit 2 mois offerts)
              </p>

              <div className="pt-4 border-t border-[#E5E2DA] space-y-2.5 text-xs text-[#15241F]">
                <div className="flex items-center gap-2">
                  <Check className="size-4 shrink-0 text-[#1E3A2F]" aria-hidden="true" />
                  <span>Jusqu&apos;à 3 biens immobiliers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="size-4 shrink-0 text-[#1E3A2F]" aria-hidden="true" />
                  <span>Quittances conformes loi 1989 illimitées</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="size-4 shrink-0 text-[#1E3A2F]" aria-hidden="true" />
                  <span>Suivi des encaissements & détection des impayés</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="size-4 shrink-0 text-[#1E3A2F]" aria-hidden="true" />
                  <span>Rappels de révision de loyer IRL (INSEE)</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/register"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#D5D0C5] bg-white py-3 text-xs sm:text-sm font-medium text-[#15241F] shadow-2xs hover:bg-[#F5F3EF] transition-colors"
              >
                <span>Essai gratuit 14 jours</span>
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Plan Pro */}
          <div className="relative rounded-2xl border-2 border-[#1E3A2F] bg-white p-6 sm:p-8 flex flex-col justify-between shadow-lg">
            <div className="absolute -top-3 right-6 rounded-full bg-[#1E3A2F] px-3 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase">
              Le plus populaire
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#15241F]">
                  {pro?.name ?? "Pro"}
                </h3>
                <span className="text-xs font-medium text-[#1E3A2F] bg-[#1E3A2F]/10 px-2.5 py-1 rounded-full">
                  Jusqu&apos;à 10 logements
                </span>
              </div>
              <p className="text-xs text-[#5A6660]">
                Pour les propriétaires bailleurs qui recherchent l&apos;automatisation totale.
              </p>
              <div className="pt-2 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-bold tracking-tight text-[#15241F] tabular-nums">
                  {pro?.monthlyPrice} €
                </span>
                <span className="text-xs text-[#7C8782]">/ mois</span>
              </div>
              <p className="text-[11px] text-[#7C8782]">
                ou {pro?.annualPrice} € / an (soit 2 mois offerts)
              </p>

              <div className="pt-4 border-t border-[#E5E2DA] space-y-2.5 text-xs text-[#15241F]">
                <div className="flex items-center gap-2 font-medium">
                  <Check className="size-4 shrink-0 text-[#1E3A2F]" aria-hidden="true" />
                  <span>Tout le plan Starter jusqu&apos;à 10 biens</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="size-4 shrink-0 text-[#1E3A2F]" aria-hidden="true" />
                  <span>Modèles de relances amiables automatiques</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="size-4 shrink-0 text-[#1E3A2F]" aria-hidden="true" />
                  <span>OCR pour factures artisans & charges</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="size-4 shrink-0 text-[#1E3A2F]" aria-hidden="true" />
                  <span>Export fiscal détaillé (2044 & LMNP)</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/register"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E3A2F] py-3 text-xs sm:text-sm font-medium text-white shadow-sm hover:bg-[#15241F] transition-colors"
              >
                <span>Démarrer l&apos;essai gratuit</span>
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-[#5A6660] flex items-center justify-center gap-2">
          <ShieldCheck className="size-4 text-[#1E3A2F]" aria-hidden="true" />
          <span>Essai gratuit de 14 jours sans engagement · Aucune carte bancaire demandée</span>
        </div>
      </div>
    </section>
  );
}
