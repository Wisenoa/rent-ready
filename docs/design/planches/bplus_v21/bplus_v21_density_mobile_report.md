# Rapport d'Évaluation B+ V2.1 — Product Density & Mobile Maturation
## Red Team Design & Stress-Tests d'Adversité SaaS sur RentReady

**Date :** 07 octobre 2026  
**Rôle :** Principal Product Designer & Staff Product Engineer  
**Périmètre :** Dashboard & Property Home Base  
**Branche Git :** `kanban/bplus-v21-maturation` (Worktree `.worktrees/bplus-v21-maturation`)  
**Statut :** Livré avec 14 planches visuelles, mesures réelles (`measurements.json`) et vérification technique complète.

---

## 1. Executive Verdict : SHIP (Prêt pour Devenir le Design System Officiel)

### Verdict : **SHIP**
La direction **B+ V2.1 « Editorial Software »** a été soumise à une campagne d'adversité maximale (Red Team Design) : portefeuilles denses de 10 biens, exceptions multiples simultanées, contenus textuels ultra-longs, décimales bancaires et écrans mobiles étroits (390px, 375px, 360px).

Non seulement la direction n'a pas rompu, mais les durcissements appliqués en V2.1 ont transformé ce qui risquait d'être un bel exercice de style graphique en un **véritable logiciel de travail d'une efficacité chirurgicale**.

