"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
  trigger: React.ReactNode;
}

export function PropertyForm({ property, trigger }: PropertyFormProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedType, setSelectedType] = useState<PropertyFormValues["type"]>(
    (property?.type as PropertyFormValues["type"]) ?? "APARTMENT"
  );
  const router = useRouter();
  const isEditing = !!property;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          isEditing ? "Bien modifié avec succès" : "Bien créé avec succès"
        );
        setOpen(false);
        reset();
        router.refresh();
      } else {
        toast.error(result.error ?? "Une erreur est survenue");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<span />}>{trigger}</DialogTrigger>
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 py-2"
        >
          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">Nom du bien *</Label>
            <Input
              id="name"
              placeholder="Ex: Appartement Rue de Rivoli"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">
                {errors.name.message}
              </p>
            )}
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
            >
              <SelectTrigger className="w-full">
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
            {errors.type && (
              <p className="text-xs text-destructive">
                {errors.type.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="grid gap-2">
            <Label htmlFor="addressLine1">Adresse *</Label>
            <Input
              id="addressLine1"
              placeholder="Numéro et rue"
              aria-invalid={!!errors.addressLine1}
              {...register("addressLine1")}
            />
            {errors.addressLine1 && (
              <p className="text-xs text-destructive">
                {errors.addressLine1.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="addressLine2">Complément d&apos;adresse</Label>
            <Input
              id="addressLine2"
              placeholder="Bâtiment, étage, etc."
              {...register("addressLine2")}
            />
          </div>

          {/* City + Postal Code */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="city">Ville *</Label>
              <Input
                id="city"
                placeholder="Paris"
                aria-invalid={!!errors.city}
                {...register("city")}
              />
              {errors.city && (
                <p className="text-xs text-destructive">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="postalCode">Code postal *</Label>
              <Input
                id="postalCode"
                placeholder="75001"
                aria-invalid={!!errors.postalCode}
                {...register("postalCode")}
              />
              {errors.postalCode && (
                <p className="text-xs text-destructive">
                  {errors.postalCode.message}
                </p>
              )}
            </div>
          </div>

          {/* Surface + Rooms */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="surface">Surface (m²)</Label>
              <Input
                id="surface"
                type="number"
                step="0.1"
                min="0"
                placeholder="65"
                {...register("surface")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rooms">Nombre de pièces</Label>
              <Input
                id="rooms"
                type="number"
                min="0"
                placeholder="3"
                {...register("rooms")}
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description du bien..."
              rows={3}
              {...register("description")}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="size-4 mr-2 animate-spin" />}
              {isEditing ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
