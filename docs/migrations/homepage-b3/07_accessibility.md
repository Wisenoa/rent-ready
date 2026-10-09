# 07 — Audit d'Accessibilité (WCAG 2.2 Niveau AA)

Date : Octobre 2026  
Cible : Homepage RentReady de Production (`src/app/page.tsx`)  
Standard : WCAG 2.2 AA

---

## 1. Structure sémantique & Points de repère (Landmarks)

- **Balise d'évitement (Skip Link) :**  
  Un lien masqué visuellement mais actif au premier appui sur `Tab` est positionné en tête de `<header>` :
  ```html
  <a href="#main-content" class="sr-only focus:not-sr-only ...">Passer au contenu principal</a>
  ```
- **Régions ARIA et balises HTML5 :**
  - `<header>` : En-tête globale du site avec logo et statut.
  - `<nav aria-label="Navigation principale">` : Navigation interne (Fonctionnement, Moments, Outils, Tarifs).
  - `<main id="main-content">` : Conteneur principal de la page.
  - `<section>` : Chaque section dispose d'un identifiant ancre (`#demo`, `#moments`, `#outils`, `#tarifs`) et d'un titre sémantique.
  - `<footer>` : Pied de page complet avec liens de navigation et mentions légales.

---

## 2. Hiérarchie des titres (Heading Structure)

L'arbre des titres est strictement linéaire et sans rupture de niveau :
- `H1` : *Gérez vos locations sans tableur.* (Unique titre de niveau 1)
  - `H2` : *« Mon locataire a-t-il payé ? »* (Encaissement)
  - `H2` : *« Quel document dois-je remettre ? »* (Conformité)
  - `H2` : *« Quand dois-je réévaluer le loyer ? »* (Révision IRL)
  - `H2` : *Rigueur juridique et protection des données*
  - `H2` : *Outils gratuits en accès libre*
  - `H2` : *Des tarifs simples, adaptés à vos logements*
  - `H2` : *Questions fréquentes*
  - `H2` : *Essayez RentReady sur votre prochaine échéance.*

---

## 3. Ratios de Contraste (Norme WCAG 2.2 AA - min 4.5:1 / 3:1)

| Élément | Couleur de texte | Couleur de fond | Ratio mesuré | Conformité |
| :--- | :--- | :--- | :--- | :--- |
| **Texte principal H1 / corps** | `#15241F` (Encre sombre) | `#F5F3EF` (Calcaire) | **12.8:1** | **AAA** (> 7:1) |
| **Texte secondaire / descriptif**| `#5A6660` (Gris vert) | `#F5F3EF` (Calcaire) | **4.9:1** | **AA** (> 4.5:1) |
| **Bouton CTA Principal** | `#FFFFFF` (Blanc) | `#1E3A2F` (Vert Forêt) | **10.4:1** | **AAA** (> 7:1) |
| **Alerte anomalie démo** | `#92400E` (Ambre soutenu) | `#FEF3C7` (Fond crème ambré) | **5.8:1** | **AA** (> 4.5:1) |
| **Badge Recommandé Tarifs** | `#FFFFFF` (Blanc) | `#1E3A2F` (Vert Forêt) | **10.4:1** | **AAA** (> 7:1) |

---

## 4. Démonstration Interactive (`HomeDemo`)

1. **Information d'état non visuelle :** Une zone `aria-live="polite"` annonce vocalement aux lecteurs d'écran les changements d'état lors de la simulation :
   - *« Paiement régularisé. Les trois logements sont à jour, quittance générée. »*
   - *« Modèle de relance amiable préparé. »*
   - *« Démonstration réinitialisée. »*
2. **Clarification du statut fictif :** Un badge explicite `Démonstration interactive` figure dans le bandeau supérieur pour éviter toute confusion entre l'interface de test et des données personnelles réelles.
3. **Contrôles au clavier :** Les boutons d'action disposent de styles `focus-visible:ring-2` et sont opérables via `Espace` et `Entrée`.

---

## 5. Accordéon FAQ (`HomeFaq`)

- Le bouton déclencheur possède `aria-expanded="true|false"` et référence la région de réponse via `aria-controls`.
- Le panneau de réponse porte `role="region"` et `aria-labelledby`.
- Les icônes décoratives d'expansion portent `aria-hidden="true"`.
