"use client";

import Link from "next/link";
import { Plus, FileText, Building2, Users, Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LeaseForm } from "@/components/lease-form";
import { LeasesEmptyState } from "@/components/leases-empty-state";
import { useOnboardingWizard } from "@/components/onboarding-trigger";

const LEASE_TYPE_LABELS: Record<string, string> = {
  UNFURNISHED: "Location vide",
  FURNISHED: "Location meublée",
  COMMERCIAL: "Bail commercial",
  SEASONAL: "Location saisonnière",
};

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "Brouillon", className: "bg-gray-100 text-gray-700 border-gray-200" },
  ACTIVE: { label: "Actif", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  TERMINATED: { label: "Résilié", className: "bg-red-100 text-red-700 border-red-200" },
  EXPIRED: { label: "Expiré", className: "bg-amber-100 text-amber-700 border-amber-200" },
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  TRANSFER: "Virement",
  CHECK: "Chèque",
  CASH: "Espèces",
  DIRECT_DEBIT: "Prélèvement",
  OTHER: "Autre",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
}

interface LeasesPageClientProps {
  leases: Array<{
    id: string;
    status: string;
    rentAmount: number;
    chargesAmount: number;
    leaseType: string;
    paymentMethod: string;
    startDate: Date;
    endDate: Date | null;
    irlReferenceQuarter: string | null;
    property: { id: string; name: string; addressLine1: string; city: string };
    tenant: { id: string; firstName: string; lastName: string };
    transactions: Array<{ status: string; amount: number; dueDate: Date }>;
  }>;
  properties: Array<{ id: string; name: string; addressLine1: string; city: string }>;
  tenants: Array<{ id: string; firstName: string; lastName: string }>;
}

export function LeasesPageClient({ leases, properties, tenants }: LeasesPageClientProps) {
  const { startWizard } = useOnboardingWizard();

  const propertiesForForm = properties.map((p) => ({
    id: p.id,
    name: p.name,
    addressLine1: p.addressLine1,
    city: p.city,
  }));

  const tenantsForForm = tenants.map((t) => ({
    id: t.id,
    firstName: t.firstName,
    lastName: t.lastName,
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mes Baux</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos baux de location et suivez leur statut
          </p>
        </div>
        <LeaseForm properties={propertiesForForm} tenants={tenantsForForm}>
          <Button>
            <Plus className="size-4 mr-2" />
            Créer un bail
          </Button>
        </LeaseForm>
      </div>

      {leases.length === 0 ? (
        <LeasesEmptyState onStartWizard={startWizard} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {leases.map((lease) => {
            const status = STATUS_CONFIG[lease.status] ?? STATUS_CONFIG.DRAFT;
            const lastTx = lease.transactions[0];

            return (
              <Link
                key={lease.id}
                href={`/leases/${lease.id}`}
                className="block"
              >
              <Card
                className="shadow-sm border-border/50 hover:shadow-md transition-shadow h-full"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="size-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {lease.property.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {lease.tenant.firstName} {lease.tenant.lastName}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={status.className}>
                      {status.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Building2 className="size-3" />
                        Bien
                      </p>
                      <p className="text-sm font-medium truncate">
                        {lease.property.addressLine1}, {lease.property.city}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="size-3" />
                        Locataire
                      </p>
                      <p className="text-sm font-medium">
                        {lease.tenant.firstName} {lease.tenant.lastName}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Loyer HC</p>
                      <p className="text-sm font-semibold font-mono">
                        {formatCurrency(lease.rentAmount)}/mois
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Charges</p>
                      <p className="text-sm font-mono">
                        {formatCurrency(lease.chargesAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="size-3.5" />
                      <span className="text-xs">
                        Du{" "}
                        {format(new Date(lease.startDate), "d MMM yyyy", {
                          locale: fr,
                        })}
                        {lease.endDate
                          ? ` au ${format(new Date(lease.endDate), "d MMM yyyy", {
                              locale: fr,
                            })}`
                          : " — durée indéterminée"}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {LEASE_TYPE_LABELS[lease.leaseType] ?? lease.leaseType}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {PAYMENT_METHOD_LABELS[lease.paymentMethod] ?? lease.paymentMethod}
                      </Badge>
                      {lease.irlReferenceQuarter && (
                        <Badge variant="outline" className="text-xs">
                          IRL {lease.irlReferenceQuarter}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {lastTx && (
                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                      <div>
                        <p className="text-xs text-muted-foreground">Dernier paiement</p>
                        <p className="text-xs">
                          {format(new Date(lastTx.dueDate), "MMM yyyy", { locale: fr })} —{" "}
                          <span
                            className={
                              lastTx.status === "PAID"
                                ? "text-emerald-600"
                                : lastTx.status === "LATE"
                                  ? "text-red-600"
                                  : ""
                            }
                          >
                            {formatCurrency(lastTx.amount)}
                          </span>
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          lastTx.status === "PAID"
                            ? "bg-emerald-100 text-emerald-700"
                            : lastTx.status === "LATE"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                        }
                      >
                        {lastTx.status === "PAID"
                          ? "Payé"
                          : lastTx.status === "LATE"
                            ? "En retard"
                            : "En attente"}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}