/**
 * Calculateur de surface habitable (« loi Boutin », article R. 156-1 du Code
 * de la construction et de l'habitation) et vérification de l'écart de plus de
 * 5 % (1/20e) avec la surface mentionnée dans le bail (article 3-1 de la loi
 * n° 89-462 du 6 juillet 1989).
 *
 * Règles légales :
 * - Art. R. 156-1 CCH : la surface habitable est la surface de plancher
 *   construite, après déduction des murs, cloisons, marches et cages d'escaliers,
 *   gaines, embrasures de portes et de fenêtres. Il n'est pas tenu compte de la
 *   superficie des combles non aménagés, caves, sous-sols, remises, garages,
 *   terrasses, loggias, balcons, séchoirs extérieurs, vérandas, ni des parties
 *   de locaux d'une hauteur inférieure à 1,80 mètre.
 * - Art. 3-1 loi du 6 juillet 1989 : lorsque la surface habitable réelle est
 *   inférieure de plus d'un vingtième (5 %) à celle exprimée dans le contrat de
 *   location, le bailleur supporte, à la demande du locataire, une diminution
 *   du loyer proportionnelle à l'écart constaté.
 */
import Decimal from "decimal.js";
import { centsOf, toCents } from "./amount";

export type CategoriePieceSurface = "habitable" | "annexe-exclue";

export interface PieceSurfaceInput {
  id: string;
  nom: string;
  categorie: CategoriePieceSurface;
  surfacePlancherM2: Decimal; // surface totale de la pièce
  surfaceSous180M2: Decimal; // fraction dont la hauteur sous plafond est < 1,80 m
}

export interface SurfaceHabitableInput {
  pieces: PieceSurfaceInput[];
  surfaceInscriteBailM2?: Decimal | null;
  loyerMensuelHc?: Decimal | null;
}

export type SurfaceHabitableError = "no-rooms" | "sub-180-exceeds-total";

export const SURFACE_HABITABLE_ERROR_MESSAGES: Record<SurfaceHabitableError, string> = {
  "no-rooms": "Ajoutez au moins une pièce avec une surface supérieure à 0 m².",
  "sub-180-exceeds-total":
    "La surface sous 1,80 m de hauteur ne peut pas dépasser la surface totale de la pièce.",
};

export interface PieceSurfaceComputed {
  id: string;
  nom: string;
  categorie: CategoriePieceSurface;
  surfacePlancherM2: Decimal;
  surfaceExclueM2: Decimal;
  surfaceHabitableRetenueM2: Decimal;
}

export interface VerificationBailArticle3_1 {
  surfaceBailM2: Decimal;
  ecartM2: Decimal;
  ecartPourcent: Decimal;
  depasseSeuilCinqPourcent: boolean;
  loyerActuelHc: Decimal | null;
  loyerReduitProportionnelHc: Decimal | null;
  baisseMensuelleHc: Decimal | null;
  baisseMensuelleCents: number;
}

export interface SurfaceHabitableComputed {
  piecesDetail: PieceSurfaceComputed[];
  surfaceTotalePlancherM2: Decimal;
  surfaceTotaleExclueM2: Decimal;
  surfaceHabitableTotaleM2: Decimal;
  inferieureSeuilDecence9M2: boolean;
  verificationBail: VerificationBailArticle3_1 | null;
}

export type SurfaceHabitableOutcome =
  | { ok: true; result: SurfaceHabitableComputed }
  | { ok: false; error: SurfaceHabitableError };

export function formatM2(value: Decimal): string {
  return `${value.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toFixed(2).replace(".", ",")} m²`;
}

export function computeSurfaceHabitable(input: SurfaceHabitableInput): SurfaceHabitableOutcome {
  if (input.pieces.length === 0) {
    return { ok: false, error: "no-rooms" };
  }

  let surfaceTotalePlancher = new Decimal(0);
  let surfaceTotaleExclue = new Decimal(0);
  let surfaceHabitableTotale = new Decimal(0);
  const piecesDetail: PieceSurfaceComputed[] = [];

  for (const piece of input.pieces) {
    const plancher = piece.surfacePlancherM2.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
    const sous180 = piece.surfaceSous180M2.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

    if (sous180.greaterThan(plancher)) {
      return { ok: false, error: "sub-180-exceeds-total" };
    }

    const exclue =
      piece.categorie === "annexe-exclue" ? plancher : sous180;
    const retenue =
      piece.categorie === "annexe-exclue"
        ? new Decimal(0)
        : plancher.minus(sous180).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

    surfaceTotalePlancher = surfaceTotalePlancher.plus(plancher);
    surfaceTotaleExclue = surfaceTotaleExclue.plus(exclue);
    surfaceHabitableTotale = surfaceHabitableTotale.plus(retenue);

    piecesDetail.push({
      id: piece.id,
      nom: piece.nom.trim() || "Pièce",
      categorie: piece.categorie,
      surfacePlancherM2: plancher,
      surfaceExclueM2: exclue,
      surfaceHabitableRetenueM2: retenue,
    });
  }

  if (surfaceTotalePlancher.lessThanOrEqualTo(0)) {
    return { ok: false, error: "no-rooms" };
  }

  let verificationBail: VerificationBailArticle3_1 | null = null;
  if (input.surfaceInscriteBailM2 && input.surfaceInscriteBailM2.greaterThan(0)) {
    const surfaceBail = input.surfaceInscriteBailM2.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
    const ecartM2 = surfaceBail.minus(surfaceHabitableTotale).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
    const ecartRatio = ecartM2.dividedBy(surfaceBail);
    const ecartPourcent = ecartRatio.times(100).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

    // Article 3-1 loi du 6 juillet 1989 : strictement supérieur à 1/20e (5 %)
    const depasseSeuilCinqPourcent = ecartRatio.greaterThan(new Decimal("0.05"));

    let loyerActuelHc: Decimal | null = null;
    let loyerReduitProportionnelHc: Decimal | null = null;
    let baisseMensuelleHc: Decimal | null = null;
    let baisseMensuelleCents = 0;

    if (input.loyerMensuelHc && input.loyerMensuelHc.greaterThan(0)) {
      loyerActuelHc = toCents(input.loyerMensuelHc);
      if (depasseSeuilCinqPourcent) {
        loyerReduitProportionnelHc = toCents(
          loyerActuelHc.times(surfaceHabitableTotale).dividedBy(surfaceBail)
        );
        baisseMensuelleHc = toCents(loyerActuelHc.minus(loyerReduitProportionnelHc));
        baisseMensuelleCents = centsOf(baisseMensuelleHc);
      } else {
        loyerReduitProportionnelHc = loyerActuelHc;
        baisseMensuelleHc = new Decimal(0);
      }
    }

    verificationBail = {
      surfaceBailM2: surfaceBail,
      ecartM2,
      ecartPourcent,
      depasseSeuilCinqPourcent,
      loyerActuelHc,
      loyerReduitProportionnelHc,
      baisseMensuelleHc,
      baisseMensuelleCents,
    };
  }

  return {
    ok: true,
    result: {
      piecesDetail,
      surfaceTotalePlancherM2: surfaceTotalePlancher,
      surfaceTotaleExclueM2: surfaceTotaleExclue,
      surfaceHabitableTotaleM2: surfaceHabitableTotale,
      inferieureSeuilDecence9M2: surfaceHabitableTotale.lessThan(9),
      verificationBail,
    },
  };
}
