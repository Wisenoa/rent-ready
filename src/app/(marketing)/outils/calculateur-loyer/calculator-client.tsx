"use client";

import { useState } from "react";
import Decimal from "decimal.js";

import { AMOUNT_ERROR_MESSAGES, formatEuros, parseAmount } from "@/lib/tools/amount";
import {
  computeLoyerM2,
  computeProrataLoyer,
  LOYER_M2_ERROR_MESSAGES,
  PRORATA_LOYER_ERROR_MESSAGES,
  type ConventionProrata,
} from "@/lib/tools/loyer-prorata";
import { CopyButton } from "@/components/marketing/tools/CopyButton";
import {
  AmountField,
  ChoiceGroup,
  DateField,
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

type ModeCalculLoyer = "prorata" | "m2-encadrement";

export function LoyerCalculatorClient() {
  const [mode, setMode] = useState<ModeCalculLoyer>("prorata");
  const [edited, setEdited] = useState(false);

  // Mode 1 : Prorata temporis
  const [prorataLoyerHcInput, setProrataLoyerHcInput] = useState("840");
  const [prorataChargesInput, setProrataChargesInput] = useState("60");
  const [dateDebut, setDateDebut] = useState("2026-03-12");
  const [dateFin, setDateFin] = useState("2026-03-31");
  const [convention, setConvention] = useState<ConventionProrata>("jours-reels");

  // Mode 2 : Loyer au m² & encadrement
  const [surfaceInput, setSurfaceInput] = useState("45");
  const [prixM2Input, setPrixM2Input] = useState("19,50");
  const [m2ChargesInput, setM2ChargesInput] = useState("65");
  const [loyerRefM2Input, setLoyerRefM2Input] = useState("17,20");

  const mark = <T,>(setter: (val: T) => void) => (val: T) => {
    setEdited(true);
    setter(val);
  };

  // Validation Mode Prorata
  const pProLoyer = parseAmount(prorataLoyerHcInput, 100_000);
  const pProCharges =
    prorataChargesInput.trim() === ""
      ? { ok: true as const, value: new Decimal(0) }
      : parseAmount(prorataChargesInput, 50_000);

  const proLoyerErr = !pProLoyer.ok
    ? AMOUNT_ERROR_MESSAGES[pProLoyer.error]
    : pProLoyer.value.isZero()
      ? PRORATA_LOYER_ERROR_MESSAGES["zero-rent"]
      : null;
  const proChargesErr = !pProCharges.ok ? AMOUNT_ERROR_MESSAGES[pProCharges.error] : null;

  const prorataOutcome =
    !proLoyerErr && !proChargesErr && pProLoyer.ok && pProCharges.ok
      ? computeProrataLoyer({
          loyerMensuelHc: pProLoyer.value,
          chargesMensuelles: pProCharges.value,
          dateDebut,
          dateFin,
          convention,
        })
      : null;

  const prorataDomainErr =
    prorataOutcome && !prorataOutcome.ok ? PRORATA_LOYER_ERROR_MESSAGES[prorataOutcome.error] : null;
  const prorataRes = prorataOutcome && prorataOutcome.ok ? prorataOutcome.result : null;

  // Validation Mode m²
  const pSurface = parseAmount(surfaceInput, 5_000);
  const pPrixM2 = parseAmount(prixM2Input, 500);
  const pM2Charges =
    m2ChargesInput.trim() === ""
      ? { ok: true as const, value: new Decimal(0) }
      : parseAmount(m2ChargesInput, 50_000);
  const pRefM2 =
    loyerRefM2Input.trim() === ""
      ? { ok: true as const, value: new Decimal(0) }
      : parseAmount(loyerRefM2Input, 500);

  const surfaceErr = !pSurface.ok
    ? AMOUNT_ERROR_MESSAGES[pSurface.error]
    : pSurface.value.isZero()
      ? LOYER_M2_ERROR_MESSAGES["zero-surface"]
      : null;
  const prixM2Err = !pPrixM2.ok
    ? AMOUNT_ERROR_MESSAGES[pPrixM2.error]
    : pPrixM2.value.isZero()
      ? LOYER_M2_ERROR_MESSAGES["zero-price-m2"]
      : null;
  const m2ChargesErr = !pM2Charges.ok ? AMOUNT_ERROR_MESSAGES[pM2Charges.error] : null;
  const refM2Err = !pRefM2.ok ? AMOUNT_ERROR_MESSAGES[pRefM2.error] : null;

  const m2Outcome =
    !surfaceErr && !prixM2Err && !m2ChargesErr && !refM2Err && pSurface.ok && pPrixM2.ok && pM2Charges.ok && pRefM2.ok
      ? computeLoyerM2({
          surfaceHabitable: pSurface.value,
          prixM2Hc: pPrixM2.value,
          chargesMensuelles: pM2Charges.value,
          loyerReferenceM2: pRefM2.value.greaterThan(0) ? pRefM2.value : null,
        })
      : null;

  const m2Res = m2Outcome && m2Outcome.ok ? m2Outcome.result : null;

  return (
    <ToolWorkbench
      form={
        <ToolSheet label="Calculateur de prorata de loyer et de loyer au m²">
          <ToolStep
            step={1}
            title="Que souhaitez-vous calculer ?"
            description="Choisissez le prorata de loyer pour une arrivée ou un départ en cours de mois, ou le calcul du loyer au m² et du plafond d'encadrement."
          >
            <ChoiceGroup
              name="mode-calcul-loyer"
              legend="Mode de calcul"
              value={mode}
              onChange={mark(setMode)}
              choices={[
                {
                  value: "prorata",
                  label: "Prorata de loyer",
                  description: "Entrée ou sortie en cours de mois",
                },
                {
                  value: "m2-encadrement",
                  label: "Loyer au m² & encadrement",
                  description: "Surface × €/m² + plafond majoré",
                },
              ]}
            />
          </ToolStep>

          {mode === "prorata" ? (
            <>
              <ToolStep
                step={2}
                title="Loyer mensuel et période occupée dans le mois"
                description="Les jours de remise des clés (état des lieux d'entrée ou de sortie) sont comptés inclusivement dans la période d'occupation."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <AmountField
                    id="prorata-loyer-hc"
                    label="Loyer mensuel hors charges"
                    value={prorataLoyerHcInput}
                    onChange={mark(setProrataLoyerHcInput)}
                    placeholder="840"
                    suffix="€ / mois"
                    error={proLoyerErr}
                  />
                  <AmountField
                    id="prorata-charges"
                    label="Provisions ou forfait de charges"
                    value={prorataChargesInput}
                    onChange={mark(setProrataChargesInput)}
                    placeholder="60"
                    suffix="€ / mois"
                    error={proChargesErr}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <DateField
                    id="prorata-date-debut"
                    label="Premier jour occupé du mois"
                    value={dateDebut}
                    onChange={mark(setDateDebut)}
                  />
                  <DateField
                    id="prorata-date-fin"
                    label="Dernier jour occupé du mois"
                    value={dateFin}
                    onChange={mark(setDateFin)}
                    error={prorataDomainErr}
                  />
                </div>
              </ToolStep>

              <ToolStep
                step={3}
                title="Convention de calcul du prorata"
                description="En droit locatif français, la méthode de référence rapporte le nombre de jours d'occupation au nombre réel de jours du mois (28, 29, 30 ou 31 jours)."
              >
                <ChoiceGroup
                  name="convention-prorata"
                  legend="Diviseur mensuel retenu"
                  value={convention}
                  onChange={mark(setConvention)}
                  choices={[
                    {
                      value: "jours-reels",
                      label: "Jours réels du mois (recommandé)",
                      description: "Divisé par 28, 29, 30 ou 31 jours",
                    },
                    {
                      value: "trentieme",
                      label: "Trentième (base 30 jours)",
                      description: "Divisé par 30 jours forfaitaires",
                    },
                  ]}
                />
              </ToolStep>

              {prorataRes ? (
                <ResultJump
                  label={`Prorata (${prorataRes.joursOccupes} j. / ${prorataRes.diviseur})`}
                  value={formatEuros(prorataRes.totalProrataCc)}
                  detail={`Loyer HC : ${formatEuros(prorataRes.loyerProrataHc)} + Charges : ${formatEuros(prorataRes.chargesProrata)}`}
                />
              ) : null}
            </>
          ) : (
            <>
              <ToolStep
                step={2}
                title="Surface habitable et loyer hors charges au m²"
                description="La surface habitable (article R. 156-1 du CCH) multiplie le prix au m² pour obtenir le loyer nu hors charges."
              >
                <div className="grid gap-4 sm:grid-cols-3">
                  <AmountField
                    id="m2-surface"
                    label="Surface habitable"
                    value={surfaceInput}
                    onChange={mark(setSurfaceInput)}
                    placeholder="45"
                    suffix="m²"
                    error={surfaceErr}
                  />
                  <AmountField
                    id="m2-prix-hc"
                    label="Loyer HC souhaité au m²"
                    value={prixM2Input}
                    onChange={mark(setPrixM2Input)}
                    placeholder="19,50"
                    suffix="€ / m²"
                    error={prixM2Err}
                  />
                  <AmountField
                    id="m2-charges"
                    label="Charges mensuelles"
                    value={m2ChargesInput}
                    onChange={mark(setM2ChargesInput)}
                    placeholder="65"
                    suffix="€ / mois"
                    error={m2ChargesErr}
                  />
                </div>

                {m2Res && m2Res.alerteSurfaceDecence ? (
                  <div className="rounded-lg border border-[#EAD7AE] bg-[#FBF3E2] px-4 py-3 text-[13.5px] leading-5 text-[#7A5512]">
                    <strong>Seuil de décence (décret n° 2002-120 du 30 janvier 2002) :</strong> un logement loué à usage de
                    résidence principale doit comporter au moins une pièce principale d&apos;une surface habitable minimale de{" "}
                    <strong>9 m²</strong> (ou un volume habitable d&apos;au moins 20 m³).
                  </div>
                ) : null}
              </ToolStep>

              <ToolStep
                step={3}
                title="Vérification de l'encadrement des loyers (optionnel)"
                description="Dans les communes soumises au plafonnement des loyers (article 140 de la loi ELAN), indiquez le loyer de référence préfectoral hors charges au m² pour calculer le plafond majoré (+20 %)."
              >
                <AmountField
                  id="m2-loyer-reference"
                  label="Loyer de référence préfectoral (hors charges)"
                  value={loyerRefM2Input}
                  onChange={mark(setLoyerRefM2Input)}
                  placeholder="17,20"
                  suffix="€ / m²"
                  error={refM2Err}
                  hint="Laissez vide si la commune n'est pas soumise au plafonnement préfectoral des loyers au m²."
                />
              </ToolStep>

              {m2Res ? (
                <ResultJump
                  label="Loyer mensuel charges comprises"
                  value={formatEuros(m2Res.loyerMensuelCc)}
                  detail={`Dont ${formatEuros(m2Res.loyerMensuelHc)} hors charges`}
                />
              ) : null}
            </>
          )}
        </ToolSheet>
      }
      result={
        mode === "prorata" ? (
          <ResultPanel
            title="Loyer au prorata temporis"
            badge={
              prorataRes ? (
                edited ? (
                  <ResultBadge tone="sage">Votre calcul</ResultBadge>
                ) : (
                  <ResultBadge tone="example">Exemple · 20 j. en mars</ResultBadge>
                )
              ) : null
            }
            footer={
              prorataRes ? (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CopyButton
                    text={`Prorata ${prorataRes.moisLabel} (${prorataRes.joursOccupes}/${prorataRes.diviseur} jours) : Loyer HC ${formatEuros(prorataRes.loyerProrataHc)} + Charges ${formatEuros(prorataRes.chargesProrata)} = Total CC ${formatEuros(prorataRes.totalProrataCc)}`}
                    label="Copier le détail du prorata"
                    copiedLabel="Prorata copié"
                  />
                </div>
              ) : undefined
            }
          >
            {prorataRes ? (
              <>
                <ResultFigure
                  label={`Total à appeler (${prorataRes.joursOccupes} jours sur ${prorataRes.diviseur})`}
                  cents={prorataRes.totalProrataCents}
                  text={formatEuros(prorataRes.totalProrataCc)}
                  caption={
                    <>
                      Pour la période du <strong>{prorataRes.dateDebutFr}</strong> au{" "}
                      <strong>{prorataRes.dateFinFr}</strong> inclus, soit{" "}
                      {formatEuros(prorataRes.differenceMensuel)} de moins qu&apos;une échéance mensuelle complète (
                      {formatEuros(prorataRes.totalMensuelCc)}).
                    </>
                  }
                />

                <ResultRows
                  rows={[
                    {
                      label: "Loyer hors charges au prorata",
                      detail: `${formatEuros(prorataRes.loyerMensuelHc)} × ${prorataRes.joursOccupes} ÷ ${prorataRes.diviseur} jours`,
                      value: formatEuros(prorataRes.loyerProrataHc),
                      strong: true,
                    },
                    {
                      label: "Charges au prorata",
                      detail: `${formatEuros(prorataRes.chargesMensuelles)} × ${prorataRes.joursOccupes} ÷ ${prorataRes.diviseur} jours`,
                      value: formatEuros(prorataRes.chargesProrata),
                    },
                    {
                      label: "Total charges comprises appelé",
                      value: formatEuros(prorataRes.totalProrataCc),
                      strong: true,
                    },
                    {
                      label: "Convention appliquée",
                      value:
                        prorataRes.convention === "jours-reels"
                          ? `Jours réels (${prorataRes.joursDansMois} j.)`
                          : "Trentième (30 j.)",
                    },
                  ]}
                />

                <ResultFormula>
                  ({formatEuros(prorataRes.loyerMensuelHc)} + {formatEuros(prorataRes.chargesMensuelles)}) ×{" "}
                  {prorataRes.joursOccupes} ÷ {prorataRes.diviseur} = {formatEuros(prorataRes.totalProrataCc)}
                </ResultFormula>
              </>
            ) : (
              <ResultPending>
                Vérifiez le loyer et choisissez deux dates situées dans le même mois calendaire pour calculer le prorata.
              </ResultPending>
            )}
          </ResultPanel>
        ) : (
          <ResultPanel
            title="Loyer mensuel & encadrement"
            badge={
              m2Res ? (
                edited ? (
                  <ResultBadge tone="sage">Votre calcul</ResultBadge>
                ) : (
                  <ResultBadge tone="example">Exemple · 45 m²</ResultBadge>
                )
              ) : null
            }
            footer={
              m2Res ? (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CopyButton
                    text={`Loyer pour ${m2Res.surfaceHabitable.toString().replace(".", ",")} m² : ${formatEuros(m2Res.loyerMensuelHc)} HC + ${formatEuros(m2Res.chargesMensuelles)} de charges = ${formatEuros(m2Res.loyerMensuelCc)} CC`}
                    label="Copier le résultat"
                    copiedLabel="Résultat copié"
                  />
                </div>
              ) : undefined
            }
          >
            {m2Res ? (
              <>
                <ResultFigure
                  label="Loyer mensuel hors charges"
                  cents={m2Res.loyerMensuelHcCents}
                  text={formatEuros(m2Res.loyerMensuelHc)}
                  caption={
                    <>
                      Soit <strong>{formatEuros(m2Res.loyerMensuelCc)}</strong> charges comprises par mois (
                      {formatEuros(m2Res.loyerAnnuelHc)} HC / an).
                    </>
                  }
                />

                <ResultRows
                  rows={[
                    {
                      label: "Loyer hors charges (loyer nu)",
                      detail: `${m2Res.surfaceHabitable.toString().replace(".", ",")} m² × ${formatEuros(m2Res.prixM2Hc)} / m²`,
                      value: formatEuros(m2Res.loyerMensuelHc),
                      strong: true,
                    },
                    {
                      label: "Provisions ou forfait de charges",
                      value: formatEuros(m2Res.chargesMensuelles),
                    },
                    {
                      label: "Loyer mensuel charges comprises (CC)",
                      value: formatEuros(m2Res.loyerMensuelCc),
                      strong: true,
                    },
                    ...(m2Res.encadrement
                      ? [
                          {
                            label: "Plafond légal (loyer de référence majoré +20 %)",
                            detail: `${formatEuros(m2Res.encadrement.loyerReferenceMajoreM2)} / m² × ${m2Res.surfaceHabitable.toString().replace(".", ",")} m²`,
                            value: formatEuros(m2Res.encadrement.plafondMensuelHc),
                          },
                          {
                            label: "Loyer de référence minoré (−30 %)",
                            detail: `${formatEuros(m2Res.encadrement.loyerReferenceMinoreM2)} / m²`,
                            value: formatEuros(m2Res.encadrement.plancherMensuelHc),
                          },
                          {
                            label: "Statut vis-à-vis du plafond préfectoral",
                            value: m2Res.encadrement.conformePlafond
                              ? "Conforme au plafond"
                              : `Dépassement de ${formatEuros(m2Res.encadrement.depassementHc)}`,
                            strong: true,
                          },
                        ]
                      : []),
                  ]}
                />

                <ResultFormula>
                  {m2Res.surfaceHabitable.toString().replace(".", ",")} m² × {formatEuros(m2Res.prixM2Hc)} ={" "}
                  {formatEuros(m2Res.loyerMensuelHc)} HC (+ {formatEuros(m2Res.chargesMensuelles)} ={" "}
                  {formatEuros(m2Res.loyerMensuelCc)} CC)
                </ResultFormula>
              </>
            ) : (
              <ResultPending>
                Indiquez la surface habitable et le loyer au m² hors charges pour calculer le loyer mensuel.
              </ResultPending>
            )}
          </ResultPanel>
        )
      }
    />
  );
}