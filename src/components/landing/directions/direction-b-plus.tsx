"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  Building2,
  ChevronRight,
  Download,
  ShieldCheck,
  Calendar,
  Lock,
  Layers,
  ArrowUpRight,
} from "lucide-react";

/**
 * DIRECTION B+ V2 : « EDITORIAL SOFTWARE »
 *
 * Évolution majeure par rapport à B+ V1 :
 * 1. EDITORIAL SOFTWARE : Passe d'un document administratif/PDF à un logiciel contemporain haut de gamme.
 *    Surfaces en retrait (inset paper #F1EEE4), encadrements hairlines précis, boutons tactiles nets.
 * 2. COMPOSITION UNIFIÉE HERO : Le headline éditorial et le Grand Livre d'Octobre 2026 s'articulent autour
 *    d'une signature temporelle commune (OCTOBRE 2026 · JOUR 07 / 31).
 * 3. DONNÉE FINANCIÈRE MAGNIFIÉE : Chiffres 2 850 €, 2 450 €, 400 € / 0 € traités comme matière graphique
 *    centrale (grand corps, tabular-nums, alignement baseline, contraste sémantique mesuré).
 * 4. SIGNATURE NARRATIVE « SILENCE VISUEL » :
 *    - Paris et Lyon (réglés) = 1 unité d'attention (silencieux, feutrés, compacts).
 *    - Nantes (exception 400 €) = 3 unités d'attention (fond ambré doux, bordure terracotta, action directe).
 *    - Résolution : L'ambré DISPARAÎT ENTIÈREMENT. Nantes rejoint le calme. Tout le système s'apaise.
 * 5. HOME BASE VIVANTE : Le logement (Studio Rue Oberkampf) devient un objet produit tangible
 *    (timeline des mois écoulés, documents vivants téléchargeables, capsule locataire).
 * 6. MOBILE 390px RÉINVENTÉ : Premier viewport (< 850px) intégrant headline, CTA et baromètre financier.
 *    Typo mono drastiquement réduite aux seules données chiffrées/dates.
 * 7. PRODUCT TRUTH : Suppression des slogans artificiels ("en 2 minutes", limitation "1 à 10", etc.).
 */
