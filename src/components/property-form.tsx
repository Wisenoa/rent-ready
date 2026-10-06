"use client";

import { useTransition, useState, isValidElement } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ChevronDown, ChevronUp, Sparkles, Building2 } from "lucide-react";
import { toast } from "sonner";

import {
  propertySchema,
  type PropertyFormValues,
} from "@/lib/validations/property";
import {
  createProperty,
  updateProperty,
} from "@/lib/actions/property-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

const PROPERTY_TYPES = [
  { value: "APARTMENT", label: "Appartement" },
  { value: "HOUSE", label: "Maison" },
  { value: "STUDIO", label: "Studio" },
  { value: "COMMERCIAL", label: "Local commercial" },
  { value: "PARKING", label: "Parking" },
  { value: "OTHER", label: "Autre" },
] as const;

const PROPERTY_TYPE_ITEMS: Record<string, string> = Object.fromEntries(
  PROPERTY_TYPES.map((t) => [t.value, t.label])
);

/**
 * Message d'erreur d'un champ, rendu dans le DOM.
 */
function FieldError({
  id,
  message,
}: {
  id: string;
  message?: string;
}) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-xs text-destructive">
      {message}
    </p>
  );
}

type PropertyData = {
  id: string;
  name: string;
  type: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  postalCode: string;
  surface?: number | null;
  rooms?: number | null;
  description?: string | null;
  cadastralRef?: string | null;
  taxRef?: string | null;
};

interface PropertyFormProps {
  property?: PropertyData;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  redirectToHomeBase?: boolean;
  onSuccess?: (created: { id: string; name: string }) => void;
  triggerVariant?: "default" | "outline" | "ghost";
  triggerSize?: "default" | "sm" | "lg" | "icon-sm";
}

