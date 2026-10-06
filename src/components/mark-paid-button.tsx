"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import { markTransactionPaid } from "@/lib/actions/transaction-actions";
import { reportMarkPaid } from "@/lib/domain/quittance-outcome";
import { Button } from "@/components/ui/button";

export function MarkPaidButton({
  transactionId,
  defaultAmount,
  label = "Enregistrer le paiement",
  size = "sm",
  variant = "default",
  className,
}: {
  transactionId: string;
  defaultAmount: number;
  label?: string;
  size?: "default" | "sm" | "xs" | "lg";
  variant?: "default" | "outline" | "secondary" | "ghost";
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await markTransactionPaid(transactionId, defaultAmount);
      reportMarkPaid(result, toast);
    });
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isPending}
      className={className}
    >
      {isPending ? (
        <Loader2 className="size-3.5 animate-spin mr-1.5" />
      ) : (
        <CheckCircle2 className="size-3.5 mr-1.5" />
      )}
      {label}
    </Button>
  );
}
