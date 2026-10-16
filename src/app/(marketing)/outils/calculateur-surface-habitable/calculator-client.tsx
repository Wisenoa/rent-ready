"use client";

import { useState } from "react";
import Decimal from "decimal.js";
import { Plus, Trash2 } from "lucide-react";

import { AMOUNT_ERROR_MESSAGES, formatEuros, parseAmount } from "@/lib/tools/amount";
import { formatPercent } from "@/lib/tools/rendement-locatif";
import {
  computeSurfaceHabitable,
  formatM2,
  SURFACE_HABITABLE_ERROR_MESSAGES,
  type CategoriePieceSurface,
} from "@/lib/tools/surface-habitable";
import { CopyButton } from "@/components/marketing/tools/CopyButton";
import {
  AmountField,
  SelectField,
  TextField,
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

interface RoomDraft {
  id: string;
  nom: string;
  categorie: CategoriePieceSurface;
  plancherInput: string;
  sous180Input: string;
}

const INITIAL_ROOMS: RoomDraft[] = [
  { id: "piece-1", nom: "Séjour / cuisine ouverte", categorie: "habitable", plancherInput: "26,50", sous180Input: "0" },
  { id: "piece-2", nom: "Chambre sous pente", categorie: "habitable", plancherInput: "14,00", sous180Input: "2,20" },
  { id: "piece-3", nom: "Salle d'eau & entrée", categorie: "habitable", plancherInput: "6,80", sous180Input: "0" },
  { id: "piece-4", nom: "Balcon / cave", categorie: "annexe-exclue", plancherInput: "4,50", sous180Input: "0" },
];

export function SurfaceHabitableClient() {
  const [rooms, setRooms] = useState<RoomDraft[]>(INITIAL_ROOMS);
  const [surfaceBailInput, setSurfaceBailInput] = useState("48,00");
  const [loyerActuelInput, setLoyerActuelInput] = useState("860");
  const [edited, setEdited] = useState(false);

  function updateRoom(id: string, patch: Partial<RoomDraft>) {
    setEdited(true);
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function addRoom() {
    setEdited(true);
    setRooms((prev) => [
      ...prev,
      {
        id: `piece-${Date.now()}-${prev.length + 1}`,
        nom: `Pièce ${prev.length + 1}`,
        categorie: "habitable",
        plancherInput: "10",
        sous180Input: "0",
      },
    ]);
  }

  function removeRoom(id: string) {
    if (rooms.length <= 1) return;
    setEdited(true);
    setRooms((prev) => prev.filter((r) => r.id !== id));
  }

  const parsedPieces = rooms.map((r) => {
    const pPlancher = parseAmount(r.plancherInput, 2_000);
    const pSous180 =
      r.sous180Input.trim() === ""
        ? { ok: true as const, value: new Decimal(0) }
        : parseAmount(r.sous180Input, 2_000);

    const plancherErr = !pPlancher.ok ? AMOUNT_ERROR_MESSAGES[pPlancher.error] : null;
    const sous180Err = !pSous180.ok
      ? AMOUNT_ERROR_MESSAGES[pSous180.error]
      : pPlancher.ok && pSous180.value.greaterThan(pPlancher.value)
        ? SURFACE_HABITABLE_ERROR_MESSAGES["sub-180-exceeds-total"]
        : null;

    return {
      draft: r,
      plancherErr,
      sous180Err,
      pieceInput:
        pPlancher.ok && pSous180.ok
          ? {
              id: r.id,
              nom: r.nom,
              categorie: r.categorie,
              surfacePlancherM2: pPlancher.value,
              surfaceSous180M2: pSous180.value,
            }
          : null,
    };
  });
  const hasRoomParseError = parsedPieces.some((p) => Boolean(p.plancherErr || p.sous180Err));

  const pSurfaceBail =
    surfaceBailInput.trim() === ""
      ? { ok: true as const, value: new Decimal(0) }
      : parseAmount(surfaceBailInput, 2_000);
  const pLoyer =
    loyerActuelInput.trim() === ""
      ? { ok: true as const, value: new Decimal(0) }
      : parseAmount(loyerActuelInput, 100_000);

  const surfaceBailErr = !pSurfaceBail.ok ? AMOUNT_ERROR_MESSAGES[pSurfaceBail.error] : null;
  const loyerErr = !pLoyer.ok ? AMOUNT_ERROR_MESSAGES[pLoyer.error] : null;

  const outcome =
    !hasRoomParseError && !surfaceBailErr && !loyerErr && pSurfaceBail.ok && pLoyer.ok
      ? computeSurfaceHabitable({
          pieces: parsedPieces.map((p) => p.pieceInput!),
          surfaceInscriteBailM2: pSurfaceBail.value.greaterThan(0) ? pSurfaceBail.value : null,
          loyerMensuelHc: pLoyer.value.greaterThan(0) ? pLoyer.value : null,
        })
      : null;

  const res = outcome && outcome.ok ? outcome.result : null;

  return (
    <ToolWorkbench
      form={
        <ToolSheet label="Calculateur de surface habitable (loi Boutin, article R. 156-1 du CCH)">
          <ToolStep
            step={1}
            title="Relevé pièce par pièce (article R. 156-1 du CCH)"
            description="Saisissez la surface de plancher de chaque pièce et déduisez, le cas échéant, la fraction dont la hauteur sous plafond est inférieure à 1,80 mètre. Les caves, balcons, terrasses, vérandas et garages sont exclus."
          >
            <div className="space-y-4">
              {parsedPieces.map(({ draft, plancherErr, sous180Err }, index) => (
                <div
                  key={draft.id}
                  className="rounded-xl border border-line-soft bg-cream/30 p-4"
                >
                  <div className="flex items-center justify-between gap-2 pb-3">
                    <span className="text-[13px] font-semibold text-forest">
                      Espace n° {index + 1}
                    </span>
                    {rooms.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeRoom(draft.id)}
                        className="inline-flex items-center gap-1 rounded px-2 py-1 text-[12.5px] font-medium text-ink-muted hover:bg-cream hover:text-[#A1281E]"
                      >
                        <Trash2 aria-hidden="true" className="size-3.5" />
                        Supprimer
                      </button>
                    ) : null}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <TextField
                      id={`room-nom-${draft.id}`}
                      label="Nom de la pièce ou annexe"
                      value={draft.nom}
                      onChange={(v) => updateRoom(draft.id, { nom: v })}
                      placeholder="Ex. Séjour, Chambre..."
                    />
                    <SelectField
                      id={`room-cat-${draft.id}`}
                      label="Qualification réglementaire"
                      value={draft.categorie}
                      onChange={(v) =>
                        updateRoom(draft.id, { categorie: v as CategoriePieceSurface })
                      }
                      options={[
                        { value: "habitable", label: "Pièce habitable (incluse si h ≥ 1,80 m)" },
                        { value: "annexe-exclue", label: "Annexe exclue (balcon, cave, véranda, garage)" },
                      ]}
                    />
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <AmountField
                      id={`room-plancher-${draft.id}`}
                      label="Surface de plancher totale"
                      value={draft.plancherInput}
                      onChange={(v) => updateRoom(draft.id, { plancherInput: v })}
                      placeholder="15,00"
                      suffix="m²"
                      error={plancherErr}
                    />
                    {draft.categorie === "habitable" ? (
                      <AmountField
                        id={`room-sous180-${draft.id}`}
                        label="Dont partie sous 1,80 m de hauteur"
                        value={draft.sous180Input}
                        onChange={(v) => updateRoom(draft.id, { sous180Input: v })}
                        placeholder="0"
                        suffix="m²"
                        error={sous180Err}
                      />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addRoom}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line bg-white px-4 text-[14px] font-medium text-forest transition-colors hover:border-sage-300 hover:bg-sage-50/60"
            >
              <Plus aria-hidden="true" className="size-4" />
              Ajouter une pièce ou une annexe
            </button>
          </ToolStep>

          <ToolStep
            step={2}
            title="Vérification de l'écart de 5 % avec le bail (article 3-1 loi de 1989)"
            description="Si la surface habitable réelle est inférieure de plus d'un vingtième (5 %) à celle inscrite dans le bail, le locataire peut demander une diminution proportionnelle du loyer."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <AmountField
                id="surface-inscrite-bail"
                label="Surface mentionnée dans le bail (optionnel)"
                value={surfaceBailInput}
                onChange={(v) => {
                  setEdited(true);
                  setSurfaceBailInput(v);
                }}
                placeholder="48,00"
                suffix="m²"
                error={surfaceBailErr}
              />
              <AmountField
                id="surface-loyer-actuel"
                label="Loyer mensuel hors charges actuel (optionnel)"
                value={loyerActuelInput}
                onChange={(v) => {
                  setEdited(true);
                  setLoyerActuelInput(v);
                }}
                placeholder="860"
                suffix="€ / mois"
                error={loyerErr}
              />
            </div>
          </ToolStep>

          {res ? (
            <ResultJump
              label="Surface habitable (loi Boutin)"
              value={formatM2(res.surfaceHabitableTotaleM2)}
              detail={`${formatM2(res.surfaceTotaleExclueM2)} exclus (sous 1,80 m et annexes)`}
            />
          ) : null}
        </ToolSheet>
      }
      result={
        <ResultPanel
          title="Surface habitable & contrôle du bail"
          badge={
            res ? (
              edited ? (
                <ResultBadge tone="sage">Votre relevé</ResultBadge>
              ) : (
                <ResultBadge tone="example">Exemple · 4 pièces / annexes</ResultBadge>
              )
            ) : null
          }
          footer={
            res ? (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CopyButton
                  text={`Surface habitable (art. R. 156-1 CCH) : ${formatM2(res.surfaceHabitableTotaleM2)} (plancher total : ${formatM2(res.surfaceTotalePlancherM2)}, surfaces exclues : ${formatM2(res.surfaceTotaleExclueM2)}).`}
                  label="Copier le mesurage"
                  copiedLabel="Mesurage copié"
                />
              </div>
            ) : undefined
          }
        >
          {res ? (
            <>
              <ResultFigure
                label="Surface habitable totale à inscrire au bail"
                text={formatM2(res.surfaceHabitableTotaleM2)}
                caption={
                  <>
                    Après déduction de <strong>{formatM2(res.surfaceTotaleExclueM2)}</strong> de surfaces exclues (parties
                    d&apos;une hauteur &lt; 1,80 m et annexes) sur {formatM2(res.surfaceTotalePlancherM2)} au sol.
                  </>
                }
              />

              {res.inferieureSeuilDecence9M2 ? (
                <div className="mt-4 rounded-lg border border-[#EAD7AE] bg-[#FBF3E2] px-3.5 py-2.5 text-[13px] leading-5 text-[#7A5512]">
                  <strong>Attention (décret n° 2002-120 du 30 janvier 2002) :</strong> une surface habitable inférieure à{" "}
                  <strong>9 m²</strong> ne respecte pas le critère de décence d&apos;une résidence principale (sauf si le volume
                  habitable atteint au moins 20 m³).
                </div>
              ) : null}

              <ResultRows
                rows={[
                  ...res.piecesDetail.map((p) => ({
                    label: p.nom,
                    detail:
                      p.categorie === "annexe-exclue"
                        ? `Annexe exclue (${formatM2(p.surfacePlancherM2)})`
                        : p.surfaceExclueM2.greaterThan(0)
                          ? `${formatM2(p.surfacePlancherM2)} − ${formatM2(p.surfaceExclueM2)} (< 1,80 m)`
                          : "Hauteur ≥ 1,80 m",
                    value: formatM2(p.surfaceHabitableRetenueM2),
                  })),
                  {
                    label: "Surface habitable retenue (loi Boutin)",
                    value: formatM2(res.surfaceHabitableTotaleM2),
                    strong: true,
                  },
                  ...(res.verificationBail
                    ? [
                        {
                          label: `Écart avec le bail (${formatM2(res.verificationBail.surfaceBailM2)})`,
                          detail: "Seuil légal d'action en réduction de loyer : > 5 % (art. 3-1)",
                          value: `${formatM2(res.verificationBail.ecartM2)} (${formatPercent(res.verificationBail.ecartPourcent)})`,
                        },
                        {
                          label: "Droit à diminution proportionnelle du loyer",
                          value: res.verificationBail.depasseSeuilCinqPourcent
                            ? res.verificationBail.loyerReduitProportionnelHc
                              ? `Oui → loyer ramené à ${formatEuros(res.verificationBail.loyerReduitProportionnelHc)} (−${formatEuros(res.verificationBail.baisseMensuelleHc!)})`
                              : "Oui (écart > 5 %)"
                            : "Non (écart ≤ 5 %)",
                          strong: true,
                        },
                      ]
                    : []),
                ]}
              />

              <ResultFormula>
                {formatM2(res.surfaceTotalePlancherM2)} (plancher) − {formatM2(res.surfaceTotaleExclueM2)} (exclus) ={" "}
                {formatM2(res.surfaceHabitableTotaleM2)}
              </ResultFormula>
            </>
          ) : (
            <ResultPending>
              Corrigez les surfaces indiquées en rouge pour calculer la surface habitable totale selon l&apos;article R. 156-1
              du CCH.
            </ResultPending>
          )}
        </ResultPanel>
      }
    />
  );
}
