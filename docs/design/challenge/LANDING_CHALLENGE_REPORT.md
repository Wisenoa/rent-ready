# LOKNA — PREMIUM LANDING PAGE DESIGN CHALLENGE
## Rapport de conception & implémentation frontend

**Route :** `/gestion-locative`  
**Produit :** Lokna — Logiciel français de gestion locative pour propriétaires bailleurs indépendants (1 à 10 logements)  
**Date :** Octobre 2026  
**Auteur :** Agent Frontend (Challenge Indépendant)

---

## 1. Résumé Exécutif & Vision

La page originale `/gestion-locative` souffrait d'un décalage majeur entre la promesse du produit Lokna et son incarnation visuelle :
- **Avant :** Une page d'aspect textuel et austère (style annuaire SEO de 2012), boutons bleus déconnectés de la charte, aucune image, zéro démonstration du logiciel, et un dump vertical de 50 villes cassant le rythme de conversion.
- **Après :** Une landing page SaaS premium d'inspiration **French Atelier / Quiet Luxury**, mariant la chaleur architecturale d'intérieurs haussmanniens et de façades en pierre de taille avec la rigueur d'une interface produit moderne.

---

## 2. Direction Artistique & Identité Visuelle

### Palette de Couleurs & Tokens
Conformément à la charte et à l'âme de Lokna :
- **Fond principal :** Blanc lin chaud / crème architectural (`#FAF9F5`, `#FAF8F5`).
- **Vert Forêt signature :** `#1E3A2F` et `#15241F` pour les boutons primaires, la typographie principale et la carte finale.
- **Vert Sauge & accents botaniques :** `#7FA68E`, `#3D5A4C`, `#E8EFEA` pour les puces de statut, badges de validation et halos lumineux d'ambiance.
- **Ambre de situation :** `#D97706` réservé exclusivement aux exceptions financières (acomptes partiels, retards) pour attirer l'œil sans anxiété.
- **Bordures & séparations :** Filets doux ton sur ton (`#E5E2DA`, `#D5D0C5`) remplaçant les anciens traits noirs lourds.

### Typographie & Rythme
- **Titres (H1, H2, H3) :** Sans-serif (`Inter`) aux proportions généreuses et serrées (`tracking-tight`), lisibilité immédiate, suppression des faux surtitres en capitales espacées.
- **Chiffres financiers :** Chiffres tabulaires stricts (`tabular-nums font-semibold`) pour les montants des loyers et des soldes.

---

## 3. Assets Créés & Génération d'Images

Trois visuels originaux haute fidélité ont été conçus, générés par IA via le brief artistique, convertis au format WebP optimisé pour le web (poids total < 400 Ko pour les 3 visuels) :

| Visuel | Rôle dans la page | Résolution & Format | Poids optimisé |
| :--- | :--- | :--- | :--- |
| **`hero-lifestyle.webp`** | **Hero visual** : Intérieur parisien lumineux, parquet point de Hongrie, bureau en chêne et travertin avec ordinateur portable affichant Lokna, olivier en pot. Associé à une carte UI flottante de la situation d'octobre. | 1376 × 768 (WebP) | **110 Ko** (au lieu de 775 Ko en JPG) |
| **`quittance-cycle.webp`** | **Boucle d'or (Étape 6)** : Composition tactile éditoriale sur table en travertin : quittance de loyer conforme à la loi de 1989, trousseau de clés avec porte-clé en cuir vert forêt « 04 », stylo plume. | 1200 × 896 (WebP) | **95 Ko** (au lieu de 760 Ko en JPG) |
| **`patrimoine-facade.webp`** | **Patrimoine & Sérénité** : Façade d'immeuble résidentiel classique en pierre de taille, volets vert forêt, balcons en fer forgé fleuris, toiture mansardée en zinc sous le soleil du matin. | 1376 × 768 (WebP) | **189 Ko** (au lieu de 928 Ko en JPG) |

---

## 4. Architecture de la Page & Parcours Narratif

La page est structurée en 11 sections complémentaires guidant le visiteur du doute initial à la conviction :

