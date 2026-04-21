import type { Metadata } from "next";
export const revalidate = 604800;

import Link from "next/link";
import { ArrowRight, FileText, Download } from "lucide-react";
import { baseMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata({
    title: "Lettre de relance pour loyer impayé | Modèle gratuit 2026",
    description:
      "Modèle de lettre de relance pour loyers impayés à télécharger. Modèle gratuit, personnalisable, à envoyer en recommandé. Procédure et délais.",
    url: "/guides/relance-loyer",
    ogType: "website",
  });
}

export default function RelanceLoyerGuidePage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <header className="mb-12">
        <nav className="mb-6 text-sm text-stone-500">
          <Link href="/" className="hover:text-stone-700">Accueil</Link>
          <span className="mx-2">›</span>
          <Link href="/guides" className="hover:text-stone-700">Guides pratiques</Link>
          <span className="mx-2">›</span>
          <span>Lettre de relance pour loyer impayé</span>
        </nav>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
          Guide gratuit
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Lettre de relance pour loyer impayé
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-600">
          Face à un loyer impayé, la relance écrite est la première étape.
          Téléchargez notre modèle gratuit, comprenez la procédure et les délais
          légaux.
        </p>
      </header>

      {/* Download CTA */}
      <div className="mb-12 rounded-2xl border border-red-200/60 bg-gradient-to-br from-red-50 to-white p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              Modèle de lettre de relance impayé
            </h2>
            <p className="mt-1 text-stone-600">
              Téléchargez notre modèle gratuit — personnalisez-le et envoyez-le en
              recommandé avec accusé de réception.
            </p>
          </div>
          <Link
            href="/templates/relance-loyer-impaye"
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            <Download className="size-4" />
            Télécharger le modèle
          </Link>
        </div>
      </div>

      <div className="prose prose-stone max-w-none">
        <h2>La procédure de recouvrement d&apos;un loyer impayé</h2>
        <p>
          Environ 2 à 3 % des locations génèrent un impayé chaque année en France.
          La procédure de recouvrement est строго réglementée. Voici les étapes
          légales et les délais à respecter :
        </p>

        <div className="not-prose my-6 space-y-3">
          {[
            { day: "J+1", step: "Constatation de l&apos;impayé", desc: "Le lendemain de la date d&apos;échéance, vérifiez si le virement a bien été effectué. Ne wait pas au-delà du 5 du mois." },
            { day: "J+3", step: "Relance simple", desc: "Envoyez un email ou un courrier simple rappelant l&apos;échéance et les coordonnées pour effectuer le réglement." },
            { day: "J+8 à 15", step: "Mise en demeure (LRAR)", desc: "Envoyez une lettre de mise en demeure en recommandé avec accusé de réception. Mentionnez le montant dû, le délai de réglement (8 jours) et les conséquences." },
            { day: "J+2 mois", step: "Assignation au tribunal", desc: "Si l&apos;impayé persiste après 2 mois, vous pouvez assigner le locataire devant le tribunal judiciaire." },
            { day: "Post-judgment", step: "Commandement de quitter les lieux", desc: "Si le tribunal vous donne raison, faites signifier un commandement de quitter les lieux par un huissier." },
          ].map((item) => (
            <div key={item.day} className="flex gap-4 rounded-lg border border-stone-200 bg-white p-4">
              <div className="shrink-0 rounded-lg bg-stone-100 px-3 py-1 text-center text-xs font-bold text-stone-600">
                {item.day}
              </div>
              <div>
                <h3 className="font-semibold text-stone-900">{item.step}</h3>
                <p className="text-sm text-stone-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2>Que mettre dans une lettre de relance ?</h2>
        <p>
          La lettre de relance doit être claire, factuelle et firmum. Elle doit contenir :
        </p>
        <ul>
          <li><strong>L&apos;identification du bailleur</strong> — nom, adresse, références du bien</li>
          <li><strong>L&apos;identification du locataire</strong> — nom, adresse du bien loué</li>
          <li><strong>Références du bail</strong> — date de signature, durée, montant du loyer</li>
          <li><strong>Montant de l&apos;impayé</strong> — montant total dû avec le détail (loyer + charges)</li>
          <li><strong>Période concernée</strong> — mois(s) de l&apos;impayé</li>
          <li><strong>Délai de réglement</strong> — généralement 8 jours par LRAR</li>
          <li><strong>Conséquences en cas de non-paiement</strong> — mention de la procédure judiciaire et de l&apos;expulsion</li>
        </ul>

        <h2>Comment prouver l&apos;impayé ?</h2>
        <p>
          Conservez absolument toutes les preuves du non-paiement :
        </p>
        <ul>
          <li>Relevés bancaires montrant l&apos;absence de virement</li>
          <li>Échanges d&apos;emails ou de SMS avec le locataire</li>
          <li>Copie de la lettre de relance (gardez le accusé de réception)</li>
          <li>Attestations écrites de proches si le locataire reconnaît l&apos;impayé</li>
        </ul>

        <h2>La Garantie Loyers Impayés (GLI)</h2>
        <p>
          Souscrire une GLI (Garantie Loyers Impayés) vous protège contre les défaillances
          de paiement. La GLI rembourse les loyers impayés (dans la limite du plafond
          contractuel) et peut prendre en charge les frais de procédure. Le coût varie
          entre 2 % et 4 % du montant annuel du loyer.
        </p>
      </div>

      <div className="mt-12 rounded-xl border border-stone-200/60 bg-stone-50 p-8 text-center">
        <h2 className="mb-3 text-xl font-bold text-stone-900">
          Protégez-vous contre les impayés
        </h2>
        <p className="mx-auto mb-6 max-w-md text-stone-600">
          With RentReady, détectez les retards de paiement en temps réel et lancez la
          procédure de recouvrement avant qu&apos;il ne soit trop tard.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Essai gratuit 14 jours
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/templates/relance-loyer-impaye"
            className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50"
          >
            <FileText className="size-4" />
            Modèle gratuit
          </Link>
        </div>
      </div>
    </article>
  );
}