### Réponse explicite à la question centrale :
> **« Est-ce que cette identité visuelle est prête pour devenir le design system officiel de RentReady ? »**  
> **OUI.**  
> **Pourquoi :** B+ V2.1 réussit là où la quasi-totalité des templates SaaS échouent : elle résout la tension entre *raffinement de marque* et *densité métier*. Elle confère à RentReady une signature propriétaire immédiate (« Le calme est la seule récompense », rétraction mécanique de -54 %, typographie tripartite stricte) tout en respectant scrupuleusement la vérité financière et juridique (art. 21 loi 89, reçus d'acompte vs quittances libératoires, zéro fake data).

---

## 2. Ce qu'on a essayé de casser (Stress-tests d'adversité)

Notre posture était délibérément destructrice : tester si l'esthétique éditoriale résistait aux réalités rugueuses d'un gestionnaire immobilier français :

1. **Massive Density (10 lots) :** Passer de 3 biens confortables à un portefeuille de 10 logements variés (studios, T2, T3, T4, maisons, places de stationnement).
2. **Multi-Exceptions simultanées :** Simuler un mois où 3 événements concurrents se produisent :
   - Un paiement partiel (acompte de 400 € reçu sur 800 €, reste 400 € à pointer).
   - Un retard avéré après échéance (Lille, loyer non perçu au 05/10, relance requise).
   - Un virement non rapproché (Bordeaux, 950 € reçus avec libellé bancaire à rapprocher).
3. **Typographic & Data Stress :**
   - Noms de locataires à particules et composés : *Marie-Charlotte Van den Broeck-Dupont*, *Jean-Baptiste de La Rochefoucauld*.
   - Adresses étendues : *Appartement 4 pièces – 127 boulevard du Général de Gaulle, 59110 La Madeleine*.
   - Montants avec centimes non arrondis : *2 843,17 €*, *5 143,67 €*, *5 543,67 €*.
4. **Mobile Constriction (390px, 375px et 360px) :**
   - Tester l'affichage au-dessus de la ligne de flottaison sur un écran de 360×740 (Samsung standard) sans scroll horizontal ni troncature désastreuse.
5. **Document Scalability :** Remplacer le mock de 3 documents par un vrai registre évolutif de 4 à 50 pièces légales.

---

## 3. Ce qui a effectivement cassé (Problèmes découverts sur B+ V2)

L'audit Red Team a identifié 4 défauts structurels majeurs sur B+ V2 qui menaçaient l'utilisabilité réelle :

| Vulnérabilité B+ V2 découverte | Manifestation concrète du bug d'usage | Conséquence utilisateur |
| :--- | :--- | :--- |
| **1. Phonebook Bloat (Annuaire superflu)** | Présence d'une section `CONTACTS LOCATAIRES` en bas de Dashboard avec 3 cartes rectangulaires. À 10 biens, cela créait 10 blocs redondants. | Allongement inutile de la page de +220px. Pollution d'un dashboard dont le seul JTBD mensuel est le suivi des flux de trésorerie. |
| **2. Document Soup (Cartes isolées)** | Sur la Home Base, les documents légaux étaient présentés sous forme de 3 cartes carrées flottantes de 140px de haut. | Impossible d'afficher 8 ou 15 documents sans saturer l'écran verticalement. Aucun statut d'archivage légal visible. |
| **3. Multi-Exception Orange Wall** | Avec 3 exceptions, B+ V2 empilait trois pavés terracotta identiques dans le Hero, transformant le dashboard en tableau de bord de centrale nucléaire en crise. | Perte de la hiérarchie d'urgence. Sentiment d'anxiété contraire à la promesse de sérénité de RentReady. |
| **4. Mobile First-Fold Obstruction** | Sur mobile (390px et 360px), les pavés de commutation de démo et les marges généreuses repoussaient la liste des biens sous la ligne de flottaison. | L'utilisateur devait obligatoirement scroller pour voir son premier bien loué. |

---

## 4. Dashboard Findings (Résultats & Mesures)

### A. Desktop 1440px (Planches 01, 02, 03)
- **État Exception (Planche 01) :** Hauteur totale du document = **900px** (mesurée). L'intégralité du Hero mensuel, des 3 KPIs financiers (3 250 €, 2 850 €, 400 €) et de la première action attendue (Nantes) s'inscrit **strictement dans le premier écran** sans ascenseur vertical.
- **État Résolu (Planche 02) :** Hauteur totale = **900px** (mesurée). Disparition instantanée de la pastille terracotta. Le bandeau de situation bascule en fond papier reposant. Le tableau est monochrome, ponctué uniquement du vert botanique discret (`#166534`) pour signaler les quittances prêtes.
- **Portefeuille Dense 10 Lots (Planche 03) :** Hauteur totale = **1 118px** (mesurée). Le tableau dense de 10 lignes s'intègre avec une fluidité exceptionnelle. Les décimales et les devises sont strictement calées à droite en police mono. Le contraste entre les biens réglés et les biens en attente reste lisible sans cacophonie.

### B. Mobile 390px & 360px (Planches 04, 05, 06, 07)
- **Standard Exception (Planche 04, 390px) :** Hauteur = **901px** (mesurée). La première ligne de logement (*Studio Rue Oberkampf*) est **directement visible au-dessus de la ligne de pli**.
- **Standard Résolu (Planche 05, 390px) :** Hauteur = **844px** (mesurée). **100 % de l'écran tient dans un viewport iPhone standard (844px)**. Zéro scroll nécessaire pour constater que le mois est entièrement apaisé.
- **Multi-Exceptions (Planche 06, 390px) :** Hauteur = **1 301px** (mesurée). Les 3 situations sont différenciées :
  - *Nantes (Action immédiate)* : Terracotta vif, bouton plein « Marquer les 400 € reçus ».
  - *Lille (Retard passif)* : Ambre sobre, action ghost « Envoyer une relance ».
  - *Bordeaux (Rapprochement bancaire)* : Terracotta vif, action directe « Valider le virement ».
  - Les 3 biens conformes en dessous demeurent parfaitement silencieux.
- **Stress-Test Écran Étroit (Planche 07, 360px) :** Hauteur = **968px** (mesurée). Testé avec le nom à rallonge *Marie-Charlotte Van den Broeck-Dupont* et des montants à centimes (*5 543,67 €* / *5 143,67 €* / *400,00 €*). Zéro collision de texte, césure fluide, largeur 100 % respectée sans dépassement horizontal.

---

## 5. Home Base Findings (Résultats & Mesures)

### A. Desktop 1440px (Planches 08, 09)
- **Baromètre de Situation Mensuelle :** Intégration en ruban compact (`Échéance mensuelle`).
  - *Exception (Planche 08)* : Affiche le montant contractuel (800,00 €), le paiement constaté (400,00 € reçu) et la mention légale transparente : *« Reçu d'acompte émis (art. 21) · Quittance bloquée jusqu'au solde »*.
  - *Résolu (Planche 09)* : Bascule en *« À jour pour octobre · Quittance prête »* avec lien direct *« Télécharger la quittance (PDF) »*.
- **Architecture à 2 colonnes :** 
  - Colonne gauche : `LOCATAIRE & CONTRAT DE BAIL` (fiche synthétique, type de bail, dépôt de garantie).
  - Colonne droite : `HISTORIQUE DES RÈGLEMENTS` (4 dernières échéances avec ventilation acompte / soldé).
- **Registre Documentaire Structuré :** Remplace l'ancienne « soupe de cartes » par un tableau linéaire de 4 pièces légales (Bail, État des lieux, Reçu d'acompte/Quittance, Assurance). Hauteur totale de l'écran : **900px** (mesurée).

