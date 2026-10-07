"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Decimal from "decimal.js";
import {
  ArrowLeft,
  Download,
  CheckCircle2,
  AlertTriangle,
  Plus,
  FileText,
  User,
  Building,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";
import {
  PageShell,
  Section,
  Money,
  StatusBadge,
  StatusDot,
  AttentionSurface,
  CalmSurface,
  FinancialSummary,
  FormField,
} from "@/components/design-system";

export type Wave2PreviewMode =
  | "billing_standard"
  | "billing_partial"
  | "billing_dense"
  | "lease_view"
  | "lease_form"
  | "lease_form_errors";

function Wave2Content() {
  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") as Wave2PreviewMode) || "billing_standard";

  switch (mode) {
    case "billing_standard":
    case "billing_partial":
    case "billing_dense":
      return <BillingPreview mode={mode} />;
    case "lease_view":
      return <LeaseViewPreview />;
    case "lease_form":
    case "lease_form_errors":
      return <LeaseFormPreview hasErrors={mode === "lease_form_errors"} />;
    default:
      return <BillingPreview mode="billing_standard" />;
  }
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 1. BILLING PREVIEWS                                                        */
/* ────────────────────────────────────────────────────────────────────────── */
function BillingPreview({ mode }: { mode: "billing_standard" | "billing_partial" | "billing_dense" }) {
  const isPartial = mode === "billing_partial";
  const isDense = mode === "billing_dense";

  const totalExpected = isPartial ? new Decimal(3250) : isDense ? new Decimal(8450) : new Decimal(2450);
  const totalReceived = isPartial ? new Decimal(2800) : isDense ? new Decimal(8450) : new Decimal(2450);
  const totalBalance = totalExpected.minus(totalReceived);

  const transactions = isDense
    ? [
        { id: "1", property: "Studio Nantes", tenant: "Claire Martin", due: "01/10/2026", expected: 850, received: 850, balance: 0, status: "PAID" },
        { id: "2", property: "T3 Lyon République", tenant: "Pierre Durand", due: "01/10/2026", expected: 1200, received: 1200, balance: 0, status: "PAID" },
        { id: "3", property: "T2 Paris Marais", tenant: "Camille Bernard", due: "01/10/2026", expected: 1400, received: 1400, balance: 0, status: "PAID" },
        { id: "4", property: "Studio Rennes Centre", tenant: "Lucie Thomas", due: "01/10/2026", expected: 650, received: 650, balance: 0, status: "PAID" },
        { id: "5", property: "T2 Bordeaux Bastide", tenant: "Alexandre Petit", due: "01/10/2026", expected: 780, received: 780, balance: 0, status: "PAID" },
        { id: "6", property: "T3 Toulouse Capitole", tenant: "Élodie Robert", due: "01/10/2026", expected: 920, received: 920, balance: 0, status: "PAID" },
        { id: "7", property: "Studio Lille Vauban", tenant: "Hugo Richard", due: "01/10/2026", expected: 590, received: 590, balance: 0, status: "PAID" },
        { id: "8", property: "T1 Strasbourg Gare", tenant: "Manon Simon", due: "01/10/2026", expected: 510, received: 510, balance: 0, status: "PAID" },
        { id: "9", property: "T2 Montpellier Comédie", tenant: "Nicolas Michel", due: "01/10/2026", expected: 750, received: 750, balance: 0, status: "PAID" },
        { id: "10", property: "T2 Nice Promenade", tenant: "Sarah Leroy", due: "01/10/2026", expected: 800, received: 800, balance: 0, status: "PAID" },
      ]
    : isPartial
    ? [
        { id: "1", property: "Studio Nantes", tenant: "Claire Martin", due: "01/10/2026", expected: 850, received: 400, balance: 450, status: "PARTIAL" },
        { id: "2", property: "T3 Lyon République", tenant: "Pierre Durand", due: "01/10/2026", expected: 1200, received: 1200, balance: 0, status: "PAID" },
        { id: "3", property: "T2 Paris Marais", tenant: "Camille Bernard", due: "01/10/2026", expected: 1200, received: 1200, balance: 0, status: "PAID" },
      ]
    : [
        { id: "1", property: "Studio Nantes", tenant: "Claire Martin", due: "01/10/2026", expected: 850, received: 850, balance: 0, status: "PAID" },
        { id: "2", property: "T3 Lyon République", tenant: "Pierre Durand", due: "01/10/2026", expected: 800, received: 800, balance: 0, status: "PAID" },
        { id: "3", property: "T2 Paris Marais", tenant: "Camille Bernard", due: "01/10/2026", expected: 800, received: 800, balance: 0, status: "PAID" },
      ];

  return (
    <PageShell maxWidth="default" className="space-y-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 border-b border-[#151413]/10 pb-5">
        <div className="space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#6B6760] font-semibold block">
            Grand Livre des Encaissements
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#151413] tracking-tight font-normal">
            Paiements & Quittances
          </h1>
          <p className="text-sm text-[#6B6760]">
            Suivi des flux financiers locatifs, rapprochement des règlements et émission des quittances.
          </p>
        </div>
      </div>

      {/* Financial Summary */}
      <FinancialSummary
        expected={totalExpected}
        received={totalReceived}
        outstanding={totalBalance}
      />

      {/* Exception Surface if Partial */}
      {isPartial && (
        <AttentionSurface>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#C2410C] block">
                Attention requise · Acompte perçu
              </span>
              <p className="text-sm font-medium text-[#151413]">
                Studio Nantes — 400,00 € reçus sur 850,00 € exigibles (Solde restant dû : 450,00 €).
              </p>
              <p className="text-xs text-[#6B6760]">
                Conformément à la réglementation, la quittance intégrale est bloquée jusqu'à l'apurement complet du terme.
              </p>
            </div>
            <button className="h-8 px-3 text-xs font-medium border border-[#C2410C]/30 bg-white text-[#C2410C] hover:bg-[#F2EFE9] transition-colors whitespace-nowrap self-start sm:self-auto">
              Enregistrer le solde (450,00 €)
            </button>
          </div>
        </AttentionSurface>
      )}

      {/* Ledger Table */}
      <div className="border border-[#151413]/10 bg-white">
        <div className="p-4 border-b border-[#151413]/10 bg-[#FAF8F3] flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#151413]">
            Journal Chronologique des Règlements ({transactions.length})
          </h2>
          <span className="text-xs font-mono text-[#6B6760]">
            Octobre 2026
          </span>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#151413]/10 bg-[#F8F6F0]/50 text-[11px] uppercase tracking-wider text-[#6B6760] font-mono">
                <th className="py-2.5 px-4 font-medium">Logement & Locataire</th>
                <th className="py-2.5 px-4 font-medium">Échéance</th>
                <th className="py-2.5 px-4 font-medium text-right">Attendu</th>
                <th className="py-2.5 px-4 font-medium text-right">Perçu</th>
                <th className="py-2.5 px-4 font-medium text-right">Solde</th>
                <th className="py-2.5 px-4 font-medium">Statut</th>
                <th className="py-2.5 px-4 font-medium text-right">Action / Quittance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151413]/5 text-sm">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#FAF8F3]/60 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-medium text-[#151413] block">{tx.property}</span>
                    <span className="text-xs text-[#6B6760] block">{tx.tenant}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-[#6B6760]">{tx.due}</td>
                  <td className="py-3 px-4 text-right font-mono text-[#151413]">{tx.expected.toFixed(2)} €</td>
                  <td className="py-3 px-4 text-right font-mono font-medium text-[#166534]">
                    {tx.received.toFixed(2)} €
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-[#C2410C]">
                    {tx.balance > 0 ? `${tx.balance.toFixed(2)} €` : "—"}
                  </td>
                  <td className="py-3 px-4">
                    {tx.status === "PAID" ? (
                      <StatusBadge tone="calm" size="xs">Réglé</StatusBadge>
                    ) : (
                      <StatusBadge tone="attention" size="xs">Acompte perçu</StatusBadge>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {tx.status === "PAID" ? (
                      <button className="inline-flex items-center gap-1.5 text-xs text-[#151413] hover:text-[#6B6760] font-medium underline">
                        <Download className="size-3.5" />
                        Télécharger
                      </button>
                    ) : (
                      <button className="h-7 px-2.5 text-xs border border-[#151413]/15 bg-[#FAF8F3] text-[#151413] hover:bg-[#F2EFE9]">
                        Enregistrer paiement
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Rows (390px / 360px) */}
        <div className="md:hidden divide-y divide-[#151413]/10">
          {transactions.map((tx) => (
            <div key={tx.id} className="p-4 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-semibold text-sm text-[#151413] block leading-tight">{tx.property}</span>
                  <span className="text-xs text-[#6B6760] block">{tx.tenant}</span>
                </div>
                {tx.status === "PAID" ? (
                  <StatusBadge tone="calm" size="xs">Réglé</StatusBadge>
                ) : (
                  <StatusBadge tone="attention" size="xs">Acompte perçu</StatusBadge>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#151413]/5 text-xs font-mono">
                <div>
                  <span className="text-[10px] uppercase text-[#6B6760] block">Attendu</span>
                  <span className="text-[#151413] font-medium">{tx.expected} €</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#6B6760] block">Perçu</span>
                  <span className="text-[#166534] font-semibold">{tx.received} €</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#6B6760] block">Solde</span>
                  <span className={tx.balance > 0 ? "text-[#C2410C] font-semibold" : "text-[#6B6760]"}>
                    {tx.balance > 0 ? `${tx.balance} €` : "0 €"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-mono text-[#6B6760]">Échéance : {tx.due}</span>
                {tx.status === "PAID" ? (
                  <button className="inline-flex items-center gap-1 text-xs text-[#151413] underline font-medium">
                    <Download className="size-3" />
                    Quittance
                  </button>
                ) : (
                  <button className="h-7 px-2 text-xs border border-[#151413]/20 bg-white text-[#151413] font-medium">
                    Enregistrer solde
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 2. LEASE CONSULTATION VIEW                                                 */
/* ────────────────────────────────────────────────────────────────────────── */
function LeaseViewPreview() {
  return (
    <PageShell maxWidth="default" className="space-y-8 py-8">
      {/* Back link & Header */}
      <div className="space-y-4">
        <Link href="#" className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B6760] hover:text-[#151413]">
          <ArrowLeft className="size-3.5" />
          Retour au registre des baux
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 border-b border-[#151413]/10 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <StatusBadge tone="calm" size="xs">Bail actif</StatusBadge>
              <span className="text-xs font-mono text-[#6B6760]">Réf: BAIL-2026-LYON-01</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#151413] tracking-tight font-normal">
              Bail d'habitation · Studio Lyon République
            </h1>
            <p className="text-sm text-[#6B6760]">
              8 Rue de la République, 69001 Lyon · Titulaire : Pierre Durand
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-8 px-3 text-xs border border-[#151413]/15 bg-white text-[#151413] hover:bg-[#FAF8F3] font-medium flex items-center gap-1.5">
              <Download className="size-3.5" />
              Contrat signé PDF
            </button>
          </div>
        </div>
      </div>

      {/* Financial Conditions Bar */}
      <div className="border border-[#151413]/10 bg-white p-5 space-y-4">
        <span className="text-[11px] uppercase font-mono tracking-wider text-[#6B6760] font-semibold block">
          Conditions Financières & Modalités du Contrat
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-1">
          <div className="space-y-0.5">
            <span className="text-xs text-[#6B6760] block">Loyer hors charges</span>
            <span className="text-lg font-mono font-semibold text-[#151413]">600,00 €</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-[#6B6760] block">Provisions charges</span>
            <span className="text-lg font-mono font-semibold text-[#151413]">50,00 €</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-[#6B6760] block">Total mensuel</span>
            <span className="text-lg font-mono font-semibold text-[#166534]">650,00 €</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-[#6B6760] block">Dépôt de garantie</span>
            <span className="text-lg font-mono font-semibold text-[#151413]">600,00 €</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-[#6B6760] block">Jour d'échéance</span>
            <span className="text-lg font-mono font-semibold text-[#151413]">Le 5 du mois</span>
          </div>
        </div>
      </div>

      {/* Contract Lifecycle & Parties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-[#151413]/10 bg-[#FAF8F3] p-5 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#151413]">
            Modalités Contractuelles
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[#151413]/5">
              <span className="text-[#6B6760]">Type de bail :</span>
              <span className="font-medium text-[#151413]">Location vide (loi du 6 juillet 1989)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#151413]/5">
              <span className="text-[#6B6760]">Date de prise d'effet :</span>
              <span className="font-mono text-[#151413]">01 octobre 2026</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#151413]/5">
              <span className="text-[#6B6760]">Durée & Reconduction :</span>
              <span className="text-[#151413]">3 ans, reconduction tacite</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#6B6760]">Mode de règlement :</span>
              <span className="text-[#151413]">Virement bancaire</span>
            </div>
          </div>
        </div>

        <div className="border border-[#151413]/10 bg-[#FAF8F3] p-5 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#151413]">
            Coordonnées du Locataire
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[#151413]/5">
              <span className="text-[#6B6760]">Nom complet :</span>
              <span className="font-medium text-[#151413]">Pierre Durand</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#151413]/5">
              <span className="text-[#6B6760]">Adresse email :</span>
              <span className="font-mono text-[#151413]">pierre.durand@example.com</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#6B6760]">Quittances transmises :</span>
              <span className="text-[#166534] font-medium">Automatique par email</span>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 3. STANDALONE LEASE FORM                                                   */
/* ────────────────────────────────────────────────────────────────────────── */
function LeaseFormPreview({ hasErrors }: { hasErrors?: boolean }) {
  const [rent, setRent] = useState(850);
  const [charges, setCharges] = useState(70);
  const [deposit, setDeposit] = useState(hasErrors ? 1800 : 850);

  const totalMonthly = rent + charges;
  const isDepositOverLimit = hasErrors || deposit > rent;

  return (
    <PageShell maxWidth="default" className="space-y-8 py-8">
      {/* Header */}
      <div className="space-y-2 border-b border-[#151413]/10 pb-5">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#6B6760] font-semibold block">
          Nouveau Contrat de Location
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#151413] tracking-tight font-normal">
          Établir un bail de location
        </h1>
        <p className="text-sm text-[#6B6760]">
          Renseignez les conditions de la location. Les montants et dates serviront à générer les échéances et les quittances conformes.
        </p>
      </div>

      <div className="border border-[#151413]/10 bg-white divide-y divide-[#151413]/10">
        {/* Section 1: Cadre de la location */}
        <div className="p-6 space-y-5">
          <div className="space-y-0.5">
            <span className="text-[11px] uppercase tracking-wider text-[#6B6760] font-semibold block">
              1. Cadre de la location
            </span>
            <h2 className="text-sm font-semibold text-[#151413]">
              Désignation du bien & Locataire titulaire
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              id="propertyId"
              label="Bien immobilier"
              required
              description="Sélectionnez le logement donné en location."
            >
              <select className="w-full h-9 px-3 border border-[#151413]/15 bg-white text-sm text-[#151413]">
                <option>Studio Lyon République (69001 Lyon)</option>
              </select>
            </FormField>

            <FormField
              id="tenantId"
              label="Locataire principal"
              required
              description="Titulaire signataire du contrat de bail."
            >
              <select className="w-full h-9 px-3 border border-[#151413]/15 bg-white text-sm text-[#151413]">
                <option>Pierre Durand</option>
              </select>
            </FormField>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              id="startDate"
              label="Date de prise d'effet"
              required
              description="Début du bail et entrée dans les lieux."
            >
              <input
                type="date"
                defaultValue="2026-10-01"
                className="w-full h-9 px-3 border border-[#151413]/15 bg-white text-sm text-[#151413]"
              />
            </FormField>

            <FormField
              id="endDate"
              label="Date de fin de bail"
              optional
              description="Laisser vide pour un bail reconduit tacitement."
            >
              <input
                type="date"
                className="w-full h-9 px-3 border border-[#151413]/15 bg-white text-sm text-[#151413]"
              />
            </FormField>
          </div>
        </div>

        {/* Section 2: Conditions financières */}
        <div className="p-6 space-y-5">
          <div className="space-y-0.5">
            <span className="text-[11px] uppercase tracking-wider text-[#6B6760] font-semibold block">
              2. Conditions financières
            </span>
            <h2 className="text-sm font-semibold text-[#151413]">
              Loyer mensuel & Provisions sur charges
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              id="rentAmount"
              label="Loyer principal hors charges (€)"
              required
              description="Montant mensuel net hors charges locatives."
            >
              <input
                type="number"
                value={rent}
                onChange={(e) => setRent(Number(e.target.value) || 0)}
                className="w-full h-9 px-3 border border-[#151413]/15 bg-white text-sm font-mono text-[#151413]"
              />
            </FormField>

            <FormField
              id="chargesAmount"
              label="Provisions pour charges (€)"
              optional
              description="Charges locatives récupérables."
            >
              <input
                type="number"
                value={charges}
                onChange={(e) => setCharges(Number(e.target.value) || 0)}
                className="w-full h-9 px-3 border border-[#151413]/15 bg-white text-sm font-mono text-[#151413]"
              />
            </FormField>
          </div>

          {/* Dynamic Total */}
          <div className="border border-[#151413]/10 bg-[#FAF8F3] p-4 flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-xs uppercase tracking-wider text-[#6B6760] font-medium">
              Total mensuel exigible :
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-serif font-normal text-[#151413]">{totalMonthly.toFixed(2)} €</span>
              <span className="text-xs text-[#6B6760]">/ mois</span>
            </div>
          </div>

          {/* Dépôt de garantie avec vérification de plafond */}
          <div className="grid gap-5 sm:grid-cols-2 pt-2">
            <FormField
              id="depositAmount"
              label="Dépôt de garantie (€)"
              optional
              description={
                <span className="block space-y-1">
                  <span>Plafond légal : {rent.toFixed(2)} € (1 mois de loyer HC en location vide)</span>
                  {isDepositOverLimit && (
                    <button
                      type="button"
                      onClick={() => setDeposit(rent)}
                      className="text-[#151413] underline font-medium hover:text-[#6B6760] block"
                    >
                      Appliquer le plafond légal ({rent.toFixed(2)} €)
                    </button>
                  )}
                </span>
              }
              error={
                isDepositOverLimit
                  ? "Le dépôt de garantie ne peut excéder le plafond légal (art. 22 loi 1989)"
                  : undefined
              }
            >
              <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value) || 0)}
                className={`w-full h-9 px-3 border bg-white text-sm font-mono text-[#151413] ${
                  isDepositOverLimit ? "border-[#DC2626]" : "border-[#151413]/15"
                }`}
              />
            </FormField>

            <FormField
              id="paymentDay"
              label="Jour d'échéance du terme"
              required
              description="Jour du mois où le loyer est exigible."
            >
              <input
                type="number"
                defaultValue={1}
                min={1}
                max={31}
                className="w-full h-9 px-3 border border-[#151413]/15 bg-white text-sm font-mono text-[#151413]"
              />
            </FormField>
          </div>
        </div>
      </div>

      {/* Submit button */}
      <div className="flex justify-end gap-3 pt-2">
        <button className="h-9 px-4 text-xs border border-[#151413]/15 bg-white text-[#151413]">
          Annuler
        </button>
        <button className="h-9 px-5 text-xs font-medium bg-[#151413] text-[#F8F6F0]">
          Créer le bail
        </button>
      </div>
    </PageShell>
  );
}

export default function Wave2Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F6F0]" />}>
      <Wave2Content />
    </Suspense>
  );
}
