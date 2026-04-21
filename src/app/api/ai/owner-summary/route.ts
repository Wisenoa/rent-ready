import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth";
import { generateOwnerMonthlySummary } from "@/lib/ai/owner-monthly-summary";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { rateLimit, getClientIp, setRateLimitHeaders } from "@/lib/rate-limit";

const requestSchema = z.object({
  propertyId: z.string().optional(), // If not provided, uses all properties
  month: z.number().min(1).max(12), // 1-12
  year: z.number().min(2020).max(2050),
});

/**
 * POST /api/ai/owner-summary
 * Generate AI-powered monthly summary for property owner
 */
export async function POST(request: NextRequest) {
  // Rate limit: 20 req/min per IP for unauthenticated, 1000 for authenticated
  const ip = getClientIp(request.headers);
  const userId = await getAuthenticatedUserId().catch(() => null);
  const limit = userId ? 1000 : 20;
  const result = await rateLimit(ip, { limit, window: 60 });

  if (!result.success) {
    const res = NextResponse.json(
      { error: "Trop de requêtes. Veuillez patienter avant de réessayer." },
      { status: 429 }
    );
    setRateLimitHeaders(res, result);
    return res;
  }

  try {
    const authUserId = await getAuthenticatedUserId();
    const body = await request.json();
    const { propertyId, month, year } = requestSchema.parse(body);

    // Build property filter
    const propertyFilter: Record<string, unknown> = { userId: authUserId };
    if (propertyId) {
      propertyFilter.id = propertyId;
    }

    // Fetch properties
    const properties = await prisma.property.findMany({
      where: propertyFilter,
      include: {
        leases: {
          where: { status: "ACTIVE" },
          include: {
            tenant: true,
            transactions: {
              where: {
                periodStart: {
                  gte: new Date(year, month - 1, 1),
                  lt: new Date(year, month, 1),
                },
              },
            },
          },
        },
        maintenanceTickets: {
          where: {
            createdAt: {
              gte: new Date(year, month - 1, 1),
              lt: new Date(year, month, 1),
            },
          },
        },
      },
    });

    // Fetch expenses
    const expenses = await prisma.expense.findMany({
      where: {
        userId: authUserId,
        date: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1),
        },
      },
      select: {
        amount: true,
        category: true,
        date: true,
        description: true,
      },
    });

    // Aggregate transactions for the month
    const transactions = properties.flatMap((property) =>
      property.leases.flatMap((lease) =>
        lease.transactions.map((transaction) => ({
          amount: transaction.amount,
          rentPortion: transaction.rentPortion,
          chargesPortion: transaction.chargesPortion,
          status: transaction.status,
          periodStart: transaction.periodStart,
          paidAt: transaction.paidAt,
          propertyName: property.name,
        }))
      )
    );

    // Aggregate maintenance tickets
    const maintenanceTickets = properties.flatMap((property) =>
      property.maintenanceTickets.map((ticket) => ({
        title: ticket.title,
        status: ticket.status,
        priority: ticket.priority,
        createdAt: ticket.createdAt,
        propertyName: property.name,
      }))
    );

    // Prepare property data
    const propertyData = properties.map((property) => {
      const activeLease = property.leases.find((lease) => lease.status === "ACTIVE");
      return {
        name: property.name,
        type: property.type,
        status: activeLease ? "OCCUPIED" : "VACANT",
        monthlyRent: activeLease?.rentAmount || 0,
        occupancyStatus: activeLease ? `Occupied by ${activeLease.tenant.firstName} ${activeLease.tenant.lastName}` : "Vacant",
      };
    });

    // Generate AI summary
    const monthNames = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    const summary = await generateOwnerMonthlySummary({
      properties: propertyData,
      transactions,
      expenses: expenses.map((expense) => ({
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        description: expense.description,
      })),
      maintenanceTickets,
      month: monthNames[month - 1],
      year,
    });

    return NextResponse.json({
      success: true,
      summary,
      metadata: {
        propertyCount: properties.length,
        transactionCount: transactions.length,
        expenseCount: expenses.length,
        maintenanceTicketCount: maintenanceTickets.length,
        month,
        year,
      },
    });
  } catch (error) {
    console.error("Owner monthly summary error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate monthly summary" },
      { status: 500 }
    );
  }
}