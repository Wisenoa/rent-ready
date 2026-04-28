"use client";

import { useTransition, useRef, useEffect, useState } from "react";
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

interface LeaseOption {
  id: string;
  rentAmount: number;
  chargesAmount: number;
  property: { name: string } | null;
  tenant: { firstName: string; lastName: string } | null;
}

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
  const formRef = useRef<HTMLFormElement>(null);

  const selectedLease = leases.find((l) => l.id === selectedLeaseId);

  // Default period: current month
  const now = new Date();
  const defaultPeriodStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const defaultPeriodEnd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  const defaultDueDate = defaultPeriodStart;

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createTransaction(formData);
      if (result.success) {
        toast.success("Paiement enregistré avec succès");
        setOpen(false);
        setSelectedLeaseId("");
        formRef.current?.reset();
      } else {
        toast.error(result.error ?? "Une erreur est survenue");
      }
    });
  }

  // Reset form state when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedLeaseId("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="size-4 mr-2" />
        Enregistrer un paiement
      </DialogTrigger>
      <DialogContent className="w-[95vw] sm:w-full sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Enregistrer un paiement</DialogTitle>
          <DialogDescription>
            Saisissez les informations du paiement reçu.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          {/* Lease selector */}
          <div className="space-y-2">
            <Label htmlFor="leaseId">Bail</Label>
            <Select
              name="leaseId"
              value={selectedLeaseId}
              onValueChange={(v) => setSelectedLeaseId(v ?? "")}
              required
            >
              <SelectTrigger id="leaseId">
                <SelectValue placeholder="Sélectionner un bail" />
              </SelectTrigger>
              <SelectContent>
                {leases.map((lease) => (
                  <SelectItem key={lease.id} value={lease.id}>
                    {lease.tenant?.firstName ?? ''} {lease.tenant?.lastName ?? ''} — {lease.property?.name ?? ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Montant (€)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              required
              defaultValue={
                selectedLease
                  ? (Number(selectedLease.rentAmount) + Number(selectedLease.chargesAmount)).toFixed(2)
                  : ""
              }
              key={selectedLeaseId}
            />
            {selectedLease && (
              <p className="text-xs text-muted-foreground">
                Loyer : {Number(selectedLease.rentAmount).toFixed(2)} € + Charges : {Number(selectedLease.chargesAmount).toFixed(2)} €
              </p>
            )}
          </div>

          {/* Period */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="periodStart">Début de période</Label>
              <Input
                id="periodStart"
                name="periodStart"
                type="date"
                required
                defaultValue={defaultPeriodStart}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="periodEnd">Fin de période</Label>
              <Input
                id="periodEnd"
                name="periodEnd"
                type="date"
                required
                defaultValue={defaultPeriodEnd}
              />
            </div>
          </div>

          {/* Due date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Date d&apos;échéance</Label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              required
              defaultValue={defaultDueDate}
            />
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

          <Button type="submit" className="w-full" disabled={isPending}>
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
