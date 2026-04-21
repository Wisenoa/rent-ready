import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@/lib/email/service";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const RequestBodySchema = z.object({
  type: z.enum(["rent-reminder", "lease-expiry"]),
  /** Transaction ID for rent-reminder emails */
  transactionId: z.string().optional(),
  /** Lease ID for lease-expiry emails */
  leaseId: z.string().optional(),
  /** Tone for rent-reminder: "friendly" | "formal" | "legal" */
  tone: z.enum(["friendly", "formal", "legal"]).default("friendly"),
});

/**
 * POST /api/email/cron-dispatch
 *
 * Cron endpoint for batch transactional email dispatch.
 * Called daily by an external cron job (GitHub Actions, Vercel Cron, etc.)
 * to send rent payment reminders and lease expiry notices.
 *
 * Security: requires Bearer token matching CRON_SECRET env var.
 */
export async function POST(request: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────────
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // ── Parse body ──────────────────────────────────────────────────────────────
  let body: z.infer<typeof RequestBodySchema>;
  try {
    body = RequestBodySchema.parse(await request.json());
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.flatten() },
        { status: 422 }
      );
    }
    throw error;
  }

  const { type, transactionId, leaseId, tone } = body;

  // ── Dispatch ────────────────────────────────────────────────────────────────
  try {
    if (type === "rent-reminder") {
      if (!transactionId) {
        return NextResponse.json(
          { error: "transactionId is required for rent-reminder emails" },
          { status: 422 }
        );
      }
      await emailService.sendRentReminderEmail(transactionId, tone);
      return NextResponse.json({ sent: true, type, transactionId, tone }, { status: 200 });
    }

    if (type === "lease-expiry") {
      if (!leaseId) {
        return NextResponse.json(
          { error: "leaseId is required for lease-expiry emails" },
          { status: 422 }
        );
      }
      await emailService.sendLeaseExpiryEmail(leaseId);
      return NextResponse.json({ sent: true, type, leaseId }, { status: 200 });
    }

    return NextResponse.json({ error: "Unknown email type" }, { status: 400 });
  } catch (error) {
    console.error(`[cron-dispatch] Failed to send ${type} email:`, error);
    return NextResponse.json(
      { error: "Failed to send email", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/email/cron-dispatch
 *
 * Health-check / dry-run for the cron email dispatcher.
 * Lists what email types are supported without sending anything.
 */
export async function GET() {
  return NextResponse.json({
    supportedTypes: [
      {
        type: "rent-reminder",
        description: "Send a rent payment reminder email to a tenant",
        requiredFields: ["transactionId"],
        optionalFields: ["tone (friendly | formal | legal)"],
      },
      {
        type: "lease-expiry",
        description: "Send a lease expiry warning email to the landlord",
        requiredFields: ["leaseId"],
        optionalFields: [],
      },
    ],
  });
}
