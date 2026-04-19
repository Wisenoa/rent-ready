import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { maintenanceTicketSchema } from "@/lib/validations/maintenance";

// ============================================================
// PATCH /api/maintenance/[id] — Update a maintenance ticket
// (status, priority, resolvedAt)
// ============================================================
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = maintenanceTicketSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    // Verify ticket exists and belongs to this user's property
    const existing = await prisma.maintenanceTicket.findUnique({
      where: { id },
      include: { property: { select: { userId: true } } },
    });

    if (!existing) {
      return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
    }

    if (existing.property.userId !== session.user.id) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    const updateData: Record<string, unknown> = {};
    if (parsed.data.status !== undefined) {
      updateData.status = parsed.data.status;
      // Auto-set resolvedAt when status becomes RESOLVED
      if (parsed.data.status === "RESOLVED" && !existing.resolvedAt) {
        updateData.resolvedAt = new Date();
      }
    }
    if (parsed.data.priority !== undefined) updateData.priority = parsed.data.priority;
    if (parsed.data.resolvedAt !== undefined) {
      updateData.resolvedAt = parsed.data.resolvedAt ? new Date(parsed.data.resolvedAt) : null;
    }

    const ticket = await prisma.maintenanceTicket.update({
      where: { id },
      data: updateData,
      include: {
        tenant: { select: { id: true, firstName: true, lastName: true } },
        property: { select: { id: true, name: true } },
        attachments: true,
      },
    });

    return NextResponse.json({ data: ticket });
  } catch (error) {
    console.error("PATCH /api/maintenance/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// GET /api/maintenance/[id] — Get single maintenance ticket
// ============================================================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const ticket = await prisma.maintenanceTicket.findUnique({
      where: { id },
      include: {
        tenant: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        property: { select: { id: true, name: true, addressLine1: true, city: true, userId: true } },
        unit: { select: { id: true, name: true } },
        attachments: true,
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
    }

    if (ticket.property.userId !== session.user.id) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    return NextResponse.json({ data: ticket });
  } catch (error) {
    console.error("GET /api/maintenance/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}