"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  ArrowRight,
  Calendar,
  AlertCircle,
  Clock,
  ShieldCheck,
  Send,
} from "lucide-react";

export type DashboardMode =
  | "standard_exception"
  | "standard_resolved"
  | "dense_10"
  | "multi_exception"
  | "stress_long";

interface DashboardV21Props {
  mode?: DashboardMode;
  initialResolved?: boolean;
}

export function DashboardV21({
  mode = "standard_exception",
  initialResolved,
}: DashboardV21Props) {
  // Détermination de l'état résolu initial selon le mode ou la prop
  const [isResolved, setIsResolved] = useState<boolean>(() => {
    if (initialResolved !== undefined) return initialResolved;
    return mode === "standard_resolved";
  });

  // Jeux de données selon le mode
  const isDense10 = mode === "dense_10";
  const isMultiException = mode === "multi_exception";
  const isStressLong = mode === "stress_long";

  // Configuration des données
  let properties: Array<{
    id: string;
    name: string;
    city: string;
    tenant: string;
    lease: string;
    rentBare?: number;
    charges?: number;
    rentTotal: number;
    paidAmount: number;
    status: "calm" | "actionable" | "delayed";
    statusLabel: string;
    statusDate?: string;
    actionLabel?: string;
    note?: string;
  }> = [];

  if (isStressLong) {
    properties = [
      {
        id: "p-long-1",
        name: "Appartement 4 pièces – 127 boulevard du Général de Gaulle",
        city: "La Madeleine",
        tenant: "Marie-Charlotte Van den Broeck-Dupont",
        lease: "Bail nu loi 89 triennal",
        rentTotal: 2843.17,
        paidAmount: isResolved ? 2843.17 : 2443.17,
        status: isResolved ? "calm" : "actionable",
        statusLabel: isResolved ? "Soldé le 07 oct." : "Solde de 400,00 € à pointer",
        statusDate: "03 oct.",
        actionLabel: "Marquer les 400,00 € reçus",
        note: "Acompte de 2 443,17 € perçu le 03 oct. Quittance libératoire en attente.",
      },
      {
        id: "p-long-2",
        name: "Résidence Les Terrasses du Parc – Bâtiment B – Lot 127",
        city: "Aix-en-Provence",
        tenant: "Jean-Baptiste de La Rochefoucauld",
        lease: "Bail d'habitation meublée (Loi Alur)",
        rentTotal: 1950.5,
        paidAmount: 1950.5,
        status: "calm",
        statusLabel: "Réglé le 03 oct.",
        statusDate: "03 oct.",
      },
      {
        id: "p-long-3",
        name: "Studio Rue Oberkampf",
        city: "Paris 11e",
        tenant: "Camille Laurent",
        lease: "Bail meublé 1 an",
        rentTotal: 750.0,
        paidAmount: 750.0,
        status: "calm",
        statusLabel: "Réglé le 02 oct.",
        statusDate: "02 oct.",
      },
    ];
  } else if (isMultiException) {
    properties = [
      {
        id: "p-multi-1",
        name: "T2 Rue de la République",
        city: "Nantes",
        tenant: "Éléonore Moreau",
        lease: "Bail meublé 1 an",
        rentTotal: 800,
        paidAmount: isResolved ? 800 : 400,
        status: isResolved ? "calm" : "actionable",
        statusLabel: isResolved ? "Soldé le 07 oct." : "Solde de 400,00 € à pointer",
        statusDate: "03 oct.",
        actionLabel: "Marquer les 400 € reçus",
        note: "Acompte versé le 03 oct. Reçu émis.",
      },
      {
        id: "p-multi-2",
        name: "Studio Rue Gambetta",
        city: "Lille",
        tenant: "Maxime Vasseur",
        lease: "Bail meublé 1 an",
        rentTotal: 620,
        paidAmount: 0,
        status: "delayed",
        statusLabel: "Loyer non reçu · Échéance au 05/10",
        actionLabel: "Envoyer une relance",
        note: "Aucun mouvement constaté à ce jour.",
      },
      {
        id: "p-multi-3",
        name: "T3 Quai des Chartrons",
        city: "Bordeaux",
        tenant: "Sophie Delorme",
        lease: "Bail nu 3 ans",
        rentTotal: 950,
        paidAmount: 950,
        status: "actionable",
        statusLabel: "Virement de 950 € à rapprocher",
        statusDate: "06 oct.",
        actionLabel: "Valider le virement",
        note: "Virement reçu portant la mention « Loyer Octobre S. Delorme ».",
      },
      {
        id: "p-multi-4",
        name: "Studio Rue Oberkampf",
        city: "Paris 11e",
        tenant: "Camille Laurent",
        lease: "Bail meublé 1 an",
        rentTotal: 750,
        paidAmount: 750,
        status: "calm",
        statusLabel: "Réglé le 02 oct.",
        statusDate: "02 oct.",
      },
      {
        id: "p-multi-5",
        name: "T3 Avenue Victor Hugo",
        city: "Lyon 2e",
        tenant: "Alexandre Mercier",
        lease: "Bail nu 3 ans",
        rentTotal: 1700,
        paidAmount: 1700,
        status: "calm",
        statusLabel: "Réglé le 04 oct.",
        statusDate: "04 oct.",
      },
      {
        id: "p-multi-6",
        name: "T1 Rue d'Alsace",
        city: "Strasbourg",
        tenant: "Lucas Bernard",
        lease: "Bail meublé 1 an",
        rentTotal: 580,
        paidAmount: 580,
        status: "calm",
        statusLabel: "Réglé le 01 oct.",
        statusDate: "01 oct.",
      },
    ];
  } else if (isDense10) {
    properties = [
      {
        id: "p-10-1",
        name: "Studio Rue Oberkampf",
        city: "Paris 11e",
        tenant: "Camille Laurent",
        lease: "Bail meublé 1 an",
        rentTotal: 750,
        paidAmount: 750,
        status: "calm",
        statusLabel: "Réglé le 02 oct.",
      },
      {
        id: "p-10-2",
        name: "T3 Avenue Victor Hugo",
        city: "Lyon 2e",
        tenant: "Alexandre Mercier",
        lease: "Bail nu 3 ans",
        rentTotal: 1700,
        paidAmount: 1700,
        status: "calm",
        statusLabel: "Réglé le 04 oct.",
      },
      {
        id: "p-10-3",
        name: "T2 Rue de la République",
        city: "Nantes",
        tenant: "Éléonore Moreau",
        lease: "Bail meublé 1 an",
        rentTotal: 800,
        paidAmount: isResolved ? 800 : 400,
        status: isResolved ? "calm" : "actionable",
        statusLabel: isResolved ? "Soldé le 07 oct." : "Solde de 400,00 € à pointer",
        actionLabel: "Marquer les 400 € reçus",
        note: "Acompte versé le 03 oct. Solde de 400 € restant.",
      },
      {
        id: "p-10-4",
        name: "T3 Quai des Chartrons",
        city: "Bordeaux",
        tenant: "Sophie Delorme",
        lease: "Bail nu 3 ans",
        rentTotal: 950,
        paidAmount: 950,
        status: "calm",
        statusLabel: "Réglé le 05 oct.",
      },
      {
        id: "p-10-5",
        name: "Studio Rue Gambetta",
        city: "Lille",
        tenant: "Maxime Vasseur",
        lease: "Bail meublé 1 an",
        rentTotal: 620,
        paidAmount: 620,
        status: "calm",
        statusLabel: "Réglé le 03 oct.",
      },
      {
        id: "p-10-6",
        name: "T2 Place Castellane",
        city: "Marseille 6e",
        tenant: "Chloé Giraud",
        lease: "Bail meublé 1 an",
        rentTotal: 780,
        paidAmount: 780,
        status: "calm",
        statusLabel: "Réglé le 02 oct.",
      },
      {
        id: "p-10-7",
        name: "T3 Rue Saint-Rome",
        city: "Toulouse",
        tenant: "Julien Faure",
        lease: "Bail nu 3 ans",
        rentTotal: 890,
        paidAmount: 890,
        status: "calm",
        statusLabel: "Réglé le 04 oct.",
      },
      {
        id: "p-10-8",
        name: "T1 Rue d'Alsace",
        city: "Strasbourg",
        tenant: "Lucas Bernard",
        lease: "Bail meublé 1 an",
        rentTotal: 580,
        paidAmount: 580,
        status: "calm",
        statusLabel: "Réglé le 01 oct.",
      },
      {
        id: "p-10-9",
        name: "T2 Mail François Mitterrand",
        city: "Rennes",
        tenant: "Nathalie Rolland",
        lease: "Bail meublé 1 an",
        rentTotal: 710,
        paidAmount: 710,
        status: "calm",
        statusLabel: "Réglé le 02 oct.",
      },
      {
        id: "p-10-10",
        name: "Studio Boulevard Jeu de Paume",
        city: "Montpellier",
        tenant: "Antoine Robin",
        lease: "Bail meublé 1 an",
        rentTotal: 640,
        paidAmount: 640,
        status: "calm",
        statusLabel: "Réglé le 03 oct.",
      },
    ];
  } else {
    // Mode standard (3 logements)
    properties = [
      {
        id: "p-std-1",
        name: "Studio Rue Oberkampf",
        city: "Paris 11e",
        tenant: "Camille Laurent",
        lease: "Bail meublé 1 an",
        rentTotal: 750,
        paidAmount: 750,
        status: "calm",
        statusLabel: "Réglé le 02 oct.",
      },
      {
        id: "p-std-2",
        name: "T3 Avenue Victor Hugo",
        city: "Lyon 2e",
        tenant: "Alexandre Mercier",
        lease: "Bail nu 3 ans",
        rentTotal: 1700,
        paidAmount: 1700,
        status: "calm",
        statusLabel: "Réglé le 04 oct.",
      },
      {
        id: "p-std-3",
        name: "T2 Rue de la République",
        city: "Nantes",
        tenant: "Éléonore Moreau",
        lease: "Bail meublé 1 an",
        rentTotal: 800,
        paidAmount: isResolved ? 800 : 400,
        status: isResolved ? "calm" : "actionable",
        statusLabel: isResolved ? "Soldé le 07 oct." : "Solde de 400,00 € à pointer",
        actionLabel: "Marquer les 400 € reçus",
        note: "Acompte versé le 03 oct. Le solde restant est de 400,00 €.",
      },
    ];
  }

  // Calculs monétaires réels (sans float imprécis)
  const totalDue = properties.reduce((acc, p) => acc + p.rentTotal, 0);
  const totalReceived = properties.reduce((acc, p) => acc + p.paidAmount, 0);
  const totalBalance = Math.max(0, Math.round((totalDue - totalReceived) * 100) / 100);

  const activeExceptions = properties.filter((p) => p.status !== "calm");
  const calmCount = properties.length - activeExceptions.length;

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#151413] font-sans selection:bg-[#151413] selection:text-[#F8F6F0]">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER APPLICATIF DE PRODUCTION (STABLE & PROPRE)
          Aucun toggle démo / aucun artefact de prototype.
      ───────────────────────────────────────────────────────────── */}
      <header className="bg-[#F8F6F0] border-b border-[#151413]/10 px-4 sm:px-8 py-3 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 sm:gap-8">
            <Link
              href="/"
              className="font-serif text-xl sm:text-2xl italic font-semibold text-[#151413] tracking-tight"
            >
              RentReady
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#6B6760]">
              <span className="text-[#151413] font-semibold border-b border-[#151413] pb-0.5">
                Vue d'ensemble
              </span>
              <span className="hover:text-[#151413] transition-colors cursor-pointer">
                Mes logements ({properties.length})
              </span>
              <span className="hover:text-[#151413] transition-colors cursor-pointer">
                Locataires ({properties.length})
              </span>
              <span className="hover:text-[#151413] transition-colors cursor-pointer">
                Loyers & Quittances
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-medium text-[#151413]">
              <span
                className="w-7 h-7 rounded-full bg-[#151413] text-[#F8F6F0] flex items-center justify-center text-[10px] font-bold"
                aria-label="Profil utilisateur"
              >
                TR
              </span>
              <span className="hidden sm:inline">Thomas R.</span>
            </div>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. CORPS DU DASHBOARD — COMPACT & ÉDITORIAL
      ───────────────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8">
        {/* RESUME MENSUEL */}
        <section className="space-y-3.5" aria-labelledby="heading-month">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#151413]/10 pb-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#6B6760]">
                <Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span className="font-medium">Mois en cours · Arrêté au 07 octobre</span>
              </div>
              <h1
                id="heading-month"
                className="font-serif text-2xl sm:text-3xl text-[#151413] font-normal tracking-tight mt-0.5"
              >
                Octobre 2026
              </h1>
            </div>

            {/* Chiffres financiers du mois */}
            <div className="flex items-baseline justify-between sm:justify-end gap-6 sm:gap-8 pt-1 sm:pt-0 border-t sm:border-t-0 border-[#151413]/6">
              <div>
                <span className="block text-[11px] text-[#6B6760]">Attendus</span>
                <span className="font-mono text-xl sm:text-2xl font-semibold text-[#151413] tabular-nums">
                  {totalDue.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}&nbsp;
                  <span className="text-xs font-normal text-[#6B6760]">€</span>
                </span>
              </div>

              <div>
                <span className="block text-[11px] text-[#6B6760]">Reçus</span>
                <span className="font-mono text-xl sm:text-2xl font-semibold text-[#166534] tabular-nums">
                  {totalReceived.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}&nbsp;
                  <span className="text-xs font-normal text-[#166534]">€</span>
                </span>
              </div>

              <div>
                <span className="block text-[11px] text-[#6B6760]">Solde</span>
                <span
                  className={`font-mono text-xl sm:text-2xl font-semibold tabular-nums transition-colors ${
                    totalBalance === 0 ? "text-[#166534]" : "text-[#C2410C]"
                  }`}
                >
                  {totalBalance.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}&nbsp;
                  <span className="text-xs font-normal opacity-80">€</span>
                </span>
              </div>
            </div>
          </div>

          {/* BANDEAU DE SITUATION UNIFIÉ (Une seule surface contextuelle) */}
          <div
            className={`p-3.5 sm:p-4.5 transition-all duration-200 border ${
              activeExceptions.length === 0
                ? "bg-[#F3EFE6] border-[#166534]/20 text-[#166534]"
                : "bg-[#FFFDF9] border-[#C2410C]/25 text-[#151413]"
            }`}
          >
            {activeExceptions.length === 0 ? (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#166534] shrink-0" aria-hidden="true" />
                  <div>
                    <h2 className="text-sm font-semibold text-[#166534]">
                      Tout est à jour pour le mois d'octobre
                    </h2>
                    <p className="text-xs text-[#166534]/80 mt-0.5">
                      Les {properties.length} loyers sont perçus ({totalDue.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €). Les {properties.length} quittances sont prêtes. Rien ne requiert votre attention.
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 text-xs text-[#166534] underline font-medium hover:text-black transition-colors cursor-pointer">
                  Consulter les quittances
                </span>
              </div>
            ) : activeExceptions.length === 1 ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C2410C] mt-1 shrink-0" aria-hidden="true" />
                  <div>
                    <h2 className="text-sm font-semibold text-[#151413]">
                      Une seule action attend votre confirmation à {activeExceptions[0].city}
                    </h2>
                    <p className="text-xs text-[#6B6760] mt-0.5">
                      {activeExceptions[0].tenant} a un solde restant de {totalBalance.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €.
                    </p>
                  </div>
                </div>
                {activeExceptions[0].actionLabel && (
                  <button
                    type="button"
                    onClick={() => setIsResolved(true)}
                    className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 bg-[#151413] text-[#F8F6F0] text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer self-start sm:self-center"
                  >
                    {activeExceptions[0].actionLabel}
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-[#C2410C] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h2 className="text-sm font-semibold text-[#151413]">
                      {activeExceptions.length} situations requièrent votre attention pour clore octobre
                    </h2>
                    <p className="text-xs text-[#6B6760] mt-0.5">
                      Solde total restant à percevoir : {totalBalance.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €. Chaque action est accessible ci-dessous.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            3. LISTE DES LOGEMENTS : RÈGLE DE SILENCE & RÉTRACTATION
        ───────────────────────────────────────────────────────────── */}
        <section id="properties" className="space-y-3" aria-labelledby="heading-properties">
          <div className="flex items-baseline justify-between border-b border-[#151413]/10 pb-2">
            <h2 id="heading-properties" className="text-xs uppercase tracking-wider font-semibold text-[#6B6760]">
              Vos logements ({properties.length})
            </h2>
            <span className="text-xs text-[#6B6760]">
              {calmCount} à jour{activeExceptions.length > 0 ? ` · ${activeExceptions.length} en attente` : ""}
            </span>
          </div>

          <div className="divide-y divide-[#151413]/10 border-y border-[#151413]/10">
            {properties.map((p) => {
              const isException = p.status !== "calm";
              const isActionable = p.status === "actionable";
              const isDelayed = p.status === "delayed";

              if (!isException) {
                // ÉTAT CALME : 1 UNITÉ D'ATTENTION (COMPACT, SILENCIEUX)
                return (
                  <div
                    key={p.id}
                    className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 hover:bg-[#151413]/[0.02] px-2 transition-colors"
                  >
                    <div className="flex items-baseline gap-2.5 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-[#166534] shrink-0" aria-label="À jour" />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-2">
                          <h3 className="text-xs sm:text-sm font-semibold text-[#151413] truncate">
                            {p.name}
                          </h3>
                          <span className="text-xs text-[#6B6760]">· {p.city}</span>
                        </div>
                        <span className="text-[11px] sm:text-xs text-[#6B6760] block truncate">
                          {p.tenant} · {p.lease}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 text-xs pl-4 sm:pl-0 shrink-0">
                      <div className="text-left sm:text-right">
                        <span className="font-mono font-medium text-[#151413] tabular-nums">
                          {p.rentTotal.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}&nbsp;€
                        </span>
                        <span className="block text-[11px] text-[#166534]">
                          ✓ {p.statusLabel}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#166534] bg-[#166534]/10 px-2 py-0.5 border border-[#166534]/20">
                          <Check className="w-3 h-3" aria-hidden="true" /> Quittance prête
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }

              if (isActionable) {
                // EXCEPTION ACTIONNABLE (Expansée, 2-3 unités d'attention)
                return (
                  <div
                    key={p.id}
                    className="p-3.5 sm:p-4 bg-[#FFFDF9] border-l-4 border-l-[#C2410C] border-y border-r border-[#C2410C]/25 my-1 transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#C2410C] shrink-0 mt-1" aria-label="Attention requise" />
                        <div>
                          <div className="flex flex-wrap items-baseline gap-x-2">
                            <h3 className="text-sm sm:text-base font-bold text-[#151413]">
                              {p.name}
                            </h3>
                            <span className="text-xs text-[#6B6760]">· {p.city}</span>
                          </div>
                          <span className="text-xs text-[#6B6760] block mt-0.5">
                            Locataire : {p.tenant} · Loyer contractuel : {p.rentTotal.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}&nbsp;€
                          </span>
                        </div>
                      </div>

                      <div className="text-left sm:text-right pl-5 sm:pl-0">
                        <span className="text-xs font-semibold text-[#C2410C] block">
                          {p.statusLabel}
                        </span>
                        <span className="text-[11px] text-[#6B6760]">
                          ({p.paidAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}&nbsp;€ perçus)
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 mt-2 border-t border-[#C2410C]/15 text-xs">
                      <span className="text-[#6B6760] text-[11px]">
                        {p.note || "La quittance libératoire sera émise dès confirmation du solde (art. 21)."}
                      </span>

                      <button
                        type="button"
                        onClick={() => setIsResolved(true)}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#151413] text-[#F8F6F0] text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer active:scale-[0.98]"
                      >
                        {p.actionLabel || "Marquer comme reçu"}
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                );
              }

              // EXCEPTION SECONDAIRE / RETARD (1.5 unité d'attention, sobre)
              return (
                <div
                  key={p.id}
                  className="py-3 px-3 bg-[#FFFDF8] border-l-2 border-l-[#D97706] border-y border-r border-[#D97706]/20 my-1 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-baseline gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#D97706] shrink-0" aria-label="Retard" />
                      <div>
                        <h3 className="text-xs sm:text-sm font-semibold text-[#151413]">
                          {p.name} · {p.city}
                        </h3>
                        <span className="text-[11px] text-[#6B6760]">
                          {p.tenant} · {p.lease}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 text-xs pl-4 sm:pl-0">
                      <div className="text-left sm:text-right">
                        <span className="font-mono font-medium text-[#151413] tabular-nums">
                          {p.rentTotal.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}&nbsp;€
                        </span>
                        <span className="block text-[11px] text-[#D97706] font-medium">
                          {p.statusLabel}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-[11px] text-[#151413] bg-[#EDEAE0] hover:bg-[#E5DFD3] px-2.5 py-1 font-medium transition-colors"
                      >
                        <Send className="w-3 h-3" aria-hidden="true" />
                        {p.actionLabel || "Relancer"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* PIED DE TABLEAU ÉPURÉ (Suppression de la fausse grille de contacts superflue) */}
        <footer className="pt-2 text-center text-xs text-[#6B6760]">
          <p>
            {properties.length} logements sous gestion directe · Conforme loi Alur & art. 21 loi 89
          </p>
        </footer>
      </main>
    </div>
  );
}
