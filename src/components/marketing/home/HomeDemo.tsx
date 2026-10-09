"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  Mail,
  RefreshCw,
} from "lucide-react";
import { trackHomepageEvent } from "@/lib/analytics/homepage-tracker";

export type DemoState = "attention" | "resolved";

interface HomeDemoProps {
  initialState?: DemoState;
}

export function HomeDemo({ initialState = "attention" }: HomeDemoProps) {
  const [state, setState] = useState<DemoState>(initialState);
  const [prevInitial, setPrevInitial] = useState(initialState);
  const [announcement, setAnnouncement] = useState<string>("");

  if (prevInitial !== initialState) {
    setPrevInitial(initialState);
    setState(initialState);
  }

  const handleResolve = () => {
    setState("resolved");
    setAnnouncement("Paiement régularisé. Les trois logements sont à jour, quittance générée.");
    trackHomepageEvent({
      name: "homepage_demo_interaction",
      properties: { action: "regularisation" },
    });
    trackHomepageEvent({
      name: "homepage_demo_resolved",
    });
  };

  const handleReminder = () => {
    setAnnouncement("Modèle de relance amiable préparé.");
    trackHomepageEvent({
      name: "homepage_demo_interaction",
      properties: { action: "relance" },
    });
  };

  const handleReset = () => {
    setState("attention");
    setAnnouncement("Démonstration réinitialisée.");
  };

  const isResolved = state === "resolved";

  return (
    <div
      id="product-demo-root"
      className="bg-white rounded-xl border border-[#E5E2DA] shadow-xs overflow-hidden transition-all duration-200"
      aria-label="Simulation interactive de la gestion mensuelle RentReady"
    >
      {/* Screen Reader Live Region for accessible status changes */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      {/* Demo Header Bar with explicit disclaimer */}
      <div className="px-3.5 sm:px-5 py-3 border-b border-[#E5E2DA] flex flex-wrap items-center justify-between gap-2 bg-[#FAF8F5]/80">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#1E3A2F] shrink-0" aria-hidden="true" />
          <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-[#15241F] truncate">
            Échéance d'octobre 2026 · 3 baux suivis
          </span>
          <span className="text-[10px] uppercase tracking-wider text-[#7C8782] bg-[#E5E2DA]/60 px-1.5 py-0.5 rounded font-medium">
            Démonstration interactive
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-[#5A6660]">
          <span className="hidden xs:inline">
            Attendu : <span className="tabular-nums font-semibold text-[#15241F]">3 350,00 €</span>
          </span>
          <span className="hidden xs:inline text-[#E5E2DA]" aria-hidden="true">|</span>
          <span>
            Encaissé :{" "}
            <strong
              className={`tabular-nums ${
                isResolved ? "text-[#1E3A2F]" : "text-[#D97706]"
              }`}
            >
              {isResolved ? "3 350,00 € (100%)" : "2 950,00 € (88%)"}
            </strong>
          </span>
          {isResolved && (
            <button
              onClick={handleReset}
              className="ml-1 inline-flex items-center gap-1 text-[11px] text-[#5A6660] hover:text-[#15241F] underline focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[#1E3A2F]"
              title="Réinitialiser l'état de démonstration"
            >
              <RefreshCw className="w-3 h-3" aria-hidden="true" /> Recommencer
            </button>
          )}
        </div>
      </div>

      {/* Properties Stream */}
      <div className="p-3 sm:p-5 divide-y divide-[#E5E2DA]/80">
        {/* ── 1. Paris 11e (CALME) ── */}
        <div className="py-2.5 sm:py-3 flex items-center justify-between gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <span
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#1E3A2F]/10 text-[#1E3A2F] flex items-center justify-center shrink-0"
              aria-label="Paiement validé"
            >
              <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-medium text-[#15241F] truncate text-xs sm:text-sm">
                Paris 11e · T2 Bastille{" "}
                <span className="text-[#5A6660] font-normal hidden sm:inline">
                  — Thomas Delmas
                </span>
              </p>
              <p className="text-[11px] text-[#7C8782] truncate">
                Loyer 980 € + ch. 120 € · Virement reçu le 03/10
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-right">
            <span className="font-semibold text-[#15241F] tabular-nums whitespace-nowrap text-xs sm:text-sm">
              1 100,00 €
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-[#1E3A2F]/10 text-[#1E3A2F] font-medium whitespace-nowrap">
              <CheckCircle2 className="w-3 h-3 hidden sm:inline" aria-hidden="true" /> Réglé
            </span>
          </div>
        </div>

        {/* ── 2. Lyon 3e (L'EXCEPTION OU RÉGLÉ) ── */}
        <div
          id="demo-exception-row"
          className={`rounded-lg my-1 transition-all duration-200 ${
            isResolved
              ? "py-2.5 sm:py-3 px-0 bg-transparent"
              : "p-3 sm:p-3.5 bg-[#FEF3C7]/40 border border-[#F59E0B]/40 my-1.5"
          }`}
        >
          <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <span
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  isResolved
                    ? "bg-[#1E3A2F]/10 text-[#1E3A2F]"
                    : "bg-[#D97706]/20 text-[#D97706]"
                }`}
                aria-label={isResolved ? "Régularisé" : "Action requise"}
              >
                {isResolved ? (
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
                ) : (
                  <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
                )}
              </span>
              <div className="min-w-0">
                <p className="font-medium text-[#15241F] truncate text-xs sm:text-sm">
                  Lyon 3e · T3 Part-Dieu{" "}
                  <span className="text-[#5A6660] font-normal hidden sm:inline">
                    — Sarah Merand
                  </span>
                </p>
                <p className="text-[11px] text-[#7C8782] truncate">
                  Total dû 1 600,00 € · 1 200,00 € reçu le 05/10
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-right">
              <div>
                <span className="font-semibold text-[#15241F] tabular-nums whitespace-nowrap text-xs sm:text-sm block">
                  {isResolved ? "1 600,00 €" : "1 200,00 €"}
                </span>
                {!isResolved && (
                  <span className="text-[#D97706] font-medium text-[10px] sm:text-[11px] block whitespace-nowrap">
                    Reste 400,00 €
                  </span>
                )}
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[11px] font-medium whitespace-nowrap ${
                  isResolved
                    ? "bg-[#1E3A2F]/10 text-[#1E3A2F]"
                    : "bg-[#D97706] text-white"
                }`}
              >
                {isResolved ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 hidden sm:inline" aria-hidden="true" /> Réglé
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 hidden sm:inline" aria-hidden="true" /> Partiel
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Action Drawer when Attention */}
          {!isResolved && (
            <div className="mt-2.5 pt-2.5 border-t border-[#F59E0B]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
              <p className="text-[11px] sm:text-xs text-[#92400E]">
                Reçu d'acompte émis (1 200 €). Quittance définitive prête dès encaissement des 400 € restants.
              </p>

              <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={handleReminder}
                  className="flex-1 sm:flex-none px-2.5 py-1.5 rounded-md border border-[#E5E2DA] bg-white text-[#15241F] hover:bg-[#F5F3EF] font-medium text-[11px] transition-colors inline-flex items-center justify-center gap-1 focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[#1E3A2F]"
                >
                  <Mail className="w-3 h-3 text-[#5A6660]" aria-hidden="true" /> Relancer
                </button>
                <button
                  id="btn-resolve-demo"
                  type="button"
                  onClick={handleResolve}
                  className="flex-1 sm:flex-none px-3 py-1.5 rounded-md bg-[#1E3A2F] text-white hover:bg-[#15241F] font-medium text-[11px] transition-colors shadow-2xs inline-flex items-center justify-center gap-1 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1E3A2F]"
                >
                  Régulariser les 400 € →
                </button>
              </div>
            </div>
          )}

          {/* Resolved Feedback Note */}
          {isResolved && (
            <div className="mt-1 pl-7 sm:pl-9 text-[11px] sm:text-xs text-[#1E3A2F] flex items-center justify-between">
              <span>
                ✓ Virement de 400,00 € enregistré · Quittance de loyer soldée disponible
              </span>
              <span className="text-[#5A6660] text-[11px] underline hidden sm:inline" aria-label="Aperçu quittance de démonstration">
                Aperçu PDF
              </span>
            </div>
          )}
        </div>

        {/* ── 3. Nantes Centre (CALME) ── */}
        <div className="py-2.5 sm:py-3 flex items-center justify-between gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <span
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#1E3A2F]/10 text-[#1E3A2F] flex items-center justify-center shrink-0"
              aria-label="Paiement validé"
            >
              <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-medium text-[#15241F] truncate text-xs sm:text-sm">
                Nantes Centre · Studio Graslin{" "}
                <span className="text-[#5A6660] font-normal hidden sm:inline">
                  — Antoine Roche
                </span>
              </p>
              <p className="text-[11px] text-[#7C8782] truncate">
                Loyer 580 € + ch. 70 € · Virement reçu le 04/10
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-right">
            <span className="font-semibold text-[#15241F] tabular-nums whitespace-nowrap text-xs sm:text-sm">
              650,00 €
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-[#1E3A2F]/10 text-[#1E3A2F] font-medium whitespace-nowrap">
              <CheckCircle2 className="w-3 h-3 hidden sm:inline" aria-hidden="true" /> Réglé
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
