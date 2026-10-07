"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  AlertCircle,
  FileText,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Building2,
  Calendar,
} from "lucide-react";

/**
 * DIRECTION B+ : « EDITORIAL MONTHLY LEDGER »
 *
 * Synthèse demandée par la Creative Review :
 * - Fondation de marque B : Matière papier chaud (#F7F5EE), encre noire (#181716),
 *   typographie éditoriale (serif display + sans rigoureux), filets fins, tabulation financière, zéro soupe de cartes.
 * - Mécanique narrative C : Le mois comme structure (ouverture -> règlements -> exception isolée -> résolution sereine).
 * - Clarté commerciale A : Bénéfice humain immédiat, rapidité de compréhension au-dessus de la ligne de flottaison (Desktop & Mobile).
 * - Suppression du cosplay juridique : vocabulaire humain, droit en couche de réassurance silencieuse.
 */
export function DirectionBPlus() {
  const [isNantesResolved, setIsNantesResolved] = useState(false);

  // Totaux calculés selon l'état de résolution
  const totalDue = 2850;
  const totalReceived = isNantesResolved ? 2850 : 2450;
  const totalBalance = isNantesResolved ? 0 : 400;
  const receivedPct = isNantesResolved ? 100 : 86;

  return (
    <div className="min-h-screen bg-[#F7F5EE] text-[#181716] font-sans selection:bg-[#181716] selection:text-[#F7F5EE]">
      {/* ─────────────────────────────────────────────────────────────
          1. NAVIGATION ÉDITORIALE ÉPURÉE
      ───────────────────────────────────────────────────────────── */}
      <header className="relative z-40 bg-[#F7F5EE] border-b border-[#181716]/10 px-6 lg:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-baseline gap-4">
            <span className="font-serif text-2xl tracking-tight font-semibold italic text-[#181716]">
              RentReady
            </span>
            <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-widest text-[#6E6A63] border-l border-[#181716]/15 pl-3">
              Direction B+ · Editorial Monthly Ledger
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-[#6E6A63]">
            <a href="#cycle-mensuel" className="hover:text-[#181716] transition-colors">
              Le mois en direct
            </a>
            <a href="#homebase" className="hover:text-[#181716] transition-colors">
              Mémoire du logement
            </a>
            <a href="#preuve-legale" className="hover:text-[#181716] transition-colors">
              Garanties
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden sm:inline-block text-xs uppercase tracking-wider font-semibold text-[#6E6A63] hover:text-[#181716] transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="text-xs uppercase tracking-wider font-semibold px-4 py-2.5 bg-[#181716] text-[#F7F5EE] hover:bg-stone-800 transition-colors shadow-2xs"
            >
              Essai 14 jours libre
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ─────────────────────────────────────────────────────────────
            2. HERO SECTION : BÉNÉFICE HUMAIN & PREUVE PRODUIT IMMÉDIATE
            Accessible dans le 1er viewport desktop (1440px) et mobile (390px)
        ───────────────────────────────────────────────────────────── */}
        <section className="pt-6 sm:pt-14 pb-12 sm:pb-16 px-6 lg:px-12 border-b border-[#181716]/10">
          <div className="max-w-7xl mx-auto">
            {/* Grille Asymétrique : Promesse humaine à gauche, Synthèse financière immédiate à droite */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
              {/* Colonne gauche : Promesse humaine (6 cols) */}
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#6E6A63]">
                  <span className="w-2 h-2 rounded-full bg-[#B45309]" />
                  Gestion locative indépendante · 1 à 10 logements
                </div>

                <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] leading-[1.12] text-[#181716] tracking-tight">
                  Vos locations tournent.
                  <br />
                  <span className="italic font-normal">
                    Vous savez simplement où elles en sont.
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-[#6E6A63] leading-relaxed max-w-xl font-normal">
                  Chaque début de mois, RentReady fait le point : ce qui est réglé
                  devient silencieux, ce qui attend votre attention est isolé.
                  Zéro tableur, zéro calcul d'arrondi, quittances prêtes dès le solde atteint.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#181716] text-[#F7F5EE] text-sm font-semibold tracking-wide hover:bg-stone-800 transition-all shadow-sm"
                  >
                    Démarrer l'essai 14 jours
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="#cycle-mensuel"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 border border-[#181716]/20 text-[#181716] text-sm font-semibold tracking-wide hover:bg-[#181716]/5 transition-colors"
                  >
                    Voir le cycle d'Octobre
                    <ChevronDown className="w-4 h-4 text-[#6E6A63]" />
                  </a>
                </div>

                {/* Micro-réassurances mesurées et sobres */}
                <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#6E6A63] font-mono">
                  <span>✓ Sans engagement</span>
                  <span>✓ 14 jours sans carte bancaire</span>
                  <span>✓ Serveurs en France</span>
                </div>
              </div>

              {/* Colonne droite : PREUVE PRODUIT IMMÉDIATE (Grand Livre d'Octobre 2026 sans carte fermée) */}
              <div className="lg:col-span-6 border-t-2 border-[#181716] pt-5 lg:pt-6">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-[#6E6A63]">
                      ARRÊTÉ DU CYCLE MENSUEL
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#181716]">
                      Octobre 2026
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 text-[11px] font-mono font-medium rounded-full bg-[#181716]/5 text-[#181716] border border-[#181716]/10">
                      Scénario de démonstration
                    </span>
                  </div>
                </div>

                {/* Tableau de bord financier ouvert (haute lisibilité financière) */}
                <div className="grid grid-cols-3 gap-4 py-4 border-y border-[#181716]/12">
                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-wider text-[#6E6A63] mb-1">
                      Attendus
                    </span>
                    <span className="font-mono text-xl sm:text-2xl font-semibold tabular-nums text-[#181716]">
                      {totalDue.toLocaleString("fr-FR")}&nbsp;€
                    </span>
                    <span className="block text-[11px] text-[#6E6A63] mt-0.5">
                      3 baux actifs
                    </span>
                  </div>

                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-wider text-[#6E6A63] mb-1">
                      Déjà reçus
                    </span>
                    <span className="font-mono text-xl sm:text-2xl font-semibold tabular-nums text-[#2D5A43]">
                      {totalReceived.toLocaleString("fr-FR")}&nbsp;€
                    </span>
                    <span className="block text-[11px] text-[#2D5A43] mt-0.5 font-medium">
                      {receivedPct}&nbsp;% perçus
                    </span>
                  </div>

                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-wider text-[#6E6A63] mb-1">
                      À régler
                    </span>
                    <span
                      className={`font-mono text-xl sm:text-2xl font-semibold tabular-nums ${
                        isNantesResolved ? "text-[#2D5A43]" : "text-[#B45309]"
                      }`}
                    >
                      {totalBalance.toLocaleString("fr-FR")}&nbsp;€
                    </span>
                    <span className="block text-[11px] text-[#6E6A63] mt-0.5">
                      {isNantesResolved ? "Tout est à jour" : "1 acompte en cours"}
                    </span>
                  </div>
                </div>

                {/* Synthèse immédiate scannable */}
                <div className="pt-4 flex items-center justify-between text-xs text-[#6E6A63]">
                  <span className="flex items-center gap-1.5 font-mono text-[11px]">
                    {isNantesResolved ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2D5A43]" />
                        <strong className="text-[#2D5A43] font-semibold">
                          3 logements réglés
                        </strong>{" "}
                        · 3 quittances conformes prêtes
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-[#B45309]" />
                        <strong className="text-[#181716] font-semibold">
                          2 logements réglés
                        </strong>{" "}
                        · 1 solde restant (Nantes 400&nbsp;€)
                      </>
                    )}
                  </span>
                  <a
                    href="#cycle-mensuel"
                    className="underline hover:text-[#181716] font-mono text-[11px]"
                  >
                    Voir le détail ↓
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            3. LE MOIS EN DIRECT : STRUCTURE NARRATIVE & LE CALME COMME ANIMATION
            Acte 1 (Ouverture) -> Acte 2 (Arrivée) -> Acte 3 (Exception) -> Acte 4 (Résolution)
        ───────────────────────────────────────────────────────────── */}
        <section
          id="cycle-mensuel"
          className="pt-16 pb-20 px-6 lg:px-12 border-b border-[#181716]/10 scroll-mt-16"
        >
          <div className="max-w-7xl mx-auto">
            {/* Chapeau narratif : La thèse centrale de RentReady */}
            <div className="max-w-3xl mb-12">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#6E6A63] block mb-2">
                LA MÉCANIQUE DU CALME · OCTOBRE 2026
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#181716] font-normal tracking-tight">
                Tout ce qui va bien devient silencieux.
                <br />
                <span className="italic font-semibold">
                  Seule l'exception demande votre attention.
                </span>
              </h2>
              <p className="mt-4 text-base text-[#6E6A63] leading-relaxed">
                Plutôt que d'empiler des tâches inutiles, RentReady range ce qui est réglé
                et isole précisément le logement qui nécessite une décision.
              </p>
            </div>

            {/* CONTRÔLE D'INTERACTION DU PROTOTYPE POUR LA CRÉATIVE REVIEW */}
            <div className="mb-8 p-4 bg-[#181716]/[0.03] border border-[#181716]/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#181716]">
                <Sparkles className="w-4 h-4 text-[#B45309]" />
                <span>
                  <strong>Prototype interactif :</strong> testez l'effet du règlement
                  sur le calme visuel de la page.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsNantesResolved(!isNantesResolved)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#181716] text-[#F7F5EE] text-xs font-mono font-medium hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {isNantesResolved
                  ? "Rétablir l'exception (Nantes 400 € restant)"
                  : "Résoudre l'exception (Marquer 400 € reçus)"}
              </button>
            </div>

            {/* FEUILLET COMPTABLE VIVANT : LES 3 LOGEMENTS */}
            <div className="border-t-2 border-[#181716]">
              {/* Entête de tableau ouvert */}
              <div className="hidden md:grid grid-cols-12 gap-4 py-3 border-b border-[#181716]/15 font-mono text-[11px] uppercase tracking-wider text-[#6E6A63]">
                <div className="col-span-4">Logement & Locataire</div>
                <div className="col-span-3">Ventilation du loyer</div>
                <div className="col-span-2 text-right">Règlement</div>
                <div className="col-span-3 text-right">État & Quittance</div>
              </div>

              {/* LIGNE 1 : PARIS (RÉGLÉ -> SILENCIEUX & EN RETRAIT) */}
              <div className="py-5 border-b border-[#181716]/10 grid grid-cols-1 md:grid-cols-12 gap-4 items-center transition-opacity duration-300 opacity-70 hover:opacity-100">
                <div className="md:col-span-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs text-[#6E6A63]">01</span>
                    <h3 className="font-medium text-base text-[#181716]">
                      Studio Rue Oberkampf · Paris 11e
                    </h3>
                  </div>
                  <span className="text-xs text-[#6E6A63] ml-6 block">
                    Locataire : Camille Laurent
                  </span>
                </div>

                <div className="md:col-span-3 text-xs text-[#6E6A63] font-mono">
                  <span>670&nbsp;€ nu + 80&nbsp;€ charges = </span>
                  <strong className="text-[#181716]">750,00&nbsp;€</strong>
                </div>

                <div className="md:col-span-2 md:text-right font-mono text-xs text-[#2D5A43]">
                  <span className="font-semibold tabular-nums">750,00&nbsp;€ reçu</span>
                  <span className="block text-[10px] text-[#6E6A63]">le 02 oct.</span>
                </div>

                <div className="md:col-span-3 md:text-right">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-[#2D5A43] bg-[#2D5A43]/10 border border-[#2D5A43]/20">
                    <Check className="w-3 h-3" />
                    Quittance #2026-10-01 prête
                  </span>
                </div>
              </div>

              {/* LIGNE 2 : LYON (RÉGLÉ -> SILENCIEUX & EN RETRAIT) */}
              <div className="py-5 border-b border-[#181716]/10 grid grid-cols-1 md:grid-cols-12 gap-4 items-center transition-opacity duration-300 opacity-70 hover:opacity-100">
                <div className="md:col-span-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs text-[#6E6A63]">02</span>
                    <h3 className="font-medium text-base text-[#181716]">
                      T3 Avenue Victor Hugo · Lyon 2e
                    </h3>
                  </div>
                  <span className="text-xs text-[#6E6A63] ml-6 block">
                    Locataire : Alexandre Mercier
                  </span>
                </div>

                <div className="md:col-span-3 text-xs text-[#6E6A63] font-mono">
                  <span>1 520&nbsp;€ nu + 180&nbsp;€ charges = </span>
                  <strong className="text-[#181716]">1 700,00&nbsp;€</strong>
                </div>

                <div className="md:col-span-2 md:text-right font-mono text-xs text-[#2D5A43]">
                  <span className="font-semibold tabular-nums">1 700,00&nbsp;€ reçu</span>
                  <span className="block text-[10px] text-[#6E6A63]">le 04 oct.</span>
                </div>

                <div className="md:col-span-3 md:text-right">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-[#2D5A43] bg-[#2D5A43]/10 border border-[#2D5A43]/20">
                    <Check className="w-3 h-3" />
                    Quittance #2026-10-02 prête
                  </span>
                </div>
              </div>

              {/* LIGNE 3 : NANTES — L'EXCEPTION CENTRALE QUI RETIENT L'ATTENTION */}
              <div
                className={`py-6 border-b border-[#181716]/15 grid grid-cols-1 md:grid-cols-12 gap-4 items-center transition-all duration-300 ${
                  isNantesResolved
                    ? "opacity-70 bg-transparent"
                    : "bg-[#B45309]/[0.05] -mx-4 px-4 sm:-mx-6 sm:px-6 border-l-4 border-l-[#B45309]"
                }`}
              >
                <div className="md:col-span-4">
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`font-mono text-xs ${
                        isNantesResolved ? "text-[#6E6A63]" : "text-[#B45309] font-bold"
                      }`}
                    >
                      03
                    </span>
                    <h3 className="font-bold text-base text-[#181716]">
                      T2 Rue de la République · Nantes
                    </h3>
                  </div>
                  <span className="text-xs text-[#6E6A63] ml-6 block">
                    Locataire : Éléonore Moreau
                  </span>
                </div>

                <div className="md:col-span-3 text-xs text-[#6E6A63] font-mono">
                  <span>700&nbsp;€ nu + 100&nbsp;€ charges = </span>
                  <strong className="text-[#181716]">800,00&nbsp;€</strong>
                </div>

                {/* État financier : Acompte 400 € ou Totalité 800 € */}
                <div className="md:col-span-2 md:text-right font-mono text-xs">
                  {isNantesResolved ? (
                    <div className="text-[#2D5A43]">
                      <span className="font-semibold tabular-nums">800,00&nbsp;€ reçu</span>
                      <span className="block text-[10px] text-[#6E6A63]">
                        Soldé le 07 oct.
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="font-semibold tabular-nums text-[#181716]">
                        400,00&nbsp;€ reçu
                      </span>
                      <span className="block text-[10px] text-[#B45309] font-bold">
                        Reste : 400,00&nbsp;€
                      </span>
                    </div>
                  )}
                </div>

                {/* Action humaine ou Titre conforme */}
                <div className="md:col-span-3 md:text-right">
                  {isNantesResolved ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-[#2D5A43] bg-[#2D5A43]/10 border border-[#2D5A43]/20">
                      <Check className="w-3 h-3" />
                      Quittance #2026-10-03 prête
                    </span>
                  ) : (
                    <div className="flex flex-col items-start md:items-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIsNantesResolved(true)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#181716] text-[#F7F5EE] text-xs font-semibold tracking-wide hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
                      >
                        Marquer les 400&nbsp;€ reçus
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] font-mono text-[#6E6A63]">
                        Reçu d'acompte émis (art. 21)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* BILAN APRÈS RÉSOLUTION : ÉTAT DE SÉRÉNITÉ TOTALE */}
            <div className="mt-8 pt-6 border-t border-[#181716]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#6E6A63] block">
                  STATUT D'OCTOBRE
                </span>
                <p className="font-serif text-lg text-[#181716] mt-0.5">
                  {isNantesResolved ? (
                    <span className="text-[#2D5A43] font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#2D5A43]" />
                      Octobre est entièrement réglé · Rien d'autre à faire.
                    </span>
                  ) : (
                    <span>
                      2 450&nbsp;€ encaissés sur 2 850&nbsp;€ ·{" "}
                      <strong className="text-[#B45309]">
                        Une seule action restante à Nantes.
                      </strong>
                    </span>
                  )}
                </p>
              </div>

              <div className="font-mono text-xs text-[#6E6A63] flex items-center gap-4">
                <span>3 quittances</span>
                <span>•</span>
                <span>0 calcul manuel</span>
                <span>•</span>
                <span>Historique intact</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            4. MÉMOIRE DU LOGEMENT (PROPERTY HOME BASE ÉDITORIALE)
            La conséquence naturelle : le logement garde son histoire sans grille de features
        ───────────────────────────────────────────────────────────── */}
        <section id="homebase" className="pt-16 pb-20 px-6 lg:px-12 border-b border-[#181716]/10">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl mb-12">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#6E6A63] block mb-2">
                LA HOME BASE DU BIEN
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#181716] font-normal tracking-tight">
                Chaque logement garde son histoire.
                <br />
                <span className="italic font-semibold">
                  Sans tableur à mettre à jour.
                </span>
              </h2>
              <p className="mt-4 text-base text-[#6E6A63] leading-relaxed">
                Le bail, les indexations de loyer, les virements reçus et les quittances
                sont rattachés au logement. Vous ne cherchez plus vos justificatifs en fin d'année.
              </p>
            </div>

            {/* Fiche éditoriale ouverte d'un bien (Studio Rue Oberkampf) */}
            <div className="border border-[#181716]/15 p-6 sm:p-8 bg-[#F7F5EE]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#181716]/12 pb-6">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#6E6A63]">
                    FICHE LOGEMENT
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#181716]">
                    Studio Rue Oberkampf · Paris 11e
                  </h3>
                  <span className="text-xs text-[#6E6A63] mt-0.5 block">
                    Bail d'habitation meublé · Prise d'effet : 01/09/2025
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono bg-[#2D5A43]/10 text-[#2D5A43] border border-[#2D5A43]/20">
                    <Check className="w-3.5 h-3.5" />
                    À jour (Octobre réglé)
                  </span>
                </div>
              </div>

              {/* 3 Colonnes Éditoriales du Logement */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
                {/* 1. Conditions Financières */}
                <div className="space-y-3 font-mono text-xs">
                  <span className="block text-[10px] uppercase tracking-wider text-[#6E6A63]">
                    01 · VENTILATION CONTRACTUELLE
                  </span>
                  <div className="space-y-1.5 text-[#181716]">
                    <div className="flex justify-between">
                      <span className="text-[#6E6A63]">Loyer nu :</span>
                      <span className="font-semibold tabular-nums">670,00&nbsp;€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6E6A63]">Provisions charges :</span>
                      <span className="font-semibold tabular-nums">80,00&nbsp;€</span>
                    </div>
                    <div className="flex justify-between border-t border-[#181716]/10 pt-1 font-bold">
                      <span>Total mensuel :</span>
                      <span className="tabular-nums">750,00&nbsp;€</span>
                    </div>
                  </div>
                </div>

                {/* 2. Locataire & Accès */}
                <div className="space-y-3 text-xs">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-[#6E6A63]">
                    02 · LOCATAIRE & ESPACE DIRECT
                  </span>
                  <div className="space-y-1">
                    <span className="font-bold text-[#181716] block">
                      Camille Laurent
                    </span>
                    <span className="text-[#6E6A63] block">
                      Espace locataire direct sans mot de passe
                    </span>
                    <span className="font-mono text-[11px] text-[#2D5A43] block pt-1">
                      Dernier accès : 02 oct. 2026
                    </span>
                  </div>
                </div>

                {/* 3. Registre des Quittances */}
                <div className="space-y-3 text-xs">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-[#6E6A63]">
                    03 · TITRES DÉLIVRÉS (12 DERNIERS MOIS)
                  </span>
                  <div className="space-y-1.5 font-mono text-[11px] text-[#6E6A63]">
                    <div className="flex justify-between text-[#181716]">
                      <span>Octobre 2026</span>
                      <span className="text-[#2D5A43]">✓ Quittance émise</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Septembre 2026</span>
                      <span>✓ Quittance émise</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Août 2026</span>
                      <span>✓ Quittance émise</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            5. PREUVE LÉGALE & INFRASTRUCTURE EN COUCHE SECONDAIRE SILENCIEUSE
            Le droit protège, il n'envahit pas la marque
        ───────────────────────────────────────────────────────────── */}
        <section id="preuve-legale" className="py-16 px-6 lg:px-12 bg-[#F1EFE8]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-[#6E6A63]">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#181716] font-bold block mb-2">
                  LOI DU 6 JUILLET 1989 (ART. 21)
                </span>
                <p className="leading-relaxed">
                  RentReady applique strictement la règle : en cas de paiement partiel,
                  seul un reçu d'acompte est émis. La quittance libératoire n'est générée
                  qu'au solde intégral de l'échéance.
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#181716] font-bold block mb-2">
                  CALCUL D'ARRONDI & VENTILATION
                </span>
                <p className="leading-relaxed">
                  Séparation contractuelle rigoureuse entre loyer nu et provisions sur
                  charges (décret n° 2015-587). Les centimes sont calculés sans dérive
                  d'approximation financière.
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#181716] font-bold block mb-2">
                  SOUVERAINETÉ & RÉSILIATION
                </span>
                <p className="leading-relaxed">
                  Données hébergées sur serveurs français (OVHcloud). Vos données vous
                  appartiennent et restent exportables. Résiliation libre sans période
                  d'engagement obligatoire.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            6. APPEL FINAL AU CALME
        ───────────────────────────────────────────────────────────── */}
        <section className="py-20 px-6 lg:px-12 text-center border-t border-[#181716]/10">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="font-serif text-3xl sm:text-5xl text-[#181716] font-normal tracking-tight">
              Passez votre premier mois au calme.
            </h2>
            <p className="text-base sm:text-lg text-[#6E6A63] max-w-xl mx-auto leading-relaxed">
              Ajoutez votre premier logement en 2 minutes. RentReady structure vos loyers
              dès l'ouverture du mois.
            </p>
            <div className="pt-2">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#181716] text-[#F7F5EE] text-sm font-semibold tracking-wide hover:bg-stone-800 transition-all shadow-sm"
              >
                Démarrer l'essai 14 jours libre
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="font-mono text-xs text-[#6E6A63]">
              Sans carte bancaire requise · Prêt pour votre prochain relevé
            </p>
          </div>
        </section>
      </main>

      {/* FOOTER MINIMAL */}
      <footer className="border-t border-[#181716]/10 px-6 lg:px-12 py-8 bg-[#F7F5EE] text-xs font-mono text-[#6E6A63]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="font-serif font-bold italic text-[#181716]">RentReady</span>
            <span>— L'intendance sereine de votre patrimoine locatif</span>
          </div>
          <div>
            <span>© 2026 RentReady · Direction B+ (Editorial Monthly Ledger)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
