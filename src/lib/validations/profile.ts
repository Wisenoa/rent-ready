import { z } from "zod";

/**
 * Landlord profile — the owner-side equivalent of tenantSchema.
 *
 * These three fields (addressLine1, postalCode, city) are printed on every
 * quittance: they are the landlord's address as shown in the "bailleur" block of
 * a legally significant document (loi du 6 juillet 1989, art. 21). They default
 * to "" in the schema, so without this screen and this guard a beta landlord
 * would issue a receipt with an empty bailleur block.
 */
export const profileSchema = z.object({
  firstName: z.string().trim().min(1, "Le prénom est requis").max(100),
  lastName: z.string().trim().min(1, "Le nom est requis").max(100),
  phone: z.string().trim().max(20, "Numéro de téléphone trop long").optional(),
  addressLine1: z.string().trim().min(1, "L'adresse est requise").max(500),
  addressLine2: z.string().trim().max(500).optional(),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "Le code postal doit contenir 5 chiffres"),
  city: z.string().trim().min(1, "La ville est requise").max(200),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