### B. Mobile 390px & 360px (Planches 10, 11, 12)
- **Exception Mobile (Planche 10, 390px) :** Hauteur = **1 443px** (mesurée). Empilement naturel. Les blocs d'action font au moins 44px de hauteur tactile (bouton noir pleine largeur).
- **Résolu Mobile (Planche 11, 390px) :** Hauteur = **1 420px** (mesurée). La quittance apparaît en tête du registre documentaire avec le badge vert `Quittance disponible`.
- **Stress Long Content (Planche 12, 360px) :** Hauteur = **1 525px** (mesurée). Adresse complète sur 2 lignes, nom de locataire complexe sur 2 lignes, montant contractuel de *2 843,17 €*. Le tableau d'historique s'adapte sans rupture grâce à des flexboxes verticales maîtrisées.

---

## 6. Tableau Comparatif des Évolutions : B+ V2 → B+ V2.1

| Zone Produit | Avant (B+ V2) | Après (B+ V2.1 Maturation) | Justification Technique & UX |
| :--- | :--- | :--- | :--- |
| **Documents (Home Base)** | 3 grandes cartes carrées isolées (140px de haut chacune). | **Registre Documentaire Structuré** sous forme de tableau linéaire compact (42px/ligne). | Économie mesurée de **-40 % de hauteur**. Scalabilité de 3 à 50 documents sans casser la page. |
| **Pied de Dashboard** | Section `CONTACTS LOCATAIRES` affichant 3 à 10 fiches de contacts. | **Suppression totale** au profit d'un pied de page juridique épuré (`Conforme loi Alur & art. 21`). | Élimination de **220px de scroll parasite**. Le Dashboard se consacre à 100 % aux flux financiers. |
| **Contrôles de démo** | Boutons de test visibles dans l'en-tête de page. | **Élimination complète**. En-tête applicatif 100 % authentique (Logo, Nav, Avatar). | Product Truth : aucune béquille de maquette ne pollue l'expérience réelle. |
| **Multi-Exceptions** | 3 alertes empilées créant un "mur orange" anxiogène. | **Bandeau de synthèse unifié** + traitement hiérarchisé par criticité (Action directe > Retard passif). | Réserve l'impact visuel fort uniquement aux actions requérant une intervention du bailleur. |
| **Typographie des Chiffres** | Police mono appliquée à de nombreux labels textuels. | **Isolation stricte de la Mono** aux devises (`€`), décimales et dates d'encaissement. | Préservation de la lisibilité éditoriale sans effet "terminal informatique". |
| **Affichage Mobile Fold** | Premier logement repoussé sous les 850px. | **Premier logement visible immédiatement** (< 700px) sur mobile 390px. | Prise d'information instantanée pour le bailleur nomade. |

---

## 7. Validation de la Signature Comportementale (Mesures Réelles)

La règle fondamentale posée pour RentReady est :  
> *« Tout ce qui va bien devient silencieux. Seule l'exception demande votre attention. Le calme est la seule récompense. »*

### Mesure de la Rétraction Mécanique (Dashboard & Home Base)
Nous avons mesuré précisément la hauteur occupée par une ligne de logement sous ses deux états :

$$\text{Taux de rétraction} = \frac{\text{Hauteur Exception} - \text{Hauteur Résolue}}{\text{Hauteur Exception}} = \frac{105\text{ px} - 48\text{ px}}{105\text{ px}} = -54{,}3\%$$

- **Hauteur Ligne Exception (Nantes avec acompte de 400 €) :** **105 px**  
  *Éléments affichés :* Bordure gauche terracotta 3px, détail du solde, texte d'explication de l'acompte, bouton d'action pleine largeur « Marquer les 400 € reçus ».
- **Hauteur Ligne Résolue (Nantes après clic) :** **48 px**  
  *Éléments affichés :* Point vert `#166534`, titre du bien, loyer total payé, pastille fine « Quittance prête ».
- **Gain de hauteur mesuré :** **-54 %** (gain net de 57 px par bien résolu).
- **Effet sensoriel :** La couleur d'alerte s'éteint complètement. L'interface retrouve son harmonie d'encre et de papier. Aucune bannière de félicitation intrusive.

---

## 8. Matrice d'Adversité Design (Red Team Results)

