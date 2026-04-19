import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { maintenanceQuerySchema } from "@/lib/validations/maintenance";

// ============================================================
// GET /api/maintenance — List maintenance tickets for owner
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const raw = Object.fromEntries(searchParams.entries());
    const parsed = maintenanceQuerySchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Paramètres invalides" },
        { status: 400 }
      );
    }

    const { status, propertyId, priority, page, limit } = parsed.data;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      property: { userId: session.user.id },
    };
    if (status) where.status = status;
    if (propertyId) where.propertyId = propertyId;
    if (priority) where.priority = priority;

    const [tickets, total] = await Promise.all([
      prisma.maintenanceTicket.findMany({
        where,
        include: {
          tenant: { select: { id: true, firstName: true, lastName: true } },
          property: { select: { id: true, name: true, addressLine1: true, city: true } },
          unit: { select: { id: true, name: true } },
          attachments: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.maintenanceTicket.count({ where }),
    ]);

    return NextResponse.json({
      data: tickets,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/maintenance error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}