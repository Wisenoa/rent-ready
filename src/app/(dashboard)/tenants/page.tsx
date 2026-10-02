import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/auth";
import { TenantsPageClient } from "./TenantsPageClient";

export const metadata: Metadata = {
  title: "Locataires",
};

export default async function TenantsPage() {
  const userId = await getAuthenticatedUserId();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const [tenantsResult, paidTransactionsResult, propertiesResult] = await Promise.all([
    prisma.tenant.findMany({
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
    }),
    prisma.transaction.findMany({
      where: {
        userId,
        status: { in: ["PAID", "PARTIAL"] },
        receiptUrl: { not: null },
      },
      select: {
        id: true,
        amount: true,
        paidAt: true,
        periodStart: true,
        periodEnd: true,
        receiptUrl: true,
        receiptNumber: true,
        lease: {
          select: {
            id: true,
            tenantId: true,
            property: { select: { name: true } },
          },
        },
      },
      orderBy: { paidAt: "desc" },
      take: 50,
    }),
    prisma.property.findMany({
      where: { userId },
      select: { id: true, name: true, addressLine1: true, city: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const tenantsForLeaseForm = tenantsResult.map((t) => ({
    id: t.id,
    firstName: t.firstName,
    lastName: t.lastName,
  }));

  // Convert money for the client boundary. A Prisma Decimal serialises to a
  // *string* in RSC props, so the client component would receive "740.50" where
  // its prop type says number. The previous mapping copied transactions through
  // unchanged, so it did not serialize anything.
  const tenantsSerialized = tenantsResult.map((t) => ({
    ...t,
    dateOfBirth: t.dateOfBirth,
    leases: t.leases.map((l) => ({
      ...l,
      rentAmount: l.rentAmount.toDecimalPlaces(2).toNumber(),
      chargesAmount: l.chargesAmount.toDecimalPlaces(2).toNumber(),
      transactions: l.transactions.map((tx) => ({
        ...tx,
        amount: tx.amount.toDecimalPlaces(2).toNumber(),
        rentPortion: tx.rentPortion.toDecimalPlaces(2).toNumber(),
        chargesPortion: tx.chargesPortion.toDecimalPlaces(2).toNumber(),
      })),
    })),
  }));

  return (
    <TenantsPageClient
      tenantsResult={tenantsSerialized}
      paidTransactions={paidTransactionsResult}
      properties={propertiesResult}
    />
  );
}
