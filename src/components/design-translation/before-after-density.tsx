"use client";

import React from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  AlertCircle,
  XCircle,
} from "lucide-react";

export function BeforeAfterDensity() {
  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#151413] font-sans selection:bg-[#151413] selection:text-[#F8F6F0] p-6 sm:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header de la planche */}
        <header className="border-b border-[#151413]/12 pb-6">
          <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-[#6B6760] font-semibold mb-2">
            <span>Planche Comparative · Maturation Produit</span>
            <span>·</span>
            <span>Planche 14</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#151413] font-normal tracking-tight">
            Comparaison de Densité : B+ V2 vs B+ V2.1
          </h1>
          <p className="text-sm text-[#6B6760] mt-2 max-w-3xl leading-relaxed">
            Démonstration des 4 zones critiques corrigées lors des stress-tests de Red Team Design :
            suppression des artefacts de démonstration, élimination des sections redondantes,
            remplacement de la « document soup » par un registre linéaire, et compaction du premier viewport mobile.
          </p>
        </header>

        {/* 1. COMPARAISON DOCUMENTS HOME BASE */}
        <section className="space-y-4">
          <div className="flex items-baseline justify-between border-b border-[#151413]/10 pb-1.5">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-[#6B6760]">
              Zone 1 · Documents du Logement (Home Base)
            </h2>
            <span className="text-xs font-medium text-[#166534]">Gain mesuré : -40 % de hauteur</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* AVANT B+ V2 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#C2410C]">
                <XCircle className="w-4 h-4" />
                <span>Avant (B+ V2) : « Document Soup » (Cartes carrées autonomes)</span>
              </div>
              <p className="text-[11px] text-[#6B6760]">
                Trois grands blocs rectangulaires (`140 px` de haut). Format figé ne pouvant pas
                passer à 5 ou 10 pièces sans saturer la vue.
              </p>
              <div className="grid grid-cols-3 gap-2.5 text-[11px] opacity-75">
                <div className="p-3 bg-[#FAF8F3] border border-[#151413]/15 h-28 flex flex-col justify-between">
                  <div>
                    <span className="font-semibold block truncate">Bail meublé</span>
                    <span className="text-[10px] text-[#6B6760]">Signé</span>
                  </div>
                  <span className="underline text-[10px]">Télécharger</span>
                </div>
                <div className="p-3 bg-[#FAF8F3] border border-[#151413]/15 h-28 flex flex-col justify-between">
                  <div>
                    <span className="font-semibold block truncate">État des lieux</span>
                    <span className="text-[10px] text-[#6B6760]">Entrée</span>
                  </div>
                  <span className="underline text-[10px]">Télécharger</span>
                </div>
                <div className="p-3 bg-[#FAF8F3] border border-[#151413]/15 h-28 flex flex-col justify-between">
                  <div>
                    <span className="font-semibold block truncate">Quittance</span>
                    <span className="text-[10px] text-[#6B6760]">Octobre</span>
                  </div>
                  <span className="underline text-[10px]">Télécharger</span>
                </div>
              </div>
            </div>

            {/* APRÈS B+ V2.1 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#166534]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Après (B+ V2.1) : Registre Documentaire Structuré</span>
              </div>
              <p className="text-[11px] text-[#6B6760]">
                Tableau linéaire haute densité (`42 px` par ligne). Extensible de 3 à 50 documents,
                statut de validité explicite et téléchargement direct.
              </p>
              <div className="bg-[#FAF8F3] border border-[#151413]/10 divide-y divide-[#151413]/10 text-xs">
                <div className="px-3 py-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-3.5 h-3.5 text-[#6B6760] shrink-0" />
                    <span className="font-semibold text-[#151413] truncate">Bail d'habitation</span>
                    <span className="text-[11px] text-[#6B6760] hidden sm:inline">· Signé le 01/10/25</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-[#166534] bg-[#166534]/10 px-1.5 py-0.5 border border-[#166534]/20">
                      Actif
                    </span>
                    <span className="text-[11px] underline">PDF</span>
                  </div>
                </div>

                <div className="px-3 py-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-3.5 h-3.5 text-[#6B6760] shrink-0" />
                    <span className="font-semibold text-[#151413] truncate">État des lieux</span>
                    <span className="text-[11px] text-[#6B6760] hidden sm:inline">· 14 photos</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-[#166534] bg-[#166534]/10 px-1.5 py-0.5 border border-[#166534]/20">
                      Certifié
                    </span>
                    <span className="text-[11px] underline">PDF</span>
                  </div>
                </div>

                <div className="px-3 py-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-3.5 h-3.5 text-[#6B6760] shrink-0" />
                    <span className="font-semibold text-[#151413] truncate">Quittance octobre</span>
                    <span className="text-[11px] text-[#6B6760] hidden sm:inline">· Reçu acompte</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-[#C2410C] bg-[#C2410C]/10 px-1.5 py-0.5 border border-[#C2410C]/25">
                      Partiel
                    </span>
                    <span className="text-[11px] underline">PDF</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. COMPARAISON FOOTPRINT DASHBOARD */}
        <section className="space-y-4">
          <div className="flex items-baseline justify-between border-b border-[#151413]/10 pb-1.5">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-[#6B6760]">
              Zone 2 · Pied de Dashboard & Contacts Redondants
            </h2>
            <span className="text-xs font-medium text-[#166534]">Gain mesuré : -220 px de scroll inutile</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#C2410C]">
                <XCircle className="w-4 h-4" />
                <span>Avant (B+ V2) : Annuaire de contacts greffé sur le dashboard</span>
              </div>
              <p className="text-[11px] text-[#6B6760]">
                Grille de cartes `CONTACTS LOCATAIRES` en bas de page. Avec 10 biens, imposait 10 cartes
                redondantes alors que le rôle mensuel du dashboard est le suivi des encaissements.
              </p>
              <div className="p-3 bg-[#F1EEE4] border border-[#151413]/10 text-xs opacity-75">
                <span className="font-semibold block text-[#6B6760] text-[10px] uppercase">
                  Contacts Locataires (3) — Inutile au JTBD du mois
                </span>
                <div className="grid grid-cols-3 gap-2 mt-2 text-[10px]">
                  <div className="p-1.5 bg-white border border-stone-200">Camille L.</div>
                  <div className="p-1.5 bg-white border border-stone-200">Alexandre M.</div>
                  <div className="p-1.5 bg-white border border-stone-200">Éléonore M.</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#166534]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Après (B+ V2.1) : Clôture Épurée & Rôle Préservé</span>
              </div>
              <p className="text-[11px] text-[#6B6760]">
                Suppression de la section superflue. L'accès aux fiches locataires se fait via le menu ou
                la Home Base. Le dashboard se concentre à 100 % sur l'apaisement du mois.
              </p>
              <div className="p-3 bg-[#FAF8F3] border border-[#151413]/10 text-center text-xs">
                <span className="text-[#6B6760] text-[11px]">
                  ✓ 10 logements sous gestion directe · Conforme loi Alur & art. 21 loi 89
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. COMPARAISON EN-TÊTE ET CONTRÔLES DÉMO */}
        <section className="space-y-4">
          <div className="flex items-baseline justify-between border-b border-[#151413]/10 pb-1.5">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-[#6B6760]">
              Zone 3 · Header Mobile & Contrôles Démo
            </h2>
            <span className="text-xs font-medium text-[#166534]">Pureté logicielle rétablie</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#C2410C]">
                <XCircle className="w-4 h-4" />
                <span>Avant (B+ V2) : Boutons de commutation d'état dans le header</span>
              </div>
              <p className="text-[11px] text-[#6B6760]">
                Pills `[1 exception (400 €)] [Tout réglé]` affichées directement dans le header,
                parasitant la hauteur et polluant l'interface produit réelle.
              </p>
              <div className="p-2.5 bg-[#EDEAE0] border border-[#151413]/10 flex items-center justify-between text-xs opacity-75">
                <span className="font-serif italic font-bold">RentReady</span>
                <span className="bg-[#151413] text-white text-[10px] px-2 py-0.5">Toggle Démo</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#166534]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Après (B+ V2.1) : Header Applicatif Authentique</span>
              </div>
              <p className="text-[11px] text-[#6B6760]">
                Header strict : Mot-symbole, navigation, pastille utilisateur. Tous les commutateurs
                artificiels sont éliminés des planches de production.
              </p>
              <div className="p-2.5 bg-[#F8F6F0] border border-[#151413]/10 flex items-center justify-between text-xs">
                <span className="font-serif italic font-semibold text-base">RentReady</span>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#151413] text-white flex items-center justify-center text-[10px] font-bold">
                    TR
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
