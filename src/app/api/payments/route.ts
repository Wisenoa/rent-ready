import { NextRequest, NextResponse } from "next/server";
import Decimal from "decimal.js";
import type { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { settlePeriodPayments } from "@/lib/domain/period-settlement";
import { transactionSchema } from "@/lib/validations/transaction";
import {
  findUnpaidPeriod,
  settleRentPeriod,
} from "@/lib/domain/generate-rent-periods";

// ============================================================
// GET /api/payments — List payments
//
// Query params:
//   leaseId    string   (optional) filter by lease
//   propertyId string   (optional) filter by property
//   tenantId   string   (optional) filter by tenant
//   status     string   (optional) filter by PAID, PARTIAL, PENDING, LATE, CANCELLED
//   startDate  string   (optional) filter from date
//   endDate    string   (optional) filter to date
//   page       number   (optional, default: 1)
//   limit      number   (optional, default: 50, max: 100)
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10)));
    const skip = (page - 1) * limit;
    const status = searchParams.get("status");
    const leaseId = searchParams.get("leaseId");
    const propertyId = searchParams.get("propertyId");
    const tenantId = searchParams.get("tenantId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: Record<string, unknown> = { userId: session.user.id };
    if (status) where.status = status;
    if (leaseId) where.leaseId = leaseId;
    if (propertyId) where.lease = { propertyId };
    if (tenantId) where.lease = { ...((where.lease as Record<string, unknown>) ?? {}), tenantId };
    if (startDate || endDate) {
      where.dueDate = {};
      if (startDate) (where.dueDate as Record<string, unknown>).gte = new Date(startDate);
      if (endDate) (where.dueDate as Record<string, unknown>).lte = new Date(endDate);
    }

    const [payments, total, summaryResult] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          lease: {
            select: {
              id: true,
              rentAmount: true,
              chargesAmount: true,
              property: { select: { id: true, name: true, city: true } },
              tenant: { select: { id: true, firstName: true, lastName: true } },
            },
          },
        },
        orderBy: { dueDate: "desc" },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
      // Summary: total collected + outstanding count (always computed, ignores filters)
      (async () => {
        const baseWhere = { userId: session.user.id };
        const [paid, pending, overdue] = await Promise.all([
          prisma.transaction.aggregate({
            where: { ...baseWhere, status: { in: ["PAID", "PARTIAL"] } },
            _sum: { amount: true },
            _count: true,
          }),
          // Lateness is derived from the due date: nothing writes a LATE status, so
          // these counters were permanently zero and arrears looked settled.
          prisma.transaction.aggregate({
            where: { ...baseWhere, paidAt: null, dueDate: { gte: new Date() } },
            _sum: { amount: true },
            _count: true,
          }),
          prisma.transaction.aggregate({
            where: { ...baseWhere, paidAt: null, dueDate: { lt: new Date() } },
            _sum: { amount: true },
            _count: true,
          }),
        ]);
        return {
          totalCollected: paid._sum.amount ?? 0,
          totalCollectedCount: paid._count,
          totalPending: pending._sum.amount ?? 0,
          totalPendingCount: pending._count,
          totalOverdue: overdue._sum.amount ?? 0,
          totalOverdueCount: overdue._count,
        };
      })(),
    ]);

    // Prisma returns `Decimal` aggregates. Coercing them with `Math.round(x * 100)`
    // performs binary floating-point arithmetic on money (850.1 * 100 = 85009.99…),
    // so the totals can be off by a cent. Reduce with decimal.js instead.
    const money = (value: Prisma.Decimal | Decimal | number | null | undefined) =>
      new Decimal(value ?? 0).toDecimalPlaces(2).toNumber();

    return NextResponse.json({
      data: payments,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      summary: {
        collected: money(summaryResult.totalCollected),
        collectedCount: summaryResult.totalCollectedCount,
        pending: money(summaryResult.totalPending),
        pendingCount: summaryResult.totalPendingCount,
        overdue: money(summaryResult.totalOverdue),
        overdueCount: summaryResult.totalOverdueCount,
        currency: "EUR",
      },
    });
  } catch (error) {
    console.error("GET /api/payments error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// POST /api/payments — Record a payment
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = transactionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    // Verify lease ownership
    const lease = await prisma.lease.findUnique({ where: { id: parsed.data.leaseId } });
    if (!lease || lease.userId !== session.user.id) {
      return NextResponse.json({ error: "Bail introuvable ou accès non autorisé" }, { status: 404 });
    }

    const periodStart = new Date(parsed.data.periodStart);
    const periodEnd = new Date(parsed.data.periodEnd);
    const paidAt = parsed.data.paidAt ? new Date(parsed.data.paidAt) : new Date();

    // Judge the PERIOD, not this payment. See
    // src/lib/domain/period-settlement.ts: judging one payment's amount left a
    // tenant who paid in instalments permanently PARTIAL and never issued a
    // quittance.
    const priorPayments = await prisma.transaction.findMany({
      where: { leaseId: lease.id, periodStart, periodEnd, paidAt: { not: null } },
      select: { amount: true, paidAt: true, createdAt: true },
    });

    const settlement = settlePeriodPayments({
      rentAmount: lease.rentAmount,
      chargesAmount: lease.chargesAmount,
      payments: [
        ...priorPayments.map((row) => ({
          amount: row.amount,
          paidAt: row.paidAt,
          createdAt: row.createdAt,
        })),
        { amount: parsed.data.amount, paidAt, createdAt: new Date() },
      ],
      currentAmount: parsed.data.amount,
    });

    const { rentPortion, chargesPortion, isFullPayment } = settlement;
    const receiptType = settlement.receiptType;
    const status = settlement.status;

    // If a rent period was generated for this month, the payment SETTLES it rather
    // than creating a second row. Two rows for one month meant the period was
    // counted twice: once as owed (PENDING) and once as paid.
    const period = await findUnpaidPeriod(parsed.data.leaseId, periodStart);
    if (period) {
      const settled = await settleRentPeriod(period.id, {
        amount: parsed.data.amount,
        rentPortion,
        chargesPortion,
        paidAt,
        ...(parsed.data.paymentMethod
          ? { paymentMethod: parsed.data.paymentMethod }
          : {}),
        status,
        isFullPayment,
      });

      if (settled) {
        const updated = await prisma.transaction.findUniqueOrThrow({
          where: { id: period.id },
          include: {
            lease: {
              select: {
                property: { select: { name: true, city: true } },
                tenant: { select: { firstName: true, lastName: true } },
              },
            },
          },
        });
        return NextResponse.json({ data: updated }, { status: 201 });
      }
      // Another request settled it concurrently; fall through and record it
      // separately so the money received is never lost.
    }

    const payment = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        leaseId: parsed.data.leaseId,
        amount: parsed.data.amount,
        rentPortion,
        chargesPortion,
        periodStart,
        periodEnd,
        dueDate: new Date(parsed.data.dueDate),
        paidAt,
        paymentMethod: parsed.data.paymentMethod ?? null,
        status,
        isFullPayment,
        receiptType,
        notes: parsed.data.notes || null,
      },
      include: {
        lease: {
          select: {
            property: { select: { name: true, city: true } },
            tenant: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });

    return NextResponse.json({ data: payment }, { status: 201 });
  } catch (error) {
    console.error("POST /api/payments error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
