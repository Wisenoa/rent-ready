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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LeaseEditDialog } from "@/components/lease-edit-dialog";
import { QuittanceButton } from "@/components/quittance-button";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const lease = await prisma.lease.findUnique({
    where: { id },
    select: { property: { select: { name: true } }, tenant: { select: { firstName: true, lastName: true } } },
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

const LEASE_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "Brouillon", className: "bg-slate-100 text-slate-700 border-slate-200" },
  ACTIVE: { label: "Actif", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  TERMINATED: { label: "Résilié", className: "bg-gray-100 text-gray-600 border-gray-200" },
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  TRANSFER: "Virement bancaire",
  CHECK: "Chèque",
  CASH: "Espèces",
  DIRECT_DEBIT: "Prélèvement automatique",
  OTHER: "Autre",
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

  // Payment position for this lease, derived from the due dates.
  //
  // This used to sum `amount` across transactions as "total due" (which is the
  // money received, not what was owed) and counted `status === "LATE"`, which
  // nothing ever writes. None of it was rendered; arrears were simply invisible on
  // the page a landlord actually works from.
  const position = summariseLease(lease.transactions);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/leases"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground h-9 w-9 shrink-0"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">{lease.property.name}</h1>
              <Badge variant="outline" className={statusCfg.className}>
                {statusCfg.label}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-0.5">
              Bail avec {lease.tenant.firstName} {lease.tenant.lastName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lease.documentUrl && (
            <a
              href={lease.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors"
            >
              <Download className="size-3.5" />
              Télécharger le bail
            </a>
          )}
          {lease.status === "ACTIVE" && lease.revisionDate && (
            <Link
              href={`/leases/${lease.id}/revision`}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors"
            >
              <Scale className="size-3.5" />
              Réviser le bail
            </Link>
          )}
          <LeaseEditDialog lease={{
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
          }} />
        </div>
      </div>

      {/* Financial summary */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
                <Euro className="size-4 text-emerald-700" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Loyer HC</p>
                <p className="text-sm font-semibold font-mono">{formatCurrency(Number(lease.rentAmount))}<span className="text-xs font-normal text-muted-foreground">/mois</span></p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                <Home className="size-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Charges</p>
                <p className="text-sm font-semibold font-mono">{formatCurrency(Number(lease.chargesAmount))}<span className="text-xs font-normal text-muted-foreground">/mois</span></p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100">
                <Shield className="size-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Dépôt de garantie</p>
                <p className="text-sm font-semibold font-mono">{formatCurrency(Number(lease.depositAmount))}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
                <CreditCard className="size-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total mensuel</p>
                <p className="text-sm font-semibold font-mono">{formatCurrency(totalMonthly)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Property + Tenant */}
        <div className="space-y-6">
          {/* Property */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="size-4 text-muted-foreground" />
                Bien immobilier
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">{lease.property.name}</p>
                <p className="text-xs text-muted-foreground">
                  {lease.property.addressLine1}<br />
                  {lease.property.postalCode} {lease.property.city}
                </p>
              </div>
              {lease.property.type && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {lease.property.type}
                  </Badge>
                  {lease.property.surface && (
                    <span className="text-xs text-muted-foreground">
                      {lease.property.surface} m²
                    </span>
                  )}
                </div>
              )}
              <Link
                href={`/properties/${lease.property.id}`}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground h-8 px-2 w-full"
              >
                Voir le bien
              </Link>
            </CardContent>
          </Card>

          {/* Tenant */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="size-4 text-muted-foreground" />
                Locataire
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">
                  {lease.tenant.firstName} {lease.tenant.lastName}
                </p>
                {lease.tenant.email && (
                  <a
                    href={`mailto:${lease.tenant.email}`}
                    className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline mt-1"
                  >
                    <Mail className="size-3" />
                    {lease.tenant.email}
                  </a>
                )}
                {lease.tenant.phone && (
                  <a
                    href={`tel:${lease.tenant.phone}`}
                    className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline mt-0.5"
                  >
                    <Phone className="size-3" />
                    {lease.tenant.phone}
                  </a>
                )}
              </div>
              <Link
                href={`/tenants?id=${lease.tenant.id}`}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground h-8 px-2 w-full"
              >
                Voir le locataire
              </Link>
            </CardContent>
          </Card>

          {/* Guarantors */}
          {lease.guarantor && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="size-4 text-muted-foreground" />
                  Garants
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm font-medium">
                  {lease.guarantor.firstName} {lease.guarantor.lastName}
                </p>
                {lease.guarantor.email && (
                  <p className="text-xs text-muted-foreground">{lease.guarantor.email}</p>
                )}
                {lease.guarantor.phone && (
                  <p className="text-xs text-muted-foreground">{lease.guarantor.phone}</p>
                )}
                {lease.guarantor.addressLine1 && (
                  <p className="text-xs text-muted-foreground">{lease.guarantor.addressLine1}</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column: Lease terms + Transactions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lease terms */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="size-4 text-muted-foreground" />
                Conditions du bail
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                <div>
                  <p className="text-xs text-muted-foreground">Type de bail</p>
                  <p className="text-sm font-medium">
                    {LEASE_TYPE_LABELS[lease.leaseType] ?? lease.leaseType}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Méthode de paiement</p>
                  <p className="text-sm font-medium">
                    {PAYMENT_METHOD_LABELS[lease.paymentMethod] ?? lease.paymentMethod}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date de début</p>
                  <p className="text-sm font-medium">
                    {format(new Date(lease.startDate), "d MMMM yyyy", { locale: fr })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date de fin</p>
                  <p className="text-sm font-medium">
                    {lease.endDate
                      ? format(new Date(lease.endDate), "d MMMM yyyy", { locale: fr })
                      : "Durée indéterminée"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Jour de paiement</p>
                  <p className="text-sm font-medium">Le {lease.paymentDay} du mois</p>
                </div>
                {lease.revisionDate && (
                  <div>
                    <p className="text-xs text-muted-foreground">Date de révision IRL</p>
                    <p className="text-sm font-medium">
                      {format(new Date(lease.revisionDate), "d MMMM yyyy", { locale: fr })}
                    </p>
                  </div>
                )}
                {lease.irlReferenceQuarter && (
                  <div>
                    <p className="text-xs text-muted-foreground">IRL de référence</p>
                    <p className="text-sm font-medium">
                      IRL {lease.irlReferenceQuarter}
                      {lease.irlReferenceValue && ` — ${lease.irlReferenceValue}`}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Dépôt de garantie</p>
                  <p className="text-sm font-medium">{formatCurrency(Number(lease.depositAmount))}</p>
                </div>
              </div>

              {lease.documentUrl && (
                <>
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="size-4 text-muted-foreground" />
                      <span>Bail téléchargé</span>
                    </div>
                    <a
                      href={lease.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Download className="size-3" />
                      Télécharger
                    </a>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Arrears callout — the reason a landlord opens this page */}
          {position.overdueCount > 0 && (
            <div
              role="status"
              className="flex flex-wrap items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
              <span>
                <strong className="font-semibold">
                  {formatCurrency(position.overdueAmount)}
                </strong>{" "}
                impayés sur {position.overdueCount} mois
                {position.overdueCount > 1 ? "" : ""} — le plus ancien a{" "}
                {position.oldestOverdueDays} jours de retard.
              </span>
              <Link
                href="/billing"
                className="ml-auto shrink-0 font-medium underline"
              >
                Enregistrer un paiement
              </Link>
            </div>
          )}

{/* Payment history */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  Historique des paiements
                </CardTitle>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(position.collected)}
                    </span>{" "}
                    perçu
                  </span>
                  <span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(position.outstanding)}
                    </span>{" "}
                    dû
                  </span>
                  {position.overdueCount > 0 && (
                    <span className="font-medium text-red-600">
                      {formatCurrency(position.overdueAmount)} en retard (
                      {position.oldestOverdueDays} j)
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {lease.transactions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Aucun paiement enregistré
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Période</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date paiement</TableHead>
                      <TableHead>Reçu</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lease.transactions.map((tx) => {
                      const txStatus = presentTransaction(tx);
                      return (
                        <TableRow key={tx.id}>
                          <TableCell className="text-sm">
                            {format(new Date(tx.periodStart), "MMM yyyy", { locale: fr })}
                          </TableCell>
                          <TableCell className="font-mono text-sm font-medium">
                            {formatCurrency(tx.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={txStatus.className}>
                              {txStatus.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {tx.paidAt
                              ? format(new Date(tx.paidAt), "d MMM yyyy", { locale: fr })
                              : "—"}
                          </TableCell>
                          <TableCell>
                            {(tx.status === "PAID" || tx.status === "PARTIAL") && tx.receiptType ? (
                              <QuittanceButton transactionId={tx.id} />
                            ) : tx.receiptUrl ? (
                              <a
                                href={tx.receiptUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                              >
                                <Download className="size-3" />
                                Télécharger
                              </a>
                            ) : null}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
