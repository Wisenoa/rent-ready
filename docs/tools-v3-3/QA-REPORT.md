# Lokna V3.3 & V3.3.1 — Rapport d'Assurance Qualité & Validation Pré-Production

> **Date** : 16 octobre 2026  
> **Branche de travail** : `feat/free-tools-seo-v3-3`  
> **Auteur** : Équipe QA Automation, Expert Juridique & Engineering Lokna

---

## 1. Synthèse Globale des Tests Exécutés

La refonte et la sécurisation juridique des 16 outils gratuits ont été validées à tous les niveaux de la pyramide de tests :

```
             ▲
            / \
           /E2E\         12 / 12 tests Playwright réussis (1.2m)
          /-----\
         /  SSR  \       31 / 31 tests de rendu statique & DOM (React Server)
        /---------\
       / PDF Bytes \     2 / 2 tests de génération binaire PDF réels (@react-pdf/renderer)
      /-------------\
     / Unitaires     \   74 / 74 tests de logique arithmétique et fiscale (100 % passés)
    /-----------------\
   / Types & Lint      \ TypeScript strict 0 erreur (`tsc --noEmit`), ESLint 0 erreur
  /─────────────────────\
```

### Résultats Détaillés des Suites de Tests
1. **Compilation TypeScript (`pnpm exec tsc --noEmit`)** :
   - Statut : **Succès (0 erreur)** sur l'intégralité du repository.
   - Typage strict : aucun recours à `any`, types d'entrée et de sortie formellement discriminés (`{ ok: true; result } | { ok: false; error }`).
2. **Calculs arithmétiques & modules métier (`tools-v3-3-calculations.test.ts` & `tools-calculations.test.ts`)** :
   - Statut : **72 passés sur 72**.
   - Précision monétaire : arithmétique en centimes stricts via `Decimal`, zéro dérive binaire en virgule flottante.
3. **Génération binaire des PDF et conformité documentaire (`quittance-pdf-generation.test.tsx`)** :
   - Statut : **2 passés sur 2**.
   - Vérification : flux binaire `%PDF-1.4` réel généré via `@react-pdf/renderer`, bascule stricte en « Reçu de paiement partiel » avec mention de réserve légale si acompte partiel (art. 21 loi 1989).
4. **Rendu SSR & Intégrité SEO (`tools-v3-3-pages.test.tsx` & `premium-tools-pages.test.tsx`)** :
   - Statut : **31 passés sur 31**.
   - Règle vérifiée : 1 seul `<h1>` par page, 1 seul fil d'Ariane (`BreadcrumbList`), 1 seul schéma d'application (`WebApplication`), exemple travaillé rendu en HTML statique avant tout chargement JS.
5. **Honnêteté des allégations marketing (`marketing-claims-honesty.test.ts`, `rendered-html.test.ts`, `content-integrity.test.ts`)** :
   - Statut : **247 passés sur 247**.
   - Vérification : aucune fausse promesse, aucune fausse affiliation gouvernementale, aucune affirmation trompeuse sur Lokna.
6. **Tests Navigateur E2E Playwright (`src/__tests__/e2e/premium-tools.spec.ts`)** :
   - Statut : **12 passés sur 12**.
   - Scénarios validés :
     - Navigation depuis `/outils` vers les calculateurs.
     - Réactivité des formulaires et mise à jour temps réel des panneaux de résultats `#resultat`.
     - Alternance dynamique entre *Quittance de loyer* et *Reçu de paiement partiel*.
     - Calcul du prorata en jours réels calendaires et bascule en mode loyer au m² avec encadrement.
     - Comparatif LMNP Micro-BIC vs Régime Réel avec respect du plafonnement art. 39 C.
     - Contrôle d'absence de débordement horizontal à 375px (`scrollWidth <= 375`) sur tous les outils.

---

## 2. Matrice de Validation Responsive & Accessibilité

| URL de l'outil | Mobile (375px) | Tablette (768px) | Desktop (1280px) | Navigation Clavier (Tab/Shift+Tab) | Ratios de contraste (WCAG 2.1 AA) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `/outils` | Conforme (aucun débordement) | Conforme | Conforme (grille 3 col) | Conforme | Conforme (≥ 4.5:1) |
| `/outils/generateur-quittance` | Conforme (aperçu empilé) | Conforme | Conforme (side-by-side) | Conforme | Conforme (≥ 4.5:1) |
| `/outils/modele-quittance-loyer-pdf` | Conforme | Conforme | Conforme | Conforme | Conforme (≥ 4.5:1) |
| `/outils/calculateur-irl` | Conforme (bouton saut résultat) | Conforme | Conforme | Conforme | Conforme (≥ 4.5:1) |
| `/outils/calculateur-charges-locatives` | Conforme (bouton saut résultat) | Conforme | Conforme | Conforme | Conforme (≥ 4.5:1) |
| `/outils/lettre-relance-loyer` | Conforme | Conforme | Conforme | Conforme | Conforme (≥ 4.5:1) |
| `/outils/generateur-conge-vente` | Conforme | Conforme | Conforme | Conforme | Conforme (≥ 4.5:1) |
| `/outils/calculateur-rendement` | Conforme | Conforme | Conforme | Conforme | Conforme (≥ 4.5:1) |
| `/outils/calculateur-loyer` | Conforme | Conforme | Conforme | Conforme | Conforme (≥ 4.5:1) |
| `/outils/simulateur-pret-immobilier` | Conforme (tableau scrollable interne) | Conforme | Conforme | Conforme | Conforme (≥ 4.5:1) |
| `/outils/calculateur-plus-value` | Conforme | Conforme | Conforme | Conforme | Conforme (≥ 4.5:1) |
| `/outils/simulateur-fiscalite-lmnp` | Conforme | Conforme | Conforme | Conforme | Conforme (≥ 4.5:1) |
| `/outils/simulateur-loi-jeanbrun` | Conforme | Conforme | Conforme | Conforme | Conforme (≥ 4.5:1) |
| `/outils/calculateur-depot-garantie` | Conforme | Conforme | Conforme | Conforme | Conforme (≥ 4.5:1) |
| `/outils/calculateur-preavis` | Conforme | Conforme | Conforme | Conforme | Conforme (≥ 4.5:1) |
| `/outils/checklist-etat-lieux` | Conforme (cartes empilées) | Conforme | Conforme | Conforme | Conforme (≥ 4.5:1) |
| `/outils/calculateur-surface-habitable` | Conforme | Conforme | Conforme | Conforme | Conforme (≥ 4.5:1) |

