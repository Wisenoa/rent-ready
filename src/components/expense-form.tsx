"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  expenseSchema,
  type ExpenseFormValues,
  EXPENSE_CATEGORY_LABELS,
} from "@/lib/validations/expense";
import {
  createExpense,
  updateExpense,
} from "@/lib/actions/expense-actions";
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

type PropertyOption = {
  id: string;
  name: string;
};

type ExpenseData = {
  id: string;
  vendorName: string;
  description: string | null;
  amount: number;
  category: string;
  date: string;
  propertyId: string | null;
};

interface ExpenseFormProps {
  trigger: React.ReactNode;
  expense?: ExpenseData;
  properties?: PropertyOption[];
  defaultValues?: Partial<ExpenseFormValues & { aiExtracted?: boolean }>;
  onSuccess?: () => void;
}

const CATEGORIES = Object.entries(EXPENSE_CATEGORY_LABELS).map(
  ([value, label]) => ({ value, label })
);

export function ExpenseForm({
  trigger,
  expense,
  properties = [],
  defaultValues: externalDefaults,
  onSuccess,
}: ExpenseFormProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const isEditing = !!expense;

  const defaults: ExpenseFormValues = {
    vendorName: expense?.vendorName ?? externalDefaults?.vendorName ?? "",
    description: expense?.description ?? externalDefaults?.description ?? "",
    amount: expense?.amount ?? externalDefaults?.amount ?? 0,
    category:
      (expense?.category as ExpenseFormValues["category"]) ??
      externalDefaults?.category ??
      "OTHER",
    date:
      expense?.date ??
      externalDefaults?.date ??
      new Date().toISOString().split("T")[0],
    propertyId: expense?.propertyId ?? externalDefaults?.propertyId ?? "",
    notes: externalDefaults?.notes ?? "",
  };

  const [selectedCategory, setSelectedCategory] =
    useState<ExpenseFormValues["category"]>(defaults.category);
  const [selectedPropertyId, setSelectedPropertyId] = useState(
    defaults.propertyId ?? ""
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(expenseSchema) as any,
    defaultValues: defaults,
  });

  function onSubmit(values: ExpenseFormValues) {
    startTransition(async () => {
      const formData = new FormData();
      for (const [key, value] of Object.entries(values)) {
        formData.append(key, String(value ?? ""));
      }

      if (isEditing) {
        formData.append("id", expense.id);
      }

      if (externalDefaults?.aiExtracted) {
        formData.append("aiExtracted", "true");
      }

      const result = isEditing
        ? await updateExpense(formData)
        : await createExpense(formData);

      if (result.success) {
        toast.success(
          isEditing
            ? "Dépense modifiée avec succès"
            : "Dépense enregistrée avec succès"
        );
        setOpen(false);
        reset();
        onSuccess?.();
        router.refresh();
      } else {
        toast.error(result.error ?? "Une erreur est survenue");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<span />}>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier la dépense" : "Ajouter une dépense"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifiez les informations de la dépense."
              : "Renseignez les informations de la dépense."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2">
          {/* Vendor name */}
          <div className="grid gap-2">
            <Label htmlFor="vendorName">Prestataire / Fournisseur *</Label>
            <Input
              id="vendorName"
              placeholder="Ex: Plombier Martin"
              aria-invalid={!!errors.vendorName}
              {...register("vendorName")}
            />
            {errors.vendorName && (
              <p className="text-xs text-destructive">
                {errors.vendorName.message}
              </p>
            )}
          </div>

          {/* Amount + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Montant TTC (€) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="150.00"
                aria-invalid={!!errors.amount}
                {...register("amount")}
              />
              {errors.amount && (
                <p className="text-xs text-destructive">
                  {errors.amount.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                aria-invalid={!!errors.date}
                {...register("date")}
              />
              {errors.date && (
                <p className="text-xs text-destructive">
                  {errors.date.message}
                </p>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="grid gap-2">
            <Label htmlFor="category">Catégorie *</Label>
            <Select
              value={selectedCategory}
              onValueChange={(val) => {
                const typed = val as ExpenseFormValues["category"];
                setSelectedCategory(typed);
                setValue("category", typed, { shouldValidate: true });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Property */}
          {properties.length > 0 && (
            <div className="grid gap-2">
              <Label htmlFor="propertyId">Bien associé</Label>
              <Select
                value={selectedPropertyId}
                onValueChange={(val) => {
                  const v = val ?? "";
                  setSelectedPropertyId(v);
                  setValue("propertyId", v === "__none__" ? "" : v, {
                    shouldValidate: true,
                  });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Aucun bien associé" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Aucun</SelectItem>
                  {properties.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description de la prestation..."
              rows={2}
              {...register("description")}
            />
          </div>

          {/* Notes */}
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Notes complémentaires..."
              rows={2}
              {...register("notes")}
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
