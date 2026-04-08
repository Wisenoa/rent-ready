"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { leaseSchema, type LeaseFormValues } from "@/lib/validations/lease";
import { updateLease } from "@/lib/actions/lease-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LEASE_TYPES = [
  { value: "UNFURNISHED", label: "Location vide" },
  { value: "FURNISHED", label: "Location meublée" },
  { value: "COMMERCIAL", label: "Bail commercial" },
  { value: "SEASONAL", label: "Location saisonnière" },
] as const;

const PAYMENT_METHODS = [
  { value: "TRANSFER", label: "Virement bancaire" },
  { value: "CHECK", label: "Chèque" },
  { value: "CASH", label: "Espèces" },
  { value: "DIRECT_DEBIT", label: "Prélèvement automatique" },
  { value: "OTHER", label: "Autre" },
] as const;

const IRL_QUARTERS = [
  { value: "T1-2025", label: "T1 2025" },
  { value: "T2-2025", label: "T2 2025" },
  { value: "T3-2025", label: "T3 2025" },
  { value: "T4-2025", label: "T4 2025" },
  { value: "T1-2026", label: "T1 2026" },
  { value: "T2-2026", label: "T2 2026" },
  { value: "T3-2026", label: "T3 2026" },
  { value: "T4-2026", label: "T4 2026" },
] as const;

interface LeaseEditDialogProps {
  lease: {
    id: string;
    propertyId: string;
    tenantId: string;
    rentAmount: number;
    chargesAmount: number;
    depositAmount: number;
    startDate: Date;
    endDate: Date | null;
    paymentDay: number;
    paymentMethod: string;
    leaseType: string;
    irlReferenceQuarter: string | null;
    irlReferenceValue: number | null;
  };
}

export function LeaseEditDialog({ lease }: LeaseEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<LeaseFormValues>({
    // @hookform/resolvers v5 + Zod v4 has a known type mismatch on optional coerce fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(leaseSchema) as any,
    defaultValues: {
      propertyId: lease.propertyId,
      tenantId: lease.tenantId,
      rentAmount: lease.rentAmount,
      chargesAmount: lease.chargesAmount,
      depositAmount: lease.depositAmount,
      startDate: new Date(lease.startDate).toISOString().split("T")[0],
      endDate: lease.endDate ? new Date(lease.endDate).toISOString().split("T")[0] : "",
      paymentDay: lease.paymentDay,
      paymentMethod: lease.paymentMethod as LeaseFormValues["paymentMethod"],
      leaseType: lease.leaseType as LeaseFormValues["leaseType"],
      irlReferenceQuarter: lease.irlReferenceQuarter ?? "",
      irlReferenceValue: lease.irlReferenceValue ?? undefined,
    },
  });

  const paymentMethod = watch("paymentMethod");

  function onSubmit(values: LeaseFormValues) {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, String(value));
        }
      });

      const result = await updateLease(lease.id, formData);
      if (result.success) {
        toast.success("Bail mis à jour");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error ?? "Erreur lors de la mise à jour");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) reset(); }}>
      <DialogTrigger>
        <Button variant="outline" size="sm">
          <Pencil className="size-3.5 mr-1.5" />
          Modifier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le bail</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit as (values: LeaseFormValues) => void)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="rentAmount">Loyer HC (€)</Label>
              <Input
                id="rentAmount"
                type="number"
                step="0.01"
                {...register("rentAmount", { valueAsNumber: true })}
                className="font-mono"
              />
              {errors.rentAmount && (
                <p className="text-xs text-red-500">{errors.rentAmount.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="chargesAmount">Charges (€)</Label>
              <Input
                id="chargesAmount"
                type="number"
                step="0.01"
                {...register("chargesAmount", { valueAsNumber: true })}
                className="font-mono"
              />
              {errors.chargesAmount && (
                <p className="text-xs text-red-500">{errors.chargesAmount.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="depositAmount">Dépôt de garantie (€)</Label>
            <Input
              id="depositAmount"
              type="number"
              step="0.01"
              {...register("depositAmount", { valueAsNumber: true })}
              className="font-mono"
            />
            {errors.depositAmount && (
              <p className="text-xs text-red-500">{errors.depositAmount.message}</p>
            )}
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="startDate">Date de début</Label>
              <Input id="startDate" type="date" {...register("startDate")} />
              {errors.startDate && (
                <p className="text-xs text-red-500">{errors.startDate.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endDate">Date de fin</Label>
              <Input id="endDate" type="date" {...register("endDate")} />
              {errors.endDate && (
                <p className="text-xs text-red-500">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="paymentDay">Jour de paiement</Label>
              <Input
                id="paymentDay"
                type="number"
                min={1}
                max={31}
                {...register("paymentDay", { valueAsNumber: true })}
              />
              {errors.paymentDay && (
                <p className="text-xs text-red-500">{errors.paymentDay.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="paymentMethod">Mode de paiement</Label>
              <Select
                value={paymentMethod}
                onValueChange={(v) => setValue("paymentMethod", v as LeaseFormValues["paymentMethod"])}
              >
                <SelectTrigger id="paymentMethod">
                  <SelectValue />
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="leaseType">Type de bail</Label>
              <Select
                defaultValue={lease.leaseType}
                onValueChange={(v) => setValue("leaseType", v as LeaseFormValues["leaseType"])}
              >
                <SelectTrigger id="leaseType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEASE_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="irlReferenceQuarter">Trimestre IRL</Label>
              <Select
                defaultValue={lease.irlReferenceQuarter ?? ""}
                onValueChange={(v) => setValue("irlReferenceQuarter", v || undefined)}
              >
                <SelectTrigger id="irlReferenceQuarter">
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {IRL_QUARTERS.map((q) => (
                    <SelectItem key={q.value} value={q.value}>
                      {q.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="irlReferenceValue">Valeur IRL</Label>
            <Input
              id="irlReferenceValue"
              type="number"
              step="0.01"
              {...register("irlReferenceValue", { valueAsNumber: true })}
              placeholder="Ex: 144.52"
              className="font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="size-4 mr-2 animate-spin" />}
              Enregistrer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
