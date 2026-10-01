import Decimal from "decimal.js";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatPercentage } from "@/lib/format";

export { formatCurrency, formatPercentage };

/**
 * Reduce a Prisma `Decimal` (or null aggregate) to a 2dp number.
 *
 * Prisma returns `Decimal` instances; arithmetic with JavaScript operators
 * coerces them to floats and reintroduces binary floating-point error
 * (e.g. 850.10 - 120.05 => 730.0500000000001). Money is reduced here, once, so
 * downstream display formatting never sees float drift.
 */
const sumMoney = (value: Prisma.Decimal | null | undefined): number =>
  new Decimal(value ?? 0).toDecimalPlaces(2).toNumber();

/**
 * Subtract two already-reduced money values without float drift.
 *
 * `730.05 - 120.05` in JavaScript yields 612.9999999999999; doing it in decimal.js
 * yields exactly 613. Use this for derived money (NOI, margins, balances) instead
 * of the `-` operator.
 */
const subtractMoney = (a: number, b: number): number =>
  new Decimal(a).minus(b).toDecimalPlaces(2).toNumber();

export interface DashboardKPIs {
  properties: {
    total: number;
    withActiveLease: number;
    vacant: number;
    occupancyRate: number;
  };
  tenants: {
    active: number;
    withOpenTickets: number;
  };
  revenue: {
    currentMonth: number;
    previousMonth: number;
    pending: number;
    late: number;
  };
  expenses: {
    currentMonth: number;
    previousMonth: number;
    byCategory: Record<string, number>;
  };
  noi: {
    currentMonth: number;
    previousMonth: number;
    yearToDate: number;
  };
  vacancies: {
    properties: Array<{
      id: string;
      name: string;
      address: string;
      vacantSince: Date | null;
    }>;
    count: number;
  };
  upcomingLeaseExpirations: Array<{
    id: string;
    property: { name: string };
    tenant: { firstName: string; lastName: string };
    endDate: Date;
    daysUntilExpiry: number;
  }>;
  maintenanceTickets: {
    open: number;
    urgent: number;
    avgResolutionDays: number | null;
  };
}

