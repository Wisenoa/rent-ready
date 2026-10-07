import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Calendar,
  CreditCard,
  Download,
  Euro,
  FileText,
  Home,
  Mail,
  Phone,
  Scale,
  Shield,
  Users,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { summariseLease } from "@/lib/domain/lease-summary";
import { formatCurrency } from "@/lib/format";
import { presentTransaction } from "@/lib/domain/period-presentation";
import { getAuthenticatedUserId } from "@/lib/auth";
import { LeaseEditDialog } from "@/components/lease-edit-dialog";
import { QuittanceButton } from "@/components/quittance-button";
import {
  PageShell,
  Money,
  StatusBadge,
  StatusDot,
  AttentionSurface,
  type StatusTone,
} from "@/components/design-system";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const lease = await prisma.lease.findUnique({
    where: { id },
    select: {
      property: { select: { name: true } },
      tenant: { select: { firstName: true, lastName: true } },
    },
  });
  if (!lease) return { title: "Bail non trouvé" };
  return {
    title: `${lease.property.name} — ${lease.tenant.firstName} ${lease.tenant.lastName}`,
  };
}

const LEASE_TYPE_LABELS: Record<string, string> = {
  UNFURNISHED: "Location vide",
  FURNISHED: "Location meublée",
  COMMERCIAL: "Bail commercial",
  SEASONAL: "Location saisonnière",
};

const LEASE_STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  DRAFT: { label: "Brouillon", tone: "neutral" },
  ACTIVE: { label: "Actif", tone: "calm" },
  TERMINATED: { label: "Résilié", tone: "neutral" },
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  TRANSFER: "Virement bancaire",
  CHECK: "Chèque",
  CASH: "Espèces",
  DIRECT_DEBIT: "Prélèvement automatique",
  OTHER: "Autre moyen",
};

