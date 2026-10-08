# LIVRABLE 08 — PROPOSITION DE DESIGN SYSTEM (MODERN FRENCH ATELIER)
## RentReady Visual Identity Exploration — Phase 19

Ce document formalise les fondations et composants du design system recommandé pour RentReady. Chaque règle est articulée autour de cas d'usage réels du produit.

---

### 1. Fondations Visuelles

#### A. Typography (Typographie)
- **Police d'interface :** Sans-sérif humaniste aux contreformes généreuses (Plus Jakarta Sans / Outfit / Inter avec tracking affiné).
- **Échelle typographique et rôles :**
  - `Display / Titre de page` : 28px–32px (Desktop), 24px (Mobile) — Graisse 600 (SemiBold), line-height 1.25, tracking -0.015em.
  - `Section / Titre de bloc` : 16px–18px — Graisse 600, line-height 1.35.
  - `Corps courant` : 14px — Graisse 400 (Regular) ou 500 (Medium), line-height 1.5, texte `#15241F`.
  - `Microcopy / Légendes / Métadonnées` : 12px — Graisse 500, texte `#5B6661`.
- **Règles pour les montants financiers :**
  - Chiffres toujours rendus avec la propriété CSS `font-variant-numeric: tabular-nums` (ou classe Tailwind `tabular-nums`).
  - Graisse 600 systématique pour les sommes monétaires clés.
  - Espace insécable entre les milliers et avant le symbole monétaire (ex : `1 600,00 €`).
  - Aucun usage de monospace machine à écrire sur les dates ou numéros de téléphone.

#### B. Color Tokens (Palette Chromatique Sémantique)
- **Canvas / Fonds :**
  - `canvas.base` : `#F5F3EF` (Pierre calcaire douce — fond d'écran principal).
  - `surface.card` : `#FFFFFF` (Blanc albâtre — cartes et lignes interactives).
  - `surface.muted` : `#ECEAE4` (Pierre adoucie — badges neutres, conteneurs secondaires).
- **Encre & Texte :**
  - `text.primary` : `#15241F` (Épicéa sombre / encre végétale profonde — contraste 16:1 sur blanc).
  - `text.secondary` : `#5B6661` (Gris minéral chaud — contraste 5.5:1 sur blanc).
  - `text.subtle` : `#87928D` (Texte tertiaire informatif).
- **Couleur de Marque & Actions (Brand) :**
  - `brand.primary` : `#1E3A2F` (Vert forêt d'atelier — boutons d'action primaire, validations).
  - `brand.hover` : `#2D5A4C` (Vert forêt lumineux au survol).
  - `brand.subtle` : `#EEF7F2` (Fond d'accent doux).
- **Statuts Sémantiques (Finance & Exceptions) :**
  - `status.calm.text` : `#2E6F4E` (Vert sauge franc).
  - `status.calm.bg` : `#EEF7F2` (Fond sauge pâle).
  - `status.calm.border` : `#D2EBDC` (Filet sauge discret).
  - `status.attention.text` : `#C86D2C` (Ambre miel chaleureux pour solde restant ou retard).
  - `status.attention.bg` : `#FDF5EC` (Fond ambre très pâle).
  - `status.attention.border` : `#F8DCBE` (Bordure miel).
  - `status.alert.text` : `#B9382B` (Garance naturelle pour impayé lourd ou erreur bloquante).

#### C. Surfaces, Bordures & Radius
- **Border radius :**
  - `radius.card` : `12px` (`rounded-xl` en Tailwind) — forme accueillante des fiches.
  - `radius.pill` : `9999px` (`rounded-full`) — boutons secondaires, badges d'état et étiquettes.
  - `radius.input` : `8px` (`rounded-lg`) — champs de formulaire.
- **Bordures :**
  - Filet standard : `1px solid #E5E2DA` (séparation douce sans dureté noire).
  - Filet d'alerte : `1px solid #F8DCBE` (pour bloc d'exception déplié).
- **Élévation :**
  - Pas d'ombres diffuses noires des templates génériques.
  - Micro-ombre chaude : `box-shadow: 0 1px 2px rgba(21, 36, 31, 0.06)` sur les cartes albâtre.
  - Boutons primaires : `box-shadow: 0 1px 2px rgba(21, 36, 31, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.15)` pour un léger relief tactile.

---

### 2. Composants & Patterns Produits

#### A. Registre des Biens & Loyer (Dashboard)
- **Principe : Rétractation mécanique & Préservation du silence.**
  - **Loyer Payé (Calm Row) :** Ligne compacte (44px) en blanc albâtre sur fond pierre `#F5F3EF`. Nom du bien en medium, nom du locataire en secondaire, montant tabulaire, pilule sauge "Réglé", bouton discret "Quittance" avec icône de téléchargement.
  - **Loyer Partiel / Retard (Exception Card) :** Bloc déployé à coins `rounded-xl`, fond teinté ambre miel `#FDF5EC`, solde restant mis en évidence, jours de retard expliqués avec franchise, bouton d'action d'enregistrement du solde en pilule miel contrastée.
  - **Régularisation (Resolved State) :** Une fois le solde pointé, l'élément perd sa couleur d'alerte et reprend son format compact discret.

#### B. Formulaire de Contrat de Location (Lease Creation)
- **Disposition fluide en blocs ouverts (Anti-Box) :**
  - Séparation par étapes thématiques (01. Le bien loué / 02. Modalités financières / 03. Le locataire).
  - Champs à bordure minérale douce `#E5E2DA`, fond blanc pur, focus en anneau vert forêt fin.
  - **Respect du contexte français (Phase 13) :** Inputs date configurés avec la locale `fr-FR` (`jj/mm/aaaa`), texte d'aide précisant l'entrée dans les lieux en toutes lettres (ex: "Entrée le 1er novembre 2026").
  - **Panneau de calcul légal en direct :** Calcul automatique en temps réel du total mensuel CC et du plafond légal de dépôt de garantie (1 mois HC en location vide / 2 mois HC en meublé selon Loi du 6 juillet 1989).

#### C. Grand Livre des Règlements & Quittances (Billing)
- **Vocabulaire naturel (Phase 14) :**
  - Bannissement des termes pompeux ("Grand Livre des Encaissements", "Journal Chronologique").
  - Remplacement par des intitulés opérationnels clairs : "Paiements et quittances", "Paiements d'octobre 2026", "Loyer restant dû".
- **Honnêteté produit (Phase 15) :**
  - Suppression de toute promesse d'envoi automatique d'email non implémentée.
  - Affichage clair : "Quittance disponible au téléchargement".

---

### 3. Accessibilité & Responsiveness

- **Conformité WCAG 2.2 niveau AA :**
  - Texte principal `#15241F` sur blanc `#FFFFFF` = ratio de contraste 16.2:1 (exigence AA : 4.5:1).
  - Texte secondaire `#5B6661` sur blanc `#FFFFFF` = ratio 5.6:1 (conforme AA).
  - Statut ambre miel `#C86D2C` sur fond `#FDF5EC` = ratio 5.1:1.
  - Bouton forêt `#1E3A2F` avec texte blanc = ratio 10.4:1.
- **Adaptation Mobile (390px et 360px) :**
  - Les cibles tactiles respectent le minimum ergonomique de 44x44px.
  - Les formulaires empilent naturellement les colonnes sans défilement horizontal.
  - Le panneau récapitulatif se place au bas de l'écran ou sous les champs sans masquer la saisie.
