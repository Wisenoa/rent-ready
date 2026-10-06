"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateTicketStatus } from "@/lib/actions/portal-actions";
import { AlertCircle, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATUS_OPTIONS = [
  { value: "OPEN", label: "Ouvert", icon: AlertCircle },
  { value: "IN_PROGRESS", label: "En cours", icon: Clock },
  { value: "RESOLVED", label: "Résolu", icon: CheckCircle2 },
  { value: "CLOSED", label: "Fermé", icon: XCircle },
] as const;

export function StatusChangeButtons({
  ticketId,
  currentStatus,
}: {
  ticketId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(newStatus: string) {
    if (newStatus === currentStatus) return;
    startTransition(async () => {
      const result = await updateTicketStatus(ticketId, newStatus);
      if (result.success) {
        toast.success("Statut mis à jour");
      } else {
        toast.error(result.error ?? "Erreur");
      }
    });
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">Changer le statut</p>
      <div className="grid grid-cols-2 gap-2">
        {STATUS_OPTIONS.map(({ value, label, icon: Icon }) => (
          <Button
            key={value}
            variant={currentStatus === value ? "default" : "outline"}
            size="sm"
            disabled={isPending}
            onClick={() => handleChange(value)}
            className="h-8 text-xs"
          >
            <Icon className="size-3 mr-1" />
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
