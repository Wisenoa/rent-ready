import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

type RouteParams = { params: Promise<{ id: string }> };

const updateSchema = z.object({
  isRead: z.boolean().optional(),
  channel: z.enum(["EMAIL", "SMS", "LETTER", "CALL", "IN_APP", "OTHER"]).optional(),
  communicationType: z
    .enum(["RENTAL_INQUIRY", "LEASE_NEGOTIATION", "PAYMENT_REMINDER", "MAINTENANCE_REQUEST", "GENERAL", "LEGAL_NOTICE", "OTHER"])
    .optional(),
  subject: z.string().max(255).optional(),
});

// ============================================================
// PATCH /api/communications/[id]
// Mark message as read, update channel/type/subject
// ============================================================
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.issues },
        { status: 400 }
      );
    }

    // Verify ownership via conversation -> lease -> property
    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        conversation: {
          include: {
            lease: {
              include: { property: { select: { userId: true } } },
            },
          },
        },
      },
    });

    if (!message) {
      return NextResponse.json(
        { error: "Message introuvable" },
        { status: 404 }
      );
    }

    const property = message.conversation.lease.property;
    if (property.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    const updated = await prisma.message.update({
      where: { id },
      data: {
        ...(parsed.data.isRead !== undefined && { isRead: parsed.data.isRead }),
        ...(parsed.data.channel && { channel: parsed.data.channel }),
        ...(parsed.data.communicationType && {
          communicationType: parsed.data.communicationType,
        }),
        ...(parsed.data.subject !== undefined && { subject: parsed.data.subject }),
      },
      select: {
        id: true,
        isRead: true,
        channel: true,
        communicationType: true,
        subject: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PATCH /api/communications/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// DELETE /api/communications/[id]
// Hard delete a message (admin only — prefer archiving)
// ============================================================
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        conversation: {
          include: {
            lease: {
              include: { property: { select: { userId: true } } },
            },
          },
        },
      },
    });

    if (!message) {
      return NextResponse.json(
        { error: "Message introuvable" },
        { status: 404 }
      );
    }

    const property = message.conversation.lease.property;
    if (property.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    await prisma.message.delete({ where: { id } });

    return NextResponse.json({ data: { id } });
  } catch (error) {
    console.error("DELETE /api/communications/[id] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
