"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ArrowDown, Activity, Sparkles, Layers } from "lucide-react";

/**
 * DIRECTION C : « Le Fil du Mois » (Product Story / Monthly Rhythm / Continuous Flow)
 * Style : Le temps et le flux de trésorerie sont l'armature de la page.
 * Signature : Le Conduit d'Échéance (Cashline Rail) qui relie le titre au pointage et aux quittances.
 */
export function DirectionC() {
  const [nantesSettled, setNantesSettled] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
      {/* 1. KINETIC HEADER */}
      <header className="sticky top-0 z-40 bg-[#F4F5F7]/90 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-slate-950 text-white font-mono text-sm font-bold flex items-center justify-center">
              RR
            </div>
            <span className="font-bold tracking-tight text-lg text-slate-950">RentReady</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 ml-3 px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              Direction C · Fil du Mois
            </span>
          </div>

          <div className="flex items-center gap-5">
            <span className="hidden md:inline-block font-mono text-xs text-slate-500">
              CYCLE TEMPOREL : 01 OCT → 31 OCT 2026
            </span>
            <Link
              href="/register"
              className="text-xs font-semibold uppercase tracking-wider px-4 py-2 bg-slate-950 text-white rounded hover:bg-slate-800 transition-colors shadow-sm"
            >
              Lancer le cycle
            </Link>
          </div>
        </div>
      </header>

      {/* 2. NARRATIVE HERO : LA LIGNE TEMPORELLE CONTINUE */}
      <section className="pt-14 pb-20 px-6 max-w-5xl mx-auto">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-200/80 text-slate-700 font-mono text-xs mb-5">
            <Activity className="w-3.5 h-3.5 text-indigo-600" />
            FLUX CONTINU DU LOYER · OCTOBRE 2026
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.05] mb-6">
            Votre mois locatif <br />
            <span className="text-indigo-600">ne s'arrête pas à un tableau.</span>
          </h1>

          <p className="text-lg text-slate-600 font-normal leading-relaxed max-w-2xl">
            Suivez le trajet vivant de vos loyers. De la ventilation initiale le 1er du mois jusqu'au solde définitif,
            chaque euro avance sur son fil sans perte de trace ni confusion juridique.
          </p>
        </div>

        {/* LE CONDUIT D'ÉCHÉANCE (SIGNATURE VISUELLE UNIQUE) */}
        <div className="relative pl-8 sm:pl-12 border-l-2 border-indigo-300 ml-4 sm:ml-6 space-y-12 my-14">
          {/* ÉTAPE 01 : LA SOURCE DU MOIS (1ER DU MOIS) */}
          <div className="relative">
            {/* Nœud lumineux sur le conduit */}
            <div className="absolute -left-[41px] sm:-left-[57px] top-1.5 w-6 h-6 rounded-full bg-indigo-600 text-white font-mono text-xs flex items-center justify-center font-bold ring-4 ring-[#F4F5F7]">
              1
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-3xl">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
                <div>
                  <span className="font-mono text-xs text-indigo-600 uppercase font-semibold">
                    01 Octobre 2026 · Ouverture du mois
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg">Loyers Exigibles Initialisés</h3>
                </div>
                <div className="text-right">
                  <span className="font-mono text-2xl font-black text-slate-900">2 850,00 €</span>
                  <span className="block text-[11px] text-slate-400 font-mono">3 baux ventilés (art. 21)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">PARIS 11E</span>
                  <span className="font-bold text-slate-800">750,00 €</span>
                  <span className="text-[10px] text-slate-500 block">670 € nu + 80 € ch.</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">LYON 2E</span>
                  <span className="font-bold text-slate-800">1 700,00 €</span>
                  <span className="text-[10px] text-slate-500 block">1 520 € nu + 180 € ch.</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">NANTES</span>
                  <span className="font-bold text-slate-800">800,00 €</span>
                  <span className="text-[10px] text-slate-500 block">700 € nu + 100 € ch.</span>
                </div>
              </div>
            </div>
          </div>

          {/* ÉTAPE 02 : LE FLUX DES ENCAISSEMENTS (AU FIL DES JOURS) */}
          <div className="relative">
            <div className="absolute -left-[41px] sm:-left-[57px] top-1.5 w-6 h-6 rounded-full bg-slate-900 text-white font-mono text-xs flex items-center justify-center font-bold ring-4 ring-[#F4F5F7]">
              2
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-3xl">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
                <div>
                  <span className="font-mono text-xs text-slate-500 uppercase font-semibold">
                    02 au 05 Octobre · Réception des virements
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg">Pointage & Reconnaissance des Flux</h3>
                </div>
                <div className="text-right">
                  <span className="font-mono text-2xl font-black text-emerald-600">
                    {nantesSettled ? "2 850,00 €" : "2 450,00 €"}
                  </span>
                  <span className="block text-[11px] text-slate-400 font-mono">
                    {nantesSettled ? "100 % perçus" : "86 % perçus (reste 400 €)"}
                  </span>
                </div>
              </div>

              {/* Flux interactif */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3 bg-emerald-50/60 border border-emerald-200 rounded text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Paris 11e (Camille L.) : 750,00 € viré le 02/10</span>
                  </div>
                  <span className="text-emerald-700 font-bold">Soldé · Quittance émise</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-emerald-50/60 border border-emerald-200 rounded text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Lyon 2e (Alexandre M.) : 1 700,00 € viré le 04/10</span>
                  </div>
                  <span className="text-emerald-700 font-bold">Soldé · Quittance émise</span>
                </div>

                {/* Point de tension : Nantes */}
                <div
                  className={`flex flex-wrap items-center justify-between p-3 rounded text-xs font-mono border transition-all ${
                    nantesSettled
                      ? "bg-emerald-50/60 border-emerald-200"
                      : "bg-amber-50 border-amber-300"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${nantesSettled ? "bg-emerald-600" : "bg-amber-500 animate-ping"}`} />
                      <span className="font-bold text-slate-900">
                        Nantes (Éléonore M.) : 400,00 € perçu sur 800,00 €
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      {nantesSettled
                        ? "Solde de 400,00 € perçu · Bail à jour"
                        : "Acompte partiel enregistré (art. 21) · Reste 400,00 € en attente"}
                    </span>
                  </div>

                  <button
                    onClick={() => setNantesSettled(!nantesSettled)}
                    className={`mt-2 sm:mt-0 px-3 py-1.5 rounded font-semibold text-xs transition-colors ${
                      nantesSettled
                        ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                        : "bg-slate-950 text-white hover:bg-slate-800"
                    }`}
                  >
                    {nantesSettled ? "Annuler le pointage" : "Pointer le solde reçu (400 €)"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ÉTAPE 03 : L'EXTINCTION DU MOIS & TITRES CONFORMES */}
          <div className="relative">
            <div
              className={`absolute -left-[41px] sm:-left-[57px] top-1.5 w-6 h-6 rounded-full font-mono text-xs flex items-center justify-center font-bold ring-4 ring-[#F4F5F7] transition-colors ${
                nantesSettled ? "bg-emerald-600 text-white" : "bg-slate-300 text-slate-700"
              }`}
            >
              3
            </div>

            <div className="bg-slate-950 text-white p-6 rounded-xl shadow-lg max-w-3xl">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
                <div>
                  <span className="font-mono text-xs text-indigo-400 uppercase font-semibold">
                    Fin du cycle · Sécurité Juridique
                  </span>
                  <h3 className="font-bold text-white text-lg">Titres de Décharge Délivrés</h3>
                </div>
                <div className="font-mono text-xs text-slate-400">
                  Loi 1989 art. 21 · Zéro contestation
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">PARIS 11E</span>
                  <span className="text-emerald-400 font-bold block">Quittance émise</span>
                  <span className="text-[10px] text-slate-500">750,00 € réglé</span>
                </div>
                <div className="p-3 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">LYON 2E</span>
                  <span className="text-emerald-400 font-bold block">Quittance émise</span>
                  <span className="text-[10px] text-slate-500">1 700,00 € réglé</span>
                </div>
                <div
                  className={`p-3 rounded border transition-colors ${
                    nantesSettled
                      ? "bg-slate-900 border-slate-800 text-emerald-400"
                      : "bg-amber-950/60 border-amber-900 text-amber-300"
                  }`}
                >
                  <span className="text-slate-400 text-[10px] block">NANTES</span>
                  <span className="font-bold block">
                    {nantesSettled ? "Quittance émise" : "Reçu d'acompte émis"}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {nantesSettled ? "800,00 € réglé" : "Solde dû : 400,00 €"}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono">
                <span>Espace locataire sans mot de passe mis à jour</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {nantesSettled ? "Mois d'octobre 100 % clos" : "1 dossier en attente de clôture"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA FINAL DE TRANSITION DU FLUX */}
        <div className="pt-8 text-center max-w-xl mx-auto">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-950 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all shadow-md text-base"
          >
            Mettre vos logements sur le fil
            <ArrowRight className="w-4 h-4" />
          </Link>
          <span className="block text-xs text-slate-500 mt-3 font-mono">
            Essai 14 jours sans carte bancaire · Hébergement en France (OVHcloud)
          </span>
        </div>
      </section>
    </div>
  );
}
