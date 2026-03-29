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
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const metadata: Metadata = {
  title: "Tableau de bord",
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
    amount,
  );

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
  let userId: string;

  try {
    userId = await getCurrentUserId();
  } catch {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Connexion requise</CardTitle>
            <CardDescription>
              Veuillez vous connecter pour accéder à votre tableau de bord.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [
    totalProperties,
    propertiesWithActiveLease,
    activeTenantsResult,
    monthlyRevenueResult,
    recentTransactions,
  ] = await Promise.all([
    prisma.property.count({ where: { userId } }),

    prisma.property.count({
      where: { userId, leases: { some: { status: "ACTIVE" } } },
    }),

    prisma.lease.findMany({
      where: { userId, status: "ACTIVE" },
      select: { tenantId: true },
      distinct: ["tenantId"],
    }),

    prisma.transaction.aggregate({
      where: {
        userId,
        status: "PAID",
        periodStart: { gte: monthStart, lt: monthEnd },
      },
      _sum: { amount: true },
    }),

    prisma.transaction.findMany({
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

  const activeTenants = activeTenantsResult.length;
  const monthlyRevenue = monthlyRevenueResult._sum.amount ?? 0;
  const occupancyRate =
    totalProperties > 0
      ? Math.round((propertiesWithActiveLease / totalProperties) * 100)
      : 0;

  const kpis = [
    {
      title: "Biens",
      value: String(totalProperties),
      description:
        totalProperties === 0
          ? "Aucun bien enregistré"
          : `${propertiesWithActiveLease} avec bail actif`,
      icon: Building2,
    },
    {
      title: "Locataires actifs",
      value: String(activeTenants),
      description:
        activeTenants === 0
          ? "Aucun locataire actif"
          : `${activeTenants} bail${activeTenants > 1 ? "s" : ""} en cours`,
      icon: Users,
    },
    {
      title: "Revenus du mois",
      value: formatCurrency(monthlyRevenue),
      description: format(now, "MMMM yyyy", { locale: fr }),
      icon: CreditCard,
    },
    {
      title: "Taux d\u2019occupation",
      value: `${occupancyRate}\u202F%`,
      description:
        occupancyRate === 100
          ? "Aucune vacance"
          : occupancyRate === 0
            ? "Aucun bien occupé"
            : `${totalProperties - propertiesWithActiveLease} bien${totalProperties - propertiesWithActiveLease > 1 ? "s" : ""} vacant${totalProperties - propertiesWithActiveLease > 1 ? "s" : ""}`,
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
              className={buttonVariants({ variant: "outline" })}
            >
              <Home className="size-4 mr-2" />
              Ajouter un bien
            </Link>
            <Link
              href="/tenants"
              className={buttonVariants({ variant: "outline" })}
            >
              <Plus className="size-4 mr-2" />
              Ajouter un locataire
            </Link>
            <Link
              href="/billing"
              className={buttonVariants({ variant: "outline" })}
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
