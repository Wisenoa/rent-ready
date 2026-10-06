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
 *
 * SECOND COUCHE, meme famille (revue de t_cf156682) : `/api/properties` et
 * `property-actions` renvoient `issues[0].message` au client, donc une
 * contrainte sans message laisse Zod produire son anglais par defaut (« Too
 * big: expected string to have <=2000 characters »). Chaque contrainte porte
 * donc son message francais, y compris `{ error: ... }` qui couvre le mauvais
 * type et le champ absent. Le second argument de `z.object` couvre le cas
 * restant, lui aussi anglophone par defaut : un corps qui n'est pas un objet
 * du tout (`null`, `[]`, `42`, `"abc"`), que `await request.json()` laisse
 * passer tel quel jusqu'a `safeParse`.
 * `description`, `cadastralRef` et `taxRef` sont atteignables par l'API : ils
 * sont ecrits par POST/PATCH /api/properties et par `createProperty`/
 * `updateProperty`, meme si aucun `<Input>` ne les rend pour l'instant. Verrou
 * de non-regression : `src/__tests__/lib/validation-messages-fr.test.ts`.
 */
export const propertySchema = z.object(
  {
    name: z
      .string({ error: "Le nom du bien est requis" })
      .min(1, "Le nom du bien est requis")
      .max(200, "Le nom du bien ne peut pas dépasser 200 caractères"),
    type: z.enum(
      ["APARTMENT", "HOUSE", "STUDIO", "COMMERCIAL", "PARKING", "OTHER"],
      {
        message: "Le type de bien est requis",
      }
    ),
    addressLine1: z
      .string({ error: "L'adresse est requise" })
      .min(1, "L'adresse est requise")
      .max(500, "L'adresse ne peut pas dépasser 500 caractères"),
    addressLine2: z.preprocess(
      absent,
      z
        .string({ error: "Le complément d'adresse doit être du texte" })
        .max(500, "Le complément d'adresse ne peut pas dépasser 500 caractères")
        .optional()
    ),
    city: z
      .string({ error: "La ville est requise" })
      .min(1, "La ville est requise")
      .max(200, "La ville ne peut pas dépasser 200 caractères"),
    postalCode: z
      .string({ error: "Le code postal doit être du texte" })
      .min(5, "Code postal invalide")
      .max(10, "Le code postal ne peut pas dépasser 10 caractères"),
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
      z
        .string({ error: "La description doit être du texte" })
        .max(2000, "La description ne peut pas dépasser 2000 caractères")
        .optional()
    ),
    cadastralRef: z.preprocess(
      absent,
      z
        .string({ error: "La référence cadastrale doit être du texte" })
        .max(50, "La référence cadastrale ne peut pas dépasser 50 caractères")
        .optional()
    ),
    taxRef: z.preprocess(
      absent,
      z
        .string({ error: "La référence de taxe doit être du texte" })
        .max(50, "La référence de taxe ne peut pas dépasser 50 caractères")
        .optional()
    ),
  },
  { error: "Le corps de la requête doit être un objet JSON" }
);

export type PropertyFormValues = z.infer<typeof propertySchema>;
