import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { unitSchema } from "@/lib/validations/unit";

// ============================================================
// GET /api/units — List all units for the user's properties
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
    const propertyId = searchParams.get("propertyId");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {
      property: { userId: session.user.id },
    };
    if (propertyId) where.propertyId = propertyId;
    if (status) where.status = status;

    const [units, total] = await Promise.all([
      prisma.unit.findMany({
        where,
        include: {
          property: { select: { id: true, name: true, city: true } },
          _count: { select: { leases: true, maintenanceTickets: true } },
          leases: {
            where: { status: "ACTIVE" },
            select: { id: true, tenantId: true, rentAmount: true },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.unit.count({ where }),
    ]);

    return NextResponse.json({
      data: units,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/units error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// POST /api/units — Create a new unit
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = unitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    // Verify property ownership
    const property = await prisma.property.findFirst({
      where: { id: parsed.data.propertyId, userId: session.user.id },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Bien introuvable ou accès non autorisé" },
        { status: 404 }
      );
    }

    const unit = await prisma.unit.create({
      data: {
        propertyId: parsed.data.propertyId,
        name: parsed.data.name,
        floor: parsed.data.floor ?? null,
        unitNumber: parsed.data.unitNumber || null,
        surface: parsed.data.surface ?? null,
        rooms: parsed.data.rooms ?? null,
        type: parsed.data.type,
        status: parsed.data.status,
      },
    });

    return NextResponse.json({ data: unit }, { status: 201 });
  } catch (error) {
    console.error("POST /api/units error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
