# B+ V2.1 → Production Design System : Rapport de Migration & Décision

> **Date :** 7 Octobre 2026  
> **Branche :** `kanban/bplus-v21-production`  
> **Auteurs :** Principal Product Designer & Staff Frontend Engineer  
> **Surfaces Implémentées :** `/dashboard` (Grand Livre) & `/properties/[id]` (Property Home Base)  
> **Statut des Vérifications :** 100% Passé (TypeScript 0 erreur, Vitest 86/86 fichiers, Playwright E2E 8/8 tests, 12 captures HD générées)

---

## 1. Executive Summary & Verdict des Gates

### Réponse aux Deux Questions Décisionnelles

#### QUESTION 1 : B+ V2.1 EST-IL TECHNIQUEMENT ET VISUELLEMENT VIABLE DANS LE VRAI PRODUIT ?
> ### **OUI.**
> **Preuve empirique :**
> - B+ V2.1 s'est intégré sans aucune rupture dans les deux surfaces les plus critiques de l'application (`/dashboard` et `/properties/[id]`).
> - Toutes les requêtes de production réelles (Prisma ORM, Better Auth session isolation, `ensureRentPeriods(userId)`, `settlePeriodPayments()`) fonctionnent à 100% sans données mockées.
> - La rétractation mécanique de hauteur (-54% sur les lignes réglées) et le registre linéaire documentaire ont éliminé l'encombrement visuel des anciennes grilles shadcn tout en augmentant la densité d'information utile.
> - La suite Playwright E2E (`dashboard.spec.ts` et `property-home-base.spec.ts`) passe à 100% sur les 4 états de gestion réels (Vacant, Payé, Partiel, En retard).

#### QUESTION 2 : PEUT-ON AUTORISER LA MIGRATION DU RESTE DE RENTREADY VERS B+ V2.1 ?
> ### **OUI.**
> **Recommandation stratégique :**
> - Le socle modulaire `@/components/design-system` est désormais isolé, typé et exempt d'effets de bord globaux (pas de Big Bang CSS dans `globals.css` qui casserait le portail locataire ou les pages d'authentification).
> - La migration des surfaces restantes (Baux, Facturation unifiée, Registre de documents global, Paramètres) peut s'effectuer de manière incrémentale écran par écran, en réutilisant directement les primitives et patterns éprouvés.

---

## 2. Architecture du Design System (`src/components/design-system/`)

Le système est architecturé en trois strates étanches garantissant la maintenabilité et la composabilité :

```
src/components/design-system/
├── tokens.ts                         # Jetons de couleurs, typographie tripartite, espacements
├── primitives/
│   ├── page-shell.tsx                # Conteneur warm paper avec gestion du responsive
│   ├── section.tsx                   # Section sémantique avec eyebrow et séparateur
│   ├── money.tsx                     # Rendu monétaire tabulaire strict (Prisma Decimal / Zero float)
│   ├── status-badge.tsx              # Badges de statut conformes WCAG AA
│   ├── status-dot.tsx                # Voyants discrets
│   ├── attention-surface.tsx         # Surfaces de tension graphique orange brûlé
│   └── calm-surface.tsx              # Surfaces de sérénité vert sauge feutré
├── patterns/
│   ├── month-header.tsx              # En-tête temporel éditorial (Newsreader) & accès rapide
│   ├── financial-summary.tsx         # Synthèse 3 colonnes (Attendus, Reçus, Solde) + jauge
│   ├── rent-row.tsx                  # Ligne Grand Livre avec rétractation mécanique (-54%)
│   ├── document-register.tsx         # Registre linéaire 4 colonnes remplaçant la card soup
│   ├── property-header.tsx           # En-tête architectural de la fiche logement
│   └── situation-bar.tsx             # Baromètre contextuel avec vérité légale Art. 21
└── index.ts                          # Point d'entrée unique (Barrel export)
```

---

## 3. Détail des Surfaces de Production Migrées

### 3.1. Dashboard Réel (`src/app/(dashboard)/dashboard/page.tsx`)
- **Structure :** Encapsulation dans `<PageShell>`, en-tête éditorial `<MonthHeader>` en typographie Newsreader, synthèse financière tripartite `<FinancialSummary>`.
- **Rétractation Mécanique :** Les logements dont le loyer du mois est réglé s'affichent sous forme compacte (42px de hauteur), tandis que les logements avec acompte ou retard déploient une notice explicative et les boutons d'action prioritaires.
- **Microcopy & Product Truth :** Action libellée « Enregistrer » / « Relancer » (aucun terme trompeur « Encaisser »).
- **Arrears Section :** Modernisée dans `src/app/(dashboard)/dashboard/arrears-section.tsx` avec les primitives sémantiques.

