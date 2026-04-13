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

  return (
    <PropertiesPageClient
      properties={properties}
      tenants={tenants}
    />
  );
}