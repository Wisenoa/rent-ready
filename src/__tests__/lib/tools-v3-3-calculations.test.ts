/**
 * Unit tests for all 13 V3.3 free tool domain modules (`src/lib/tools/*`):
 * - quittance-document
 * - lettre-relance
 * - conge-vente
 * - rendement-locatif
 * - loyer-prorata
 * - pret-immobilier
 * - plus-value
 * - fiscalite-lmnp
 * - loi-jeanbrun
 * - depot-garantie
 * - preavis
 * - etat-des-lieux
 * - surface-habitable
 */
import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";

import {
  computeQuittanceDocument,
  daysInMonth,
  formatIsoDateFr,
} from "@/lib/tools/quittance-document";
import { computeLettreRelance } from "@/lib/tools/lettre-relance";
import { computeCongeVente, shiftMonthsQuantieme } from "@/lib/tools/conge-vente";
import { computeRendementLocatif, formatPercent } from "@/lib/tools/rendement-locatif";
import { computeProrataLoyer, computeLoyerM2 } from "@/lib/tools/loyer-prorata";
import { computePretImmobilier } from "@/lib/tools/pret-immobilier";
import {
  computePlusValue,
  computeAbattementIrPercent,
  computeAbattementPsPercent,
  computeSurtaxePlusValue,
} from "@/lib/tools/plus-value";
import { computeFiscaliteLmnp } from "@/lib/tools/fiscalite-lmnp";
import { computeLoiJeanbrun } from "@/lib/tools/loi-jeanbrun";
import { computeDepotGarantie } from "@/lib/tools/depot-garantie";
import { computePreavis } from "@/lib/tools/preavis";
import {
  computeSyntheseEtatDesLieux,
  POSTES_ETAT_DES_LIEUX,
} from "@/lib/tools/etat-des-lieux";
import { computeSurfaceHabitable } from "@/lib/tools/surface-habitable";

const d = (value: Decimal.Value) => new Decimal(value);

describe("quittance-document (art. 21 loi du 6 juillet 1989)", () => {
  it("computes a full quittance when statutPaiement is complet", () => {
    const out = computeQuittanceDocument({
      bailleurNom: "Claire Martin",
      bailleurAdresse: "12 rue de Rivoli, 75004 Paris",
      locataireNom: "Thomas Bernard",
      bienAdresse: "8 rue Oberkampf, 75011 Paris",
      mois: 3,
      annee: 2026,
      prorata: false,
      loyerMensuel: d("800"),
      chargesMensuelles: d("75"),
      typeCharges: "provision",
      statutPaiement: "complet",
      datePaiement: "2026-03-05",
      modePaiement: "virement",
      villeSignature: "Paris",
    });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.isQuittance).toBe(true);
    expect(out.result.documentTitle).toBe("QUITTANCE DE LOYER");
    expect(out.result.totalAppele.toFixed(2)).toBe("875.00");
    expect(out.result.montantEncaisse.toFixed(2)).toBe("875.00");
    expect(out.result.resteDu.toFixed(2)).toBe("0.00");
    expect(out.result.filename).toBe("quittance-loyer-2026-03.pdf");
  });

  it("switches to a partial payment receipt (reçu de paiement partiel) when statutPaiement is partiel", () => {
    const out = computeQuittanceDocument({
      bailleurNom: "Claire Martin",
      bailleurAdresse: "12 rue de Rivoli, 75004 Paris",
      locataireNom: "Thomas Bernard",
      bienAdresse: "8 rue Oberkampf, 75011 Paris",
      mois: 3,
      annee: 2026,
      prorata: false,
      loyerMensuel: d("800"),
      chargesMensuelles: d("75"),
      typeCharges: "provision",
      statutPaiement: "partiel",
      montantVerse: d("500"),
      datePaiement: "2026-03-05",
      modePaiement: "virement",
      villeSignature: "Paris",
    });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.isQuittance).toBe(false);
    expect(out.result.documentTitle).toBe("REÇU DE PAIEMENT PARTIEL DE LOYER");
    expect(out.result.totalAppele.toFixed(2)).toBe("875.00");
    expect(out.result.montantEncaisse.toFixed(2)).toBe("500.00");
    expect(out.result.resteDu.toFixed(2)).toBe("375.00");
    expect(out.result.filename).toBe("recu-partiel-loyer-2026-03.pdf");
  });

  it("prorates both rent and charges over occupied days vs month days", () => {
    const out = computeQuittanceDocument({
      bailleurNom: "Claire Martin",
      bailleurAdresse: "12 rue de Rivoli, 75004 Paris",
      locataireNom: "Thomas Bernard",
      bienAdresse: "8 rue Oberkampf, 75011 Paris",
      mois: 4,
      annee: 2026,
      prorata: true,
      jourDebut: 1,
      jourFin: 10,
      loyerMensuel: d("900"),
      chargesMensuelles: d("90"),
      typeCharges: "provision",
      statutPaiement: "complet",
      datePaiement: "2026-04-05",
      modePaiement: "virement",
      villeSignature: "Paris",
    });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.joursOccupes).toBe(10);
    expect(out.result.joursDansMois).toBe(30);
    expect(out.result.loyerAppele.toFixed(2)).toBe("300.00");
    expect(out.result.chargesAppelees.toFixed(2)).toBe("30.00");
    expect(out.result.totalAppele.toFixed(2)).toBe("330.00");
  });

  it("computes leap year February days and formats French dates accurately", () => {
    expect(daysInMonth(2, 2024)).toBe(29);
    expect(daysInMonth(2, 2025)).toBe(28);
    expect(formatIsoDateFr("2026-03-01")).toBe("1er mars 2026");
    expect(formatIsoDateFr("2026-03-15")).toBe("15 mars 2026");
  });
});

