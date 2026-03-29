import { z } from "zod";

export const leaseSchema = z.object({
  propertyId: z.string().min(1, "Le bien est requis"),
  tenantId: z.string().min(1, "Le locataire est requis"),
  rentAmount: z.coerce.number().positive("Le loyer doit être positif"),
  chargesAmount: z.coerce.number().min(0, "Les charges ne peuvent être négatives"),
  depositAmount: z.coerce.number().min(0, "Le dépôt ne peut être négatif"),
  startDate: z.string().min(1, "La date de début est requise"),
  endDate: z.string().optional().or(z.literal("")),
  paymentDay: z.coerce.number().int().min(1).max(31).default(1),
  paymentMethod: z.enum(["TRANSFER", "CHECK", "CASH", "DIRECT_DEBIT", "OTHER"]).default("TRANSFER"),
  leaseType: z.enum(["UNFURNISHED", "FURNISHED", "COMMERCIAL", "SEASONAL"]).default("UNFURNISHED"),
  irlReferenceQuarter: z.string().optional().or(z.literal("")),
  irlReferenceValue: z.coerce.number().optional(),
});

export type LeaseFormValues = z.infer<typeof leaseSchema>;
