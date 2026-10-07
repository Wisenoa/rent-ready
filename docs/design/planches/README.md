# Galerie Complète des Planches UI/UX — RentReady

Bienvenue dans la documentation visuelle de la refonte globale de RentReady.

Toutes les planches, captures d'écran multi-résolutions (Desktop, Tablette, Mobile) et rapports de conception sont regroupés ici pour consultation directe en local sur votre poste ou sur GitHub.

---

## Sommaire

-1. [B+ V2.1 : Maturation Produit, Densité & Mobile (Red Team Design)](#-1-b-v21--maturation-produit-densité--mobile-red-team-design)
00. [Test de Traduction Produit (Product Design Translation Test)](#00-test-de-traduction-produit-product-design-translation-test)
0. [Arbitrage des 3 Directions Artistiques (Prototypage Réel)](#0-arbitrage-des-3-directions-artistiques)
1. [Surfaces Publiques & Marketing (Direction Sérénité Active V1)](#1-surfaces-publiques--marketing--direction-sérénité-active)
   - [Présentation Complète & Storytelling](./marketing/presentation.md)
   - [Galerie des Écrans Clés (Desktop 1440px)](#galerie-desktop-1440px)
   - [Responsive Viewports (Mobile, Tablette, Desktop)](#responsive-viewports)
2. [Refonte de l'Application (Tranches UX #1 à #4)](#2-refonte-de-lapplication-tranches-ux-1-à-4)
   - [Tranche #1 : Dashboard & Grand Livre Mensuel](#tranche-1--dashboard--grand-livre-mensuel)
   - [Tranche #2 : Property Home Base (4 états)](#tranche-2--property-home-base-4-états)
   - [Tranche #3 : Création de Bail Directe](#tranche-3--création-de-bail-directe)
   - [Tranche #4 : Onboarding & Activation Premier Bien](#tranche-4--onboarding--activation-premier-bien)
3. [Rapports Stratégiques & Audits](#3-rapports-stratégiques--audits)

---

## -1. B+ V2.1 : Maturation Produit, Densité & Mobile (Red Team Design)
> **Rapport complet & audit d'adversité :** [Lire le rapport B+ V2.1](./bplus_v21/bplus_v21_density_mobile_report.md)  
> **Verdict : SHIP** (Direction validée pour devenir le Design System officiel de RentReady)

Confrontation de la direction **B+ V2 « Editorial Software »** aux pires conditions réelles de production (Red Team Design) :
* **Densité extrême :** Portefeuille de 10 lots réels intégrant studios, appartements familiaux et places de parking.
* **Exceptions multiples simultanées :** Acompte partiel à pointer (Nantes), retard avéré avec relance (Lille), et virement bancaire à rapprocher (Bordeaux).
* **Rétraction mécanique mesurée :** Réduction de **-54 % de la hauteur** de ligne (105px à 48px) dès résolution de l'exception. Extinction totale de la couleur terracotta.
* **Éradication de la "Card Soup" :** Remplacement des cartes documentaires carrées par un **Registre Documentaire Structuré** linéaire (gain de **-40 % d'espace**).
* **Purge des artefacts :** Suppression de l'annuaire redondant en bas de dashboard (gain de **220px de scroll inutile**) et élimination des faux boutons de démo.
* **Mobile étroit (360px & 390px) :** Premier bien visible dès le premier écran, zéro collision sur les noms composés et montants à centimes.

### Les 14 Planches Officielles B+ V2.1

| N° | Écran / Condition | Viewport | Fichier & Résolution |
| :---: | :--- | :---: | :--- |
| **01** | Dashboard Desktop — Exception active (Nantes 400 €) | 1440×900 | [01_dashboard_1440_exception.png](./bplus_v21/01_dashboard_1440_exception.png) (1440×900) |
| **02** | Dashboard Desktop — Mois résolu (Rétraction silencieuse) | 1440×900 | [02_dashboard_1440_resolved.png](./bplus_v21/02_dashboard_1440_resolved.png) (1440×900) |
| **03** | Dashboard Desktop — Portefeuille dense 10 logements | 1440×900 | [03_dashboard_1440_dense_10_units.png](./bplus_v21/03_dashboard_1440_dense_10_units.png) (1440×1118) |
| **04** | Dashboard Mobile — Exception active, 1er bien visible | 390×844 | [04_dashboard_390_exception.png](./bplus_v21/04_dashboard_390_exception.png) (390×901) |
| **05** | Dashboard Mobile — Mois résolu, 100 % dans le 1er écran | 390×844 | [05_dashboard_390_resolved.png](./bplus_v21/05_dashboard_390_resolved.png) (390×844) |
| **06** | Dashboard Mobile — 3 exceptions hiérarchisées | 390×844 | [06_dashboard_390_multi_exception.png](./bplus_v21/06_dashboard_390_multi_exception.png) (390×1301) |
| **07** | Dashboard Mobile 360px — Stress noms longs & centimes | 360×740 | [07_dashboard_360_stress.png](./bplus_v21/07_dashboard_360_stress.png) (360×968) |
| **08** | Property Home Base Desktop — Exception active (Reçu acompte) | 1440×900 | [08_homebase_1440_exception.png](./bplus_v21/08_homebase_1440_exception.png) (1440×900) |
| **09** | Property Home Base Desktop — Résolu (Quittance prête) | 1440×900 | [09_homebase_1440_resolved.png](./bplus_v21/09_homebase_1440_resolved.png) (1440×900) |
| **10** | Property Home Base Mobile — Exception active & CTA tactile | 390×844 | [10_homebase_390_exception.png](./bplus_v21/10_homebase_390_exception.png) (390×1443) |
| **11** | Property Home Base Mobile — Résolu & accès direct quittance | 390×844 | [11_homebase_390_resolved.png](./bplus_v21/11_homebase_390_resolved.png) (390×1420) |
| **12** | Property Home Base Mobile 360px — Stress adresse & locataire long | 360×740 | [12_homebase_360_long_content.png](./bplus_v21/12_homebase_360_long_content.png) (360×1525) |
| **13** | Synthèse Langage Visuel & Comportemental V2.1 | 1440×1200 | [13_bplus_v21_visual_language.png](./bplus_v21/13_bplus_v21_visual_language.png) (1440×1209) |
| **14** | Planche Comparative — Avant (V2) vs Après (V2.1) | 1440×1100 | [14_before_after_density.png](./bplus_v21/14_before_after_density.png) (1440×1100) |

---

## 00. Test de Traduction Produit (Product Design Translation Test)

Confrontation directe du langage visuel et comportemental B+ V2 avec l'application SaaS réelle :
* **Vérification comportementale :** L'exception (Nantes, 400 €) prend 3 unités d'attention ; une fois soldée, l'interface **se rétracte mécaniquement** (1 unité d'attention, silence visuel feutré).
* **Purge du jargon administratif :** Suppression de « Grand Livre », « cadastre », « relevé d'encaissement » pour un vocabulaire humain direct (un bien, Camille, un loyer, une quittance).
* **Écran Dashboard & Property Home Base :** Testé en résolutions Desktop (1440px) et Mobile (390px) sous les deux états (Exception active vs Mois calmé).
* **Synthèse du langage visuel v0 :** Typographie tripartite (Serif éditorial, Sans fonctionnel, Mono tabulaire strict), surfaces feutrées, palette émotionnelle et primitives d'action.

### Les 9 Planches Officielles du Test de Traduction Produit

| Écran / Objet | État | Fichier & Dimensions |
| :--- | :--- | :--- |
| **01. Dashboard Desktop** | Exception Active (Nantes 400 €) | [01_dashboard_desktop_1440.png](./product_translation/01_dashboard_desktop_1440.png) (1440×900) |
| **01b. Dashboard Desktop** | Mois Résolu / Rétraction Silencieuse | [01b_dashboard_resolved_desktop_1440.png](./product_translation/01b_dashboard_resolved_desktop_1440.png) (1440×900) |
| **02. Dashboard Mobile** | Exception Active (Nantes 400 €) | [02_dashboard_mobile_390.png](./product_translation/02_dashboard_mobile_390.png) (390×844) |
| **02b. Dashboard Mobile** | Mois Résolu / Calme | [02b_dashboard_resolved_mobile_390.png](./product_translation/02b_dashboard_resolved_mobile_390.png) (390×844) |
| **03. Property Home Base Desktop** | Exception Active (Solde 400 €) | [03_homebase_desktop_1440.png](./product_translation/03_homebase_desktop_1440.png) (1440×900) |
| **03b. Property Home Base Desktop** | Logement Calme & Quittance Prête | [03b_homebase_resolved_desktop_1440.png](./product_translation/03b_homebase_resolved_desktop_1440.png) (1440×900) |
| **04. Property Home Base Mobile** | Exception Active (Solde 400 €) | [04_homebase_mobile_390.png](./product_translation/04_homebase_mobile_390.png) (390×844) |
| **04b. Property Home Base Mobile** | Logement Calme & Quittance Prête | [04b_homebase_resolved_mobile_390.png](./product_translation/04b_homebase_resolved_mobile_390.png) (390×844) |
| **Synthèse Langage Visuel v0** | Fondations, Typo, Monnaie, Silence | [rentready_visual_language_v0.png](./product_translation/rentready_visual_language_v0.png) (1440×1200) |

---

## 0. Direction Retenue & Évoluée : B+ V2 — « EDITORIAL SOFTWARE »

La direction conceptuelle B+ a été maturée d'un « document administratif / PDF » vers un véritable **logiciel éditorial haut de gamme (Editorial Software)** :
* **Silence Visuel au cœur de la mise en page :** Les logements à jour (Paris, Lyon) prennent 1 unité d'attention (calmes, feutrés, compacts). L'exception (Nantes, 400 €) prend 3 unités d'attention avec bouton d'action directe.
* **Le Calme comme seule récompense :** Quand l'exception est résolue (« Marquer les 400 € reçus »), l'accent terracotta/ambre **disparaît totalement**, la page retrouve un calme feutré (encre, vert botanique très sobre, fond papier chaud `#F8F6F0`). Zéro confetti, zéro modal bruyante.
* **Le Mois comme signature temporelle :** Bandeau architectural `OCTOBRE 2026 · ÉCHÉANCE MENSUELLE · 01 OCT ──●── 31 OCT` unifiant le titre éditorial et le grand livre.
* **Données financières sublimées :** Typographie ciselée (`2 850 €`, `2 450 €`, `400 €` / `0 €`) en grands corps tabulaires.
* **Home Base vivante :** Fiche d'un bien avec onglets tactiles, ruban des 4 mois écoulés et classeur de documents téléchargeables.
* **Mobile 390px réinventé :** Le premier écran (< 850px) intègre le titre, le CTA et le baromètre d'octobre au-dessus de la ligne de flottaison. Typo mono drastiquement allégée.

### Les 6 Planches Officielles B+ V2 (Deliverables)

| Support & Vue | État | Fichier & Dimensions |
| :--- | :--- | :--- |
| **Desktop 1440px (Hero Viewport)** | **Exception Active (400 €)** | [BPLUS_V2_desktop_exception_1440.png](./directions/BPLUS_V2_desktop_exception_1440.png) (1440×900) |
| **Desktop 1440px (Hero Viewport)** | **Mois Résolu / Calme (0 €)** | [BPLUS_V2_desktop_resolved_1440.png](./directions/BPLUS_V2_desktop_resolved_1440.png) (1440×900) |
| **Desktop 1440px (Full Page)** | **Déroulé Complet du Récit** | [BPLUS_V2_desktop_full_1440.png](./directions/BPLUS_V2_desktop_full_1440.png) (1440×2800) |
| **Mobile 390px (Hero Viewport)** | **Exception Active (400 €)** | [BPLUS_V2_mobile_exception_390.png](./directions/BPLUS_V2_mobile_exception_390.png) (390×844) |
| **Mobile 390px (Hero Viewport)** | **Mois Résolu / Calme (0 €)** | [BPLUS_V2_mobile_resolved_390.png](./directions/BPLUS_V2_mobile_resolved_390.png) (390×844) |
| **Mobile 390px (Full Page)** | **Déroulé Complet Mobile** | [BPLUS_V2_mobile_full_390.png](./directions/BPLUS_V2_mobile_full_390.png) (390×3700) |

---

## 0bis. Archive : Première Passe B+ V1 (Editorial Monthly Ledger)

* [BPLUS_desktop_1440.png](./directions/BPLUS_desktop_1440.png)
* [BPLUS_desktop_resolved_1440.png](./directions/BPLUS_desktop_resolved_1440.png)
* [BPLUS_desktop_full_story.png](./directions/BPLUS_desktop_full_story.png)
* [BPLUS_mobile_390.png](./directions/BPLUS_mobile_390.png)
* [BPLUS_mobile_full_390.png](./directions/BPLUS_mobile_full_390.png)

---

## 0bis. Rappel des 3 Explorations Initiales (A, B, C)

Trois directions exploratoires initialement prototypées pour arbitrage :

| Direction | Concept & Signature | Arbitrage Creative Review |
| :--- | :--- | :---: |
| **Direction A** | The Calm Ledger / Control | Rejetée (trop standard SaaS, mais gardée pour sa clarté) |
| **Direction B** | L'Atelier Foncier & Typographique | **Retenue comme socle de marque & matérialité** |
| **Direction C** | Le Fil du Mois | **Retenue comme structure narrative du cycle** |

---

## 1. Surfaces Publiques & Marketing — Direction « Sérénité Active »
> Document détaillé : [Lire la présentation de Direction Artistique](./marketing/presentation.md)

### Galerie Desktop 1440px

#### 1. Hero Section & Grand Livre d'Octobre 2026
![Hero Section](./marketing/3_section_hero_1440.png)

#### 2. Le Cycle Mensuel Idéal (Processus en 3 étapes)
![Cycle Mensuel](./marketing/4_section_cycle_1440.png)

#### 3. Property Home Base Showcase
![Home Base Showcase](./marketing/5_section_homebase_1440.png)

#### 4. Grille Tarifaire Transparente (Starter & Pro)
![Tarifs](./marketing/6_section_pricing_1440.png)

#### 5. Simulateurs Juridiques Gratuits
![Outils Gratuits](./marketing/7_section_tools_1440.png)

---

### Responsive Viewports

| Format | Capture Pleine Page | Capture Au-dessus de la ligne de flottaison |
| :--- | :---: | :---: |
| **Mobile (390px)** | [Voir pleine page](./marketing/2_fullpage_mobile_390.png) | [Voir viewport](./marketing/1_hero_viewport_mobile_390.png) |
| **Tablette (768px)** | [Voir pleine page](./marketing/2_fullpage_tablet_768.png) | [Voir viewport](./marketing/1_hero_viewport_tablet_768.png) |
| **Desktop Moyen (1024px)** | [Voir pleine page](./marketing/2_fullpage_desktop_1024.png) | [Voir viewport](./marketing/1_hero_viewport_desktop_1024.png) |
| **Desktop Large (1440px)** | [Voir pleine page](./marketing/2_fullpage_desktop_1440.png) | [Voir viewport](./marketing/1_hero_viewport_desktop_1440.png) |

---

## 2. Refonte de l'Application (Tranches UX #1 à #4)

### Tranche #1 : Dashboard & Grand Livre Mensuel
*Dossier : `./app/slice1_dashboard/`*
* [Dashboard avec données (Desktop 1440)](./app/slice1_dashboard/06_dashboard_with_data_desktop_1440.png)
* [Dashboard avec données (Laptop 1280)](./app/slice1_dashboard/06_dashboard_with_data_laptop_1280.png)
* [Dashboard avec données (Mobile 390)](./app/slice1_dashboard/06_dashboard_with_data_mobile_390.png)
* [Dashboard état zéro / nouveau compte (Desktop)](./app/slice1_dashboard/05_dashboard_empty_desktop.png)
* [Dashboard état zéro / nouveau compte (Mobile)](./app/slice1_dashboard/05_dashboard_empty_mobile.png)

---

### Tranche #2 : Property Home Base (4 états)
*Dossier : `./app/slice2_property_homebase/`*

| État du Logement | Desktop 1440px | Mobile 390px |
| :--- | :---: | :---: |
| **Payé (Quittance disponible)** | [Desktop](./app/slice2_property_homebase/prop_paid_desktop_1440.png) | [Mobile](./app/slice2_property_homebase/prop_paid_mobile_390.png) |
| **En Retard / Impayé** | [Desktop](./app/slice2_property_homebase/prop_late_desktop_1440.png) | [Mobile](./app/slice2_property_homebase/prop_late_mobile_390.png) |
| **Paiement Partiel (Solde dû)** | [Desktop](./app/slice2_property_homebase/prop_partial_desktop_1440.png) | [Mobile](./app/slice2_property_homebase/prop_partial_mobile_390.png) |
| **Vacant (Bail requis)** | [Desktop](./app/slice2_property_homebase/prop_vacant_desktop_1440.png) | [Mobile](./app/slice2_property_homebase/prop_vacant_mobile_390.png) |

---

### Tranche #3 : Création de Bail Directe
*Dossier : `./app/slice3_bail/`*
* [Formulaire Desktop avec données](./app/slice3_bail/leases_new_desktop_1440.png)
* [Formulaire Desktop vide](./app/slice3_bail/leases_new_empty_desktop_1440.png)
* [Options avancées dépliées](./app/slice3_bail/leases_new_advanced_desktop_1440.png)
* [Formulaire Mobile avec données](./app/slice3_bail/leases_new_mobile_390.png)
* [Formulaire Mobile vide](./app/slice3_bail/leases_new_empty_mobile_390.png)

---

### Tranche #4 : Onboarding & Activation Premier Bien
*Dossier : `./app/slice4_onboarding/`*

| Étape du Parcours | Desktop 1440px | Mobile 390px |
| :--- | :---: | :---: |
| **1. Inscription** | [Desktop](./app/slice4_onboarding/1_register_desktop_1440.png) | [Mobile](./app/slice4_onboarding/1_register_mobile_390.png) |
| **2. Dashboard First-Run** | [Desktop](./app/slice4_onboarding/2_dashboard_empty_desktop_1440.png) | [Mobile](./app/slice4_onboarding/2_dashboard_empty_mobile_390.png) |
| **3. Modal Création Bien** | [Desktop](./app/slice4_onboarding/3_property_modal_desktop_1440.png) | [Mobile](./app/slice4_onboarding/3_property_modal_mobile_390.png) |
| **4. Home Base Bien Vacant** | [Desktop](./app/slice4_onboarding/4_property_homebase_vacant_desktop_1440.png) | [Mobile](./app/slice4_onboarding/4_property_homebase_vacant_mobile_390.png) |
| **5. Formulaire de Bail** | [Desktop](./app/slice4_onboarding/5_lease_new_desktop_1440.png) | [Mobile](./app/slice4_onboarding/5_lease_new_mobile_390.png) |
| **6. Home Base Activée** | [Desktop](./app/slice4_onboarding/6_property_homebase_activated_desktop_1440.png) | [Mobile](./app/slice4_onboarding/6_property_homebase_activated_mobile_390.png) |
| **7. Dashboard Activé** | [Desktop](./app/slice4_onboarding/7_dashboard_activated_desktop_1440.png) | [Mobile](./app/slice4_onboarding/7_dashboard_activated_mobile_390.png) |

---

## 3. Rapports Stratégiques & Audits

* **[Présentation Marketing Direction Sérénité Active](./marketing/presentation.md)** : Analyse DFII, inventaire des vérités produit, métriques MEASURED.
* **[Rapport de Clôture Tranche #4 (Onboarding)](./app/slice4_report.md)** : Métriques d'activation, tests E2E, gestion des plafonds légaux.
* **[Audit UX Initial](./app/audit_ux.md)** : Diagnostic des frictions de la version antérieure.
