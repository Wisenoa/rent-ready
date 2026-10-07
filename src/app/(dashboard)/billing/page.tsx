import { Metadata } from "next";
import Decimal from "decimal.js";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  FileText,
  FileCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Receipt,
  Download,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/auth";
import { TransactionForm } from "@/components/transaction-form";
import {
  presentTransaction,
  daysLate as periodDaysLate,
} from "@/lib/domain/period-presentation";
import { QuittanceButton } from "@/components/quittance-button";
import { MarkPaidButton } from "./mark-paid-button";
import { CancelPaymentButton } from "./cancel-payment-button";
import { SubscriptionBanner } from "./subscription-banner";
import { formatCurrency } from "@/lib/format";
import { toNumber } from "@/lib/decimal";
import { ensureRentPeriods } from "@/lib/queries/rent-periods";
import { getDuePeriodsByLease } from "@/lib/queries/due-periods";
import {
  PageShell,
  Section,
  Money,
  StatusBadge,
  StatusDot,
  FinancialSummary,
  type StatusTone,
} from "@/components/design-system";

export const metadata: Metadata = {
  title: "Loyers & Quittances — Grand Livre",
};

const RECEIPT_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  QUITTANCE: {
    label: "Quittance",
    tone: "calm",
  },
  RECU: {
    label: "Reçu d'acompte",
    tone: "attention",
  },
};

function getStatusTone(statusLabel: string): StatusTone {
  if (statusLabel === "Payé") return "calm";
  if (statusLabel === "Partiel") return "attention";
  if (statusLabel === "En retard") return "delayed";
  return "neutral";
}

