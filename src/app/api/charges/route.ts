import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { chargeSchema } from "@/lib/validations/charge";

// ============================================================
// GET /api/charges — List charges for the user's leases
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
    const leaseId = searchParams.get("leaseId");
    const isRecovered = searchParams.get("isRecovered");
    const category = searchParams.get("category");

    const where: Record<string, unknown> = { userId: session.user.id };
    if (leaseId) where.leaseId = leaseId;
    if (isRecovered !== null) where.isRecovered = isRecovered === "true";
    if (category) where.category = category;

    const [charges, total] = await Promise.all([
      prisma.charge.findMany({
        where,
        include: {
          lease: {
            select: {
              id: true,
              rentAmount: true,
              property: { select: { id: true, name: true, city: true } },
              tenant: { select: { id: true, firstName: true, lastName: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.charge.count({ where }),
    ]);

    return NextResponse.json({
      data: charges,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/charges error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// POST /api/charges — Create a new recoverable charge
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = chargeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    // Verify lease ownership
    const lease = await prisma.lease.findFirst({
      where: { id: parsed.data.leaseId, userId: session.user.id },
    });

    if (!lease) {
      return NextResponse.json(
        { error: "Bail introuvable ou accès non autorisé" },
        { status: 404 }
      );
    }

    const charge = await prisma.charge.create({
      data: {
        userId: session.user.id,
        leaseId: parsed.data.leaseId,
        label: parsed.data.label,
        category: parsed.data.category,
        amount: parsed.data.amount,
        billingCycle: parsed.data.billingCycle,
        periodStart: new Date(parsed.data.periodStart),
        periodEnd: parsed.data.periodEnd ? new Date(parsed.data.periodEnd) : null,
        invoiceUrl: parsed.data.invoiceUrl || null,
        isRecovered: parsed.data.isRecovered,
        notes: parsed.data.notes || null,
      },
    });

    return NextResponse.json({ data: charge }, { status: 201 });
  } catch (error) {
    console.error("POST /api/charges error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
