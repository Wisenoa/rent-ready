import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { settlePeriodPayments } from "@/lib/domain/period-settlement";
import { transactionSchema } from "@/lib/validations/transaction";
import { rateLimit, getClientIp, setRateLimitHeaders } from "@/lib/rate-limit";

// ============================================================
// GET /api/transactions — List transactions
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
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: Record<string, unknown> = { userId: session.user.id };
    if (status) where.status = status;
    if (leaseId) where.leaseId = leaseId;
    if (startDate || endDate) {
      where.dueDate = {};
      if (startDate) (where.dueDate as Record<string, unknown>).gte = new Date(startDate);
      if (endDate) (where.dueDate as Record<string, unknown>).lte = new Date(endDate);
    }

    const [transactions, total] = await Promise.all([
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
    ]);

    return NextResponse.json({
      data: transactions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/transactions error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// POST /api/transactions — Record a payment
// Rate limit: 30 payments per authenticated user per hour
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit on authenticated user ID
    const result = await rateLimit(session.user.id, { limit: 30, window: 3600 });
    if (!result.success) {
      const res = NextResponse.json(
        { error: "Trop de paiements enregistrés. Veuillez patienter." },
        { status: 429 }
      );
      setRateLimitHeaders(res, result);
      return res;
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

    // Judge the PERIOD, not this payment. Judging one payment's amount meant a
    // tenant paying rent in instalments was recorded PARTIAL forever, never
    // reached PAID, and was therefore never issued a quittance. The rule lives in
    // one place now (src/lib/domain/period-settlement.ts) rather than being
    // restated in each of the four write paths.
    const paidAt = parsed.data.paidAt ? new Date(parsed.data.paidAt) : new Date();
    const periodStart = new Date(parsed.data.periodStart);
    const periodEnd = new Date(parsed.data.periodEnd);

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

    const transaction = await prisma.transaction.create({
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

    return NextResponse.json({ data: transaction }, { status: 201 });
  } catch (error) {
    console.error("POST /api/transactions error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
