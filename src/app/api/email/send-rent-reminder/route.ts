import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth-server";
import { emailService } from "@/lib/email/service";
import { z, ZodError } from "zod";

const RequestBodySchema = z.object({
  transactionId: z.string().min(1, "transactionId is required"),
  tone: z.enum(["friendly", "formal", "legal"]).default("friendly"),
});

/**
 * POST /api/email/send-rent-reminder
 *
 * Sends a rent payment reminder email to the tenant associated
 * with a given transaction.
 *
 * Requires authentication — only the landlord / organization owner
 * can trigger reminders for their own tenants.
 */
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { transactionId, tone } = RequestBodySchema.parse(body);

    const owned = await prisma.transaction.findFirst({ where: { id: transactionId, userId: session.user.id }, select: { id: true } });
    if (!owned) return NextResponse.json({ error: "Ressource introuvable" }, { status: 404 });

    const result = await emailService.sendRentReminderEmail(transactionId, tone);
    if (result.status !== "sent") return NextResponse.json({ error: result.detail }, { status: 400 });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[send-rent-reminder] Error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.flatten() },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { error: "Failed to send rent reminder email" },
      { status: 500 }
    );
  }
}
