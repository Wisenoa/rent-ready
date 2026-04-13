import { z } from "zod";

export const guarantorSchema = z.object({
  leaseId: z.string().min(1, "L'ID du bail est requis"),
  type: z.enum(["PERSON", "COMPANY"], { message: "Le type de garant est requis" }),
  firstName: z.string().max(200).optional(),
  lastName: z.string().max(200).optional(),
  dateOfBirth: z.string().datetime().optional().or(z.literal("")),
  placeOfBirth: z.string().max(200).optional().or(z.literal("")),
  companyName: z.string().max(400).optional().or(z.literal("")),
  siren: z.string().max(20).optional().or(z.literal("")),
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
  phone: z.string().max(20).optional().or(z.literal("")),
  addressLine1: z.string().min(1, "L'adresse est requise").max(500),
  addressLine2: z.string().max(500).optional().or(z.literal("")),
  city: z.string().min(1, "La ville est requise").max(200),
  postalCode: z.string().min(5, "Code postal invalide").max(10),
  country: z.string().max(100).optional().default("France"),
  financialDocumentIds: z.array(z.string()).optional().default([]),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional().default("PENDING"),
});

export type GuarantorFormValues = z.infer<typeof guarantorSchema>;