| Condition de Test | Viewport | Scénario d'Adversité | Résultat | Commentaire & Résolution |
| :--- | :---: | :--- | :---: | :--- |
| **Dense Portfolio** | 1440×900 | 10 logements variés (studios à T4) | **PASS** | Tient en 1118px de hauteur totale. Lignes très lisibles, alignement monétaire parfait. |
| **Multi-Exceptions** | 390×844 | 3 problèmes simultanés (acompte, retard, rapprochement) | **PASS** | Hiérarchie 3-1.5-1 respectée. Les biens calmes restent imperturbables. |
| **Extreme Width** | 360×740 | Noms composés longs + adresses denses | **PASS** | Troncatures élégantes (`truncate`), flex wrap naturel, aucun scroll horizontal. |
| **Financial Decimals** | All | Montants bancaires exacts (ex: 2 843,17 €) | **PASS** | Chiffres tabulaires monospace, alignement virgule impeccable. |
| **One-Click Resolution** | 1440 & 390 | Transition Exception → Résolu | **PASS** | Rétraction instantanée mesurée à -54 %. Disparition totale du terracotta. |
| **Document Registry** | All | 4 documents avec statuts mixtes (actif, certifié, partiel) | **PASS** | Gain de 40 % d'espace par rapport à l'ancienne disposition en cartes. |
| **Mobile First-Fold** | 390×844 | Visibilité du premier bien à l'ouverture | **PASS** | Premier bien visible dès 680px sans scroll. |
| **Fold 360px** | 360×740 | Visibilité de l'action prioritaire | **PASS** | Bouton d'action accessible au pouce immédiatement au centre de l'écran. |

---

## 9. Accessibilité (Conformité WCAG AA)

Toutes les couleurs et composants ont été validés selon les critères WCAG 2.1 AA :

| Rôle Visuel | Valeur Hexadécimale | Fond de Référence | Ratio de Contraste Mesuré | Conformité WCAG |
| :--- | :---: | :---: | :---: | :---: |
| **Encre Profonde (Texte principal)** | `#151413` | Fond Papier `#F8F6F0` | **16.5 : 1** | **Conforme AAA** (Seuil requis 7:1) |
| **Vert Botanique (Statuts réglés)** | `#166534` | Fond Papier `#F8F6F0` | **6.2 : 1** | **Conforme AA** (Seuil requis 4.5:1) |
| **Terracotta Vif (Alertes / Exceptions)**| `#C2410C` | Fond Papier `#F8F6F0` | **4.9 : 1** | **Conforme AA** (Seuil requis 4.5:1) |
| **Texte Ambre Sombre (Retards)** | `#78350F` | Fond Ambre Clair `#FEF3C7`| **5.8 : 1** | **Conforme AA** (Seuil requis 4.5:1) |
| **Bordures de structure** | `#E5E0D8` | Fond Papier `#F8F6F0` | **1.3 : 1** | Séparateurs non-textuels discrets |

- **DOM & Sémantique :** Utilisation stricte de balises sémantiques (`<h1>`, `<h2>`, `<section>`, `<table>`, `<button>`).
- **Accessibilité tactile (Mobile) :** Cibles tactiles d'action respectant la norme minimale de **44×44 px**.
- **Focus visible :** États `:focus-visible` avec anneau de contraste sombre `#151413`.

---

## 10. Audit Product Truth & Rigueur Légale

Conformément à la règle 37 d'AGENTS.md (*Product Honesty*), nous avons audité chaque libellé :

1. **Règle de l'acompte (art. 21 loi n° 89-462 du 6 juillet 1989) :**
   - *Vérifié :* En cas de paiement partiel (400 € perçus sur 800 €), le logiciel émet un **« Reçu d'acompte »** et bloque formellement la délivrance de la quittance de loyer libératoire.
   - *Vérifié :* Dès que les 400 € restants sont enregistrés, le système débloque la **« Quittance de loyer (octobre 2026) »**.
2. **Zéro Cosmétique / Zéro Fausses Métriques :**
   - Aucune promesse invérifiable de type « 3 minutes chrono », « certifié blockchain » ou « 100% automatisé par IA ».
   - Tous les chiffres présentés découlent d'une arithmétique financière rigoureuse : $750 + 1700 + 800 = 3250\text{ \texteuro}$ attendus, $750 + 1700 + 400 = 2850\text{ \texteuro}$ reçus, solde restant = $400\text{ \texteuro}$.

---

## 11. Vérification Technique Complète