export default async function LeaseDetailPage({ params }: Props) {
  const { id } = await params;
  const userId = await getAuthenticatedUserId();

  const lease = await prisma.lease.findUnique({
    where: { id },
    include: {
      property: true,
      tenant: true,
      transactions: {
        orderBy: { dueDate: "desc" },
        take: 24,
      },
      guarantor: true,
    },
  });

  if (!lease || lease.userId !== userId) {
    notFound();
  }

  const statusCfg = LEASE_STATUS_CONFIG[lease.status] ?? LEASE_STATUS_CONFIG.DRAFT;
  const totalMonthly = Number(lease.rentAmount) + Number(lease.chargesAmount);
  const position = summariseLease(lease.transactions);

  return (
    <PageShell maxWidth="default" className="space-y-8 pb-16">
      {/* ────────────────────────────────────────────────────────────────── */}
      {/* 1. NAVIGATION & ACTIONS DU CONTRAT                                */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-[#6B6760]">
          <Link
            href="/leases"
            className="inline-flex items-center gap-1.5 hover:text-[#151413] transition-colors group font-medium"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Tous les baux</span>
          </Link>

          <div className="flex items-center gap-2">
            {lease.documentUrl && (
              <a
                href={lease.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 border border-[#151413]/15 bg-white px-2.5 py-1 text-xs font-medium text-[#151413] hover:bg-[#FAF8F3] transition-colors"
              >
                <Download className="size-3" />
                <span>Télécharger</span>
              </a>
            )}
            {lease.status === "ACTIVE" && lease.revisionDate && (
              <Link
                href={`/leases/${lease.id}/revision`}
                className="inline-flex items-center gap-1.5 border border-[#151413]/15 bg-white px-2.5 py-1 text-xs font-medium text-[#151413] hover:bg-[#FAF8F3] transition-colors"
              >
                <Scale className="size-3" />
                <span>Réviser IRL</span>
              </Link>
            )}
            <LeaseEditDialog
              lease={{
                id: lease.id,
                propertyId: lease.propertyId,
                tenantId: lease.tenantId,
                rentAmount: Number(lease.rentAmount),
                chargesAmount: Number(lease.chargesAmount),
                depositAmount: Number(lease.depositAmount),
                startDate: lease.startDate,
                endDate: lease.endDate,
                paymentDay: lease.paymentDay,
                paymentMethod: lease.paymentMethod,
                leaseType: lease.leaseType,
                irlReferenceQuarter: lease.irlReferenceQuarter,
                irlReferenceValue: lease.irlReferenceValue ? Number(lease.irlReferenceValue) : null,
              }}
            />
          </div>
        </div>

        {/* Titre & Statut */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 border-b border-[#151413]/10 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-[#6B6760] font-semibold">
                CONTRAT DE LOCATION
              </span>
              <span className="text-[#9E9A90]">·</span>
              <span className="text-xs text-[#6B6760]">
                Rattaché à {lease.property.name}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#151413]">
              {lease.tenant.firstName} {lease.tenant.lastName}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge tone={statusCfg.tone} showDot size="sm">
              {statusCfg.label}
            </StatusBadge>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* 2. BARRE FINANCIÈRE DE CONDITIONS CONTRACTUELLES                  */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <div className="border border-[#151413]/10 bg-[#FAF8F3] p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          {/* Loyer HC */}
          <div className="space-y-0.5">
            <span className="text-[11px] uppercase tracking-wider text-[#6B6760] font-semibold block">
              Loyer principal HC
            </span>
            <div className="flex items-baseline gap-1">
              <Money amount={Number(lease.rentAmount)} size="xl" tone="ink" />
              <span className="text-[11px] text-[#6B6760]">/mois</span>
            </div>
          </div>

          {/* Charges */}
          <div className="space-y-0.5">
            <span className="text-[11px] uppercase tracking-wider text-[#6B6760] font-semibold block">
              Provisions charges
            </span>
            <div className="flex items-baseline gap-1">
              <Money amount={Number(lease.chargesAmount)} size="xl" tone="ink" />
              <span className="text-[11px] text-[#6B6760]">/mois</span>
            </div>
          </div>

          {/* Total mensuel */}
          <div className="space-y-0.5">
            <span className="text-[11px] uppercase tracking-wider text-[#6B6760] font-semibold block">
              Total mensuel CC
            </span>
            <div className="flex items-baseline gap-1">
              <Money amount={totalMonthly} size="xl" tone="ink" />
              <span className="text-[11px] text-[#6B6760]">/mois</span>
            </div>
          </div>

          {/* Dépôt de garantie */}
          <div className="space-y-0.5">
            <span className="text-[11px] uppercase tracking-wider text-[#6B6760] font-semibold block">
              Dépôt de garantie
            </span>
            <div className="flex items-baseline gap-1">
              <Money amount={Number(lease.depositAmount)} size="xl" tone="ink" />
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* 3. ALERTE ARRIÉRÉS / RETARDS (Si exception constatée)              */}
      {/* ────────────────────────────────────────────────────────────────── */}
      {position.overdueCount > 0 && (
        <AttentionSurface className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="size-4 text-[#C2410C] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-xs text-[#151413] space-y-0.5">
              <span className="font-semibold text-[#C2410C] block">
                {formatCurrency(position.overdueAmount)} d&apos;arriérés sur {position.overdueCount} échéance{position.overdueCount > 1 ? "s" : ""}
              </span>
              <p className="text-[#6B6760]">
                Le terme le plus ancien accuse {position.oldestOverdueDays} jours de retard.
              </p>
            </div>
          </div>

          <Link
            href="/billing"
            className="shrink-0 inline-flex items-center gap-1.5 bg-[#C2410C] text-white px-3 py-1.5 text-xs font-medium hover:bg-[#9A3412] transition-colors"
          >
            Pointer un règlement
          </Link>
        </AttentionSurface>
      )}

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* 4. DISPOSITION CONTINUE : CONDITIONS & HISTORIQUE DES LOYERS       */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Colonne gauche (1/3) : Parties & Logement */}
        <div className="space-y-6">
          {/* Fiche Logement */}
          <div className="border border-[#151413]/10 bg-[#FAF8F3] p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#151413]/10 pb-2.5">
              <span className="text-xs font-semibold text-[#151413] uppercase tracking-wider">
                Bien loué
              </span>
              <Link
                href={`/properties/${lease.property.id}`}
                className="text-[11px] text-[#151413] hover:underline font-medium"
              >
                Fiche logement →
              </Link>
            </div>
            <div className="space-y-1 text-xs">
              <p className="font-medium text-sm text-[#151413]">{lease.property.name}</p>
              <p className="text-[#6B6760]">
                {lease.property.addressLine1}
                <br />
                {lease.property.postalCode} {lease.property.city}
              </p>
              {lease.property.surface && (
                <p className="text-[#6B6760] pt-1">
                  Surface : {lease.property.surface} m² {lease.property.type ? `· ${lease.property.type}` : ""}
                </p>
              )}
            </div>
          </div>

          {/* Fiche Locataire */}
          <div className="border border-[#151413]/10 bg-[#FAF8F3] p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#151413]/10 pb-2.5">
              <span className="text-xs font-semibold text-[#151413] uppercase tracking-wider">
                Locataire titulaire
              </span>
              <Link
                href={`/tenants?id=${lease.tenant.id}`}
                className="text-[11px] text-[#151413] hover:underline font-medium"
              >
                Fiche locataire →
              </Link>
            </div>
            <div className="space-y-2 text-xs">
              <p className="font-medium text-sm text-[#151413]">
                {lease.tenant.firstName} {lease.tenant.lastName}
              </p>
              {lease.tenant.email && (
                <a
                  href={`mailto:${lease.tenant.email}`}
                  className="flex items-center gap-1.5 text-[#6B6760] hover:text-[#151413] transition-colors"
                >
                  <Mail className="size-3" />
                  <span>{lease.tenant.email}</span>
                </a>
              )}
              {lease.tenant.phone && (
                <a
                  href={`tel:${lease.tenant.phone}`}
                  className="flex items-center gap-1.5 text-[#6B6760] hover:text-[#151413] transition-colors"
                >
                  <Phone className="size-3" />
                  <span className="font-mono">{lease.tenant.phone}</span>
                </a>
              )}
            </div>
          </div>

          {/* Fiche Garant (si présent) */}
          {lease.guarantor && (
            <div className="border border-[#151413]/10 bg-[#FAF8F3] p-5 space-y-3">
              <span className="text-xs font-semibold text-[#151413] uppercase tracking-wider block border-b border-[#151413]/10 pb-2.5">
                Caution solidaire (Garant)
              </span>
              <div className="space-y-1.5 text-xs">
                <p className="font-medium text-sm text-[#151413]">
                  {lease.guarantor.firstName} {lease.guarantor.lastName}
                </p>
                {lease.guarantor.email && (
                  <p className="text-[#6B6760]">{lease.guarantor.email}</p>
                )}
                {lease.guarantor.phone && (
                  <p className="text-[#6B6760] font-mono">{lease.guarantor.phone}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Colonne droite (2/3) : Clauses contractuelles & Historique */}
        <div className="lg:col-span-2 space-y-6">
          {/* Clauses contractuelles */}
          <div className="border border-[#151413]/10 bg-[#FAF8F3] p-5 space-y-4">
            <h2 className="text-xs font-semibold text-[#151413] uppercase tracking-wider border-b border-[#151413]/10 pb-2.5">
              Conditions & Modalités d&apos;exécution
            </h2>

            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs">
              <div>
                <span className="text-[#6B6760] block">Nature du contrat</span>
                <span className="font-medium text-[#151413]">
                  {LEASE_TYPE_LABELS[lease.leaseType] ?? lease.leaseType}
                </span>
              </div>

              <div>
                <span className="text-[#6B6760] block">Moyen de règlement</span>
                <span className="font-medium text-[#151413]">
                  {PAYMENT_METHOD_LABELS[lease.paymentMethod] ?? lease.paymentMethod}
                </span>
              </div>

              <div>
                <span className="text-[#6B6760] block">Prise d&apos;effet</span>
                <span className="font-medium text-[#151413]">
                  {format(new Date(lease.startDate), "d MMMM yyyy", { locale: fr })}
                </span>
              </div>

              <div>
                <span className="text-[#6B6760] block">Échéance contractuelle</span>
                <span className="font-medium text-[#151413]">
                  {lease.endDate
                    ? format(new Date(lease.endDate), "d MMMM yyyy", { locale: fr })
                    : "Durée indéterminée (tacite reconduction)"}
                </span>
              </div>

              <div>
                <span className="text-[#6B6760] block">Jour d&apos;exigibilité</span>
                <span className="font-medium text-[#151413]">Le {lease.paymentDay} du mois</span>
              </div>

              {lease.irlReferenceQuarter && (
                <div>
                  <span className="text-[#6B6760] block">Indice IRL d&apos;origine</span>
                  <span className="font-medium text-[#151413]">
                    Trimestre {lease.irlReferenceQuarter}
                    {lease.irlReferenceValue ? ` (${lease.irlReferenceValue})` : ""}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Historique des paiements & quittances */}
          <div className="border border-[#151413]/10 bg-[#FAF8F3] overflow-hidden">
            <div className="border-b border-[#151413]/10 px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-[#151413] uppercase tracking-wider">
                  Historique des termes & Quittances
                </h3>
                <p className="text-xs text-[#6B6760] mt-0.5">
                  {formatCurrency(position.collected)} perçu · {formatCurrency(position.outstanding)} restant
                </p>
              </div>
            </div>

            {lease.transactions.length === 0 ? (
              <p className="text-xs text-[#6B6760] text-center py-8">
                Aucune échéance enregistrée pour ce bail
              </p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#151413]/10 bg-[#F2EFE9]/40 text-[11px] uppercase tracking-wider text-[#6B6760]">
                    <th className="py-2.5 px-4 font-normal">Période</th>
                    <th className="py-2.5 px-4 font-normal text-right">Montant</th>
                    <th className="py-2.5 px-4 font-normal">Statut</th>
                    <th className="py-2.5 px-4 font-normal">Paiement</th>
                    <th className="py-2.5 px-4 font-normal text-right">Quittance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#151413]/10 text-xs">
                  {lease.transactions.map((tx) => {
                    const txStatus = presentTransaction(tx);
                    const tone: StatusTone =
                      txStatus.label === "Payé"
                        ? "calm"
                        : txStatus.label === "En retard"
                          ? "delayed"
                          : txStatus.label === "Partiel"
                            ? "attention"
                            : "neutral";

                    return (
                      <tr key={tx.id} className="hover:bg-[#F2EFE9]/50 transition-colors">
                        <td className="py-2.5 px-4 font-mono text-xs uppercase text-[#151413]">
                          {format(new Date(tx.periodStart), "MMM yyyy", { locale: fr })}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <Money amount={tx.amount} tone="ink" size="sm" />
                        </td>
                        <td className="py-2.5 px-4">
                          <StatusBadge tone={tone} showDot size="xs">
                            {txStatus.label}
                          </StatusBadge>
                        </td>
                        <td className="py-2.5 px-4 text-[#6B6760] font-mono text-xs">
                          {tx.paidAt ? format(new Date(tx.paidAt), "dd/MM/yyyy", { locale: fr }) : "—"}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          {(tx.status === "PAID" || tx.status === "PARTIAL") && tx.receiptType ? (
                            <QuittanceButton transactionId={tx.id} />
                          ) : tx.receiptUrl ? (
                            <a
                              href={tx.receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-[#151413] underline hover:text-[#6B6760]"
                            >
                              <Download className="size-3" />
                              <span>PDF</span>
                            </a>
                          ) : (
                            <span className="text-[#9E9A90]">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
