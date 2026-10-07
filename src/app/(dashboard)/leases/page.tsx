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

  // This crosses the server/client boundary, and a Prisma Decimal serialises to a
  // *string* in RSC props. Convert the money here so the client component receives
  // the numbers its prop types declare.
  const leases = leasesResult.map((lease) => ({
    ...lease,
    rentAmount: lease.rentAmount.toDecimalPlaces(2).toNumber(),
    chargesAmount: lease.chargesAmount.toDecimalPlaces(2).toNumber(),
    depositAmount: lease.depositAmount ? lease.depositAmount.toDecimalPlaces(2).toNumber() : null,
    irlReferenceValue: lease.irlReferenceValue ? lease.irlReferenceValue.toDecimalPlaces(2).toNumber() : null,
    transactions: lease.transactions.map((tx) => ({
      ...tx,
      amount: tx.amount.toDecimalPlaces(2).toNumber(),
      rentPortion: tx.rentPortion.toDecimalPlaces(2).toNumber(),
      chargesPortion: tx.chargesPortion.toDecimalPlaces(2).toNumber(),
    })),
  }));

  return (
    <LeasesPageClient
      leases={leases}
      properties={propertiesResult}
      tenants={tenantsResult}
    />
  );
}
