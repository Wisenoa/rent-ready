import { NextRequest, NextResponse } from "next/server";
import { generateQuittance } from "@/lib/actions/quittance-actions";

/**
 * POST /api/transactions/[id]/receipt
 * Generate a quittance PDF for a transaction.
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const result = await generateQuittance(id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    console.error("POST /api/transactions/[id]/receipt error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération de la quittance." },
      { status: 500 }
    );
  }
}