describe("lettre-relance (art. 7 a & art. 24 loi 1989)", () => {
  it("builds a formal mise en demeure in LRAR with exact remaining balance", () => {
    const out = computeLettreRelance({
      ton: "mise-en-demeure",
      bailleurNom: "Claire Martin",
      bailleurAdresse: "12 rue de Rivoli, 75004 Paris",
      locataireNom: "Thomas Bernard",
      bienAdresse: "8 rue Oberkampf, 75011 Paris",
      periodeImpayee: "mars 2026",
      dateEcheance: "2026-03-05",
      dateCourrier: "2026-03-20",
      villeCourrier: "Paris",
      loyerHorsCharges: d("800"),
      charges: d("75"),
      montantDejaVerse: d("200"),
    });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.totalAppele.toFixed(2)).toBe("875.00");
    expect(out.result.resteDu.toFixed(2)).toBe("675.00");
    expect(out.result.modeEnvoiLabel).toContain("LRAR");
    expect(out.result.plainText).toContain("675,00");
  });

  it("rejects when amount already paid covers the total due", () => {
    const out = computeLettreRelance({
      ton: "amiable",
      bailleurNom: "Claire Martin",
      bailleurAdresse: "12 rue de Rivoli, 75004 Paris",
      locataireNom: "Thomas Bernard",
      bienAdresse: "8 rue Oberkampf, 75011 Paris",
      periodeImpayee: "mars 2026",
      dateEcheance: "2026-03-05",
      dateCourrier: "2026-03-20",
      villeCourrier: "Paris",
      loyerHorsCharges: d("800"),
      charges: d("75"),
      montantDejaVerse: d("875"),
    });
    expect(out).toEqual({ ok: false, error: "already-paid" });
  });
});

