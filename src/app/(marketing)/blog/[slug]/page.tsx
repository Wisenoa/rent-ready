import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { articles, getArticleBySlug } from "@/data/articles";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ReadingProgress } from "@/components/seo/blog/ReadingProgress";
import { TableOfContents } from "@/components/seo/blog/TableOfContents";
import { AuthorBio } from "@/components/seo/blog/AuthorBio";
import { RelatedArticles } from "@/components/seo/blog/RelatedArticles";
import { SchemaMarkup } from "@/components/seo/schema-markup";

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
      images: [
        {
          url: `https://www.rentready.fr/api/og?title=${encodeURIComponent(article.title)}&description=${encodeURIComponent(article.excerpt)}&type=article`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [
        `https://www.rentready.fr/api/og?title=${encodeURIComponent(article.title)}&description=${encodeURIComponent(article.excerpt)}&type=article`,
      ],
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

      <h2 id="prevention-des-impayes">Prévention des impayés: les bonnes pratiques</h2>
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

      <h2 id="premiere-etape-relance-amiable">Première étape: la relance amiable</h2>
      <p>
        Dès le premier jour de retard, contactez le locataire par téléphone ou
        email pour comprendre la situation. Un rappel amiable permet souvent de
        régler le problème rapidement.
      </p>
      <h3 id="contenu-premiere-relance">Que contenir dans la première relance ?</h3>
      <ul>
        <li>Montant exact de la somme due</li>
        <li>Date d'échéance du loyer</li>
        <li>Coordonnées bancaires pour le paiement</li>
        <li>Délai de régularisation (8 à 15 jours)</li>
      </ul>

      <h2 id="deuxieme-etape-mise-en-demeure">Deuxième étape: la mise en demeure</h2>
      <p>
        Si la relance amiable reste sans effet après 15 jours, envoyez une mise
        en demeure par lettre recommandée avec accusé de réception. Ce courrier
        formel fait courir les délais légaux et servira de preuve en cas de
        procédure.
      </p>

      <h2 id="troisieme-etape-procedure-judiciaire">Troisième étape: la procédure judiciaire</h2>
      <p>
        Après un délai de 2 mois sans régularisation, vous pouvez saisir le
        tribunal judiciaire pour obtenir une ordonnance d'expulsion. Le juge
        peut accorder des délais de paiement au locataire en fonction de sa
        situation.
      </p>

      <h2 id="conclusion">Conclusion</h2>
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

      <h2 id="quest-ce-que-lirl">Qu'est-ce que l'IRL ?</h2>
      <p>
        L'IRL est la référence nationale pour la révision des loyers. Il est
        calculé à partir de l'évolution des prix à la consommation hors tabac
        et hors loyer, sur les 12 derniers mois. Au Q3 2025, l'IRL s'établit
        à 145, selon l'INSEE.
      </p>

      <h2 id="formule-de-revision">Formule de révision</h2>
      <p>
        <strong>Nouveau loyer = Loyer actuel × (IRL nouveau / IRL ancien)</strong>
      </p>
      <p>
        La date de référence à utiliser est celle mentionnée dans le bail
        (généralement la date d'anniversaire du bail). En cas de silence du
        bail, c'est la date du dernier IRL connu à la date de signature.
      </p>

      <h2 id="plafonds-daugmentation">Plafonds d'augmentation</h2>
      <p>
        Dans les zones tendues, l'augmentation est encadrée: elle ne peut
        pas dépasser la variation de l'IRL (hors relocation ou travaux
        majeurs). En 2026, restez vigilant sur ces limites selon votre
        commune.
      </p>

      <h2 id="utiliser-calculateur-irl">Comment utiliser un calculateur IRL ?</h2>
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

      <h2 id="plafond-legal">Plafond légal</h2>
      <p>
        Le montant du dépôt de garantie ne peut pas dépasser{' '}
        <strong>un mois de loyer hors charges</strong> pour les locations
        vides meublées. Ce plafond s'applique uniformément en France.
      </p>

      <h2 id="delai-de-restitution">Délai de restitution</h2>
      <p>
        Le dépôt doit être restitué au locataire dans un délai maximal de{' '}
        <strong>2 mois</strong> après la remise des clés. Passé ce délai,
        le propriétaire perd le droit de retenir le dépôt et devra restituer
        le montant intégral, majoré d'une pénalité de 10% du loyer mensuel
        par mois de retard.
      </p>

      <h2 id="deductibilite-reparations">Déductibilité des réparations</h2>
      <p>
        Seules les dégradations imputables au locataire peuvent être déduites
        du dépôt. L'état des lieux de sortie est la référence clé. En cas de
        litige, la commission départementale de conciliation (CDC) peut être
        saisie.
      </p>

      <h2 id="calcul-du-depot">Calcul du dépôt de garantie</h2>
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

      <h2 id="pourquoi-etat-des-lieux">Pourquoi l'état des lieux est crucial</h2>
      <p>
        En cas de litige sur la restitution du dépôt de garantie, l'état des
        lieux comparatif est la preuve principale. Un état des lieux précis
        et signé par les deux parties évite de nombreux litiges.
      </p>

      <h2 id="contenu-obligatoire">Ce qu'il doit contenir</h2>
      <ul>
        <li>Date de réalisation</li>
        <li>Identité des parties (propriétaire et locataire)</li>
        <li>Adresse du logement</li>
        <li>État de chaque pièce (murs, sols, plafonds, fenêtres, équipements)</li>
        <li>Index des compteurs (eau, électricité, gaz)</li>
        <li>Signature des deux parties</li>
      </ul>

      <h2 id="a-quelle-occasion">À quelle occasion ?</h2>
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

      <h2 id="diagnostics-obligatoires">Diagnostics obligatoires</h2>
      <p>
        Depuis la loi ALUR, le propriétaire doit fournir au locataire, avant
        la signature du bail, un dossier de diagnostic technique (DDT)
        complet incluant: DPE, état des risques, surface Carrez, etc.
      </p>

      <h2 id="encadrement-des-loyers">Encadrement des loyers</h2>
      <p>
        Dans les zones tendues, les loyers sont encadrés à la relocation.
        Le montant du loyer ne peut pas dépasser le loyer de référence
        majoré de 20%, sauf exceptions (travaux majeurs, loyer manifestement
        sous-évalué).
      </p>

      <h2 id="garantie-universelle-loyers">Garantie universelle des loyers (GUL)</h2>
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
        situation et du montant de vos charges. Voici comment optimiser
        votre fiscalité locative en 2026.
      </p>

      <h2 id="regime-micro-foncier">Le régime micro-foncier</h2>
      <p>
        Le micro-foncier s'applique automatiquement si vos revenus fonciers
        ne dépassent pas 15 000 € par an. Il offre un abattement forfaitaire
        de 30% pour frais. Simple, il ne nécessite aucune déclaration de
        charges.
      </p>

      <h2 id="regime-reel">Le régime réel</h2>
      <p>
        Le régime réel permet de déduire toutes les charges réelles:
        intérêts d'emprunt, travaux, frais de gestion, assurances, charges
        de copropriété. Il est souvent plus avantageux quand les charges
        dépassent 30% des revenus.
      </p>

      <h2 id="statut-lmnp">Le statut LMNP</h2>
      <p>
        La location meublée非 professionnelle (LMNP) offre des avantages
        fiscaux intéressants: amortissement du bien sur 20-30 ans et
        déficit imputable sur le revenu global. Ce statut est particulièrement
        adapté aux petites surfaces meublées.
      </p>

      <h2 id="nos-conseils">Nos conseils</h2>
      <p>
        Faites una simulation avant de choisir votre régime. N'hésitez pas à
        consulter un expert-comptable spécialisé en'immobilier pour optimiser
        votre fiscalité locative.
      </p>
    </>
  ),
  "logiciel-gestion-locative-gratuit-vs-payant": (
    <>
      <p className="lead">
        Choisir entre un logiciel de gestion locative gratuit et un solution payante
        représente une décision importante pour tout propriétaire bailleur. Ce comparatif
        vous aide à identifier l'option la plus adaptée à vos besoins, que vous gériez
        un seul appartement ou un patrimoine immobilier complet.
      </p>

      <h2 id="quest-ce-quun-logiciel-gestion-locative">Qu'est-ce qu'un logiciel de gestion locative ?</h2>
      <p>
        Un logiciel de gestion locative est un outil numérique conçu pour simplifier
        la gestion quotidienne de vos biens immobiliers. Il centralise les informations
        relatives à vos locataires, loyers, charges, et documents administratifs.
      </p>
      <p>
        Les fonctionnalités typiques incluent: le suivi des paiements, l'émission
        de quittances, la gestion des échéances, et parfois la comptabilité complète
        du patrimoine locatif.
      </p>

      <h2 id="solutions-gratuites-avantages-limites">Les solutions gratuites : avantages et limites</h2>
      <h3 id="tableur-excel">Tableur Excel</h3>
      <p>
        De nombreux propriétaires débutent avec un simple tableur Excel ou Google Sheets.
        Cette solution offre une flexibilité totale et ne coûte rien. Cependant, elle
        demande un temps considerable de mise à jour manuelle et présente des risques
        d'erreurs de calcul.
      </p>
      <h3 id="applications-basiques">Applications basiques</h3>
      <p>
        Certaines applications gratuites comme les gestionnaires de budgets personnels
        peuvent servir pour suivre vos revenus locatifs. Mais elles ne sont pas conçues
        spécifiquement pour l'immobilier et manquent de fonctionnalités spécialisées.
      </p>
      <h3 id="limitations-principales">Limitations principales</h3>
      <ul>
        <li>Aucune relance automatique en cas d'impayé</li>
        <li>Suivi manuel des échéances et renouvellements de bail</li>
        <li>Risque de perte de données sans sauvegarde automatique</li>
        <li>Difficulté à gérer plusieurs propriétés simultanément</li>
        <li>Pas d'alertes pour les déclarations fiscales ou assurances</li>
      </ul>

      <h2 id="logiciels-payants-fonctionnalites-roi">Les logiciels payants : fonctionnalités et ROI</h2>
      <h3 id="automatisation-relances">Automatisation des relances</h3>
      <p>
        Les solutions payantes comme RentReady envoient automatiquement des relances
        par email et SMS en cas de retard de paiement. Cette automatisation préserve
        la relation locataire tout en sécurisant vos revenus.
      </p>
      <h3 id="suivi-comptable">Suivi comptable</h3>
      <p>
        Un logiciel de gestion locative performant génère automatiquement les balances,
        comptes de résultat, et prépare votre déclaration fiscale. Fini la saisie manuelle
        fastidieuse en fin d'année.
      </p>
      <h3 id="acces-multi-supports">Accès multi-supports</h3>
      <p>
        Que vous soyez sur ordinateur, tablette ou smartphone, vous accédez à vos données
        en temps réel. Cette mobilité est précieuse pour réagir rapidement à toute situation.
      </p>

      <h2 id="comparatif-quand-passer-au-payant">Comparatif : quand passer au payant ?</h2>
      <p>
        Le passage à une solution payante devient rentable dès que vous dépassez
        2-3 biens en location. Le temps économisé sur la gestion administrative
        compense largement l'abonnement mensuel. Pour un patrimoine de 5 logements
        avec un loyer moyen de 800€, un logiciel à 30€/mois représente moins de 1%
        des revenus locatifs.
      </p>
      <ul>
        <li>Plus de 3 biens locatifs → la automatisation devient indispensable</li>
        <li>Zone géographique éloignée → besoin de gestion à distance</li>
        <li>Gestion des impayés récurrents → les relances automatiques font la différence</li>
        <li>Complexité comptable → la synthèse automatique vous fait gagner du temps</li>
      </ul>

      <h2 id="notre-recommandation-rentready">Notre recommandation : RentReady</h2>
      <p>
        RentReady propose un accompagnement complet pour les propriétaires bailleurs,
        de la gestion quotidienne au suivi comptable. L'outil détecte automatiquement
        les anomalies de paiement et vous alerte en temps réel.
      </p>
      <p>
        L'inscription est simple et l'interface intuitive ne nécessite aucune
        compétence technique particulière. Essayez gratuitement pendant 14 jours
        pour vous rendre compte des bénéfices.
      </p>
      <ul>
        <li>Détection automatique des impayés</li>
        <li>Relances multi-canal (email, SMS)</li>
        <li>Suivi comptable simplifié</li>
        <li>Accès multi-supports</li>
      </ul>
      <p>
        <Link href="/register" className="text-blue-600 hover:underline">
          Créer un compte gratuit sur RentReady
        </Link>
      </p>

      <h2 id="faq-logiciel-gestion-locative">FAQ</h2>
      <h3 id="cout-logiciel-gestion-locative">Quel est le coût moyen d'un logiciel de gestion locative ?</h3>
      <p>
        Les tarifs varient généralement entre 10€ et 50€/mois selon les fonctionnalités.
        Certains proposent un tarif dégressif selon le nombre de lots gérés.
      </p>
      <h3 id="logiciel-gratuit-suffisant">Un logiciel gratuit peut-il suffire pour un seul bien ?</h3>
      <p>
        Oui, pour un seul bien avec un locataire solvable et des paiements réguliers,
        un tableur bien structuré peut suffire. Mais dès la premiere complication,
        un outil dédié vous fera gagner du temps précieux.
      </p>
      <h3 id="migration-donnees">Comment migrer mes données existantes vers un nouveau logiciel ?</h3>
      <p>
        La plupart des solutions modernes proposent des outils d'importation depuis
        Excel ouCSV. Chez RentReady, notre équipe peut vous accompagner dans cette
        transition si besoin.
      </p>
    </>
  ),
  "comment-gerer-biens-locatifs": (
    <>
      <p className="lead">
        La gestion de biens locatifs demande rigueur et organisation. Entre obligations
        légales, suivi administratif et entretien du patrimoine, ce guide pratique vous
        accompagne dans chaque étape de la gestion locative au quotidien.
      </p>

      <h2 id="obligations-fondamentales-proprietaire-bailleur">Les obligations fondamentales du propriétaire bailleur</h2>
      <p>
        Le propriétaire bailleur doit respecter un cadre légal précis. Il doit entregar
        un logement décent avec les équipements fonctionnels, effectuer les repairs
        locatives définies par la loi, et assurer la paisible jouissance du bien
        au locataire.
      </p>
      <ul>
        <li>Garantir la conformité du logement (électricité, gaz, DPE)</li>
        <li>Respecter les délais de réponse aux demandes du locataire</li>
        <li>Souscrire une assurance propriétaires non occupants</li>
        <li>Produire les diagnostics obligatoires avant signature</li>
      </ul>

      <h2 id="suivi-administratif-loyers-receipts-declarations">Suivi administratif : loyers, reçus, déclarations</h2>
      <h3 id="tenir-jour-documents">Tenir à jour les documents</h3>
      <p>
        Chaque paiement de loyer doit être documenté. Conservez les relevés bancaires,
        les quittances émises, et tout échange avec le locataire. Un classeur numérique
        ou physique bien organisé facilite les contrôles et la comptabilité annuelle.
      </p>
      <h3 id="declarations-fiscales">Les déclarations fiscales</h3>
      <p>
        Les revenus locatifs doivent être déclarés aux impôts. Selon votre régime
        (micro-foncier ou réel), vous déclarez soit le brut après abattement,
        soit le net après déduction des charges. La déclaration est à effectuer
        chaque année, généralement au printemps.
      </p>
      <ul>
        <li>Déclaration des revenus fonciers (formulaire 2044 ou 2044 SPE)</li>
        <li>Attestation de revenus pour le locataire (reçu de loyer)</li>
        <li>Déclaration de la CFE (Cotisation Foncière des Entreprises)</li>
        <li>Déclaration de la TEOM si applicable</li>
      </ul>

      <h2 id="entretien-maintenance-du-bien">Entretien et maintenance du bien</h2>
      <p>
        Le propriétaire est responsable des grosses réparations et du gros œuvre.
        Les réparations locatives (petites entretenir) incombent généralement
        au locataire selon l'état des lieux d'entrée.
      </p>
      <p>
        Planifiez un budget annuel de maintenance équivalent à 1-2 mois de loyer
        par bien. Ce fonds permet de faire face aux interventions urgentes sans
        stress financier.
      </p>
      <ul>
        <li>Inspection annuelle du bien (état des lieux intermédiaire)</li>
        <li>Entretien de la chaudière et système de chauffage</li>
        <li>Vérification des détecteurs de fumée</li>
        <li>Réfection des peintures et revêtements si nécessaire</li>
      </ul>

      <h2 id="relations-avec-locataire-communication-suivi">Relations avec le locataire : communication et suivi</h2>
      <p>
        Une relation de qualité avec votre locataire favorise la sérénité et reduce
        les risques d'impayé. Répondez promptement aux demandes de réparation et
        tenez-le informé des interventions planned.
      </p>
      <p>
        Établissez un mode de communication clair dès le départ: prefers un email
        écrit pour tout échange important afin de garder une trace. Cela protège
        les deux parties en cas de litige.
      </p>

      <h2 id="outils-faciliter-gestion-quotidienne">Outils pour faciliter la gestion quotidienne</h2>
      <p>
        Un logiciel de gestion locative comme RentReady centralise toutes vos
        informations et automatise les tâches répétitives. Vous suivez vos loyers
        en temps réel, émettez des quittances en un clic, et êtes alerté des
        anomalies de paiement.
      </p>
      <p>
        <Link href="/register" className="text-blue-600 hover:underline">
          Découvrez RentReady pour simplifier votre gestion locative
        </Link>
      </p>

      <h2 id="checklist-annuelle-proprietaire-bailleur">Checklist annuelle du propriétaire bailleur</h2>
      <ul>
        <li>✓ Réaliser l'état des lieux annuel si prévu au bail</li>
        <li>✓ Vérifier les assurances (propriétaire non occupants, protection juridique)</li>
        <li>✓ Entretenir la chaudière et faire vérifier les équipements</li>
        <li>✓ Déclarer les revenus fonciers avant la deadline</li>
        <li>✓ Réviser le loyer selon l'IRL si clause de révision prévue</li>
        <li>✓ Vérifier les dates de renouvellement du bail et да Tos</li>
        <li>✓ Mettre à jour le dossier fiscal et comptable</li>
        <li>✓ Planifier les gros travaux éventuels</li>
      </ul>
    </>
  ),
  "augmentation-loyer-regles-et-procedure": (
    <>
      <p className="lead">
        L'augmentation de loyer est encadrée par des règles précises que tout
        propriétaire bailleur doit connaître. Entre l'IRL, les zones tendues
        et les délais à respecter, voici la procédure complète pour augmenter
        votre loyer en toute conformité en 2026.
      </p>

      <h2 id="bases-legales-revision-loyer">Les bases légales de la révision de loyer</h2>
      <p>
        La révision du loyer repose sur l'Indice de Référence des Loyers (IRL)
        publié trimestriellement par l'INSEE. Cet indice reflète l'évolution
        des prix à la consommation hors tabac et hors loyer.
      </p>
      <p>
        L'augmentation ne peut être appliquée que si elle est prévue dans le bail
        et intervient à la date d'anniversaire du contrat. En l'absence de clause
        de révision, le loyer reste figé pendant toute la durée du bail.
      </p>

      <h2 id="zones-tendues-encadrement-loyers">Zones tendues : encadrement des loyers</h2>
      <h3 id="plafonds-2026">Plafonds 2026</h3>
      <p>
        Dans les communes situées en zone tendue, l'augmentation est strictement
        encadrée lors d'un renouvellement de bail. Le loyer ne peut dépasser
        le loyer de référence majoré de 20%, sauf exceptions.
      </p>
      <p>
        Certaines communes appliquent des dispositifs plus stricts avec des
        plafonds spécifiques. Vérifiez auprès de votre mairie ou sur le site
        du gouvernement las limites applicables à votre locality.
      </p>
      <h3 id="exceptions-a-la-regle">Exceptions à la règle</h3>
      <ul>
        <li>Travaux d'amélioration ou de mise aux normes (avec hausse justifiée)</li>
        <li>Loyer manifestement sous-évalué (avec justification par Vergleich)</li>
        <li>Premier contrat de location depuis plus de 18 mois</li>
      </ul>

      <h2 id="comment-calculer-augmentation-loyer">Comment calculer une augmentation de loyer</h2>
      <p>
        La formule est simple:{' '}
        <strong>Nouveau loyer = Loyer actuel × (IRL nouveau / IRL ancien)</strong>
      </p>
      <p>
        Exemple concret: si votre loyer actuel est de 800€ et que l'IRL est passé
        de 140 à 143, le nouveau loyer maximum sera de 800 × (143/140) = 817,14€/mois.
      </p>
      <p>
        Utilisez notre outil pour calculer précisément votre augmentation:
      </p>
      <p>
        <Link href="/outils/calculateur-irl-2026" className="text-blue-600 hover:underline">
          Calculateur IRL 2026 - Calculez votre nouveau loyer
        </Link>
      </p>

      <h2 id="procedure-pratique-etapes-delais">Procédure pratique : étapes et délais</h2>
      <h3 id="informer-locataire">Informer le locataire</h3>
      <p>
        Vous devez notifier le locataire de l'augmentation par lettre recommandée
        avec accusé de réception ou par acte extrajudicial (huissier). Le courrier
        doit mentionner le nouveau loyer, la date d'application, et le calcul détaillé.
      </p>
      <h3 id="modele-courrier">Modèle de courrier</h3>
      <p>
        Votre courrier doit inclure: l'intitulé "Notification de révision de loyer",
        vos coordonnées et celles du locataire, la référence du bail, le montant
        actuel du loyer, le nouvel IRL utilisé, le nouveau loyer提议, et la date
        d'effet. Un modele type est disponible sur notre site.
      </p>

      <h2 id="en-cas-de-refus-locataire">En cas de refus du locataire</h2>
      <p>
        Si le locataire conteste l'augmentation, plusieurs options s'offrent à vous.
        Vous pouvez saisir la commission département de conciliation (CDC) pour
        trouver un accord. En cas d'échec, le juge du tribunal judiciaire peut
        être saisi.
      </p>
      <p>
        Dans une zone tendue, si le locataire refuse une augmentation pourtant
        dans les limites légales, vous pouvez, en dernier recours, ne pas
        renouveler le bail et relouer à un nouveau locataire au loyer de marché.
      </p>
      <p>
        <Link href="/register" className="text-blue-600 hover:underline">
          Automatisez le suivi des IRL et calculez vos augmentations avec RentReady
        </Link>
      </p>
    </>
  ),
  "charges-locatives-recuperables-liste": (
    <>
      <p className="lead">
        Les charges locatives récupérables constituent un poste important tant
        pour le propriétaire que pour le locataire. Connaître précisément la liste
        des charges que vous pouvez récupérer vous permet de'éviter les litiges
        et de maintenir une relation saine avec vos locataires.
      </p>

      <h2 id="principe-charges-locatives-recuperables">Principe des charges locatives récupérables</h2>
      <p>
        Les charges locatives sont les dépenses liées à l'utilisation du logement
        que le propriétaire peut récupérer auprès du locataire. Elles sont régies
        par le décret n° 82-955 du 30 novembre 1982 qui définit une liste exhaustive.
      </p>
      <p>
        On distingue deux types de charges: les charges individuelles (propres à
        un logement) et les charges communes (parties communes de l'immeuble).
        Les charges communes sont réparties entre les locataires au prorata
        de leurs tantièmes ou de leur surface.
      </p>

      <h2 id="liste-charges-recuperables">Liste des charges récupérables</h2>
      <ul>
        <li>Taxe d'enlèvement des ordures ménagères (TEOM)</li>
        <li>Taxe de balayage</li>
        <li>Consommation d'eau froide (si compteur individuel)</li>
        <li>Chauffage et production d'eau chaude sanitaire (si chauffage collectif)</li>
        <li>Entretien des ascenseurs et monte-charges</li>
        <li>Nettoyage des parties communes</li>
        <li>Entretien des espaces verts et jardins</li>
        <li>Réparation et remplacement des équipements communs</li>
        <li>Électricité des parties communes (éclairage cage d'escalier, parking)</li>
        <li>Frais de gestion et honoraires du syndic</li>
        <li>Prime d'assurance de l'immeuble</li>
        <li>Entretien des chaudières et système de chauffage collectif</li>
        <li>Vérification périodique des équipements ( extincteurs, colonnes sèches)</li>
        <li>Nettoyage des gouttières et chéneaux</li>
        <li>Traitement des nuisibles (deratisation, désinsectisation)</li>
      </ul>

      <h2 id="charges-non-recuperables">Charges non récupérables</h2>
      <p>
        Certaines charges restent à la seule charge du propriétaire et ne peuvent
        pas être imputées au locataire:
      </p>
      <ul>
        <li>Gros œuvre et structure de l'immeuble</li>
        <li>Réfection de la façade et toiture</li>
        <li>Travaux d'amélioration énergétique (isolation, fenêtres)</li>
        <li>Honoraires du propriétaire ou du gestionnaire pour la location</li>
        <li>Frais de contentieux et d'huissier</li>
        <li>Versement du fonds de prévision pour travaux urgents</li>
        <li>Charges relatives aux équipements produtcing des revenus (garage, parking)</li>
      </ul>

      <h2 id="regularisation-annuelle-comment-proceder">Régularisation annuelle : comment procéder</h2>
      <p>
        Chaque année, vous devez procéder à la régularisation des charges.
        Comparez les provisions mensuelles versées par le locataire avec les
        dépenses réelles encourues. Si les provisions sont supérieures aux dépenses,
        vous devez restituer le trop-perçu. À l'inverse, si les dépenses dépassent
        les provisions, vous pouvez réclamer le complément.
      </p>
      <p>
        Envoyez le décompte de charges au locataire par lettre recommandée avec
        accusé de réception au plus tard le 30 juin de l'année suivant l'exercice.
        Joignez impérativement les factures justificatives.
      </p>
      <ul>
        <li>Réunissez toutes les factures de l'année (eau, énergie, assurances)</li>
        <li>Calculez le total des charges réelles</li>
        <li>Soustrayez les provisions mensuelles déjà versées (loyer × 12)</li>
        <li>Établissez le décompte détaillé par poste de charge</li>
        <li>Envoyez le décompte avant le 30 juin</li>
      </ul>

      <h2 id="pieges-eviter-litiges-courants">Pièges à éviter et litiges courants</h2>
      <p>
        Les litiges sur les charges sont fréquents. Pour les éviter, utilisez
        un modelo de décompte conforme et joignez systématiquement les factures.
        Ne jamais provisionner plus que les dépenses réelles sans justification.
      </p>
      <p>
        En cas de contestation, le locataire peut saisir la commission département
        de conciliation. Conservez toujours une trace écrite de tous vos échanges
        et montants réclamés.
      </p>
      <p>
        Un logiciel de gestion locative comme RentReady automatise le calcul des
        provisions et génère les décomptes de charges conformes à la réglementation.
      </p>
      <p>
        <Link href="/register" className="text-blue-600 hover:underline">
          Gérez vos charges locatives facilement avec RentReady
        </Link>
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

/* ─── JSON-LD: Article + BreadcrumbList ─── */
function BlogPostJsonLd({ article, slug }: { article: { title: string; excerpt: string; date: string; category: string; readTime: string }; slug: string }) {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `https://www.rentready.fr/blog/${slug}#article`,
        headline: article.title,
        description: article.excerpt,
        datePublished: article.date,
        dateModified: article.date,
        author: {
          "@type": "Organization",
          name: "RentReady",
          url: "https://www.rentready.fr",
        },
        publisher: {
          "@type": "Organization",
          name: "RentReady",
          url: "https://www.rentready.fr",
          logo: {
            "@type": "ImageObject",
            url: "https://www.rentready.fr/logo.png",
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://www.rentready.fr/blog/${slug}`,
        },
        articleSection: article.category,
        wordCount: Math.round(article.readTime.replace(" min", "") as unknown as number * 200),
        timeRequired: `PT${article.readTime.replace(" min", "")}M`,
        inLanguage: "fr-FR",
        isAccessibleForFree: true,
        image: {
          "@type": "ImageObject",
          url: `https://www.rentready.fr/api/og?title=${encodeURIComponent(article.title)}&description=${encodeURIComponent(article.excerpt)}&type=article`,
          width: 1200,
          height: 630,
        },
      },
      {
        "@type": "BreadcrumbList",
        name: "Fil d'Ariane",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Accueil",
            item: "https://www.rentready.fr",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: "https://www.rentready.fr/blog",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: article.title,
            item: `https://www.rentready.fr/blog/${slug}`,
          },
        ],
      },
    ],
  };
  return <SchemaMarkup data={data} />;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const reactContent = articleContent[slug];
  const markdownContent = article?.content;

  return (
    <>
      <BlogPostJsonLd article={article} slug={slug} />
      <ReadingProgress />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16">
        {/* Back link */}
        <div className="mb-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700"
          >
            <ArrowLeft className="size-4" />
            Retour au blog
          </Link>
        </div>

        {/* Two-column layout: article + TOC sidebar */}
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          {/* Main article */}
          <article className="min-w-0">
            <header className="mb-10">
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

              <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl leading-tight">
                {article.title}
              </h1>

              {article.excerpt && (
                <p className="mt-4 text-lg text-stone-600 leading-relaxed">
                  {article.excerpt}
                </p>
              )}
            </header>

            <div className="prose prose-stone max-w-none
              prose-headings:scroll-mt-24
              prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-stone-900
              prose-h3:text-lg prose-h3:font-medium prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-stone-800
              prose-p:text-base prose-p:leading-relaxed prose-p:text-stone-700
              prose-a:text-blue-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
              prose-li:my-1.5
              prose-ul:my-4 prose-ul:space-y-1
              prose-ol:my-4 prose-ol:space-y-1
              prose-blockquote:border-l-4 prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic
            ">
              {reactContent ?? (markdownContent ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdownContent}
                </ReactMarkdown>
              ) : null)}
            </div>

            {/* Author bio */}
            <AuthorBio />

            {/* Inline CTA */}
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

            {/* Related articles */}
            <RelatedArticles currentSlug={slug} category={article.category} />
          </article>

          {/* Sticky TOC sidebar */}
          <TableOfContents />
        </div>
      </div>
    </>
  );
}