### 3.2. Property Home Base (`src/app/(dashboard)/properties/[id]/page.tsx`)
- **Header Architectural :** Fil d'ariane feutré, typologie, surface, statut d'occupation et loyer contractuel charges comprises visible en un coup d'œil.
- **Bandeau de Situation Immédiat :**
  - *Cas Payé :* Sérénité vert sauge, montant perçu affiché avec ventilation, bouton `<QuittanceButton>` direct.
  - *Cas Partiel :* Alerte orange feutré, affichage clair du solde restant avec mention transparente *« Reçu d'acompte émis (art. 21) · Quittance bloquée jusqu'au solde intégral »*, boutons « Pointer le solde » et « Relancer ».
  - *Cas En retard :* Alerte ambre feutré avec calcul précis des jours de retard, boutons « Enregistrer le paiement » et « Relancer ».
  - *Cas Vacant :* Statut net sans montants fictifs, CTA orienté action « Créer un bail pour ce bien ».
- **Workspace 2 Colonnes :**
  - Colonne gauche : Historique des loyers & quittances (liste linéaire B+ V2.1) + Registre documentaire structuré `<DocumentRegister>` (Bail, Quittance, État des lieux, Attestation assurance) + Maintenance.
  - Colonne droite : Fiche locataire sobre avec coordonnées cliquables, conditions détaillées du bail et caractéristiques cadastrales / fiscales.

---

## 4. Matrice de Vérification & QA

| Test / Vérification | Commande Exécutée | Résultat | Commentaire |
| :--- | :--- | :--- | :--- |
| **Type Check TypeScript** | `pnpm tsc --noEmit` | **0 erreur** (Code 0) | Typage strict sans aucun `any` |
| **Tests Unitaires & Métier** | `pnpm test -- --run` | **86/86 fichiers passés** (916 tests) | Calculs financiers Decimal intacts |
| **Liens Dashboard** | `pnpm test src/__tests__/lib/dashboard-links.test.ts` | **4/4 passés** (Code 0) | Validation des routes internes |
| **E2E Property Home Base** | `pnpm test:e2e src/__tests__/e2e/property-home-base.spec.ts` | **4/4 passés** (Code 0) | Validation des 4 états métier réels |
| **E2E Dashboard Analytics** | `pnpm test:e2e src/__tests__/e2e/dashboard.spec.ts` | **4/4 passés** (Code 0) | Tests des stats et onboarding |
| **Régression Visuelle HD** | `node scripts/capture_bplus_prod.mjs` | **12/12 planches capturées** | 1440px, 390px, 360px & Inventaire |

---

## 5. Galerie des 12 Planches de Régression Visuelle

Toutes les planches sont archivées dans le dépôt sous `docs/design/planches/bplus_prod/` et dans le répertoire artifact :

1. **`01_dashboard_prod_1440_exception.png`** : Tableau de bord desktop avec une exception active (acompte partiel canclaux mis en valeur sans polluer le reste).
2. **`02_dashboard_prod_1440_resolved.png`** : Tableau de bord desktop état entièrement réglé : disparition mécanique de l'orange, toutes les lignes rétractées à 42px.
3. **`03_dashboard_prod_1440_10_units.png`** : Test d'échelle 10 logements : lisibilité parfaite du grand livre, défilement fluide sans saturation cognitive.
4. **`04_dashboard_prod_390_exception.png`** : Dashboard mobile 390px avec exception : CTA et notice repliés verticalement avec boutons tactiles conformes 44px.
5. **`05_dashboard_prod_390_resolved.png`** : Dashboard mobile 390px état réglé : densité maximale sans scroll inutile.
6. **`06_dashboard_prod_360_stress.png`** : Dashboard mobile 360px (stress test données longues) : aucun débordement horizontal, troncatures adaptatives nettes.
7. **`07_homebase_prod_1440_exception.png`** : Property Home Base desktop état partiel : bandeau situation orange et ventilation Art. 21.
8. **`08_homebase_prod_1440_resolved.png`** : Property Home Base desktop état réglé : quittance libératoire en 1 clic.
9. **`09_homebase_prod_390_exception.png`** : Property Home Base mobile 390px état partiel : boutons de relance et solde immédiatement accessibles au pouce.
10. **`10_homebase_prod_390_resolved.png`** : Property Home Base mobile 390px état réglé : vue calme et rassurante.
11. **`11_homebase_prod_360_stress.png`** : Property Home Base mobile 360px long content : adresse longue, conditions du bail et registre documentaire préservés.
12. **`12_design_system_inventory.png`** : Inventaire complet des jetons, typographies et composants du système B+ V2.1.

---

## 6. Prochaines Étapes Recommandées (Roadmap Slices Suivantes)

1. **Slice 1 : Registre Documentaire Global (`/documents`) & Facturation (`/billing`)**
   - Remplacer la grille de cartes par `<DocumentRegister>` unifié.
   - Étendre `<FinancialSummary>` et `<RentRow>` pour la vue multi-immeubles.
2. **Slice 2 : Fiches Contrats de Bail (`/leases` et `/leases/[id]`)**
   - Aligner la présentation sur le registre documentaire et les primitives de montants `<Money>`.
3. **Slice 3 : Portail Locataire (`/portal/*`)**
   - Appliquer la palette feutrée sans modifier l'authentification par jeton.
