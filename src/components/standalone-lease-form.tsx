"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Plus,
  ChevronDown,
  ChevronUp,
  Building2,
  User,
  Calendar,
  Euro,
  ShieldCheck,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Decimal from "decimal.js";

import {
  standaloneLeaseSchema,
  type StandaloneLeaseFormValues,
} from "@/lib/validations/lease";
import { createLease } from "@/lib/actions/lease-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TenantForm } from "@/components/tenant-form";
import { formatCurrency } from "@/lib/format";

const LEASE_TYPES = [
  {
    value: "UNFURNISHED",
    label: "Location vide (non meublée)",
    description: "Bail de 3 ans reconductible — loi du 6 juillet 1989",
    legalMaxDeposit: "1 mois de loyer HC max",
    depositFactor: 1,
  },
  {
    value: "FURNISHED",
    label: "Location meublée",
    description: "Bail d'un an reconductible (ou 9 mois étudiant) — loi du 6 juillet 1989",
    legalMaxDeposit: "2 mois de loyer HC max",
    depositFactor: 2,
  },
  {
    value: "COMMERCIAL",
    label: "Bail commercial",
    description: "Statut des baux commerciaux (3-6-9 ans)",
    legalMaxDeposit: "Libre accord des parties",
    depositFactor: 1,
  },
  {
    value: "SEASONAL",
    label: "Location saisonnière",
    description: "Courte durée / villégiature",
    legalMaxDeposit: "Libre accord des parties",
    depositFactor: 1,
  },
] as const;

const PAYMENT_METHODS = [
  { value: "TRANSFER", label: "Virement bancaire" },
  { value: "DIRECT_DEBIT", label: "Prélèvement automatique" },
  { value: "CHECK", label: "Chèque" },
  { value: "CASH", label: "Espèces (remise en main propre)" },
  { value: "OTHER", label: "Autre moyen de paiement" },
] as const;

const IRL_QUARTERS = [
  { value: "T1-2025", label: "T1 2025 (143,46)" },
  { value: "T2-2025", label: "T2 2025 (144,30)" },
  { value: "T3-2025", label: "T3 2025 (144,51)" },
  { value: "T4-2025", label: "T4 2025 (144,82)" },
  { value: "T1-2026", label: "T1 2026 (145,10)" },
  { value: "T2-2026", label: "T2 2026" },
  { value: "T3-2026", label: "T3 2026" },
  { value: "T4-2026", label: "T4 2026" },
] as const;

interface StandaloneLeaseFormProps {
  properties: Array<{ id: string; name: string; addressLine1: string; city: string }>;
  tenants: Array<{ id: string; firstName: string; lastName: string }>;
  initialPropertyId?: string;
}

