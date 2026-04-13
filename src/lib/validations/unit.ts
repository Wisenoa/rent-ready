import { z } from "zod";

export const unitSchema = z.object({
  name: z.string().min(1, "Le nom de l'unité est requis").max(200),
  propertyId: z.string().min(1, "L'ID du bien est requis"),
  floor: z.coerce.number().int().min(0).optional(),
  unitNumber: z.string().max(50).optional().or(z.literal("")),
  surface: z.coerce.number().positive("La surface doit être positive").optional(),
  rooms: z.coerce.number().int().min(0).optional(),
  type: z.enum(["APARTMENT", "HOUSE", "STUDIO", "COMMERCIAL", "PARKING", "OTHER"], {
    message: "Le type est requis",
  }).optional().default("APARTMENT"),
  status: z.enum(["VACANT", "RENTED", "DRAFT"], {
    message: "Le statut est requis",
  }).optional().default("VACANT"),
});

export type UnitFormValues = z.infer<typeof unitSchema>;
