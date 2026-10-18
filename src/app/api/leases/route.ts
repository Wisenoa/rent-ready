import { recordProductEvent } from "@/lib/analytics/product-events";
import { assertSubscriptionAccess, SubscriptionRequiredError } from "@/lib/subscription-access";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { leaseSchema } from "@/lib/validations/lease";
import { generateAndUploadBailPdf } from "@/lib/actions/bail-pdf-server";
import { generateRentPeriodsForLease } from "@/lib/domain/generate-rent-periods";
import { isRevisable, nextRevisionDate } from "@/lib/domain/lease-revision";

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
    if (error instanceof SubscriptionRequiredError) return NextResponse.json({ error: error.message }, { status: 403 });
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
    await assertSubscriptionAccess(session.user.id);

    const body = await request.json();
    const parsed = leaseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    // Ownership is a constraint of the query, not a comparison afterwards: both
    // the property and the tenant are looked up WITH the session's userId.
    // `findUnique({ where: { id } })` followed by `property.userId !== session…`
    // read another landlord's row before refusing — and a lease created from a
    // foreign propertyId/tenantId would have corrupted their records.
    const [property, tenant] = await Promise.all([
      prisma.property.findFirst({
        where: { id: parsed.data.propertyId, userId: session.user.id },
      }),
      prisma.tenant.findFirst({
        where: { id: parsed.data.tenantId, userId: session.user.id },
      }),
    ]);

    if (!property) {
      return NextResponse.json({ error: "Bien introuvable ou accès non autorisé" }, { status: 404 });
    }
    if (!tenant) {
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

    const lease = await prisma.$transaction(async (tx) => {
      const created = await tx.lease.create({
        data: {
          ...leaseData,
          // The NEXT revision date. This route is the API twin of the createLease
          // server action, and it left `revisionDate` null — so a lease created
          // through the API had no revision date at all, which is one of the two
          // reasons /api/cron/revision-check could never find anything. See
          // `@/lib/domain/lease-revision`.
          revisionDate: isRevisable(leaseData)
            ? nextRevisionDate(leaseData.startDate, new Date(), leaseData.endDate ?? null)
            : null,
        },
      });
      await generateRentPeriodsForLease(created.id, new Date(), tx);
      return created;
    });

    // PDF rendering/storage stays outside the database transaction. A missing
    // document does not undo the lease and its recorded rent expectations.
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

    // Persist a URL only after storage actually succeeded.
    const url = await _bailPdf;
    if (url) await prisma.lease.update({ where: { id: lease.id }, data: { documentUrl: url } });
    const fullLease = await prisma.lease.findUnique({
      where: { id: lease.id },
      include: {
        property: { select: { id: true, name: true } },
        tenant: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    await recordProductEvent(session.user.id, "lease_created");
    return NextResponse.json({ data: fullLease }, { status: 201 });
  } catch (error) {
    if (error instanceof SubscriptionRequiredError) return NextResponse.json({ error: error.message }, { status: 403 });
    console.error("POST /api/leases error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
