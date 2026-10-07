"use client";

import React from "react";
import {
  Check,
  CheckCircle2,
  ArrowRight,
  Download,
  Calendar,
  Building2,
  FileText,
} from "lucide-react";

export function VisualLanguageV0() {
  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#151413] font-sans p-6 sm:p-12 lg:p-16 space-y-12 max-w-7xl mx-auto selection:bg-[#151413] selection:text-[#F8F6F0]">
      {/* En-tête de la planche de synthèse */}
      <div className="border-b border-[#151413]/12 pb-6 space-y-2">
        <div className="flex items-center gap-3">
          <span className="font-serif text-3xl italic font-semibold text-[#151413]">
            RentReady
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#6B6760] border-l border-[#151413]/15 pl-3">
            Langage Visuel & Comportemental v0
          </span>
        </div>
        <p className="text-sm text-[#6B6760] max-w-2xl">
          Synthèse des primitives réelles issues des tests sur le Tableau de bord et la Property Home Base.
          Ce système privilégie le silence visuel, la retenue et la réduction de l'interface en situation normale.
        </p>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          1. TYPOGRAPHIE : LA RÈGLE DES 3 FAMILLES
      ───────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xs uppercase tracking-wider font-semibold text-[#6B6760] border-b border-[#151413]/10 pb-1.5">
          01 · Typographie tripartite
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Serif : Marque & Émotion */}
          <div className="p-5 bg-[#F1EEE4] border border-[#151413]/10 space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#6B6760] tracking-wider block">
              SERIF · MARQUE & ÉDITORIAL
            </span>
            <div className="font-serif text-2xl text-[#151413]">
              Vos locations tournent.
            </div>
            <p className="text-xs text-[#6B6760]">
              Réservée au logotype, aux grands titres du mois et aux affirmations éditoriales. Ne s'applique pas aux interfaces fonctionnelles.
            </p>
          </div>

          {/* Sans : Produit & Action */}
          <div className="p-5 bg-[#F1EEE4] border border-[#151413]/10 space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#6B6760] tracking-wider block">
              SANS · LOGICIEL & LISIBILITÉ
            </span>
            <div className="text-base font-semibold text-[#151413]">
              Studio Rue Oberkampf · Paris 11e
            </div>
            <p className="text-xs text-[#6B6760]">
              Utilisée pour l'ensemble du produit : navigation, noms des biens, locataires, statuts, boutons et explications.
            </p>
          </div>

          {/* Mono : Chiffres & Dates */}
          <div className="p-5 bg-[#F1EEE4] border border-[#151413]/10 space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#6B6760] tracking-wider block">
              MONO · STRICTEMENT FINANCIÈRE
            </span>
            <div className="font-mono text-xl font-bold text-[#151413] tabular-nums">
              2 850,00&nbsp;€ <span className="text-xs font-normal text-[#22543D]">✓ 02/10</span>
            </div>
            <p className="text-xs text-[#6B6760]">
              Strictement cantonnée aux montants en euros (tabular-nums), aux dates de virement et aux références de quittance.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. L'ARGENT & LA DONNÉE FINANCIÈRE
      ───────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xs uppercase tracking-wider font-semibold text-[#6B6760] border-b border-[#151413]/10 pb-1.5">
          02 · Représentation monétaire
        </h2>

        <div className="p-6 bg-[#FAF8F3] border border-[#151413]/10 flex flex-wrap items-baseline gap-10">
          <div>
            <span className="block text-[11px] text-[#6B6760]">Total mensuel attendu</span>
            <div className="font-mono text-3xl font-semibold tabular-nums text-[#151413]">
              2 850&nbsp;<span className="text-sm font-normal text-[#6B6760]">€</span>
            </div>
          </div>

          <div>
            <span className="block text-[11px] text-[#6B6760]">Déjà encaissé (Apaisé)</span>
            <div className="font-mono text-3xl font-semibold tabular-nums text-[#22543D]">
              2 450&nbsp;<span className="text-sm font-normal text-[#22543D]">€</span>
            </div>
          </div>

          <div>
            <span className="block text-[11px] text-[#6B6760]">Solde actif (Exception)</span>
            <div className="font-mono text-3xl font-semibold tabular-nums text-[#C2410C]">
              400&nbsp;<span className="text-sm font-normal text-[#C2410C]">€</span>
            </div>
          </div>

          <div>
            <span className="block text-[11px] text-[#6B6760]">Solde soldé (Calme)</span>
            <div className="font-mono text-3xl font-semibold tabular-nums text-[#22543D]">
              0&nbsp;<span className="text-sm font-normal text-[#22543D]">€</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. COMPORTEMENT DE SILENCE VISUEL (LA VRAIE SIGNATURE)
      ───────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xs uppercase tracking-wider font-semibold text-[#6B6760] border-b border-[#151413]/10 pb-1.5">
          03 · Comportement : Exception (3 unités) vs Calme (1 unité)
        </h2>

        <div className="space-y-4">
          {/* ÉTAT B : L'EXCEPTION OUVRE L'INTERFACE */}
          <div className="p-5 bg-[#FFFDF9] border-l-4 border-l-[#C2410C] border-y border-r border-[#C2410C]/25 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C2410C]" />
                <span className="text-xs uppercase font-bold tracking-wider text-[#9A3412]">
                  L'EXCEPTION PREND L'ATTENTION (3 UNITÉS)
                </span>
              </div>
              <span className="font-mono text-xs font-semibold text-[#C2410C]">
                400,00 € restant à régler
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <span className="text-xs text-[#6B6760]">
                T2 Rue de la République · Éléonore Moreau (Acompte de 400 € perçu le 03/10)
              </span>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#151413] text-[#F8F6F0] text-xs font-semibold">
                Marquer les 400 € reçus <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* ÉTAT A : LE CALME RÉTRACTE L'INTERFACE */}
          <div className="p-3.5 bg-[#F8F6F0] border border-[#151413]/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#22543D]" />
              <span className="text-xs font-semibold text-[#151413]">
                LE CALME EFFACE L'INTERFACE (1 UNITÉ) · Studio Oberkampf · Camille Laurent
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="font-mono text-[#22543D]">750,00 € réglé le 02/10</span>
              <span className="text-[#22543D] bg-[#22543D]/10 px-2 py-0.5 border border-[#22543D]/20 text-[11px]">
                ✓ Quittance prête
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. SURFACES & PALETTE ÉMOTIONNELLE
      ───────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xs uppercase tracking-wider font-semibold text-[#6B6760] border-b border-[#151413]/10 pb-1.5">
          04 · Surfaces & Matérialité
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs">
          <div className="p-4 bg-[#F8F6F0] border border-[#151413]/15">
            <span className="font-semibold block">Base Papier</span>
            <span className="font-mono text-[11px] text-[#6B6760]">#F8F6F0</span>
          </div>

          <div className="p-4 bg-[#F1EEE4] border border-[#151413]/15">
            <span className="font-semibold block">Surface Inset</span>
            <span className="font-mono text-[11px] text-[#6B6760]">#F1EEE4</span>
          </div>

          <div className="p-4 bg-[#FAF8F3] border border-[#151413]/15">
            <span className="font-semibold block">Feuillet Fiche</span>
            <span className="font-mono text-[11px] text-[#6B6760]">#FAF8F3</span>
          </div>

          <div className="p-4 bg-[#151413] text-[#F8F6F0]">
            <span className="font-semibold block">Encre Carbone</span>
            <span className="font-mono text-[11px] text-[#F8F6F0]/70">#151413</span>
          </div>

          <div className="p-4 bg-[#FFFDF9] border border-[#C2410C]/30 text-[#9A3412]">
            <span className="font-semibold block">Attention Active</span>
            <span className="font-mono text-[11px]">#C2410C</span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. ACTIONS & BOUTONS TACTILES
      ───────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xs uppercase tracking-wider font-semibold text-[#6B6760] border-b border-[#151413]/10 pb-1.5">
          05 · Primitives d'action
        </h2>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <button className="px-4 py-2 bg-[#151413] text-[#F8F6F0] font-semibold flex items-center gap-2">
            Action primaire <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button className="px-3.5 py-2 border border-[#151413]/20 text-[#151413] font-semibold">
            Action secondaire
          </button>

          <span className="text-[#151413] underline font-medium cursor-pointer">
            Lien documentaire (PDF)
          </span>

          <span className="inline-flex items-center gap-1 text-[11px] text-[#22543D] bg-[#22543D]/10 px-2.5 py-1 border border-[#22543D]/20">
            <Check className="w-3 h-3" /> Statut apaisé
          </span>
        </div>
      </section>
    </div>
  );
}
