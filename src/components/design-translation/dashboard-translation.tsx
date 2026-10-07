"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  ArrowRight,
  Building2,
  FileText,
  User,
  Calendar,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

interface DashboardTranslationProps {
  initialResolved?: boolean;
}

export function DashboardTranslation({ initialResolved = false }: DashboardTranslationProps) {
  const [isResolved, setIsResolved] = useState(initialResolved);

  const totalDue = 2850;
  const totalReceived = isResolved ? 2850 : 2450;
  const totalBalance = isResolved ? 0 : 400;

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#151413] font-sans selection:bg-[#151413] selection:text-[#F8F6F0]">
      {/* ─────────────────────────────────────────────────────────────
          1. NAVIGATION APPLICATIVE SOBRE & HUMAINE
      ───────────────────────────────────────────────────────────── */}
      <header className="bg-[#F8F6F0] border-b border-[#151413]/10 px-4 sm:px-8 py-3.5 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-serif text-xl sm:text-2xl italic font-semibold text-[#151413] tracking-tight">
              RentReady
            </Link>
            <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-[#6B6760]">
              <span className="text-[#151413] font-semibold border-b border-[#151413] pb-0.5">
                Vue d'ensemble
              </span>
              <a href="#properties" className="hover:text-[#151413] transition-colors">
                Mes logements (3)
              </a>
              <a href="#tenants" className="hover:text-[#151413] transition-colors">
                Locataires (3)
              </a>
              <a href="#billing" className="hover:text-[#151413] transition-colors">
                Loyers & Quittances
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Contrôle discret d'état pour la Creative Review */}
            <div className="inline-flex items-center p-0.5 bg-[#EDEAE0] border border-[#151413]/12 text-[11px] rounded-sm">
              <button
                type="button"
                onClick={() => setIsResolved(false)}
                className={`px-2 py-0.5 transition-all text-xs ${
                  !isResolved ? "bg-[#151413] text-[#F8F6F0] font-medium" : "text-[#6B6760] hover:text-[#151413]"
                }`}
              >
                1 exception (400 €)
              </button>
              <button
                type="button"
                onClick={() => setIsResolved(true)}
                className={`px-2 py-0.5 transition-all text-xs ${
                  isResolved ? "bg-[#22543D] text-[#F8F6F0] font-medium" : "text-[#6B6760] hover:text-[#151413]"
                }`}
              >
                Tout réglé (0 €)
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-[#151413] border-l border-[#151413]/12 pl-3">
              <span className="w-6 h-6 rounded-full bg-[#151413] text-[#F8F6F0] flex items-center justify-center text-[10px] font-bold">
                TR
              </span>
              <span className="hidden lg:inline">Thomas R.</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-8 sm:space-y-10">
        {/* ─────────────────────────────────────────────────────────────
            2. LE POINT DU MOIS (Réponse immédiate en moins de 3 secondes)
            « Est-ce que tout va bien ? »
        ───────────────────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#151413]/12 pb-4">
            <div>
              <div className="flex items-center gap-2.5 text-xs text-[#6B6760]">
                <Calendar className="w-3.5 h-3.5" />
                <span className="font-medium">Mois en cours · Arrêté au 07 octobre</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl text-[#151413] font-normal tracking-tight mt-1">
                Octobre 2026
              </h1>
            </div>

            {/* Chiffres financiers du mois avec échelle typographique soignée */}
            <div className="flex items-baseline gap-6 sm:gap-8">
              <div>
                <span className="block text-[11px] text-[#6B6760]">Attendus</span>
                <span className="font-mono text-xl sm:text-2xl font-semibold text-[#151413] tabular-nums">
                  {totalDue.toLocaleString("fr-FR")}&nbsp;<span className="text-xs font-normal text-[#6B6760]">€</span>
                </span>
              </div>

              <div>
                <span className="block text-[11px] text-[#6B6760]">Reçus</span>
                <span className="font-mono text-xl sm:text-2xl font-semibold text-[#22543D] tabular-nums">
                  {totalReceived.toLocaleString("fr-FR")}&nbsp;<span className="text-xs font-normal text-[#22543D]">€</span>
                </span>
              </div>

              <div>
                <span className="block text-[11px] text-[#6B6760]">Solde</span>
                <span
                  className={`font-mono text-xl sm:text-2xl font-semibold tabular-nums transition-colors ${
                    isResolved ? "text-[#22543D]" : "text-[#C2410C]"
                  }`}
                >
                  {totalBalance.toLocaleString("fr-FR")}&nbsp;<span className="text-xs font-normal opacity-80">€</span>
                </span>
              </div>
            </div>
          </div>

          {/* Bandeau de Clarté Émotionnelle : La tension s'éteint si tout est réglé */}
          <div
            className={`p-4 sm:p-5 transition-all duration-300 border ${
              isResolved
                ? "bg-[#F3EFE6] border-[#22543D]/20 text-[#22543D]"
                : "bg-[#FFFDF9] border-[#C2410C]/25 text-[#151413]"
            }`}
          >
            {isResolved ? (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#22543D] shrink-0" />
                  <div>
                    <h2 className="text-sm font-semibold text-[#22543D]">
                      Tout est à jour pour le mois d'octobre
                    </h2>
                    <p className="text-xs text-[#22543D]/80 mt-0.5">
                      Les 3 loyers sont perçus (2 850 €). Vos 3 quittances sont prêtes. Rien ne demande votre attention.
                    </p>
                  </div>
                </div>
                <Link
                  href="/billing"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#22543D] underline font-medium hover:text-black transition-colors"
                >
                  Consulter les quittances
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C2410C] mt-1 shrink-0 animate-pulse" />
                  <div>
                    <h2 className="text-sm font-semibold text-[#151413]">
                      Une seule action attend votre confirmation à Nantes
                    </h2>
                    <p className="text-xs text-[#6B6760] mt-0.5">
                      Éléonore Moreau a réglé un acompte de 400 € le 03 oct. Le solde restant est de 400 €.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsResolved(true)}
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 bg-[#151413] text-[#F8F6F0] text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer self-start sm:self-center"
                >
                  Marquer les 400 € reçus
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            3. LES LOGEMENTS DU PARC : LA RÈGLE DU SILENCE VISUEL
            Paris & Lyon = 1 unité d'attention (silencieux)
            Nantes = 3 unités d'attention si exception / 1 unité si résolu
        ───────────────────────────────────────────────────────────── */}
        <section id="properties" className="space-y-4">
          <div className="flex items-baseline justify-between border-b border-[#151413]/10 pb-2">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-[#6B6760]">
              Vos logements (3)
            </h2>
            <span className="text-xs text-[#6B6760]">
              {isResolved ? "3 à jour" : "2 à jour · 1 en attente"}
            </span>
          </div>

          <div className="divide-y divide-[#151413]/10 border-y border-[#151413]/10">
            {/* LOGEMENT 1 : PARIS 11e (RÉGLÉ · SILENCIEUX · 1 UNITÉ D'ATTENTION) */}
            <div className="py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 hover:bg-[#151413]/[0.02] px-2 transition-colors">
              <div className="flex items-baseline gap-3">
                <span className="w-2 h-2 rounded-full bg-[#22543D] shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-[#151413]">
                    Studio Rue Oberkampf · Paris 11e
                  </h3>
                  <span className="text-xs text-[#6B6760]">
                    Camille Laurent · Bail meublé 1 an
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 text-xs pl-5 sm:pl-0">
                <div className="text-left sm:text-right">
                  <span className="font-mono font-medium text-[#151413]">750,00&nbsp;€</span>
                  <span className="block text-[11px] text-[#22543D]">✓ Réglé le 02 oct.</span>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#22543D] bg-[#22543D]/10 px-2 py-0.5 border border-[#22543D]/20">
                    <Check className="w-3 h-3" /> Quittance prête
                  </span>
                </div>
              </div>
            </div>

            {/* LOGEMENT 2 : LYON 2e (RÉGLÉ · SILENCIEUX · 1 UNITÉ D'ATTENTION) */}
            <div className="py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 hover:bg-[#151413]/[0.02] px-2 transition-colors">
              <div className="flex items-baseline gap-3">
                <span className="w-2 h-2 rounded-full bg-[#22543D] shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-[#151413]">
                    T3 Avenue Victor Hugo · Lyon 2e
                  </h3>
                  <span className="text-xs text-[#6B6760]">
                    Alexandre Mercier · Bail nu 3 ans
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 text-xs pl-5 sm:pl-0">
                <div className="text-left sm:text-right">
                  <span className="font-mono font-medium text-[#151413]">1 700,00&nbsp;€</span>
                  <span className="block text-[11px] text-[#22543D]">✓ Réglé le 04 oct.</span>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#22543D] bg-[#22543D]/10 px-2 py-0.5 border border-[#22543D]/20">
                    <Check className="w-3 h-3" /> Quittance prête
                  </span>
                </div>
              </div>
            </div>

            {/* LOGEMENT 3 : NANTES (EXCEPTION ACTIVE OU RÉSOLUE) */}
            <div
              className={`transition-all duration-300 ${
                isResolved
                  ? "py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 hover:bg-[#151413]/[0.02] px-2 bg-transparent"
                  : "p-4 sm:p-5 bg-[#FFFDF9] border-l-4 border-l-[#C2410C] border-y border-r border-[#C2410C]/25 my-1"
              }`}
            >
              {isResolved ? (
                // ÉTAT RÉSOLU : Nantes redevient feutré, exactement comme Paris et Lyon
                <>
                  <div className="flex items-baseline gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#22543D] shrink-0" />
                    <div>
                      <h3 className="text-sm font-semibold text-[#151413]">
                        T2 Rue de la République · Nantes
                      </h3>
                      <span className="text-xs text-[#6B6760]">
                        Éléonore Moreau · Bail meublé 1 an
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 text-xs pl-5 sm:pl-0">
                    <div className="text-left sm:text-right">
                      <span className="font-mono font-medium text-[#151413]">800,00&nbsp;€</span>
                      <span className="block text-[11px] text-[#22543D]">✓ Soldé le 07 oct.</span>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#22543D] bg-[#22543D]/10 px-2 py-0.5 border border-[#22543D]/20">
                        <Check className="w-3 h-3" /> Quittance prête
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                // ÉTAT EXCEPTION : 3 unités d'attention, espace d'action immédiate
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-baseline gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#C2410C] shrink-0 mt-1" />
                      <div>
                        <h3 className="text-base font-bold text-[#151413]">
                          T2 Rue de la République · Nantes
                        </h3>
                        <span className="text-xs text-[#6B6760]">
                          Locataire : Éléonore Moreau · Loyer total : 800,00&nbsp;€
                        </span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right pl-5 sm:pl-0">
                      <span className="text-xs font-semibold text-[#C2410C] block">
                        Solde restant : 400,00&nbsp;€
                      </span>
                      <span className="text-[11px] text-[#6B6760]">
                        (400,00&nbsp;€ perçus le 03 oct. · Reçu d'acompte émis)
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#C2410C]/15 text-xs">
                    <span className="text-[#6B6760] text-[11px]">
                      La quittance libératoire sera émise dès confirmation du solde (art. 21).
                    </span>

                    <button
                      type="button"
                      onClick={() => setIsResolved(true)}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#151413] text-[#F8F6F0] text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer active:scale-[0.98]"
                    >
                      Marquer les 400&nbsp;€ reçus
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            4. VUE RAPIDE DE VOS LOCATAIRES (Liens humains, pas de cadastre)
        ───────────────────────────────────────────────────────────── */}
        <section id="tenants" className="space-y-3 border-t border-[#151413]/10 pt-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-[#6B6760]">
              Contacts locataires
            </h2>
            <span className="text-xs text-[#6B6760]">3 baux actifs</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-[#F1EEE4] border border-[#151413]/10">
              <span className="font-semibold text-[#151413] block">Camille Laurent</span>
              <span className="text-[#6B6760] text-[11px] block mt-0.5">Paris 11e</span>
              <span className="text-[#22543D] text-[11px] block mt-1">✓ Espace locataire actif</span>
            </div>

            <div className="p-3 bg-[#F1EEE4] border border-[#151413]/10">
              <span className="font-semibold text-[#151413] block">Alexandre Mercier</span>
              <span className="text-[#6B6760] text-[11px] block mt-0.5">Lyon 2e</span>
              <span className="text-[#22543D] text-[11px] block mt-1">✓ Espace locataire actif</span>
            </div>

            <div className="p-3 bg-[#F1EEE4] border border-[#151413]/10">
              <span className="font-semibold text-[#151413] block">Éléonore Moreau</span>
              <span className="text-[#6B6760] text-[11px] block mt-0.5">Nantes</span>
              <span className={`text-[11px] block mt-1 ${isResolved ? "text-[#22543D]" : "text-[#C2410C]"}`}>
                {isResolved ? "✓ Espace locataire actif" : "● Acompte consulté"}
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
