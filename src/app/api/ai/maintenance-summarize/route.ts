import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth";
import { summarizeMaintenanceTicket } from "@/lib/ai/maintenance-summarizer";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const requestSchema = z.object({
  ticketId: z.string().optional(),
  title: z.string().min(5).optional(),
  description: z.string().min(10).optional(),
  propertyId: z.string().optional(),
});

/**
 * POST /api/ai/maintenance-summarize
 * Use AI to summarize and categorize a maintenance ticket
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    const body = await request.json();
    const { ticketId, title, description, propertyId } = requestSchema.parse(body);

    let ticketTitle = title;
    let ticketDescription = description;
    let propertyInfo:
      | { type?: string; surface?: number; rooms?: number; age?: number }
      | undefined;

    // If ticketId provided, fetch existing ticket
    if (ticketId) {
      const ticket = await prisma.maintenanceTicket.findFirst({
        where: {
          id: ticketId,
          property: { userId },
        },
        include: {
          property: {
            select: {
              type: true,
              surface: true,
              rooms: true,
            },
          },
        },
      });

      if (!ticket) {
        return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
      }

      ticketTitle = ticket.title;
      ticketDescription = ticket.description;
      
      // Calculate property age (approximate)
      const property = ticket.property;
      propertyInfo = {
        type: property.type,
        surface: property.surface || undefined,
        rooms: property.rooms || undefined,
      };
    } else if (!title || !description) {
      return NextResponse.json(
        { error: "Either ticketId or both title and description must be provided" },
        { status: 400 }
      );
    }

    // Get property info if propertyId provided
    if (propertyId && !propertyInfo) {
      const property = await prisma.property.findFirst({
        where: { id: propertyId, userId },
        select: { type: true, surface: true, rooms: true },
      });
      if (property) {
        propertyInfo = {
          type: property.type,
          surface: property.surface || undefined,
          rooms: property.rooms || undefined,
        };
      }
    }

    // Generate AI summary
    const summary = await summarizeMaintenanceTicket(
      ticketTitle!,
      ticketDescription!,
      propertyInfo
    );

    // If ticketId provided, update the ticket with AI analysis
    if (ticketId) {
      await prisma.maintenanceTicket.update({
        where: { id: ticketId },
        data: {
          priority: summary.urgency,
        },
      });
    }

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error("Maintenance summarization error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to summarize maintenance ticket" },
      { status: 500 }
    );
  }
}