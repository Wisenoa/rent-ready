import { Metadata } from "next";
import { getAuthenticatedUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  FileText,
  Calendar,
  Building2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Export comptable",
};

export default async function FiscalExportPage() {
  const userId = await getAuthenticatedUserId();
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [transactions, expenses] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        userId,
        OR: [{ status: "PAID" }, { status: "PARTIAL" }],
        paidAt: { gte: yearStart },
      },
      include: {
        lease: {
          include: {
            tenant: true,
            property: true,
          },
        },
      },
      orderBy: { paidAt: "desc" },
    }),
    prisma.expense.findMany({
      where: {
        userId,
        date: { gte: yearStart },
      },
      include: {
        property: { select: { name: true } },
      },
      orderBy: { date: "desc" },
    }),
  ]);

  const monthlyTransactions = transactions.filter(
    (t) => t.paidAt && t.paidAt >= monthStart
  );
  const monthlyExpenses = expenses.filter((e) => e.date >= monthStart);

  const totalRevenue = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Export comptable</h1>
        <p className="text-muted-foreground mt-1">
          Exportez vos données comptables au format CSV
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenus {format(now, "MMMM yyyy", { locale: fr })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {(totalRevenue / 100).toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",
              })}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {monthlyTransactions.length} transaction{monthlyTransactions.length > 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dépenses {format(now, "MMMM yyyy", { locale: fr })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {(totalExpenses / 100).toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",})}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {monthlyExpenses.length} dépense{monthlyExpenses.length > 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Résultat net
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${totalRevenue - totalExpenses >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {((totalRevenue - totalExpenses) / 100).toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",
              })}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Transactions</CardTitle>
              <Button
                variant="outline"
                size="sm"
                disabled={transactions.length === 0}
              >
                <Download className="size-4 mr-2" />
                Exporter CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Exportez toutes les transactions de loyer de l&apos;année {now.getFullYear()}.
            </p>
            <p className="text-sm mt-2">
              <span className="font-medium">{transactions.length}</span> transaction{transactions.length > 1 ? "s" : ""} disponible{transactions.length > 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Dépenses</CardTitle>
              <Button
                variant="outline"
                size="sm"
                disabled={expenses.length === 0}
              >
                <Download className="size-4 mr-2" />
                Exporter CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Exportez toutes les dépenses de l&apos;année {now.getFullYear()}.
            </p>
            <p className="text-sm mt-2">
              <span className="font-medium">{expenses.length}</span> dépense{expenses.length > 1 ? "s" : ""} enregistrée{expenses.length > 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="size-5" />
            Documents fiscaux
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3 p-4 rounded-lg border border-border/50">
              <Calendar className="size-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Déclaration foncière</p>
                <p className="text-sm text-muted-foreground">
                  Formulaire 2042 pour les revenus fonciers
                </p>
                <Button variant="link" className="p-0 h-auto mt-1" disabled>
                  Bientôt disponible
                </Button>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg border border-border/50">
              <Building2 className="size-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">État des lieux</p>
                <p className="text-sm text-muted-foreground">
                  Document d&apos;état des lieux automatisé
                </p>
                <Button variant="link" className="p-0 h-auto mt-1" disabled>
                  Bientôt disponible
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}