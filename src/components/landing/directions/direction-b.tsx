"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, CornerDownRight } from "lucide-react";

/**
 * DIRECTION B : « L'Atelier Foncier & Typographique »
 * Style : Éditorial français de haute tenue, rigueur architecturale, zéro card blanche générique,
 * typographie contrastée (titrage serif noble + technique sans-serif), filets d'imprimerie.
 */
export function DirectionB() {
  const [nantesSettled, setNantesSettled] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6F4EE] text-[#191817] font-sans selection:bg-[#191817] selection:text-[#F6F4EE]">
      {/* 1. ARCHITECTURAL HEADER */}
      <header className="border-b border-[#191817]/15 px-6 lg:px-12 py-5 bg-[#F6F4EE]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-baseline gap-6">
            <span className="font-serif text-2xl tracking-tight font-semibold italic text-[#191817]">
              RentReady
            </span>
            <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-widest text-stone-500 border-l border-stone-300 pl-4">
              Direction B · Atelier Foncier
            </span>
          </div>

          <div className="flex items-center gap-8">
            <span className="hidden lg:inline-block font-mono text-[11px] text-stone-500">
              REGISTRE DES BAUX & QUITTANCES · RÉP. FRANÇAISE
            </span>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="hidden sm:inline-block text-xs uppercase tracking-wider font-semibold text-stone-700 hover:text-black transition-colors"
              >
                Espace Bailleur
              </Link>
              <Link
                href="/register"
                className="text-xs uppercase tracking-wider font-semibold px-4 py-2.5 bg-[#191817] text-[#F6F4EE] hover:bg-stone-800 transition-colors"
              >
                Ouvrir un compte
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 2. ARCHITECTURAL HERO SECTION */}
      <section className="pt-16 pb-20 px-6 lg:px-12 border-b border-[#191817]/15">
        <div className="max-w-7xl mx-auto">
          {/* Grille Asymétrique : Marge éditoriale à gauche, Contenu monumental à droite */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start mb-16">
            {/* Colonne Marge de gauche (Indexation & Cadastre) */}
            <div className="lg:col-span-3 pt-2 border-t-2 border-[#191817] lg:border-t-0 font-mono text-xs text-stone-600 space-y-6">
              <div>
                <span className="block text-[10px] text-stone-400 uppercase tracking-widest mb-1">PÉRIODE D'ARRÊTÉ</span>
                <span className="font-bold text-stone-900 text-sm">OCTOBRE 2026</span>
              </div>
              <div>
                <span className="block text-[10px] text-stone-400 uppercase tracking-widest mb-1">CADRE JURIDIQUE</span>
                <span className="block text-stone-800">Loi du 6 juillet 1989</span>
                <span className="block text-stone-500">Art. 21 (Quittance & Reçu)</span>
              </div>
              <div>
                <span className="block text-[10px] text-stone-400 uppercase tracking-widest mb-1">INFRASTRUCTURE</span>
                <span className="block text-stone-800">Hébergement France</span>
                <span className="block text-stone-500">OVHcloud Gravelines</span>
              </div>
            </div>

            {/* Colonne Titre & Manifeste Éditorial */}
            <div className="lg:col-span-9 lg:pl-8">
              <span className="inline-block font-mono text-xs uppercase tracking-widest text-stone-500 mb-4">
                01 / INTENDANCE FONCIÈRE INDÉPENDANTE
              </span>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.08] text-[#191817] tracking-tight mb-8">
                De l'exigibilité du loyer <br />
                <span className="italic">à la décharge conforme.</span>
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end pt-4 border-t border-[#191817]/15">
                <p className="md:col-span-7 text-stone-700 text-lg leading-relaxed font-sans">
                  Une tenue rigoureuse de votre patrimoine locatif, pensée comme un grand livre d'architecture.
                  Zéro tableur bricolé : ventilation loyer/charges irréprochable, pointage assisté des règlements
                  et respect scrupuleux des prérogatives légales.
                </p>

                <div className="md:col-span-5 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#191817] text-[#F6F4EE] text-sm font-semibold tracking-wide uppercase hover:bg-stone-800 transition-colors"
                  >
                    Essai 14 jours libre
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* PLANCHE PRODUIT INTÉGRÉE : LE GRAND LIVRE DÉCONSTRUIT (PAS DE CARD BLANCHE) */}
          <div className="mt-16 pt-10 border-t border-[#191817]/25">
            <div className="flex flex-wrap items-baseline justify-between mb-8 gap-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-stone-500 block">
                  FEUILLET FONCIER N° 2026-10
                </span>
                <h3 className="font-serif text-2xl font-normal italic text-[#191817]">
                  Grand Livre Mensuel des Biens en Gestion
                </h3>
              </div>
              <div className="font-mono text-xs text-stone-600 bg-stone-200/60 px-3 py-1.5 border border-stone-300">
                STATUT : {nantesSettled ? "100 % RÉGLÉ · TOUTES QUITTANCES DÉLIVRÉES" : "SOLDE RESTANT · 1 ACOMPTE EN SUSPENS"}
              </div>
            </div>

            {/* Les Grands Chiffres Éditoriaux (Pas de box fermée) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-[#191817]/20 font-mono">
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">
                  1. TOTAL EXIGIBLE
                </span>
                <span className="text-3xl lg:text-4xl font-serif text-[#191817]">2 850,00 €</span>
                <span className="block text-[11px] text-stone-500 mt-1">3 baux ventilés</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">
                  2. MONTANT REÇU
                </span>
                <span className="text-3xl lg:text-4xl font-serif text-[#191817]">
                  {nantesSettled ? "2 850,00 €" : "2 450,00 €"}
                </span>
                <span className="block text-[11px] text-stone-600 mt-1">
                  {nantesSettled ? "Virement complet" : "2 complets · 1 acompte"}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">
                  3. SOLDE RESTANT
                </span>
                <span className={`text-3xl lg:text-4xl font-serif ${nantesSettled ? "text-stone-400" : "text-amber-800"}`}>
                  {nantesSettled ? "0,00 €" : "400,00 €"}
                </span>
                <span className="block text-[11px] text-stone-500 mt-1">
                  {nantesSettled ? "Extinction de la dette" : "Nantes (en attente)"}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">
                  4. TITRES ÉMIS
                </span>
                <span className="text-3xl lg:text-4xl font-serif text-[#191817]">
                  {nantesSettled ? "03" : "02"}
                </span>
                <span className="block text-[11px] text-stone-500 mt-1">
                  {nantesSettled ? "Quittances conformes" : "2 quittances · 1 reçu partiel"}
                </span>
              </div>
            </div>

            {/* Écritures Foncier Ligne par Ligne (Style Gravure & Typographie) */}
            <div className="divide-y divide-[#191817]/15">
              {/* Entrée 1 : Paris */}
              <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-1 font-mono text-xs text-stone-400">#01</div>
                <div className="md:col-span-5">
                  <h4 className="font-serif text-lg font-medium text-[#191817]">
                    Studio Rue Oberkampf · Paris 11e
                  </h4>
                  <p className="font-mono text-xs text-stone-600 mt-0.5">
                    Preneuse : Camille Laurent · Loyer principal 670,00 € · Provisions 80,00 €
                  </p>
                </div>
                <div className="md:col-span-3 font-mono text-xs">
                  <span className="text-stone-900 font-bold">750,00 € RÉGLÉ</span>
                  <span className="block text-stone-500 text-[11px]">Virement pointé le 02/10/2026</span>
                </div>
                <div className="md:col-span-3 text-left md:text-right font-mono text-xs">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-200/80 text-stone-800 border border-stone-300">
                    <Check className="w-3 h-3 text-stone-700" /> Quittance #2026-10-01
                  </span>
                </div>
              </div>

              {/* Entrée 2 : Lyon */}
              <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-1 font-mono text-xs text-stone-400">#02</div>
                <div className="md:col-span-5">
                  <h4 className="font-serif text-lg font-medium text-[#191817]">
                    T3 Avenue Victor Hugo · Lyon 2e
                  </h4>
                  <p className="font-mono text-xs text-stone-600 mt-0.5">
                    Preneur : Alexandre Mercier · Loyer principal 1 520,00 € · Provisions 180,00 €
                  </p>
                </div>
                <div className="md:col-span-3 font-mono text-xs">
                  <span className="text-stone-900 font-bold">1 700,00 € RÉGLÉ</span>
                  <span className="block text-stone-500 text-[11px]">Virement pointé le 04/10/2026</span>
                </div>
                <div className="md:col-span-3 text-left md:text-right font-mono text-xs">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-200/80 text-stone-800 border border-stone-300">
                    <Check className="w-3 h-3 text-stone-700" /> Quittance #2026-10-02
                  </span>
                </div>
              </div>

              {/* Entrée 3 : Nantes (Paiement partiel / Traitement Typographique) */}
              <div
                className={`py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center transition-colors ${
                  nantesSettled ? "" : "bg-stone-200/40 px-4 -mx-4"
                }`}
              >
                <div className="md:col-span-1 font-mono text-xs text-stone-400">#03</div>
                <div className="md:col-span-5">
                  <div className="flex items-center gap-3">
                    <h4 className="font-serif text-lg font-medium text-[#191817]">
                      T2 Rue de la République · Nantes
                    </h4>
                    {!nantesSettled && (
                      <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 bg-amber-900 text-amber-50">
                        Acompte
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-xs text-stone-600 mt-0.5">
                    Preneuse : Éléonore Moreau · Exigible : 800,00 € · Reçu : {nantesSettled ? "800,00 €" : "400,00 € (05/10)"}
                  </p>
                </div>
                <div className="md:col-span-3 font-mono text-xs">
                  <span className={`font-bold ${nantesSettled ? "text-stone-900" : "text-amber-900"}`}>
                    {nantesSettled ? "800,00 € RÉGLÉ" : "SOLDE RESTANT : 400,00 €"}
                  </span>
                  <span className="block text-stone-500 text-[11px]">
                    {nantesSettled ? "Solde soldé" : "Reçu de paiement partiel (art. 21)"}
                  </span>
                </div>
                <div className="md:col-span-3 text-left md:text-right">
                  <button
                    onClick={() => setNantesSettled(!nantesSettled)}
                    className={`font-mono text-xs uppercase tracking-wider px-3 py-2 border transition-colors ${
                      nantesSettled
                        ? "bg-transparent border-stone-400 text-stone-700 hover:bg-stone-300/40"
                        : "bg-[#191817] text-[#F6F4EE] border-[#191817] hover:bg-stone-800"
                    }`}
                  >
                    {nantesSettled ? "Annuler le pointage" : "Pointer le solde perçu (400 €)"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRANSITION ÉDITORIALE VERS LE PROCESSUS */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4">
            <span className="font-mono text-xs uppercase tracking-widest text-stone-500 block mb-3">
              MÉTHODE & JURISPRUDENCE
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl font-normal leading-tight text-[#191817] mb-6">
              Une articulation séquentielle, <br />
              <span className="italic">conforme au droit du bail.</span>
            </h2>
            <p className="text-stone-700 leading-relaxed text-sm">
              L'intendance ne s'improvise pas. Chaque cycle mensuel suit trois obligations distinctes que
              RentReady consigne sans ambiguïté.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-8 pt-2">
            <div className="border-t-2 border-[#191817] pt-4">
              <span className="font-mono text-xs text-stone-400 block mb-2">PHASE I</span>
              <h3 className="font-serif text-lg font-medium text-[#191817] mb-2">Exigibilité</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-mono">
                Ventilation stricte au 1er du mois : loyer nu et provisions pour charges isolés à la racine (décret n° 2015-587).
              </p>
            </div>

            <div className="border-t-2 border-[#191817] pt-4">
              <span className="font-mono text-xs text-stone-400 block mb-2">PHASE II</span>
              <h3 className="font-serif text-lg font-medium text-[#191817] mb-2">Rapprochement</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-mono">
                Pointage des virements réels. En cas d'acompte partiel, enregistrement du solde débiteur sans délivrance abusive de quittance.
              </p>
            </div>

            <div className="border-t-2 border-[#191817] pt-4">
              <span className="font-mono text-xs text-stone-400 block mb-2">PHASE III</span>
              <h3 className="font-serif text-lg font-medium text-[#191817] mb-2">Décharge</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-mono">
                Émission du titre conforme (loi 1989 art. 21) : quittance uniquement pour 100 % réglé, reçu d'acompte dans le cas contraire.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
