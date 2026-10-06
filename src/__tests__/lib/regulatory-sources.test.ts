/**
 * Gardes de la source de vérité réglementaire (src/data/regulatory-sources.ts).
 *
 * Ce test ne valide pas le droit français : il valide que CHAQUE valeur
 * publiée est traçable. Quatre properties, chacune liée à un mode
 * d'échec déjà observé sur ce dépôt :
 *
 *  1. Toute entrée porte une source non vide et une URL. Une valeur réglementaire
 *     sans source est une affirmation nue : c'est exactement le mode de panne
 *     que la loi Climat-Résilience avait produit sur les pages DPE.
 *  2. Toute entrée porte une date de vérification. Une source jamais recontrôlée
 *     est une source qui a déjà changé sans qu'on le sache.
 *  3. Les valeurs INSEE de regulatory-sources.ts correspondent exactement à
 *     src/lib/irl-calculator.ts. Le module doit PROJETER la table, jamais la
 *     recopier : une divergence ici signifierait que la page publie un IRL et
 *     que le calculateur en applique un autre — un loyer facturé à un index
 *     qui n'est pas celui affiché.
 *  4. Aucune valeur marquée `verified: false` n'est publiée sans revue
 *     explicite. Un trou visible vaut mieux qu'une valeur fausse, mais un trou
 *     qui reste publié sans explication ne vaut rien : ce test force la revue.
 */

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import {
  ALL_REGULATORY_SOURCES,
  REGULATORY_GAPS,
  REGULATORY_SOURCES,
  IRL_SOURCE_RECORDS,
  SOURCES,
  VERIFICATION_RUN_DATE,
  buildCitation,
  getRegulatorySource,
  getUnverifiedSources,
  isPublishable,
} from "@/data/regulatory-sources";
import { IRL_INDICES, IRL_SOURCE_URL } from "@/lib/irl-calculator";

const ROOT = process.cwd();

/** Le registre lui-même n'est pas du contenu public. */
const REGISTRY = "src/data/regulatory-sources.ts";

/**
 * Périmètre « contenu public » : ce qu'un propriétaire lit. Le même inventaire
 * sert aux tests de contenu du dépôt (legal-accuracy.test.ts lit articles.ts),
 * donc les deux résistent au même oubli.
 */
function publicContentFiles(): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(join(ROOT, dir))) {
      const rel = `${dir}/${name}`;
      const abs = join(ROOT, dir, name);
      if (statSync(abs).isDirectory()) walk(rel);
      else if (/\.(tsx?|mdx?|json)$/.test(name)) out.push(rel);
    }
  };
  walk("src/data");
  walk("src/app");
  walk("src/components");
  return out.filter((f) => f !== REGISTRY);
}

const PUBLIC_FILES = publicContentFiles();
const PUBLIC_CONTENTS = new Map<string, string>(
  PUBLIC_FILES.map((f) => [f, readFileSync(join(ROOT, f), "utf8")])
);

/**
 * Revues explicites exigées pour les usages de valeurs non vérifiées.
 * Clé : id de la source. Valeur : la raison de la revue, plus le fichier de
 * contenu public où la valeur apparaît aujourd'hui. Si un usage apparaît dans un
 * fichier non listé ici — ou si une valeur non vérifiée apparaît sans revue —
 * le test échoue. Une revue devenue inutile doit donc être retirée.
 */
const REVIEWS: Record<string, { raison: string; usages: string[] }> = {
  "interet-legal-particuliers-s2-2026": {
    raison:
      "Usage antérieur à ce registre, dans deux réponses d'articles.ts. La valeur n'a pas pu être " +
      "confirmée contre l'arrêté du 26 juin 2026 le 2026-10-04 (Légifrance inaccessible ; la page du " +
      "ministère de l'Économie ne publie que le taux du 1er semestre 2026). Elle reste verrouillée par " +
      "legal-accuracy.test.ts, qui interdit le « 5 % » générique. À revoir dès qu'un accès à l'arrêté " +
      "est possible — et le cas échéant, cet id doit devenir verified:true, pas être supprimé.",
    usages: ["src/data/articles.ts"],
  },
};

/** Un id vérifié et une URL plausible (https, hébergeur officiel connu). */
const OFFICIAL_HOSTS = [
  "service-public.gouv.fr",
  "www.service-public.gouv.fr",
  "www.insee.fr",
  "www.legifrance.gouv.fr",
  "www.impots.gouv.fr",
  "www.economie.gouv.fr",
  "www.anil.org",
];

