/**
 * Server-side quittance (rent receipt) PDF generation.
 *
 * Called from generateQuittance after a payment is recorded.
 * Embeds Factur-X XML for French e-invoicing compliance.
 *
 * The PDF is persisted as a `Document` row so the receipt can actually be
 * downloaded later. Previously the bytes were pushed to object storage and a
 * placeholder URL was stored when storage was unconfigured, which meant a
 * "generated" receipt that no user could ever open.
 *
 * The `Document` is linked to its `Transaction`, and `Document.transactionId` is
 * UNIQUE: that is what makes generation idempotent. Two concurrent calls both
 * render, both insert, and the loser gets a unique violation — which the caller
 * reads as "the receipt already exists" and answers with the winner's document
 * rather than minting a second reference for one payment.
 */
import { prisma } from "@/lib/prisma";
import { uploadBuffer, isStorageConfigured } from "@/lib/storage";
import { generateFacturXml } from "@/lib/facturx";
import { embedFacturX } from "@/lib/facturx-pdf";
import { DocumentType } from "@prisma/client";
import type { QuittanceData } from "@/lib/quittance-generator";

export interface QuittancePdf {
  /** Where the archived document lives (object storage URL, or a `local://` key). */
  url: string;
  /** The `Document` row this call created. Null when storage rejected the bytes. */
  documentId: string | null;
}

export async function generateAndUploadQuittancePdf(
  transactionId: string,
  quittanceData: QuittanceData,
  receiptNumber: string,
  userId: string
): Promise<QuittancePdf | null> {
  // Render first: this is the expensive step and it must succeed regardless of
  // whether storage is available.
  const { renderToBuffer } = await import("@react-pdf/renderer");
  const { QuittancePDF } = await import("@/lib/quittance-generator");

  const pdfBuffer = await renderToBuffer(<QuittancePDF data={quittanceData} />);

  // Embed Factur-X XML for French e-invoicing compliance.
  const facturXml = generateFacturXml(quittanceData);
  const basePdfBytes = new Uint8Array(pdfBuffer);

  const documentTitle = quittanceData.isFullPayment
    ? "Quittance de Loyer"
    : "Reçu de Paiement Partiel";

  const enhancedPdf = await embedFacturX(basePdfBytes, facturXml, {
    title: documentTitle,
    author: `${quittanceData.landlord.firstName} ${quittanceData.landlord.lastName}`,
    subject: `${documentTitle} - ${receiptNumber}`,
  });

  const bytes = Buffer.from(enhancedPdf.buffer as ArrayBuffer);
  const objectName = `quittances/${userId}/${transactionId}/${receiptNumber}.pdf`;

  // Prefer object storage. Without it, keep the bytes inline so the receipt stays
  // downloadable instead of pointing at a URL that resolves to nothing.
  const useObjectStorage = isStorageConfigured();
  const fileUrl = useObjectStorage
    ? (await uploadBuffer(bytes, objectName, "application/pdf")).url
    : `local://${objectName}`;

  const document = await prisma.document.create({
    data: {
      userId,
      type: quittanceData.isFullPayment
        ? DocumentType.QUITTANCE_PDF
        : DocumentType.RECU_PDF,
      fileName: `${receiptNumber}.pdf`,
      fileUrl,
      mimeType: "application/pdf",
      fileSize: bytes.length,
      content: useObjectStorage ? null : bytes,
      // Links the document to the payment it attests. UNIQUE in the schema, so
      // this insert is the point where a duplicate generation loses.
      transactionId,
    },
    select: { id: true },
  });

  return { url: fileUrl, documentId: document.id };
}