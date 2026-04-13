import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: Promise<{ id: string }> };

// ============================================================
// GET /api/payments/[id] — Get a single payment
// ============================================================
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const payment = await prisma.transaction.findFirst({
      where: { id, userId: session.user.id },
      include: {
        lease: {
          select: {
            id: true,
            rentAmount: true,
            chargesAmount: true,
            property: { select: { id: true, name: true, city: true } },
            tenant: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Paiement introuvable" }, { status: 404 });
    }

    return NextResponse.json({ data: payment });
  } catch (error) {
    console.error("GET /api/payments/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// PATCH /api/payments/[id] — Update payment status
// Allows updating: status, paymentMethod, notes, paidAt
// ============================================================
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.transaction.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Paiement introuvable" }, { status: 404 });
    }

    const body = await request.json();
    const { status, paymentMethod, notes, paidAt } = body;

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (paymentMethod) updateData.paymentMethod = paymentMethod;
    if (notes !== undefined) updateData.notes = notes;
    if (paidAt) updateData.paidAt = new Date(paidAt);

    const updated = await prisma.transaction.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PATCH /api/payments/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
