"use client";

import { useState } from "react";
import Decimal from "decimal.js";

import { AMOUNT_ERROR_MESSAGES, formatEuros, parseAmount } from "@/lib/tools/amount";
import {
  computePlusValue,
  PLUS_VALUE_ERROR_MESSAGES,
  type ModeFraisAcquisition,
  type ModeTravauxPlusValue,
  type NatureBienPlusValue,
} from "@/lib/tools/plus-value";
import { formatPercent } from "@/lib/tools/rendement-locatif";
import { CopyButton } from "@/components/marketing/tools/CopyButton";
import {
  AmountField,
  ChoiceGroup,
  SelectField,
  ToolSheet,
  ToolStep,
  ToolWorkbench,
} from "@/components/marketing/tools/ToolForm";
import {
  ResultBadge,
  ResultFigure,
  ResultFormula,
  ResultJump,
  ResultPanel,
  ResultPending,
  ResultRows,
} from "@/components/marketing/tools/ToolResult";

const ANNEES_OPTIONS = Array.from({ length: 35 }, (_, idx) => ({
  value: String(idx),
  label:
    idx === 0
      ? "Moins d'un an (0 année révolue)"
      : idx === 1
        ? "1 année pleine révolue"
        : idx === 22
          ? "22 ans (exonéré d'impôt sur le revenu)"
          : idx === 30
            ? "30 ans (exonéré d'IR et de prélèvements sociaux)"
            : `${idx} années pleines révolues`,
}));

