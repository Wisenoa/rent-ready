import { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  Users,
  TrendingUp,
  Euro,
  PieChart,
  Home,
  AlertCircle,
  CheckCircle2,
  Clock,
  Wrench,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  BarChart3,
  Eye,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAuthenticatedUserId } from "@/lib/auth";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getDashboardStats, formatCurrency } from "@/lib/queries/dashboard-stats";

export const metadata: Metadata = {
  title: "Espace Propriétaire - Vue d'ensemble",
};

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function formatROI(investment: number, annualReturn: number): string {
  if (investment === 0) return "—";
  return `${((annualReturn / investment) * 100).toFixed(1)}%`;
}

export default async function OwnerDashboardPage() {
  const userId = await getAuthenticatedUserId();

  const stats = await getDashboardStats(userId);

  // Calculate key owner metrics
  const totalProperties = stats.properties.total;
  const occupiedProperties = stats.properties.withActiveLease;
  const vacantProperties = stats.properties.vacant;
  const occupancyRate = stats.properties.occupancyRate;

  const monthlyRevenue = stats.revenue.currentMonth;
  const monthlyExpenses = stats.expenses.currentMonth;
  const monthlyNOI = stats.noi.currentMonth;
  const yearlyNOI = stats.noi.yearToDate;

  const revenueGrowth = stats.revenue.previousMonth !== 0
    ? ((monthlyRevenue - stats.revenue.previousMonth) / Math.abs(stats.revenue.previousMonth)) * 100
    : 0;

  const openTickets = stats.maintenanceTickets.open;
  const urgentTickets = stats.maintenanceTickets.urgent;

  // Mock investment data (in real app, this would come from user input or property records)
  const totalInvestment = totalProperties * 200000; // Estimated 200k per property
  const annualReturn = yearlyNOI * 12;
  const roi = formatROI(totalInvestment, annualReturn);

  // Property status breakdown
  const propertyStatusCards = [
    {
      title: "Total des biens",
      value: totalProperties,
      subtitle: "biens enregistrés",
      icon: Building2,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Biens occupés",
      value: occupiedProperties,
      subtitle: "avec bail actif",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Biens vacants",
      value: vacantProperties,
      subtitle: "en attente de locataire",
      icon: Home,
      color: vacantProperties > 0 ? "text-amber-600" : "text-muted-foreground",
      bgColor: vacantProperties > 0 ? "bg-amber-50" : "bg-stone-50",
    },
    {
      title: "Taux d'occupation",
      value: formatPercent(occupancyRate),
      subtitle: "taux actuel",
      icon: Percent,
      color: occupancyRate >= 90 ? "text-emerald-600" : occupancyRate >= 70 ? "text-amber-600" : "text-red-600",
      bgColor: occupancyRate >= 90 ? "bg-emerald-50" : occupancyRate >= 70 ? "bg-amber-50" : "bg-red-50",
    },
  ];

  // Financial summary cards
  const financialCards = [
    {
      title: "Revenus du mois",
      value: formatCurrency(monthlyRevenue),
      change: revenueGrowth,
      icon: Euro,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Charges du mois",
      value: formatCurrency(monthlyExpenses),
      subtitle: "dépenses déclarées",
      icon: PieChart,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "NOI du mois",
      value: formatCurrency(monthlyNOI),
      subtitle: "résultat net d'exploitation",
      icon: TrendingUp,
      color: monthlyNOI >= 0 ? "text-emerald-600" : "text-red-600",
      bgColor: monthlyNOI >= 0 ? "bg-emerald-50" : "bg-red-50",
    },
    {
      title: "NOI annuel",
      value: formatCurrency(yearlyNOI),
      subtitle: "cumul depuis janvier",
      icon: BarChart3,
      color: yearlyNOI >= 0 ? "text-emerald-600" : "text-red-600",
      bgColor: yearlyNOI >= 0 ? "bg-emerald-50" : "bg-red-50",
    },
  ];

  // Expense categories breakdown
  const expenseCategories = Object.entries(stats.expenses.byCategory)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: monthlyExpenses > 0 ? (amount / monthlyExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const categoryLabels: Record<string, string> = {
    PLUMBING: "Plomberie",
    ELECTRICAL: "Électricité",
    GENERAL_MAINTENANCE: "Entretien",
    INSURANCE: "Assurance",
    TAX: "Taxes",
    CONDO_FEES: "Copropriété",
    MANAGEMENT_FEES: "Frais de gestion",
    RENOVATION: "Rénovation",
    OTHER: "Autre",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
            <Eye className="size-6 text-primary" />
            Espace Propriétaire
          </h1>
          <p className="text-muted-foreground mt-1">
            Vue d&apos;ensemble de votre patrimoine locatif
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <BarChart3 className="size-4 mr-2" />
              Vue détaillée
            </Link>
          </Button>
        </div>
      </div>

      {/* Portfolio Overview */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Building2 className="size-5 text-primary" />
          Mon Patrimoine
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {propertyStatusCards.map((card) => (
            <Card key={card.title} className="shadow-sm border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.bgColor}`}>
                  <card.icon className={`size-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold tracking-tight">{card.value}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.subtitle}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Financial Dashboard */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Euro className="size-5 text-primary" />
          Performance Financière
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {financialCards.map((card) => (
            <Card key={card.title} className="shadow-sm border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.bgColor}`}>
                  <card.icon className={`size-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold tracking-tight">{card.value}</p>
                <div className="flex items-center gap-2 mt-1">
                  {card.change !== undefined && (
                    <div className={`flex items-center gap-1 text-xs ${card.change >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {card.change >= 0 ? (
                        <ArrowUpRight className="size-3" />
                      ) : (
                        <ArrowDownRight className="size-3" />
                      )}
                      {card.change >= 0 ? "+" : ""}{card.change.toFixed(1)}%
                    </div>
                  )}
                  {card.subtitle && (
                    <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Two-column layout: ROI & Expenses */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ROI Card */}
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="size-5 text-primary" />
              Rentabilité Estimée
            </CardTitle>
            <CardDescription>
              Basé sur vos biens et revenus déclarés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Valeur du patrimoine</span>
                <span className="font-semibold">{formatCurrency(totalInvestment)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Revenus locatifs annuels</span>
                <span className="font-semibold text-emerald-600">{formatCurrency(annualReturn)}</span>
              </div>
              <div className="border-t border-border/50 pt-4 flex items-center justify-between">
                <span className="text-sm font-medium">Rendement brut estimé</span>
                <span className="text-xl font-bold text-primary">{roi}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 italic">
              * Estimation basée sur les données déclarées. Consulter un expert pour un calcul précis.
            </p>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <PieChart className="size-5 text-primary" />
              Répartition des Charges
            </CardTitle>
            <CardDescription>
              Dépenses du mois en cours
            </CardDescription>
          </CardHeader>
          <CardContent>
            {expenseCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <PieChart className="size-10 text-muted-foreground/40 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">
                  Aucune charge déclarée
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Les dépenses apparaîtront ici une fois ajoutées.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {expenseCategories.slice(0, 5).map((item) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-24 text-sm text-muted-foreground">
                        {categoryLabels[item.category] ?? item.category}
                      </div>
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all"
                          style={{ width: `${Math.min(item.percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <span className="text-sm font-medium font-mono">
                        {formatCurrency(item.amount)}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({item.percentage.toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                ))}
                {expenseCategories.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    + {expenseCategories.length - 5} autres catégories
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Occupancy & Maintenance Overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Occupancy Alert */}
        <Card className={`shadow-sm border-border/50 ${vacantProperties > 0 ? "border-amber-200" : ""}`}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Home className="size-5 text-primary" />
              État d&apos;Occupation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalProperties === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Building2 className="size-10 text-muted-foreground/40 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">
                  Aucun bien enregistré
                </p>
                <Button asChild className="mt-4" size="sm">
                  <Link href="/properties/new">Ajouter mon premier bien</Link>
                </Button>
              </div>
            ) : vacantProperties > 0 ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <AlertCircle className="size-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">
                      {vacantProperties} bien{vacantProperties > 1 ? "s" : ""} vacant{vacantProperties > 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      Revenus potentiels non générés ce mois
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Taux d&apos;occupation</span>
                    <Badge variant={occupancyRate >= 90 ? "default" : occupancyRate >= 70 ? "secondary" : "destructive"}>
                      {formatPercent(occupancyRate)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Loyers reçus ce mois</span>
                    <span className="font-medium text-emerald-600">{formatCurrency(monthlyRevenue)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <CheckCircle2 className="size-10 text-emerald-600 mb-3" />
                <p className="text-sm font-medium text-emerald-900">
                  Tous vos biens sont occupés
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Taux d&apos;occupation: {formatPercent(occupancyRate)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Maintenance Overview */}
        <Card className={`shadow-sm border-border/50 ${urgentTickets > 0 ? "border-red-200" : ""}`}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Wrench className="size-5 text-primary" />
              Aperçu Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {openTickets === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="size-10 text-emerald-600 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">
                  Aucune intervention en cours
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Vos biens sont en bon état.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {urgentTickets > 0 && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
                    <AlertCircle className="size-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900">
                        {urgentTickets} intervention{urgentTickets > 1 ? "s" : ""} urgente{urgentTickets > 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-red-700 mt-1">
                        Requiert une attention immédiate
                      </p>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold">{openTickets}</p>
                    <p className="text-xs text-muted-foreground">Ouvertes</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-red-50">
                    <p className="text-2xl font-bold text-red-600">{urgentTickets}</p>
                    <p className="text-xs text-muted-foreground">Urgentes</p>
                  </div>
                  {stats.maintenanceTickets.avgResolutionDays !== null && (
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold">{stats.maintenanceTickets.avgResolutionDays}j</p>
                      <p className="text-xs text-muted-foreground">Délai moy.</p>
                    </div>
                  )}
                </div>
                <Button asChild variant="outline" className="w-full" size="sm">
                  <Link href="/maintenance">
                    Voir toutes les interventions
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/properties/new">
                <Home className="size-4 mr-2" />
                Ajouter un bien
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/leases/new">
                <Users className="size-4 mr-2" />
                Créer un bail
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/maintenance/new">
                <Wrench className="size-4 mr-2" />
                Signaler un problème
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
