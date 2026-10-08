# RentReady B.3 — Métriques & Diff Visuel B.2 vs B.3

## 1. Tableau Comparatif des Métriques Mesurées

Toutes les métriques ci-dessous ont été mesurées programmatiquement via Playwright sur Chromium (Chromium headless, deviceScaleFactor: 2) sur les deux routes isolées `/design-preview/b2` et `/design-preview/b3`.

| Métrique | B.2 (Baseline C) | B.3 (Édition Finale) | Évolution | Statut |
| :--- | :--- | :--- | :--- | :--- |
| **Nombre de mots (Word count)** | **888 mots** | **686 mots** | **-22,7 %** | `[MEASURED]` |
| **Conteneurs / Cards majeures** | **11 conteneurs** | **3 conteneurs** | **-72,7 %** | `[MEASURED]` |
| **Hauteur Hero Desktop (1440px)** | **891 px** | **732 px** | **-17,8 %** | `[MEASURED]` |
| **Y du 1er composant produit (Mobile 390px)** | **508 px** | **349 px** | **-31,3 %** | `[MEASURED]` |
| **Hauteur totale page Mobile (390px)** | **6 185 px** | **5 102 px** | **-17,5 %** | `[MEASURED]` |
| **Hauteur totale page Desktop (1440px)** | **4 282 px** | **3 933 px** | **-8,1 %** | `[MEASURED]` |

---

## 2. Analyse Détaillée des Différences

### 2.1 Densité & « Card Soup » (-73%)
- **B.2 :** 4 grandes cartes piliers (`FourPillarsSection`), 3 cartes grises juridiques (`LegalTrustSection`), 2 cartes d'outils (`FreeToolsSection`), 2 cartes tarifaires (`PricingSection`). L'œil du visiteur sautait de boîte en boîte sans respiration continue.
- **B.3 :** Disparition de la quasi-totalité des conteneurs fermés au profit de rythmes éditoriaux avec filets séparateurs (`border-[#E5E2DA]`), de trois moments produit immersifs alternés (Texte / Preuve produit) et d'un tableau juridique à 3 colonnes ouvertes. Seules subsistent les 2 cartes nécessaires à la comparaison des offres d'abonnement et le bloc de démonstration interactif.

### 2.2 Immersion Mobile & Viewport
- **B.2 (390px) :** Le titre sur 3 lignes longues + sous-titre verbeux + microcopy + boutons multiples repoussaient le début de la démo produit à Y=508px. L'utilisateur devait scroller pour commencer à voir l'interface.
- **B.3 (390px) :** H1 ramassé en 2 lignes courtes (33 caractères), 1 seul CTA compact, micro-proof en 1 ligne. La démo produit démarre dès **Y=349px** (et Y=298px hors toolbar), apparaissant immédiatement dans la zone d'impact visuel de l'écran mobile 390×844 et 360×800.

### 2.3 Rigueur Éditoriale & Élagage de la Copy (-23%)
- Suppression systématique du verbiage conceptuel (*« Agissez uniquement sur l'exception »*, *« intendance »*, *« sérénité »*).
- Formulations courtes, ancrées dans le quotidien du bailleur : encaissement au 5 du mois, conformité du reçu d'acompte, date anniversaire de l'IRL.
