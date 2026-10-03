import { z } from "zod";
import { absent, optionalInteger, optionalPositiveNumber } from "./absent";

/**
 * Schema d'unite (logement).
 *
 * Meme famille de defaut que le schema de bien avant t_f525a49c : `floor`,
 * `unitNumber`, `surface` et `rooms` etaient en `z.coerce...` sans
 * preprocesseur, donc une chaine vide ou un `null` devenaient 0 ou une erreur
 * illisible. On reutilise les preprocesseurs de `./absent` — messages en
 * francais, 0 surface = non renseigne, 0 piece et 0 etage restent des valeurs
 * reelles.
 */
export const unitSchema = z.object({
  name: z.string().min(1, "Le nom de l'unité est requis").max(200),
  propertyId: z.string().min(1, "L'ID du bien est requis"),
  floor: optionalInteger(
    "L'étage doit être un nombre",
    "L'étage doit être un entier",
    0,
    "L'étage ne peut pas être négatif"
  ),
  unitNumber: z.preprocess(
    absent,
    z.string().max(50).optional()
  ),
  surface: optionalPositiveNumber(
    "La surface doit être un nombre",
    "La surface doit être positive"
  ),
  rooms: optionalInteger(
    "Le nombre de pièces doit être un nombre",
    "Le nombre de pièces doit être un entier",
    0,
    "Le nombre de pièces ne peut pas être négatif"
  ),
  type: z.enum(["APARTMENT", "HOUSE", "STUDIO", "COMMERCIAL", "PARKING", "OTHER"], {
    message: "Le type est requis",
  }).optional().default("APARTMENT"),
  status: z.enum(["VACANT", "RENTED", "DRAFT"], {
    message: "Le statut est requis",
  }).optional().default("VACANT"),
});

export type UnitFormValues = z.infer<typeof unitSchema>;
