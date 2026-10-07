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
  Receipt,
  Wrench,
  Plus,
  ArrowRight,
  ExternalLink,
  Home,
  FileCheck,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/auth";
import { formatCurrency } from "@/lib/format";
import { ensureRentPeriods } from "@/lib/queries/rent-periods";
import { daysLate as daysPastDue } from "@/lib/domain/period-presentation";
import { settlePeriodPayments } from "@/lib/domain/period-settlement";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { PropertyActions } from "@/components/property-actions";
import { QuittanceButton } from "@/components/quittance-button";
import { MarkPaidButton } from "@/components/mark-paid-button";
import { ReminderButton } from "@/components/reminder-button";

// Primitives & Composants B+ V2.1 Design System
import {
  PageShell,
  Money,
  StatusBadge,
  StatusDot,
  DocumentRegister,
  type DocumentItem,
  type StatusTone,
} from "@/components/design-system";

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

const MAINTENANCE_STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  OPEN: { label: "Nouveau", tone: "delayed" },
  IN_PROGRESS: { label: "En cours", tone: "attention" },
  RESOLVED: { label: "Résolu", tone: "calm" },
  CLOSED: { label: "Fermé", tone: "neutral" },
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

  // Construction du registre documentaire B+ V2.1
  const documentsList: DocumentItem[] = [];

  if (activeLease) {
    documentsList.push({
      id: "lease-contract",
      title: "Bail de location actif",
      subtitle: `Signé le ${format(new Date(activeLease.startDate), "d MMM yyyy", { locale: fr })}`,
      period: LEASE_TYPE_LABELS[activeLease.leaseType] ?? activeLease.leaseType,
      statusLabel: "Actif",
      statusTone: "calm",
      actionType: "view",
      actionHref: `/leases/${activeLease.id}`,
    });
  }

  if (currentMonthTx?.status === "PAID") {
    documentsList.push({
      id: "receipt-current-month",
      title: `Quittance ${monthName}`,
      subtitle: "Attestation de loyer acquitté (Art. 21 loi 89)",
      period: format(new Date(currentMonthTx.periodStart), "MMMM yyyy", { locale: fr }),
      statusLabel: "Délivrée",
      statusTone: "calm",
      actionType: "custom",
      actionSlot: <QuittanceButton transactionId={currentMonthTx.id} />,
    });
  } else if (isPartial) {
    documentsList.push({
      id: "receipt-partial",
      title: `Reçu d'acompte ${monthName}`,
      subtitle: "Loi 89 art. 21 · Acompte partiel constaté",
      statusLabel: "Acompte",
      statusTone: "attention",
      actionType: "custom",
      actionSlot: (
        <span className="text-xs text-[#C2410C] font-mono">
          Solde : {formatCurrency(amountRemaining.toFixed(2))}
        </span>
      ),
    });
  }

  documentsList.push({
    id: "inventory-doc",
    title: "État des lieux d'entrée",
    subtitle: activeLease ? "Dossier contradictoire d'entrée" : "À établir lors de l'emménagement",
    statusLabel: activeLease ? "Archivé" : "En attente",
    statusTone: "neutral",
  });

  documentsList.push({
    id: "insurance-doc",
    title: "Attestation assurance habitation",
    subtitle: tenant ? "Garantie villégiature & risques locatifs" : "À collecter",
    statusLabel: tenant ? "Vérifié" : "En attente",
    statusTone: tenant ? "calm" : "neutral",
  });

  return (
    <PageShell maxWidth="default" className="space-y-6 pb-12">
      {/* ────────────────────────────────────────────────────────────────── */}
      {/* 1. NAVIGATION & ENTÊTE D'IDENTITÉ DU LOGEMENT                     */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        {/* Fil d'ariane & actions secondaires */}
        <div className="flex items-center justify-between text-xs text-[#6B6760]">
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 hover:text-[#151413] transition-colors group font-medium"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Tous les logements</span>
          </Link>

          {/* Actions d'édition et suppression sans encombrement */}
          <PropertyActions property={propertyData} />
        </div>

        {/* Titre et attributs d'identité */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#151413]/10 pb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-serif text-2xl sm:text-3xl text-[#151413] tracking-tight font-normal">
                {property.name}
              </h1>
              <StatusBadge tone="neutral" size="xs">
                {PROPERTY_TYPE_LABELS[property.type] ?? property.type}
                {property.surface ? ` · ${property.surface} m²` : ""}
                {property.rooms ? ` · ${property.rooms} pièce${property.rooms > 1 ? "s" : ""}` : ""}
              </StatusBadge>
              {activeLease ? (
                <StatusBadge
                  tone="calm"
                  showDot
                  size="xs"
                >
                  Occupé ({tenant?.firstName} {tenant?.lastName})
                </StatusBadge>
              ) : (
                <StatusBadge
                  tone="neutral"
                  showDot
                  size="xs"
                >
                  Vacant
                </StatusBadge>
              )}
            </div>

            <p className="text-[#6B6760] text-xs sm:text-sm mt-1.5 flex items-center gap-1.5">
              <MapPin className="size-3.5 shrink-0 text-[#9E9A90]" />
              <span>
                {property.addressLine1}
                {property.addressLine2 ? `, ${property.addressLine2}` : ""}, {property.postalCode} {property.city}
              </span>
            </p>
          </div>

          {/* Loyer mensuel global visible en un coup d'œil */}
          {totalMonthly && (
            <div className="text-left sm:text-right">
              <p className="text-xs text-[#6B6760] font-medium">Loyer charges comprises</p>
              <div className="flex items-baseline gap-1 sm:justify-end">
                <Money amount={totalMonthly} size="xl" tone="ink" />
                <span className="text-xs font-normal text-[#6B6760]">/ mois</span>
              </div>
              {monthlyRent && monthlyCharges && (
                <p className="text-[11px] text-[#6B6760] mt-0.5">
                  Loyer {formatCurrency(monthlyRent.toFixed(2))} + Charges {formatCurrency(monthlyCharges.toFixed(2))}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* 1.5. MOMENT DE CONFIRMATION / PREMIER BAIL ACTIVÉ                  */}
      {/* ────────────────────────────────────────────────────────────────── */}
      {activated === "1" && activeLease && (
        <div className="rounded-xl border border-[#151413]/10 bg-[#FAF8F3] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_1px_2px_rgba(21,20,19,0.04)]">
          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#151413]/5 text-[#151413] mt-0.5">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-[#151413]">
                  Votre logement est configuré et prêt à être géré
                </h2>
                <StatusBadge tone="calm" size="xs">
                  Prêt
                </StatusBadge>
              </div>
              <p className="text-xs sm:text-sm text-[#6B6760] mt-0.5">
                Le bail avec {tenant?.firstName} {tenant?.lastName} est actif. Le suivi mensuel du loyer, l&apos;encaissement et l&apos;émission des quittances sont désormais automatiques.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0 gap-1.5 font-medium border-[#151413]/15 text-[#151413] hover:bg-white")}
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
          <div className="rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-4 sm:p-5 text-[#166534] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-[0_1px_2px_rgba(21,20,19,0.04)]">
            <div className="flex items-start gap-3.5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#DCFCE7] text-[#166534] mt-0.5">
                <CheckCircle2 className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-[#166534]">
                    Loyer de {monthName} réglé
                  </h2>
                  <StatusBadge tone="calm" size="xs">
                    Payé
                  </StatusBadge>
                </div>
                <p className="text-xs sm:text-sm text-[#166534]/90 mt-1">
                  {formatCurrency(amountReceived.toFixed(2))} perçus
                  {monthlyRent && monthlyCharges && (
                    <span className="text-[#166534]/80">
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
          <div className="rounded-xl border border-l-[3px] border-l-[#C2410C] border-[#FED7AA] bg-[#FFF7ED]/60 p-4 sm:p-5 text-[#431407] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-[0_1px_2px_rgba(21,20,19,0.04)]">
            <div className="flex items-start gap-3.5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#FFEDD5] text-[#C2410C] mt-0.5">
                <Clock className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-[#C2410C]">
                    Paiement partiel pour {monthName}
                  </h2>
                  <StatusBadge tone="attention" size="xs">
                    Partiel
                  </StatusBadge>
                </div>
                <p className="text-xs sm:text-sm text-[#431407]/90 mt-1">
                  {formatCurrency(amountReceived.toFixed(2))} reçus sur {totalMonthly ? formatCurrency(totalMonthly.toFixed(2)) : ""} ·{" "}
                  <strong className="font-semibold text-[#C2410C]">
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
                    className="bg-[#151413] hover:bg-[#2A2725] text-[#F8F6F0]"
                  />
                </>
              )}
            </div>
          </div>
        ) : (
          /* CAS C : Loyer en attente ou en retard */
          <div
            className={cn(
              "rounded-xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-[0_1px_2px_rgba(21,20,19,0.04)]",
              isLate
                ? "border-l-[3px] border-l-[#D97706] border-[#FDE68A] bg-[#FEF3C7]/40 text-[#451A03]"
                : "border-[#151413]/10 bg-[#FAF8F3] text-[#151413]"
            )}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-lg mt-0.5",
                  isLate ? "bg-[#FEF3C7] text-[#D97706]" : "bg-[#151413]/5 text-[#6B6760]"
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
                    <StatusBadge tone="delayed" size="xs">
                      {lateDays > 0 ? `${lateDays} jours de retard` : "Échu"}
                    </StatusBadge>
                  )}
                </div>
                <p className="text-xs sm:text-sm mt-1 text-[#6B6760]">
                  {totalMonthly && (
                    <strong className="font-semibold text-[#151413]">
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
                    className="bg-[#151413] hover:bg-[#2A2725] text-[#F8F6F0]"
                  />
                </>
              )}
            </div>
          </div>
        )
      ) : (
        /* CAS D : Logement vacant - Accueillant et orienté action */
        <div className="rounded-xl border border-[#151413]/10 bg-[#FAF8F3] p-5 sm:p-6 text-[#151413] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#151413]/5 text-[#151413] mt-0.5">
              <Home className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#151413]">
                Ce logement est actuellement vacant
              </h2>
              <p className="text-xs sm:text-sm text-[#6B6760] mt-1 max-w-xl leading-relaxed">
                Aucun bail actif n&apos;est enregistré sur ce bien. Créez un contrat de location pour
                activer le suivi mensuel des paiements et la délivrance des quittances.
              </p>
            </div>
          </div>

          <Link
            href={`/leases/new?propertyId=${property.id}`}
            className={cn(buttonVariants({ size: "default" }), "shrink-0 bg-[#151413] hover:bg-[#2A2725] text-[#F8F6F0]")}
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
          <div className="border border-[#151413]/10 bg-[#FAF8F3] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#151413]/10 pb-3">
              <div>
                <h3 className="font-serif text-lg text-[#151413] font-normal flex items-center gap-2">
                  <Receipt className="size-4 text-[#6B6760]" />
                  Historique des loyers & quittances
                </h3>
                <p className="text-xs text-[#6B6760] mt-0.5">
                  Dernières périodes de location pour ce bien
                </p>
              </div>

              <Link
                href="/billing"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs hover:bg-[#151413]/5 text-[#6B6760] hover:text-[#151413]")}
              >
                Toute la facturation
                <ArrowRight className="size-3.5 ml-1" />
              </Link>
            </div>

            {/* Liste fluide des loyers */}
            {activeLease && activeLease.transactions.length > 0 ? (
              <div className="divide-y divide-[#151413]/10 text-xs">
                {activeLease.transactions.map((tx) => {
                  const txPaid = tx.status === "PAID";
                  const txPartial = tx.status === "PARTIAL";
                  const txOverdue =
                    tx.status === "LATE" ||
                    (tx.status === "PENDING" && new Date(tx.dueDate) < now);

                  const tone: StatusTone = txPaid ? "calm" : txPartial ? "attention" : txOverdue ? "delayed" : "neutral";

                  return (
                    <div
                      key={tx.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 hover:bg-white px-2 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <StatusDot tone={tone} size="sm" />
                        <div>
                          <p className="font-semibold text-[#151413] text-sm capitalize">
                            {format(new Date(tx.periodStart), "MMMM yyyy", { locale: fr })}
                          </p>
                          <p className="text-[#6B6760] text-xs mt-0.5">
                            {tx.paidAt
                              ? `Réglé le ${format(new Date(tx.paidAt), "d MMM yyyy", { locale: fr })}`
                              : `Échéance au ${format(new Date(tx.dueDate), "d MMM yyyy", { locale: fr })}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        <div className="text-right">
                          <Money amount={tx.amount} size="sm" tone="ink" className="font-semibold" />
                          <div className="mt-0.5">
                            <StatusBadge tone={tone} size="xs">
                              {txPaid ? "Payé" : txPartial ? "Partiel" : txOverdue ? "En retard" : "En attente"}
                            </StatusBadge>
                          </div>
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
              <div className="py-8 text-center text-xs text-[#6B6760]">
                <Receipt className="size-7 mx-auto mb-2 text-[#9E9A90]" />
                <p>Aucune transaction enregistrée pour ce logement.</p>
              </div>
            )}
          </div>

          {/* Documents du logement via DocumentRegister */}
          <div className="border border-[#151413]/10 bg-[#FAF8F3] p-5 space-y-3">
            <div className="border-b border-[#151413]/10 pb-2.5">
              <h3 className="font-serif text-lg text-[#151413] font-normal flex items-center gap-2">
                <FileCheck className="size-4 text-[#6B6760]" />
                Documents associés
              </h3>
            </div>

            <DocumentRegister documents={documentsList} />
          </div>

          {/* Tickets de maintenance */}
          {property.maintenanceTickets.length > 0 && (
            <div className="border border-[#151413]/10 bg-[#FAF8F3] p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#151413]/10 pb-2.5">
                <h3 className="font-serif text-lg text-[#151413] font-normal flex items-center gap-2">
                  <Wrench className="size-4 text-[#6B6760]" />
                  Demandes d&apos;intervention & Maintenance
                </h3>
                <Link
                  href="/maintenance"
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs hover:bg-[#151413]/5 text-[#6B6760] hover:text-[#151413]")}
                >
                  Toutes les demandes
                  <ArrowRight className="size-3.5 ml-1" />
                </Link>
              </div>

              <div className="divide-y divide-[#151413]/10 text-xs">
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
                          className="font-medium text-[#151413] hover:underline"
                        >
                          {ticket.title}
                        </Link>
                        <p className="text-[#6B6760] text-[11px] mt-0.5">
                          Signalé par {ticket.tenant.firstName} {ticket.tenant.lastName} le{" "}
                          {format(new Date(ticket.createdAt), "d MMM yyyy", { locale: fr })}
                        </p>
                      </div>

                      <StatusBadge tone={cfg.tone} size="xs">
                        {cfg.label}
                      </StatusBadge>
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
          <div className="border border-[#151413]/10 bg-[#FAF8F3] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#151413]/10 pb-2.5">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-[#6B6760] flex items-center gap-1.5">
                <User className="size-3.5 text-[#6B6760]" />
                Locataire actuel
              </h3>
              {tenant && (
                <Link
                  href={`/tenants/${tenant.id}`}
                  className="text-xs text-[#151413] hover:underline font-medium"
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
                    className="text-base font-serif font-normal text-[#151413] hover:underline"
                  >
                    {tenant.firstName} {tenant.lastName}
                  </Link>
                  <p className="text-[#6B6760] text-[11px] mt-0.5">
                    En place depuis {format(new Date(activeLease!.startDate), "MMMM yyyy", { locale: fr })}
                  </p>
                </div>

                {/* Coordonnées utiles directement accessibles au clic */}
                <div className="space-y-2 pt-2 border-t border-[#151413]/10">
                  {tenant.email && (
                    <a
                      href={`mailto:${tenant.email}`}
                      className="flex items-center gap-2 text-[#6B6760] hover:text-[#151413] transition-colors"
                    >
                      <Mail className="size-3.5 shrink-0 text-[#9E9A90]" />
                      <span className="truncate">{tenant.email}</span>
                    </a>
                  )}

                  {tenant.phone && (
                    <a
                      href={`tel:${tenant.phone}`}
                      className="flex items-center gap-2 text-[#6B6760] hover:text-[#151413] transition-colors font-mono"
                    >
                      <Phone className="size-3.5 shrink-0 text-[#9E9A90]" />
                      <span>{tenant.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-[#6B6760] space-y-2">
                <p>Aucun locataire en cours pour ce logement.</p>
                <Link
                  href={`/leases/new?propertyId=${property.id}`}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "text-xs w-full border-[#151413]/15 text-[#151413] hover:bg-white")}
                >
                  Associer un locataire
                </Link>
              </div>
            )}
          </div>

          {/* Conditions du Bail Actif */}
          {activeLease && (
            <div className="border border-[#151413]/10 bg-[#FAF8F3] p-5 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-[#151413]/10 pb-2.5">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-[#6B6760] flex items-center gap-1.5">
                  <FileText className="size-3.5 text-[#6B6760]" />
                  Conditions du bail
                </h3>
                <Link
                  href={`/leases/${activeLease.id}`}
                  className="text-xs text-[#151413] hover:underline font-medium"
                >
                  Détails →
                </Link>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#6B6760]">Type de bail</span>
                  <span className="font-medium text-[#151413]">
                    {LEASE_TYPE_LABELS[activeLease.leaseType] ?? activeLease.leaseType}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#6B6760]">Loyer hors charges</span>
                  <Money amount={activeLease.rentAmount} size="xs" tone="ink" className="font-medium" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#6B6760]">Provisions charges</span>
                  <Money amount={activeLease.chargesAmount || 0} size="xs" tone="ink" className="font-medium" />
                </div>

                <div className="flex items-center justify-between border-t border-[#151413]/10 pt-2 font-semibold">
                  <span className="text-[#151413]">Total mensuel</span>
                  <Money amount={totalMonthly?.toFixed(2) ?? "0"} size="sm" tone="ink" className="font-bold" />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[#6B6760]">Paiement exigible</span>
                  <span className="text-[#151413]">
                    Le {activeLease.paymentDay} du mois
                  </span>
                </div>

                {activeLease.depositAmount && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B6760]">Dépôt de garantie</span>
                    <Money amount={activeLease.depositAmount} size="xs" tone="muted" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Caractéristiques & Références du Logement */}
          <div className="border border-[#151413]/10 bg-[#FAF8F3] p-5 space-y-3 text-xs">
            <div className="border-b border-[#151413]/10 pb-2.5">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-[#6B6760] flex items-center gap-1.5">
                <Building2 className="size-3.5 text-[#6B6760]" />
                Caractéristiques du bien
              </h3>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#6B6760]">Type</span>
                <span className="font-medium text-[#151413]">
                  {PROPERTY_TYPE_LABELS[property.type] ?? property.type}
                </span>
              </div>

              {property.surface && (
                <div className="flex items-center justify-between">
                  <span className="text-[#6B6760]">Surface habitable</span>
                  <span className="font-medium text-[#151413]">{property.surface} m²</span>
                </div>
              )}

              {property.rooms && (
                <div className="flex items-center justify-between">
                  <span className="text-[#6B6760]">Nombre de pièces</span>
                  <span className="font-medium text-[#151413]">{property.rooms}</span>
                </div>
              )}

              {property.cadastralRef && (
                <div className="flex items-center justify-between pt-1 border-t border-[#151413]/5">
                  <span className="text-[#6B6760]">Réf. cadastrale</span>
                  <span className="font-mono text-[11px] text-[#151413]">{property.cadastralRef}</span>
                </div>
              )}

              {property.taxRef && (
                <div className="flex items-center justify-between">
                  <span className="text-[#6B6760]">Réf. fiscale</span>
                  <span className="font-mono text-[11px] text-[#151413]">{property.taxRef}</span>
                </div>
              )}
            </div>

            {property.description && (
              <div className="pt-2 border-t border-[#151413]/10 text-[#6B6760] leading-relaxed text-[11px]">
                {property.description}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
