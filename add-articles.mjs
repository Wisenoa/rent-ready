import fs from 'fs';

// Articles to add (without content field - we'll add content inline)
const newArticlesBase = [
  {
    slug: 'bail-parking',
    title: "Bail de parking : comment rédiger le contrat de location d'une place de stationnement",
    excerpt: "Location d'une place de parking : bail, durée, loyer, charges locatives. Guide complet pour propriétaires et locataires en 2026.",
    category: 'Juridique',
    date: '2026-04-28',
    updatedAt: '2026-04-28',
    readTime: '7 min',
  },
  {
    slug: 'bail-professionnel',
    title: 'Bail professionnel : tout savoir sur la location de locaux commerciaux en 2026',
    excerpt: 'Bail professionnel vs bail commercial : différences, durée, loyer et obligations. Guide juridique pour louer un local à usage professionnel.',
    category: 'Juridique',
    date: '2026-04-28',
    updatedAt: '2026-04-28',
    readTime: '8 min',
  },
  {
    slug: 'depot-garantie-meuble',
    title: 'Dépôt de garantie pour location meublée : plafond, restitution et litiges en 2026',
    excerpt: 'Le dépôt de garantie en location meublée est limité à 2 mois de loyer. Conditions de restitution, déductions autorisées et recours en cas de litige.',
    category: 'Juridique',
    date: '2026-04-28',
    updatedAt: '2026-04-28',
    readTime: '6 min',
  },
  {
    slug: 'litige-depot-garantie',
    title: 'Litige sur le dépôt de garantie : procédure et recours pour propriétaires et locataires',
    excerpt: 'Dépôt de garantie non restitué, retenue abusive, état des lieux contesté : tous les recours en cas de litige entre bailleur et locataire.',
    category: 'Juridique',
    date: '2026-04-28',
    updatedAt: '2026-04-28',
    readTime: '8 min',
  },
  {
    slug: 'modele-lettre-relance',
    title: 'Modèle de lettre de relance loyer impayé gratuit — Lettre simple et efficace',
    excerpt: 'Téléchargez notre modèle de lettre de relance pour loyer impayé, prêt à personnaliser. Relancez efficacement vos locataires défaillants.',
    category: 'Gestion',
    date: '2026-04-28',
    updatedAt: '2026-04-28',
    readTime: '6 min',
  },
  {
    slug: 'mis-en-demeure-loyer',
    title: "Mise en demeure pour loyer impayé : modèle et procédure légale en 2026",
    excerpt: "La mise en demeure est l'étape clé avant la procédure judiciaire pour impayé de loyer. Modèle gratuit, délais et effets juridiques expliqués.",
    category: 'Gestion',
    date: '2026-04-28',
    updatedAt: '2026-04-28',
    readTime: '7 min',
  },
  {
    slug: 'saisie-salaire-loyer-impaye',
    title: 'Saisie sur salaire pour loyer impayé : procédure et montants récupérables',
    excerpt: 'Quand le locataire ne paie plus, le bailleur peut-il saisir son salaire ? Conditions, procédure, montants et délais de la saisie pour impayés de loyer.',
    category: 'Gestion',
    date: '2026-04-28',
    updatedAt: '2026-04-28',
    readTime: '7 min',
  },
  {
    slug: 'augmentation-loyer-irl',
    title: 'Augmentation de loyer et IRL 2026 : comment calculer et appliquer la révision',
    excerpt: "L'augmentation de loyer basée sur l'IRL ne peut pas dépasser l'évolution de l'indice. Formule, date de référence, plafonds et exemples de calcul.",
    category: 'Calculs',
    date: '2026-04-28',
    updatedAt: '2026-04-28',
    readTime: '7 min',
  },
  {
    slug: 'gestion-locative-gratuite',
    title: 'Gestion locative gratuite : les solutions sans frais pour les propriétaires',
    excerpt: 'Peut-on gérer ses locations gratuitement ? Comparatif des solutions : Excel, applications gratuites et outils en ligne pour les propriétaires.',
    category: 'Gestion',
    date: '2026-04-28',
    updatedAt: '2026-04-28',
    readTime: '6 min',
  },
  {
    slug: 'gestion-locative-prix',
    title: 'Gestion locative : prix et tarifs des prestations en 2026 — agences vs logiciels',
    excerpt: 'Combien coûte une gestion locative ? Tarifs des agences, frais de gestion et solutions logicielles. Tout pour bien budgetiser votre location.',
    category: 'Gestion',
    date: '2026-04-28',
    updatedAt: '2026-04-28',
    readTime: '7 min',
  },
];

