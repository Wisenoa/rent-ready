import { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  Users,
  Check,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Receipt,
  ArrowRight,
  FileText,
  Wrench,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getAuthenticatedUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getDashboardStats } from "@/lib/queries/dashboard-stats";
import { formatCurrency } from "@/lib/format";
import { ensureRentPeriods } from "@/lib/queries/rent-periods";
import { ArrearsSection } from "./arrears-section";
import { PropertyForm } from "@/components/property-form";
import { MarkPaidButton } from "@/components/mark-paid-button";
import { ReminderButton } from "@/components/reminder-button";
import Decimal from "decimal.js";
import {
  PageShell,
  MonthHeader,
  FinancialSummary,
  RentRow,
  Section,
  StatusBadge,
  StatusDot,
  Money,
} from "@/components/design-system";

export const metadata: Metadata = {
  title: "Tableau de bord · RentReady",
};

export default async function DashboardPage() {
  const userId = await getAuthenticatedUserId();

  // Matérialise les périodes de loyers dues
  await ensureRentPeriods(userId);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  const monthName = format(now, "MMMM yyyy", { locale: fr });
  const stoppedDate = format(now, "d MMMM", { locale: fr });

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

  // Calculs financiers stricts pour le mois en cours (Decimal - AGENTS.md §10)
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

  // Compter le nombre de biens réglés vs en attente
  let paidCount = 0;
  let pendingCount = 0;
  for (const prop of properties) {
    const activeLease = prop.leases[0];
    const tx = activeLease?.transactions[0];
    if (tx?.status === "PAID") {
      paidCount++;
    } else if (activeLease) {
      pendingCount++;
    }
  }

  return (
    <PageShell maxWidth="default">
      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 0. ÉTAT D'ACTIVATION / NOUVEAU COMPTE SANS BIEN                        */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {!hasProperties ? (
        <div className="space-y-6">
          <div className="border border-[#151413]/10 bg-[#FAF8F3] p-8 sm:p-10 text-center sm:text-left space-y-6">
            <div className="max-w-2xl space-y-3">
              <StatusBadge tone="neutral" size="xs">
                Démarrage rapide
              </StatusBadge>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#151413] tracking-tight font-normal">
                Bienvenue sur RentReady
              </h1>
              <p className="text-sm sm:text-base text-[#6B6760] leading-relaxed">
                Votre outil de gestion locative calme et automatisé. Enregistrez votre premier bien
                pour activer le suivi automatique des loyers, l&apos;encaissement et l&apos;émission des quittances.
              </p>
              <div className="pt-2 flex flex-wrap gap-3 justify-center sm:justify-start">
                <PropertyForm
                  trigger={
                    <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#151413] hover:bg-[#2A2725] text-[#F8F6F0] text-sm font-medium transition-colors cursor-pointer">
                      <Plus className="size-4" />
                      <span>Ajouter mon premier logement</span>
                    </span>
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 border-t border-[#151413]/10 pt-6 text-left">
              <div className="space-y-1.5 p-3.5 bg-white border border-[#151413]/10">
                <span className="inline-flex size-6 items-center justify-center bg-[#151413] text-[#F8F6F0] font-mono text-xs font-bold">
                  1
                </span>
                <p className="font-semibold text-sm text-[#151413]">Votre logement</p>
                <p className="text-xs text-[#6B6760]">
                  Adresse, type et nom du bien en quelques clics.
                </p>
              </div>
              <div className="space-y-1.5 p-3.5 bg-white border border-[#151413]/10">
                <span className="inline-flex size-6 items-center justify-center bg-[#151413] text-[#F8F6F0] font-mono text-xs font-bold">
                  2
                </span>
                <p className="font-semibold text-sm text-[#151413]">Votre locataire & bail</p>
                <p className="text-xs text-[#6B6760]">
                  Coordonnées et loyer mensuel en 1 écran.
                </p>
              </div>
              <div className="space-y-1.5 p-3.5 bg-white border border-[#151413]/10">
                <span className="inline-flex size-6 items-center justify-center bg-[#151413] text-[#F8F6F0] font-mono text-xs font-bold">
                  3
                </span>
                <p className="font-semibold text-sm text-[#151413]">Sérénité mensuelle</p>
                <p className="text-xs text-[#6B6760]">
                  RentReady suit les encaissements et quittances.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Reprise si le propriétaire a ajouté un bien sans bail actif */}
          {isPartiallyConfigured && (
            <div className="border border-l-[3px] border-l-[#C2410C] border-[#FED7AA] bg-[#FFF7ED]/50 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <StatusBadge tone="attention" size="xs">
                    Mise en location en cours
                  </StatusBadge>
                  <span className="text-sm font-semibold text-[#151413]">
                    {properties[0]?.name}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#6B6760]">
                  Votre logement est enregistré mais aucun bail n&apos;est encore actif. Créez son premier bail pour activer le suivi des loyers et les quittances.
                </p>
              </div>
              <Link
                href={`/leases/new?propertyId=${properties[0]?.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#151413] hover:bg-[#2A2725] text-[#F8F6F0] text-xs font-medium shrink-0 transition-colors"
              >
                <FileText className="size-3.5" />
                <span>Finaliser le bail</span>
              </Link>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────────────── */}
          {/* 1. EN-TÊTE DU MOIS (MONTH HEADER)                                 */}
          {/* ────────────────────────────────────────────────────────────────── */}
          <MonthHeader
            monthName={monthName}
            stoppedDate={stoppedDate}
            propertiesCount={properties.length}
            activeTenantsCount={stats.tenants.active}
            actionsSlot={
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Link
                  href="/properties"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FAF8F3] hover:bg-white border border-[#151413]/10 text-[#151413] transition-colors"
                >
                  <Building2 className="size-3 text-[#6B6760]" />
                  <span>Logements ({properties.length})</span>
                </Link>
                <Link
                  href="/tenants"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FAF8F3] hover:bg-white border border-[#151413]/10 text-[#151413] transition-colors"
                >
                  <Users className="size-3 text-[#6B6760]" />
                  <span>Locataires ({stats.tenants.active})</span>
                </Link>
                <Link
                  href="/billing"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#151413] hover:bg-[#2A2725] text-[#F8F6F0] font-medium transition-colors"
                >
                  <Receipt className="size-3 text-[#F8F6F0]" />
                  <span>Quittances & Facturation</span>
                </Link>
              </div>
            }
          />

          {/* ────────────────────────────────────────────────────────────────── */}
          {/* 2. SYNTHÈSE FINANCIÈRE (GRAND LIVRE DU MOIS)                       */}
          {/* ────────────────────────────────────────────────────────────────── */}
          <FinancialSummary
            expected={expectedRentMonth}
            received={receivedRentMonth}
            outstanding={pendingRentMonth}
            collectionPercentage={collectionPercentage}
          />

          {/* ────────────────────────────────────────────────────────────────── */}
          {/* 2.5. BANDEAU DE SITUATION IMMÉDIAT                                 */}
          {/* ────────────────────────────────────────────────────────────────── */}
          {allMonthPaid ? (
            <div className="p-4 border border-[#BBF7D0] bg-[#F0FDF4] text-[#166534] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Check className="size-4 shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-semibold">
                    Tout est à jour pour {monthName}
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#166534]/80">
                    Tous vos loyers attendus ont été perçus et les quittances sont prêtes.
                  </p>
                </div>
              </div>
              <Link
                href="/billing"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#166534] hover:underline shrink-0"
              >
                <span>Voir les quittances</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          ) : pendingRentMonth.gt(0) ? (
            <div className="p-4 border border-l-[3px] border-l-[#C2410C] border-[#FED7AA] bg-[#FFF7ED]/60 text-[#151413] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <StatusDot tone="attention" />
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-[#151413]">
                    <Money amount={pendingRentMonth} size="sm" tone="attention" /> restant à percevoir pour {monthName}
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#6B6760]">
                    {collectionPercentage}% des loyers du mois ont été perçus.
                  </p>
                </div>
              </div>
              <Link
                href="/billing"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#151413] hover:bg-[#2A2725] text-[#F8F6F0] text-xs font-medium shrink-0 transition-colors"
              >
                <span>Pointer les paiements</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          ) : null}

          {/* ────────────────────────────────────────────────────────────────── */}
          {/* 3. EXCEPTIONS & ACTIONS REQUISES (Priorité immédiate)              */}
          {/* ────────────────────────────────────────────────────────────────── */}
          <ArrearsSection userId={userId} />

          {/* Alertes maintenance éventuelles */}
          {openTickets.length > 0 && (
            <div className="border border-[#151413]/10 bg-[#FAF8F3] p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Wrench className="size-4 text-[#6B6760] shrink-0" />
                <div>
                  <span className="font-semibold text-[#151413]">
                    {openTickets.length} demande{openTickets.length > 1 ? "s" : ""} locataire en cours :
                  </span>{" "}
                  <span className="text-[#6B6760]">
                    {openTickets[0].title} ({openTickets[0].property.name})
                  </span>
                </div>
              </div>
              <Link
                href="/maintenance"
                className="inline-flex items-center gap-1 font-medium text-[#151413] hover:underline shrink-0"
              >
                <span>Gérer les demandes</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────────────── */}
          {/* 4. VOS LOGEMENTS (Grand Livre par bien)                            */}
          {/* ────────────────────────────────────────────────────────────────── */}
          <Section
            eyebrow={`Vos Logements (${properties.length})`}
            description={
              hasProperties
                ? `${paidCount} à jour · ${pendingCount} en attente`
                : undefined
            }
            action={
              <Link
                href="/properties"
                className="text-xs font-medium text-[#151413] hover:underline inline-flex items-center gap-1"
              >
                <span>Tous les logements</span>
                <ArrowRight className="size-3" />
              </Link>
            }
          >
            <div className="border border-[#151413]/10 divide-y divide-[#151413]/10 bg-[#FAF8F3]">
              {properties.map((property) => {
                const activeLease = property.leases[0];
                const tenant = activeLease?.tenant;
                const totalRent = activeLease
                  ? new Decimal(activeLease.rentAmount).plus(new Decimal(activeLease.chargesAmount || 0))
                  : null;
                const currentMonthTx = activeLease?.transactions[0];

                const isPaid = currentMonthTx?.status === "PAID";
                const isPartial = currentMonthTx?.status === "PARTIAL";
                const isLate =
                  currentMonthTx?.status === "LATE" ||
                  (currentMonthTx?.dueDate ? new Date(currentMonthTx.dueDate) < now && !isPaid : false);

                const status = !activeLease
                  ? "VACANT"
                  : isPaid
                  ? "PAID"
                  : isPartial
                  ? "PARTIAL"
                  : isLate
                  ? "LATE"
                  : "PENDING";

                const paidDate = currentMonthTx?.paidAt
                  ? format(new Date(currentMonthTx.paidAt), "d MMM", { locale: fr })
                  : null;

                const dueDate = currentMonthTx?.dueDate
                  ? format(new Date(currentMonthTx.dueDate), "d MMM", { locale: fr })
                  : null;

                const remainingAmount = currentMonthTx?.amount
                  ? new Decimal(currentMonthTx.amount)
                  : totalRent;

                const actionSlot =
                  currentMonthTx && !isPaid ? (
                    <div className="flex items-center gap-2">
                      <ReminderButton
                        transactionId={currentMonthTx.id}
                        label="Relancer"
                      />
                      <MarkPaidButton
                        transactionId={currentMonthTx.id}
                        defaultAmount={remainingAmount ? remainingAmount.toNumber() : 0}
                        label="Enregistrer"
                        className="bg-[#151413] hover:bg-[#2A2725] text-[#F8F6F0] text-xs h-7 px-2.5 rounded-none"
                      />
                    </div>
                  ) : null;

                return (
                  <RentRow
                    key={property.id}
                    propertyId={property.id}
                    propertyName={property.name}
                    propertyLocation={`${property.city} (${property.postalCode})`}
                    tenantName={tenant ? `${tenant.firstName} ${tenant.lastName}` : undefined}
                    leaseDetail={activeLease ? "Bail actif" : undefined}
                    totalRent={totalRent}
                    status={status}
                    paidDate={paidDate}
                    dueDate={dueDate}
                    remainingAmount={!isPaid && remainingAmount ? remainingAmount : null}
                    exceptionNotice={
                      isPartial
                        ? "Acompte perçu. Reçu d'acompte émis (art. 21). Le solde reste à pointer."
                        : isLate
                        ? "Échéance passée sans paiement constaté. Une relance peut être envoyée."
                        : undefined
                    }
                    actionSlot={actionSlot}
                    quittanceUrl="/billing"
                  />
                );
              })}
            </div>
          </Section>

          {/* ────────────────────────────────────────────────────────────────── */}
          {/* 5. PIED DE PAGE STRUCTURÉ & VÉRITÉ LÉGALE                          */}
          {/* ────────────────────────────────────────────────────────────────── */}
          <footer className="pt-4 border-t border-[#151413]/10 text-center sm:text-left text-xs text-[#6B6760]">
            <p>
              {properties.length} logement{properties.length > 1 ? "s" : ""} sous gestion directe · Conforme loi Alur & art. 21 loi 89
            </p>
          </footer>
        </>
      )}
    </PageShell>
  );
}
