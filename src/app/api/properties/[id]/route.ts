import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { propertySchema } from "@/lib/validations/property";

type RouteParams = { params: Promise<{ id: string }> };

// ============================================================
// GET /api/properties/[id]
// ============================================================
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const property = await prisma.property.findFirst({
      where: { id, userId: session.user.id, deletedAt: null },
      include: {
        leases: {
          where: { status: "ACTIVE" },
          include: {
            tenant: true,
            transactions: {
              where: { status: "PAID" },
              orderBy: { paidAt: "desc" },
              take: 3,
            },
          },
        },
        units: { orderBy: { createdAt: "asc" } },
        _count: { select: { leases: true, units: true, maintenanceTickets: true } },
      },
    });

    if (!property) {
      return NextResponse.json({ error: "Bien introuvable" }, { status: 404 });
    }

    return NextResponse.json({ data: property });
  } catch (error) {
    console.error("GET /api/properties/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// PATCH /api/properties/[id]
// ============================================================
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = propertySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    const result = await prisma.property.updateMany({
      where: { id, userId: session.user.id, deletedAt: null },
      data: {
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

    if (result.count === 0) {
      return NextResponse.json({ error: "Bien introuvable" }, { status: 404 });
    }

    const updated = await prisma.property.findUnique({ where: { id } });
    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PATCH /api/properties/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// DELETE /api/properties/[id] — Soft delete
// ============================================================
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Soft delete — set deletedAt instead of removing the record. Scoped, so a
    // property id belonging to another landlord cannot be tombstoned.
    const result = await prisma.property.updateMany({
      where: { id, userId: session.user.id, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Bien introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/properties/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
