import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { chargeSchema } from "@/lib/validations/charge";

type RouteParams = { params: Promise<{ id: string }> };

// ============================================================
// GET /api/charges/[id]
// ============================================================
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const charge = await prisma.charge.findFirst({
      where: { id, userId: session.user.id },
      include: {
        lease: {
          select: {
            id: true,
            rentAmount: true,
            property: { select: { id: true, name: true, city: true } },
            tenant: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
    });

    if (!charge) {
      return NextResponse.json({ error: "Charge introuvable" }, { status: 404 });
    }

    return NextResponse.json({ data: charge });
  } catch (error) {
    console.error("GET /api/charges/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// PATCH /api/charges/[id]
// ============================================================
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.charge.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Charge introuvable" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = chargeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    // Verify lease ownership if leaseId is being changed
    if (parsed.data.leaseId !== existing.leaseId) {
      const lease = await prisma.lease.findFirst({
        where: { id: parsed.data.leaseId, userId: session.user.id },
      });
      if (!lease) {
        return NextResponse.json(
          { error: "Bail introuvable ou accès non autorisé" },
          { status: 404 }
        );
      }
    }

    const updated = await prisma.charge.update({
      where: { id },
      data: {
        leaseId: parsed.data.leaseId,
        label: parsed.data.label,
        category: parsed.data.category,
        amount: parsed.data.amount,
        billingCycle: parsed.data.billingCycle,
        periodStart: new Date(parsed.data.periodStart),
        periodEnd: parsed.data.periodEnd ? new Date(parsed.data.periodEnd) : null,
        invoiceUrl: parsed.data.invoiceUrl || null,
        isRecovered: parsed.data.isRecovered,
        notes: parsed.data.notes || null,
      },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PATCH /api/charges/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// DELETE /api/charges/[id]
// ============================================================
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.charge.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Charge introuvable" }, { status: 404 });
    }

    await prisma.charge.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/charges/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
