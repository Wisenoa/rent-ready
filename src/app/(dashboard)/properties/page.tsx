import { Metadata } from "next";
import { Building2, Home, MapPin, Plus } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PropertyForm } from "@/components/property-form";
import { PropertyActions } from "@/components/property-actions";

export const metadata: Metadata = {
  title: "Mes Biens",
};

const TYPE_LABELS: Record<string, string> = {
  APARTMENT: "Appartement",
  STUDIO: "Studio",
  HOUSE: "Maison",
  COMMERCIAL: "Local commercial",
  PARKING: "Parking",
  OTHER: "Autre",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function PropertiesPage() {
  const userId = await getCurrentUserId();

  const properties = await prisma.property.findMany({
    where: { userId },
    include: {
      leases: {
        where: { status: "ACTIVE" },
        include: { tenant: true },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mes Biens</h1>
          <p className="text-muted-foreground mt-1">
            Gérez votre patrimoine immobilier
          </p>
        </div>
        <PropertyForm
          trigger={
            <Button>
              <Plus className="size-4 mr-2" />
              Ajouter un bien
            </Button>
          }
        />
      </div>

      {/* Empty state */}
      {properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
            <Home className="size-7 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">Aucun bien</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm text-center">
            Commencez par ajouter votre premier bien immobilier pour gérer vos
            locations.
          </p>
          <PropertyForm
            trigger={
              <Button>
                <Plus className="size-4 mr-2" />
                Ajouter un bien
              </Button>
            }
          />
        </div>
      ) : (
        /* Property grid */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => {
            const activeLease = property.leases[0];
            const tenant = activeLease?.tenant;
            const totalRent = activeLease
              ? activeLease.rentAmount + activeLease.chargesAmount
              : null;

            return (
              <Card
                key={property.id}
                className="shadow-sm border-border/50 hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Building2 className="size-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {property.name}
                        </CardTitle>
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <MapPin className="size-3" />
                          {property.addressLine1}, {property.postalCode}{" "}
                          {property.city}
                        </div>
                      </div>
                    </div>
                    <PropertyActions property={property} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {TYPE_LABELS[property.type] ?? property.type}
                    </Badge>
                    {property.surface != null && property.surface > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {property.surface} m²
                      </Badge>
                    )}
                    {property.rooms != null && property.rooms > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {property.rooms} pièce
                        {property.rooms > 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border/30">
                    {totalRent != null ? (
                      <>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Loyer + charges
                          </p>
                          <p className="text-sm font-semibold font-mono">
                            {formatCurrency(totalRent)}/mois
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Locataire
                          </p>
                          <p className="text-sm">
                            {tenant?.firstName} {tenant?.lastName}
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">
                        Aucun bail actif
                      </p>
                    )}
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
