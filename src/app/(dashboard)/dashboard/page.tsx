import { Metadata } from "next";
import {
  Building2,
  Users,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Tableau de bord",
};

const kpis = [
  {
    title: "Biens actifs",
    value: "4",
    description: "sur 4 biens au total",
    icon: Building2,
    trend: null as "up" | "down" | null,
  },
  {
    title: "Locataires",
    value: "6",
    description: "baux actifs",
    icon: Users,
    trend: null as "up" | "down" | null,
  },
  {
    title: "Revenus du mois",
    value: "4 850 €",
    description: "+2,3% vs mois dernier",
    icon: CreditCard,
    trend: "up" as const,
  },
  {
    title: "Taux d'occupation",
    value: "100%",
    description: "Aucune vacance",
    icon: TrendingUp,
    trend: "up" as const,
  },
];

const recentActivity = [
  {
    type: "payment" as const,
    title: "Loyer reçu — Apt. Rue de Rivoli",
    amount: "+1 200 €",
    date: "Aujourd'hui",
    status: "success" as const,
  },
  {
    type: "payment" as const,
    title: "Loyer reçu — Studio Bd Haussmann",
    amount: "+750 €",
    date: "Hier",
    status: "success" as const,
  },
  {
    type: "alert" as const,
    title: "Loyer en retard — Maison Vincennes",
    amount: "1 400 €",
    date: "Échéance: il y a 3 jours",
    status: "warning" as const,
  },
  {
    type: "document" as const,
    title: "Quittance générée — Mars 2026",
    amount: "",
    date: "25 mars 2026",
    status: "info" as const,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Tableau de bord
        </h1>
        <p className="text-muted-foreground mt-1">
          Vue d&apos;ensemble de votre patrimoine locatif
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="shadow-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="size-4 text-muted-foreground/70" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight">
                  {kpi.value}
                </span>
                {kpi.trend === "up" && (
                  <ArrowUpRight className="size-4 text-emerald-600" />
                )}
                {kpi.trend === "down" && (
                  <ArrowDownRight className="size-4 text-red-500" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {kpi.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Activité récente</CardTitle>
          <CardDescription>
            Dernières transactions et événements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-border/30 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    {item.status === "success" && (
                      <CheckCircle2 className="size-4 text-emerald-600" />
                    )}
                    {item.status === "warning" && (
                      <AlertCircle className="size-4 text-amber-500" />
                    )}
                    {item.status === "info" && (
                      <CreditCard className="size-4 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                </div>
                {item.amount && (
                  <Badge
                    variant={item.status === "warning" ? "destructive" : "secondary"}
                    className="font-mono text-xs"
                  >
                    {item.amount}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
