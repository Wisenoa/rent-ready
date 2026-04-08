import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  FileText,
  Wrench,
  Euro,
  Shield,
  Home,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import {
  TenantForm,
  DeleteTenantButton,
  type SerializedTenant,
} from "@/components/tenant-form";
import { QuittanceButton } from "@/components/quittance-button";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const tenant = await prisma.tenant.findUnique({
    where: { id },
    select: { firstName: true, lastName: true },
  });
  if (!tenant) return { title: "Locataire non trouvé" };
  return { title: `${tenant.firstName} ${tenant.lastName}` };
}

const TX_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING: { label: "En attente", className: "bg-amber-100 text-amber-700" },
  PAID: { label: "Payé", className: "bg-emerald-100 text-emerald-700" },
  PARTIAL: { label: "Partiel", className: "bg-blue-100 text-blue-700" },
  LATE: { label: "En retard", className: "bg-red-100 text-red-700" },
};

const MAINTENANCE_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  OPEN: { label: "Ouvert", className: "bg-amber-100 text-amber-700" },
  IN_PROGRESS: { label: "En cours", className: "bg-blue-100 text-blue-700" },
  RESOLVED: { label: "Résolu", className: "bg-emerald-100 text-emerald-700" },
  CLOSED: { label: "Fermé", className: "bg-gray-100 text-gray-600" },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export default async function TenantDetailPage({ params }: Props) {
  const { id } = await params;
  const userId = await getAuthenticatedUserId();

  const tenant = await prisma.tenant.findUnique({
    where: { id, userId },
    include: {
      leases: {
        include: {
          property: true,
          transactions: {
            orderBy: { dueDate: "desc" },
          },
        },
        orderBy: { startDate: "desc" },
      },
      maintenanceTickets: {
        include: {
          tenant: true,
          property: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!tenant) notFound();

  // Build serialized tenant for form
  const serialized: SerializedTenant = {
    id: tenant.id,
    firstName: tenant.firstName,
    lastName: tenant.lastName,
    email: tenant.email,
    phone: tenant.phone,
    addressLine1: tenant.addressLine1,
    addressLine2: tenant.addressLine2,
    city: tenant.city,
    postalCode: tenant.postalCode,
    dateOfBirth: tenant.dateOfBirth
      ? tenant.dateOfBirth.toISOString().split("T")[0]
      : null,
    placeOfBirth: tenant.placeOfBirth,
    emergencyName: tenant.emergencyName,
    emergencyPhone: tenant.emergencyPhone,
  };

  // All transactions across leases for payment history
  const allTransactions = tenant.leases.flatMap((l) =>
    l.transactions.map((tx) => ({ ...tx, property: l.property }))
  );
  allTransactions.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

  const activeLease = tenant.leases.find((l) => l.status === "ACTIVE") ?? tenant.leases[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/tenants"
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent hover:bg-muted hover:text-foreground size-8"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {tenant.firstName} {tenant.lastName}
          </h1>
          {activeLease && (
            <p className="text-muted-foreground text-sm">
              {activeLease.property.name}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <TenantForm tenant={serialized}>
            <Button variant="outline" size="sm">
              Modifier
            </Button>
          </TenantForm>
          <DeleteTenantButton
            tenantId={tenant.id}
            tenantName={`${tenant.firstName} ${tenant.lastName}`}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: contact + info */}
        <div className="space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="size-4 text-muted-foreground" />
                Informations de contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {tenant.email && (
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-muted-foreground shrink-0" />
                  <a
                    href={`mailto:${tenant.email}`}
                    className="text-blue-600 hover:underline truncate"
                  >
                    {tenant.email}
                  </a>
                </div>
              )}
              {tenant.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-muted-foreground shrink-0" />
                  <a
                    href={`tel:${tenant.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {tenant.phone}
                  </a>
                </div>
              )}
              <div className="flex items-start gap-2">
                <MapPin className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                <span>
                  {tenant.addressLine1}
                  {tenant.addressLine2 && <>, {tenant.addressLine2}</>}
                  <br />
                  {tenant.postalCode} {tenant.city}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Personal Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {tenant.dateOfBirth && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Date de naissance</span>
                  <span>
                    {format(new Date(tenant.dateOfBirth), "d MMMM yyyy", {
                      locale: fr,
                    })}
                  </span>
                </div>
              )}
              {tenant.placeOfBirth && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Lieu de naissance</span>
                  <span>{tenant.placeOfBirth}</span>
                </div>
              )}
              <Separator />
              {tenant.emergencyName && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Contact d'urgence</span>
                    <span>{tenant.emergencyName}</span>
                  </div>
                  {tenant.emergencyPhone && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tél. urgence</span>
                      <a
                        href={`tel:${tenant.emergencyPhone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {tenant.emergencyPhone}
                      </a>
                    </div>
                  )}
                </>
              )}
              {!tenant.emergencyName && (
                <p className="text-muted-foreground text-xs italic">
                  Aucun contact d'urgence renseigné
                </p>
              )}
            </CardContent>
          </Card>

          {/* Active Lease Summary */}
          {activeLease && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="size-4 text-muted-foreground" />
                  Bail en cours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Bien</span>
                  <Link
                    href={`/properties/${activeLease.property.id}`}
                    className="text-blue-600 hover:underline text-right"
                  >
                    {activeLease.property.name}
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Loyer HT</span>
                  <span className="font-mono font-medium">
                    {formatCurrency(activeLease.rentAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Charges</span>
                  <span className="font-mono font-medium">
                    {formatCurrency(activeLease.chargesAmount)}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span className="font-mono">
                    {formatCurrency(activeLease.rentAmount + activeLease.chargesAmount)}
                    <span className="text-muted-foreground font-normal text-xs">/mois</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Entré le</span>
                  <span>
                    {format(new Date(activeLease.startDate), "d MMM yyyy", {
                      locale: fr,
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Link
                    href={`/leases/${activeLease.id}`}
                    className="inline-flex items-center justify-center gap-1 rounded-[min(var(--radius-md),12px)] border border-border bg-background hover:bg-muted hover:text-foreground h-7 px-2.5 text-[0.8rem] flex-1"
                  >
                    <FileText className="size-3 mr-1" />
                    Voir le bail
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column: history */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment History */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Euro className="size-4 text-muted-foreground" />
                Historique des paiements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {allTransactions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Aucun paiement enregistré
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Période</TableHead>
                      <TableHead>Bien</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date paiement</TableHead>
                      <TableHead>Reçu</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allTransactions.map((tx) => {
                      const txStatus =
                        TX_STATUS_CONFIG[tx.status] ?? TX_STATUS_CONFIG.PENDING;
                      return (
                        <TableRow key={tx.id}>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(tx.periodStart), "MMM yyyy", {
                              locale: fr,
                            })}
                          </TableCell>
                          <TableCell className="text-sm">
                            {tx.property.name}
                          </TableCell>
                          <TableCell className="font-mono text-sm font-medium text-right">
                            {formatCurrency(tx.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={txStatus.className}
                            >
                              {txStatus.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {tx.paidAt
                              ? format(new Date(tx.paidAt), "d MMM yyyy", {
                                  locale: fr,
                                })
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

          {/* Maintenance Tickets */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Wrench className="size-4 text-muted-foreground" />
                Tickets de maintenance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tenant.maintenanceTickets.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Aucune demande de maintenance
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Titre</TableHead>
                      <TableHead>Bien</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenant.maintenanceTickets.map((ticket) => {
                      const statusCfg =
                        MAINTENANCE_STATUS_CONFIG[ticket.status] ??
                        MAINTENANCE_STATUS_CONFIG.OPEN;
                      return (
                        <TableRow key={ticket.id}>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(ticket.createdAt), "d MMM yyyy", {
                              locale: fr,
                            })}
                          </TableCell>
                          <TableCell className="text-sm font-medium">
                            {ticket.title}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {ticket.property?.name ?? "—"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={statusCfg.className}
                            >
                              {statusCfg.label}
                            </Badge>
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
