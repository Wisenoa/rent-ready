"use client";

import React from "react";
import { Check, Shield, AlertTriangle, ArrowRight, Download, RefreshCw } from "lucide-react";

/* ────────────────────────────────────────────────────────────────────────── */
/* 1. WORDMARK EXPLORATION SHEET                                              */
/* ────────────────────────────────────────────────────────────────────────── */

export function B1WordmarkSheet() {
  return (
    <div className="space-y-12 pb-16">
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#7C8782]">
          Planche de Marque #01
        </span>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#15241F] tracking-tight">
          Exploration & Comparatif des Wordmarks RentReady
        </h1>
        <p className="text-xs text-[#5A6660]">
          Analyse de 4 pistes typographiques, résistance aux réductions et fit patrimonial français.
        </p>
      </div>

      {/* 4 Variants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Piste 1: Humaniste Épuré (RECOMMENDED) */}
        <div className="bg-white rounded-xl border-2 border-[#1E3A2F] p-6 space-y-4 shadow-sm relative">
          <div className="absolute top-4 right-4 text-[10px] font-semibold text-[#1E3A2F] bg-[#EEF4F1] px-2.5 py-0.5 rounded-full border border-[#C6E7D3]">
            Recommandé · Note : 9.5/10
          </div>
          <div>
            <span className="text-xs font-semibold text-[#7C8782] uppercase tracking-wider">
              Piste 1 · Humaniste Épuré
            </span>
            <div className="py-6 text-3xl font-semibold text-[#15241F] tracking-tight">
              RentReady
            </div>
            <p className="text-xs text-[#5A6660] leading-relaxed">
              Basé sur Plus Jakarta Sans 600, approches optiques resserrées (-0.03em), point carré sur le <em>i</em>.
              Équilibré, moderne, lisible de 14px à 120px sans aucun artifice.
            </p>
          </div>

          <div className="pt-3 border-t border-[#E5E2DA] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#7C8782]">Lisibilité petite taille :</span>
              <span className="font-semibold text-[#236B47]">Excellente (12px)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7C8782]">Pérennité (5 ans) :</span>
              <span className="font-semibold text-[#15241F]">Maximale</span>
            </div>
          </div>
        </div>

        {/* Piste 2: Contraste Bicolore Atelier */}
        <div className="bg-white rounded-xl border border-[#E5E2DA] p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7C8782] uppercase tracking-wider">
              Piste 2 · Contraste Bicolore
            </span>
            <span className="text-[10px] font-medium text-[#5A6660] bg-[#ECEAE4] px-2 py-0.5 rounded">
              Note : 8.5/10
            </span>
          </div>
          <div className="py-6 text-3xl font-semibold tracking-tight">
            <span className="text-[#15241F]">Rent</span>
            <span className="text-[#1E3A2F]">Ready</span>
          </div>
          <p className="text-xs text-[#5A6660] leading-relaxed">
            Distingue l'objet patrimonial (Rent en encre sombre) et l'état d'intendance active (Ready en vert atelier).
            Très lisible mais légèrement plus explicatif.
          </p>
          <div className="pt-3 border-t border-[#E5E2DA] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#7C8782]">Lisibilité petite taille :</span>
              <span className="font-semibold text-[#15241F]">Très bonne</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7C8782]">Pérennité :</span>
              <span className="font-semibold text-[#15241F]">Bonne</span>
            </div>
          </div>
        </div>

        {/* Piste 3: Architecture Géométrique */}
        <div className="bg-white rounded-xl border border-[#E5E2DA] p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7C8782] uppercase tracking-wider">
              Piste 3 · Architecture Gravée
            </span>
            <span className="text-[10px] font-medium text-[#5A6660] bg-[#ECEAE4] px-2 py-0.5 rounded">
              Note : 8.0/10
            </span>
          </div>
          <div className="py-6 text-3xl font-bold tracking-tight text-[#15241F] uppercase font-sans">
            RENTREADY
          </div>
          <p className="text-xs text-[#5A6660] leading-relaxed">
            Majuscules taillées dans la masse inspirées de l'épigraphie minérale contemporaine.
            Très autoritaire, mais perd en douceur sur mobile.
          </p>
          <div className="pt-3 border-t border-[#E5E2DA] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#7C8782]">Lisibilité petite taille :</span>
              <span className="font-semibold text-[#5A6660]">Moyenne</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7C8782]">Pérennité :</span>
              <span className="font-semibold text-[#15241F]">Élevée</span>
            </div>
          </div>
        </div>

        {/* Piste 4: Basse-Casse Monocycle */}
        <div className="bg-white rounded-xl border border-[#E5E2DA] p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7C8782] uppercase tracking-wider">
              Piste 4 · Basse-Casse Start-up
            </span>
            <span className="text-[10px] font-medium text-[#5A6660] bg-[#ECEAE4] px-2 py-0.5 rounded">
              Note : 6.5/10
            </span>
          </div>
          <div className="py-6 text-3xl font-medium tracking-tight text-[#15241F] font-sans">
            rentready<span className="text-[#1E3A2F]">.</span>
          </div>
          <p className="text-xs text-[#5A6660] leading-relaxed">
            Minuscules intégrales avec point final. Moderne pour une app consommateur, mais manque de gravité
            institutionnelle pour des baux notariés et des flux fiscaux.
          </p>
          <div className="pt-3 border-t border-[#E5E2DA] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#7C8782]">Lisibilité petite taille :</span>
              <span className="font-semibold text-[#5A6660]">Moyenne</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7C8782]">Pérennité :</span>
              <span className="font-semibold text-[#B9382B]">Fragile (Mode 2022)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Micro-scale Test & Dark Test */}
      <div className="bg-white rounded-xl border border-[#E5E2DA] p-6 space-y-4 shadow-sm">
        <h2 className="text-sm font-semibold text-[#15241F]">
          Épreuve de Résistance aux Échelles Réelles (Piste 1 Recommandée)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center pt-2">
          <div className="p-4 bg-[#F5F3EF] rounded-lg border border-[#E5E2DA] text-center">
            <span className="text-[11px] text-[#7C8782] block mb-2">Display Hero (48px)</span>
            <span className="text-3xl font-semibold text-[#15241F]">RentReady</span>
          </div>

          <div className="p-4 bg-[#F5F3EF] rounded-lg border border-[#E5E2DA] text-center">
            <span className="text-[11px] text-[#7C8782] block mb-2">Navbar Desktop (20px)</span>
            <span className="text-lg font-semibold text-[#15241F]">RentReady</span>
          </div>

          <div className="p-4 bg-[#15241F] rounded-lg text-center">
            <span className="text-[11px] text-[#7C8782] block mb-2">Sur Fond Sombre Encre</span>
            <span className="text-lg font-semibold text-[#F5F3EF]">RentReady</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 2. APP ICON & SYMBOLS SHEET                                                */
