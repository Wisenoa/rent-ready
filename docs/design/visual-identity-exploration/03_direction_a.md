# LIVRABLE 03 — DIRECTION A : SIGNALÉTIQUE FONCIÈRE (PRAGMATIC UTILITY)
## RentReady Visual Identity Exploration — Phase 6

### 1. Vision & Déclaration d'Intention
La Direction A aborde RentReady comme un **instrument de précision et d'utilité publique foncière**.  
Elle puise ses racines dans l'excellence de la signalétique et des systèmes d'information européens (Adrian Frutiger, Jean Widmer, Centre Pompidou, RATP/SNCF) et dans la rigueur d'outils contemporains comme Linear et Pennylane.  
Elle refuse le décorum : chaque élément graphique est un repère, chaque couleur est un signal opérationnel.

---

### 2. Spécifications du Système Visuel

#### A. Palette Chromatique
- **Fond d'application (Canvas) :** `#F8F9FA` (Gris minéral technique, propre et neutre).
- **Surfaces interactives / Cartes :** `#FFFFFF` (Blanc technique pur).
- **Surfaces secondaires / Volets :** `#F1F5F9` (Gris ardoise clair).
- **Filets de structure :** `#E2E8F0` (Séparateur 1px strict).
- **Texte primaire (Encre) :** `#0F172A` (Ardoise profonde, contraste 13:1).
- **Texte secondaire :** `#64748B` (Gris acier informatif).
- **Couleur d'accent / Action primaire :** `#1D4ED8` (Bleu cobalt signal, net, franc, officiel).
- **Signal d'état Calme (Payé) :** `#16A34A` (Vert signal franc sur fond `#F0FDF4`, bordure `#BBF7D0`).
- **Signal d'état Attention (Partiel / Retard) :** `#D97706` (Ambre signal sur fond `#FFFBEB`, bordure `#FDE68A`).
- **Signal d'état Urgent (Impayé lourd) :** `#DC2626` (Rouge arrêt).

#### B. Typographie
- **Famille principale :** Sans-sérif technique à contreformes ouvertes (Inter / Frutiger spirit).
- **Titrage :** Corps 24px à 30px, graisse 700 (Bold), tracking -0.02em, hauteur de ligne stricte. Zéro empattement, zéro fioriture.
- **Données financières :** `tabular-nums font-semibold text-slate-900`, séparateur d'espace insécable pour les milliers, symbole `€` régulier.
- **Labels et repères :** `text-xs font-semibold text-slate-500 uppercase tracking-wide` (utilisé uniquement comme repère de colonne ou d'index, jamais comme paragraphe).

#### C. Géométrie & Surfaces (Anti-Card Architecture)
- **Border radius :** `rounded-md` (6px) pour les boutons et contrôles ; `rounded-lg` (8px) pour les conteneurs d'exception.
- **Absence de Card Soup :** Les lignes de loyers réglés ne sont PAS des cartes individuelles entourées de vide. Elles forment un tableau continu rythmé par des micro-filets de 1px.
- **Élévation :** Pas d'ombres diffuses. Micro-ombre technique `box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05)` réservée aux éléments en surplomb.

#### D. Traitement des États
- **Calm :** Ligne de 40px, texte régulier, indicateur vert pastille géométrique carrée ou ronde de 8px, bouton quittance texte discret à droite.
- **Attention (Exception) :** Bandeau déployé avec liseré gauche franc de 4px (`border-l-4 border-l-amber-500`), typographie ardoise, calcul explicite du reste à recouvrer et bouton d'action d'enregistrement direct.
- **Resolved :** Rétractation immédiate avec disparition du liseré ambre, reprise de la ligne neutre.

#### E. Formulaires (Création de Bail)
- Pas de gros conteneur monobloc. Disposition en grille ouverte guidée par un rail technique latéral.
- Champs à fond blanc et bordure `#CBD5E1`, surbrillance cobalt au focus.
- Synthèse financière persistante sous forme de panneau de calcul à droite (ou en tête sur mobile) calculant en direct le loyer charges comprises et le plafond légal de dépôt.
