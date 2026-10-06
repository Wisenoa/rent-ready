import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { communicationLogSchema, communicationFilterSchema } from "@/lib/validations/communication";

// ============================================================
// GET /api/communications — List communication logs
// Filterable by tenant, date range, direction, channel, type
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parsed = communicationFilterSchema.safeParse(
      Object.fromEntries(searchParams.entries())
    );

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Paramètres invalides" },
        { status: 400 }
      );
    }

    const {
      tenantId,
      direction,
      channel,
      relatedEntityType,
      dateFrom,
      dateTo,
    } = parsed.data;

    const page = Math.max(
      1,
      parseInt(searchParams.get("page") ?? "1", 10)
    );
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10))
    );
    const skip = (page - 1) * limit;

    // Build filter — all communications belong to this landlord
    const where: Record<string, unknown> = { userId: session.user.id };

    if (tenantId) {
      where.tenantId = tenantId;
    }

    if (direction) {
      where.senderType = direction === "INBOUND" ? "TENANT" : "LANDLORD";
    }

    if (channel) {
      where.channel = channel;
    }

    if (relatedEntityType) {
      where.relatedEntityType = relatedEntityType;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        (where.createdAt as Record<string, Date>).gte = new Date(dateFrom);
      }
      if (dateTo) {
        (where.createdAt as Record<string, Date>).lte = new Date(dateTo);
      }
    }

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        include: {
          tenant: {
            select: { id: true, firstName: true, lastName: true },
          },
          conversation: {
            select: { id: true, leaseId: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.message.count({ where }),
    ]);

    return NextResponse.json({
      data: messages,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/communications error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// POST /api/communications — Create a communication log entry
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = communicationLogSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    const {
      tenantId,
      leaseId,
      direction,
      channel,
      communicationType,
      subject,
      body: messageBody,
      relatedEntityType,
      relatedEntityId,
    } = parsed.data;

    // Verify tenant belongs to landlord
    const tenant = await prisma.tenant.findFirst({
      where: { id: tenantId, userId: session.user.id },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: "Locataire introuvable" },
        { status: 404 }
      );
    }

    // Find or create conversation for this tenant
    let conversation = await prisma.conversation.findFirst({
      where: { tenantId, userId: session.user.id },
    });

    if (!conversation) {
      // Find an active lease for the tenant
      const lease = await prisma.lease.findFirst({
        where: { tenantId, userId: session.user.id, status: "ACTIVE" },
        select: { id: true },
      });

      if (!lease) {
        return NextResponse.json(
          { error: "Aucun bail actif trouvé pour ce locataire" },
          { status: 400 }
        );
      }

      conversation = await prisma.conversation.create({
        data: {
          tenantId,
          userId: session.user.id,
          leaseId: lease.id,
        },
      });
    }

    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        tenantId: direction === "INBOUND" ? tenantId : null,
        userId: direction === "OUTBOUND" ? session.user.id : null,
        senderType: direction === "INBOUND" ? "TENANT" : "LANDLORD",
        subject,
        content: messageBody,
        channel,
        communicationType,
        relatedEntityType,
        relatedEntityId,
      },
      include: {
        tenant: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    // Update conversation lastMessageAt
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    });

    return NextResponse.json({ data: message }, { status: 201 });
  } catch (error) {
    console.error("POST /api/communications error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
