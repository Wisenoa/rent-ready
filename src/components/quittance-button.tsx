"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";
import { generateQuittance } from "@/lib/actions/quittance-actions";
import { Button } from "@/components/ui/button";
import type { QuittanceData } from "@/lib/quittance-generator";

export function QuittanceButton({ transactionId }: { transactionId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        const result = await generateQuittance(transactionId);

        if (!result.success || !result.data) {
          toast.error(result.error ?? "Impossible de générer le document");
          return;
        }

        const quittanceData = result.data.quittanceData as QuittanceData;

        // Restore Date objects from serialised JSON
        quittanceData.periodStart = new Date(quittanceData.periodStart);
        quittanceData.periodEnd = new Date(quittanceData.periodEnd);
        quittanceData.paidAt = new Date(quittanceData.paidAt);

        // Dynamic import — @react-pdf/renderer is client-only
        const { pdf } = await import("@react-pdf/renderer");
        const { QuittancePDF } = await import("@/lib/quittance-generator");

        const blob = await pdf(<QuittancePDF data={quittanceData} />).toBlob();

        // Factur-X: embed structured XML into the PDF
        const { generateFacturXml } = await import("@/lib/facturx");
        const { embedFacturX } = await import("@/lib/facturx-pdf");

        const facturXml = generateFacturXml(quittanceData);
        const basePdfBytes = new Uint8Array(await blob.arrayBuffer());

        const documentTitle = quittanceData.isFullPayment
          ? "Quittance de Loyer"
          : "Reçu de Paiement Partiel";

        const enhancedPdf = await embedFacturX(basePdfBytes, facturXml, {
          title: documentTitle,
          author: `${quittanceData.landlord.firstName} ${quittanceData.landlord.lastName}`,
          subject: `${documentTitle} - ${quittanceData.receiptNumber}`,
        });

        const facturXBlob = new Blob([enhancedPdf.buffer as ArrayBuffer], { type: "application/pdf" });
        const url = URL.createObjectURL(facturXBlob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${(result.data.receiptNumber as string) ?? "quittance"}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success("Document téléchargé");
      } catch {
        toast.error("Erreur lors de la génération du PDF");
      }
    });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <>
          <Download className="size-4 mr-1" />
          Télécharger
        </>
      )}
    </Button>
  );
}
