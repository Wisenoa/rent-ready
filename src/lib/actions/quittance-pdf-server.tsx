/**
 * Server-side quittance (rent receipt) PDF generation.
 * Called from generateQuittance after a payment is marked as paid.
 * Embeds Factur-X XML for French legal compliance.
 */
import { prisma } from "@/lib/prisma";
import { uploadBuffer } from "@/lib/storage";
import { generateFacturXml } from "@/lib/facturx";
import { embedFacturX } from "@/lib/facturx-pdf";
import type { QuittanceData } from "@/lib/quittance-generator";

export async function generateAndUploadQuittancePdf(
  transactionId: string,
  quittanceData: QuittanceData,
  receiptNumber: string,
  userId: string
): Promise<string | null> {
  try {
    // Dynamically import @react-pdf/renderer (server-safe)
    const { renderToBuffer } = await import("@react-pdf/renderer");
    const { QuittancePDF } = await import("@/lib/quittance-generator");

    const pdfBuffer = await renderToBuffer(<QuittancePDF data={quittanceData} />);

    // Embed Factur-X XML for French e-invoicing compliance
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

    const objectName = `quittances/${userId}/${transactionId}/${receiptNumber}.pdf`;
    const result = await uploadBuffer(
      Buffer.from(enhancedPdf.buffer as ArrayBuffer),
      objectName,
      "application/pdf"
    );

    return result.url;
  } catch (err) {
    // PDF generation is best-effort — don't fail the transaction update
    console.error("generateAndUploadQuittancePdf error:", err);
    return null;
  }
}