describe("conge-vente (art. 15 II & art. 25-8 loi du 6 juillet 1989)", () => {
  it("computes the 6-month notice deadline and includes the 5 alinéas of art. 15 II for empty leases", () => {
    const out = computeCongeVente({
      typeBail: "vide",
      dateEcheanceBail: "2026-09-30",
      dateCourrier: "2026-03-01",
      prixVente: d("240000"),
      conditionsPaiement: "Paiement comptant le jour de la signature de l'acte authentique",
      descriptionBien: "Appartement T2 de 45 m² au 3e étage avec cave n° 4",
      bailleurNom: "Claire Martin",
      bailleurAdresse: "12 rue de Rivoli, 75004 Paris",
      locataireNom: "Thomas Bernard",
      bienAdresse: "8 rue Oberkampf, 75011 Paris",
      villeCourrier: "Paris",
    });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.delaiPreavisMois).toBe(6);
    expect(out.result.dateLimiteReceptionIso).toBe("2026-03-30");
    expect(out.result.droitPreemption).toBe(true);
    expect(out.result.estHorsDelai).toBe(false);
    expect(out.result.alineasArt15).toHaveLength(5);
  });

  it("requires 3 months notice without statutory preemption right for furnished leases", () => {
    const out = computeCongeVente({
      typeBail: "meublee",
      dateEcheanceBail: "2026-09-30",
      dateCourrier: "2026-06-01",
      prixVente: d("240000"),
      conditionsPaiement: "Paiement comptant",
      descriptionBien: "Studio meublé de 24 m²",
      bailleurNom: "Claire Martin",
      bailleurAdresse: "12 rue de Rivoli, 75004 Paris",
      locataireNom: "Thomas Bernard",
      bienAdresse: "8 rue Oberkampf, 75011 Paris",
      villeCourrier: "Paris",
    });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.delaiPreavisMois).toBe(3);
    expect(out.result.dateLimiteReceptionIso).toBe("2026-06-30");
    expect(out.result.droitPreemption).toBe(false);
    expect(out.result.alineasArt15).toBeNull();
  });
});

describe("rendement-locatif", () => {
  it("computes gross yield, acte-en-main yield, and net yield without floating-point drift", () => {
    const out = computeRendementLocatif({
      prixAchat: d("200000"),
      fraisAcquisition: d("16000"),
      travaux: d("10000"),
      loyerMensuelHc: d("950"),
      vacanceMoisParAn: d("0.5"),
      taxeFonciereAnnuelle: d("1100"),
      chargesNonRecuperablesAnnuelles: d("720"),
      assuranceAnnuelle: d("280"),
    });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.coutTotalProjet.toFixed(2)).toBe("226000.00");
    expect(out.result.loyerAnnuelPlein.toFixed(2)).toBe("11400.00");
    expect(out.result.perteVacanceAnnuelle.toFixed(2)).toBe("475.00");
    expect(out.result.loyerAnnuelEffectif.toFixed(2)).toBe("10925.00");
    expect(out.result.totalChargesAnnuelles.toFixed(2)).toBe("2100.00");
    expect(out.result.revenuNetAnnuel.toFixed(2)).toBe("8825.00");
    expect(formatPercent(out.result.rendementBrutSurPrix)).toBe("5,70 %");
    expect(formatPercent(out.result.rendementBrutActeEnMain)).toBe("5,04 %");
    expect(formatPercent(out.result.rendementNetCharges)).toBe("3,90 %");
  });
});

describe("loyer-prorata & loyer au m²", () => {
  it("computes prorata with real month days (28/29/30/31) and thirty-day convention", () => {
    const real = computeProrataLoyer({
      loyerMensuelHc: d("850"),
      chargesMensuelles: d("70"),
      dateDebut: "2026-03-15",
      dateFin: "2026-03-31",
      convention: "jours-reels",
    });
    expect(real.ok).toBe(true);
    if (!real.ok) return;
    // March 15 to March 31 inclusive = 17 days out of 31
    expect(real.result.joursOccupes).toBe(17);
    expect(real.result.diviseur).toBe(31);
    expect(real.result.loyerProrataHc.toFixed(2)).toBe("466.13");
    expect(real.result.chargesProrata.toFixed(2)).toBe("38.39");
    expect(real.result.totalProrataCc.toFixed(2)).toBe("504.52");

    const thirty = computeProrataLoyer({
      loyerMensuelHc: d("900"),
      chargesMensuelles: d("90"),
      dateDebut: "2026-03-01",
      dateFin: "2026-03-10",
      convention: "trentieme",
    });
    expect(thirty.ok).toBe(true);
    if (!thirty.ok) return;
    expect(thirty.result.joursOccupes).toBe(10);
    expect(thirty.result.diviseur).toBe(30);
    expect(thirty.result.totalProrataCc.toFixed(2)).toBe("330.00");
  });

  it("computes rent per m² and checks the +20% majoré ceiling in rent-controlled zones", () => {
    const out = computeLoyerM2({
      surfaceHabitable: d("45"),
      prixM2Hc: d("22.80"),
      chargesMensuelles: d("80"),
      loyerReferenceM2: d("20.50"),
    });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.loyerMensuelHc.toFixed(2)).toBe("1026.00");
    expect(out.result.encadrement?.loyerReferenceMajoreM2.toFixed(2)).toBe("24.60");
    expect(out.result.encadrement?.plafondMensuelHc.toFixed(2)).toBe("1107.00");
    expect(out.result.encadrement?.conformePlafond).toBe(true);
  });
});

