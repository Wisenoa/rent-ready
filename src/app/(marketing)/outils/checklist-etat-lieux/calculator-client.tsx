"use client";

import { useState } from "react";

import {
  computeSyntheseEtatDesLieux,
  ETAT_ELEMENT_LABELS,
  POSTES_ETAT_DES_LIEUX,
  type EtatElement,
  type TypeEtatDesLieux,
} from "@/lib/tools/etat-des-lieux";
import { CopyButton } from "@/components/marketing/tools/CopyButton";
import {
  ChoiceGroup,
  DateField,
  SelectField,
  TextField,
  ToolSheet,
  ToolStep,
  ToolWorkbench,
} from "@/components/marketing/tools/ToolForm";
import {
  DocumentSheet,
  ResultBadge,
  ResultJump,
  ResultPanel,
} from "@/components/marketing/tools/ToolResult";

const ETAT_OPTIONS = (Object.keys(ETAT_ELEMENT_LABELS) as EtatElement[]).map((k) => ({
  value: k,
  label: ETAT_ELEMENT_LABELS[k],
}));

const INITIAL_ETATS: Record<string, EtatElement> = {
  "compteur-elec": "bon",
  "compteur-eau": "bon",
  "compteur-gaz": "bon",
  "daaf-securite": "bon",
  "cles-acces": "bon",
  "entree-sejour-sols-murs": "bon",
  "entree-sejour-menuiseries": "bon",
  "cuisine-equipements": "usage",
  chambres: "bon",
  "sanitaires-sdb": "usage",
};

