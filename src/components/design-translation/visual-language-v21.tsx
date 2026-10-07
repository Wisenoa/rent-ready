"use client";

import React from "react";
import {
  Check,
  CheckCircle2,
  ArrowRight,
  FileText,
  ShieldCheck,
  Send,
  AlertCircle,
} from "lucide-react";

export function VisualLanguageV21() {
  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#151413] font-sans selection:bg-[#151413] selection:text-[#F8F6F0] p-6 sm:p-12">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* En-tête de la planche de synthèse */}
        <header className="border-b border-[#151413]/12 pb-6">
          <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-[#6B6760] font-semibold mb-2">
            <span>RentReady Design System</span>
            <span>·</span>
            <span>Spécification V2.1</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#151413] font-normal tracking-tight">
            Langage Visuel & Comportemental V2.1
          </h1>
          <p className="text-sm text-[#6B6760] mt-2 max-w-2xl leading-relaxed">
            Synthèse durcie du système après stress-tests de densité de portefeuille (10 logements),
            d'exceptions multiples, de contenus longs et de formats mobiles étroits (360px).
            Le logiciel privilégie la rétraction mécanique et le silence visuel.
          </p>
        </header>

        {/* 1. TYPOGRAPHIE TRIPARTITE */}
        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-wider font-semibold text-[#6B6760] border-b border-[#151413]/10 pb-1.5">
            01 · Typographie Tripartite (Règles d'isolation strictes)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-[#FAF8F3] border border-[#151413]/10 space-y-2">
              <span className="text-[11px] font-semibold text-[#6B6760] uppercase tracking-wider block">
                Serif · Marque & Échéances
              </span>
              <p className="font-serif text-2xl text-[#151413]">Octobre 2026</p>
              <p className="text-xs text-[#6B6760] leading-relaxed">
                Réservée au mot-symbole et aux grands repères de page. Interdite dans les listes,
                boutons, formulaires ou badges fonctionnels.
              </p>
            </div>

            <div className="p-5 bg-[#FAF8F3] border border-[#151413]/10 space-y-2">
              <span className="text-[11px] font-semibold text-[#6B6760] uppercase tracking-wider block">
                Sans-serif · 90 % du logiciel
              </span>
              <p className="font-sans text-base font-semibold text-[#151413]">
                Studio Rue Oberkampf · Paris 11e
              </p>
              <p className="text-xs text-[#6B6760] leading-relaxed">
                Utilisée pour toute la circulation applicative : noms de biens, locataires, baux,
                boutons, statuts et explications.
              </p>
            </div>

            <div className="p-5 bg-[#FAF8F3] border border-[#151413]/10 space-y-2">
              <span className="text-[11px] font-semibold text-[#6B6760] uppercase tracking-wider block">
                Mono · Données Tabulaires
              </span>
              <p className="font-mono text-xl font-bold text-[#151413] tabular-nums">
                2 843,17&nbsp;€ <span className="text-xs text-[#166534] font-normal">✓ 02/10</span>
              </p>
              <p className="text-xs text-[#6B6760] leading-relaxed">
                Strictement cantonnée aux montants en euros, décimales alignées, dates d'encaissement et
                références d'actes. Zéro pollution sur le texte courant.
              </p>
            </div>
          </div>
        </section>

        {/* 2. SIGNATURE COMPORTEMENTALE : SILENCE & RÉTRACTATION */}
        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-wider font-semibold text-[#6B6760] border-b border-[#151413]/10 pb-1.5">
            02 · Signature Comportementale : Règle de l'Attention Proportionnée
          </h2>
          <div className="space-y-3">
            {/* Cas A : Exception Primaire (Actionable) */}
            <div className="p-4 bg-[#FFFDF9] border-l-4 border-l-[#C2410C] border-y border-r border-[#C2410C]/25">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C2410C] mt-1 shrink-0" />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C] block">
                      Exception Primaire Actionnable (3 Unités d'Attention · Déploiement)
                    </span>
                    <span className="text-sm font-bold text-[#151413]">
                      T2 Rue de la République · Nantes
                    </span>
                    <span className="text-xs text-[#6B6760] block">
                      Acompte perçu de 400 € · Solde restant : 400,00 €
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#151413] text-[#F8F6F0] text-xs font-semibold self-start sm:self-center"
                >
                  Marquer les 400 € reçus <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Cas B : Exception Secondaire (Retard / Attente) */}
            <div className="py-2.5 px-3 bg-[#FFFDF8] border-l-2 border-l-[#D97706] border-y border-r border-[#D97706]/20">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#D97706] shrink-0" />
                  <span className="text-xs text-[#151413] font-medium">
                    Studio Rue Gambetta · Lille — Retard de paiement (échéance au 05/10)
                  </span>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-[11px] text-[#151413] bg-[#EDEAE0] px-2 py-0.5 font-medium"
                >
                  <Send className="w-3 h-3" /> Relancer
                </button>
              </div>
            </div>

            {/* Cas C : Calme / Résolu (1 unité d'attention) */}
            <div className="py-2.5 px-3 bg-transparent border-y border-[#151413]/10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#166534] shrink-0" />
                <span className="text-xs text-[#151413] font-medium">
                  Studio Rue Oberkampf · Paris 11e — Camille Laurent · Bail meublé 1 an
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="font-mono text-[#151413] tabular-nums">750,00 €</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-[#166534] bg-[#166534]/10 px-2 py-0.5 border border-[#166534]/20">
                  <Check className="w-3 h-3" /> Quittance prête
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-[#6B6760] italic pt-1">
            Résoudre l'action rétracte mécaniquement la rangée de 105 px à 48 px (-54 % de hauteur).
            La couleur d'attention s'éteint totalement. Le calme est la seule récompense.
          </p>
        </section>

        {/* 3. PALETTE ÉMOTIONNELLE ET CONTRASTES WCAG */}
        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-wider font-semibold text-[#6B6760] border-b border-[#151413]/10 pb-1.5">
            03 · Palette Émotionnelle Validée WCAG AA
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs">
            <div className="p-3 bg-[#F8F6F0] border border-[#151413]/15">
              <span className="font-semibold block text-[#151413]">Fond Papier</span>
              <span className="font-mono text-[11px] text-[#6B6760]">#F8F6F0</span>
              <span className="text-[10px] text-[#6B6760] block mt-1">Confort visuel continu</span>
            </div>

            <div className="p-3 bg-[#151413] text-[#F8F6F0]">
              <span className="font-semibold block">Encre Profonde</span>
              <span className="font-mono text-[11px] opacity-80">#151413</span>
              <span className="text-[10px] opacity-70 block mt-1">Contraste 16.5:1</span>
            </div>

            <div className="p-3 bg-[#F0FDF4] border border-[#166534]/25">
              <span className="font-semibold block text-[#166534]">Vert Botanique</span>
              <span className="font-mono text-[11px] text-[#166534]">#166534</span>
              <span className="text-[10px] text-[#166534] block mt-1">Calme validé 6.2:1</span>
            </div>

            <div className="p-3 bg-[#FFF7ED] border border-[#C2410C]/25">
              <span className="font-semibold block text-[#C2410C]">Terracotta Vif</span>
              <span className="font-mono text-[11px] text-[#C2410C]">#C2410C</span>
              <span className="text-[10px] text-[#C2410C] block mt-1">Attention 4.9:1</span>
            </div>

            <div className="p-3 bg-[#FFFBEB] border border-[#D97706]/25">
              <span className="font-semibold block text-[#D97706]">Ambre Délai</span>
              <span className="font-mono text-[11px] text-[#D97706]">#D97706</span>
              <span className="text-[10px] text-[#D97706] block mt-1">Retard secondaire</span>
            </div>
          </div>
        </section>

        {/* 4. REGISTRE DOCUMENTAIRE VS CARD SOUP */}
        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-wider font-semibold text-[#6B6760] border-b border-[#151413]/10 pb-1.5">
            04 · Registre Documentaire Structuré (Remplacement définitif de la Card Soup)
          </h2>
          <div className="bg-[#FAF8F3] border border-[#151413]/10 divide-y divide-[#151413]/10 text-xs">
            <div className="px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-[#6B6760]" />
                <span className="font-semibold text-[#151413]">Contrat de bail d'habitation</span>
                <span className="text-[#6B6760]">· Signé le 01/10/2025 · PDF 2.4 Mo</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-[#166534] bg-[#166534]/10 px-2 py-0.5 border border-[#166534]/20">
                  Actif
                </span>
                <span className="underline font-medium cursor-pointer">Télécharger</span>
              </div>
            </div>

            <div className="px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-[#6B6760]" />
                <span className="font-semibold text-[#151413]">Quittance de loyer (octobre 2026)</span>
                <span className="text-[#6B6760]">· Émise le 07/10/2026 · PDF 122 Ko</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-[#166534] bg-[#166534]/10 px-2 py-0.5 border border-[#166534]/20">
                  Libératoire
                </span>
                <span className="underline font-medium cursor-pointer">Télécharger</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-[#6B6760]">
            Format extensible de 3 à 50 documents sans rupture de mise en page. Économie de 40 % d'espace
            vertical par rapport aux cartes autonomes.
          </p>
        </section>
      </div>
    </div>
  );
}