describe("pret-immobilier", () => {
  it("computes exact monthly payment, insurance, total interest and amortization schedule", () => {
    const out = computePretImmobilier({
      montantProjet: d("216000"),
      apportPersonnel: d("30000"),
      dureeAnnees: 20,
      tauxNominalAnnuel: d("3.45"),
      tauxAssuranceAnnuel: d("0.34"),
    });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.capitalEmprunte.toFixed(2)).toBe("186000.00");
    expect(out.result.mensualiteHorsAssurance.toFixed(2)).toBe("1073.95");
    expect(out.result.mensualiteAssurance.toFixed(2)).toBe("52.70");
    expect(out.result.mensualiteTotale.toFixed(2)).toBe("1126.65");
    expect(out.result.tableauAnnuel).toHaveLength(20);
    expect(out.result.tableauAnnuel[19].capitalRestantDu.toFixed(2)).toBe("0.00");
  });
});

describe("plus-value immobilière (art. 150 U à 150 VH du CGI)", () => {
  it("applies the progressive abatement schedule: IR exempt at 22 years, PS exempt at 30 years", () => {
    expect(computeAbattementIrPercent(5).toNumber()).toBe(0);
    expect(computeAbattementIrPercent(6).toNumber()).toBe(6);
    expect(computeAbattementIrPercent(21).toNumber()).toBe(96);
    expect(computeAbattementIrPercent(22).toNumber()).toBe(100);

    expect(computeAbattementPsPercent(5).toNumber()).toBe(0);
    expect(computeAbattementPsPercent(21).toFixed(2)).toBe("26.40");
    expect(computeAbattementPsPercent(22).toFixed(2)).toBe("28.00");
    expect(computeAbattementPsPercent(30).toFixed(2)).toBe("100.00");
  });

  it("computes the 7.5% acquisition fee forfait, 15% works forfait (>= 5 yrs) and surtaxe", () => {
    const out = computePlusValue({
      natureBien: "locatif-secondaire",
      prixAcquisition: d("200000"),
      prixCession: d("280000"),
      anneesDetention: 10,
      modeFraisAcquisition: "forfait-7-5",
      fraisAcquisitionReels: d(0),
      modeTravaux: "forfait-15",
      travauxReels: d(0),
    });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.fraisAcquisitionRetenus.toFixed(2)).toBe("15000.00");
    expect(out.result.travauxRetenus.toFixed(2)).toBe("30000.00");
    expect(out.result.plusValueBrute.toFixed(2)).toBe("35000.00");
    expect(out.result.tauxAbattementIr.toFixed(0)).toBe("30");
    expect(out.result.tauxAbattementPs.toFixed(2)).toBe("8.25");
    expect(out.result.surtaxe.toFixed(2)).toBe("0.00");

    // Surtaxe above 50,000 € net IR capital gain
    expect(computeSurtaxePlusValue(d("50000")).toFixed(2)).toBe("0.00");
    expect(computeSurtaxePlusValue(d("80000")).toFixed(2)).toBe("1600.00");
  });

  it("integrates LMNP amortization recapture under reformed art. 150 VB CGI (reducing acquisition cost)", () => {
    // Normal sale: 200k purchase + 7.5% fees (15k) + 15% works (30k) = 245k cost. Resale 280k -> 35k gain.
    // LMNP réel with 40k deducted amortizations: corrected cost reduced by 40k -> 205k cost. Resale 280k -> 75k gain!
    const outLmnp = computePlusValue({
      natureBien: "locatif-secondaire",
      typeLocation: "lmnp-reel",
      prixAcquisition: d("200000"),
      prixCession: d("280000"),
      anneesDetention: 10,
      modeFraisAcquisition: "forfait-7-5",
      fraisAcquisitionReels: d(0),
      modeTravaux: "forfait-15",
      travauxReels: d(0),
      amortissementsDeduits: d("40000"),
    });
    expect(outLmnp.ok).toBe(true);
    if (!outLmnp.ok) return;
    expect(outLmnp.result.amortissementsReintegres.toFixed(2)).toBe("40000.00");
    expect(outLmnp.result.prixAcquisitionCorrige.toFixed(2)).toBe("205000.00");
    expect(outLmnp.result.plusValueBrute.toFixed(2)).toBe("75000.00");
  });
});

