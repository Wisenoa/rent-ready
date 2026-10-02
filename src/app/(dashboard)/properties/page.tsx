import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/auth";
import { PropertiesPageClient } from "./PropertiesPageClient";

export const metadata: Metadata = {
  title: "Mes Biens",
};

export default async function PropertiesPage() {
  const userId = await getAuthenticatedUserId();

  const [properties, tenants] = await Promise.all([
    prisma.property.findMany({
      where: { userId },
      include: {
        leases: {
          where: { status: "ACTIVE" },
          include: { tenant: true },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.tenant.findMany({
      where: { userId },
      select: { id: true, firstName: true, lastName: true },
      orderBy: { lastName: "asc" },
    }),
  ]);

  // Convert money at the client boundary: a Prisma Decimal serialises to a string
  // in RSC props, and this client's prop type declares number.
  const propertiesForClient = properties.map((property) => ({
    ...property,
    leases: property.leases.map((lease) => ({
      ...lease,
      rentAmount: lease.rentAmount.toDecimalPlaces(2).toNumber(),
      chargesAmount: lease.chargesAmount.toDecimalPlaces(2).toNumber(),
    })),
  }));

  return (
    <PropertiesPageClient
      properties={propertiesForClient}
      tenants={tenants}
    />
  );
}