import { z } from "zod";
import { absent, optionalInteger, optionalPositiveNumber } from "./absent";

/**
 * Schema du formulaire de bien.
 *
 * Tous les champs facultatifs passent par les preprocesseurs de `./absent` :
 * chaine vide et `null` veulent dire « non renseigne », et pour une surface
 * aussi 0 (0 m2 n'est pas une surface — cf. t_f525a49c). Les messages sont en
 * francais et chaque champ optionnel du formulaire les rend : un refus
 * silencieux est un clic sans effet, que l'utilisateur ne peut ni voir ni
 * corriger.
 */
export const propertySchema = z.object({
  name: z.string().min(1, "Le nom du bien est requis").max(200),
  type: z.enum(["APARTMENT", "HOUSE", "STUDIO", "COMMERCIAL", "PARKING", "OTHER"], {
    message: "Le type de bien est requis",
  }),
  addressLine1: z.string().min(1, "L'adresse est requise").max(500),
  addressLine2: z.preprocess(
    absent,
    z.string().max(500).optional()
  ),
  city: z.string().min(1, "La ville est requise").max(200),
  postalCode: z.string().min(5, "Code postal invalide").max(10),
  surface: optionalPositiveNumber(
    "La surface doit être un nombre",
    "La surface doit être strictement positive"
  ),
  rooms: optionalInteger(
    "Le nombre de pièces doit être un nombre",
    "Le nombre de pièces doit être un entier",
    0,
    "Le nombre de pièces ne peut pas être négatif"
  ),
  description: z.preprocess(
    absent,
    z.string().max(2000).optional()
  ),
  cadastralRef: z.preprocess(
    absent,
    z.string().max(50).optional()
  ),
  taxRef: z.preprocess(
    absent,
    z.string().max(50).optional()
  ),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;
