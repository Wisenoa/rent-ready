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

    const [leases, total] = await Promise.all([
      prisma.lease.findMany({
        where,
        include: {
          property: { select: { id: true, name: true, addressLine1: true, city: true } },
          tenant: { select: { id: true, firstName: true, lastName: true, email: true } },
          transactions: {
            where: { status: { in: ["PAID", "PARTIAL"] } },
            select: { id: true, amount: true, paidAt: true, periodStart: true, status: true },
            orderBy: { paidAt: "desc" },
            take: 6,
          },
          guarantor: { select: { id: true, firstName: true, lastName: true, status: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.lease.count({ where }),
    ]);

    return NextResponse.json({
      data: leases,
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

    // Generate bail PDF in background (best-effort)
    const documentUrl = await generateAndUploadBailPdf(
      lease.id,
      session.user.id,
      parsed.data.propertyId,
      parsed.data.tenantId,
      leaseData
    ).catch((err) => {
      console.error("Bail PDF generation failed:", err);
      return null;
    });

    if (documentUrl) {
      await prisma.lease.update({ where: { id: lease.id }, data: { documentUrl } });
    }

    const fullLease = await prisma.lease.findUnique({
      where: { id: lease.id },
      include: {
        property: { select: { id: true, name: true } },
        tenant: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    return NextResponse.json({ data: fullLease }, { status: 201 });
  } catch (error) {
    console.error("POST /api/leases error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
