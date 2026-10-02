"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import { markTransactionPaid } from "@/lib/actions/transaction-actions";
import { Button } from "@/components/ui/button";

export function MarkPaidButton({
  transactionId,
  defaultAmount,
}: {
  transactionId: string;
  defaultAmount: number;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await markTransactionPaid(transactionId, defaultAmount);
      if (!result.success) {
        toast.error(result.error ?? "Impossible de valider le paiement");
        return;
      }

      // The payment is recorded either way. A missing quittance is a real
      // outcome the user must see — never report it as a clean success.
      const quittanceError =
        typeof result.data?.quittanceError === "string"
          ? result.data.quittanceError
          : null;

      if (quittanceError) {
        toast.warning(
          `Paiement validé, mais la quittance n'a pas pu être générée : ${quittanceError}`,
          { duration: 8000 }
        );
        return;
      }

      toast.success("Paiement validé");
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <>
          <CheckCircle2 className="size-4 mr-1" />
          Marquer payé
        </>
      )}
    </Button>
  );
}
