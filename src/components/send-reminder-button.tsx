"use client";

import { useState } from "react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Bell, Loader2 } from "lucide-react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { sendPaymentReminder } from "@/lib/actions/transaction-actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SendReminderButtonProps {
  transactionId: string;
  daysLate: number;
  currentStatus: string;
}

export function SendReminderButton({
  transactionId,
  daysLate,
  currentStatus,
}: SendReminderButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const isDisabled = isPending || (currentStatus !== "LATE" && currentStatus !== "PENDING");

  function handleSend(tone: "friendly" | "formal" | "legal") {
    setOpen(false);
    startTransition(async () => {
      const result = await sendPaymentReminder(transactionId, tone);
      if (result.success) {
        toast.success("Relance envoyée avec succès");
      } else {
        toast.error(result.error ?? "Impossible d'envoyer la relanc.");
      }
    });
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <MenuPrimitive.Trigger
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 disabled:pointer-events-none disabled:opacity-50 gap-1.5"
        disabled={isDisabled}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            <Bell className="size-4" />
            Relancer
          </>
        )}
      </MenuPrimitive.Trigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleSend("friendly")}>
          <span className="mr-2">📧</span>
          <span>Rappel amical</span>
          <span className="ml-2 text-xs text-muted-foreground">3+ jours</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSend("formal")}>
          <span className="mr-2">📨</span>
          <span>Relance formelle</span>
          <span className="ml-2 text-xs text-muted-foreground">7+ jours</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSend("legal")}>
          <span className="mr-2">⚠️</span>
          <span className="text-red-700 font-medium">Mise en demeure</span>
          <span className="ml-2 text-xs text-muted-foreground">14+ jours</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}