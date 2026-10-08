"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Mail,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { DemoState } from "../types";

interface InteractiveDemoProps {
  initialState?: DemoState;
  standalone?: boolean;
  isMobile?: boolean;
}

export function InteractiveDemo({
  initialState = "before",
  standalone = false,
  isMobile = false,
}: InteractiveDemoProps) {
  const [state, setState] = useState<DemoState>(initialState);

  // Synchronize when prop changes (for test capture scripts)
  React.useEffect(() => {
    setState(initialState);
  }, [initialState]);

  const handleResolve = () => {
    setState("resolved");
  };

  const handleReset = () => {
    setState("before");
  };

  const isResolved = state === "resolved";
  const isAttention = state === "attention" || state === "before";

  return (
    <div
      id="product-demo-root"
      className={`bg-white rounded-xl border border-[#E5E2DA] shadow-xs overflow-hidden transition-all duration-240 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        standalone ? "max-w-4xl mx-auto p-4 sm:p-6" : "p-4 sm:p-6"
      }`}
    >
      {/* Demo Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E2DA] gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1E3A2F]" />
          <span className="text-xs font-semibold tracking-wider uppercase text-[#15241F]">
            Cycle d'Octobre 2026 · 3 logements
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] bg-[#F5F3EF] text-[#5A6660]">
            Conforme Loi du 6 juillet 1989
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#5A6660]">
            Total exigible : <strong className="text-[#15241F]">3 350,00 €</strong>
          </span>
          <span className="text-[#E5E2DA]">|</span>
          <span className="text-[#5A6660]">
            Encaissé :{" "}
            <strong className={isResolved ? "text-[#1E3A2F]" : "text-[#D97706]"}>
              {isResolved ? "3 350,00 € (100%)" : "2 950,00 € (88%)"}
            </strong>
          </span>
          {standalone && (
            <button
              onClick={handleReset}
              className="ml-2 inline-flex items-center gap-1 text-[11px] text-[#5A6660] hover:text-[#15241F] underline"
            >
              <RefreshCw className="w-3 h-3" /> Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Properties Stream */}
      <div className="divide-y divide-[#E5E2DA] pt-2">
        {/* ── 1. Paris 11e (CALME) ── */}
        <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-[#1E3A2F]/10 text-[#1E3A2F] flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5" />
            </span>
            <div>
              <p className="font-medium text-[#15241F]">
                Paris 11e · T2 Bastille{" "}
                <span className="text-xs text-[#5A6660] font-normal">
                  — Thomas Delmas
                </span>
              </p>
              <p className="text-xs text-[#5A6660]">
                Loyer 980,00 € + Charges 120,00 € · Virement reçu le 03/10
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs pl-9 sm:pl-0">
            <span className="font-semibold text-[#15241F]">1 100,00 €</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#1E3A2F]/10 text-[#1E3A2F] font-medium">
              <CheckCircle2 className="w-3 h-3" /> Réglé
            </span>
            <span className="text-[#5A6660] text-[11px] hidden md:inline">
              Quittance n° 2026-10-0042
            </span>
          </div>
        </div>

        {/* ── 2. Lyon 3e (L'EXCEPTION OU RÉGLÉ) ── */}
        <div
          id="demo-exception-row"
          className={`py-3.5 px-3 rounded-lg my-1.5 transition-all duration-240 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isResolved
              ? "bg-transparent border border-transparent"
              : "bg-[#FEF3C7]/40 border border-[#F59E0B]/40"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-3">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors duration-240 ${
                  isResolved
                    ? "bg-[#1E3A2F]/10 text-[#1E3A2F]"
                    : "bg-[#D97706]/20 text-[#D97706]"
                }`}
              >
                {isResolved ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
              </span>
              <div>
                <p className="font-medium text-[#15241F]">
                  Lyon 3e · T3 Part-Dieu{" "}
                  <span className="text-xs text-[#5A6660] font-normal">
                    — Sarah Merand
                  </span>
                </p>
                <p className="text-xs text-[#5A6660]">
                  Loyer 1 420,00 € + Charges 180,00 € (Total dû : 1 600,00 €)
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 text-xs pl-9 sm:pl-0">
              <div className="text-right">
                <span className="font-semibold text-[#15241F] block">
                  {isResolved ? "1 600,00 €" : "1 200,00 € reçu"}
                </span>
                {!isResolved && (
                  <span className="text-[#D97706] font-semibold text-[11px]">
                    Manque 400,00 €
                  </span>
                )}
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded font-medium text-xs transition-colors duration-240 ${
                  isResolved
                    ? "bg-[#1E3A2F]/10 text-[#1E3A2F]"
                    : "bg-[#D97706] text-white"
                }`}
              >
                {isResolved ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Soldé intégralement
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5" /> Paiement partiel
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Action Drawer when Unresolved */}
          {!isResolved && (
            <div className="mt-3 pt-3 border-t border-[#F59E0B]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pl-9 sm:pl-9">
              <div className="space-y-0.5">
                <p className="text-[#92400E] font-medium">
                  Reçu d'acompte partiel émis (1 200 €) · Loi de 1989 art. 21
                </p>
                <p className="text-[#7C8782] text-[11px]">
                  La quittance définitive sera débloquée dès le règlement des 400,00 € restants.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-2.5 py-1.5 rounded-md border border-[#E5E2DA] bg-white text-[#15241F] hover:bg-[#F5F3EF] font-medium transition-colors"
                >
                  <Mail className="w-3 h-3 inline mr-1 text-[#5A6660]" /> Relancer
                </button>
                <button
                  id="btn-resolve-demo"
                  type="button"
                  onClick={handleResolve}
                  className="px-3 py-1.5 rounded-md bg-[#1E3A2F] text-white hover:bg-[#15241F] font-medium transition-colors shadow-2xs"
                >
                  Régulariser les 400 € →
                </button>
              </div>
            </div>
          )}

          {/* Resolved Feedback */}
          {isResolved && (
            <div className="mt-1 pl-9 text-xs text-[#1E3A2F] flex items-center justify-between">
              <span>
                ✓ Versement complémentaire de 400,00 € enregistré · Quittance de solde n° 2026-10-0044 générée
              </span>
              <span className="text-[#5A6660] text-[11px] underline cursor-pointer">
                Télécharger PDF
              </span>
            </div>
          )}
        </div>

        {/* ── 3. Nantes Centre (CALME) ── */}
        <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-[#1E3A2F]/10 text-[#1E3A2F] flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5" />
            </span>
            <div>
              <p className="font-medium text-[#15241F]">
                Nantes Centre · Studio Graslin{" "}
                <span className="text-xs text-[#5A6660] font-normal">
                  — Antoine Roche
                </span>
              </p>
              <p className="text-xs text-[#5A6660]">
                Loyer 580,00 € + Charges 70,00 € · Virement reçu le 04/10
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs pl-9 sm:pl-0">
            <span className="font-semibold text-[#15241F]">650,00 €</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#1E3A2F]/10 text-[#1E3A2F] font-medium">
              <CheckCircle2 className="w-3 h-3" /> Réglé
            </span>
            <span className="text-[#5A6660] text-[11px] hidden md:inline">
              Quittance n° 2026-10-0043
            </span>
          </div>
        </div>
      </div>

      {/* Brand Revelation Box (Appears when all is calm) */}
      <div
        className={`mt-4 pt-4 border-t border-[#E5E2DA] transition-all duration-240 ${
          isResolved ? "opacity-100 block" : "opacity-75"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <p className="text-[#5A6660] italic">
            {isResolved ? (
              <span className="font-medium text-[#1E3A2F]">
                « Tout ce qui va bien devient silencieux. Seule l'exception demande votre attention. »
              </span>
            ) : (
              <span>
                Cliquez sur <strong>« Régulariser les 400 € »</strong> pour constater l'apaisement du tableau de bord.
              </span>
            )}
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] text-[#5A6660]">
              <ShieldCheck className="w-3 h-3 text-[#1E3A2F]" /> Calculs certifiés loi 1989
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
