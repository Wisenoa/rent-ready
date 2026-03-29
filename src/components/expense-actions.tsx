"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { deleteExpense } from "@/lib/actions/expense-actions";
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
import { ExpenseForm } from "@/components/expense-form";

type ExpenseData = {
  id: string;
  vendorName: string;
  description: string | null;
  amount: number;
  category: string;
  date: string;
  propertyId: string | null;
};

type PropertyOption = {
  id: string;
  name: string;
};

interface ExpenseActionsProps {
  expense: ExpenseData;
  properties?: PropertyOption[];
}

export function ExpenseActions({
  expense,
  properties = [],
}: ExpenseActionsProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteExpense(expense.id);
      if (result.success) {
        toast.success("Dépense supprimée avec succès");
        setDeleteOpen(false);
        router.refresh();
      } else {
        toast.error(result.error ?? "Impossible de supprimer la dépense");
      }
    });
  }

  return (
    <div className="flex items-center gap-1">
      <ExpenseForm
        expense={expense}
        properties={properties}
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
            <DialogTitle>Supprimer la dépense</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la dépense de{" "}
              <span className="font-medium text-foreground">
                {expense.vendorName}
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
