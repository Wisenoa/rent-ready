import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Decimal from "decimal.js";
import {
  ArrowLeft,
  MapPin,
  Building2,
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Euro,
  Receipt,
  Download,
  Wrench,
  Plus,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Home,
  FileCheck,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/auth";
import { formatCurrency } from "@/lib/format";
import { ensureRentPeriods } from "@/lib/queries/rent-periods";
import { daysLate as daysPastDue } from "@/lib/domain/period-presentation";
import { settlePeriodPayments } from "@/lib/domain/period-settlement";
import { toNumber } from "@/lib/decimal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { PropertyActions } from "@/components/property-actions";
import { QuittanceButton } from "@/components/quittance-button";
import { MarkPaidButton } from "@/components/mark-paid-button";
import { ReminderButton } from "@/components/reminder-button";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ activated?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const property = await prisma.property.findUnique({
    where: { id },
    select: { name: true },
  });
  if (!property) return { title: "Logement non trouvé" };
  return { title: `${property.name} · Logement` };
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  APARTMENT: "Appartement",
  STUDIO: "Studio",
  HOUSE: "Maison",
  COMMERCIAL: "Local commercial",
  PARKING: "Parking",
  OTHER: "Autre",
};

const LEASE_TYPE_LABELS: Record<string, string> = {
  FURNISHED: "Meublé",
  UNFURNISHED: "Non meublé (vide)",
  MOBILITY: "Bail mobilité",
  COMMERCIAL: "Commercial",
  STUDENT: "Étudiant",
  OTHER: "Autre",
};

const MAINTENANCE_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  OPEN: { label: "Nouveau", className: "bg-amber-100 text-amber-800 border-amber-200" },
  IN_PROGRESS: { label: "En cours", className: "bg-blue-100 text-blue-800 border-blue-200" },
  RESOLVED: { label: "Résolu", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  CLOSED: { label: "Fermé", className: "bg-stone-100 text-stone-700 border-stone-200" },
};

