"use client";

import { useState, useTransition, useEffect, useRef } from "react";
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
  Receipt,
  Building,
  Users,
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
};

interface OnboardingWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = {
  id: number;
  label: string;
  description: string;
  timeEstimate: string;
  icon: typeof Home;
};

const STEPS: Step[] = [
  {
    id: 1,
    label: "Ajouter un bien",
    description: "Votre premier bien locatif",
    timeEstimate: "~1 min",
    icon: Home,
  },
  {
    id: 2,
    label: "Ajouter un locataire",
    description: "Le futur locataire",
    timeEstimate: "~1 min",
    icon: User,
  },
  {
    id: 3,
    label: "Créer le bail",
    description: "Liez tout ensemble",
    timeEstimate: "~30 sec",
    icon: FileCheck,
  },
];

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

// ─── Step 1: Quick Property ────────────────────────────────────────────────────

function PropertyStep({
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Nom du bien *</Label>
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
        <Label>Type de bien *</Label>
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
        <Label htmlFor="addressLine1">Adresse *</Label>
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
          <Label htmlFor="postalCode">Code postal *</Label>
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
          <Label htmlFor="city">Ville *</Label>
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
          <Label htmlFor="surface">Surface (m²)</Label>
          <Input
            id="surface"
            type="number"
            placeholder="ex: 65"
            {...register("surface")}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rooms">Pièces</Label>
          <Input
            id="rooms"
            type="number"
            placeholder="ex: 3"
            {...register("rooms")}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
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

      <button
        type="button"
        onClick={handleSkip}
        className="w-full text-center text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
      >
        Je n&apos;ai pas de bien à ajouter maintenant
      </button>
    </form>
  );
}

// ─── Step 2: Quick Tenant ─────────────────────────────────────────────────────

