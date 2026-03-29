import { Metadata } from "next";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Euro,
  Clock,
  FileCheck,
  FileText,
  Receipt,
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
import { QuittanceButton } from "@/components/quittance-button";
import { MarkPaidButton } from "./mark-paid-button";

export const metadata: Metadata = {
  title: "Paiements",
};

const STATUS_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  PAID: {
    label: "Payé",
    className: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  PENDING: {
    label: "En attente",
    className: "text-amber-700 bg-amber-50 border-amber-200",
  },
  LATE: {
    label: "En retard",
    className: "text-red-700 bg-red-50 border-red-200",
  },
  PARTIAL: {
    label: "Partiel",
    className: "text-orange-700 bg-orange-50 border-orange-200",
  },
  CANCELLED: {
    label: "Annulé",
    className: "text-gray-700 bg-gray-50 border-gray-200",
  },
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

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export default async function BillingPage() {
  const userId = await getAuthenticatedUserId();

  // Current month boundaries
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  // Run all queries in parallel
  const [transactions, totalPaid, totalPending, quittanceCount, recuCount, activeLeases] =
    await Promise.all([
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
      prisma.transaction.aggregate({
        where: { userId, status: "PENDING" },
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

  const totalPaidAmount = totalPaid._sum.amount ?? 0;
  const totalPendingAmount = totalPending._sum.amount ?? 0;
  const hasTransactions = transactions.length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Paiements</h1>
          <p className="text-muted-foreground mt-1">
            Suivi des loyers et génération de quittances
          </p>
        </div>
        <TransactionForm leases={activeLeases} />
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => {
                  const status = STATUS_CONFIG[tx.status] ?? STATUS_CONFIG.PENDING;
                  const receipt = tx.receiptType ? RECEIPT_CONFIG[tx.receiptType] : null;

                  return (
                    <TableRow key={tx.id}>
                      <TableCell className="whitespace-nowrap text-sm">
                        {format(tx.periodStart, "MMM yyyy", { locale: fr })}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {tx.lease.tenant.firstName} {tx.lease.tenant.lastName}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {tx.lease.property.name}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm font-semibold">
                        {formatCurrency(tx.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={status.className}>
                          {status.label}
                        </Badge>
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
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {tx.status === "PENDING" && (
                            <MarkPaidButton
                              transactionId={tx.id}
                              defaultAmount={tx.lease.rentAmount + tx.lease.chargesAmount}
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
            <TransactionForm leases={activeLeases} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
