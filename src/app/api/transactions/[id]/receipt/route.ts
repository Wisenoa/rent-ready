import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { generateQuittance } from "@/lib/actions/quittance-actions";
import { settlePeriodPayments, paymentsBefore } from "@/lib/domain/period-settlement";

type RouteParams = Promise<{ id: string }>;

// ============================================================
// GET /api/transactions/[id]/receipt — Return a clean JSON receipt
// POST on the same path generates the PDF quittance
// ============================================================
export async function GET(request: NextRequest, { params }: { params: RouteParams }) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const transaction = await prisma.transaction.findFirst({
      where: { id, userId: session.user.id },
      select: {
        id: true,
        leaseId: true,
        amount: true,
        rentPortion: true,
        chargesPortion: true,
        periodStart: true,
        periodEnd: true,
        paidAt: true,
        createdAt: true,
        status: true,
        receiptType: true,
        receiptNumber: true,
        paymentMethod: true,
        notes: true,
        // Frozen at payment time, so the figures below describe the period the
        // payment was made against and not the lease as it stands now.
        receiptRentAmount: true,
        receiptChargesAmount: true,
        receiptDocument: { select: { id: true } },
        lease: {
          select: {
            rentAmount: true,
            chargesAmount: true,
            property: {
              select: {
                id: true,
                name: true,
                addressLine1: true,
                addressLine2: true,
                postalCode: true,
                city: true,
              },
            },
            tenant: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                addressLine1: true,
                addressLine2: true,
                postalCode: true,
                city: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            addressLine1: true,
            addressLine2: true,
            postalCode: true,
            city: true,
          },
        },
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction introuvable" },
        { status: 404 }
      );
    }

    if (!transaction.paidAt) {
      return NextResponse.json(
        { error: "Le paiement n'est pas encore enregistré." },
        { status: 400 }
      );
    }

    // A cancelled row keeps its amount and its paidAt, so without this guard
    // this endpoint would describe a payment whose money went back — as a
    // receipt, with a remaining balance computed from it.
    if (transaction.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Ce paiement a été annulé." },
        { status: 400 }
      );
    }

    // Determine receipt type
    //
    // This used to be `status === "PAID"` and a balance computed from the lease's
    // CURRENT rent and this payment's amount alone: on a month paid 400 + 570,55
    // it reported 570,55 still owed on the payment that had just cleared it, and
    // after a rent revision it described the wrong month entirely.
    //
    // It is now derived from `settlePeriodPayments` — the single settlement rule
    // (AGENTS.md 11) — over the FROZEN period amounts and every payment received
    // up to and including this one, so `remainingDue` is what was really left at
    // that date. Same inputs as `generateQuittance`, so the two cannot disagree.
    // The settlement judges the period AS OF this payment, not as it stands
    // today: a receipt attests to the balance left when the money arrived, and
    // cannot certify (or deny) a later instalment. So only payments recorded
    // before or at this one count — ordered by paidAt with createdAt breaking the
    // same-day tie, the ordering `settlePeriodPayments` itself uses.
    const periodPayments = await prisma.transaction.findMany({
      where: {
        leaseId: transaction.leaseId,
        periodStart: transaction.periodStart,
        periodEnd: transaction.periodEnd,
        paidAt: { not: null },
        status: { not: "CANCELLED" },
      },
      select: { id: true, amount: true, paidAt: true, createdAt: true },
      orderBy: [{ paidAt: "asc" }, { createdAt: "asc" }],
    });

    const asOf = paymentsBefore(
      periodPayments.map((p) => ({ ...p, id: p.id })),
      transaction
    ).map((p) => ({ amount: p.amount, paidAt: p.paidAt, createdAt: p.createdAt }));

    const current = {
      amount: transaction.amount,
      paidAt: transaction.paidAt,
      createdAt: transaction.createdAt,
    };

    const settlement = settlePeriodPayments({
      rentAmount: transaction.receiptRentAmount ?? transaction.lease.rentAmount,
      chargesAmount:
        transaction.receiptChargesAmount ?? transaction.lease.chargesAmount,
      payments: [...asOf, current],
      current,
    });

    // A stored type wins: it is the type the ISSUED document carries, and this
    // route describes a payment that has one. Only when there is none yet does
    // the derived value answer.
    const receiptType = transaction.receiptType ?? settlement.receiptType;
    const receiptLabel = receiptType === "QUITTANCE" ? "Quittance de loyer" : "Reçu de paiement partiel";

    // Format period label in French
    const formatPeriod = (d: Date) =>
      d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

    const remainingAmount = settlement.outstanding.toDecimalPlaces(2).toNumber();

    const receipt = {
      receipt: {
        type: receiptType,
        label: receiptLabel,
        number: transaction.receiptNumber ?? null,
        generatedAt: new Date().toISOString(),
        paymentDate: transaction.paidAt?.toISOString() ?? null,
        // Where the archived document actually is. The download route serves the
        // persisted bytes; this is not a rendering reconstructed from the figures
        // below, which is what used to make the downloaded file differ from the
        // stored one.
        documentUrl: `/api/transactions/${transaction.id}/receipt/download`,
        hasDocument: Boolean(transaction.receiptDocument),
        period: {
          start: transaction.periodStart.toISOString(),
          end: transaction.periodEnd.toISOString(),
          label: `${formatPeriod(transaction.periodStart)} – ${formatPeriod(transaction.periodEnd)}`,
        },
      },
      amounts: {
        rentPortion: transaction.rentPortion,
        chargesPortion: transaction.chargesPortion,
        totalPaid: transaction.amount,
        remainingDue: remainingAmount,
        currency: "EUR",
      },
      landlord: {
        name: `${transaction.user.firstName} ${transaction.user.lastName}`.trim(),
        addressLine1: transaction.user.addressLine1,
        addressLine2: transaction.user.addressLine2 ?? null,
        postalCode: transaction.user.postalCode,
        city: transaction.user.city,
      },
      tenant: {
        name: `${transaction.lease.tenant.firstName} ${transaction.lease.tenant.lastName}`.trim(),
        addressLine1: transaction.lease.tenant.addressLine1,
        addressLine2: transaction.lease.tenant.addressLine2 ?? null,
        postalCode: transaction.lease.tenant.postalCode,
        city: transaction.lease.tenant.city,
      },
      property: {
        id: transaction.lease.property.id,
        name: transaction.lease.property.name,
        address: [
          transaction.lease.property.addressLine1,
          transaction.lease.property.addressLine2,
          `${transaction.lease.property.postalCode} ${transaction.lease.property.city}`,
        ]
          .filter(Boolean)
          .join(", "),
      },
      payment: {
        method: transaction.paymentMethod ?? null,
        notes: transaction.notes ?? null,
      },
    };

    return NextResponse.json({ data: receipt });
  } catch (error) {
    console.error("GET /api/transactions/[id]/receipt error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// POST /api/transactions/[id]/receipt — Generate a quittance PDF
// ============================================================
export async function POST(
  request: NextRequest,
  context: { params: RouteParams }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    // Establish ownership here rather than relying entirely on the callee.
    // `generateQuittance` does re-check `transaction.userId`, but it is a
    // server action reachable from other callers (the receipt button), and its
    // failure message is not an authorization answer. Scoping the read here
    // means this route cannot be used to probe which transaction ids exist.
    const owned = await prisma.transaction.findFirst({
      where: { id, userId: session.user.id },
      select: { id: true },
    });

    if (!owned) {
      return NextResponse.json({ error: "Transaction introuvable" }, { status: 404 });
    }

    const result = await generateQuittance(id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    console.error("POST /api/transactions/[id]/receipt error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération de la quittance." },
      { status: 500 }
    );
  }
}
