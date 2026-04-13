import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { propertySchema } from "@/lib/validations/property";

// ============================================================
// GET /api/properties — List all properties for the user
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

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where: { userId: session.user.id, deletedAt: null },
        include: {
          _count: { select: { leases: true, units: true } },
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
      prisma.property.count({ where: { userId: session.user.id, deletedAt: null } }),
    ]);

    return NextResponse.json({
      data: properties,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/properties error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// POST /api/properties — Create a new property
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = propertySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    const property = await prisma.property.create({
      data: {
        userId: session.user.id,
        name: parsed.data.name,
        type: parsed.data.type,
        addressLine1: parsed.data.addressLine1,
        addressLine2: parsed.data.addressLine2 || null,
        city: parsed.data.city,
        postalCode: parsed.data.postalCode,
        surface: parsed.data.surface ?? null,
        rooms: parsed.data.rooms ?? null,
        description: parsed.data.description || null,
        cadastralRef: parsed.data.cadastralRef || null,
        taxRef: parsed.data.taxRef || null,
      },
    });

    return NextResponse.json({ data: property }, { status: 201 });
  } catch (error) {
    console.error("POST /api/properties error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
