import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const maintenanceSchema = z.object({
  token: z.string(),
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional().default("MEDIUM"),
  attachments: z.array(z.object({
    fileName: z.string(),
    fileUrl: z.string().url(),
    fileType: z.string(),
    fileSize: z.number(),
  })).optional(),
});

/**
 * POST /api/tenant/maintenance
 * Submit a maintenance ticket from tenant portal
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = maintenanceSchema.parse(body);

    // Validate and get tenant from token
    const accessToken = await prisma.tenantAccessToken.findUnique({
      where: { token: validatedData.token },
      include: { tenant: true },
    });

    if (!accessToken) {
      return NextResponse.json(
        { error: "Invalid access token" },
        { status: 401 }
      );
    }

    // Check if token is expired
    if (accessToken.expiresAt && new Date() > accessToken.expiresAt) {
      return NextResponse.json(
        { error: "Access token has expired" },
        { status: 401 }
      );
    }

    // Update last used
    await prisma.tenantAccessToken.update({
      where: { id: accessToken.id },
      data: { lastUsedAt: new Date() },
    });

    // Get the active lease to find the property
    const activeLease = await prisma.lease.findFirst({
      where: {
        tenantId: accessToken.tenantId,
        status: "ACTIVE",
      },
      select: {
        id: true,
        propertyId: true,
        userId: true,
      },
    });

    if (!activeLease) {
      return NextResponse.json(
        { error: "No active lease found for tenant" },
        { status: 404 }
      );
    }

    // Create maintenance ticket
    const ticket = await prisma.maintenanceTicket.create({
      data: {
        tenantId: accessToken.tenantId,
        propertyId: activeLease.propertyId,
        title: validatedData.title,
        description: validatedData.description,
        priority: validatedData.priority,
        status: "OPEN",
        ...(validatedData.attachments && validatedData.attachments.length > 0 && {
          attachments: {
            create: validatedData.attachments.map((attachment) => ({
              fileName: attachment.fileName,
              fileUrl: attachment.fileUrl,
              fileType: attachment.fileType,
              fileSize: attachment.fileSize,
            })),
          },
        }),
      },
      include: {
        attachments: true,
        property: {
          select: {
            id: true,
            name: true,
            addressLine1: true,
            city: true,
          },
        },
      },
    });

    // Get owner info for notification
    const owner = await prisma.user.findUnique({
      where: { id: activeLease.userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    // TODO: Send notification to owner (email/real-time)
    // This would integrate with notification system

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        property: ticket.property,
        attachments: ticket.attachments,
        createdAt: ticket.createdAt,
      },
    });
  } catch (error) {
    console.error("Maintenance ticket creation error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create maintenance ticket" },
      { status: 500 }
    );
  }
}