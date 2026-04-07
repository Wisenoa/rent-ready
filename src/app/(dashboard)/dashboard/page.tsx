import { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  Users,
  CreditCard,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Receipt,
  Home,
  Calendar,
  Wrench,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAuthenticatedUserId } from "@/lib/auth";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getDashboardStats, formatCurrency } from "@/lib/queries/dashboard-stats";
import {
  RevenueExpenseChart,
  ExpenseByCategoryChart,
  NOISummary,
} from "@/components/dashboard/charts";

export const metadata: Metadata = {
  title: "Tableau de bord",
};

const transactionStatusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: typeof CheckCircle2;
  }
> = {
  PAID: { label: "Payé", variant: "secondary", icon: CheckCircle2 },
  PENDING: { label: "En attente", variant: "outline", icon: Clock },
  LATE: { label: "En retard", variant: "destructive", icon: AlertCircle },
  PARTIAL: { label: "Partiel", variant: "default", icon: Clock },
  CANCELLED: { label: "Annulé", variant: "outline", icon: AlertCircle },
};

export default async function DashboardPage() {
  const userId = await getAuthenticatedUserId();

  const [stats, recentTransactions] = await Promise.all([
    getDashboardStats(userId),
    (await import("@/lib/prisma")).prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        lease: {
          include: {
            tenant: { select: { firstName: true, lastName: true } },
            property: { select: { name: true } },
          },
        },
      },
    }),
  ]);

  const now = new Date();

  const kpis = [
    {
      title: "Biens",
      value: String(stats.properties.total),
      description:
        stats.properties.total === 0
          ? "Aucun bien enregistré"
          : `${stats.properties.withActiveLease} avec bail actif`,
      icon: Building2,
    },
    {
      title: "Locataires actifs",
      value: String(stats.tenants.active),
      description:
        stats.tenants.active === 0
          ? "Aucun locataire actif"
          : `${stats.tenants.active} bail${stats.tenants.active > 1 ? "s" : ""} en cours`,
      icon: Users,
    },
    {
      title: "Revenus du mois",
      value: formatCurrency(stats.revenue.currentMonth),
      description: format(now, "MMMM yyyy", { locale: fr }),
      icon: CreditCard,
    },
    {
      title: "Taux d'occupation",
      value: `${stats.properties.occupancyRate}\u202F%`,
      description:
        stats.properties.occupancyRate === 100
          ? "Aucune vacance"
          : stats.properties.occupancyRate === 0
            ? "Aucun bien occupé"
            : `${stats.properties.vacant} bien${stats.properties.vacant > 1 ? "s" : ""} vacant${stats.properties.vacant > 1 ? "s" : ""}`,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Tableau de bord
        </h1>
        <p className="text-muted-foreground mt-1">
          Vue d&apos;ensemble de votre patrimoine locatif
        </p>
      </div>

      {/* Cartes KPI */}
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
              <span className="text-2xl font-bold tracking-tight">
                {kpi.value}
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                {kpi.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueExpenseChart
            revenue={stats.revenue}
            expenses={stats.expenses}
            noi={stats.noi}
          />
        </div>
        <NOISummary noi={stats.noi} />
      </div>

      {Object.keys(stats.expenses.byCategory).length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ExpenseByCategoryChart expenses={stats.expenses.byCategory} />
        </div>
      )}

      {/* Lease Expirations */}
      {stats.upcomingLeaseExpirations.length > 0 && (
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Baux à échoir</CardTitle>
            <CardDescription>
              Baux expirant dans les 90 prochains jours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {stats.upcomingLeaseExpirations.map((lease) => (
                <div
                  key={lease.id}
                  className="flex items-center justify-between py-3 border-b border-border/30 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <Calendar className="size-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {lease.tenant.firstName} {lease.tenant.lastName}
                        <span className="text-muted-foreground font-normal">
                          {" "}
                          — {lease.property.name}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(lease.endDate, "d MMM yyyy", { locale: fr })}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      lease.daysUntilExpiry <= 30
                        ? "destructive"
                        : "outline"
                    }
                    className="text-xs"
                  >
                    {lease.daysUntilExpiry} jours
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Maintenance Summary */}
      {stats.maintenanceTickets.open > 0 && (
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Maintenance</CardTitle>
            <CardDescription>
              Tickets en cours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <Wrench className="size-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.maintenanceTickets.open}</p>
                  <p className="text-xs text-muted-foreground">Tickets ouverts</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AlertCircle className="size-5 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.maintenanceTickets.urgent}</p>
                  <p className="text-xs text-muted-foreground">Urgents</p>
                </div>
              </div>
              {stats.maintenanceTickets.avgResolutionDays !== null && (
                <div className="flex items-center gap-3">
                  <Clock className="size-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">{stats.maintenanceTickets.avgResolutionDays}j</p>
                    <p className="text-xs text-muted-foreground">Résolution moy.</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activité récente */}
      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Activité récente</CardTitle>
          <CardDescription>
            Dernières transactions et événements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Receipt className="size-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                Aucune transaction pour le moment
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Les transactions apparaîtront ici une fois créées.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentTransactions.map((tx) => {
                const config = transactionStatusConfig[tx.status] ?? {
                  label: tx.status,
                  variant: "outline" as const,
                  icon: Clock,
                };
                const StatusIcon = config.icon;

                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-3 border-b border-border/30 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                        <StatusIcon
                          className={`size-4 ${
                            tx.status === "PAID"
                              ? "text-emerald-600"
                              : tx.status === "LATE"
                                ? "text-amber-500"
                                : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {tx.lease.tenant.firstName}{" "}
                          {tx.lease.tenant.lastName}
                          <span className="text-muted-foreground font-normal">
                            {" "}
                            — {tx.lease.property.name}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(tx.createdAt, "d MMM yyyy", { locale: fr })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono font-medium">
                        {formatCurrency(tx.amount)}
                      </span>
                      <Badge variant={config.variant} className="text-xs">
                        {config.label}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/properties"
              className="inline-flex items-center justify-center rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm transition-colors hover:bg-stone-50"
            >
              <Home className="size-4 mr-2" />
              Ajouter un bien
            </Link>
            <Link
              href="/tenants"
              className="inline-flex items-center justify-center rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm transition-colors hover:bg-stone-50"
            >
              <Plus className="size-4 mr-2" />
              Ajouter un locataire
            </Link>
            <Link
              href="/billing"
              className="inline-flex items-center justify-center rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm transition-colors hover:bg-stone-50"
            >
              <CreditCard className="size-4 mr-2" />
              Enregistrer un paiement
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
