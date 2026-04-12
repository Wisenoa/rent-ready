import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { leaseSchema } from "@/lib/validations/lease";

type RouteParams = { params: Promise<{ id: string }> };

// ============================================================
// GET /api/leases/[id]
// ============================================================
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const lease = await prisma.lease.findFirst({
      where: { id, userId: session.user.id },
      include: {
        property: {
          select: {
            id: true, name: true, addressLine1: true, city: true,
            postalCode: true, type: true, surface: true,
          },
        },
        tenant: {
          select: {
            id: true, firstName: true, lastName: true, email: true, phone: true,
            addressLine1: true, city: true, postalCode: true,
          },
        },
        unit: { select: { id: true, name: true, floor: true } },
        guarantor: true,
        transactions: {
          where: { status: { in: ["PAID", "PARTIAL"] } },
          orderBy: { paidAt: "desc" },
          select: {
            id: true, amount: true, rentPortion: true, chargesPortion: true,
            paidAt: true, periodStart: true, periodEnd: true, status: true,
            receiptType: true, receiptNumber: true,
          },
        },
      },
    });

    if (!lease) {
      return NextResponse.json({ error: "Bail introuvable" }, { status: 404 });
    }

    return NextResponse.json({ data: lease });
  } catch (error) {
    console.error("GET /api/leases/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// PATCH /api/leases/[id]
// ============================================================
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.lease.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Bail introuvable" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = leaseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    const updated = await prisma.lease.update({
      where: { id },
      data: {
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
      },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PATCH /api/leases/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// DELETE /api/leases/[id] — Terminates a lease
// ============================================================
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.lease.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Bail introuvable" }, { status: 404 });
    }

    const updated = await prisma.lease.update({
      where: { id },
      data: { status: "TERMINATED", endDate: existing.endDate ?? new Date() },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("DELETE /api/leases/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
