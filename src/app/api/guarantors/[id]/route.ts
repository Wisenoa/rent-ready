import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { guarantorSchema } from "@/lib/validations/guarantor";

type RouteParams = { params: Promise<{ id: string }> };

// ============================================================
// GET /api/guarantors/[id]
// ============================================================
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const guarantor = await prisma.guarantor.findUnique({
      where: { id },
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
    });

    if (!guarantor || guarantor.lease.property.userId !== session.user.id) {
      return NextResponse.json({ error: "Garant introuvable" }, { status: 404 });
    }

    return NextResponse.json({ data: guarantor });
  } catch (error) {
    console.error("GET /api/guarantors/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// PATCH /api/guarantors/[id]
// ============================================================
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.guarantor.findUnique({
      where: { id },
      include: {
        lease: { select: { property: { select: { userId: true } } } },
      },
    });

    if (!existing || existing.lease.property.userId !== session.user.id) {
      return NextResponse.json({ error: "Garant introuvable" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = guarantorSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    const updated = await prisma.guarantor.update({
      where: { id },
      data: {
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

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PATCH /api/guarantors/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// DELETE /api/guarantors/[id]
// ============================================================
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.guarantor.findUnique({
      where: { id },
      include: {
        lease: { select: { property: { select: { userId: true } } } },
      },
    });

    if (!existing || existing.lease.property.userId !== session.user.id) {
      return NextResponse.json({ error: "Garant introuvable" }, { status: 404 });
    }

    await prisma.guarantor.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/guarantors/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