export function PlusValueClient() {
  const [natureBien, setNatureBien] = useState<NatureBienPlusValue>("locatif-secondaire");
  const [prixAcquisitionInput, setPrixAcquisitionInput] = useState("190000");
  const [prixCessionInput, setPrixCessionInput] = useState("275000");
  const [anneesDetention, setAnneesDetention] = useState("11");

  const [modeFrais, setModeFrais] = useState<ModeFraisAcquisition>("forfait-7-5");
  const [fraisReelsInput, setFraisReelsInput] = useState("15200");

  const [modeTravaux, setModeTravaux] = useState<ModeTravauxPlusValue>("forfait-15");
  const [travauxReelsInput, setTravauxReelsInput] = useState("12000");
  const [edited, setEdited] = useState(false);

  const mark = <T,>(setter: (val: T) => void) => (val: T) => {
    setEdited(true);
    setter(val);
  };

  const pAchat = parseAmount(prixAcquisitionInput, 50_000_000);
  const pVente = parseAmount(prixCessionInput, 50_000_000);
  const pFraisReels =
    modeFrais === "reel"
      ? parseAmount(fraisReelsInput, 10_000_000)
      : { ok: true as const, value: new Decimal(0) };
  const pTravauxReels =
    modeTravaux === "reel"
      ? parseAmount(travauxReelsInput, 15_000_000)
      : { ok: true as const, value: new Decimal(0) };

  const achatErr = !pAchat.ok
    ? AMOUNT_ERROR_MESSAGES[pAchat.error]
    : pAchat.value.isZero()
      ? PLUS_VALUE_ERROR_MESSAGES["zero-purchase"]
      : null;
  const venteErr = !pVente.ok
    ? AMOUNT_ERROR_MESSAGES[pVente.error]
    : pVente.value.isZero()
      ? PLUS_VALUE_ERROR_MESSAGES["zero-sale"]
      : null;
  const fraisErr = modeFrais === "reel" && !pFraisReels.ok ? AMOUNT_ERROR_MESSAGES[pFraisReels.error] : null;
  const travauxErr = modeTravaux === "reel" && !pTravauxReels.ok ? AMOUNT_ERROR_MESSAGES[pTravauxReels.error] : null;

  const outcome =
    !achatErr && !venteErr && !fraisErr && !travauxErr && pAchat.ok && pVente.ok && pFraisReels.ok && pTravauxReels.ok
      ? computePlusValue({
          natureBien,
          prixAcquisition: pAchat.value,
          prixCession: pVente.value,
          anneesDetention: Number(anneesDetention),
          modeFraisAcquisition: modeFrais,
          fraisAcquisitionReels: pFraisReels.value,
          modeTravaux,
          travauxReels: pTravauxReels.value,
        })
      : null;

  const res = outcome && outcome.ok ? outcome.result : null;

  return (
    <ToolWorkbench
      form={
        <ToolSheet label="Calculateur de plus-value immobilière">
          <ToolStep
            step={1}
            title="Nature du bien et prix d'acquisition / cession"
            description="Les biens locatifs et résidences secondaires relèvent du régime des plus-values des particuliers (articles 150 U à 150 VH du CGI). La résidence principale est exonérée."
          >
            <ChoiceGroup
              name="nature-bien-pv"
              legend="Usage du bien vendu"
              value={natureBien}
              onChange={mark(setNatureBien)}
              choices={[
                {
                  value: "locatif-secondaire",
                  label: "Investissement locatif / secondaire",
                  description: "Soumis au barème d'abattement (22 / 30 ans)",
                },
                {
                  value: "residence-principale",
                  label: "Résidence principale",
                  description: "Exonération totale (art. 150 U II-1° CGI)",
                },
              ]}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <AmountField
                id="pv-prix-achat"
                label="Prix d'acquisition initial"
                value={prixAcquisitionInput}
                onChange={mark(setPrixAcquisitionInput)}
                placeholder="190000"
                suffix="€"
                error={achatErr}
              />
              <AmountField
                id="pv-prix-vente"
                label="Prix de cession (net vendeur)"
                value={prixCessionInput}
                onChange={mark(setPrixCessionInput)}
                placeholder="275000"
                suffix="€"
                error={venteErr}
              />
            </div>

            <SelectField
              id="pv-annees-detention"
              label="Durée de détention en années pleines révolues"
              value={anneesDetention}
              onChange={mark(setAnneesDetention)}
              options={ANNEES_OPTIONS}
              hint="L'abattement fiscal commence à partir de la 6e année pleine de détention."
            />
          </ToolStep>

          <ToolStep
            step={2}
            title="Majoration du prix d'acquisition (frais et travaux)"
            description="L'article 150 VB II du CGI permet d'ajouter au prix d'achat les frais d'acquisition (forfait de 7,5 % ou frais réels) ainsi que les dépenses de travaux (forfait de 15 % après 5 ans de détention, ou montant réel sur factures)."
          >
            <ChoiceGroup
              name="mode-frais-pv"
              legend="Frais d'acquisition (frais de notaire)"
              value={modeFrais}
              onChange={mark(setModeFrais)}
              choices={[
                {
                  value: "forfait-7-5",
                  label: "Forfait légal de 7,5 %",
                  description: "Sans justificatif pour un achat à titre onéreux",
                },
                {
                  value: "reel",
                  label: "Frais réels",
                  description: "Sur justificatifs notariés",
                },
              ]}
            />

            {modeFrais === "reel" ? (
              <AmountField
                id="pv-frais-reels"
                label="Montant réel des frais d'acquisition"
                value={fraisReelsInput}
                onChange={mark(setFraisReelsInput)}
                placeholder="15200"
                suffix="€"
                error={fraisErr}
              />
            ) : null}

            <ChoiceGroup
              name="mode-travaux-pv"
              legend="Dépenses de travaux (construction, agrandissement, amélioration)"
              value={modeTravaux}
              onChange={mark(setModeTravaux)}
              choices={[
                {
                  value: "forfait-15",
                  label: "Forfait légal de 15 %",
                  description: "Applicable si détention ≥ 5 ans, sans facture",
                },
                {
                  value: "reel",
                  label: "Travaux réels sur factures",
                  description: "Non déjà déduits des revenus fonciers",
                },
              ]}
            />

            {modeTravaux === "reel" ? (
              <AmountField
                id="pv-travaux-reels"
                label="Montant réel des travaux éligibles"
                value={travauxReelsInput}
                onChange={mark(setTravauxReelsInput)}
                placeholder="12000"
                suffix="€"
                error={travauxErr}
              />
            ) : res && res.forfaitTravauxNonEligible ? (
              <p className="rounded-lg border border-[#EAD7AE] bg-[#FBF3E2] px-3.5 py-2.5 text-[13px] text-[#7A5512]">
                Pour une durée de détention inférieure à 5 ans, le forfait travaux de 15 % n&apos;est pas applicable (retenu à
                0 €). Choisissez « Travaux réels » si vous disposez de factures d&apos;entreprises.
              </p>
            ) : null}
          </ToolStep>

          {res ? (
            <ResultJump
              label="Impôt total sur la plus-value"
              value={formatEuros(res.impotTotal)}
              detail={`Net vendeur : ${formatEuros(res.netVendeurApresImpot)}`}
            />
          ) : null}
        </ToolSheet>
      }
      result={
        <ResultPanel
          title="Impôt sur la plus-value"
          badge={
            res ? (
              edited ? (
                <ResultBadge tone="sage">Votre calcul</ResultBadge>
              ) : (
                <ResultBadge tone="example">Exemple · 11 ans</ResultBadge>
              )
            ) : null
          }
          footer={
            res ? (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CopyButton
                  text={`Plus-value brute : ${formatEuros(res.plusValueBrute)} | Impôt total (${res.anneesDetention} ans) : ${formatEuros(res.impotTotal)} (IR : ${formatEuros(res.impotRevenu)}, PS : ${formatEuros(res.prelevementsSociaux)}${res.surtaxe.greaterThan(0) ? `, Surtaxe : ${formatEuros(res.surtaxe)}` : ""}) | Net vendeur : ${formatEuros(res.netVendeurApresImpot)}`}
                  label="Copier le décompte fiscal"
                  copiedLabel="Décompte copié"
                />
              </div>
            ) : undefined
          }
        >
          {res ? (
            <>
              <ResultFigure
                label="Impôt et prélèvements sociaux à payer"
                cents={res.impotTotalCents}
                text={formatEuros(res.impotTotal)}
                muted={res.impotTotal.isZero()}
                caption={
                  res.motifExoneration ? (
                    <>{res.motifExoneration}</>
                  ) : (
                    <>
                      Soit un produit net vendeur après impôt de{" "}
                      <strong>{formatEuros(res.netVendeurApresImpot)}</strong> sur un prix de vente de{" "}
                      {formatEuros(res.prixCession)}.
                    </>
                  )
                }
              />

              <ResultRows
                rows={[
                  {
                    label: "Prix d'acquisition corrigé",
                    detail: `${formatEuros(res.prixAcquisition)} + ${formatEuros(res.fraisAcquisitionRetenus)} (frais) + ${formatEuros(res.travauxRetenus)} (travaux)`,
                    value: formatEuros(res.prixAcquisitionCorrige),
                  },
                  {
                    label: "Plus-value brute",
                    detail: `${formatEuros(res.prixCession)} − ${formatEuros(res.prixAcquisitionCorrige)}`,
                    value: formatEuros(res.plusValueBrute),
                    strong: true,
                  },
                  {
                    label: `Plus-value imposable à l'IR (abattement ${formatPercent(res.tauxAbattementIr, 0)})`,
                    value: formatEuros(res.plusValueNetteIr),
                  },
                  {
                    label: "Impôt sur le revenu (taux forfaitaire 19 %)",
                    value: formatEuros(res.impotRevenu),
                  },
                  {
                    label: `Plus-value imposable aux PS (abattement ${formatPercent(res.tauxAbattementPs)})`,
                    value: formatEuros(res.plusValueNettePs),
                  },
                  {
                    label: "Prélèvements sociaux (17,2 %)",
                    value: formatEuros(res.prelevementsSociaux),
                  },
                  ...(res.surtaxe.greaterThan(0)
                    ? [
                        {
                          label: "Surtaxe plus-value > 50 000 € (art. 1609 nonies G)",
                          value: formatEuros(res.surtaxe),
                        },
                      ]
                    : []),
                  {
                    label: "Net vendeur après fiscalité",
                    value: formatEuros(res.netVendeurApresImpot),
                    strong: true,
                  },
                ]}
              />

              <ResultFormula>
                IR {formatEuros(res.impotRevenu)} + PS {formatEuros(res.prelevementsSociaux)}
                {res.surtaxe.greaterThan(0) ? ` + Surtaxe ${formatEuros(res.surtaxe)}` : ""} ={" "}
                {formatEuros(res.impotTotal)}
              </ResultFormula>
            </>
          ) : (
            <ResultPending>
              Indiquez les prix d&apos;achat et de revente pour calculer la plus-value imposable et les abattements pour durée de
              détention.
            </ResultPending>
          )}
        </ResultPanel>
      }
    />
  );
}