/* ────────────────────────────────────────────────────────────────────────── */

export function B1AppIconSheet() {
  return (
    <div className="space-y-12 pb-16">
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#7C8782]">
          Planche de Marque #02
        </span>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#15241F] tracking-tight">
          Exploration du Symbole d'Application & Favicon
        </h1>
        <p className="text-xs text-[#5A6660]">
          Zéro toit de maison, zéro clé, zéro building. Formes architecturales abstraites et durables.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Candidate A */}
        <div className="bg-white rounded-xl border-2 border-[#1E3A2F] p-6 space-y-4 shadow-sm text-center">
          <div className="inline-block text-[10px] font-semibold text-[#1E3A2F] bg-[#EEF4F1] px-2 py-0.5 rounded-full mb-2">
            Candidat A (Recommandé)
          </div>

          <div className="w-24 h-24 mx-auto rounded-2xl bg-[#1E3A2F] flex items-center justify-center text-white shadow-md relative overflow-hidden">
            {/* Geometric Double Fold R Icon */}
            <svg viewBox="0 0 48 48" className="w-14 h-14" fill="none">
              <path
                d="M14 10H26C31.5228 10 36 14.4772 36 20C36 25.5228 31.5228 30 26 30H14V10Z"
                stroke="#F5F3EF"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M25 29L35 38"
                stroke="#F5F3EF"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <line
                x1="14"
                y1="10"
                x2="14"
                y2="38"
                stroke="#A3E635"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h3 className="font-semibold text-sm text-[#15241F]">« Le Double Pli R »</h3>
          <p className="text-xs text-[#5A6660] leading-relaxed">
            Croisement d'un pli de document officiel et de l'initiale R. Fût vertical contrasté vert vif.
            Excellente reconnaissance sous toutes les résolutions.
          </p>
        </div>

        {/* Candidate B */}
        <div className="bg-white rounded-xl border border-[#E5E2DA] p-6 space-y-4 shadow-sm text-center">
          <div className="inline-block text-[10px] font-medium text-[#5A6660] bg-[#ECEAE4] px-2 py-0.5 rounded-full mb-2">
            Candidat B
          </div>

          <div className="w-24 h-24 mx-auto rounded-2xl bg-[#F5F3EF] border-2 border-[#E5E2DA] flex items-center justify-center shadow-sm">
            {/* The Ledger Line */}
            <div className="space-y-2 w-12">
              <div className="h-1.5 w-full bg-[#1E3A2F] rounded-full" />
              <div className="h-1.5 w-8 bg-[#236B47] rounded-full" />
              <div className="h-1.5 w-10 bg-[#C86D2C] rounded-full" />
            </div>
          </div>

          <h3 className="font-semibold text-sm text-[#15241F]">« La Ligne d'Arrêté »</h3>
          <p className="text-xs text-[#5A6660] leading-relaxed">
            Représentation abstraite des 3 états (calme, réglé, exception) sous forme de lignes de grand livre.
          </p>
        </div>

        {/* Candidate C */}
        <div className="bg-white rounded-xl border border-[#E5E2DA] p-6 space-y-4 shadow-sm text-center">
          <div className="inline-block text-[10px] font-medium text-[#5A6660] bg-[#ECEAE4] px-2 py-0.5 rounded-full mb-2">
            Candidat C
          </div>

          <div className="w-24 h-24 mx-auto rounded-2xl bg-[#15241F] flex items-center justify-center text-white shadow-sm">
            <span className="font-sans font-bold text-4xl text-[#F5F3EF]">R</span>
          </div>

          <h3 className="font-semibold text-sm text-[#15241F]">« L'Initiale Sculptée »</h3>
          <p className="text-xs text-[#5A6660] leading-relaxed">
            La lettre R pure en Plus Jakarta Sans bold. L'option intemporelle adoptée par Linear et Notion.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 3. COLOR SHEET COMPONENT                                                   */
/* ────────────────────────────────────────────────────────────────────────── */

export function B1ColorSheet() {
  const tokens = [
    { name: "Canvas Calcaire", hex: "#F5F3EF", oklch: "oklch(0.962 0.006 85)", role: "Fond d'application et de site" },
    { name: "Albâtre Pur", hex: "#FFFFFF", oklch: "oklch(1.000 0.000 0)", role: "Cartes et surfaces actives" },
    { name: "Pierre Adoucie", hex: "#ECEAE4", oklch: "oklch(0.935 0.008 85)", role: "Surfaces d'accent feutré" },
    { name: "Filet Minéral", hex: "#E5E2DA", oklch: "oklch(0.905 0.010 85)", role: "Bordures et séparateurs" },
    { name: "Encre Végétale", hex: "#15241F", oklch: "oklch(0.240 0.025 155)", role: "Typographie maîtresse (AAA)" },
    { name: "Vert Forêt Atelier", hex: "#1E3A2F", oklch: "oklch(0.330 0.045 155)", role: "Action primaire & marque (CTA)" },
    { name: "Vert Sauge Calme", hex: "#236B47", oklch: "oklch(0.480 0.095 148)", role: "État payé & quittance prête" },
    { name: "Ambre Miel Exception", hex: "#C86D2C", oklch: "oklch(0.580 0.145 55)", role: "Solde partiel & retard (Attention)" },
    { name: "Garance Alerte", hex: "#B9382B", oklch: "oklch(0.480 0.170 28)", role: "Impayé critique & contentieux" },
  ];

  return (
    <div className="space-y-12 pb-16">
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#7C8782]">
          Planche de Marque #03
        </span>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#15241F] tracking-tight">
          Système Chromatique & Tokens Minéraux B.1
        </h1>
        <p className="text-xs text-[#5A6660]">
          Palette dans l'espace perceptuel OKLCH, contrastes WCAG 2.2 et séparation stricte Brand Green ≠ Success Green.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tokens.map((t) => (
          <div key={t.name} className="bg-white rounded-xl border border-[#E5E2DA] p-4 space-y-3 shadow-sm">
            <div
              className="h-16 rounded-lg border border-black/10 flex items-end p-2.5"
              style={{ backgroundColor: t.hex }}
            >
              <span
                className={`font-mono text-xs font-bold ${
                  ["#15241F", "#1E3A2F", "#236B47", "#C86D2C", "#B9382B"].includes(t.hex)
                    ? "text-white"
                    : "text-[#15241F]"
                }`}
              >
                {t.hex}
              </span>
            </div>
            <div>
              <div className="font-semibold text-xs text-[#15241F]">{t.name}</div>
              <div className="font-mono text-[10px] text-[#7C8782]">{t.oklch}</div>
              <div className="text-[11px] text-[#5A6660] mt-1">{t.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 4. TYPOGRAPHY SHEET COMPONENT                                              */
/* ────────────────────────────────────────────────────────────────────────── */

export function B1TypographySheet() {
  return (
    <div className="space-y-12 pb-16">
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#7C8782]">
          Planche de Marque #04
        </span>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#15241F] tracking-tight">
          Système Typographique Plus Jakarta Sans
        </h1>
        <p className="text-xs text-[#5A6660]">
          Licence SIL OFL 1.1, chiffres tabulaires parfaits, gestion des diacritiques français.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E2DA] p-6 space-y-6 shadow-sm">
        {/* Scale Demonstration */}
        <div className="space-y-4 pb-6 border-b border-[#E5E2DA]">
          <h2 className="text-xs font-semibold text-[#7C8782] uppercase tracking-wider">
            Échelle Modulaire (Ratio 1.20)
          </h2>

          <div className="space-y-3">
            <div className="flex items-baseline justify-between border-b border-[#E5E2DA]/60 pb-2">
              <span className="text-3xl sm:text-4xl font-semibold text-[#15241F]">
                Display Hero — 44px
              </span>
              <span className="text-xs text-[#7C8782] font-mono">2.75rem / SemiBold</span>
            </div>

            <div className="flex items-baseline justify-between border-b border-[#E5E2DA]/60 pb-2">
              <span className="text-2xl font-semibold text-[#15241F]">Section H2 — 28px</span>
              <span className="text-xs text-[#7C8782] font-mono">1.75rem / SemiBold</span>
            </div>

            <div className="flex items-baseline justify-between border-b border-[#E5E2DA]/60 pb-2">
              <span className="text-lg font-medium text-[#15241F]">Sous-Titre H3 — 20px</span>
              <span className="text-xs text-[#7C8782] font-mono">1.25rem / Medium</span>
            </div>

            <div className="flex items-baseline justify-between border-b border-[#E5E2DA]/60 pb-2">
              <span className="text-base text-[#15241F]">Corps Courant — 15px</span>
              <span className="text-xs text-[#7C8782] font-mono">0.9375rem / Regular</span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-xs font-medium text-[#15241F] tabular-nums">
                Micro Tabulaire — 13.5px · 1 250,00 €
              </span>
              <span className="text-xs text-[#7C8782] font-mono">0.84rem / Tabular</span>
            </div>
          </div>
        </div>

        {/* Tabular Figures Proof */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-[#7C8782] uppercase tracking-wider">
            Preuve d'Alignement Tabulaire Strict (tabular-nums)
          </h2>
          <div className="p-4 bg-[#F5F3EF] rounded-lg font-mono text-xs space-y-1 text-[#15241F]">
            <div className="flex justify-between w-64">
              <span>Loyer net nu :</span>
              <span className="tabular-nums font-semibold">1 250,00 €</span>
            </div>
            <div className="flex justify-between w-64">
              <span>Provisions :</span>
              <span className="tabular-nums font-semibold">  85,00 €</span>
            </div>
            <div className="flex justify-between w-64">
              <span>Régularisation :</span>
              <span className="tabular-nums font-semibold"> 412,50 €</span>
            </div>
            <div className="flex justify-between w-64 border-t border-[#D4CFC4] pt-1">
              <span>Total exigible :</span>
              <span className="tabular-nums font-bold text-[#1E3A2F]">1 747,50 €</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 5. MOTION STORYBOARD SHEET                                                 */
/* ────────────────────────────────────────────────────────────────────────── */

export function B1MotionStoryboard() {
  return (
    <div className="space-y-12 pb-16">
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#7C8782]">
          Planche de Marque #05
        </span>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#15241F] tracking-tight">
          Storyboard du Mouvement & Rétraction Feutrée
        </h1>
        <p className="text-xs text-[#5A6660]">
          La signature cinétique en 4 temps : Calm $\rightarrow$ Attention $\rightarrow$ Action $\rightarrow$ Resolved.
        </p>
      </div>

      <div className="space-y-6">
        {/* Step 1 */}
        <div className="bg-white rounded-xl border border-[#E5E2DA] p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-[#7C8782]">
            <span>TEMPS 1 · ÉTAT INITIAL : ANOMALIE ACTIVE</span>
            <span className="font-mono text-[#C86D2C]">Hauteur : 96px · Ambre miel</span>
          </div>
          <div className="p-4 bg-[#FDF6ED] border-l-4 border-l-[#C86D2C] rounded-r-lg flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-[#15241F]">Nantes Centre — T2 54 m²</span>
              <div className="text-[#C86D2C] text-[11px]">Virement partiel 450 € sur 850 € attendus</div>
            </div>
            <button className="px-3 py-1.5 bg-[#1E3A2F] text-white font-semibold rounded text-[11px]">
              Pointer le solde
            </button>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-xl border border-[#E5E2DA] p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-[#7C8782]">
            <span>TEMPS 2 · TRANSITION D'APUREMENT (CLIC UTILISATEUR)</span>
            <span className="font-mono text-[#1E3A2F]">Durée : 240ms · cubic-bezier(0.16, 1, 0.3, 1)</span>
          </div>
          <p className="text-xs text-[#5A6660] leading-relaxed">
            Le fond ambre s'estompe progressivement vers le blanc. La hauteur de la ligne se comprime de 96px vers 42px.
            Le bouton d'action se replie en badge sauge feutré.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-xl border border-[#E5E2DA] p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-[#7C8782]">
            <span>TEMPS 3 · ÉTAT CALME SILENCIEUX (RÉSOLU)</span>
            <span className="font-mono text-[#236B47]">Hauteur : 42px · Ligne de registre</span>
          </div>
          <div className="px-5 py-2.5 bg-[#EEF7F2]/40 border border-[#C6E7D3] rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#236B47]" />
              <span className="font-semibold text-[#15241F]">Nantes Centre — T2 54 m²</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-[#236B47] tabular-nums">850,00 €</span>
              <span className="text-[11px] font-semibold text-[#236B47] bg-[#EEF7F2] px-2 py-0.5 rounded-full border border-[#C6E7D3]">
                ✓ Réglé · Quittance émise
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
