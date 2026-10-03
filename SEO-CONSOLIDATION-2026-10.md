# RentReady — SEO/GEO : consolidation et vague 1

Date : 2026-10-04 · Périmètre : site marketing `rentready.fr` + moteur produit
Méthode : 6 agents de recherche en parallèle + audit direct du dépôt et
vérification dans le HTML rendu. Chaque affirmation chiffrée ci-dessous a été
contrôlée dans le code ou contre une source primaire.

---

## 0. Le fait qui conditionne tout le reste

**`rentready.fr` ne résout pas en DNS.**

```
dig +short rentready.fr            → (vide)
dig +short www.rentready.fr        → (vide)
curl https://www.rentready.fr      → Could not resolve host
```

Aucun moteur ne peut indexer, crawler ou citer le site tant que le domaine
n'existe pas en production. Toute la SEO/GEO décrite ici est **préparatoire** :
elle prépare le terrain, elle ne produira aucun trafic tant que le domaine
n'est pas en ligne. C'est le premier chantier, avant toute autre chose.

Ce que cela ne change pas : le code marketing, les contenus, les schema et les
liens internes se corrigent maintenant, sans coût de reprise, et seront juste
utiles le jour où le domaine répondra.

---

## 1. État SEO actuel (au 2026-10-04)

### 1.1 Ce qui existe déjà — bien plus qu'un prototype

| Cluster | Volume | État |
|---|---|---|
| Pages statiques | 100 routes | structure saine, sitemap dérivé du filesystem (pas de dérive possible) |
| Articles de blog | 119 | médiane 816 mots, **30 sous 300 mots** |
| Outils / calculateurs | 18+4 | dont plusieurs cassés ou faux (corrigés en vague 1) |
| Modèles | 20 | statiques, aucun calcul |
| Pages ville | 200 (50 villes × 4 familles) | **38 villes sur 50 n'ont aucune donnée locale** |
| Glossaire | 30 termes | excellent pour l'extraction (définition courte en tête) |
| Comparatifs | 8 | **inatteignables depuis la navigation** |
| robots.txt / sitemap / metadata / JSON-LD | oui | présents, mais avec les défauts ci-dessous |

L'infrastructure SEO existe déjà (`seo-checks/`, `seo:all`, `monitor-gsc`,
`monitor-cwuv`). Le problème n'a jamais été l'absence d'outillage.

### 1.2 Défauts trouvés et corrigés en vague 1

| # | Gravité | Défaut | Preuve |
|---|---|---|---|
| 1 | **Bloquant produit** | 5 valeurs IRL fausses + 2026 absent du moteur de révision de loyer | `irl-calculator.ts`, série INSEE 001515333 |
| 2 | **Bloquant page** | `/outils/calculateur-caution` : récursion infinie, page blanche | `calculator-client.tsx:225` rendait le composant qui le contient |
| 3 | **Bloquant droit** | Règle de surface habitable inventée (interpolation entre 1,80 m et 2,50 m) | R.111-2 CCH : le test est binaire |
| 4 | **Bloquant droit** | Délais de préavis inversés dans 2 articles | art. 15 loi 89-462 : 3 mois locataire, 6 mois bailleur, **indépendamment de la zone** |
| 5 | **Bloquant droit** | DPE : « F et G interdits depuis 2023 » | G depuis 2025, F en 2028, E en 2034 |
| 6 | **Important** | Prix contradictoires : « dès 15 €/mois » contre un plan à 9 €/mois | layout racine + 11 blocs JSON-LD |
| 7 | **Important** | Exemple de révision de loyer calculé sur deux IRL fabriqués (806,72 € au lieu de 806,21 €) | `articles.ts` |
| 8 | **Important** | 30 articles annoncent 6–11 min pour 100–250 mots | `readTime` écrit à la main |
| 9 | **Important** | `SearchAction` vers `/recherche`, route inexistante (27 fichiers) | promesse d'une recherche qui 404 |
| 10 | **Important** | `logo.png` cité par 18 schémas, fichier inexistant | `public/` ne contenait aucun PNG |
| 11 | **Important** | `sameAs` pointant sur deux profils 404 (Twitter, LinkedIn) | vérifié en direct |
| 12 | **Important** | `/comparatif/*` non liées depuis la nav ni le footer | 8 pages dont 3 comparatifs directs |
| 13 | **Mineur** | `stripe.ts` annonçait 144 €/an contre 149 €/an vendus | métadonnée, pas le montant facturé |

