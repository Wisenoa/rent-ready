# Spécification et Comparaison des 5 Héros B.2

> **Territoire visuel :** Modern French Atelier B.1 (Calcaire `#F5F3EF`, Vert forêt `#1E3A2F`, Encre végétale `#15241F`, Plus Jakarta Sans, surfaces ouvertes, faible cardification).  
> **Variation :** Purement stratégique (angle marketing, hiérarchie de contenu, vitesse de compréhension, visibilité du produit).

---

## 1. Vue d'ensemble des 5 Stratégies de Hero

| Hero | Nom stratégique | H1 Retenu | Angle & Rôle | Preuve immédiate au 1er viewport |
| :--- | :--- | :--- | :--- | :--- |
| **Hero 1** | **Category First** | *Le logiciel de gestion locative des propriétaires indépendants.* | Clarté et ancrage catégoriel absolus. Zéro ambiguïté pour un primo-visiteur ou le SEO. | Écran synthétique du portefeuille (3 biens, totaux mensuels, statut clair). |
| **Hero 2** | **Outcome First** | *Vos loyers suivis, vos quittances prêtes. Chaque mois, sans effort.* | Centré sur le bénéfice direct et le soulagement du bailleur. | Chronologie du mois en cours : encaissements validés et quittance téléchargeable en 1 clic. |
| **Hero 3** | **Exception First** | *RentReady suit vos locations. Vous gérez seulement les exceptions.* | Différenciation radicale RentReady : ce qui est payé s'efface, l'anomalie prend la place. | Démonstration interactive directe : 1 200 € reçus sur 1 600 €, 400 € d'écart surligné en ambre. |
| **Hero 4** | **Product First** | *La gestion locative sans tableur.* | Approche type Linear / Stripe : texte minimaliste en haut, produit réel occupant 80% de la hauteur. | Interface complète du tableau de bord avec les baux actifs et les transactions réelles. |
| **Hero 5** | **Hybrid** | *Gérez vos locations sans tableur. Agissez uniquement sur l'exception.* | Synthèse idéale : catégorie explicite + promesse de soulagement + mécanique d'exception. | Vue combinée : statut mensuel calme + bloc d'action contextuelle sur l'impayé. |

---

## 2. Spécification Détaillée des 5 Héros

### HERO 1 — CATEGORY FIRST (Compréhension Maximale)
- **Objectif :** Obtenir 100 % de compréhension en moins de 3 secondes.
- **H1 :** *Le logiciel de gestion locative des propriétaires indépendants.*
- **Sous-titre :** *Suivez vos loyers, éditez vos quittances en un clic et soyez alerté uniquement en cas d'anomalie. Conforme à la loi de 1989.*
- **CTA Principal :** `Commencer l'essai gratuit` (`/register`)
- **Micro-copy sous CTA :** `14 jours offerts · Sans carte bancaire · Dès 9 €/mois pour 3 logements`
- **CTA Secondaire :** `Découvrir les fonctionnalités` (ancre fluide `#features`)
- **Visualisation produit :**
  - **Desktop (1440px) :** Vue d'ensemble sobre du patrimoine : 3 biens (Paris 11e, Lyon 6e, Nantes Centre). Montant mensuel global (3 350 €), badge de conformité calme.
  - **Mobile (390px & 360px) :** Titre compact sur 3 lignes, CTA pleine largeur, puis directement dans le premier viewport : carte récapitulative du mois montrant « 3 logements loués · 3 350 € attendus ».

---

### HERO 2 — OUTCOME FIRST (Bénéfice Utilisateur)
- **Objectif :** Vendre la fin de la corvée mensuelle de pointage et de rédaction.
- **H1 :** *Vos loyers suivis, vos quittances prêtes. Chaque mois, sans effort.*
- **Sous-titre :** *RentReady enregistre vos encaissements, prépare vos quittances conformes à la loi de 1989 et surveille vos dates de révision IRL.*
- **CTA Principal :** `Créer mon compte en 3 minutes` (`/register`)
- **Micro-copy sous CTA :** `Essai 14 jours sans engagement · Pas de carte demandée`
- **CTA Secondaire :** `Calculer une révision IRL` (`/outils/calculateur-irl`)
- **Visualisation produit :**
  - **Desktop (1440px) :** Ligne de temps du 5 du mois : Virement de 950 € reçu $\rightarrow$ Quittance PDF générée immédiatement $\rightarrow$ Bouton `Télécharger le PDF` actif.
  - **Mobile (390px & 360px) :** Encart compact montrant la quittance du mois de Louise Bernard prête avec le bouton d'action direct.

---

