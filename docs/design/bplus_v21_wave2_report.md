# RentReady B+ V2.1 — Production Migration Wave 2 Report
**Périmètre :** Billing (`/billing`) · Leases (`/leases`, `/leases/[id]`, `/leases/new`) · Documents & Pièces Justificatives

---

## 1. Executive Summary & Verdict

| Question / Gate | Décision | Justification |
| :--- | :---: | :--- |
| **Question Centrale de Design** : *« Est-ce que B+ V2.1 ressemble à RentReady quand l’utilisateur travaille activement ? »* | **VALIDÉ (OUI)** | Les formulaires et tableaux financiers conservent l'identité éditoriale haut de gamme sans dériver ni vers la "soupe de cartes" SaaS générique, ni vers le "formulaire administratif Cerfa". L'asymétrie, les séparateurs sobres `#151413/10`, les typographies tabulaires monospace et les synthèses de trésorerie ancrent un logiciel calme, dense et précis. |
| **Gate A : Form Language Ready ?** | **SHIP** | Le pattern `FormField` unifié, les calculs dynamiques de loyer avec arithmétique `Decimal` stricte, la vérification légale en direct du plafond de dépôt de garantie (Loi 1989), et l'état d'erreur contextuel à 360px résistent sans perte de repère ni tronquage. |
| **Gate B : Financial Workspace Ready ?** | **SHIP** | Le Grand Livre des Encaissements (`/billing`) affiche la triade canonique Attendus / Reçus / Solde à percevoir avec une hiérarchie irréprochable. En cas d'acompte partiel, la ligne signale l'exception avec précision sans alarme hystérique. |
| **Gate C : Document System Ready ?** | **N/A (INTÉGRÉ)** | Aucune route autonome `/documents` n'existe dans le schéma de routes de l'application. Les pièces justificatives (quittances d'acompte et quittances de solde Art. 21 loi 89) sont directement émises, téléchargées et historisées depuis les écritures réelles du grand livre (`/billing`) et du registre des propriétés (`/properties/[id]`). Aucun mock de document. |
| **Gate D : Product-Wide Migration Ready ?** | **SHIP** | Les composants fondamentaux sont découplés, les types TypeScript sont stricts (0 `any`), la suite de tests est à 100% au vert (87 test suites, 928 tests passés), et les parcours critiques E2E Playwright passent avec succès. |

---

## 2. Démonstration des Surfaces Migrées

### 2.1 Billing — Le Grand Livre des Encaissements (`/billing`)
* **Problème initial :** Page dispersée, cartes flottantes sans filiation comptable, manque de distinction visuelle entre règlement total et acompte partiel.
* **Architecture B+ V2.1 :**
  - **Triade Fondamentale :** Synthèse mensuelle instantanée calculée via `decimal.js` (Attendus : 2 850,00 € | Reçus : 2 400,00 € | Solde restant : 450,00 €).
  - **Exception Silencieuse :** Bannière d'attention `AttentionSurface` sobre n'apparaissant que si un solde est impayé ou si un acompte a été perçu (Studio Nantes, 400 € / 850 €).
  - **Grand Livre Tabulaire :** Tableau architectural desktop avec en-têtes d'époque discrètes, puces d'état typées (`StatusDot`), badge distinctif pour l'émission d'un reçu d'acompte vs quittance de solde.
  - **Résilience Mobile (390px et 360px) :** Dégradation fluide en fiches tabulaires compactes sans débordement horizontal ni troncature d'Iban ou de montant.

### 2.2 Leases — Registre & Création de Bail (`/leases`, `/leases/[id]`, `/leases/new`)
* **Registre (`/leases`) :** Migration du grid 2 colonnes désordonné vers une vue registre unifiée avec métriques du parc locatif, loyers hors charges et provisions distincts, statut du dernier paiement et actions d'accès direct.
* **Contrat & Fiche Bail (`/leases/[id]`) :** Fiche de bail éditoriale avec ruban des conditions financières (loyer, charges, dépôt, indexation IRL active), grand livre des règlements associés et alertes d'arriérés contextualisées.
* **Formulaire de Création (`/leases/new`) :**
  - Sectionnement continu sans rupture visuelle.
  - Calcul dynamique en direct du total exigible (`rentAmount` + `chargesAmount`).
  - Garde-fou légal automatique : plafonnement du dépôt de garantie selon le type de bail (1 mois de loyer hors charges en non-meublé, 2 mois en meublé - Loi du 6 juillet 1989 art. 22) avec bouton d'ajustement immédiat en 1 clic.
  - Progressive disclosure réservée aux clauses conditionnelles (clause résolutoire, indexation IRL INSEE).

---

## 3. Inventaire des Planches Visuelles Wave 2

Toutes les planches ont été générées via Playwright en conditions réelles et archivées dans le repository (`docs/design/planches/bplus_wave2/`) ainsi que dans le dossier d'artefacts CLI.

| N° | Fichier planche | Résolution | Contexte & Scénario testé | Hauteur DOM |
|:---|:---|:---:|:---|:---:|
| 01 | `01_billing_1440_standard.png` | 1440 × 900 | Grand Livre standard avec toutes quittances réglées | 900 px |
| 02 | `02_billing_1440_partial.png` | 1440 × 900 | Grand Livre avec acompte partiel & exception Nantes | 900 px |
| 03 | `03_billing_1440_dense.png` | 1440 × 900 | Grand Livre dense (10 lots locatifs, arriérés, acomptes) | 997 px |
| 04 | `04_billing_390_partial.png` | 390 × 844 | Vue mobile standard iPhone avec acompte et actions | 1050 px |
| 05 | `05_billing_360_dense.png` | 360 × 740 | Vue mobile compacte Android stress-test 10 lots | 1908 px |
| 06 | `06_lease_view_1440.png` | 1440 × 900 | Consultation de bail détaillée avec ruban financier | 900 px |
| 07 | `07_lease_form_1440.png` | 1440 × 900 | Formulaire de création de bail complet desktop | 963 px |
| 08 | `08_lease_form_390.png` | 390 × 844 | Formulaire de création responsive iPhone 390px | 1441 px |
| 09 | `09_lease_form_360_errors.png` | 360 × 740 | Formulaire stress 360px avec erreurs de validation Loi 89 | 1436 px |
| 12 | `12_wave2_design_system_extensions.png` | 1440 × 1200 | Planche de spécification du Design System Wave 2 | 2107 px |

Chemins sur disque :
- Repo : `docs/design/planches/bplus_wave2/*.png`
- Artifacts : `/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/bplus_wave2/*.png`

---

## 4. Vérification Technique & Tests

### 4.1 Contrôles Statiques & Build
- `pnpm tsc --noEmit` : **0 erreurs**.
- `pnpm test -- --run` : **87 suites passées sur 87**, **928 tests passés sur 928** (0 régression).
- `pnpm build` : **Succès total (Code 0)**, toutes les pages dynamiques et statiques compilées sans avertissement bloquant.

### 4.2 Tests End-to-End Playwright
- `src/__tests__/e2e/leases.spec.ts` : **Passé (2/2)**
  - Affichage de l'état vide
  - Création complète d'un bail de bout en bout avec bien et locataire.
- `src/__tests__/e2e/quittances.spec.ts` : **Passé (3/3)**
  - Avertissement d'absence d'adresse bailleur sans prétendre émettre une quittance.
  - Émission de la quittance légale avec adresse complète.
  - Navigation et intégrité de la page `/billing`.
- `src/__tests__/e2e/dashboard.spec.ts` : **Passé (4/4)**
- `src/__tests__/e2e/property-home-base.spec.ts` : **Passé (4/4)**

### 4.3 Sécurité, Auth & Product Truth
1. **Dynamic Auth baseURL :** Résolution dynamique du port d'authentification pour empêcher les déconnexions intempestives ou les désynchronisations lors des tests multi-ports.
2. **Subscription Gate Loop Guard :** Protection de la route `/billing` dans le middleware et le `SubscriptionGate` pour éviter toute redirection cyclique.
3. **Vérité Produit Documents :** Suppression complète des mentions et fausses pièces archivées statiques. Seules les quittances réellement générées à partir des transactions en base sont exposées au bailleur.
