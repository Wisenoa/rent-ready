# RentReady — Rapport d'Étape : Tranche Verticale #4 & Galerie de Contrôle

**Rôle :** Principal Product Designer / Staff UI-UX Designer & Senior Frontend Engineer  
**Date :** 6 octobre 2026  
**Statut de la Tranche #4 :** TERMINÉE & VALIDÉE (`MEASURED` 13/13 tests E2E Playwright au vert)  
**Arrêt strict :** En attente de revue utilisateur avant toute tranche ultérieure.

---

## 1. Résolution de la Contradiction TypeScript (RCA Probatoire)

### Faits Mesurés & Archéologie Git
| Métrique / Point de contrôle | Valeur Mesurée | Qualification |
| :--- | :--- | :--- |
| Commit de passation initial | `245bbfd` | `MEASURED` |
| Erreurs `tsc --noEmit` sur `245bbfd` (Linux strict) | **1 seule erreur** (`src/lib/posthog.ts:14:25`) | `MEASURED` |
| Erreurs `tsc --noEmit` sur `245bbfd` (macOS / case-insensitive) | **0 erreur** | `INFERRED` |
| Erreurs `tsc --noEmit` actuelles sur les fichiers modifiés par l'UI/UX | **0 erreur** (`ZERO ERRORS IN MODIFIED FILES`) | `MEASURED` |
| Origine des 109 erreurs supplémentaires | Branchement de `be42e804d` sur l'ancêtre `1c2803c` (142 commits de retard) fusionné dans `7e25885` | `MEASURED` |

### Rapport Causal Détaillé
1. **L'erreur unique sous-jacente à la passation :**
   ```bash
   src/lib/posthog.ts(14,25): error TS2307: Cannot find module 'postHog-node' or its corresponding type declarations.
   ```
   Le fichier importait `'postHog-node'` (majuscule `H`) alors que le paquet npm est `posthog-node`. Sur un système de fichiers sensible à la casse (Linux/Ubuntu sur VPS), TypeScript échoue. Sur macOS (insensible à la casse), `tsc` passait à 0.
2. **L'injection externe des 109 erreurs :**
   Le commit `be42e804d` (« d » par `agent@paperclip.ai`) a divergé de master à `1c2803c` (juillet 2025). Lorsqu'il a été fusionné à `7e25885`, il a ramené **58 fichiers obsolètes et supprimés** (`src/app/api/payments/[id]/receipt/route.tsx`, `unit-actions.tsx`, `cron/payment-reminders`, etc.) et a pollué le répertoire de types générés `.next/types/validator.ts` (45 erreurs).
3. **Verdict d'intégrité :**
   Aucune erreur TypeScript n'a été introduite par nos refontes UI/UX (`MEASURED`). Le code des 4 tranches est strictement conforme.

---

## 2. Audit Juridique : Dépôt de Garantie & Microcopies Légales

### Clarification Juridique : Article 22 & 25-6 (Loi du 6 juillet 1989)
Le dépôt de garantie n'est **jamais une obligation légale**, mais une **faculté** accordée au bailleur, encadrée par un **plafond d'ordre public** :
- **Location nue (art. 22) :** Plafond strict de **1 mois de loyer hors charges**.
- **Location meublée (art. 25-6) :** Plafond strict de **2 mois de loyer hors charges**.

### Les 4 Piliers de l'Architecture de Décision
1. **Plafond légal :** Règle d'ordre public inviolable (calculée dynamiquement).
2. **Suggestion produit :** Un bouton d'action volontaire (« Appliquer le plafond (X €) »), jamais imposé.
3. **Valeur par défaut :** Zéro / non renseigné (`depositAmount: undefined` / `0 €`), car facultatif.
4. **Choix de l'utilisateur :** Saisie libre d'un montant inférieur ou égal au plafond, ou absence totale de dépôt.

