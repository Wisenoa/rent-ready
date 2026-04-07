import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/tenant/quittances
 * Returns payment receipts (quittances) for tenant portal
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");
    
    if (!token) {
      return NextResponse.json(
        { error: "Token required for tenant portal access" },
        { status: 400 }
      );
    }

    // Validate and get tenant from token
    const accessToken = await prisma.tenantAccessToken.findUnique({
      where: { token },
      include: { tenant: true },
    });

    if (!accessToken) {
      return NextResponse.json(
        { error: "Invalid access token" },
        { status: 401 }
      );
    }

    // Check if token is expired
    if (accessToken.expiresAt && new Date() > accessToken.expiresAt) {
      return NextResponse.json(
        { error: "Access token has expired" },
        { status: 401 }
      );
    }

    // Update last used
    await prisma.tenantAccessToken.update({
      where: { id: accessToken.id },
      data: { lastUsedAt: new Date() },
    });

    // Get query parameters for filtering
    const year = url.searchParams.get("year");
    const status = url.searchParams.get("status"); // PAID, PENDING, LATE

    // Build filter conditions
    const whereConditions: Record<string, unknown> = {
      lease: {
        tenantId: accessToken.tenantId,
        status: "ACTIVE",
      },
    };

    // Add year filter if provided
    if (year) {
      const yearNum = parseInt(year, 10);
      whereConditions.periodStart = {
        gte: new Date(yearNum, 0, 1),
        lt: new Date(yearNum + 1, 0, 1),
      };
    }

    // Add status filter if provided
    if (status && ["PAID", "PENDING", "LATE"].includes(status)) {
      whereConditions.status = status;
    }

    // Fetch transactions (quittances)
    const transactions = await prisma.transaction.findMany({
      where: whereConditions,
      include: {
        lease: {
          include: {
            property: {
              select: {
                id: true,
                name: true,
                addressLine1: true,
                city: true,
                postalCode: true,
              },
            },
          },
        },
      },
      orderBy: {
        periodStart: "desc",
      },
    });

    // Group by month for easier display
    const groupedByMonth: Record<string, Array<{
      id: string;
      periodStart: Date;
      periodEnd: Date;
      amount: number;
      rentPortion: number;
      chargesPortion: number;
      status: string;
      paidAt: Date | null;
      receiptUrl: string | null;
      receiptNumber: string | null;
      propertyName: string;
      propertyAddress: string;
    }>> = {};

    for (const transaction of transactions) {
      const monthYear = `${transaction.periodStart.getFullYear()}-${String(
        transaction.periodStart.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!groupedByMonth[monthYear]) {
        groupedByMonth[monthYear] = [];
      }

      groupedByMonth[monthYear].push({
        id: transaction.id,
        periodStart: transaction.periodStart,
        periodEnd: transaction.periodEnd,
        amount: transaction.amount,
        rentPortion: transaction.rentPortion,
        chargesPortion: transaction.chargesPortion,
        status: transaction.status,
        paidAt: transaction.paidAt,
        receiptUrl: transaction.receiptUrl,
        receiptNumber: transaction.receiptNumber,
        propertyName: transaction.lease.property.name,
        propertyAddress: `${transaction.lease.property.addressLine1}, ${transaction.lease.property.city}`,
      });
    }

    // Calculate summary statistics
    const summary = {
      totalPaid: transactions
        .filter((t) => t.status === "PAID")
        .reduce((sum, t) => sum + t.amount, 0),
      totalPending: transactions
        .filter((t) => t.status === "PENDING")
        .reduce((sum, t) => sum + t.amount, 0),
      totalLate: transactions
        .filter((t) => t.status === "LATE")
        .reduce((sum, t) => sum + t.amount, 0),
      count: {
        paid: transactions.filter((t) => t.status === "PAID").length,
        pending: transactions.filter((t) => t.status === "PENDING").length,
        late: transactions.filter((t) => t.status === "LATE").length,
      },
    };

    return NextResponse.json({
      quittances: groupedByMonth,
      summary,
      total: transactions.length,
    });
  } catch (error) {
    console.error("Tenant quittances fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment receipts" },
      { status: 500 }
    );
  }
}