### 1.3 Un mot sur l'outillage de vérification existant

`seo-checks/meta-validator.js` rapporte **53 erreurs** sur des pages qui ont
bien leurs metadata (`/pricing` est dans la liste) : son motif ne reconnaît que
`export const metadata`, pas `generateMetadata()`. `link-checker.js` annonce
**153 liens cassés** qui sont en réalité des `fetch is not defined` — il
évalue du TSX comme du JavaScript.

Ces deux scripts sont des garde-fous qui ne fonctionnent pas. Le travail de la
vague 1 a reposé sur des tests vitest qui, eux, vérifient des faits. **À
reprendre en vague 2** — un garde-fou qui ment est plus dangereux que pas de
garde-fou.

---

## 2. Concurrents organiques réels

Le marché est **fragmenté à l'extrême** : plus de 30 éditeurs SaaS, aucun leader.

| Concurrent | Positionnement | Force à comprendre | Faille exploitable |
|---|---|---|---|
| **Rentila** | gratuit, bailleur particulier | domine 4 requêtes head ; titre « logiciel gratuit » | gratuit ⇒ pas de revenu ; pages d'outilsAutomation faible |
| **Qalimo** | 4,90 €/mois | **preuve d'expertise juridique** (« ancien huissier ») — cité n°1 par tous les comparatifs | pas de gratuit |
| **immobilierloyer.com** | bailleur + SCI | **le plus redoutable en informationnel** : calculateur de charges, 2044 en ligne, quittance en ligne, forum 12 900 messages, 1 100+ avis | interface datée |
| **iGestionlocative** | freemium depuis 2015 | 260 000 propriétaires revendiqués ; très visible sur 2044 | niche SCI |
| **LegalPlace** | générateur juridique | domine « contrat de location » via questionnaire → PDF | pas de gestion locative |
| **Smovin / Brik / Gerlok** | comparatifs auto-produits | **se classent sur le head BOFU avec du contenu intermédiaire** | auto-promotion peu crédible |
| **EasyLocation** | gratuit, conformité | « le logiciel qui applique la loi pour vous » — très proche de RentReady | jeune |

**Institutionnels intouchables** : service-public.gouv.fr, justice.fr,
impots.gouv.fr, insee.fr, ecologie.gouv.fr, ANIL/ADIL, notaires.fr, Doctrine.
Ils gagnent parce qu'ils sont la source. **Ne jamais les concurrencer frontalement** —
les contourner en fournissant l'outil exécutable qu'ils refusent de faire.

**Noms du brief qui n'existent pas** (vérifié) : Gercleo, ImmoTop, Homiris,
Baobab (logiciel), Bailly, Yojango, Locataire.fr. Les pages `rentready-vs-gerclegeo`
et `rentready-vs-immotop` comparent donc des entités qui ne sont pas des
concurrents SaaS français — à corriger ou supprimer (voir §10).

---

## 3. Univers de mots-clés et clusters

Aucun volume chiffré n'a été observé (pas d'outil de volume). La demande est
qualifiée par **signaux** : nature des résultats, présence d'outils dans le
top 10, présence de forums (= question réellement posée).

### Les 5 opportunités les plus franches

| # | Opportunité | Pourquoi c'est ouvert |
|---|---|---|
| 🥇 | **État des lieux** | SERP politiquement vierge : pas un seul acteur FR, que des sites anglophones générés et un site de luminaires nommé « État des Lieux ». Aucune autorité, aucune marque. |
| 🥈 | **Fiscalité (2044, LMNP)** | SERP majoritairement **anglophone** ou Quarter. Aucun éditeur français installé. Meilleur signal BOFU du lot, et pont naturel vers l'abonnement. |
| 🥉 | **Calculateurs de conformité** | ANIL et Service-Public donnent la règle et **refusent de faire le calcul** (« valeur strictement indicative »). 8 simulateurs tiers se partagent déjà la page 2 : barrière technique basse. |
| 4 | **Listicles comparatifs** | **10+ sites comparatifs concurrents** occupent la page 1, aucun ne domine. RentReady en publie déjà 3 — mais ils sont inatteignables. |
| 5 | **Calcul + courrier** | Seul immobilierloyer combine décompte *et* courrier prêt à envoyer. Le courrier généré est le seul espace blanc de l'informationnel FR. |

