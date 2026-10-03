import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { propertySchema } from "@/lib/validations/property";

/**
 * Le trou que ce test verrouille (t_cf156682).
 *
 * `zodResolver(propertySchema)` bloque le submit COTE CLIENT : quand un champ est
 * invalide, `handleSubmit` n'appelle jamais la server action, donc aucun toast
 * n'est emis. Le seul retour possible pour l'utilisateur est le message rendu
 * dans le formulaire. Or property-form.tsx ne rendait `errors` que pour `name`,
 * `type`, `addressLine1`, `city` et `postalCode` : les champs facultatifs
 * (`surface`, `rooms`, `description`, `addressLine2`) etaient des trous
 * silencieux. Mesure au navigateur avant le correctif :
 *
 *     surface=-0.5     -> toasts=[] cree=false dialogue ouvert aria-invalid=null
 *     rooms=-1         -> toasts=[] cree=false dialogue ouvert aria-invalid=null
 *     rooms=2.5        -> toasts=[] cree=false dialogue ouvert aria-invalid=null
 *     description=2500 -> toasts=[] cree=false dialogue ouvert aria-invalid=null
 *
 * « L'utilisateur clique Ajouter et il ne se passe rien, sans motif. »
 *
 * WHY THIS READS SOURCE INSTEAD OF RENDERING
 *
 * La suite vitest tourne en `environment: "node"` : ni jsdom ni
 * @testing-library/react ne sont installes, et les ajouter pour un seul
 * composant serait un cout disproportionne. Ce test verifie donc une PROPRIETE
 * du source — « tout champ du schema a une sortie visible » — et le
 * comportement au navigateur est verifie par le spec Playwright
 * `property-form-errors.spec.ts`, qui saisit reellement -0.5 et exige un texte
 * visible. Les deux se complètent : celui-ci empeche le trou de revenir, celui-la
 * prouve que le DOM repond.
 */

const FORM = join(
  process.cwd(),
  "src/components/property-form.tsx"
);
const source = readFileSync(FORM, "utf8");

/** Les memes plafonds que le schema, recopies ici volontairement. */
const MAX_LENGTHS: Record<string, number> = {
  name: 200,
  addressLine1: 500,
  addressLine2: 500,
  postalCode: 10,
  city: 200,
  description: 2000,
};

const schemaFields = Object.keys(propertySchema.shape);

/**
 * Champs que le formulaire REND. `cadastralRef` et `taxRef` sont dans le schema
 * et dans `defaultValues`, mais aucun `<Input>` ne les rend : ils ne sont donc
 * pas saisissables et n'ont pas d'erreur a afficher. C'est un manque du
 * formulaire, hors perimetre de cette carte (ajouter deux champs est une
 * feature), et la liste ci-dessous le rend explicite plutot que de le cacher.
 */
const RENDERED_FIELDS = [
  "name",
  "type",
  "addressLine1",
  "addressLine2",
  "city",
  "postalCode",
  "surface",
  "rooms",
  "description",
] as const;

/** Champs du schema sans champ correspondant dans le formulaire. */
const SCHEMA_ONLY_FIELDS = schemaFields.filter(
  (f) => !(RENDERED_FIELDS as readonly string[]).includes(f)
);

describe("property-form rend une sortie visible pour chaque champ du schema", () => {
  it("le schema et la liste de controle n'ont pas derive", () => {
    // Si un champ est ajoute au schema, ce test doit le signaler explicitement
    // plutot que de passer en silence sur une liste de controle figee.
    expect(schemaFields.sort()).toEqual(
      [
        "addressLine1",
        "addressLine2",
        "cadastralRef",
        "city",
        "description",
        "name",
        "postalCode",
        "rooms",
        "surface",
        "taxRef",
        "type",
      ].sort()
    );
  });

  it("signale les champs du schema que le formulaire ne rend pas", () => {
    // Pas une attente d'echec : un constat explicite. Si un de ces champs
    // gagne un `<Input>`, il doit rejoindre RENDERED_FIELDS et donc
    // ci-dessous essayer de rendre son erreur.
    expect(SCHEMA_ONLY_FIELDS.sort()).toEqual(["cadastralRef", "taxRef"]);
  });

  it.each(RENDERED_FIELDS)("%s a aria-invalid", (field) => {
    expect(source).toContain(`aria-invalid={!!errors.${field}}`);
  });

  it.each(RENDERED_FIELDS)("%s rend son message d'erreur", (field) => {
    // `errors.type` est le seul rendu a la main (Select) plutot que via FieldError.
    expect(source).toMatch(
      new RegExp(`errors\\.${field}\\?\\.message|errors\\.${field}\\.message`)
    );
  });

  it.each(
    // `type` passe par un Select pilote a la main (setValue), pas par `register` :
    // il est donc valide s'il est pilote, pas enregistre.
    RENDERED_FIELDS.filter((f) => f !== "type")
  )("%s est enregistre dans le formulaire", (field) => {
    expect(source).toContain(`register("${field}")`);
  });

  it("type est pilote par setValue", () => {
    expect(source).toContain('setValue("type", typed');
  });
});

describe("maxLength du formulaire aligne sur les contraintes du schema", () => {
  it.each(Object.entries(MAX_LENGTHS))(
    "%s porte maxLength=%i",
    (field, max) => {
      // On cherche l'attribut dans le bloc du champ, pas dans tout le fichier.
      const anchor = source.indexOf(`register("${field}")`);
      expect(anchor, `champ ${field} absent du formulaire`).toBeGreaterThan(-1);

      const blockStart = source.lastIndexOf("<Input", anchor);
      const blockEnd = source.lastIndexOf("<Textarea", anchor);
      const block = source.slice(Math.max(blockStart, blockEnd), anchor);

      expect(
        block,
        `aucun maxLength sur le champ ${field}`
      ).toContain(`maxLength={${max}}`);
    }
  );
});

describe("le formulaire ne laisse pas le navigateur parler a sa place", () => {
  it("pose noValidate : le schema est la seule source de verite", () => {
    // Sans noValidate, le navigateur peut bloquer le submit sur `min="0"` des
    // champs nombre et n'afficher que sa bulle native — invisible pour un test,
    // impossible a styler, et non rattache au champ. Le retour doit venir du
    // schema, rendu dans le DOM.
    expect(source).toMatch(/<form[\s\S]*?noValidate[\s\S]*?>/);
  });

  it("rattache chaque message a son champ par aria-describedby", () => {
    for (const field of [...Object.keys(MAX_LENGTHS), "type"]) {
      expect(
        source,
        `aria-describedby manquant pour ${field}`
      ).toContain(`aria-describedby={errors.${field} ? "${field}-error" : undefined}`);
    }
  });
});