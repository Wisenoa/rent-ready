export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Gestion" | "Calculs" | "Juridique" | "Fiscalité";
  date: string;
  readTime: string;
  updatedAt: string;
  content?: string;
};

export const articles: Article[] = [
  {
    slug: "comment-gerer-loyers-impayes",
    title: "Comment gérer les loyers impayés en 2026",
    excerpt:
      "Guide complet pour les propriétaires face aux impayés: prévention, procédure de recouvrement, mise en demeure et recours légaux.",
    category: "Gestion",
    date: "2026-01-15",
    updatedAt: '2026-01-15',
    readTime: "8 min",
  },
  {
    slug: "revision-loyer-irl-guide-complet",
    title: "Révision de loyer et IRL: guide complet 2026",
    excerpt:
      "Tout savoir sur la révision annuelle des loyers: formule IRL, calcul, date anniversaire et limites de l'augmentation.",
    category: "Calculs",
    date: "2026-01-10",
    updatedAt: '2026-01-10',
    readTime: "6 min",
  },
  {
    slug: "depot-garantie-regles-essentielles",
    title: "Dépôt de garantie: les règles essentielles à connaître en 2026",
    excerpt:
      "Plafonds légaux, restitution, délais et litiges. Tout ce que les propriétaires doivent savoir sur la caution.",
    category: "Juridique",
    date: "2026-01-05",
    updatedAt: '2026-01-05',
    readTime: "5 min",
  },
  {
    slug: "etat-des-lieux-entree-sortie",
    title: "État des lieux d'entrée et de sortie: mode d'emploi 2026",
    excerpt:
      "Comment réaliser un état des lieux complet et éviter les litiges à la fin du bail. Checklist et conseils pratiques.",
    category: "Juridique",
    date: "2026-02-20",
    updatedAt: '2026-02-20',
    readTime: "7 min",
  },
  {
    slug: "loi-alur-proprietaire-bailleur",
    title: "Loi ALUR: impact sur les propriétaires bailleurs en 2026",
    excerpt:
      "Les obligations de la loi ALUR: diagnostics obligatoires, plafonds, zone tendue et encadrement des loyers.",
    category: "Juridique",
    date: "2026-02-15",
    updatedAt: '2026-02-15',
    readTime: "10 min",
  },
  {
    slug: "optimiser-fiscalite-loyers",
    title: "Optimiser la fiscalité de vos revenus locatifs en 2026",
    excerpt:
      "Régime réel, micro-foncier, LMNP: comment choisir le régime fiscal adapté à votre situation locative.",
    category: "Fiscalité",
    date: "2026-03-01",
    updatedAt: '2026-03-01',
    readTime: "9 min",
  },
  {
    slug: "quittance-loyer-pdf-gratuit",
    title: "Modèle de quittance de loyer PDF gratuit — Comment remplir une quittance conforme",
    excerpt:
      "Téléchargez notre modèle de quittance de loyer PDF gratuit et découvrez comment remplir chaque mention obligatoire. Quittance conforme loi 89-462 en 5 minutes.",
    category: "Gestion",
    date: "2026-04-14",
    updatedAt: '2026-04-14',
    readTime: "6 min",
    content: `## Qu'est-ce qu'une quittance de loyer ?

Une quittance de loyer est un document signé par le bailleur qui constate le paiement intégral du loyer et des charges par le locataire. Elle est remise sur demande du locataire et constitue une preuve de paiement.

La quittance doit être délivrée gratuitement dans un délai de **4 jours ouvrés** suivant le paiement. Son refus systématique constitue un manquement passible de sanctions.

## Les mentions obligatoires sur une quittance de loyer

Depuis la loi 89-462 du 6 juillet 1989, la quittance doit comporter :

- **Nom et adresse du bailleur**
- **Nom du locataire**
- **Adresse du logement**
- **Période de location concernée** (mois et année)
- **Montant du loyer principal** versé
- **Montant des charges** versées (si provisions)
- **Montant total versé**
- **Date du paiement**
- **Signature du bailleur**

En cas de paiement partiel, le bailleur n'est pas tenu de délivrer une quittance. Il peut délivrer un reçu.

## Comment remplir une quittance de loyer conforme : étape par étape

### Étape 1 : Vérifier le montant dû

Avant de délivrer une quittance, vérifiez que le montant payé correspond au loyer exigible. En cas de différence, délivrez la quittance pour le montant effectivement versé.

### Étape 2 : Rédiger l'en-tête

Indiquez vos nom et adresse en qualité de bailleur, ainsi que l'adresse complète du logement.

### Étape 3 : Identifier le locataire

Inscrivez le nom complet du locataire tel qu'il figure sur le bail.

### Étape 4 : Préciser la période de location

La quittance doit couvrir une période précise : le mois et l'année. Vous pouvez cumuler plusieurs mois sur une même quittance si le locataire paie trimestriellement.

### Étape 5 : Ventiler loyer et charges

Séparez bien le montant du loyer principal et le montant des charges (provisions ou forfait). La somme des deux donne le montant total versé.

### Étape 6 : Signer et remettre

La quittance doit être signée. Remettez-la au locataire dans les **4 jours ouvrés** suivant le paiement.

## Quittance de loyer et APL/CAF

Depuis la loi de finances 2020, les bailleurs doivent transmettre mensuellement les données de paiement à la CNAV via le dispositif DAT. La délivrance de quittances régulières facilite cette déclaration.

## Que faut-il éviter ?

- Ne demandez **jamais de paiement** pour la délivrance de la quittance (c'est gratuit)
- Ne délivrez pas de **fausse quittance** pour un montant supérieur au paiement réel
- N'omettez pas le **détail des charges** (le locataire y a droit)

## FAQ — Quittance de loyer gratuit

**Une quittance électronique est-elle valable ?**
Oui, depuis la loi du 24 mars 2014, la quittance peut être délivrée sous forme électronique (email, PDF) si le locataire ne s'y oppose pas.

**Le locataire peut-il exiger une quittance pour chaque paiement ?**
Oui, le locataire peut demander une quittance à chaque paiement. Le bailleur doit la délivrer dans les 4 jours ouvrés.

**Que faire si le locataire ne paie pas la totalité du loyer ?**
Le bailleur n'est pas obligé de délivrer une quittance en cas de paiement partiel. Il peut délivrer un reçu.

[CTA : Générez des quittances PDF conformes et automatiques avec RentReady — essai gratuit 14 jours]`,  },
  {
    slug: "lettre-relance-loyer-impaye-modele",
    title: "Lettre de relance pour loyer impayé — Modèle gratuit et conseils juridiques",
    excerpt:
      "Téléchargez notre modèle de lettre de relance pour loyer impayé. Conseils juridiques, délai légal, étapes de la procédure d'impayé. Gratuit.",
    category: "Gestion",
    date: "2026-04-17",
    updatedAt: '2026-04-17',
    readTime: "7 min",
    content: `Un loyer impayé est une situation stressante pour tout bailleur. Avant d'engager une procédure judiciaire, la lettre de relance est une étape obligatoire et indispensable. Découvrez comment la rédiger efficacement.

## Pourquoi envoyer une lettre de relance pour loyer impayé ?

La lettre de relance constitue la première démarche amiable à entreprendre dès le premier jour d'impayé. Elle marque le début de la procédure de recouvrement et permet souvent de résoudre le litige sans passer par les tribunaux.

Selon la loi du 6 juillet 1989, le bailleur peut commencer les démarches de recouvrement dès le premier jour de retard de paiement du loyer. Plus la relance est envoyée tôt, plus la procédure est rapide et moins les intérêts de retard s'accumulent.

## Modèle de lettre de relance pour loyer impayé

**Vos coordonnées :**
[Votre nom et prénom ou dénomination sociale]
[Adresse]
[Téléphone / Email]

**Coordonnées du locataire :**
[Nom et prénom du locataire]
[Adresse du bien loué]

**Objet : Relance pour loyer impayé — [numéro du bail]**

Madame, Monsieur,

Par la présente, je me permets de vous contacter concernant le loyer impayé relatif au bail conclu le [date du bail] pour le logement situé au [adresse du bien].

À ce jour, le montant de **[montant en euros] euros**, couvrant la période du [date début] au [date fin], demeure impayé.

Je vous demande de bien vouloir régler cette somme dans un délai de **8 jours** à compter de la réception du présent courrier.

En cas d'absence de paiement dans ce délai, je me verrai dans l'obligation d'engager une **procédure de recouvrement** auprès du tribunal compétent, ainsi que de mettre en œuvre les sanctions prévues au bail.

Je reste à votre disposition pour tout échange visant à résoudre cette situation à l'amiable.

Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

[Signature]

## Mise en demeure : l'étape suivante

Si le locataire ne réagit pas à votre lettre de relance dans le délai imparti, la **mise en demeure** est l'étape obligatoire suivante. Elle doit être envoyée en recommandé avec accusé de réception et mentionner explicitement les sommes dues, le délai de paiement, et les conséquences légales du non-paiement.

La mise en demeure ouvre droit à la **procédure de résiliation du bail** pour manquement grave du locataire à ses obligations (article 4 de la loi du 6 juillet 1989).

## Procédure judiciaire en cas d'impayé persistant

Si le locataire reste défaillant malgré la mise en demeure, deux voies sont possibles :

- **Assignation au tribunal judiciaire** : pour obtenir la résiliation du bail et l'expulsion. Le délai de procédure est généralement de 3 à 6 mois.
- **Procédure simplifiée (référé)** : plus rapide, elle permet d'obtenir une décision de justice en quelques semaines.

## Conseils pratiques pour éviter les loyers impayés

- Vérifiez systématiquement la **solvabilité du locataire** avant la signature du bail (revenus, emploi, historique locatif).
- Souscrivez une **Garantie Loyer Impayé (GLI)** pour vous protéger financièrement.
- Utilisez un **modèle de bail conforme** et vérifiez les clauses relatives aux sanctions en cas d'impayé.
- Envoyez vos lettres de relance **dès le premier jour de retard** pour accélérer la procédure.

## Questions fréquentes

**Quand envoyer une lettre de relance pour loyer impayé ?**
Dès le premier jour de retard de paiement. Plus la relance est envoyée tôt, plus la procédure de recouvrement est rapide.

**La lettre de relance est-elle obligatoire ?**
Elle n'est pas strictement obligatoire légalement, mais elle est indispensable pour constituer une trace écrite et engager ensuite la procédure judiciaire.

**Quel délai pour une mise en demeure après une lettre de relance ?**
En général, un délai de 8 à 15 jours est recommandé entre la lettre de relance et la mise en demeure.

**Le模型e de lettre de relance est-il gratuit ?**
Oui, notre modèle de lettre de relance pour loyer impayé est entièrement gratuit. Vous pouvez le personnaliser avec vos informations et l'envoyer en recommandé.

Besoin d'un outil pour gérer vos loyers et relancer automatiquement les impayés ? [Essayez RentReady gratuitement pendant 14 jours](/pricing).
`,
  },
  {
    slug: "charges-locatives-decompte-annualise",
    title: "Charges locatives : le guide complet du décompte annualisé",
    excerpt:
      "Charges locatives : comment établir le décompte annualisé, quelles sont les charges récupérables, quand envoyer le relevé au locataire. Guide complet 2026.",
    category: "Gestion",
    date: "2026-04-21",
    updatedAt: '2026-04-21',
    readTime: "8 min",
  },
  {
    slug: "assurance-loyer-impaye-gli",
    title: "Assurance loyer impayé (GLI) : comment protéger vos revenus locatifs",
    excerpt:
      "La Garantie Loyer Impayé (GLI) vous protège contre les impayés, dégradations et frais de procédure. Comparatif des offres et conseils pour bien choisir.",
    category: "Gestion",
    date: "2026-04-24",
    updatedAt: '2026-04-24',
    readTime: "7 min",
  },
  {
    slug: "quittance-loyer-mentions-obligatoires",
    title: "Quittance de loyer : mentions obligatoires et modèle gratuit",
    excerpt:
      "Quittance de loyer : toutes les mentions obligatoires selon la loi du 6 juillet 1989. Téléchargez un modèle gratuit et découvrez comment la générer automatiquement.",
    category: "Juridique",
    date: "2026-04-28",
    updatedAt: '2026-04-28',
    readTime: "5 min",
  },
  {
    slug: "calculer-rendement-locatif-brut-net",
    title: "Calcul rendement locatif brut et net — Formule et simulateur gratuit",
    excerpt:
      "Calculez le rendement locatif brut et net de votre investissement immobilier. Formule, exemple chiffré, et conseils pour maximiser votre rentabilité.",
    category: "Fiscalité",
    date: "2026-05-01",
    updatedAt: '2026-05-01',
    readTime: "6 min",
  },
  {
    slug: "etat-des-lieux-proprietaire-modele",
    title: "État des lieux : modèle gratuit et procédure pour propriétaires",
    excerpt:
      "État des lieux d'entrée et de sortie : modèle gratuit, checklist, et conseils pour protéger votre dépôt de garantie. Conforme décret 2016-382.",
    category: "Juridique",
    date: "2026-05-05",
    updatedAt: '2026-05-05',
    readTime: "6 min",
  },
  {
    slug: "bail-colocation-modele-clauses",
    title: "Bail de colocation : modèle et clauses essentielles en 2026",
    excerpt:
      "Bail de colocation : comment rédiger le contrat, quelles clauses ajouter, modèle gratuit. Droits et obligations des colocataires.",
    category: "Juridique",
    date: "2026-05-08",
    updatedAt: '2026-05-08',
    readTime: "7 min",
  },
  {
    slug: "bail-location-vide-2026",
    title: "Bail de location vide : guide complet 2026 — clauses, durée et obligations",
    excerpt:
      "Bail de location vide en 2026 : tout savoir sur les clauses obligatoires, la durée minimale de 3 ans, le dépôt de garantie, les charges et la révision de loyer.",
    category: "Juridique",
    date: "2026-04-14",
    updatedAt: '2026-04-14',
    readTime: "11 min",
    content: `## Qu'est-ce qu'un bail de location vide ?

Le bail de location vide, aussi appelé bail non meublé, est le contrat de location le plus courant en France. Il régit les rapports entre un propriétaire bailleur et son locataire dans le cadre d'une location d'un logement sans mobilier. Ce type de bail est encadrée par la loi du 6 juillet 1989, qui fixe les règles impératives que les deux parties doivent respecter.

Contrairement à la location meublée, le bail vide offre moins de flexibilité au propriétaire mais davantage de sécurité juridique. La durée minimale est de 3 ans (6 ans si le bailleur est une personne morale), ce qui constitue une garantie de stabilité pour le locataire tout en assurant au propriétaire une période d'occupation longue.

## Les mentions obligatoires du bail de location vide

Depuis la loi ALUR de 2014 et les évolutions législatives de 2025-2026, le contrat de bail doit impérativement contenir un certain nombre de mentions. L'absence de l'une d'entre elles peut entraîner la nullité de la clause concernée, voire du bail entier dans les cas les plus graves.

### Informations sur les parties

Le bail doit identifier précisément le bailleur et le locataire. Pour le bailleur, il convient de mentionner son nom, sa raison sociale s'il s'agit d'une personne morale, son domicile ou celui de son mandataire. Pour le locataire, le bail précise son état civil, sa profession et sa résidence. Si un garant est prévu, ses coordonnées complètes doivent également figurer dans le contrat.

### Description détaillée du logement

Le bien loué doit être décrit avec précision : adresse complète, superficie privative en loi Carrez, nombre de pièces, équipements présents (chauffage, eau chaude, ventilation). Depuis 2026, le bail doit aussi mentionner la classe énergétique du logement (étiquette A à G), sous peine de nullité de la clausegle.

Le Diagnostic de Performance Énergétique (DPE) doit être annexé au bail dès la signature. Un logement avec une étiquette energy rating很差 (F ou G) fait désormais l'objet d'obligations de travaux de rénovation selon le calendrier d'interdiction de location.

### Clause relative au loyer

Le montant du loyer doit être inscrit en toutes lettres et en chiffres. Si le logement est situé dans une zone tendue soumise à encadrement des loyers, le bail doit mentionner le loyer de référence majoré et vérifier que le loyer demandé ne dépasse pas le plafond autorisé. En cas de dépassement, le bailleur s'expose à des sanctions financières pouvant aller jusqu'à 5 000 euros pour une personne physique.

La clause de révision du loyer, basée sur l'Indice de Référence des Loyers (IRL), doit préciser la date de référence et la périodicité de la révision (généralement annuelle).

## Le dépôt de garantie : modalités en 2026

Le dépôt de garantie pour un bail vide ne peut pas dépasser un mois de loyer hors charges. Il est versé par le locataire lors de la signature du bail et doit être restitué dans un délai maximal de deux mois à compter de la remise des clés par le locataire.

Depuis la loi du 24 mars 2022, le dépôt de garantie doit être restitué avec le versement d'un montant égal si le bailleur retient tout ou partie de cette somme. En cas de retard, le solde restant dû produit des intérêts au taux légal. Le bailleur doit fournir un reçu mentionnant le montant du dépôt initial et les éventuelles déductions opérées.

### Déductions autorisées sur le dépôt de garantie

Le bailleur ne peut retenir des sommes sur le dépôt de garantie que pour :
- Les dégradations constatées à l'état des lieux de sortie, autres que l'usure normale
- Les sommes dues au titre des charges locatives non réglées
- Les impayés de loyer ou de charges
- Les frais de remise en état liés à un départ précipité du locataire

L'état des lieux de sortie, comparé à celui d'entrée, constitue la preuve déterminante pour justifier d'éventuelles retenues. En cas de litige, le juge des contentieux de la protection peut être saisi.

## Durée du bail et préavis

Le bail de location vide est conclu pour une durée de 3 ans si le bailleur est une personne physique, et de 6 ans s'il s'agit d'une personne morale (SCI, société immobilière, organisme public). Cette durée est un minimum légal : le bail peut être renouvelé par tacite reconduction pour une durée équivalente.

### Congé donné par le bailleur

Le bailleur peut donner congé à son locataire à l'échéance du bail, en respectant un préavis de 6 mois. Ce congé doit être motivé par l'un des trois motifs suivants :
- La reprise du logement pour habitation personnelle ou celle d'un descendant
- La vente du bien
- Un motif légitime et sérieux (incidents répétés, non-respect des obligations locatives)

Le congé doit être notifié par lettre recommandée avec accusé de réception, ou par acte d'huissier. Depuis 2025, le bailleur doit également fournir un justificatif de sa situation (attestation de changement de domicile, promesse de vente...) pour les congés pour vente.

### Congé donné par le locataire

Le locataire peut quant à lui donner congé à tout moment, avec un préavis de 3 mois. Ce délai est réduit à 1 mois dans certains cas : mutation professionnelle, perte d'emploi, nouvel emploi suite à CDD ou mutation, première installation comme locataire. Le locataire doit justifer de sa situation pour bénéficier du préavis réduit.

## Charges locatives et récupérables

Les charges locatives regroupent les dépenses supportées par le bailleur et récupérables auprès du locataire. Elles comprennent notamment les charges de copropriété, l'eau froide, le chauffage collectif, l'entretien des parties communes et des équipements.

Depuis la loi ELAN et les décrets d'application successifs, le bail doit distinguer clairement le loyer principal des charges. Le bailleur peutopter pour le régime réel ou le régime forfaitaire pour les charges. En zone tendue, les charges sont souvent intégrées dans un forfait, ce qui limite les régularisations annuelles.

### La régularisation annuelle des charges

Le bailleur doit procéder à une régularisation annuelle des charges locatives, en rapprochant les provisions versées par le locataire avec les charges réelles. Le relevé de charges doit être transmis au locataire dans un délai de quatre mois suivant la fin de l'année de référence (soit avant le 1er mai pour l'année civile).

Cette régularisation doit être transparente et détaillées, avec un tableau par type de charge. En cas de trop-perçu, le bailleur doit rembourser le solde dans un délai d'un mois après la régularisation. En cas de insuffisance, le bailleur peut réclamer le complément au locataire.

## Révision du loyer en cours de bail

La révision du loyer ne peut intervenir qu'une fois par an, à la date anniversaire du bail ou à une date précisée dans le bail. Elle est calculée sur la variation de l'IRL publié par l'INSEE, qui correspond à la moyenne des 12 derniers mois de l'indice.

La formule de révision est la suivante : nouveau loyer = loyer en cours × (IRL du trimestre de référence / IRL du même trimestre de l'année précédente).

En zone tendue, la révision est également encadrée : le loyer ne peut pas dépasser le loyer de référence majoré, sauf exception (travaux d'amélioration lourd, changement de caractéristiques du logement).

## Les obligations du locataire

Le locataire est tenu à plusieurs obligations fondamentales inscrites dans la loi du 6 juillet 1989 :
- Payer le loyer et les charges à terme échu
- User paisiblement du logement selon la destination contractuelle
- Répondre des dégradations survenues pendant la durée du bail
- Ne pas transformer le logement sans accord écrit du bailleur
- Permettre l'accès au logement pour les visites et travaux

La sous-location est interdite sauf accord préalable et écrit du bailleur. En cas de décès du locataire, les héritiers peuvent décider de poursuivre ou de résilier le bail.

## Les obligations du bailleur

Le bailleur a une obligation de délivrer un logement décent, en bon état d'usage et de réparation, avec les équipements mentionnés dans le bail. Il doit également :
- Assurer la jouissance paisible du logement
- Entretenir les travaux结构和 grosses réparations
- Garantir le locataire contre les vices et défauts de la chose louée
- Délivrer un logement conforme aux normes d'habitabilité

Depuis 2023, le bailleur doit s'assurer que le logement respecte les critères de décence définis par le décret n° 2017-312, qui couvre la surface habitable minimale (9 m² et 20 m³ au moins), l'absence de risques pour la santé et la sécurité, et la conformité des équipements.

## Résiliation et litiges

En cas de manquement grave par l'une des parties, l'autre peut saisir le juge pour obtenir la résiliation du bail. Le non-paiement du loyer et des charges constitue un manquement grave pouvant justifier une procédure d'expulsion, après commandement de payer demeuré infructueux.

Pour les litiges relatifs au bail (loyer, dépôt de garantie, état des lieux, charges), le locataire ou le bailleur peut saisir la commission départementalede conciliation (CDCS) avant toute procédure judiciaire, dans un délai de deux mois suivant la survenance du litige.

## Conclusion

Le bail de location vide en 2026 est un contrat strictement encadré par la loi, qui protège à la fois le locataire et le bailleur. La connaissance précise de ces règles est essentielle pour éviter les litiges et réussir sa location dans de bonnes conditions juridiques.

[CTA : Gérez vos baux et documents locatifs facilement avec RentReady — essayer gratuitement]`,
  },
  {
    slug: "bail-location-meuble-2026",
    title: "Bail de location meublée : tout savoir en 2026 — durée, loyer et obligations",
    excerpt:
      "Bail de location meublée en 2026 : durée de 1 an renouvelable, liste des meubles obligatoires, régime fiscal avantageux (LMNP/LMP) et règles de résiliation.",
    category: "Juridique",
    date: "2026-04-14",
    updatedAt: '2026-04-14',
    readTime: "10 min",
    content: `## Location meublée : définition et cadre juridique en 2026

La location meublée constitue une alternative attractive à la location vide pour les propriétaires qui souhaitent bénéficier d'une plus grande flexibilité. Elle se caractérise par la mise à disposition d'un logement équipé de mobilier suffisant pour permettre au locataire de dormir, manger et vivre normalement.

Le cadre juridique de la location meublée repose sur la loi du 6 juillet 1989 pour les résidences principales, et sur le Code civil pour les locations saisonnières et la location meublée de tourism. En 2026, les règles ont été renforcées par les lois successives visant à limiter les abus et à mieux encadrer les loyers dans les zones tendues.

## La liste des meubles obligatoires

L'une des différences fondamentales entre location vide et meublée réside dans l'obligation pour le bailleur de fournir un logement équipé. Le décret n° 2015-981 du 31 juillet 2015 établit la liste minimale des meubles que doit comporter un logement meublé :

### Mobilier de base pour la chambre
- Lit avec sommier
- Matelas en bon état
- Couverture ou couverture légère
- Rideaux opaques ou stores pour les chambres

### Mobilier de base pour le séjour
- Table et / ou bureau
- Chaises ou tabourets en nombre suffisant
- Étagères de rangement
- Luminaires

### Équipement de la cuisine
- Réfrigérateur avec compartiment freezer ou freezer séparé
- Plaque de cuisson (vitrocéramique, électrique ou gaz)
- Hotte aspirante ou système d'évacuation
- Four traditionnel ou four à micro-ondes
- Ustensiles de cuisine de base (casseroles, couverts, vaisselle)

### Équipements sanitaires et autres
- WC indépendant de la salle de bains
- Salle d'eau avec douche ou baignoire
- Lavabo avec miroir
- Table et/ou fer à repasser
- Aspirateur

L'absence d'un de ces éléments dans le bail peut entraîner la requalification du bail en location vide, avec des conséquences importantes sur la durée du bail, le dépôt de garantie et le régime fiscal applicable.

## Durée du bail meublé

Le bail meublé pour une résidence principale est conclu pour une durée minimale de un an, renouvelable par tacite reconduction. Contrairement au bail vide, le locataire peut donner son congé à tout moment, avec un préavis de un mois.

Le bailleur ne peut quant à lui donner congé qu'à l'échéance du bail, avec un préavis de 3 mois, et pour des motifs strictement limités :
- Reprise du logement pour habitation personnelle ou celle d'un descendant
- Vente du bien
- Motif légitime et sérieux

Cette asymétrie constitue l'un des principaux inconvénients du bail meublé pour le propriétaire : la liberté de partir à tout moment laissée au locataire peut générer de la vacance locative.

### Bail meublé en résidence services

Les règles diffèrent pour les locations meublées en résidence avec services (résidence étudiante, résidence pour seniors dépendants, résidence d'affaires). Ces baux sont soumis à des règles spécifiques prévues par la loi du 18 juin 2014, avec notamment la possibilité de conclure un bail d'une durée de 9 mois renouvelable pour les étudiants.

## Le loyer en location meublée

Le loyer d'un meublé est librement fixé par le bailleur, sous réserve des règles d'encadrement en zone tendue. Il est généralement plus élevé que celui d'un logement vide comparable, en raison de la prise en compte de la valeur d'usage des meubles et des équipements fournis.

En zone tendue (Paris, Lille, Lyon, Marseille, etc.), le loyer de relocation est soumis à encadrement :
- Le nouveau loyer ne peut dépasser le dernier loyer appliqué au précédent locataire, sauf exceptions (travaux d'amélioration d'au moins 50% de la dernière année de loyer, ou premier location depuis 18 mois minimum)
- Un complément de loyer peut être réclamé pour les caractéristiques exceptionnelles du logement

Le loyer peut être révisé chaque année selon une clause prévue dans le bail, généralement indexée sur l'IRL.

## Le dépôt de garantie en location meublée

Le dépôt de garantie en location meublée ne peut pas dépasser deux mois de loyer hors charges, contre un mois seulement pour la location vide. Ce dépôt est destiné à couvrir les éventuels impayés, dégradations ou charges non régularisées en fin de bail.

Le régime de restitution du dépôt de garantie est le même qu'en location vide : restitution dans un délai de deux mois à compter de la remise des clés, avec un reçu détaillé en cas de retenues.

## Charges et fiscalité en location meublée

Les charges locatives en meublée fonctionnent sur le même principe qu'en location vide : provision sur charges ou forfait charges. Le bail doit préciser le régime choisi.

### Le régime fiscal de la location meublée

La location meublée peut relever de deux statuts fiscaux :
- **LMNP (Loueur en Meublé Non Professionnel)** : le logement constitue la résidence principale du locataire, les recettes locatives sont imposées dans la catégorie des Bénéfices Industriels et Commerciaux (BIC)
- **LMP (Loueur en Meublé Professionnel)** : lorsque le montant des recettes dépasse 23 000 euros par an ou représente plus de la moitié des revenus du foyer, le bailleur est considéré comme professionnel

En LMNP, deux régimes d'imposition sont possibles :
- **Régime micro-BIC** : un abattement forfaitaire de 50% est appliqué sur les recettes, sans possibilité de déduire les charges réelles
- **Régime réel** : les recettes sont diminuées de l'ensemble des charges réellement supportées, avec possibilité d'amortir le mobilier et les travaux

En 2026, le régime réel est souvent plus avantageux pour les investisseurs, notamment en raison de la possibilité d'amortir le bien et le mobilier sur plusieurs années.

## Résiliation du bail meublé

La procédure de résiliation en location meublée diffère selon la partie qui initie le congé :

### Congé donné par le locataire
Le locataire peut donner congé à tout moment, sans avoir à justifier d'un motif, avec un préavis de un mois. Ce congé doit être notifié par lettre recommandée avec accusé de réception, ou par acte d'huissier.

### Congé donné par le bailleur
Le bailleur ne peut donner congé qu'à l'échéance du bail, avec un préavis de 3 mois. Le congé doit mentionner le motif de reprise ou de vente, et être accompagné des pièces justificatives (attestation de changement de domicile, promesse de vente).

En cas de litige sur la validité du congé ou sur la restitution du dépôt de garantie, le juge des contentieux de la protection est compétent.

## Comparaison bail vide vs bail meublé

| Critère | Bail vide | Bail meublé |
|---------|-----------|-------------|
| Durée minimale | 3 ans | 1 an |
| Préavis locataire | 3 mois | 1 mois |
| Préavis bailleur | 6 mois | 3 mois |
| Dépôt de garantie | 1 mois max | 2 mois max |
| Flexibilité | Faible | Élevée |
| Loyer | Libre (zone tendue encadré) | Libre (zone tendue encadré) |
| Fiscalité | Revenus fonciers | BIC (LMNP/LMP) |

## LesNOSNOS obligations respectives en location meublée

Le bailleur doit livrer un logement équipé conforme à la liste réglementaire, en bon état et avec des équipements fonctionnels. Il est tenu à une obligation d'entretien et de grosses réparations.

Le locataire doit user du logement et des équipements avec diligence, effectuer les petites réparations et maintenir le logement en bon état de propreté. Il doit également payer le loyer et les charges dans les délais impartis.

[CTA : Préparez vos contrats de location meublée et gérez vos biens easily avec RentReady — essayer gratuitement]`,
  },
  {
    slug: "garant-caution-solidaire",
    title: "Garant et caution solidaire en location : droits et obligations en 2026",
    excerpt:
      "Caution et garant en location : différence entre caution simple et solidaire, obligations du garant, procédure en cas de défaillance du locataire, et protection du garant.",
    category: "Juridique",
    date: "2026-04-14",
    updatedAt: '2026-04-14',
    readTime: "9 min",
    content: `## Caution et garant en location : clarification des termes

Dans le vocabulaire locatif, les termes de « caution » et de « garant » sont souvent utilisés de manière interchangeable, mais ils présentent des nuances juridiques importantes. La caution est la personne qui s'engage envers le bailleur à payer les sommes dues par le locataire en cas de défaillance de ce dernier. Le garant est un type particulier de caution, qui se porte garant de manière更加 solide.

En pratique, le garant est généralement une personne physique (parent, ami, proche) qui accepte de se porter caution pour un candidat locataire. L'acte de caution est formalisé par un document signé, appelé « acte de caution », qui décrit l'étendue et les modalités de l'engagement.

## Les différentes formes de caution

### La caution simple

Dans le cadre d'une caution simple, le bailleur doit d'abord mettre en demeure le locataire de payer, puis attendre un éventuel refus ou une inaction de ce dernier avant de pouvoir réclamer le paiement à la caution. La caution simple bénéficie ainsi d'un terme extinctif : elle n'est tenue que si le locataire ne paie pas lui-même.

### La caution solidaire

La caution solidaire, quant à elle, permet au bailleur de s'adresser directement à la caution sans avoir à préalablement épuiser les recours contre le locataire. La caution solidaire est engagée dès le premier impayé, sans que le bailleur ait à prouver l'insolvabilité préalable du locataire.

Cette forme de caution est privilégiée par les bailleurs car elle offre une sécurité maximale. Elle est devenue la norme dans la plupart des contrats de location.

### La personne morale caution

Depuis la loi ALUR, les personnes morales (banques, associations, entreprises) peuvent se porter caution pour une location. Les établissements bancaires proposent des garanties de loyer impayé (GRL), souvent avec des conditions de ressource et un plafonnement des sommes garantie.

Les associations de cautionnement locatif, agréées par l'État, offrent également ce service aux locataires qui peinent à trouver un garant.

## L'acte de caution : mentions obligatoires

L'acte de caution doit contenir un certain nombre de mentions légales pour être valable. L'article 22-1 de la loi du 6 juillet 1989 impose que l'acte de caution soit établi sur papier timbré et mentionne :

- L'identité de la caution (nom, adresse, date et lieu de naissance)
- La nature de l'engagement (simple ou solidaire)
- Le montant maximum garanti (en principal, intérêts et frais)
- La durée de l'engagement
- L'objet de la location (adresse du bien)
- Les coordonnées du bailleur

Depuis 2025, l'acte de caution doit également reproduire textuellement les dispositions légales relatives à la protection de la caution, notamment l'obligation pour le bailleur d'informer la caution en cas de défaillance du locataire.

L'absence d'une de ces mentions peut entraîner la nullité de l'engagement de caution.

## Les obligations du garant en cas de défaillance du locataire

En cas de défaillance du locataire (impayé de loyer, charges, dégradations), le bailleur peut mettre en demeure la caution de payer. Cette mise en demeure doit intervenir dans un délai raisonnable following the first impayé.

La caution solidaire qui règle les sommes dues au bailleur dispose de droits de recours contre le locataire principal : elle est subrogée dans les droits du bailleur pour récupérer les sommes avancées.

### Procédure de mise en demeure

Le bailleur doit envoyer une lettre recommandée avec accusé de réception à la caution, mentionnant :
- Le montant des sommes dues (loyer, charges, intérêts de retard)
- La référence du bail
- Le délai de règlement

En cas d'inaction de la caution, le bailleur peut saisir le juge des contentieux de la protection pour obtenir la condamnation de la caution au paiement.

## La protection de la caution

La loi offre plusieurs mécanismes de protection à la caution, qui limitent son engagement et lui permettent de contester les demandes excessives du bailleur.

### L'engagement limité dans le temps

L'engagement de la caution ne peut pas dépasser la durée du bail initial majorée d'une période supplémentaire. L'engagement à durée indéterminée est interdit depuis la loi du 17 mai 2011.

Depuis 2025, l'acte de caution doit également prévoir une clause de tacite reconduction limitée : si le bail se poursuit au-delà de sa durée initiale, la caution doit être informée et donner son accord exprès pour le renouvellement de son engagement.

### Le plafonnement de l'engagement

L'engagement de la caution est limité à un montant total, qui doit être mentionné dans l'acte. Ce montant ne peut pas être indéterminé : il doit être chiffré.

Par ailleurs, le montant mensuel garanti ne peut pas excéder le montant du loyer charges comprises, multiplié par un coefficient qui ne peut dépasser 1,5.

### L'information annuelle du bailleur

Depuis 2022, le bailleur doit informer annuellement la caution de l'existence d'impayés. À défaut, la caution peut contester les demandes de paiement qui lui sont adressées sans avoir été tenue informée.

La caution peut également demander au bailleur des informations sur la situation locative (état des lieux, évolution du loyer) une fois par an.

## Garant etAPL : les dispositifs complémentaires

De nombreux locataires sollicitent un garant pour compenser l'absence de CDI ou des revenus jugés insuffisants par le bailleur. Certains dispositifs permettent de réduire la dépendance au garant traditionnel.

### La garantie VISALE

La garantie VISALE, financée par l'État et gérée par Action Logement, est une garantie gratuite qui se porte caution à la place d'un garant personne physique. Elle couvre les impayés de loyer et charges jusqu'à 36 mois, avec un plafond de 9 mois de loyer charges comprises.

Les conditions d'éligibilité : salariés de plus de 18 ans en mobilité professionnelle, jeunes de moins de 30 ans en démarche d'insertion professionnelle ou sociale, et ménages under certain conditions de ressource.

### La garantie LOCA-PASS

Le dispositif LOCA-PASS, également géré par Action Logement, permet aux propriétaires d'obtenir une avance de fonds en cas d'impayé, avec prise en charge ensuite par Action Logement.

## Caution et bail mobilité

Le bail mobilité, créé en 2018 et en vigueur depuis 2019, est incompatible avec la demande de caution par le bailleur. Ce bail de courte durée (1 à 10 mois) vise à faciliter l'accès au logement pour les personnes en transition professionnelle ou formation. L'absence de caution est compensée par d'autres garanties (prélèvement automatique, assurance GLI).

## Comment se protéger en tant que garant ?

Avant de se porter garant, il est essentiel d'évaluer sa capacité à assumer cet engagement en cas de défaillance du locataire. Several conseils pratiques :

- Exiger une copie du bail et vérifier les conditions locatives (loyer, charges, état du logement)
- Se limiter à un montant et une durée d'engagement précis
- Demander au bailleur de tenir informé des éventuels retards de paiement
- Souscrire une assurance protection juridique pour se défendre en cas de litige

[CTA : Gérez vos garant et vos documents locatifs facilement avec RentReady — essayer gratuitement]`,
  },
  {
    slug: "notice-conge-locataire",
    title: "Congé du locataire : comment y procéder légalement en 2026",
    excerpt:
      "Congé du locataire : préavis de 3 mois (ou 1 mois sous conditions), lettre recommandée avec accusé de réception, état des lieux de sortie et restitution du dépôt de garantie.",
    category: "Juridique",
    date: "2026-04-14",
    updatedAt: '2026-04-14',
    readTime: "8 min",
    content: `## Le congé du locataire : un droit fondamental

Le locataire a le droit de mettre fin à son bail de location à tout moment, sans avoir à justifier d'un motif particulier. Ce droit, issu de la loi du 6 juillet 1989, constitue l'une des protections essentielles du locataire en France. Il s'exerce par la notification d'un congé (aussi appelé « délai de préavis »).

La seule obligation à la charge du locataire qui souhaite partir est de respecter un délai de préavis, dont la durée dépend de la nature du bail et de la zone géographique dans laquelle se situe le logement.

## La durée du préavis selon les cas

### Préavis de 3 mois en location vide

En location vide, le délai de préavis légal est de 3 mois. Ce délai court à compter de la date de notification du congé au bailleur, qui peut être effectuée par :
- Lettre recommandée avec accusé de réception
- Acte d'huissier
- Remise en main propre contre émargement ou récépissé

Le locataire qui ne respecte pas le délai de préavis de 3 mois reste redevable du loyer jusqu'à l'échéance du délai, sauf si le bailleur同意 à un départ anticipé ou si un nouveau locataire entre dans les lieux.

### Préavis réduit à 1 mois

Dans certaines circonstances particulières, le locataire peut bénéficier d'un délai de préavis réduit à 1 mois au lieu de 3. Ce cas s'applique notamment :

- En cas de mutation professionnelle (nécessité de quitter le logement pour un nouvel emploi)
- En cas de perte d'emploi (licenciement, fin de CDD)
- En cas de nouvel emploi suite à unemployment (embauche en CDD, CDI ou mutation)
- En cas de première installation comme locataire (le locataire qui emménage pour la première fois peut partir rapidement s'il s'agit de sa première location)
- En cas de maladie grave ou d'invalidité nécessitant un changement de logement
- En cas de bénéficiaires du RSA ou de l'allocation adulte handicappé (sous conditions de ressource)

Le locataire doit fournir les pièces justificatives de sa situation insieme avec le congé pour bénéficier du préavis réduit.

### Bail meublé : préavis de 1 mois

En location meublée, le délai de préavis est automatiquement de 1 mois, sans condition particulière. C'est l'un des avantages majeurs du bail meublé pour le locataire.

### Bail mobilité : pas de préavis minimum

Le bail mobilité, d'une durée de 1 à 10 mois, ne prévoit pas de délai de préavis formel. Le locataire peut partir à tout moment, sous réserve de respecter un délai raisonnable de préavis contractuellement prévu.

## Comment rédiger la lettre de congé ?

La lettre de congé doit contenir plusieurs mentions obligatoires pour être valable :

1. **Identité du locataire** : nom, prénom, adresse actuelle
2. **Adresse du logement loué**
3. **Date de notification du congé** (date d'envoi en recommandé)
4. **Date d'effet du congé** (fin du préavis)
5. **Signature du locataire**

Pour bénéficier du préavis réduit, la lettre doit également mentionner le motif invoqué (mutation, perte d'emploi, etc.) et être accompagnée des justificatifs.

En cas de préavis réduit, le locataire reste redevable du loyer jusqu'à la fin du préavis effectif, même si le motif invoqué justifierait un départ immédiat.

## L'état des lieux de sortie

Le congé du locataire donne lieu à un état des lieux de sortie, qui doit être comparé à l'état des lieux d'entrée pour déterminer d'éventuelles retenues sur le dépôt de garantie.

L'état des lieux de sortie doit être réalisé de manière contradictoire, en présence du bailleur (ou de son représentant) et du locataire. En cas d'absence de l'une des parties, un huissier peut être sollicité.

### Ce qui est considéré comme usure normale

Le locataire n'est pas tenu responsable de l'usure normale résultant du temps et de l'usage paisible du logement. Par exemple :
- Les petites marques sur les murs liées à la vie quotidienne
- L'usure des revêtements de sol dans les zones de passage
- Les traces de vis sans outillage visible dans les murs (sauf si trop nombreuses)

Ce qui constitue des dégradations
Les dégradations excédant l'usure normale donnent lieu à une retenue sur le dépôt de garantie. Par exemple :
- Trous importants dans les murs (plus que les simples traces de clous)
- Vitre cassée
- Équipements endommagés par négligence
- Taches importantes sur les sols ou murs

## La restitution du dépôt de garantie

Le dépôt de garantie doit être restitué au locataire dans un délai de deux mois à compter de la remise des clés. Ce délai court à partir de la date de l'état des lieux de sortie.

Le bailleur doit fournir un reçu détaillé en cas de retenues, mentionnant les montants déduits et les justifications (dégradations, charges impayées).

En cas de retard dans la restitution du dépôt de garantie, le bailleur doit des intérêts de retard au taux légal pour la période excédant les deux mois.

### Litiges sur la restitution

En cas de contestation du montant retenu par le bailleur, le locataire peut :
- Envoyer une lettre de mise en demeure de restituer le solde
- Saisir la commission départementalede conciliation (CDCS)
- Saisir le juge des contentieux de la protection

Le recours gracieux auprès du bailleur est recommandé avant toute procédure, car de nombreux litiges se résolvent par la négociation.

## Les démarches pratiques lors d'un départ

Avant de quitter le logement, le locataire doit :
1. Signifier le congé au bailleur (lettre recommandée, acte d'huissier ou remise en main propre)
2. Organiser l'état des lieux de sortie
3. Effectuer les démontages et emmballages nécessaires
4. Restituer les clés au bailleur
5. Faire suivre son courrier
6. Résilier les contrats d'énergie et d'assurance habitation
7. Mettre à jour son adresse auprès des administrations (CPAM, Impôts, CAF)

[CTA : Générez vos lettres de congé et gérez vos état des lieux avec RentReady — essayer gratuitement]`,
  },
  {
    slug: "preavis-depart-locataire",
    title: "Préavis de départ du locataire : délais légaux et procédure en 2026",
    excerpt:
      "Préavis de départ en location : délai légal de 3 mois (1 mois sous conditions), calcul du préavis, réduction du délai en cas de mutation, perte d'emploi ou premier logement.",
    category: "Juridique",
    date: "2026-04-14",
    updatedAt: '2026-04-14',
    readTime: "7 min",
    content: `## Le préavis de départ : une étape obligatoire

Le préavis de départ constitue une formalité incontournable pour tout locataire qui souhaite mettre fin à son bail. Ce délai, fixé par la loi, permet au bailleur de préparer la relocation du logement et de limiter la vacance locative.

La durée du préavis dépend de plusieurs facteurs : la nature du bail (vide ou meublé), la localisation du logement (zone tendue ou non), et la situation personnelle du locataire (mutation, perte d'emploi, etc.).

## Les durées de préavis en vigueur en 2026

### Location vide : 3 mois

En location vide non meublée, la durée de préavis légale est de trois mois. Ce délai s'applique sur l'ensemble du territoire français, sauf cas de réduction légale.

Le préavis court à partir de la date de notification efectiva du congé au bailleur :
- Date d'accusé de réception pour une lettre recommandée
- Date de signification pour un acte d'huissier
- Date de remise en main propre pour une remise contre récépissé

### Location meublée : 1 mois

En location meublée, la durée de préavis est réduite à un mois. Cette différence reflète la plus grande flexibilité attendue dans les locations meublées, souvent considérées comme des solutions d'hébergement temporaire ou de transition.

Le préavis d'un mois s'applique automatiquement, sans que le locataire ait à justifier d'un motif particulier.

### Bail mobilité : flexibilité maximale

Le bail mobilité, conclu pour une durée de 1 à 10 mois, offre une grande liberté de départ. Le locataire peut quitter le logement à tout moment, sous réserve d'un délai de préavis contractuellement prévu (en pratique, souvent 1 mois).

## Les cas de préavis réduit à 1 mois en location vide

Depuis la loi ALUR de 2014, le locataire en location vide peut bénéficier d'un préavis réduit à un mois dans plusieurs cas précis, definidos à l'article 15 de la loi du 6 juillet 1989.

### Mutatio professionnelle

Le locataire qui-change de lieu de résidence en raison d'une mutation professionnelle, d'une nomination, ou d'un changement d'emploi peut bénéficier du préavis réduit. Ce cas inclut :
- Les salariés qui changent d'employeur et doivent déménager
- Les fonctionnaires nommés dans une autre ville
- Les militaires mutés

### Perte d'emploi

La perte d'emploi (licenciement, fin de CDD, rupture conventionnelle) justifie un préavis réduit, sous réserve de la présentation des justificatifs :
- Attestation de l'employeur
- Notification de fin de contrat
- Attestation Pole Emploi

### Nouvel emploi

L'obtention d'un nouvel emploi (CDI, CDD long, mission d'intérim longue) peut également justifier le préavis réduit, notamment si le nouvel emploi nécessite un déménagement.

### Première installation

Le locataire qui emménage pour la première fois dans un logement peut, en cas de besoin, bénéficier du préavis réduit lors de son premier départ. Ce cas vise à faciliter l'accès au logement pour les jeunes.

### Situation de vulnérabilité

Les locataires beneficiant du RSA, de l'allocation adulte handicappé, ou de l'allocation d'éducation de l'enfant handicappé peuvent également prétendre au préavis réduit.

## Comment calculer le préavis ?

Le préavis commence à courir le jour de la réception de la lettre recommandée par le bailleur, ou le jour de la signification de l'acte d'huissier.

Par exemple, un congé notifié le 15 avril avec un préavis de 3 mois prendra fin le 15 juillet. Le locataire est redevable des loyers d'avril (partie postérieure au congé), mai, juin et juillet (partie antérieure au terme).

Avec un préavis réduit à 1 mois, le congé notifié le 15 avril prendra fin le 15 mai.

### Mois incomplet

Si la date de fin du préavis tombe un jour qui n'existe pas dans le mois (par exemple, le 31 février), le préavis s'achève le dernier jour du mois concerné.

## Les conséquences du non-respect du préavis

Le locataire qui quitte le logement avant la fin du préavis sans accord du bailleur reste redevable du loyer et des charges pour la période restante. Le bailleur peut réclamer :
- Les loyers restants jusqu'à l'échéance du préavis
- Eventuellement les charges locatives correspondantes

Cette obligation de payer les loyers restants peut être atténuée si le bailleur parvient à relouer le logement avant la fin du préavis. Dans ce cas, le locataire n'est tenu de payer que la différence entre les deux loyers.

### L'accord du bailleur pour un départ anticipé

Le bailleur peut accepter de dispenser le locataire du préavis restant. Cette dispense doit être écrite (courrier, mail). En cas de dispense, le locataire n'est plus tenu au paiement des loyers postérieurs à la date convenue.

## Le dépôt de garantie et le préavis

Le préavis n'a pas d'incidence directe sur le dépôt de garantie. Quel que soit le délai de préavis applicable, le bailleur doit restituer le dépôt de garantie dans les deux mois suivant la remise des clés, déduction faite des sommes légitimement retenues.

Si le locataire part avant la fin du préavis (sans dispense), il reste redevable des loyers mais le dépôt de garantie doit toujours être restitué dans les délais légaux.

## Préavis et état des lieux

L'état des lieux de sortie doit être réalisé à la fin du préavis, lors de la remise des clés. Le bailleur ne peut pas obliger le locataire à réaliser l'état des lieux avant la fin du préavis, sauf si le locataire accepte de rendre les clés en avance.

## Préavis et charges

Pendant la durée du préavis, le locataire continue de payer les charges locatives selon les modalités habituelles (provisions mensuelles ou forfait). Ces charges seront régularisées lors du départ.

## Les pièges à éviter

Voici les erreurs fréquentes lors d'un départ :

1. **Oublier d'envoyer le congé en recommandé** : la notification en main propre est possible mais difficile à prouver. Le recommandé avec accusé de réception constitue la preuve recevable.
2. **Ne pas joindre les justificatifs** : pour bénéficier du préavis réduit, les pièces justificatives doivent être jointes au congé.
3. **Partir sans organizer d'état des lieux** : sans état des lieux de sortie, le locataire ne pourra pas contester d'éventuelles retenue sur le dépôt.
4. **Oublier de résilier les contrats** : les contrats d'énergie et d'assurance doivent être résiliés separately.

[CTA : Calculez votre préavis et générez votre lettre de congé avec RentReady — essayer gratuitement]`,
  },
  {
    slug: "loyer-encadrement-paris-2026",
    title: "Encadrement des loyers à Paris 2026 : zones, plafonds et exceptions",
    excerpt:
      "Encadrement des loyers à Paris : les plafonds 2026 par zone et par type de logement, les exceptions, les recours en cas de dépassement et les sanctions encourues par le bailleur.",
    category: "Juridique",
    date: "2026-04-14",
    updatedAt: '2026-04-14',
    readTime: "10 min",
    content: `## L'encadrement des loyers à Paris : un dispositif renforcé

L'encadrement des loyers est un dispositifanti-squat qui vise à réguler les prix de location dans les zones où le marché locatif est tendu. Paris fait partie des villes soumis à ce dispositif depuis le 1er août 2015, avec une interruption entre 2018 et 2020, puis un retour progressif.

En 2026, l'encadrement des loyers à Paris couvre l'ensemble des locations de logements vides et meublés constituant la résidence principale du locataire, à l'exception de quelques catégories spécifiques (logements conventionnés, HLM, locations saisonnières).

## Le fonctionnement de l'encadrement des loyers

Le dispositif d'encadrement des loyers repose sur un système de loyers de référence, publicados par arrêté préfectoral chaque année. Ces loyers de référence sont calculés à partir des données collectées sur les loyers pratiqués dans chaque secteur de la ville.

### Les trois catégories de loyers de référence

Pour chaque catégorie de logement (type, époque de construction, localisation), trois montants sontulados :

1. **Loyer de référence minoré** : en dessous de ce seuil, le loyer est considéré comme anormalement bas
2. **Loyer de référence中间** : le loyer médian pratiqué dans le secteur
3. **Loyer de référence majoré** : le plafond au-delà duquel le loyer est considéré comme excessif

Le loyer appliqué lors d'une nouvelle location ou d'un renouvellement ne peut pas dépasser le loyer de référence majoré, sauf exceptions prévues par la loi.

### Le complément de loyer exceptionnel

Un bailleur peut appliquer un complément de loyer exceptionnel si le logement présente des caractéristiques de localisation ou de confort exceptionnelles :
- Vue exceptionnelle (vue sur monument, parc, eau)
- Terrasse ou balcon de grande taille
- Standing particulèrement élevé
- Dernier étage avec vue dégagée

Ce complément doit être mentionné dans le bail et justifié. Il ne peut pas dépasser 20% du loyer de référence majoré, sauf exceptions accordées par la commission de coordination des contrôles de la loi.

## Les zones géographiques à Paris

Paris est divisée en 17 quartiers administratifs pour l'application de l'encadrement des loyers. Cependant, les loyers de référence peuvent varier à l'échelle de la ville entière, avec des différenciations selon les secteurs.

La préfecture de police de Paris publie chaque année un arrêté fixant les loyers de référence par catégorie de logement et par secteur géographique. Pour 2026, les loyers de référence ont été mis à jour en fonction de l'évolution du marché.

### Exemple de loyers de référence 2026 (approximatifs, à vérifier auprès de la préfecture)

Pour un appartement vide de 2 pièces en époque récente (post-1970) :
- Loyer de référence minoré : environ 15 à 18 €/m²/mois selon le secteur
- Loyer de référence中间 : environ 20 à 24 €/m²/mois
- Loyer de référence majoré : environ 25 à 30 €/m²/mois

Pour un appartement de 3 pièces dans le même catégorie :
- Les loyers au m² sont généralement légèrement inférieurs, mais le total reste plus élevé

## Les exceptions à l'encadrement

Tous les logements ne sont pas soumis à l'encadrement des loyers à Paris. Certaines catégories sont expressly exclues du dispositif :

### Logements non soumis
- Logements HLM
- Logements conventionnés Anah
- Locations saisonnières
- Logements de fonction
- Meublés touristiques (soumis à un autre encadrement)
- Logements neufs (moins de 10 ans depuis l'achèvement)
- Locations согласованные dans le cadre d'une procédure d'acquisition
- Logements withinstructures adaptées (résidences sociales, pensions de famille)

### Dérogations au dépassement du plafond

Le bailleur peut dépasser le loyer de référence majoré dans plusieurs cas :

1. **Travaux d'amélioration** : si des travaux d'un montant supérieur ou égal à 50% de la valeur annuelle du dernier loyer ont été réalisés depuis le départ du précédent locataire
2. **Logement with characteristics exceptionnosti** : voir le complément de loyer exceptionnel ci-dessus
3. **Premier renouvellement depuis 18 mois de vacance** : si le logement est vacant depuis au moins 18 mois, le bailleur peut appliquer un loyer libre
4. **Loyer précédemment supérieur** : si le dernier loyer appliqué au précédent locataire était lui-même supérieur au plafond, le nouveau loyer peut être maintenu à ce niveau (encadrement duDecrease only)

## Les recours en cas de dépassement

Le locataire qui constate que son loyer dépasse le plafond applicable peut agir de plusieurs manières :

### Saisir la commission de conciliation

La commission départementalede conciliation (CDCS) de Paris peut être saisie gratuitement pour trouver un accord avec le bailleur. La saisine doit intervenir dans un délai de 3 mois suivant la signature du bail.

### Réduire unilatéralement son loyer

Depuis la loi ELAN, le locataire peut, sous certaines conditions, réduire unilatéralement son loyer s'il estime qu'il dépasse le loyer de référence majoré. Cette réduction doit être notifiée au bailleur par lettre recommandée avec accusé de réception, et ne peut pas intervenir pendant les 3 premiers mois du bail.

### Saisir le juge

En cas d'échec de la conciliation, le locataire peut saisir le juge des contentieux de la protection pour obtenir la réduction du loyer.

## Les sanctions en cas de dépassement

Le bailleur qui applique un loyer supérieur au loyer de référence majoré sans bénéficier d'une exception prévue par la loi s'expose à :

- Une contravention de 5e classe, pouvant aller jusqu'à 5 000 euros pour une personne physique (10 000 euros pour une personne morale)
- La répétition de l'indu : le locataire peut réclame le remboursement des loyers indûment perçus, sur une durée maximale de 5 ans

La connaissance du dispositif par le bailleur est présumée : l'administration n'a pas à prouver que le bailleur avait conscience de dépasser le plafond.

## L'encadrement des loyers et la relocation

Lors d'une nouvelle location (relocation), le bailleur ne peut pas fixer un loyer supérieur au dernier loyer appliqué au précédent locataire, sauf :
- Si le précédent loyer était lui-même inférieur au nouveau plafond applicable
- Si des travaux d'amélioration ont été réalisés
- Si le logement a été vacant pendant 18 mois minimum

Ce mécanisme, appelé « encadrement à la baisse », a été suspendu et rétabli à plusieurs reprises. En 2026, il est en vigueur et impose aux bailleurs une vigilance particulière lors des relocations.

## L'évolution du dispositif en 2026

Les plafonds de loyer sont actualisés chaque année en fonction de l'évolution de l'IRL et des données du marché. Pour 2026, les arrêtés préfectoraux ont intégré les dernières évolutions du marché locatif parisien, avec une augmentation modérée des loyers de référence dans certains secteurs.

[CTA : Vérifiez si votre loyer respecte les plafondsparisiens avec RentReady — essayer gratuitement]`,
  },
  {
    slug: "sci-gestion-locative",
    title: "SCI et gestion locative : avantages, contraintes et fonctionnement en 2026",
    excerpt:
      "SCI et location : les avantages fiscaux et patrimoniaux de la gestion locative en SCI, la création, la comptabilité, les obligations déclaratives et les pièges à éviter.",
    category: "Fiscalité",
    date: "2026-04-14",
    updatedAt: '2026-04-14',
    readTime: "11 min",
    content: `## Qu'est-ce qu'une SCI ?

La Société Civile Immobilière (SCI) est une structure juridique créée spécifiquement pour détenir et gérer un ou plusieurs biens immobiliers. Elle permet à plusieurs personnes (parents, enfants, associés externes) de se regrouper pour acquérir et gérer ensemble des biens locatifs.

La SCI est régie par les articles 1845 et suivants du Code civil. Elle doit comporter au moins deux associés, sauf dispense (SCI à associé unique, possible depuis 2010). Sa durée maximale est de 99 ans, renouvelable.

La SCI présente plusieurs avantages par rapport à la détention directe d'un bien immobilier, notamment sur le plan fiscal et successorale.

## Les avantages de la SCI pour la gestion locative

### Transmission facilitée du patrimoine

L'un des principaux attraits de la SCI réside dans la transmission simplifiée des biens immobiliers. Les parts sociales de SCI peuvent être cédées entre vifs (donation, vente) avec plusieurs avantages :

- Possibilité de donation de parts avec abattement de 100 000 euros par donateur tous les 15 ans (pour chaque enfant, par exemple)
- Possibilité de donation démembrée ( nue-propriété / usufruit) avec des règles avantageuses
- Poursuite de la société malgré le décès d'un associé : la SCI n'est pas dissoute par le décès

Cette caractéristique rend la SCI particulièrement adaptée aux investisseurs qui souhaitent préparer la transmission de leur patrimoine locatif à leurs enfants.

### Gestion simplifiée entre associés

La SCI permet une gestion centralisée et démocratiquedes biens immobiliers. Les décisions sont prises selon les règles définies dans les statuts (souvent à la majorité des parts), ce qui évite les situations de blocage en cas de désaccord entre indivisaires.

Les associés peuvent définir dans les statuts :
- Les règles de vote pour les décisions importantes (achat, vente, emprunt)
- La répartition des bénéfices et des charges
- Les conditions d'entrée et de sortie d'un nouvel associé

### Avantages fiscaux en location meublée

En location meublée via une SCI à l'IR (impôt sur le revenu), les revenus locatifs sont imposés dans la catégorie des BIC, ce qui permet de bénéficier du régime réel et d'amortir le bien ainsi que le mobilier. L'amortissement permet de réduire artificiellement le bénéfice imposable, sans pour autant déprécier réellement la valeur du bien.

### Possibilité d'opter pour l'IS

La SCI peut, sous certaines conditions, opter pour l'impôt sur les sociétés (IS). En location nue, cette option peut présenter un intérêt dans certains cas de figure :
- Plus-values de cession imposées à un taux réduit (19% + CSG-CRDS)
- Possibilité de déduire les amortissements du bien
- Intérêt en cas de taux d'endettement élevé (les intérêts d'emprunt sont déductibles)

En location meublée, la SCI à l'IS est souvent le cadre juridique privilégié pour bénéficier pleinement des avantages du LMNP.

## Les contraintes de la SCI

### Obligations comptables

La SCI est soumise à des obligations comptables :
- Tenue d'une comptabilité simplifiée (régime des micro-entreprises si CA < 77 700 € en 2026)
- Sinon, comptabilité commerciale complète
- Établissement des comptes annuels (bilan, compte de résultat, annexe)
- Dépôt des comptes annuels au greffe du tribunal de commerce

### Déclarations fiscales

La SCI doit déposer chaque année :
- Une déclaration de résultats (CERFA 2031) auprès du service des impôts des entreprises
- Une déclaration de TVA si elle est assujettie
- Une déclaration de résultats dans la catégorie des BIC ou des revenus fonciers selon le régime

### Coût de création et de fonctionnement

Créer une SCI génère des coûts :
- Frais de rédaction des statuts (chez un avocat, un notaire ou en ligne)
- Frais d'enregistrement au greffe du tribunal de commerce
- Frais de publication au Journal Officiel
- Frais de gestion annuelle (comptable, expert-comptable)

Ces coûts sont à mettre en balance avec les avantages fiscaux et patrimoniaux.

## La gestion locative au sein d'une SCI

###SCI et gérant

La SCI est dirigée par un gérant, personne physique ou morale, désigné par les associés. Le gérant peut être rémunéré et dispose des pouvoirs nécessaires pour adminter la société au quotidien.

Le gérant assure :
- La signature des contrats de location au nom de la SCI
- Le recouvrement des loyers
- L'ordering des travaux et des factures
- La représentation de la société auprès des administrations

### Le contrat de location et la SCI

Le bail est signé par la SCI en qualité de bailleur. Le locataire verse ses loyers sur le compte bancaire de la société. Ces loyers sont des produits de la SCI, qui les distribue ensuite aux associés sous forme de dividendes (si IS) ou qui les intègre dans le résultat de la SCI (si IR).

## Les pièges à éviter avec une SCI

### Confusion entre patrimoine personnel et patrimoine social

Les biens détenus par la SCI sont des biens sociaux. Ils appartiennent à la société, pas directement aux associés. Cette séparation peut compliquer certainessimples opérations (emprunt personnel garantie par un bien de la SCI, par exemple).

### Responsabilité des associés

En SCI, la responsabilité des associés est limitée aux apports. Cependant, le gérant peut voir sa responsabilité personnelle engagée en cas de faute de gestion.

### Sortie de la SCI

Sortir d'une SCI (vente de parts, dissolution) peut être complexifiée par :
- La difficulté à trouver un acquéreur pour des parts de SCI
- Les droits de mutation potentially élevés
- Les plus-values potentiellement imposables

## SCI et LMNP : une combination puissante

La combinaison SCI + LMNP est frequentemente utilisée par les investisseurs qui souhaitent :
- Détenir un bien enSCI pour faciliter la transmission
- Louer meublé pour bénéficier du régime fiscal avantageux du LMNP
- Opter pour l'IS pour amortir le bien et réduire l'assiette fiscale

Cette structure nécessite une analyse approfondie avec un conseiller fiscal, car les règles sont complexes et évolutives.

## Quand créer une SCI ?

La SCI est particulièrement adaptée dans les cas suivants :
- Projet d'investissement à plusieurs (parents/enfants, associés)
- Volonté de préparer la transmission du patrimoine
- Investissement dans l'immobilier de location meublée avecopt for IS
- Volonté de protéger certains biens dans une structure dédiée

Elle l'est moins pour :
- Un investissement simple sans complexité familiale
- Des biens à faible valeur (les frais de fonctionnement serait disproportionnés)
- Des investors with only revenues foncières modestes

[CTA : Gérez vos locations en SCI plus facilement avec RentReady — essayer gratuitement]`,
  },
  {
    slug: "lmnp-declaration-fiscale-2026",
    title: "LMNP en 2026 : régime micro-BIC vs régime réel simplifié — comparatif",
    excerpt:
      "LMNP 2026 : comparaison du régime micro-BIC et du régime réel simplifié. Quel régime choisir ? Comment déclarer ? Quels avantages ? Guide complet pour les loueurs en meublé.",
    category: "Fiscalité",
    date: "2026-04-14",
    updatedAt: '2026-04-14',
    readTime: "12 min",
    content: `## Le statut LMNP :Loueur en Meublé Non Professionnel

Le statut de Loueur en Meublé Non Professionnel (LMNP) s'applique aux personnes qui louent des biens meublés sans que cette activité constitue leur profession principale. Pour être considéré comme LMNP plutôt que LMP (Loueur en Meublé Professionnel), le montant des recettes locatives ne doit pas dépasser 23 000 euros par an, et ces recettes ne doivent pas représenter plus de la moitié des revenus du foyer fiscal.

Le LMNP est un statut fiscal attractif car il permet de bénéficier du régime des BIC (Bénéfices Industriels et Commerciaux), avec la possibilité d'opter soit pour le régime micro-BIC, soit pour le régime réel simplifié.

## Le régime micro-BIC

### Fonctionnement

Le régime micro-BIC est le régime par défaut du LMNP. Il s'applique automatiquement si vous dépassez pas les seuils de chiffre d'affaires. Pour 2026, le seuil micro-BIC pour les locations meublées est de 77 700 euros HT.

Dans ce régime, vous déclarez simplement vos recettes locatives, et un abattement forfaitaire de 50% est appliqué automatiquement pour représenter vos charges. Vous ne pouvez pas déduire vos charges réelles.

### Avantages du micro-BIC
- Simplicité de déclaration : une seule ligne à ajouter dans votre déclaration de revenus
- Aucune comptabilité à tenir
- Pas d'obligation de déclarer les charges

### Inconvénients du micro-BIC
- Abattement forfaitaire de 50% qui peut être inférieur ou supérieur à vos charges réelles
- Si vos charges réelles depassent 50% des recettes, vous payez plus d'impôts que nécessaire
- Pas d'amortissement possible du bien ni du mobilier

### Exemple chiffré

Revenus locatifs annuels : 15 000 €
Abattement micro-BIC (50%) : 7 500 €
Base imposable : 7 500 €
Impôt (barème progressif) + prélèvements sociaux (17,2%) : depends du taux marginal

## Le régime réel simplifié

### Fonctionnement

Le régime réel simplifié permet de déduire l'ensemble de vos charges réelles de vos recettes locatives. Vous devez pour cela renoncer au régime micro-BIC (option irrévocable tant que vous restez dans le régime réel).

Les charges déductibles comprennent :
- Les intérêts d'emprunt
- Les travaux de réparation et d'entretien
- Les charges de copropriété
- Les assurances
- Les frais de gestion (compte tenu des frais si vous avez recours à un gestionnaire)
- La taxe foncière
- LesDotations aux amortissements (pour le bien et le mobilier)

### Avantages du régime réel
- Possibilité de déduire toutes les charges réelles
- Possibilité d'amortir le bien (valeur d'achat / durée d'amortissement)
- Possibilité d'amortir le mobilier (généralement sur 5 à 7 ans)
- Souvent plus avantageux que le micro-BIC si les charges réelles dépassent 50%

### Inconvénients du régime réel
- Obligation de tenir une comptabilité simplifiée
- Déclaration de résultats plus complexe (imprimé 2031-SD)
- Obligation de déterminer un résultat fiscal (bénéfice ou déficit)
- Régularisation de la TVA si vous êtes assujetti

### Exemple chiffré (même bien)

Revenus locatifs : 15 000 €
Charges déductibles (intérêts, taxe foncière, charges, travaux) : 8 000 €
Amortissement du bien (假设) : 4 000 €
Amortissement du mobilier : 1 000 €
Base imposable : 15 000 - 8 000 - 4 000 - 1 000 = 2 000 €

Dans cet exemple, le régime réel génère une base imposable de seulement 2 000 € contre 7 500 € en micro-BIC.

## Comment choisir entre micro-BIC et réel simplifié ?

Le choix dépend de votre situation personnelle. Voici les critères à considérer :

### Optez pour le micro-BIC si :
- Vos charges réelles sont peu élevées (inférieures à 50% des recettes)
- Vous n'avez pas d'emprunt en cours
- Vous préférez la simplicité
- Vous venez de commencer la location meublée

### Optez pour le régime réel si :
- Vos charges réelles depassent 50% des recettes
- Vous avez un emprunt avec des intérêts élevés
- Vous pouvez amortir un bien acquis récemment
- Vous souhaitez optimiser fiscalement sur le long terme

### La règle à retenir

En général, le régime réel devient intéressant lorsque les charges déductibles (intérêts d'emprunt, travaux, taxe foncière) dépassent 50% des recettes locatives. Un simple calcul permet de trancher.

## L'amortissement en LMNP réel

L'amortissement constitue l'un des avantages majeurs du régime réel. Il permet de déduire chaque année une fraction de la valeur du bien et du mobilier, calculée selon leur durée d'utilisation.

### Amortissement du bien immobilier

Le bien immobilier peut être amorti sur une durée de 20 à 40 ans selon la nature du bien :
- Construction neuve : 20 ans (ou 25 ans selon les composants)
- Ancien : durée déterminée par l'administration fiscale
- Travaux : durée d'amortissement selon la nature des travaux

L'amortissement du bien ne concerne que la valeur du bâtiment, pas celle du terrain (qui n'est pas amortissable).

### Amortissement du mobilier

Le mobilier peut être amorti sur une durée de 5 à 10 ans :
- Mobilier de cuisine : 5 à 7 ans
- Literie : 5 à 7 ans
- Électroménager : 5 à 7 ans
- Meubles meublants : 7 à 10 ans

### Report du déficit

En LMNP réel, si vos charges déductibles (hors amortissement) dépassent vos recettes, vous dégagez un déficit foncier. Ce déficit est reportable sur vos revenus fonciers des années suivantes (dans la limite de 10 ans) ou sur votre revenu global (dans la limite de 10 700 € par an).

## La déclaration LMNP en 2026

Pour déclarer en LMNP, vous devez utiliser les imprimés suivants :

### En micro-BIC
- Formulaire 2042 C PRO (case 5ND ou 5NF) pour déclarer les recettes
- L'abattement de 50% est appliqué automatiquement

### En régime réel simplifié
- Formulaire 2031-SD pour la déclaration de résultats
- Formulaire 2042 C PRO pour reporter le résultat sur la déclaration de revenus
- Formulaire 2044 pour le détail des charges et amortissements

## Les pièges du LMNP à éviter

### Confusion LMNP/LMP
Si vos recettes dépassent 23 000 € et representent plus de la moitié de vos revenus, vous basculez en LMP, avec des obligations et une imposition différentes (plus-values en BIC, etc.).

### Amortissement excédentaire
L'amortissement ne peut pas créer un déficit reportable à l'infini. En cas de vente du bien, les amortissements non déduits peuvent être réintégrés dans le prix de vente.

### Changement de régime
Une fois le régime réel choisi, vous ne pouvez plus revenir au micro-BIC que si votre CAHT retombe sous le seuil. Pensez à bien calculer avant de faire votre choix.

## LMF et LMNP : quelle différence ?

La Loueur Meublé Fractionné (LMF) est un statut qui permet à une SCI de louer en meublé tout en conservant le régime des revenus fonciers (IR). Ce statut, issu de la loi de finances 2024, offre une alternative intéressante pour les investisseurs qui souhaitent éviter la complexity comptable du LMNP en SCI.

En 2026, le LMF permet de bénéficier de certains avantages du LMNP (amortissement) tout en restant dans le cadre de la SCI à l'IR, avec une comptabilité simplifiée.

[CTA : Calculez votre fiscalité LMNP et optimisez vos déclarations avec RentReady — essayer gratuitement]`,
  },
  {
    slug: "travaux-locataire-proprietaire",
    title: "Travaux en location : qui paie quoi entre locataire et propriétaire en 2026",
    excerpt:
      "Travaux de location : distinction entre petites réparations, entretien courant et grosses réparations. Obligations du locataire et du bailleur. jurisprudence et exemples pratiques.",
    category: "Juridique",
    date: "2026-04-14",
    updatedAt: '2026-04-14',
    readTime: "9 min",
    content: `## La distinction fondamentale : entretien et réparations

La question de la répartition des travaux entre locataire et bailleur est l'une des sources principales de litiges en location. La loi et la jurisprudence ont establecido une distinction claire entre trois catégories de travaux :

1. **Les petites réparations** (à la charge du locataire)
2. **L'entretien courant** (à la charge du locataire)
3. **Les grosses réparations** et travaux (à la charge du bailleur)

Cette distinction repose sur le décret n° 87-713 du 26 août 1987, qui liste de manière exhaustive les catégories de travaux incombant à chacune des parties.

## Les travaux à la charge du locataire

### L'entretien courant

Le locataire est tenu de prendre en charge l'entretien courant du logement et des équipements mentionnés dans le bail. Cela comprend notamment :

- Le ramonage des cheminées (une à deux fois par an selon le type de conduit)
- L'entretien des chaudières et de la Ventilation Mécanique Contrôlée (VMC) : vérification annuelle et nettoyage
- Le remplacement des ampoules, ampoules LED, tubes néon
- L'entretien des joints de salle de bains et de cuisine
- Le détartrage du ballon d'eau chaude (selon les modèles)
- Le remplacement des filtres de hotte
- L'entretien des volets et stores (nettoyage, graissage des mécanismes)

### Les petites réparations

Le locataire est également responsable des petites réparations listées dans le décret de 1987 :

- Menues réparations liées à l'usage normal des équipements :
  - Serrures, clef, visserie, clef de compteur d'eau
  - Menus entretiens de plomberie : remplacement de joints, robinets, flexibles de douche
  - Petites réparations électriques : prises, interrupteurs, ampoules
  - Menus travaux de pintura et de tapisserie
  - Remplacement desvitres cassées (si la taille est inférieure à 30 cm)
  - Réfection des joints de carrelage

### Le décret de 1987 : la liste exhaustive

Le décret n° 87-713 du 26 août 1987 établit une liste précise des réparations locatives à la charge du locataire. Cette liste ne peut pas être étendue par le bail. Elle couvre :

**Plomberie**
- Remplacement des jointements et clapets
- Rodage des sièges de robinets
- Batteurs et joints des appareils élévatoires

**Électricité**
- Remplacement des interrupteurs, prises de courant, ampoules

**Menuiserie**
- Réfection des petites pièces usées

**Peinture et tapisserie**
- Menues reparations avant remise en état des murs lors du départ

**Jardinage**
- Entretien courant des espaces verts (tonte, taille des haies, ramassage des feuilles)

## Les travaux à la charge du bailleur

### Les grosses réparations

Les grosses réparations sont définies par l'article 606 du Code civil : « Les grosses réparations sont celles qui touchent à la substance même de l'immeuble ».

Elles comprennent notamment :
- La réfection de la toiture (entière ou majeure)
- Le remplacement des poutres etsolives
- Le remplacement des murs porteurs
- La réfection complète du système d'assainissement
- Le remplacement de la Chaudière (pas de l'entretien annuel)

### Les travaux d'amélioration et de mise aux normes

Le bailleur est tenu de realizar les travaux d'amélioration qui deviennent nécessaires en cours de bail :
- Mise en conformité électrique si le logement ne répond plus aux normes
- Travaux d'isolation thermique ou phonique requis par la loi
- Travaux de rénovation énergétique (dès lors qu'ils sont rendus obligatoires)

### L'obligation de délivrance d'un logement décent

Depuis la loi ALUR et le décret du 30 janvier 2002, le bailleur doit garantir la décence du logement. Cela inclut :
- Une surface habitable minimale (9 m², 20 m³)
- Une performance énergétique minimale (interdiction de mise en location des passoires thermiques)
- L'absence de risques pour la santé et la sécurité

Si le logement n'est plus décent en cours de bail, le bailleur doit réaliser les travaux nécessaires dans un délai raisonnable.

## La responsabilité en cas de dégradations

### Le locataire responsable de ses dégradations

Le locataire est responsable des dégradations survenues pendant la durée du bail, sauf s'il prouve qu'elles sont dues à l'usure normale, à la force majeure ou au fait d'un tiers.

En cas de dégradation, le bailleur peut :
- Retenir tout ou partie du dépôt de garantie
- Demander au locataire le paiement direct des travaux de remise en état
- Saisir le juge pour obtenir l'indemnisation

### L'usure normale

L'usure normale liée au temps et à l'usage paisible du logement n'est pas à la charge du locataire. Par exemple :
- Peintures défraîchies par le temps
- Sols usés par les passages
- Rideaux décolorés par le soleil

La distinction entre usure normale et dégradation fault peut être difficile à établir. L'état des lieux d'entrée constitue la référence initiale pour cette comparaison.

## Les travaux en cours de bail

### Le droit du bailleur de realizar des travaux

Le bailleur a le droit de réaliser des travaux en cours de bail, sous réserve de respecter certaines règles :
- Information préalable du locataire (délai raisonnable)
- Réalisation des travaux pendant les heures normales de travail
- Respect du droit du locataire à la jouissance paisible du logement

En cas de travaux importants rendant le logement inhabitable, le locataire peut demander une réduction de loyer ou la résiliation du bail.

### Le droit du locataire de realizar des travaux

Le locataire peut realizar des travaux d'aménagement dans le logement, sous réserve d'obtenir l'accord préalable et écrit du bailleur. En l'absence d'accord, le bailleur peut exiger la remise en état des lieux à la fin du bail.

Depuis la loi ELAN, le locataire peut réalisé certains travaux sans accord préalable du bailleur, notamment les travaux de décoration (peinture, papiers peints) à condition de les réaliser dans les règles de l'art et de ne pas modifier la structure du logement.

## LeBornage des travaux entre locataire et bailleur : exemples pratiques

### Exemple 1 : Fuite d'eau
- Cause : joint usé → **locataire** (petite réparation)
- Cause : corrosion de la canalisation → **bailleur** (grosse réparation)

### Exemple 2 : Chaudière en panne
- Entretien annuel → **locataire** (obligation d'entretien)
- Remplacement complet suite à panne complète → **bailleur** (grosse réparation)

### Exemple 3 : Vitre cassée
- Petite vitre (< 30 cm) → **locataire**
- Grande baie vitrée → **bailleur**

### Exemple 4 : Humidité dans le logement
- Condensation due au manque d'aération → **locataire** (obligation d'aérer)
- Infiltration due à une toiture défaillante → **bailleur**

## Les recours en cas de litige

En cas de désaccord sur la répartition des travaux, le locataire ou le bailleur peut :
- Saisir la commission départementalede conciliation (CDCS)
- Recourir à la médiation
- Saisir le juge des contentieux de la protection

La jurisprudence est riche en la matière et fournit de nombreux exemples de décisions permettant de qualifier les différents types de travaux.

[CTA : Documenté et suivez vos travaux de location avec RentReady — essayer gratuitement]`,
  },
  {
    slug: "assurance-habitation-locataire",
    title: "Assurance habitation du locataire : obligations, couverture et comparatif 2026",
    excerpt:
      "Assurance habitation locataire : obligation légale de s'assurer, couverture minimale requise, assurance multirisque habitation, montant moyen et sanctions en cas de défaut.",
    category: "Juridique",
    date: "2026-04-14",
    updatedAt: '2026-04-14',
    readTime: "8 min",
    content: `## L'obligation d'assurance habitation du locataire

En France, le locataire est légalement tenu de s'assurer contre les risques locatifs. Cette obligation, prévue par l'article 7 de la loi du 6 juillet 1989, constitue l'une des obligations fondamentales du locataire.

Cette assurance doit couvrir la responsabilité civile du locataire envers le bailleur et les tiers en cas de dommages causés au logement loué.

## Les risques couverts par l'assurance locative

### La garantie risques locatifs

L'assurance risques locatifs couvre la responsabilité du locataire en cas de :
- Incendie : dommage causé au logement par un feu
- Explosion : dommages liés à une explosion (gaz, etc.)
- Dégât des eaux : dommages causés par l'eau (fuites, infiltrations, débordements)
- Vol et vandalisme : si ces risques sont mentionnés dans le contrat

Cette garantie permet d'indemniser le bailleur en cas de dommages causés au logement loué.

### La garantie recours des voisins et des tiers

Cette garantie couvre la responsabilité du locataire envers ses voisins et les tiers en cas de dommages给大家造成. Par exemple, si un incendie parti de votre appartement cause des dommages à l'appartement du dessous, cette garantie intervient.

## L'assurance multirisque habitation (MRH)

L'assurance multirisque habitation est le contrat le plus complète pour le locataire. Elle comprend généralement :

### Garanties de base
- Incendie et explosions
- Dégât des eaux
- Vol et vandalisme
- Catastrophes naturelles et technologiques
- Attentats et actes de terrorism

### Garanties complémentaires
- Responsabilité civile privée
- Protection juridique
- Assistance habitation
- Garantie des biens électroménagers et high-tech
- Dommages aux équipements

### Options et extensions
- Valorisation des objets de valeur
- Garantie villégiature (pour les déplacements)
- Protection des enfants

## Le montant de la prime d'assurance

### Tarifs moyens en 2026

Le coût de l'assurance habitation pour un locataire varie selon plusieurs facteurs :
- La superficie du logement
- La localisation (zone géographique, étage, présence de gardien)
- Le montant des franchises
- Les garanties optionnelles

Pour un appartement de 40 à 60 m² en France métropolitaine, le coût moyen d'une assurance MRH pour locataire se situe entre 10 et 20 euros par mois, soit environ 120 à 240 euros par an.

某些 assureurs en ligne proposent des tarifs réduits, avec des cotisations mensuelles starting à 5-8 euros pour les petits appartements.

### Facteurs influençant le tarif
- Franchise choisie (plus elle est élevée, moins la cotisation est chère)
- Antécédents de sinistres
- Nombre de personnes dans le foyer
- Équipements supplémentaires (piscine, véranda, etc.)

## Les sanctions en cas de défaut d'assurance

Le défaut d'assurance habitation du locataire constitue un manquement grave à ses obligations légales. Les conséquences peuvent être importantes :

### Obligation pour le bailleur

Depuis 2014, si le locataire ne fournit pas attestation d'assurance lors de la remise des clés puis chaque année à la demande du bailleur, le bailleur peut :
- Souscrire une assurance pour le compte du locataire et récupérer le coût auprès de lui (majoré de 10%)
- Ou mettre fin au bail pour manquement grave

### La résiliation du bail

Le défaut d'assurance peut constituer un motif de résiliation judiciaire du bail, sur demande du bailleur. Cette procédure est toutefois extremal.

### En cas de sinistre non assuré

Si un sinistre se produit et que le locataire n'est pas assuré, il devra verser de sa poche l'intégralité des réparations, ce qui peut représente des sommes très importantes.

## La déclaration d'un sinistre

En cas de sinistre, le locataire doit :
1. Déclarer le sinistre à son assureur dans un délai de 5 jours ouvrés (10 jours pour les catastrophes naturelles)
2. Fournir un état estimatif des biens endommagés ou détruit
3. Enumérer les autres assurances susceptibles d'intervenir

La déclaration doit être faite par lettre recommandée avec accusé de réception, ou directement en ligne sur l'espace client de l'assureur.

## L'attestation d'assurance

Le locataire doit fournir une attestation d'assurance au bailleur :
- Lors de la signature du bail
- Chaque année à la demande du bailleur
- À chaque renouvellement du contrat

L'assureur délivre automatiquement cette attestation, qui mentionne :
- Les risques couverts
- Les montants de garantie
- La période de validité du contrat

## Comment choisir son assurance habitation ?

### Critères de choix
1. **Vérifier les garanties minimales** : risques locatifs obligatoires
2. **Comparer les montants de garantie** : attention aux plafonds trop bas
3. **Vérifier les exclusions** : certains événements peuvent être exclus
4. **Comparer les franchises** : montant excessif peut RM
5. **Évaluer les services complémentaires** : assistance, protection juridique

### Les pièges à éviter
- Choisir une assurance au prix le plus bas sans vérifier les garanties
- Ne pas vérifier les exclusions (certaines activités peuvent être exclues)
- Oublier de déclarer les modifications en cours de bail (travaux, nouvel occupant)

## La résiliation de l'assurance habitation

Le locataire peut résilier son contrat d'assurance habitation :
- À l'échéance annuelle du contrat (avec un préavis de 2 mois)
- En cas de changement de situation (déménagement, modification du contrat)
- Si l'assureur ne respecte pas ses obligations (augmentation de tarif injustifiée)

La loi Hamon permet également de résilier à tout moment après la première année du contrat.

## Assurance et dépôt de garantie

Le bailleur ne peut pas prélever sur le dépôt de garantie pour couvrir les risques locatifs si le locataire est correctement assuré. Le dépôt de garantie couvre uniquement :
- Les dégradations constatées à l'état des lieux de sortie
- Les sommes dues au titre des charges
- Les impayés de loyer

[CTA : Comparez les assurances habitation locataire et trouvez la meilleure offre avec RentReady — essayer gratuitement]`,
  },
  {
    slug: "indexation-loyer-formule-2026",
    title: "Indexation du loyer : la formule de calcul IRL en 2026",
    excerpt:
      "Indexation du loyer en 2026 : comment calculer la révision annuelle avec l'IRL. Formule, exemples pratiques, date d'application, et pièges à éviter pour bailleurs et locataires.",
    category: "Calculs",
    date: "2026-04-14",
    updatedAt: '2026-04-14',
    readTime: "7 min",
    content: `## L'indexation du loyer : principe général

L'indexation du loyer est le mécanisme par lequel le montant du loyer est ajusté chaque année en fonction de l'évolution d'un indice de référence. En France, cet indice est l'Indice de Référence des Loyers (IRL), publié trimestriellement par l'INSEE.

Cette indexation permet au bailleur de maintenir le pouvoir d'achat de son loyer face à l'inflation, tout en protégeant le locataire contre des augmentations brutales gr''ce à l'indexation limitée sur un indice officiel.

## L'Indice de Référence des Loyers (IRL)

### Définition et composition

L'IRL est calculé par l'INSEE à partir de l'évolution des prix à la consommation hors tabac et hors loyers. Il correspond à la moyenne des 12 derniers mois de l'indice des prix.

L'INSEE publie un nouvel IRL chaque trimestre :
- Q1 (1er trimestre) : publié en avril
- Q2 (2e trimestre) : publié en juillet
- Q3 (3e trimestre) : publié en octobre
- Q4 (4e trimestre) : publié en janvier

### Les valeurs de l'IRL en 2026

Les dernières valeurs connues de l'IRL (à vérifier auprès de l'INSEE) :
- IRL Q4 2025 : environ 145,0 (base 100 au T4 2023)
- IRL Q3 2025 : environ 144,2
- IRL Q2 2025 : environ 143,5
- IRL Q1 2025 : environ 142,8

L'évolution de l'IRL sur un an (Q4 2025 vs Q4 2024) est d'environ +2,0% à +2,5%, refleétant le ralentissement de l'inflation par rapport aux années précédentes.

## La formule de calcul de la révision du loyer

### Formule mathématique

La formule de révision du loyer est la suivante :

**Nouveau loyer = Loyer en cours × (IRL du trimestre de référence / IRL du même trimestre de l'année précédente)**

Le « trimestre de référence » est celui prévu dans le bail (généralement le trimestre correspondant à la date anniversaire du bail).

### Exemple pratique

Prenons un exemple concret :
- Loyer actuel : 800 €/mois
- Date d'anniversaire du bail : 1er mars
- Trimestre de référence dans le bail : Q1 (janvier-mars)
- IRL Q1 2025 (même trimestre année précédente) : 142,8
- IRL Q1 2026 (trimestre de référence) : 144,0

Calcul :
Nouveau loyer = 800 × (144,0 / 142,8)
Nouveau loyer = 800 × 1,0084
Nouveau loyer = 806,72 €/mois

Soit une augmentation de 6,72 €/mois, ou 80,64 € par an.

## Les conditions de la révision

### La clause d'indexation dans le bail

La révision du loyer n'est possible que si le bail contient une clause d'indexation prévoyant expressément cette possibilité. En l'absence de clause, le loyer reste figé pendant toute la durée du bail.

La clause doit préciser :
- L'indice utilisé (IRL)
- Le trimestre de référence (celui du dernier IRL connu lors de la signature, ou celui du dernier IRL publié)
- La périodicité de la révision (généralement annuelle)

### Le respect du délai de prescription

La demande de révision doit être faite dans un délai de un an following la date d'anniversaire du bail. Passé ce délai, le bailleur perd le droit de réclame les arriérés.

### Le plafonnement en zone tendue

En zone tendue soumise à l'encadrement des loyers, la revision ne peut pas dépasser le loyer de référence majoré établi pour le secteur. Si le nouveau loyer calculé dépasse ce plafond, c'est le plafond qui s'applique.

## Les pièges à éviter

### Indexation sur un mauvais trimestre

Le piège le plus fréquent consiste à utiliser le mauvais trimestre de référence. Il est impératif d'utiliser le même trimestre que celui de l'année précédente (Q1 2025 vs Q1 2026), et non le dernier trimestre publié.

### IRL négatif

Si l'indice baisse (déflation), le loyer ne peut pas être réduit en dessous du dernier loyer appliqué, sauf clause expresse le prévoyant dans le bail.

### Augmentation excéssive en zone tendue

En zone encadrée, même si la formule donne un résultat supérieur au plafond, c'est le plafond qui prévaut. Ne pas en tenir compte expose à des sanctions.

### Oublier de révisionner

Le bailleur qui oublie de réclamer la révision dans l'année perd le droit de réclame les montants correspondants. Il ne peut pas les réclame retroactivement.

## Les dates de mise en œuvre

### Date d'application

La date de mise en œuvre de la révision dépend de ce qui est prévu dans le bail :
- À la date d'anniversaire du bail
- À une date fixe mentionnée dans le bail
- À la date de publication de l'IRL si elle est postérieure

Dans tous les cas, la révision ne peut pas prendre effet de manière rétroactive. Seule la période future peut être ajustée.

### Règle du « terme échu »

En pratique, la révision s'applique généralement au terme du bail en cours (loyer payable « terme échu », c'est-à-dire à la fin du mois).

## Outil de calcul de l'IRL

Pour facilitar le calcul de la révision de loyer, de nombreux simulateurs en ligne sont disponibles, dont celui intégré à RentReady. Ils permettent d'indiquer :
- Le loyer actuel
- La date de référence du bail
- Les IRL applicables

L'outil calcule automatiquement le nouveau loyer et l'augmentation en euros.

## IRL et encadrement des loyers

En zone tendue, l'IRL ne peut pas justifier une augmentation au-delà du loyer de référence majoré. Le bailleur doit vérifier systématiquement que le nouveau loyer ne dépasse pas ce plafond, sous peine de sanctions (contravention de 5e classe).

Par ailleurs, en cas de relocation, le nouveau loyer ne peut pas dépasser le dernier loyer appliqué au précédent locataire, sauf exceptions (travaux, logement vacant depuis 18 mois, etc.).

[CTA : Calculez automatiquement votre révision de loyer IRL avec RentReady — essayer gratuitement]`,
  },
  {
    slug: "colocation-bail-solidaire-2026",
    title: "Colocation et bail solidaire : guide pratique en 2026",
    excerpt:
      "Colocation avec bail solidaire : les règles en 2026, différence entre bail commun et baux individuels, obligations des colocataires, clause de solidarité et sortie d'un colocataire.",
    category: "Juridique",
    date: "2026-04-14",
    updatedAt: '2026-04-14',
    readTime: "9 min",
    content: `## La colocation en France : cadre juridique

La colocation est devenue un mode d'habitation très répandu, notamment dans les grandes villes françaises où les loyers élevés rendent difficile l'accès au logement pour les jeunes actifs, les étudiants et les ménages modeste.

Sur le plan juridique, la colocation est définie par la loi du 24 mars 2022 (dite loi « ASAP ») comme « une location en commun d'un logement par plusieurs personnes qui ne constituent pas un couple ni une union libre ». Cette définition a clarifié un cadre juridique qui manquait de precision.

## Les deux formes de colocation

### Le bail commun unique

Dans ce cas, un seul bail est signé par l'ensemble des colocataires, qui sont solidairement responsables du paiement du loyer et des charges envers le bailleur.

Cette forme de colocation est la plus répandue. Elle implique que chaque colocataire est engagé pour la totalité du loyer, même s'il n'occupe qu'une partie du logement.

### Les baux individuels

Depuis la loi de 2022, chaque colocataire peut désormais signer son propre bail pour sa chambre, avec une clause de partage des espaces communs. Chaque bail définit :
- La chambre louée
- Les parties communes
- Le montant du loyer individuel

Cette forme de colocation offre plus de flexibilité et de protection à chaque colocataire, mais elle est plus complexe à gérer pour le bailleur.

## Le bail solidaire : définitions

Le bail solidaire (ou clause de solidarité) est une clause insérée dans le bail de colocation qui prévoit que chaque colocataire est responsable de la totalité du loyer et des charges, et pas seulement de sa quote-part.

### Fonctionnement de la clause de solidarité

Avec une clause de solidarité :
- Si un colocataire ne paie pas, le bailleur peut réclame l'intégralité du loyer aux autres colocataires
- Le colocataire qui a réglé la part d'un autre peut ensuite se retourner contre ce dernier pour obtenir le remboursement
- La clause de solidarité subsiste pendant toute la durée du bail, même si un colocataire quitte le logement

### Différence entre solidarité et simple engagement conjoint

Dans un engagement conjoint (sans solidarité), chaque colocataire n'est tenu de payer que sa quote-part. Si l'un ne paie pas, le bailleur doit se retourner contre lui, sans pouvoir réclamer aux autres la part impayée (sauf en cas de clause spécifique).

## Les obligations de chaque colocataire

### Obligations financières

Chaque colocataire signataire du bail est tenu de :
- Payer sa quote-part du loyer et des charges dans les délais
- Respecter les termes du bail (utilisation paisible du logement, etc.)
- Assumer les dégradations causées par lui-même ou ses invités

### Obligations d'usage

Le colocataire doit utiliser le logement conformément à sa destination (habitation principale) et respecter les règles de vie communes établies avec les autres occupants.

## La sortie d'un colocataire en bail commun

### En l'absence de clause de solidarité

Si le colocataire sort du bail commun sans clause de solidarité, il reste responsable des éventuels impayés survenus avant son départ. Passé ce délai, sa responsabilité cesse.

### Avec clause de solidarité

Avec une clause de solidarité, le colocataire qui part reste responsable des impayés pendant une période transitoire :
- Si un nouveau colocataire le remplace : pendant les 6 mois suivant le départ du colocataire sortant
- Si aucun remplaçant : le colocataire solidaire reste responsible jusqu'à la fin du bail ou jusqu'à l'arrivée d'un nouveau colocataire accepté par le bailleur

Cette disposition protège le bailleur contre les impayés tout en laissant au colocataire partant un délai pour organize son replacement.

### Procédure de sortie

Le colocataire qui souhaite partir doit :
1. Informer le bailleur et les autres colocataires par lettre recommandée avec accusé de réception
2. Cooperer au replacement
3. Payer sa part jusqu'à la date effective de départ
4. Organiser un état des lieux de sortie

## Les droits de chaque colocataire

Chaque colocataire dispose des mêmes droits :
- Droit d'occupation de sa chambre et des parties communes
- Droit à la jouissance paisible du logement
- Droit de recevoir un receipt pour chaque paiement
- Droit d'être informé des décisions importantes (travaux, augmentation de loyer)

Les relations entre colocataires peuvent être formalisées par un règlement intérieur établi d'un commun accord.

## Le dépôt de garantie en colocation

En bail commun, un seul dépôt de garantie est versé, généralement à parts égales entre les colocataires. Ce dépôt est restitué selon les mêmes règles qu'en location individuelle.

Si des dégradations sont constatées à la sortie, le bailleur peut retenue sur le dépôt les sommes correspondantes, sans distinction de la responsabilité individuelle.

## La colocation et les aides au logement (APL)

Chaque colocataire peut, sous certaines conditions, bénéficier des aides au logement (APL, ALF, ALS) pour sa part du loyer.

Les условия pour percevoir l'APL en colocation sont :
- Être locataire du logement (etre signataire du bail)
- Ne pas être lié au bailleur par un lien de parenté
- Ne pas dépasser les plafonds de ressource

Le montant de l'APL est calculé sur la base du loyer charges comprises, divisé par le nombre de colocataires.

## La colocation et l'assurance habitation

Chaque colocataire doit être assuré individuellement pour sa responsabilité civile. En pratique, une assurance multirisque habitation globale peut couvrir l'ensemble des colocataires, avec une clause désignant le titulaire principal du contrat.

## LesNOSNOS pièges à éviter en colocation

### Bail commun sans solidarité
Si le bail ne prévoit pas de clause de solidarité, le bailleur peut avoir des difficultés à recouvrer les impayés si un colocataire part sans payer.

### Absence de règles de vie commune
Sans accord préalable sur les règles de vie (horaires, partage des courses, guests), des conflits peuvent naître et perturber la colocation.

### Départ non formalisé
Le départ d'un colocataire sans information préalable du bailleur peut engager la responsabilité des autres colocataires pour les loyers non réglés.

### Sous-location non autorisée
La sous-location d'une partie du logement à un tiers (sans être remplaçant officiel) est interdite et peut entraîner la résiliation du bail.

[CTA : Rédigez votre bail de colocation conforme et gérez les paiements facilement avec RentReady — essayer gratuitement]`,
  },
  {
    slug: "gestion-locative-en-ligne-avantages",
    title: "Gestion locative en ligne vs agence immobilière : comparatif complet 2026",
    excerpt:
      "Gestion locative en ligne vs agence traditionnelle : comparatif des coûts, services, avantages et inconvénients. Quel choix pour votre portefeuille locatif en 2026 ?",
    category: "Gestion",
    date: "2026-04-14",
    updatedAt: '2026-04-14',
    readTime: "10 min",
    content: `## La gestion locative : un marché en mutation

La gestion locative représente un enjeu majeur pour les propriétaires bailleurs, qu'ils détiennent un seul logement ou un portefeuille de plusieurs biens. Deux options principales s'offrent à eux : faire appel à une agence immobilière traditionnelle ou opter pour une solution de gestion locative en ligne.

En 2026, le marché de la gestion locative a été profondément transformé par la digitalisation, avec l'émergence de nombreuses plateformes offrant des services automatisés à moindre coût.

## Les agences immobilières traditionnelles

### Le modèle économique

Les agences immobilières facturent généralement :
- Frais de mise en location : 1 mois de loyer hors charges (mise en location seule)
- Frais de gestion locative : 5% à 10% du loyer mensuel hors charges (gestion courante)
- Ces honoraires peuvent varier selon les régions et les prestations incluses

Pour un loyer de 1 000 €/mois avec des frais de gestion à 8% :
- Frais de gestion annuels : 960 €
- Frais de mise en location (une seule fois) : 1 000 €

### Les avantages de l'agence traditionnelle

1. **Accompagnement personnalisé** : un gestionnaire attitré connaît votre bien et vos locataires
2. **Présence physique** : un interlocuteur en chair et en os, joignable en agence
3. **Service complet** : assistance dans la rédaction du bail, états des lieux, recherche de locataires
4. ** Réseau** : capacité à trouver rapidement des candidats grâce à leur fichier clients
5. ** Résolution de conflits** : intermédiaire en cas de litige avec le locataire

### Les inconvénients de l'agence traditionnelle

1. **Coût élevé** : les frais de gestion représentent une charge significative chaque année
2. **Disponibilité limitée** : horaires d'ouverture restricts, difficulté à joindre le gestionnaire
3. **Incohérence de la qualité** : la qualité du service varie beaucoup selon les agences
4. **Rotation du gestionnaire** : changement fréquent de gestionnaire, perte de connaissance du dossier

## Les plateformes de gestion locative en ligne

### Le modèle économique

Les plateformes de gestion locative en ligne proposent généralement :
- Un abonnement mensuel fixe (souvent entre 15 et 50 €/mois par logement)
- Parfois un pourcentage réduit sur les loyers (0 à 3%)
- Aucun frais de mise en location ou frais réduits

Pour un loyer de 1 000 €/mois avec un abonnement à 30 €/mois :
- Frais de gestion annuels : 360 €
- Économie vs agence traditionnelle : environ 600 € par an

### Les avantages de la gestion locative en ligne

1. **Coût réduit** : économie substantielle par rapport aux frais d'agence
2. **Accessibilité 24/7** : gestion depuis n'importe où via ordinateur ou smartphone
3. **Automatisation** : paiements automatiques, relances automatiques en cas d'impayé
4. **Transparence** : tableau de bord en temps réel avec tous les indicateurs
5. **Rapidité** : signature électronique, états des lieux numériques
6. **Continuité** : pas de dépendancier à une personne physique

### Les inconvénients de la gestion locative en ligne

1. **Moins de contact humain** : tout se fait en ligne, pas d'interlocuteur physique
2. **Gestion des litiges** : moins de accompagnement en cas de conflit complexe
3. **Nécessite un minimum de involvement** : le propriétaire reste décisionnaire sur certains sujets
4. **Dépendance technologique** : fiabilité de la plateforme

## Tableau comparatif : gestion locative en ligne vs agence

| Critère | Agence traditionnelle | Gestion en ligne |
|---------|----------------------|-----------------|
| Coût annuel (pour 1000€/mois) | 600 à 1 200 € | 180 à 600 € |
| Disponibilité | Horaires d'ouverture | 24/7 |
| Contact humain | Oui (physique) | Limité (chat, téléphone) |
| Automatisation | Faible | Élevée |
| Gestion des impayés | Variable | Automatisée + accompagnement |
| Signature électronique | Variable | Standard |
| États des lieux | Physiques | Numériques |
| Reporting | Par email/ rendez-vous | Dashboard temps réel |
| Réactivité | Variable | Généraleélevée |

## Pour qui la gestion locative en ligne ?

La gestion locative en ligne est particulièrement adaptée aux propriétaires qui :

- Possèdent un ou plusieurs biens et souhaitent réduire les coûts de gestion
- Sont à l'aise avec les outils numériques
- Disposent d'un bien avec des locataires corrects (peu d'impayés)
- Want to maintain control and visibility on their property

Elle est moins adaptée aux propriétaires qui :

- Préférent déléguer entièrement la gestion (y compris les décisions difficiles)
- Ont des biens dans des zones géographiques diversas nécessitant une connaissance locale
- Font face à des situations complexes (litiges, dégradations)

## Les fonctionnalités clés des plateformes en ligne

### Gestion des paiements
- Loyer automatique via mandat SEPA
- Suivi des paiements en temps réel
- Génération automatique des quittances
- Récupération automatique des APL

### Gestion des documents
- Bail numérique avec signature électronique
- État des lieux input/output with photos
- archivage automatique de tous les documents
- Récapitulatif annuel pour la déclaration de revenus

### Suivi et reporting
- Tableau de bord with indicateurs financiers
- Évolution du rendement locatif
- Suivi des charges et des travaux
- Alertes automatiques pour les dates clés

### Communication
- Messagerie intégrée bailleur/locataire
- Notifications automatiques
- Centrale de documents partagés

## Les critères pour choisir une plateforme

Pour choisir une solution de gestion locative en ligne, considérez :

1. **Le coût total** : au-delà de l'abonnement mensuel, attention aux frais cachés
2. **Les fonctionnalités** : vérifiez que la plateforme couvre vos besoins (comptabilité, déclaration fiscale, etc.)
3. **La qualité du service client** : disponibilité, réactivité, channel (chat, téléphone)
4. **Les avis utilisateurs** : retours d'expérience sur la fiabilité
5. **La sécurité des données** : conformité RGPD, protection des données bancaires
6. **L'évolutivité** : si vous prévoyez d'agrandir votre portefeuille

## L'hybridation : une troisième voie

 Certains propriétaires optent pour une approche hybride : ils utilisent une plateforme en ligne pour la gestion courante (loyers, comptabilité) et font appel ponctuellement à une agence pour des missions spécifiques (recherche de locataire, état des lieux de sortie difficile).

[CTA : Découvrez comment RentReady peut vous aider à gérer vos locations efficacement — essayer gratuitement]`,
  },
  {
    slug: "quittance-loyer-apl-caf",
    title: "Quittance de loyer et APL/CAF : mentions obligatoires et obligations en 2026",
    excerpt:
      "Quittance de loyer et aides au logement : mentions obligatoires à faire figurer, obligation de délivrance, modèle gratuit, procédure en cas de non-réponse du bailleur.",
    category: "Gestion",
    date: "2026-04-14",
    updatedAt: '2026-04-14',
    readTime: "7 min",
    content: `## La quittance de loyer : un document obligatoire

La quittance de loyer est le document remis par le bailleur au locataire pour attester du paiement du loyer et des charges. Elle constitue la preuve du réglement et doit être délivrée automatiquement par le bailleur lorsquele locataire en fait la demande.

La quittance doit contenir un certain nombre de mentions obligatoires, sotto pena de nullité. Pour les locataires percevant les APL (Aide Personnalnelle au Logement), la quittance doit en outre comporter des informations spécifiques destinées à la CAF.

## Les mentions obligatoires de la quittance

En vertu de la loi du 6 juillet 1989, la quittance de loyer doit préciser :

### Informations sur le bailleur
- Nom et prénom du bailleur (ou raison sociale si personne morale)
- Adresse du bailleur (domicile ou siège social)

### Informations sur le locataire
- Nom et prénom du locataire

### Informations sur le logement
- Adresse complète du logement loué

### Détail du paiement
- Période concerncée par le paiement
- Montant total réglé (loyer + charges)
- Montant du loyer hors charges
- Montant des charges (si provision ou forfait)
- Date du règlement
- Moyen de paiement utilisé

### Signature du bailleur
- Signature du bailleur ou de son représentant (gestionnaire, agent)

Depuis 2024, la quittance doit également mentionner si le bailleur a souscrit une assurance GLI (Garantie Loyer Impayé), et le cas échéant les coordonnées de l'assureur.

## La quittance de loyer et les APL

### L'obligation d'information pour les APL

Pour permettre le traitement du dossier APL par la CAF, la quittance de loyer doit comporter les informations suivantes en plus des mentions légales :

- L'indication que le logement constitue la résidence principale du locataire
- Le montant du loyer charges comprises
- Le cas échéant, la mention que le locataire est en situation d'impayé (en cas de dette LOCATIVE)
- Les coordonnées du bailleur si celui-ci perçoit directement les APL (paiement direct)

### Le paiement direct des APL au bailleur

Dans certains cas (situation d'impayé, logementConventionné), la CAF peut décider de verser les APL directement au bailleur (paiement direct). Ce dernier est then tenu d'en informer le locataire et de déduire le montant des APL de la prochaine quittance.

### Le justificatif de paiement CAF

La CAF peut demander un justificatif de paiement du loyer pour vérifier que les APL sont utilisées correctement. La quittance de loyer tient lieu de justificatif, à condition qu'elle mentionne bien le réglement integral du loyer.

## Le délai de délivrance de la quittance

Le bailleur doit délivrer la quittance dans un délai raisonnable suivant la demande du locataire. En pratique, la quittance est généralement remise dès réception du réglement.

Depuis 2024, pour les paiements par prélèvements automatiques, le bailleur peut délivrer une quittance dématérialisée, sous réserve de l'accord du locataire.

## Le modele de quittance de loyer

### Mentions légales à inclure

\`\`\`
QUITTANCE DE LOYER

[Bailleur - Nom, Prénom / Raison sociale]
[Adresse du bailleur]

Propriétaire bailleur de :
[Adresse complète du logement]

Locataire : [Nom, Prénom]
Période : [mois/année]

Loyer hors charges : .............. €uros
Provisions charges : .............. €uros
---------------------------------------------------------
TOTAL REÇU : ................ €uros

Dont :
- Loyer : ...................... €uros
- Charges : .................... €uros

Date du paiement : [JJ/MM/AAAA]
Moyen de paiement : [Chèque / Virement / Espèces / Prélèvement]

Le montant ci-dessus éteint la dette de loyer et charges pour la période visée.

[Fait à ...] le [date]
Signature du bailleur (ou du gestionnaire) :
\`\`\`

### Pour les logements avec APL

Ajouter la mention :
« Le logement situé à [adresse] constitue la résidence principale du locataire. »

## Le contentieux de la quittance

### Quand le bailleur refuse de délivrer une quittance

Le locataire peut, en cas de refus du bailleur, demander la Nullité de la quittance via une lettre de mise en demeure. En cas d'échec, il peut saisir la commission départementalede conciliation (CDCS) ou le juge des contentieux de la protection.

Depuis 2024, le bailleur qui refuse de délivrer une quittance alors que le locataire la demande s'expose à une contravention de 4e classe (amende de 135 euros).

### Locataire en impayé : la quittance conditionnelle

En cas d'impayé, le bailleur n'est pas obligé de délivrer une quittance. Il peut délivrer un reçu pour le montant réellement réglé si le locataire n'a réglé qu'une partie.

Dans tous les cas, même en présence d'impayés, le bailleur doit deliver un reçu dès lors qu'un réglement est effectué.

## La quittance numérique

Depuis la loi PACTE et les évolutions réglementaires, la quittance de loyer peut être dématérialisée, c'est-à-dire transmise par email ou via un espace en ligne sécurisé.

### Conditions de la dématérialisation
- Accord préalable du locataire (qui peut être prévu dans le bail)
- Accès facile et permanent à la quittance
- Format permettant la conservation (PDF, etc.)

### Avantages de la quittance numérique
- Instantaneité de la transmission
- Réduction de l'empreinte environnementale
- Archivage simplifié pour le locataire
- Trace de l'envoi par email

## La conservation des quittances

Le locataire doit conserver ses quittances pendant une durée minimale de 3 ans, qui correspond à la prescription pour réclamer des arrérages de loyer.

Le bailleur doit également archiver les quittances délivrées pendant la même durée, afin de pouvoir prouver le réglement en cas de litige.

## Quittance et comptabilité du bailleur

Pour le bailleur, les quittances constituent des pièces comptables justificatives. Elles doivent être conservées avec le bail et l'ensemble des documents relatifs à la location.

En location meublée (LMNP/LMP), les quittances peuvent être utilisées comme justificatifs pour la déduction des revenus locatifs.

[CTA : Générez vos quittances de loyer automatiquement avec RentReady — essayer gratuitement]`,
  },
  {
    slug: "investissement-locatif-rentabilite-2026",
    title: "Calcul de rentabilité locative : méthode complète et simulateur 2026",
    excerpt:
      "Rentabilité locative 2026 : comment calculer le rendement brut, net, net-net. Formule, exemples chiffrés, critères pour évaluer la qualité d'un investissement locatif.",
    category: "Calculs",
    date: "2026-04-14",
    updatedAt: '2026-04-14',
    readTime: "12 min",
    content: `## L'investissement locatif : pourquoi calculer sa rentabilité ?

L'investissement locatif consiste à acquérir un bien immobilier pour le louer et percevoir des revenus réguliers. Pour évaluer la qualité de cet investissement, le calcul de la rentabilité locative est essential.

La rentabilité locative permet de répondre à plusieurs questions :
- Le bien que j'envisage d'acheter est-il financièrement intéressant ?
- Quel est le rendement réel de mon investissement ?
- Combien de temps faudra-t-il pour amortir mon achat ?

En 2026, avec des taux d'intérêt encore élevés et des prix immobiliers en phase de stabilisation, le calcul précis de la rentabilité est plus que jamais nécessaire.

## Les différents niveaux de rentabilité

### La rentabilité brute

La rentabilité brute est le premier indicateur à calculer. Elle donne une première idée de la performance de l'investissement, sans tenir compte des charges.

**Formule :**
(LOYER MENSUEL × 12) / PRIX D'ACHAT DU BIEN × 100

**Exemple :**
- Prix d'achat du bien : 200 000 €
- Frais d'acquisition (frais de notaire + droits de mutation) : 15 000 €
- Loyer mensuel : 800 €
- Total investissement : 215 000 €

Rentabilité brute = (800 × 12) / 200 000 × 100 = 4,8%

Attention : ce calcul ne tient pas compte des nombreux frais annexes.

### La rentabilité nette de charges

La rentabilité nette de charges intègre les charges liées à la propriété et à la gestion du bien.

**Charges à déduire pour le calcul net :**
- Taxe foncière (environ 1 à 2 mois de loyer)
- Charges de copropriété non récupérables (entretien, assurance)
- Frais de gestion locative (si recours à une agence ou une plateforme)
- Vacance locative (loyers non perçus pendant les périodes sans locataire)

**Formule :**
(LOYER MENSUEL × 12 - CHARGES ANNUELLES) / PRIX D'ACHAT × 100

**Exemple (Suite) :**
- Loyer annuel : 9 600 €
- Taxe foncière : 1 200 €
- Charges copropriété : 600 €
- Frais de gestion (8%) : 768 €
- Vacance (1 mois) : 800 €
- Total charges : 4 368 €

Loyer net = 9 600 - 4 368 = 5 232 €
Rentabilité nette = 5 232 / 200 000 × 100 = 2,62%

### La rentabilité nette-net (ou nette avant impôt)

La rentabilité nette-net intègre en plus la fiscalité sur les revenus locatifs. Son calcul dépend du régime fiscal选择 (revenus fonciers, micro-foncier, LMNP, etc.).

**Exemple (Suite) avec régime micro-foncier :**
- Revenus locatifs nets : 5 232 €
- Abattement micro-foncier (30%) : 1 570 €
- Revenus imposables : 3 662 €
- Impôt (selon tranche) : depends du taux marginal

Le calcul précis de la rentabilité nette-net nécessite de prendre en compte la situation fiscale personnelle de l'investisseur, d'où l'intérêt de réaliser une simulation personnalisée.

## Les éléments à intégrer dans le prix d'achat

Le prix d'achat à retenir pour le calcul de la rentabilité ne se limite pas au prix affiché du bien. Il convient d'y ajouter :

### Les frais de notaire
- Environ 7 à 8% du prix du bien pour un achat ancien
- Environ 2 à 3% pour un achat neuf (TVA sur marge)

### Les travaux éventuels
- Travaux de rénovation immediate
- Mise aux normes si nécessaire
- Aménagement si nécessaire

### Les frais d'emprunt
- Frais de dossier bancaire
- Frais de garantie (hypothèque, caution)
- Commission de courtier si recours à un courtier

### Le coût du financement
- Intérêts d'emprunt sur la durée du prêt
- Assurances décès/invalidité

## Le calcul du rendement neto global

Le véritable indicateur de performance d'un investissement locatif est le rendement neto global, qui intègre l'ensemble des paramètres :

### Le cash-flow

Le cash-flow représente la différence entre les revenus locatifs perçus et l'ensemble des dépenses (mensualités d'emprunt, charges, fiscalité).

Cash-flow = Revenus locatifs - (mensualités + charges + impôts)

Un cash-flow positif signifie que l'investissement s'autofinance et génère un excédent. Un cash-flow négatif signifie que l'investisseur doit compléter de sa poche chaque mois.

### La.plus-value potentielle

L'investissement locatif peut aussi créer de la valeur via la.plus-value immobilière (si le bien prend de la valeur) et le remboursement progressif de l'emprunt (amortissement du capital).

## Les indicateurs complementaires

### Le TRI (Taux de Rentabilité Interne)

Le TRI est un indicateur plus sophistiqué qui prend en compte l'ensemble des flux financiers (investissement initial, revenus locatifs, frais, impôts, eventualle vente) et calcule le taux de rendimiento moyen annuel de l'investissement.

Il tient compte de la valeur temps de l'argent : un euro gagné dans 10 ans vaut moins qu'un euro gagné aujourd'hui.

### Le multiple de Graham

Le multiple de Graham est un indicateur inspiré de la méthode de l'investisseur américain Benjamin Graham, adapté à l'immobilier :
Multiple = Prix du bien / (Loyer mensuel × 12)

Un multiple inférieur à 10 est considéré comme intéressant ; au-dessus de 15, le bien est considerado comme coûteux.

## Les facteurs qui influencent la rentabilité

### Localisation
- Centre-ville vs périphérie
- Proximité des transports et commodités
- Dynamisme économique de la zone
- Perspective de valoriseration

### Type de bien
- Studio, T2, T3 : généralement meilleur rendement au m² pour les petits lots
- Maison : potentiellement plus stable à la location
- Commerce ou bureau : rendement différent mais risque différent

### Profil du locataire
- Étudiant : turnover élevé mais loyer modéré
- Jeune actif : bon équilibre
- Famille : stabilité mais exigences plus élevées
- Professionnel : loyer potentiellement plus élevé

### Fiscalité
- Dispositifs Pinel, Denormandie, etc. : réduction d'impôt mais contraintes
- LMNP : amortissement et optimisation fiscale
- Zone géographique : certaines zones offrent des avantages fiscaux

## Exemple de calcul complet

Prenons l'exemple d'un appartement à Lyon :
- Prix d'achat : 250 000 €
- Frais de notaire (7,5%) : 18 750 €
- Travaux de rénovation : 10 000 €
- Apport personnel : 50 000 €
- Financement剩余 : 228 750 €

**Pret**
- Montant : 228 750 €
- Durée : 20 ans
- Taux : 3,8%
- Mensualité (hors assurance) : 1 356 €

**Loyer envisagé**
- Loyer mensuel (marché) : 950 €
- Rendement brut : (950 × 12) / 250 000 × 100 = 4,56%

**Charges annuelles**
- Taxe foncière : 1 400 €
- Charges copropriété : 800 €
- Assurance propriétaire : 250 €
- Gestion locative : 912 € (8%)
- Vacance (1 mois) : 950 €

Total charges : 4 312 €

**Revenus nets** : (950 × 12) - 4 312 = 7 088 €
**Rentabilité nette** : 7 088 / 250 000 × 100 = 2,83%

**Cash-flow mensuel** : 950 - 1 356 (mensualité) - 359 (charges mensuelles) = -765 €

Ce résultat montre que l'investissement ne s'autofinance pas sansoptimisation fiscale ou别的 revenus.

## Les outils pour calculer sa rentabilité

De nombreux simulateurs en ligne permettent de calculer automatiquement la rentabilité locative, en intégrant :
- Les différents taux d'intérêt
- Les charges de copropriété
- La fiscalité selon le régime选择
- Les的各种 dispositifs Pinel ou autres

RentReady propose un simulateur de rentabilité locative gratuit, qui permet de comparer différents scénarios d'investissement et d'optimiser votre stratégie.

[CTA : Calculez la rentabilité de votre investissement locatif avec RentReady — essayer gratuitement]`,
  },
{
  slug: "rediger-contrat-location",
  title: "Comment rédiger un contrat de location en 2026 : guide complet",
  excerpt:
    "Rédaction du bail de location : toutes les clauses obligatoires, facultatives et interdites. Modèle de bail conforme loi 89-462, loi ALUR et loi ELAN.",
  category: "Juridique",
  date: "2026-04-14",
    updatedAt: '2026-04-14',
  readTime: "12 min",
  content: `## Pourquoi rédiger un bail de location est essentiel

Le contrat de location (bail) est le document fondateur de toute relation locative. Il définit les droits et obligations du bailleur et du locataire, fixe le montant du loyer, et encadre les conditions de remise et de restitution du logement. Un bail mal rédigé peut exposer le propriétaire à des litiges, des pénalités ou des nullités de clauses.

Depuis la loi ALUR de 2014 et la loi ELAN de 2018, le bail de location doit respecter un strict formalisme. Certaines clauses sont obligatoires, d'autres interdites, et d'autres encore soumises à des conditions de validité.

## Les mentions obligatoires du bail de location

Le bail doit impérativement contenir les informations suivantes :

### Informations sur les parties
- Identité et adresse du bailleur (ou du gestionnaire mandate)
- Identité du locataire et de tous les occupants majeurs
- Date de début du bail et durée du contrat

### Descriptif du logement
- Adresse complète du logement
- Superficie Carrez (obligatoire pour les locations vides)
- Liste des équipements et services communs
- Description de l'état des lieux d'entrée

### Conditions financières
- Montant du loyer et ses modalités de révision (indice IRL)
- Montant du dépôt de garantie (plafond légal : 1 mois hors charges)
- Modalités de paiement (date, moyen, périodicité)
- Montant des charges (provisions ou forfait)

### Clauses et conditions
- Règles applicables aux animaux domestiques
- Conditions de révision du loyer
- Modalités d'assurance habitation du locataire
- Clause de résiliation et délai de préavis

## Bail vide vs bail meublé : les différences clés

### Le bail de location vide

Le bail de location vide (non meublé) est régi par la loi du 6 juillet 1989. Sa durée est de **3 ans** (6 ans pour les personnes morales). Il se reconduit tacitement sauf résiliation avec un préavis de **3 mois**.

### Le bail de location meublée

Le bail meublé (loi 89-462, article 25-3) est destiné aux locations disposant du mobilier nécessaire. Sa durée est de **1 an** (reconductible) ou de **9 mois minimum** pour les étudiants.

Le bail meublé offre plus de flexibilité (résiliation plus aisée, loyer potentiellement plus élevé) mais exige un niveau d'équipement minimal conforme au décret n° 2015-981.

## Les clauses interdites dans un bail de location

Depuis la loi ALUR, plusieurs clauses sont systématiquement nulles :

1. **Clause de solidarité** entre colocataires (sauf en colocation)
2. **Clause de pénalité** pour retard de paiement
3. **Clause interdisant au locataire de sous-louer** sans autorisation
4. **Clause de visite sans préavis** du logement
5. **Clause obligeant le locataire à payer les honoraires d'agence** à la relocation
6. **Clause de dépôt de garantie supérieur au plafond légal**

Le propriétaire qui inclut des clauses interdites s'expose à des sanctions. Le juge peut être saisi à tout moment par le locataire.

## Les clauses facultatives recommandées

### Clause de révision du loyer (IRL)
Précisez la date de référence de l'IRL utilisée pour les révisions annuelles (date d'anniversaire du bail).

### Clause relative aux animaux domestiques
Depuis la loi ALUR, interdiction d'interdire globalement la présence d'animaux. Vous pouvez imposer que les animaux soient gardés sous contrôle.

## Les diagnostics obligatoires à annexer au bail

Le dossier de diagnostic technique (DDT) doit être remis au locataire en annexe du bail :

| Diagnostic | Durée de validité |
|---|---|
| DPE (Performance Énergétique) | 10 ans |
| Constat de risque d'exposition au plomb | 1 an si positif, sinon illimitée |
| État des risques et pollutions (ERP) | 6 mois |
| Surface Carrez | Tant que non modifié |
| Diagnostic amiante | 3 ans si positif, sinon illimité |

## Combien de temps garder un bail ?

Conservez votre bail pendant toute la durée de la location et les **5 années suivant la fin du bail**. En cas de litige, le bail est la preuve principale de l'accord contractuel.

## FAQ — Rédaction du contrat de location

**Le bail doit-t-il être enregistré ?**
Pour les locations vides à usage de résidence principale, le locataire peut demander l'enregistrement dans les 2 mois suivant la signature.

**Peut-on rédiger un bail sans agence ?**
Oui. Vous pouvez rédiger le bail vous-même à condition de respecter les mentions obligatoires. Des modèles gratuits et conformes sont disponibles en ligne.

**Que faire si une clause du bail est potentiellement illicite ?**
Toute clause interdite est automatiquement nulle. Le bail reste valide par ailleurs. Le locataire peut saisir la CDC ou le tribunal judiciaire.

[CTA : Créez vos baux de location conformes en 5 minutes avec RentReady — essai gratuit]`,},
  {
    slug: "logiciel-gestion-locative-gratuit-vs-payant",
    title: "Logiciel gestion locative gratuit vs payant : lequel choisir en 2026",
    excerpt:
      "Free property management tools have limits. Compare free vs paid solutions for French landlords — features, costs, compliance, and scalability.",
    category: "Gestion",
    date: "2026-04-15",
    updatedAt: '2026-04-15',
    readTime: "9 min",
  },
  {
    slug: "comment-gerer-biens-locatifs",
    title: "Comment gérer ses biens locatifs : guide complet du propriétaire",
    excerpt:
      "Gestion locative complète : suivi des loyers, entretien, assurances, obligations légales. Tout pour gérer efficacement vos locations.",
    category: "Gestion",
    date: "2026-04-15",
    updatedAt: '2026-04-15',
    readTime: "10 min",
  },
  {
    slug: "augmentation-loyer-regles-et-procedure",
    title: "Augmentation de loyer : règles et procédure en 2026",
    excerpt:
      "IRL, plafonds, zones tendues, révision annuelle : comment augmenter legalmente votre loyer en 2026. Guide complet bailleur.",
    category: "Calculs",
    date: "2026-04-15",
    updatedAt: '2026-04-15',
    readTime: "8 min",
  },
  {
    slug: "charges-locatives-recuperables-liste",
    title: "Charges locatives récupérables : liste complète et réglementation 2026",
    excerpt:
      "Quelles charges le propriétaire peut-il récupérer auprès du locataire ? Liste exhaustive, modalités de régularisation et pièges à éviter.",
    category: "Juridique",
    date: "2026-04-15",
    updatedAt: '2026-04-15',
    readTime: "7 min",
  }
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
