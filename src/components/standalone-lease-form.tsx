"use client";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { leaseSchema, type LeaseFormValues } from "@/lib/validations/lease";
import { createLease } from "@/lib/actions/lease-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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

interface StandaloneLeaseFormProps {
  properties: Array<{ id: string; name: string; addressLine1: string; city: string }>;
  tenants: Array<{ id: string; firstName: string; lastName: string }>;
}

export function StandaloneLeaseForm({ properties, tenants }: StandaloneLeaseFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LeaseFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(leaseSchema) as any,
    defaultValues: {
      propertyId: "",
      tenantId: "",
      rentAmount: 0,
      chargesAmount: 0,
      depositAmount: 0,
      startDate: "",
      endDate: "",
      paymentDay: 1,
      paymentMethod: "TRANSFER",
      leaseType: "UNFURNISHED",
      irlReferenceQuarter: "",
      irlReferenceValue: undefined,
    },
  });

  const selectedPropertyId = watch("propertyId");
  const selectedTenantId = watch("tenantId");
  const selectedLeaseType = watch("leaseType");

  function onSubmit(values: LeaseFormValues) {
    startTransition(async () => {
      const formData = new FormData();
      for (const [key, value] of Object.entries(values)) {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, String(value));
        }
      }

      const result = await createLease(formData);

      if (result.success) {
        toast.success("Bail créé avec succès");
        router.push("/leases");
        router.refresh();
      } else {
        toast.error(result.error ?? "Une erreur est survenue");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Property & Tenant selection */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="propertyId">Bien immobilier *</Label>
          <Select
            value={selectedPropertyId ?? undefined}
            onValueChange={(val) => setValue("propertyId", val as string, { shouldValidate: true })}
          >
            <SelectTrigger id="propertyId">
              <SelectValue placeholder="Sélectionner un bien" />
            </SelectTrigger>
            <SelectContent>
              {properties.length === 0 ? (
                <SelectItem value="__none__" disabled>
                  Aucun bien disponible
                </SelectItem>
              ) : (
                properties.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} — {p.city}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {errors.propertyId && (
            <p className="text-sm text-destructive">{errors.propertyId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tenantId">Locataire *</Label>
          <Select
            value={selectedTenantId ?? undefined}
            onValueChange={(val) => setValue("tenantId", val as string, { shouldValidate: true })}
          >
            <SelectTrigger id="tenantId">
              <SelectValue placeholder="Sélectionner un locataire" />
            </SelectTrigger>
            <SelectContent>
              {tenants.length === 0 ? (
                <SelectItem value="__none__" disabled>
                  Aucun locataire disponible
                </SelectItem>
              ) : (
                tenants.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.firstName} {t.lastName}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {errors.tenantId && (
            <p className="text-sm text-destructive">{errors.tenantId.message}</p>
          )}
        </div>
      </div>

      <Separator />
      {/* Financial terms */}
      <div>
        <p className="text-sm font-medium mb-3">Conditions financières</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rentAmount">Loyer hors charges (€) *</Label>
            <Input
              id="rentAmount"
              type="number"
              step="0.01"
              min="0"
              placeholder="850.00"
              {...register("rentAmount")}
            />
            {errors.rentAmount && (
              <p className="text-sm text-destructive">{errors.rentAmount.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="chargesAmount">Charges (€)</Label>
            <Input
              id="chargesAmount"
              type="number"
              step="0.01"
              min="0"
              placeholder="50.00"
              {...register("chargesAmount")}
            />
            {errors.chargesAmount && (
              <p className="text-sm text-destructive">{errors.chargesAmount.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="depositAmount">Dépôt de garantie (€)</Label>
            <Input
              id="depositAmount"
              type="number"
              step="0.01"
              min="0"
              placeholder="1700.00"
              {...register("depositAmount")}
            />
            {errors.depositAmount && (
              <p className="text-sm text-destructive">{errors.depositAmount.message}</p>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Dates */}
      <div>
        <p className="text-sm font-medium mb-3">Dates</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Date de début *</Label>
            <Input id="startDate" type="date" {...register("startDate")} />
            {errors.startDate && (
              <p className="text-sm text-destructive">{errors.startDate.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">Date de fin</Label>
            <Input id="endDate" type="date" {...register("endDate")} />
            <p className="text-xs text-muted-foreground">Laisser vide pour un bail à durée indéterminée</p>
          </div>
        </div>
      </div>

      <Separator />
      {/* Lease type and payment */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="leaseType">Type de bail *</Label>
          <Select
            value={selectedLeaseType}
            onValueChange={(val) =>
              setValue("leaseType", val as LeaseFormValues["leaseType"], { shouldValidate: true })
            }
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
          {errors.leaseType && (
            <p className="text-sm text-destructive">{errors.leaseType.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentDay">Jour de paiement</Label>
          <Input
            id="paymentDay"
            type="number"
            min="1"
            max="31"
            {...register("paymentDay")}
          />
          {errors.paymentDay && (
            <p className="text-sm text-destructive">{errors.paymentDay.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentMethod">Mode de paiement</Label>
        <Select
          value={watch("paymentMethod")}
          onValueChange={(val) =>
            setValue("paymentMethod", val as LeaseFormValues["paymentMethod"])
          }
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

      <Separator />

      {/* IRL Reference (French legal rent revision) */}
      {(selectedLeaseType === "UNFURNISHED" || selectedLeaseType === "FURNISHED") && (
        <div>
          <p className="text-sm font-medium mb-3">
            Référence IRL (révision du loyer)
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            L&apos;Indice de Référence des Loyers (INSEE) est utilisé pour la révision
            annuelle du loyer. Ces champs sont facultatifs.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="irlReferenceQuarter">Trimestre de référence</Label>
              <Select
                value={(watch("irlReferenceQuarter") as string | undefined) ?? ""}
                onValueChange={(val) => setValue("irlReferenceQuarter", val as string | undefined)}
              >
                <SelectTrigger id="irlReferenceQuarter">
                  <SelectValue placeholder="Sélectionner un trimestre" />
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
            <div className="space-y-2">
              <Label htmlFor="irlReferenceValue">Valeur IRL</Label>
              <Input
                id="irlReferenceValue"
                type="number"
                step="0.01"
                min="0"
                placeholder="145.78"
                {...register("irlReferenceValue")}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isPending || properties.length === 0 || tenants.length === 0}>
          {isPending && <Loader2 className="size-4 mr-2 animate-spin" />}
          Créer le bail
        </Button>
      </div>
    </form>
  );
}
