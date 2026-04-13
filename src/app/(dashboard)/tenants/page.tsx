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

  // Serialize dates for client component
  const tenantsSerialized = tenantsResult.map((t) => ({
    ...t,
    dateOfBirth: t.dateOfBirth,
    leases: t.leases.map((l) => ({
      ...l,
      transactions: l.transactions,
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
