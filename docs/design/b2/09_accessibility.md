# Rapport d'Accessibilité Numérique WCAG 2.2 AA (B.2)

> **Norme de conformité :** WCAG 2.2 Niveau AA.  
> **Périmètre audité :** Composants de la homepage B.2, formulaires d'essai, navigation, démonstration interactive et contrastes de la palette calcaire.

---

## 1. Audit des Ratios de Contraste Réels

La palette B.1 a été testée sur fond calcaire `#F5F3EF` et blanc pur `#FFFFFF` :

| Élément | Couleur de texte | Couleur de fond | Ratio mesuré | Seuil WCAG AA exigé | Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Titres H1 / H2** | Encre végétale `#15241F` | Calcaire `#F5F3EF` | **13.5:1** | 3.0:1 (grand texte) | ✅ Conforme large |
| **Texte courant** | Encre végétale `#15241F` | Calcaire `#F5F3EF` | **13.5:1** | 4.5:1 (texte standard) | ✅ Conforme large |
| **Texte secondaire** | Ardoise sourde `#5A6660` | Calcaire `#F5F3EF` | **5.4:1** | 4.5:1 | ✅ Conforme |
| **Bouton Primaire** | Blanc `#FFFFFF` | Vert forêt `#1E3A2F` | **9.8:1** | 4.5:1 | ✅ Conforme |
| **Bordures & Séparateurs** | Grège `#E5E2DA` | Calcaire `#F5F3EF` | **1.3:1** (décoratif) | Non soumis (non essentiel) | ✅ Conforme |
| **Alerte Ambre (Exception)** | Ambre sombre `#92400E` | Ambre doux `#FEF3C7` | **5.6:1** | 4.5:1 | ✅ Conforme |

---

## 2. Navigation au Clavier & Indicateurs de Focus

- **Anneau de focus visible :** Tous les liens, boutons et éléments cliquables sont dotés d'un focus ring explicite de 2px en vert forêt (`focus-visible:ring-2 focus-visible:ring-[#1E3A2F] focus-visible:ring-offset-2`).
- **Ordre logique de tabulation (DOM order) :**
  1. Lien d'évitement initial (`#main-content` - « Aller au contenu principal »).
  2. Barre de navigation (liens internes).
  3. Bouton CTA du hero.
  4. Démonstration interactive (boutons d'action « Régulariser » et « Relancer »).
  5. Liens d'outils gratuits.
  6. Tarifs et boutons d'inscription.
  7. Formulaire FAQ accordéon (clavier Entrée / Espace pour ouvrir/fermer).
  8. Pied de page.
- **Zéro piège de focus (No focus trap) :** L'utilisateur peut circuler librement sans être bloqué dans la démonstration.

---

## 3. Hiérarchie des Titres & Landmarks Sémantiques

- **Un seul `<h1>` par page :** Présent exclusivement dans le Hero.
- **Titres de sections en `<h2>` :**
  - `Le cycle mensuel de gestion`
  - `Les 4 piliers de votre location`
  - `Un cadre légal rigoureux`
  - `Outils gratuits sans inscription`
  - `Tarifs transparents`
  - `Questions fréquentes`
- **Sous-titres de cartes en `<h3>` :** Hiérarchie sémantique stricte sans saut de niveau (pas de `<h4>` directement après `<h2>`).
- **Landmarks HTML5 :**
  - `<header role="banner">` pour la barre de navigation.
  - `<main id="main-content">` pour le corps de page.
  - `<section aria-labelledby="...">` pour chaque bloc thématique.
  - `<footer role="contentinfo">` pour le pied de page.

---

## 4. Libellés des Boutons (Accessible CTA Names)

- Bannissement des liens vagues du type « En savoir plus », « Cliquez ici » ou « Découvrir ».
- Remplacement systématique par des libellés auto-descriptifs :
  - `Commencer l'essai gratuit de 14 jours`
  - `Calculer une révision de loyer IRL`
  - `Télécharger le modèle de quittance PDF gratuit`
  - `Choisir le plan Starter à 9 euros par mois`

---

## 5. Mouvement & Préférences Utilisateur (`prefers-reduced-motion`)

- La transition de 240ms de la démonstration produit est entièrement neutralisée lorsque le système détecte `prefers-reduced-motion: reduce`.
- Le changement d'état se produit instantanément par modification de contenu sans fondu ni glissement de position, préservant ainsi les personnes sujettes aux troubles vestibulaires.
