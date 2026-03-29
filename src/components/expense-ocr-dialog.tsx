"use client";

import { useState, useTransition, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FileUp,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  expenseSchema,
  type ExpenseFormValues,
  EXPENSE_CATEGORY_LABELS,
} from "@/lib/validations/expense";
import {
  createExpense,
  extractExpenseFromInvoice,
} from "@/lib/actions/expense-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Badge } from "@/components/ui/badge";

type PropertyOption = {
  id: string;
  name: string;
};

interface ExpenseOcrDialogProps {
  trigger: React.ReactNode;
  properties?: PropertyOption[];
}

type Step = "upload" | "extracting" | "review";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];

const CATEGORIES = Object.entries(EXPENSE_CATEGORY_LABELS).map(
  ([value, label]) => ({ value, label })
);

function ConfidenceBadge({ score }: { score: number }) {
  if (score > 0.8) {
    return (
      <Badge variant="default" className="gap-1">
        <CheckCircle2 className="size-3" />
        Confiance haute ({Math.round(score * 100)}%)
      </Badge>
    );
  }
  if (score >= 0.5) {
    return (
      <Badge variant="secondary" className="gap-1">
        <AlertTriangle className="size-3" />
        Confiance moyenne ({Math.round(score * 100)}%)
      </Badge>
    );
  }
  return (
    <Badge variant="destructive" className="gap-1">
      <AlertTriangle className="size-3" />
      Confiance faible ({Math.round(score * 100)}%)
    </Badge>
  );
}

export function ExpenseOcrDialog({
  trigger,
  properties = [],
}: ExpenseOcrDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [extractionNotes, setExtractionNotes] = useState<string | null>(null);
  const [isExtracting, startExtraction] = useTransition();
  const [isSaving, startSaving] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] =
    useState<ExpenseFormValues["category"]>("OTHER");
  const [selectedPropertyId, setSelectedPropertyId] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset: resetForm,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(expenseSchema) as any,
    defaultValues: {
      vendorName: "",
      description: "",
      amount: 0,
      category: "OTHER",
      date: new Date().toISOString().split("T")[0],
      propertyId: "",
      notes: "",
    },
  });

  const resetAll = useCallback(() => {
    setStep("upload");
    setFile(null);
    setPreview(null);
    setConfidence(0);
    setExtractionNotes(null);
    setSelectedCategory("OTHER");
    setSelectedPropertyId("");
    resetForm();
  }, [resetForm]);

  function handleFileSelect(selectedFile: File) {
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error("Le fichier dépasse la taille maximale de 10 Mo.");
      return;
    }
    if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
      toast.error(
        "Format non supporté. Utilisez une image (JPG, PNG) ou un PDF."
      );
      return;
    }

    setFile(selectedFile);

    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileSelect(dropped);
  }

  function handleAnalyze() {
    if (!file) return;

    startExtraction(async () => {
      setStep("extracting");

      const formData = new FormData();
      formData.append("file", file);

      const result = await extractExpenseFromInvoice(formData);

      if (!result.success) {
        toast.error(result.error ?? "Erreur d'extraction");
        setStep("upload");
        return;
      }

      const data = result.data!;

      // Populate form with extracted data
      if (data.vendorName) setValue("vendorName", data.vendorName as string);
      if (data.description)
        setValue("description", data.description as string);
      if (data.amount) setValue("amount", data.amount as number);
      if (data.date) setValue("date", data.date as string);
      if (data.category) {
        const cat = data.category as ExpenseFormValues["category"];
        setValue("category", cat);
        setSelectedCategory(cat);
      }

      setConfidence((data.confidence as number) ?? 0);
      setExtractionNotes((data.extractionNotes as string) ?? null);
      setStep("review");
    });
  }

  function onSubmit(values: ExpenseFormValues) {
    startSaving(async () => {
      const formData = new FormData();
      for (const [key, value] of Object.entries(values)) {
        formData.append(key, String(value ?? ""));
      }
      formData.append("aiExtracted", "true");

      const result = await createExpense(formData);

      if (result.success) {
        toast.success("Dépense enregistrée avec succès");
        setOpen(false);
        resetAll();
        router.refresh();
      } else {
        toast.error(result.error ?? "Une erreur est survenue");
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) resetAll();
      }}
    >
      <DialogTrigger render={<span />}>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            Scanner une facture
          </DialogTitle>
          <DialogDescription>
            Importez une facture et laissez l&apos;IA extraire les informations
            automatiquement.
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Upload */}
        {step === "upload" && (
          <div className="space-y-4 py-2">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/60 p-8 transition-colors hover:border-primary/40 hover:bg-muted/30 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileSelect(f);
                }}
              />
              <FileUp className="size-10 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">
                Glissez-déposez votre facture ici
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                ou cliquez pour sélectionner un fichier
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Images (JPG, PNG) ou PDF — Max 10 Mo
              </p>
            </div>

            {file && (
              <div className="flex items-center gap-3 rounded-lg border p-3">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt="Aperçu"
                    className="size-14 rounded object-cover"
                  />
                ) : (
                  <div className="flex size-14 items-center justify-center rounded bg-muted">
                    <FileText className="size-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(0)} Ko
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setPreview(null);
                  }}
                >
                  <X className="size-4" />
                </Button>
              </div>
            )}

            <Button
              onClick={handleAnalyze}
              disabled={!file || isExtracting}
              className="w-full"
            >
              <Sparkles className="size-4 mr-2" />
              Analyser avec l&apos;IA
            </Button>
          </div>
        )}

        {/* Step 2: Extracting */}
        {step === "extracting" && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="relative">
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="size-8 text-primary animate-pulse" />
              </div>
              <Loader2 className="absolute -inset-2 size-20 text-primary/30 animate-spin" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium">
                L&apos;IA analyse votre facture...
              </p>
              <p className="text-xs text-muted-foreground">
                Extraction du texte et des informations en cours
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === "review" && (
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-2 flex-wrap">
              <ConfidenceBadge score={confidence} />
              {extractionNotes && (
                <p className="text-xs text-muted-foreground italic w-full mt-1">
                  {extractionNotes}
                </p>
              )}
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid gap-4"
            >
              {/* Vendor name */}
              <div className="grid gap-2">
                <Label htmlFor="ocr-vendorName">
                  Prestataire / Fournisseur *
                </Label>
                <Input
                  id="ocr-vendorName"
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
                  <Label htmlFor="ocr-amount">Montant TTC (€) *</Label>
                  <Input
                    id="ocr-amount"
                    type="number"
                    step="0.01"
                    min="0"
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
                  <Label htmlFor="ocr-date">Date *</Label>
                  <Input
                    id="ocr-date"
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
                <Label htmlFor="ocr-category">Catégorie *</Label>
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
              </div>

              {/* Property */}
              {properties.length > 0 && (
                <div className="grid gap-2">
                  <Label htmlFor="ocr-propertyId">Bien associé</Label>
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
                <Label htmlFor="ocr-description">Description</Label>
                <Textarea
                  id="ocr-description"
                  placeholder="Description de la prestation..."
                  rows={2}
                  {...register("description")}
                />
              </div>

              {/* Notes */}
              <div className="grid gap-2">
                <Label htmlFor="ocr-notes">Notes</Label>
                <Textarea
                  id="ocr-notes"
                  placeholder="Notes complémentaires..."
                  rows={2}
                  {...register("notes")}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={resetAll}
                >
                  Recommencer
                </Button>
                <Button type="submit" className="flex-1" disabled={isSaving}>
                  {isSaving && (
                    <Loader2 className="size-4 mr-2 animate-spin" />
                  )}
                  Valider et enregistrer
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
