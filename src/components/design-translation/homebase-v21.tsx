"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Download,
  FileText,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Mail,
  Phone,
  Clock,
  ChevronRight,
} from "lucide-react";

export type HomebaseMode =
  | "nantes_exception"
  | "nantes_resolved"
  | "paris_calm"
  | "stress_long";

interface HomebaseV21Props {
  mode?: HomebaseMode;
  initialResolved?: boolean;
}

export function HomebaseV21({
  mode = "nantes_exception",
  initialResolved,
}: HomebaseV21Props) {
  const isStressLong = mode === "stress_long";
  const isParis = mode === "paris_calm";

  // Gestion d'état résolu interactif (pour tester la rétraction mécanique)
  const [isResolved, setIsResolved] = useState<boolean>(() => {
    if (initialResolved !== undefined) return initialResolved;
    return mode === "nantes_resolved" || mode === "paris_calm";
  });

  const propertyData = isStressLong
    ? {
        name: "Appartement 4 pièces – 127 boulevard du Général de Gaulle",
        city: "La Madeleine",
        surface: "112 m² · Non meublé",
        rentBare: 2543.17,
        charges: 300.0,
        rentTotal: 2843.17,
        tenant: "Marie-Charlotte Van den Broeck-Dupont",
        tenantEmail: "marie-charlotte.vandenbroeck-dupont@cabinet-notarial.fr",
        tenantPhone: "06 98 76 54 32",
        leaseDate: "01 novembre 2024 (Bail d'habitation principale loi 89 triennal)",
        deposit: 2543.17,
        receivedAmount: isResolved ? 2843.17 : 2443.17,
        balanceAmount: isResolved ? 0 : 400.0,
        quittanceNumber: "QUITTANCE-2026-10-03",
        hasException: !isResolved,
      }
    : isParis
    ? {
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
        hasException: false,
      }
    : {
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
        hasException: !isResolved,
      };

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#151413] font-sans selection:bg-[#151413] selection:text-[#F8F6F0]">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER APPLICATIF DE PRODUCTION (STABLE & ÉPURÉ)
      ───────────────────────────────────────────────────────────── */}
      <header className="bg-[#F8F6F0] border-b border-[#151413]/10 px-4 sm:px-8 py-3 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/design-preview/dashboard-v21"
              className="inline-flex items-center gap-1.5 text-xs text-[#6B6760] hover:text-[#151413] transition-colors shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Tableau de bord</span>
            </Link>
            <span className="text-[#151413]/20 shrink-0">/</span>
            <span className="text-xs font-semibold text-[#151413] truncate">
              {propertyData.name}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
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
          2. CORPS DE LA HOME BASE — VIVANTE, TACTILE ET RIGOUROUSE
      ───────────────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-5 sm:py-8 space-y-6 sm:space-y-7">
        {/* EN-TÊTE DU LOGEMENT */}
        <section className="space-y-2 border-b border-[#151413]/10 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#6B6760] mb-0.5">
                <span>Gestion directe</span>
                <span>·</span>
                <span>{propertyData.surface}</span>
                <span>·</span>
                <span>{propertyData.city}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl text-[#151413] tracking-tight font-normal">
                {propertyData.name}
              </h1>
              <p className="text-xs text-[#6B6760] mt-0.5 truncate">
                Bail actif avec {propertyData.tenant}
              </p>
            </div>

            {/* Statut vivant immédiat du logement */}
            <div className="shrink-0 self-start sm:self-center">
              {propertyData.hasException ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFFDF9] border border-[#C2410C]/30 text-[#C2410C] text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#C2410C] animate-pulse" aria-hidden="true" />
                  Solde de {propertyData.balanceAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}&nbsp;€ à pointer
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F3EFE6] border border-[#166534]/25 text-[#166534] text-xs font-medium">
                  <Check className="w-3.5 h-3.5 text-[#166534]" aria-hidden="true" />
                  À jour pour octobre · Quittance prête
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            3. BANDEAU DE SITUATION COURANTE : LE MOIS EN COURS
            - Si exception : déploiement territorial & action claire
            - Si calme : intégration apaisée
        ───────────────────────────────────────────────────────────── */}
        <section className="space-y-2" aria-labelledby="heading-situation">
          <div className="flex items-baseline justify-between">
            <h2 id="heading-situation" className="text-xs uppercase tracking-wider font-semibold text-[#6B6760]">
              Situation d'octobre 2026
            </h2>
            <span className="text-xs text-[#6B6760]">Échéance mensuelle</span>
          </div>

          <div
            className={`transition-all duration-200 border ${
              propertyData.hasException
                ? "bg-[#FFFDF9] border-l-4 border-l-[#C2410C] border-y border-r border-[#C2410C]/25 p-4 sm:p-5"
                : "bg-[#F3EFE6] border border-[#151413]/10 p-4 sm:p-5"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center">
              {/* Loyer contractuel */}
              <div className="md:col-span-4">
                <span className="block text-[11px] text-[#6B6760]">Loyer mensuel contractuel</span>
                <div className="font-mono text-xl sm:text-2xl font-semibold text-[#151413] tabular-nums mt-0.5">
                  {propertyData.rentTotal.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}&nbsp;
                  <span className="text-xs font-normal text-[#6B6760]">€</span>
                </div>
                <span className="block text-xs text-[#6B6760] mt-0.5">
                  {propertyData.rentBare.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}&nbsp;€ loyer nu + {propertyData.charges.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}&nbsp;€ charges
                </span>
              </div>

              {/* Mouvement constaté */}
              <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-[#151413]/10 pt-3 md:pt-0 md:pl-6">
                <span className="block text-[11px] text-[#6B6760]">Paiement constaté</span>
                {propertyData.hasException ? (
                  <div>
                    <div className="font-mono text-lg sm:text-xl font-bold text-[#C2410C] tabular-nums mt-0.5">
                      {propertyData.receivedAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}&nbsp;€ reçu
                    </div>
                    <span className="block text-xs text-[#C2410C] mt-0.5 font-medium">
                      Reste à régler : {propertyData.balanceAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}&nbsp;€
                    </span>
                  </div>
                ) : (
                  <div>
                    <div className="font-mono text-lg sm:text-xl font-semibold text-[#166534] tabular-nums mt-0.5">
                      {propertyData.rentTotal.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}&nbsp;€
                    </div>
                    <span className="block text-xs text-[#166534] mt-0.5 font-medium">
                      ✓ Virement reçu le 02/10
                    </span>
                  </div>
                )}
              </div>

              {/* Action ou Quittance */}
              <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-[#151413]/10 pt-3 md:pt-0 md:pl-6 flex flex-col items-start md:items-end justify-center">
                {propertyData.hasException ? (
                  <div className="space-y-1.5 w-full md:w-auto text-left md:text-right">
                    <button
                      type="button"
                      onClick={() => setIsResolved(true)}
                      className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 bg-[#151413] text-[#F8F6F0] text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer w-full md:w-auto active:scale-[0.98]"
                    >
                      Marquer les {propertyData.balanceAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}&nbsp;€ reçus
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <span className="block text-[11px] text-[#6B6760]">
                      Reçu d'acompte émis (art. 21) · Quittance bloquée jusqu'au solde
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1 text-left md:text-right">
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#166534] font-medium bg-[#166534]/10 px-2.5 py-0.5 border border-[#166534]/20">
                      <Check className="w-3.5 h-3.5" aria-hidden="true" /> Quittance #2026-10 prête
                    </span>
                    <span className="text-[11px] text-[#151413] underline font-medium block pt-0.5 hover:text-stone-600 transition-colors cursor-pointer">
                      Télécharger la quittance (PDF)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            4. REGISTRE ARCHITECTURAL : BAIL & HISTORIQUE (2 COLONNES)
        ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
          {/* Colonne gauche (6 cols) : Locataire & Contrat */}
          <section className="md:col-span-6 space-y-3" aria-labelledby="heading-tenant">
            <h2 id="heading-tenant" className="text-xs uppercase tracking-wider font-semibold text-[#6B6760] border-b border-[#151413]/10 pb-1.5">
              Locataire & Contrat de bail
            </h2>

            <div className="bg-[#FAF8F3] border border-[#151413]/10 p-4 space-y-3">
              <div>
                <span className="text-[11px] text-[#6B6760] block">Titulaire du bail</span>
                <span className="text-sm sm:text-base font-semibold text-[#151413] block mt-0.5 truncate">
                  {propertyData.tenant}
                </span>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[#6B6760] mt-1">
                  <span className="truncate">{propertyData.tenantEmail}</span>
                  <span>·</span>
                  <span>{propertyData.tenantPhone}</span>
                </div>
              </div>

              <div className="border-t border-[#151413]/10 pt-2.5 space-y-1.5 text-xs">
                <div className="flex justify-between gap-2">
                  <span className="text-[#6B6760] shrink-0">Type de contrat :</span>
                  <span className="font-medium text-[#151413] text-right truncate">{propertyData.leaseDate}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#6B6760] shrink-0">Dépôt de garantie :</span>
                  <span className="font-mono text-[#151413] tabular-nums">{propertyData.deposit.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}&nbsp;€</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#6B6760] shrink-0">Espace locataire :</span>
                  <span className="text-[#166534] font-medium">Actif (accès sécurisé sans mot de passe)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Colonne droite (6 cols) : Historique des règlements */}
          <section className="md:col-span-6 space-y-3" aria-labelledby="heading-history">
            <h2 id="heading-history" className="text-xs uppercase tracking-wider font-semibold text-[#6B6760] border-b border-[#151413]/10 pb-1.5">
              Historique des règlements
            </h2>

            <div className="bg-[#FAF8F3] border border-[#151413]/10 p-4 space-y-2">
              <span className="text-[11px] text-[#6B6760] block font-medium">
                4 dernières échéances
              </span>

              <div className="divide-y divide-[#151413]/10 text-xs">
                <div className="py-1.5 flex justify-between items-center gap-2">
                  <span className="text-[#151413] font-medium">Octobre 2026</span>
                  <div className="font-mono text-right tabular-nums">
                    {propertyData.hasException ? (
                      <span className="text-[#C2410C] font-semibold">
                        {propertyData.receivedAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}&nbsp;€ / {propertyData.rentTotal.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}&nbsp;€ (acompte)
                      </span>
                    ) : (
                      <span className="text-[#166534]">
                        {propertyData.rentTotal.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}&nbsp;€ · ✓ Réglé
                      </span>
                    )}
                  </div>
                </div>

                <div className="py-1.5 flex justify-between items-center gap-2">
                  <span className="text-[#151413] font-medium">Septembre 2026</span>
                  <span className="font-mono text-[#166534] tabular-nums">
                    {propertyData.rentTotal.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}&nbsp;€ · ✓ Réglé (03/09)
                  </span>
                </div>

                <div className="py-1.5 flex justify-between items-center gap-2">
                  <span className="text-[#151413] font-medium">Août 2026</span>
                  <span className="font-mono text-[#166534] tabular-nums">
                    {propertyData.rentTotal.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}&nbsp;€ · ✓ Réglé (02/08)
                  </span>
                </div>

                <div className="py-1.5 flex justify-between items-center gap-2">
                  <span className="text-[#151413] font-medium">Juillet 2026</span>
                  <span className="font-mono text-[#166534] tabular-nums">
                    {propertyData.rentTotal.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}&nbsp;€ · ✓ Réglé (04/07)
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            5. REGISTRE DOCUMENTAIRE STRUCTURÉ (Remplacement de la "card soup")
            Tableau compact de traçabilité légale
        ───────────────────────────────────────────────────────────── */}
        <section className="space-y-2 border-t border-[#151413]/10 pt-4" aria-labelledby="heading-docs">
          <div className="flex items-baseline justify-between">
            <h2 id="heading-docs" className="text-xs uppercase tracking-wider font-semibold text-[#6B6760]">
              Registre documentaire du logement (4 pièces)
            </h2>
            <span className="text-xs text-[#6B6760]">Archivage conforme loi 89</span>
          </div>

          <div className="bg-[#FAF8F3] border border-[#151413]/10 divide-y divide-[#151413]/10 text-xs">
            {/* Pièce 1 */}
            <div className="p-3 sm:px-4 sm:py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 hover:bg-[#151413]/[0.02] transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-4 h-4 text-[#6B6760] shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <span className="font-semibold text-[#151413] block truncate">Contrat de bail d'habitation</span>
                  <span className="text-[11px] text-[#6B6760] block truncate">Signé électroniquement le 01/10/2025 · PDF 2.4 Mo</span>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 pl-6 sm:pl-0 shrink-0">
                <span className="text-[11px] text-[#166534] font-medium bg-[#166534]/10 px-2 py-0.5 border border-[#166534]/20">
                  Actif (valide)
                </span>
                <span className="text-[11px] text-[#151413] underline font-medium hover:text-stone-600 transition-colors cursor-pointer">
                  Télécharger (PDF)
                </span>
              </div>
            </div>

            {/* Pièce 2 */}
            <div className="p-3 sm:px-4 sm:py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 hover:bg-[#151413]/[0.02] transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-4 h-4 text-[#6B6760] shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <span className="font-semibold text-[#151413] block truncate">État des lieux contradictoire d'entrée</span>
                  <span className="text-[11px] text-[#6B6760] block truncate">Réalisé le 01/10/2025 (14 photos annexées) · PDF 5.1 Mo</span>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 pl-6 sm:pl-0 shrink-0">
                <span className="text-[11px] text-[#166534] font-medium bg-[#166534]/10 px-2 py-0.5 border border-[#166534]/20">
                  Certifié
                </span>
                <span className="text-[11px] text-[#151413] underline font-medium hover:text-stone-600 transition-colors cursor-pointer">
                  Télécharger (PDF)
                </span>
              </div>
            </div>

            {/* Pièce 3 */}
            <div className="p-3 sm:px-4 sm:py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 hover:bg-[#151413]/[0.02] transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-4 h-4 text-[#6B6760] shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <span className="font-semibold text-[#151413] block truncate">
                    {propertyData.hasException ? "Reçu d'acompte (échéance octobre 2026)" : "Quittance de loyer (octobre 2026)"}
                  </span>
                  <span className="text-[11px] text-[#6B6760] block truncate">
                    {propertyData.hasException ? "Émis le 03/10/2026 (art. 21 loi 89) · PDF 115 Ko" : "Émise le 07/10/2026 · Quittance libératoire · PDF 122 Ko"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 pl-6 sm:pl-0 shrink-0">
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 border ${
                    propertyData.hasException
                      ? "text-[#C2410C] bg-[#C2410C]/10 border-[#C2410C]/25"
                      : "text-[#166534] bg-[#166534]/10 border-[#166534]/20"
                  }`}
                >
                  {propertyData.hasException ? "Acompte partiel" : "Quittance disponible"}
                </span>
                <span className="text-[11px] text-[#151413] underline font-medium hover:text-stone-600 transition-colors cursor-pointer">
                  Télécharger (PDF)
                </span>
              </div>
            </div>

            {/* Pièce 4 */}
            <div className="p-3 sm:px-4 sm:py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 hover:bg-[#151413]/[0.02] transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <ShieldCheck className="w-4 h-4 text-[#6B6760] shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <span className="font-semibold text-[#151413] block truncate">Attestation d'assurance habitation</span>
                  <span className="text-[11px] text-[#6B6760] block truncate">Compagnie Allianz · Police n°849204 · Validité 30/09/2027</span>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 pl-6 sm:pl-0 shrink-0">
                <span className="text-[11px] text-[#166534] font-medium bg-[#166534]/10 px-2 py-0.5 border border-[#166534]/20">
                  À jour
                </span>
                <span className="text-[11px] text-[#151413] underline font-medium hover:text-stone-600 transition-colors cursor-pointer">
                  Consulter
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
