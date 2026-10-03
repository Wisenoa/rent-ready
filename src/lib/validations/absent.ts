import { z } from "zod";

/**
 * Les formes de "non renseigne" que recoit la validation.
 *
 * Un formulaire HTML envoie toujours une chaine : un champ laisse vide part
 * en "", et un champ nombre a valeur par defaut 0 part en "0" (que le client
 * produit avec `String(value ?? "")`). Une API JSON envoie `null` pour
 * "absent". Les trois veulent dire la meme chose ici — le champ n'a pas ete
 * renseigne — donc on les ramene a undefined AVANT toute coercion.
 *
 * Sans ce preprocesseur, `z.coerce.number()` transforme "" et null en 0, et un
 * 0 sur une surface devient une erreur alors que l'utilisateur n'a rien saisi.
 */
export const absent = (value: unknown): unknown =>
  value === null || (typeof value === "string" && value.trim() === "")
    ? undefined
    : value;

/**
 * Zeros sous toutes leurs ecritures. On compare APRES la coercion numerique :
 * "0", "0.0", "0.00", ".0" et "00" valent tous 0, et tester l'egalite avec la
 * chaine "0" avant coercion laissait passer les autres ecritures, qui
 * devenaient alors un 0 refuse par `.positive()` — un refus que l'utilisateur
 * ne voyait pas, car le formulaire n'affichait pas l'erreur.
 */
export const isZero = (value: unknown): boolean => {
  if (typeof value === "number") return value === 0;
  // Uniquement les chaines : `Number([])` et `Number(false)` valent aussi 0,
  // on ne veut pas avaler une saisie aberrante pour la declarer non renseignee.
  if (typeof value !== "string") return false;
  const n = Number(value);
  return Number.isFinite(n) && n === 0;
};

/**
 * Nombre positif facultatif. 0 est traite comme "non renseigne" : 0 m2 n'est
 * pas une surface, et c'est la valeur par defaut du formulaire.
 */
export const optionalPositiveNumber = (
  notANumber: string,
  notPositive: string
) =>
  z.preprocess(
    (value) => {
      const v = absent(value);
      return v === undefined || isZero(v) ? undefined : v;
    },
    z.coerce.number({ error: notANumber }).positive(notPositive).optional()
  );

/**
 * Nombre entier facultatif, 0 autorise (0 piece, etage 0 / rez-de-chaussee
 * sont des valeurs reelles — contrairement a 0 m2). Seule la chaine vide et
 * null sont traites comme "non renseigne".
 */
export const optionalInteger = (
  notANumber: string,
  notAnInteger: string,
  minimum?: number,
  notMinimum?: string
) =>
  z.preprocess(
    absent,
    z.coerce
      .number({ error: notANumber })
      .int(notAnInteger)
      .refine((n) => minimum === undefined || n >= minimum, {
        message:
          notMinimum ??
          `La valeur ne peut pas être inférieure à ${minimum}`,
      })
      .optional()
  );