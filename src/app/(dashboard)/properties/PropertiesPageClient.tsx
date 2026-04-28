"use client";

import Link from "next/link";
import { Building2, MapPin, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PropertyForm } from "@/components/property-form";
import { PropertyActions } from "@/components/property-actions";
import { LeaseForm } from "@/components/lease-form";
import { FileText } from "lucide-react";
import { PropertiesEmptyState } from "@/components/properties-empty-state";
import { useOnboardingWizard } from "@/components/onboarding-trigger";

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

interface PropertiesPageClientProps {
  properties: Array<{
    id: string;
    name: string;
    addressLine1: string;
    postalCode: string;
    city: string;
    type: string;
    surface: number | null;
    rooms: number | null;
    leases: Array<{
      rentAmount: number;
      chargesAmount: number;
      tenant: { firstName: string; lastName: string };
    }>;
  }>;
  tenants: Array<{ id: string; firstName: string; lastName: string }>;
}

export function PropertiesPageClient({ properties, tenants }: PropertiesPageClientProps) {
  const { startWizard } = useOnboardingWizard();

  const propertiesForLeaseForm = properties.map((p) => ({
    id: p.id,
    name: p.name,
    addressLine1: p.addressLine1,
    city: p.city,
  }));

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
        <div className="flex flex-wrap items-center gap-2">
          <LeaseForm properties={propertiesForLeaseForm} tenants={tenants}>
            <Button variant="outline">
              <FileText className="size-4 mr-2" />
              Créer un bail
            </Button>
          </LeaseForm>
          <PropertyForm
            trigger={
              <Button>
                <Plus className="size-4 mr-2" />
                Ajouter un bien
              </Button>
            }
          />
        </div>
      </div>

      {/* Empty state */}
      {properties.length === 0 ? (
        <PropertiesEmptyState onStartWizard={startWizard} />
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
              <Link
                key={property.id}
                href={`/properties/${property.id}`}
                className="block"
              >
              <Card
                className="shadow-sm border-border/50 hover:shadow-md transition-shadow h-full"
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
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}