import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: Promise<{ id: string }> };

// ============================================================
// GET /api/leases/[id]/payments — List all payments for a lease
// Query params:
//   status    TransactionStatus  (optional) filter by PAID, PARTIAL, PENDING, LATE, CANCELLED
//   page      number            (optional, default: 1)
//   limit     number            (optional, default: 50, max: 100)
// ============================================================
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10)));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { leaseId: id };
    if (status) where.status = status;

    // Single query: fetch lease + transactions together.
    // Authorization enforced by checking lease.userId matches session user.
    // Uses a subquery approach: first verify lease ownership, then fetch transactions.
    const [lease, transactions, total] = await Promise.all([
      prisma.lease.findFirst({
        where: { id, userId: session.user.id },
        select: {
          id: true,
          property: { select: { id: true, name: true } },
          tenant: { select: { id: true, firstName: true, lastName: true } },
        },
      }),
      prisma.transaction.findMany({
        where,
        orderBy: { dueDate: "desc" },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    if (!lease) {
      return NextResponse.json({ error: "Bail introuvable" }, { status: 404 });
    }

    return NextResponse.json({
      data: transactions,
      lease: {
        id: lease.id,
        property: lease.property,
        tenant: lease.tenant,
      },
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/leases/[id]/payments error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
