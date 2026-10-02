"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Undo2, Loader2 } from "lucide-react";
import { cancelTransaction } from "@/lib/actions/transaction-actions";
import { Button } from "@/components/ui/button";

/**
 * Cancel a receipt recorded in error.
 *
 * A landlord who mistypes 97,00 instead of 970,00 used to have no way to repair
 * it: no deletion, no reversal, and the PATCH route could not fix an amount
 * coherently. This is that path — the month's balance goes back to being
 * collectable through « Enregistrer un paiement ».
 *
 * Two clicks on purpose. Cancelling is a reversal of a financial record, and one
 * stray click should not do it.
 */
export function CancelPaymentButton({
  transactionId,
  amount,
}: {
  transactionId: string;
  amount: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [armed, setArmed] = useState(false);

  function handleClick() {
    if (!armed) {
      setArmed(true);
      return;
    }

    startTransition(async () => {
      const result = await cancelTransaction(transactionId);
      setArmed(false);

      if (!result.success) {
        toast.error(result.error ?? "Impossible d'annuler ce paiement.");
        return;
      }

      const collectable =
        typeof result.data?.collectable === "string" ? result.data.collectable : null;
      toast.success(
        collectable
          ? `Paiement annulé. ${collectable} € sont de nouveau à encaisser.`
          : "Paiement annulé."
      );
    });
  }

  if (!armed) {
    return (
      <Button variant="ghost" size="sm" onClick={handleClick}>
        <Undo2 className="size-4 mr-1" />
        Annuler
      </Button>
    );
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      // Screen readers get the consequence, not just the verb.
      aria-label={`Confirmer l'annulation du paiement de ${amount} euros`}
    >
      {isPending ? <Loader2 className="size-4 animate-spin" /> : <Undo2 className="size-4 mr-1" />}
      Confirmer l'annulation
    </Button>
  );
}