import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

/**
 * `/api/units` et `/api/properties` renvoient `parsed.error.issues[0].message`
 * au client, et `property-actions` renonce la meme chaine dans son `ActionResult`.
 * Une contrainte Zod sans message produit donc de l'anglais devant
 * l'utilisateur : « Too big: expected string to have <=50 characters ».
 *
 * Ces tests verrouillent la LANGUE, pas seulement le refus : ils refusalent
 * chaque saisie invalide et cherchent des marqueurs anglais dans le message.
 * Un message manque -> le test rougit. Ils protargent aussi les trois sources
 * d'anglais que Zod produit sans qu'on les demande : le `.max()` sans message,
 * le mauvais type, et le champ absent.
 *
 * Le dernier bloc appelle les VRAIS gestionnaires et lit le JSON : c'est la
 * reponse HTTP qui est le sujet de la carte, donc la reponse qu'il faut
 * mesurer (un test de schema seul prouverait que le schema est correct, pas
 * que l'utilisateur voit du francais).
 */

const { prismaMock, sessionMock } = vi.hoisted(() => ({
  prismaMock: {
    unit: {
      findMany: vi.fn(),
      count: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    property: {
      findMany: vi.fn(),
      count: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
  sessionMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("@/lib/auth-server", () => ({
  auth: { api: { getSession: sessionMock } },
}));

import { POST as postUnitRoute } from "@/app/api/units/route";
import { PATCH as patchUnitRoute } from "@/app/api/units/[id]/route";
import { POST as postPropertyRoute } from "@/app/api/properties/route";
import { unitSchema } from "@/lib/validations/unit";
import { propertySchema } from "@/lib/validations/property";

const json = (body: unknown): NextRequest =>
  new NextRequest("http://localhost/api/units", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });

const postUnit = (body: unknown) => postUnitRoute(json(body));
const postProperty = (body: unknown) => postPropertyRoute(json(body));
const patchUnit = (id: string, body: unknown) =>
  patchUnitRoute(json(body), { params: Promise.resolve({ id }) });

beforeEach(() => {
  vi.clearAllMocks();
  sessionMock.mockResolvedValue({ user: { id: "landlord-1" } });
  // PATCH verifie la propriete AVANT de valider le corps : sans une unite qui
  // existe, il repond 404 et n'atteint jamais la validation.
  prismaMock.unit.findFirst.mockResolvedValue({
    id: "unit_1",
    propertyId: "prop_123",
  });
  prismaMock.property.findFirst.mockResolvedValue({
    id: "prop_123",
    userId: "landlord-1",
  });
});

const ANGLAIS = [
  "Too big",
  "Too small",
  "Invalid input",
  "must be",
  "Required",
  "expected ",
] as const;

const anglaisDans = (messages: string[]): string[] =>
  messages.filter((m) => ANGLAIS.some((marqueur) => m.includes(marqueur)));

/** Rend le couple [entree invalide, chemin du champ fautif]. */
const messagesDe = (schema: typeof unitSchema | typeof propertySchema, input: unknown): string[] => {
  const parsed = schema.safeParse(input);
  if (parsed.success) throw new Error("attendu un refus, le schema a accepte");
  return parsed.error.issues.map((i) => i.message);
};

describe("unitSchema — aucun message anglais atteint l'utilisateur", () => {
  const required = { name: "Studio", propertyId: "prop_123" } as const;

  const cas: [string, unknown][] = [
    // Les trois mesures de la carte.
    ["unitNumber de 51 caracteres", { ...required, unitNumber: "A".repeat(51) }],
    ["unitNumber nombre", { ...required, unitNumber: 5 }],
    ["name de 201 caracteres", { ...required, name: "A".repeat(201) }],
    // Le reste des contraintes sans message.
    ["name vide", { ...required, name: "" }],
    ["name nombre", { ...required, name: 5 }],
    ["name absent", { propertyId: "prop_123" }],
    ["propertyId vide", { ...required, propertyId: "" }],
    ["propertyId absent", { name: "Studio" }],
    ["surface negative", { ...required, surface: -10 }],
    ["surface non numerique", { ...required, surface: "abc" }],
    ["rooms negatif", { ...required, rooms: "-1" }],
    ["rooms decimal", { ...required, rooms: "2.5" }],
    ["etage negatif", { ...required, floor: "-2" }],
    ["etage decimal", { ...required, floor: "1.5" }],
    ["type inconnu", { ...required, type: "CHATEAU" }],
    ["statut inconnu", { ...required, status: "EN_REPARATION" }],
  ];

  it.each(cas)("refuse %s en francais", (_label, input) => {
    expect(anglaisDans(messagesDe(unitSchema, input))).toEqual([]);
  });

  it("donne a chaque refus un message non vide, en francais", () => {
    for (const [label, input] of cas) {
      const messages = messagesDe(unitSchema, input);
      for (const message of messages) {
        expect(message.trim(), label).not.toBe("");
      }
    }
  });
});

describe("propertySchema — aucun message anglais atteint l'utilisateur", () => {
  const base = {
    name: "Bien",
    type: "APARTMENT",
    addressLine1: "12 Rue de Rivoli",
    city: "Lyon",
    postalCode: "69001",
  } as const;

  const cas: [string, unknown][] = [
    // La mesure de la carte, sur le champ que le formulaire ne rend pas.
    ["description de 2001 caracteres", { ...base, description: "a".repeat(2001) }],
    ["description nombre", { ...base, description: 5 }],
    // cadastralRef et taxRef : absents du formulaire, ecrits par l'API.
    ["cadastralRef de 51 caracteres", { ...base, cadastralRef: "a".repeat(51) }],
    ["cadastralRef nombre", { ...base, cadastralRef: 5 }],
    ["taxRef de 51 caracteres", { ...base, taxRef: "a".repeat(51) }],
    ["taxRef nombre", { ...base, taxRef: 5 }],
    // Le reste des contraintes sans message.
    ["addressLine2 de 501 caracteres", { ...base, addressLine2: "a".repeat(501) }],
    ["addressLine2 nombre", { ...base, addressLine2: 5 }],
    ["name de 201 caracteres", { ...base, name: "a".repeat(201) }],
    ["name vide", { ...base, name: "" }],
    ["name nombre", { ...base, name: 5 }],
    ["name absent", { ...base, name: undefined }],
    ["type inconnu", { ...base, type: "CHATEAU" }],
    ["type absent", { ...base, type: undefined }],
    ["addressLine1 de 501 caracteres", { ...base, addressLine1: "a".repeat(501) }],
    ["addressLine1 vide", { ...base, addressLine1: "" }],
    ["addressLine1 absent", { ...base, addressLine1: undefined }],
    ["city de 201 caracteres", { ...base, city: "a".repeat(201) }],
    ["city vide", { ...base, city: "" }],
    ["postalCode de 11 caracteres", { ...base, postalCode: "a".repeat(11) }],
    ["postalCode trop court", { ...base, postalCode: "1234" }],
    ["postalCode nombre", { ...base, postalCode: 69001 }],
    ["surface negative", { ...base, surface: -10 }],
    ["surface non numerique", { ...base, surface: "abc" }],
    ["rooms negatif", { ...base, rooms: "-1" }],
    ["rooms decimal", { ...base, rooms: "2.5" }],
  ];

  it.each(cas)("refuse %s en francais", (_label, input) => {
    expect(anglaisDans(messagesDe(propertySchema, input))).toEqual([]);
  });

  it("donne a chaque refus un message non vide, en francais", () => {
    for (const [label, input] of cas) {
      const messages = messagesDe(propertySchema, input);
      for (const message of messages) {
        expect(message.trim(), label).not.toBe("");
      }
    }
  });
});

describe("les refus de longueur disent quoi corriger", () => {
  it("nomme le champ et la limite, pas seulement « trop long »", () => {
    const parsed = propertySchema.safeParse({
      ...{
        name: "Bien",
        type: "APARTMENT",
        addressLine1: "12 Rue de Rivoli",
        city: "Lyon",
        postalCode: "69001",
      },
      description: "a".repeat(2001),
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.message).toBe(
        "La description ne peut pas dépasser 2000 caractères"
      );
    }
  });

  it("un plafond de nom d'unite dit lui aussi la limite", () => {
    const parsed = unitSchema.safeParse({
      name: "Studio",
      propertyId: "prop_123",
      unitNumber: "A".repeat(51),
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.message).toBe(
        "Le numéro d'unité ne peut pas dépasser 50 caractères"
      );
    }
  });
});

describe("non-regression : la reponse HTTP elle-meme est en francais", () => {
  // Un test de schema ne suffit pas : la carte fille est un constat sur la
  // REPONSE de /api/units. On appelle le vrai gestionnaire avec une session
  // authentifiee et on lit le JSON, plutot que de relire son source — c'est
  // la seule facon de prouver que le message anglais n'atteint pas le client.
  it("POST /api/units refuse un numero trop long avec un message francais", async () => {
    sessionMock.mockResolvedValue({ user: { id: "landlord-1" } });

    const response = await postUnit({
      name: "Studio",
      propertyId: "prop_123",
      unitNumber: "A".repeat(51),
    });

    expect(response.status).toBe(400);
    const body = (await response.json()) as { error: string };
    expect(body.error).toBe(
      "Le numéro d'unité ne peut pas dépasser 50 caractères"
    );
    expect(anglaisDans([body.error])).toEqual([]);
  });

  it("POST /api/units refuse un mauvais type avec un message francais", async () => {
    sessionMock.mockResolvedValue({ user: { id: "landlord-1" } });

    const response = await postUnit({
      name: "Studio",
      propertyId: "prop_123",
      unitNumber: 5,
    });

    expect(response.status).toBe(400);
    const body = (await response.json()) as { error: string };
    expect(anglaisDans([body.error])).toEqual([]);
    expect(body.error).toBe("Le numéro d'unité doit être du texte");
  });

  it("PATCH /api/units refuse un nom trop long avec un message francais", async () => {
    sessionMock.mockResolvedValue({ user: { id: "landlord-1" } });

    const response = await patchUnit("unit_1", {
      name: "A".repeat(201),
      propertyId: "prop_123",
    });

    expect(response.status).toBe(400);
    const body = (await response.json()) as { error: string };
    expect(body.error).toBe(
      "Le nom de l'unité ne peut pas dépasser 200 caractères"
    );
    expect(anglaisDans([body.error])).toEqual([]);
  });

  it("POST /api/properties refuse une description trop longue en francais", async () => {
    sessionMock.mockResolvedValue({ user: { id: "landlord-1" } });

    const response = await postProperty({
      name: "Bien",
      type: "APARTMENT",
      addressLine1: "12 Rue de Rivoli",
      city: "Lyon",
      postalCode: "69001",
      description: "a".repeat(2001),
    });

    expect(response.status).toBe(400);
    const body = (await response.json()) as { error: string };
    expect(body.error).toBe(
      "La description ne peut pas dépasser 2000 caractères"
    );
    expect(anglaisDans([body.error])).toEqual([]);
  });
});