import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { generateDepositReturn } from "@/lib/actions/deposit-return-actions";
import { addDays } from "date-fns";

/**
 * POST /api/documents/deposit-return
 * Generate a deposit return / settlement form (Décompte de Dépôt de Garantie).
 *
 * Body: {
 *   leaseId: string;
 *   deductions?: Array<{ description: string; amount: number }>;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { leaseId, deductions = [] } = body;

    if (!leaseId) {
      return NextResponse.json(
        { error: "leaseId est requis." },
        { status: 400 }
      );
    }

    // Basic validation
    for (const d of deductions) {
      if (!d.description || typeof d.amount !== "number") {
        return NextResponse.json(
          { error: "Chaque déduction doit avoir description (string) et amount (number)." },
          { status: 400 }
        );
      }
    }

    const result = await generateDepositReturn(leaseId, deductions);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ data: result.data }, { status: 201 });
  } catch (error) {
    console.error("POST /api/documents/deposit-return error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
