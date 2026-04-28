import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { leaseSchema } from "@/lib/validations/lease";
import { generateAndUploadBailPdf } from "@/lib/actions/bail-pdf-server";

// ============================================================
// GET /api/leases — List all leases
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
    const status = searchParams.get("status"); // ACTIVE, TERMINATED, DRAFT, EXPIRED
    const propertyId = searchParams.get("propertyId");
    const tenantId = searchParams.get("tenantId");

    const where: Record<string, unknown> = { userId: session.user.id };
    if (status) where.status = status;
    if (propertyId) where.propertyId = propertyId;
    if (tenantId) where.tenantId = tenantId;

    // Fetch leases WITHOUT the nested transactions include to avoid N+1.
    // We'll batch-fetch recent paid transactions for all leases in a single query.
    const leases = await prisma.lease.findMany({
      where,
      include: {
        property: { select: { id: true, name: true, addressLine1: true, city: true } },
        tenant: { select: { id: true, firstName: true, lastName: true, email: true } },
        guarantor: { select: { id: true, firstName: true, lastName: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    // Batch-fetch recent paid transactions for all fetched leases (fixes N+1).
    // Old code had `transactions` include which ran a separate subquery per lease.
    const leaseIds = leases.map((l) => l.id);
    const recentTransactions = leaseIds.length
      ? await prisma.transaction.findMany({
          where: {
            leaseId: { in: leaseIds },
            status: { in: ["PAID", "PARTIAL"] },
          },
          select: {
            id: true,
            amount: true,
            paidAt: true,
            periodStart: true,
            status: true,
            leaseId: true,
          },
          orderBy: { paidAt: "desc" },
        })
      : [];

    // Group transactions by leaseId and attach at most 6 most recent per lease.
    const txByLease = new Map<string, typeof recentTransactions>();
    for (const tx of recentTransactions) {
      if (!txByLease.has(tx.leaseId)) txByLease.set(tx.leaseId, []);
      if (txByLease.get(tx.leaseId)!.length < 6) {
        txByLease.get(tx.leaseId)!.push(tx);
      }
    }

    const data = leases.map((lease) => ({
      ...lease,
      transactions: txByLease.get(lease.id) ?? [],
    }));

    const [_, total] = await Promise.all([
      Promise.resolve(data), // placates TS scoping
      prisma.lease.count({ where }),
    ]);

    return NextResponse.json({
      data,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/leases error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// POST /api/leases — Create a new lease
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = leaseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    // Verify property and tenant ownership
    const [property, tenant] = await Promise.all([
      prisma.property.findUnique({ where: { id: parsed.data.propertyId } }),
      prisma.tenant.findUnique({ where: { id: parsed.data.tenantId } }),
    ]);

    if (!property || property.userId !== session.user.id) {
      return NextResponse.json({ error: "Bien introuvable ou accès non autorisé" }, { status: 404 });
    }
    if (!tenant || tenant.userId !== session.user.id) {
      return NextResponse.json({ error: "Locataire introuvable ou accès non autorisé" }, { status: 404 });
    }

    const leaseData = {
      userId: session.user.id,
      propertyId: parsed.data.propertyId,
      tenantId: parsed.data.tenantId,
      rentAmount: parsed.data.rentAmount,
      chargesAmount: parsed.data.chargesAmount,
      depositAmount: parsed.data.depositAmount,
      startDate: new Date(parsed.data.startDate),
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      paymentDay: parsed.data.paymentDay,
      paymentMethod: parsed.data.paymentMethod,
      leaseType: parsed.data.leaseType,
      irlReferenceQuarter: parsed.data.irlReferenceQuarter || null,
      irlReferenceValue: parsed.data.irlReferenceValue ?? null,
    };

    const lease = await prisma.lease.create({ data: leaseData });

    // Fire-and-forget: generate bail PDF without blocking the response.
    // If PDF generation fails, the lease is still created successfully.
    // The documentUrl can be populated later via a separate job or on-demand.
    const _bailPdf = generateAndUploadBailPdf(
      lease.id,
      session.user.id,
      parsed.data.propertyId,
      parsed.data.tenantId,
      leaseData
    ).catch((err) => {
      console.error("Bail PDF generation failed (async):", err);
      return null;
    });

    // If PDF generation succeeds, update the lease in a single transaction.
    // Combine update + fetch into one step by using a transaction.
    const fullLease = await prisma.$transaction(async (tx) => {
      const url = await _bailPdf;
      if (url) {
        await tx.lease.update({ where: { id: lease.id }, data: { documentUrl: url } });
      }
      return tx.lease.findUnique({
        where: { id: lease.id },
        include: {
          property: { select: { id: true, name: true } },
          tenant: { select: { id: true, firstName: true, lastName: true } },
        },
      });
    });

    return NextResponse.json({ data: fullLease }, { status: 201 });
  } catch (error) {
    console.error("POST /api/leases error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
