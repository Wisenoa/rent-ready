"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { applyRentRevision } from "@/lib/actions/irl-actions";
import { Button } from "@/components/ui/button";

interface RevisionActionsProps {
  leaseId: string;
  newRent: number;
  newIrlQuarter: string;
  newIrlValue: number;
  isCapped: boolean;
  canApply: boolean;
}

export function RevisionActions({
  leaseId,
  newRent,
  newIrlQuarter,
  newIrlValue,
  isCapped,
  canApply,
}: RevisionActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleApply() {
    startTransition(async () => {
      const result = await applyRentRevision(
        leaseId,
        newRent,
        newIrlQuarter,
        newIrlValue
      );

      if (result.success) {
        toast.success(
          `Loyer révisé à ${newRent.toLocaleString("fr-FR", {
            style: "currency",
            currency: "EUR",
          })} avec succès`
        );
        router.push("/leases");
        router.refresh();
      } else {
        toast.error(result.error ?? "Erreur lors de la révision");
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={handleApply}
        disabled={!canApply || isPending}
        className="w-full"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 mr-2 animate-spin" />
            Application en cours...
          </>
        ) : (
          <>
            {isCapped
              ? "Appliquer le loyer plafonné"
              : "Appliquer la révision"}
          </>
        )}
      </Button>

      {!canApply && (
        <p className="text-xs text-center text-muted-foreground">
          Impossible d&apos;appliquer sans IRL de référence configuré.
        </p>
      )}
    </div>
  );
}