export default async function PropertyDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { activated } = (await searchParams) ?? {};
  const userId = await getAuthenticatedUserId();

  // Matérialise les périodes de loyer dues pour le mois en cours
  await ensureRentPeriods(userId);

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      leases: {
        include: {
          tenant: true,
          unit: true,
          transactions: {
            orderBy: { periodStart: "desc" },
            take: 12,
            include: {
              receiptDocument: true,
            },
          },
        },
        orderBy: { startDate: "desc" },
      },
      maintenanceTickets: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          tenant: { select: { firstName: true, lastName: true } },
        },
      },
    },
  });

  if (!property || property.userId !== userId) {
    notFound();
  }

  const activeLease = property.leases.find((l) => l.status === "ACTIVE");
  const tenant = activeLease?.tenant;

  // Calculs financiers stricts sur le bail actif
  const monthlyRent = activeLease ? new Decimal(activeLease.rentAmount) : null;
  const monthlyCharges = activeLease ? new Decimal(activeLease.chargesAmount || 0) : null;
  const totalMonthly = monthlyRent && monthlyCharges ? monthlyRent.plus(monthlyCharges) : null;

  // Transaction du mois en cours
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  const monthName = format(now, "MMMM yyyy", { locale: fr });

  const currentMonthTx = activeLease?.transactions.find((tx) => {
    const pStart = new Date(tx.periodStart);
    const pEnd = new Date(tx.periodEnd);
    return pStart <= currentMonthEnd && pEnd >= currentMonthStart;
  }) ?? activeLease?.transactions[0];

  // Période courante : regrouper toutes les écritures de la même période de référence
  const periodTxs = (activeLease && currentMonthTx)
    ? activeLease.transactions.filter((tx) => {
        const pStart = new Date(tx.periodStart).getTime();
        const pEnd = new Date(tx.periodEnd).getTime();
        const curStart = new Date(currentMonthTx.periodStart).getTime();
        const curEnd = new Date(currentMonthTx.periodEnd).getTime();
        return pStart === curStart && pEnd === curEnd;
      })
    : [];

  // Moteur de domaine canonique : décision de règlement de la période (AGENTS.md 10 & 11)
  const settlement = (activeLease && currentMonthTx)
    ? settlePeriodPayments({
        rentAmount: activeLease.rentAmount,
        chargesAmount: activeLease.chargesAmount,
        payments: periodTxs.map((tx) => ({
          amount: tx.amount,
          paidAt: tx.paidAt ?? (tx.status === "PAID" ? tx.createdAt : null),
          createdAt: tx.createdAt,
        })),
      })
    : null;

  const isPaid = settlement ? settlement.settled : currentMonthTx?.status === "PAID";
  const isPartial = !isPaid && (
    (settlement ? settlement.paid.gt(0) && !settlement.settled : false) ||
    currentMonthTx?.status === "PARTIAL"
  );
  const isLate = !isPaid && !isPartial && (
    currentMonthTx?.status === "LATE" ||
    (currentMonthTx?.dueDate ? new Date(currentMonthTx.dueDate) < now : false)
  );

  const amountReceived = settlement
    ? settlement.paid
    : (currentMonthTx?.paidAt
      ? new Decimal(currentMonthTx.amount)
      : (isPartial ? new Decimal(currentMonthTx?.amount || 0) : new Decimal(0)));

  const amountRemaining = settlement
    ? settlement.outstanding
    : (totalMonthly
      ? (isPaid ? new Decimal(0) : totalMonthly.minus(amountReceived))
      : new Decimal(0));

  const lateDays = currentMonthTx ? daysPastDue(currentMonthTx.dueDate, now) : 0;

  // Tickets ouverts
  const openTickets = property.maintenanceTickets.filter(
    (t) => t.status === "OPEN" || t.status === "IN_PROGRESS"
  );

  const propertyData = {
    id: property.id,
    name: property.name,
    type: property.type,
    addressLine1: property.addressLine1,
    addressLine2: property.addressLine2,
    city: property.city,
    postalCode: property.postalCode,
    surface: property.surface,
    rooms: property.rooms,
    description: property.description,
    cadastralRef: property.cadastralRef,
    taxRef: property.taxRef,
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* ────────────────────────────────────────────────────────────────── */}
      {/* 1. NAVIGATION & ENTÊTE D'IDENTITÉ DU LOGEMENT                     */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        {/* Fil d'ariane & actions secondaires */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors group font-medium"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Tous les logements</span>
          </Link>

          {/* Actions d'édition et suppression sans encombrement */}
          <PropertyActions property={propertyData} />
        </div>

        {/* Titre et attributs d'identité */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {property.name}
              </h1>
              <Badge variant="outline" className="text-xs font-normal">
                {PROPERTY_TYPE_LABELS[property.type] ?? property.type}
                {property.surface ? ` · ${property.surface} m²` : ""}
                {property.rooms ? ` · ${property.rooms} pièce${property.rooms > 1 ? "s" : ""}` : ""}
              </Badge>
              {activeLease ? (
                <Badge
                  variant="outline"
                  className="text-xs bg-emerald-50 text-emerald-800 border-emerald-200 font-medium"
                >
                  Occupé ({tenant?.firstName} {tenant?.lastName})
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-xs bg-stone-100 text-stone-700 border-stone-200 font-medium"
                >
                  Vacant
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground text-sm mt-1 flex items-center gap-1.5">
              <MapPin className="size-3.5 shrink-0 text-muted-foreground/80" />
              <span>
                {property.addressLine1}
                {property.addressLine2 ? `, ${property.addressLine2}` : ""}, {property.postalCode} {property.city}
              </span>
            </p>
          </div>

          {/* Loyer mensuel global visible en un coup d'œil */}
          {totalMonthly && (
            <div className="text-left sm:text-right">
              <p className="text-xs text-muted-foreground">Loyer charges comprises</p>
              <p className="text-xl font-bold font-mono text-foreground">
                {formatCurrency(totalMonthly.toFixed(2))}
                <span className="text-xs font-normal text-muted-foreground ml-1">/ mois</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* 1.5. MOMENT DE CONFIRMATION / PREMIER BAIL ACTIVÉ                  */}
      {/* ────────────────────────────────────────────────────────────────── */}
      {activated === "1" && activeLease && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-foreground">
                  Votre logement est configuré et prêt à être géré
                </h2>
                <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10 font-medium">
                  Prêt
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Le bail avec {tenant?.firstName} {tenant?.lastName} est actif. Le suivi mensuel du loyer, l&apos;encaissement et l&apos;émission des quittances sont désormais automatiques.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0 gap-1.5 font-medium")}
          >
            Voir mon tableau de bord
            <ArrowRight className="size-4" />
          </Link>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* 2. STATUT DU MOIS EN COURS & ACTION CONTEXTUELLE                  */}
      {/* ────────────────────────────────────────────────────────────────── */}
      {activeLease ? (
        isPaid ? (
          /* CAS A : Loyer payé - Sérénité & Quittance immédiate */
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 sm:p-5 text-emerald-950 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3.5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 mt-0.5">
                <CheckCircle2 className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold">
                    Loyer de {monthName} réglé
                  </h2>
                  <Badge variant="outline" className="text-xs bg-emerald-100 text-emerald-800 border-emerald-300">
                    Payé
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-emerald-900/80 mt-1">
                  {formatCurrency(amountReceived.toFixed(2))} perçus
                  {monthlyRent && monthlyCharges && (
                    <span className="text-emerald-800/70">
                      {" "}(Loyer {formatCurrency(monthlyRent.toFixed(2))} + Provisions {formatCurrency(monthlyCharges.toFixed(2))})
                    </span>
                  )}
                  {currentMonthTx?.paidAt && (
                    <> · Réglé le {format(new Date(currentMonthTx.paidAt), "d MMMM yyyy", { locale: fr })}</>
                  )}
                </p>
              </div>
            </div>

            {/* Action primaire : Quittance en 1 clic */}
            <div className="flex shrink-0 items-center gap-2">
              {currentMonthTx && (
                <QuittanceButton transactionId={currentMonthTx.id} />
              )}
            </div>
          </div>
        ) : isPartial ? (
          /* CAS B : Paiement partiel - Explication et solde restant */
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 sm:p-5 text-blue-950 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3.5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 mt-0.5">
                <Clock className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold">
                    Paiement partiel pour {monthName}
                  </h2>
                  <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800 border-blue-300">
                    Partiel
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-blue-900/80 mt-1">
                  {formatCurrency(amountReceived.toFixed(2))} reçus sur {totalMonthly ? formatCurrency(totalMonthly.toFixed(2)) : ""} ·{" "}
                  <strong className="font-semibold text-blue-950">
                    Reste {formatCurrency(amountRemaining.toFixed(2))} à régler
                  </strong>
                </p>
              </div>
            </div>

            {/* Actions : Enregistrer le solde & Relance */}
            <div className="flex shrink-0 items-center gap-2">
              {currentMonthTx && (
                <>
                  <ReminderButton
                    transactionId={currentMonthTx.id}
                    label="Relancer"
                  />
                  <MarkPaidButton
                    transactionId={currentMonthTx.id}
                    defaultAmount={amountRemaining.toNumber()}
                    label={`Enregistrer le solde (${formatCurrency(amountRemaining.toFixed(2))})`}
                    className="bg-stone-900 hover:bg-stone-800 text-white"
                  />
                </>
              )}
            </div>
          </div>
        ) : (
          /* CAS C : Loyer en attente ou en retard */
          <div
            className={cn(
              "rounded-xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm",
              isLate
                ? "border-amber-300 bg-amber-50/60 text-amber-950"
                : "border-stone-200 bg-stone-50/60 text-stone-950"
            )}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-lg mt-0.5",
                  isLate ? "bg-amber-100 text-amber-800" : "bg-stone-200 text-stone-700"
                )}
              >
                {isLate ? <AlertCircle className="size-5" /> : <Clock className="size-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold">
                    Loyer de {monthName} {isLate ? "en retard" : "en attente"}
                  </h2>
                  {isLate && (
                    <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800 border-amber-300">
                      {lateDays > 0 ? `${lateDays} jours de retard` : "Échu"}
                    </Badge>
                  )}
                </div>
                <p className="text-xs sm:text-sm mt-1 text-muted-foreground">
                  {totalMonthly && (
                    <strong className="font-semibold text-foreground">
                      {formatCurrency(totalMonthly.toFixed(2))}
                    </strong>
                  )}{" "}
                  attendus
                  {currentMonthTx?.dueDate && (
                    <> pour le {format(new Date(currentMonthTx.dueDate), "d MMMM yyyy", { locale: fr })}</>
                  )}
                </p>
              </div>
            </div>

            {/* Actions prioritaires : Enregistrer en 1 clic & Relancer */}
            <div className="flex shrink-0 items-center gap-2">
              {currentMonthTx && (
                <>
                  <ReminderButton
                    transactionId={currentMonthTx.id}
                    label="Relancer"
                  />
                  <MarkPaidButton
                    transactionId={currentMonthTx.id}
                    defaultAmount={totalMonthly ? totalMonthly.toNumber() : 0}
                    label="Enregistrer le paiement"
                    className="bg-stone-900 hover:bg-stone-800 text-white"
                  />
                </>
              )}
            </div>
          </div>
        )
      ) : (
        /* CAS D : Logement vacant - Accueillant et orienté action */
        <div className="rounded-xl border border-border/80 bg-muted/20 p-5 sm:p-6 text-foreground flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary mt-0.5">
              <Home className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold">
                Ce logement est actuellement vacant
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl leading-relaxed">
                Aucun bail actif n&apos;est enregistré sur ce bien. Créez un contrat de location pour
                activer le suivi mensuel des paiements et la délivrance des quittances.
              </p>
            </div>
          </div>

          <Link
            href={`/leases/new?propertyId=${property.id}`}
            className={cn(buttonVariants({ size: "default" }), "shrink-0 bg-primary text-primary-foreground")}
          >
            <Plus className="size-4 mr-2" />
            Créer un bail pour ce bien
          </Link>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* 3. WORKSPACE 2 COLONNES (Main content + Sidebar d'identité)        */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne Principale (2/3) : Historique des loyers & Documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Suivi des loyers & Quittances */}
          <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
                  <Receipt className="size-4 text-muted-foreground" />
                  Historique des loyers & quittances
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Dernières périodes de location pour ce bien
                </p>
              </div>

              <Link
                href="/billing"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs")}
              >
                Toute la facturation
                <ArrowRight className="size-3.5 ml-1" />
              </Link>
            </div>

            {/* Liste fluide des loyers */}
            {activeLease && activeLease.transactions.length > 0 ? (
              <div className="divide-y divide-border/50 text-xs">
                {activeLease.transactions.map((tx) => {
                  const txPaid = tx.status === "PAID";
                  const txPartial = tx.status === "PARTIAL";
                  const txOverdue =
                    tx.status === "LATE" ||
                    (tx.status === "PENDING" && new Date(tx.dueDate) < now);

                  return (
                    <div
                      key={tx.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 hover:bg-muted/30 px-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-2 rounded-full shrink-0"
                          style={{
                            backgroundColor: txPaid ? "#10b981" : txPartial ? "#3b82f6" : "#f59e0b"
                          }}
                        />
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            {format(new Date(tx.periodStart), "MMMM yyyy", { locale: fr })}
                          </p>
                          <p className="text-muted-foreground text-xs mt-0.5">
                            {tx.paidAt
                              ? `Réglé le ${format(new Date(tx.paidAt), "d MMM yyyy", { locale: fr })}`
                              : `Échéance au ${format(new Date(tx.dueDate), "d MMM yyyy", { locale: fr })}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        <div className="text-right font-mono">
                          <p className="font-semibold text-foreground text-sm">
                            {formatCurrency(Number(tx.amount))}
                          </p>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] py-0 px-1.5 font-normal mt-0.5",
                              txPaid
                                ? "text-emerald-800 bg-emerald-50 border-emerald-200"
                                : txPartial
                                ? "text-blue-800 bg-blue-50 border-blue-200"
                                : "text-amber-800 bg-amber-50 border-amber-200"
                            )}
                          >
                            {txPaid ? "Payé" : txPartial ? "Partiel" : txOverdue ? "En retard" : "En attente"}
                          </Badge>
                        </div>

                        {/* Action contextuelle à 1 clic */}
                        <div className="shrink-0">
                          {txPaid ? (
                            <QuittanceButton transactionId={tx.id} />
                          ) : (
                            <MarkPaidButton
                              transactionId={tx.id}
                              defaultAmount={Number(tx.amount)}
                              label="Enregistrer"
                              size="xs"
                              variant="outline"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-muted-foreground">
                <Receipt className="size-7 mx-auto mb-2 text-muted-foreground/40" />
                <p>Aucune transaction enregistrée pour ce logement.</p>
              </div>
            )}
          </div>

          {/* Documents du logement */}
          <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm space-y-3">
            <h3 className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
              <FileCheck className="size-4 text-muted-foreground" />
              Documents associés
            </h3>

            <div className="grid gap-2.5 sm:grid-cols-2 text-xs">
              {/* Document du bail */}
              {activeLease ? (
                <div className="p-3 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="size-4 text-primary shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Bail de location actif</p>
                      <p className="text-muted-foreground text-[11px]">
                        Signé le {format(new Date(activeLease.startDate), "d MMM yyyy", { locale: fr })}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/leases/${activeLease.id}`}
                    className={cn(buttonVariants({ variant: "ghost", size: "xs" }))}
                  >
                    Consulter
                    <ExternalLink className="size-3 ml-1" />
                  </Link>
                </div>
              ) : (
                <div className="p-3 rounded-lg border border-dashed border-border text-muted-foreground text-center">
                  Aucun contrat actif
                </div>
              )}

              {/* Dernière quittance */}
              {currentMonthTx?.status === "PAID" ? (
                <div className="p-3 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Receipt className="size-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Quittance {monthName}</p>
                      <p className="text-muted-foreground text-[11px]">Attestation de loyer acquitté</p>
                    </div>
                  </div>
                  <QuittanceButton transactionId={currentMonthTx.id} />
                </div>
              ) : (
                <div className="p-3 rounded-lg border border-dashed border-border text-muted-foreground flex items-center justify-center">
                  Quittance disponible après enregistrement du paiement
                </div>
              )}
            </div>
          </div>

          {/* Tickets de maintenance */}
          {property.maintenanceTickets.length > 0 && (
            <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
                  <Wrench className="size-4 text-muted-foreground" />
                  Demandes d&apos;intervention & Maintenance
                </h3>
                <Link
                  href="/maintenance"
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs")}
                >
                  Toutes les demandes
                  <ArrowRight className="size-3.5 ml-1" />
                </Link>
              </div>

              <div className="divide-y divide-border/50 text-xs">
                {property.maintenanceTickets.map((ticket) => {
                  const cfg = MAINTENANCE_STATUS_CONFIG[ticket.status] ?? MAINTENANCE_STATUS_CONFIG.OPEN;
                  return (
                    <div
                      key={ticket.id}
                      className="py-2.5 flex items-center justify-between gap-3"
                    >
                      <div>
                        <Link
                          href={`/maintenance/${ticket.id}`}
                          className="font-medium text-foreground hover:underline"
                        >
                          {ticket.title}
                        </Link>
                        <p className="text-muted-foreground text-[11px] mt-0.5">
                          Signalé par {ticket.tenant.firstName} {ticket.tenant.lastName} le{" "}
                          {format(new Date(ticket.createdAt), "d MMM yyyy", { locale: fr })}
                        </p>
                      </div>

                      <Badge variant="outline" className={cn("text-[10px] py-0", cfg.className)}>
                        {cfg.label}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Colonne Latérale (1/3) : Fiche Locataire, Bail & Caractéristiques */}
        <div className="space-y-6">
          {/* Locataire Actuel */}
          <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
                <User className="size-4 text-muted-foreground" />
                Locataire actuel
              </h3>
              {tenant && (
                <Link
                  href={`/tenants/${tenant.id}`}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Fiche locataire →
                </Link>
              )}
            </div>

            {tenant ? (
              <div className="space-y-3 text-xs">
                <div>
                  <Link
                    href={`/tenants/${tenant.id}`}
                    className="text-sm font-bold text-foreground hover:underline"
                  >
                    {tenant.firstName} {tenant.lastName}
                  </Link>
                  <p className="text-muted-foreground text-[11px] mt-0.5">
                    En place depuis {format(new Date(activeLease!.startDate), "MMMM yyyy", { locale: fr })}
                  </p>
                </div>

                {/* Coordonnées utiles directement accessibles au clic */}
                <div className="space-y-2 pt-1 border-t border-border/50">
                  {tenant.email && (
                    <a
                      href={`mailto:${tenant.email}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Mail className="size-3.5 shrink-0 text-muted-foreground/70" />
                      <span className="truncate">{tenant.email}</span>
                    </a>
                  )}

                  {tenant.phone && (
                    <a
                      href={`tel:${tenant.phone}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-mono"
                    >
                      <Phone className="size-3.5 shrink-0 text-muted-foreground/70" />
                      <span>{tenant.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-muted-foreground space-y-2">
                <p>Aucun locataire en cours pour ce logement.</p>
                <Link
                  href={`/leases/new?propertyId=${property.id}`}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "text-xs w-full")}
                >
                  Associer un locataire
                </Link>
              </div>
            )}
          </div>

          {/* Conditions du Bail Actif */}
          {activeLease && (
            <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
                  <FileText className="size-4 text-muted-foreground" />
                  Conditions du bail
                </h3>
                <Link
                  href={`/leases/${activeLease.id}`}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Détails →
                </Link>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Type de bail</span>
                  <span className="font-medium text-foreground">
                    {LEASE_TYPE_LABELS[activeLease.leaseType] ?? activeLease.leaseType}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Loyer hors charges</span>
                  <span className="font-mono font-medium text-foreground">
                    {formatCurrency(Number(activeLease.rentAmount))}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Provisions sur charges</span>
                  <span className="font-mono font-medium text-foreground">
                    {formatCurrency(Number(activeLease.chargesAmount || 0))}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-border/50 pt-2 font-semibold">
                  <span className="text-foreground">Total mensuel</span>
                  <span className="font-mono text-foreground text-sm">
                    {totalMonthly ? formatCurrency(totalMonthly.toFixed(2)) : ""}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-muted-foreground">Paiement exigible</span>
                  <span className="text-foreground">
                    Le {activeLease.paymentDay} du mois
                  </span>
                </div>

                {activeLease.depositAmount && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Dépôt de garantie</span>
                    <span className="font-mono text-foreground">
                      {formatCurrency(Number(activeLease.depositAmount))}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Caractéristiques & Références du Logement */}
          <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm space-y-3 text-xs">
            <h3 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Building2 className="size-4 text-muted-foreground" />
              Caractéristiques du bien
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium text-foreground">
                  {PROPERTY_TYPE_LABELS[property.type] ?? property.type}
                </span>
              </div>

              {property.surface && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Surface habitable</span>
                  <span className="font-medium text-foreground">{property.surface} m²</span>
                </div>
              )}

              {property.rooms && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Nombre de pièces</span>
                  <span className="font-medium text-foreground">{property.rooms}</span>
                </div>
              )}

              {property.cadastralRef && (
                <div className="flex items-center justify-between pt-1 border-t border-border/40">
                  <span className="text-muted-foreground">Réf. cadastrale</span>
                  <span className="font-mono text-[11px] text-foreground">{property.cadastralRef}</span>
                </div>
              )}

              {property.taxRef && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Réf. fiscale</span>
                  <span className="font-mono text-[11px] text-foreground">{property.taxRef}</span>
                </div>
              )}
            </div>

            {property.description && (
              <div className="pt-2 border-t border-border/40 text-muted-foreground leading-relaxed text-[11px]">
                {property.description}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