describe("fiscalite-lmnp (art. 50-0 & art. 39 C du CGI)", () => {
  it("applies social contributions (17.2%) after expenses and amortization in réel, and caps amortization at rent minus charges", () => {
    const out = computeFiscaliteLmnp({
      recettesAnnuelles: d("10800"),
      chargesDeductiblesAnnuelles: d("2100"),
      interetsEmpruntAnnuels: d("2900"),
      valeurBienImmobilier: d("180000"),
      valeurMobilierEtTravaux: d("14000"),
      tmi: 30,
    });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    // Micro-BIC 50% on 10,800 € = 5,400 € taxable
    expect(out.result.microBic.baseImposable.toFixed(2)).toBe("5400.00");
    expect(out.result.microBic.impotTotal.toFixed(2)).toBe("2548.80");

    // Réel: 10,800 - 5,000 = 5,800 before amortization; amortization = 5,100 (bâti) + 2,000 (mobilier) = 7,100
    // Capped at 5,800 under art. 39 C CGI -> 0 € taxable for BOTH IR and PS, 1,300 € carried forward!
    expect(out.result.reelSimplifie.resultatAvantAmortissement.toFixed(2)).toBe("5800.00");
    expect(out.result.reelSimplifie.dotationAmortissementTotale.toFixed(2)).toBe("7100.00");
    expect(out.result.reelSimplifie.amortissementImpute.toFixed(2)).toBe("5800.00");
    expect(out.result.reelSimplifie.amortissementReportable.toFixed(2)).toBe("1300.00");
    expect(out.result.reelSimplifie.baseImposable.toFixed(2)).toBe("0.00");
    expect(out.result.reelSimplifie.impotTotal.toFixed(2)).toBe("0.00");
    expect(out.result.regimePlusAvantageux).toBe("reel");
  });
});