export function ChecklistEDLClient() {
  const [typeEdl, setTypeEdl] = useState<TypeEtatDesLieux>("entree");
  const [dateEdl, setDateEdl] = useState("2026-04-01");
  const [bienAdresse, setBienAdresse] = useState("12 rue Oberkampf, 75011 Paris");
  const [locataireNom, setLocataireNom] = useState("Claire Fontaine");

  const [indexElectricite, setIndexElectricite] = useState("HP 14 280 kWh / HC 9 410 kWh");
  const [indexEauFroide, setIndexEauFroide] = useState("312 m³");
  const [indexGaz, setIndexGaz] = useState("Non applicable (tout électrique)");
  const [nombreCles, setNombreCles] = useState("2 clés porte palière, 1 badge Vigik, 1 clé boîte aux lettres");

  const [etats, setEtats] = useState<Record<string, EtatElement>>(INITIAL_ETATS);
  const [observations, setObservations] = useState(
    "Légère trace d'usage sur le plan de travail de la cuisine ; détecteur de fumée testé fonctionnel."
  );
  const [edited, setEdited] = useState(false);

  const mark = <T,>(setter: (val: T) => void) => (val: T) => {
    setEdited(true);
    setter(val);
  };

  function updatePosteEtat(id: string, value: EtatElement) {
    setEdited(true);
    setEtats((prev) => ({ ...prev, [id]: value }));
  }

  const synthese = computeSyntheseEtatDesLieux({
    typeEdl,
    dateEdl,
    bienAdresse,
    locataireNom,
    indexElectricite,
    indexEauFroide,
    indexGaz,
    nombreCles,
    etats,
    observations,
  });

  return (
    <ToolWorkbench
      variant="document"
      form={
        <ToolSheet label="Checklist interactive d'état des lieux (décret du 30 mars 2016)">
          <ToolStep
            step={1}
            title="Nature de l'état des lieux et identification"
            description="L'état des lieux contradictoire est établi gratuitement entre le bailleur et le locataire lors de la remise et de la restitution des clés (article 3-2 de la loi du 6 juillet 1989)."
          >
            <ChoiceGroup
              name="type-edl"
              legend="Moment de l'état des lieux"
              value={typeEdl}
              onChange={mark(setTypeEdl)}
              choices={[
                {
                  value: "entree",
                  label: "État des lieux d'entrée",
                  description: "Rectifiable sous 10 jours (+ 1er mois de chauffe)",
                },
                {
                  value: "sortie",
                  label: "État des lieux de sortie",
                  description: "Distinction dégradations vs vétusté normale",
                },
              ]}
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <DateField
                id="edl-date"
                label="Date du constat"
                value={dateEdl}
                onChange={mark(setDateEdl)}
              />
              <TextField
                id="edl-locataire"
                label="Nom du locataire"
                value={locataireNom}
                onChange={mark(setLocataireNom)}
                placeholder="Ex. Claire Fontaine"
              />
              <TextField
                id="edl-adresse"
                label="Adresse du logement"
                value={bienAdresse}
                onChange={mark(setBienAdresse)}
                placeholder="Ex. 12 rue Oberkampf, 75011 Paris"
              />
            </div>
          </ToolStep>

          <ToolStep
            step={2}
            title="Relevés des compteurs et inventaire des clés"
            description="Mentions obligatoires imposées par l'article 2 du décret n° 2016-382 du 30 mars 2016."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                id="edl-index-elec"
                label="Index électricité (HP / HC et n° PDL)"
                value={indexElectricite}
                onChange={mark(setIndexElectricite)}
                placeholder="Ex. HP 14 280 kWh / HC 9 410 kWh"
              />
              <TextField
                id="edl-index-eau"
                label="Index compteur d'eau froide (et chaude)"
                value={indexEauFroide}
                onChange={mark(setIndexEauFroide)}
                placeholder="Ex. 312 m³"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                id="edl-index-gaz"
                label="Index gaz (et n° PCE) ou chauffage"
                value={indexGaz}
                onChange={mark(setIndexGaz)}
                placeholder="Ex. 1 420 m³ ou Tout électrique"
              />
              <TextField
                id="edl-cles"
                label="Détail des clés, badges et télécommandes"
                value={nombreCles}
                onChange={mark(setNombreCles)}
                placeholder="Ex. 2 clés porte palière, 1 badge Vigik"
              />
            </div>
          </ToolStep>

          <ToolStep
            step={3}
            title="Inspection pièce par pièce"
            description="Qualifiez l'état de chaque poste pour générer votre relevé contradictoire."
          >
            <div className="space-y-4">
              {POSTES_ETAT_DES_LIEUX.map((poste) => (
                <div
                  key={poste.id}
                  className="rounded-xl border border-line-soft bg-cream/30 p-3.5 sm:p-4"
                >
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-forest">
                    {poste.piece}
                  </p>
                  <SelectField
                    id={`edl-poste-${poste.id}`}
                    label={poste.intitule}
                    value={etats[poste.id] ?? "non-verifie"}
                    onChange={(v) => updatePosteEtat(poste.id, v as EtatElement)}
                    options={ETAT_OPTIONS}
                    hint={poste.detailObligatoire}
                  />
                </div>
              ))}
            </div>

            <TextField
              id="edl-observations"
              label="Observations complémentaires ou réserves précises"
              value={observations}
              onChange={mark(setObservations)}
              placeholder="Notez toute observation utile (rayure localisée, joint à remplacer...)"
            />
          </ToolStep>

          <ResultJump
            label={`Points vérifiés : ${synthese.nbVerifies} / ${synthese.totalPostes}`}
            value={`${synthese.nbBonEtat} bon état · ${synthese.nbDegradations} anomalie(s)`}
            detail={`État des lieux ${synthese.typeEdl === "entree" ? "d'entrée" : "de sortie"}`}
          />
        </ToolSheet>
      }
      result={
        <ResultPanel
          title="Synthèse de l'état des lieux"
          badge={
            edited ? (
              <ResultBadge tone="sage">
                {synthese.nbVerifies}/{synthese.totalPostes} contrôlés
              </ResultBadge>
            ) : (
              <ResultBadge tone="example">Exemple pré-rempli</ResultBadge>
            )
          }
          footer={
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CopyButton
                  text={synthese.plainText}
                  label="Copier le relevé complet"
                  copiedLabel="Relevé copié"
                />
                <span className="text-[12.5px] font-medium text-ink-muted">
                  {synthese.nbDegradations === 0
                    ? "Aucune dégradation signalée"
                    : `${synthese.nbDegradations} anomalie(s) relevée(s)`}
                </span>
              </div>
              <p className="text-[12px] leading-4.5 text-ink-muted">{synthese.rappelLegal}</p>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2 text-center text-[12.5px]">
              <div className="rounded-lg border border-line-soft bg-sage-50/70 px-2 py-2.5">
                <p className="text-[1.2rem] font-semibold tabular-nums text-forest-deep">{synthese.nbBonEtat}</p>
                <p className="text-ink-muted">Bon état</p>
              </div>
              <div className="rounded-lg border border-line-soft bg-paper px-2 py-2.5">
                <p className="text-[1.2rem] font-semibold tabular-nums text-ink">{synthese.nbUsureNormale}</p>
                <p className="text-ink-muted">Usure normale</p>
              </div>
              <div className="rounded-lg border border-line-soft bg-[#FBF3E2] px-2 py-2.5">
                <p className="text-[1.2rem] font-semibold tabular-nums text-[#7A5512]">{synthese.nbDegradations}</p>
                <p className="text-[#7A5512]">Anomalie(s)</p>
              </div>
            </div>

            <DocumentSheet>
              <div className="border-b border-line pb-2.5">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-forest">
                  État des lieux {synthese.typeEdl === "entree" ? "d'entrée" : "de sortie"} · {synthese.dateEdlFr}
                </p>
                <p className="mt-0.5 text-[12.5px] text-ink-muted">
                  {locataireNom || "Locataire"} — {bienAdresse || "Adresse du logement"}
                </p>
              </div>

              <dl className="mt-3 space-y-1.5 border-b border-line-soft pb-3 text-[12.5px]">
                <div className="flex justify-between gap-2">
                  <dt className="text-ink-muted">Électricité</dt>
                  <dd className="text-right font-medium text-ink">{indexElectricite || "—"}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-ink-muted">Eau froide</dt>
                  <dd className="text-right font-medium text-ink">{indexEauFroide || "—"}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-ink-muted">Gaz / chauffage</dt>
                  <dd className="text-right font-medium text-ink">{indexGaz || "—"}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-ink-muted">Clés remises</dt>
                  <dd className="text-right font-medium text-ink">{nombreCles || "—"}</dd>
                </div>
              </dl>

              <ul className="mt-3 divide-y divide-line-soft text-[12.5px]">
                {POSTES_ETAT_DES_LIEUX.map((poste) => {
                  const etat = etats[poste.id] ?? "non-verifie";
                  return (
                    <li key={poste.id} className="flex items-baseline justify-between gap-3 py-1.5">
                      <span className="text-ink">{poste.intitule}</span>
                      <span
                        className={`shrink-0 font-medium ${
                          etat === "degradation"
                            ? "text-[#A1281E]"
                            : etat === "bon"
                              ? "text-forest"
                              : "text-ink-muted"
                        }`}
                      >
                        {ETAT_ELEMENT_LABELS[etat]}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {observations.trim() ? (
                <p className="mt-3 rounded-lg bg-cream/60 p-2.5 text-[12px] leading-5 text-ink">
                  <strong>Observations :</strong> {observations}
                </p>
              ) : null}
            </DocumentSheet>
          </div>
        </ResultPanel>
      }
    />
  );
}