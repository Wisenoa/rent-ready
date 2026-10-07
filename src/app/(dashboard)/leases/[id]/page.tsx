import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Calendar,
  CreditCard,
  Download,
  Euro,
  FileText,
  Home,
  Mail,
  Phone,
  Scale,
  Shield,
  Users,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { summariseLease } from "@/lib/domain/lease-summary";
import { formatCurrency } from "@/lib/format";
import { presentTransaction } from "@/lib/domain/period-presentation";
import { getAuthenticatedUserId } from "@/lib/auth";
import { LeaseEditDialog } from "@/components/lease-edit-dialog";
import { QuittanceButton } from "@/components/quittance-button";
import {
  PageShell,
  Money,
  StatusBadge,
  StatusDot,
  AttentionSurface,
  type StatusTone,
} from "@/components/design-system";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const lease = await prisma.lease.findUnique({
    where: { id },
    select: {
      property: { select: { name: true } },
      tenant: { select: { firstName: true, lastName: true } },
    },
  });
  if (!lease) return { title: "Bail non trouvé" };
  return {
    title: `${lease.property.name} — ${lease.tenant.firstName} ${lease.tenant.lastName}`,
  };
}

const LEASE_TYPE_LABELS: Record<string, string> = {
  UNFURNISHED: "Location vide",
  FURNISHED: "Location meublée",
  COMMERCIAL: "Bail commercial",
  SEASONAL: "Location saisonnière",
};

const LEASE_STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  DRAFT: { label: "Brouillon", tone: "neutral" },
  ACTIVE: { label: "Actif", tone: "calm" },
  TERMINATED: { label: "Résilié", tone: "neutral" },
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  TRANSFER: "Virement bancaire",
  CHECK: "Chèque",
  CASH: "Espèces",
  DIRECT_DEBIT: "Prélèvement automatique",
  OTHER: "Autre moyen",
};

