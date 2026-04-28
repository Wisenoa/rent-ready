import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { reminderSchema } from "@/lib/validations/reminder";

type RouteParams = { params: Promise<{ id: string }> };

// ============================================================
// GET /api/reminders/[id]
// ============================================================
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const reminder = await prisma.reminder.findFirst({
      where: { id, userId: session.user.id },
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
    });

    if (!reminder) {
      return NextResponse.json({ error: "Rappel introuvable" }, { status: 404 });
    }

    return NextResponse.json({ data: reminder });
  } catch (error) {
    console.error("GET /api/reminders/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// PATCH /api/reminders/[id] — Update or transition reminder status
// ============================================================
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.reminder.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Rappel introuvable" }, { status: 404 });
    }

    const body = await request.json();

    // Support status-only transitions (complete, snooze, cancel)
    // without requiring the full schema
    if (Object.keys(body).length === 1 && body.status) {
      if (!["PENDING", "COMPLETED", "SNOOZED", "CANCELLED"].includes(body.status)) {
        return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
      }
      const completedAt = body.status === "COMPLETED" ? new Date() : null;
      const snoozedUntil = body.status === "SNOOZED" && body.snoozedUntil
        ? new Date(body.snoozedUntil)
        : existing.snoozedUntil;

      // For COMPLETED + recurring: compute next due date
      let nextDueDate = existing.nextDueDate;
      if (body.status === "COMPLETED" && existing.isRecurring && existing.recurringInterval) {
        const base = existing.dueDate < new Date() ? new Date() : new Date(existing.dueDate);
        nextDueDate = new Date(base);
        nextDueDate.setDate(nextDueDate.getDate() + existing.recurringInterval);
      }

      const updated = await prisma.reminder.update({
        where: { id },
        data: {
          status: body.status,
          completedAt: completedAt ?? existing.completedAt,
          snoozedUntil: snoozedUntil,
          nextDueDate: nextDueDate ?? existing.nextDueDate,
        },
      });
      return NextResponse.json({ data: updated });
    }

    // Full update with validation
    const parsed = reminderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    // Verify ownership of associated resources if being changed
    if (parsed.data.leaseId && parsed.data.leaseId !== existing.leaseId) {
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

    if (parsed.data.propertyId && parsed.data.propertyId !== existing.propertyId) {
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

    if (parsed.data.tenantId && parsed.data.tenantId !== existing.tenantId) {
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

    // Recompute nextDueDate if recurring
    let nextDueDate = existing.nextDueDate;
    if (parsed.data.isRecurring && parsed.data.recurringInterval) {
      const dueDate = new Date(parsed.data.dueDate);
      nextDueDate = new Date(dueDate);
      nextDueDate.setDate(nextDueDate.getDate() + parsed.data.recurringInterval);
    }

    const updated = await prisma.reminder.update({
      where: { id },
      data: {
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

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PATCH /api/reminders/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// DELETE /api/reminders/[id]
// ============================================================
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.reminder.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Rappel introuvable" }, { status: 404 });
    }

    await prisma.reminder.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/reminders/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
