import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth";
import { sendPaymentReminder } from "@/lib/actions/transaction-actions";
import { z } from "zod";

const requestSchema = z.object({
  transactionId: z.string(),
  tone: z.enum(["friendly", "formal", "legal"]).default("formal"),
});

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    const body = await request.json();
    const { transactionId, tone } = requestSchema.parse(body);

    const result = await sendPaymentReminder(transactionId, tone);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    console.error("Reminders send error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request", details: error.issues }, { status: 400 });
    }

    return NextResponse.json({ error: "Failed to send reminder" }, { status: 500 });
  }
}