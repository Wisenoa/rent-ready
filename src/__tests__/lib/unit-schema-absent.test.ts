import { describe, it, expect } from "vitest";
import { unitSchema } from "@/lib/validations/unit";

/**
 * `unitSchema` portait le meme defaut de forme que `propertySchema` avant
 * t_f525a49c : `floor`, `unitNumber`, `surface` et `rooms` etaient en
 * `z.coerce...` sans preprocesseur, donc
 *
 *   - "" et null devenaient 0 (ou une erreur illisible en anglais/technique) ;
 *   - les refus n'avaient pas de message en francais ;
 *   - l'API renvoyait un message que l'utilisateur ne pouvait pas comprendre.
 *
 * Ces tests verrouillent les deux moities : "non renseigne" est accepte, et un
 * refus reel reste un refus, en francais.
 */

const required = { name: "Studio", propertyId: "prop_123" } as const;

describe("unitSchema — champs facultatifs non renseigne", () => {
  it("traite la chaine vide et null comme non renseigne", () => {
    for (const empty of ["", "   ", null, undefined]) {
      const parsed = unitSchema.safeParse({
        ...required,
        floor: empty,
        unitNumber: empty,
        surface: empty,
        rooms: empty,
      });
      expect(parsed.success, `empty=${JSON.stringify(empty)}`).toBe(true);
      if (parsed.success) {
        expect(parsed.data.floor).toBeUndefined();
        expect(parsed.data.unitNumber).toBeUndefined();
        expect(parsed.data.surface).toBeUndefined();
        expect(parsed.data.rooms).toBeUndefined();
      }
    }
  });

  it("traite 0 surface comme non renseigne (0 m2 n'est pas une surface)", () => {
    for (const surface of [0, "0", "0.0", ".0", "00"]) {
      const parsed = unitSchema.safeParse({ ...required, surface });
      expect(parsed.success, `surface=${JSON.stringify(surface)}`).toBe(true);
      if (parsed.success) {
        expect(parsed.data.surface).toBeUndefined();
      }
    }
  });

  // 0 piece et 0 etage (rez-de-chaussee) sont des valeurs REELLES : seulement la
  // chaine vide est traitee comme non renseignee.
  it("conserve 0 piece et 0 etage explicitement saisis", () => {
    const parsed = unitSchema.safeParse({
      ...required,
      floor: "0",
      rooms: "0",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.floor).toBe(0);
      expect(parsed.data.rooms).toBe(0);
    }
  });

  it("conserve les valeurs saisies normalement", () => {
    const parsed = unitSchema.safeParse({
      ...required,
      floor: 2,
      unitNumber: "B",
      surface: 65.5,
      rooms: 3,
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.floor).toBe(2);
      expect(parsed.data.unitNumber).toBe("B");
      expect(parsed.data.surface).toBe(65.5);
      expect(parsed.data.rooms).toBe(3);
    }
  });
});

describe("unitSchema — refus reels, en francais", () => {
  it("refuse une surface negative ou nulle explicitement signee", () => {
    for (const surface of [-10, "-10", 0.0001 * -1]) {
      const parsed = unitSchema.safeParse({ ...required, surface });
      expect(parsed.success, `surface=${JSON.stringify(surface)}`).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.message).toBe(
          "La surface doit être positive"
        );
      }
    }
  });

  it("refuse une surface non numerique, en francais", () => {
    const parsed = unitSchema.safeParse({ ...required, surface: "abc" });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.message).toBe(
        "La surface doit être un nombre"
      );
    }
  });

  it("refuse un nombre de pieces negatif, en francais", () => {
    const parsed = unitSchema.safeParse({ ...required, rooms: "-1" });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.message).toBe(
        "Le nombre de pièces ne peut pas être négatif"
      );
    }
  });

  it("refuse un nombre de pieces decimal, en francais", () => {
    const parsed = unitSchema.safeParse({ ...required, rooms: "2.5" });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.message).toBe(
        "Le nombre de pièces doit être un entier"
      );
    }
  });

  it("refuse un etage negatif ou decimal, en francais", () => {
    const negative = unitSchema.safeParse({ ...required, floor: "-2" });
    expect(negative.success).toBe(false);
    if (!negative.success) {
      expect(negative.error.issues[0]?.message).toBe(
        "L'étage ne peut pas être négatif"
      );
    }

    const decimal = unitSchema.safeParse({ ...required, floor: "1.5" });
    expect(decimal.success).toBe(false);
    if (!decimal.success) {
      expect(decimal.error.issues[0]?.message).toBe(
        "L'étage doit être un entier"
      );
    }
  });

  it("refuse un numero d'unite de plus de 50 caracteres", () => {
    const parsed = unitSchema.safeParse({
      ...required,
      unitNumber: "A".repeat(51),
    });
    expect(parsed.success).toBe(false);
  });

  it("refuse toujours l'absence de name ou de propertyId", () => {
    expect(unitSchema.safeParse({ propertyId: "prop_123" }).success).toBe(false);
    expect(unitSchema.safeParse({ name: "Studio" }).success).toBe(false);
  });
});