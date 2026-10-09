# 06 — Stratégie Mots-Clés & Intentions Commerciales

Date : Octobre 2026  
Branche : `audit/seo-growth-engine`  
Statut : **HYPOTHÈSES ÉTAYÉES PAR LE CODE (SEARCH CONSOLE NON CONNECTÉE)**

---

## 1. Alignement Stratégique : « Gérez vos locations sans tableur »

L'acquisition SEO de RentReady ne vise pas le volume de trafic pour le trafic (vanity metrics), mais **l'activation qualifiée de propriétaires bailleurs indépendants** (1 à 10 lots) qui gèrent eux-mêmes leurs biens.

### Le positionnement B.3 appliqué au SEO :
- **L'ennemi n'est pas seulement l'agence immobilière traditionnelle (frais de 7-10 %), c'est le tableur Excel / Google Sheets bricolé**, générateur de stress, d'oubli de quittances et de retard sur les relances.
- **La promesse :** Une gestion calme, un système qui surveille en arrière-plan et ne sollicite le propriétaire que sur l'exception (loyer en retard, révision annuelle IRL à appliquer, fin de préavis).

---

## 2. Les 4 Piliers d'Intention de Recherche

```text
                           INTENTIONS COMMERCIALES
                                      │
     ┌──────────────────┬─────────────┴───────────────┬────────────────────┐
     ▼                  ▼                             ▼                    ▼
[1. Catégorie SaaS] [2. Outils & Fonctionnalités] [3. Comparatifs]   [4. Méthodologie]
"logiciel gestion    "calculateur irl 2026"       "alternative       "gestion locative
locative particulier" "quittance loyer pdf"        Rentila"           sans tableur"
"logiciel quittance" "lettre relance impayé"      "vs BailFacile"    "sans agence"
```

### Pilier 1 : Catégorie SaaS & Solution Métier (High Commercial Intent)
- **Requêtes cibles :**
  - `logiciel gestion locative particulier`
  - `logiciel gestion locative propriétaire`
  - `logiciel quittance de loyer`
  - `suivi loyer propriétaire`
- **Intention :** Le propriétaire a pris conscience des limites de sa gestion manuelle et cherche un outil dédié.
- **Pages cibles :** Homepage B.3 (`/`), `/comparatif/logiciel-gestion-locative`, `/pricing`.

### Pilier 2 : Utilité Immédiate & Fonctionnalités Clés (Product-Led SEO)
- **Requêtes cibles :**
  - `calculateur revision loyer irl 2026`
  - `modele quittance de loyer pdf gratuit`
  - `generateur quittance de loyer`
  - `modele lettre relance loyer impaye`
  - `calculateur regularisation charges locatives`
- **Intention :** Résoudre une tâche administrative ponctuelle et obligatoire imposée par la loi française.
- **Pages cibles :** `/outils/calculateur-irl`, `/outils/modele-quittance-loyer-pdf`, `/outils/generateur-quittance`, `/outils/lettre-relance-loyer`.
- **Passerelle conversion :** Calcul immédiat gratuit sans barrière → Proposition d'automatiser le mois suivant via RentReady.

### Pilier 3 : Concurrence & Alternatives Directes (Bottom-of-Funnel)
- **Requêtes cibles :**
  - `alternative rentila`
  - `alternative bailfacile`
  - `avis rentila gestion locative`
  - `rentready vs legalplace`
- **Intention :** Utilisateurs insatisfaits d'une solution concurrente (trop complexe, trop chère, interface datée, paywall abusif sur les documents).
- **Pages cibles :** `/comparatif/rentready-vs-legalplace`, nouvelles pages comparatives objectives et loyales.

### Pilier 4 : Transition « Zéro Tableur » & Autonomie (Pain Point Search)
- **Requêtes cibles :**
  - `gerer location sans agence`
  - `tableau suivi loyer excel gratuit`
  - `modele excel gestion locative`
- **Intention :** Propriétaires encore sur tableur cherchant un modèle gratuit.
- **Angle d'attaque RentReady :** Fournir le template ou expliquer ses limites dès 2 lots, puis présenter le confort du tableau de bord automatisé.

---

## 3. Matrice d'Intention et Format de SERP Observé

| Requête type | Format SERP dominant (Google France) | Type de contenu RentReady requis | Barrière à l'entrée |
| :--- | :--- | :--- | :--- |
| `logiciel gestion locative particulier` | Comparateurs, annuaires SaaS, pages d'accueil | Page produit claire + Preuve sociale + Tarifs publics | Haute (autorité de domaine) |
| `calculateur irl 2026` | Widgets interactifs, simulateurs Service-Public | Outil JavaScript instantané sans rechargement | Moyenne (besoin de fraîcheur trimestrielle INSEE) |
| `modele quittance de loyer pdf` | Téléchargements directs, générateurs en ligne | Formulaire avec prévisualisation PDF instantanée | Haute (présence de Service-Public & LegalTechs) |
| `alternative rentila` | Articles de blog comparatifs, forums d'investisseurs | Page comparative honnête, grille de fonctionnalités | Faible-Moyenne (requête ultra-ciblée) |
| `lettre relance loyer impaye` | Modèles de courrier type, articles juridiques | Générateur de lettre personnalisée + Rappel des délais loi 89 | Moyenne |

---

## 4. Politique de Non-Cannibalisation

Pour éviter la dispersion de l'autorité entre plusieurs pages traitant du même sujet :
1. **Une URL unique par intention primaire :**
   - L'intention *« calculer la révision IRL »* appartient exclusivement à [`/outils/calculateur-irl`](file:///home/ubuntu/rent-ready/src/app/(marketing)/outils/calculateur-irl/page.tsx). Les articles de blog traitant de l'IRL doivent tous pointer vers cette URL canonique et ne pas dupliquer le formulaire de calcul.
   - L'intention *« modèle de quittance »* est centralisée sur [`/outils/modele-quittance-loyer-pdf`](file:///home/ubuntu/rent-ready/src/app/(marketing)/outils/modele-quittance-loyer-pdf/page.tsx).
2. **Consolidation des pages villes d'outils :**
   - Éviter absolument de créer des pages programmatiques d'outils du type `/calculateur-irl/paris` ou `/generateur-quittance/lyon` qui dilueraient la puissance des outils nationaux sans aucune pertinence locale.
