# 10 — Roadmap 90 jours

## Méthode de score
**Score = 2 × Impact SEO + 2 × Conversion + (6 − Effort) + (6 − Risque)**, sur 30 au maximum.
- **Impact, Conversion :** 1 à 5.
- **Effort, Risque :** 1 (faible) à 5 (élevé), donc inversés dans la formule.

Les notes sont des estimations argumentées, pas des mesures. Les dépendances sont indiquées à part.

| # | Initiative | Impact | Conv. | Effort | Risque | Score | Dépendances |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Retirer les promesses non vérifiées (Open Banking sur 109 pages, FAQ Pro de `/pricing`, « pequeños », source CLAMEU, FAQ du générateur de quittance) | 4 | 4 | 2 | 1 | 25 | Validation produit |
| 2 | Corrections techniques : canonical de `/entretien`, 9 liens cassés et 8 redirections du glossaire, doublon `litige-depot-garantie`, `noindex` ou `robots` sur `/design-preview`, 50 descriptions identiques | 3 | 1 | 1 | 1 | 18 | — |
| 3 | Mesure : accès Search Console, événements `tool_used` et `signup_*`, retrait des `console.log` avec IP | 2 | 5 | 2 | 2 | 22 | Validation juridique (CNIL) |
| 4 | Générateur de quittance et reçu partiel (refonte, une seule URL) | 5 | 5 | 2 | 2 | 28 | #1 (FAQ) |
| 5 | Consolidation du cluster quittance (14 URL → 1 page pilier, 1 outil et 2 secondaires) | 4 | 3 | 2 | 3 | 21 | #4, données Search Console |
| 6 | Consolidation des pages locales (doc 07) | 4 | 2 | 3 | 4 | 17 | Données Search Console, validation |
| 7 | Maillage contextuel article → outil → fonctionnalité (119 articles) | 3 | 4 | 3 | 1 | 22 | #5 pour le cluster quittance |
| 8 | Calculateur IRL enrichi (lettre de notification, délai d'un an), mise à jour trimestrielle des indices | 4 | 3 | 2 | 2 | 22 | — |
| 9 | Consolidation des clusters relance/impayés et IRL (21 et 13 URL) | 4 | 3 | 3 | 3 | 20 | #7 |
| 10 | Outil de prorata de loyer | 3 | 3 | 1 | 1 | 22 | — |
| 11 | Outil de régularisation des charges | 4 | 4 | 3 | 3 | 22 | Décret 87-713 vérifié |
| 12 | Rendre accessibles `/comparatif/*` et `/templates/lease/*` | 2 | 3 | 1 | 1 | 20 | — |
| 13 | Glossaire : enrichir ou regrouper (30 pages de 174 mots) | 2 | 1 | 2 | 2 | 14 | — |
| 14 | Geler ou vérifier les outils fiscaux (plus-value, LMNP, Jeanbrun, prêt) | 1 | 1 | 2 | 4 | 10 | Revue fiscale |

## 0–30 jours : assainir et mesurer
| Initiative | Objectif | Pages | Actions | Métrique de succès | Effort |
| --- | --- | --- | --- | --- | --- |
| #1 Promesses | Ne plus rien promettre que le produit ne fait pas | 109 pages Open Banking, `/pricing`, 14 `/quittances/[ville]`, 36 pages CLAMEU, `/outils/generateur-quittance` | Supprimer ou reformuler ; source vérifiable ou suppression du chiffre | 0 occurrence (`sim.mjs`) | 1 à 2 j |
| #2 Technique | Zéro erreur évitable dans le crawl | voir doc 02 §2 | Corriger le canonical, les liens, les doublons ; `noindex` des prototypes ; descriptions uniques | Nouveau crawl : 0 lien cassé, 0 canonical incohérent | 1 j |
| #3 Mesure | Savoir quelles pages amènent des inscrits | site, inscription | Search Console partagée ; événements nommés ; avis juridique sur l'outil d'audience | Tableau mensuel disponible | 2 à 3 j |
| #4 Quittance | Avoir le meilleur générateur gratuit du marché français | `/outils/generateur-quittance` | Spécification du doc 06 | Usage de l'outil (après #3) ; impressions et clics Search Console de la requête | 3 à 5 j |
| #12 Accessibilité des pages | Remettre 12 pages dans le graphe | `/comparatif/*`, `/templates/lease/*` | Liens depuis `/gestion-locative`, `/pricing`, `/templates` | Profondeur ≤ 3 au prochain crawl | 0,5 j |

## 30–60 jours : consolider les clusters à plus forte intention
| Initiative | Objectif | Pages | Actions | Métrique | Effort |
| --- | --- | --- | --- | --- | --- |
| #5 Cluster quittance | Une page forte au lieu de 14 faibles | doc 05 | Réécrire la page pilier, puis 301 depuis les pages fusionnées | Impressions et clics de la page pilier, sans perte totale du cluster | 3 j |
| #7 Maillage | Envoyer le trafic informatif vers les outils | 119 articles | Lien contextuel vers l'outil du cluster et encadré « ce que fait Lokna » | % d'articles avec lien vers un outil : 5 % → 100 % ; clics vers les outils (#3) | 3 j |
| #8 IRL | Couvrir la révision de bout en bout | `/outils/calculateur-irl`, `/guides/irl-2026` | Lettre de notification ; T3 2026 ; procédure trimestrielle | Indice à jour sous 7 jours après publication par l'INSEE | 2 j |
| #10 Prorata | Capter une intention utilitaire simple | nouvelle `/outils/prorata-loyer` | Calcul en Decimal, deux méthodes | Impressions de la nouvelle page | 1 j |
| #6 Pages locales (décision) | Réduire le risque de doorway pages | 200 pages | Export Search Console, application de la règle du doc 07, puis validation | Liste validée | 1 j d'analyse |

## 60–90 jours : étendre ce qui différencie
| Initiative | Objectif | Actions | Métrique | Effort |
| --- | --- | --- | --- | --- |
| #6 Pages locales (exécution) | Ne garder que des pages locales utiles | 301 et réécritures validées ; sitemap mis à jour | Impressions locales ≥ niveau d'avant pour les pages conservées | 3 à 5 j |
| #9 Clusters relance et IRL | Même méthode que pour la quittance | Pages piliers et fusions | Idem #5 | 4 j |
| #11 Régularisation des charges | Deuxième outil différenciant | Outil, lettre et décompte | Usage, impressions | 4 à 5 j |
| #13 Glossaire | Fin des pages faibles | Enrichir les 10 définitions liées aux outils ; regrouper les autres | Plus aucune page < 300 mots | 2 j |

Aucun objectif de position n'est fixé : sans données Search Console, il n'existe pas de point de départ mesurable.

## Les 10 premières actions (prêtes à devenir des tâches)
1. **Supprimer la promesse Open Banking/DSP2** des templates `src/app/(marketing)/gestion-locative/[ville]/page.tsx` (bloc « Détection des paiements », ligne 137), `quittances/[ville]` et `features`, puis des pages `/demo`, `/locations`, `/pricing` et `/outils`. Pour `/cgu` et `/politique-confidentialite`, faire relire juridiquement les mentions DSP2 plutôt que de les supprimer. Contrôle : `grep -ri "open banking\|dsp2" src/app`.
2. **Corriger la FAQ de `/pricing`** (`src/app/(marketing)/pricing/page.tsx:84` et `:92`) pour qu'elle corresponde aux formules réelles (`PLANS` dans `src/data/entity.ts`).
3. **Corriger `/entretien`** (canonical vers `/maintenance`) : canonical vers elle-même et lien depuis `/features`, ou consolidation.
4. **Réparer les liens du glossaire :** remplacer les 9 cibles en 404 et les 8 liens vers des redirections dans `src/data/glossary.json`, par les URL listées dans `evidence/crawl_analysis.txt`.
5. **Rendre `/design-preview/*` non indexable :** `Disallow: /design-preview` dans `src/app/robots.ts` et `noindex` sur les 7 pages concernées, ou retrait du build de production.
6. **Fusionner `/blog/litige-depot-garantie-procedure`** dans `/blog/litige-depot-garantie` (301, retrait de `articles-meta.ts`).
7. **Refondre `/outils/generateur-quittance`** (doc 06) :
   - versements multiples et calcul par `settlePeriodPayments` ;
   - reçu de paiement partiel ;
   - sans champ e-mail ;
   - FAQ corrigée et sourcée.
8. **Lier depuis les hubs :** `/comparatif` depuis `/gestion-locative` et `/pricing` ; `/templates/lease` et les 3 modèles orphelins depuis `/templates`.
9. **Mesure :**
   - corriger `/api/analytics/page-view` pour conserver le nom de l'événement et ne plus journaliser l'IP en clair (après avis juridique) ;
   - ajouter `signup_completed` avec la page d'entrée ;
   - donner l'accès Search Console.
10. **Cluster quittance :** rédiger la page pilier `/quittances` et la carte des 301 (doc 05), à exécuter une fois les données Search Console disponibles.
