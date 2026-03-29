"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { deleteProperty } from "@/lib/actions/property-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PropertyForm } from "@/components/property-form";

type PropertyData = {
  id: string;
  name: string;
  type: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  postalCode: string;
  surface: number | null;
  rooms: number | null;
  description: string | null;
  cadastralRef: string | null;
  taxRef: string | null;
};

interface PropertyActionsProps {
  property: PropertyData;
}

export function PropertyActions({ property }: PropertyActionsProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteProperty(property.id);
      if (result.success) {
        toast.success("Bien supprimé avec succès");
        setDeleteOpen(false);
        router.refresh();
      } else {
        toast.error(result.error ?? "Impossible de supprimer le bien");
      }
    });
  }

  return (
    <div className="flex items-center gap-1">
      <PropertyForm
        property={property}
        trigger={
          <Button variant="ghost" size="icon-sm">
            <Pencil className="size-3.5" />
            <span className="sr-only">Modifier</span>
          </Button>
        }
      />

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setDeleteOpen(true)}
      >
        <Trash2 className="size-3.5 text-destructive" />
        <span className="sr-only">Supprimer</span>
      </Button>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Supprimer le bien</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer{" "}
              <span className="font-medium text-foreground">
                {property.name}
              </span>{" "}
              ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Annuler
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending && <Loader2 className="size-4 mr-2 animate-spin" />}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