1. **`GestionHero`**
   - H1 : « La gestion locative sans tableur, sans stress, sans paperasse. »
   - Double CTA : « Essayer gratuitement 14 jours » + « Voir la simulation en direct »
   - Rassurance immédiate : Dès 9 €/mois, sans carte bancaire, conforme loi de 1989.
   - Composition visuelle : Photo d'intérieur haussmannien + widget flottant du tableau de bord d'octobre.
2. **`GestionTrustBar`**
   - 4 piliers juridiques et techniques : Loi du 6 juillet 1989, Indice INSEE IRL 2026, Plafonnement du dépôt de garantie, Hébergement sécurisé en France.
3. **`GestionGoldenPath`**
   - Explication pas à pas de la boucle d'or : Logement → Locataire → Bail → Loyer attendu → Paiement → Quittance.
   - Mise en valeur avec le visuel `quittance-cycle.webp`.
4. **`GestionInteractiveDemo`**
   - Démonstration interactive du logiciel (`HomeDemo`), permettant au visiteur de cliquer sur « Régulariser l'acompte » ou « Relancer le locataire » en direct sans créer de compte.
5. **`GestionComparison`**
   - Tableau comparatif rigoureux : *Tableur Excel / Sheets* vs *Agence immobilière (7-10%)* vs *Lokna (dès 9 €/mois)*.
6. **`GestionPatrimoine`**
   - Section patrimoniale valorisant les biens du propriétaire avec le visuel architectural `patrimoine-facade.webp`.
7. **`GestionFeaturesGrid`**
   - Grille asymétrique des 8 fonctionnalités indispensables au bailleur indépendant avec badges de catégorie.
8. **`GestionCityExplorer`**
   - Remplacement du long listing vertical des 50 villes par un explorateur interactif avec recherche instantanée et filtres régionaux, préservant 100% du maillage interne SEO (`/gestion-locative/[ville]`).
9. **`GestionPricingSection`**
   - Grille tarifaire transparente basée sur les constantes de `entity.ts` : Starter (9 €/mois) et Pro (15 €/mois).
10. **`GestionFaqSection`**
    - Accordéon accessible répondant aux 6 questions canoniques des bailleurs, avec balisage `FAQPage` Schema.org.
11. **`GestionFinalCta`**
    - Carte d'engagement finale en vert forêt profond avec halo d'ambiance et accès direct à `/register`.

---

## 5. Copywriting & Optimisation de Conversion

