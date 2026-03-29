"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { updateTicketStatus } from "@/lib/actions/portal-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_OPTIONS = [
  { value: "OPEN", label: "Ouvert" },
  { value: "IN_PROGRESS", label: "En cours" },
  { value: "RESOLVED", label: "Résolu" },
  { value: "CLOSED", label: "Fermé" },
] as const;

export function TicketStatusButton({
  ticketId,
  currentStatus,
}: {
  ticketId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(newStatus: string | null) {
    if (!newStatus || newStatus === currentStatus) return;
    startTransition(async () => {
      const result = await updateTicketStatus(ticketId, newStatus);
      if (result.success) {
        toast.success("Statut mis à jour");
      } else {
        toast.error(result.error ?? "Impossible de mettre à jour le statut");
      }
    });
  }

  return (
    <div className="relative">
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-md z-10">
          <Loader2 className="size-4 animate-spin" />
        </div>
      )}
      <Select
        defaultValue={currentStatus}
        onValueChange={handleChange}
        disabled={isPending}
      >
        <SelectTrigger className="h-8 w-[140px] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-xs">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