### Clusters principaux

| Cluster | Pivot | Forme gagnante | Un outil bat-il un article ? |
|---|---|---|---|
| Documents (quittance, bail, EDL, relance) | `générateur quittance de loyer gratuit` | formulaire → PDF | **oui, massivement** — la SERP est vide de texte |
| Conformité / révision | `calcul IRL` | simulateur avec indice embarqué | **oui** — aucun article ne se classe |
| Charges récupérables | `régularisation charges locatives` | calculateur + courrier | oui |
| Fiscalité | `micro-foncier / 2044` | préremplissage pas-à-pas | partiellement |
| Choix du logiciel | `comparatif logiciel gestion locative` | listicle | non — mais c'est le cluster le plus ouvert |
| Impayés | `loyer impayé lettre de relance` | modèle + chronologie des délais | le modèle bat l'article |

### Ce qu'il ne faut pas attaquer

| Intention | Pourquoi |
|---|---|
| `logiciel gestion locative` (head) | 4 des 6 premiers résultats ont exactement la même promesse. titres « n°1 / gratuit ». |
| `gestion locative en ligne` | l'intention est « **déléguer à une agence** », pas « s'outiller ». Manda et Foncia dominent. |
| `encadrement des loyers` | 100 % institutionnel et presse. |
| Droit pur (LMP, congé, 89-462 dérogation) | Doctrine, notaires, ADIL. Exige une signature d'avocat. |

**Arbitrage** : ne pas chasser le head BOFU. Chasser
**« [document] modèle gratuit »** et **« [règle] calculateur »** — deux formats
où la SERP est vide de texte et où l'intention est forte ET directement
monétisable.

---

## 4. Risques de cannibalisation

L'audit mesure des **familles de pages entières**, pas des paires.

| Intention | Pages concurrentes dans le dépôt | Total |
|---|---|---|
| Bail de location | 5 articles + `/guides/modele-bail` + `/outils/modele-bail-location` + `/templates/bail-*` | **9** |
| Révision IRL | 4 articles + `/outils/calculateur-irl` + `/guides/irl-2026` + 50 pages ville | **~56** |
| Quittance de loyer | 4 articles + `/outils/generateur-quittance` + `/outils/modele-quittance-loyer-pdf` + `/guides/quittance-loyer` + 50 pages ville | **~57** |
| Dépôt de garantie | 6 articles + 2 calculateurs + `/templates/etat-des-lieux` + glossaire | **10** |
| Charges récupérables | 3 articles quasi identiques + 1 calculateur | **4** |

Fusions recommandées (non exécutées en vague 1 — voir §10) :

```
rediger-contrat-location              → /guides/modele-bail
rediger-bail-location                 → /guides/modele-bail
comment-rediger-bail-location-guide-complet → /guides/modele-bail
augmentation-loyer-irl                → /outils/calculateur-irl
indexation-loyer-formule-2026         → /outils/calculateur-irl
augmentation-loyer-regles-procedure   → /outils/calculateur-irl
simulateur-irl-2026                   → /outils/calculateur-irl
generateur-quittance-loyer            → /outils/generateur-quittance
modele-quittance-loyer-gratuit        → /outils/generateur-quittance
charges-locatives-recuperables-liste-2026 → charges-locatives-recuperables-liste
modele-bail-location-gratuit          → /templates/bail-vide
```

Déjà traitées en vague 1 (avec 301 et repointage des liens entrants) :
`/outils/calculateur-caution`, `/templates/calculateur-rendement-locatif`,
`/outils/modele-bail-location`.

---

## 5. Architecture cible

L'architecture existante est **bonne** : `/outils` pour ce qui calcule,
`/guides` pour l'éditorial, `/templates` pour les documents, `/comparatif` pour
la sélection, `/glossaire-immobilier` pour les définitions. Il n'y a pas à la
refondre. Deux corrections de structure :

