"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calculator,
  Check,
  CheckCircle2,
  ChevronDown,
  Download,
  ExternalLink,
  FileCheck,
  FileText,
  HelpCircle,
  Lock,
  MapPin,
  RefreshCw,
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { OFFICIAL_IRL_DATA } from "../types";

/* ────────────────────────────────────────────────────────────────────────── */
/* 1. HOMEPAGE COMPONENT (H3 EXCEPTION DEMO / H1 PRODUCT FIRST / H2 OUTCOME)  */
/* ────────────────────────────────────────────────────────────────────────── */

interface HomepageProps {
  composition?: "h3" | "h1" | "h2";
  onSelectMode: (mode: any) => void;
  isMobile?: boolean;
}

export function B1HomepageView({
  composition = "h3",
  onSelectMode,
  isMobile = false,
}: HomepageProps) {
  const [nantesSettled, setNantesSettled] = useState(false);
  const [currentComp, setCurrentComp] = useState<"h3" | "h1" | "h2">(composition);

  return (
    <div className="space-y-16 pb-20">
      {/* Composition Switcher Bar (For Design Reviewers) */}
      <div className="bg-white rounded-lg border border-[#E5E2DA] p-2 flex items-center justify-between text-xs shadow-sm">
        <span className="text-[#7C8782] font-medium hidden sm:inline">
          Épreuve de Composition :
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentComp("h3")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              currentComp === "h3"
                ? "bg-[#1E3A2F] text-white"
                : "text-[#5A6660] hover:bg-[#ECEAE4]"
            }`}
          >
            H3 · Exception Demo (Recommandé)
          </button>
          <button
            onClick={() => setCurrentComp("h1")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              currentComp === "h1"
                ? "bg-[#1E3A2F] text-white"
                : "text-[#5A6660] hover:bg-[#ECEAE4]"
            }`}
          >
            H1 · Product First
          </button>
          <button
            onClick={() => setCurrentComp("h2")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              currentComp === "h2"
                ? "bg-[#1E3A2F] text-white"
                : "text-[#5A6660] hover:bg-[#ECEAE4]"
            }`}
          >
            H2 · Outcome First
          </button>
        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <section className="pt-4 sm:pt-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Metadata pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#E5E2DA] rounded-full text-xs text-[#5A6660] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#1E3A2F]" />
            <span>Logiciel d'intendance foncière · Conforme Loi du 6 juillet 1989</span>
          </div>

          {/* Headline according to composition */}
          {currentComp === "h3" && (
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#15241F] leading-[1.12]">
              Tout ce qui va bien devient silencieux. <br className="hidden sm:inline" />
              <span className="text-[#1E3A2F]">Seule l'exception demande votre attention.</span>
            </h1>
          )}

          {currentComp === "h1" && (
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#15241F] leading-[1.12]">
              L'intendance de vos loyers, <br className="hidden sm:inline" />
              <span className="text-[#1E3A2F]">tenue avec la rigueur d'un grand livre.</span>
            </h1>
          )}

          {currentComp === "h2" && (
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#15241F] leading-[1.12]">
              Ne laissez plus un loyer en suspens <br className="hidden sm:inline" />
              <span className="text-[#1E3A2F]">ni une révision légale s'envoler.</span>
            </h1>
          )}

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#5A6660] max-w-2xl mx-auto leading-relaxed">
            Suivez vos encaissements réels, délivrez vos quittances conformes en un clic et révisez
            vos baux à l'indice INSEE officiel. Sans tableur bricolé ni commission d'agence.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onSelectMode("register_1440")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#1E3A2F] hover:bg-[#172F26] rounded-lg shadow-[0_1px_2px_rgba(21,36,31,0.2),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all active:scale-[0.98]"
            >
              <span>Commencer avec vos biens — Gratuit 14 jours</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectMode("free_tool_1440")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium text-[#15241F] bg-white border border-[#E5E2DA] hover:bg-[#F5F3EF] rounded-lg transition-colors"
            >
              <Calculator className="w-4 h-4 text-[#5A6660]" />
              <span>Tester le simulateur IRL gratuit</span>
            </button>
          </div>
        </div>

        {/* ── LIVE INTERACTIVE PRODUCT SHOWCASE IN HERO ── */}
        <div className="max-w-5xl mx-auto mt-12 bg-white rounded-2xl border border-[#D4CFC4] shadow-md p-4 sm:p-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E2DA]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E3A2F]" />
              <span className="font-semibold text-sm text-[#15241F]">
                Grand Livre d'Arrêté · Octobre 2026
              </span>
              <span className="text-xs text-[#7C8782] hidden sm:inline">
                (Démonstration interactive en direct)
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#5A6660]">Testez l'action :</span>
              <button
                onClick={() => setNantesSettled(!nantesSettled)}
                className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-all ${
                  nantesSettled
                    ? "bg-[#ECEAE4] text-[#15241F] hover:bg-[#E5E2DA]"
                    : "bg-[#1E3A2F] text-white hover:bg-[#172F26]"
                }`}
              >
                {nantesSettled ? "Réouvrir l'anomalie Nantes" : "Pointer le solde de 400 €"}
              </button>
            </div>
          </div>

          {/* Three units in the Hero showcase */}
          <div className="divide-y divide-[#E5E2DA] border border-[#E5E2DA] rounded-xl overflow-hidden">
            {/* Unit 1: Paris (Calm) */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-white text-xs">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#236B47]" />
                <div>
                  <span className="font-semibold text-[#15241F] text-sm">Paris 11e</span>
                  <span className="text-[#7C8782] ml-2">Studio 24 m² · Camille Renoir</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-[#15241F] tabular-nums">680,00 €</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-[#EEF7F2] text-[#236B47] rounded-full border border-[#C6E7D3]">
                  ✓ Réglé
                </span>
              </div>
            </div>

            {/* Unit 2: Lyon (Calm) */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-white text-xs">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#236B47]" />
                <div>
                  <span className="font-semibold text-[#15241F] text-sm">Lyon 3e</span>
                  <span className="text-[#7C8782] ml-2">T3 68 m² · Élodie Vasseur</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-[#15241F] tabular-nums">1 150,00 €</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-[#EEF7F2] text-[#236B47] rounded-full border border-[#C6E7D3]">
                  ✓ Réglé
                </span>
              </div>
            </div>

            {/* Unit 3: Nantes (Interactive Exception / Resolved state) */}
            {nantesSettled ? (
              /* Resolved state: Compact 42px row */
              <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-[#EEF7F2]/40 text-xs transition-all duration-300">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#236B47]" />
                  <div>
                    <span className="font-semibold text-[#15241F] text-sm">Nantes Centre</span>
                    <span className="text-[#7C8782] ml-2">T2 54 m² · Alexandre de La Tour</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-[#236B47] tabular-nums">850,00 €</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-[#EEF7F2] text-[#236B47] rounded-full border border-[#C6E7D3]">
                    ✓ Réglé · Quittance émise
                  </span>
                </div>
              </div>
            ) : (
              /* Active exception: Expanded tactile card */
              <div className="p-4 sm:p-5 bg-[#FDF6ED] border-l-4 border-l-[#C86D2C] transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-white text-[#C86D2C] border border-[#F5D6B5]">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Solde partiel dû</span>
                      </span>
                      <span className="font-semibold text-sm text-[#15241F]">
                        Nantes Centre — T2 54 m²
                      </span>
                    </div>
                    <div className="text-xs text-[#C86D2C] font-medium">
                      Virement incomplet reçu le 03/10 (450,00 € perçus sur 850,00 € attendus).
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5">
                    <div className="text-right">
                      <div className="text-xs text-[#5A6660]">Reste à percevoir :</div>
                      <div className="text-base font-semibold text-[#C86D2C] tabular-nums">
                        400,00 €
                      </div>
                    </div>

                    <button
                      onClick={() => setNantesSettled(true)}
                      className="px-3.5 py-2 bg-[#1E3A2F] text-white text-xs font-semibold rounded-lg hover:bg-[#172F26] shadow-sm transition-all"
                    >
                      Pointer le solde
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── SECTION 2: THE CORE CYCLE (CALM -> ATTENTION -> RESOLVED) ── */}
      <section className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7C8782]">
            Signature d'intendance
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#15241F] tracking-tight">
            Pourquoi RentReady ne ressemble à aucun autre logiciel
          </h2>
          <p className="text-sm text-[#5A6660] max-w-xl mx-auto">
            Nous avons banni les tableaux de bord surchargés d'alertes inutiles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-[#E5E2DA] p-6 space-y-3 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-[#EEF7F2] text-[#236B47] flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="font-semibold text-[#15241F] text-base">Le Calme est la Norme</h3>
            <p className="text-xs text-[#5A6660] leading-relaxed">
              Quand un loyer est payé à la date convenue, il ne vous dérange pas. Il prend la forme
              d'une ligne fine et discrète dans votre registre.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#E5E2DA] p-6 space-y-3 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-[#FDF6ED] text-[#C86D2C] flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="font-semibold text-[#15241F] text-base">L'Exception Prend la Place</h3>
            <p className="text-xs text-[#5A6660] leading-relaxed">
              Un virement partiel ou un retard ? La ligne se déploie en ambre miel, ventile le montant
              restant dû et vous propose l'action juste.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#E5E2DA] p-6 space-y-3 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-[#EEF4F1] text-[#1E3A2F] flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="font-semibold text-[#15241F] text-base">La Rétraction Silencieuse</h3>
            <p className="text-xs text-[#5A6660] leading-relaxed">
              Dès l'apurement saisi, la carte d'exception se referme doucement. Le silence revient
              dans votre gestion.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: FREE TOOLS GATEWAY ── */}
      <section className="max-w-5xl mx-auto bg-white rounded-2xl border border-[#E5E2DA] p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A2F]">
              Ressources Ouvertes & Gratuites
            </span>
            <h2 className="text-2xl font-semibold text-[#15241F] tracking-tight mt-1">
              Des calculateurs officiels à disposition de tous les bailleurs
            </h2>
          </div>
          <span className="text-xs text-[#7C8782]">Sans inscription préalable</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => onSelectMode("free_tool_1440")}
            className="p-5 rounded-xl border border-[#E5E2DA] bg-[#F5F3EF] hover:border-[#1E3A2F] cursor-pointer transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#15241F] text-sm group-hover:text-[#1E3A2F]">
                Calculateur IRL 2026 (INSEE)
              </span>
              <ArrowRight className="w-4 h-4 text-[#7C8782] group-hover:text-[#1E3A2F] group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-[#5A6660] leading-relaxed">
              Calculez la hausse légale de votre loyer avec les indices trimestriels officiels publiés
              au Journal officiel.
            </p>
          </div>

          <div
            onClick={() => onSelectMode("free_tool_quittance_1440")}
            className="p-5 rounded-xl border border-[#E5E2DA] bg-[#F5F3EF] hover:border-[#1E3A2F] cursor-pointer transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#15241F] text-sm group-hover:text-[#1E3A2F]">
                Générateur de Quittance Conforme
              </span>
              <ArrowRight className="w-4 h-4 text-[#7C8782] group-hover:text-[#1E3A2F] group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-[#5A6660] leading-relaxed">
              Éditez une décharge légale conforme à l'article 21 de la Loi du 6 juillet 1989 prête à
              télécharger.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: TRANSPARENT PRICING PREVIEW ── */}
      <section className="max-w-4xl mx-auto text-center space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7C8782]">
            Tarifs Clairs & Vérifiés
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#15241F] tracking-tight mt-1">
            Un abonnement transparent. Zéro commission cachée.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
          {/* Starter Plan */}
          <div className="bg-white rounded-xl border border-[#E5E2DA] p-6 space-y-4 shadow-sm">
            <div>
              <span className="font-semibold text-base text-[#15241F]">Starter</span>
              <div className="text-2xl font-semibold text-[#15241F] tabular-nums mt-1">
                9,00 € <span className="text-xs text-[#7C8782] font-normal">/ mois</span>
              </div>
              <p className="text-xs text-[#5A6660] mt-1">Ou 89 € / an facturé annuellement.</p>
            </div>
            <ul className="text-xs text-[#5A6660] space-y-2 pb-2">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#236B47]" />
                <span>Jusqu'à 3 logements</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#236B47]" />
                <span>Quittances de loyer conformes</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#236B47]" />
                <span>Suivi mensuel des échéances</span>
              </li>
            </ul>
            <button
              onClick={() => onSelectMode("pricing_1440")}
              className="w-full py-2 bg-[#F5F3EF] hover:bg-[#ECEAE4] text-xs font-semibold text-[#15241F] rounded-lg transition-colors border border-[#E5E2DA]"
            >
              Voir le détail du plan Starter
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-xl border-2 border-[#1E3A2F] p-6 space-y-4 shadow-sm relative">
            <div className="absolute top-4 right-4 text-[10px] font-semibold text-[#1E3A2F] bg-[#EEF4F1] px-2 py-0.5 rounded-full">
              Recommandé
            </div>
            <div>
              <span className="font-semibold text-base text-[#15241F]">Pro</span>
              <div className="text-2xl font-semibold text-[#15241F] tabular-nums mt-1">
                15,00 € <span className="text-xs text-[#7C8782] font-normal">/ mois</span>
              </div>
              <p className="text-xs text-[#5A6660] mt-1">
                Ou 149 € / an (2 mois offerts).
              </p>
            </div>
            <ul className="text-xs text-[#5A6660] space-y-2 pb-2">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#1E3A2F]" />
                <span className="font-medium text-[#15241F]">Jusqu'à 10 logements</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#1E3A2F]" />
                <span>Quittances automatiques illimitées</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#1E3A2F]" />
                <span>Calcul automatique des révisions IRL</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#1E3A2F]" />
                <span>Export comptable FEC / CSV</span>
              </li>
            </ul>
            <button
              onClick={() => onSelectMode("pricing_1440")}
              className="w-full py-2 bg-[#1E3A2F] hover:bg-[#172F26] text-xs font-semibold text-white rounded-lg transition-colors shadow-sm"
            >
              Comparer les forfaits
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: SOVEREIGN TRUST & LEGAL COMMITMENT ── */}
      <section className="max-w-4xl mx-auto border-t border-[#E5E2DA] pt-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs">
          <div className="space-y-1">
            <span className="font-semibold text-[#15241F] block text-sm">Hébergement Français</span>
            <p className="text-[#7C8782]">Données hébergées en France (OVHcloud, Gravelines). Respect strict du RGPD.</p>
          </div>
          <div className="space-y-1">
            <span className="font-semibold text-[#15241F] block text-sm">Loi du 6 juillet 1989</span>
            <p className="text-[#7C8782]">Modèles de baux conformes loi Alur et quittances conformes à l'art. 21.</p>
          </div>
          <div className="space-y-1">
            <span className="font-semibold text-[#15241F] block text-sm">Zéro Engagement</span>
            <p className="text-[#7C8782]">Résiliable en 1 clic à tout moment depuis votre espace. Vos données restent vôtres.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 2. PRICING VIEW COMPONENT                                                  */
/* ────────────────────────────────────────────────────────────────────────── */

export function B1PricingView({ onSelectMode }: { onSelectMode: (mode: any) => void }) {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16">
      <div className="text-center space-y-4 pt-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#7C8782]">
          Tarification RentReady
        </span>
        <h1 className="text-3xl sm:text-4xl font-semibold text-[#15241F] tracking-tight">
          Un prix juste, proportionné à votre patrimoine.
        </h1>
        <p className="text-sm text-[#5A6660] max-w-lg mx-auto">
          Zéro pourcentage prélevé sur vos loyers. Pas de frais de mise en service.
        </p>

        {/* Annual / Monthly Toggle */}
        <div className="inline-flex items-center gap-2 p-1 bg-white border border-[#E5E2DA] rounded-lg text-xs shadow-2xs">
          <button
            onClick={() => setAnnual(false)}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              !annual ? "bg-[#1E3A2F] text-white" : "text-[#5A6660]"
            }`}
          >
            Facturation mensuelle
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              annual ? "bg-[#1E3A2F] text-white" : "text-[#5A6660]"
            }`}
          >
            Facturation annuelle <span className="text-[10px] text-[#A3E635] ml-1 font-semibold">(2 mois offerts)</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
        {/* Starter */}
        <div className="bg-white rounded-xl border border-[#E5E2DA] p-6 space-y-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-[#15241F]">Starter</h2>
            <p className="text-xs text-[#5A6660] mt-1">Idéal pour démarrer avec 1 à 3 logements.</p>
            <div className="mt-4">
              <span className="text-3xl font-semibold text-[#15241F] tabular-nums">
                {annual ? "89,00 €" : "9,00 €"}
              </span>
              <span className="text-xs text-[#7C8782] ml-1">
                {annual ? "/ an (soit 7,42 €/mois)" : "/ mois"}
              </span>
            </div>
          </div>

          <ul className="text-xs text-[#5A6660] space-y-3 pb-2 border-t border-[#E5E2DA] pt-4">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#236B47]" />
              <span>Jusqu'à 3 biens gérés</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#236B47]" />
              <span>Quittances de loyer conformes Art. 21</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#236B47]" />
              <span>Suivi d'arrêté des échéances</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#236B47]" />
              <span>Hébergement sécurisé France (OVHcloud)</span>
            </li>
          </ul>

          <button
            onClick={() => onSelectMode("register_1440")}
            className="w-full py-2.5 bg-[#F5F3EF] hover:bg-[#ECEAE4] text-xs font-semibold text-[#15241F] rounded-lg border border-[#E5E2DA] transition-colors"
          >
            Choisir le plan Starter
          </button>
        </div>

        {/* Pro */}
        <div className="bg-white rounded-xl border-2 border-[#1E3A2F] p-6 space-y-6 shadow-md relative">
          <div className="absolute top-4 right-4 text-[11px] font-semibold text-[#1E3A2F] bg-[#EEF4F1] px-2.5 py-0.5 rounded-full border border-[#C6E7D3]">
            Le plus populaire
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#15241F]">Pro</h2>
            <p className="text-xs text-[#5A6660] mt-1">Gestion complète pour propriétaires bailleurs.</p>
            <div className="mt-4">
              <span className="text-3xl font-semibold text-[#15241F] tabular-nums">
                {annual ? "149,00 €" : "15,00 €"}
              </span>
              <span className="text-xs text-[#7C8782] ml-1">
                {annual ? "/ an (soit 12,41 €/mois)" : "/ mois"}
              </span>
            </div>
          </div>

          <ul className="text-xs text-[#5A6660] space-y-3 pb-2 border-t border-[#E5E2DA] pt-4">
            <li className="flex items-center gap-2 font-medium text-[#15241F]">
              <Check className="w-4 h-4 text-[#1E3A2F]" />
              <span>Jusqu'à 10 biens gérés</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#1E3A2F]" />
              <span>Quittances automatiques illimitées</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#1E3A2F]" />
              <span>Calcul automatique des révisions IRL INSEE</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#1E3A2F]" />
              <span>Export comptable certifié FEC / CSV</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#1E3A2F]" />
              <span>Support prioritaire par email</span>
            </li>
          </ul>

          <button
            onClick={() => onSelectMode("register_1440")}
            className="w-full py-2.5 bg-[#1E3A2F] hover:bg-[#172F26] text-xs font-semibold text-white rounded-lg shadow-sm transition-colors"
          >
            Choisir le plan Pro — Essai 14 jours
          </button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 3. FREE TOOL: IRL CALCULATOR COMPONENT                                     */
/* ────────────────────────────────────────────────────────────────────────── */

export function B1FreeToolIRLView({ onSelectMode }: { onSelectMode: (mode: any) => void }) {
  const [rent, setRent] = useState(800);
  const [oldQuarter, setOldQuarter] = useState("T2 2025");
  const [newQuarter, setNewQuarter] = useState("T2 2026");

  const oldIndex = OFFICIAL_IRL_DATA.find((d) => d.quarter === oldQuarter)?.value || 146.68;
  const newIndex = OFFICIAL_IRL_DATA.find((d) => d.quarter === newQuarter)?.value || 148.37;

  const revisedRent = Math.round((rent * (newIndex / oldIndex)) * 100) / 100;
  const diffMonth = Math.round((revisedRent - rent) * 100) / 100;
  const diffYear = Math.round(diffMonth * 12 * 100) / 100;

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Tool Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#7C8782]">
          <span>Outils Gratuits</span>
          <span>·</span>
          <span>Série Officielle INSEE n° 001515333</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#15241F] tracking-tight">
          Calculateur de Révision de Loyer IRL 2026
        </h1>
        <p className="text-xs sm:text-sm text-[#5A6660]">
          Formule officielle : <code>Loyer révisé = Loyer actuel × (Nouvel IRL / Ancien IRL)</code>
        </p>
      </div>

      {/* Interactive Calculator Box */}
      <div className="bg-white rounded-xl border border-[#E5E2DA] p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-[#5A6660] font-medium mb-1.5">
              Loyer actuel hors charges (€)
            </label>
            <input
              type="number"
              value={rent}
              onChange={(e) => setRent(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-[#E5E2DA] rounded-lg font-semibold text-[#15241F] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
            />
          </div>

          <div>
            <label className="block text-[#5A6660] font-medium mb-1.5">
              Trimestre précédent (Bail initial)
            </label>
            <select
              value={oldQuarter}
              onChange={(e) => setOldQuarter(e.target.value)}
              className="w-full px-3 py-2 bg-[#F5F3EF] border border-[#E5E2DA] rounded-lg font-medium text-[#15241F] focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
            >
              {OFFICIAL_IRL_DATA.map((d) => (
                <option key={d.quarter} value={d.quarter}>
                  {d.quarter} (Valeur : {d.value})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[#5A6660] font-medium mb-1.5">
              Trimestre de révision en vigueur
            </label>
            <select
              value={newQuarter}
              onChange={(e) => setNewQuarter(e.target.value)}
              className="w-full px-3 py-2 bg-[#F5F3EF] border border-[#E5E2DA] rounded-lg font-medium text-[#15241F] focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
            >
              {OFFICIAL_IRL_DATA.map((d) => (
                <option key={d.quarter} value={d.quarter}>
                  {d.quarter} (Valeur : {d.value})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Calculated Result Card */}
        <div className="bg-[#EEF7F2] rounded-xl border border-[#C6E7D3] p-5 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#236B47]">
            Résultat Légal Conforme
          </span>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <div className="text-3xl font-semibold text-[#15241F] tabular-nums">
                {revisedRent.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                <span className="text-xs text-[#5A6660] font-normal ml-2">/ mois</span>
              </div>
              <p className="text-xs text-[#236B47] mt-1 font-medium">
                Variation légale : +{diffMonth} €/mois (+{diffYear} €/an)
              </p>
            </div>

            <div className="text-xs text-[#5A6660] font-mono">
              Calcul : {rent} × ({newIndex} / {oldIndex})
            </div>
          </div>
        </div>

        {/* ── CONTEXTUAL RENTREADY BRIDGE (NOT GENERIC CTA) ── */}
        <div className="bg-[#F5F3EF] rounded-xl border border-[#D4CFC4] p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1E3A2F]" />
            <h3 className="font-semibold text-sm text-[#15241F]">
              Ne perdez plus jamais une révision de loyer annuelle
            </h3>
          </div>
          <p className="text-xs text-[#5A6660] leading-relaxed">
            En droit français, une révision non notifiée à la date anniversaire est définitivement
            perdue pour l'année écoulée (aucun rappel rétroactif n'est permis par l'article 17-1 de
            la loi du 6 juillet 1989).
          </p>
          <div className="pt-1">
            <button
              onClick={() => onSelectMode("register_1440")}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1E3A2F] hover:bg-[#172F26] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <span>Mémoriser ce bail sur RentReady pour surveiller la révision</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 4. FREE TOOL: QUITTANCE GENERATOR                                          */
/* ────────────────────────────────────────────────────────────────────────── */

export function B1FreeToolQuittanceView({ onSelectMode }: { onSelectMode: (mode: any) => void }) {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#7C8782]">
          <span>Outils Gratuits</span>
          <span>·</span>
          <span>Article 21 de la Loi du 6 juillet 1989</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#15241F] tracking-tight">
          Générateur de Quittance de Loyer Gratuite
        </h1>
        <p className="text-xs sm:text-sm text-[#5A6660]">
          Décharge légale attestant du paiement intégral du loyer et des provisions sur charges
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left: Input Form */}
        <div className="md:col-span-5 bg-white rounded-xl border border-[#E5E2DA] p-5 shadow-sm space-y-4 text-xs">
          <h2 className="font-semibold text-sm text-[#15241F]">Mentions Légales Requises</h2>

          <div>
            <label className="block text-[#5A6660] font-medium mb-1">Nom du propriétaire bailleur</label>
            <input
              type="text"
              defaultValue="Mme Claire Delacroix"
              className="w-full px-3 py-1.5 border border-[#E5E2DA] rounded-lg text-[#15241F]"
            />
          </div>

          <div>
            <label className="block text-[#5A6660] font-medium mb-1">Nom du locataire</label>
            <input
              type="text"
              defaultValue="M. Alexandre de La Tour"
              className="w-full px-3 py-1.5 border border-[#E5E2DA] rounded-lg text-[#15241F]"
            />
          </div>

          <div>
            <label className="block text-[#5A6660] font-medium mb-1">Adresse du logement loué</label>
            <input
              type="text"
              defaultValue="14 bis av. de Lattre, 44000 Nantes"
              className="w-full px-3 py-1.5 border border-[#E5E2DA] rounded-lg text-[#15241F]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[#5A6660] font-medium mb-1">Loyer nu (€)</label>
              <input
                type="number"
                defaultValue={780}
                className="w-full px-3 py-1.5 border border-[#E5E2DA] rounded-lg text-[#15241F] tabular-nums"
              />
            </div>
            <div>
              <label className="block text-[#5A6660] font-medium mb-1">Charges (€)</label>
              <input
                type="number"
                defaultValue={70}
                className="w-full px-3 py-1.5 border border-[#E5E2DA] rounded-lg text-[#15241F] tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* Right: Live Preview of Document */}
        <div className="md:col-span-7 bg-white rounded-xl border border-[#D4CFC4] p-6 shadow-sm space-y-6">
          <div className="border-b border-[#E5E2DA] pb-4 flex items-center justify-between">
            <span className="font-serif text-lg font-semibold text-[#15241F]">QUITTANCE DE LOYER</span>
            <span className="text-xs text-[#7C8782] font-mono">OCTOBRE 2026</span>
          </div>

          <div className="text-xs space-y-3 leading-relaxed text-[#5A6660]">
            <p>
              Je soussigné(e), <strong>Mme Claire Delacroix</strong>, propriétaire du logement situé au{" "}
              <strong>14 bis av. de Lattre, 44000 Nantes</strong>, atteste avoir reçu de{" "}
              <strong>M. Alexandre de La Tour</strong> la somme totale de :
            </p>

            <div className="p-3 bg-[#F5F3EF] rounded-lg border border-[#E5E2DA] font-semibold text-[#15241F] flex justify-between tabular-nums">
              <span>Loyer net : 780,00 € + Provisions charges : 70,00 €</span>
              <span>Total : 850,00 €</span>
            </div>

            <p className="text-[11px] text-[#7C8782]">
              En vertu de l'article 21 de la Loi n° 89-462 du 6 juillet 1989, cette quittance porte décharge
              pour la période du 01/10/2026 au 31/10/2026 sous réserve de tous droits et actions.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-[#E5E2DA]">
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1E3A2F] text-white text-xs font-semibold rounded-lg shadow-sm">
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger la quittance PDF</span>
            </button>

            <button
              onClick={() => onSelectMode("register_1440")}
              className="text-xs text-[#1E3A2F] font-semibold hover:underline"
            >
              Automatiser l'envoi mensuel →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 5. SEO ARTICLE VIEW                                                        */
/* ────────────────────────────────────────────────────────────────────────── */

export function B1ArticleView({ onSelectMode }: { onSelectMode: (mode: any) => void }) {
  return (
    <article className="max-w-3xl mx-auto space-y-8 pb-16">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-[#7C8782]">
          <span>Guides Juridiques</span>
          <span>·</span>
          <span>Mis à jour le 5 octobre 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-[#15241F] tracking-tight leading-tight">
          Comment réviser un loyer avec l'IRL 2026 : règles, formule et délais légaux
        </h1>
        <p className="text-sm text-[#5A6660]">
          Par la rédaction juridique de RentReady · Validé selon la publication INSEE du Journal officiel.
        </p>
      </div>

      {/* Key Takeaways Box */}
      <div className="bg-[#ECEAE4] rounded-xl border border-[#D4CFC4] p-5 space-y-2 text-xs">
        <span className="font-semibold text-[#15241F] text-sm block">Ce qu'il faut retenir en 3 points :</span>
        <ul className="space-y-1.5 text-[#5A6660] list-disc pl-4">
          <li>La révision ne peut intervenir qu'une fois par an, à la date anniversaire du bail.</li>
          <li>Une clause de révision expresse doit obligatoirement figurer dans le contrat de location.</li>
          <li>Elle n'est jamais rétroactive : toute révision oubliée est définitivement perdue.</li>
        </ul>
      </div>

      {/* Article Body */}
      <div className="space-y-6 text-sm text-[#15241F] leading-relaxed">
        <p>
          L'Indice de Référence des Loyers (IRL) est publié chaque trimestre par l'INSEE. Il constitue
          le seul plafond légal d'augmentation des loyers pour les résidences principales du secteur privé
          en France métropolitaine.
        </p>

        <h2 className="text-xl font-semibold text-[#15241F] pt-4">La Formule de Calcul Officielle</h2>
        <p>
          Pour calculer le nouveau loyer applicable, multipliez le loyer actuel hors charges par le
          rapport entre le nouvel IRL et l'IRL de référence mentionné au contrat :
        </p>

        <div className="p-4 bg-white rounded-lg border border-[#E5E2DA] font-mono text-xs text-center text-[#1E3A2F]">
          Nouveau loyer = Loyer actuel × (IRL nouveau / IRL ancien)
        </div>

        {/* Legal Alert: Climate & Resilience Law (DPE F/G Ban) */}
        <div className="p-4 bg-[#FDF6ED] border-l-4 border-l-[#C86D2C] rounded-r-lg text-xs space-y-1">
          <span className="font-semibold text-[#C86D2C] block">Attention légale importante : Passoires thermiques</span>
          <p className="text-[#5A6660]">
            Depuis la loi Climat et Résilience, la révision annuelle du loyer est formellement interdite
            pour tout logement classé F ou G au Diagnostic de Performance Énergétique (DPE).
          </p>
        </div>
      </div>

      {/* Embedded Action Bridge */}
      <div className="bg-white rounded-xl border border-[#E5E2DA] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-[#15241F]">Calculez votre révision en 10 secondes</h3>
            <p className="text-xs text-[#5A6660]">Accédez à notre simulateur gratuit avec les indices INSEE à jour.</p>
          </div>
          <button
            onClick={() => onSelectMode("free_tool_1440")}
            className="px-4 py-2 bg-[#1E3A2F] text-white text-xs font-semibold rounded-lg hover:bg-[#172F26]"
          >
            Lancer le calculateur IRL →
          </button>
        </div>
      </div>
    </article>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 6. PROGRAMMATIC CITY PAGE VIEW                                             */
/* ────────────────────────────────────────────────────────────────────────── */

export function B1CityPageView({ onSelectMode }: { onSelectMode: (mode: any) => void }) {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-[#7C8782]">
          <span>Gestion Locative</span>
          <span>·</span>
          <span>Loire-Atlantique (44)</span>
        </div>
        <h1 className="text-3xl font-semibold text-[#15241F] tracking-tight">
          Gestion Locative à Nantes : Encadrement des Loyers & Baux Sécurisés
        </h1>
        <p className="text-sm text-[#5A6660]">
          Données du marché nantais 2026, arrêtés préfectoraux et automatisation pour les bailleurs indépendants.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-white rounded-xl border border-[#E5E2DA] space-y-1">
          <span className="text-[#7C8782]">Loyer Médian T2</span>
          <span className="text-xl font-semibold text-[#15241F] block tabular-nums">12,50 €/m²</span>
          <span className="text-[11px] text-[#5A6660]">Observatoire CLAMEUR 2025</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E5E2DA] space-y-1">
          <span className="text-[#7C8782]">Zone d'Encadrement</span>
          <span className="text-xl font-semibold text-[#236B47] block">Zone Tendue</span>
          <span className="text-[11px] text-[#5A6660]">Préavis réduit à 1 mois</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E5E2DA] space-y-1">
          <span className="text-[#7C8782]">Délai Moyen Relocation</span>
          <span className="text-xl font-semibold text-[#15241F] block">16 jours</span>
          <span className="text-[11px] text-[#5A6660]">Forte tension locative</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E2DA] p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-base text-[#15241F]">Gérer vos biens à Nantes avec RentReady</h2>
        <p className="text-xs text-[#5A6660] leading-relaxed">
          Que vous louiez un appartement cours des 50-Otages ou une maison à Saint-Félix, RentReady
          applique automatiquement les plafonds légaux de la métropole nantaise et génère des quittances
          conformes chaque mois.
        </p>
        <button
          onClick={() => onSelectMode("register_1440")}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1E3A2F] text-white text-xs font-semibold rounded-lg"
        >
          <span>Créer mon premier bien nantais</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 7. REGISTER / ONBOARDING VIEW                                              */
/* ────────────────────────────────────────────────────────────────────────── */

export function B1RegisterView({ onSelectMode }: { onSelectMode: (mode: any) => void }) {
  return (
    <div className="max-w-md mx-auto py-8 space-y-6">
      <div className="text-center space-y-2">
        <span className="font-sans text-xl font-semibold tracking-tight text-[#15241F]">
          RentReady
        </span>
        <h1 className="text-xl font-semibold text-[#15241F]">Ouvrez votre pupitre de gestion</h1>
        <p className="text-xs text-[#5A6660]">
          14 jours d'essai sans carte bancaire · Vos données hébergées en France
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E2DA] p-6 shadow-sm space-y-4 text-xs">
        <div>
          <label className="block text-[#5A6660] font-medium mb-1">Votre adresse email</label>
          <input
            type="email"
            placeholder="proprietaire@domaine.fr"
            className="w-full px-3 py-2 border border-[#E5E2DA] rounded-lg text-[#15241F] focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
          />
        </div>

        <div>
          <label className="block text-[#5A6660] font-medium mb-1">Mot de passe sécurisé</label>
          <input
            type="password"
            placeholder="••••••••••••"
            className="w-full px-3 py-2 border border-[#E5E2DA] rounded-lg text-[#15241F] focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
          />
        </div>

        <div>
          <label className="block text-[#5A6660] font-medium mb-1">Nombre de logements à gérer</label>
          <select className="w-full px-3 py-2 bg-[#F5F3EF] border border-[#E5E2DA] rounded-lg text-[#15241F]">
            <option>1 à 3 logements (Plan Starter)</option>
            <option>4 à 10 logements (Plan Pro)</option>
            <option>Plus de 10 logements</option>
          </select>
        </div>

        <button
          onClick={() => onSelectMode("dashboard_default_1440")}
          className="w-full py-2.5 bg-[#1E3A2F] hover:bg-[#172F26] text-white font-semibold rounded-lg shadow-sm transition-colors"
        >
          Créer mon compte et accéder au Grand Livre
        </button>

        <p className="text-[11px] text-[#7C8782] text-center pt-2">
          En vous inscrivant, vous acceptez les conditions générales d'utilisation conformes au droit français.
        </p>
      </div>
    </div>
  );
}
