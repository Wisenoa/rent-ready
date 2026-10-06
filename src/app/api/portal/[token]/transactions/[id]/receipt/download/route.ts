import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/portal/[token]/transactions/[id]/receipt/download — the archived
 * receipt, for the tenant holding that portal token.
 *
 * The portal used to render the PDF IN THE BROWSER: `DownloadButton` imported
 * `@react-pdf/renderer` and `@/lib/quittance-generator` client-side and called
 * `pdf(<QuittancePDF .../>).toBlob()`. So the file the tenant downloaded was a
 * NEW rendering built from the figures the page happened to hold, not the
 * document RentReady archived. The tenant is the other party to the document
 * (loi du 6 juillet 1989, art. 21): if the template or the number moved between
 * the archiving and the download, the two copies diverged and neither proved
 * which one was authoritative. This is the same defect the landlord's button had,
 * fixed there by `/api/transactions/[id]/receipt/download`.
 *
 * NO GENERATION HERE. Unlike the landlord route, this one does not fall back to
 * generating a missing document: `generateQuittance` is a landlord action, it
 * reads the authenticated owner, and a document minted on the fly on a public
 * token surface would be exactly the "fresh rendering" this route exists to
 * remove. A receipt listed in the portal has already been archived. If it has
 * not, the route says so instead of fabricating a file.
 *
 * NO OBJECT STORAGE REQUIRED. Generated receipts keep their bytes inline in
 * `Document.content`, so this returns a real PDF rather than a URL that resolves
 * to nothing.
 */

type RouteParams = Promise<{ token: string; id: string }>;

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const { token, id } = await params;
    if (!token || !id) {
      return NextResponse.json({ error: "Quittance introuvable" }, { status: 404 });
    }

    // The token is the tenant's ONLY credential, and this is a public surface:
    // both come from the URL, so neither may be trusted on its own. The token is
    // matched in the query — not fetched and string-compared — so a guessed or
    // expired token cannot slip through and no timing difference reveals whether
    // one exists.
    const access = await prisma.tenantAccessToken.findFirst({
      where: {
        token,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      select: { id: true, tenantId: true },
    });

    if (!access) {
      // Deliberately identical to "no such receipt": a portal token must not be a
      // way to probe which payment ids exist.
      return NextResponse.json({ error: "Quittance introuvable" }, { status: 404 });
    }

    // Record use without blocking the download on a bookkeeping write.
    await prisma.tenantAccessToken
      .update({ where: { id: access.id }, data: { lastUsedAt: new Date() } })
      .catch(() => {});

    // Ownership is part of the read, not a check after it (AGENTS.md 8). The
    // transaction must belong to a lease of THIS token's tenant, so another
    // tenant's receipt is unreachable rather than merely hidden — and the answer
    // is indistinguishable from an id that does not exist.
    const transaction = await prisma.transaction.findFirst({
      where: { id, lease: { tenantId: access.tenantId } },
      select: {
        receiptDocument: {
          select: { id: true, fileName: true, mimeType: true, content: true, fileUrl: true },
        },
      },
    });

    if (!transaction) {
      return NextResponse.json({ error: "Quittance introuvable" }, { status: 404 });
    }

    const document = transaction.receiptDocument;

    if (!document) {
      // The payment exists and is this tenant's, but it was never archived. Say
      // that honestly (AGENTS.md 37) rather than minting a PDF the server never
      // produced and presenting it as the archived copy.
      return NextResponse.json(
        {
          error:
            "Cette quittance n'a pas encore été générée. Contactez votre propriétaire.",
        },
        { status: 409 }
      );
    }

    // Storage-backed documents have no inline bytes. Redirect to the object URL
    // rather than inventing a body: an unusable download would be reported as a
    // success the tenant discovers on opening an empty file.
    if (!document.content) {
      if (
        document.fileUrl.startsWith("http://") ||
        document.fileUrl.startsWith("https://")
      ) {
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
    console.error("GET /api/portal/[token]/transactions/[id]/receipt/download error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
