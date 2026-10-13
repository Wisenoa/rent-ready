# 04 — Cartographie des mots-clés

**Volumes : non disponibles** (aucun outil de mots-clés ni données Search Console accessibles). Le « niveau de concurrence » est estimé qualitativement à partir des SERP observées (doc 03) ; ce n'est pas une mesure.

**Légende**
- **Intention :** T transactionnelle, C commerciale, I informationnelle, N navigationnelle, U utilitaire / outil.
- **Priorité :** P1 (0–30 j), P2 (30–60 j), P3 (60–90 j).

| Cluster | Requête principale | Variantes | Intention | Page cible (existante) | À créer / fusionner | Concurrence | Conversion | Priorité |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Marque | lokna | lokna avis, lokna gestion locative | N | `/` | — | faible | très forte | P1 (mesurer) |
| Produit (en ligne) | gestion locative en ligne | gestion locative particulier, gérer sa location seul, sans agence | C/T | `/` | — | forte (éditeurs) | forte | P1 |
| Produit (logiciel) | logiciel gestion locative | logiciel propriétaire bailleur, application gestion locative | C | `/gestion-locative` | Fusionner `/locations` et `/demo` vers cette page | très forte (comparatifs) | forte | P1 |
| Comparatif | meilleur logiciel gestion locative | comparatif 2026, gratuit vs payant | C | `/comparatif/logiciel-gestion-locative` | Le rendre accessible (inaccessible aujourd'hui) | forte | moyenne à forte | P2 |
| Gratuit | logiciel gestion locative gratuit | gestion locative gratuite | C | aucune page dédiée honnête | Page « Gérer gratuitement : ce que font les outils gratuits, ce que fait Lokna » | forte | moyenne | P3 |
| Quittance (outil) | quittance de loyer | modèle quittance de loyer, quittance PDF, générateur quittance | U | `/outils/generateur-quittance` | **Une page principale** ; `/outils/modele-quittance-loyer-pdf`, `/templates/recu-loyer` et 5 articles à consolider | très forte | forte (récurrence mensuelle) | P1 |
| Reçu partiel | reçu de paiement partiel loyer | quittance paiement partiel, acompte loyer | U/I | absente | Ajouter au générateur (doc 06) | faible | forte | P1 |
| IRL | révision loyer IRL | calcul IRL 2026, indice de référence des loyers, augmentation loyer | U | `/outils/calculateur-irl` | Supprimer l'URL `-2026` (déjà redirigée) ; consolider 5 articles | forte (service-public, PAP) | moyenne | P1 |
| Relance | lettre relance loyer impayé | mise en demeure loyer impayé, modèle | U | `/outils/lettre-relance-loyer` | Consolider `/templates/relance-loyer-impaye`, `/guides/relance-loyer` et 3 articles | forte | forte | P1 |
| Impayés (procédure) | loyer impayé que faire | recours, procédure, commandement de payer | I | `/blog/loyer-impaye-que-faire-guide` | Page pilier (doc 05) | forte | moyenne | P2 |
| Charges | régularisation charges locatives | calcul charges, charges récupérables | U/I | `/outils/calculateur-charges-locatives` | Outil de régularisation annuelle (doc 06) | moyenne | moyenne | P2 |
| Dépôt de garantie | dépôt de garantie location | restitution, délai, retenue | I/U | `/guides/depot-garantie` | Fusionner les 2 articles « litige » | moyenne | faible à moyenne | P2 |
| Prorata | prorata loyer premier mois | loyer au prorata, calcul entrée locataire | U | absente | Calculateur (doc 06) | moyenne | moyenne | P2 |
| Bail | modèle bail location | bail vide, bail meublé, contrat de location | U | `/templates/bail-vide`, `/templates/bail-meuble` | `/guides/modele-bail` comme hub ; fusionner 4 articles « rédiger un bail » | très forte | moyenne | P2 |
| État des lieux | modèle état des lieux | checklist, entrée, sortie | U | `/templates/etat-des-lieux` + `/outils/checklist-etat-lieux` | Clarifier les rôles respectifs | forte | moyenne | P3 |
| Rentabilité | calcul rentabilité locative | rendement brut net | U | `/outils/calculateur-rendement` | — | forte (SeLoger, Dougs) | faible (investisseur, pas encore bailleur) | P3 |
| Fiscalité | déclaration revenus fonciers | micro-foncier ou réel, 2044, LMNP | I | 16 articles | Consolider (doc 05) | très forte (spécialistes) | faible | P3 |
| Local | gestion locative [ville] | quittance [ville], bail [ville] | C | 200 pages ville | **Ne rien créer** ; consolider (doc 07) | variable | faible en l'état | P1 (risque) |
