import { NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { emailService } from "@/lib/email/service";
import { ZodError } from "zod";

/**
 * POST /api/email/send-welcome
 * Triggered by the frontend after first successful sign-in to send
 * the welcome email to a newly registered user.
 *
 * Requires a valid session cookie (authenticated request).
 */
export async function POST(request: Request) {
  try {
    // Validate session — only authenticated users can trigger their own welcome email
    const session = await auth.getSession(request);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await emailService.sendWelcomeEmail(session.user.id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[send-welcome] Error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.flatten() },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { error: "Failed to send welcome email" },
      { status: 500 }
    );
  }
}
