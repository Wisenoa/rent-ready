import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { reminderSchema } from "@/lib/validations/reminder";

// ============================================================
// GET /api/reminders — List reminders for the user
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10)));
    const skip = (page - 1) * limit;
    const status = searchParams.get("status"); // PENDING, COMPLETED, SNOOZED, CANCELLED
    const type = searchParams.get("type");
    const priority = searchParams.get("priority");
    const leaseId = searchParams.get("leaseId");
    const propertyId = searchParams.get("propertyId");
    const overdue = searchParams.get("overdue"); // "true" = dueDate < now AND status = PENDING

    const where: Record<string, unknown> = { userId: session.user.id };
    if (status) where.status = status;
    if (type) where.type = type;
    if (priority) where.priority = priority;
    if (leaseId) where.leaseId = leaseId;
    if (propertyId) where.propertyId = propertyId;
    if (overdue === "true") {
      where.dueDate = { lt: new Date() };
      where.status = "PENDING";
    }

    const [reminders, total] = await Promise.all([
      prisma.reminder.findMany({
        where,
        include: {
          property: { select: { id: true, name: true, city: true } },
          tenant: { select: { id: true, firstName: true, lastName: true } },
          lease: {
            select: {
              id: true,
              property: { select: { id: true, name: true } },
              tenant: { select: { id: true, firstName: true, lastName: true } },
            },
          },
        },
        orderBy: { dueDate: "asc" },
        skip,
        take: limit,
      }),
      prisma.reminder.count({ where }),
    ]);

    return NextResponse.json({
      data: reminders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/reminders error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// POST /api/reminders — Create a new reminder
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = reminderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    // Verify ownership of associated resources
    if (parsed.data.leaseId) {
      const lease = await prisma.lease.findFirst({
        where: { id: parsed.data.leaseId, userId: session.user.id },
      });
      if (!lease) {
        return NextResponse.json(
          { error: "Bail introuvable ou accès non autorisé" },
          { status: 404 }
        );
      }
    }

    if (parsed.data.propertyId) {
      const property = await prisma.property.findFirst({
        where: { id: parsed.data.propertyId, userId: session.user.id, deletedAt: null },
      });
      if (!property) {
        return NextResponse.json(
          { error: "Bien introuvable ou accès non autorisé" },
          { status: 404 }
        );
      }
    }

    if (parsed.data.tenantId) {
      const tenant = await prisma.tenant.findFirst({
        where: { id: parsed.data.tenantId, userId: session.user.id },
      });
      if (!tenant) {
        return NextResponse.json(
          { error: "Locataire introuvable ou accès non autorisé" },
          { status: 404 }
        );
      }
    }

    // Compute nextDueDate for recurring reminders
    let nextDueDate: Date | null = null;
    if (parsed.data.isRecurring && parsed.data.recurringInterval) {
      const dueDate = new Date(parsed.data.dueDate);
      nextDueDate = new Date(dueDate);
      nextDueDate.setDate(nextDueDate.getDate() + parsed.data.recurringInterval);
    }

    const reminder = await prisma.reminder.create({
      data: {
        userId: session.user.id,
        leaseId: parsed.data.leaseId || null,
        propertyId: parsed.data.propertyId || null,
        tenantId: parsed.data.tenantId || null,
        type: parsed.data.type,
        title: parsed.data.title,
        description: parsed.data.description || null,
        dueDate: new Date(parsed.data.dueDate),
        isRecurring: parsed.data.isRecurring,
        recurringInterval: parsed.data.recurringInterval ?? null,
        nextDueDate,
        priority: parsed.data.priority,
      },
    });

    return NextResponse.json({ data: reminder }, { status: 201 });
  } catch (error) {
    console.error("POST /api/reminders error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
