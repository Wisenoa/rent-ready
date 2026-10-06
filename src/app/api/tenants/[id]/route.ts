import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { tenantSchema } from "@/lib/validations/tenant";

type RouteParams = { params: Promise<{ id: string }> };

// ============================================================
// GET /api/tenants/[id]
// ============================================================
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const tenant = await prisma.tenant.findFirst({
      where: { id, userId: session.user.id },
      include: {
        leases: {
          where: { status: "ACTIVE" },
          include: {
            property: { select: { id: true, name: true, addressLine1: true, city: true } },
          },
        },
        maintenanceTickets: { orderBy: { createdAt: "desc" }, take: 5 },
        _count: { select: { leases: true, maintenanceTickets: true } },
      },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Locataire introuvable" }, { status: 404 });
    }

    return NextResponse.json({ data: tenant });
  } catch (error) {
    console.error("GET /api/tenants/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// PATCH /api/tenants/[id]
// ============================================================
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = tenantSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    // The owner is part of the write, not a check performed before it.
    const result = await prisma.tenant.updateMany({
      where: { id, userId: session.user.id },
      data: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email || null,
        phone: parsed.data.phone || null,
        addressLine1: parsed.data.addressLine1,
        addressLine2: parsed.data.addressLine2 || null,
        city: parsed.data.city,
        postalCode: parsed.data.postalCode,
        dateOfBirth: parsed.data.dateOfBirth ? new Date(parsed.data.dateOfBirth) : null,
        placeOfBirth: parsed.data.placeOfBirth || null,
        emergencyName: parsed.data.emergencyName || null,
        emergencyPhone: parsed.data.emergencyPhone || null,
      },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Locataire introuvable" }, { status: 404 });
    }

    const updated = await prisma.tenant.findUnique({ where: { id } });
    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PATCH /api/tenants/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// DELETE /api/tenants/[id]
// ============================================================
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await prisma.tenant.deleteMany({
      where: { id, userId: session.user.id },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Locataire introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/tenants/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
