"use client";

import { useTransition } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Download, FileCheck, Loader2, Receipt } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Decimal from "decimal.js";

import { formatCurrency } from "@/lib/format";

export interface PortalQuittance {
  id: string;
  amount: Decimal;
  rentAmount: Decimal;
  chargesAmount: Decimal;
  /**
   * The balance left after THIS payment, decided server-side by
   * `settlePeriodPayments`. Passed rather than re-derived here: the tenant's copy
   * is the same legal document as the landlord's and must carry the same figure.
   */
  remainingAmount: Decimal;
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


/**
 * Download the tenant's own archived receipt.
 *
 * This used to import `@react-pdf/renderer` and `@/lib/quittance-generator` on
 * the client and call `pdf(<QuittancePDF data={…} />).toBlob()`. The file the
 * tenant received was therefore a NEW rendering assembled from the figures the
 * page happened to carry — not the document RentReady archived. The tenant is the
 * other party to that document (loi du 6 juillet 1989, art. 21), so their copy has
 * to be the same bytes as the archived one; a template or number that moved
 * between the archiving and the click made the two diverge, and neither proved
 * which was authoritative.
 *
 * It now downloads through the portal download route, which checks the token's
 * ownership in the query and serves `Document.content` verbatim. No PDF code is
 * left here: a receipt cannot be rendered on the client that the server never
 * produced.
 */
function DownloadButton({
  quittance,
  token,
}: {
  quittance: PortalQuittance;
  token: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleDownload() {
    startTransition(async () => {
      try {
        const response = await fetch(
          `/api/portal/${token}/transactions/${quittance.id}/receipt/download`
        );

        if (!response.ok) {
          // Say what actually went wrong. This route does not generate on demand,
          // so the realistic refusal is a receipt that was never archived — the
          // tenant needs to be told to contact the landlord, not to retry.
          const body = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;
          toast.error(
            body?.error ?? "Impossible de télécharger le document"
          );
          return;
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download =
          dispositionFileName(response.headers.get("Content-Disposition")) ??
          `${quittance.receiptNumber ?? "quittance"}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success("Document téléchargé");
      } catch {
        toast.error("Erreur lors du téléchargement du document");
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
  token,
}: {
  quittances: PortalQuittance[];
  token: string;
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
              <DownloadButton quittance={q} token={token} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * The filename the server named the document, so the downloaded file keeps its
 * receipt reference. Returns null when the header is absent or carries no name,
 * and the caller falls back rather than saving a file called "download".
 */
function dispositionFileName(header: string | null): string | null {
  if (!header) return null;
  const match = /filename="?([^";]+)"?/.exec(header);
  return match?.[1] ?? null;
}