export function DirectionBPlus({
  initialResolved = false,
}: {
  initialResolved?: boolean;
}) {
  const [isNantesResolved, setIsNantesResolved] = useState(initialResolved);
  const [activeTabHomebase, setActiveTabHomebase] = useState<"apercu" | "loyers" | "documents">("apercu");

  // Totaux calculés du mois
  const totalDue = 2850;
  const totalReceived = isNantesResolved ? 2850 : 2450;
  const totalBalance = isNantesResolved ? 0 : 400;
  const receivedPct = isNantesResolved ? 100 : 86;

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#151413] font-sans selection:bg-[#151413] selection:text-[#F8F6F0]">
      {/* ─────────────────────────────────────────────────────────────
          1. NAVIGATION ÉDITORIALE ÉPURÉE & SÉLECTEUR D'ÉTAT DU PROTOTYPE
      ───────────────────────────────────────────────────────────── */}
      <header className="relative z-40 bg-[#F8F6F0] border-b border-[#151413]/10 px-5 sm:px-8 lg:px-12 py-3.5 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-3 sm:gap-4">
            <span className="font-serif text-2xl sm:text-[1.65rem] tracking-tight font-semibold italic text-[#151413]">
              RentReady
            </span>
            <span className="hidden md:inline-block text-[11px] uppercase tracking-widest text-[#6B6760] border-l border-[#151413]/15 pl-3">
              Le grand livre mensuel
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-7 text-xs font-medium tracking-wide text-[#6B6760]">
            <a href="#cycle-mensuel" className="hover:text-[#151413] transition-colors">
              Le cycle d'Octobre
            </a>
            <a href="#homebase" className="hover:text-[#151413] transition-colors">
              Mémoire du logement
            </a>
            <a href="#preuve-legale" className="hover:text-[#151413] transition-colors">
              Règles légales & garanties
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Contrôle de simulation discret intégré au design (pas de bandeau d'alerte) */}
            <div className="hidden sm:inline-flex items-center p-0.5 bg-[#EDEAE0] border border-[#151413]/12 text-[11px] font-sans">
              <button
                type="button"
                onClick={() => setIsNantesResolved(false)}
                className={`px-2.5 py-1 transition-all ${
                  !isNantesResolved
                    ? "bg-[#151413] text-[#F8F6F0] font-medium shadow-2xs"
                    : "text-[#6B6760] hover:text-[#151413]"
                }`}
              >
                Exception active (400&nbsp;€)
              </button>
              <button
                type="button"
                onClick={() => setIsNantesResolved(true)}
                className={`px-2.5 py-1 transition-all ${
                  isNantesResolved
                    ? "bg-[#22543D] text-[#F8F6F0] font-medium shadow-2xs"
                    : "text-[#6B6760] hover:text-[#151413]"
                }`}
              >
                Mois apaisé (0&nbsp;€)
              </button>
            </div>

            <Link
              href="/register"
              className="text-xs uppercase tracking-wider font-semibold px-4 py-2 bg-[#151413] text-[#F8F6F0] hover:bg-stone-800 transition-colors shadow-2xs"
            >
              Essai libre
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ─────────────────────────────────────────────────────────────
            2. HERO SECTION : COMPOSITION UNIFIÉE & MATÉRIAU TEMPOREL
            Le mois entre directement dans la composition
        ───────────────────────────────────────────────────────────── */}
        <section className="pt-5 sm:pt-10 pb-10 sm:pb-16 px-5 sm:px-8 lg:px-12 border-b border-[#151413]/10">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
            {/* Ruban Temporel Architectural (Le Mois comme colonne vertébrale) */}
            <div className="border border-[#151413]/12 bg-[#F1EEE4] px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] tracking-widest uppercase font-bold text-[#151413]">
                  OCTOBRE 2026
                </span>
                <span className="text-[#151413]/20">|</span>
                <span className="text-[#6B6760] text-[11px]">
                  Échéance mensuelle · Arrêté au 07 octobre
                </span>
              </div>

              {/* Abstraction temporelle : timeline 01 ── 31 */}
              <div className="hidden md:flex items-center gap-3 font-mono text-[10px] text-[#6B6760]">
                <span>01 OCT</span>
                <div className="w-28 h-px bg-[#151413]/20 relative">
                  <div className="absolute left-[22%] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#151413]" />
                </div>
                <span>31 OCT</span>
                <span className="text-[#151413]/30">·</span>
                <span className="text-[#151413] font-medium">3 baux sous gestion</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-block w-2 h-2 rounded-full transition-colors ${
                    isNantesResolved ? "bg-[#22543D]" : "bg-[#C2410C] animate-pulse"
                  }`}
                />
                <span
                  className={`text-[11px] font-medium ${
                    isNantesResolved ? "text-[#22543D]" : "text-[#C2410C]"
                  }`}
                >
                  {isNantesResolved
                    ? "Cycle apaisé · 100 % perçus"
                    : "1 attention requise (Nantes)"}
                </span>
              </div>
            </div>

            {/* Grille Asymétrique : Promesse éditoriale à gauche, Logiciel vivant à droite */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Colonne gauche (5 colonnes) : Positionnement & Promesse */}
              <div className="lg:col-span-5 space-y-4 sm:space-y-5">
                <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#6B6760] font-medium">
                  Gestion locative directe · Bailleurs indépendants
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl lg:text-[3.15rem] leading-[1.12] text-[#151413] tracking-tight">
                  Vos locations tournent.
                  <br />
                  <span className="italic font-normal">
                    Vous savez simplement où elles en sont.
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-[#6B6760] leading-relaxed max-w-lg">
                  RentReady suit les encaissements, prépare les quittances dès le solde
                  atteint et isole ce qui demande votre attention. Le reste ne vous dérange pas.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#151413] text-[#F8F6F0] text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 transition-all shadow-2xs"
                  >
                    Démarrer l'essai 14 jours
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <a
                    href="#cycle-mensuel"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 border border-[#151413]/20 text-[#151413] text-xs uppercase tracking-wider font-semibold hover:bg-[#151413]/5 transition-colors"
                  >
                    Voir la mécanique ↓
                  </a>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-[#6B6760]">
                  <span>✓ 14 jours sans carte bancaire</span>
                  <span>✓ Sans engagement</span>
                  <span>✓ Données exportables</span>
                </div>
              </div>

              {/* Colonne droite (7 colonnes) : L'OBJET LOGICIEL GRAND LIVRE */}
              <div className="lg:col-span-7 bg-[#F1EEE4] border border-[#151413]/15 p-5 sm:p-7 shadow-xs relative">
                {/* En-tête du grand livre */}
                <div className="flex items-baseline justify-between border-b border-[#151413]/12 pb-3 mb-5">
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-[#6B6760] font-medium">
                      RELEVÉ D'ENCAISSEMENT
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#151413]">
                      Grand Livre · Octobre 2026
                    </h2>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border transition-colors ${
                        isNantesResolved
                          ? "bg-[#22543D]/10 text-[#22543D] border-[#22543D]/25"
                          : "bg-[#C2410C]/10 text-[#C2410C] border-[#C2410C]/25"
                      }`}
                    >
                      {isNantesResolved ? (
                        <>
                          <Check className="w-3 h-3" />
                          3 / 3 baux soldés
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C]" />
                          1 solde en attente
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* 3 DONNÉES FINANCIÈRES MAJEURES (Typographie financière ciselée) */}
                <div className="grid grid-cols-3 gap-3 sm:gap-6 py-2 border-b border-[#151413]/12 pb-6">
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-[#6B6760] font-medium mb-1">
                      Attendus
                    </span>
                    <div className="font-mono text-2xl sm:text-3xl lg:text-[2.1rem] font-semibold tracking-tight tabular-nums text-[#151413] leading-none">
                      {totalDue.toLocaleString("fr-FR")}&nbsp;<span className="text-sm font-normal text-[#6B6760]">€</span>
                    </div>
                    <span className="block text-[11px] text-[#6B6760] mt-1.5">
                      3 baux actifs
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-[#6B6760] font-medium mb-1">
                      Déjà perçus
                    </span>
                    <div className="font-mono text-2xl sm:text-3xl lg:text-[2.1rem] font-semibold tracking-tight tabular-nums text-[#22543D] leading-none">
                      {totalReceived.toLocaleString("fr-FR")}&nbsp;<span className="text-sm font-normal text-[#22543D]/80">€</span>
                    </div>
                    <span className="block text-[11px] text-[#22543D] mt-1.5 font-medium">
                      {receivedPct}&nbsp;% perçus
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-[#6B6760] font-medium mb-1">
                      Reste à percevoir
                    </span>
                    <div
                      className={`font-mono text-2xl sm:text-3xl lg:text-[2.1rem] font-semibold tracking-tight tabular-nums leading-none transition-colors ${
                        isNantesResolved ? "text-[#22543D]" : "text-[#C2410C]"
                      }`}
                    >
                      {totalBalance.toLocaleString("fr-FR")}&nbsp;<span className="text-sm font-normal opacity-80">€</span>
                    </div>
                    <span className="block text-[11px] text-[#6B6760] mt-1.5">
                      {isNantesResolved ? "Mois clos" : "Nantes (solde 400 €)"}
                    </span>
                  </div>
                </div>

                {/* Micro-aperçu vivant des 3 baux au sein du Hero */}
                <div className="pt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs py-1 text-[#6B6760]">
                    <span className="font-medium text-[#151413]">Paris 11e · Camille Laurent</span>
                    <span className="font-mono text-[#22543D] flex items-center gap-1">
                      <Check className="w-3 h-3" /> 750,00 € réglé
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-1 text-[#6B6760]">
                    <span className="font-medium text-[#151413]">Lyon 2e · Alexandre Mercier</span>
                    <span className="font-mono text-[#22543D] flex items-center gap-1">
                      <Check className="w-3 h-3" /> 1 700,00 € réglé
                    </span>
                  </div>

                  <div
                    className={`flex items-center justify-between text-xs py-1.5 px-2.5 transition-all ${
                      isNantesResolved
                        ? "text-[#6B6760] bg-transparent"
                        : "bg-[#C2410C]/8 text-[#151413] border-l-2 border-[#C2410C]"
                    }`}
                  >
                    <span className="font-medium">
                      Nantes · Éléonore Moreau
                    </span>
                    {isNantesResolved ? (
                      <span className="font-mono text-[#22543D] flex items-center gap-1">
                        <Check className="w-3 h-3" /> 800,00 € soldé
                      </span>
                    ) : (
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-[#C2410C] font-semibold">
                          400 € restant
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsNantesResolved(true)}
                          className="px-2 py-0.5 bg-[#151413] text-[#F8F6F0] text-[10px] font-sans font-semibold uppercase tracking-wider hover:bg-stone-800 transition-colors"
                        >
                          Pointer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            3. ACTE CENTRAL : LE SILENCE VISUEL & LA RÉSOLUTION DU MOIS
            « Tout ce qui va bien devient silencieux.
              Seule l'exception demande votre attention. »
        ───────────────────────────────────────────────────────────── */}
        <section
          id="cycle-mensuel"
          className="pt-14 sm:pt-20 pb-16 sm:pb-24 px-5 sm:px-8 lg:px-12 border-b border-[#151413]/10 scroll-mt-12"
        >
          <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
            {/* Chapeau conceptuel fort */}
            <div className="max-w-3xl">
              <span className="text-[11px] uppercase tracking-widest text-[#6B6760] font-semibold block mb-2">
                LA RÈGLE DU SILENCE VISUEL · OCTOBRE 2026
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl lg:text-[2.6rem] text-[#151413] font-normal tracking-tight leading-tight">
                Tout ce qui va bien devient silencieux.
                <br />
                <span className="italic font-semibold">
                  Seule l'exception demande votre attention.
                </span>
              </h2>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-[#6B6760] leading-relaxed">
                Quand un loyer arrive, RentReady génère la quittance conforme et range la ligne.
                Quand un virement est partiel, le système isole la différence pour vous permettre
                d'agir en un clic.
              </p>
            </div>

            {/* LE FEUILLET INTERACTIF ÉDITORIAL (3 Niveaux d'attention) */}
            <div className="border border-[#151413]/15 bg-[#FDFBF7]">
              {/* En-tête des colonnes (Desktop) */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#151413]/12 text-[11px] uppercase tracking-wider text-[#6B6760] font-medium bg-[#F5F2EA]">
                <div className="col-span-4">Logement & Bail</div>
                <div className="col-span-3">Ventilation contractuelle</div>
                <div className="col-span-2 text-right">Mouvement bancaire</div>
                <div className="col-span-3 text-right">Statut & Quittance</div>
              </div>

              {/* LIGNE 1 : PARIS (RÉGLÉ · 1 UNITÉ D'ATTENTION · SILENCIEUX & FEUTRÉ) */}
              <div className="px-5 sm:px-6 py-4 border-b border-[#151413]/10 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center bg-[#FDFBF7] text-[#151413]/85 transition-opacity duration-300">
                <div className="md:col-span-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs text-[#6B6760]">01</span>
                    <h3 className="font-medium text-sm sm:text-base text-[#151413]">
                      Studio Rue Oberkampf · Paris 11e
                    </h3>
                  </div>
                  <span className="text-xs text-[#6B6760] ml-6 block mt-0.5">
                    Locataire : Camille Laurent
                  </span>
                </div>

                <div className="md:col-span-3 text-xs text-[#6B6760]">
                  <span>670&nbsp;€ nu + 80&nbsp;€ charges = </span>
                  <strong className="font-mono text-[#151413]">750,00&nbsp;€</strong>
                </div>

                <div className="md:col-span-2 md:text-right text-xs">
                  <span className="font-mono font-semibold text-[#22543D]">
                    750,00&nbsp;€ reçu
                  </span>
                  <span className="block text-[11px] text-[#6B6760]">le 02 oct.</span>
                </div>

                <div className="md:col-span-3 md:text-right">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#22543D] bg-[#22543D]/10 border border-[#22543D]/20">
                    <Check className="w-3 h-3" />
                    Quittance #2026-10-01 prête
                  </span>
                </div>
              </div>

              {/* LIGNE 2 : LYON (RÉGLÉ · 1 UNITÉ D'ATTENTION · SILENCIEUX & FEUTRÉ) */}
              <div className="px-5 sm:px-6 py-4 border-b border-[#151413]/10 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center bg-[#FDFBF7] text-[#151413]/85 transition-opacity duration-300">
                <div className="md:col-span-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs text-[#6B6760]">02</span>
                    <h3 className="font-medium text-sm sm:text-base text-[#151413]">
                      T3 Avenue Victor Hugo · Lyon 2e
                    </h3>
                  </div>
                  <span className="text-xs text-[#6B6760] ml-6 block mt-0.5">
                    Locataire : Alexandre Mercier
                  </span>
                </div>

                <div className="md:col-span-3 text-xs text-[#6B6760]">
                  <span>1 520&nbsp;€ nu + 180&nbsp;€ charges = </span>
                  <strong className="font-mono text-[#151413]">1 700,00&nbsp;€</strong>
                </div>

                <div className="md:col-span-2 md:text-right text-xs">
                  <span className="font-mono font-semibold text-[#22543D]">
                    1 700,00&nbsp;€ reçu
                  </span>
                  <span className="block text-[11px] text-[#6B6760]">le 04 oct.</span>
                </div>

                <div className="md:col-span-3 md:text-right">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#22543D] bg-[#22543D]/10 border border-[#22543D]/20">
                    <Check className="w-3 h-3" />
                    Quittance #2026-10-02 prête
                  </span>
                </div>
              </div>

              {/* LIGNE 3 : NANTES — L'EXCEPTION CENTRALE QUI PREND 3 UNITÉS D'ATTENTION */}
              <div
                className={`transition-all duration-500 ${
                  isNantesResolved
                    ? "px-5 sm:px-6 py-4 border-b border-[#151413]/10 bg-[#FDFBF7] text-[#151413]/85"
                    : "p-5 sm:p-6 bg-[#FFFDF9] border-y-2 border-l-4 border-l-[#C2410C] border-y-[#C2410C]/30 my-0 shadow-sm"
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center">
                  <div className="md:col-span-4">
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`font-mono text-xs font-bold ${
                          isNantesResolved ? "text-[#6B6760]" : "text-[#C2410C]"
                        }`}
                      >
                        03
                      </span>
                      <h3
                        className={`text-sm sm:text-base font-semibold ${
                          isNantesResolved ? "text-[#151413]" : "text-[#151413]"
                        }`}
                      >
                        T2 Rue de la République · Nantes
                      </h3>
                    </div>
                    <span className="text-xs text-[#6B6760] ml-6 block mt-0.5">
                      Locataire : Éléonore Moreau
                    </span>
                    {!isNantesResolved && (
                      <div className="ml-6 mt-1.5">
                        <span className="inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#C2410C]/12 text-[#9A3412] font-semibold border border-[#C2410C]/20">
                          Attention requise · Acompte reçu
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-3 text-xs text-[#6B6760]">
                    <span>700&nbsp;€ nu + 100&nbsp;€ charges = </span>
                    <strong className="font-mono text-[#151413]">800,00&nbsp;€</strong>
                    {!isNantesResolved && (
                      <span className="block text-[11px] text-[#9A3412] mt-1">
                        400&nbsp;€ perçus le 03 oct. (Reçu d'acompte émis)
                      </span>
                    )}
                  </div>

                  {/* État financier : Solde ou Totalité */}
                  <div className="md:col-span-2 md:text-right text-xs">
                    {isNantesResolved ? (
                      <div>
                        <span className="font-mono font-semibold text-[#22543D]">
                          800,00&nbsp;€ reçu
                        </span>
                        <span className="block text-[11px] text-[#6B6760]">
                          Soldé le 07 oct.
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="font-mono text-sm font-bold text-[#C2410C]">
                          400,00&nbsp;€ restant
                        </span>
                        <span className="block text-[10px] text-[#6B6760]">
                          sur 800,00&nbsp;€ dus
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action directe ou Quittance libérée */}
                  <div className="md:col-span-3 md:text-right">
                    {isNantesResolved ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#22543D] bg-[#22543D]/10 border border-[#22543D]/20">
                        <Check className="w-3 h-3" />
                        Quittance #2026-10-03 prête
                      </span>
                    ) : (
                      <div className="flex flex-col items-start md:items-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setIsNantesResolved(true)}
                          className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#151413] text-[#F8F6F0] text-xs font-semibold tracking-wide hover:bg-stone-800 transition-all shadow-xs cursor-pointer active:scale-[0.98]"
                        >
                          Marquer les 400&nbsp;€ reçus
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] text-[#6B6760]">
                          Pas de quittance libératoire avant solde
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* BARRE DE CLÔTURE DU MOIS : LE CALME TOTAL APRÈS ACTION */}
              <div
                className={`p-5 sm:p-6 transition-colors duration-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isNantesResolved
                    ? "bg-[#F3EFE6] text-[#22543D]"
                    : "bg-[#F7F4EB] text-[#151413]"
                }`}
              >
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#6B6760] font-semibold block">
                    BILAN DU MOIS D'OCTOBRE
                  </span>
                  <div className="font-serif text-base sm:text-lg mt-0.5 font-normal">
                    {isNantesResolved ? (
                      <div className="flex items-center gap-2 text-[#22543D] font-medium">
                        <CheckCircle2 className="w-5 h-5 text-[#22543D]" />
                        <span>
                          Octobre est entièrement réglé (2 850&nbsp;€ perçus) · Vos 3 quittances sont prêtes.
                        </span>
                      </div>
                    ) : (
                      <span className="text-[#151413]">
                        2 450&nbsp;€ encaissés sur 2 850&nbsp;€ ·{" "}
                        <strong className="text-[#9A3412]">
                          Une seule action attend votre confirmation à Nantes.
                        </strong>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  {isNantesResolved && (
                    <button
                      type="button"
                      onClick={() => setIsNantesResolved(false)}
                      className="text-xs underline text-[#6B6760] hover:text-[#151413] transition-colors"
                    >
                      Rejouer la démonstration
                    </button>
                  )}
                  <span className="text-xs text-[#6B6760]">
                    Conforme loi du 6 juillet 1989
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            4. ACTE 3 : LA HOME BASE VIVANTE (MÉMOIRE DU LOGEMENT)
            Un objet logiciel architectural, tangible et désirable
        ───────────────────────────────────────────────────────────── */}
        <section
          id="homebase"
          className="pt-14 sm:pt-20 pb-16 sm:pb-24 px-5 sm:px-8 lg:px-12 border-b border-[#151413]/10"
        >
          <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
            <div className="max-w-2xl">
              <span className="text-[11px] uppercase tracking-widest text-[#6B6760] font-semibold block mb-2">
                LA HOME BASE DU LOGEMENT
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#151413] font-normal tracking-tight">
                Chaque logement garde son histoire.
                <br />
                <span className="italic font-semibold">
                  Sans classeur ni tableur dispersé.
                </span>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#6B6760] leading-relaxed">
                Le bail, les indexations de loyer, les virements reçus et les quittances
                restent attachés au bien. Vous retrouvez chaque justificatif en un clic.
              </p>
            </div>

            {/* L'OBJET LOGICIEL : FICHE TANGIBLE DU STUDIO OBERKAMPF */}
            <div className="border border-[#151413]/15 bg-[#F2EFE7] shadow-xs">
              {/* Barre supérieure de l'objet logiciel avec onglets */}
              <div className="border-b border-[#151413]/12 px-5 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4 bg-[#EDE8DC]">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#22543D]" />
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#151413]">
                    Studio Rue Oberkampf · Paris 11e
                  </h3>
                  <span className="text-xs text-[#6B6760]">
                    (32 m² · Meublé)
                  </span>
                </div>

                {/* Onglets tactiles de navigation dans le bien */}
                <div className="flex items-center gap-1 bg-[#F8F6F0] p-1 border border-[#151413]/10 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setActiveTabHomebase("apercu")}
                    className={`px-3 py-1 transition-all ${
                      activeTabHomebase === "apercu"
                        ? "bg-[#151413] text-[#F8F6F0] shadow-2xs"
                        : "text-[#6B6760] hover:text-[#151413]"
                    }`}
                  >
                    Fiche & Bail
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTabHomebase("loyers")}
                    className={`px-3 py-1 transition-all ${
                      activeTabHomebase === "loyers"
                        ? "bg-[#151413] text-[#F8F6F0] shadow-2xs"
                        : "text-[#6B6760] hover:text-[#151413]"
                    }`}
                  >
                    Historique des loyers
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTabHomebase("documents")}
                    className={`px-3 py-1 transition-all ${
                      activeTabHomebase === "documents"
                        ? "bg-[#151413] text-[#F8F6F0] shadow-2xs"
                        : "text-[#6B6760] hover:text-[#151413]"
                    }`}
                  >
                    Documents (3)
                  </button>
                </div>
              </div>

              {/* Corps de l'objet logiciel */}
              <div className="p-5 sm:p-8">
                {activeTabHomebase === "apercu" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {/* Colonne 1 : Données du bail en cours */}
                    <div className="space-y-3 bg-[#FAF8F3] p-5 border border-[#151413]/10">
                      <span className="block text-[10px] uppercase tracking-wider text-[#6B6760] font-semibold">
                        CONDITIONS DU BAIL
                      </span>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-[#6B6760]">Loyer nu :</span>
                          <span className="font-mono font-semibold text-[#151413]">670,00&nbsp;€</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6B6760]">Charges forfaitaires :</span>
                          <span className="font-mono font-semibold text-[#151413]">80,00&nbsp;€</span>
                        </div>
                        <div className="flex justify-between border-t border-[#151413]/10 pt-1.5 font-medium">
                          <span>Total mensuel :</span>
                          <span className="font-mono font-bold text-[#151413]">750,00&nbsp;€</span>
                        </div>
                        <div className="flex justify-between pt-1 text-[11px] text-[#6B6760]">
                          <span>Dépôt de garantie :</span>
                          <span className="font-mono">1 340,00&nbsp;€</span>
                        </div>
                      </div>
                    </div>

                    {/* Colonne 2 : Locataire & Contact */}
                    <div className="space-y-3 bg-[#FAF8F3] p-5 border border-[#151413]/10">
                      <span className="block text-[10px] uppercase tracking-wider text-[#6B6760] font-semibold">
                        LOCATAIRE EN PLACE
                      </span>
                      <div className="space-y-1.5 text-xs">
                        <span className="font-bold text-sm text-[#151413] block">
                          Camille Laurent
                        </span>
                        <span className="text-[#6B6760] block text-[11px]">
                          Prise d'effet : 01 septembre 2025 (Bail meublé 1 an)
                        </span>
                        <div className="pt-2">
                          <span className="inline-flex items-center gap-1.5 text-[11px] text-[#22543D] font-medium bg-[#22543D]/10 px-2.5 py-1 border border-[#22543D]/20">
                            <Check className="w-3 h-3" />
                            Espace locataire activé
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Colonne 3 : Régularité des 4 derniers mois */}
                    <div className="space-y-3 bg-[#FAF8F3] p-5 border border-[#151413]/10">
                      <span className="block text-[10px] uppercase tracking-wider text-[#6B6760] font-semibold">
                        RUBAN DES MOIS ÉCOULÉS
                      </span>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center text-[#22543D]">
                          <span>Octobre 2026</span>
                          <span className="font-mono font-medium">750 € · ✓ Réglé (02/10)</span>
                        </div>
                        <div className="flex justify-between items-center text-[#6B6760]">
                          <span>Septembre 2026</span>
                          <span className="font-mono">750 € · ✓ Réglé (03/09)</span>
                        </div>
                        <div className="flex justify-between items-center text-[#6B6760]">
                          <span>Août 2026</span>
                          <span className="font-mono">750 € · ✓ Réglé (02/08)</span>
                        </div>
                        <div className="flex justify-between items-center text-[#6B6760]">
                          <span>Juillet 2026</span>
                          <span className="font-mono">750 € · ✓ Réglé (04/07)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTabHomebase === "loyers" && (
                  <div className="bg-[#FAF8F3] p-5 border border-[#151413]/10 space-y-3">
                    <span className="block text-[10px] uppercase tracking-wider text-[#6B6760] font-semibold">
                      CHRONOLOGIE DES RÈGLEMENTS DEPUIS LA PRISE D'EFFET
                    </span>
                    <div className="divide-y divide-[#151413]/10 text-xs">
                      <div className="py-2.5 flex justify-between items-center">
                        <div>
                          <strong className="text-[#151413]">Échéance 10/2026 :</strong> Virement bancaire reçu
                        </div>
                        <div className="font-mono text-[#22543D] font-medium">
                          750,00 € perçu le 02/10/2026
                        </div>
                      </div>
                      <div className="py-2.5 flex justify-between items-center">
                        <div>
                          <strong className="text-[#151413]">Échéance 09/2026 :</strong> Virement bancaire reçu
                        </div>
                        <div className="font-mono text-[#22543D] font-medium">
                          750,00 € perçu le 03/09/2026
                        </div>
                      </div>
                      <div className="py-2.5 flex justify-between items-center">
                        <div>
                          <strong className="text-[#151413]">Échéance 08/2026 :</strong> Virement bancaire reçu
                        </div>
                        <div className="font-mono text-[#22543D] font-medium">
                          750,00 € perçu le 02/08/2026
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTabHomebase === "documents" && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-[#FAF8F3] border border-[#151413]/10 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#151413] mb-1">
                          <FileText className="w-4 h-4 text-[#6B6760]" />
                          Bail_Meuble_Signe.pdf
                        </div>
                        <span className="text-[11px] text-[#6B6760] block">
                          Contrat type loi ALUR signé
                        </span>
                      </div>
                      <span className="mt-3 text-[11px] text-[#151413] underline font-medium inline-flex items-center gap-1 cursor-pointer">
                        <Download className="w-3 h-3" /> Télécharger
                      </span>
                    </div>

                    <div className="p-4 bg-[#FAF8F3] border border-[#151413]/10 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#151413] mb-1">
                          <FileText className="w-4 h-4 text-[#6B6760]" />
                          Etat_Lieux_Entree.pdf
                        </div>
                        <span className="text-[11px] text-[#6B6760] block">
                          Annexe 14 photos d'inventaire
                        </span>
                      </div>
                      <span className="mt-3 text-[11px] text-[#151413] underline font-medium inline-flex items-center gap-1 cursor-pointer">
                        <Download className="w-3 h-3" /> Télécharger
                      </span>
                    </div>

                    <div className="p-4 bg-[#FAF8F3] border border-[#151413]/10 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#151413] mb-1">
                          <FileText className="w-4 h-4 text-[#22543D]" />
                          Quittance_Octobre_2026.pdf
                        </div>
                        <span className="text-[11px] text-[#6B6760] block">
                          Émise le 02/10/2026 · Conforme art. 21
                        </span>
                      </div>
                      <span className="mt-3 text-[11px] text-[#22543D] underline font-medium inline-flex items-center gap-1 cursor-pointer">
                        <Download className="w-3 h-3" /> Télécharger
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            5. ACTE 4 : FONDATIONS & RESPECT LÉGAL (SILENCIEUX MAIS INÉBRANLABLE)
            Le droit protège, il n'envahit pas
        ───────────────────────────────────────────────────────────── */}
        <section id="preuve-legale" className="py-14 sm:py-18 px-5 sm:px-8 lg:px-12 bg-[#EDEAE0]">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="border-b border-[#151413]/12 pb-4">
              <span className="text-[10px] uppercase tracking-widest text-[#6B6760] font-semibold block mb-1">
                FONDATIONS JURIDIQUES & TECHNIQUES
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#151413]">
                Les trois garanties inviolables de RentReady
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-xs text-[#6B6760] leading-relaxed">
              <div className="space-y-2">
                <span className="font-bold text-[#151413] block text-sm">
                  1. Loi du 6 juillet 1989 (art. 21)
                </span>
                <p>
                  En cas de versement partiel, seul un reçu d'acompte est généré. La quittance
                  libératoire de loyer n'est délivrée qu'au règlement intégral de l'échéance.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-[#151413] block text-sm">
                  2. Calculs au centime d'euro
                </span>
                <p>
                  Ventilation stricte entre loyer nu et charges locatives. Zéro dérive d'arrondi
                  sur vos baux, vos révisions d'indice IRL et vos soldes de fin d'année.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-[#151413] block text-sm">
                  3. Données souveraines et exportables
                </span>
                <p>
                  Infrastructure hébergée en France chez OVHcloud. Vos données et quittances
                  vous appartiennent, sans période d'engagement obligatoire ni enfermement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            6. APPEL FINAL AU CALME
        ───────────────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-24 px-5 sm:px-8 lg:px-12 text-center border-t border-[#151413]/10">
          <div className="max-w-2xl mx-auto space-y-5 sm:space-y-6">
            <h2 className="font-serif text-3xl sm:text-5xl text-[#151413] font-normal tracking-tight">
              Passez votre prochain mois au calme.
            </h2>
            <p className="text-sm sm:text-base text-[#6B6760] max-w-lg mx-auto leading-relaxed">
              Ajoutez votre premier bien et laissez RentReady cadrer vos encaissements
              dès l'ouverture du mois prochain.
            </p>
            <div className="pt-2">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#151413] text-[#F8F6F0] text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 transition-all shadow-xs"
              >
                Démarrer l'essai 14 jours libre
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <p className="text-xs text-[#6B6760]">
              14 jours sans carte bancaire · Sans engagement
            </p>
          </div>
        </section>
      </main>

      {/* FOOTER SOBRE */}
      <footer className="border-t border-[#151413]/10 px-5 sm:px-8 lg:px-12 py-7 bg-[#F8F6F0] text-xs text-[#6B6760]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="font-serif font-bold italic text-[#151413] text-sm">RentReady</span>
            <span>— Gestion locative sereine pour bailleurs indépendants</span>
          </div>
          <div>
            <span>Direction B+ V2 (Editorial Software)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
