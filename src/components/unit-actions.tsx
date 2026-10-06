"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Archive, RotateCcw, MoreHorizontal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type Unit = {
  id: string;
  name: string;
  floor: number | null;
  unitNumber: string | null;
  surface: number | null;
  rooms: number | null;
  type: string;
  status: string;
  propertyId: string;
  description?: string | null;
  archivedAt?: string | null;
};

type UnitActionsProps = {
  unit: Unit;
  onUpdated?: () => void;
  onArchived?: () => void;
  onRestored?: () => void;
};

export function UnitActions({
  unit,
  onUpdated,
  onArchived,
  onRestored,
}: UnitActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [archiveConfirmOpen, setArchiveConfirmOpen] = useState(false);
  const [restoreConfirmOpen, setRestoreConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Edit form state
  const [name, setName] = useState(unit.name);
  const [floor, setFloor] = useState(unit.floor ?? "");
  const [unitNumber, setUnitNumber] = useState(unit.unitNumber ?? "");
  const [surface, setSurface] = useState(unit.surface ?? "");
  const [rooms, setRooms] = useState(unit.rooms ?? "");
  const [description, setDescription] = useState(unit.description ?? "");

  const isArchived = !!unit.archivedAt;

  async function handleEdit() {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/units/${unit.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          floor: floor === "" ? null : Number(floor),
          unitNumber: unitNumber || null,
          surface: surface === "" ? null : Number(surface),
          rooms: rooms === "" ? null : Number(rooms),
          description: description || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Échec de la mise à jour");
      }

      toast({ title: "Unité mise à jour" });
      setEditOpen(false);
      onUpdated?.();
      router.refresh();
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleArchive() {
    setSubmitting(true);
    try {
      // Soft-delete: set deletedAt to now
      const res = await fetch(`/api/units/${unit.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Échec de l'archivage");
      }

      toast({ title: "Unité archivée" });
      setArchiveConfirmOpen(false);
      onArchived?.();
      router.refresh();
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRestore() {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/units/${unit.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deletedAt: null }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Échec de la restauration");
      }

      toast({ title: "Unité restaurée" });
      setRestoreConfirmOpen(false);
      onRestored?.();
      router.refresh();
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Edit */}
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Modifier
          </DropdownMenuItem>

          {/* Archive / Restore */}
          {!isArchived ? (
            <DropdownMenuItem
              onClick={() => setArchiveConfirmOpen(true)}
              className="text-amber-600"
            >
              <Archive className="mr-2 h-4 w-4" />
              Archiver
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => setRestoreConfirmOpen(true)}
              className="text-emerald-600"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Restaurer
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier l&apos;unité</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="unit-name">Nom de l&apos;unité *</Label>
              <Input
                id="unit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Appartement 1"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="unit-number">Numéro</Label>
                <Input
                  id="unit-number"
                  value={unitNumber}
                  onChange={(e) => setUnitNumber(e.target.value)}
                  placeholder="Ex: A101"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit-floor">Étage</Label>
                <Input
                  id="unit-floor"
                  type="number"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  placeholder="Ex: 2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="unit-surface">Surface (m²)</Label>
                <Input
                  id="unit-surface"
                  type="number"
                  step="0.01"
                  value={surface}
                  onChange={(e) => setSurface(e.target.value)}
                  placeholder="Ex: 65.5"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit-rooms">Pièces</Label>
                <Input
                  id="unit-rooms"
                  type="number"
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                  placeholder="Ex: 3"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="unit-description">Description</Label>
              <Textarea
                id="unit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description optionnelle..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEdit} disabled={submitting || !name.trim()}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Confirm Dialog */}
      <Dialog open={archiveConfirmOpen} onOpenChange={setArchiveConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Archiver l&apos;unité</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-4">
            Voulez-vous archiver l&apos;unité <strong>{unit.name}</strong> ? Elle ne
            sera plus visible dans la liste des unités actives.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArchiveConfirmOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="secondary"
              onClick={handleArchive}
              disabled={submitting}
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Archiver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Confirm Dialog */}
      <Dialog open={restoreConfirmOpen} onOpenChange={setRestoreConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Restaurer l&apos;unité</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-4">
            Voulez-vous restaurer l&apos;unité <strong>{unit.name}</strong> ?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRestoreConfirmOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleRestore} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Restaurer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
