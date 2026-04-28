"use client";

import { useState, useTransition, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Home,
  User,
  FileCheck,
  Clock,
  PartyPopper,
  HelpCircle,
  Sparkles,
  ChevronRight,
  X,
  Database,
} from "lucide-react";
import { toast } from "sonner";

import {
  propertySchema,
  type PropertyFormValues,
} from "@/lib/validations/property";
import {
  tenantSchema,
  type TenantFormValues,
} from "@/lib/validations/tenant";
import {
  leaseSchema,
  type LeaseFormValues,
} from "@/lib/validations/lease";
import { createProperty } from "@/lib/actions/property-actions";
import { createTenant } from "@/lib/actions/tenant-actions";
import { createLease } from "@/lib/actions/lease-actions";
import { insertSampleData } from "@/lib/actions/sample-data-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { OnboardingVariant } from "./onboarding-trigger";

const PROPERTY_TYPES = [
  { value: "APARTMENT", label: "Appartement" },
  { value: "HOUSE", label: "Maison" },
  { value: "STUDIO", label: "Studio" },
  { value: "COMMERCIAL", label: "Local commercial" },
  { value: "PARKING", label: "Parking" },
  { value: "OTHER", label: "Autre" },
] as const;

const LEASE_TYPES = [
  { value: "UNFURNISHED", label: "Location vide" },
  { value: "FURNISHED", label: "Location meublée" },
] as const;

const PAYMENT_METHODS = [
  { value: "TRANSFER", label: "Virement bancaire" },
  { value: "CHECK", label: "Chèque" },
  { value: "DIRECT_DEBIT", label: "Prélèvement automatique" },
] as const;

type WizardState = {
  propertyId?: string;
  tenantId?: string;
  propertySkipped?: boolean;
  tenantSkipped?: boolean;
  rentSkipped?: boolean;
};

interface OnboardingWizardV2Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: OnboardingVariant;
}

const STORAGE_KEY = "onboarding_wizard_state";

// ─── Event Tracking ───────────────────────────────────────────────────────────

function trackEvent(
  event: string,
  metadata: Record<string, string | number | boolean | undefined>
) {
  fetch("/api/onboarding/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event,
      metadata,
      timestamp: new Date().toISOString(),
    }),
  }).catch(() => {
    // Non-critical
  });
}

// ─── State Persistence ────────────────────────────────────────────────────────

function loadState(): WizardState {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveState(partial: Partial<WizardState>) {
  if (typeof window === "undefined") return;
  try {
    const current = loadState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...partial }));
  } catch {
    // Storage unavailable
  }
}

function clearState() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable
  }
}

// ─── Tooltip Helpers ──────────────────────────────────────────────────────────

function FieldTooltip({ content }: { content: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="size-3.5 text-muted-foreground cursor-help ml-1" />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[240px]">
        {content}
      </TooltipContent>
    </Tooltip>
  );
}

function TooltipParagraph({ content }: { content: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help border-b border-dashed border-muted-foreground">
          {content}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[280px] text-left text-xs">
        {content}
      </TooltipContent>
    </Tooltip>
  );
}

// ─── Progress Indicator ───────────────────────────────────────────────────────

