import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { StandaloneLeaseForm } from "@/components/standalone-lease-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Créer un bail",
};

export default async function NewLeasePage() {
  const userId = await getAuthenticatedUserId();

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

  // Only redirect if NEITHER properties NOR tenants exist — we can still create
  // a partial lease with just one of them
  if (properties.length === 0 && tenants.length === 0) {
    redirect("/leases");
  }

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
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/leases">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="size-4 mr-1" />
            Retour aux baux
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Créer un bail</h1>
        <p className="text-muted-foreground mt-1">
          Renseignez les informations du bail de location.
        </p>
      </div>

      <StandaloneLeaseForm properties={propertiesForForm} tenants={tenantsForForm} />
    </div>
  );
}
