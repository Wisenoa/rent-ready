import { z } from "zod";

export const chargeSchema = z.object({
  leaseId: z.string().min(1, "Le bail est requis"),
  label: z.string().min(1, "Le libellé est requis").max(200),
  category: z.enum([
    "CONDO_FEES",
    "PROPERTY_TAX",
    "SHARED_UTILITIES",
    "INSURANCE",
    "MAINTENANCE",
    "MANAGEMENT_FEES",
    "OTHER",
  ]),
  amount: z.coerce.number().positive("Le montant doit être positif"),
  billingCycle: z.enum(["MONTHLY", "QUARTERLY", "ANNUAL", "ONE_TIME"]).default("MONTHLY"),
  periodStart: z.string().min(1, "La date de début de période est requise"),
  periodEnd: z.string().optional().or(z.literal("")),
  invoiceUrl: z.string().url("URL invalide").optional().or(z.literal("")),
  isRecovered: z.boolean().optional().default(false),
  notes: z.string().max(1000).optional().or(z.literal("")),
});

export type ChargeFormValues = z.infer<typeof chargeSchema>;
