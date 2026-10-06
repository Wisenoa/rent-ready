import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/transactions/[id]/receipt/download — the archived receipt document.
 *
 * The UI used to call `generateQuittance` and then re-render the PDF in the
 * browser with @react-pdf/renderer, from the figures the action returned. The
 * file the landlord downloaded was therefore a NEW rendering, not the document
 * RentReady stored: a changed number or template made the two differ, and the
 * archived copy was never the one that had been checked.
 *
 * This serves the persisted bytes. When the document is already generated, no
 * generation happens at all: a second call is a plain read.
 *
 * When it is NOT generated yet, generation runs first (idempotently, see
 * `generateQuittance`) and the document it produced is served. So this route is
 * the whole "download my receipt" behaviour, and the client holds no PDF code.
 *
 * NO OBJECT STORAGE REQUIRED. Generated receipts keep their bytes inline in
 * `Document.content`, so this always returns a real PDF rather than a URL that
 * resolves to nothing.
 */

type RouteParams = Promise<{ id: string }>;

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = session.user.id;

    // Ownership is part of the read, not a check after it (AGENTS.md 8): a
    // foreign transaction id must yield "not found" rather than another
    // landlord's receipt, and must not be distinguishable from a missing one.
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
      select: { receiptDocument: { select: { id: true } } },
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaction introuvable" }, { status: 404 });
    }

    let document = transaction.receiptDocument
      ? await prisma.document.findFirst({
          where: { id: transaction.receiptDocument.id, userId },
          select: { id: true, fileName: true, mimeType: true, content: true, fileUrl: true },
        })
      : null;

    if (!document) {
      // No receipt yet: generate one, then serve it. `generateQuittance` is
      // idempotent, so a double click here still produces a single document.
      const { generateQuittance } = await import("@/lib/actions/quittance-actions");
      const result = await generateQuittance(id);

      if (!result.success) {
        // Honest failure: no document was produced, so say why instead of
        // handing back an empty or stale file (AGENTS.md 37).
        return NextResponse.json(
          { error: result.error ?? "Impossible de générer la quittance." },
          { status: 400 }
        );
      }

      const documentId =
        typeof result.data === "object" && result.data !== null
          ? (result.data as { documentId?: unknown }).documentId
          : undefined;

      if (typeof documentId !== "string") {
        return NextResponse.json(
          { error: "La quittance n'a pas pu être enregistrée. Réessayez." },
          { status: 500 }
        );
      }

      document = await prisma.document.findFirst({
        where: { id: documentId, userId },
        select: { id: true, fileName: true, mimeType: true, content: true, fileUrl: true },
      });
    }

    if (!document) {
      return NextResponse.json(
        { error: "Document introuvable" },
        { status: 404 }
      );
    }

    // Storage-backed documents have no inline bytes. Redirect to the object URL
    // rather than inventing a body: an unusable download would be reported as a
    // success the user discovers on opening an empty file.
    if (!document.content) {
      if (document.fileUrl.startsWith("http://") || document.fileUrl.startsWith("https://")) {
        return NextResponse.redirect(document.fileUrl);
      }
      return NextResponse.json(
        { error: "Le document n'est pas disponible en ligne." },
        { status: 503 }
      );
    }

    return new NextResponse(new Uint8Array(document.content), {
      headers: {
        "Content-Type": document.mimeType,
        "Content-Length": String(document.content.length),
        "Content-Disposition": `attachment; filename="${document.fileName}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("GET /api/transactions/[id]/receipt/download error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}