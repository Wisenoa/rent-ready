import { describe, it, expect } from "vitest";
import { propertySchema } from "@/lib/validations/property";

/**
 * Ces tests passent par les valeurs par defaut du FORMULAIRE, pas par des
 * objets escribles a la main. Voir `src/components/property-form.tsx` :
 * `defaultValues.surface = 0` et `formData.append(key, String(value ?? ""))`.
 * C'est donc "0" et "" qui arrivent reellement au schema, pas 0 et undefined.
 */
const PROPERTY_FORM_DEFAULTS = {
  name: "Studio",
  type: "STUDIO",
  addressLine1: "12 Rue de Rivoli",
  addressLine2: "",
  city: "Lyon",
  postalCode: "69001",
  surface: 0,
  rooms: 0,
  description: "",
  cadastralRef: "",
  taxRef: "",
} as const;

/** Reproduit la serialisation du formulaire vers la server action. */
function asFormData(values: Record<string, unknown>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, String(value ?? "")])
  );
}

const requiredFields = {
  name: "Studio",
  type: "STUDIO",
  addressLine1: "12 Rue de Rivoli",
  city: "Lyon",
  postalCode: "69001",
};

describe("propertySchema — valeurs par defaut du formulaire produit", () => {
  it("accepte la creation d'un bien sans renseigner la surface (regression)", () => {
    const parsed = propertySchema.safeParse(
      asFormData(PROPERTY_FORM_DEFAULTS)
    );

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.surface).toBeUndefined();
    }
  });

  it("traite la surface 0, la chaine \"0\" et la chaine vide comme non renseignee", () => {
    for (const surface of [0, "0", ""]) {
      const parsed = propertySchema.safeParse({
        ...requiredFields,
        surface,
      });
      expect(parsed.success, `surface=${JSON.stringify(surface)}`).toBe(true);
    }
  });

  it("traite rooms et les champs texte vides comme non renseignes", () => {
    const parsed = propertySchema.safeParse({
      ...requiredFields,
      rooms: "",
      description: "",
      addressLine2: "",
      cadastralRef: "",
      taxRef: "",
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.rooms).toBeUndefined();
      expect(parsed.data.description).toBeUndefined();
      expect(parsed.data.addressLine2).toBeUndefined();
      expect(parsed.data.cadastralRef).toBeUndefined();
      expect(parsed.data.taxRef).toBeUndefined();
    }
  });

  it("conserve 0 piece quand 0 est saisi explicitement", () => {
    const parsed = propertySchema.safeParse({ ...requiredFields, rooms: "0" });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.rooms).toBe(0);
    }
  });

  it("accepte une surface et un nombre de pieces réellement saisis", () => {
    const parsed = propertySchema.safeParse({
      ...requiredFields,
      surface: "65.5",
      rooms: "3",
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.surface).toBe(65.5);
      expect(parsed.data.rooms).toBe(3);
    }
  });

  it("accepte une API JSON qui envoie null pour un bien sans surface", () => {
    const parsed = propertySchema.safeParse({
      ...requiredFields,
      surface: null,
      rooms: null,
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.surface).toBeUndefined();
      expect(parsed.data.rooms).toBeUndefined();
    }
  });
});

describe("propertySchema — refus reels", () => {
  it("refuse une surface negative, nombre ou chaine", () => {
    for (const surface of [-3, "-3"]) {
      const parsed = propertySchema.safeParse({ ...requiredFields, surface });
      expect(parsed.success, `surface=${JSON.stringify(surface)}`).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.message).toBe(
          "La surface doit être strictement positive"
        );
      }
    }
  });

  it("refuse une surface non numerique avec un message en francais", () => {
    const parsed = propertySchema.safeParse({ ...requiredFields, surface: "abc" });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.message).toBe(
        "La surface doit être un nombre"
      );
    }
  });

  it("refuse un nombre de pieces negatif ou decimal, en francais", () => {
    const negative = propertySchema.safeParse({ ...requiredFields, rooms: "-1" });
    expect(negative.success).toBe(false);
    if (!negative.success) {
      expect(negative.error.issues[0]?.message).toBe(
        "Le nombre de pièces ne peut pas être négatif"
      );
    }

    const decimal = propertySchema.safeParse({ ...requiredFields, rooms: "2.5" });
    expect(decimal.success).toBe(false);
    if (!decimal.success) {
      expect(decimal.error.issues[0]?.message).toBe(
        "Le nombre de pièces doit être un entier"
      );
    }
  });

  it("refuse toujours un nom vide ou un code postal invalide", () => {
    expect(
      propertySchema.safeParse({ ...requiredFields, name: "" }).success
    ).toBe(false);
    expect(
      propertySchema.safeParse({ ...requiredFields, postalCode: "75" }).success
    ).toBe(false);
  });
});
