import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/auth";
import { LeasesPageClient } from "./LeasesPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Baux",
};

export default async function LeasesPage() {
  const userId = await getAuthenticatedUserId();

  const [leasesResult, propertiesResult, tenantsResult] = await Promise.all([
    prisma.lease.findMany({
      where: { userId },
      include: {
        property: { select: { id: true, name: true, addressLine1: true, city: true } },
        tenant: { select: { id: true, firstName: true, lastName: true } },
        transactions: {
          where: { status: { in: ["PAID", "PENDING", "LATE"] } },
          orderBy: { dueDate: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    }),
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

  return (
    <LeasesPageClient
      leases={leasesResult}
      properties={propertiesResult}
      tenants={tenantsResult}
    />
  );
}
