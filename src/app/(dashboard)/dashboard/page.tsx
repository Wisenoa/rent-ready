import { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  Users,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Receipt,
  ArrowRight,
  FileText,
  Wrench,
  Download,
  ShieldCheck,
  Calendar,
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
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { getAuthenticatedUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getDashboardStats, formatCurrency } from "@/lib/queries/dashboard-stats";
import { ensureRentPeriods } from "@/lib/queries/rent-periods";
import { ArrearsSection } from "./arrears-section";
import { PropertyForm } from "@/components/property-form";
import Decimal from "decimal.js";

export const metadata: Metadata = {
  title: "Tableau de bord",
};

export default async function DashboardPage() {
  const userId = await getAuthenticatedUserId();

  // Matérialise les périodes de loyers dues
  await ensureRentPeriods(userId);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  const monthName = format(now, "MMMM yyyy", { locale: fr });

  // Requêtes complètes pour la vue d'ensemble orientée propriétaire
  const [stats, properties, currentMonthTransactions, openTickets] = await Promise.all([
    getDashboardStats(userId),
    prisma.property.findMany({
      where: { userId },
      include: {
        leases: {
          where: { status: "ACTIVE" },
          include: {
            tenant: { select: { id: true, firstName: true, lastName: true } },
            transactions: {
              where: { periodStart: { gte: monthStart, lte: monthEnd } },
              take: 1,
            },
          },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.transaction.findMany({
      where: {
        userId,
        periodStart: { gte: monthStart, lte: monthEnd },
      },
    }),
    prisma.maintenanceTicket.findMany({
      where: {
        property: { userId },
        status: { in: ["OPEN", "IN_PROGRESS"] },
      },
      include: {
        property: { select: { name: true } },
        tenant: { select: { firstName: true, lastName: true } },
      },
      take: 2,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const hasProperties = properties.length > 0;

  // Calculs financiers pour le mois en cours
  let expectedRentMonth = new Decimal(0);
  let receivedRentMonth = new Decimal(0);

  for (const prop of properties) {
    const activeLease = prop.leases[0];
    if (activeLease) {
      const rent = new Decimal(activeLease.rentAmount);
      const charges = new Decimal(activeLease.chargesAmount || 0);
      expectedRentMonth = expectedRentMonth.plus(rent).plus(charges);
    }
  }

  for (const tx of currentMonthTransactions) {
    if (tx.status === "PAID" && tx.paidAt) {
      receivedRentMonth = receivedRentMonth.plus(new Decimal(tx.amount));
    }
  }

  const pendingRentMonth = Decimal.max(0, expectedRentMonth.minus(receivedRentMonth));
  const collectionPercentage = expectedRentMonth.gt(0)
    ? Math.round(receivedRentMonth.dividedBy(expectedRentMonth).times(100).toNumber())
    : 100;

  const activeLeasesCount = properties.reduce(
    (acc, p) => acc + (p.leases.length > 0 ? 1 : 0),
    0
  );
  const isPartiallyConfigured = hasProperties && activeLeasesCount === 0;
  const allMonthPaid = expectedRentMonth.gt(0) && pendingRentMonth.eq(0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 0. ÉTAT D'ACTIVATION / ACCUEIL POUR NOUVEAU PROPRIÉTAIRE               */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {!hasProperties ? (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/80 bg-gradient-to-b from-card to-muted/30 p-8 shadow-sm text-center sm:text-left">
            <div className="max-w-2xl">
              <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 mb-3">
                Démarrage rapide
              </Badge>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                Bienvenue sur RentReady
              </h1>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base leading-relaxed">
                Votre outil de gestion locative calme et automatisé. Enregistrez votre premier bien
                pour activer le suivi automatique des loyers, l&apos;encaissement et l&apos;émission des quittances.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 justify-center sm:justify-start">
                <PropertyForm
                  trigger={
                    <>
                      <Plus className="size-4 mr-2" />
                      Ajouter mon premier logement
                    </>
                  }
                />
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3 border-t border-border/60 pt-6 text-left">
              <div className="space-y-1.5 p-3 rounded-lg bg-card/60 border border-border/40">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                  1
                </span>
                <p className="font-medium text-sm text-foreground">Votre logement</p>
                <p className="text-xs text-muted-foreground">
                  Adresse, type et nom du bien.
                </p>
              </div>
              <div className="space-y-1.5 p-3 rounded-lg bg-card/60 border border-border/40">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                  2
                </span>
                <p className="font-medium text-sm text-foreground">Votre locataire & bail</p>
                <p className="text-xs text-muted-foreground">
                  Coordonnées et loyer mensuel en 1 écran.
                </p>
              </div>
              <div className="space-y-1.5 p-3 rounded-lg bg-card/60 border border-border/40">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                  3
                </span>
                <p className="font-medium text-sm text-foreground">Sérénité mensuelle</p>
                <p className="text-xs text-muted-foreground">
                  RentReady suit les encaissements et quittances.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Reprise de session si le propriétaire a ajouté un bien sans bail */}
          {isPartiallyConfigured && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10">
                    Mise en location en cours
                  </Badge>
                  <span className="text-sm font-semibold text-foreground">
                    {properties[0]?.name}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Votre logement est enregistré mais aucun bail n&apos;est encore actif. Créez son premier bail pour activer le suivi des loyers et les quittances.
                </p>
              </div>
              <Link
                href={`/leases/new?propertyId=${properties[0]?.id}`}
                className={cn(buttonVariants({ size: "sm" }), "shrink-0 gap-1.5 font-medium")}
              >
                <FileText className="size-4" />
                Finaliser le bail
              </Link>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────────────── */}
          {/* 1. STATUS BANNER : « Est-ce que tout va bien ce mois-ci ? »         */}
          {/* ────────────────────────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-5">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  Tableau de bord
                </h1>
                <span className="text-xs text-muted-foreground font-medium capitalize">
                  · {monthName}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                Vue d&apos;ensemble et suivi opérationnel de votre parc locatif
              </p>
            </div>

            {/* Actions rapides */}
            <div className="flex items-center gap-2">
              <Link
                href="/properties"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-9 text-xs")}
              >
                <Building2 className="size-3.5 mr-1.5 text-muted-foreground" />
                Mes logements ({properties.length})
              </Link>
              <Link
                href="/tenants"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-9 text-xs")}
              >
                <Users className="size-3.5 mr-1.5 text-muted-foreground" />
                Mes locataires ({stats.tenants.active})
              </Link>
              <Link
                href="/billing"
                className={cn(buttonVariants({ size: "sm" }), "h-9 text-xs bg-primary text-primary-foreground")}
              >
                <Receipt className="size-3.5 mr-1.5" />
                Loyers & Quittances
              </Link>
            </div>
          </div>

          {/* Bandeau d'état immédiat */}
          {allMonthPaid ? (
            <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/50 text-emerald-950">
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    Tout est à jour pour {monthName}
                  </p>
                  <p className="text-xs text-emerald-800/80">
                    Tous vos loyers attendus ont été perçus et les quittances sont prêtes.
                  </p>
                </div>
              </div>
              <Link
                href="/billing"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-emerald-900 hover:bg-emerald-100/60 text-xs")}
              >
                Voir les quittances
                <ArrowRight className="size-3.5 ml-1" />
              </Link>
            </div>
          ) : pendingRentMonth.gt(0) ? (
            <div className="flex items-center justify-between p-4 rounded-xl border border-amber-200/80 bg-amber-50/50 text-amber-950">
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <Clock className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {formatCurrency(pendingRentMonth.toFixed(2))} restant à percevoir pour {monthName}
                  </p>
                  <p className="text-xs text-amber-800/80">
                    {collectionPercentage}% des loyers du mois ont été collectés.
                  </p>
                </div>
              </div>
              <Link
                href="/billing"
                className={cn(buttonVariants({ size: "sm" }), "bg-amber-800 hover:bg-amber-900 text-white text-xs")}
              >
                Pointer les paiements
                <ArrowRight className="size-3.5 ml-1" />
              </Link>
            </div>
          ) : null}

          {/* ────────────────────────────────────────────────────────────────── */}
          {/* 2. EXCEPTIONS & ACTIONS REQUISES (Priorité immédiate)              */}
          {/* ────────────────────────────────────────────────────────────────── */}
          <ArrearsSection userId={userId} />

          {/* Alertes maintenance éventuelles */}
          {openTickets.length > 0 && (
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Wrench className="size-4 text-foreground" />
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-foreground">
                    {openTickets.length} demande{openTickets.length > 1 ? "s" : ""} locataire en cours :
                  </span>{" "}
                  <span className="text-muted-foreground">
                    {openTickets[0].title} ({openTickets[0].property.name})
                  </span>
                </div>
              </div>
              <Link
                href="/maintenance"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-7 text-xs")}
              >
                Gérer les demandes
                <ArrowRight className="size-3 ml-1" />
              </Link>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────────────── */}
          {/* 3. LE BILAN DU MOIS (Expected vs Received)                        */}
          {/* ────────────────────────────────────────────────────────────────── */}
          <div className="space-y-3">
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Bilan du mois ({monthName})
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border/60 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    Loyers appelés
                  </CardTitle>
                  <Calendar className="size-4 text-muted-foreground/70" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight font-mono">
                    {formatCurrency(expectedRentMonth.toFixed(2))}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {properties.filter((p) => p.leases.length > 0).length} logement(s) loué(s)
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    Loyers encaissés
                  </CardTitle>
                  <CheckCircle2 className="size-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight font-mono text-emerald-700">
                    {formatCurrency(receivedRentMonth.toFixed(2))}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${collectionPercentage}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      {collectionPercentage}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    Reste à percevoir
                  </CardTitle>
                  <Clock className="size-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight font-mono text-foreground">
                    {formatCurrency(pendingRentMonth.toFixed(2))}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {pendingRentMonth.isZero() ? "Aucun solde dû" : "En cours de règlement"}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    Dépenses du mois
                  </CardTitle>
                  <CreditCard className="size-4 text-muted-foreground/70" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight font-mono text-foreground">
                    {formatCurrency(stats.expenses.currentMonth.toFixed(2))}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Charges & entretien déclarés
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────────── */}
          {/* 4. MON PARC LOCATIF (Home Base direct access)                      */}
          {/* ────────────────────────────────────────────────────────────────── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold tracking-tight text-foreground">
                  Mes logements
                </h2>
                <p className="text-xs text-muted-foreground">
                  Accès direct à la situation de chaque bien
                </p>
              </div>
              <Link
                href="/properties"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs")}
              >
                Tous les logements
                <ArrowRight className="size-3.5 ml-1" />
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {properties.map((property) => {
                const activeLease = property.leases[0];
                const tenant = activeLease?.tenant;
                const totalRent = activeLease
                  ? Number(activeLease.rentAmount) + Number(activeLease.chargesAmount || 0)
                  : null;
                const currentMonthTx = activeLease?.transactions[0];
                const isPaid = currentMonthTx?.status === "PAID";

                return (
                  <Card
                    key={property.id}
                    className="border-border/60 hover:border-border transition-colors shadow-sm"
                  >
                    <CardHeader className="p-4 pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link
                            href={`/properties/${property.id}`}
                            className="font-semibold text-sm hover:underline text-foreground"
                          >
                            {property.name}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {property.city} ({property.postalCode})
                          </p>
                        </div>
                        {isPaid ? (
                          <Badge variant="outline" className="text-xs text-emerald-800 bg-emerald-50 border-emerald-200">
                            Loyer réglé
                          </Badge>
                        ) : activeLease ? (
                          <Badge variant="outline" className="text-xs text-amber-800 bg-amber-50 border-amber-200">
                            En attente
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            Vacant
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center justify-between border-t border-border/40 pt-3 text-xs">
                        <div>
                          {tenant ? (
                            <Link
                              href={`/tenants/${tenant.id}`}
                              className="font-medium text-foreground hover:underline"
                            >
                              {tenant.firstName} {tenant.lastName}
                            </Link>
                          ) : (
                            <span className="text-muted-foreground">Aucun locataire</span>
                          )}
                          {totalRent && (
                            <p className="text-muted-foreground font-mono mt-0.5">
                              {formatCurrency(totalRent)} / mois
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isPaid ? (
                            <Link
                              href="/billing"
                              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-7 text-xs")}
                            >
                              <Receipt className="size-3 mr-1" />
                              Quittance
                            </Link>
                          ) : activeLease ? (
                            <Link
                              href="/billing"
                              className={cn(buttonVariants({ size: "sm" }), "h-7 text-xs bg-stone-900 text-white hover:bg-stone-800")}
                            >
                              Enregistrer
                            </Link>
                          ) : (
                            <Link
                              href={`/leases/new`}
                              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-7 text-xs")}
                            >
                              Créer bail
                            </Link>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