export function PropertyForm({
  property,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  redirectToHomeBase = true,
  onSuccess,
  triggerVariant,
  triggerSize,
}: PropertyFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(!!property);
  const [isPending, startTransition] = useTransition();
  const [selectedType, setSelectedType] = useState<PropertyFormValues["type"]>(
    (property?.type as PropertyFormValues["type"]) ?? "APARTMENT"
  );
  const router = useRouter();
  const isEditing = !!property;

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (controlledOnOpenChange ?? (() => {})) : setInternalOpen;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema) as any,
    defaultValues: {
      name: property?.name ?? "",
      type: (property?.type as PropertyFormValues["type"]) ?? "APARTMENT",
      addressLine1: property?.addressLine1 ?? "",
      addressLine2: property?.addressLine2 ?? "",
      city: property?.city ?? "",
      postalCode: property?.postalCode ?? "",
      surface: property?.surface ?? 0,
      rooms: property?.rooms ?? 0,
      description: property?.description ?? "",
      cadastralRef: property?.cadastralRef ?? "",
      taxRef: property?.taxRef ?? "",
    },
  });

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (!isOpen) {
      reset();
      setShowAdvanced(isEditing);
    }
  }

  function onSubmit(values: PropertyFormValues) {
    startTransition(async () => {
      const formData = new FormData();
      for (const [key, value] of Object.entries(values)) {
        formData.append(key, String(value ?? ""));
      }

      const result = isEditing
        ? await updateProperty(property.id, formData)
        : await createProperty(formData);

      if (result.success) {
        toast.success(
          isEditing ? "Logement modifié avec succès" : "Logement créé avec succès"
        );
        const createdId = (result.data as { id?: string })?.id;
        if (!isEditing && createdId) {
          onSuccess?.({ id: createdId, name: values.name });
        }
        setOpen(false);
        reset();

        if (!isEditing && redirectToHomeBase && createdId) {
          router.push(`/properties/${createdId}`);
        } else {
          router.refresh();
        }
      } else {
        toast.error(result.error ?? "Une erreur est survenue lors de l'enregistrement");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && (
        <DialogTrigger
          render={
            <Button
              variant={triggerVariant ?? (isEditing ? "ghost" : "default")}
              size={triggerSize ?? (isEditing ? "icon-sm" : "default")}
            />
          }
        >
          {trigger}
        </DialogTrigger>
      )}
<DialogContent className="w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier le bien" : "Ajouter un bien"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifiez les informations de votre bien immobilier."
              : "Renseignez les informations de votre nouveau bien immobilier."}
          </DialogDescription>
        </DialogHeader>

        {/*
          noValidate : c'est le schema (propertySchema) qui parle, via
          react-hook-form. Sans lui, le navigateur peut bloquer le submit sur
          `min="0"` des champs nombre et n'afficher que sa bulle native — un
          message qu'on ne peut ni styler, ni relire en test, ni rattacher au
          champ. Les deux sources de verite se contredisaient ; il n'y en a plus
          qu'une, et elle est rendue dans le DOM.
        */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="grid gap-4 py-2"
        >
          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">Nom du bien *</Label>
            <Input
              id="name"
              placeholder="Ex: Appartement Rue de Rivoli"
              maxLength={200}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              {...register("name")}
            />
            <FieldError id="name-error" message={errors.name?.message} />
          </div>

          {/* Type */}
          <div className="grid gap-2">
            <Label htmlFor="type">Type de bien *</Label>
            <Select
              value={selectedType}
              onValueChange={(val) => {
                const typed = val as PropertyFormValues["type"];
                setSelectedType(typed);
                setValue("type", typed, { shouldValidate: true });
              }}
              items={PROPERTY_TYPE_ITEMS}
            >
              <SelectTrigger
                id="type"
                className="w-full"
                aria-invalid={!!errors.type}
                aria-describedby={errors.type ? "type-error" : undefined}
              >
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type?.message && (
              <p
                id="type-error"
                role="alert"
                className="text-xs text-destructive"
              >
                {errors.type.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="grid gap-2">
            <Label htmlFor="addressLine1">Adresse du logement *</Label>
            <Input
              id="addressLine1"
              placeholder="Ex: 14 Rue Voltaire"
              maxLength={500}
              aria-invalid={!!errors.addressLine1}
              aria-describedby={errors.addressLine1 ? "addressLine1-error" : undefined}
              {...register("addressLine1")}
            />
            <FieldError
              id="addressLine1-error"
              message={errors.addressLine1?.message}
            />
          </div>

          {/* City + Postal Code */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="city">Ville *</Label>
              <Input
                id="city"
                placeholder="Ex: Nantes"
                maxLength={200}
                aria-invalid={!!errors.city}
                aria-describedby={errors.city ? "city-error" : undefined}
                {...register("city")}
              />
              <FieldError id="city-error" message={errors.city?.message} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="postalCode">Code postal *</Label>
              <Input
                id="postalCode"
                placeholder="Ex: 44000"
                maxLength={10}
                aria-invalid={!!errors.postalCode}
                aria-describedby={errors.postalCode ? "postalCode-error" : undefined}
                {...register("postalCode")}
              />
              <FieldError
                id="postalCode-error"
                message={errors.postalCode?.message}
              />
            </div>
          </div>

          {/* Progressive Disclosure : Informations complémentaires */}
          <div className="pt-2 border-t border-border/60">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-xs font-medium text-muted-foreground hover:text-foreground py-1.5 transition-colors"
            >
              <span>Informations complémentaires (surface, cadastre, notes...)</span>
              {showAdvanced ? (
                <ChevronUp className="size-3.5" />
              ) : (
                <ChevronDown className="size-3.5" />
              )}
            </button>

            {showAdvanced && (
              <div className="space-y-4 pt-3 mt-1 border-t border-dashed border-border/60">
                <div className="grid gap-2">
                  <Label htmlFor="addressLine2">Complément d&apos;adresse</Label>
                  <Input
                    id="addressLine2"
                    placeholder="Bâtiment B, 2e étage gauche, code..."
                    maxLength={500}
                    aria-invalid={!!errors.addressLine2}
                    aria-describedby={errors.addressLine2 ? "addressLine2-error" : undefined}
                    {...register("addressLine2")}
                  />
                  <FieldError
                    id="addressLine2-error"
                    message={errors.addressLine2?.message}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="surface">Surface habitable (m²)</Label>
                    <Input
                      id="surface"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="65"
                      aria-invalid={!!errors.surface}
                      aria-describedby={errors.surface ? "surface-error" : undefined}
                      {...register("surface")}
                    />
                    <FieldError id="surface-error" message={errors.surface?.message} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="rooms">Nombre de pièces</Label>
                    <Input
                      id="rooms"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="3"
                      aria-invalid={!!errors.rooms}
                      aria-describedby={errors.rooms ? "rooms-error" : undefined}
                      {...register("rooms")}
                    />
                    <FieldError id="rooms-error" message={errors.rooms?.message} />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="cadastralRef">Réf. cadastrale</Label>
                    <Input
                      id="cadastralRef"
                      placeholder="Ex: Section AB n° 124"
                      maxLength={100}
                      {...register("cadastralRef")}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="taxRef">Identifiant fiscal</Label>
                    <Input
                      id="taxRef"
                      placeholder="Ex: Numéro fiscal local"
                      maxLength={100}
                      {...register("taxRef")}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Notes & description</Label>
                  <Textarea
                    id="description"
                    placeholder="Description du logement ou notes personnelles..."
                    rows={2}
                    maxLength={2000}
                    aria-invalid={!!errors.description}
                    aria-describedby={errors.description ? "description-error" : undefined}
                    {...register("description")}
                  />
                  <FieldError
                    id="description-error"
                    message={errors.description?.message}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button type="submit" disabled={isPending} className="font-medium">
              {isPending && <Loader2 className="size-4 mr-2 animate-spin" />}
              {isEditing ? "Enregistrer" : "Créer le logement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
