import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import Decimal from "decimal.js";

type RouteParams = { params: Promise<{ id: string }> };

// ============================================================
// GET /api/tenants/[id]/history
// Returns full tenant history: past leases, payment behavior, incidents
// ============================================================
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify tenant belongs to this landlord
    const tenant = await prisma.tenant.findFirst({
      where: { id, userId: session.user.id },
      select: { id: true, firstName: true, lastName: true },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: "Locataire introuvable" },
        { status: 404 }
      );
    }

    // Fetch all leases (past and present)
    const leases = await prisma.lease.findMany({
      where: { tenantId: id },
      include: {
        property: {
          select: { id: true, name: true, addressLine1: true, city: true },
        },
        transactions: {
          orderBy: { periodStart: "desc" },
        },
      },
      orderBy: { startDate: "desc" },
    });

    // Fetch all maintenance tickets
    const maintenanceTickets = await prisma.maintenanceTicket.findMany({
      where: { tenantId: id },
      include: {
        property: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch all communications for this tenant
    const messages = await prisma.message.findMany({
      where: { tenantId: id },
      select: {
        id: true,
        senderType: true,
        channel: true,
        subject: true,
        content: true,
        createdAt: true,
        isRead: true,
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // Compute payment behavior summary
    const allTransactions = leases.flatMap((l) => l.transactions);
    const paidTransactions = allTransactions.filter((t) => t.status === "PAID");
    const lateTransactions = allTransactions.filter((t) => t.status === "LATE");

    const totalPaid = paidTransactions.reduce(
      (sum, t) => sum + new Decimal(t.amount).toNumber(),
      0
    );
    const totalLate = lateTransactions.reduce(
      (sum, t) => sum + new Decimal(t.amount).toNumber(),
      0
    );

    const paymentBehavior = {
      totalPaid,
      totalLate,
      onTimeRate:
        allTransactions.length > 0
          ? Math.round(
              (paidTransactions.length / allTransactions.length) * 100
            )
          : 100,
      latePaymentCount: lateTransactions.length,
      totalTransactions: allTransactions.length,
    };

    // Incident summary
    const incidentSummary = {
      totalTickets: maintenanceTickets.length,
      openTickets: maintenanceTickets.filter((t) => t.status === "OPEN").length,
      urgentTickets: maintenanceTickets.filter(
        (t) => t.priority === "URGENT" && t.status !== "RESOLVED"
      ).length,
    };

    return NextResponse.json({
      data: {
        tenant,
        leases: leases.map((l) => ({
          id: l.id,
          property: l.property,
          startDate: l.startDate,
          endDate: l.endDate,
          rentAmount: l.rentAmount,
          status: l.status,
          transactionCount: l.transactions.length,
        })),
        paymentBehavior,
        incidentSummary,
        recentCommunications: messages,
        recentIncidents: maintenanceTickets.slice(0, 10),
      },
    });
  } catch (error) {
    console.error("GET /api/tenants/[id]/history error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
