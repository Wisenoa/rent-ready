import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { unitSchema } from "@/lib/validations/unit";

type RouteParams = { params: Promise<{ id: string }> };

// ============================================================
// GET /api/units/[id]
// ============================================================
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const unit = await prisma.unit.findFirst({
      where: {
        id,
        property: { userId: session.user.id },
      },
      include: {
        property: { select: { id: true, name: true, city: true, addressLine1: true } },
        leases: {
          where: { status: "ACTIVE" },
          include: {
            tenant: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
        },
        maintenanceTickets: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        _count: { select: { leases: true, maintenanceTickets: true } },
      },
    });

    if (!unit) {
      return NextResponse.json({ error: "Unité introuvable" }, { status: 404 });
    }

    return NextResponse.json({ data: unit });
  } catch (error) {
    console.error("GET /api/units/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// PATCH /api/units/[id]
// ============================================================
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.unit.findFirst({
      where: { id, property: { userId: session.user.id } },
    });

    if (!existing) {
      return NextResponse.json({ error: "Unité introuvable" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = unitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    const updated = await prisma.unit.update({
      where: { id },
      data: {
        name: parsed.data.name,
        floor: parsed.data.floor ?? null,
        unitNumber: parsed.data.unitNumber || null,
        surface: parsed.data.surface ?? null,
        rooms: parsed.data.rooms ?? null,
        type: parsed.data.type,
        status: parsed.data.status,
      },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PATCH /api/units/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// DELETE /api/units/[id]
// ============================================================
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.unit.findFirst({
      where: { id, property: { userId: session.user.id } },
    });

    if (!existing) {
      return NextResponse.json({ error: "Unité introuvable" }, { status: 404 });
    }

    await prisma.unit.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/units/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
