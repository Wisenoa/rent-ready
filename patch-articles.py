#!/usr/bin/env python3
import re

# Read existing articles.ts
with open('src/data/articles.ts', 'r') as f:
    content = f.read()

# Read the script with article data
with open('write-articles.mjs', 'r') as f:
    script = f.read()

# Extract new articles from the mjs file (simplified approach - build dict from what we know)
new_articles = [
    {
        "slug": "bail-parking",
        "title": "Bail de parking : comment rédiger le contrat de location d'une place de stationnement",
        "excerpt": "Location d'une place de parking : bail, durée, loyer, charges locatives. Guide complet pour propriétaires et locataires en 2026.",
        "category": "Juridique",
        "date": "2026-04-28",
        "updatedAt": "2026-04-28",
        "readTime": "7 min",
        "content": """## Location de parking : bail, règles et obligations en 2026

La location d'une place de stationnement ou d'un garage est encadrée par des règles spécifiques en France. Que vous soyez propriétaire d'une box ou d'un parking, ou locataire recherchant une place, voici tout ce qu'il faut savoir sur le bail de parking.

### Bail de parking : définition et cadre juridique

Un bail de parking est un contrat de location portant sur un emplacement de stationnement, un garage ou une box. Il peut s'agir d'une dépendance d'un bien résidentiel (parking annexé à un appartement) ou d'un bien indépendant (parking standalone dans un parking souterrain ou en rez-de-chaussée).

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

Au-delà de la location classique, les propriétaires peuvent opter pour :

- **La location de courte durée** (Airbnb parking) : location journalière ou hebdomadaire, rentable en zone urbaine dense
- **La mise à disposition en multipropriété** : plusieurs utilisateurs se partagent l'accès au parking selon un planning défini
- **La vente en démembrement** : le droit d'usage du parking est vendu séparément de la propriété

### Comment rédiger un bail de parking ?

Le contrat de location de parking doit mentionner l'identité complète du bailleur et du locataire, la description précise de l'emplacement (adresse, niveau, numéro de place), le montant du loyer et les modalités de paiement, la durée du bail et les conditions de renouvellement, les charges comprises ou non comprises dans le loyer, les conditions de résiliation et le préavis applicable, et les équipements disponibles (porte automatique, éclairage, gardiennage).

Le bail doit être signé en deux exemplaires, un pour chaque partie. Une copie doit être conservée pendant toute la durée de la location.

### Fiscalité de la location de parking

Les revenus locatifs d'un parking sont imposables dans la catégorie des revenus fonciers. Si le parking est lié au domicile principal du propriétaire, les revenus sont intégrés à la déclaration de revenus fonciers habituelle.

Si le parking est déclaré en SCI ou en LMNP (location meublée non professionnelle), le régime fiscal peut différer. Un parking peut bénéficier du régime micro-foncier (abattement de 30%) ou du régime réel si les charges sont importantes.

Pour un parking acquis via un investissement Pinel, la location doit respecter des conditions strictes de durée et de plafonds de loyer pour maintenir l'avantage fiscal.

[CTA : Gérez vos contrats de location et vos revenus locatifs automatiquement avec RentReady — essai gratuit 14 jours]

## FAQ — Bail de parking

**Un propriétaire peut-il vendre le parking en cours de bail ?**

Oui, le propriétaire peut vendre le parking même si un bail est en cours. Le nouveau propriétaire doit respecter le bail en cours et ne peut pas expulser le locataire avant l'échéance. Le locataire bénéficie d'un droit de préemption en cas de vente.

**Le dépôt de garantie est-il obligatoire pour un parking ?**

Non, le dépôt de garantie n'est pas obligatoire pour un bail de parking. Les parties peuvent toutefois convenir d'un dépôt de garantie pour sécuriser le paiement du loyer et la bonne restitution du parking.

**Peut-on garer n'importe quel véhicule dans un parking loué ?**

Cela dépend des clauses du bail. En général, seuls les véhicules légers sont autorisés. Un camion ou un véhicule utilitaire de taille importante peut être interdit par le règlement intérieur ou le contrat de bail.

**Que faire si le parking devient inaccessible (travaux, sinistre) ?**

Si le parking devient inaccessible en raison de travaux ou d'un sinistre, le locataire peut demander une réduction de loyer proportionnelle à la durée d'indisponibilité. En cas de sinistre important, le bail peut être résilié sans indemnité."""
    },
    {
        "slug": "bail-professionnel",
        "title": "Bail professionnel : tout savoir sur la location de locaux commerciaux en 2026",
        "excerpt": "Bail professionnel vs bail commercial : différences, durée, loyer et obligations. Guide juridique pour louer un local à usage professionnel.",
        "category": "Juridique",
        "date": "2026-04-28",
        "updatedAt": "2026-04-28",
        "readTime": "8 min",
        "content": """## Bail professionnel : cadre juridique, durée et spécificités en 2026

Le bail professionnel est un contrat de location de locaux à usage professionnel, distinct du bail commercial. Il répond à des règles spécifiques définies par le Code de commerce. Comprendre ses caractéristiques est essentiel avant de signer ou de rédiger un tel bail.

### Bail professionnel : pour qui et pour quoi ?

Le bail professionnel concerne les professions libérales et les activités commerciales qui ne relèvent pas strictement du statut des baux commerciaux. Les professions visées incluent notamment les avocats, médecins, experts-comptables, architectes, consultants, notaires et agents d'assurance.

Pour qu'un bail soit qualifié de professionnel, le locataire doit exercer une activité libérale réglementée ou non, mais ne doit pas être inscrit au registre du commerce et des sociétés (RCS) dans les formes commerciales (société anonyme, société à responsabilité limitée destinataire d'actes de commerce).

La limite entre bail commercial et bail professionnel est souvent floue. Un professionnel qui vend des marchandises ou exerce une activité lucrative au-delà de la simple prestation de services peut relever du bail commercial plutôt que professionnel.

### Durée du bail professionnel : 6 ans minimum

Le bail professionnel a une durée minimale de **6 ans**, sauf possibilité de durée supérieure par accord des parties. Cette durée protège le locataire professionnel en lui garantissant un cadre stable pour développer son activité.

Le locataire peut donner son congé à l'expiration de chaque période triennale (tous les 3 ans), avec un préavis de 6 mois minimum. Cette liberté de sortie est un avantage majeur du bail professionnel, comparable à celui du bail commercial.

Le propriétaire ne peut pas donner congé avant l'échéance des 6 ans, sauf motif légitime et sérieux (non-paiement de loyer, manquement grave aux obligations du locataire, démolition du local).

### Loyer du bail professionnel

Le loyer initial est librement fixé entre les parties lors de la signature du bail. Il n'y a pas de plafonnement legal du loyer professionnel, sauf dans certains quartiers prioritaires ou zones spécifiques.

Le loyer peut être fixe (montant constant), progressif (augmenté selon un calendrier prédéfini), ou indexé (lié à un indice comme l'IRL ou l'indice du coût de la construction).

La révision du loyer en cours de bail est encadrée. Passée la période de 3 premières années, une demande de révision peut être formulée tous les 3 ans, à la hausse comme à la baisse. En cas de désaccord, le juge fixe le nouveau loyer.

### Charges et travaux en bail professionnel

La répartition des charges et travaux entre bailleur et locataire professionnel suit des règles précises.

**Travaux à la charge du propriétaire** : gros murs et structure du bâtiment, ravalement et façades, mise aux normes d'accessibilité des parties communes, et installations collectives (ascenseur, chauffage collectif).

**Travaux à la charge du locataire professionnel** : aménagements intérieurs et décoration, menuiseries intérieures et équipements propres à l'activité, peinture et revêtements de sol, et entretien courant du local.

Les charges locatives récupérables incluent les taxes foncières, les charges de copropriété, l'entretien des parties communes et l'éclairage des espaces partagés.

### Dépôt de garantie en bail professionnel

Le dépôt de garantie en bail professionnel n'est pas soumis à un plafond légal (contrairement au bail d'habitation). Il est fixé librement entre les parties, généralement entre 1 et 3 mois de loyer HT.

En pratique, le dépôt de garantie sert à couvrir les impayés de loyer, les charges et les dégradations constatées à la sortie du locataire. Il doit être restitué dans un délai de 2 mois après la remise des clés, déduction faite des sommes dues.

### Cession du bail professionnel

Le locataire professionnel dispose d'un droit de céder son bail à un successeur, sauf clause contraire dans le contrat. La cession doit être notifiée au propriétaire par lettre recommandée avec accusé de réception.

Le propriétaire dispose d'un droit de préemption pour reprendre les murs au prix de cession. Ce droit doit être exercé dans un délai de 2 mois après notification de la cession projetée.

### Renouvellement du bail professionnel

À l'échéance des 6 ans, le locataire a droit au renouvellement de son bail. Le propriétaire peut refuser le renouvellement mais doit alors verser une indemnité d'éviction égale à la valeur du fonds de commerce du locataire.

Si le propriétaire ne renouvelle pas et ne propose pas de contrepartie financière, le locataire peut saisir le juge pour obtenir le renouvellement ou une indemnité.

[CTA : Créez vos contrats de location professionnelle et suivez vos baux avec RentReady — essai gratuit]

## FAQ — Bail professionnel

**Quelle est la différence entre bail professionnel et bail commercial ?**

Le bail commercial s'adresse aux commerçants et industriels inscrits au RCS. Le bail professionnel concerne les professions libérales et les activités non commerciales. Les deux statuts diffèrent notamment par la durée minimale (9 ans pour le bail commercial, 6 ans pour le bail professionnel) et les règles de révision du loyer.

**Le locataire professionnel peut-il sous-louer son local ?**

La sous-location est en principe interdite sans l'accord préalable et écrit du propriétaire. Si le bail initial l'autorise, le locataire doit néanmoins notifier la sous-location au propriétaire et obtenir son accord sur les conditions.

**Que se passe-t-il à la fin du bail professionnel si le locataire reste dans les lieux ?**

Si le propriétaire ne donne pas congé dans les formes et délais requis, le bail est tacitement reconduit pour une durée de 6 ans (durée initiale du bail professionnel). Le locataire bénéficie alors d'un nouveau bail de 6 ans aux mêmes conditions.

**Le bail professionnel est-il soumis à l'encadrement des loyers ?**

Non, le bail professionnel n'est pas soumis à l'encadrement des loyers applicable aux locations d'habitation. Le loyer est librement fixé entre les parties. Toutefois, certaines zones font l'objet d'un encadrement spécifique pour les renouvellements de bail professionnel."""
    },
    {
        "slug": "depot-garantie-meuble",
        "title": "Dépôt de garantie pour location meublée : plafond, restitution et litiges en 2026",
        "excerpt": "Le dépôt de garantie en location meublée est limité à 2 mois de loyer. Conditions de restitution, déductions autorisées et recours en cas de litige.",
        "category": "Juridique",
        "date": "2026-04-28",
        "updatedAt": "2026-04-28",
        "readTime": "6 min",
        "content": """## Dépôt de garantie en location meublée : plafond, restitution et droits en 2026

Le dépôt de garantie en location meublée répond à des règles spécifiques différentes de la location vide. Connaître les plafonds, les délais et les droits de chaque partie permet d'éviter les litiges à la fin du bail.

### Le plafond du dépôt de garantie en meublé : 2 mois maximum

En location meublée, le dépôt de garantie ne peut pas dépasser **2 mois de loyer hors charges**. Ce plafond est fixé par la loi du 6 juillet 1989 pour les locations meublées à titre de résidence principale du locataire.

Ce plafond s'applique à tous les types de location meublée : bail meublé classique (1 an renouvelable), bail mobilité (1 à 10 mois), location meublée de tourisme (saisonnière, avec règles différentes).

Pour un appartement loué meublé à 800 euros par mois hors charges, le dépôt de garantie ne peut pas excéder 1 600 euros.

En location meublée de tourisme (saisonnière), le dépôt de garantie peut être plus élevé car les règles de la loi du 6 juillet 1989 ne s'appliquent pas. Les montants sont fixés librement entre les parties.

### Dépôt de garantie et bail mobilité

Le bail mobilité, créé par la loi ELAN de 2018, est un bail meublé de courte durée (1 à 10 mois) destiné aux personnes en mobilité professionnelle. Le dépôt de garantie en bail mobilité est restitué dans les mêmes délais que le bail meublé classique (2 mois après la remise des clés).

### Restitution du dépôt de garantie : délai de 2 mois

Le bailleur doit restituer le dépôt de garantie dans un délai maximal de **2 mois** à compter de la remise des clés par le locataire. Passé ce délai, le solde restant dû produit des intérêts au taux legal, sans que le locataire ait besoin de prouver un préjudice.

Le taux legal est actualisé chaque semestre par l'administration. Le bailleur doit fournir un reçu détaillé mentionnant le montant du dépôt initial, les déductions opérées (loyers impayés, charges, dégradations) et le solde restitué.

### Les déductions autorisées sur le dépôt de garantie

Le bailleur peut retenir des sommes sur le dépôt de garantie uniquement pour : l'impayé de loyer (si le locataire quitte avec des arriérés de loyer), les charges locatives non réglées (si des provisions de charges n'ont pas été régularisées), et les dégradations constatées à l'état des lieux de sortie (autres que l'usure normale).

En dehors de ces trois catégories, toute retenue est considérée comme abusive et peut être contestée devant le juge des contentieux de la protection.

### Dégradations et usure normale : quelle différence ?

L'état des lieux de sortie, comparé à l'état des lieux d'entrée, permet de distinguer les dégradations (à la charge du locataire) de l'usure normale (à la charge du propriétaire).

L'usure normale correspond à ce qui se passe dans un logement lors d'une occupation paisible : petites marques sur les murs, usure des sols, jaunissement des peintures. Le locataire n'est pas responsable de l'usure normale.

Les dégradations correspondent à des dommages causés par négligence ou accident : brûlure sur un plan de travail, vitre cassée, serrure forcée. Ces dégradations peuvent être déduites du dépôt de garantie.

En cas de litige sur la qualification d'une dégradation, le juge peut être saisi pour trancher. Une expertise peut être ordonnée pour évaluer les travaux de remise en état.

### Dépôt de garantie en colocation meublée

En colocation meublée, le dépôt de garantie peut être versé conjointement ou individuellement selon les clauses du bail. Si le bail prévoit la solidarité des colocataires, chaque colocataire est responsable du paiement de l'intégralité du dépôt.

En cas de départ d'un colocataire solidaire, le bailleur peut retenir sa part du dépôt pour couvrir les impayés du colocataire parti, même si les autres colocataires continuent à habiter le logement.

### Comment se protéger en tant que propriétaire ?

Pour sécuriser le dépôt de garantie, le propriétaire peut vérifier systématiquement l'état des lieux d'entrée avec des photos datées, faire un état des lieux de sortie comparatif dès la remise des clés, conserver tous les justificatifs de dégradation pour démontrer l'origine des dommages, et sottoscrir une GLI (Garantie Loyer Impayé) qui couvre les dégradations et les impayés.

[CTA : Générez des états des lieux professionnels et suivez vos dépôts de garantie avec RentReady — essai gratuit]

## FAQ — Dépôt de garantie meublé

**Le dépôt de garantie en location meublée peut-il être supérieur à 2 mois ?**

Non, le plafond legal de 2 mois de loyer hors charges s'applique à toutes les locations meublées à titre de résidence principale. Toute clause prévoyant un dépôt supérieur est nulle et non opposable au locataire.

**Le bailleur peut-il conserver le dépôt de garantie pour travaux de rafraîchissement ?**

Non. Les travaux de rafraîchissement liés à l'usure normale sont à la charge du propriétaire. Seules les dégradations constatées à l'état des lieux de sortie peuvent être déduites du dépôt.

**Que se passe-t-il si l'état des lieux d'entrée est incomplet ?**

L'état des lieux d'entrée doit être le plus détaillé possible. En cas de litige, c'est la référence principale pour évaluer les dégradations. Un état des lieux incomplet peut désavantager le propriétaire en cas de contestation, car le juge pourrait présumer que les dommages signalés à la sortie existaient déjà à l'entrée."""
    },
    {
        "slug": "litige-depot-garantie",
        "title": "Litige sur le dépôt de garantie : procédure et recours pour propriétaires et locataires",
        "excerpt": "Dépôt de garantie non restitué, retenue abusive, état des lieux contesté : tous les recours en cas de litige entre bailleur et locataire.",
        "category": "Juridique",
        "date": "2026-04-28",
        "updatedAt": "2026-04-28",
        "readTime": "8 min",
        "content": """## Litige sur le dépôt de garantie : tous vos recours en 2026

Le dépôt de garantie est une source fréquente de litiges entre bailleurs et locataires. Mauvaise foi, état des lieux contesté, retenue abusive : voici comment faire valoir vos droits, que vous soyez locataire ou propriétaire.

### Les motifs de litige les plus fréquents

Le dépôt de garantie génère des conflits dans plusieurs situations récurrentes : le locataire parti sans payer ses derniers mois de loyer (le bailleur retient tout ou partie du dépôt), l'état des lieux de sortie contesté (désaccord sur les dégradations), les charges non régularisées, le délai de restitution dépassé, et le désaccord sur la qualification de certains dommages (marques sur les murs, sols usés, équipements défaillants).

### Recours du locataire en cas de retenue abusive

Si le locataire estime que le bailleur retient tout ou partie du dépôt de garantie de manière abusive, il dispose de plusieurs voies de recours.

#### Étape 1 : la réclamation amiable

Avant de saisir le juge, le locataire doit envoyer une lettre recommandée avec accusé de réception au bailleur, réclamant la restitution du dépôt ou l'explication des déductions opérées. Cette lettre doit être envoyée dans les 2 mois suivant la remise des clés.

Le locataire doit garder une photocopie du courrier et conserver l'accusé de réception comme preuve. En l'absence de réponse satisfaisante dans un délai de 15 jours, le recours judiciaire devient possible.

#### Étape 2 : la saisine du juge des contentieux de la protection

Le locataire peut saisir le juge des contentieux de la protection de son tribunal judiciaire (anciennement tribunal d'instance). La saisine se fait par assignation ou par déclaration au greffe.

Le juge examine les pièces présentées par les deux parties : le bail de location, les états des lieux d'entrée et de sortie, les photos, les factures de travaux, les reçus de paiement des charges, et la correspondance entre les parties.

Le juge peut ordonner la restitution partielle ou totale du dépôt, avec intérêts de retard au taux legal. En cas de mauvaise foi manifeste du bailleur, des dommages et intérêts peuvent être octroyés.

#### Étape 3 : l'expertise judiciaire

En cas de désaccord technique sur l'état du logement, le juge peut ordonner une expertise judiciaire. Un expert assermenté se déplace sur place, examine le logement et rédige un rapport détaillé.

Le coût de l'expertise est généralement avancé par la partie qui la demande, et peut être mis à la charge de la partie perdante à l'issue du procès.

### Recours du propriétaire en cas de dégradations

Le propriétaire qui constate des dégradations lors de l'état des lieux de sortie doit pouvoir prouver l'état antérieur du logement. Cela passe par un état des lieux d'entrée précis et détaillé, des photos datées de chaque pièce et équipement, et les factures d'achat des équipements signalés comme dégradés.

Si le dépôt de garantie ne suffit pas à couvrir les travaux de remise en état, le propriétaire peut demander au locataire le versement des sommes supplémentaires. Cette demande doit être faite dans les 2 mois suivant la remise des clés.

### Délais de prescription et d'action

Le délai pour contester une retenue sur le dépôt de garantie est de **3 ans** à compter de la remise des clés (action personnelle). Passé ce délai, le locataire ne peut plus réclamer la restitution.

Pour le bailleur, le délai pour réclamer le paiement de dégradations dépassant le dépôt est également de 3 ans, mais il doit agir rapidement pour maximiser les chances de récupération des sommes.

### L'état des lieux : clé de la résolution des litiges

L'état des lieux est la preuve déterminante dans un litige sur le dépôt de garantie. Un état des lieux d'entrée incomplet ou imprécis désavantage le propriétaire en cas de contestation, car il ne peut pas démontrer que les dommages existaient avant l'entrée du locataire.

L'état des lieux doit être signé par les deux parties. Chaque partie conserve une copie. En cas de refus de signature par l'une des parties, un témoin peut attester de l'état du logement.

### Astuces pour éviter les litiges sur le dépôt de garantie

Pour le propriétaire : rédigez un état des lieux d'entrée le plus détaillé possible, envoyez le dépôt de garantie dans les 2 mois avec un reçu détaillé, conservez les factures des travaux pour prouver les coûts de remise en état, et sottoscrir une GLI pour couvrir les risques.

Pour le locataire : faites-vous remettre une copie de l'état des lieux d'entrée signé, photographiez chaque pièce dès l'entrée et conservez les photos, payez vos loyers et charges intégralement jusqu'à la sortie, et en cas de départ anticipé, anticipez les sommes qui pourraient être réclamées.

[CTA : Gérez vos états des lieux et suivez vos dépôts de garantie automatiquement avec RentReady — essai gratuit]

## FAQ — Litige dépôt de garantie

**Le bailleur peut-il retenir le dépôt de garantie pour des travaux de peinture ?**

Seules les dégradations constatées à l'état des lieux de sortie peuvent justifier une retenue. L'usure normale (peinture jaunie, murs marqués) est à la charge du propriétaire. Toutefois, si le locataire a causé des marques importantes (taches, griffures profondes), le bailleur peut déduire les coûts de remise en état.

**Que faire si le bailleur ne répond pas à ma réclamation ?**

Si le bailleur ne répond pas à la lettre recommandée dans 15 jours, saisissez le juge des contentieux de la protection. Le délai de 2 mois pour la restitution du dépôt continue de courir, et le retard peut générer des intérêts au taux legal.

**Le dépôt de garantie peut-il être utilisé pour payer le dernier mois de loyer ?**

Non, sauf accord exprès du bailleur. Le dépôt de garantie doit être versé en même temps que le premier loyer. Il n'est pas destiné à remplacer le dernier mois de location. En cas de paiement du dernier loyer par le dépôt, le locataire s'expose à des conséquences juridiques en cas de litige."""
    },
    {
        "slug": "modele-lettre-relance",
        "title": "Modèle de lettre de relance loyer impayé gratuit — Lettre simple et efficace",
        "excerpt": "Téléchargez notre modèle de lettre de relance pour loyer impayé, prêt à personnaliser. Relancez efficacement vos locataires défaillants.",
        "category": "Gestion",
        "date": "2026-04-28",
        "updatedAt": "2026-04-28",
        "readTime": "6 min",
        "content": """## Modèle de lettre de relance pour loyer impayé : guide et téléchargement gratuit

La lettre de relance est la première étape de la procédure de recouvrement d'un loyer impayé. Elle marque le début formel du processus et permet souvent de résoudre le litige sans passer par les tribunaux. Découvrez comment rédiger une lettre de relance efficace.

### Pourquoi envoyer une lettre de relance dès le premier jour d'impayé ?

La lettre de relance est envoyée dès le premier jour de retard de paiement du loyer. Elle constitue la première démarche formelle du propriétaire auprès du locataire défaillant.

Cette lettre a plusieurs fonctions : informer officiellement le locataire de l'impayé et de la situation, demander le paiement dans un délai déterminé, constituer une preuve écrite de la démarche amiable, et engager la procédure formelle de recouvrement si le paiement n'est pas reçu.

Envoyer la lettre tôt est essentiel. Plus le propriétaire attend, plus les arriérés s'accumulent et plus la procédure devient complexe.

### Les informations obligatoires de la lettre de relance

Une lettre de relance doit contenir les informations suivantes : vos coordonnées complètes (nom, adresse, téléphone, email), les coordonnées du locataire (nom, prénom, adresse du logement), la référence du bail (date du bail, adresse du bien), le montant de l'impayé (montant exact des arriérés avec le décompte), la période concernée (mois ou mois de l'impayé), le délai imparti pour le paiement (généralement 8 à 15 jours), et les conséquences en cas de non-paiement (mise en demeure, procédure judiciaire).

La lettre doit être envoyée en **recommandé avec accusé de réception** pour constituer une preuve de la démarche.

### Modèle de lettre de relance pour loyer impayé

**[Vos nom et prénom ou dénomination sociale]**
[Adresse complète]
[Numéro de téléphone]
[Adresse email]

**À [Ville], le [date]**

**Locataire :**
[Nom et prénom du locataire]
[Adresse complète du logement]

**Objet : Relance pour loyer impayé — Bail du [date du bail]**

*Lettre recommandée avec accusé de réception*

Madame, Monsieur,

Par la présente, je me permets de vous contacter suite au non-paiement de votre loyer concernant le bail conclu le [date du bail] pour le logement situé au [adresse complète du bien].

À ce jour, le montant de **[montant en euros] euros**, couvrant la période du [date début] au [date fin], demeure impayé.

Conformément aux dispositions de l'article 4 de la loi du 6 juillet 1989, le locataire est tenu de régler le loyer et les charges. Le non-paiement constitue un manquement à ses obligations contractuelles.

Je vous demande de bien vouloir régler l'intégralité de cette somme dans un délai de **8 jours** à compter de la réception de la présente lettre.

À défaut de paiement dans ce délai, je me verrai dans l'obligation d'engager une **procédure de recouvrement** auprès du tribunal compétent, conformément aux articles 24 et suivants de la loi du 6 juillet 1989.

Je reste à votre disposition pour tout échange visant à résoudre cette situation à l'amiable, notamment par la mise en place d'un échéancier de paiement.

Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

[Signature]
[Nom et prénom]

### Les erreurs à éviter dans la lettre de relance

Une tonalité trop agressive peut braquer le locataire et envenimer la situation. Privilégiez le ton factuel mais constructif. Un montant incorrect discrédite le propriétaire et peut affaiblir sa position juridique. Un délai trop court (48 heures) est généralement insuffisant — prévoyez au moins 8 à 15 jours. Sans preuve de l'envoi (recommandé avec accusé de réception), vous ne pourrez pas démontrer que la démarche a été effectuée. Ne menacez pas de procédures que vous n'envisagez pas réellement — la crédibilité du propriétaire repose sur sa capacité à exécuter ses menaces.

### Après la lettre de relance : la mise en demeure

Si le locataire ne réagit pas dans le délai imparti, la **mise en demeure** est l'étape obligatoire suivante. Elle doit être envoyée en recommandé avec accusé de réception et reprendre les mêmes éléments, avec une formulation plus ferme.

La mise en demeure marque le passage à la phase contentieuse. Elle doit explicitement évoquer les conséquences juridiques du non-paiement (résiliation du bail, procédures d'expulsion).

### La mise en place d'un échéancier amiable

Avant d'engager des poursuites, le propriétaire peut proposer au locataire un échéancier de paiement. Cette solution présente plusieurs avantages : récupération plus rapide que la procédure judiciaire, maintien du locataire dans les lieux (évite la vacance), coûts réduits pour les deux parties, et dialogue préservé entre bailleur et locataire.

L'échéancier doit être formalisé par écrit, signé par les deux parties, et préciser les montants et les dates de paiement. En cas de nouveau manquement, le propriétaire peut reprendre la procédure contentieuse.

[CTA : Automatisez vos relances de loyers impayés avec RentReady — essai gratuit 14 jours]

## FAQ — Lettre de relance loyer impayé

**La lettre de relance est-elle obligatoire avant une procédure judiciaire ?**

La lettre de relance n'est pas obligatoire strictement parlant, mais elle est indispensable pour constituer un dossier solide. Sans relance préalable, le juge peut reprocher au propriétaire de ne pas avoir tenté un règlement amiable.

**Combien de lettres de relance doit-on envoyer avant la mise en demeure ?**

Il n'y a pas de nombre minimum legal. Une seule lettre de relance peut être suivie d'une mise en demeure. En pratique, un propriétaire envoie généralement une première lettre simple (email ou courrier), puis la lettre recommandée avec accusé de réception, avant la mise en demeure.

**La lettre de relance peut-elle être envoyée par email ?**

Techniquement, la lettre de relance peut être envoyée par email, mais il est recommandé d'utiliser la lettre recommandée avec accusé de réception pour constituer une preuve recevable en justice. L'email peut être utilisé en complément, mais pas comme seul moyen de réclamation.

**Que faire si le locataire conteste le montant de l'impayé ?**

Si le locataire conteste le montant, vérifiez vos calculs et envoyez un décompte détaillé. Si le litige persiste, saisisissez le juge des contentieux de la protection qui tranchera le différend."""
    },
    {
        "slug": "mis-en-demeure-loyer",
        "title": "Mise en demeure pour loyer impayé : modèle et procédure légale en 2026",
        "excerpt": "La mise en demeure est l'étape clé avant la procédure judiciaire pour impayé de loyer. Modèle gratuit, délais et effets juridiques expliqués.",
        "category": "Gestion",
        "date": "2026-04-28",
        "updatedAt": "2026-04-28",
        "readTime": "7 min",
        "content": """## Mise en demeure pour loyer impayé : modèle et procédure en 2026

La mise en demeure est l'étape formelle qui précède la procédure judiciaire en cas de loyers impayés. Elle donne lieu à des effets juridiques précis et marque un tournant dans la relation avec le locataire défaillant.

### Qu'est-ce qu'une mise en demeure ?

La mise en demeure est un acte juridique formel qui notifie au locataire son manquement à ses obligations contractuelles (paiement du loyer) et l'informe des conséquences juridiques du non-paiement.

Contrairement à la lettre de relance (qui est une démarche informelle), la mise en demeure est un acte officiel qui peut être utilisé comme preuve devant le tribunal. Elle doit être envoyée en recommandé avec accusé de réception, ou signifiée par huissier de justice.

### Quand envoyer une mise en demeure ?

La mise en demeure doit être envoyée après l'échec de la lettre de relance. Si le locataire n'a pas payé dans le délai imparti par la lettre de relance (généralement 8 à 15 jours), la mise en demeure peut être envoyée immédiatement.

En pratique, voici la chronologie recommandée :

1. **Jour 1** : Constatation de l'impayé → envoi d'un email ou appel téléphonique
2. **Jour 5-10** : Lettre de relance en recommandé avec accusé de réception
3. **Jour 15-20** : Si pas de réponse → mise en demeure en recommandé avec accusé de réception
4. **Jour 30+** : Si pas de réponse → assignation au tribunal

### Les effets juridiques de la mise en demeure

La mise en demeure produit plusieurs effets. Elle interrompt la prescription : à compter de la mise en demeure, le délai de prescription des actions en paiement de loyer est interrompu. Le propriétaire conserve ses droits pendant toute la durée de la procédure.

Elle constitue une preuve : la mise en demeure prouve que le propriétaire a formellement alerté le locataire avant d'engager les poursuites.

Elle ouvre le droit aux intérêts de retard : les intérêts de retard sur les arriérés courent à compter de la mise en demeure, au taux legal.

Elle permet la résiliation du bail : si le locataire ne paie pas dans le délai de la mise en demeure, le bailleur peut engager la procédure de résiliation du bail pour manquement grave.

### Modèle de mise en demeure pour loyer impayé

**[Vos nom et prénom ou dénomination sociale]**
[Adresse complète]
[Téléphone / Email]

**À [Ville], le [date]**

*Lettre recommandée avec accusé de réception*

**À l'attention de [Nom et prénom du locataire]**
[Adresse complète du logement]

**Objet : Mise en demeure pour loyer impayé — Résiliation du bail**

Madame, Monsieur,

Par lettre en date du [date de la lettre de relance], nous vous avons demandé de régler la somme de [montant] euros au titre du loyer impayé concernant le bail conclu le [date du bail] pour le logement situé au [adresse].

À ce jour, malgré l'expiration du délai qui vous était accordé, cette somme n'a pas été réglée.

En conséquence, nous vous mettons formellement en demeure de nous régler l'intégralité des arriérés de loyer, soit **[montant en euros] euros**, dans un délai de **8 jours** à compter de la réception de la présente mise en demeure.

À défaut de paiement dans ce délai, nous serons contraints d'engager à votre encontre les démarches judiciaires suivantes :

1. **Action en paiement des arriérés de loyer** devant le tribunal compétent
2. **Action en résiliation du bail** pour manquement grave à vos obligations (article 4 de la loi du 6 juillet 1989)
3. **Demande de dommages et intérêts** pour troubles de jouissance
4. **Procédure d'expulsion** si le jugement emporte résiliation du bail

Nous vous rappelons que les sommes dues produisent intérêts au taux legal à compter de la présente mise en demeure.

[Signature]
[Nom et prénom]

### Contenu obligatoire de la mise en demeure

Une mise en demeure valide doit mentionner : l'identification des parties (bailleur et locataire), la référence du bail (date, adresse du bien), le montant exact de la dette (arriérés de loyer avec décompte), la période concernée (mois ou mois impayés), le délai de paiement accordé (minimum 8 jours), les conséquences juridiques du non-paiement (résiliation, expulsion, intérêts), et la date et la signature du bailleur.

### Signification par huissier vs courrier recommandé

La mise en demeure peut être envoyée par courrier recommandé avec accusé de réception (moins coûteux, environ 5-10 euros, suffisant dans la plupart des cas) ou par signification par huissier de justice (plus coûteuse, 100-200 euros, mais plus solide juridiquement).

### Après la mise en demeure : les scénarios possibles

Trois scénarios sont possibles. Le locataire paie : le dossier est clos, le propriétaire peut annuler la procédure judiciaire. Le locataire propose un échéancier : le propriétaire peut accepter ou refuser, un accord doit être formalisé par écrit. Le locataire ne réagit pas : le propriétaire engage la procédure judiciaire (assignation au tribunal).

[CTA : Automatisez la gestion de vos impayés et suivez vos procédures avec RentReady — essai gratuit]

## FAQ — Mise en demeure loyer

**La mise en demeure peut-elle être envoyée automatiquement après la lettre de relance ?**

Non, il n'y a pas de délai automatique. Vous pouvez attendre quelques jours supplémentaires ou enclencher immédiatement la mise en demeure si le montant des arriérés est important. En pratique, un délai de 8 à 15 jours entre la lettre de relance et la mise en demeure est recommandé.

**La mise en demeure peut-elle être envoyée par email ?**

Techniquement, la mise en demeure peut être envoyée par email, mais elle est moins recevable juridiquement qu'un courrier recommandé ou une signification par huissier. Pour garantir vos droits, privilégiez le courrier recommandé avec accusé de réception ou la signification par huissier.

**Que se passe-t-il si le locataire paie entre la mise en demeure et l'assignation ?**

Si le locataire paie la totalité des arriérés avant l'assignation, le propriétaire peut annuler la procédure judiciaire. Il est recommandé de formaliser le paiement par un reçu et de vérifier que les frais de procédure déjà engagés sont pris en charge.

**La mise en demeure est-elle obligatoire pour assigner le locataire ?**

La mise en demeure n'est pas obligatoire strictement parlé, mais elle est fortement recommandée. Sans mise en demeure préalable, le juge peut considérer que le propriétaire a agi de manière précipitée et lui reprocher de ne pas avoir cherché un règlement amiable."""
    },
    {
        "slug": "saisie-salaire-loyer-impaye",
        "title": "Saisie sur salaire pour loyer impayé : procédure et montants récupérables",
        "excerpt": "Quand le locataire ne paie plus son loyer et que la procédure judiciaire a permis d'obtenir un titre exécutoire, le bailleur peut engager une saisie sur salaire pour récupérer les arriérés.",
        "category": "Gestion",
        "date": "2026-04-28",
        "updatedAt": "2026-04-28",
        "readTime": "7 min",
        "content": """## Saisie sur salaire pour loyer impayé : procédure, montants et droits du salarié

Quand un locataire ne paie plus son loyer et que la procédure judiciaire a permis d'obtenir un titre exécutoire, le bailleur peut engager une saisie sur salaire pour récupérer les arriérés. Voici comment fonctionne cette procédure.

### Qu'est-ce que la saisie sur salaire ?

La saisie sur salaire est une procédure d'exécution qui permet au créancier (ici, le bailleur) de prélever directement une partie des revenus du salarié (le locataire) pour régler une dette (les arriérés de loyer).

Cette saisie est possible uniquement après l'obtention d'un **titre exécutoire** (jugement du tribunal, ordonnance de référé). Sans titre exécutoire, la saisie sur salaire est illégale.

### Conditions pour engager une saisie sur salaire

Pour engager une saisie sur salaire, le bailleur doit disposer d'un titre exécutoire condamnant le locataire au paiement des arriérés, connaître l'employeur du salarié (l'identité et l'adresse de l'entreprise sont nécessaires pour l'huissier), et le locataire doit être salarié (la saisie sur salaire ne fonctionne pas pour les travailleurs indépendants, les retraite ou les personnes sans revenus).

L'huissier de justice est le professionnel habilité à mettre en œuvre la saisie sur salaire. Il envoie un avis de saisie à l'employeur du salarié.

### Les montants saisissables sur le salaire

Le législateur a prévu des gardes-fous pour protéger le salarié : une partie du salaire est toujours inaltérable.

**Barème de saisie sur salaire (en pourcentage du salaire net) :**

- Jusqu'à 559,17 € : 0%
- De 559,17 € à 895,47 € : 10%
- De 895,47 € à 1 193,96 € : 25%
- De 1 193,96 € à 1 492,45 € : 35%
- De 1 492,45 € à 1 790,94 € : 45%
- De 1 790,94 € à 2 089,43 € : 55%
- De 2 089,43 € à 2 387,93 € : 65%
- De 2 387,93 € à 2 686,42 € : 75%
- Au-delà de 2 686,42 € : 85%

Ces tranches sont révisées chaque année en fonction de l'évolution du SMIC. Pour un salaire de 2 000 euros par mois, la part saisissable est de 55%, soit 1 100 euros par mois maximum.

### Procédure de saisie sur salaire

La procédure de saisie sur salaire se déroule en plusieurs étapes.

**Étape 1 : Obtention du titre exécutoire** — Le bailleur doit d'abord obtenir un jugement condamnant le locataire au paiement des arriérés.

**Étape 2 : Intervention de l'huissier** — Le bailleur mandate un huissier de justice pour mettre en œuvre la saisie. L'huissier envoie un avis de saisie à l'employeur du salarié, avec une copie du titre exécutoire.

**Étape 3 : Calcul de la part saisissable** — L'employeur calcule la part inaltérable du salaire et reverse le surplus à l'huissier. L'employeur est responsable du bon calcul de la retenue.

**Étape 4 : Reversement au bailleur** — L'huissier reçoit les sommes prélevées sur le salaire et les reverse au bailleur, déduction faite de ses honoraires.

### Le locataire peut-il contester la saisie ?

Le locataire peut contester la saisie sur salaire dans plusieurs cas : saisie excédant les limites légales, titre exécutoire contestable, ou situation financière changée.

Le salarié doit s'adresser au juge de l'exécution pour contester une saisie sur salaire.

### Saisie sur salaire et changement d'emploi

Si le salarié change d'emploi pendant la saisie, le nouveau employeur doit être notifié par l'huissier. La saisie continue automatiquement avec le nouvel employeur. Si le salarié ne reprend pas d'emploi salarié, d'autres mesures d'exécution peuvent être envisagées (saisie sur compte bancaire, saisie de biens).

### Saisie sur salaire et prestations sociales

Certaines prestations sociales sont inaltérables et ne peuvent pas être saisies : aides au logement (APL, ALS), minima sociaux (RSA, allocation adultes handicapés), indemnités de maladie ou de maternité, et pensions alimentaires.

Seuls les revenus du travail (salaire, primes, vacations) peuvent être saisis dans les limites du barème.

### Comment le bailleur peut-il anticiper ?

Pour éviter d'en arriver à la saisie sur salaire, le bailleur peut vérifier la solvabilité du locataire avant la signature (fiches de paie, avis d'imposition, contrat de travail), sottoscrir une GLI pour être remboursé en cas d'impayé, mettre en place des solutions de paiement échelonné dès le premier impayé, et agir vite (plus la procédure est engagée tôt, plus les arriérés sont faibles).

[CTA : Protégez vos revenus locatifs avec RentReady — suivi des paiements et alertes en temps réel]

## FAQ — Saisie sur salaire pour impayé

**Le bailleur peut-il faire saisir directement le salaire du locataire ?**

Non, le bailleur doit d'abord obtenir un titre exécutoire (jugement) auprès du tribunal. Ce n'est qu'après l'obtention de ce titre que l'huissier peut être saisi pour mettre en œuvre la saisie sur salaire.

**Que se passe-t-il si le locataire quitte son emploi ?**

La saisie s'arrête avec l'ancien employeur. L'huissier doit être informé du nouvel emploi du salarié pour relancer la saisie avec le nouveau employeur. Si le salarié ne reprend pas d'emploi salarié, d'autres mesures d'exécution peuvent être envisagées.

**Le locataire peut-il s'opposer à la saisie sur salaire ?**

Oui, le locataire peut contester la saisie devant le juge de l'exécution si la part saisissable dépasse les limites légales ou si le titre exécutoire est contestable.

**Combien de temps dure une saisie sur salaire ?**

La saisie sur salaire dure jusqu'à épuisement de la dette. Si le salarié quitte son emploi avant le remboursement intégral, la saisie doit être relancée auprès du nouvel employeur."""
    },
    {
        "slug": "augmentation-loyer-irl",
        "title": "Augmentation de loyer et IRL 2026 : comment calculer et appliquer la révision",
        "excerpt": "L'augmentation de loyer basée sur l'IRL ne peut pas dépasser l'évolution de l'indice. Formule, date de référence, plafonds et exemples de calcul.",
        "category": "Calculs",
        "date": "2026-04-28",
        "updatedAt": "2026-04-28",
        "readTime": "7 min",
        "content": """## Augmentation de loyer et IRL 2026 : comment calculer et appliquer la révision

L'augmentation de loyer basée sur l'Indice de Référence des Loyers (IRL) est encadrée par la loi. Propriétaires comme locataires doivent comprendre les règles pour éviter les litiges lors de la révision annuelle du loyer.

### Qu'est-ce que l'IRL ?

L'Indice de Référence des Loyers (IRL) est un indice publié trimestriellement par l'INSEE. Il reflète l'évolution des prix à la consommation hors tabac et hors loyer, sur les 12 derniers mois.

L'IRL sert de base légale à la révision des loyers dans les contrats de location. Depuis la loi du 8 février 2008, la révision du loyer ne peut pas dépasser l'évolution de l'IRL, ce qui protège les locataires contre les hausses excessives.

L'IRL est publié au Journal officiel et disponible sur le site de l'INSEE. Les principales dates de publication sont janvier, avril, juillet et octobre.

### Les valeurs de l'IRL en 2025-2026

Les dernières valeurs de l'IRL publiées : IRL Q3 2025 (publié octobre 2025) : environ 146,2. IRL Q4 2025 (publié janvier 2026) : environ 146,5. IRL Q1 2026 (publié avril 2026) : disponible sur insee.fr.

Pour obtenir l'IRL exact du trimestre concerné, consultez le site de l'INSEE ou votre logiciel de gestion locative.

### Formule de révision du loyer

La formule de révision du loyer est la suivante :

**Nouveau loyer = Loyer actuel × (Nouvel IRL / Ancien IRL)**

Exemple : un appartement loué 800 euros en janvier 2025, révision en janvier 2026 :

- Loyer actuel : 800 euros
- IRL au 1er janvier 2025 : 145,0 (exemple)
- IRL au 1er janvier 2026 : 146,5 (exemple)
- Calcul : 800 × (146,5 / 145,0) = 808,28 euros

L'augmentation est de 8,28 euros par mois (environ 1%).

### Date de révision : l'anniversaire du bail

La révision du loyer intervient automatiquement à chaque anniversaire du bail, si une clause de révision est prévue dans le contrat. Sans clause de révision, le loyer ne peut pas être augmenté en cours de bail.

La clause de révision doit préciser : la date de référence de l'indice (souvent le trimestre du dernier IRL connu à la signature), la périodicité de la révision (généralement annuelle), et la formule de calcul.

Sans ces précisions, la clause est réputée non écrite et le loyer ne peut pas être révisé.

### Les limites de l'augmentation de loyer

L'augmentation de loyer en cours de bail ne peut pas dépasser la variation de l'IRL. Le propriétaire ne peut pas augmenter le loyer au-delà de l'inflation constatée.

Exception : si le loyer est manifestement sous-évalué par rapport aux prix du marché, le propriétaire peut proposer une augmentation supérieure lors du renouvellement du bail, mais cette augmentation est encadrée. Elle ne peut pas dépasser 10% du loyer actuel en zone tendue, doit être justifiée par des travaux améliorant la performance énergétique du logement, et doit être proposée au locataire 3 mois avant l'échéance du bail.

### Majoration limitée en zone tendue

Dans les communes soumises à l'encadrement des loyers (Paris, Lille, Grenoble, etc.), le loyer de relocation ne peut pas dépasser le loyer de référence majoré, publié par les observatoires locaux des loyers.

Le dépassement est sanctionné par une amende pouvant aller jusqu'à 5 000 euros pour une personne physique.

### IRL et travaux : quand peut-on augmenter davantage ?

En cas de travaux amélioration de la performance énergétique du logement (travaux permettant un gain d'au moins 20% de la performance énergétique), le propriétaire peut négocier une augmentation de loyer supérieure à l'IRL lors du renouvellement du bail.

L'augmentation ne peut pas dépasser 15% du coût des travaux TTC, étalés sur la durée du bail, ou 50% de l'augmentation échelonnée sur 3 ans. Les travaux doivent être documentés et communiqués au locataire.

### Comment mettre en œuvre la révision de loyer ?

La révision du loyer doit être notifiée au locataire par lettre recommandée avec accusé de réception, au moins 1 mois avant la date de révision. Le bailleur doit inclure le détail du calcul : ancien loyer, nouvel IRL, coefficient de révision, nouveau loyer.

Si le bailleur omet de notifier la révision dans les délais, il ne peut pas rattraper les augmentations non appliquées. Le loyer reste figé jusqu'à la prochaine date de révision possible.

[CTA : Calculez automatiquement vos révisions de loyer et générez les notifications avec RentReady — essai gratuit]

## FAQ — Augmentation de loyer IRL

**Peut-on refuser une augmentation de loyer basée sur l'IRL ?**

Non, si une clause de révision est prévue dans le bail et que la méthode de calcul est conforme à la loi, le locataire ne peut pas refuser la révision. Toutefois, il peut contester le calcul devant le juge s'il y a une erreur.

**Que se passe-t-il si l'IRL est négatif ?**

Si l'IRL diminue (déflation), le loyer doit diminuer dans les mêmes proportions. Le propriétaire ne peut pas maintenir un loyer supérieur à celui qui résulte de la formule de révision.

**L'augmentation de loyer peut-elle dépasser l'IRL en cours de bail ?**

Non, en cours de bail, l'augmentation ne peut pas dépasser l'évolution de l'IRL. En cas de renouvellement, des augmentations plus importantes sont possibles sous conditions (travaux, zone non tendue).

**Comment savoir si je suis en zone tendue ?**

Les zones tendues sont définies par arrêté préfectoral. Vous pouvez vérifier sur le site du gouvernement ou de votre commune. En général, les grandes villes (Paris, Lyon, Marseille, Lille, Bordeaux, etc.) sont considérées comme zones tendues."""
    },
    {
        "slug": "gestion-locative-gratuite",
        "title": "Gestion locative gratuite : les solutions sans frais pour les propriétaires",
        "excerpt": "Peut-on gérer ses locations gratuitement ? Comparatif des solutions : Excel, applications gratuites et outils en ligne pour les propriétaires.",
        "category": "Gestion",
        "date": "2026-04-28",
        "updatedAt": "2026-04-28",
        "readTime": "6 min",
        "content": """## Gestion locative gratuite : peut-on vraiment gérer ses locations sans frais ?

Many propriétaires se demandent s'il est possible de gérer leurs locations sans débourser un euro. Entre Excel gratuit, applications sans frais et fausses solutions, voici la réalité de la gestion locative gratuite en 2026.

### Les différentes solutions de gestion locative gratuite

La gestion locative gratuite existe sous plusieurs formes. Certaines sont réellement gratuites, d'autres dissimulent des coûts ou des limitations.

#### Les tableurs Excel et Google Sheets

La solution la plus basique consiste à créer un tableau de suivi des paiements sur Excel ou Google Sheets. Cette méthode est gratuite et simple à mettre en place pour les propriétaires avec 1 ou 2 biens.

Avantages : coût zéro, flexibilité totale, pas de dépendance à un service tiers.

Inconvénients : mise à jour manuelle de chaque paiement, risque d'erreur de calcul, pas d'alertes automatiques pour les échéances, sécurité faible, et impossible à vérifier la conformité juridique des modèles.

#### Les applications gratuites de suivi locatif

Plusieurs applications proposent un suivi basique des paiements sans frais. Applications gratuites notables : Google Calendar (rappel des échéances de paiement), Notion (modèles de suivi locatif), Sheetgo (automatisation des tableaux).

Limitations : fonctionnalités réduites, pas de génération de quittances certifiées, pas de modèles de bail évolutifs, pas de mise à jour juridique automatique.

#### Les offres Freemium des logiciels spécialisés

Certains logiciels de gestion locative proposent une version gratuite (freemium) avec des fonctionnalités limitées. Cette version gratuite est souvent une vitrine pour la version payante.

Limitations : fonctionnalités réduites en gratuit, absence de support en version gratuite, pas de mise à jour juridique automatique.

### Ce qui n'est jamais vraiment gratuit

Certaines offres dites gratuites ne sont en réalité pas gratuites. Les agences immobilières qui proposent la gestion gratuite répercutent leurs frais sur le locataire ou sur le propriétaire. Les modèles de bail gratuits sur internet sont souvent obsolètes et non conformes aux dernières évolutions législatives. Les générateurs de quittances gratuits en ligne génèrent des documents non conformes ou watermarqués, impropres à un usage professionnel.

### Les vrais coûts de la gestion locative gratuite

La gestion locative gratuite présente des coûts cachés. Temps passé : un propriétaire qui gère lui-même ses locations sur Excel passe en moyenne 2 à 4 heures par mois et par bien à la gestion administrative. Erreurs et litiges : un bail mal rédiger ou une quittance non conforme peut entraîner des litiges avec le locataire. Risque juridique : l'absence de mise à jour des modèles de bail peut entraîner des clauses nulles. Manque à gagner sur les paiements : un impayé non détecté à temps peut coûter des mois de loyer non recoverés.

### Quand la gestion gratuite devient payante

La gestion locative gratuite devient réellement payante dans deux cas. À partir de 3 biens : le temps de gestion augmente proportionnellement et le coût d'un logiciel de gestion est compensé par le temps économisé. En cas de litige : un seul litige avec un locataire (impayé, dégradation, procédure d'expulsion) peut coûter entre 500 et 5 000 euros en frais de procédure.

### Les alternatives abordables à la gestion gratuite

Si le budget est limité, voici les alternatives les plus pertinentes. Le régime auto-entrepreneur : en déclarant vos revenus locatifs en auto-entrepreneur, vous pouvez bénéficier d'un taux de CFE réduit et déduire certaines charges. Les partenariats avec des property managers : certains property managers proposent des tarifs réduits pour les propriétaires qui gèrent plusieurs biens. La garantie Visale : cette garantie gratuite de l'État protège contre les impayés pour les locataires de moins de 30 ans ou en CDD.

### Nos recommandations

La gestion locative gratuite est viable pour les propriétaires avec un seul bien et un calme locatif parfait. Au-delà, les risques et le temps investi dépassent largement le coût d'un outil spécialisé.

Si vous cherchez une solution gratuite, privilégiez les essais gratuits des logiciels professionnels (14 à 30 jours) pour évaluer vos besoins avant de vous engager.

[CTA : Testez RentReady gratuitement pendant 30 jours et découvrez la gestion locative moderne — sans engagement]

## FAQ — Gestion locative gratuite

**Peut-on vraiment gérer ses locations gratuitement avec Excel ?**

Oui, c'est possible mais fortement déconseillé à partir de 2 biens. Les risques d'erreur, l'absence d'alertes et le temps de gestion rendu disponible ne compensent pas l'économie réalisée.

**Les modèles de bail trouvés sur internet sont-ils gratuits et fiables ?**

La plupart des modèles gratuits en ligne sont obsolètes. Privilégiez les modèles des sites institutionnels (service-public.fr) ou des logiciels spécialisés qui mettent à jour leurs modèles à chaque évolution légale.

**La gestion locative gratuite existe-t-elle vraiment ?**

Oui, mais elle nécessite un investissement important en temps et présente des risques. La vraie question est : combien vaut votre temps ? Si votre taux horaire réel est supérieur à 20 euros/heure, l'utilisation d'un logiciel professionnel est plus intéressante que la gestion gratuite sur Excel.

**Quel est le meilleur logiciel de gestion locative gratuit ?**

Il n'existe pas de vrai logiciel de gestion locative 100% gratuit et complet. Les versions gratuites sont des versions d'essai ou des offres Freemium très limitées. Pour une gestion sérieuse, comptez entre 10 et 30 euros par mois."""
    },
    {
        "slug": "gestion-locative-prix",
        "title": "Gestion locative : prix et tarifs des prestations en 2026 — agences vs logiciels",
        "excerpt": "Combien coûte une gestion locative ? Tarifs des agences, frais de gestion et solutions logicielles. Tout pour bien budgétiser votre location.",
        "category": "Gestion",
        "date": "2026-04-28",
        "updatedAt": "2026-04-28",
        "readTime": "7 min",
        "content": """## Gestion locative : prix et tarifs en 2026 — agences vs logiciels

Combien coûte une gestion locative en France ? Entre les agences immobilières et les logiciels en ligne, les tarifs varient du simple au quintuple. Voici le panorama complet des prix et des prestations.

### Les tarifs des agences immobilières

Les agences immobilières proposent un service de gestion locative complet, incluant la recherche de locataire, la rédaction du bail, le suivi des paiements et la gestion des incidents. Leurs tarifs sont généralement exprimés en pourcentage des loyers perçus.

**Fourchette de prix habituels :** Gestion complète : 5% à 10% du montant des loyers annuels. Gestion technique seule : 3% à 5%. Location seule (mise en location + bail) : 1 mois de loyer environ.

Pour un appartement loué 1 000 euros par mois, le coût de gestion est donc de 50 à 100 euros par mois, soit 600 à 1 200 euros par an.

**Prestations incluses dans la gestion complète :** rédaction et signature du bail, état des lieux d'entrée et de sortie, encaissement des loyers et suivi des paiements, relances en cas d'impayé, régularisation des charges annuelles, déclarations fiscales, suivi des travaux, et correspondance avec le locataire.

**Prestations généralement facturées en extra :** location de votre bien (placement d'un nouveau locataire), procédure d'expulsion (frais d'huissier et d'avocat), travaux de rénovation, et assurance GLI.

### Les tarifs des logiciels de gestion locative

Les logiciels de gestion locative en ligne proposent une solution plus économique, mais avec un service limité à la gestion administrative. Le propriétaire assure lui-même la relation avec le locataire.

**Fourchette de prix habituels :** Entrée de gamme (gratuit à 10 euros/mois) : suivi basique des paiements, modèles de bail simples. Convient aux propriétaires avec 1-2 biens. Milieu de gamme (10 à 30 euros/mois) : gestion complète des baux, quittances automatisées, comptabilité, alertes. Convient à 5-10 biens. Haut de gamme (30 à 100 euros/mois) : gestion de portefeuille complète, intégration comptable, portail locataire. Convient aux property managers professionnels.

**Comparaison rapide :** Agence (gestion complète) : 600-1 200 € / an pour 1 bien, 3 000-6 000 € pour 5 biens. Logiciel milieu de gamme : 120-360 € / an pour 1 bien, 600-1 800 € pour 5 biens. Auto-gestion (Excel) : 0 € pour 1 ou 5 biens.

### Les frais de gestion cachés à connaître

Certains frais sont souvent omis lors de la comparaison des offres. Frais de mise en location : les agences facturent souvent la recherche de locataire en sus de la gestion. Ces frais peuvent représenter 1 mois de loyer. Frais de relocation : à chaque changement de locataire, des frais de relocation sont généralement facturés. Frais de procédures : en cas d'impayé, les frais de procédure sont souvent à la charge du propriétaire. Frais de travaux : les agences de coordination de travaux facturent généralement une commission de 5 à 10% sur le montant des travaux.

### Quand utiliser une agence vs un logiciel ?

**Privilégiez l'agence (gestion complète) si :** vous avez plusieurs biens (5+) et pas le temps de gérer vous-même. Votre bien est en zone tendue (encadrement des loyers, forte demande locative). Vous préférez avoir un interlocuteur physique en cas de problème. Votre bien est sujet à une rotation élevée de locataires.

**Privilégiez le logiciel si :** vous avez 1 à 5 biens et un temps disponible pour la gestion. Vous cherchez à réduire les coûts de gestion. Vous êtes à l'aise avec les outils numériques. Votre bien est stable (locataire à long terme). Vous voulez garder le contrôle sur vos données et vos documents.

### Les nouveaux acteurs du marché : gestion locative low cost

De nouveaux acteurs proposent des services de gestion locative à prix réduit, en digitalisant les processus et en limitant les frais de structure. Les property techs proposent des gestions à partir de 4-5% des loyers, avec un service partiellement digitalisé. Les marketplaces de gestion mettent en relation propriétaires et gestionnaires professionnels. Les coffre-forts numériques permettent de numériser et stocker tous les documents locatifs, facilitant l'auto-gestion.

### Comment choisir son prestataire de gestion locative ?

Critères de choix : transparence des tarifs (méfiez-vous des offres dont le prix total n'est pas clair dès le départ), mise à jour juridique (le prestataire doit garantir la conformité de ses modèles de bail et de quittances), service client (réactivité en cas de problème), références et avis (consulter les avis en ligne), et essai gratuit (un bon prestataire doit proposer un essai gratuit de 14 à 30 jours).

### Le retour sur investissement de la gestion locative

Pour évaluer l'intérêt d'une gestion locative professionnelle, calculez le temps que vous passez actuellement à gérer vos locations (en heures/mois), votre taux horaire réel (combien vaut votre heure de travail), les risques que vous avez courus (impayés, litiges, erreurs), et le coût d'une gestion professionnelle vs votre situation actuelle.

Pour la plupart des propriétaires avec 2-5 biens, le logiciel de gestion locative (120-360 euros/an) offre le meilleur rapport coût/bénéfice.

[CTA : Comparez les solutions de gestion locative et trouvez celle qui vous convient — essayez RentReady gratuitement]

## FAQ — Prix gestion locative

**Combien coûte une agence de gestion locative en 2026 ?**

Les agences facturent généralement entre 5% et 10% des loyers annuels pour une gestion complète. Pour un appartement à 1 000 euros/mois, cela représente 600 à 1 200 euros par an.

**Un logiciel de gestion locative remplace-t-il complètement une agence ?**

Non, le logiciel vous aide à gérer les aspects administratifs (loyers, quittances, documents) mais ne remplace pas l'interlocuteur physique. En cas d'impayé grave ou de litige, vous devez soit gérer vous-même, soit faire appel à un avocat ou un huissier.

**Les frais de gestion locative sont-ils déductibles fiscalement ?**

Oui, les frais de gestion (honoraires d'agence, frais de logiciel) sont déductibles des revenus fonciers dans le cadre du régime réel. Vous pouvez les ajouter à vos autres charges pour réduire votre revenu foncier imposable.

**Peut-on négocier les frais de gestion avec une agence ?**

Oui, notamment si vous avez plusieurs biens ou si votre bien est en zone tendue. N'hésitez pas à demander un devis détaillé et à négocier les honoraires."""
    },
]

existing_slugs = {
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
}

# Generate article entries for TypeScript
entries = []
for art in new_articles:
    if art['slug'] not in existing_slugs:
        # Escape content for TypeScript string
        content_escaped = art['content'].replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
        entry = f"""  {{
    slug: '{art['slug']}',
    title: '{art['title'].replace("'", "\\'")}',
    excerpt: '{art['excerpt'].replace("'", "\\'")}',
    category: '{art['category']}',
    date: '{art['date']}',
    updatedAt: '{art['updatedAt']}',
    readTime: '{art['readTime']}',
    content: `{content_escaped}*`,
  }},"""
        entries.append(entry)
        print(f"Added: {art['slug']} ({len(art['content'])} chars)")

# Find the insertion point (before the closing bracket of the articles array)
# The file ends with: ]; export function getArticleBySlug...
pattern = r'(\];\s*\nexport function getArticleBySlug)'

if entries:
    new_content = '\n'.join(entries) + '\n' + r'\1'
    new_file_content = re.sub(pattern, new_content, content)
    
    with open('src/data/articles.ts', 'w') as f:
        f.write(new_file_content)
    
    print(f"\nSuccessfully added {len(entries)} articles to articles.ts")
else:
    print("No new articles to add")