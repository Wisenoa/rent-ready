"use client";

import { useTransition } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Download, FileCheck, Loader2, Receipt } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { QuittanceData } from "@/lib/quittance-generator";

export interface PortalQuittance {
  id: string;
  amount: number;
  rentAmount: number;
  chargesAmount: number;
  periodStart: string;
  periodEnd: string;
  paidAt: string;
  receiptType: string;
  receiptNumber: string | null;
  landlord: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
  };
  tenant: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
  };
  propertyAddress: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

function DownloadButton({ quittance }: { quittance: PortalQuittance }) {
  const [isPending, startTransition] = useTransition();

  function handleDownload() {
    startTransition(async () => {
      try {
        const quittanceData: QuittanceData = {
          landlord: quittance.landlord,
          tenant: quittance.tenant,
          propertyAddress: quittance.propertyAddress,
          rentAmount: quittance.rentAmount,
          chargesAmount: quittance.chargesAmount,
          totalAmount: quittance.amount,
          periodStart: new Date(quittance.periodStart),
          periodEnd: new Date(quittance.periodEnd),
          paidAt: new Date(quittance.paidAt),
          receiptNumber: quittance.receiptNumber ?? "",
          isFullPayment: quittance.receiptType === "QUITTANCE",
        };

        const { pdf } = await import("@react-pdf/renderer");
        const { QuittancePDF } = await import("@/lib/quittance-generator");

        const blob = await pdf(<QuittancePDF data={quittanceData} />).toBlob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${quittance.receiptNumber ?? "quittance"}.pdf`;
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
      variant="outline"
      size="sm"
      onClick={handleDownload}
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

export function PortalQuittances({
  quittances,
}: {
  quittances: PortalQuittance[];
}) {
  if (quittances.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileCheck className="size-12 text-muted-foreground/40 mb-4" />
        <h3 className="text-lg font-medium">Aucune quittance</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Vos quittances apparaîtront ici une fois les paiements enregistrés.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {quittances.map((q) => (
        <Card key={q.id} className="shadow-sm border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                {format(new Date(q.periodStart), "MMMM yyyy", { locale: fr })}
              </CardTitle>
              <Badge
                variant="secondary"
                className={
                  q.receiptType === "QUITTANCE"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-orange-50 text-orange-700 border-orange-200"
                }
              >
                <Receipt className="size-3 mr-1" />
                {q.receiptType === "QUITTANCE" ? "Quittance" : "Reçu"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-lg font-semibold font-mono">
                  {formatCurrency(q.amount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Payé le{" "}
                  {format(new Date(q.paidAt), "dd MMMM yyyy", { locale: fr })}
                </p>
              </div>
              <DownloadButton quittance={q} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
