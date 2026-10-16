"use client";

import { useState } from "react";
import Decimal from "decimal.js";

import { AMOUNT_ERROR_MESSAGES, formatEuros, parseAmount } from "@/lib/tools/amount";
import {
  computeLettreRelance,
  LETTRE_RELANCE_ERROR_MESSAGES,
  type TonRelance,
} from "@/lib/tools/lettre-relance";
import { CopyButton } from "@/components/marketing/tools/CopyButton";
import {
  AmountField,
  ChoiceGroup,
  DateField,
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
  ResultPending,
} from "@/components/marketing/tools/ToolResult";

export function LettreRelanceClient() {
  const [ton, setTon] = useState<TonRelance>("amiable");
  const [bailleurNom, setBailleurNom] = useState("Jean-Marc Dupuis");
  const [bailleurAdresse, setBailleurAdresse] = useState("22 avenue Jean Jaurès, 69007 Lyon");
  const [locataireNom, setLocataireNom] = useState("Sophie Garnier");
  const [bienAdresse, setBienAdresse] = useState("5 rue de la Part-Dieu, 69003 Lyon");

  const [periodeImpayee, setPeriodeImpayee] = useState("mars 2026");
  const [dateEcheance, setDateEcheance] = useState("2026-03-05");
  const [dateCourrier, setDateCourrier] = useState("2026-03-14");
  const [villeCourrier, setVilleCourrier] = useState("Lyon");

  const [loyerInput, setLoyerInput] = useState("740");
  const [chargesInput, setChargesInput] = useState("60");
  const [dejaVerseInput, setDejaVerseInput] = useState("0");
  const [edited, setEdited] = useState(false);

  const mark = <T,>(setter: (val: T) => void) => (val: T) => {
    setEdited(true);
    setter(val);
  };

  const parsedLoyer = parseAmount(loyerInput, 100_000);
  const parsedCharges = chargesInput.trim() === "" ? { ok: true as const, value: new Decimal(0) } : parseAmount(chargesInput, 50_000);
  const parsedDejaVerse =
    dejaVerseInput.trim() === "" ? { ok: true as const, value: new Decimal(0) } : parseAmount(dejaVerseInput, 150_000);

  const loyerError = !parsedLoyer.ok ? AMOUNT_ERROR_MESSAGES[parsedLoyer.error] : null;
  const chargesError = !parsedCharges.ok ? AMOUNT_ERROR_MESSAGES[parsedCharges.error] : null;
  const dejaVerseError = !parsedDejaVerse.ok ? AMOUNT_ERROR_MESSAGES[parsedDejaVerse.error] : null;

  const outcome =
    !loyerError && !chargesError && !dejaVerseError && parsedLoyer.ok && parsedCharges.ok && parsedDejaVerse.ok
      ? computeLettreRelance({
          ton,
          bailleurNom,
          bailleurAdresse,
          locataireNom,
          bienAdresse,
          periodeImpayee,
          dateEcheance,
          dateCourrier,
          villeCourrier,
          loyerHorsCharges: parsedLoyer.value,
          charges: parsedCharges.value,
          montantDejaVerse: parsedDejaVerse.value,
        })
      : null;

  const domainError = outcome && !outcome.ok ? LETTRE_RELANCE_ERROR_MESSAGES[outcome.error] : null;
  const letter = outcome && outcome.ok ? outcome.result : null;

  return (
    <ToolWorkbench
      variant="document"
      form={
        <ToolSheet label="Générateur de lettre de relance de loyer impayé">
          <ToolStep
            step={1}
            title="Niveau de relance"
            description="Commencez par un rappel courtois dès 5 à 10 jours de retard, puis passez à la mise en demeure en LRAR si l'impayé persiste."
          >
            <ChoiceGroup
              name="ton-relance"
              legend="Type de courrier à générer"
              value={ton}
              onChange={mark(setTon)}
              choices={[
                {
                  value: "amiable",
                  label: "1. Relance amiable",
                  description: "Rappel courtois par courrier simple ou e-mail",
                },
                {
                  value: "mise-en-demeure",
                  label: "2. Mise en demeure (LRAR)",
                  description: "Délai formel de 8 jours avant commissaire de justice",
                },
              ]}
            />
          </ToolStep>

          <ToolStep
            step={2}
            title="Décompte de l'échéance impayée"
            description="Le courrier distingue le loyer hors charges, les provisions sur charges et un éventuel versement partiel."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                id="periode-impayee"
                label="Période concernée"
                value={periodeImpayee}
                onChange={mark(setPeriodeImpayee)}
                placeholder="Ex. mars 2026"
              />
              <DateField
                id="date-echeance"
                label="Date d'exigibilité prévue au bail"
                value={dateEcheance}
                onChange={mark(setDateEcheance)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <AmountField
                id="relance-loyer"
                label="Loyer hors charges"
                value={loyerInput}
                onChange={mark(setLoyerInput)}
                placeholder="740"
                suffix="€"
                error={loyerError}
              />
              <AmountField
                id="relance-charges"
                label="Charges appelées"
                value={chargesInput}
                onChange={mark(setChargesInput)}
                placeholder="60"
                suffix="€"
                error={chargesError}
              />
              <AmountField
                id="relance-deja-verse"
                label="Déjà versé (si partiel)"
                value={dejaVerseInput}
                onChange={mark(setDejaVerseInput)}
                placeholder="0"
                suffix="€"
                error={dejaVerseError ?? domainError}
              />
            </div>
          </ToolStep>

          <ToolStep
            step={3}
            title="Coordonnées du bailleur et du locataire"
            description="Ces informations remplissent l'en-tête et le corps du courrier en temps réel."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                id="relance-bailleur-nom"
                label="Nom et prénom du bailleur"
                value={bailleurNom}
                onChange={mark(setBailleurNom)}
                placeholder="Ex. Jean-Marc Dupuis"
              />
              <TextField
                id="relance-bailleur-adresse"
                label="Adresse du bailleur"
                value={bailleurAdresse}
                onChange={mark(setBailleurAdresse)}
                placeholder="Ex. 22 avenue Jean Jaurès, 69007 Lyon"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                id="relance-locataire-nom"
                label="Nom et prénom du locataire"
                value={locataireNom}
                onChange={mark(setLocataireNom)}
                placeholder="Ex. Sophie Garnier"
              />
              <TextField
                id="relance-bien-adresse"
                label="Adresse du logement loué"
                value={bienAdresse}
                onChange={mark(setBienAdresse)}
                placeholder="Ex. 5 rue de la Part-Dieu, 69003 Lyon"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                id="relance-ville"
                label="Fait à (ville)"
                value={villeCourrier}
                onChange={mark(setVilleCourrier)}
                placeholder="Lyon"
              />
              <DateField
                id="relance-date-courrier"
                label="Date du courrier"
                value={dateCourrier}
                onChange={mark(setDateCourrier)}
              />
            </div>
          </ToolStep>

          {letter ? (
            <ResultJump
              label={letter.ton === "amiable" ? "Relance amiable" : "Mise en demeure LRAR"}
              value={formatEuros(letter.resteDu)}
              detail={`Solde réclamé · ${periodeImpayee || "échéance"}`}
            />
          ) : null}
        </ToolSheet>
      }
      result={
        <ResultPanel
          title="Courrier prêt à copier"
          badge={
            letter ? (
              edited ? (
                <ResultBadge tone="sage">Votre courrier</ResultBadge>
              ) : (
                <ResultBadge tone="example">Exemple pré-rempli</ResultBadge>
              )
            ) : null
          }
          footer={
            letter ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CopyButton
                    text={letter.plainText}
                    label="Copier le courrier complet"
                    copiedLabel="Courrier copié"
                  />
                  <span className="text-[12.5px] font-medium text-ink-muted">
                    Solde réclamé : <strong className="tabular-nums text-ink">{formatEuros(letter.resteDu)}</strong>
                  </span>
                </div>
                <p className="text-[12.5px] leading-5 text-ink-muted">{letter.prochaineEtape}</p>
              </div>
            ) : undefined
          }
        >
          {letter ? (
            <DocumentSheet>
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-3 text-[12.5px]">
                <div>
                  <p className="font-semibold text-ink">{bailleurNom || "Nom du bailleur"}</p>
                  <p className="text-ink-muted">{bailleurAdresse || "Adresse du bailleur"}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-ink">À {locataireNom || "Nom du locataire"}</p>
                  <p className="text-ink-muted">{bienAdresse || "Adresse du logement"}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2 text-[12px] text-ink-muted">
                <span className="font-medium text-forest">{letter.modeEnvoiLabel}</span>
                <span>
                  À {villeCourrier || "Lyon"}, le {letter.dateCourrierFr}
                </span>
              </div>

              <p className="mt-3 rounded-lg bg-cream/70 px-3 py-2 text-[13px] font-semibold text-ink">
                {letter.objet}
              </p>

              <div className="mt-3.5 space-y-2.5 text-[13px] leading-5.5 text-ink">
                {letter.paragraphs.map((p, index) => (
                  <p key={index}>{p}</p>
                ))}
              </div>

              <p className="mt-4 text-right text-[13px] font-semibold text-ink">
                {bailleurNom || "Signature du bailleur"}
              </p>
            </DocumentSheet>
          ) : (
            <ResultPending>
              Vérifiez les montants saisis pour afficher le courrier de relance et son décompte exact.
            </ResultPending>
          )}
        </ResultPanel>
      }
    />
  );
}
