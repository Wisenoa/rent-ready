import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { articles, getArticleBySlug } from "@/data/articles";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: `https://www.rentready.fr/blog/${slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `https://www.rentready.fr/blog/${slug}`,
      type: "article",
      publishedTime: article.date,
      authors: ["RentReady"],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: ["https://www.rentready.fr/og-image.png"],
    },
  };
}

const articleContent: Record<string, React.ReactNode> = {
  "comment-gerer-loyers-impayes": (
    <>
      <p className="lead">
        Les loyers impayés représentent l'une des principales préoccupations
        des propriétaires bailleurs. Ce guide complet vous accompagne dans la
        prévention et la gestion des impayés, de la première relance à la
        procédure judiciaire.
      </p>

      <h2>Prévention des impayés: les bonnes pratiques</h2>
      <p>
        La prévention commence dès la signature du bail. Vérifiez
        systématiquement la solvabilité du locataire: demande de justificatifs
        de revenus (3 derniers bulletins de salaire), attestation d'employeur,
        et avis d'imposition.
      </p>
      <p>
        Le taux d'effort (loyer / revenus) ne devrait pas dépasser 33%. Au-delà,
        le risque d'impayé augmente significativement.
      </p>

      <h2>Première étape: la relance amiable</h2>
      <p>
        Dès le premier jour de retard, contactez le locataire par téléphone ou
        email pour comprendre la situation. Un rappel amiable permet souvent de
        régler le problème rapidement.
      </p>
      <h3>Que contenir dans la première relance ?</h3>
      <ul>
        <li>Montant exact de la somme due</li>
        <li>Date d'échéance du loyer</li>
        <li>Coordonnées bancaires pour le paiement</li>
        <li>Délai de régularisation (8 à 15 jours)</li>
      </ul>

      <h2>Deuxième étape: la mise en demeure</h2>
      <p>
        Si la relance amiable reste sans effet après 15 jours, envoyez une mise
        en demeure par lettre recommandée avec accusé de réception. Ce courrier
        formel fait courir les délais légaux et servira de preuve en cas de
        procédure.
      </p>

      <h2>Troisième étape: la procédure judiciaire</h2>
      <p>
        Après un délai de 2 mois sans régularisation, vous pouvez saisir le
        tribunal judiciaire pour obtenir une ordonnance d'expulsion. Le juge
        peut accorder des délais de paiement au locataire en fonction de sa
        situation.
      </p>

      <h2>Conclusion</h2>
      <p>
        La gestion des impayés demande rigueur et méthode. Une procédure
        bien menée permet souvent d'obtenir le paiement sans aller jusqu'au
        tribunal. RentReady peut vous aider à automatiser les relances et
        suivre vos impayés.
      </p>
    </>
  ),
  "revision-loyer-irl-guide-complet": (
    <>
      <p className="lead">
        L'Indice de Référence des Loyers (IRL) est publié chaque trimestre par
        l'INSEE. Il sert de base à la révision annuelle des loyers dans le
        secteur privé. Voici tout ce que vous devez savoir pour calculer et
        appliquer correctement la révision en 2026.
      </p>

      <h2>Qu'est-ce que l'IRL ?</h2>
      <p>
        L'IRL est la référence nationale pour la révision des loyers. Il est
        calculé à partir de l'évolution des prix à la consommation hors tabac
        et hors loyer, sur les 12 derniers mois. Au Q3 2025, l'IRL s'établit
        à 145, selon l'INSEE.
      </p>

      <h2>Formule de révision</h2>
      <p>
        <strong>Nouveau loyer = Loyer actuel × (IRL nouveau / IRL ancien)</strong>
      </p>
      <p>
        La date de référence à utiliser est celle mentionnée dans le bail
        (généralement la date d'anniversaire du bail). En cas de silence du
        bail, c'est la date du dernier IRL connu à la date de signature.
      </p>

      <h2>Plafonds d'augmentation</h2>
      <p>
        Dans les zones tendues, l'augmentation est encadrée: elle ne peut
        pas dépasser la variation de l'IRL (hors relocation ou travaux
        majeurs). En 2026, restez vigilant sur ces limites selon votre
        commune.
      </p>

      <h2>Comment utiliser un calculateur IRL ?</h2>
      <p>
        RentReady propose un{' '}
        <Link href="/outils/calculateur-irl-2026" className="text-blue-600 hover:underline">
          calculateur IRL 2026
        </Link>{' '}
        qui vous permet d'obtenir instantanément le nouveau montant de
        votre loyer révisé.
      </p>
    </>
  ),
  "depot-garantie-regles-essentielles": (
    <>
      <p className="lead">
        Le dépôt de garantie est une somme versée par le locataire à la
        signature du bail. Il est strictement encadré par la loi du 6 juillet
        1989. Voici les règles essentielles à connaître en 2026.
      </p>

      <h2>Plafond légal</h2>
      <p>
        Le montant du dépôt de garantie ne peut pas dépasser{' '}
        <strong>un mois de loyer hors charges</strong> pour les locations
        vides meublées. Ce plafond s'applique uniformément en France.
      </p>

      <h2>Délai de restitution</h2>
      <p>
        Le dépôt doit être restitué au locataire dans un délai maximal de{' '}
        <strong>2 mois</strong> après la remise des clés. Passé ce délai,
        le propriétaire perd le droit de retenir le dépôt et devra restituer
        le montant intégral, majoré d'une pénalité de 10% du loyer mensuel
        par mois de retard.
      </p>

      <h2>Déductibilité des réparations</h2>
      <p>
        Seules les dégradations imputables au locataire peuvent être déduites
        du dépôt. L'état des lieux de sortie est la référence clé. En cas de
        litige, la commission départementales de conciliation (CDC) peut être
        saisie.
      </p>

      <h2>Calcul du dépôt de garantie</h2>
      <p>
        Utilisez notre{' '}
        <Link href="/outils/calculateur-depot-garantie" className="text-blue-600 hover:underline">
          calculateur de dépôt de garantie
        </Link>{' '}
        pour vérifier le montant maximal légal applicable à votre situation.
      </p>
    </>
  ),
  "etat-des-lieux-entree-sortie": (
    <>
      <p className="lead">
        L'état des lieux est un document essentiel qui protège à la fois le
        propriétaire et le locataire. Réalisé à l'entrée et à la sortie du
        logement, il constate l'état du bien. Mode d'emploi complet.
      </p>

      <h2>Pourquoi l'état des lieux est crucial</h2>
      <p>
        En cas de litige sur la restitution du dépôt de garantie, l'état des
        lieux comparatif est la preuve principale. Un état des lieux précis
        et signé par les deux parties évite de nombreux litiges.
      </p>

      <h2>Ce qu'il doit contenir</h2>
      <ul>
        <li>Date de réalisation</li>
        <li>Identité des parties (propriétaire et locataire)</li>
        <li>Adresse du logement</li>
        <li>État de chaque pièce (murs, sols, plafonds, fenêtres, équipements)</li>
        <li>Index des compteurs (eau, électricité, gaz)</li>
        <li>Signature des deux parties</li>
      </ul>

      <h2>À quelle occasion ?</h2>
      <p>
        L'état des lieux doit être fait à l'entrée (remise des clés) et à la
        sortie (restitution des clés). Il doit être réalisé de manière
        contradictoire et annexé au bail.
      </p>
    </>
  ),
  "loi-alur-proprietaire-bailleur": (
    <>
      <p className="lead">
        La loi ALUR (Accès au Logement et Urbanisme Rénové), promulguée en
        mars 2014, a profondément renforcé les obligations des propriétaires
        bailleurs. État des lieux réglementaire, diagnostic de performance
        énergétique, plafond de honoraires... Voici ce qui vous concerne en 2026.
      </p>

      <h2>Diagnostics obligatoires</h2>
      <p>
        Depuis la loi ALUR, le propriétaire doit fournir au locataire, avant
        la signature du bail, un dossier de diagnostic technique (DDT)
        complet incluant: DPE, état des risques, surface Carrez, etc.
      </p>

      <h2>Encadrement des loyers</h2>
      <p>
        Dans les zones tendues, les loyers sont encadrés à la relocation.
        Le montant du loyer ne peut pas dépasser le loyer de référence
        majoré de 20%, sauf exceptions (travaux majeurs, loyer manifestement
        sous-évalué).
      </p>

      <h2>Garantie universelle des loyers (GUL)</h2>
      <p>
        Initialement prévue par la loi ALUR, la GUL a été remplacée par le
        dispositif VISALE. Ce cautionnement gratuit pris en charge par l'État
        couvre les impayés de loyer pour les locataires éligibles.
      </p>
    </>
  ),
  "optimiser-fiscalite-loyers": (
    <>
      <p className="lead">
        Les revenus locatifs sont imposés selon deux régimes fiscaux au choix:
        le micro-foncier et le régime réel. Le bon choix dépend de votre
        situation et du montant de vos charges. Voici comment optimizer
        votre fiscalité locative en 2026.
      </p>

      <h2>Le régime micro-foncier</h2>
      <p>
        Le micro-foncier s'applique automatiquement si vos revenus fonciers
        n'excedent pas 15 000 € par an. Il offre un abattement forfaitaire
        de 30% pour frais. Simple, il ne nécessite aucune déclaration de
        charges.
      </p>

      <h2>Le régime réel</h2>
      <p>
        Le régime réel permet de déduire toutes les charges réelles:
        intérêts d'emprunt, travaux, frais de gestion, assurances, charges
        de copropriété. Il est souvent plus avantageux quand les charges
        dépassent 30% des revenus.
      </p>

      <h2>Le statut LMNP</h2>
      <p>
        La location meublée非 professionnelle (LMNP) offre des avantages
        fiscaux intéressants: amortissement du bien sur 20-30 ans et
        déficit imputable sur le revenu global. Ce statut est particulièrement
        adapté aux petites surfaces meublées.
      </p>

      <h2>Nos conseils</h2>
      <p>
       Faites una simulation avant de choisir votre régime. N'hésitez pas à
        consulter un expert-comptable spécialisé en'immobilier pour optimiser
        votre fiscalité locative.
      </p>
    </>
  ),
};

