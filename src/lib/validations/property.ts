import { z } from "zod";

/**
 * Les trois formes de "non renseigne" que reçoit la validation serveur.
 *
 * Un formulaire HTML envoie toujours une chaine : un champ laisse vide part
 * en "", et un champ nombre a valeur par defaut 0 part en "0" (que le client
 * produit avec `String(value ?? "")`). Une API JSON envoie `null` pour
 * "absent". Les trois veulent dire la meme chose ici — le champ n'a pas ete
 * renseigne — donc on les ramene a undefined AVANT toute coercion.
 *
 * Sans ce preprocesseur, `z.coerce.number()` transforme "" et null en 0, et un
 * 0 sur `surface` devient une erreur alors que l'utilisateur n'a rien saisi.
 */
const absent = (value: unknown): unknown =>
  value === null || (typeof value === "string" && value.trim() === "") ? undefined : value;

/**
 * Zeros sous toutes leurs ecritures. On compare APRES la coercion numerique :
 * "0", "0.0", "0.00", ".0" et "00" valent tous 0, et tester l'egalite avec la
 * chaine "0" avant coercion laissait passer les autres ecritures, qui
 * devenaient alors un 0 refuse par `.positive()` — un refus que l'utilisateur
 * ne voit pas, car le formulaire n'affiche pas `errors.surface`.
 */
const isZero = (value: unknown): boolean => {
  if (typeof value === "number") return value === 0;
  // Uniquement les chaines : `Number([])` et `Number(false)` valent aussi 0,
  // on ne veut pas avaler une saisie aberrante pour laDeclarer non renseignee.
  if (typeof value !== "string") return false;
  const n = Number(value);
  return Number.isFinite(n) && n === 0;
};

/**
 * Nombre positif facultatif. 0 est traite comme "non renseigne" : 0 m² n'est
 * pas une surface, et c'est la valeur par defaut du formulaire.
 */
const optionalPositiveNumber = (notANumber: string, notPositive: string) =>
  z.preprocess(
    (value) => {
      const v = absent(value);
      return v === undefined || isZero(v) ? undefined : v;
    },
    z.coerce
      .number({ error: notANumber })
      .positive(notPositive)
      .optional()
  );

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
  rooms: z.preprocess(
    absent,
    z.coerce
      .number({ error: "Le nombre de pièces doit être un nombre" })
      .int("Le nombre de pièces doit être un entier")
      .min(0, "Le nombre de pièces ne peut pas être négatif")
      .optional()
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