1. **Une intention = une URL canonique.** Les fusions ci-dessus.
2. **La money page `/gestion-locative` est un annuaire de villes**, pas une page
   produit : elle liste 50 liens et ne dit rien du logiciel. C'est la page qui
   devrait porter l'intention « logiciel de gestion locative ». Elle doit
   devenir une page produit (what / who / why / how / price / preuve) et
   l'annuaire de villes doit vivre ailleurs.

---

## 6. GEO

**Constat central** : RentReady n'est pas citable aujourd'hui, et ce n'est pas
une question de schema.

- **Entité** : cohérente sur le nom, l'audience, le périmètre FR. Mais
  contradictoire sur le prix (corrigé) et sans auteur identifiable.
- **Auteur absent** : les 119 articles sont attribués à une Organization
  générique, sans `author` ni `reviewedBy`. C'est le manque le plus rentable
  côté « qui peut citer » : un moteur qui doit attribuer une affirmation préfère
  une source attribuée.
- **Données originales : zéro.** Aucune statistique publiée. C'est le principal
  manque pour le GEO, et c'est aussi le seul actif non copiable (voir §7).
- **Points forts réels** : le glossaire est un modèle d'extraction
  (`shortDefinition` en 1 phrase juste après le h1, `DefinedTerm` +
  `DefinitionPage` en JSON-LD). À répliquer ailleurs.

Benchmark reproductible : `.hermes/seo-research/geo-benchmark.json` (12
questions : 4 BOFU, 4 MOFU, 4 définitions). **Aucune visibilité IA n'a été
observée** — le domaine ne résout pas, la mesure n'est pas possible aujourd'hui.
Rejouer le benchmark une fois en ligne.

---

## 7. Contenu moat — l'actif non copiable

Rien n'a été inventé. L'infrastructure est prête, les données n'existent pas
encore.

Ce qui devient un avantage que « 50 articles générés » ne copie pas :

1. **Statistiques anonymisées de paiement** — délais réels de règlement, taux
   d'impayé, saisonnalité. Le produit sait déjà tout ça (paiement → quittance).
2. **Répartition des retards de paiement** — quel jour du mois les gens
   payent, et ce que ça implique pour un landlord.
3. **Erreurs de révision IRL les plus fréquentes** — quel trimestre, quelle date
   anniversaire. Hypothèse issues des conversations support.

Prérequis technique : un job d'agrégation anonymisé (seuils de k-anonymat,
minimum 30 observations par cohorte) et une page `/donnees/<sujet>` qui cite
sa propre méthodologie. **Aucune statistique tant que le pipeline n'existe
pas.**

---

## 8. Top 20 opportunités, par valeur

Priorité = valeur commerciale × opportunité de recherche × probabilité de
classement × proximité produit × défendabilité ÷ coût.

| # | Opportunité | Valeur | Prob. | Coût | Vague |
|---|---|---|---|---|---|
| 1 | Mettre le domaine en ligne | **critique** | — | faible | **0** |
| 2 | Refaire `/gestion-locative` en page produit | très haute | haute | M | 1 |
| 3 | Outil prorata premier/dernier mois | haute | haute | S | 1 |
| 4 | Outil restitution du dépôt de garantie | haute | haute | S | 1 |
| 5 | Connecter `/comparatif` à la navigation | très haute | haute | S | 1 |
| 6 | Outil calculateur de loyer révisé (le vrai) | haute | haute | M | 1 |
| 7 | Exécuter les fusions cannibalisation | haute | haute | S | 1 |
| 8 | Outil état des lieux conforme décret 2016-382 | très haute | très haute | M | 2 |
| 9 | Formulaire 2044 prérempli | très haute | moyenne | L | 2 |
| 10 | Outil régularisation des charges | haute | haute | M | 2 |
| 11 | Cash-flow / rentabilité nette réelle | haute | moyenne | S | 2 |
| 12 | Auteur identifiable sur les articles | haute | — | M | 2 |
| 13 | Corriger `seo-checks/` (gardes cassés) | moyenne | — | S | 1 |
| 14 | Purge des 30 articles minces | moyenne | haute | S | 2 |
| 15 | Statistiques propriétaires (pipeline) | très haute | longue | L | 3 |
| 16 | Corriger/retirer les comparatifs Gercleo/ImmoTop | moyenne | — | S | 1 |
| 17 | Lettre de relance génératrice + LRAR | haute | moyenne | M | 2 |
| 18 | Données locales pour les 38 villes vides | moyenne | moyenne | M | 3 |
| 19 | Guides « pas-à-pas outillé » (loyer → quittance) | moyenne | moyenne | M | 3 |
| 20 | Forum / communauté landlords | très haute | longue | L | 4 |