function ProgressIndicator({
  current,
  total,
  label,
}: {
  current: number;
  total: number;
  label: string;
}) {
  const percentage = (current / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Étape {current} sur {total} · {label}
        </span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ─── Step 1: Quick Property (Simplified) ──────────────────────────────────────

function PropertyStepV2({
  onNext,
  onSkip,
}: {
  onNext: (propertyId: string) => void;
  onSkip: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const stepStartRef = useRef(Date.now());

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema) as any,
    defaultValues: {
      type: "APARTMENT",
    },
  });

  const propertyType = watch("type");

  function onSubmit(data: PropertyFormValues) {
    const duration = Math.round((Date.now() - stepStartRef.current) / 1000);
    startTransition(async () => {
      const formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      }
      const result = await createProperty(formData);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      const propertyId = (result as { data?: { id: string } })?.data?.id;
      if (propertyId) {
        trackEvent("onboarding_step_1_completed", { propertyId, duration_seconds: duration });
        saveState({ propertyId });
        onNext(propertyId);
      }
    });
  }

  function handleSkip() {
    const duration = Math.round((Date.now() - stepStartRef.current) / 1000);
    trackEvent("onboarding_step_1_skipped", { duration_seconds: duration });
    saveState({ propertySkipped: true });
    onSkip();
  }

  return (
    <TooltipProvider>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <div className="flex items-center">
            <Label htmlFor="name">
              Nom du bien <span className="text-red-500">*</span>
            </Label>
            <FieldTooltip content="Un nom simple pour retrouver facilement votre bien (ex: Appartement Belleville)" />
          </div>
          <Input
            id="name"
            placeholder="ex: Appartement Belleville"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center">
            <Label>Type de bien <span className="text-red-500">*</span></Label>
            <FieldTooltip content="Le type influence vos obligations légales et fiscales. Sélectionnez celui qui correspond le mieux." />
          </div>
          <Select
            value={propertyType}
            onValueChange={(v) => setValue("type", v as PropertyFormValues["type"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center">
            <Label htmlFor="addressLine1">
              Adresse <span className="text-red-500">*</span>
            </Label>
            <FieldTooltip content="L'adresse est nécessaire pour le bail et les documents légaux. Vous pouvez modifier plus tard." />
          </div>
          <Input
            id="addressLine1"
            placeholder="ex: 12 rue de la République"
            {...register("addressLine1")}
          />
          {errors.addressLine1 && (
            <p className="text-xs text-red-500">{errors.addressLine1.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center">
              <Label htmlFor="postalCode">Code postal <span className="text-red-500">*</span></Label>
              <FieldTooltip content="Le code postal détermine la ville automatiquement." />
            </div>
            <Input
              id="postalCode"
              placeholder="ex: 75010"
              {...register("postalCode")}
            />
            {errors.postalCode && (
              <p className="text-xs text-red-500">{errors.postalCode.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center">
              <Label htmlFor="city">Ville <span className="text-red-500">*</span></Label>
              <FieldTooltip content="La ville est utilisée pour les documents officiels." />
            </div>
            <Input
              id="city"
              placeholder="ex: Paris"
              {...register("city")}
            />
            {errors.city && (
              <p className="text-xs text-red-500">{errors.city.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center">
              <Label htmlFor="surface">Surface (m²)</Label>
              <FieldTooltip content="Utile pour estimer la valeur locative et les charges. Optionnel mais recommandé." />
            </div>
            <Input
              id="surface"
              type="number"
              placeholder="ex: 65"
              {...register("surface")}
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center">
              <Label htmlFor="rooms">Pièces</Label>
              <FieldTooltip content="Nombre de pièces principales. Utile pour les diagnostics et la recherche de locataire." />
            </div>
            <Input
              id="rooms"
              type="number"
              placeholder="ex: 3"
              {...register("rooms")}
            />
          </div>
        </div>

        <div className="bg-indigo-50 rounded-lg p-3 flex items-start gap-2">
          <Sparkles className="size-4 text-indigo-600 mt-0.5 shrink-0" />
          <p className="text-xs text-indigo-900">
            <span className="font-medium">En 2 minutes</span>, votre bien est enregistré et vous pouvez commencer à suivre vos loyers.
            Vous pouvez remplir les détails plus tard.
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Création en cours...
            </>
          ) : (
            <>
              Continuer
              <ArrowRight className="size-4 ml-2" />
            </>
          )}
        </Button>

        <button
          type="button"
          onClick={handleSkip}
          className="w-full text-center text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
        >
          Je configure plus tard — ajouter un locataire d'abord
        </button>
      </form>
    </TooltipProvider>
  );
}

// ─── Step 2: Quick Tenant (Simplified) ───────────────────────────────────────

function TenantStepV2({
  onNext,
  onBack,
  onSkip,
}: {
  onNext: (tenantId: string) => void;
  onBack: () => void;
  onSkip: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const stepStartRef = useRef(Date.now());

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TenantFormValues>({
    resolver: zodResolver(tenantSchema) as any,
    defaultValues: {
      addressLine1: "",
      city: "",
      postalCode: "",
    },
  });

  function onSubmit(data: TenantFormValues) {
    const duration = Math.round((Date.now() - stepStartRef.current) / 1000);
    startTransition(async () => {
      const formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      }
      const result = await createTenant(formData);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      const tenantId = (result as { data?: { id: string } })?.data?.id;
      if (tenantId) {
        trackEvent("onboarding_step_2_completed", { tenantId, duration_seconds: duration });
        saveState({ tenantId });
        onNext(tenantId);
      }
    });
  }

  function handleSkip() {
    const duration = Math.round((Date.now() - stepStartRef.current) / 1000);
    trackEvent("onboarding_step_2_skipped", { duration_seconds: duration });
    saveState({ tenantSkipped: true });
    toast.info("Locataire ajouté plus tard — vous pourrez le faire depuis la page Locataires.");
    onSkip();
  }

  return (
    <TooltipProvider>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center">
              <Label htmlFor="firstName">
                Prénom <span className="text-red-500">*</span>
              </Label>
              <FieldTooltip content="Prénom du locataire tel qu'il apparaîtra sur le bail." />
            </div>
            <Input
              id="firstName"
              placeholder="ex: Marie"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-xs text-red-500">{errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center">
              <Label htmlFor="lastName">
                Nom <span className="text-red-500">*</span>
              </Label>
              <FieldTooltip content="Nom de famille du locataire." />
            </div>
            <Input
              id="lastName"
              placeholder="ex: Dupont"
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-xs text-red-500">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center">
            <Label htmlFor="email">Email</Label>
            <span className="text-xs text-muted-foreground ml-1">(optionnel)</span>
            <FieldTooltip content="Utile pour envoyer les reçus et reminders automatiquement. Si vous n'avez pas l'email, vous pouvez l'ajouter plus tard." />
          </div>
          <Input
            id="email"
            type="email"
            placeholder="ex: marie.dupont@email.fr"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center">
            <Label htmlFor="phone">Téléphone</Label>
            <span className="text-xs text-muted-foreground ml-1">(optionnel)</span>
            <FieldTooltip content="Utile pour les rappels de paiement et les communications." />
          </div>
          <Input
            id="phone"
            placeholder="ex: 06 12 34 56 78"
            {...register("phone")}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center">
            <Label htmlFor="t-addressLine1">
              Adresse <span className="text-red-500">*</span>
            </Label>
            <FieldTooltip content="Adresse actuelle du locataire (pour le bail et les diagnostics).">
              {/* Intentionally empty */}
            </FieldTooltip>
          </div>
          <Input
            id="t-addressLine1"
            placeholder="ex: 8 avenue des Champs"
            {...register("addressLine1")}
          />
          {errors.addressLine1 && (
            <p className="text-xs text-red-500">{errors.addressLine1.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center">
              <Label htmlFor="t-postalCode">Code postal <span className="text-red-500">*</span></Label>
              <FieldTooltip content="Code postal de l'adresse du locataire." />
            </div>
            <Input
              id="t-postalCode"
              placeholder="ex: 75008"
              {...register("postalCode")}
            />
            {errors.postalCode && (
              <p className="text-xs text-red-500">{errors.postalCode.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center">
              <Label htmlFor="t-city">Ville <span className="text-red-500">*</span></Label>
              <FieldTooltip content="Ville de résidence actuelle du locataire." />
            </div>
            <Input
              id="t-city"
              placeholder="ex: Paris"
              {...register("city")}
            />
            {errors.city && (
              <p className="text-xs text-red-500">{errors.city.message}</p>
            )}
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-3 flex items-start gap-2">
          <Clock className="size-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Prochaine étape :</span> créer le bail.
            Vous pourrez compléter le dossier locataire plus tard.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            <ArrowLeft className="size-4 mr-2" />
            Retour
          </Button>
          <Button type="submit" className="flex-1" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Création...
              </>
            ) : (
              <>
                Continuer
                <ArrowRight className="size-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        <button
          type="button"
          onClick={handleSkip}
          className="w-full text-center text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
        >
          Je configure plus tard
        </button>
      </form>
    </TooltipProvider>
  );
}

// ─── Step 3: Quick Lease (Simplified) ─────────────────────────────────────────

function LeaseStepV2({
  propertyId,
  tenantId,
  onBack,
  onComplete,
}: {
  propertyId: string;
  tenantId: string;
  onBack: () => void;
  onComplete: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const stepStartRef = useRef(Date.now());
  const today = new Date().toISOString().split("T")[0];
  const oneYearLater = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LeaseFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(leaseSchema) as any,
    defaultValues: {
      propertyId,
      tenantId,
      rentAmount: 0,
      chargesAmount: 0,
      depositAmount: 0,
      startDate: today,
      endDate: oneYearLater,
      paymentDay: 1,
      paymentMethod: "TRANSFER",
      leaseType: "UNFURNISHED",
    },
  });

  const rentAmount = watch("rentAmount");

  function onSubmit(data: LeaseFormValues) {
    const duration = Math.round((Date.now() - stepStartRef.current) / 1000);
    startTransition(async () => {
      const formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      }
      const result = await createLease(formData);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      trackEvent("onboarding_lease_completed", {
        propertyId,
        tenantId,
        rentAmount: data.rentAmount,
        duration_seconds: duration,
      });
      clearState();
      onComplete();
    });
  }

  return (
    <TooltipProvider>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <div className="flex items-center">
            <Label>Type de bail <span className="text-red-500">*</span></Label>
            <FieldTooltip content="Location vide = bail de 3 ans (reconduction tacite). Location meublée = bail de 1 an." />
          </div>
          <Select
            onValueChange={(v) => setValue("leaseType", v as LeaseFormValues["leaseType"])}
            defaultValue="UNFURNISHED"
          >
            <SelectTrigger>
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

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center">
              <Label htmlFor="rentAmount">
                Loyer CC <span className="text-red-500">*</span>
              </Label>
              <FieldTooltip content="Loyer charges comprises (loyer + charges). Charges = provision, régularisation annuelle." />
            </div>
            <div className="relative">
              <Input
                id="rentAmount"
                type="number"
                placeholder="ex: 850"
                {...register("rentAmount")}
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                €/mois
              </span>
            </div>
            {errors.rentAmount && (
              <p className="text-xs text-red-500">{errors.rentAmount.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center">
              <Label htmlFor="chargesAmount">Charges</Label>
              <span className="text-xs text-muted-foreground ml-1">(optionnel)</span>
              <FieldTooltip content="Provision mensuelle pour charges (eau, entretien, etc.). Régularisée annuellement." />
            </div>
            <div className="relative">
              <Input
                id="chargesAmount"
                type="number"
                placeholder="ex: 50"
                {...register("chargesAmount")}
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                €/mois
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center">
            <Label htmlFor="depositAmount">Dépôt de garantie</Label>
            <span className="text-xs text-muted-foreground ml-1">(optionnel)</span>
            <FieldTooltip content="Maximum 1 mois de loyer hors charges pour location vide, 2 mois pour meublée." />
          </div>
          <div className="relative">
            <Input
              id="depositAmount"
              type="number"
              placeholder="ex: 850"
              {...register("depositAmount")}
              className="pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              €
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center">
              <Label htmlFor="startDate">Date de début <span className="text-red-500">*</span></Label>
              <FieldTooltip content="Date de début du bail. Usually today or the 1st of next month." />
            </div>
            <Input
              id="startDate"
              type="date"
              {...register("startDate")}
            />
            {errors.startDate && (
              <p className="text-xs text-red-500">{errors.startDate.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center">
              <Label htmlFor="endDate">Date de fin <span className="text-red-500">*</span></Label>
              <FieldTooltip content="Fin du bail. BAIL de 3 ans (vide) ou 1 an (meublé) renewable." />
            </div>
            <Input
              id="endDate"
              type="date"
              {...register("endDate")}
            />
            {errors.endDate && (
              <p className="text-xs text-red-500">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center">
            <Label htmlFor="paymentDay">Jour de paiement</Label>
            <FieldTooltip content="Jour du mois où le locataire doit payer. Standard = 1er." />
          </div>
          <Select
            onValueChange={(v) => setValue("paymentDay", parseInt(v))}
            defaultValue="1"
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                <SelectItem key={day} value={String(day)}>
                  Le {day} du mois
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center">
            <Label htmlFor="paymentMethod">Mode de paiement</Label>
            <FieldTooltip content="Comment le locataire vous paiera. Virement = plus simple à tracker." />
          </div>
          <Select
            onValueChange={(v) => setValue("paymentMethod", v as LeaseFormValues["paymentMethod"])}
            defaultValue="TRANSFER"
          >
            <SelectTrigger>
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

        <div className="bg-indigo-50 rounded-lg p-3 flex items-start gap-2">
          <Sparkles className="size-4 text-indigo-600 mt-0.5 shrink-0" />
          <p className="text-xs text-indigo-900">
            <span className="font-medium">Bon à savoir :</span> Vous recevrez des rappels automatiques
            {rentAmount > 0 ? ` pour le loyer de ${rentAmount}€/mois` : ""} et pourrez générer des reçus en un clic.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            <ArrowLeft className="size-4 mr-2" />
            Retour
          </Button>
          <Button type="submit" className="flex-1" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Création...
              </>
            ) : (
              <>
                Créer le bail
                <ArrowRight className="size-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </form>
    </TooltipProvider>
  );
}

// ─── Success Step ─────────────────────────────────────────────────────────────

function SuccessStepV2({
  propertyId,
  tenantId,
  propertySkipped,
  tenantSkipped,
  onClose,
  onGenerateReceipt,
  onInsertSampleData,
}: {
  propertyId?: string;
  tenantId?: string;
  propertySkipped?: boolean;
  tenantSkipped?: boolean;
  onClose: () => void;
  onGenerateReceipt: () => void;
  onInsertSampleData?: () => void;
}) {
  const router = useRouter();

  return (
    <div className="space-y-6 py-4">
      {/* Celebration */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-2">
          <PartyPopper className="size-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-semibold">Félicitations ! 🎉</h2>
        <p className="text-sm text-muted-foreground">
          Votre espace est prêt. Vous avez configuré :
        </p>
      </div>

      {/* Milestones */}
      <div className="space-y-2">
        {propertyId && !propertySkipped && (
          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
            <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-emerald-900">Bien ajouté</p>
              <p className="text-xs text-emerald-700">Votre premier bien est enregistré</p>
            </div>
          </div>
        )}
        {tenantId && !tenantSkipped && (
          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
            <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-emerald-900">Locataire ajouté</p>
              <p className="text-xs text-emerald-700">Prêt pour le bail</p>
            </div>
          </div>
        )}
        {propertySkipped && (
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Home className="size-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Bien — à ajouter plus tard</p>
            </div>
          </div>
        )}
        {tenantSkipped && (
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <User className="size-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Locataire — à ajouter plus tard</p>
            </div>
          </div>
        )}
      </div>

      {/* Next Steps */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Prochaines étapes suggérées</p>
        <div className="space-y-2">
          <button
            onClick={() => {
              onClose();
              router.push("/leases");
            }}
            className="w-full flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <FileCheck className="size-5 text-indigo-600" />
              <div>
                <p className="text-sm font-medium">Voir mes baux</p>
                <p className="text-xs text-muted-foreground">Gérer mes locations</p>
              </div>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>

          <button
            onClick={() => {
              onClose();
              router.push("/dashboard");
            }}
            className="w-full flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Home className="size-5 text-indigo-600" />
              <div>
                <p className="text-sm font-medium">Explorer le tableau de bord</p>
                <p className="text-xs text-muted-foreground">Voir l'aperçu de mon activité</p>
              </div>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* CTA */}
      <div className="space-y-2 pt-2">
        <Button onClick={onClose} className="w-full" size="lg">
          Aller au tableau de bord
          <ArrowRight className="size-4 ml-2" />
        </Button>
        {onInsertSampleData && (
          <button
            onClick={onInsertSampleData}
            className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
          >
            <Database className="size-4" />
            Remplir avec des données de démo
          </button>
        )}
        <button
          onClick={onGenerateReceipt}
          className="w-full text-center text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
        >
          Générer une quittance de loyer
        </button>
      </div>
    </div>
  );
}

// ─── Main Wizard ─────────────────────────────────────────────────────────────

export function OnboardingWizardV2({
  open,
  onOpenChange,
  variant = "C",
}: OnboardingWizardV2Props) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [state, setState] = useState<WizardState>({});
  const wizardStartRef = useRef(Date.now());

  // Restore state on mount / re-open
  useEffect(() => {
    if (open) {
      const saved = loadState();
      if (saved.propertyId || saved.tenantId || saved.propertySkipped || saved.tenantSkipped) {
        setState(saved);
        // Jump to appropriate step based on saved progress
        if (saved.propertySkipped && saved.tenantSkipped) {
          setCurrentStep(3);
        } else if (saved.propertySkipped || saved.propertyId) {
          setCurrentStep(saved.tenantId ? 3 : 2);
        }
      }
      trackEvent("onboarding_started", { variant });
    }
  }, [open, variant]);

  function handlePropertyNext(propertyId: string) {
    setState((s) => ({ ...s, propertyId }));
    setCurrentStep(2);
  }

  function handlePropertySkip() {
    setState((s) => ({ ...s, propertySkipped: true }));
    setCurrentStep(2);
  }

  function handleTenantNext(tenantId: string) {
    setState((s) => ({ ...s, tenantId }));
    setCurrentStep(3);
  }

  function handleTenantSkip() {
    setState((s) => ({ ...s, tenantSkipped: true }));
    // Can only create a lease if we have a property
    if (state.propertySkipped || state.propertyId) {
      setCurrentStep(3);
    } else {
      toast.error("Un bien est nécessaire pour créer un bail.");
      setCurrentStep(1);
    }
  }

  function handleLeaseComplete() {
    const duration = Math.round((Date.now() - wizardStartRef.current) / 1000);
    trackEvent("onboarding_completed", {
      propertyId: state.propertyId,
      tenantId: state.tenantId,
      propertySkipped: !!state.propertySkipped,
      tenantSkipped: !!state.tenantSkipped,
      duration_seconds: duration,
      variant,
    });
    setCurrentStep(4);
  }

  function handleClose() {
    const duration = Math.round((Date.now() - wizardStartRef.current) / 1000);
    trackEvent("onboarding_abandoned", {
      step: currentStep,
      duration_seconds: duration,
      has_property: !!state.propertyId,
      has_tenant: !!state.tenantId,
      variant,
    });
    clearState();
    onOpenChange(false);
    router.refresh();
  }

  function handleGenerateReceipt() {
    handleClose();
    router.push("/billing");
  }

  async function handleInsertSampleData() {
    toast.success("Insertion des données de démo en cours...");
    await insertSampleData();
    toast.success("Données de démo ajoutées ! Découvrez vos modules.");
    handleClose();
    router.refresh();
  }

  const stepLabels: Record<number, string> = {
    1: "Ajouter un bien",
    2: "Ajouter un locataire",
    3: "Créer le bail",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>Configuration initiale</DialogTitle>
          <DialogDescription>
            Configurez votre premier bien en moins de 10 minutes
          </DialogDescription>
        </DialogHeader>

        {currentStep < 4 && (
          <ProgressIndicator
            current={currentStep}
            total={3}
            label={stepLabels[currentStep]}
          />
        )}

        {currentStep === 1 && (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Home className="size-5 text-indigo-600" />
                Ajouter votre premier bien
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Commencez par enregistrer votre bien locatif. Vous pourrez
                ajouter des détails plus tard.
              </p>
            </div>
            <PropertyStepV2
              onNext={handlePropertyNext}
              onSkip={handlePropertySkip}
            />
          </>
        )}

        {currentStep === 2 && (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <User className="size-5 text-indigo-600" />
                Ajouter votre premier locataire
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Saisissez les informations de votre locataire. Vous pourrez
                compléter son dossier plus tard.
              </p>
            </div>
            <TenantStepV2
              onNext={handleTenantNext}
              onBack={() => setCurrentStep(1)}
              onSkip={handleTenantSkip}
            />
          </>
        )}

        {currentStep === 3 && state.propertyId && state.tenantId && (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileCheck className="size-5 text-indigo-600" />
                Créer le premier bail
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Liez votre bien et votre locataire avec un bail. Le bail sera
                créé en statut{" "}
                <span className="font-medium">actif</span>.
              </p>
            </div>
            <LeaseStepV2
              propertyId={state.propertyId}
              tenantId={state.tenantId}
              onBack={() => setCurrentStep(2)}
              onComplete={handleLeaseComplete}
            />
          </>
        )}

        {/* Step 3 when property is missing — no lease possible without property */}
        {currentStep === 3 && (state.propertySkipped || !state.propertyId) && (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileCheck className="size-5 text-indigo-600" />
                Ajouter un bien pour créer un bail
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Un bail nécessite un bien. Voulez-vous retourner à l'étape 1
                pour ajouter votre bien ?
              </p>
            </div>
            <div className="space-y-3">
              <Button
                onClick={() => setCurrentStep(1)}
                className="w-full"
              >
                <ArrowLeft className="size-4 mr-2" />
                Retourner à l'étape 1
              </Button>
              <button
                type="button"
                onClick={handleClose}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
              >
                Je configure plus tard
              </button>
            </div>
          </>
        )}

        {currentStep === 4 && (
          <SuccessStepV2
            propertyId={state.propertyId}
            tenantId={state.tenantId}
            propertySkipped={state.propertySkipped}
            tenantSkipped={state.tenantSkipped}
            onClose={handleClose}
            onGenerateReceipt={handleGenerateReceipt}
            onInsertSampleData={handleInsertSampleData}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
