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
 *
 * SECOND COUCHE, meme famille (revue de t_cf156682) : `/api/units` renvoie
 * `issues[0].message` tel quel au client, donc une contrainte sans message
 * laisse Zod produire son anglais par defaut (« Too big: expected string to
 * have <=50 characters ») que l'API affiche a l'utilisateur. Chaque contrainte
 * porte donc son message francais, y compris `{ error: ... }` qui couvre le
 * mauvais type et le champ absent, deux autres messages anglais produits tout
 * seul par Zod. Verrou de non-regression :
 * `src/__tests__/lib/validation-messages-fr.test.ts`.
 */
export const unitSchema = z.object({
  name: z
    .string({ error: "Le nom de l'unité est requis" })
    .min(1, "Le nom de l'unité est requis")
    .max(200, "Le nom de l'unité ne peut pas dépasser 200 caractères"),
  propertyId: z
    .string({ error: "L'ID du bien est requis" })
    .min(1, "L'ID du bien est requis"),
  floor: optionalInteger(
    "L'étage doit être un nombre",
    "L'étage doit être un entier",
    0,
    "L'étage ne peut pas être négatif"
  ),
  unitNumber: z.preprocess(
    absent,
    z
      .string({ error: "Le numéro d'unité doit être du texte" })
      .max(50, "Le numéro d'unité ne peut pas dépasser 50 caractères")
      .optional()
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
  type: z
    .enum(["APARTMENT", "HOUSE", "STUDIO", "COMMERCIAL", "PARKING", "OTHER"], {
      message: "Le type est requis",
    })
    .optional()
    .default("APARTMENT"),
  status: z
    .enum(["VACANT", "RENTED", "DRAFT"], {
      message: "Le statut est requis",
    })
    .optional()
    .default("VACANT"),
});

export type UnitFormValues = z.infer<typeof unitSchema>;