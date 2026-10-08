# RentReady B.3 — Bilan du Passage d'Édition Finale

## 1. Contexte & Choix Fondamentaux

B.3 n'est pas une nouvelle exploration créative : c'est un travail chirurgical d'édition, d'allégement et de justesse appliqué à la **Homepage C (Hybrid Conversion)** validée lors de B.2.

### Ce qui est préservé sans altération (Freeze) :
- **Identité visuelle B.1** : Canvas calcaire (`#F5F3EF`), encre végétale (`#15241F`), vert forêt institutionnel (`#1E3A2F`), teinte d'alerte ambrée (`#D97706` / `#FEF3C7`), typographie Plus Jakarta Sans (`tnum`), espacements et grille.
- **Démonstration produit interactive** : Cycle mensuel d'octobre 2026, 3 logements, exception de Lyon (reste 400 €) résolue au clic en un état calme.
- **Rigueur métier & juridique** : Loi du 6 juillet 1989 (art. 21 et art. 17-1), distinction stricte quittance / reçu d'acompte, indices officiels INSEE.
- **Tarification transparente** : Starter à 9 €/mois (89 €/an) pour 1 à 3 biens, Pro à 15 €/mois (149 €/an) pour 4 à 10 biens, 14 jours d'essai sans carte.

---

## 2. Décisions d'Édition Clés (Diff B.2 → B.3)

### 2.1 Refonte du H1 : Du jargon stratégique au soulagement concret
- **H1 B.2 supprimé :** *« Gérez vos locations sans tableur. Agissez uniquement sur l'exception. »*  
  *(Problème : « agir sur l'exception » est un concept de designer produit, pas un vocabulaire de bailleur).*
- **H1 B.3 sélectionné :** **« Gérez vos locations sans tableur. »**  
  - Longueur : 33 caractères (extrêmement percutant).
  - Clarté catégorielle et soulagement immédiat de la douleur (90% des bailleurs indépendants gèrent encore sur Excel).
  - Tient sur 2 lignes naturelles sur mobile (390px et 360px) sans saturer l'espace vertical.
- **Sous-titre clarificateur :**  
  *« Le logiciel pour propriétaires bailleurs : suivi des loyers, quittances prêtes en un clic et rappels de révision IRL. Vous n'intervenez que si une action est nécessaire. »*  
  - Nomme immédiatement la catégorie : *logiciel pour propriétaires bailleurs*.
  - Nomme les 4 piliers concrets : *loyers, quittances, révisions, action*.
  - Zéro mot creux banni (*sérénité, tranquillité, intendance, patrimoine, automatisation intelligente*).

### 2.2 Éradication de la « Card Soup » (-73% de conteneurs)
- Dans B.2, la page retombait dans le piège de la multiplication des rectangles blancs fermés : 4 cartes dans les 4 piliers, 3 cartes dans la réassurance juridique, 2 cartes dans les outils, 2 cartes dans le pricing (11 cartes majeures).
- Dans B.3, application stricte de la règle **CALM ≠ CARD** :
  - Remplacement des 4 cartes piliers par **Trois Moments Produit** en rythme éditorial ouvert, alterné (Texte / Preuve produit, Preuve / Texte, Texte / Preuve), reliés par de discrets filets hairlines.
  - La réassurance juridique est transformée en un bloc sobre à 3 colonnes ouvertes, sans boîtes.
  - Les outils gratuits deviennent des lignes de ressources épurées avec flèches.
  - Seules restent les 2 cartes de tarification (pour la décision d'achat) et le conteneur du produit interactif.
  - **Résultat mesuré :** passage de 11 à 3 conteneurs majeurs (-72,7%).

### 2.3 Révélation de la Signature de Marque comme Aha Moment
- La signature *« Tout ce qui va bien devient silencieux »* n'est plus gaspillée en titre ou répétée partout.
- Elle intervient exactement **après la démonstration**, au moment où le bailleur constate visuellement que les logements réglés n'encombrent plus son esprit.

### 2.4 Optimisation Mobile Radicale (Y=298px)
- **Ordre mobile strict :** Navbar (48px) → H1 (2 lignes) → Sous-titre (3 lignes) → CTA (38px) → Micro-proof (14px) → Produit.
- Suppression de l'eyebrow, du double bouton CTA, et des badges légaux généraux qui repoussaient le produit vers le bas.
- **Position Y du produit sur mobile (390px) :** **298px** (contre 484px en B.2).
- Sur un écran standard de 844px (iPhone) ou 800px (Android), le haut de la démo interactive est visible **dès le premier écran**, sans aucun défilement.
- Sur 360px : les montants monétaires restent en chasse fixe (`tabular-nums`) et ne cassent jamais de ligne.

---

## 3. Matrice de Vérité Produit & Nettoyage des Allégations

| Allégation B.2 | Statut B.3 | Décision d'édition |
| :--- | :--- | :--- |
| « 14 jours gratuits » | **PROVEN** | Conservé (trialEndsAt = +14 jours dans `register-actions.ts`). |
| « Sans carte bancaire » | **PROVEN** | Conservé (formulaire /register ne demande aucun moyen de paiement). |
| « Configuration en 3 minutes » | **REMOVED** | **Supprimé**. Durée arbitraire non prouvable universellement. |
| « Conforme Loi 1989 » (badges génériques) | **REMOVED** | **Supprimé du hero et des en-têtes**. Remplacé par les références exactes (art. 21, art. 17-1) là où elles ont un sens juridique. |
| « Quittances prêtes » | **PROVEN** | Conservé (génération PDF en 1 clic dès paiement intégral). |
| « Révision IRL suivie » | **PROVEN** | Conservé (alerte 30j avant échéance + série INSEE officielle 001515333). |
| « Rapprochement bancaire intelligent en 1 clic » | **PROVEN** | Formulé sobrement : rapprochement des virements et détection des écarts. |
