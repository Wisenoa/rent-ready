"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Plus,
  ChevronDown,
  ChevronUp,
  Building2,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TenantForm } from "@/components/tenant-form";
import { formatCurrency } from "@/lib/format";
import { FormField, Money } from "@/components/design-system";

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

  // État local des locataires pour création inline sans rechargement
  const [tenantList, setTenantList] = useState(initialTenants);
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Date du jour au format ISO YYYY-MM-DD
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

  // Calculs financiers dynamiques stricts avec Decimal
  const rentNumber = parseFloat(String(rentAmountRaw || 0));
  const chargesNumber = parseFloat(String(chargesAmountRaw || 0));
  const safeRent = !isNaN(rentNumber) && rentNumber > 0 ? rentNumber : 0;
  const safeCharges = !isNaN(chargesNumber) && chargesNumber >= 0 ? chargesNumber : 0;

  const totalRentDecimal = new Decimal(safeRent).plus(safeCharges);

  // Plafond légal français du dépôt de garantie (Art. 22 Loi du 6 juillet 1989)
  const currentLeaseConfig =
    LEASE_TYPES.find((t) => t.value === selectedLeaseType) ?? LEASE_TYPES[0];
  const legalStandardDeposit = safeRent * currentLeaseConfig.depositFactor;

  // Callback de création rapide d'un locataire inline
  function handleTenantCreated(created: { id: string; firstName: string; lastName: string }) {
    setTenantList((prev) => {
      const exists = prev.some((t) => t.id === created.id);
      if (exists) return prev;
      return [...prev, created];
    });
    setValue("tenantId", created.id, { shouldValidate: true });
    toast.success(`Locataire ${created.firstName} ${created.lastName} rattaché au bail`);
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
        if (initialPropertyId) {
          router.push(`/properties/${initialPropertyId}?activated=1`);
        } else {
          router.push("/leases");
        }
        router.refresh();
      } else {
        toast.error(result.error ?? "Une erreur est survenue lors de la création du bail");
      }
    });
  }

  // Tables de correspondances pour les Selects Base UI
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

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Conteneur architectural B+ continu */}
        <div className="border border-[#151413]/10 bg-[#FAF8F3] divide-y divide-[#151413]/10">
          {/* ──────────────────────────────────────────────────────────────── */}
          {/* SECTION 1: Cadre juridique et parties contractantes              */}
          {/* ──────────────────────────────────────────────────────────────── */}
          <div className="p-5 sm:p-6 space-y-5">
            <div className="space-y-0.5">
              <span className="text-[11px] uppercase tracking-wider text-[#6B6760] font-semibold block">
                1. Cadre de la location
              </span>
              <h2 className="text-sm font-semibold text-[#151413]">
                Désignation du bien & Locataire titulaire
              </h2>
              <p className="text-xs text-[#6B6760]">
                Sélectionnez le bien loué et le locataire titulaire du bail.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Bien immobilier */}
              <FormField
                id="propertyId"
                label="Bien immobilier"
                required
                description={
                  selectedProperty
                    ? `${selectedProperty.addressLine1}, ${selectedProperty.city}`
                    : "Logement rattaché au contrat."
                }
                error={errors.propertyId?.message}
                badge={
                  initialPropertyId && selectedPropertyId === initialPropertyId ? (
                    <span className="text-[10px] text-[#166534] bg-[#F0FDF4] px-1.5 py-0.5 border border-[#166534]/20">
                      Pré-sélectionné
                    </span>
                  ) : undefined
                }
              >
                <Select
                  value={selectedPropertyId || ""}
                  onValueChange={(val) =>
                    setValue("propertyId", val === "__none__" || !val ? undefined : (val as string), {
                      shouldValidate: true,
                    })
                  }
                  items={propertyLabelById}
                >
                  <SelectTrigger id="propertyId" className="w-full bg-white border-[#151413]/15">
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
              </FormField>

              {/* Locataire principal */}
              <FormField
                id="tenantId"
                label="Locataire principal"
                required
                description="Titulaire signataire du contrat de bail."
                error={errors.tenantId?.message}
                badge={
                  <button
                    type="button"
                    onClick={() => setIsTenantModalOpen(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-[#151413] hover:underline"
                  >
                    <Plus className="size-3" />
                    <span>Nouveau locataire</span>
                  </button>
                }
              >
                <Select
                  value={selectedTenantId || ""}
                  onValueChange={(val) =>
                    setValue("tenantId", val === "__none__" || !val ? undefined : (val as string), {
                      shouldValidate: true,
                    })
                  }
                  items={tenantLabelById}
                >
                  <SelectTrigger id="tenantId" className="w-full bg-white border-[#151413]/15">
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
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 pt-1">
              {/* Type de bail */}
              <FormField
                id="leaseType"
                label="Type de contrat"
                required
                description={currentLeaseConfig.description}
                error={errors.leaseType?.message}
              >
                <Select
                  value={selectedLeaseType}
                  onValueChange={(val) =>
                    setValue("leaseType", val as StandaloneLeaseFormValues["leaseType"], {
                      shouldValidate: true,
                    })
                  }
                  items={leaseTypeLabelByValue}
                >
                  <SelectTrigger id="leaseType" className="w-full bg-white border-[#151413]/15">
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
              </FormField>

              {/* Date de prise d'effet */}
              <FormField
                id="startDate"
                label="Date de prise d'effet"
                required
                description="Entrée dans les lieux et début de facturation des loyers."
                error={errors.startDate?.message}
              >
                <Input
                  id="startDate"
                  type="date"
                  className="w-full bg-white border-[#151413]/15 text-[#151413]"
                  {...register("startDate")}
                />
              </FormField>

              {/* Date de fin de bail */}
              <FormField
                id="endDate"
                label="Date de fin de bail"
                optional
                description="Laisser vide pour un bail standard reconduit tacitement."
                error={errors.endDate?.message}
              >
                <Input
                  id="endDate"
                  type="date"
                  className="w-full bg-white border-[#151413]/15 text-[#151413]"
                  {...register("endDate")}
                />
              </FormField>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────────── */}
          {/* SECTION 2: Conditions financières & Ventilation loyer/charges     */}
          {/* ──────────────────────────────────────────────────────────────── */}
          <div className="p-5 sm:p-6 space-y-5">
            <div className="space-y-0.5">
              <span className="text-[11px] uppercase tracking-wider text-[#6B6760] font-semibold block">
                2. Conditions financières
              </span>
              <h2 className="text-sm font-semibold text-[#151413]">
                Loyer mensuel & Provisions sur charges
              </h2>
              <p className="text-xs text-[#6B6760]">
                Fixez le montant du loyer principal hors charges et les provisions pour charges locatives.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                id="rentAmount"
                label="Loyer principal hors charges (€)"
                required
                description="Montant mensuel net hors charges locatives."
                error={errors.rentAmount?.message}
              >
                <Input
                  id="rentAmount"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  placeholder="Ex : 850,00"
                  className="w-full bg-white border-[#151413]/15 font-mono text-sm"
                  {...register("rentAmount")}
                />
              </FormField>

              <FormField
                id="chargesAmount"
                label="Provisions pour charges (€)"
                optional
                description="Charges locatives récupérables (eau, copropriété...)."
                error={errors.chargesAmount?.message}
              >
                <Input
                  id="chargesAmount"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  placeholder="Ex : 50,00"
                  className="w-full bg-white border-[#151413]/15 font-mono text-sm"
                  {...register("chargesAmount")}
                />
              </FormField>
            </div>

            {/* Récapitulatif total dynamique */}
            <div className="border border-[#151413]/10 bg-white p-4 space-y-2">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-xs uppercase tracking-wider text-[#6B6760] font-medium">
                  Total mensuel exigible :
                </span>
                <div className="flex items-baseline gap-1">
                  <Money amount={totalRentDecimal} size="xl" tone="ink" />
                  <span className="text-xs text-[#6B6760]">/ mois</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between text-xs text-[#6B6760] pt-2 border-t border-[#151413]/10 gap-1 font-mono">
                <span>Loyer HC : {formatCurrency(safeRent)}</span>
                <span>+ Provisions charges : {formatCurrency(safeCharges)}</span>
              </div>
            </div>

            {/* Dépôt de garantie & Échéance */}
            <div className="grid gap-5 sm:grid-cols-2 pt-2">
              <FormField
                id="depositAmount"
                label="Dépôt de garantie (€)"
                optional
                description={
                  <span className="block space-y-1">
                    <span>Plafond légal : {formatCurrency(legalStandardDeposit)} ({currentLeaseConfig.legalMaxDeposit})</span>
                    {safeRent > 0 && (
                      <button
                        type="button"
                        onClick={() => setValue("depositAmount", legalStandardDeposit, { shouldValidate: true })}
                        className="text-[#151413] underline font-medium hover:text-[#6B6760] block"
                      >
                        Appliquer le plafond légal ({formatCurrency(legalStandardDeposit)})
                      </button>
                    )}
                  </span>
                }
                error={errors.depositAmount?.message}
              >
                <Input
                  id="depositAmount"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  className="w-full bg-white border-[#151413]/15 font-mono text-sm"
                  {...register("depositAmount")}
                />
              </FormField>

              <FormField
                id="paymentDay"
                label="Jour d'échéance du terme"
                required
                description="Jour du mois où le loyer est exigible (généralement le 1er du mois)."
                error={errors.paymentDay?.message}
              >
                <Input
                  id="paymentDay"
                  type="number"
                  min="1"
                  max="31"
                  className="w-full bg-white border-[#151413]/15 font-mono text-sm"
                  {...register("paymentDay")}
                />
              </FormField>
            </div>

            {/* Mode de règlement */}
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                id="paymentMethod"
                label="Mode de règlement convenu"
                description="Moyen de paiement convenu entre bailleur et locataire."
              >
                <Select
                  value={paymentMethodRaw ?? "TRANSFER"}
                  onValueChange={(val) =>
                    setValue("paymentMethod", val as StandaloneLeaseFormValues["paymentMethod"])
                  }
                  items={paymentMethodLabelByValue}
                >
                  <SelectTrigger id="paymentMethod" className="w-full bg-white border-[#151413]/15">
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
              </FormField>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────────── */}
          {/* SECTION 3: Modalités complémentaires (Progressive Disclosure)   */}
          {/* ──────────────────────────────────────────────────────────────── */}
          {(selectedLeaseType === "UNFURNISHED" || selectedLeaseType === "FURNISHED") && (
            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-[#F2EFE9]/40 transition-colors"
              >
                <div className="space-y-0.5">
                  <span className="text-[11px] uppercase tracking-wider text-[#6B6760] font-semibold block">
                    3. Modalités complémentaires & Révision IRL
                  </span>
                  <span className="text-sm font-semibold text-[#151413] block">
                    Indexation annuelle du loyer (Indice de Référence des Loyers)
                  </span>
                  <span className="text-xs text-[#6B6760] block font-mono">
                    Revalorisation légale à la date anniversaire
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6B6760]">
                  <span>{showAdvanced ? "Masquer" : "Afficher"}</span>
                  {showAdvanced ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </div>
              </button>

              {showAdvanced && (
                <div className="p-5 sm:p-6 space-y-5 border-t border-[#151413]/10 bg-[#FAF8F3]/60">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      id="irlReferenceQuarter"
                      label="Trimestre de référence INSEE"
                      description="Trimestre IRL stipulé au contrat de location."
                    >
                      <Select
                        value={(watch("irlReferenceQuarter") as string | undefined) ?? ""}
                        onValueChange={(val) =>
                          setValue("irlReferenceQuarter", val as string | undefined)
                        }
                        items={irlQuarterLabelByValue}
                      >
                        <SelectTrigger id="irlReferenceQuarter" className="w-full bg-white border-[#151413]/15">
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
                    </FormField>

                    <FormField
                      id="irlReferenceValue"
                      label="Valeur de l'indice d'origine"
                      optional
                      description="Valeur numérique de l'indice INSEE au contrat."
                    >
                      <Input
                        id="irlReferenceValue"
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        min="0"
                        placeholder="Ex : 144.51"
                        className="w-full bg-white border-[#151413]/15 font-mono text-sm"
                        {...register("irlReferenceValue")}
                      />
                    </FormField>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* BOUTONS D'ACTION SOUMISSION                                      */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
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
            className="w-full sm:w-auto text-xs border-[#151413]/15 text-[#151413] hover:bg-[#FAF8F3]"
          >
            Annuler
          </Button>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto text-xs font-medium bg-[#151413] text-[#F8F6F0] hover:bg-[#151413]/90"
          >
            {isPending ? (
              <>
                <Loader2 className="size-3.5 mr-2 animate-spin" />
                Création du bail en cours...
              </>
            ) : (
              <>
                <Check className="size-3.5 mr-2" />
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
