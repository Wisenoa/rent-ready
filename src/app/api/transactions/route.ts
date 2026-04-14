import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { transactionSchema } from "@/lib/validations/transaction";
import { determineReceiptType } from "@/lib/quittance-generator";
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

    const totalDue = lease.rentAmount + lease.chargesAmount;
    const isFullPayment = parsed.data.amount >= totalDue;
    const receiptType = determineReceiptType(parsed.data.amount, lease.rentAmount, lease.chargesAmount);

    const rentPortion = isFullPayment
      ? lease.rentAmount
      : Math.round((parsed.data.amount * lease.rentAmount / totalDue) * 100) / 100;
    const chargesPortion = isFullPayment
      ? lease.chargesAmount
      : Math.round((parsed.data.amount - rentPortion) * 100) / 100;

    const status = isFullPayment ? "PAID" : "PARTIAL";

    const transaction = await prisma.transaction.create({
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

    return NextResponse.json({ data: transaction }, { status: 201 });
  } catch (error) {
    console.error("POST /api/transactions error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
