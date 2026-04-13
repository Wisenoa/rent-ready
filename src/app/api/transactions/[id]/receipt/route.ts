import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { generateQuittance } from "@/lib/actions/quittance-actions";

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
      include: {
        lease: {
          include: {
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

    // Determine receipt type
    const isFullPayment = transaction.status === "PAID";
    const receiptType = transaction.receiptType ?? (isFullPayment ? "QUITTANCE" : "RECU");
    const receiptLabel = receiptType === "QUITTANCE" ? "Quittance de loyer" : "Reçu de paiement partiel";

    // Format period label in French
    const formatPeriod = (d: Date) =>
      d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

    const expectedTotal = transaction.lease.rentAmount + transaction.lease.chargesAmount;
    const remainingAmount = isFullPayment
      ? 0
      : Math.round((expectedTotal - transaction.amount) * 100) / 100;

    const receipt = {
      receipt: {
        type: receiptType,
        label: receiptLabel,
        number: transaction.receiptNumber ?? null,
        generatedAt: new Date().toISOString(),
        paymentDate: transaction.paidAt?.toISOString() ?? null,
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
