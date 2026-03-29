import type { Metadata } from "next";
import { Plus, Mail, Phone, Pencil, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import {
  TenantForm,
  DeleteTenantButton,
  type SerializedTenant,
} from "@/components/tenant-form";

export const metadata: Metadata = {
  title: "Locataires",
};

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

export default async function TenantsPage() {
  const userId = await getCurrentUserId();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const tenants = await prisma.tenant.findMany({
    where: { userId },
    include: {
      leases: {
        where: { status: "ACTIVE" },
        include: {
          property: { select: { name: true } },
          transactions: {
            where: {
              periodStart: { lte: monthEnd },
              periodEnd: { gte: monthStart },
            },
            orderBy: { dueDate: "desc" },
            take: 1,
          },
        },
      },
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });

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
        <TenantForm>
          <Button>
            <Plus className="size-4 mr-2" />
            Ajouter un locataire
          </Button>
        </TenantForm>
      </div>

      {tenants.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="size-12 text-muted-foreground/50 mb-4" />
          <h2 className="text-lg font-medium">Aucun locataire</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-sm">
            Commencez par ajouter votre premier locataire pour gérer vos
            locations.
          </p>
          <TenantForm>
            <Button>
              <Plus className="size-4 mr-2" />
              Ajouter un locataire
            </Button>
          </TenantForm>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {tenants.map((tenant) => {
            const activeLease = tenant.leases[0];
            const latestTx = activeLease?.transactions[0];

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
              <Card
                key={tenant.id}
                className="shadow-sm border-border/50 hover:shadow-md transition-shadow"
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
            );
          })}
        </div>
      )}
    </div>
  );
}