export function StandaloneLeaseForm({
  properties,
  tenants: initialTenants,
  initialPropertyId,
}: StandaloneLeaseFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Local tenants state to allow instant inline creation without full page reload
  const [tenantList, setTenantList] = useState(initialTenants);
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isDepositCustomized, setIsDepositCustomized] = useState(false);

  // Today in YYYY-MM-DD
  const todayStr = new Date().toISOString().split("T")[0];

  const defaultPropertyId =
    initialPropertyId ?? (properties.length === 1 ? properties[0].id : undefined);
  const defaultTenantId =
    initialTenants.length === 1 ? initialTenants[0].id : undefined;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StandaloneLeaseFormValues>({
    resolver: zodResolver(standaloneLeaseSchema) as any,
    defaultValues: {
      propertyId: defaultPropertyId ?? "",
      tenantId: defaultTenantId ?? "",
      rentAmount: "" as unknown as number,
      chargesAmount: 0,
      depositAmount: 0,
      startDate: todayStr,
      endDate: "",
      paymentDay: 1,
      paymentMethod: "TRANSFER",
      leaseType: "UNFURNISHED",
      irlReferenceQuarter: "T3-2025",
      irlReferenceValue: undefined,
    },
  });

  const selectedPropertyId = watch("propertyId");
  const selectedTenantId = watch("tenantId");
  const selectedLeaseType = watch("leaseType") ?? "UNFURNISHED";
  const rentAmountRaw = watch("rentAmount");
  const chargesAmountRaw = watch("chargesAmount");
  const depositAmountRaw = watch("depositAmount");
  const paymentDayRaw = watch("paymentDay");
  const paymentMethodRaw = watch("paymentMethod");

  // Dynamic live calculations using Decimal
  const rentNumber = parseFloat(String(rentAmountRaw || 0));
  const chargesNumber = parseFloat(String(chargesAmountRaw || 0));
  const safeRent = !isNaN(rentNumber) && rentNumber > 0 ? rentNumber : 0;
  const safeCharges = !isNaN(chargesNumber) && chargesNumber >= 0 ? chargesNumber : 0;

  const totalRentDecimal = new Decimal(safeRent).plus(safeCharges);

  // French legal ceiling calculation for security deposit (Art. 22 Loi 89)
  const currentLeaseConfig =
    LEASE_TYPES.find((t) => t.value === selectedLeaseType) ?? LEASE_TYPES[0];
  const legalStandardDeposit = safeRent * currentLeaseConfig.depositFactor;

  // Handle inline quick-create tenant callback
  function handleTenantCreated(created: { id: string; firstName: string; lastName: string }) {
    setTenantList((prev) => {
      const exists = prev.some((t) => t.id === created.id);
      if (exists) return prev;
      return [...prev, created];
    });
    setValue("tenantId", created.id, { shouldValidate: true });
    toast.success(`Locataire ${created.firstName} ${created.lastName} sélectionné pour ce bail`);
  }

  function onSubmit(values: StandaloneLeaseFormValues) {
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
        // Redirect to Property Home Base if property exists, or to /leases
        const targetPropertyId = (result.data as any)?.propertyId || values.propertyId;
        if (targetPropertyId) {
          router.push(`/properties/${targetPropertyId}?activated=1`);
        } else {
          router.push("/leases");
        }
        router.refresh();
      } else {
        toast.error(result.error ?? "Une erreur est survenue lors de la création du bail");
      }
    });
  }

  // Value → label maps for Base UI Selects so triggers display human labels, not CUIDs or raw enums
  const propertyLabelById: Record<string, string> = Object.fromEntries(
    properties.map((p) => [p.id, `${p.name} (${p.city})`])
  );
  const tenantLabelById: Record<string, string> = Object.fromEntries(
    tenantList.map((t) => [t.id, `${t.firstName} ${t.lastName}`])
  );
  const leaseTypeLabelByValue: Record<string, string> = Object.fromEntries(
    LEASE_TYPES.map((t) => [t.value, t.label])
  );
  const paymentMethodLabelByValue: Record<string, string> = Object.fromEntries(
    PAYMENT_METHODS.map((m) => [m.value, m.label])
  );
  const irlQuarterLabelByValue: Record<string, string> = Object.fromEntries(
    IRL_QUARTERS.map((q) => [q.value, q.label])
  );

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId);
  const selectedTenant = tenantList.find((t) => t.id === selectedTenantId);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* SECTION 1: Cadre de la location (Logement, locataire, type de bail) */}
      <Card className="shadow-sm border-border/60">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Building2 className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">1. Cadre de la location</CardTitle>
              <CardDescription className="text-xs">
                Logement concerné, locataire titulaire du bail et nature du contrat.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Bien immobilier */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="propertyId" className="text-sm font-medium">
                  Bien immobilier *
                </Label>
                {initialPropertyId && selectedPropertyId === initialPropertyId && (
                  <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4 font-normal">
                    Pré-sélectionné
                  </Badge>
                )}
              </div>
              <Select
                value={selectedPropertyId || ""}
                onValueChange={(val) =>
                  setValue("propertyId", val === "__none__" || !val ? undefined : (val as string), {
                    shouldValidate: true,
                  })
                }
                items={propertyLabelById}
              >
                <SelectTrigger id="propertyId" className="w-full">
                  <SelectValue placeholder="Sélectionner un bien" />
                </SelectTrigger>
                <SelectContent>
                  {properties.length === 0 ? (
                    <SelectItem value="__none__" disabled>
                      Aucun bien disponible
                    </SelectItem>
                  ) : (
                    <>
                      <SelectItem value="__none__">— Aucun bien —</SelectItem>
                      {properties.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name} ({p.city})
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
              {selectedProperty && (
                <p className="text-xs text-muted-foreground truncate">
                  {selectedProperty.addressLine1}, {selectedProperty.city}
                </p>
              )}
              {errors.propertyId && (
                <p role="alert" className="text-xs font-medium text-destructive">
                  {errors.propertyId.message}
                </p>
              )}
            </div>

            {/* Locataire principal avec inline quick-create */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="tenantId" className="text-sm font-medium">
                  Locataire principal *
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTenantModalOpen(true)}
                >
                  <Plus className="size-3 mr-1" />
                  Nouveau locataire
                </Button>
              </div>
              <Select
                value={selectedTenantId || ""}
                onValueChange={(val) =>
                  setValue("tenantId", val === "__none__" || !val ? undefined : (val as string), {
                    shouldValidate: true,
                  })
                }
                items={tenantLabelById}
              >
                <SelectTrigger id="tenantId" className="w-full">
                  <SelectValue placeholder="Sélectionner un locataire" />
                </SelectTrigger>
                <SelectContent>
                  {tenantList.length === 0 ? (
                    <SelectItem value="__none__" disabled>
                      Aucun locataire enregistré
                    </SelectItem>
                  ) : (
                    <>
                      <SelectItem value="__none__">— Aucun locataire —</SelectItem>
                      {tenantList.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.firstName} {t.lastName}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
              {tenantList.length === 0 && (
                <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-md p-2">
                  Aucun locataire enregistré. Cliquez sur « + Nouveau locataire » ci-dessus pour en créer un rapidement sans quitter cette page.
                </p>
              )}
              {errors.tenantId && (
                <p role="alert" className="text-xs font-medium text-destructive">
                  {errors.tenantId.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            {/* Type de bail */}
            <div className="space-y-2">
              <Label htmlFor="leaseType" className="text-sm font-medium">
                Type de bail *
              </Label>
              <Select
                value={selectedLeaseType}
                onValueChange={(val) =>
                  setValue("leaseType", val as StandaloneLeaseFormValues["leaseType"], {
                    shouldValidate: true,
                  })
                }
                items={leaseTypeLabelByValue}
              >
                <SelectTrigger id="leaseType" className="w-full">
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
              <p className="text-xs text-muted-foreground">{currentLeaseConfig.description}</p>
              {errors.leaseType && (
                <p role="alert" className="text-xs font-medium text-destructive">
                  {errors.leaseType.message}
                </p>
              )}
            </div>

            {/* Date de prise d'effet */}
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-sm font-medium">
                Date de prise d&apos;effet *
              </Label>
              <Input
                id="startDate"
                type="date"
                className="w-full"
                {...register("startDate")}
              />
              <p className="text-xs text-muted-foreground">
                Date d&apos;entrée dans les lieux et début de facturation des loyers.
              </p>
              {errors.startDate && (
                <p role="alert" className="text-xs font-medium text-destructive">
                  {errors.startDate.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: Loyer & Provisions pour charges (Conditions financières) */}
      <Card className="shadow-sm border-border/60">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Euro className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">2. Conditions financières</CardTitle>
              <CardDescription className="text-xs">
                Fixez le montant du loyer principal hors charges et les provisions pour charges.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rentAmount" className="text-sm font-medium">
                Loyer hors charges (€) *
              </Label>
              <Input
                id="rentAmount"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                placeholder="Ex : 850,00"
                {...register("rentAmount")}
              />
              <p className="text-xs text-muted-foreground">
                Montant mensuel net hors charges locatives.
              </p>
              {errors.rentAmount && (
                <p role="alert" className="text-xs font-medium text-destructive">
                  {errors.rentAmount.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="chargesAmount" className="text-sm font-medium">
                Provisions sur charges (€)
              </Label>
              <Input
                id="chargesAmount"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                placeholder="Ex : 50,00"
                {...register("chargesAmount")}
              />
              <p className="text-xs text-muted-foreground">
                Provisions mensuelles pour charges récupérables (eau, copropriété...).
              </p>
              {errors.chargesAmount && (
                <p role="alert" className="text-xs font-medium text-destructive">
                  {errors.chargesAmount.message}
                </p>
              )}
            </div>
          </div>

          {/* Dynamic live total breakdown */}
          <div className="rounded-xl border border-border/80 bg-muted/40 p-4 space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Total mensuel exigible :
              </span>
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {formatCurrency(totalRentDecimal)}
                <span className="text-sm font-normal text-muted-foreground ml-1">/ mois</span>
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/60 gap-1">
              <span>Loyer principal HC : <strong>{formatCurrency(safeRent)}</strong></span>
              <span>+ Provisions pour charges : <strong>{formatCurrency(safeCharges)}</strong></span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3: Modalités complémentaires (Progressive Disclosure) */}
      <Card className="shadow-sm border-border/60 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                3. Modalités complémentaires & Révision IRL
              </p>
              <p className="text-xs text-muted-foreground">
                Dépôt de garantie ({formatCurrency(depositAmountRaw ?? 0)}), jour d&apos;échéance ({paymentDayRaw ?? 1}), révision annuelle INSEE...
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{showAdvanced ? "Masquer" : "Afficher"}</span>
            {showAdvanced ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </div>
        </button>

        {showAdvanced && (
          <CardContent className="space-y-5 pt-2 border-t border-border/60 bg-card">
            {/* Dépôt de garantie & Jour de paiement */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="depositAmount" className="text-sm font-medium">
                    Dépôt de garantie (€)
                  </Label>
                  <span className="text-[11px] text-muted-foreground">
                    Facultatif · {currentLeaseConfig.legalMaxDeposit}
                  </span>
                </div>
                <Input
                  id="depositAmount"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  {...register("depositAmount", {
                    onChange: () => setIsDepositCustomized(true),
                  })}
                />
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>
                      Plafond légal : {formatCurrency(legalStandardDeposit)}
                    </span>
                    {safeRent > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsDepositCustomized(true);
                          setValue("depositAmount", legalStandardDeposit, { shouldValidate: true });
                        }}
                        className="text-primary hover:underline font-medium"
                      >
                        Appliquer le plafond ({formatCurrency(legalStandardDeposit)})
                      </button>
                    )}
                  </div>
                  {safeRent > 0 && Number(depositAmountRaw || 0) > legalStandardDeposit && (
                    <p className="text-destructive text-[11px]">
                      Attention : ce montant dépasse le plafond légal de {formatCurrency(legalStandardDeposit)}.
                    </p>
                  )}
                </div>
                {errors.depositAmount && (
                  <p role="alert" className="text-xs font-medium text-destructive">
                    {errors.depositAmount.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentDay" className="text-sm font-medium">
                  Jour d&apos;exigibilité du loyer
                </Label>
                <Input
                  id="paymentDay"
                  type="number"
                  min="1"
                  max="31"
                  {...register("paymentDay")}
                />
                <p className="text-xs text-muted-foreground">
                  Jour du mois où le loyer est exigible (généralement le 1er du mois à échoir).
                </p>
                {errors.paymentDay && (
                  <p role="alert" className="text-xs font-medium text-destructive">
                    {errors.paymentDay.message}
                  </p>
                )}
              </div>
            </div>

            {/* Mode de paiement & Date de fin */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod" className="text-sm font-medium">
                  Mode de règlement privilégié
                </Label>
                <Select
                  value={paymentMethodRaw ?? "TRANSFER"}
                  onValueChange={(val) =>
                    setValue("paymentMethod", val as StandaloneLeaseFormValues["paymentMethod"])
                  }
                  items={paymentMethodLabelByValue}
                >
                  <SelectTrigger id="paymentMethod" className="w-full">
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
                <p className="text-xs text-muted-foreground">
                  Moyen de règlement convenu entre le bailleur et le locataire.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-medium">
                  Date de fin de bail (facultatif)
                </Label>
                <Input id="endDate" type="date" className="w-full" {...register("endDate")} />
                <p className="text-xs text-muted-foreground">
                  Laisser vide pour un bail standard reconduit tacitement.
                </p>
              </div>
            </div>

            {/* Révision INSEE IRL (si vide ou meublé) */}
            {(selectedLeaseType === "UNFURNISHED" || selectedLeaseType === "FURNISHED") && (
              <div className="pt-2 border-t border-border/50 space-y-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Révision annuelle du loyer (Indice IRL INSEE)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    RentReady calcule et vous notifie automatiquement la revalorisation légale du loyer à chaque date anniversaire du bail.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="irlReferenceQuarter" className="text-sm font-medium">
                      Trimestre de référence INSEE
                    </Label>
                    <Select
                      value={(watch("irlReferenceQuarter") as string | undefined) ?? ""}
                      onValueChange={(val) =>
                        setValue("irlReferenceQuarter", val as string | undefined)
                      }
                      items={irlQuarterLabelByValue}
                    >
                      <SelectTrigger id="irlReferenceQuarter" className="w-full">
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
                    <Label htmlFor="irlReferenceValue" className="text-sm font-medium">
                      Valeur de l&apos;indice d&apos;origine
                    </Label>
                    <Input
                      id="irlReferenceValue"
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min="0"
                      placeholder="Ex : 144.51"
                      {...register("irlReferenceValue")}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Submission Footer */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (initialPropertyId) {
              router.push(`/properties/${initialPropertyId}`);
            } else {
              router.push("/leases");
            }
          }}
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto font-medium"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Création du bail en cours...
            </>
          ) : (
            <>
              <Check className="size-4 mr-2" />
              Créer le bail
            </>
          )}
        </Button>
      </div>
    </form>

    <TenantForm
      open={isTenantModalOpen}
      onOpenChange={setIsTenantModalOpen}
      onSuccess={handleTenantCreated}
    />
  </>
);
}
