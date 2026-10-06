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

// Relaxed schema for standalone form — allows creating a lease with only property OR only tenant
export const standaloneLeaseSchema = leaseSchema
  .omit({ propertyId: true, tenantId: true })
  .extend({
    propertyId: z.string().optional(),
    tenantId: z.string().optional(),
  })
  .refine(
    (data) => data.propertyId || data.tenantId,
    { message: "Au moins un bien ou un locataire est requis" }
  )
  .refine(
    (data) => {
      if (!data.rentAmount || !data.depositAmount) return true;
      if (data.leaseType === "UNFURNISHED") {
        return data.depositAmount <= data.rentAmount;
      }
      if (data.leaseType === "FURNISHED") {
        return data.depositAmount <= data.rentAmount * 2;
      }
      return true;
    },
    {
      message: "Le dépôt de garantie ne peut excéder le plafond légal (art. 22 loi 1989)",
      path: ["depositAmount"],
    }
  );

export type StandaloneLeaseFormValues = z.infer<typeof standaloneLeaseSchema>;
