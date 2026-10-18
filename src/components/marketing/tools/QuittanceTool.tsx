"use client";
import { trackBrowserEvent } from "@/lib/analytics/client";

import { useState } from "react";
import Decimal from "decimal.js";
import { Download, Loader2 } from "lucide-react";

import { AMOUNT_ERROR_MESSAGES, formatEuros, parseAmount } from "@/lib/tools/amount";
import {
  computeQuittanceDocument,
  daysInMonth,
  MOIS_FR,
  QUITTANCE_ERROR_MESSAGES,
  type ModePaiementQuittance,
  type QuittanceComputed,
  type StatutPaiementQuittance,
  type TypeChargesQuittance,
} from "@/lib/tools/quittance-document";
import { CopyButton } from "./CopyButton";
import {
  AmountField,
  ChoiceGroup,
  DateField,
  SelectField,
  TextField,
  ToolSheet,
  ToolStep,
  ToolWorkbench,
} from "./ToolForm";
import {
  DocumentSheet,
  ResultBadge,
  ResultJump,
  ResultPanel,
  ResultPending,
} from "./ToolResult";
import { QuittancePdfDocument, type QuittanceParties } from "@/lib/tools/quittance-pdf";

async function downloadQuittancePdf(doc: QuittanceComputed, parties: QuittanceParties) {
  const { pdf } = await import("@react-pdf/renderer");
  const blob = await pdf(<QuittancePdfDocument doc={doc} parties={parties} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = doc.filename;
  document.body.appendChild(a);
  a.click();
  trackBrowserEvent("tool_document_downloaded", window.location.pathname.split("/").pop());
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const MOIS_OPTIONS = MOIS_FR.map((label, idx) => ({
  value: String(idx + 1),
  label: label.charAt(0).toUpperCase() + label.slice(1),
}));

const ANNEE_OPTIONS = ["2024", "2025", "2026", "2027"].map((y) => ({
  value: y,
  label: y,
}));

export function QuittanceTool({ formLabel = "Générateur de quittance de loyer" }: { formLabel?: string }) {
  const [bailleurNom, setBailleurNom] = useState("Camille Moreau");
  const [bailleurAdresse, setBailleurAdresse] = useState("14 rue des Martyrs, 75009 Paris");
  const [locataireNom, setLocataireNom] = useState("Thomas Lefèvre");
  const [bienAdresse, setBienAdresse] = useState("8 rue Sedaine, 75011 Paris");

  const [mois, setMois] = useState("3");
  const [annee, setAnnee] = useState("2026");
  const [prorata, setProrata] = useState<"complet" | "prorata">("complet");
  const [jourDebut, setJourDebut] = useState("1");
  const [jourFin, setJourFin] = useState("31");

  const [loyerInput, setLoyerInput] = useState("780");
  const [chargesInput, setChargesInput] = useState("70");
  const [typeCharges, setTypeCharges] = useState<TypeChargesQuittance>("provision");

  const [statutPaiement, setStatutPaiement] = useState<StatutPaiementQuittance>("complet");
  const [montantPartielInput, setMontantPartielInput] = useState("500");
  const [datePaiement, setDatePaiement] = useState("2026-03-05");
  const [modePaiement, setModePaiement] = useState<ModePaiementQuittance>("virement");
  const [villeSignature, setVilleSignature] = useState("Paris");

  const [edited, setEdited] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const mark = <T,>(setter: (val: T) => void) => (val: T) => {
    setEdited(true);
    setter(val);
  };

  const parsedLoyer = parseAmount(loyerInput, 100_000);
  const parsedCharges = chargesInput.trim() === "" ? { ok: true as const, value: new Decimal(0) } : parseAmount(chargesInput, 50_000);
  const parsedPartiel =
    statutPaiement === "partiel" ? parseAmount(montantPartielInput, 150_000) : { ok: true as const, value: new Decimal(0) };

  const loyerError = !parsedLoyer.ok
    ? AMOUNT_ERROR_MESSAGES[parsedLoyer.error]
    : parsedLoyer.value.isZero()
      ? QUITTANCE_ERROR_MESSAGES["zero-rent"]
      : null;
  const chargesError = !parsedCharges.ok ? AMOUNT_ERROR_MESSAGES[parsedCharges.error] : null;
  const partielError =
    statutPaiement === "partiel" && !parsedPartiel.ok ? AMOUNT_ERROR_MESSAGES[parsedPartiel.error] : null;

  const moisNum = Number(mois);
  const anneeNum = Number(annee);
  const maxDays = daysInMonth(moisNum || 3, anneeNum || 2026);
  const dayOptions = Array.from({ length: maxDays }, (_, idx) => ({
    value: String(idx + 1),
    label: idx === 0 ? "1er" : String(idx + 1),
  }));

  const outcome =
    !loyerError && !chargesError && !partielError && parsedLoyer.ok && parsedCharges.ok && parsedPartiel.ok
      ? computeQuittanceDocument({
          bailleurNom,
          bailleurAdresse,
          locataireNom,
          bienAdresse,
          mois: moisNum,
          annee: anneeNum,
          prorata: prorata === "prorata",
          jourDebut: Number(jourDebut),
          jourFin: Math.min(Number(jourFin), maxDays),
          loyerMensuel: parsedLoyer.value,
          chargesMensuelles: parsedCharges.value,
          typeCharges,
          statutPaiement,
          montantVerse: statutPaiement === "partiel" ? parsedPartiel.value : undefined,
          datePaiement,
          modePaiement,
          villeSignature,
        })
      : null;

  const domainError = outcome && !outcome.ok ? QUITTANCE_ERROR_MESSAGES[outcome.error] : null;
  const doc = outcome && outcome.ok ? outcome.result : null;

  async function handleDownload() {
    if (!doc || downloading) return;
    setDownloading(true);
    try {
      await downloadQuittancePdf(doc, {
        bailleurNom,
        bailleurAdresse,
        locataireNom,
        bienAdresse,
        villeSignature,
      });
    } finally {
      setDownloading(false);
    }
  }

  return (
    <ToolWorkbench
      variant="document"
      form={
        <ToolSheet label={formLabel}>
          <ToolStep
            step={1}
            title="Bailleur, locataire et logement"
            description="Ces coordonnées figurent sur la quittance. Aucune adresse e-mail ni inscription n'est demandée."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                id="bailleur-nom"
                label="Nom et prénom du bailleur (ou SCI)"
                value={bailleurNom}
                onChange={mark(setBailleurNom)}
                placeholder="Ex. Camille Moreau"
              />
              <TextField
                id="bailleur-adresse"
                label="Adresse du bailleur"
                value={bailleurAdresse}
                onChange={mark(setBailleurAdresse)}
                placeholder="Ex. 14 rue des Martyrs, 75009 Paris"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                id="locataire-nom"
                label="Nom et prénom du locataire"
                value={locataireNom}
                onChange={mark(setLocataireNom)}
                placeholder="Ex. Thomas Lefèvre"
              />
              <TextField
                id="bien-adresse"
                label="Adresse du logement loué"
                value={bienAdresse}
                onChange={mark(setBienAdresse)}
                placeholder="Ex. 8 rue Sedaine, 75011 Paris"
              />
            </div>
          </ToolStep>

          <ToolStep
            step={2}
            title="Période et montants du loyer"
            description="L'article 21 de la loi du 6 juillet 1989 impose de distinguer le loyer nu et les provisions ou forfaits de charges."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                id="quittance-mois"
                label="Mois de l'échéance"
                value={mois}
                onChange={mark(setMois)}
                options={MOIS_OPTIONS}
              />
              <SelectField
                id="quittance-annee"
                label="Année"
                value={annee}
                onChange={mark(setAnnee)}
                options={ANNEE_OPTIONS}
              />
            </div>

            <ChoiceGroup
              name="prorata-mode"
              legend="Occupation sur le mois"
              value={prorata}
              onChange={mark(setProrata)}
              choices={[
                { value: "complet", label: "Mois complet", description: `Du 1er au ${maxDays}` },
                { value: "prorata", label: "Prorata (entrée ou sortie)", description: "Jours exacts occupés" },
              ]}
            />

            {prorata === "prorata" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  id="jour-debut"
                  label="Premier jour occupé"
                  value={jourDebut}
                  onChange={mark(setJourDebut)}
                  options={dayOptions}
                />
                <SelectField
                  id="jour-fin"
                  label="Dernier jour occupé"
                  value={String(Math.min(Number(jourFin), maxDays))}
                  onChange={mark(setJourFin)}
                  options={dayOptions}
                />
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <AmountField
                id="loyer-hc"
                label="Loyer mensuel hors charges"
                value={loyerInput}
                onChange={mark(setLoyerInput)}
                placeholder="780"
                suffix="€ / mois"
                error={loyerError}
              />
              <AmountField
                id="charges-mensuelles"
                label="Charges mensuelles"
                value={chargesInput}
                onChange={mark(setChargesInput)}
                placeholder="70"
                suffix="€ / mois"
                error={chargesError}
              />
            </div>

            <ChoiceGroup
              name="type-charges"
              legend="Nature des charges au contrat de bail"
              value={typeCharges}
              onChange={mark(setTypeCharges)}
              choices={[
                { value: "provision", label: "Provision pour charges", description: "Avec régularisation annuelle" },
                { value: "forfait", label: "Forfait de charges", description: "Logement meublé ou colocation" },
              ]}
            />
          </ToolStep>

          <ToolStep
            step={3}
            title="Règlement reçu"
            description="Si le locataire n'a réglé qu'une partie de l'échéance, l'outil établit un reçu de paiement partiel et non une quittance."
          >
            <ChoiceGroup
              name="statut-paiement"
              legend="Statut du paiement reçu"
              value={statutPaiement}
              onChange={mark(setStatutPaiement)}
              choices={[
                {
                  value: "complet",
                  label: "Paiement intégral",
                  description: "Génère une quittance de loyer",
                },
                {
                  value: "partiel",
                  label: "Paiement partiel",
                  description: "Génère un reçu avec solde restant dû",
                },
              ]}
            />

            {statutPaiement === "partiel" ? (
              <AmountField
                id="montant-partiel"
                label="Somme effectivement reçue"
                value={montantPartielInput}
                onChange={mark(setMontantPartielInput)}
                placeholder="500"
                suffix="€"
                error={partielError ?? domainError}
                hint="Le solde restant dû apparaîtra sur le reçu partiel."
              />
            ) : domainError ? (
              <p className="text-[13.5px] font-medium text-[#A1281E]">{domainError}</p>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-3">
              <DateField
                id="date-paiement"
                label="Date du règlement"
                value={datePaiement}
                onChange={mark(setDatePaiement)}
              />
              <SelectField
                id="mode-paiement"
                label="Moyen de paiement"
                value={modePaiement}
                onChange={(v) => mark(setModePaiement)(v as ModePaiementQuittance)}
                options={[
                  { value: "virement", label: "Virement bancaire" },
                  { value: "prelevement", label: "Prélèvement" },
                  { value: "cheque", label: "Chèque" },
                  { value: "especes", label: "Espèces" },
                ]}
              />
              <TextField
                id="ville-signature"
                label="Fait à (ville)"
                value={villeSignature}
                onChange={mark(setVilleSignature)}
                placeholder="Paris"
              />
            </div>
          </ToolStep>

          {doc ? (
            <ResultJump
              label={doc.documentShortLabel}
              value={formatEuros(doc.montantEncaisse)}
              detail={
                doc.isQuittance
                  ? `Quittance ${doc.periodeCourte}`
                  : `Reste dû : ${formatEuros(doc.resteDu)}`
              }
            />
          ) : null}
        </ToolSheet>
      }
      result={
        <ResultPanel
          title="Aperçu du document"
          badge={
            doc ? (
              edited ? (
                <ResultBadge tone="sage">{doc.isQuittance ? "Quittance prête" : "Reçu partiel prêt"}</ResultBadge>
              ) : (
                <ResultBadge tone="example">Exemple pré-rempli</ResultBadge>
              )
            ) : null
          }
          footer={
            doc ? (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloading}
                  className="inline-flex min-h-10 items-center gap-2 rounded-md bg-forest px-4 text-[14px] font-medium text-cream transition-colors hover:bg-forest-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest disabled:opacity-60"
                >
                  {downloading ? (
                    <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                  ) : (
                    <Download aria-hidden="true" className="size-4" />
                  )}
                  <span>
                    {downloading
                      ? "Génération du PDF…"
                      : doc.isQuittance
                        ? "Télécharger la quittance PDF"
                        : "Télécharger le reçu PDF"}
                  </span>
                </button>
                <CopyButton
                  text={doc.plainText}
                  label="Copier le texte"
                  copiedLabel="Texte copié"
                  variant="quiet"
                />
              </div>
            ) : undefined
          }
        >
          {doc ? (
            <DocumentSheet>
              <div className="border-b border-line pb-3">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-forest">
                  {doc.documentTitle}
                </p>
                <p className="mt-1 text-[13px] text-ink-muted">Période : {doc.periodeLabel}</p>
              </div>

              <div className="mt-3.5 grid gap-2.5 text-[12.5px] sm:grid-cols-2">
                <div className="rounded-lg bg-cream/60 p-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">Bailleur</p>
                  <p className="mt-0.5 font-semibold text-ink">{bailleurNom || "Nom du bailleur"}</p>
                  <p className="text-ink-muted">{bailleurAdresse || "Adresse du bailleur"}</p>
                </div>
                <div className="rounded-lg bg-cream/60 p-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">Locataire & bien</p>
                  <p className="mt-0.5 font-semibold text-ink">{locataireNom || "Nom du locataire"}</p>
                  <p className="text-ink-muted">{bienAdresse || "Adresse du logement"}</p>
                </div>
              </div>

              <p className="mt-3.5 text-[13px] leading-5 text-ink">{doc.attestationParagraph}</p>

              <dl className="mt-4 divide-y divide-line-soft rounded-lg border border-line-soft text-[13px]">
                <div className="flex justify-between px-3 py-2">
                  <dt className="text-ink-muted">Loyer nu (hors charges)</dt>
                  <dd className="font-medium tabular-nums text-ink">{formatEuros(doc.loyerAppele)}</dd>
                </div>
                <div className="flex justify-between px-3 py-2">
                  <dt className="text-ink-muted">{doc.chargesLabel}</dt>
                  <dd className="font-medium tabular-nums text-ink">{formatEuros(doc.chargesAppelees)}</dd>
                </div>
                <div className="flex justify-between px-3 py-2">
                  <dt className="text-ink-muted">Total appelé</dt>
                  <dd className="font-semibold tabular-nums text-ink">{formatEuros(doc.totalAppele)}</dd>
                </div>
                <div className="flex justify-between bg-sage-50 px-3 py-2.5 font-semibold text-forest-deep">
                  <dt>Reçu le {doc.datePaiementFr}</dt>
                  <dd className="tabular-nums">{formatEuros(doc.montantEncaisse)}</dd>
                </div>
                {!doc.isQuittance ? (
                  <div className="flex justify-between bg-[#FBF3E2] px-3 py-2 font-semibold text-[#7A5512]">
                    <dt>Solde restant dû</dt>
                    <dd className="tabular-nums">{formatEuros(doc.resteDu)}</dd>
                  </div>
                ) : null}
              </dl>

              <div className="mt-3.5 flex items-baseline justify-between text-[12px] text-ink-muted">
                <span>
                  Fait à {villeSignature || "Paris"}, le {doc.datePaiementFr}
                </span>
                <span className="font-medium text-ink">Signature : {bailleurNom || "Le bailleur"}</span>
              </div>

              <p className="mt-3 border-t border-line-soft pt-2.5 text-[11.5px] leading-4 text-ink-muted">
                {doc.reserveLegaleParagraph}
              </p>
            </DocumentSheet>
          ) : (
            <ResultPending>
              Complétez ou corrigez les montants indiqués en rouge pour afficher l&apos;aperçu de la quittance et
              télécharger le PDF.
            </ResultPending>
          )}
        </ResultPanel>
      }
    />
  );
}
