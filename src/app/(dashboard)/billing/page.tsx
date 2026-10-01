import { Metadata } from "next";
import Decimal from "decimal.js";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Euro,
  Clock,
  FileCheck,
  FileText,
  Receipt,
  Crown,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TransactionForm } from "@/components/transaction-form";
import {
  presentTransaction,
  daysLate as periodDaysLate,
  STATUS_PRESENTATION,
} from "@/lib/domain/period-presentation";
import { QuittanceButton } from "@/components/quittance-button";
import { MarkPaidButton } from "./mark-paid-button";
import { SubscriptionBanner } from "./subscription-banner";
import { formatCurrency } from "@/lib/format";

export const metadata: Metadata = {
  title: "Paiements",
};

const RECEIPT_CONFIG: Record<string, { label: string; className: string }> = {
  QUITTANCE: {
    label: "Quittance",
    className: "text-blue-700 bg-blue-50 border-blue-200",
  },
  RECU: {
    label: "Reçu",
    className: "text-orange-700 bg-orange-50 border-orange-200",
  },
};


function isTrialExpired(trialEndsAt: Date | null): boolean {
  if (!trialEndsAt) return false;
  return trialEndsAt < new Date();
}

export default async function BillingPage() {
  const userId = await getAuthenticatedUserId();

  // Current month boundaries
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  // Run all queries in parallel
  const [user, transactions, totalPaid, totalPending, quittanceCount, recuCount, activeLeases] =
    await Promise.all([
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
              property: { select: { name: true } },
              tenant: { select: { firstName: true, lastName: true } },
            },
          },
        },
        orderBy: { dueDate: "desc" },
        take: 50,
      }),
      prisma.transaction.aggregate({
        where: { userId, status: "PAID", paidAt: { gte: monthStart, lte: monthEnd } },
        _sum: { amount: true },
      }),
      // Outstanding = unpaid and past due. Deriving from the date matters: no code
      // writes a LATE status, so filtering on one reported zero rent arrears.
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

  const totalPaidAmount = Number(totalPaid._sum.amount ?? 0);
  const totalPendingAmount = Number(totalPending._sum.amount ?? 0);
  const hasTransactions = transactions.length > 0;

  const subscriptionStatus = user?.subscriptionStatus ?? "TRIAL";
  const trialEndsAt = user?.trialEndsAt ?? null;
  const trialExpired = isTrialExpired(trialEndsAt);
  const isActive = subscriptionStatus === "ACTIVE" || (subscriptionStatus === "TRIAL" && !trialExpired);
  const isTrial = subscriptionStatus === "TRIAL";
  const isPastDue = subscriptionStatus === "PAST_DUE";

  return (
    <div className="space-y-8">
      {/* Subscription Banner */}
      <SubscriptionBanner
        status={subscriptionStatus}
        trialEndsAt={trialEndsAt}
        stripeCustomerId={user?.stripeCustomerId ?? null}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Paiements</h1>
          <p className="text-muted-foreground mt-1">
            Suivi des loyers et génération de quittances
          </p>
        </div>
        <TransactionForm leases={activeLeases.map(l => ({ ...l, rentAmount: Number(l.rentAmount), chargesAmount: Number(l.chargesAmount) }))} />
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total encaissé
            </CardTitle>
            <Euro className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold font-mono tracking-tight text-emerald-700">
              {formatCurrency(totalPaidAmount)}
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              {format(monthStart, "MMMM yyyy", { locale: fr })}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total en attente
            </CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold font-mono tracking-tight text-amber-600">
              {formatCurrency(totalPendingAmount)}
            </span>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Quittances générées
            </CardTitle>
            <FileCheck className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold font-mono tracking-tight">
              {quittanceCount}
            </span>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Reçus émis
            </CardTitle>
            <Receipt className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold font-mono tracking-tight">
              {recuCount}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Transactions table */}
      {hasTransactions ? (
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Période</TableHead>
                  <TableHead>Locataire</TableHead>
                  <TableHead>Bien</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Type reçu</TableHead>
                  <TableHead>Date paiement</TableHead>
                  <TableHead>Reçu</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => {
                  // Derived from the due date, not the stored status: nothing
                  // writes LATE, so this previously showed overdue rent as merely
                  // "En attente".
                  const status = presentTransaction(tx);
                  const lateBy = periodDaysLate(tx.dueDate);
                  const lateLabel = `${lateBy} jour${lateBy > 1 ? "s" : ""} de retard`;
                  const receipt = tx.receiptType ? RECEIPT_CONFIG[tx.receiptType] : null;

                  return (
                    <TableRow key={tx.id}>
                      <TableCell className="whitespace-nowrap text-sm">
                        {format(tx.periodStart, "MMM yyyy", { locale: fr })}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {tx.lease.tenant?.firstName ?? ''} {tx.lease.tenant?.lastName ?? ''}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {tx.lease.property?.name ?? ''}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm font-semibold">
                        {formatCurrency(tx.amount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col items-start gap-0.5">
                          <Badge variant="secondary" className={status.className}>
                            {status.label}
                          </Badge>
                          {lateBy > 0 && status.label === "En retard" && (
                            <span className="text-xs text-red-600">
                              {lateLabel}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {receipt ? (
                          <Badge variant="secondary" className={receipt.className}>
                            {receipt.label}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {tx.paidAt
                          ? format(tx.paidAt, "dd/MM/yyyy", { locale: fr })
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {tx.receiptUrl && (
                          <a
                            href={tx.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                          >
                            <FileCheck className="size-3" />
                            Télécharger
                          </a>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {tx.status === "PENDING" && (
                            <MarkPaidButton
                              transactionId={tx.id}
                              defaultAmount={Number(new Decimal(tx.lease.rentAmount).plus(tx.lease.chargesAmount).toDecimalPlaces(2))}
                            />
                          )}
                          {(tx.status === "PAID" || tx.status === "PARTIAL") && tx.receiptType && (
                            <QuittanceButton transactionId={tx.id} />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-sm border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="size-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-1">Aucune transaction</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Commencez par enregistrer votre premier paiement.
            </p>
            <TransactionForm leases={activeLeases.map(l => ({ ...l, rentAmount: Number(l.rentAmount), chargesAmount: Number(l.chargesAmount) }))} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
