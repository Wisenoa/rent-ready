"use client";

import Link from "next/link";
import { Plus, Mail, Phone, Pencil, FileText, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  TenantForm,
  DeleteTenantButton,
  type SerializedTenant,
} from "@/components/tenant-form";
import { LeaseForm } from "@/components/lease-form";
import { TenantsEmptyState } from "@/components/tenants-empty-state";
import { useOnboardingWizard } from "@/components/onboarding-trigger";

type PaymentStatus = "paid" | "pending" | "late" | "none";

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

function getPaymentBadge(status: PaymentStatus) {
  switch (status) {
    case "paid":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs">
          À jour
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-xs">
          En attente
        </Badge>
      );
    case "late":
      return (
        <Badge variant="destructive" className="text-xs">
          En retard
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-xs">
          Sans bail
        </Badge>
      );
  }
}

interface TenantsPageClientProps {
  tenantsResult: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string | null;
    addressLine1: string | null;
    addressLine2: string | null;
    city: string | null;
    postalCode: string | null;
    dateOfBirth: Date | null;
    placeOfBirth: string | null;
    emergencyName: string | null;
    emergencyPhone: string | null;
    leases: Array<{
      property: { name: string };
      transactions: Array<{
        status: string;
      }>;
    }>;
  }>;
  paidTransactions: Array<{
    lease?: { tenantId: string };
    receiptUrl: string | null;
  }>;
  properties: Array<{ id: string; name: string; addressLine1: string; city: string }>;
}

export function TenantsPageClient({
  tenantsResult,
  paidTransactions,
  properties,
}: TenantsPageClientProps) {
  const { startWizard } = useOnboardingWizard();

  const tenants = tenantsResult;
  const tenantsForLeaseForm = tenants.map((t) => ({
    id: t.id,
    firstName: t.firstName,
    lastName: t.lastName,
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Mes Locataires
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos locataires et suivez leurs paiements
          </p>
        </div>
        <div className="flex items-center gap-2">
          <LeaseForm properties={properties} tenants={tenantsForLeaseForm}>
            <Button variant="outline">
              <FileText className="size-4 mr-2" />
              Créer un bail
            </Button>
          </LeaseForm>
          <TenantForm>
            <Button>
              <Plus className="size-4 mr-2" />
              Ajouter un locataire
            </Button>
          </TenantForm>
        </div>
      </div>

      {tenants.length === 0 ? (
        <TenantsEmptyState onStartWizard={startWizard} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {tenants.map((tenant) => {
            const activeLease = tenant.leases[0];
            const latestTx = activeLease?.transactions[0];
            // Find latest paid transaction with receipt for this tenant
            const latestReceipt = paidTransactions.find(
              (tx) => tx.lease?.tenantId === tenant.id
            );

            let paymentStatus: PaymentStatus = "none";
            if (activeLease) {
              if (!latestTx) {
                paymentStatus = "pending";
              } else if (latestTx.status === "PAID") {
                paymentStatus = "paid";
              } else if (latestTx.status === "LATE") {
                paymentStatus = "late";
              } else {
                paymentStatus = "pending";
              }
            }

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

            return (
              <Link
                key={tenant.id}
                href={`/tenants/${tenant.id}`}
                className="block"
                onClick={(e) => {
                  // Don't navigate if clicking action buttons
                  const target = e.target as HTMLElement;
                  if (
                    target.closest("button") ||
                    target.closest('[role="button"]') ||
                    target.closest("a")
                  ) {
                    e.preventDefault();
                  }
                }}
              >
              <Card
                className="shadow-sm border-border/50 hover:shadow-md transition-shadow h-full"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-11 w-11">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {getInitials(tenant.firstName, tenant.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-base truncate">
                          {tenant.firstName} {tenant.lastName}
                        </CardTitle>
                        {getPaymentBadge(paymentStatus)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5 truncate">
                        {activeLease?.property.name ?? "Aucun bien associé"}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {tenant.email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="size-3.5 shrink-0" />
                        <span className="truncate">{tenant.email}</span>
                      </div>
                    )}
                    {tenant.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="size-3.5 shrink-0" />
                        <span>{tenant.phone}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/30">
                    <div>
                      {activeLease ? (
                        <>
                          <p className="text-xs text-muted-foreground">
                            Loyer + charges
                          </p>
                          <p className="text-sm font-semibold font-mono">
                            {(
                              activeLease.rentAmount +
                              activeLease.chargesAmount
                            ).toLocaleString("fr-FR")}{" "}
                            €/mois
                          </p>
                        </>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Aucun bail actif
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {latestReceipt?.receiptUrl && (
                        <a
                          href={latestReceipt.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                        >
                          <Download className="size-3" />
                          Quittance
                        </a>
                      )}
                      <TenantForm tenant={serialized}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="size-4" />
                        </Button>
                      </TenantForm>
                      <DeleteTenantButton
                        tenantId={tenant.id}
                        tenantName={`${tenant.firstName} ${tenant.lastName}`}
                      />
                    </div>
                  </div>
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