---

## 9. Vague 1 — ce qui a été livré

### Money pages
- `/gestion-locative` : encore un annuaire. **Reste à faire** (opportunité n°2).

### Outils
- `/outils/calculateur-caution` (cassé + droit faux) → **301** vers
  `/outils/calculateur-depot-garantie` (correct).
- `/outils/calculateur-surface-habitable` : règle légale corrigée.
- Moteur IRL : valeurs INSEE corrigées, 2026 ajouté, **valeurs épinglées par test**.

### Cannibalisation
- 3 pages supprimées, 3 redirections 301, 9 liens entrants repointés.

### Données et contenu
- 7 règles de droit inversées ou fausses corrigées contre source primaire.
- 8 valeurs inventées ou périmées corrigées (IRL, taux légal, Visale, DPE).
- `readTime` calculé au lieu d'être inventé.
- Prix : source unique (`src/data/entity.ts`).

### Structured data / entité
- Logo créé (`public/logo.svg`), 18 références repointées.
- `SearchAction` mort retiré de 27 fichiers.
- `sameAs` réduit aux profils qui répondent (Facebook seul).
- 11 blocs Offer dédupliqués autour d'un helper dérivé des plans.

### Tests ajoutés
| Fichier | Tests | Protège |
|---|---|---|
| `legal-accuracy.test.ts` | 7 | préavis, DPE, responsabilité, taux légal, Visale, dépôt |
| `pricing-consistency.test.ts` | 12 | prix, sameAs, logo, SearchAction, images |
| `article-readtime-honesty.test.ts` | 5 | durée de lecture, sync, épaisseur du corpus |
| `irl-calculator.test.ts` (étendu) | 46 | valeurs INSEE épinglées, ordre, formule |

---

## 10. Ce qui reste à faire, par ordre

**Vague 1 bis** (rapide, fort impact)
1. `/gestion-locative` → vraie page produit.
2. Connecter `/comparatif` et `/outils` à la navigation.
3. Corriger ou retirer `rentready-vs-gerclegeo` / `-immotop` (concurrent
   inexistant — c'est une page qui ment).
4. Réparer `seo-checks/meta-validator.js` et `link-checker.js`, ou les supprimer.

**Vague 2** — outils à forte demande (prorata, restitution de dépôt, loyer
révisé réel, régularisation de charges), auteur identifiable, purge des 30
articles minces.

**Vague 3** — comparatifs honnêtes et datés, données propriétaires.

**Vague 4** — programmatic justifié : uniquement si les pages ville reçoivent
de vraies données locales (loyer m², zone d'encadrement, arrêté préfectoral).
**En l'état, 38 villes sur 50 sont des pages à:name().** C'est exactement
l'antipattern décrit dans le brief — ne pas indexer davantage avant d'avoir
donné des données à celles qui existent.

---

## 11. Ce qui n'a pas été fait, et pourquoi

- **Aucun nouveau contenu publié.** Écrire avant d'avoir consolidé aurait
  ajouté de la cannibalisation, pas du trafic.
- **Aucune statistique inventée.** Le pipeline de données n'existe pas.
- **Aucune page ville ajoutée.** Le problème n'est pas le volume.
- **Aucune mesure de visibilité IA.** Le domaine ne résout pas. Le benchmark
  est écrit et rejouable, mais je ne revendique aucune observation.
- **`public/logo.svg`** est un logo minimal dessiné pour l'occasion. Il rend le
  `logo` de l'Organization valide, mais il ne remplace pas une identité visuelle
  revue.