### Principales évolutions du copywriting :
- **H1 percutant :** Passage de « Gérer ses locations sans tableur ni dossiers de PDF » à « La gestion locative sans tableur, sans stress, sans paperasse. » (gain de clarté, d'émotion et de force narrative).
- **Principe du silence :** Affirmation de la philosophie Lokna : *« Tout ce qui est en règle reste silencieux. Vous n'intervenez que si une action est requise. »*
- **Rassurance légale :** Remplacement des promesses floues par les mentions légales exactes de l'article 21 de la loi du 6 juillet 1989 et de l'article 17-1 pour la révision INSEE IRL.
- **Distinction Quittance vs Reçu partiel :** Rappel explicite qu'un acompte ne déclenche jamais une quittance pleine, protégeant le bailleur contre un vice juridique.

---

## 6. Préservation SEO & Données Structurées

- **URL canonique :** Préservée à l'identique (`/gestion-locative`).
- **Métadonnées :** Titre et description soignés via `baseMetadata`.
- **Données structurées Schema.org :**
  - `SoftwareApplication` avec offres tarifaires dynamiques (`paidOffer()`) et liste des fonctionnalités.
  - `BreadcrumbList` conforme.
  - `FAQPage` enrichi avec les questions/réponses pour l'éligibilité aux résultats enrichis Google (Rich Snippets).
- **Maillage interne :** Les 50 URLs locales `/gestion-locative/[ville]` restent toutes indexables et explorables.

---

## 7. Responsive & Ergonomie Mobile

Tests validés sur :
- **Mobile compact (360px & 390px) :** Typographie ajustée, boutons pleine largeur tactiles, suppression de tout débordement horizontal, ordre de lecture adapté.
- **Tablette (768px) :** Grilles adaptatives 2 colonnes pour les étapes et les fonctionnalités.
- **Desktop (1440px) :** Composition équilibrée sur 12 colonnes, alignement harmonieux du texte et des visuels.

---

## 8. Résultats des Tests & Vérifications

### Tests exécutés :
1. **TypeScript (`pnpm exec tsc --noEmit`) :** 0 erreur.
2. **ESLint (`pnpm exec eslint ...`) :** 0 erreur, 0 avertissement.
3. **Vitest (`pnpm vitest run`) :** 91/91 fichiers de tests passés, 1 117 tests réussis.
4. **Next.js Production Build (`pnpm build`) :** Compilation et génération statique réussies sans erreur.
5. **Playwright E2E (`pnpm exec playwright test ...`) :** 
   - Vérification du code HTTP 200.
   - Validation des métadonnées SEO et canonical.
   - Validation du balisage Schema.org (`SoftwareApplication` et `FAQPage`).
   - Vérification de la présence et du chargement des 3 images générées avec attributs `alt`.
   - Test d'interactivité du widget de démonstration (clic sur « Régulariser » mettant à jour la jauge à 100%).
   - Test de recherche dans l'explorateur des 50 villes.
   - Test d'expansion de l'accordéon FAQ.

### Captures générées :
- `docs/design/challenge/screenshots/before-desktop.png` & `before-desktop-full.png`
- `docs/design/challenge/screenshots/before-mobile.png` & `before-mobile-full.png`
- `docs/design/challenge/screenshots/after-desktop.png` & `after-desktop-full.png`
- `docs/design/challenge/screenshots/after-mobile.png` & `after-mobile-full.png`

---

## 9. Fichiers Modifiés & Créés

### Fichiers modifiés :
- `src/app/(marketing)/gestion-locative/page.tsx`
- `src/data/routes.ts`

### Fichiers créés :
- `src/components/marketing/gestion-locative/GestionHero.tsx`
- `src/components/marketing/gestion-locative/GestionTrustBar.tsx`
- `src/components/marketing/gestion-locative/GestionGoldenPath.tsx`
- `src/components/marketing/gestion-locative/GestionInteractiveDemo.tsx`
- `src/components/marketing/gestion-locative/GestionComparison.tsx`
- `src/components/marketing/gestion-locative/GestionPatrimoine.tsx`
- `src/components/marketing/gestion-locative/GestionFeaturesGrid.tsx`
- `src/components/marketing/gestion-locative/GestionCityExplorer.tsx`
- `src/components/marketing/gestion-locative/GestionPricingSection.tsx`
- `src/components/marketing/gestion-locative/GestionFaqSection.tsx`
- `src/components/marketing/gestion-locative/GestionFinalCta.tsx`
- `src/components/marketing/gestion-locative/faq-data.ts`
- `src/components/marketing/gestion-locative/index.ts`
- `public/images/challenge/hero-lifestyle.webp` (+ `.jpg`)
- `public/images/challenge/quittance-cycle.webp` (+ `.jpg`)
- `public/images/challenge/patrimoine-facade.webp` (+ `.jpg`)
- `src/__tests__/e2e/gestion-locative-landing.spec.ts`
- `scripts/take-screenshot.mjs`
- `docs/design/challenge/LANDING_CHALLENGE_REPORT.md`

---

## 10. Limites & Recommandations Futures

- **Animations au scroll :** Possibilité d'ajouter des micro-transitions Framer Motion légères sur l'apparition des étapes au scroll pour les utilisateurs n'ayant pas activé `prefers-reduced-motion`.
- **A/B Testing :** Tester la performance respective du CTA principal « Essayer gratuitement 14 jours » vs « Créer mon premier bien ».
- **Capture dynamique de ville :** Dans les pages enfants `/gestion-locative/[ville]`, réutiliser ces nouveaux composants pour remplacer les modèles génériques.
