import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { determineReceiptType, generateReceiptNumber } from "@/lib/payment-utils";
import type { QuittanceData } from "@/lib/quittance-generator";

type RouteParams = { params: Promise<{ id: string }> };

// ============================================================
// GET /api/payments/[id]/receipt — Generate & download PDF receipt
// Supports: GET (generate + stream PDF)
// Query params:
//   download  "true" → Content-Disposition: attachment
// ============================================================
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const download = request.nextUrl.searchParams.get("download") === "true";

    // Fetch transaction with all related data needed for the PDF
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId: session.user.id },
      include: {
        lease: {
          include: {
            property: true,
            tenant: true,
          },
        },
        user: true,
      },
    });

    if (!transaction) {
      return NextResponse.json({ error: "Paiement introuvable" }, { status: 404 });
    }

    if (!transaction.paidAt) {
      return NextResponse.json(
        { error: "Ce paiement n'a pas encore été enregistré. Generer d'abord la quittance apres l'enregistrement." },
        { status: 400 }
      );
    }

    const { lease, user } = transaction;
    const { property, tenant } = lease;

    const receiptType = determineReceiptType(
      transaction.amount,
      lease.rentAmount,
      lease.chargesAmount
    );

    // Generate sequential receipt number
    const existingCount = await prisma.transaction.count({
      where: { userId: session.user.id, receiptNumber: { not: null } },
    });
    const receiptNumber = generateReceiptNumber(
      receiptType,
      transaction.paidAt,
      existingCount + 1
    );

    const quittanceData: QuittanceData = {
      landlord: {
        firstName: user.firstName,
        lastName: user.lastName,
        addressLine1: user.addressLine1,
        addressLine2: user.addressLine2 ?? undefined,
        city: user.city,
        postalCode: user.postalCode,
      },
      tenant: {
        firstName: tenant.firstName,
        lastName: tenant.lastName,
        addressLine1: tenant.addressLine1,
        addressLine2: tenant.addressLine2 ?? undefined,
        city: tenant.city,
        postalCode: tenant.postalCode,
      },
      propertyAddress: [
        property.addressLine1,
        property.addressLine2,
        `${property.postalCode} ${property.city}`,
      ]
        .filter(Boolean)
        .join(", "),
      rentAmount: Number(lease.rentAmount),
      chargesAmount: Number(lease.chargesAmount),
      totalAmount: Number(transaction.amount),
      periodStart: transaction.periodStart,
      periodEnd: transaction.periodEnd,
      paidAt: transaction.paidAt,
      receiptNumber,
      isFullPayment: receiptType === "QUITTANCE",
    };

    // Dynamically import @react-pdf/renderer (server-only, not bundled for client)
    const { renderToBuffer } = await import("@react-pdf/renderer");
    const { QuittancePDF } = await import("@/lib/quittance-generator");

    const pdfBuffer = await renderToBuffer(<QuittancePDF data={quittanceData} />);

    // Update transaction with receipt metadata (idempotent)
    await prisma.transaction.update({
      where: { id },
      data: {
        receiptType,
        receiptNumber,
      },
    });

    const documentTitle = receiptType === "QUITTANCE"
      ? `Quittance-${receiptNumber}.pdf`
      : `Recu-${receiptNumber}.pdf`;

    const headers: Record<string, string> = {
      "Content-Type": "application/pdf",
      "Content-Length": String(pdfBuffer.byteLength),
      "Cache-Control": "private, max-age=3600",
    };

    if (download) {
      headers["Content-Disposition"] = `attachment; filename="${documentTitle}"`;
    } else {
      headers["Content-Disposition"] = `inline; filename="${documentTitle}"`;
    }

    return new NextResponse(pdfBuffer, { status: 200, headers });
  } catch (error) {
    console.error("GET /api/payments/[id]/receipt error:", error);
    return NextResponse.json(
      { error: "Erreur interne lors de la génération du reçu." },
      { status: 500 }
    );
  }
}
