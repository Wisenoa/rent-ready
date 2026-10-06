import type { Metadata } from "next";
import { ArrowLeft, Building2, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { StandaloneLeaseForm } from "@/components/standalone-lease-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Créer un bail — RentReady",
};

interface NewLeasePageProps {
  searchParams: Promise<{ propertyId?: string }>;
}

export default async function NewLeasePage({ searchParams }: NewLeasePageProps) {
  const userId = await getAuthenticatedUserId();
  const { propertyId } = await searchParams;

  const [properties, tenants] = await Promise.all([
    prisma.property.findMany({
      where: { userId },
      select: { id: true, name: true, addressLine1: true, city: true },
      orderBy: { name: "asc" },
    }),
    prisma.tenant.findMany({
      where: { userId },
      select: { id: true, firstName: true, lastName: true },
      orderBy: { lastName: "asc" },
    }),
  ]);

  // If no property exists, render a calm empty state rather than a silent redirect
  if (properties.length === 0) {
    return (
      <div className="mx-auto max-w-xl space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/leases">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="size-4 mr-1" />
              Retour aux baux
            </Button>
          </Link>
        </div>

        <div className="rounded-xl border border-dashed p-8 text-center bg-card">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
            <Building2 className="size-7" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight">Aucun bien immobilier enregistré</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
            Pour créer un bail, vous devez d&apos;abord ajouter un logement. Le bail sera ensuite rattaché à ce bien pour suivre les loyers et les quittances.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/properties">
              <Button>
                <Plus className="size-4 mr-2" />
                Ajouter un bien
              </Button>
            </Link>
            <Link href="/leases">
              <Button variant="outline">Retour aux baux</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check if requested propertyId exists in user's properties
  const validatedPropertyId = properties.some((p) => p.id === propertyId) ? propertyId : undefined;

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
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <Link href={validatedPropertyId ? `/properties/${validatedPropertyId}` : "/leases"}>
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" />
            {validatedPropertyId ? "Retour au logement" : "Retour aux baux"}
          </Button>
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Nouveau bail de location</h1>
        <p className="text-sm text-muted-foreground">
          Renseignez les conditions de la location. Les montants et dates serviront à générer les échéances et les quittances.
        </p>
      </div>

      <StandaloneLeaseForm
        properties={propertiesForForm}
        tenants={tenantsForForm}
        initialPropertyId={validatedPropertyId}
      />
    </div>
  );
}
