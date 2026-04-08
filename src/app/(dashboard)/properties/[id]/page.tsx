import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Building2,
  MapPin,
  FileText,
  Wrench,
  Euro,
  Users,
  ArrowLeft,
  Home,
  Calendar,
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

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const property = await prisma.property.findUnique({
    where: { id },
    select: { name: true },
  });
  if (!property) return { title: "Bien non trouvé" };
  return { title: property.name };
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  APARTMENT: "Appartement",
  STUDIO: "Studio",
  HOUSE: "Maison",
  COMMERCIAL: "Local commercial",
  PARKING: "Parking",
  OTHER: "Autre",
};

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

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;
  const userId = await getAuthenticatedUserId();

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      leases: {
        where: { status: { in: ["ACTIVE", "DRAFT"] } },
        include: {
          tenant: true,
          transactions: {
            orderBy: { dueDate: "desc" },
            take: 6,
          },
        },
        orderBy: { startDate: "desc" },
      },
      maintenanceTickets: {
        orderBy: { createdAt: "desc" },
        take: 10,
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
  const draftLeases = property.leases.filter((l) => l.status === "DRAFT");

  // Financial summary from active lease transactions
  const allTx = activeLease?.transactions ?? [];
  const totalPaid = allTx
    .filter((tx) => tx.status === "PAID" || tx.status === "PARTIAL")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalDue = allTx.reduce((sum, tx) => sum + tx.amount, 0);
  const lateCount = allTx.filter((tx) => tx.status === "LATE").length;

  // Maintenance stats
  const openTickets = property.maintenanceTickets.filter(
    (t) => t.status === "OPEN" || t.status === "IN_PROGRESS"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/properties"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground h-9 w-9 shrink-0"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                {property.name}
              </h1>
              <Badge variant="outline" className="text-xs">
                {PROPERTY_TYPE_LABELS[property.type] ?? property.type}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-0.5 flex items-center gap-1">
              <MapPin className="size-3" />
              {property.addressLine1}, {property.postalCode}{" "}
              {property.city}
            </p>
          </div>
        </div>
      </div>

      {/* Property info + Financial summary */}
      <div className="grid gap-4 sm:grid-cols-4">
        {property.surface && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Home className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Surface</p>
                  <p className="text-sm font-semibold">
                    {property.surface} m²
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {property.rooms && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                  <Users className="size-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pièces</p>
                  <p className="text-sm font-semibold">
                    {property.rooms}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {activeLease && (
          <>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
                    <Euro className="size-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Loyer HC
                    </p>
                    <p className="text-sm font-semibold font-mono">
                      {formatCurrency(activeLease.rentAmount)}
                      <span className="text-xs font-normal text-muted-foreground">
                        /mois
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
                    <Wrench className="size-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Tickets ouverts
                    </p>
                    <p className="text-sm font-semibold">{openTickets}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Property details + current lease */}
        <div className="space-y-6">
          {/* Property details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="size-4 text-muted-foreground" />
                Détails du bien
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Adresse</p>
                <p className="text-sm font-medium">
                  {property.addressLine1}
                </p>
                {property.addressLine2 && (
                  <p className="text-sm text-muted-foreground">
                    {property.addressLine2}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  {property.postalCode} {property.city}
                </p>
              </div>

              {property.description && (
                <div>
                  <p className="text-xs text-muted-foreground">
                    Description
                  </p>
                  <p className="text-sm">{property.description}</p>
                </div>
              )}

              {property.cadastralRef && (
                <div>
                  <p className="text-xs text-muted-foreground">
                    Référence cadastrale
                  </p>
                  <p className="text-sm font-mono">{property.cadastralRef}</p>
                </div>
              )}

              {property.taxRef && (
                <div>
                  <p className="text-xs text-muted-foreground">
                    Référence fiscale
                  </p>
                  <p className="text-sm font-mono">{property.taxRef}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active lease */}
          {activeLease ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="size-4 text-muted-foreground" />
                  Bail en cours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Locataire</p>
                  <p className="text-sm font-medium">
                    {activeLease.tenant.firstName}{" "}
                    {activeLease.tenant.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Période</p>
                  <p className="text-sm">
                    Du{" "}
                    {format(new Date(activeLease.startDate), "d MMM yyyy", {
                      locale: fr,
                    })}
                    {activeLease.endDate
                      ? ` au ${format(
                          new Date(activeLease.endDate),
                          "d MMM yyyy",
                          { locale: fr }
                        )}`
                      : " — durée indéterminée"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Loyer + charges
                  </p>
                  <p className="text-sm font-semibold font-mono">
                    {formatCurrency(
                      activeLease.rentAmount + activeLease.chargesAmount
                    )}
                    /mois
                  </p>
                </div>
                <Separator />
                <Link
                  href={`/leases/${activeLease.id}`}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground h-8 px-2 w-full"
                >
                  Voir le bail complet
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="size-4 text-muted-foreground" />
                  Bail en cours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucun bail actif pour ce bien
                </p>
                <Link
                  href="/leases/new"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3 w-full"
                >
                  Créer un bail
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column: Recent transactions + maintenance */}
        <div className="lg:col-span-2 space-y-6">
          {/* Financial summary (if active lease) */}
          {activeLease && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Euro className="size-4 text-muted-foreground" />
                  Aperçu financier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Total perçu
                    </p>
                    <p className="text-sm font-semibold font-mono text-emerald-600">
                      {formatCurrency(totalPaid)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total dû</p>
                    <p className="text-sm font-semibold font-mono">
                      {formatCurrency(totalDue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      En retard
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        lateCount > 0 ? "text-red-600" : ""
                      }`}
                    >
                      {lateCount}
                    </p>
                  </div>
                </div>

                {allTx.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Période</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Payé le</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allTx.map((tx) => {
                        const txStatus =
                          TX_STATUS_CONFIG[tx.status] ??
                          TX_STATUS_CONFIG.PENDING;
                        return (
                          <TableRow key={tx.id}>
                            <TableCell className="text-sm">
                              {format(
                                new Date(tx.periodStart),
                                "MMM yyyy",
                                { locale: fr }
                              )}
                            </TableCell>
                            <TableCell className="font-mono text-sm font-medium">
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
                                ? format(
                                    new Date(tx.paidAt),
                                    "d MMM yyyy",
                                    { locale: fr }
                                  )
                                : "—"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}

          {/* Maintenance tickets */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Wrench className="size-4 text-muted-foreground" />
                Tickets de maintenance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {property.maintenanceTickets.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Aucune demande de maintenance
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Titre</TableHead>
                      <TableHead>Locataire</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {property.maintenanceTickets.map((ticket) => {
                      const statusCfg =
                        MAINTENANCE_STATUS_CONFIG[ticket.status] ??
                        MAINTENANCE_STATUS_CONFIG.OPEN;
                      return (
                        <TableRow key={ticket.id}>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(
                              new Date(ticket.createdAt),
                              "d MMM yyyy",
                              { locale: fr }
                            )}
                          </TableCell>
                          <TableCell className="text-sm font-medium">
                            {ticket.title}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {ticket.tenant.firstName}{" "}
                            {ticket.tenant.lastName}
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
