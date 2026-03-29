import { Metadata } from "next";
import {
  Receipt,
  Plus,
  Sparkles,
  TrendingUp,
  Calendar,
  Hash,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { EXPENSE_CATEGORY_LABELS } from "@/lib/validations/expense";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExpenseForm } from "@/components/expense-form";
import { ExpenseOcrDialog } from "@/components/expense-ocr-dialog";
import { ExpenseActions } from "@/components/expense-actions";

export const metadata: Metadata = {
  title: "Dépenses",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default async function ExpensesPage() {
  const userId = await getCurrentUserId();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [expenses, properties, monthlyTotal, yearlyTotal, monthlyCount] =
    await Promise.all([
      prisma.expense.findMany({
        where: { userId },
        include: { property: true },
        orderBy: { date: "desc" },
        take: 50,
      }),
      prisma.property.findMany({
        where: { userId },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
      prisma.expense.aggregate({
        where: { userId, date: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      prisma.expense.aggregate({
        where: { userId, date: { gte: startOfYear } },
        _sum: { amount: true },
      }),
      prisma.expense.count({
        where: { userId, date: { gte: startOfMonth } },
      }),
    ]);

  // Top category this year
  const categoryAgg = await prisma.expense.groupBy({
    by: ["category"],
    where: { userId, date: { gte: startOfYear } },
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
    take: 1,
  });

  const topCategory = categoryAgg[0]
    ? (EXPENSE_CATEGORY_LABELS[categoryAgg[0].category] ??
      categoryAgg[0].category)
    : "—";

  const totalMonth = monthlyTotal._sum.amount ?? 0;
  const totalYear = yearlyTotal._sum.amount ?? 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dépenses</h1>
          <p className="text-muted-foreground mt-1">
            Suivez et gérez vos dépenses immobilières
          </p>
        </div>
        <div className="flex gap-2">
          <ExpenseOcrDialog
            properties={properties}
            trigger={
              <Button variant="outline">
                <Sparkles className="size-4 mr-2" />
                Scanner une facture
              </Button>
            }
          />
          <ExpenseForm
            properties={properties}
            trigger={
              <Button>
                <Plus className="size-4 mr-2" />
                Ajouter une dépense
              </Button>
            }
          />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dépenses du mois
            </CardTitle>
            <Calendar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-mono">
              {formatCurrency(totalMonth)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dépenses de l&apos;année
            </CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-mono">
              {formatCurrency(totalYear)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Catégorie principale
            </CardTitle>
            <Receipt className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{topCategory}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dépenses ce mois
            </CardTitle>
            <Hash className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-mono">{monthlyCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Expenses table or empty state */}
      {expenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
            <Receipt className="size-7 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">Aucune dépense</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm text-center">
            Commencez par ajouter une dépense manuellement ou scannez une
            facture avec l&apos;IA.
          </p>
          <div className="flex gap-2">
            <ExpenseOcrDialog
              properties={properties}
              trigger={
                <Button variant="outline">
                  <Sparkles className="size-4 mr-2" />
                  Scanner une facture
                </Button>
              }
            />
            <ExpenseForm
              properties={properties}
              trigger={
                <Button>
                  <Plus className="size-4 mr-2" />
                  Ajouter une dépense
                </Button>
              }
            />
          </div>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Prestataire</TableHead>
                <TableHead className="hidden md:table-cell">
                  Description
                </TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="hidden sm:table-cell">Bien</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="text-sm">
                    {format(expense.date, "dd MMM yyyy", { locale: fr })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {expense.vendorName}
                      </span>
                      {expense.aiExtracted && (
                        <Sparkles className="size-3 text-primary" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-48 truncate">
                    {expense.description ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {EXPENSE_CATEGORY_LABELS[expense.category] ??
                        expense.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {expense.property?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-right text-sm font-semibold font-mono">
                    {formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell>
                    <ExpenseActions
                      expense={{
                        id: expense.id,
                        vendorName: expense.vendorName,
                        description: expense.description,
                        amount: expense.amount,
                        category: expense.category,
                        date: format(expense.date, "yyyy-MM-dd"),
                        propertyId: expense.propertyId,
                      }}
                      properties={properties}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