export async function getDashboardStats(userId: string): Promise<DashboardKPIs> {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1,1);
  const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(),0);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const [
    totalProperties,
    propertiesWithActiveLease,
    activeLeases,
    currentMonthRevenue,
    previousMonthRevenue,
    pendingPayments,
    latePayments,
    currentMonthExpenses,
    previousMonthExpenses,
    expensesByCategory,
    yearToDateRevenue,
    yearToDateExpenses,
    vacantProperties,
    upcomingExpirations,
    openTickets,
    urgentTickets,
    resolvedTickets,
    tenantsWithOpenTickets,
  ] = await Promise.all([
    prisma.property.count({ where: { userId } }),

    prisma.property.count({
      where: { userId, leases: { some: { status: "ACTIVE" } } },
    }),

    prisma.lease.findMany({
      where: { userId, status: "ACTIVE" },
      select: {
        id: true,
        tenantId: true,
        propertyId: true,
        endDate: true,
        property: { select: { id: true, name: true, addressLine1: true } },
        tenant: { select: { firstName: true, lastName: true } },
      },
    }),

    prisma.transaction.aggregate({
      where: {
        userId,
        status: "PAID",
        paidAt: { gte: currentMonthStart, lt: now },
      },
      _sum: { amount: true },
    }),

    prisma.transaction.aggregate({
      where: {
        userId,
        status: "PAID",
        paidAt: { gte: previousMonthStart, lt: previousMonthEnd },
      },
      _sum: { amount: true },
    }),

    // Unpaid rent, split by whether it is late.
    //
    // "LATE" is never written as a stored status — a period's lateness is derived
    // from its due date, so querying `status: "LATE"` always returned nothing and
    // arrears were permanently invisible. Deriving here keeps one source of truth.
    prisma.transaction.aggregate({
      where: { userId, paidAt: null, dueDate: { gte: now } },
      _sum: { amount: true },
    }),

    prisma.transaction.aggregate({
      where: { userId, paidAt: null, dueDate: { lt: now } },
      _sum: { amount: true },
    }),

    prisma.expense.aggregate({
      where: {
        userId,
        date: { gte: currentMonthStart, lt: now },
      },
      _sum: { amount: true },
    }),

    prisma.expense.aggregate({
      where: {
        userId,
        date: { gte: previousMonthStart, lt: previousMonthEnd },
      },
      _sum: { amount: true },
    }),

    prisma.expense.groupBy({
      by: ["category"],
      where: {
        userId,
        date: { gte: currentMonthStart, lt: now },
      },
      _sum: { amount: true },
    }),

    prisma.transaction.aggregate({
      where: {
        userId,
        status: "PAID",
        paidAt: { gte: yearStart, lt: now },
      },
      _sum: { amount: true },
    }),

    prisma.expense.aggregate({
      where: {
        userId,
        date: { gte: yearStart, lt: now },
      },
      _sum: { amount: true },
    }),

    prisma.property.findMany({
      where: {
        userId,
        leases: { none: { status: "ACTIVE" } },
      },
      select: {
        id: true,
        name: true,
        addressLine1: true,
        leases: {
          where: { status: { in: ["TERMINATED", "EXPIRED"] } },
          orderBy: { endDate: "desc" },
          take: 1,
          select: { endDate: true },
        },
      },
    }),

    prisma.lease.findMany({
      where: {
        userId,
        status: "ACTIVE",
        endDate: {
          gte: now,
          lte: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
        },
      },
      select: {
        id: true,
        endDate: true,
        property: { select: { name: true } },
        tenant: { select: { firstName: true, lastName: true } },
      },
      orderBy: { endDate: "asc" },
    }),

    prisma.maintenanceTicket.count({
      where: { property: { userId }, status: "OPEN" },
    }),

    prisma.maintenanceTicket.count({
      where: { property: { userId }, status: { in: ["OPEN", "IN_PROGRESS"] }, priority: "URGENT" },
    }),

    prisma.maintenanceTicket.findMany({
      where: {
        property: { userId },
        status: "RESOLVED",
        resolvedAt: { not: null },
      },
      select: {
        createdAt: true,
        resolvedAt: true,
      },
    }),

    prisma.maintenanceTicket.groupBy({
      by: ["tenantId"],
      where: {
        property: { userId },
        status: { in: ["OPEN", "IN_PROGRESS"] },
      },
      _count: { id: true },
    }),
  ]);

  const vacantPropertiesList = vacantProperties.map((p) => ({
    id: p.id,
    name: p.name,
    address: p.addressLine1,
    vacantSince: p.leases[0]?.endDate ?? null,
  }));

  const upcomingLeaseExpirationsList = upcomingExpirations
    .filter((l) => l.endDate !== null)
    .map((l) => ({
      id: l.id,
      property: { name: l.property.name },
      tenant: { firstName: l.tenant.firstName, lastName: l.tenant.lastName },
      endDate: l.endDate!,
      daysUntilExpiry: Math.ceil(
        (l.endDate!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      ),
    }));

  const expenseByCategory: Record<string, number> = {};
  expensesByCategory.forEach((e) => {
    expenseByCategory[e.category] = sumMoney(e._sum.amount);
  });

  const currentMonthRev = sumMoney(currentMonthRevenue._sum.amount);
  const previousMonthRev = sumMoney(previousMonthRevenue._sum.amount);
  const currentMonthExp = sumMoney(currentMonthExpenses._sum.amount);
  const previousMonthExp = sumMoney(previousMonthExpenses._sum.amount);
  const ytdRev = sumMoney(yearToDateRevenue._sum.amount);
  const ytdExp = sumMoney(yearToDateExpenses._sum.amount);

  const activeTenants = new Set(activeLeases.map((l) => l.tenantId));

  let avgResolutionDays: number | null = null;
  const resolvedTicketsWithDates = resolvedTickets.filter(
    (t) => t.resolvedAt !== null
  );
  if (resolvedTicketsWithDates.length > 0) {
    const totalDays = resolvedTicketsWithDates.reduce((sum, t) => {
      const days = Math.ceil(
        (t.resolvedAt!.getTime() - t.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      return sum + days;
    }, 0);
    avgResolutionDays = Math.round(totalDays / resolvedTicketsWithDates.length);
  }

  return {
    properties: {
      total: totalProperties,
      withActiveLease: propertiesWithActiveLease,
      vacant: totalProperties - propertiesWithActiveLease,
      occupancyRate:
        totalProperties > 0
          ? Math.round((propertiesWithActiveLease / totalProperties) * 100)
          : 0,
    },
    tenants: {
      active: activeTenants.size,
      withOpenTickets: tenantsWithOpenTickets.length,
    },
    revenue: {
      currentMonth: currentMonthRev,
      previousMonth: previousMonthRev,
      pending: sumMoney(pendingPayments._sum.amount),
      late: sumMoney(latePayments._sum.amount),
    },
    expenses: {
      currentMonth: currentMonthExp,
      previousMonth: previousMonthExp,
      byCategory: expenseByCategory,
    },
    noi: {
      currentMonth: subtractMoney(currentMonthRev, currentMonthExp),
      previousMonth: subtractMoney(previousMonthRev, previousMonthExp),
      yearToDate: subtractMoney(ytdRev, ytdExp),
    },
    vacancies: {
      properties: vacantPropertiesList,
      count: vacantPropertiesList.length,
    },
    upcomingLeaseExpirations: upcomingLeaseExpirationsList,
    maintenanceTickets: {
      open: openTickets,
      urgent: urgentTickets,
      avgResolutionDays: avgResolutionDays,
    },
  };
}