export default async function BillingPage() {
  const userId = await getAuthenticatedUserId();

  // Matérialisation préalable des périodes exigibles
  await ensureRentPeriods(userId);

  // Bornes du mois civil en cours
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  const monthLabel = format(monthStart, "MMMM yyyy", { locale: fr });

  // Exécution parallèle des requêtes financières du grand livre
  const [
    user,
    transactions,
    receivedByMonth,
    totalPaid,
    totalPending,
    quittanceCount,
    recuCount,
    activeLeases,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        subscriptionStatus: true,
        trialEndsAt: true,
      },
    }),
    prisma.transaction.findMany({
      where: { userId },
      include: {
        lease: {
          include: {
            property: { select: { id: true, name: true, addressLine1: true, city: true } },
            tenant: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
      orderBy: { dueDate: "desc" },
      take: 50,
    }),
    prisma.transaction.findMany({
      where: {
        userId,
        paidAt: { not: null },
        status: { not: "CANCELLED" },
      },
      select: { leaseId: true, periodStart: true, amount: true },
    }),
    prisma.transaction.aggregate({
      where: {
        userId,
        paidAt: { gte: monthStart, lte: monthEnd },
        status: { not: "CANCELLED" },
      },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { userId, paidAt: null, dueDate: { lt: new Date() } },
      _sum: { amount: true },
    }),
    prisma.transaction.count({
      where: { userId, receiptType: "QUITTANCE" },
    }),
    prisma.transaction.count({
      where: { userId, receiptType: "RECU" },
    }),
    prisma.lease.findMany({
      where: { userId, status: "ACTIVE" },
      select: {
        id: true,
        rentAmount: true,
        chargesAmount: true,
        property: { select: { name: true } },
        tenant: { select: { firstName: true, lastName: true } },
      },
    }),
  ]);

  // Calculs financiers stricts avec Decimal (zéro arithmétique flottante JS)
  const expectedMonthlyTotal = activeLeases.reduce((acc, l) => {
    return acc.plus(new Decimal(l.rentAmount)).plus(new Decimal(l.chargesAmount || 0));
  }, new Decimal(0));

  const totalPaidDecimal = new Decimal(totalPaid._sum.amount ?? 0);
  const totalPendingDecimal = new Decimal(totalPending._sum.amount ?? 0);
  const hasTransactions = transactions.length > 0;

  const collectionPercentage = expectedMonthlyTotal.gt(0)
    ? Math.min(100, Math.round(totalPaidDecimal.dividedBy(expectedMonthlyTotal).toNumber() * 100))
    : 100;

  // Réconciliation des montants perçus par mois civil
  const receiptsByMonth = new Map<string, Decimal>();
  for (const receipt of receivedByMonth) {
    const key = `${receipt.leaseId}|${receipt.periodStart.toISOString().slice(0, 7)}`;
    const previous = receiptsByMonth.get(key) ?? new Decimal(0);
    receiptsByMonth.set(key, previous.plus(new Decimal(receipt.amount)));
  }

  // Périodes exigibles pour le dialogue d'enregistrement
  const duePeriodsByLease = await getDuePeriodsByLease(
    userId,
    activeLeases.map((l) => l.id)
  );

  const leaseOptions = activeLeases.map((l) => ({
    id: l.id,
    property: l.property,
    tenant: l.tenant,
    duePeriods: duePeriodsByLease[l.id] ?? [],
  }));

  const subscriptionStatus = user?.subscriptionStatus ?? "TRIAL";
  const trialEndsAt = user?.trialEndsAt ?? null;

  return (
    <PageShell maxWidth="default" className="space-y-8 pb-16">
      {/* ────────────────────────────────────────────────────────────────── */}
      {/* 1. BANDEAU D'ABONNEMENT OU ALERTE ESSAI                           */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <SubscriptionBanner
        status={subscriptionStatus}
        trialEndsAt={trialEndsAt}
        stripeCustomerId={user?.stripeCustomerId ?? null}
      />

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* 2. ENTÊTE FONCTIONNEL DU GRAND LIVRE                               */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-neutral-200/80 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            Paiements & Quittances
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-xl">
            Grand livre des écritures, suivi des règlements et délivrance des attestations libératoires conformes.
          </p>
        </div>

        <div className="shrink-0">
          <TransactionForm leases={leaseOptions} />
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* 3. SYNTHÈSE FINANCIÈRE DE TRÉSORERIE                               */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <div className="rounded-lg border border-neutral-200/80 bg-white p-5 sm:p-6 space-y-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between text-xs text-neutral-500 pb-2 border-b border-neutral-200/80">
          <span className="font-medium text-neutral-900">
            Synthèse mensuelle au {format(now, "d MMMM yyyy", { locale: fr })}
          </span>
          <div className="flex items-center gap-4 text-[11px] tabular-nums">
            <span>
              <strong className="text-neutral-900">{activeLeases.length}</strong> baux actifs
            </span>
            <span>·</span>
            <span>
              <strong className="text-emerald-700">{quittanceCount}</strong> quittances
            </span>
            {recuCount > 0 && (
              <>
                <span>·</span>
                <span>
                  <strong className="text-orange-700">{recuCount}</strong> reçus
                </span>
              </>
            )}
          </div>
        </div>

        <FinancialSummary
          expected={expectedMonthlyTotal}
          received={totalPaidDecimal}
          outstanding={totalPendingDecimal}
          collectionPercentage={collectionPercentage}
        />
      </div>

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* 4. REGISTRE DES ÉCRITURES FINANCIÈRES                              */}
      {/* ────────────────────────────────────────────────────────────────── */}
      {hasTransactions ? (
        <div className="rounded-lg border border-neutral-200/80 bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          {/* En-tête du registre */}
          <div className="border-b border-neutral-200/80 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-neutral-900">
                Journal chronologique des loyers
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                {transactions.length} écriture{transactions.length > 1 ? "s" : ""} comptable{transactions.length > 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-neutral-500">
              <span className="inline-flex items-center gap-1.5">
                <StatusDot tone="calm" />
                <span>Réglé</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <StatusDot tone="attention" />
                <span>Acompte</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <StatusDot tone="delayed" />
                <span>En attente / Retard</span>
              </span>
            </div>
          </div>

          {/* Table Desktop (>= 768px) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200/80 bg-neutral-50/70 text-[11px] font-semibold text-neutral-600">
                  <th className="py-2.5 px-4 font-normal">Période</th>
                  <th className="py-2.5 px-4 font-normal">Locataire & Logement</th>
                  <th className="py-2.5 px-4 font-normal text-right">Montant</th>
                  <th className="py-2.5 px-4 font-normal">Statut</th>
                  <th className="py-2.5 px-4 font-normal">Pièce émise</th>
                  <th className="py-2.5 px-4 font-normal">Règlement</th>
                  <th className="py-2.5 px-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/80 text-xs">
                {transactions.map((tx) => {
                  const status = presentTransaction(tx);
                  const lateBy = periodDaysLate(tx.dueDate);
                  const tone = getStatusTone(status.label);
                  const receipt = tx.receiptType ? RECEIPT_CONFIG[tx.receiptType] : null;

                  const monthKey = `${tx.leaseId}|${tx.periodStart.toISOString().slice(0, 7)}`;
                  const ownAmount = new Decimal(tx.amount);
                  const alreadyPaid = (
                    receiptsByMonth.get(monthKey) ?? new Decimal(0)
                  )
                    .minus(tx.paidAt ? ownAmount : new Decimal(0))
                    .toDecimalPlaces(2);
                  const isPartial = alreadyPaid.gt(0);
                  const periodTotal = new Decimal(tx.amount).plus(alreadyPaid);

                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-neutral-50/60 transition-colors"
                    >
                      {/* 1. Période */}
                      <td className="py-3 px-4 tabular-nums text-xs font-semibold text-neutral-900 whitespace-nowrap capitalize">
                        {format(tx.periodStart, "MMM yyyy", { locale: fr })}
                      </td>

                      {/* 2. Locataire & Logement */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-neutral-900">
                          {tx.lease.tenant?.firstName ?? ""} {tx.lease.tenant?.lastName ?? ""}
                        </div>
                        <div className="text-[11px] text-neutral-500 truncate max-w-xs">
                          {tx.lease.property?.name ?? ""}
                        </div>
                      </td>

                      {/* 3. Montant */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {isPartial ? (
                          <div>
                            <Money amount={tx.amount} tone="attention" size="sm" />
                            <span className="block text-[11px] text-neutral-500 tabular-nums">
                              sur {formatCurrency(periodTotal.toFixed(2))}
                            </span>
                          </div>
                        ) : (
                          <Money
                            amount={tx.amount}
                            tone={status.label === "Payé" ? "calm" : status.label === "En retard" ? "delayed" : "ink"}
                            size="sm"
                          />
                        )}
                      </td>

                      {/* 4. Statut */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <StatusBadge tone={tone} showDot size="xs">
                          {status.label}
                        </StatusBadge>
                        {lateBy > 0 && status.label === "En retard" && (
                          <span className="block text-[10px] tabular-nums text-orange-700 mt-0.5">
                            +{lateBy} j de retard
                          </span>
                        )}
                      </td>

                      {/* 5. Pièce émise */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {receipt ? (
                          <StatusBadge tone={receipt.tone} size="xs">
                            {receipt.label}
                          </StatusBadge>
                        ) : (
                          <span className="text-neutral-400">—</span>
                        )}
                        {tx.receiptUrl && (
                          <a
                            href={tx.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-neutral-900 underline ml-2 hover:text-neutral-700"
                          >
                            <Download className="size-3" />
                            <span>Télécharger</span>
                          </a>
                        )}
                      </td>

                      {/* 6. Date règlement */}
                      <td className="py-3 px-4 whitespace-nowrap text-neutral-600 tabular-nums text-xs">
                        {tx.paidAt ? format(tx.paidAt, "dd/MM/yyyy", { locale: fr }) : "—"}
                      </td>

                      {/* 7. Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {tx.status === "PENDING" && (
                            <MarkPaidButton
                              transactionId={tx.id}
                              defaultAmount={toNumber(tx.amount)}
                              size="xs"
                            />
                          )}
                          {(tx.status === "PAID" || tx.status === "PARTIAL") && tx.receiptType && (
                            <QuittanceButton transactionId={tx.id} />
                          )}
                          {tx.status !== "CANCELLED" && tx.paidAt && (
                            <CancelPaymentButton
                              transactionId={tx.id}
                              amount={toNumber(tx.amount)}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Liste Mobile (< 768px) adaptée haute densité sans Card Soup */}
          <div className="md:hidden divide-y divide-neutral-200/80">
            {transactions.map((tx) => {
              const status = presentTransaction(tx);
              const lateBy = periodDaysLate(tx.dueDate);
              const tone = getStatusTone(status.label);
              const receipt = tx.receiptType ? RECEIPT_CONFIG[tx.receiptType] : null;

              const monthKey = `${tx.leaseId}|${tx.periodStart.toISOString().slice(0, 7)}`;
              const ownAmount = new Decimal(tx.amount);
              const alreadyPaid = (
                receiptsByMonth.get(monthKey) ?? new Decimal(0)
              )
                .minus(tx.paidAt ? ownAmount : new Decimal(0))
                .toDecimalPlaces(2);
              const isPartial = alreadyPaid.gt(0);
              const periodTotal = new Decimal(tx.amount).plus(alreadyPaid);

              return (
                <div key={tx.id} className="p-4 space-y-2.5 bg-white">
                  {/* Ligne 1 : Période, Statut & Montant */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="tabular-nums text-xs font-semibold text-neutral-900 capitalize">
                        {format(tx.periodStart, "MMM yyyy", { locale: fr })}
                      </span>
                      <StatusBadge tone={tone} showDot size="xs">
                        {status.label}
                      </StatusBadge>
                    </div>

                    <div className="text-right">
                      {isPartial ? (
                        <div>
                          <Money amount={tx.amount} tone="attention" size="sm" />
                          <span className="block text-[10px] text-neutral-500 tabular-nums">
                            sur {formatCurrency(periodTotal.toFixed(2))}
                          </span>
                        </div>
                      ) : (
                        <Money
                          amount={tx.amount}
                          tone={status.label === "Payé" ? "calm" : status.label === "En retard" ? "delayed" : "ink"}
                          size="sm"
                        />
                      )}
                    </div>
                  </div>

                  {/* Ligne 2 : Locataire & Logement */}
                  <div className="flex items-baseline justify-between text-xs text-neutral-500 gap-2">
                    <span className="font-medium text-neutral-900 truncate">
                      {tx.lease.tenant?.firstName ?? ""} {tx.lease.tenant?.lastName ?? ""}
                    </span>
                    <span className="text-[11px] truncate text-neutral-500">
                      {tx.lease.property?.name ?? ""}
                    </span>
                  </div>

                  {/* Ligne 3 : Pièce émise & Date règlement */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-100 text-neutral-500">
                    <div className="flex items-center gap-2">
                      {receipt ? (
                        <StatusBadge tone={receipt.tone} size="xs">
                          {receipt.label}
                        </StatusBadge>
                      ) : (
                        <span className="text-[11px] text-neutral-400">Sans reçu</span>
                      )}
                      {tx.receiptUrl && (
                        <a
                          href={tx.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-neutral-900 underline hover:text-neutral-700"
                        >
                          <Download className="size-3" />
                          <span>Télécharger</span>
                        </a>
                      )}
                      {lateBy > 0 && status.label === "En retard" && (
                        <span className="text-[11px] tabular-nums text-orange-700 font-medium">
                          +{lateBy} j
                        </span>
                      )}
                    </div>

                    <span className="tabular-nums text-[11px] text-neutral-600">
                      {tx.paidAt ? format(tx.paidAt, "dd/MM/yyyy", { locale: fr }) : "Non réglé"}
                    </span>
                  </div>

                  {/* Ligne 4 : Actions contextuelles */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    {tx.status === "PENDING" && (
                      <MarkPaidButton
                        transactionId={tx.id}
                        defaultAmount={toNumber(tx.amount)}
                        size="xs"
                        className="w-full sm:w-auto"
                      />
                    )}
                    {(tx.status === "PAID" || tx.status === "PARTIAL") && tx.receiptType && (
                      <QuittanceButton transactionId={tx.id} />
                    )}
                    {tx.status !== "CANCELLED" && tx.paidAt && (
                      <CancelPaymentButton
                        transactionId={tx.id}
                        amount={toNumber(tx.amount)}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-lg border border-neutral-200/80 bg-white p-10 text-center space-y-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-800">
            <Receipt className="size-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-neutral-900">
              Aucune écriture enregistrée
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Les loyers dus sont automatiquement générés chaque mois selon les dates d&apos;échéance de vos baux actifs.
            </p>
          </div>
          <div className="pt-2">
            <TransactionForm leases={leaseOptions} />
          </div>
        </div>
      )}
    </PageShell>
  );
}
