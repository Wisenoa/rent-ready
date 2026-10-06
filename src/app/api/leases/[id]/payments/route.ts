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

    // Ownership is resolved BEFORE anything is read, and the transaction read is
    // scoped by the session's own userId as well as the leaseId.
    //
    // This used to be a `Promise.all` of the lease check and two transaction
    // queries filtered on `leaseId` alone. Nothing was leaked in the response —
    // the 404 short-circuited it — but the rows were still read before anyone
    // established that the caller owned the lease, and the ownership check was
    // not structural (AGENTS.md 8). Knowing a lease id was enough to make the
    // server load another landlord's rent rows into memory, and any future
    // logging or timing on that path would have carried them. Scoping the
    // transaction query by `userId` makes the read itself refuse.
    const lease = await prisma.lease.findFirst({
      where: { id, userId: session.user.id },
      select: {
        id: true,
        property: { select: { id: true, name: true } },
        tenant: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    if (!lease) {
      return NextResponse.json({ error: "Bail introuvable" }, { status: 404 });
    }

    const where: Record<string, unknown> = {
      leaseId: id,
      userId: session.user.id,
    };
    if (status) where.status = status;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { dueDate: "desc" },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

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
