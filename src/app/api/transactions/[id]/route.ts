import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { cancelRentPayment } from "@/lib/services/rent-payments";
import {
  paymentAnnotationSchema,
  FINANCIAL_TRANSACTION_FIELDS,
} from "@/lib/validations/transaction";

type RouteParams = { params: Promise<{ id: string }> };

// ============================================================
// GET /api/transactions/[id]
// ============================================================
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId: session.user.id },
      include: {
        lease: {
          select: {
            id: true, rentAmount: true, chargesAmount: true,
            property: { select: { id: true, name: true, city: true } },
            tenant: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaction introuvable" }, { status: 404 });
    }

    return NextResponse.json({ data: transaction });
  } catch (error) {
    console.error("GET /api/transactions/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// PATCH /api/transactions/[id] — annotate a transaction, never re-decide its money
//
// Same defect, same fix as PATCH /api/payments/[id]: `status` and `paidAt` came
// straight from the body, so a status could be written with no money behind it.
// Only the annotation is writable now.
// ============================================================
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Corps JSON invalide" }, { status: 400 });
    }

    const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
    const attempted = FINANCIAL_TRANSACTION_FIELDS.filter(
      (field) => record[field] !== undefined
    );
    if (attempted.length > 0) {
      return NextResponse.json(
        {
          error: `Ces champs ne sont pas modifiables ici : ${attempted.join(", ")}. Utilisez POST /api/transactions pour enregistrer un montant, ou DELETE pour annuler un encaissement.`,
        },
        { status: 400 }
      );
    }

    const parsed = paymentAnnotationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    const { notes, paymentMethod } = parsed.data;
    if (notes === undefined && paymentMethod === undefined) {
      return NextResponse.json({ error: "Aucune modification fournie" }, { status: 400 });
    }

    // Scoped on the write itself: knowing another landlord's id is not enough.
    const result = await prisma.transaction.updateMany({
      where: { id, userId: session.user.id },
      data: {
        ...(notes !== undefined ? { notes } : {}),
        ...(paymentMethod !== undefined ? { paymentMethod } : {}),
      },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Transaction introuvable" }, { status: 404 });
    }

    const updated = await prisma.transaction.findUnique({ where: { id } });
    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PATCH /api/transactions/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// DELETE /api/transactions/[id] — cancel a receipt recorded in error
// ============================================================
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const result = await cancelRentPayment({
      userId: session.user.id,
      transactionId: id,
    });

    if (!result.ok) {
      const status = result.code === "PAYMENT_NOT_FOUND" ? 404 : 400;
      return NextResponse.json({ error: result.error }, { status });
    }

    return NextResponse.json({
      data: {
        id,
        status: "CANCELLED",
        collectable: result.collectable,
        reopenedPeriodId: result.reopenedPeriodId,
      },
    });
  } catch (error) {
    console.error("DELETE /api/transactions/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
