import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { generateChecklist, DEFAULT_CHECKLIST_ITEMS } from "@/lib/actions/checklist-actions";
import type { ChecklistType } from "@/lib/checklist-generator";

/**
 * POST /api/documents/checklist
 * Generate a move-in or move-out checklist PDF.
 *
 * Body: {
 *   leaseId: string;
 *   type: "ENTRY" | "EXIT";
 *   inspectionDate?: string (ISO);
 *   items?: ChecklistItem[];
 *   generalComment?: string;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { leaseId, type, inspectionDate, items, generalComment } = body;

    if (!leaseId || !type) {
      return NextResponse.json(
        { error: "leaseId et type sont requis." },
        { status: 400 }
      );
    }

    if (!["ENTRY", "EXIT"].includes(type)) {
      return NextResponse.json(
        { error: "type doit être ENTRY ou EXIT." },
        { status: 400 }
      );
    }

    const result = await generateChecklist(
      leaseId,
      type as ChecklistType,
      items,
      inspectionDate ? new Date(inspectionDate) : undefined,
      generalComment
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ data: result.data }, { status: 201 });
  } catch (error) {
    console.error("POST /api/documents/checklist error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

/**
 * GET /api/documents/checklist
 * Returns the default checklist item template (for pre-filling UI).
 */
export async function GET() {
  return NextResponse.json({
    data: {
      items: DEFAULT_CHECKLIST_ITEMS,
      categories: [...new Set(DEFAULT_CHECKLIST_ITEMS.map((i) => i.category))],
    },
  });
}