function TenantStep({
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
    toast.info("Ajoutez un locataire plus tard depuis la page Locataires.");
    onSkip();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="firstName">Prénom *</Label>
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
          <Label htmlFor="lastName">Nom *</Label>
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
        <Label htmlFor="email">Email</Label>
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
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          placeholder="ex: 06 12 34 56 78"
          {...register("phone")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="t-addressLine1">Adresse *</Label>
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
          <Label htmlFor="t-postalCode">Code postal *</Label>
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
          <Label htmlFor="t-city">Ville *</Label>
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
        Pas de locataire pour le moment
      </button>
    </form>
  );
}

// ─── Step 3: Quick Lease ──────────────────────────────────────────────────────

function LeaseStep({
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Type de bail *</Label>
        <Select
          defaultValue="UNFURNISHED"
          onValueChange={(v) =>
            setValue("leaseType", v as LeaseFormValues["leaseType"])
          }
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
          <Label htmlFor="rentAmount">Loyer (€) *</Label>
          <Input
            id="rentAmount"
            type="number"
            min="0"
            placeholder="ex: 1200"
            {...register("rentAmount")}
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
            min="0"
            placeholder="ex: 100"
            {...register("chargesAmount")}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="depositAmount">Dépôt de garantie (€)</Label>
        <Input
          id="depositAmount"
          type="number"
          min="0"
          placeholder="ex: 1200"
          {...register("depositAmount")}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="startDate">Date de début *</Label>
          <Input id="startDate" type="date" {...register("startDate")} />
          {errors.startDate && (
            <p className="text-xs text-red-500">{errors.startDate.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="endDate">Date de fin</Label>
          <Input id="endDate" type="date" {...register("endDate")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="paymentDay">Jour de paiement</Label>
          <Input
            id="paymentDay"
            type="number"
            min="1"
            max="28"
            {...register("paymentDay")}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Mode de paiement</Label>
          <Select
            defaultValue="TRANSFER"
            onValueChange={(v) =>
              setValue("paymentMethod", v as LeaseFormValues["paymentMethod"])
            }
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
      </div>

      {rentAmount > 0 && (
        <div className="rounded-lg bg-muted/60 p-3 text-sm">
          <p className="font-medium">
            Total mensuel :{" "}
            <span className="text-emerald-600">
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
              }).format(Number(rentAmount) + (Number(watch("chargesAmount")) || 0))}
            </span>
          </p>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Provision de {Number(watch("chargesAmount")) || 0}€ de charges
          </p>
        </div>
      )}

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
              Finalisation...
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
  );
}

// ─── Success Step ─────────────────────────────────────────────────────────────

function SuccessStep({
  propertyId,
  tenantId,
  propertySkipped,
  tenantSkipped,
  onClose,
  onGenerateReceipt,
}: {
  propertyId?: string;
  tenantId?: string;
  propertySkipped?: boolean;
  tenantSkipped?: boolean;
  onClose: () => void;
  onGenerateReceipt: () => void;
}) {
  return (
    <div className="flex flex-col items-center py-6 text-center space-y-5">
      <div className="relative">
        <div className="size-16 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 className="size-8 text-emerald-600" />
        </div>
        <div className="absolute -top-1 -right-1">
          <PartyPopper className="size-6 text-amber-500" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Premier bail créé !</h3>
        <p className="text-muted-foreground text-sm">
          Votre premier bien est configuré. Vous pouvez maintenant suivre les
          paiements, générer des quittances et gérer vos locataires depuis votre
          tableau de bord.
        </p>
      </div>

      {/* Next steps */}
      <div className="w-full bg-muted/40 rounded-lg p-4 space-y-3 text-left">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Prochaines étapes
        </p>
        <div className="space-y-2">
          <div className="flex items-start gap-2.5">
            <div className="size-5 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5 flex-shrink-0">
              <CheckCircle2 className="size-3 text-emerald-600" />
            </div>
            <p className="text-sm">Premier bail créé — bien joué !</p>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="size-5 rounded-full bg-indigo-100 flex items-center justify-center mt-0.5 flex-shrink-0">
              <Receipt className="size-3 text-indigo-600" />
            </div>
            <button
              onClick={onGenerateReceipt}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium text-left"
            >
              Générer ma première quittance de loyer
            </button>
          </div>
          {!propertySkipped && (
            <div className="flex items-start gap-2.5">
              <div className="size-5 rounded-full bg-indigo-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                <Building className="size-3 text-indigo-600" />
              </div>
              <p className="text-sm text-muted-foreground">
                Ajouter un autre bien depuis{" "}
                <span className="font-medium text-foreground">Mes biens</span>
              </p>
            </div>
          )}
          {(tenantId || !tenantSkipped) && (
            <div className="flex items-start gap-2.5">
              <div className="size-5 rounded-full bg-indigo-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                <Users className="size-3 text-indigo-600" />
              </div>
              <p className="text-sm text-muted-foreground">
                Inviter mon locataire au portail
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="w-full space-y-2">
        <Button onClick={onClose} className="w-full" size="lg">
          Accéder à mon tableau de bord
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: Step[];
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      {steps.map((step, i) => {
        const isDone = currentStep > step.id;
        const isActive = currentStep === step.id;
        const Icon = step.icon;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`size-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isDone
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : isActive
                      ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                      : "border-muted-foreground/30 bg-muted text-muted-foreground"
                }`}
                role="progressbar"
                aria-valuenow={isDone ? 100 : isActive ? 50 : 0}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Étape ${step.id}: ${step.label}`}
              >
                {isDone ? (
                  <CheckCircle2 className="size-4" />
                ) : (
                  <Icon className="size-4" />
                )}
              </div>
              <span
                className={`text-xs mt-1.5 font-medium hidden sm:block ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 w-8 sm:w-16 mx-1 transition-colors ${
                  currentStep > step.id
                    ? "bg-emerald-600"
                    : "bg-muted-foreground/30"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Wizard ─────────────────────────────────────────────────────────────

export function OnboardingWizard({
  open,
  onOpenChange,
}: OnboardingWizardProps) {
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
      trackEvent("onboarding_started", {});
    }
  }, [open]);

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
    });
    clearState();
    onOpenChange(false);
    router.refresh();
  }

  function handleGenerateReceipt() {
    handleClose();
    router.push("/billing");
  }

  const currentStepInfo = STEPS.find((s) => s.id === currentStep);

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
          <>
            <StepIndicator currentStep={currentStep} steps={STEPS} />
            {currentStepInfo && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground -mt-2 mb-2">
                <Clock className="size-3.5" />
                <span>{currentStepInfo.timeEstimate}</span>
                <span className="text-emerald-600 font-medium">
                  · 95% des bailleurs terminent en moins de 5 min
                </span>
              </div>
            )}
          </>
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
            <PropertyStep
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
            <TenantStep
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
            <LeaseStep
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
                Un bail nécessite un bien. Voulez-vous retourner à l&apos;étape 1
                pour ajouter votre bien ?
              </p>
            </div>
            <div className="space-y-3">
              <Button
                onClick={() => setCurrentStep(1)}
                className="w-full"
              >
                <ArrowLeft className="size-4 mr-2" />
                Retourner à l&apos;étape 1
              </Button>
              <button
                type="button"
                onClick={handleClose}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
              >
                Plus tard — configurer depuis le tableau de bord
              </button>
            </div>
          </>
        )}

        {currentStep === 4 && (
          <SuccessStep
            propertyId={state.propertyId}
            tenantId={state.tenantId}
            propertySkipped={state.propertySkipped}
            tenantSkipped={state.tenantSkipped}
            onClose={handleClose}
            onGenerateReceipt={handleGenerateReceipt}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