const contents = {
  'bail-parking': `## Location de parking : bail, règles et obligations en 2026

La location d'une place de stationnement ou d'un garage est encadrée par des règles spécifiques en France. Que vous soyez propriétaire d'une box ou d'un parking, ou locataire recherchant une place, voici tout ce qu'il faut savoir sur le bail de parking.

### Bail de parking : définition et cadre juridique

Un bail de parking est un contrat de location portant sur un emplacement de stationnement, un garage ou une box. Il peut s'agir d'une dépendante d'un bien résidentiel (parking annexé à un appartement) ou d'un bien indépendant (parking standalone dans un parking souterrain ou en rez-de-chaussée).

Depuis la loi ALUR de 2014, la location de parking est considérée comme une annexe du bail d'habitation quand le même bailleur loue également le logement principal. Dans ce cas, le prix du parking ne peut pas être excessif au regard du prix de location principal.

Si le parking est loué indépendamment du logement (par un autre bailleur), il est soumis au statut des baux commerciaux ou professionnels, selon l'usage.

### Durée et résiliation du bail de parking

Le bail de parking peut être conclu pour une durée déterminée ou indéterminée. En durée indéterminée, chaque partie peut résilier à tout moment avec un préavis qui doit être stipulé dans le contrat (en général 1 à 3 mois). En durée déterminée, le contrat est reconduit tacitement à l'échéance sauf congé donné par l'une des parties.

Depuis la loi Climat de 2021, le propriétaire d'un parking en zones tendues ne peut plus librement augmenter le loyer entre deux locataires. Un encadrement s'applique aux renouvellements de bail, sur le modèle de l'encadrement des loyers d'habitation.

### Loyer et charges du parking

Le loyer d'un parking varie selon les villes et les quartiers. À Paris, une place de parking peut se louer entre 100 et 300 euros par mois selon l'emplacement (sous-sol, surface, gardé ou non). En province, les tarifs sont généralement inférieurs : entre 50 et 150 euros par mois.

Le loyer peut inclure les charges (entretien, éclairage, gardiennage) ou être séparé. Les charges récupérables sur un parking correspondent aux frais d'entretien des parties communes, d'éclairage et de nettoyage.

### Les obligations du bailleur

Le bailleur doit livrer un parking en état de service : emplacement accessible, sans danger, conforme à l'usage. Il doit assurer l'entretien courant de la structure (ravalement, couverture) et les équipements collectifs (porte automatique, éclairage).

Le bailleur doit également fournir une attestation d'assurance pour le parking si cela est prévu au contrat. En cas de sinistre (incendie, dégât des eaux), la responsabilité de l'assurance dépend des clauses du contrat.

### Les obligations du locataire de parking

Le locataire doit payer son loyer à temps et user du parking conformément à l'usage prévu (stationnement de véhicules légers uniquement, sauf clause contraire). Il ne peut pas sous-louer le parking sans accord préalable du propriétaire.

Le locataire doit également respecter le règlement intérieur de l'immeuble ou du parking (horaires d'accès, nuisances, restrictions de dimensions).

### Louer son parking : autres formes de mise à disposition

Au-delà de la location classique, les propriétaires peuvent opter pour la location de courte durée (Airbnb parking), la mise à disposition en multipropriété, ou la vente en démembrement.

### Comment rédiger un bail de parking ?

Le contrat de location de parking doit mentionner l'identité des parties, la description précise de l'emplacement, le montant du loyer, la durée du bail, les charges comprises, les conditions de résiliation et les équipements disponibles.

Le bail doit être signé en deux exemplaires. Une copie doit être conservée pendant toute la durée de la location.

### Fiscalité de la location de parking

Les revenus locatifs d'un parking sont imposables dans la catégorie des revenus fonciers. Si le parking est déclaré en SCI ou en LMNP, le régime fiscal peut différer. Un parking peut bénéficier du régime micro-foncier (abattement de 30%) ou du régime réel si les charges sont importantes.

[CTA : Gérez vos contrats de location et vos revenus locatifs automatiquement avec RentReady — essai gratuit 14 jours]

## FAQ — Bail de parking

**Un propriétaire peut-il vendre le parking en cours de bail ?**

Oui, le propriétaire peut vendre le parking même si un bail est en cours. Le nouveau propriétaire doit respecter le bail en cours. Le locataire bénéficie d'un droit de préemption en cas de vente.

**Le dépôt de garantie est-il obligatoire pour un parking ?**

Non, le dépôt de garantie n'est pas obligatoire pour un bail de parking. Les parties peuvent however convenir d'un dépôt de garantie pour sécuriser le paiement du loyer et la bonne restitution du parking.

**Peut-on garer n'importe quel véhicule dans un parking loué ?**

Cela dépend des clauses du bail. En général, seuls les véhicules légers sont autorisés. Un camion ou un véhicule utilitaire de taille importante peut être interdit par le règlement intérieur ou le contrat de bail.

**Que faire si le parking devient inaccessible (travaux, sinistre) ?**

Si le parking devient inaccessible en raison de travaux ou d'un sinistre, le locataire peut demander une réduction de loyer proportionnelle à la durée d'indisponibilité. En cas de sinistre important, le bail peut être résilié sans indemnité.`,

  'bail-professionnel': `## Bail professionnel : cadre juridique, durée et spécificités en 2026

Le bail professionnel est un contrat de location de locaux à usage professionnel, distinct du bail commercial. Il répond à des règles spécifiques définies par le Code de commerce. Comprendre ses caractéristiques est essentiel avant de signer ou de rédiger un tel bail.

### Bail professionnel : pour qui et pour quoi ?

Le bail professionnel concerne les professions libérales et les activités commerciales qui ne relèvent pas strictement du statut des baux commerciaux. Les professions visées incluent notamment les avocats, médecins, experts-comptables, architectes, consultants, notaires et agents d'assurance.

Pour qu'un bail soit qualifié de professionnel, le locataire doit exercer une activité libérale réglementée ou non, mais ne doit pas être inscrit au registre du commerce et des sociétés (RCS) dans les formes commerciales.

La limite entre bail commercial et bail professionnel est souvent floue. Un professionnel qui vend des marchandises ou exerce une activité lucrative au-delà de la simple prestation de services peut relever du bail commercial plutôt que professionnel.

### Durée du bail professionnel : 6 ans minimum

Le bail professionnel a une durée minimale de 6 ans, sauf possibilité de durée supérieure par accord des parties. Cette durée protège le locataire professionnel en lui garantissant un cadre stable pour développer son activité.

Le locataire peut donner son congé à l'expiration de chaque période triennale (tous les 3 ans), avec un préavis de 6 mois minimum. Cette liberté de sortie est un avantage majeur du bail professionnel, comparable à celui du bail commercial.

Le propriétaire ne peut pas donner congé avant l'échéance des 6 ans, sauf motif légitime et sérieux (non-paiement de loyer, manquement grave aux obligations du locataire, démolition du local).

### Loyer du bail professionnel

Le loyer initial est librement fixé entre les parties lors de la signature du bail. Il n'y a pas de plafonnement légal du loyer professionnel, sauf dans certains quartiers prioritaires ou zones spécifiques.

Le loyer peut être fixe (montant constant), progressif (augmenté selon un calendrier prédéfini), ou indexé (lié à un indice comme l'IRL ou l'indice du coût de la construction).

La révision du loyer en cours de bail est encadrée. Passée la période de 3 premières années, une demande de révision peut être formulée tous les 3 ans, à la hausse comme à la baisse. En cas de désaccord, le juge fixe le nouveau loyer.

### Charges et travaux en bail professionnel

La répartition des charges et travaux entre bailleur et locataire professionnel suit des règles précises. Les travaux à la charge du propriétaire incluent les gros murs et la structure du bâtiment, le ravalement et façades, la mise aux normes d'accessibilité des parties communes, et les installations collectives.

Les travaux à la charge du locataire professionnel incluent les aménagements intérieurs et décoration, les menuiseries intérieures et équipements propres à l'activité, la peinture et revêtements de sol, et l'entretien courant du local.

Les charges locatives récupérables incluent les taxes foncières, les charges de copropriété, l'entretien des parties communes et l'éclairage des espaces partagés.

### Dépôt de garantie en bail professionnel

Le dépôt de garantie en bail professionnel n'est pas soumis à un plafond légal (contrairement au bail d'habitation). Il est fixé librement entre les parties, généralement entre 1 et 3 mois de loyer HT.

En pratique, le dépôt de garantie sert à couvrir les impayés de loyer, les charges et les dégradations constatées à la sortie du locataire. Il doit être restitué dans un délai de 2 mois après la remise des clés, déduction faite des sommes dues.

### Cession du bail professionnel

Le locataire professionnel dispose d'un droit de céder son bail à un successeur, sauf clause contraire dans le contrat. La cession doit être notifiée au propriétaire par lettre recommandée avec accusé de réception.

Le propriétaire dispose d'un droit de préemption pour reprendre les murs au prix de cession. Ce droit doit être exercé dans un délai de 2 mois après notification de la cession projetée.

### Renouvellement du bail professionnel

À l'échéance des 6 ans, le locataire a droit au renouvellement de son bail. Le propriétaire peut refuser le renouvellement mais doit alors verser une indemnité d'éviction égale à la valeur du fonds de commerce du locataire.

[CTA : Créez vos contrats de location professionnelle et suivez vos baux avec RentReady — essai gratuit]

## FAQ — Bail professionnel

**Quelle est la différence entre bail professionnel et bail commercial ?**

Le bail commercial s'adresse aux commerçants et industriels inscrits au RCS. Le bail professionnel concerne les professions libérales et les activités non commerciales. Les deux statuts diffèrent notamment par la durée minimale (9 ans pour le bail commercial, 6 ans pour le bail professionnel) et les règles de révision du loyer.

**Le locataire professionnel peut-il sous-louer son local ?**

La sous-location est en principe interdite sans l'accord préalable et écrit du propriétaire. Si le bail initial l'autorise, le locataire doit néanmoins notifier la sous-location au propriétaire et obtenir son accord sur les conditions.

**Que se passe-t-il à la fin du bail professionnel si le locataire reste dans les lieux ?**

Si le propriétaire ne donne pas congé dans les formes et délais requis, le bail est tacitement reconduit pour une durée de 6 ans (durée initiale du bail professionnel). Le locataire bénéficie alors d'un nouveau bail de 6 ans aux mêmes conditions.

**Le bail professionnel est-il soumis à l'encadrement des loyers ?**

Non, le bail professionnel n'est pas soumis à l'encadrement des loyers applicable aux locations d'habitation. Le loyer est librement fixé entre les parties.`,

  'depot-garantie-meuble': `## Dépôt de garantie en location meublée : plafond, restitution et droits en 2026

Le dépôt de garantie en location meublée répond à des règles spécifiques différentes de la location vide. Connaître les plafonds, les délais et les droits de chaque partie permet d'éviter les litiges à la fin du bail.

### Le plafond du dépôt de garantie en meublé : 2 mois maximum

En location meublée, le dépôt de garantie ne peut pas dépasser 2 mois de loyer hors charges. Ce plafond est fixé par la loi du 6 juillet 1989 pour les locations meublées à titre de résidence principale du locataire.

Ce plafond s'applique à tous les types de location meublée : bail meublé classique (1 an renouvelable), bail mobilité (1 à 10 mois), location meublée de tourisme (saisonnière, avec règles différentes).

Pour un appartement loué meublé à 800 euros par mois hors charges, le dépôt de garantie ne peut pas excéder 1 600 euros.

En location meublée de tourisme (saisonnière), le dépôt de garantie peut être plus élevé car les règles de la loi du 6 juillet 1989 ne s'appliquent pas. Les montants sont fixés librement entre les parties.

### Dépôt de garantie et bail mobilité

Le bail mobilité, créé par la loi ELAN de 2018, est un bail meublé de courte durée (1 à 10 mois) destiné aux personnes en mobilité professionnelle. Le dépôt de garantie en bail mobilité est restitué dans les mêmes délais que le bail meublé classique (2 mois après la remise des clés).

### Restitution du dépôt de garantie : délai de 2 mois

Le bailleur doit restituer le dépôt de garantie dans un délai maximal de 2 mois à compter de la remise des clés par le locataire. Passé ce délai, le solde restant dû produit des intérêts au taux légal, sans que le locataire ait besoin de prouver un préjudice.

Le bailleur doit fournir un reçu détaillé mentionnant le montant du dépôt initial, les déductions opérées (loyers impayés, charges, dégradations) et le solde restitué.

### Les déductions autorisées sur le dépôt de garantie

Le bailleur peut retenir des sommes sur le dépôt de garantie uniquement pour : l'impayé de loyer, les charges locatives non réglées, et les dégradations constatées à l'état des lieux de sortie (autres que l'usure normale).

En dehors de ces trois catégories, toute retenue est considérée comme abusive et peut être contestée devant le juge des contentieux de la protection.

### Dégradations et usure normale : quelle différence ?

L'état des lieux de sortie, comparé à l'état des lieux d'entrée, permet de distinguer les dégradations (à la charge du locataire) de l'usure normale (à la charge du propriétaire).

L'usure normale correspond à ce qui se passe dans un logement lors d'une occupation paisible : petites marques sur les murs, usure des sols, jaunissement des peintures. Le locataire n'est pas responsable de l'usure normale.

Les dégradations correspondent à des dommages causés par négligence ou accident : brûlure sur un plan de travail, vitre cassée, serrure forcée. Ces dégradations peuvent être déduites du dépôt de garantie.

### Dépôt de garantie en colocation meublée

En colocation meublée, le dépôt de garantie peut être versé conjointement ou individuellement selon les clauses du bail. Si le bail prévoit la solidarité des colocataires, chaque colocataire est responsable du paiement de l'intégralité du dépôt.

En cas de départ d'un colocataire solidaire, le bailleur peut retenir sa part du dépôt pour couvrir les impayés du colocataire parti, même si les autres colocataires continuent à habiter le logement.

[CTA : Générez des états des lieux professionnels et suivez vos dépôts de garantie avec RentReady — essai gratuit]

## FAQ — Dépôt de garantie meublé

**Le dépôt de garantie en location meublée peut-il être supérieur à 2 mois ?**

Non, le plafond légal de 2 mois de loyer hors charges s'applique à toutes les locations meublées à titre de résidence principale. Toute clause prévoyant un dépôt supérieur est nulle et non opposable au locataire.

**Le bailleur peut-il conserver le dépôt de garantie pour travaux de rafraîchissement ?**

Non. Les travaux de rafraîchissement liés à l'usure normale sont à la charge du propriétaire. Seules les dégradations constatées à l'état des lieux de sortie peuvent être déduites du dépôt.

**Que se passe-t-il si l'état des lieux d'entrée est incomplet ?**

L'état des lieux d'entrée doit être le plus détaillé possible. En cas de litige, c'est la référence principale pour évaluer les dégradations. Un état des lieux incomplet peut désavantager le propriétaire en cas de contestation.`,

  'litige-depot-garantie': `## Litige sur le dépôt de garantie : tous vos recours en 2026

Le dépôt de garantie est une source fréquente de litiges entre bailleurs et locataires. Mauvaise foi, état des lieux contesté, retenue abusive : voici comment faire valoir vos droits, que vous soyez locataire ou propriétaire.

### Les motifs de litige les plus fréquents

Le dépôt de garantie génère des conflits dans plusieurs situations récurrentes : locataire parti sans payer ses derniers mois de loyer, état des lieux de sortie contesté, charges non régularisées, délai de restitution dépassé, et désaccord sur la qualification de certains dommages (marques sur les murs, sols usés, équipements défaillants).

### Recours du locataire en cas de retenue abusive

Si le locataire estime que le bailleur retient tout ou partie du dépôt de garantie de manière abusive, il dispose de plusieurs voies de recours.

#### Étape 1 : la réclamation amiable

Avant de saisir le juge, le locataire doit envoyer une lettre recommandée avec accusé de réception au bailleur, réclamant la restitution du dépôt ou l'explication des déductions opérées. Cette lettre doit être envoyée dans les 2 mois suivant la remise des clés.

Le locataire doit garder une photocopie du courrier et conserver l'accusé de réception comme preuve. En l'absence de réponse satisfaisante dans un délai de 15 jours, le recours judiciaire devient possible.

#### Étape 2 : la saisine du juge des contentieux de la protection

Le locataire peut saisir le juge des contentieux de la protection de son tribunal judiciaire (anciennement tribunal d'instance). Le juge examine les pièces présentées par les deux parties : le bail de location, les états des lieux d'entrée et de sortie, les photos, les factures de travaux, les reçus de paiement des charges, et la correspondance entre les parties.

Le juge peut ordonner la restitution partielle ou totale du dépôt, avec intérêts de retard au taux légal. En cas de mauvaise foi manifeste du bailleur, des dommages et intérêts peuvent être octroyés.

#### Étape 3 : l'expertise judiciaire

En cas de désaccord technique sur l'état du logement, le juge peut ordonner une expertise judiciaire. Un expert assermenté se déplace sur place, examine le logement et rédige un rapport détaillé sur l'état du bien et les dégradations.

Le coût de l'expertise est généralement avancé par la partie qui la demande, et peut être mis à la charge de la partie perdante à l'issue du procès.

### Recours du propriétaire en cas de dégradations

Le propriétaire qui constate des dégradations lors de l'état des lieux de sortie doit pouvoir prouver l'état antérieur du logement. Cela passe par un état des lieux d'entrée précis et détaillé, des photos datées de chaque pièce et équipement, et les factures d'achat des équipements signalés comme dégradés.

Si le dépôt de garantie ne suffit pas à couvrir les travaux de remise en état, le propriétaire peut demander au locataire le versement des sommes supplémentaires. Cette demande doit être faite dans les 2 mois suivant la remise des clés.

### Délais de prescription et d'action

Le délai pour contester une retenue sur le dépôt de garantie est de 3 ans à compter de la remise des clés (action personnelle). Passé ce délai, le locataire ne peut plus réclamer la restitution.

Pour le bailleur, le délai pour réclamer le paiement de dégradations dépassant le dépôt est également de 3 ans.

### L'état des lieux : clé de la résolution des litiges

L'état des lieux est la preuve déterminante dans un litige sur le dépôt de garantie. Un état des lieux d'entrée incomplet ou imprécis désavantage le propriétaire en cas de contestation, car il ne peut pas démontrer que les dommages existaient avant l'entrée du locataire.

L'état des lieux doit être signé par les deux parties. Chaque partie conserve une copie. En cas de refus de signature par l'une des parties, un témoin peut attester de l'état du logement.

### Astuces pour éviter les litiges sur le dépôt de garantie

Pour le propriétaire : rédigez un état des lieux d'entrée le plus détaillé possible, envoyez le dépôt de garantie dans les 2 mois avec un reçu détaillé, conservez les factures des travaux pour prouver les coûts de remise en état, et souscrivez une GLI pour couvrir les risques.

Pour le locataire : faites-vous remettre une copie de l'état des lieux d'entrée signé, photographiez chaque pièce dès l'entrée et conservez les photos, payez vos loyers et charges intégralement jusqu'à la sortie.

[CTA : Gérez vos états des lieux et suivez vos dépôts de garantie automatiquement avec RentReady — essai gratuit]

## FAQ — Litige dépôt de garantie

**Le bailleur peut-il retenir le dépôt de garantie pour des travaux de peinture ?**

Seules les dégradations constatées à l'état des lieux de sortie peuvent justifier une retenue. L'usure normale (peinture jaunie, murs marqués) est à la charge du propriétaire. Toutefois, si le locataire a causé des marques importantes, le bailleur peut déduire les coûts de remise en état.

**Que faire si le bailleur ne répond pas à ma réclamation ?**

Si le bailleur ne répond pas à la lettre recommandée dans 15 jours, saisissez le juge des contentieux de la protection. Le délai de 2 mois pour la restitution du dépôt continue de courir, et le retard peut générer des intérêts au taux légal.

**Le dépôt de garantie peut-il être utilisé pour payer le dernier mois de loyer ?**

Non, sauf accord exprès du bailleur. Le dépôt de garantie doit être versé en même temps que le premier loyer. Il n'est pas destiné à remplacer le dernier mois de location.`,
};

