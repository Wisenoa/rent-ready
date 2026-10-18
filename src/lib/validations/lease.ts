import Decimal from "decimal.js";
import { z } from "zod";

export const leaseSchema = z.object({
  propertyId: z.string().min(1, "Le bien est requis"),
  tenantId: z.string().min(1, "Le locataire est requis"),
  rentAmount: z.coerce.number().positive("Le loyer doit être positif"),
  chargesAmount: z.coerce.number().min(0, "Les charges ne peuvent être négatives"),
  depositAmount: z.coerce.number().min(0, "Le dépôt ne peut être négatif"),
  startDate: z.iso.date("La date de début est invalide"),
  endDate: z.iso.date("La date de fin est invalide").optional().or(z.literal("")),
  paymentDay: z.coerce.number().int().min(1).max(31).default(1),
  paymentMethod: z.enum(["TRANSFER", "CHECK", "CASH", "DIRECT_DEBIT", "OTHER"]).default("TRANSFER"),
  leaseType: z.enum(["UNFURNISHED", "FURNISHED", "COMMERCIAL", "SEASONAL"]).default("UNFURNISHED"),
  irlReferenceQuarter: z.string().optional().or(z.literal("")),
  irlReferenceValue: z.coerce.number().optional(),
}).refine(data => !data.endDate || data.endDate >= data.startDate, {
  message: "La date de fin doit être postérieure à la date de début", path: ["endDate"],
}).refine(data => data.leaseType !== "UNFURNISHED" || new Decimal(data.depositAmount).lte(data.rentAmount), {
  message: "Le dépôt de garantie ne peut excéder un mois de loyer hors charges", path: ["depositAmount"],
}).refine(data => data.leaseType !== "FURNISHED" || new Decimal(data.depositAmount).lte(new Decimal(data.rentAmount).times(2)), {
  message: "Le dépôt de garantie ne peut excéder deux mois de loyer hors charges", path: ["depositAmount"],
});

export type LeaseFormValues = z.infer<typeof leaseSchema>;

// The standalone form creates the same domain object as every other entry point.
export const standaloneLeaseSchema = leaseSchema;
export type StandaloneLeaseFormValues = LeaseFormValues;
