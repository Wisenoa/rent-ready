import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth";
import { generateRentFollowUpDraft } from "@/lib/ai/lease-analyzer";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { format } from "date-fns";

const requestSchema = z.object({
  leaseId: z.string(),
  tone: z.enum(["friendly", "formal", "legal"]).default("formal"),
});

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    const body = await request.json();
    const { leaseId, tone } = requestSchema.parse(body);

    const lease = await prisma.lease.findFirst({
      where: { id: leaseId, userId },
      include: {
        tenant: true,
        property: true,
        transactions: {
          where: { status: { in: ["PENDING", "LATE", "PARTIAL"] } },
          orderBy: { dueDate: "asc" },
          take: 1,
        },
      },
    });

    if (!lease) {
      return NextResponse.json({ error: "Lease not found" }, { status: 404 });
    }

    const overdueTransaction = lease.transactions[0];
    if (!overdueTransaction) {
      return NextResponse.json(
        { error: "No overdue transactions found for this lease" },
        { status: 400 }
      );
    }

    const daysLate = Math.floor(
      (Date.now() - overdueTransaction.dueDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const previousAttempts = await prisma.document.count({
      where: {
        userId,
        type: "OTHER",
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const draft = await generateRentFollowUpDraft(
      `${lease.tenant.firstName} ${lease.tenant.lastName}`,
      lease.property.addressLine1,
      overdueTransaction.amount,
      format(overdueTransaction.dueDate, "d MMMM yyyy", { locale: undefined }),
      daysLate,
      previousAttempts,
      tone
    );

    return NextResponse.json({ draft });
  } catch (error) {
    console.error("Follow-up draft error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate follow-up draft" },
      { status: 500 }
    );
  }
}