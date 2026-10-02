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
}: {
  transactionId: string;
  defaultAmount: number;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await markTransactionPaid(transactionId, defaultAmount);
      // The payment is recorded either way, so a missing quittance must be shown
      // rather than reported as a clean success (AGENTS.md §21, §37). The
      // success/warning/error choice lives in reportMarkPaid so it is covered by
      // tests that execute it — this component deliberately holds no branch,
      // because an unrendered client component is not covered by the suite.
      reportMarkPaid(result, toast);
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