### HERO 3 — EXCEPTION FIRST (Différenciation RentReady)
- **Objectif :** Démontrer visuellement la thèse RentReady : *« Ce qui va bien devient silencieux »*.
- **H1 :** *RentReady suit vos locations. Vous gérez seulement les exceptions.*
- **Sous-titre :** *Ce qui est réglé s'archive sans bruit. Lorsqu'un retard ou un paiement partiel survient, vous disposez immédiatement de la bonne action.*
- **CTA Principal :** `Tester sur vos logements` (`/register`)
- **Micro-copy sous CTA :** `14 jours sans carte · Vos loyers suivis au centime près`
- **CTA Secondaire :** `Tester l'exception en direct` (déclenche l'interaction sur place)
- **Visualisation produit :**
  - **Desktop (1440px) :** Démonstration interactive temps réel :
    - Ligne 1 : Paris 11e — 1 100 € réglé (compact, vert forêt calme, silencieux).
    - Ligne 2 : Lyon 3e — 1 600 € attendu, 1 200 € reçu $\rightarrow$ **Alerte ambre : « Manque 400 € »** avec bouton `Relancer` ou `Régulariser`.
    - Ligne 3 : Nantes — 650 € réglé.
    - Clic sur `Régulariser les 400 €` $\rightarrow$ Le loyer passe à 1 600 € réglé, la ligne se rétracte et la signature apparaît : *« Tout ce qui va bien devient silencieux. »*
  - **Mobile (390px & 360px) :** La ligne d'exception de Lyon (1 200 € / 1 600 €) est visible dès le premier écran sous le bouton CTA.

---

### HERO 4 — PRODUCT FIRST (Show, Don't Tell)
- **Objectif :** Donner l'impression immédiate d'être déjà dans l'outil de travail (façon Linear).
- **H1 :** *La gestion locative sans tableur.*
- **Sous-titre :** *L'interface calme et précise pour suivre vos loyers, baux et quittances au quotidien.*
- **CTA Principal :** `Démarrer gratuitement` (`/register`)
- **Micro-copy sous CTA :** `Sans carte bancaire · Prêt pour 1 à 10 logements`
- **Visualisation produit :**
  - **Desktop (1440px) :** Capture grandeur nature (1280px de large) du tableau de bord complet RentReady B.1 : barre de navigation supérieure, registre des loyers mensuels, filtres d'état, tableau des encaissements et tiroir d'action.
  - **Mobile (390px & 360px) :** Vue d'application native épurée : onglet « Ce mois-ci » avec l'état direct des 3 logements.

---

### HERO 5 — HYBRID (Synthèse Équilibrée)
- **Objectif :** Réunir la clarté catégorielle pour le profane et la puissance d'attraction de l'exception.
- **H1 :** *Gérez vos locations sans tableur. Agissez uniquement sur l'exception.*
- **Sous-titre :** *RentReady suit vos loyers chaque mois, édite vos quittances en un clic et ne sollicite votre attention qu'en cas d'écart. Conforme loi du 6 juillet 1989.*
- **CTA Principal :** `Essayer gratuitement pendant 14 jours` (`/register`)
- **Micro-copy sous CTA :** `Sans carte bancaire · Configuration en 3 minutes · 9 €/mois pour 3 logements`
- **CTA Secondaire :** `Voir comment ça marche` (défilement vers la démo)
- **Visualisation produit :**
  - **Desktop (1440px) :** Cadre produit équilibré présentant le récapitulatif du mois courant avec le module interactif d'exception intégré.
  - **Mobile (390px & 360px) :** Titre concis, bouton d'inscription proéminent, suivi immédiatement de la fiche du logement nécessitant attention.

---

## 3. Matrice de Respect des Règles Visuelles (Anti-Clichés)

| Règle | Statut sur les 5 Héros B.2 |
| :--- | :--- |
| **Zéro badge décoratif criard** | ✅ Respecté : pas de « 🚀 Nouveau », pas d'eyebrow générique vide. |
| **Maximum 2 CTA** | ✅ Respecté : 1 CTA d'action primaire (`/register`) + au plus 1 lien de démo. |
| **Zéro faux social proof** | ✅ Respecté : aucun avatar fictif, aucune note inventée. |
| **Zéro illustration 3D ou abstraite** | ✅ Respecté : 100% UI réelle ou simplification fidèle. |
| **Zéro gradient criard / néon** | ✅ Respecté : palette B.1 calcaire `#F5F3EF`, vert forêt `#1E3A2F`, encre `#15241F`. |
| **Mobile viewport discipline** | ✅ Respecté : à 390×844 comme à 360×800, le produit est visible dès l'écran 1. |
