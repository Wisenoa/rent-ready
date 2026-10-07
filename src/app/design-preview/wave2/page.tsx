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
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 border-b border-neutral-200/80 pb-5">
        <div className="space-y-1">
          <span className="text-xs font-medium text-neutral-500 block">
            Grand Livre des Encaissements
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            Paiements & Quittances
          </h1>
          <p className="text-sm text-neutral-600">
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
              <span className="text-xs font-semibold text-orange-700 block">
                Attention requise · Acompte perçu
              </span>
              <p className="text-sm font-medium text-neutral-900">
                Studio Nantes — 400,00 € reçus sur 850,00 € exigibles (Solde restant dû : 450,00 €).
              </p>
              <p className="text-xs text-neutral-600">
                Conformément à la réglementation, la quittance intégrale est bloquée jusqu'à l'apurement complet du terme.
              </p>
            </div>
            <button className="h-8 px-3 text-xs font-medium rounded-md border border-orange-300 bg-white text-orange-700 hover:bg-orange-50 shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto">
              Enregistrer le solde (450,00 €)
            </button>
          </div>
        </AttentionSurface>
      )}

      {/* Ledger Table */}
      <div className="rounded-lg border border-neutral-200/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-4 border-b border-neutral-200/80 bg-neutral-50/60 flex items-center justify-between">
          <h2 className="text-xs font-semibold text-neutral-900">
            Journal Chronologique des Règlements ({transactions.length})
          </h2>
          <span className="text-xs text-neutral-500">
            Octobre 2026
          </span>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200/80 bg-neutral-50/60 text-xs text-neutral-500 font-medium">
                <th className="py-2.5 px-4 font-medium">Logement & Locataire</th>
                <th className="py-2.5 px-4 font-medium">Échéance</th>
                <th className="py-2.5 px-4 font-medium text-right">Attendu</th>
                <th className="py-2.5 px-4 font-medium text-right">Perçu</th>
                <th className="py-2.5 px-4 font-medium text-right">Solde</th>
                <th className="py-2.5 px-4 font-medium">Statut</th>
                <th className="py-2.5 px-4 font-medium text-right">Action / Quittance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-sm">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-medium text-neutral-900 block">{tx.property}</span>
                    <span className="text-xs text-neutral-500 block">{tx.tenant}</span>
                  </td>
                  <td className="py-3 px-4 text-xs text-neutral-500 tabular-nums">{tx.due}</td>
                  <td className="py-3 px-4 text-right text-neutral-900 tabular-nums">{tx.expected.toFixed(2)} €</td>
                  <td className="py-3 px-4 text-right font-medium text-emerald-700 tabular-nums">
                    {tx.received.toFixed(2)} €
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums">
                    {tx.balance > 0 ? (
                      <span className="text-orange-700 font-medium">{tx.balance.toFixed(2)} €</span>
                    ) : (
                      <span className="text-neutral-400">—</span>
                    )}
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
                      <button className="inline-flex items-center gap-1.5 text-xs text-neutral-700 hover:text-neutral-900 font-medium underline">
                        <Download className="size-3.5" />
                        Télécharger
                      </button>
                    ) : (
                      <button className="h-7 px-2.5 text-xs rounded-md border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 shadow-sm transition-colors">
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
        <div className="md:hidden divide-y divide-neutral-100">
          {transactions.map((tx) => (
            <div key={tx.id} className="p-4 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-semibold text-sm text-neutral-900 block leading-tight">{tx.property}</span>
                  <span className="text-xs text-neutral-500 block">{tx.tenant}</span>
                </div>
                {tx.status === "PAID" ? (
                  <StatusBadge tone="calm" size="xs">Réglé</StatusBadge>
                ) : (
                  <StatusBadge tone="attention" size="xs">Acompte perçu</StatusBadge>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 border-y border-neutral-100 text-xs">
                <div>
                  <span className="text-xs text-neutral-500 block">Attendu</span>
                  <span className="text-neutral-900 font-medium tabular-nums">{tx.expected} €</span>
                </div>
                <div>
                  <span className="text-xs text-neutral-500 block">Perçu</span>
                  <span className="text-emerald-700 font-semibold tabular-nums">{tx.received} €</span>
                </div>
                <div>
                  <span className="text-xs text-neutral-500 block">Solde</span>
                  <span className={tx.balance > 0 ? "text-orange-700 font-semibold tabular-nums" : "text-neutral-500 tabular-nums"}>
                    {tx.balance > 0 ? `${tx.balance} €` : "0 €"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-neutral-500 tabular-nums">Échéance : {tx.due}</span>
                {tx.status === "PAID" ? (
                  <button className="inline-flex items-center gap-1 text-xs text-neutral-700 underline font-medium">
                    <Download className="size-3" />
                    Quittance
                  </button>
                ) : (
                  <button className="h-7 px-2 text-xs rounded-md border border-neutral-300 bg-white text-neutral-700 font-medium shadow-sm hover:bg-neutral-50 transition-colors">
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
        <Link href="#" className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
          <ArrowLeft className="size-3.5" />
          Retour au registre des baux
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 border-b border-neutral-200/80 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <StatusBadge tone="calm" size="xs">Bail actif</StatusBadge>
              <span className="text-xs text-neutral-500">Réf: BAIL-2026-LYON-01</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              Bail d'habitation · Studio Lyon République
            </h1>
            <p className="text-sm text-neutral-600">
              8 Rue de la République, 69001 Lyon · Titulaire : Pierre Durand
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-8 px-3 text-xs rounded-md border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 font-medium flex items-center gap-1.5 shadow-sm transition-colors">
              <Download className="size-3.5" />
              Contrat signé PDF
            </button>
          </div>
        </div>
      </div>

      {/* Financial Conditions Bar */}
      <div className="rounded-lg border border-neutral-200/80 bg-white p-5 space-y-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <span className="text-xs font-semibold text-neutral-900 block">
          Conditions Financières & Modalités du Contrat
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-1">
          <div className="space-y-0.5">
            <span className="text-xs text-neutral-500 block">Loyer hors charges</span>
            <span className="text-lg font-semibold text-neutral-900 tabular-nums">600,00 €</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-neutral-500 block">Provisions charges</span>
            <span className="text-lg font-semibold text-neutral-900 tabular-nums">50,00 €</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-neutral-500 block">Total mensuel</span>
            <span className="text-lg font-semibold text-emerald-700 tabular-nums">650,00 €</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-neutral-500 block">Dépôt de garantie</span>
            <span className="text-lg font-semibold text-neutral-900 tabular-nums">600,00 €</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-neutral-500 block">Jour d'échéance</span>
            <span className="text-lg font-semibold text-neutral-900 tabular-nums">Le 5 du mois</span>
          </div>
        </div>
      </div>

      {/* Contract Lifecycle & Parties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border border-neutral-200/80 bg-white p-5 space-y-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <h2 className="text-xs font-semibold text-neutral-900 border-b border-neutral-100 pb-2">
            Modalités Contractuelles
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Type de bail :</span>
              <span className="font-medium text-neutral-900">Location vide (loi du 6 juillet 1989)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Date de prise d'effet :</span>
              <span className="text-neutral-900 tabular-nums">01 octobre 2026</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Durée & Reconduction :</span>
              <span className="text-neutral-900">3 ans, reconduction tacite</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-500">Mode de règlement :</span>
              <span className="text-neutral-900">Virement bancaire</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200/80 bg-white p-5 space-y-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <h2 className="text-xs font-semibold text-neutral-900 border-b border-neutral-100 pb-2">
            Coordonnées du Locataire
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Nom complet :</span>
              <span className="font-medium text-neutral-900">Pierre Durand</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Adresse email :</span>
              <span className="text-neutral-900">pierre.durand@example.com</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-500">Quittances transmises :</span>
              <span className="text-emerald-700 font-medium">Automatique par email</span>
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
    <PageShell maxWidth="default" className="space-y-6 pb-16">
      {/* Header */}
      <div className="space-y-1 border-b border-neutral-200/80 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
          Établir un bail de location
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-xl">
          Renseignez les conditions de la location. Les montants et dates serviront à générer les échéances et les quittances conformes.
        </p>
      </div>

      <div className="rounded-lg border border-neutral-200/80 bg-white divide-y divide-neutral-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        {/* Section 1: Cadre de la location */}
        <div className="p-5 sm:p-6 space-y-5">
          <div className="space-y-0.5">
            <h2 className="text-sm font-semibold text-neutral-900">
              1. Cadre de la location
            </h2>
            <p className="text-xs text-neutral-500">
              Désignation du bien, locataire titulaire et dates d'effet.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              id="propertyId"
              label="Bien immobilier"
              required
              description="Sélectionnez le logement donné en location."
            >
              <select className="w-full h-9 px-3 border border-neutral-300 rounded-md bg-white text-sm text-neutral-900">
                <option>Studio Lyon République (69001 Lyon)</option>
              </select>
            </FormField>

            <FormField
              id="tenantId"
              label="Locataire principal"
              required
              description="Titulaire signataire du contrat de bail."
            >
              <select className="w-full h-9 px-3 border border-neutral-300 rounded-md bg-white text-sm text-neutral-900">
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
                className="w-full h-9 px-3 border border-neutral-300 rounded-md bg-white text-sm text-neutral-900"
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
                className="w-full h-9 px-3 border border-neutral-300 rounded-md bg-white text-sm text-neutral-900"
              />
            </FormField>
          </div>
        </div>

        {/* Section 2: Conditions financières */}
        <div className="p-5 sm:p-6 space-y-5">
          <div className="space-y-0.5">
            <h2 className="text-sm font-semibold text-neutral-900">
              2. Conditions financières
            </h2>
            <p className="text-xs text-neutral-500">
              Loyer mensuel, provisions pour charges et dépôt de garantie.
            </p>
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
                className="w-full h-9 px-3 border border-neutral-300 rounded-md bg-white text-sm tabular-nums text-neutral-900"
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
                className="w-full h-9 px-3 border border-neutral-300 rounded-md bg-white text-sm tabular-nums text-neutral-900"
              />
            </FormField>
          </div>

          {/* Dynamic Total */}
          <div className="rounded-lg border border-neutral-200/80 bg-neutral-50 p-4 flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-xs font-medium text-neutral-700">
              Total mensuel exigible :
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-bold text-neutral-900 tabular-nums">
                {totalMonthly.toFixed(2)} €
              </span>
              <span className="text-xs text-neutral-500">/ mois</span>
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
                      className="text-neutral-900 underline font-medium hover:text-neutral-700 block"
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
                className={`w-full h-9 px-3 border rounded-md bg-white text-sm tabular-nums text-neutral-900 ${
                  isDepositOverLimit ? "border-red-500 bg-red-50/20" : "border-neutral-300"
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
                className="w-full h-9 px-3 border border-neutral-300 rounded-md bg-white text-sm tabular-nums text-neutral-900"
              />
            </FormField>
          </div>
        </div>
      </div>

      {/* Submit button */}
      <div className="flex justify-end gap-3 pt-2">
        <button className="h-9 px-4 text-xs font-medium border border-neutral-300 bg-white text-neutral-700 rounded-md hover:bg-neutral-50 shadow-sm transition-colors">
          Annuler
        </button>
        <button className="h-9 px-5 text-xs font-medium bg-neutral-900 text-white rounded-md hover:bg-neutral-800 shadow-sm transition-colors">
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