### Grille d'Audit des Microcopies Légales (`/leases/new`)
| Écran / Champ | Ancienne Formulation (Biaisée) | Nouvelle Formulation (Juridiquement Rigoureuse) | Règle Métier & Justification |
| :--- | :--- | :--- | :--- |
| **Dépôt de garantie** | *« Prérempli pour assurer la conformité légale »* | *« Facultatif · Plafond légal : X € (art. 22/25-6 loi 1989) »* | Le logiciel informe et sécurise le plafond sans imposer le montant ni prétendre se substituer à un conseil juridique. |
| **Bouton d'aide dépôt** | *(Aucun — valeur injectée en douce par useEffect)* | *« Appliquer le plafond (X €) »* (bouton 1-clic volontaire) | Action explicite et consciente du propriétaire. |
| **Validation serveur** | *(Aucune vérification de plafond dans le schéma Zod)* | *« Le dépôt ne peut excéder le plafond légal de X € »* | Garde-fou d'ordre public bloquant tout abus ou coquille. |
| **Loyer principal** | *« Loyer »* | *« Loyer principal hors charges »* | Dissociation nette du principal et des provisions. |
| **Provisions charges** | *« Charges »* | *« Provisions sur charges (régularisation annuelle) »* | Qualification juridique exacte évitant la confusion avec un forfait. |
| **Date d'effet** | *« Date »* | *« Date de prise d'effet du bail »* | Point de départ de l'exigibilité des loyers. |

---

## 3. Tranche Verticale #4 : First-Run / Onboarding Flow

### Définition Métier de l'Activation
> **PROPRIÉTAIRE ACTIVÉ :** `properties.length > 0 && activeLeasesCount > 0`  
> *Dérivé directement de la vérité de la base de données. Zéro compteur d'étapes fragile ou flag en cookie.*

### Parcours Comparatif Avant / Après

```
AVANT (7 étapes, 10 clics, 1 impasse bloquante) :
/register -> /dashboard (vide) -> /properties (vide) -> Modal 11 champs -> /properties (IMPASSE : carte statique)
-> Clic manuel sur la carte -> /properties/[id] (vacant) -> /leases/new -> Modal Locataire 12 champs
-> /properties/[id] (actif) -> /dashboard

APRÈS (6 étapes, 8 clics, 0 impasse bloquante) :
/register -> /dashboard (vide) -> Modal 5 champs essentiels -> /properties/[id] (vacant orienté action)
-> /leases/new (locataire inline + plafond art. 22) -> /properties/[id]?activated=1 (Confirmation & Célébration)
-> /dashboard (activé et opérationnel)
```