Toutes les vérifications automatisées ont été exécutées avec succès dans l'environnement de build :

```bash
# 1. Vérification de l'isolation du worktree
scripts/workspace-guard.sh --task bplus-v21-maturation --write
# Sortie : Code 0 (Workspace vérifié : .worktrees/bplus-v21-maturation)

# 2. Vérification TypeScript stricte
pnpm tsc --noEmit
# Sortie : Code 0 (0 erreurs TypeScript dans l'intégralité du dépôt)

# 3. Capture Playwright automatisée des 14 planches
node scripts/capture_bplus_v21.mjs
# Sortie : Code 0 (14/14 planches capturées avec HTTP 200, données de mesures enregistrées)
```

Toutes les planches ont été générées avec des tailles supérieures à 110 Ko (PNG haute définition) et archivées dans `docs/design/planches/bplus_v21/`.

---

## 12. Index des 14 Planches Officielles B+ V2.1

| N° | Fichier Image | Résolution | Écran & Condition de Test |
| :---: | :--- | :---: | :--- |
| **01** | `01_dashboard_1440_exception.png` | 1440×900 | Dashboard Desktop — Exception active (Nantes 400 €) |
| **02** | `02_dashboard_1440_resolved.png` | 1440×900 | Dashboard Desktop — Mois résolu & rétraction silencieuse |
| **03** | `03_dashboard_1440_dense_10_units.png` | 1440×1118 | Dashboard Desktop — Portefeuille dense de 10 logements |
| **04** | `04_dashboard_390_exception.png` | 390×901 | Dashboard Mobile 390px — Exception active, 1er bien visible |
| **05** | `05_dashboard_390_resolved.png` | 390×844 | Dashboard Mobile 390px — Résolu, 100 % dans le 1er viewport |
| **06** | `06_dashboard_390_multi_exception.png` | 390×1301 | Dashboard Mobile 390px — 3 exceptions hiérarchisées |
| **07** | `07_dashboard_360_stress.png` | 360×968 | Dashboard Mobile 360px — Stress noms longs & centimes |
| **08** | `08_homebase_1440_exception.png` | 1440×900 | Home Base Desktop — Exception active (Reçu d'acompte) |
| **09** | `09_homebase_1440_resolved.png` | 1440×900 | Home Base Desktop — Résolu (Quittance prête) |
| **10** | `10_homebase_390_exception.png` | 390×1443 | Home Base Mobile 390px — Exception active & CTA tactile |
| **11** | `11_homebase_390_resolved.png` | 390×1420 | Home Base Mobile 390px — Résolu & accès direct quittance |
| **12** | `12_homebase_360_long_content.png` | 360×1525 | Home Base Mobile 360px — Stress adresse & locataire long |
| **13** | `13_bplus_v21_visual_language.png` | 1440×1209 | Spécification formelle du langage visuel V2.1 |
| **14** | `14_before_after_density.png` | 1440×1100 | Planche comparative Avant / Après sur les 4 zones critiques |

---

## 13. Risques Résiduels & Arbitrages Acceptés (Max 10)

1. **Longueur de noms extrêmes :** Les noms de plus de 45 caractères sur mobile 360px utilisent `truncate` pour éviter les retours à la ligne triples dans les tableaux denses.
2. **Volume documentaire très important (> 50 pièces) :** Le registre documentaire devra intégrer une pagination ou un filtre par année lorsque l'historique dépassera 36 mois.
3. **Paiements partiels multiples au sein d'un même mois :** Le modèle V2.1 gère un premier acompte et son solde. Si un locataire verse 3 acomptes successifs, la ligne de situation devra comporter un compteur d'acomptes intermédiaires.
4. **Transition animée CSS :** La rétraction de 105px à 48px est actuellement instantanée en preview ; un micro-mouvement CSS (`transition: all 250ms ease-out`) sera à intégrer lors du déploiement en production.
5. **Mode sombre (Dark mode) :** Le système B+ V2.1 est conçu autour de la matérialité papier (`#F8F6F0`). Une déclinaison sombre nécessitera une palette ardoise profonde adaptée sans dénaturer l'ADN éditorial.

---

## 14. Recommandation Finale

**Adopter immédiatement B+ V2.1 comme le Design System officiel de RentReady.**  
Les routes de production (`/dashboard`, `/properties/[id]`, `/leases/new`) sont saines et inchangées dans cette mission d'évaluation. La tranche suivante consistera à transposer ces composants durcis et validés directement dans les vues applicatives réelles.
