"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Download the receipt for a payment.
 *
 * This used to call the `generateQuittance` server action and then re-render the
 * PDF IN THE BROWSER with @react-pdf/renderer + Factur-X, from the figures the
 * action returned. The file the landlord got was therefore a fresh rendering, not
 * the document RentReady archived: if the number or the template changed between
 * the click and the render, the two differed, and the copy that had actually been
 * checked was never the one downloaded.
 *
 * It now downloads the archived document through
 * `/api/transactions/[id]/receipt/download`, which serves the persisted bytes.
 * That route also generates the receipt when none exists yet, so this button is
 * the whole flow and holds no PDF code — a receipt cannot be rendered on the
 * client that the server never produced.
 */
export function QuittanceButton({ transactionId }: { transactionId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        const response = await fetch(
          `/api/transactions/${transactionId}/receipt/download`
        );

        if (!response.ok) {
          // Say what actually went wrong: the server refuses (for instance an
          // incomplete landlord address) with a reason the user can act on.
          const body = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;
          toast.error(body?.error ?? "Impossible de télécharger le document");
          return;
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download =
          dispositionFileName(response.headers.get("Content-Disposition")) ??
          "quittance.pdf";
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