describe("loi-jeanbrun (Statut du bailleur privé - loi de finances 2026)", () => {
  it("computes the 80% amortizable base and annual amortization by sector (3.5% / 4.5% / 5.5%)", () => {
    const outIntermediaire = computeLoiJeanbrun({
      prixAcquisition: d("220000"),
      loyerMensuelHc: d("900"),
      chargesAnnuellesDeductibles: d("1800"),
      secteur: "intermediaire",
      tmi: 30,
    });
    expect(outIntermediaire.ok).toBe(true);
    if (!outIntermediaire.ok) return;
    expect(outIntermediaire.result.baseAmortissable80Pct.toFixed(2)).toBe("176000.00");
    expect(outIntermediaire.result.tauxAmortissementAnnuelPct).toBe(3.5);
    expect(outIntermediaire.result.amortissementAnnuel.toFixed(2)).toBe("6160.00");
    expect(outIntermediaire.result.amortissementTotal9Ans.toFixed(2)).toBe("55440.00");
    expect(outIntermediaire.result.echeancier9Ans).toHaveLength(9);

    const outSocial = computeLoiJeanbrun({
      prixAcquisition: d("220000"),
      loyerMensuelHc: d("765"),
      chargesAnnuellesDeductibles: d("1800"),
      secteur: "social",
      tmi: 30,
    });
    expect(outSocial.ok).toBe(true);
    if (outSocial.ok) {
      expect(outSocial.result.tauxAmortissementAnnuelPct).toBe(4.5);
      expect(outSocial.result.amortissementAnnuel.toFixed(2)).toBe("7920.00");
    }

    const outTresSocial = computeLoiJeanbrun({
      prixAcquisition: d("220000"),
      loyerMensuelHc: d("630"),
      chargesAnnuellesDeductibles: d("1800"),
      secteur: "tres-social",
      tmi: 30,
    });
    expect(outTresSocial.ok).toBe(true);
    if (outTresSocial.ok) {
      expect(outTresSocial.result.tauxAmortissementAnnuelPct).toBe(5.5);
      expect(outTresSocial.result.amortissementAnnuel.toFixed(2)).toBe("9680.00");
    }
  });

  it("enforces statutory annual ceilings (8 000 €, 10 000 €, 12 000 €) and handles the 10,700 € global deficit cap", () => {
    // 1. Ceiling test: 300,000 € purchase in intermediate sector
    // 80% base = 240,000 € * 3.5% = 8,400 € theoretical -> capped at 8,000 €!
    const outCeiling = computeLoiJeanbrun({
      prixAcquisition: d("300000"),
      loyerMensuelHc: d("1000"),
      chargesAnnuellesDeductibles: d("1500"),
      secteur: "intermediaire",
      tmi: 30,
    });
    expect(outCeiling.ok).toBe(true);
    if (outCeiling.ok) {
      expect(outCeiling.result.amortissementTheorique.toFixed(2)).toBe("8400.00");
      expect(outCeiling.result.amortissementPlafonne).toBe(true);
      expect(outCeiling.result.amortissementAnnuel.toFixed(2)).toBe("8000.00");
      expect(outCeiling.result.depassementPlafondAnnuel.toFixed(2)).toBe("400.00");
    }

    // 2. Global deficit test in tres-social (capped at 12,000 € annual amort)
    // 300,000 € * 80% = 240,000 * 5.5% = 13,200 € -> capped at 12,000 €
    // Loyer: 6,000 €, charges: 8,000 €, interets: 2,000 €, amort: 12,000 € -> total deductions: 22,000 €
    // Deficit: 6,000 - 22,000 = -16,000 €
    // Capped at 10,700 € on global income, excess 5,300 € carried forward on property income
    const outDeficit = computeLoiJeanbrun({
      prixAcquisition: d("300000"),
      loyerMensuelHc: d("500"),
      chargesAnnuellesDeductibles: d("8000"),
      interetsEmpruntAnnuels: d("2000"),
      secteur: "tres-social",
      tmi: 30,
    });
    expect(outDeficit.ok).toBe(true);
    if (!outDeficit.ok) return;
    expect(outDeficit.result.amortissementAnnuel.toFixed(2)).toBe("12000.00");
    const yr1 = outDeficit.result.echeancier9Ans[0];
    expect(yr1.resultatFoncier.toFixed(2)).toBe("-16000.00");
    expect(yr1.deficitImputeRevenuGlobal.toFixed(2)).toBe("10700.00");
    expect(yr1.deficitReportable.toFixed(2)).toBe("5300.00");
  });
});

describe("depot-garantie (art. 22, 25-6 & 25-17 loi du 6 juillet 1989)", () => {
  it("enforces 1 month HC for bail vide, 2 months HC for bail meublé, and 0 € for bail mobilité", () => {
    const vide = computeDepotGarantie({
      typeBail: "vide",
      periodicite: "mensuel",
      loyerMensuelHc: d("850"),
      conformiteEdl: "conforme",
      enCopropriete: false,
      retenuesJustifiees: d("0"),
      moisRetardRestitution: 0,
    });
    expect(vide.ok && vide.result.plafondLegal.toFixed(2)).toBe("850.00");
    expect(vide.ok && vide.result.delaiRestitutionMois).toBe(1);

    const meuble = computeDepotGarantie({
      typeBail: "meublee",
      periodicite: "mensuel",
      loyerMensuelHc: d("850"),
      conformiteEdl: "differences",
      enCopropriete: true,
      retenuesJustifiees: d("200"),
      moisRetardRestitution: 2,
    });
    expect(meuble.ok).toBe(true);
    if (!meuble.ok) return;
    expect(meuble.result.nbMoisPlafond).toBe(2);
    expect(meuble.result.plafondLegal.toFixed(2)).toBe("1700.00");
    expect(meuble.result.delaiRestitutionMois).toBe(2);
    expect(meuble.result.provisionMaxCopropriete.toFixed(2)).toBe("340.00");
    expect(meuble.result.penaliteParMois.toFixed(2)).toBe("85.00");
    expect(meuble.result.penaliteTotaleRetard.toFixed(2)).toBe("170.00");

    const mobilite = computeDepotGarantie({
      typeBail: "mobilite",
      periodicite: "mensuel",
      loyerMensuelHc: d("850"),
      conformiteEdl: "conforme",
      enCopropriete: false,
      retenuesJustifiees: d("0"),
      moisRetardRestitution: 0,
    });
    expect(mobilite.ok && mobilite.result.nbMoisPlafond).toBe(0);
    expect(mobilite.ok && mobilite.result.plafondLegal.toFixed(2)).toBe("0.00");
  });
});