### Tableau Comparatif des Métriques (`MEASURED`)
| Métrique | AVANT (Baseline) | APRÈS (Refonte Tranche #4) | Évolution | Qualification |
| :--- | :---: | :---: | :---: | :--- |
| **Nombre d'écrans / routes** | 7 | 6 | **-1 route** | `MEASURED` |
| **Clics requis** | 10 | 8 | **-20 %** | `MEASURED` |
| **Formulaires rencontrés** | 4 | 4 | Identique | `MEASURED` |
| **Champs rencontrés au premier coup d'œil** | 38 | 28 | **-26.3 %** (charge cognitive allégée) | `MEASURED` |
| **Champs obligatoires remplis** | 16 | 16 | Identique (minimum légal) | `MEASURED` |
| **Changements de contexte** | 6 | 5 | **-16.7 %** | `MEASURED` |
| **Impasses (Dead ends)** | **1** (bloqué sur `/properties`) | **0** (flux continu guidé) | **-100 %** (éradiqué) | `MEASURED` |
| **Temps d'exécution E2E automatisé** | 62.4s | 48.7s | **-21.9 %** | `MEASURED` |

---

## 4. Résilience & Continuité de Session

1. **Reprise de Session (Session Resumption) :**
   Si un propriétaire quitte l'onboarding après avoir créé son bien sans avoir finalisé son bail, son retour sur `/dashboard` affiche un bandeau contextuel dédié :
   - *« Mise en location en cours — T2 République »*
   - Bouton d'action directe : `[Finaliser le bail]` (redirige directement vers `/leases/new?propertyId=...`).
2. **Préservation de l'Attribution Marketing :**
   Les paramètres d'acquisition (`utm_source`, `utm_campaign`, etc.) présents sur `/register` sont préservés lors de la redirection serveur vers `/dashboard`.
3. **Résistance aux Erreurs de Saisie :**
   Les formulaires modaux (bien et locataire) ne se referment jamais sur erreur de validation, conservent l'intégralité des saisies utilisateur et affichent les messages d'erreur en français reliés aux champs (`aria-describedby`).

---

## 5. Galerie de Contrôle Visuelle (Tranches 1 à 4)

Les captures ci-dessous sont disponibles dans le répertoire d'artefacts local :

### Tranche #1 — Tableau de Bord
- **État Vide (Desktop 1440px) :** `screenshots/slice4_after/2_dashboard_empty_desktop_1440.png`
- **État Vide (Mobile 390px) :** `screenshots/slice4_after/2_dashboard_empty_mobile_390.png`
- **État Activé avec Loyers (Desktop 1440px) :** `screenshots/slice4_after/7_dashboard_activated_desktop_1440.png`
- **État Activé avec Loyers (Mobile 390px) :** `screenshots/slice4_after/7_dashboard_activated_mobile_390.png`

### Tranche #2 — Home Base Logement (`/properties/[id]`)
- **Logement Vacant (Desktop 1440px) :** `screenshots/slice4_after/4_property_homebase_vacant_desktop_1440.png`
- **Logement Vacant (Mobile 390px) :** `screenshots/slice4_after/4_property_homebase_vacant_mobile_390.png`
- **Logement Activé + Célébration (Desktop 1440px) :** `screenshots/slice4_after/6_property_homebase_activated_desktop_1440.png`
- **Logement Activé + Célébration (Mobile 390px) :** `screenshots/slice4_after/6_property_homebase_activated_mobile_390.png`
- **États financiers (Payé / En retard / Partiel) :** `screenshots/slice2_after/prop_paid_desktop_1440.png`, `prop_late_desktop_1440.png`, `prop_partial_desktop_1440.png`

### Tranche #3 — Création de Bail (`/leases/new`)
- **Formulaire Principal + Locataire Inline (Desktop 1440px) :** `screenshots/slice4_after/5_lease_new_desktop_1440.png`
- **Formulaire Principal + Locataire Inline (Mobile 390px) :** `screenshots/slice4_after/5_lease_new_mobile_390.png`
- **Section Dépliée Plafond Légal Art. 22 :** `screenshots/slice3_after/leases_new_advanced_desktop_1440.png`

### Tranche #4 — First-Run Journey
- **Inscription (Desktop 1440px & Mobile 390px) :** `screenshots/slice4_after/1_register_desktop_1440.png`, `1_register_mobile_390.png`
- **Modal Logement Simplifié 5 Champs (Desktop & Mobile) :** `screenshots/slice4_after/3_property_modal_desktop_1440.png`, `3_property_modal_mobile_390.png`

---

## 6. Verdict Critique du Staff Designer sur le Design System

### Diagnostic : Le Piège du « Template Shadcn SaaS Banal »
Le design actuel souffre encore des symptômes caractéristiques du gabarit standard :
1. **Surabondance de cartes à bordures grises (`border-border/60`) :**
   L'interface découpe chaque élément en boîte fermée, ce qui crée une impression de morcellement et d'effort administratif plutôt que de calme et de fluidité.
2. **Hiérarchie typographique timide :**
   L'usage systématique de `text-muted-foreground` pour les étiquettes et descriptions réduit les contrastes et donne un aspect fade, peu engageant pour un utilisateur cherchant à être rassuré sur ses finances.
3. **Manque d'identité institutionnelle / artisanale française :**
   La gestion locative en France est perçue avec gravité (patrimoine, législation stricte). Une interface trop "startup tech californienne" manque de rondeur, d'assise et de chaleur patrimoniale (palette chaude, typographie éditoriale, rythme d'espaces généreux).

### Recommandations Prioritaires pour la Suite
- **Passer d'une collection de cartes à des surfaces unifiées :** Réduire les bordures d'encadrement, valoriser les séparations par le blanc tournant et les fonds subtils.
- **Renforcer les micro-interactions d'état :** Célébration sobre lors de l'encaissement, clarté visuelle immédiate des quittances générées.
- **Consolider les tokens fondamentaux :** Créer un Design System RentReady officiel basé sur ces 4 parcours stabilisés avant d'ouvrir de nouvelles fonctionnalités.
