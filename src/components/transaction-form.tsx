"use client";

import { useMemo, useTransition, useRef, useState } from "react";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import { createTransaction } from "@/lib/actions/transaction-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatPeriodLabel, type DuePeriod } from "@/lib/domain/due-periods";
import { formatCurrency } from "@/lib/format";

interface LeaseOption {
  id: string;
  property: { name: string } | null;
  tenant: { firstName: string; lastName: string } | null;
  /** Collectable periods for this lease. Empty means there is nothing to collect. */
  duePeriods: DuePeriod[];
}

const EMPTY_PERIODS: DuePeriod[] = [];

const PAYMENT_METHODS = [
  { value: "TRANSFER", label: "Virement" },
  { value: "CHECK", label: "Chèque" },
  { value: "CASH", label: "Espèces" },
  { value: "DIRECT_DEBIT", label: "Prélèvement" },
  { value: "OTHER", label: "Autre" },
] as const;

export function TransactionForm({ leases }: { leases: LeaseOption[] }) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [selectedLeaseId, setSelectedLeaseId] = useState("");
  const [selectedPeriodId, setSelectedPeriodId] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const selectedLease = leases.find((l) => l.id === selectedLeaseId);
  // `duePeriods` falls back to a shared empty array, so it is memoised: without
  // this the period lookup below would see a new reference on every render.
  const duePeriods = useMemo(
    () => selectedLease?.duePeriods ?? EMPTY_PERIODS,
    [selectedLease]
  );
  const selectedPeriod =
    duePeriods.find((p) => p.transactionId === selectedPeriodId) ?? null;

  // A lease with no collectable period is a dead end, not a form with empty
  // fields: saying so is what stops the landlord typing dates back in by hand.
  const hasDuePeriod = duePeriods.length > 0;
  const canSubmit = selectedPeriod !== null && !isPending;

  function handleSubmit(formData: FormData) {
    if (!selectedPeriod) {
      toast.error("Sélectionnez la période de loyer à enregistrer.");
      return;
    }
    startTransition(async () => {
      const result = await createTransaction(formData);
      if (result.success) {
        toast.success("Paiement enregistré avec succès");
        handleOpenChange(false);
        formRef.current?.reset();
      } else {
        toast.error(result.error ?? "Une erreur est survenue");
      }
    });
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    // Reset the selections when the dialog closes, so reopening starts from a
    // blank form. Done in the close handler instead of an effect on `open`:
    // the successful-submit path below already resets it itself, and this is the
    // only other path that closes the dialog.
    if (!nextOpen) {
      setSelectedLeaseId("");
      setSelectedPeriodId("");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button />}>
        <Plus className="size-4 mr-2" />
        Enregistrer un paiement
      </DialogTrigger>
      <DialogContent className="w-[95vw] sm:w-full sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Enregistrer un paiement</DialogTitle>
          <DialogDescription>
            Choisissez le bail puis la période de loyer constatée.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          {/* Lease selector */}
          <div className="space-y-2">
            <Label htmlFor="leaseId">Bail</Label>
            <Select
              name="leaseId"
              value={selectedLeaseId}
              onValueChange={(v) => {
                setSelectedLeaseId(v ?? "");
                // The period belongs to the lease, so a new lease means a new
                // period — and keeping the old id would post a payment against
                // a period of the previous lease.
                setSelectedPeriodId("");
              }}
              required
            >
              <SelectTrigger id="leaseId">
                <SelectValue placeholder="Sélectionner un bail" />
              </SelectTrigger>
              <SelectContent>
                {leases.map((lease) => (
                  <SelectItem key={lease.id} value={lease.id}>
                    {lease.tenant?.firstName ?? ""} {lease.tenant?.lastName ?? ""} —{" "}
                    {lease.property?.name ?? ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Due period — read-only proof of what is being settled, chosen from
              the obligations that actually exist for this lease. */}
          <div className="space-y-2">
            <Label htmlFor="duePeriodId">Période de loyer</Label>
            <Select
              name="duePeriodId"
              value={selectedPeriodId}
              onValueChange={(v) => setSelectedPeriodId(v ?? "")}
              disabled={!selectedLease || !hasDuePeriod}
              required
            >
              <SelectTrigger id="duePeriodId">
                <SelectValue
                  placeholder={
                    selectedLease
                      ? "Sélectionner une période"
                      : "Sélectionner d'abord un bail"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {duePeriods.map((period) => (
                  <SelectItem key={period.transactionId} value={period.transactionId}>
                    {formatPeriodLabel(period.periodStart)} —{" "}
                    {formatCurrency(period.remaining)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* The selected period's dates are carried as hidden fields: the
                landlord never types them, and the server still validates them. */}
            {selectedPeriod && (
              <>
                <input type="hidden" name="periodStart" value={selectedPeriod.periodStart} />
                <input type="hidden" name="periodEnd" value={selectedPeriod.periodEnd} />
                <input type="hidden" name="dueDate" value={selectedPeriod.dueDate} />
              </>
            )}

            {selectedLease && !hasDuePeriod && (
              <p className="text-sm text-muted-foreground">
                Aucune période de loyer à encaisser pour ce bail.
              </p>
            )}

            {selectedPeriod && (
              <dl className="grid grid-cols-3 gap-2 rounded-lg bg-muted/50 p-3 text-xs">
                <div>
                  <dt className="text-muted-foreground">Total dû</dt>
                  <dd className="font-medium">{formatCurrency(selectedPeriod.totalDue)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Déjà encaissé</dt>
                  <dd className="font-medium">
                    {formatCurrency(selectedPeriod.alreadyPaid)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Reste à payer</dt>
                  <dd className="font-semibold">
                    {formatCurrency(selectedPeriod.remaining)}
                  </dd>
                </div>
                <div className="col-span-3 text-muted-foreground">
                  Échéance : {selectedPeriod.dueDate.split("-").reverse().join("/")}
                </div>
              </dl>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Montant encaissé (€)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              max={selectedPeriod?.remaining}
              required
              defaultValue={selectedPeriod?.remaining ?? ""}
              key={selectedPeriod?.transactionId ?? "no-period"}
            />
            {selectedPeriod && (
              <p className="text-xs text-muted-foreground">
                Pré-rempli avec le reste à payer. Un encaissement partiel est
                accepté : reducez le montant si le locataire n&apos;a pas tout versé.
              </p>
            )}
          </div>

          {/* Payment date */}
          <div className="space-y-2">
            <Label htmlFor="paidAt">Date de paiement</Label>
            <Input
              id="paidAt"
              name="paidAt"
              type="date"
              defaultValue={new Date().toISOString().slice(0, 10)}
            />
          </div>

          {/* Payment method */}
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Moyen de paiement</Label>
            <Select name="paymentMethod">
              <SelectTrigger id="paymentMethod">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={2}
              placeholder="Remarques éventuelles..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={!canSubmit}>
            {isPending ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Enregistrement…
              </>
            ) : (
              "Enregistrer le paiement"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}