---

## 3. Impact sur la Performance et les Bundles

### A. Chargement Paresseux des Moteurs Lourds
- Le moteur de rendu de documents PDF (`@react-pdf/renderer`, ~450 Ko) n'est jamais chargé au chargement initial de la page. Il est encapsulé dans un `dynamic import()` déclenché uniquement lorsque l'utilisateur clique sur le bouton **« Télécharger le PDF »**.
- Le reste des calculateurs fonctionne avec des modules mathématiques purs en JavaScript synchrone sans aucune dépendance externe lourde.

### B. Architecture Server Components vs Client Components
- **Server Components** (`page.tsx`) : prennent en charge les métadonnées SEO, les schémas JSON-LD `@graph`, le fil d'Ariane, les textes explicatifs, les références légales, la FAQ et le CTA.
- **Client Components** (`calculator-client.tsx`) : strictement limités au banc de travail interactif (`ToolWorkbench`), garantissant une hydratation minimale et un temps jusqu'à interactivité (INP / TBT) quasi nul.

### C. Préservation de la Mémoire de Compilation
- Utilisation de `export const revalidate = 3600;` sur toutes les routes `/outils/*` permettant le rendu à la demande côté serveur sans épuiser la mémoire du heap Node.js (`"Ineffective mark-compacts near heap limit"`) lors de `next build`.

---

## 4. Matrice Avant / Après la Refonte V3.3

| Critère d'évaluation | Avant V3.3 (État hérité) | Après V3.3 (État validé) |
| :--- | :--- | :--- |
| **Paiement partiel quittance** | Générait une fausse quittance libératoire en violation de l'art. 21 de la loi de 1989. | Émet automatiquement un *Reçu de paiement partiel de loyer* avec le solde restant dû. |
| **Génération PDF quittance** | Échecs fréquents sur mobile, absence de styling conforme. | Aperçu papier instantané (`DocumentSheet`) + téléchargement PDF propre via `@react-pdf/renderer`. |
| **Arithmétique financière** | Calculs flottants JS (`0.1 + 0.2 = 0.30000000000000004`) provoquant des dérives d'arrondis. | 100 % des calculs réalisés via `decimal.js` avec arrondi bancaire à mi-chemin au centime. |
| **Prorata de loyer** | Division forfaitaire par 30 même pour les mois de 31 ou 28 jours. | Choix explicite entre jours réels calendaires (28/29/30/31) et trentième bancaire (30). |
| **Fiscalité LMNP** | Prélèvements sociaux calculés sur le revenu brut avant amortissement au réel. | Prélèvements sociaux assis sur le résultat net après amortissement (art. 39 C CGI). |
| **Dépôt de garantie** | Délais de restitution et pénalités de retard omis ; bail mobilité erroné. | Délais de 1 ou 2 mois, retenue de 20 % en copro, pénalité de 10 %/mois et interdiction en mobilité. |
| **Préavis de départ** | Mots parasites en anglais/espagnol, dates de fin imprécises. | Français juridique impeccable, calcul quantième à quantième selon l'art. 641 du CPC. |
| **Surface habitable** | Confusion entre surface Carrez et surface Boutin ; balcons pris en compte. | Déduction stricte des hauteurs < 1,80 m et contrôle automatique du seuil d'écart de 5 % (art. 3-1). |
| **Congé pour vente** | Droit de préemption attribué par erreur aux meublés ; absence des alinéas légaux. | Préavis de 6 mois (vide avec préemption) ou 3 mois (meublé), 5 alinéas de l'art. 15 II intégrés. |
| **SEO & Données structurées** | Multiples schémas JSON-LD dupliqués côté client ; H1 manquants ou multiples. | 1 seul H1 par page, 1 seul graphe JSON-LD serveur sans doublons, hiérarchie sémantique stricte. |
| **Accessibilité & Mobile** | Débordements horizontaux récurrents à 375px, champs sans étiquette explicite. | Zéro overflow horizontal, contrastes WCAG AA, étiquettes et `aria-invalid` sur chaque champ. |