export default async function LeaseDetailPage({ params }: Props) {
  const { id } = await params;
  const userId = await getAuthenticatedUserId();

  const lease = await prisma.lease.findUnique({
    where: { id },
    include: {
      property: true,
      tenant: true,
      transactions: {
        orderBy: { dueDate: "desc" },
        take: 24,
      },
      guarantor: true,
    },
  });

  if (!lease || lease.userId !== userId) {
    notFound();
  }

  const statusCfg = LEASE_STATUS_CONFIG[lease.status] ?? LEASE_STATUS_CONFIG.DRAFT;
  const totalMonthly = Number(lease.rentAmount) + Number(lease.chargesAmount);
  const position = summariseLease(lease.transactions);

  return (
    <PageShell maxWidth="default" className="space-y-8 pb-16">
      {/* ────────────────────────────────────────────────────────────────── */}
      {/* 1. NAVIGATION & ACTIONS DU CONTRAT                                */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <Link
            href="/leases"
            className="inline-flex items-center gap-1.5 hover:text-neutral-900 transition-colors group font-medium"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Tous les baux</span>
          </Link>

          <div className="flex items-center gap-2">
            {lease.documentUrl && (
              <a
                href={lease.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 shadow-sm transition-colors"
              >
                <Download className="size-3" />
                <span>Télécharger</span>
              </a>
            )}
            {lease.status === "ACTIVE" && lease.revisionDate && (
              <Link
                href={`/leases/${lease.id}/revision`}
                className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 shadow-sm transition-colors"
              >
                <Scale className="size-3" />
                <span>Réviser IRL</span>
              </Link>
            )}
            <LeaseEditDialog
              lease={{
                id: lease.id,
                propertyId: lease.propertyId,
                tenantId: lease.tenantId,
                rentAmount: Number(lease.rentAmount),
                chargesAmount: Number(lease.chargesAmount),
                depositAmount: Number(lease.depositAmount),
                startDate: lease.startDate,
                endDate: lease.endDate,
                paymentDay: lease.paymentDay,
                paymentMethod: lease.paymentMethod,
                leaseType: lease.leaseType,
                irlReferenceQuarter: lease.irlReferenceQuarter,
                irlReferenceValue: lease.irlReferenceValue ? Number(lease.irlReferenceValue) : null,
              }}
            />
          </div>
        </div>

        {/* Titre & Statut */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 border-b border-neutral-200/80 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <span className="font-medium text-neutral-600">Contrat de location</span>
              <span>·</span>
              <span>Rattaché à {lease.property.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              {lease.tenant.firstName} {lease.tenant.lastName}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge tone={statusCfg.tone} showDot size="sm">
              {statusCfg.label}
            </StatusBadge>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* 2. BARRE FINANCIÈRE DE CONDITIONS CONTRACTUELLES                  */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <div className="rounded-lg border border-neutral-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          {/* Loyer HC */}
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-neutral-500 block">
              Loyer principal HC
            </span>
            <div className="flex items-baseline gap-1">
              <Money amount={Number(lease.rentAmount)} size="xl" tone="ink" />
              <span className="text-xs text-neutral-400">/mois</span>
            </div>
          </div>

          {/* Charges */}
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-neutral-500 block">
              Provisions charges
            </span>
            <div className="flex items-baseline gap-1">
              <Money amount={Number(lease.chargesAmount)} size="xl" tone="ink" />
              <span className="text-xs text-neutral-400">/mois</span>
            </div>
          </div>

          {/* Total mensuel */}
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-neutral-500 block">
              Total mensuel CC
            </span>
            <div className="flex items-baseline gap-1">
              <Money amount={totalMonthly} size="xl" tone="ink" />
              <span className="text-xs text-neutral-400">/mois</span>
            </div>
          </div>

          {/* Dépôt de garantie */}
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-neutral-500 block">
              Dépôt de garantie
            </span>
            <div className="flex items-baseline gap-1">
              <Money amount={Number(lease.depositAmount)} size="xl" tone="ink" />
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* 3. ALERTE ARRIÉRÉS / RETARDS (Si exception constatée)              */}
      {/* ────────────────────────────────────────────────────────────────── */}
      {position.overdueCount > 0 && (
        <AttentionSurface className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="size-4 text-orange-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-xs text-neutral-900 space-y-0.5">
              <span className="font-semibold text-orange-700 block">
                {formatCurrency(position.overdueAmount)} d&apos;arriérés sur {position.overdueCount} échéance{position.overdueCount > 1 ? "s" : ""}
              </span>
              <p className="text-neutral-600">
                Le terme le plus ancien accuse {position.oldestOverdueDays} jours de retard.
              </p>
            </div>
          </div>

          <Link
            href="/billing"
            className="shrink-0 inline-flex items-center gap-1.5 rounded-md bg-orange-600 text-white px-3 py-1.5 text-xs font-medium hover:bg-orange-700 transition-colors shadow-sm"
          >
            Pointer un règlement
          </Link>
        </AttentionSurface>
      )}

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* 4. DISPOSITION CONTINUE : CONDITIONS & HISTORIQUE DES LOYERS       */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Colonne gauche (1/3) : Parties & Logement */}
        <div className="space-y-6">
          {/* Fiche Logement */}
          <div className="rounded-lg border border-neutral-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
              <span className="text-xs font-semibold text-neutral-900">
                Bien loué
              </span>
              <Link
                href={`/properties/${lease.property.id}`}
                className="text-xs text-neutral-600 hover:text-neutral-900 hover:underline font-medium"
              >
                Fiche logement →
              </Link>
            </div>
            <div className="space-y-1 text-xs">
              <p className="font-medium text-sm text-neutral-900">{lease.property.name}</p>
              <p className="text-neutral-600">
                {lease.property.addressLine1}
                <br />
                {lease.property.postalCode} {lease.property.city}
              </p>
              {lease.property.surface && (
                <p className="text-neutral-500 pt-1">
                  Surface : {lease.property.surface} m² {lease.property.type ? `· ${lease.property.type}` : ""}
                </p>
              )}
            </div>
          </div>

          {/* Fiche Locataire */}
          <div className="rounded-lg border border-neutral-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
              <span className="text-xs font-semibold text-neutral-900">
                Locataire titulaire
              </span>
              <Link
                href={`/tenants?id=${lease.tenant.id}`}
                className="text-xs text-neutral-600 hover:text-neutral-900 hover:underline font-medium"
              >
                Fiche locataire →
              </Link>
            </div>
            <div className="space-y-2 text-xs">
              <p className="font-medium text-sm text-neutral-900">
                {lease.tenant.firstName} {lease.tenant.lastName}
              </p>
              {lease.tenant.email && (
                <a
                  href={`mailto:${lease.tenant.email}`}
                  className="flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  <Mail className="size-3" />
                  <span>{lease.tenant.email}</span>
                </a>
              )}
              {lease.tenant.phone && (
                <a
                  href={`tel:${lease.tenant.phone}`}
                  className="flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  <Phone className="size-3" />
                  <span className="tabular-nums">{lease.tenant.phone}</span>
                </a>
              )}
            </div>
          </div>

          {/* Fiche Garant (si présent) */}
          {lease.guarantor && (
            <div className="rounded-lg border border-neutral-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-3">
              <span className="text-xs font-semibold text-neutral-900 block border-b border-neutral-100 pb-2.5">
                Caution solidaire (Garant)
              </span>
              <div className="space-y-1.5 text-xs">
                <p className="font-medium text-sm text-neutral-900">
                  {lease.guarantor.firstName} {lease.guarantor.lastName}
                </p>
                {lease.guarantor.email && (
                  <p className="text-neutral-600">{lease.guarantor.email}</p>
                )}
                {lease.guarantor.phone && (
                  <p className="text-neutral-600 tabular-nums">{lease.guarantor.phone}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Colonne droite (2/3) : Clauses contractuelles & Historique */}
        <div className="lg:col-span-2 space-y-6">
          {/* Clauses contractuelles */}
          <div className="rounded-lg border border-neutral-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-4">
            <h2 className="text-xs font-semibold text-neutral-900 border-b border-neutral-100 pb-2.5">
              Conditions & Modalités d&apos;exécution
            </h2>

            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs">
              <div>
                <span className="text-neutral-500 block">Nature du contrat</span>
                <span className="font-medium text-neutral-900">
                  {LEASE_TYPE_LABELS[lease.leaseType] ?? lease.leaseType}
                </span>
              </div>

              <div>
                <span className="text-neutral-500 block">Moyen de règlement</span>
                <span className="font-medium text-neutral-900">
                  {PAYMENT_METHOD_LABELS[lease.paymentMethod] ?? lease.paymentMethod}
                </span>
              </div>

              <div>
                <span className="text-neutral-500 block">Prise d&apos;effet</span>
                <span className="font-medium text-neutral-900">
                  {format(new Date(lease.startDate), "d MMMM yyyy", { locale: fr })}
                </span>
              </div>

              <div>
                <span className="text-neutral-500 block">Échéance contractuelle</span>
                <span className="font-medium text-neutral-900">
                  {lease.endDate
                    ? format(new Date(lease.endDate), "d MMMM yyyy", { locale: fr })
                    : "Durée indéterminée (tacite reconduction)"}
                </span>
              </div>

              <div>
                <span className="text-neutral-500 block">Jour d&apos;exigibilité</span>
                <span className="font-medium text-neutral-900">Le {lease.paymentDay} du mois</span>
              </div>

              {lease.irlReferenceQuarter && (
                <div>
                  <span className="text-neutral-500 block">Indice IRL d&apos;origine</span>
                  <span className="font-medium text-neutral-900">
                    Trimestre {lease.irlReferenceQuarter}
                    {lease.irlReferenceValue ? ` (${lease.irlReferenceValue})` : ""}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Historique des paiements & quittances */}
          <div className="rounded-lg border border-neutral-200/80 bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="border-b border-neutral-200/80 px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-neutral-900">
                  Historique des termes & Quittances
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {formatCurrency(position.collected)} perçu · {formatCurrency(position.outstanding)} restant
                </p>
              </div>
            </div>

            {lease.transactions.length === 0 ? (
              <p className="text-xs text-neutral-500 text-center py-8">
                Aucune échéance enregistrée pour ce bail
              </p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200/80 bg-neutral-50/60 text-xs text-neutral-500 font-medium">
                    <th className="py-2.5 px-4 font-medium">Période</th>
                    <th className="py-2.5 px-4 font-medium text-right">Montant</th>
                    <th className="py-2.5 px-4 font-medium">Statut</th>
                    <th className="py-2.5 px-4 font-medium">Paiement</th>
                    <th className="py-2.5 px-4 font-medium text-right">Quittance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs">
                  {lease.transactions.map((tx) => {
                    const txStatus = presentTransaction(tx);
                    const tone: StatusTone =
                      txStatus.label === "Payé"
                        ? "calm"
                        : txStatus.label === "En retard"
                          ? "delayed"
                          : txStatus.label === "Partiel"
                            ? "attention"
                            : "neutral";

                    return (
                      <tr key={tx.id} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="py-2.5 px-4 text-xs font-medium text-neutral-800 capitalize">
                          {format(new Date(tx.periodStart), "MMM yyyy", { locale: fr })}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <Money amount={tx.amount} tone="ink" size="sm" />
                        </td>
                        <td className="py-2.5 px-4">
                          <StatusBadge tone={tone} showDot size="xs">
                            {txStatus.label}
                          </StatusBadge>
                        </td>
                        <td className="py-2.5 px-4 text-neutral-500 text-xs tabular-nums">
                          {tx.paidAt ? format(new Date(tx.paidAt), "dd/MM/yyyy", { locale: fr }) : "—"}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          {(tx.status === "PAID" || tx.status === "PARTIAL") && tx.receiptType ? (
                            <QuittanceButton transactionId={tx.id} />
                          ) : tx.receiptUrl ? (
                            <a
                              href={tx.receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-neutral-700 underline hover:text-neutral-900"
                            >
                              <Download className="size-3" />
                              <span>PDF</span>
                            </a>
                          ) : (
                            <span className="text-neutral-300">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
