import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { transactionSchema } from "@/lib/validations/transaction";
import { determineReceiptType, computePaymentSplit } from "@/lib/payment-utils";

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
          prisma.transaction.aggregate({
            where: { ...baseWhere, status: "PENDING" },
            _sum: { amount: true },
            _count: true,
          }),
          prisma.transaction.aggregate({
            where: { ...baseWhere, status: "LATE" },
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

    return NextResponse.json({
      data: payments,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      summary: {
        collected: Math.round((summaryResult.totalCollected ?? 0) * 100) / 100,
        collectedCount: summaryResult.totalCollectedCount,
        pending: Math.round((summaryResult.totalPending ?? 0) * 100) / 100,
        pendingCount: summaryResult.totalPendingCount,
        overdue: Math.round((summaryResult.totalOverdue ?? 0) * 100) / 100,
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

    const { rentPortion, chargesPortion, isFullPayment } = computePaymentSplit(
      parsed.data.amount,
      lease.rentAmount,
      lease.chargesAmount,
    );
    const receiptType = determineReceiptType(parsed.data.amount, lease.rentAmount, lease.chargesAmount);

    const status = isFullPayment ? "PAID" : "PARTIAL";

    const payment = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        leaseId: parsed.data.leaseId,
        amount: parsed.data.amount,
        rentPortion,
        chargesPortion,
        periodStart: new Date(parsed.data.periodStart),
        periodEnd: new Date(parsed.data.periodEnd),
        dueDate: new Date(parsed.data.dueDate),
        paidAt: parsed.data.paidAt ? new Date(parsed.data.paidAt) : new Date(),
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
