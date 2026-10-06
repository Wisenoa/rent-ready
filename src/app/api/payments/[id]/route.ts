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
// PATCH /api/payments/[id] — annotate a payment, never re-decide its money
//
// This route used to copy `status` and `paidAt` straight from the request body:
// `POST { "status": "PAID" }` marked a period paid while the month's receipts
// summed to zero, and `status: "PENDING"` made a real payment disappear from the
// figures. A period's status is DERIVED from the money received (AGENTS.md 11),
// so it is not a client-writable field.
//
// What remains writable is the annotation: notes and how the money arrived.
// Financial fields are refused outright rather than ignored, so a caller gets a
// truthful 400 instead of a silent no-op it might read as success.
//
// To record or correct money: POST /api/payments, or DELETE to cancel.
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
          error: `Ces champs ne sont pas modifiables ici : ${attempted.join(", ")}. Utilisez POST /api/payments pour enregistrer un montant, ou DELETE pour annuler un encaissement.`,
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

    // Ownership is in the query, and the write is scoped the same way, so a
    // caller who knows another landlord's payment id cannot touch it.
    const result = await prisma.transaction.updateMany({
      where: { id, userId: session.user.id },
      data: {
        ...(notes !== undefined ? { notes } : {}),
        ...(paymentMethod !== undefined ? { paymentMethod } : {}),
      },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Paiement introuvable" }, { status: 404 });
    }

    const updated = await prisma.transaction.findUnique({ where: { id } });
    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PATCH /api/payments/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// DELETE /api/payments/[id] — cancel a receipt recorded in error
//
// The correction path: a wrong amount or a payment on the wrong lease left the
// landlord with no way to repair the ledger. Cancelling keeps the row (a
// financial register does not erase what happened) and gives its amount back to
// the month, so the « Enregistrer un paiement » dialog offers it again.
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
    console.error("DELETE /api/payments/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
