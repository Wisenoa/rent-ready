"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Lock,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { InteractiveDemo } from "./InteractiveDemo";

interface HeroProps {
  isMobile?: boolean;
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 1. HERO 1 — CATEGORY FIRST                                                 */
/* ────────────────────────────────────────────────────────────────────────── */
export function HeroCategoryFirst({ isMobile = false }: HeroProps) {
  return (
    <section className="pt-4 sm:pt-10 pb-8 sm:pb-16 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#15241F] leading-[1.18]">
          Le logiciel de gestion locative <br className="hidden sm:inline" />
          <span className="text-[#1E3A2F]">des propriétaires indépendants.</span>
        </h1>
        <p className="text-sm sm:text-base text-[#5A6660] max-w-2xl mx-auto leading-relaxed">
          Suivez vos loyers chaque mois, éditez vos quittances en un clic et soyez alerté uniquement en cas d'anomalie. Sans tableur.
        </p>

        {/* CTA Stack */}
        <div className="pt-2 flex flex-col items-center gap-2">
          <Link
            href="/register"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#1E3A2F] text-white hover:bg-[#15241F] font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            Commencer l'essai gratuit <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-[#7C8782]">
            14 jours offerts · Sans carte bancaire · Dès 9 €/mois pour 3 logements
          </p>
        </div>
      </div>

      {/* Visual Product Showcase (Appears early in viewport) */}
      <div className="mt-6 sm:mt-12 bg-white rounded-xl border border-[#E5E2DA] p-4 sm:p-6 shadow-xs max-w-4xl mx-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E2DA] text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1E3A2F]" />
            <span className="font-semibold text-[#15241F]">Vue d'ensemble · Octobre 2026</span>
          </div>
          <span className="text-[#5A6660]">3 logements loués · 3 350,00 € attendus</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
          <div className="p-3 rounded-lg bg-[#F5F3EF] border border-[#E5E2DA]">
            <p className="text-xs text-[#5A6660]">Paris 11e · T2</p>
            <p className="text-base font-semibold text-[#15241F] mt-1">1 100,00 €</p>
            <span className="inline-flex items-center gap-1 text-[11px] text-[#1E3A2F] mt-2 font-medium">
              <Check className="w-3 h-3" /> Encaissé le 03/10
            </span>
          </div>
          <div className="p-3 rounded-lg bg-[#FEF3C7]/40 border border-[#F59E0B]/40">
            <p className="text-xs text-[#92400E] font-medium">Lyon 3e · T3 (Action requise)</p>
            <p className="text-base font-semibold text-[#15241F] mt-1">
              1 200,00 € <span className="text-xs text-[#D97706] font-normal">/ 1 600 €</span>
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] text-[#D97706] mt-2 font-medium">
              <Clock className="w-3 h-3" /> Reste 400 € dû
            </span>
          </div>
          <div className="p-3 rounded-lg bg-[#F5F3EF] border border-[#E5E2DA]">
            <p className="text-xs text-[#5A6660]">Nantes · Studio</p>
            <p className="text-base font-semibold text-[#15241F] mt-1">650,00 €</p>
            <span className="inline-flex items-center gap-1 text-[11px] text-[#1E3A2F] mt-2 font-medium">
              <Check className="w-3 h-3" /> Encaissé le 04/10
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 2. HERO 2 — OUTCOME FIRST                                                  */
/* ────────────────────────────────────────────────────────────────────────── */
export function HeroOutcomeFirst({ isMobile = false }: HeroProps) {
  return (
    <section className="pt-4 sm:pt-10 pb-8 sm:pb-16 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#15241F] leading-[1.18]">
          Vos loyers suivis, vos quittances prêtes. <br className="hidden sm:inline" />
          <span className="text-[#1E3A2F]">Chaque mois, sans effort.</span>
        </h1>
        <p className="text-sm sm:text-base text-[#5A6660] max-w-2xl mx-auto leading-relaxed">
          RentReady enregistre vos encaissements, prépare vos quittances conformes à la loi de 1989 et surveille vos dates de révision IRL.
        </p>

        {/* CTA Stack */}
        <div className="pt-2 flex flex-col items-center gap-2">
          <Link
            href="/register"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#1E3A2F] text-white hover:bg-[#15241F] font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            Créer mon compte en 3 minutes <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-[#7C8782]">
            Essai 14 jours sans engagement · Pas de carte bancaire demandée
          </p>
        </div>
      </div>

      {/* Product Timeline & Receipt Showcase */}
      <div className="mt-6 sm:mt-12 max-w-3xl mx-auto bg-white rounded-xl border border-[#E5E2DA] p-4 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E2DA] text-xs">
          <span className="font-medium text-[#15241F]">Routine du 5 du mois</span>
          <span className="text-[#1E3A2F] font-medium">✓ 2 minutes passées</span>
        </div>

        <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1E3A2F]/10 text-[#1E3A2F] flex items-center justify-center font-bold text-sm shrink-0">
              PDF
            </div>
            <div>
              <p className="text-sm font-semibold text-[#15241F]">
                Quittance de loyer · Octobre 2026
              </p>
              <p className="text-xs text-[#5A6660]">
                Louise Bernard · Nantes Graslin · 650,00 € (Loyer 580 € + Charges 70 €)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="px-2.5 py-1 rounded bg-[#1E3A2F]/10 text-[#1E3A2F] text-xs font-medium">
              Conforme art. 21 loi 1989
            </span>
            <button
              type="button"
              className="px-3 py-1.5 rounded-md border border-[#E5E2DA] text-xs font-medium text-[#15241F] hover:bg-[#F5F3EF] flex items-center gap-1"
            >
              <Download className="w-3 h-3" /> Télécharger
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 3. HERO 3 — EXCEPTION FIRST                                                */
/* ────────────────────────────────────────────────────────────────────────── */
export function HeroExceptionFirst({ isMobile = false }: HeroProps) {
  return (
    <section className="pt-4 sm:pt-10 pb-8 sm:pb-16 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#15241F] leading-[1.18]">
          RentReady suit vos locations. <br className="hidden sm:inline" />
          <span className="text-[#1E3A2F]">Vous gérez seulement les exceptions.</span>
        </h1>
        <p className="text-sm sm:text-base text-[#5A6660] max-w-2xl mx-auto leading-relaxed">
          Ce qui est réglé s'archive sans bruit. Lorsqu'un retard ou un paiement partiel survient, vous disposez immédiatement de la bonne action.
        </p>

        {/* CTA Stack */}
        <div className="pt-2 flex flex-col items-center gap-2">
          <Link
            href="/register"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#1E3A2F] text-white hover:bg-[#15241F] font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            Tester sur vos logements <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-[#7C8782]">
            14 jours sans carte · Vos loyers suivis au centime près
          </p>
        </div>
      </div>

      {/* Live Exception Demo Embedded Directly */}
      <div className="mt-6 sm:mt-10">
        <InteractiveDemo standalone={false} isMobile={isMobile} />
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 4. HERO 4 — PRODUCT FIRST                                                  */
/* ────────────────────────────────────────────────────────────────────────── */
export function HeroProductFirst({ isMobile = false }: HeroProps) {
  return (
    <section className="pt-4 sm:pt-8 pb-8 sm:pb-16 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto space-y-3 sm:space-y-4 mb-6 sm:mb-10">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#15241F]">
          La gestion locative sans tableur.
        </h1>
        <p className="text-sm sm:text-base text-[#5A6660]">
          L'interface claire et rigoureuse pour suivre vos loyers, baux et quittances au quotidien.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/register"
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#1E3A2F] text-white font-medium text-xs sm:text-sm hover:bg-[#15241F] transition-colors"
          >
            Démarrer gratuitement
          </Link>
          <span className="text-xs text-[#7C8782]">Sans carte bancaire · De 1 à 10 logements</span>
        </div>
      </div>

      {/* Full Product Interface Viewport */}
      <div className="bg-white rounded-xl border border-[#E5E2DA] shadow-md overflow-hidden">
        {/* App Topbar Mock */}
        <div className="bg-[#15241F] text-white px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold">RentReady</span>
            <span className="text-white/40">/</span>
            <span className="text-white/80">Tableau de bord</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-[11px]">3 baux actifs</span>
          </div>
        </div>

        {/* Embedded Stream */}
        <div className="p-4 sm:p-6 bg-[#F5F3EF]">
          <InteractiveDemo standalone={false} isMobile={isMobile} />
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 5. HERO 5 — HYBRID (RECOMMENDED)                                           */
/* ────────────────────────────────────────────────────────────────────────── */
export function HeroHybrid({ isMobile = false }: HeroProps) {
  return (
    <section className="pt-4 sm:pt-10 pb-8 sm:pb-16 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#15241F] leading-[1.18]">
          Gérez vos locations sans tableur. <br className="hidden sm:inline" />
          <span className="text-[#1E3A2F]">Agissez uniquement sur l'exception.</span>
        </h1>
        <p className="text-sm sm:text-base text-[#5A6660] max-w-2xl mx-auto leading-relaxed">
          RentReady suit vos loyers chaque mois, édite vos quittances en un clic et ne sollicite votre attention qu'en cas d'écart. Conforme à la loi du 6 juillet 1989.
        </p>

        {/* CTA Stack */}
        <div className="pt-2 flex flex-col items-center gap-2">
          <Link
            href="/register"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#1E3A2F] text-white hover:bg-[#15241F] font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            Essayer gratuitement pendant 14 jours <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-[#7C8782]">
            Sans carte bancaire · Configuration en 3 minutes · Dès 9 €/mois pour 3 logements
          </p>
        </div>
      </div>

      {/* Interactive Demonstration Embedded */}
      <div className="mt-6 sm:mt-10">
        <InteractiveDemo standalone={false} isMobile={isMobile} />
      </div>
    </section>
  );
}
