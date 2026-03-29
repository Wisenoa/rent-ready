import { z } from "zod";

export const tenantSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis").max(100),
  lastName: z.string().min(1, "Le nom est requis").max(100),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
  addressLine1: z.string().min(1, "L'adresse est requise").max(500),
  addressLine2: z.string().max(500).optional().or(z.literal("")),
  city: z.string().min(1, "La ville est requise").max(200),
  postalCode: z.string().min(5, "Code postal invalide").max(10),
  dateOfBirth: z.string().optional().or(z.literal("")),
  placeOfBirth: z.string().max(200).optional().or(z.literal("")),
  emergencyName: z.string().max(200).optional().or(z.literal("")),
  emergencyPhone: z.string().max(20).optional().or(z.literal("")),
});

export type TenantFormValues = z.infer<typeof tenantSchema>;
