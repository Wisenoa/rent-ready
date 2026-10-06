"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { sendPaymentReminder } from "@/lib/actions/transaction-actions";
import { reportReminder, type ReminderTone } from "@/lib/domain/reminder-outcome";
import { Button } from "@/components/ui/button";

/**
 * « Relancer » on one unpaid month.
 *
 * Deliberately a click, not a side effect of rendering: chasing a tenant is the
 * landlord's decision, and an email that leaves without being asked for is not
 * recoverable (AGENTS.md §21).
 *
 * The branch that turns the action's result into a message lives in
 * `reminder-outcome` so the suite executes it. This component holds no
 * conditional of its own — a client component that is never rendered is not
 * covered by the suite, and an earlier version's dead branch passed unnoticed
 * that way.
 */
export function ReminderButton({
  transactionId,
  tone = "friendly",
  label,
}: {
  transactionId: string;
  tone?: ReminderTone;
  label?: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await sendPaymentReminder(transactionId, tone);
      reportReminder(result, toast);
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
          <Send className="size-4 mr-1" />
          {label ?? "Relancer"}
        </>
      )}
    </Button>
  );
}