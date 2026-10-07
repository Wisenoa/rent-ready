import type { Metadata } from "next";
import { ArrowLeft, Building2, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { StandaloneLeaseForm } from "@/components/standalone-lease-form";
import { PageShell } from "@/components/design-system";

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

  // Si aucun bien n'existe, afficher un état calme explicite
  if (properties.length === 0) {
    return (
      <PageShell maxWidth="default" className="space-y-6 pb-16">
        <div className="flex items-center gap-4 text-xs text-[#6B6760]">
          <Link
            href="/leases"
            className="inline-flex items-center gap-1.5 hover:text-[#151413] transition-colors group font-medium"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Retour aux baux</span>
          </Link>
        </div>

        <div className="border border-[#151413]/10 bg-[#FAF8F3] p-10 text-center space-y-4 max-w-xl mx-auto">
          <div className="mx-auto flex h-12 w-12 items-center justify-center border border-[#151413]/15 bg-white text-[#151413]">
            <Building2 className="size-5" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-serif text-2xl text-[#151413]">
              Aucun bien immobilier enregistré
            </h2>
            <p className="text-xs text-[#6B6760] leading-relaxed max-w-md mx-auto">
              Pour créer un bail, vous devez d&apos;abord ajouter un logement. Le bail sera ensuite rattaché à ce bien pour suivre les loyers et les quittances.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/properties"
              className="inline-flex items-center justify-center gap-1.5 bg-[#151413] text-[#F8F6F0] hover:bg-[#151413]/90 text-xs font-medium px-4 py-2 transition-colors"
            >
              <Plus className="size-3.5" />
              Ajouter un bien
            </Link>
            <Link
              href="/leases"
              className="inline-flex items-center justify-center text-xs font-medium border border-[#151413]/15 bg-white text-[#151413] hover:bg-[#FAF8F3] px-4 py-2 transition-colors"
            >
              Retour aux baux
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  // Vérifier la validité du propertyId pré-sélectionné
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
    <PageShell maxWidth="default" className="space-y-6 pb-16">
      {/* Navigation de retour */}
      <div className="flex items-center justify-between text-xs text-[#6B6760]">
        <Link
          href={validatedPropertyId ? `/properties/${validatedPropertyId}` : "/leases"}
          className="inline-flex items-center gap-1.5 hover:text-[#151413] transition-colors group font-medium"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>{validatedPropertyId ? "Retour au logement" : "Retour aux baux"}</span>
        </Link>
      </div>

      {/* Entête éditorial de la page */}
      <div className="space-y-1.5 border-b border-[#151413]/10 pb-5">
        <span className="text-[11px] uppercase tracking-wider text-[#6B6760] font-semibold">
          NOUVEAU CONTRAT
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#151413]">
          Établir un bail de location
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6760] max-w-xl">
          Renseignez les conditions de la location. Les montants et dates serviront à générer les échéances et les quittances conformes.
        </p>
      </div>

      <div className="max-w-3xl">
        <StandaloneLeaseForm
          properties={propertiesForForm}
          tenants={tenantsForForm}
          initialPropertyId={validatedPropertyId}
        />
      </div>
    </PageShell>
  );
}