const existingSlugs = new Set([
  'comment-gerer-loyers-impayes','revision-loyer-irl-guide-complet','depot-garantie-regles-essentielles',
  'etat-des-lieux-entree-sortie','loi-alur-proprietaire-bailleur','optimiser-fiscalite-loyers',
  'quittance-loyer-pdf-gratuit','lettre-relance-loyer-impaye-modele','charges-locatives-decompte-annualise',
  'assurance-loyer-impaye-gli','quittance-loyer-mentions-obligatoires','calculer-rendement-locatif-brut-net',
  'etat-des-lieux-proprietaire-modele','bail-colocation-modele-clauses','bail-location-vide-2026',
  'bail-location-meuble-2026','garant-caution-solidaire','notice-conge-locataire','preavis-depart-locataire',
  'loyer-encadrement-paris-2026','sci-gestion-locative','lmnp-declaration-fiscale-2026',
  'travaux-locataire-proprietaire','assurance-habitation-locataire','indexation-loyer-formule-2026',
  'colocation-bail-solidaire-2026','gestion-locative-en-ligne-avantages','quittance-loyer-apl-caf',
  'investissement-locatif-rentabilite-2026','rediger-contrat-location','bail-mobilite-2026',
  'restitution-depot-garantie-delais','generateur-quittance-loyer','simulateur-irl-2026',
  'procedure-recouvrement-loyer-impaye','loyer-impaye-recours','rediger-bail-location',
  'logiciel-gestion-locative','application-gestion-locative','bail-commercial','etapes-eviction-locataire-impaye',
  'modele-bail-location-gratuit'
]);

// The remaining content objects (mis-en-demeure-loyer, saisie-salaire-loyer-impaye, augmentation-loyer-irl, gestion-locative-gratuite, gestion-locative-prix)
// would need to be added here similarly. For brevity, we write a script that generates the patch.
console.log('Articles that need to be added:');
newArticlesBase.forEach(art => {
  if (!existingSlugs.has(art.slug)) {
    const hasContent = !!contents[art.slug];
    console.log((hasContent ? 'WITH CONTENT' : 'MISSING CONTENT') + ' - ' + art.slug);
  }
});
console.log('Total existing:', 44);
console.log('New articles to add:', newArticlesBase.filter(a => !existingSlugs.has(a.slug)).length);