describe("preavis (art. 15, 25-8 & 25-15 loi du 6 juillet 1989 + art. 641 CPC)", () => {
  it("computes tenant and landlord notice durations and exact quantième-à-quantième end date", () => {
    const zoneTendue = computePreavis({
      auteur: "locataire",
      typeBail: "vide",
      motifLocataire: "zone-tendue",
      dateReference: "2026-04-15",
    });
    expect(zoneTendue.ok && zoneTendue.result.delaiMois).toBe(1);
    expect(zoneTendue.ok && zoneTendue.result.dateCalculeeIso).toBe("2026-05-15");

    const videStandard = computePreavis({
      auteur: "locataire",
      typeBail: "vide",
      motifLocataire: "aucun",
      dateReference: "2026-01-31",
    });
    expect(videStandard.ok && videStandard.result.delaiMois).toBe(3);
    // 31 Jan + 3 months -> 30 April (last day of April under art. 641 CPC)
    expect(videStandard.ok && videStandard.result.dateCalculeeIso).toBe("2026-04-30");
    expect(shiftMonthsQuantieme("2026-01-31", 1)).toBe("2026-02-28");
  });
});

describe("etat-des-lieux & surface-habitable", () => {
  it("lists the 10 inspection groups and computes inspection progress under Decree n° 2016-382", () => {
    expect(POSTES_ETAT_DES_LIEUX).toHaveLength(10);
    const summary = computeSyntheseEtatDesLieux({
      typeEdl: "entree",
      dateEdl: "2026-04-01",
      bienAdresse: "8 rue Oberkampf, 75011 Paris",
      locataireNom: "Thomas Bernard",
      indexElectricite: "14 250 kWh",
      indexEauFroide: "118 m³",
      indexGaz: "412 m³",
      nombreCles: "3 clés",
      etats: {
        "compteur-elec": "bon",
        "compteur-eau": "usage",
        "sanitaires-sdb": "degradation",
      },
      observations: "Joint de douche à refaire",
    });
    expect(summary.totalPostes).toBe(10);
    expect(summary.nbVerifies).toBe(3);
    expect(summary.nbBonEtat).toBe(1);
    expect(summary.nbUsureNormale).toBe(1);
    expect(summary.nbDegradations).toBe(1);
  });

  it("distinguishes habitable surface (height >= 1.80 m) from excluded surfaces and checks the 5% threshold (art. 3-1)", () => {
    const out = computeSurfaceHabitable({
      pieces: [
        {
          id: "sejour",
          nom: "Séjour",
          categorie: "habitable",
          surfacePlancherM2: d("28"),
          surfaceSous180M2: d("0"),
        },
        {
          id: "chambre",
          nom: "Chambre mansardée",
          categorie: "habitable",
          surfacePlancherM2: d("16"),
          surfaceSous180M2: d("3.5"),
        },
        {
          id: "balcon",
          nom: "Balcon",
          categorie: "annexe-exclue",
          surfacePlancherM2: d("6"),
          surfaceSous180M2: d("0"),
        },
      ],
      surfaceInscriteBailM2: d("44"),
      loyerMensuelHc: d("880"),
    });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.surfaceHabitableTotaleM2.toFixed(2)).toBe("40.50");
    expect(out.result.surfaceTotaleExclueM2.toFixed(2)).toBe("9.50");
    expect(out.result.verificationBail?.depasseSeuilCinqPourcent).toBe(true);
    expect(out.result.verificationBail?.loyerReduitProportionnelHc?.toFixed(2)).toBe("810.00");
    expect(out.result.verificationBail?.baisseMensuelleHc?.toFixed(2)).toBe("70.00");
  });
});
