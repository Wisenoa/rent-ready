# 05 — Stratégie éditoriale

## Principe
Lokna a **déjà trop de pages par sujet** (119 articles, 30 définitions, 23 modèles, 5 guides, parfois 5 à 20 URL pour une même intention). La priorité n'est pas de produire davantage : il faut **consolider en clusters clairs**, chacun avec :
- **une page pilier**, qui reprend et enrichit le meilleur contenu existant ;
- **quelques pages secondaires**, chacune pour une sous-question réellement distincte ;
- **un outil** ;
- **un lien vers la fonctionnalité** du produit qui résout le problème.

Toute page qui ne répond pas à une sous-question distincte est **fusionnée par une redirection 301** vers la page pilier ou vers la secondaire la plus proche. Rien n'est supprimé sans validation (doc 10).

## Clusters

| Cluster | Page pilier (cible) | Secondaires à garder ou fusionner | Outil | Lien produit | Sources officielles à citer (vérifier la date à la rédaction) |
| --- | --- | --- | --- | --- | --- |
| Quittances | `/quittances`, réécrite en page pilier « Quittance de loyer : règles, modèle, paiement partiel » | Garder `quittance-loyer-apl-caf` et `/comparatif/quittance-de-loyer-vs-attestation`. Fusionner `quittance-loyer-pdf-gratuit`, `modele-quittance-loyer-gratuit`, `generateur-quittance-loyer`, `quittance-loyer-mentions-obligatoires` et `/guides/quittance-loyer` vers la page pilier ; `/outils/modele-quittance-loyer-pdf` et `/templates/recu-loyer` vers le générateur | `/outils/generateur-quittance` | Quittance générée au paiement (`/features`) | Loi n° 89-462, art. 21 (Légifrance) ; service-public.fr (quittance) |
| Loyers et paiements | Nouvelle page pilier « Suivre ses loyers et paiements partiels », adaptée de `/gestion-locative` sans la dupliquer | Prorata (à créer), intérêts de retard | Calculateur de prorata, reçu partiel | Suivi du mois | Loi 89-462 art. 21 ; Code civil (imputation des paiements) |
| Impayés | `/blog/loyer-impaye-que-faire-guide`, enrichie et promue « Loyer impayé : que faire, étape par étape » | Garder les étapes distinctes : mise en demeure, commandement de payer, recouvrement judiciaire, saisie sur salaire, GLI. Fusionner `comment-gerer-loyers-impayes`, `loyer-impaye-recours` et les 3 articles « modèle de lettre ». Revoir l'angle pénal de `recours-garde-a-vue` | `/outils/lettre-relance-loyer` | Relances en 3 tons (rappel, relance formelle, mise en demeure) | Modèle de relance de la CAF ; ANIL ; service-public (impayés) |
| Révision | `/guides/irl-2026`, réécrite en pilier « Révision du loyer et IRL » | Garder `augmentation-loyer-regles-procedure` (cas hors IRL : travaux, sous-évaluation, zone tendue). Fusionner `revision-loyer-irl-guide-complet`, `indexation-loyer-formule-2026`, `augmentation-loyer-irl` et `simulateur-irl-2026` | `/outils/calculateur-irl` | Révision proposée puis validée | INSEE série 001515333 ; service-public F13723 ; loi 89-462 art. 17-1 |
| Charges | Pilier « Charges locatives : provisions et régularisation » | Fusionner les 2 articles « liste des charges récupérables » | Outil de régularisation (doc 06) | Provisions séparées du loyer | Décret n° 87-713 (charges récupérables) ; loi 89-462 art. 23 |
| Baux | `/guides/modele-bail` comme hub | Garder `/templates/bail-*` (un par type). Fusionner les 4 articles « rédiger un bail » et les 2 articles « meublé ou vide » | Modèles de bail | Bail dans Lokna (loyer, charges, révision) | Décret n° 2015-587 (contrat type) ; loi 89-462 |
| Dépôt de garantie | `/guides/depot-garantie` (381 mots → à enrichir) | Fusionner `litige-depot-garantie-procedure` vers `litige-depot-garantie` ; garder meublé et restitution | `/outils/calculateur-depot-garantie` | — | Loi 89-462 art. 22 |
| Obligations du bailleur | Pilier à créer, à partir des contenus existants (diagnostics, décence, assurance, compte bancaire) | Faire vérifier `gestion-compte-banque-separe`, dont le title parle d'« obligation légale » | — | — | Décret n° 2002-120 (décence) ; service-public |
| Fiscalité | `/blog/declaration-revenus-locatifs-2026` comme pilier | Fusionner `regime-micro-foncier`, `micro-foncier-ou-reel-comparaison-2026` et les 3 articles LMNP qui se recouvrent | Simulateurs existants | Export CSV des loyers encaissés | impots.gouv (2044, BOFiP). **Mettre à jour chaque année.** |
| Fin de bail | Pilier « Fin de bail : congé, préavis, sortie » | `resiliation-bail-location`, `/outils/calculateur-preavis`, `/outils/generateur-conge-vente` | Préavis, congé | — | Loi 89-462 art. 15 |
| Meublé / vide | Rattacher au cluster Baux | — | — | — | — |

## Règles de qualité pour les sujets juridiques et fiscaux
1. **Sources :** chaque affirmation réglementaire cite sa source (Légifrance, service-public, impots.gouv, INSEE) avec la date de consultation.
2. **Fraîcheur :** un champ « vérifié le » visible, et une revue annuelle obligatoire pour la fiscalité et l'IRL (nouvel indice publié chaque trimestre).
3. **Cas particuliers signalés :** zone tendue et encadrement, meublé ou vide, bail mobilité, SCI, outre-mer.
4. **Corrections avant toute promotion :**
   - FAQ du générateur de quittance (délai d'un mois et mention de l'IRL non prévus par la loi) ;
   - « Open Banking » sur 109 pages ;
   - « pequeños » ;
   - source « CLAMEU » ;
   - promesses Pro de `/pricing`.
5. **Glossaire (30 pages de 174 mots en médiane) :** soit chaque définition est enrichie (cas, exemple chiffré, lien vers l'outil), soit le glossaire est regroupé en une page unique avec ancres. Une page par terme ne se justifie que si elle répond à une recherche distincte.

## Ce qu'il ne faut pas faire
- **Pas d'articles de variante :** pas de « … 2026 », « … guide complet », « … modèle gratuit » sur un sujet déjà couvert.
- **Pas de nouvelles pages ville** avant la consolidation (doc 07).
- **Pas de contenu juridique sans source** ni sans date de vérification.
