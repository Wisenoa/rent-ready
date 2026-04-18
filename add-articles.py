#!/usr/bin/env python3
with open('src/data/articles.ts', 'r') as f:
    content = f.read()

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

new_articles = [
    {
        'slug': 'bail-parking',
        'title': "Bail de parking : comment rediger le contrat de location d'une place de stationnement",
        'excerpt': "Location d'une place de parking : bail, duree, loyer, charges locatives. Guide complet pour proprietaires et locataires en 2026.",
        'category': 'Juridique',
        'date': '2026-04-28',
        'updatedAt': '2026-04-28',
        'readTime': '7 min',
        'content': """## Location de parking : bail, regles et obligations en 2026

La location d'une place de stationnement ou d'un garage est encadree par des regles specifiques en France. Que vous soyez proprietaire d'une box ou d'un parking, ou locataire recherch ant une place, voici tout ce qu'il faut savoir sur le bail de parking.

### Bail de parking : definition et cadre juridique

Un bail de parking est un contrat de location portant sur un emplacement de stationnement, un garage ou une box. Il peut s'agir d'une dependance d'un bien residentiel (parking annexe a un appartement) ou d'un bien independant (parking standalone dans un parking souterrain ou en rez-de-chaussee).

Depuis la loi ALUR de 2014, la location de parking est consideree comme une annexe du bail d'habitation quand le meme bailleur loue egalement le logement principal. Dans ce cas, le prix du parking ne peut pas etre excessif au regard du prix de location principal.

Si le parking est loue independamment du logement (par un autre bailleur), il est soumis au statut des baux commerciaux ou professionnels, selon l'usage.

### Duree et resiliation du bail de parking

Le bail de parking peut etre conclu pour une duree determinee ou indeter mine e. En duree indeter mine e, chaque partie peut resilier a tout moment avec un preavis qui doit etre stipule dans le contrat (en general 1 a 3 mois). En duree determinee, le contrat est reconduit tacitement a l'echeance sauf conge donne par l'une des parties.

Depuis la loi Climat de 2021, le proprietaire d'un parking en zones tendues ne peut plus librement augmenter le loyer entre deux locataires. Un encadrement s'applique aux renouvellements de bail, sur le modele de l'encadrement des loyers d'habitation.

### Loyer et charges du parking

Le loyer d'un parking varie selon les villes et les quartiers. A Paris, une place de parking peut se louer entre 100 et 300 euros par mois selon l'emplacement (sous-sol, surface, garde ou non). En province, les tarifs sont generalement inferieurs : entre 50 et 150 euros par mois.

Le loyer peut inclure les charges (entretien, eclairage, gardiennage) ou etre separe. Les charges recuperables sur un parking correspondent aux frais d'entretien des parties communes, d'eclairage et de nettoyage.

### Les obligations du bailleur

Le bailleur doit livrer un parking en etat de service : emplacement accessible, sans danger, conforme a l'usage. Il doit assurer l'entretien courant de la structure (ravalement, couverture) et les equipements collectifs (porte automatique, eclairage).

Le bailleur doit egalement fournir une attestation d'assurance pour le parking si cela est prevu au contrat. En cas de sinistre (incendie, degat des eaux), la responsabilite de l'assurance depend des clauses du contrat.

### Les obligations du locataire de parking

Le locataire doit payer son loyer a temps et user du parking conformement a l'usage prevu (stationnement de vehicules legers uniquement, sauf clause contraire). Il ne peut pas sous-louer le parking sans accord prealable du proprietaire.

Le locataire doit egalement respecter le reglement interieur de l'immeuble ou du parking (horaires d'acces, nuisances, restrictions de dimensions).

### Louer son parking : autres formes de mise a disposition

Au-dela de la location classique, les proprietaires peuvent opter pour la location de courte duree (Airbnb parking), la mise a disposition en multiprop ri eta, ou la vente en demembrement.

### Comment rediger un bail de parking ?

Le contrat de location de parking doit mentionner l'identite complete du bailleur et du locataire, la description precise de l'emplacement (adresse, niveau, numero de place), le montant du loyer et les modalites de paiement, la duree du bail et les conditions de renouvellement, les charges comprises ou non comprises dans le loyer, les conditions de resiliation et le preavis applicable, et les equipements disponibles (porte automatique, eclairage, gardiennage).

Le bail doit etre signe en deux exemplaires, un pour chaque partie. Une copie doit etre conservee pendant toute la duree de la location.

### Fiscalite de la location de parking

Les revenus locatifs d'un parking sont imposables dans la categorie des revenus fonciers. Si le parking est declare en SCI ou en LMNP, le regime fiscal peut differer. Un parking peut beneficier du regime micro-foncier (abattement de 30%) ou du regime reel si les charges sont importantes.

[CTA : Gerez vos contrats de location et vos revenus locatifs automatiquement avec RentReady — essai gratuit 14 jours]

## FAQ — Bail de parking

**Un proprietaire peut-il vendre le parking en cours de bail ?**

Oui, le proprietaire peut vendre le parking meme si un bail est en cours. Le nouveau proprietaire doit respecter le bail en cours. Le locataire beneficie d'un droit de preemption en cas de vente.

**Le depot de garantie est-il obligatoire pour un parking ?**

Non, le depot de garantie n'est pas obligatoire pour un bail de parking. Les parties peuvent toutefois convenir d'un depot de garantie pour securiser le paiement du loyer et la bonne restitution du parking.

**Peut-on garer n'importe quel vehicule dans un parking loue ?**

Cela depend des clauses du bail. En general, seuls les vehicules legers sont autorises. Un camion ou un vehicule utilitaire de taille importante peut etre interdit par le reglement interieur ou le contrat de bail.

**Que faire si le parking devient inaccessible (travaux, sinistre) ?**

Si le parking devient inaccessible en raison de travaux ou d'un sinistre, le locataire peut demander une reduction de loyer proportionnelle a la duree d'indisponibilite. En cas de sinistre important, le bail peut etre resilie sans indemnite."""
    },
    {
        'slug': 'bail-professionnel',
        'title': 'Bail professionnel : tout savoir sur la location de locaux commerciaux en 2026',
        'excerpt': 'Bail professionnel vs bail commercial : differences, duree, loyer et obligations. Guide juridique pour louer un local a usage professionnel.',
        'category': 'Juridique',
        'date': '2026-04-28',
        'updatedAt': '2026-04-28',
        'readTime': '8 min',
        'content': """## Bail professionnel : cadre juridique, duree et specificites en 2026

Le bail professionnel est un contrat de location de locaux a usage professionnel, distinct du bail commercial. Il repond a des regles specifiques definies par le Code de commerce. Comprendre ses caracteristiques est essentiel avant de signer ou de rediger un tel bail.

### Bail professionnel : pour qui et pour quoi ?

Le bail professionnel concerne les professions liberales et les activites commerciales qui ne relevent pas strictement du statut des baux commerciaux. Les professions visees incluent notamment les avocats, medecins, experts-comptables, architectes, consultants, notaires et agents d'assurance.

Pour qu'un bail soit qualifie de professionnel, le locataire doit exercer une activite liberale reglementee ou non, mais ne doit pas etre inscrit au registre du commerce et des societes (RCS) dans les formes commerciales.

La limite entre bail commercial et bail professionnel est souvent floue. Un professionnel qui vend des marchandises ou exerce une activite lucrative au-dela de la simple prestation de services peut relever du bail commercial plutot que professionnel.

### Duree du bail professionnel : 6 ans minimum

Le bail professionnel a une duree minimale de 6 ans, sauf possibilite de duree superieure par accord des parties. Cette duree protege le locataire professionnel en lui garantissant un cadre stable pour developper son activite.

Le locataire peut donner son conge a l'expiration de chaque periode triennale (tous les 3 ans), avec un preavis de 6 mois minimum. Cette liberte de sortie est un avantage majeur du bail professionnel, comparable a celui du bail commercial.

Le proprietaire ne peut pas donner conge avant l'echeance des 6 ans, sauf motif legitime et serieux (non-paiement de loyer, manquement grave aux obligations du locataire, demolition du local).

### Loyer du bail professionnel

Le loyer initial est librement fixe entre les parties lors de la signature du bail. Il n'y a pas de plafonnement legal du loyer professionnel, sauf dans certains quartiers prioritaires ou zones specifiques.

Le loyer peut etre fixe (montant constant), progressif (augmente selon un calendrier predefini), ou indexe (lie a un indice comme l'IRL ou l'indice du cout de la construction).

La revision du loyer en cours de bail est encadree. Passee la periode de 3 premieres annees, une demande de revision peut etre formulee tous les 3 ans, a la hausse comme a la baisse. En cas de desiraccord, le juge fixe le nouveau loyer.

### Charges et travaux en bail professionnel

La repartition des charges et travaux entre bailleur et locataire professionnel suit des regles precises.

Travaux a la charge du proprietaire : gros murs et structure du batiment, ravalement et facades, mise aux normes d'accessibilite des parties communes, et installations collectives.

Travaux a la charge du locataire professionnel : amenagements interieurs et decoration, menuiseries interieures et equipements propres a l'activite, peinture et revetements de sol, et entretien courant du local.

Les charges locatives recuperables incluent les taxes foncieres, les charges de copropriete, l'entretien des parties communes et l'eclairage des espaces partagees.

### Depot de garantie en bail professionnel

Le depot de garantie en bail professionnel n'est pas soumis a un plafonnement legal (contrairement au bail d'habitation). Il est fixe librement entre les parties, generalement entre 1 et 3 mois de loyer HT.

En pratique, le depot de garantie sert a couvrir les impayes de loyer, les charges et les degradations constatees a la sortie du locataire. Il doit etre restitue dans un delai de 2 mois apres la remise des cles, deduction faite des sommes dues.

### Cession du bail professionnel

Le locataire professionnel dispose d'un droit de ceder son bail a un successeur, sauf clause contraire dans le contrat. La cession doit etre notifiee au proprietaire par lettre recommandee avec accuse de reception.

Le proprietaire dispose d'un droit de preemption pour reprendre les murs au prix de cession. Ce droit doit etre exerce dans un delai de 2 mois apres notification de la cession projetee.

### Renouvellement du bail professionnel

A l'echeance des 6 ans, le locataire a droit au renouvellement de son bail. Le proprietaire peut refuser le renouvellement mais doit alors verser une indemnite d'eviction egale a la valeur du fonds de commerce du locataire.

[CTA : Crees vos contrats de location professionnelle et suivez vos baux avec RentReady — essai gratuit]

## FAQ — Bail professionnel

**Quelle est la difference entre bail professionnel et bail commercial ?**

Le bail commercial s'adresse aux commercants et industriels inscrits au RCS. Le bail professionnel concerne les professions liberales et les activites non commerciales. Les deux statuts diff erent notamment par la duree minimale (9 ans pour le bail commercial, 6 ans pour le bail professionnel) et les regles de revision du loyer.

**Le locataire professionnel peut-il sous-louer son local ?**

La sous-location est en principe interdite sans l'accord prealable et ecrit du proprietaire. Si le bail initial l'autorise, le locataire doit nevertheless notifier la sous-location au proprietaire et obtenir son accord sur les conditions.

**Que se passe-t-il a la fin du bail professionnel si le locataire reste dans les lieux ?**

Si le proprietaire ne donne pas conge dans les formes et delais requis, le bail est tacitement reconduit pour une duree de 6 ans (duree initiale du bail professionnel). Le locataire beneficie alors d'un nouveau bail de 6 ans aux memes conditions.

**Le bail professionnel est-il soumis a l'encadrement des loyers ?**

Non, le bail professionnel n'est pas soumis a l'encadrement des loyers applicable aux locations d'habitation. Le loyer est librement fixe entre les parties."""
    },
    {
        'slug': 'depot-garantie-meuble',
        'title': 'Depot de garantie pour location meublee : plafonnement, restitution et litiges en 2026',
        'excerpt': 'Le depot de garantie en location meublee est limite a 2 mois de loyer. Conditions de restitution, deductions autorisees et recours en cas de litige.',
        'category': 'Juridique',
        'date': '2026-04-28',
        'updatedAt': '2026-04-28',
        'readTime': '6 min',
        'content': """## Depot de garantie en location meublee : plafonnement, restitution et droits en 2026

Le depot de garantie en location meublee repond a des regles specifiques differentes de la location vide. Connaitre les plafonds, les delais et les droits de chaque partie permet d'eviter les litiges a la fin du bail.

### Le plafonnement du depot de garantie en meuble : 2 mois maximum

En location meublee, le depot de garantie ne peut pas depasser 2 mois de loyer hors charges. Ce plafonnement est fixe par la loi du 6 juillet 1989 pour les locations meublees a titre de residence principale du locataire.

Ce plafonnement s'applique a tous les types de location meublee : bail meuble classique (1 an renouvelable), bail mobilite (1 a 10 mois), location meublee de tourisme (saisonniere, avec regles differentes).

Pour un appartement loue meuble a 800 euros par mois hors charges, le depot de garantie ne peut pas exc eder 1 600 euros.

En location meublee de tourisme (saisonniere), le depot de garantie peut etre plus eleve car les regles de la loi du 6 juillet 1989 ne s'appliquent pas. Les montants sont fix es librement entre les parties.

### Depot de garantie et bail mobilite

Le bail mobilite, cree par la loi ELAN de 2018, est un bail meubre de courte duree (1 a 10 mois) destine aux personnes en mobilite professionnelle. Le depot de garantie en bail mobilite est restitue dans les memes delais que le bail meubre classique (2 mois apres la remise des cles).

### Restitution du depot de garantie : delai de 2 mois

Le bailleur doit restituer le depot de garantie dans un delai maximal de 2 mois a compter de la remise des cles par le locataire. Pas se ce delai, le solde restant du produit des inter ets au taux legal, sans que le locataire ait besoin de prouver un prejudice.

Le taux legal est actualise chaque semestre par l'administration. Le bailleur doit fournir un recu detaille mentionnant le montant du depot initial, les deductions operees (loyers impayes, charges, degradations) et le solde restitue.

### Les deductions autorisees sur le depot de garantie

Le bailleur peut retenir des sommes sur le depot de garantie uniquement pour : l'impaye de loyer, les charges locatives non reglees, et les degradations constatees a l'etat des lieux de sortie (autres que l'usure normale).

En dehors de ces trois categories, toute retenue est consideree comme abusive et peut etre contestee devant le juge des contentieux de la protection.

### Degradations et usure normale : quelle difference ?

L'etat des lieux de sortie, compare a l'etat des lieux d'entree, permet de distinguer les degradations (a la charge du locataire) de l'usure normale (a la charge du proprietaire).

L'usure normale correspond a ce qui se passe dans un logement lors d'une occupation paisible : petites marques sur les murs, usure des sols, jaunissement des peintures. Le locataire n'est pas responsable de l'usure normale.

Les degradations correspondent a des dommages causes par negligence ou accident : brulure sur un plan de travail, vitre cassee, serrure forcee. Ces degradations peuvent etre deduites du depot de garantie.

En cas de litige sur la qualification d'une degradation, le juge peut etre saisi pour trancher. Une expertise peut etre ordonnee pour evaluer les travaux de remise en etat.

### Depot de garantie en colocation meublee

En colocation meubre, le depot de garantie peut etre verse conjointement ou individuellement selon les clauses du bail. Si le bail prevoit la solidarite des colocataires, chaque colocataire est responsable du paiement de l'integralite du depot.

En cas de depart d'un colocataire solidaire, le bailleur peut retenir sa part du depot pour couvrir les impayes du colocataire parti, meme si les autres colocataires continuent a habiter le logement.

### Comment se proteger en tant que proprietaire ?

Pour securiser le depot de garantie, le proprietaire peut verifier systemiquement l'etat des lieux d'entree avec des photos datees, faire un etat des lieux de sortie comparatif des la remise des cles, conserver tous les justificatifs de degradation pour demontrer l'origine des dommages, et souscrive une GLI (Garantie Loyer Impaye) qui couvre les degradations et les impayes.

[CTA : Generez des etats des lieux professionnels et suivez vos depots de garantie avec RentReady — essai gratuit]

## FAQ — Depot de garantie meuble

**Le depot de garantie en location meubre peut-il etre superieur a 2 mois ?**

Non, le plafonnement legal de 2 mois de loyer hors charges s'applique a toutes les locations meublees a titre de residence principale. Toute clause prevoyant un depot superieur est nulle et non opposable au locataire.

**Le bailleur peut-il conserver le depot de garantie pour travaux de rafraichissement ?**

Non. Les travaux de rafraichissement lies a l'usure normale sont a la charge du proprietaire. Seules les degradations constatees a l'etat des lieux de sortie peuvent etre deduites du depot.

**Que se passe-t-il si l'etat des lieux d'entree est incomplet ?**

L'etat des lieux d'entree doit etre le plus detaille possible. En cas de litige, c'est la reference principale pour evaluer les degradations. Un etat des lieux incomplet peut desavantager le proprietaire en cas de contestation."""
    },
    {
        'slug': 'litige-depot-garantie',
        'title': 'Litige sur le depot de garantie : procedure et recours pour proprietaires et locataires',
        'excerpt': 'Depot de garantie non restitue, retenue abusive, etat des lieux conteste : tous les recours en cas de litige entre bailleur et locataire.',
        'category': 'Juridique',
        'date': '2026-04-28',
        'updatedAt': '2026-04-28',
        'readTime': '8 min',
        'content': """## Litige sur le depot de garantie : tous vos recours en 2026

Le depot de garantie est une source frequente de litiges entre bailleurs et locataires. Mauvaise foi, etat des lieux conteste, retenue abusive : voici comment faire valoir vos droits, que vous soyez locataire ou proprietaire.

### Les motifs de litige les plus frequents

Le depot de garantie genere des conflits dans plusieurs situations recurrentes : le locataire parti sans payer ses derniers mois de loyer (le bailleur retient tout ou partie du depot), l'etat des lieux de sortie conteste (desaccord sur les degradations), les charges non regularisees, le delai de restitution depasse, et le desaccord sur la qualification de certains dommages (marques sur les murs, sols us es, equipements defaillants).

### Recours du locataire en cas de retenue abusive

Si le locataire estime que le bailleur retient tout ou partie du depot de garantie de maniere abusive, il dispose de plusieurs voies de recours.

#### Etape 1 : la reclamation amiable

Avant de saisir le juge, le locataire doit envoyer une lettre recommandee avec accuse de reception au bailleur, reclamant la restitution du depot ou l'explication des deductions operees. Cette lettre doit etre envoyee dans les 2 mois suivant la remise des cles.

Le locataire doit garder une photocopie du courrier et conserver l'accuse de reception comme preuve. En l'absence de reponse satisfaisante dans un delai de 15 jours, le recours judiciaire devient possible.

#### Etape 2 : la saisine du juge des contentieux de la protection

Le locataire peut saisir le juge des contentieux de la protection de son tribunal judiciaire (anciennement tribunal d'instance). La saisine se fait par assignation ou par declaration au greffe.

Le juge examine les pieces presentees par les deux parties : le bail de location, les etats des lieux d'entree et de sortie, les photos, les factures de travaux, les rec.us de paiement des charges, et la correspondance entre les parties.

Le juge peut ordonner la restitution partielle ou totale du depot, avec inter ets de retard au taux legal. En cas de mauvaise foi manifeste du bailleur, des dommages et inter ets peuvent etre octroyes.

#### Etape 3 : l'expertise judiciaire

En cas de desaccord technique sur l'etat du logement, le juge peut ordonner une expertise judiciaire. Un expert assermente se deplace sur place, examine le logement et redige un rapport detaille sur l'etat du bien et les degradations.

Le cout de l'expertise est generalement avance par la partie qui la demande, et peut etre mis a la charge de la partie perdante a l'issue du proces.

### Recours du proprietaire en cas de degradations

Le proprietaire qui constate des degradations lors de l'etat des lieux de sortie doit pouvoir prouver l'etat anterieur du logement. Cela passe par un etat des lieux d'entree precis et detaille, des photos datees de chaque piece et equipement, et les factures d'achat des equipements signales comme degrades.

Si le depot de garantie ne suffit pas a couvrir les travaux de remise en etat, le proprietaire peut demander au locataire le versement des sommes supplementaires. Cette demande doit etre faite dans les 2 mois suivant la remise des cles.

### Delais de prescription et d'action

Le delai pour contester une retenue sur le depot de garantie est de 3 ans a compter de la remise des cles (action personnelle). Pas se ce delai, le locataire ne peut plus reclamer la restitution.

Pour le bailleur, le delai pour reclamer le paiement de degradations depassant le depot estegalement de 3 ans, mais il doit agir rapidement pour maximiser les chances de recuperation des sommes.

### L'etat des lieux : cle de la resolution des litiges

L'etat des lieux est la preuve determinante dans un litige sur le depot de garantie. Un etat des lieux d'entree incomplet ou impr ecis desavantage le proprietaire en cas de contestation, car il ne peut pas demontrer que les dommages existaient avant l'entree du locataire.

L'etat des lieux doit etre signe par les deux parties. Chaque partie conserve une copie. En cas de refus de signature par l'une des parties, un temoin peut attester de l'etat du logement.

### Astuces pour eviter les litiges sur le depot de garantie

Pour le proprietaire : redigez un etat des lieux d'entree le plus detaille possible, envoyez le depot de garantie dans les 2 mois avec un recu detaille, conservez les factures des travaux pour prouver les couts de remise en etat, et souscrivez une GLI pour couvrir les risques.

Pour le locataire : faites-vous remettre une copie de l'etat des lieux d'entree signe, photographiez chaque piece des l'entree et conservez les photos, payez vos loyers et charges integralement jusqu'a la sortie, et en cas de depart anticipe, anticipez les sommes qui pourraient etre reclamees.

[CTA : Gerez vos etats des lieux et suivez vos depots de garantie automatiquement avec RentReady — essai gratuit]

## FAQ — Litige depot de garantie

**Le bailleur peut-il retenir le depot de garantie pour des travaux de peinture ?**

Seules les degradations constatees a l'etat des lieux de sortie peuvent justifier une retenue. L'usure normale (peinture jaunie, murs marques) est a la charge du proprietaire. Toutefois, si le locataire a cause des marques importantes (taches, griffures profondes), le bailleur peut deduire les couts de remise en etat.

**Que faire si le bailleur ne repond pas a ma reclamation ?**

Si le bailleur ne repond pas a la lettre recommandee dans 15 jours, saisissez le juge des contentieux de la protection. Le delai de 2 mois pour la restitution du depot continue de courir, et le retard peut generer des inter ets au taux legal.

**Le depot de garantie peut-il etre utilise pour payer le dernier mois de loyer ?**

Non, sauf accord expr es du bailleur. Le depot de garantie doit etre verse en meme temps que le premier loyer. Il n'est pas destine a remplacer le dernier mois de location."""
    },
    {
        'slug': 'modele-lettre-relance',
        'title': 'Modele de lettre de relance loyer impaye gratuit — Lettre simple et efficace',
        'excerpt': 'Telechargez notre modele de lettre de relance pour loyer impaye, pret a personnaliser. Relancez efficacement vos locataires defaillants.',
        'category': 'Gestion',
        'date': '2026-04-28',
        'updatedAt': '2026-04-28',
        'readTime': '6 min',
        'content': """## Modele de lettre de relance pour loyer impaye : guide et telechargement gratuit

La lettre de relance est la premiere etape de la procedure de recouvrement d'un loyer impaye. Elle marque le debut formel du processus et permet souvent de resoudre le litige sans passer par les tribunaux. Decouvrez comment rediger une lettre de relance efficace.

### Pourquoi envoyer une lettre de relance des le premier jour d'impaye ?

La lettre de relance est envoyee des le premier jour de retard de paiement du loyer. Elle constitue la premiere demarche formelle du proprietaire aupres du locataire defaillant.

Cette lettre a plusieurs fonctions : informer officiellement le locataire de l'impaye et de la situation, demander le paiement dans un delai determine, constituer une preuve ecrite de la demarche amiable, et engager la procedure formelle de recouvrement si le paiement n'est pas recu.

Envoyer la lettre tot est essentiel. Plus le proprietaire attend, plus les arrieres s'accumulent et plus la procedure devient complexe.

### Les informations obligatoires de la lettre de relance

Une lettre de relance doit contenir les informations suivantes : vos coordonnees completes (nom, adresse, telephone, email), les coordonnees du locataire (nom, prenom, adresse du logement), la reference du bail (date du bail, adresse du bien), le montant de l'impaye (montant exact des arrieres avec le decompte), la periode concernee, le delai imparti pour le paiement (generalement 8 a 15 jours), et les consequences en cas de non-paiement (mise en demeure, procedure judiciaire).

La lettre doit etre envoyee en recommande avec accuse de reception pour constituer une preuve de la demarche.

### Modele de lettre de relance pour loyer impaye

Le modele doit etre envoye en recommande avec accuse de reception. Il doit mentionner l'identite des parties, la reference du bail, le montant exact de l'impaye avec decompte, la periode concernee, le delai de paiement (8 jours recommande), et les consequences juridiques du non-paiement (procedure de recouvrement, resiliation du bail).

Apres la lettre de relance : la mise en demeure

Si le locataire ne react pas dans le delai imparti, la mise en demeure est l'etape obligatoire suivante. Elle doit etre envoyee en recommande avec accuse de reception et reprendre les memes elements, avec une formulation plus ferme. La mise en demeure marque le passage a la phase contentieuse. Elle doit explicitement evoquer les consequences juridiques du non-paiement (resiliation du bail, procedures d'expulsion).

La mise en place d'un echeancier amiable

Avant d'engager des poursuites, le proprietaire peut proposer au locataire un echeancier de paiement. Cette solution presente plusieurs avantages : recuperation plus rapide que la procedure judiciaire, maintien du locataire dans les lieux (evite la vacance), couts reduits pour les deux parties, et dialogue preserve entre bailleur et locataire.

L'echeancier doit etre formalise par ecrit, signe par les deux parties, et preciser les montants et les dates de paiement. En cas de nouveau manquement, le proprietaire peut reprendre la procedure contentieuse.

[CTA : Automatisez vos relances de loyers impayes avec RentReady — essai gratuit 14 jours]

## FAQ — Lettre de relance loyer impaye

**La lettre de relance est-elle obligatoire avant une procedure judiciaire ?**

La lettre de relance n'est pas obligatoire strictement parlant, mais elle est indipensable pour constituer un dossier solide. Sans relance prealable, le juge peut reprocher au proprietaire de ne pas avoir tente un reglement amiable.

**Combien de lettres de relance doit-on envoyer avant la mise en demeure ?**

Il n'y a pas de nombre minimum legal. Une seule lettre de relance peut etre suivie d'une mise en demeure. En pratique, un proprietaire envoie generalement une premiere lettre simple (email ou courrier), puis la lettre recommandee avec accuse de reception, avant la mise en demeure.

**La lettre de relance peut-elle etre envoyee par email ?**

Techniquement, la lettre de relance peut etre envoyee par email, mais il est recommande d'utiliser la lettre recommandee avec accuse de reception pour constituer une preuve rec evable en justice. L'email peut etre utilise en complement, mais pas comme seul moyen de reclamation.

**Que faire si le locataire conteste le montant de l'impaye ?**

Si le locataire conteste le montant, verifiez vos calculs et envoyez un decompte detaille. Si le litige persiste, saisissez le juge des contentieux de la protection qui tranchera le different."""
    },
    {
        'slug': 'mis-en-demeure-loyer',
        'title': 'Mise en demeure pour loyer impaye : modele et procedure legale en 2026',
        'excerpt': 'La mise en demeure est l'etape cle avant la procedure judiciaire pour impaye de loyer. Modele gratuit, delais et effets juridiques expliques.',
        'category': 'Gestion',
        'date': '2026-04-28',
        'updatedAt': '2026-04-28',
        'readTime': '7 min',
        'content': """## Mise en demeure pour loyer impaye : modele et procedure en 2026

La mise en demeure est l'etape formelle qui prec de la procedure judiciaire en cas de loyers impayes. Elle donne lieu a des effets juridiques precis et marque un tournant dans la relation avec le locataire defaillant.

### Qu'est-ce qu'une mise en demeure ?

La mise en demeure est un acte juridique formel qui notifie au locataire son manquement a ses obligations contractuelles (paiement du loyer) et l'informe des consequences juridiques du non-paiement.

Contrairement a la lettre de relance (qui est une demarche informelle), la mise en demeure est un acte officiel qui peut etre utilise comme preuve devant le tribunal. Elle doit etre envoyee en recommande avec accuse de reception, ou signifiee par huissier de justice.

### Quand envoyer une mise en demeure ?

La mise en demeure doit etre envoyee apres l'echec de la lettre de relance. Si le locataire n'a pas paye dans le delai imparti par la lettre de relance (generalement 8 a 15 jours), la mise en demeure peut etre envoyee immediatement.

La chronologie recommandee : Jour 1 (constatation de l'impaye), Jour 5-10 (lettre de relance en recommand e), Jour 15-20 (mise en demeure si pas de reponse), Jour 30+ (assignation au tribunal si toujours pas de reponse).

### Les effets juridiques de la mise en demeure

La mise en demeure produit plusieurs effets. Elle interrompt la prescription : a compter de la mise en demeure, le delai de prescription des actions en paiement de loyer est interrompu. Elle constitue une preuve formelle que le proprietaire a alerte le locataire. Elle ouvre le droit aux inter ets de retard (au taux legal). Elle permet la resiliation du bail si le locataire ne paie pas dans le delai.

### Contenu obligatoire de la mise en demeure

Une mise en demeure valide doit mentionner : l'identification des parties (bailleur et locataire), la reference du bail (date, adresse du bien), le montant exact de la dette (arrieres de loyer avec decompte), la periode concernee (mois ou mois impayes), le delai de paiement accorde (minimum 8 jours), les consequences juridiques du non-paiement (resiliation, expulsion, inter ets), et la date et la signature du bailleur.

### Signification par huissier vs courrier recommand e

La mise en demeure peut etre envoyee par courrier recommand e avec accuse de reception (moins co uteux, environ 5-10 euros, suffisant dans la plupart des cas) ou par signification par huissier de justice (plus co uteuse, 100-200 euros, mais plus solide juridiquement).

### Apres la mise en demeure : les scenarios possibles

Trois scenarios sont possibles. Le locataire paie : le dossier est clos, le proprietaire peut annuler la procedure judiciaire. Le locataire propose un echeancier : le proprietaire peut accepter ou refuser, un accord doit etre formalise par ecrit. Le locataire ne react pas : le proprietaire engage la procedure judiciaire (assignation au tribunal).

[CTA : Automatisez la gestion de vos impayes et suivez vos procedures avec RentReady — essai gratuit]

## FAQ — Mise en demeure loyer

**La mise en demeure peut-elle etre envoyee automatiquement apres la lettre de relance ?**

Non, il n'y a pas de delai automatique. Vous pouvez attendre quelques jours supplementaires ou enclencher immediatement la mise en demeure si le montant des arrieres est important. En pratique, un delai de 8 a 15 jours entre la lettre de relance et la mise en demeure est recommande.

**La mise en demeure peut-elle etre envoyee par email ?**

Techniquement, la mise en demeure peut etre envoyee par email, mais elle est moins rec evable juridiquement qu'un courrier recommand e ou une signification par huissier. Pour garantir vos droits, privilegiez le courrier recommand e avec accuse de reception ou la signification par huissier.

**Que se passe-t-il si le locataire paie entre la mise en demeure et l'assignation ?**

Si le locataire paie la totalite des arrieres avant l'assignation, le proprietaire peut annuler la procedure judiciaire. Il est recommande de formaliser le paiement par un recu et de verifier que les frais de procedure deja engages sont pris en charge.

**La mise en demeure est-elle obligatoire pour assigner le locataire ?**

La mise en demeure n'est pas obligatoire strictement parlant, mais elle est fortement recommandee. Sans mise en demeure prealable, le juge peut considerer que le proprietaire a agi de maniere precipitee et lui reprocher de ne pas avoir cherche un reglement amiable."""
    },
    {
        'slug': 'saisie-salaire-loyer-impaye',
        'title': 'Saisie sur salaire pour loyer impaye : procedure et montants recuperables',
        'excerpt': 'Quand le locataire ne paie plus son loyer et que la procedure judiciaire a permis d'obtenir un titre executoire, le bailleur peut engager une saisie sur salaire pour recuperer les arrieres.',
        'category': 'Gestion',
        'date': '2026-04-28',
        'updatedAt': '2026-04-28',
        'readTime': '7 min',
        'content': """## Saisie sur salaire pour loyer impaye : procedure, montants et droits du salarie

Quand un locataire ne paie plus son loyer et que la procedure judiciaire a permis d'obtenir un titre executoire, le bailleur peut engager une saisie sur salaire pour recuperer les arrieres. Voici comment fonctionne cette procedure.

### Qu'est-ce que la saisie sur salaire ?

La saisie sur salaire est une procedure d'execution qui permet au creancier (ici, le bailleur) de prelever directement une partie des revenus du salarie (le locataire) pour regler une dette (les arrieres de loyer).

Cette saisie est possible uniquement apres l'obtention d'un titre executoire (jugement du tribunal, ordonnance de refer e). Sans titre executoire, la saisie sur salaire est illegale.

### Conditions pour engager une saisie sur salaire

Pour engager une saisie sur salaire, le bailleur doit disposer d'un titre executoire condamnant le locataire au paiement des arrieres, conna itre l'employeur du salarie (l'identite et l'adresse de l'entreprise sont necessaires pour l'huissier), et le locataire doit etre salarie (la saisie sur salaire ne fonctionne pas pour les travailleurs independants, les retraite ou les personnes sans revenus).

L'huissier de justice est le professionnel habilite a mettre en œuvre la saisie sur salaire. Il envoie un avis de saisie a l'employeur du salarie.

### Les montants saisissables sur le salaire

Le legislateur a prevu des gardes-fous pour proteger le salarie : une partie du salaire est toujours inalterable.

Bareme de saisie sur salaire (en pourcentage du salaire net) : jusqu'a 559,17 euros (0%), de 559,17 a 895,47 euros (10%), de 895,47 a 1 193,96 euros (25%), de 1 193,96 a 1 492,45 euros (35%), de 1 492,45 a 1 790,94 euros (45%), de 1 790,94 a 2 089,43 euros (55%), de 2 089,43 a 2 387,93 euros (65%), de 2 387,93 a 2 686,42 euros (75%), au-dela de 2 686,42 euros (85%).

Ces tranches sont revises chaque annee en fonction de l'evolution du SMIC. Pour un salaire de 2 000 euros par mois, la part saisissable est de 55%, soit 1 100 euros par mois maximum.

### Procedure de saisie sur salaire

La procedure de saisie sur salaire se deroule en plusieurs etapes.

Etape 1 : Obtention du titre executoire — Le bailleur doit d'abord obtenir un jugement condamnant le locataire au paiement des arrieres.

Etape 2 : Intervention de l'huissier — Le bailleur mandate un huissier de justice pour mettre en œuvre la saisie. L'huissier envoie un avis de saisie a l'employeur du salarie, avec une copie du titre executoire.

Etape 3 : Calcul de la part saisissable — L'employeur calcule la part inalterable du salaire et reverse le surplus a l'huissier. L'employeur est responsable du bon calcul de la retenue.

Etape 4 : Reversement au bailleur — L'huissier recoit les sommes prelevees sur le salaire et les reverse au bailleur, deduction faite de ses honoraires.

### Le locataire peut-il contester la saisie ?

Le locataire peut contester la saisie sur salaire dans plusieurs cas : saisie excedant les limites legales, titre executoire contestable, ou situation financiere changee (si le salarie change d'emploi ou voit ses revenus chuter).

Le salarie doit s'adresser au juge de l'execution pour contester une saisie sur salaire.

### Saisie sur salaire et changement d'emploi

Si le salarie change d'emploi pendant la saisie, le nouvel employeur doit etre notifie par l'huissier. La saisie continue automatiquement avec le nouvel employeur. Si le salarie ne reprend pas d'emploi salarie, d'autres mesures d'execution peuvent etre envisagees (saisie sur compte bancaire, saisie de biens).

### Saisie sur salaire et prestations sociales

Certaines prestations sociales sont inalterables et ne peuvent pas etre saisies : aides au logement (APL, ALS), minima sociaux (RSA, allocation adultes handicapes), indemnites de maladie ou de maternite, et pensions alimentaires.

Seuls les revenus du travail (salaire, primes, vacations) peuvent etre saisis dans les limites du bareme.

### Comment le bailleur peut-il anticiper ?

Pour eviter d'en arriver a la saisie sur salaire, le bailleur peut verifier la solvabilite du locataire avant la signature (fiches de paie, avis d'imposition, contrat de travail), souscrive une GLI pour etre rembourse en cas d'impaye, mettre en place des solutions de paiement echeonne des le premier impaye, et agir tot (plus la procedure est engagee tot, plus les arrieres sont faibles).

[CTA : Protegez vos revenus locatifs avec RentReady — suivi des paiements et alertes en temps reel]

## FAQ — Saisie sur salaire pour impaye

**Le bailleur peut-il faire saisir directement le salaire du locataire ?**

Non, le bailleur doit d'abord obtenir un titre executoire (jugement) aupres du tribunal. Ce n'est qu'apres l'obtention de ce titre que l'huissier peut etre saisi pour mettre en œuvre la saisie sur salaire.

**Que se passe-t-il si le locataire quitte son emploi ?**

La saisie s'arrete avec l'ancien employeur. L'huissier doit etre informe du nouvel emploi du salarie pour relancer la saisie avec le nouvel employeur. Si le salarie ne reprend pas d'emploi salarie, d'autres mesures d'execution peuvent etre envisagees.

**Le locataire peut-il s'opposer a la saisie sur salaire ?**

Oui, le locataire peut contester la saisie devant le juge de l'execution si la part saisissable depasse les limites legales ou si le titre executoire est contestable.

**Combien de temps dure une saisie sur salaire ?**

La saisie sur salaire dure jusqu'a epuisement de la dette. Si le salarie quitte son emploi avant le remboursement integral, la saisie doit etre relancee aupres du nouvel employeur."""
    },
    {
        'slug': 'augmentation-loyer-irl',
        'title': 'Augmentation de loyer et IRL 2026 : comment calculer et appliquer la revision',
        'excerpt': "L'augmentation de loyer basee sur l'IRL ne peut pas depasser l'evolution de l'indice. Formule, date de reference, plafonnements et exemples de calcul.",
        'category': 'Calculs',
        'date': '2026-04-28',
        'updatedAt': '2026-04-28',
        'readTime': '7 min',
        'content': """## Augmentation de loyer et IRL 2026 : comment calculer et appliquer la revision

L'augmentation de loyer basee sur l'Indice de Reference des Loyers (IRL) est encadree par la loi. Proprietaires comme locataires doivent comprendre les regles pour eviter les litiges lors de la revision annuelle du loyer.

### Qu'est-ce que l'IRL ?

L'Indice de Reference des Loyers (IRL) est un indice publie trimestriellement par l'INSEE. Il reflete l'evolution des prix a la consommation hors tabac et hors loyer, sur les 12 derniers mois.

L'IRL sert de base legale a la revision des loyers dans les contrats de location. Depuis la loi du 8 fevrier 2008, la revision du loyer ne peut pas depasser l'evolution de l'IRL, ce qui protege les locataires contre les hausses excessives.

L'IRL est publie au Journal officiel et disponible sur le site de l'INSEE. Les principales dates de publication sont janvier, avril, juillet et octobre.

### Les valeurs de l'IRL en 2025-2026

Les dernieres valeurs de l'IRL publiees : IRL Q3 2025 (publie octobre 2025) : environ 146,2. IRL Q4 2025 (publie janvier 2026) : environ 146,5. IRL Q1 2026 (publie avril 2026) : disponible sur insee.fr.

Pour obtenir l'IRL exact du trimestre concerne, consultez le site de l'INSEE ou votre logiciel de gestion locative.

### Formule de revision du loyer

La formule de revision du loyer est la suivante : Nouveau loyer = Loyer actuel × (Nouvel IRL / Ancien IRL)

Exemple : un appartement loue 800 euros en janvier 2025, revision en janvier 2026 : Loyer actuel 800 euros, IRL au 1er janvier 2025 : 145,0, IRL au 1er janvier 2026 : 146,5, Calcul : 800 × (146,5 / 145,0) = 808,28 euros. L'augmentation est de 8,28 euros par mois (environ 1%).

### Date de revision : l'anniversaire du bail

La revision du loyer intervient automatiquement a chaque anniversaire du bail, si une clause de revision est prevue dans le contrat. Sans clause de revision, le loyer ne peut pas etre augmente en cours de bail.

La clause de revision doit preciser : la date de reference de l'indice (souvent le trimestre du dernier IRL connu a la signature), la periodicite de la revision (generalement annuelle), et la formule de calcul.

Sans ces precisions, la clause est reputee non ecrite et le loyer ne peut pas etre revise.

### Les limites de l'augmentation de loyer

L'augmentation de loyer en cours de bail ne peut pas depasser la variation de l'IRL. Le proprietaire ne peut pas augmenter le loyer au-dela de l'inflation constatee.

Exception : si le loyer est manifestement sous-evalue par rapport aux prix du marche, le proprietaire peut proposer une augmentation superieure lors du renouvellement du bail, mais cette augmentation est encadree. Elle ne peut pas depasser 10% du loyer actuel en zone tendue, doit etre justifiee par des travaux ameliorant la performance energetique du logement, et doit etre proposee au locataire 3 mois avant l'echeance du bail.

### Majoration limitee en zone tendue

Dans les communes soumises a l'encadrement des loyers (Paris, Lille, Grenoble, etc.), le loyer de relocation ne peut pas depasser le loyer de reference majore, publie par les observatoires locaux des loyers.

Le depassement est sanctionne par une amende pouvant aller jusqu'a 5 000 euros pour une personne physique.

### IRL et travaux : quand peut-on augmenter davantage ?

En cas de travaux amenagement de la performance energetique du logement (travaux permettant un gain d'au moins 20% de la performance energetique), le proprietaire peut negocier une augmentation de loyer superieure a l'IRL lors du renouvellement du bail.

L'augmentation ne peut pas depasser 15% du cout des travaux TTC, etale sur la duree du bail, ou 50% de l'augmentation echelonnee sur 3 ans. Les travaux doivent etre documentes et communiques au locataire.

### Comment mettre en œuvre la revision de loyer ?

La revision du loyer doit etre notifiee au locataire par lettre recommandee avec accuse de reception, au moins 1 mois avant la date de revision. Le bailleur doit inclure le detail du calcul : ancien loyer, nouvel IRL, coefficient de revision, nouveau loyer.

Si le bailleur omet de notifier la revision dans les delais, il ne peut pas rattraper les augmentations non appliquees. Le loyer reste fige jusqu'a la prochaine date de revision possible.

[CTA : Calculez automatiquement vos revisions de loyer et genere z les notifications avec RentReady — essai gratuit]

## FAQ — Augmentation de loyer IRL

**Peut-on refuser une augmentation de loyer basee sur l'IRL ?**

Non, si une clause de revision est prevue dans le bail et que la methode de calcul est conforme a la loi, le locataire ne peut pas refuser la revision. Toutefois, il peut contester le calcul devant le juge s'il y a une erreur.

**Que se passe-t-il si l'IRL est negatif ?**

Si l'IRL diminue (deflation), le loyer doit diminuer dans les memes proportions. Le proprietaire ne peut pas maintenir un loyer superieur a celui qui resulte de la formule de revision.

**L'augmentation de loyer peut-elle depasser l'IRL en cours de bail ?**

Non, en cours de bail, l'augmentation ne peut pas depasser l'evolution de l'IRL. En cas de renouvellement, des augmentations plus importantes sont possibles sous conditions (travaux, zone non tendue).

**Comment savoir si je suis en zone tendue ?**

Les zones tendues sont definies par arrete prefectoral. Vous pouvez verifier sur le site du gouvernement ou de votre commune. En general, les grandes villes (Paris, Lyon, Marseille, Lille, Bordeaux, etc.) sont considerees comme zones tendues."""
    },
    {
        'slug': 'gestion-locative-gratuite',
        'title': 'Gestion locative gratuite : les solutions sans frais pour les proprietaires',
        'excerpt': 'Peut-on gerer ses locations gratuitement ? Comparatif des solutions : Excel, applications gratuites et outils en ligne pour les proprietaires.',
        'category': 'Gestion',
        'date': '2026-04-28',
        'updatedAt': '2026-04-28',
        'readTime': '6 min',
        'content': """## Gestion locative gratuite : peut-on vraiment gerer ses locations sans frais ?

De nombreux proprietaires se demandent s'il est possible de gerer leurs locations sans debourser un euro. Entre Excel gratuit, applications sans frais et fausses solutions, voici la realite de la gestion locative gratuite en 2026.

### Les differentes solutions de gestion locative gratuite

La gestion locative gratuite existe sous plusieurs formes. Certaines sont reellement gratuites, d'autres dissimulent des couts ou des limitations.

Les tableurs Excel et Google Sheets constituent la solution la plus basique. Cette methode est gratuite et simple a mettre en place pour les proprietaires avec 1 ou 2 biens. Avantages : cout zero, flexibilite totale, pas de dependance a un service tiers. Inconvenients : mise a jour manuelle de chaque paiement, risque d'erreur de calcul, pas d'alertes automatiques pour les echeances, securite faible, et impossible de verifier la conformite juridique des modeles.

Plusieurs applications proposent un suivi basique des paiements sans frais. Applications gratuites notables : Google Calendar (rappel des echeances de paiement), Notion (modeles de suivi locatif), Sheetgo (automatisation des tableaux). Limitations : fonctionnalites reduites, pas de generation de quittances certifiees, pas de modeles de bail evolutifs, pas de mise a jour juridique automatique.

Certains logiciels de gestion locative proposent une version gratuite (freemium) avec des fonctionnalites limitees. Cette version gratuite est souvent une vitrine pour la version payante. Limitations : fonctionnalites reduites en gratuit, absence de support en version gratuite, pas de mise a jour juridique automatique.

### Ce qui n'est jamais vraiment gratuit

Certaines offres dites gratuites ne sont en realite pas gratuites. Les agences immobilieres qui proposent la gestion gratuite repercutent leurs frais sur le locataire ou sur le proprietaire. Les modeles de bail gratuits sur internet sont souvent obsoletes et non conformes aux dernieres evolutions legislatives. Les generateurs de quittances gratuits en ligne generent des documents non conformes ou watermarqu es, impropres a un usage professionnel.

### Les vrais couts de la gestion locative gratuite

La gestion locative gratuite presente des couts caches. Temps passe : un proprietaire qui gere lui-meme ses locations sur Excel passe en moyenne 2 a 4 heures par mois et par bien a la gestion administrative. Erreurs et litiges : un bail mal redige ou une quittance non conforme peut entrainer des litiges avec le locataire. Risque juridique : l'absence de mise a jour des modeles de bail peut entrainer des clauses nulles. Manque a gagner : un impaye non detecte a temps peut couter des mois de loyer non recouvre s.

### Quand la gestion gratuite devient payante

La gestion locative gratuite devient reellement payante dans deux cas. A partir de 3 biens : le temps de gestion augmente proportionnellement et le cout d'un logiciel de gestion (generalement 10 a 30 euros par mois) est compense par le temps e conomise. En cas de litige : un seul litige avec un locataire (impaye, degradation, procedure d'expulsion) peut couter entre 500 et 5 000 euros en frais de procedure.

### Les alternatives abordables a la gestion gratuite

Si le budget est limite, voici les alternatives les plus pertinentes. Le regime auto-entrepreneur : en declarant vos revenus locatifs en auto-entrepreneur, vous pouvez beneficier d'un taux de CFE reduit et deduire certaines charges. Les partenariats avec des property managers : certains property managers proposent des tarifs reduits pour les proprietaires qui gerent plusieurs biens. La garantie Visale : cette garantie gratuite de l'Etat protege contre les impayes pour les locataires de moins de 30 ans ou en CDD.

### Nos recommandations

La gestion locative gratuite est viable pour les proprietaires avec un seul bien et un calme locatif parfait. Au-dela, les risques et le temps investi depassent largement le cout d'un outil specialise.

Si vous cherchez une solution gratuite, privilegiez les essais gratuits des logiciels professionnels (14 a 30 jours) pour evaluer vos besoins avant de vous engager.

[CTA : Testez RentReady gratuitement pendant 30 jours et decouvrez la gestion locative moderne — sans engagement]

## FAQ — Gestion locative gratuite

**Peut-on vraiment gerer ses locations gratuitement avec Excel ?**

Oui, c'est possible mais fortement deconseille a partir de 2 biens. Les risques d'erreur, l'absence d'alertes et le temps de gestion rendu disponible ne compensent pas l'e conomie realisie.

**Les modeles de bail trouves sur internet sont-ils gratuits et fiables ?**

La plupart des modeles gratuits en ligne sont obsoletes. Privilegiez les modeles des sites institutionnels (service-public.fr) ou des logiciels specia lises qui mettent a jour leurs modeles a chaque evolution legale.

**La gestion locative gratuite existe-t-elle vraiment ?**

Oui, mais elle necessite un investissement important en temps et presente des risques. La vraie question est : combien vaut votre temps ? Si votre taux horaire reel est superieur a 20 euros/heure, l'utilisation d'un logiciel professionnel est plus interessante que la gestion gratuite sur Excel.

**Quel est le meilleur logiciel de gestion locative gratuit ?**

Il n'existe pas de vrai logiciel de gestion locative 100% gratuit et complet. Les versions gratuites sont des versions d'essai ou des offres Freemium tres limitees. Pour une gestion serieuse, comptez entre 10 et 30 euros par mois."""
    },
    {
        'slug': 'gestion-locative-prix',
        'title': 'Gestion locative : prix et tarifs des prestations en 2026 — agences vs logiciels',
        'excerpt': 'Combien coute une gestion locative ? Tarifs des agences, frais de gestion et solutions logicielles. Tout pour bien budgeter votre location.',
        'category': 'Gestion',
        'date': '2026-04-28',
        'updatedAt': '2026-04-28',
        'readTime': '7 min',
        'content': """## Gestion locative : prix et tarifs en 2026 — agences vs logiciels

Combien coute une gestion locative en France ? Entre les agences immobilieres et les logiciels en ligne, les tarifs varient du simple au quintuple. Voici le panorama complet des prix et des prestations.

### Les tarifs des agences immobilieres

Les agences immobilieres proposent un service de gestion locative complet, incluant la recherche de locataire, la redaction du bail, le suivi des paiements et la gestion des incidents. Leurs tarifs sont generalement exprimes en pourcentage des loyers per cus.

Fourchette de prix habituels : Gestion complete (5% a 10% du montant des loyers annuels), Gestion technique seule (3% a 5%), Location seule (1 mois de loyer environ).

Pour un appartement loue 1 000 euros par mois, le cout de gestion est donc de 50 a 100 euros par mois, soit 600 a 1 200 euros par an.

Prestations incluses dans la gestion complete : redaction et signature du bail, etat des lieux d'entree et de sortie, encaissement des loyers et suivi des paiements, relances en cas d'impaye, regularisation des charges annuelles, declarations fiscales, suivi des travaux, et correspondance avec le locataire.

Prestations generalement facturées en extra : location de votre bien (placement d'un nouveau locataire), procedure d'expulsion (frais d'huissier et d'avocat), travaux de renovation, et assurance GLI.

### Les tarifs des logiciels de gestion locative

Les logiciels de gestion locative en ligne proposent une solution plus economique, mais avec un service limite a la gestion administrative. Le proprietaire assure lui-meme la relation avec le locataire.

Fourchette de prix habituels : Entree de gamme (gratuit a 10 euros/mois) pour suivi basique des paiements, modeles de bail simples, convient aux proprietaires avec 1-2 biens. Milieu de gamme (10 a 30 euros/mois) pour gestion complete des baux, quittances automatis ees, comptabilite, alertes, convient a 5-10 biens. Haut de gamme (30 a 100 euros/mois) pour gestion de portefeuille complete, integration comptable, portail locataire, convient aux property managers professionnels.

Comparaison rapide : Agence (gestion complete) 600-1 200 euros/an pour 1 bien, 3 000-6 000 euros pour 5 biens. Logiciel milieu de gamme : 120-360 euros/an pour 1 bien, 600-1 800 euros pour 5 biens. Auto-gestion (Excel) : 0 euro pour 1 ou 5 biens.

### Les frais de gestion caches a connatre

Certains frais sont souvent omis lors de la comparaison des offres. Frais de mise en location : les agences facturent souvent la recherche de locataire en sus de la gestion. Ces frais peuvent representer 1 mois de loyer. Frais de relocation : a chaque changement de locataire, des frais de relocation sont generalement factur es. Frais de procedures : en cas d'impaye, les frais de procedure sont souvent a la charge du proprietaire. Frais de travaux : les agences de coordination de travaux facturent generalement une commission de 5 a 10% sur le montant des travaux.

### Quand utiliser une agence vs un logiciel ?

Privilegiez l'agence (gestion complete) si : vous avez plusieurs biens (5+) et pas le temps de gerer vous-meme. Votre bien est en zone tendue (encadrement des loyers, forte demande locative). Vous preferez avoir un interlocuteur physique en cas de probleme. Votre bien est sujet a une rotation elevee de locataires.

Privilegiez le logiciel si : vous avez 1 a 5 biens et un temps disponible pour la gestion. Vous cherchez a reduire les couts de gestion. Vous etes a l'aise avec les outils numeriques. Votre bien est stable (locataire a long terme). Vous voulez garder le controle sur vos donnees et vos documents.

### Les nouveaux acteurs du marche : gestion locative low cost

De nouveaux acteurs proposent des services de gestion locative a prix reduit, en digitalisant les processus et en limitant les frais de structure. Les property techs proposent des gestions a partir de 4-5% des loyers, avec un service partiellement digitalise. Les marketplaces de gestion mettent en relation proprietaires et gestionnaires professionnels, avec des tarifs negocies. Les coffre-forts numeriques permettent de numeriser et stocker tous les documents locatifs, facilitant l'auto-gestion.

### Comment choisir son prestataire de gestion locative ?

Criteres de choix : transparence des tarifs (mefiez-vous des offres dont le prix total n'est pas clair des le depart), mise a jour juridique (le prestataire doit garantir la conformite de ses modeles de bail et de quittances avec les dernieres evolutions legales), service client (reactivite en cas de probleme), references et avis (consulter les avis en ligne), et essai gratuit (un bon prestataire doit proposer un essai gratuit de 14 a 30 jours).

### Le retour sur investissement de la gestion locative

Pour evaluer l'interet d'une gestion locative professionnelle, calculez le temps que vous passez actuellement a gerer vos locations (en heures/mois), votre taux horaire reel (combien vaut votre heure de travail), les risques que vous avez courus (impayes, litiges, erreurs), et le cout d'une gestion professionnelle vs votre situation actuelle.

Pour la plupart des proprietaires avec 2-5 biens, le logiciel de gestion locative (120-360 euros/an) offre le meilleur rapport cout/bene fice.

[CTA : Comparez les solutions de gestion locative et trouvez celle qui vous convient — essayez RentReady gratuitement]

## FAQ — Prix gestion locative

**Combien coute une agence de gestion locative en 2026 ?**

Les agences facturent generalement entre 5% et 10% des loyers annuels pour une gestion complete. Pour un appartement a 1 000 euros/mois, cela represente 600 a 1 200 euros par an.

**Un logiciel de gestion locative remplace-t-il completement une agence ?**

Non, le logiciel vous aide a gerer les aspects administratifs (loyers, quittances, documents) mais ne remplace pas l'interlocuteur physique. En cas d'impaye grave ou de litige, vous devez soit gerer vous-meme, soit faire appel a un avocat ou un huissier.

**Les frais de gestion locative sont-ils deductibles fiscalement ?**

Oui, les frais de gestion (honoraires d'agence, frais de logiciel) sont deductibles des revenus fonciers dans le cadre du regime reel. Vous pouvez les ajouter a vos autres charges pour reduire votre revenu foncier imposable.

**Peut-on negocier les frais de gestion avec une agence ?**

Oui, notamment si vous avez plusieurs biens ou si votre bien est en zone tendue. N'hesitez pas a demander un devis detaille et a negocier les honoraires."""
    },
]

def fmt(art):
    c = art['content'].replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
    return f"""  {{
    slug: "{art['slug']}",
    title: "{art['title'].replace('"', '\\\\"')}",
    excerpt: "{art['excerpt'].replace('"', '\\\\"')}",
    category: "{art['category']}",
    date: "{art['date']}",
    updatedAt: "{art['updatedAt']}",
    readTime: "{art['readTime']}",
    content: \\`{c}\\`,
  }},"""

insert_after = content.rfind('  }\\n];')
print(f'Insert point: {insert_after}')

new_entries = []
added = []
for art in new_articles:
    if art['slug'] not in existing_slugs:
        new_entries.append(fmt(art))
        added.append(art['slug'])
        print(f'Adding: {art["slug"]} ({len(art["content"])} chars)')
    else:
        print(f'SKIP (exists): {art["slug"]}')

insert_pos = insert_after + 4
new_content = content[:insert_pos] + '\\n' + '\\n'.join(new_entries) + '\\n' + content[insert_pos:]

with open('src/data/articles.ts', 'w') as f:
    f.write(new_content)

print(f'\\nDone. Added {len(added)} articles.')
