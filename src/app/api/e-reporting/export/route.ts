import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

interface EReportingTransaction {
  tenantId: string;
  tenantName: string;
  propertyAddress: string;
  rentAmount: number;
  chargesAmount: number;
  totalAmount: number;
  paidAt: string;
  receiptType: string;
  receiptNumber: string | null;
  paymentMethod: string | null;
}

interface AggregatedTenant {
  tenantId: string;
  tenantName: string;
  propertyAddress: string;
  totalCollected: number;
  totalRent: number;
  totalCharges: number;
  paymentCount: number;
  receiptNumbers: string[];
}

interface EReportingExport {
  metadata: {
    exportDate: string;
    period: string;
    periodStart: string;
    periodEnd: string;
    declarant: {
      name: string;
      address: string;
      siren?: string;
    };
    regime: "B2C";
    currency: "EUR";
    vatExempt: true;
    vatExemptReason: string;
  };
  summary: {
    totalCollected: number;
    totalRent: number;
    totalCharges: number;
    transactionCount: number;
    tenantCount: number;
  };
  transactions: EReportingTransaction[];
  aggregatedByTenant: AggregatedTenant[];
}

const MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

function buildPropertyAddress(property: {
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  postalCode: string;
}): string {
  const parts = [property.addressLine1];
  if (property.addressLine2) parts.push(property.addressLine2);
  parts.push(`${property.postalCode} ${property.city}`);
  return parts.join(", ");
}

function buildDeclarantAddress(user: {
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  postalCode: string;
  country: string;
}): string {
  const parts = [user.addressLine1];
  if (user.addressLine2) parts.push(user.addressLine2);
  parts.push(`${user.postalCode} ${user.city}`);
  if (user.country && user.country !== "France") parts.push(user.country);
  return parts.filter(Boolean).join(", ");
}

export async function GET(request: NextRequest) {
  let userId: string;
  try {
    userId = await getCurrentUserId();
  } catch {
    return NextResponse.json(
      { error: "Non authentifié" },
      { status: 401 },
    );
  }

  const { searchParams } = request.nextUrl;
  const month = searchParams.get("month");
  const format = searchParams.get("format") ?? "json";

  if (!month || !MONTH_REGEX.test(month)) {
    return NextResponse.json(
      { error: "Paramètre 'month' requis au format YYYY-MM" },
      { status: 400 },
    );
  }

  if (format !== "json" && format !== "csv") {
    return NextResponse.json(
      { error: "Format invalide. Valeurs acceptées : json, csv" },
      { status: 400 },
    );
  }

  const [yearStr, monthStr] = month.split("-");
  const year = parseInt(yearStr, 10);
  const monthNum = parseInt(monthStr, 10);
  const monthStart = new Date(Date.UTC(year, monthNum - 1, 1));
  const monthEnd = new Date(Date.UTC(year, monthNum, 1));

  const periodStart = monthStart.toISOString().slice(0, 10);
  const lastDay = new Date(Date.UTC(year, monthNum, 0));
  const periodEnd = lastDay.toISOString().slice(0, 10);

  try {
    const [user, transactions] = await Promise.all([
      prisma.user.findUniqueOrThrow({ where: { id: userId } }),
      prisma.transaction.findMany({
        where: {
          userId,
          status: "PAID",
          paidAt: { gte: monthStart, lt: monthEnd },
        },
        include: {
          lease: {
            include: {
              tenant: true,
              property: true,
            },
          },
        },
        orderBy: { paidAt: "asc" },
      }),
    ]);

    // Build flat transaction list
    const txList: EReportingTransaction[] = transactions.map((tx) => ({
      tenantId: tx.lease.tenant.id,
      tenantName: `${tx.lease.tenant.firstName} ${tx.lease.tenant.lastName}`,
      propertyAddress: buildPropertyAddress(tx.lease.property),
      rentAmount: tx.rentPortion,
      chargesAmount: tx.chargesPortion,
      totalAmount: tx.amount,
      paidAt: tx.paidAt!.toISOString(),
      receiptType: tx.receiptType ?? "NON_ÉMIS",
      receiptNumber: tx.receiptNumber,
      paymentMethod: tx.paymentMethod,
    }));

    // Aggregate by tenant
    const tenantMap = new Map<string, AggregatedTenant>();
    for (const tx of txList) {
      const existing = tenantMap.get(tx.tenantId);
      if (existing) {
        existing.totalCollected += tx.totalAmount;
        existing.totalRent += tx.rentAmount;
        existing.totalCharges += tx.chargesAmount;
        existing.paymentCount += 1;
        if (tx.receiptNumber) existing.receiptNumbers.push(tx.receiptNumber);
      } else {
        tenantMap.set(tx.tenantId, {
          tenantId: tx.tenantId,
          tenantName: tx.tenantName,
          propertyAddress: tx.propertyAddress,
          totalCollected: tx.totalAmount,
          totalRent: tx.rentAmount,
          totalCharges: tx.chargesAmount,
          paymentCount: 1,
          receiptNumbers: tx.receiptNumber ? [tx.receiptNumber] : [],
        });
      }
    }

    const aggregatedByTenant = Array.from(tenantMap.values());

    const totalCollected = txList.reduce((s, t) => s + t.totalAmount, 0);
    const totalRent = txList.reduce((s, t) => s + t.rentAmount, 0);
    const totalCharges = txList.reduce((s, t) => s + t.chargesAmount, 0);

    const payload: EReportingExport = {
      metadata: {
        exportDate: new Date().toISOString(),
        period: month,
        periodStart,
        periodEnd,
        declarant: {
          name: `${user.firstName} ${user.lastName}`,
          address: buildDeclarantAddress(user),
        },
        regime: "B2C",
        currency: "EUR",
        vatExempt: true,
        vatExemptReason:
          "Article 261-D-2° du CGI — Location de locaux d'habitation",
      },
      summary: {
        totalCollected: Math.round(totalCollected * 100) / 100,
        totalRent: Math.round(totalRent * 100) / 100,
        totalCharges: Math.round(totalCharges * 100) / 100,
        transactionCount: txList.length,
        tenantCount: tenantMap.size,
      },
      transactions: txList,
      aggregatedByTenant,
    };

    if (format === "csv") {
      const header =
        "Période,Locataire,Bien,Loyer,Charges,Total,Date paiement,Type reçu,N° reçu";
      const rows = txList.map((tx) => {
        const paidDate = tx.paidAt.slice(0, 10);
        const escapeCsv = (v: string) =>
          v.includes(",") || v.includes('"')
            ? `"${v.replace(/"/g, '""')}"`
            : v;
        return [
          month,
          escapeCsv(tx.tenantName),
          escapeCsv(tx.propertyAddress),
          tx.rentAmount.toFixed(2),
          tx.chargesAmount.toFixed(2),
          tx.totalAmount.toFixed(2),
          paidDate,
          tx.receiptType,
          tx.receiptNumber ?? "",
        ].join(",");
      });
      const csv = [header, ...rows].join("\n");
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="e-reporting-b2c-${month}.csv"`,
        },
      });
    }

    return NextResponse.json(payload);
  } catch (error) {
    console.error("E-reporting export error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du rapport" },
      { status: 500 },
    );
  }
}
