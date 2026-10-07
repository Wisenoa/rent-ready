"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Download,
  FileText,
  User,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Mail,
  Phone,
  Clock,
  Sparkles,
} from "lucide-react";

interface HomebaseTranslationProps {
  initialProperty?: "nantes" | "paris";
  initialResolved?: boolean;
}

export function HomebaseTranslation({
  initialProperty = "nantes",
  initialResolved = false,
}: HomebaseTranslationProps) {
  const [selectedProperty, setSelectedProperty] = useState<"nantes" | "paris">(initialProperty);
  const [isResolved, setIsResolved] = useState(initialResolved);

  // Données du bien sélectionné
  const isNantes = selectedProperty === "nantes";
  const hasException = isNantes && !isResolved;

  const propertyData = isNantes
    ? {
        name: "T2 Rue de la République",
        city: "Nantes",
        surface: "48 m² · Meublé",
        rentBare: 700,
        charges: 100,
        rentTotal: 800,
        tenant: "Éléonore Moreau",
        tenantEmail: "eleonore.moreau@email.com",
        tenantPhone: "06 45 12 89 33",
        leaseDate: "01 octobre 2025 (Bail meublé 1 an)",
        deposit: 1400,
        receivedAmount: isResolved ? 800 : 400,
        balanceAmount: isResolved ? 0 : 400,
        quittanceNumber: "QUITTANCE-2026-10-03",
      }
    : {
        name: "Studio Rue Oberkampf",
        city: "Paris 11e",
        surface: "32 m² · Meublé",
        rentBare: 670,
        charges: 80,
        rentTotal: 750,
        tenant: "Camille Laurent",
        tenantEmail: "camille.laurent@email.com",
        tenantPhone: "06 12 34 56 78",
        leaseDate: "01 septembre 2025 (Bail meublé 1 an)",
        deposit: 1340,
        receivedAmount: 750,
        balanceAmount: 0,
        quittanceNumber: "QUITTANCE-2026-10-01",
      };

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#151413] font-sans selection:bg-[#151413] selection:text-[#F8F6F0]">
      {/* ─────────────────────────────────────────────────────────────
          1. NAVIGATION & SÉLECTEUR DE SCÉNARIO POUR LA REVIEW
      ───────────────────────────────────────────────────────────── */}
      <header className="bg-[#F8F6F0] border-b border-[#151413]/10 px-4 sm:px-8 py-3.5 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/design-preview/app-dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-[#6B6760] hover:text-[#151413] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tableau de bord</span>
            </Link>
            <span className="text-[#151413]/20">/</span>
            <span className="text-xs font-semibold text-[#151413] truncate">
              {propertyData.name}
            </span>
          </div>

          {/* Sélecteur de scénario : État avec exception vs État tout réglé */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center p-0.5 bg-[#EDEAE0] border border-[#151413]/12 text-[11px] rounded-sm">
              <button
                type="button"
                onClick={() => {
                  setSelectedProperty("nantes");
                  setIsResolved(false);
                }}
                className={`px-2 py-0.5 transition-all text-xs ${
                  hasException
                    ? "bg-[#C2410C] text-[#F8F6F0] font-medium"
                    : "text-[#6B6760] hover:text-[#151413]"
                }`}
              >
                État B : Exception Nantes (400 €)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedProperty("paris");
                  setIsResolved(true);
                }}
                className={`px-2 py-0.5 transition-all text-xs ${
                  !hasException && selectedProperty === "paris"
                    ? "bg-[#22543D] text-[#F8F6F0] font-medium"
                    : "text-[#6B6760] hover:text-[#151413]"
                }`}
              >
                État A : Tout réglé Paris (Calme)
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-8">
        {/* ─────────────────────────────────────────────────────────────
            2. EN-TÊTE DU LOGEMENT : VIVANT & EN CONTRÔLE
        ───────────────────────────────────────────────────────────── */}
        <section className="space-y-4 border-b border-[#151413]/10 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#6B6760] mb-1">
                <span>Logement sous gestion directe</span>
                <span>·</span>
                <span>{propertyData.surface}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-4xl text-[#151413] tracking-tight font-normal">
                {propertyData.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#6B6760] mt-1">
                {propertyData.city} · Bail actif avec {propertyData.tenant}
              </p>
            </div>

            {/* Statut vivant immédiat du logement */}
            <div className="flex items-center gap-3">
              {hasException ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFFDF9] border border-[#C2410C]/30 text-[#9A3412] text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#C2410C] animate-pulse" />
                  Solde de 400&nbsp;€ à pointer
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F3EFE6] border border-[#22543D]/25 text-[#22543D] text-xs font-medium">
                  <Check className="w-3.5 h-3.5 text-[#22543D]" />
                  À jour pour octobre · Quittance prête
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            3. LE MOIS D'OCTOBRE 2026 : LA SITUATION COURANTE
            Comportement exception-first :
            - Si calme (État A) : interface compacte, feutrée, reposante.
            - Si exception (État B) : l'interface s'ouvre autour de la décision.
        ───────────────────────────────────────────────────────────── */}
        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-[#6B6760]">
              Situation d'octobre 2026
            </h2>
            <span className="text-xs text-[#6B6760]">Échéance mensuelle</span>
          </div>

          <div
            className={`transition-all duration-300 border ${
              hasException
                ? "bg-[#FFFDF9] border-l-4 border-l-[#C2410C] border-y border-r border-[#C2410C]/25 p-5 sm:p-6"
                : "bg-[#F3EFE6] border border-[#151413]/10 p-5 sm:p-6"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Loyer contractuel */}
              <div className="md:col-span-4">
                <span className="block text-[11px] text-[#6B6760]">Loyer mensuel total</span>
                <div className="font-mono text-2xl sm:text-3xl font-semibold text-[#151413] tabular-nums mt-0.5">
                  {propertyData.rentTotal.toLocaleString("fr-FR")}&nbsp;<span className="text-sm font-normal text-[#6B6760]">€</span>
                </div>
                <span className="block text-xs text-[#6B6760] mt-1">
                  {propertyData.rentBare}&nbsp;€ loyer nu + {propertyData.charges}&nbsp;€ charges
                </span>
              </div>

              {/* Mouvement bancaire perçu */}
              <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-[#151413]/10 pt-4 md:pt-0 md:pl-6">
                <span className="block text-[11px] text-[#6B6760]">Paiement constaté</span>
                {hasException ? (
                  <div>
                    <div className="font-mono text-xl sm:text-2xl font-bold text-[#C2410C] tabular-nums mt-0.5">
                      400,00&nbsp;€ reçu
                    </div>
                    <span className="block text-xs text-[#9A3412] mt-0.5 font-medium">
                      Reste à régler : 400,00&nbsp;€ (acompte versé le 03/10)
                    </span>
                  </div>
                ) : (
                  <div>
                    <div className="font-mono text-xl sm:text-2xl font-semibold text-[#22543D] tabular-nums mt-0.5">
                      {propertyData.rentTotal.toLocaleString("fr-FR")},00&nbsp;€
                    </div>
                    <span className="block text-xs text-[#22543D] mt-0.5 font-medium">
                      ✓ Virement reçu le 02/10
                    </span>
                  </div>
                )}
              </div>

              {/* Action ou Document libératoire */}
              <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-[#151413]/10 pt-4 md:pt-0 md:pl-6 flex flex-col items-start md:items-end justify-center">
                {hasException ? (
                  <div className="space-y-2 w-full md:w-auto text-left md:text-right">
                    <button
                      type="button"
                      onClick={() => setIsResolved(true)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#151413] text-[#F8F6F0] text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer w-full md:w-auto shadow-2xs"
                    >
                      Marquer les 400&nbsp;€ reçus
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="block text-[11px] text-[#6B6760]">
                      Reçu d'acompte émis (art. 21) · Quittance bloquée jusqu'au solde
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1 text-left md:text-right">
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#22543D] font-medium bg-[#22543D]/10 px-2.5 py-1 border border-[#22543D]/20">
                      <Check className="w-3.5 h-3.5" /> Quittance #2026-10 prête
                    </span>
                    <a
                      href="#download"
                      className="text-[11px] text-[#151413] underline font-medium block pt-1 hover:text-stone-600 transition-colors"
                    >
                      Télécharger la quittance (PDF)
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            4. LE LOCATAIRE & LES DOCUMENTS : HUMAIN & RASSURANT
            Deux colonnes simples et équilibrées
        ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          {/* Colonne gauche (6 cols) : Locataire & Bail */}
          <section className="md:col-span-6 space-y-4">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-[#6B6760] border-b border-[#151413]/10 pb-2">
              Locataire & Contrat
            </h2>

            <div className="bg-[#FAF8F3] border border-[#151413]/10 p-5 space-y-4">
              <div>
                <span className="text-[11px] text-[#6B6760] block">Titulaire du bail</span>
                <span className="text-base font-semibold text-[#151413] block mt-0.5">
                  {propertyData.tenant}
                </span>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6B6760] mt-1.5">
                  <span>{propertyData.tenantEmail}</span>
                  <span>·</span>
                  <span>{propertyData.tenantPhone}</span>
                </div>
              </div>

              <div className="border-t border-[#151413]/10 pt-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6B6760]">Type de bail :</span>
                  <span className="font-medium text-[#151413]">{propertyData.leaseDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6760]">Dépôt de garantie :</span>
                  <span className="font-mono text-[#151413]">{propertyData.deposit.toLocaleString("fr-FR")}&nbsp;€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6760]">Espace locataire :</span>
                  <span className="text-[#22543D] font-medium">Actif (accès sans mot de passe)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Colonne droite (6 cols) : Historique des 4 derniers mois */}
          <section className="md:col-span-6 space-y-4">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-[#6B6760] border-b border-[#151413]/10 pb-2">
              Historique des règlements
            </h2>

            <div className="bg-[#FAF8F3] border border-[#151413]/10 p-5 space-y-3">
              <span className="text-[11px] text-[#6B6760] block font-medium">
                Dernières échéances
              </span>

              <div className="divide-y divide-[#151413]/10 text-xs">
                <div className="py-2 flex justify-between items-center">
                  <div>
                    <strong className="text-[#151413]">Octobre 2026</strong>
                  </div>
                  <div className="font-mono text-right">
                    {hasException ? (
                      <span className="text-[#C2410C] font-semibold">400 € / 800 € (acompte)</span>
                    ) : (
                      <span className="text-[#22543D]">
                        {propertyData.rentTotal} € · ✓ Réglé
                      </span>
                    )}
                  </div>
                </div>

                <div className="py-2 flex justify-between items-center">
                  <div>
                    <strong className="text-[#151413]">Septembre 2026</strong>
                  </div>
                  <div className="font-mono text-[#22543D]">
                    {propertyData.rentTotal} € · ✓ Réglé (03/09)
                  </div>
                </div>

                <div className="py-2 flex justify-between items-center">
                  <div>
                    <strong className="text-[#151413]">Août 2026</strong>
                  </div>
                  <div className="font-mono text-[#22543D]">
                    {propertyData.rentTotal} € · ✓ Réglé (02/08)
                  </div>
                </div>

                <div className="py-2 flex justify-between items-center">
                  <div>
                    <strong className="text-[#151413]">Juillet 2026</strong>
                  </div>
                  <div className="font-mono text-[#22543D]">
                    {propertyData.rentTotal} € · ✓ Réglé (04/07)
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            5. CLASSEUR DU LOGEMENT : JUSTIFICATIFS TOUJOURS ACCESSIBLES
        ───────────────────────────────────────────────────────────── */}
        <section className="space-y-3 border-t border-[#151413]/10 pt-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-[#6B6760]">
              Documents du logement (3)
            </h2>
            <span className="text-xs text-[#6B6760]">Archivage automatique</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-[#FAF8F3] border border-[#151413]/10 flex flex-col justify-between">
              <div>
                <span className="font-semibold text-[#151413] block">Contrat de bail</span>
                <span className="text-[#6B6760] text-[11px] block mt-0.5">Bail meublé signé</span>
              </div>
              <span className="mt-3 text-[11px] text-[#151413] underline font-medium cursor-pointer">
                Télécharger (PDF)
              </span>
            </div>

            <div className="p-4 bg-[#FAF8F3] border border-[#151413]/10 flex flex-col justify-between">
              <div>
                <span className="font-semibold text-[#151413] block">État des lieux</span>
                <span className="text-[#6B6760] text-[11px] block mt-0.5">Entrée avec photos</span>
              </div>
              <span className="mt-3 text-[11px] text-[#151413] underline font-medium cursor-pointer">
                Télécharger (PDF)
              </span>
            </div>

            <div className="p-4 bg-[#FAF8F3] border border-[#151413]/10 flex flex-col justify-between">
              <div>
                <span className="font-semibold text-[#151413] block">Dernière quittance</span>
                <span className="text-[#6B6760] text-[11px] block mt-0.5">
                  {hasException ? "Reçu d'acompte (art. 21)" : "Quittance d'octobre 2026"}
                </span>
              </div>
              <span className="mt-3 text-[11px] text-[#22543D] underline font-medium cursor-pointer">
                Télécharger (PDF)
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