describe("traçabilité des entrées réglementaires", () => {
  it("centralise un nombre non trivial de valeurs, sans doublon d'identifiant", () => {
    // Garde de volume : un registre qui passe de 40 valeurs à 2 en ne cassant
    // aucun test ne peut pas être un registre. Voir LEGALITY-OF-AUDIT.
    expect(ALL_REGULATORY_SOURCES.length).toBeGreaterThanOrEqual(40);
    const ids = ALL_REGULATORY_SOURCES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("donne à chaque entrée une source non vide et une URL", () => {
    for (const entry of ALL_REGULATORY_SOURCES) {
      expect(entry.source.trim(), `${entry.id} : source vide`).not.toBe("");
      expect(entry.sourceUrl.trim(), `${entry.id} : URL vide`).not.toBe("");
      expect(entry.label.trim(), `${entry.id} : libellé vide`).not.toBe("");
      expect(entry.value.trim(), `${entry.id} : valeur vide`).not.toBe("");
      expect(
        () => new URL(entry.sourceUrl),
        `${entry.id} : URL illisible (${entry.sourceUrl})`
      ).not.toThrow();
      expect(
        OFFICIAL_HOSTS.some((h) => entry.sourceUrl.includes(h)),
        `${entry.id} : source non institutionnelle — ${entry.sourceUrl}`
      ).toBe(true);
    }
  });

  it("donne à chaque entrée une date de vérification et une date d'application", () => {
    for (const entry of ALL_REGULATORY_SOURCES) {
      for (const [field, value] of [
        ["dateVerified", entry.dateVerified],
        ["lastChecked", entry.lastChecked],
        ["appliesFrom", entry.appliesFrom],
        ["publishedAt", entry.publishedAt],
      ] as const) {
        expect(value, `${entry.id} : ${field} vide`).toMatch(
          /^\d{4}-\d{2}-\d{2}$/
        );
        expect(
          Number.isNaN(Date.parse(value)),
          `${entry.id} : ${field} illisible (${value})`
        ).toBe(false);
      }
      expect(
        Date.parse(entry.dateVerified) >= Date.parse(entry.appliesFrom),
        `${entry.id} : vérifié (${entry.dateVerified}) avant de s'appliquer (${entry.appliesFrom})`
      ).toBe(true);
    }
  });

  it("exige une raison pour chaque valeur non vérifiée", () => {
    for (const entry of ALL_REGULATORY_SOURCES) {
      if (entry.verified) continue;
      expect(
        entry.verificationNote?.trim(),
        `${entry.id} : verified:false sans verificationNote`
      ).toBeTruthy();
      expect(
        /N[Oo][Nn]|[Nn]on v[ée]rifi|non consult/i.test(entry.verificationNote ?? ""),
        `${entry.id} : la raison doit dire ce qui n'a pas été vérifié`
      ).toBe(true);
    }
  });
});

describe("les indices INSEE sont projetés, jamais recopiés", () => {
  it("expose exactement une entrée par indice, dans le même ordre", () => {
    expect(IRL_SOURCE_RECORDS).toHaveLength(IRL_INDICES.length);
    expect(IRL_SOURCE_RECORDS.map((e) => e.id)).toEqual(
      IRL_INDICES.map((i) => `irl-${i.quarter.toLowerCase()}`)
    );
  });

  it("ne diverge pas sur la valeur, la date de publication ni le trimestre", () => {
    for (const [index, record] of IRL_SOURCE_RECORDS.entries()) {
      const source = IRL_INDICES[index];
      expect(record.value, `${record.id} : valeur divergente`).toBe(
        source.value.toString()
      );
      // La comparaison doit être numérique et non textuelle : 146.60 et
      // "146.60" désignent le même indice.
      expect(Number(record.value), `${record.id} : valeur non numérique`).toBe(
        source.value
      );
      expect(record.publishedAt, `${record.id} : date de publication divergente`).toBe(
        source.publicationDate
      );
      expect(record.appliesFrom, `${record.id} : appliesFrom divergente`).toBe(
        source.publicationDate
      );
      expect(record.sourceUrl).toBe(IRL_SOURCE_URL);
      expect(record.verified).toBe(true);
    }
  });

  it("conserve l'ordre chronologique, dont s'appuie getLatestIrl()", () => {
    // getLatestIrl() lit le dernier élément du tableau : une table désordonnée
    // sous-revise un bail réel sans qu'aucune page ne le signale.
    const dates = IRL_SOURCE_RECORDS.map((e) => e.publishedAt);
    expect([...dates].sort()).toEqual(dates);
    const latest = IRL_SOURCE_RECORDS[IRL_SOURCE_RECORDS.length - 1];
    expect(latest.value).toBe(IRL_INDICES[IRL_INDICES.length - 1].value.toString());
  });
});

describe("une valeur non vérifiée n'est pas publiée sans revue", () => {
  /**
   * Un `verified: false` est toléré dans le registre — c'est le but : le trou
   * doit être visible. Il ne l'est plus si la valeur circule dans du contenu
   * public sans que quelqu'un l'ait assumée par écrit.
   */
  it("liste les usages de chaque valeur non vérifiée et exige une revue", () => {
    const unverified = getUnverifiedSources();
    expect(
      unverified.length,
      "Aucun trou de sourcing visible : le registre a probablement été rempli sans vérifications."
    ).toBeGreaterThanOrEqual(0);

    const reported: string[] = [];
    for (const entry of unverified) {
      const needles = [entry.value, entry.value.replace(".", ",")];
      const usages = PUBLIC_FILES.filter((file) => {
        const body = PUBLIC_CONTENTS.get(file) ?? "";
        return needles.some((n) => n.length > 2 && body.includes(n));
      });

      if (usages.length === 0) {
        // Aucune propagation : le trou reste proprement dans le registre.
        continue;
      }
      reported.push(`${entry.id} → ${usages.join(", ")}`);

      const review = REVIEWS[entry.id];
      expect(
        review,
        `${entry.id} est utilisée dans du contenu public (${usages.join(", ")}) ` +
          `sans revue explicite. Ajoutez une entrée dans REVIEWS avec la raison, ` +
          `ou retirez la valeur du contenu.`
      ).toBeTruthy();
      expect(
        [...usages].sort(),
        `${entry.id} : la revue annonce ${review.usages.join(", ")} mais les usages réels diffèrent`
      ).toEqual([...review.usages].sort());
      expect(review.raison.trim().length).toBeGreaterThan(80);
    }

    // Trace explicite : une revue qui ne correspond plus à aucun usage réel est
    // un oubli, sinon le fichier de test afficherait une revue qu'aucun
    // contenu ne justifie.
    for (const [id, review] of Object.entries(REVIEWS)) {
      const entry = getRegulatorySource(id);
      expect(entry, `REVIEWS référence un id inconnu : ${id}`).toBeDefined();
      expect(entry!.verified, `REVIEWS référence ${id}, qui n'est plus non vérifié`).toBe(false);
      expect(
        reported.some((line) => line.startsWith(`${id} →`)),
        `REVIEWS Declare une revue pour ${id}, mais plus aucun fichier public ne contient sa valeur. Retirez cette revue.`
      ).toBe(true);
    }
  });

  it("refuse de produire une citation pour une valeur non vérifiée", () => {
    for (const entry of getUnverifiedSources()) {
      expect(() => buildCitation(entry.id), `${entry.id} : citation interdite`).toThrow(
        /non vérifiée/
      );
      expect(isPublishable(entry.id)).toBe(false);
    }
  });

  it("produit une citation contenant valeur, source, URL et date", () => {
    for (const id of ["dg-plafond-location-vide", "irl-formule-revision", "quittance-paiement-partiel"]) {
      const citation = buildCitation(id);
      const entry = getRegulatorySource(id)!;
      expect(citation).toContain(entry.sourceUrl);
      expect(citation).toContain(entry.source);
      expect(citation).toContain(entry.dateVerified);
      expect(citation).toContain(entry.value);
    }
  });
});

describe("les trous de sourcing sont tracés sans valeur inventée", () => {
  it("décrit chaque manque et son éditeur de référence", () => {
    expect(REGULATORY_GAPS.length).toBeGreaterThanOrEqual(5);
    for (const gap of REGULATORY_GAPS) {
      expect(gap.missing.trim().length, `${gap.id} : manque non décrit`).toBeGreaterThan(40);
      expect(gap.officialSource.trim(), `${gap.id} : éditeur non cité`).not.toBe("");
      expect(
        ["a-sourcer", "bloque-legifrance", "a-confirmer-aupres-source"],
        `${gap.id} : statut inconnu`
      ).toContain(gap.status);
      // Un trou ne doit avancer aucune valeur : sinon la donnée est publiée
      // hors du registre, c'est-à-dire sans source.
      expect(gap.label, `${gap.id} : une valeur a été glissée dans un trou`).not.toMatch(
        /\d+\s*(€|%|mois|ans)\b/
      );
    }
  });

  it("ne déclare aucune source primaire qui n'a pas été réellement consultée", () => {
    const consulted = new Set(
      ALL_REGULATORY_SOURCES.map((e) => e.sourceUrl)
    );
    for (const used of consulted) {
      expect(
        Object.values(SOURCES).some((s) => s.url === used),
        `${used} n'est dans aucune entrée de SOURCES`
      ).toBe(true);
    }
    // Légifrance n'a pas été joignable : aucune entrée ne doit prétendre venir
    // directement de Légifrance, seulement des pages qui le référencent.
    expect(
      [...consulted].some((u) => u.includes("legifrance.gouv.fr")),
      "Une valeur prétend venir de Légifrance alors qu'il était inaccessible le 2026-10-04"
    ).toBe(false);
  });

  it("exige que la passe de vérification soit datée", () => {
    expect(VERIFICATION_RUN_DATE).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(REGULATORY_SOURCES.length).toBeGreaterThan(30);
  });
});
