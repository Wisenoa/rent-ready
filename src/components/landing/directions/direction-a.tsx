"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, AlertCircle, FileText, ShieldCheck } from "lucide-react";

/**
 * DIRECTION A : « The Calm Ledger / Control » (Baseline assainie)
 * Style : Néo-grotesque suisse, grand livre comptable posé, équilibre et rationalité.
 */
export function DirectionA() {
  const [nantesPaid, setNantesPaid] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-sans selection:bg-stone-900 selection:text-white">
      {/* 1. NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#FDFCFB]/90 backdrop-blur-md border-b border-stone-200/80 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-stone-900 text-white font-mono text-sm font-semibold flex items-center justify-center">
              R
            </span>
            <span className="font-semibold tracking-tight text-lg">RentReady</span>
            <span className="hidden sm:inline-block ml-3 px-2 py-0.5 rounded text-[11px] font-medium bg-stone-100 text-stone-600 border border-stone-200">
              Direction A · Calm Ledger
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-stone-600">
            <a href="#grand-livre" className="hover:text-stone-950 transition-colors">Grand livre</a>
            <a href="#cycle" className="hover:text-stone-950 transition-colors">Cycle mensuel</a>
            <a href="#tarifs" className="hover:text-stone-950 transition-colors">Tarifs</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:inline-block text-sm font-medium text-stone-600 hover:text-stone-950">
              Connexion
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium px-4 py-2 rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-sm"
            >
              Essai gratuit
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="pt-16 pb-20 px-6 border-b border-stone-200/60">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Gestion locative pour propriétaires indépendants · Loi du 6 juillet 1989
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-950 leading-[1.12] mb-6">
            Vos locations tournent.{" "}
            <br className="hidden sm:inline" />
            RentReady tient le compte.
          </h1>

          <p className="text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            Du premier virement à la quittance conforme, visualisez chaque logement en un coup d'œil.
            Pointage assisté, soldes stricts et zéros calculs d'arrondis approximatifs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-stone-900 text-white font-medium hover:bg-stone-800 transition-all shadow-sm"
            >
              Démarrer l'essai gratuit 14 jours
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#cycle"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-white border border-stone-200 text-stone-700 font-medium hover:bg-stone-50 transition-colors shadow-2xs"
            >
              Comprendre le cycle
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-stone-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Sans engagement
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Essai 14 jours sans carte bancaire
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Données hébergées en France (OVHcloud)
            </span>
          </div>
        </div>

        {/* COMPOSANT PRODUIT VIVANT : GRAND LIVRE DU MOIS (CALM LEDGER) */}
        <div id="grand-livre" className="max-w-4xl mx-auto mt-14">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xl shadow-stone-200/40 overflow-hidden">
            {/* Header du Grand Livre */}
            <div className="px-6 py-5 border-b border-stone-100 flex flex-wrap items-center justify-between gap-4 bg-stone-50/50">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-md bg-stone-900 text-white font-mono text-xs font-bold flex items-center justify-center">
                  10
                </span>
                <div>
                  <h3 className="font-semibold text-stone-900 text-base">Octobre 2026</h3>
                  <p className="text-xs text-stone-500">Grand livre mensuel · 3 baux actifs</p>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {nantesPaid ? "100 % des loyers perçus" : "86 % des loyers perçus (2 450 € / 2 850 €)"}
              </div>
            </div>

            {/* Métriques consolidées */}
            <div className="grid grid-cols-2 md:grid-cols-4 border-b border-stone-100 divide-x divide-stone-100 bg-white">
              <div className="p-5">
                <span className="block text-[11px] font-medium uppercase tracking-wider text-stone-500 mb-1">
                  Loyers exigibles
                </span>
                <span className="text-xl font-bold font-mono text-stone-900">2 850,00 €</span>
              </div>
              <div className="p-5">
                <span className="block text-[11px] font-medium uppercase tracking-wider text-stone-500 mb-1">
                  Encaissés
                </span>
                <span className="text-xl font-bold font-mono text-emerald-600">
                  {nantesPaid ? "2 850,00 €" : "2 450,00 €"}
                </span>
              </div>
              <div className="p-5">
                <span className="block text-[11px] font-medium uppercase tracking-wider text-stone-500 mb-1">
                  Solde restant
                </span>
                <span className={`text-xl font-bold font-mono ${nantesPaid ? "text-stone-400" : "text-amber-600"}`}>
                  {nantesPaid ? "0,00 €" : "400,00 €"}
                </span>
              </div>
              <div className="p-5">
                <span className="block text-[11px] font-medium uppercase tracking-wider text-stone-500 mb-1">
                  Documents
                </span>
                <span className="text-xl font-bold font-mono text-stone-900">
                  {nantesPaid ? "3 quittances" : "2 quitt. · 1 reçu"}
                </span>
              </div>
            </div>

            {/* Lignes du Grand Livre */}
            <div className="divide-y divide-stone-100">
              {/* Ligne 1 : Paris */}
              <div className="p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-stone-50/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">Studio Rue Oberkampf · Paris 11e</h4>
                    <p className="text-xs text-stone-500">Camille Laurent · Loyer nu 670 € + Provisions 80 €</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-mono font-bold text-stone-900 text-sm">750,00 €</span>
                    <span className="block text-[11px] text-emerald-600 font-medium">Réglé le 02 oct</span>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs text-stone-500 bg-stone-50 px-2.5 py-1 rounded border border-stone-200">
                    <FileText className="w-3 h-3 text-stone-400" />
                    Quittance conforme #2026-10-01
                  </span>
                </div>
              </div>

              {/* Ligne 2 : Lyon */}
              <div className="p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-stone-50/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">T3 Avenue Victor Hugo · Lyon 2e</h4>
                    <p className="text-xs text-stone-500">Alexandre Mercier · Loyer nu 1 520 € + Provisions 180 €</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-mono font-bold text-stone-900 text-sm">1 700,00 €</span>
                    <span className="block text-[11px] text-emerald-600 font-medium">Réglé le 04 oct</span>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs text-stone-500 bg-stone-50 px-2.5 py-1 rounded border border-stone-200">
                    <FileText className="w-3 h-3 text-stone-400" />
                    Quittance conforme #2026-10-02
                  </span>
                </div>
              </div>

              {/* Ligne 3 : Nantes (Paiement partiel / Cas réel) */}
              <div
                className={`p-5 flex flex-wrap items-center justify-between gap-4 transition-colors ${
                  nantesPaid ? "bg-white" : "bg-amber-50/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      nantesPaid ? "bg-emerald-50 text-emerald-600" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {nantesPaid ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-stone-900 text-sm">T2 Rue de la République · Nantes</h4>
                      {!nantesPaid && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                          Acompte perçu
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500">
                      Éléonore Moreau · Attendu : 800,00 € · Reçu : {nantesPaid ? "800,00 €" : "400,00 € le 05 oct"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-mono font-bold text-sm text-stone-900">
                      {nantesPaid ? "800,00 €" : "Reste 400,00 €"}
                    </span>
                    <span className="block text-[11px] text-stone-500">
                      {nantesPaid ? "Solde réglé" : "Reçu d'acompte (art. 21)"}
                    </span>
                  </div>
                  <button
                    onClick={() => setNantesPaid(!nantesPaid)}
                    className={`text-xs font-medium px-3.5 py-1.5 rounded-md transition-all flex items-center gap-1.5 shadow-2xs ${
                      nantesPaid
                        ? "bg-stone-100 text-stone-600 hover:bg-stone-200"
                        : "bg-stone-900 text-white hover:bg-stone-800"
                    }`}
                  >
                    {nantesPaid ? "Annuler le pointage" : "Pointer le solde reçu (400 €)"}
                  </button>
                </div>
              </div>
            </div>

            {/* Pied du Grand Livre */}
            <div className="px-6 py-3 bg-stone-50 text-stone-500 text-[11px] border-t border-stone-100 flex items-center justify-between">
              <span>Conforme à la loi du 6 juillet 1989 art. 21 · Quittance uniquement si solde = 0 €</span>
              <span className="font-mono">Arrêté au 07 octobre 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRANSITION VERS LE PREMIER MOMENT DE STORYTELLING */}
      <section id="cycle" className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-stone-500 block mb-3">
            La mécanique sous le capot
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-stone-950 mb-4">
            Trois étapes. Zéro approximation.
          </h2>
          <p className="text-stone-600 text-base">
            Le suivi mensuel ne doit jamais dépendre d'un tableur bricolé. Chaque montant suit une règle de droit stricte.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border border-stone-200 bg-white shadow-xs">
            <span className="font-mono text-xs font-bold text-stone-400 mb-3 block">01 / LE 1ER DU MOIS</span>
            <h3 className="font-bold text-stone-950 text-base mb-2">Exigibilité & Ventilation</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Dès le 1er jour, l'échéance de chaque bail actif est calculée avec sa séparation obligatoire entre loyer nu et provisions sur charges (décret n° 2015-587).
            </p>
          </div>

          <div className="p-6 rounded-xl border border-stone-200 bg-white shadow-xs">
            <span className="font-mono text-xs font-bold text-stone-400 mb-3 block">02 / AU FIL DES VIREMENTS</span>
            <h3 className="font-bold text-stone-950 text-base mb-2">Pointage & Gestion des Acomptes</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Un locataire verse 400 € sur 800 € ? RentReady enregistre l'acompte, calcule le solde exact et évite d'émettre une quittance prématurée illégale.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-stone-200 bg-white shadow-xs">
            <span className="font-mono text-xs font-bold text-stone-400 mb-3 block">03 / RÈGLEMENT DU SOLDE</span>
            <h3 className="font-bold text-stone-950 text-base mb-2">Quittance Conforme</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Dès que le solde atteint 0,00 €, la quittance conforme (loi 1989 art. 21) est disponible pour votre locataire sur son espace sécurisé sans mot de passe.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
