import { z } from "zod";

export const propertySchema = z.object({
  name: z.string().min(1, "Le nom du bien est requis").max(200),
  type: z.enum(["APARTMENT", "HOUSE", "STUDIO", "COMMERCIAL", "PARKING", "OTHER"], {
    message: "Le type de bien est requis",
  }),
  addressLine1: z.string().min(1, "L'adresse est requise").max(500),
  addressLine2: z.string().max(500).optional().or(z.literal("")),
  city: z.string().min(1, "La ville est requise").max(200),
  postalCode: z.string().min(5, "Code postal invalide").max(10),
  surface: z.coerce.number().positive("La surface doit être positive").optional().or(z.literal(0)),
  rooms: z.coerce.number().int().min(0).optional().or(z.literal(0)),
  description: z.string().max(2000).optional().or(z.literal("")),
  cadastralRef: z.string().max(50).optional().or(z.literal("")),
  taxRef: z.string().max(50).optional().or(z.literal("")),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;
