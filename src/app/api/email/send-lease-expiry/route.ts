import { NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { emailService } from "@/lib/email/service";
import { z, ZodError } from "zod";

const RequestBodySchema = z.object({
  leaseId: z.string().min(1, "leaseId is required"),
});

/**
 * POST /api/email/send-lease-expiry
 *
 * Sends a lease expiry warning email to the landlord associated
 * with a given lease.
 *
 * Requires authentication.
 */
export async function POST(request: Request) {
  try {
    const session = await auth.getSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { leaseId } = RequestBodySchema.parse(body);

    await emailService.sendLeaseExpiryEmail(leaseId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[send-lease-expiry] Error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.flatten() },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { error: "Failed to send lease expiry email" },
      { status: 500 }
    );
  }
}
