"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { tenantSchema, type TenantFormValues } from "@/lib/validations/tenant";
import {
  createTenant,
  updateTenant,
  deleteTenant,
} from "@/lib/actions/tenant-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export type SerializedTenant = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  postalCode: string | null;
  dateOfBirth: string | null;
  placeOfBirth: string | null;
  emergencyName: string | null;
  emergencyPhone: string | null;
};

interface TenantFormProps {
  tenant?: SerializedTenant;
  children?: React.ReactNode;
  onSuccess?: (created: { id: string; firstName: string; lastName: string }) => void;
  defaultValues?: Partial<TenantFormValues>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TenantForm({
  tenant,
  children,
  onSuccess,
  defaultValues: initialDefaults,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: TenantFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isPendingTransition = useTransition();
  const [isPending, startTransition] = isPendingTransition;
  const isEdit = !!tenant;

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (controlledOnOpenChange ?? (() => {})) : setInternalOpen;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TenantFormValues>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      firstName: tenant?.firstName ?? initialDefaults?.firstName ?? "",
      lastName: tenant?.lastName ?? initialDefaults?.lastName ?? "",
      email: tenant?.email ?? initialDefaults?.email ?? "",
      phone: tenant?.phone ?? initialDefaults?.phone ?? "",
      addressLine1: tenant?.addressLine1 ?? initialDefaults?.addressLine1 ?? "",
      addressLine2: tenant?.addressLine2 ?? initialDefaults?.addressLine2 ?? "",
      city: tenant?.city ?? initialDefaults?.city ?? "",
      postalCode: tenant?.postalCode ?? initialDefaults?.postalCode ?? "",
      dateOfBirth: tenant?.dateOfBirth ?? initialDefaults?.dateOfBirth ?? "",
      placeOfBirth: tenant?.placeOfBirth ?? initialDefaults?.placeOfBirth ?? "",
      emergencyName: tenant?.emergencyName ?? initialDefaults?.emergencyName ?? "",
      emergencyPhone: tenant?.emergencyPhone ?? initialDefaults?.emergencyPhone ?? "",
    },
  });

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (!isOpen) reset();
  }

  function onSubmit(values: TenantFormValues) {
    startTransition(async () => {
      const formData = new FormData();
      for (const [key, value] of Object.entries(values)) {
        formData.append(key, value ?? "");
      }

      const result = isEdit
        ? await updateTenant(tenant.id, formData)
        : await createTenant(formData);

      if (result.success) {
        toast.success(
          isEdit
            ? "Locataire modifié avec succès"
            : "Locataire ajouté avec succès"
        );
        if (result.data && !isEdit) {
          onSuccess?.({
            id: (result.data as { id: string }).id,
            firstName: values.firstName,
            lastName: values.lastName,
          });
        }
        setOpen(false);
        reset();
      } else {
        toast.error(result.error ?? "Une erreur est survenue");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {children && (
        <DialogTrigger render={<Button variant="outline" size="sm" />}>
          {children}
        </DialogTrigger>
      )}
      <DialogContent className="w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Modifier le locataire" : "Ajouter un locataire"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modifiez les informations du locataire."
              : "Renseignez les informations du nouveau locataire."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.stopPropagation();
            handleSubmit(onSubmit)(e);
          }}
          className="space-y-4"
        >
          {/* Identité */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom *</Label>
              <Input id="firstName" {...register("firstName")} />
              {errors.firstName && (
                <p className="text-sm text-destructive">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom *</Label>
              <Input id="lastName" {...register("lastName")} />
              {errors.lastName && (
                <p className="text-sm text-destructive">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Contact */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" type="tel" {...register("phone")} />
              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Adresse */}
          <div className="space-y-2">
            <Label htmlFor="addressLine1">Adresse *</Label>
            <Input id="addressLine1" {...register("addressLine1")} />
            {errors.addressLine1 && (
              <p className="text-sm text-destructive">
                {errors.addressLine1.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine2">Complément d&apos;adresse</Label>
            <Input id="addressLine2" {...register("addressLine2")} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">Ville *</Label>
              <Input id="city" {...register("city")} />
              {errors.city && (
                <p className="text-sm text-destructive">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Code postal *</Label>
              <Input id="postalCode" {...register("postalCode")} />
              {errors.postalCode && (
                <p className="text-sm text-destructive">
                  {errors.postalCode.message}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Informations complémentaires */}
          <div>
            <p className="text-sm font-medium mb-3">
              Informations complémentaires
            </p>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date de naissance</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...register("dateOfBirth")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="placeOfBirth">Lieu de naissance</Label>
                  <Input id="placeOfBirth" {...register("placeOfBirth")} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="emergencyName">Contact d&apos;urgence</Label>
                  <Input id="emergencyName" {...register("emergencyName")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Tél. urgence</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    {...register("emergencyPhone")}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="size-4 mr-2 animate-spin" />}
              {isEdit ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- Delete button ---

interface DeleteTenantButtonProps {
  tenantId: string;
  tenantName: string;
}

export function DeleteTenantButton({
  tenantId,
  tenantName,
}: DeleteTenantButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Supprimer ${tenantName} ? Cette action est irréversible.`))
      return;

    startTransition(async () => {
      const result = await deleteTenant(tenantId);
      if (result.success) {
        toast.success("Locataire supprimé");
      } else {
        toast.error(result.error ?? "Impossible de supprimer le locataire");
      }
    });
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8 text-muted-foreground hover:text-destructive"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Trash2 className="size-4" />
      )}
    </Button>
  );
}
