"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

const templates = {
  premier_rappel: {
    title: "Premier rappel (amiable)",
    subject: "Rappel — Loyer impayé de {mois}",
    body: `Le {date_envoi},

{proprietaire_nom}
{proprietaire_adresse}

À l'attention de {locataire_nom}
{locataire_adresse}

Objet: Rappel — Loyer impayé de {mois}

Madame, Monsieur,

Je constate que le loyer de {mois}, d'un montant de {montant} €, n'a pas été réglé à ce jour.

Je vous rappelle que le paiement du loyer doit être effectué à la date prévue dans le bail, conformément à vos obligations locatives.

Vous trouverez ci-joint les coordonnées bancaires pour effectuer le paiement:
IBAN: {iban}

Je vous prie de bien vouloir régulariser cette situation dans les meilleurs délais.

Je reste à votre disposition pour toute question et vous prie d'agréer, Madame, Monsieur, mes salutations distinguées.

{proprietaire_nom}`,
  },
  seconde_relance: {
    title: "Seconde relance (formelle)",
    subject: "Relance — Loyer impayé — Délai de régularisation",
    body: `Le {date_envoi},

{proprietaire_nom}
{proprietaire_adresse}

À l'attention de {locataire_nom}
{locataire_adresse}

Objet: Relance — Loyer impayé — Délai de régularisation

Madame, Monsieur,

Par la présente, je vous rappelle que le loyer de {mois}, d'un montant de {montant} €, demeure impayé à ce jour, soit {jours_retard} jours après la date d'échéance.

Malgré mon premier rappel du {date_premier_rappel}, aucune régularisation n'a été effectuée.

Conformément aux dispositions de la loi du 6 juillet 1989, je vous demande de régler la somme de {montant_total} € (loyer de {montant} € {+ pénalités si applicables}) dans un délai de 8 jours à compter de la réception de ce courrier.

À défaut de paiement dans ce délai, je serai contraint(e) d'engager la procédure de recouvrement prévue par la loi, avec toutes les conséquences que cela implique.

Coordonnées bancaires pour le paiement:
IBAN: {iban}

Je reste à votre disposition.

{proprietaire_nom}`,
  },
  mise_en_demeure: {
    title: "Mise en demeure (LRAR)",
    subject: "MISE EN DEMEURE — Loyer impayé — Procédure",
    body: `LETTRE RECOMMANDÉE AVEC ACCUSÉ DE RÉCEPTION

Le {date_envoi},

{proprietaire_nom}
{proprietaire_adresse}

À l'attention de {locataire_nom}
{locataire_adresse}

Objet: MISE EN DEMEURE — Loyer impayé — Procédure

Madame, Monsieur,

Je vous mets en demeure de me régler les sommes suivantes dues au titre de la location située {adresse_bien}:

- Loyer(s) impayé(s): {mois}
- Montant total dû: {montant_total} €
- Pénalités de retard: {penalites} €
- TOTAL À RÉGLER: {total_general} €

Ce courrier constitue une mise en demeure au sens des articles 1344 et suivants du Code civil.

Conformément à l'article 24 de la loi n°89-462 du 6 juillet 1989, je vous demande de régulariser cette situation dans un délai de DEUX MOIS à compter de la réception de la présente.

Passé ce délai, et sans régularisation de votre part, je me réserve le droit de saisir le tribunal judiciaire compétent pour obtenir la résiliation du bail et votre expulsion, ainsi que la condamnation au paiement des sommes dues avec intérêts et frais de procédure.

Je vous informe également que cet impayé pourra faire l'objet d'une inscription au fichier national des impayés de loyers.

Coordonnées bancaires pour le paiement:
IBAN: {iban}

Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées.

{proprietaire_nom}

Accusé de réception à conserver`,
  },
};

export function FollowUpLetterTemplate() {
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof templates>("premier_rappel");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(templates[selectedTemplate].body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="mb-16">
      <div className="mb-6">
        <label className="mb-3 block text-sm font-medium text-stone-700">
          Choisissez le type de lettre
        </label>
        <div className="grid gap-3 sm:grid-cols-3">
          {(Object.keys(templates) as Array<keyof typeof templates>).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedTemplate(key)}
              className={`rounded-lg border-2 p-3 text-left text-sm transition-all ${
                selectedTemplate === key
                  ? "border-blue-600 bg-blue-50 text-blue-900"
                  : "border-stone-200 bg-white text-stone-700 hover:border-stone-300"
              }`}
            >
              <span className="block font-medium">{templates[key].title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-stone-200/60 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-stone-800">
            {templates[selectedTemplate].title}
          </h3>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-lg bg-stone-100 px-3 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-200"
          >
            {copied ? (
              <>
                <Check className="size-4" />
                Copié!
              </>
            ) : (
              <>
                <Copy className="size-4" />
                Copier
              </>
            )}
          </button>
        </div>

        <div className="rounded-lg bg-stone-50 p-4">
          <p className="mb-2 text-sm font-medium text-stone-700">
            Objet: {templates[selectedTemplate].subject}
          </p>
          <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-stone-600">
            {templates[selectedTemplate].body}
          </pre>
        </div>

        <div className="mt-4">
          <h4 className="mb-2 text-sm font-medium text-stone-700">
            Variables à remplir:
          </h4>
          <div className="flex flex-wrap gap-2">
            {[
              "{date_envoi}",
              "{proprietaire_nom}",
              "{proprietaire_adresse}",
              "{locataire_nom}",
              "{locataire_adresse}",
              "{mois}",
              "{montant}",
              "{iban}",
            ].map((variable) => (
              <span
                key={variable}
                className="rounded bg-stone-100 px-2 py-1 text-xs font-mono text-stone-600"
              >
                {variable}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-stone-500">
        <strong>Conseil:</strong> Pour la mise en demeure, envoyez toujours par
        lettre recommandée avec accusé de réception (LRAR) et conservez tous les
        justificatifs.
      </p>
    </section>
  );
}