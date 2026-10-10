# Catalogue des Actifs Visuels — Lokna

Ce catalogue recense l'ensemble des fichiers graphiques officiels, leurs formats, résolutions, modes de rendu et cas d'usage dans le projet.

---

## 1. Fichiers Vectoriels SVG Pures (`/public`)

Tous les fichiers SVG suivants sont des tracés vectoriels natifs purs (`<path d="...">`), sans conteneur rasterisé base64, sans balises `<image>` et sans dépendance de police de caractères distante.

| Fichier | Dimensions ViewBox | Couleurs | Description & Rôle |
| :--- | :--- | :--- | :--- |
| `public/lokna-logo.svg` | `0 0 460 140` | `#0B3B2C`, `#7FA68E` | Logo complet horizontal standard (symbole + lettrage). Navbars, en-têtes web, écrans de connexion. |
| `public/lokna-logo-light.svg` | `0 0 460 140` | `#F8F6F1`, `#7FA68E` | Logo complet horizontal pour fonds sombres. Cartes OG, barres d'action contrastées. |
| `public/lokna-symbol.svg` | `0 0 140 140` | `#0B3B2C`, `#7FA68E` | Symbole architectural isolé (maison dual-tone). Sidebar repliée, icônes d'authentification. |
| `public/lokna-symbol-light.svg` | `0 0 140 140` | `#F8F6F1`, `#7FA68E` | Symbole isolé clair pour conteneurs sombres. |
| `public/lokna-logo-monochrome.svg` | `0 0 460 140` | `currentColor` | Logo complet monochrome adaptatif suivant la couleur de texte courante CSS. |
| `public/lokna-favicon.svg` | `0 0 64 64` | `#0B3B2C`, `#F8F6F1`, `#7FA68E` | Favicon vectoriel sur squircle Deep Green. Rendu net sur tous navigateurs modernes. |
| `public/logo.svg` | `0 0 64 64` | `#0B3B2C`, `#F8F6F1`, `#7FA68E` | Alias canonique pour le favicon et le logo Schema.org / SEO. |

---

## 2. Fichiers Icônes et Favicons Raster (`/public`)

Générés avec haute fidélité via rasterisation pixel-perfect depuis les masters vectoriels.

| Fichier | Résolution | Format | Description & Rôle |
| :--- | :--- | :--- | :--- |
| `public/apple-touch-icon.png` | `180 × 180 px` | PNG 24-bit | Icône d'écran d'accueil iOS Safari et appareils Apple. |
| `public/favicon-32x32.png` | `32 × 32 px` | PNG 24-bit | Favicon standard pour navigateurs de bureau et onglets haute densité. |
| `public/favicon-16x16.png` | `16 × 16 px` | PNG 24-bit | Favicon standard basse résolution (onglets de navigateur). |
| `public/favicon.ico` | Multi-size | ICO | Fichier binaire historique pour navigateurs et crawlers traditionnels. |

---

## 3. Cartes de Partage et Métadonnées Sociales

| Fichier | Résolution | Ratio | Description & Rôle |
| :--- | :--- | :--- | :--- |
| `public/lokna-og.png` | `1200 × 630 px` | 1.91:1 | Carte Open Graph / Twitter Card statique. Fond Night Green (`#061F17`) avec logo Lokna horizontal, baseline en crème et badge d'autorité. |
| `src/app/opengraph-image.tsx` | `1200 × 630 px` | 1.91:1 | Générateur dynamique Next.js Edge (`ImageResponse`) avec branding Lokna Deep Green. |

---

## 4. Source de Vérité et Scripts d'Extraction

- **Source de vérité originale validée** : `public/lokna.png`
- **Script d'extraction et de vectorisation par Bézier** : `scripts/vectorize_lokna.py`
  - Utilise `potrace` (courbes Bézier d'ordre 3) avec paramètres d'optimisation : `--alphamax 1.0 --opttolerance 0.2`.
- **Preuve visuelle de conformité** : `screenshots/lokna_potrace_comparison.png` (superposition visuelle rigoureuse).
