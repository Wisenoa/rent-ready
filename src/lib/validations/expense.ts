import { z } from "zod";

export const expenseSchema = z.object({
  vendorName: z.string().min(1, "Le nom du prestataire est requis").max(200),
  description: z.string().max(2000).optional().or(z.literal("")),
  amount: z.coerce
    .number()
    .positive("Le montant doit être positif"),
  category: z.enum(
    [
      "PLUMBING",
      "ELECTRICAL",
      "GENERAL_MAINTENANCE",
      "INSURANCE",
      "TAX",
      "CONDO_FEES",
      "MANAGEMENT_FEES",
      "RENOVATION",
      "OTHER",
    ],
    { message: "La catégorie est requise" }
  ),
  date: z.string().min(1, "La date est requise"),
  propertyId: z.string().optional().or(z.literal("")),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;

export const EXPENSE_CATEGORY_LABELS: Record<string, string> = {
  PLUMBING: "Plomberie",
  ELECTRICAL: "Électricité",
  GENERAL_MAINTENANCE: "Entretien général",
  INSURANCE: "Assurance",
  TAX: "Taxes / Impôts",
  CONDO_FEES: "Copropriété",
  MANAGEMENT_FEES: "Frais de gestion",
  RENOVATION: "Travaux",
  OTHER: "Autre",
};
