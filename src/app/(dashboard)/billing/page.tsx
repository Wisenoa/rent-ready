import { Metadata } from "next";
import {
  CreditCard,
  Download,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Paiements",
};

const transactions = [
  {
    id: "1",
    tenant: "Marie Dupont",
    property: "Apt. Rue de Rivoli",
    period: "Mars 2026",
    rent: 1200,
    charges: 150,
    total: 1350,
    dueDate: "01/03/2026",
    paidAt: "28/02/2026",
    status: "paid" as const,
    receiptType: "quittance" as const,
  },
  {
    id: "2",
    tenant: "Pierre Martin",
    property: "Studio Bd Haussmann",
    period: "Mars 2026",
    rent: 750,
    charges: 80,
    total: 830,
    dueDate: "01/03/2026",
    paidAt: "02/03/2026",
    status: "paid" as const,
    receiptType: "quittance" as const,
  },
  {
    id: "3",
    tenant: "Jean Leroy",
    property: "Maison Vincennes",
    period: "Mars 2026",
    rent: 1400,
    charges: 200,
    total: 1600,
    dueDate: "01/03/2026",
    paidAt: null,
    status: "late" as const,
    receiptType: null,
  },
  {
    id: "4",
    tenant: "Luc Bernard",
    property: "Parking Bastille",
    period: "Mars 2026",
    rent: 150,
    charges: 0,
    total: 150,
    dueDate: "01/03/2026",
    paidAt: "01/03/2026",
    status: "paid" as const,
    receiptType: "quittance" as const,
  },
  {
    id: "5",
    tenant: "Marie Dupont",
    property: "Apt. Rue de Rivoli",
    period: "Février 2026",
    rent: 1200,
    charges: 150,
    total: 1350,
    dueDate: "01/02/2026",
    paidAt: "31/01/2026",
    status: "paid" as const,
    receiptType: "quittance" as const,
  },
];

const statusConfig = {
  paid: { label: "Payé", icon: CheckCircle2, variant: "secondary" as const, className: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  pending: { label: "En attente", icon: Clock, variant: "secondary" as const, className: "text-amber-700 bg-amber-50 border-amber-200" },
  late: { label: "En retard", icon: AlertCircle, variant: "destructive" as const, className: "" },
  partial: { label: "Partiel", icon: Clock, variant: "secondary" as const, className: "text-orange-700 bg-orange-50 border-orange-200" },
};

export default function BillingPage() {
  const totalReceived = transactions
    .filter((t) => t.status === "paid")
    .reduce((sum, t) => sum + t.total, 0);
  const totalPending = transactions
    .filter((t) => t.status !== "paid")
    .reduce((sum, t) => sum + t.total, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Paiements</h1>
          <p className="text-muted-foreground mt-1">
            Suivi des loyers et génération de quittances
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="size-4 mr-2" />
            Filtrer
          </Button>
          <Button variant="outline">
            <Download className="size-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Encaissé ce mois
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold font-mono tracking-tight text-emerald-700">
              {totalReceived.toLocaleString("fr-FR")} €
            </span>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En attente / retard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold font-mono tracking-tight text-amber-600">
              {totalPending.toLocaleString("fr-FR")} €
            </span>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Quittances générées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold font-mono tracking-tight">
              {transactions.filter((t) => t.receiptType).length}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Transactions list */}
      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Transactions</CardTitle>
          <CardDescription>Mars 2026</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {transactions.map((tx) => {
              const config = statusConfig[tx.status];
              const StatusIcon = config.icon;
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <StatusIcon
                        className={`size-4 ${
                          tx.status === "paid"
                            ? "text-emerald-600"
                            : tx.status === "late"
                              ? "text-red-500"
                              : "text-amber-500"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {tx.tenant}
                        <span className="text-muted-foreground font-normal">
                          {" "}
                          — {tx.property}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tx.period} · Échéance : {tx.dueDate}
                        {tx.paidAt && ` · Payé le ${tx.paidAt}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-semibold font-mono">
                        {tx.total.toLocaleString("fr-FR")} €
                      </p>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        {tx.rent.toLocaleString("fr-FR")} + {tx.charges.toLocaleString("fr-FR")}
                      </p>
                    </div>
                    <Badge
                      variant={config.variant}
                      className={config.className}
                    >
                      {config.label}
                    </Badge>
                    {tx.receiptType && (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <FileText className="size-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