const categoryColors: Record<string, string> = {
  Gestion: "bg-blue-100 text-blue-700",
  Juridique: "bg-purple-100 text-purple-700",
  Calculs: "bg-green-100 text-green-700",
  Fiscalité: "bg-amber-100 text-amber-700",
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const reactContent = articleContent[slug];
  const markdownContent = article?.content;

  return (
    <>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <header className="mb-10">
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700"
          >
            <ArrowLeft className="size-4" />
            Retour au blog
          </Link>

          <div className="mb-4 flex items-center gap-3 text-sm text-stone-500">
            <span className={`rounded-full px-2 py-0.5 ${categoryColors[article.category] ?? "bg-gray-100 text-gray-700"}`}>
              {article.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="size-4" />
              {new Date(article.date).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-4" />
              {article.readTime}
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            {article.title}
          </h1>
        </header>

        <div className="prose prose-stone max-w-none">
          {reactContent ?? (markdownContent ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdownContent}
            </ReactMarkdown>
          ) : null)}
        </div>

        <section className="mt-12 rounded-xl border border-blue-200/60 bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 text-center sm:p-10">
          <h2 className="mb-3 text-xl font-bold text-stone-900">
            Automatisez le suivi de vos loyers
          </h2>
          <p className="mx-auto mb-6 max-w-lg text-stone-600">
            RentReady détecte automatiquement les impayés et envoie les relances
            à votre place. Essai gratuit 14 jours.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Commencer l'essai gratuit
          </Link>
        </section>
      </article>
    </>
  );
}
