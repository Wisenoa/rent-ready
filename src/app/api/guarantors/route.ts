import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { guarantorSchema } from "@/lib/validations/guarantor";

// ============================================================
// GET /api/guarantors — List guarantors
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const leaseId = searchParams.get("leaseId");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10)));
    const skip = (page - 1) * limit;

    if (!leaseId) {
      return NextResponse.json(
        { error: "leaseId est requis" },
        { status: 400 }
      );
    }

    const where = { leaseId };
    const [guarantors, total] = await Promise.all([
      prisma.guarantor.findMany({
        where,
        include: {
          lease: {
            select: {
              id: true,
              propertyId: true,
              status: true,
              property: { select: { id: true, name: true, userId: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.guarantor.count({ where }),
    ]);

    // Filter to only guarantors belonging to user's leases
    const filtered = guarantors.filter(
      (g) => g.lease.property.userId === session.user.id
    );

    return NextResponse.json({
      data: filtered,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/guarantors error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// POST /api/guarantors — Create a guarantor for a lease
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = guarantorSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    // Verify lease ownership
    const lease = await prisma.lease.findFirst({
      where: {
        id: parsed.data.leaseId,
        userId: session.user.id,
      },
    });

    if (!lease) {
      return NextResponse.json(
        { error: "Bail introuvable ou accès non autorisé" },
        { status: 404 }
      );
    }

    // Check if guarantor already exists for this lease
    const existing = await prisma.guarantor.findUnique({
      where: { leaseId: parsed.data.leaseId },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Un garant existe déjà pour ce bail. Utilisez PATCH pour le mettre à jour." },
        { status: 409 }
      );
    }

    const guarantor = await prisma.guarantor.create({
      data: {
        leaseId: parsed.data.leaseId,
        type: parsed.data.type,
        firstName: parsed.data.firstName || null,
        lastName: parsed.data.lastName || null,
        dateOfBirth: parsed.data.dateOfBirth ? new Date(parsed.data.dateOfBirth) : null,
        placeOfBirth: parsed.data.placeOfBirth || null,
        companyName: parsed.data.companyName || null,
        siren: parsed.data.siren || null,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        addressLine1: parsed.data.addressLine1,
        addressLine2: parsed.data.addressLine2 || null,
        city: parsed.data.city,
        postalCode: parsed.data.postalCode,
        country: parsed.data.country,
        financialDocumentIds: parsed.data.financialDocumentIds,
        status: parsed.data.status,
      },
    });

    return NextResponse.json({ data: guarantor }, { status: 201 });
  } catch (error) {
    console.error("POST /api/guarantors error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
