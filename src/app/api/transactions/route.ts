import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { transactionSchema } from "@/lib/validations/transaction";
import { recordRentPayment } from "@/lib/services/rent-payments";
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

    // This route used to insert a receipt row directly, without resolving the
    // period or closing it. So when the month's period already existed as
    // PENDING (money owed to the landlord), the POST added a receipt WITHOUT
    // closing the period: the month was then counted twice, once as owed and
    // once as received, and the dashboard showed « 970,55 EUR de reste du » for a
    // month that had been paid.
    //
    // It now goes through the same door as the payment form, so a month is
    // either still owed or closed, never both.
    const recorded = await recordRentPayment({
      userId: session.user.id,
      leaseId: parsed.data.leaseId,
      duePeriodId: parsed.data.duePeriodId || null,
      periodStart: new Date(parsed.data.periodStart),
      periodEnd: new Date(parsed.data.periodEnd),
      dueDate: new Date(parsed.data.dueDate),
      amount: parsed.data.amount,
      paidAt: parsed.data.paidAt ? new Date(parsed.data.paidAt) : new Date(),
      paymentMethod: parsed.data.paymentMethod ?? null,
      notes: parsed.data.notes || null,
    });

    if (!recorded.ok) {
      const status = recorded.code === "LEASE_NOT_FOUND" ? 404 : 400;
      return NextResponse.json({ error: recorded.error }, { status });
    }

    const transaction = await prisma.transaction.findUniqueOrThrow({
      where: { id: recorded.transactionId },
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
