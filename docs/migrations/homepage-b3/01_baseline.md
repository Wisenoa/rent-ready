# RentReady — Baseline de la Homepage Actuelle (Production)

**Date d'audit :** 9 octobre 2026  
**Route auditée :** `/` (`src/app/page.tsx`)  
**Méthode :** Audit DOM et réseau automatisé Playwright (Chromium headless, deviceScaleFactor: 2)  
**Environnement :** Next.js 15.5.9 App Router (Production build / dev isolated)

---

## 1. Métadonnées & Référencement Actuel (SEO Baseline)

| Propriété | Valeur relevée en production |
| :--- | :--- |
| **URL Canonique** | `https://www.rentready.fr` |
| **Balise `<title>`** | `RentReady — Pilotage locatif pour propriétaires bailleurs \| Essai gratuit` |
| **Balise `<meta description>`** | `Du loyer exigible à la quittance certifiée conforme à la loi de 1989. Zéro tableur, détection des paiements et révision IRL connectée à l'INSEE. Essai 14 jours sans carte.` |
| **Open Graph Title** | Identique au title |
| **Open Graph Description** | Identique à la description |
| **Open Graph URL** | `https://www.rentready.fr` |
| **Open Graph Image** | Endpoint dynamique `/api/og?title=...` |
| **Twitter Card** | `summary_large_image` (`@rentready_fr`) |
| **H1 Unique** | `« Vos locations tournent. RentReady s'occupe du suivi. »` |
| **Robots** | `index: true, follow: true` |

---

## 2. Données Structurées (JSON-LD)

La page actuelle injecte deux blocs JSON-LD :
1. **Schema Graph (Organization + WebSite) :**
   - Nom : `RentReady`
   - Description : *« Logiciel de gestion locative nouvelle génération pour propriétaires bailleurs indépendants en France... »*
   - Contact : `contact@rentready.fr`
   - Logo : `https://www.rentready.fr/logo.svg`
   - *Note d'intégrité :* Ne contient aucun faux avis (`AggregateRating` banni suite à un audit précédent car faux).
2. **Schema FAQPage (`mainEntity`) :**
   - 8 questions/réponses générées par `<FaqJsonLd />` dans `src/components/landing/faq-section.tsx`.
   - *Attention Product Truth :* Contient des claims non prouvées ou caduques : « Factur-X », « dispositif fiscal Jeanbrun 2026 », « grand livre ».

---

## 3. Parcours Utilisateur & Funnel de Conversion

- **Bouton d'action principal (CTA Hero) :** `Démarrer l'essai gratuit 14 jours` $\rightarrow$ `/register`
- **Bouton d'action secondaire :** Ancre `#cycle-mensuel`
- **Navigation Navbar (`GlassNav`) :**
  - Liens d'ancres : `#cycle-mensuel`, `#fonctionnalites`, `#simulateurs`, `#tarifs`
  - Connexion : `/login`
  - CTA Navbar : `/register`
- **Liens internes vers outils :**
  - `/outils/calculateur-irl`
  - `/outils/calculateur-depot-garantie`
  - `/outils/generateur-quittance`
  - `/outils/calculateur-charges-locatives`
- **Footer (`MarketingFooter`) :**
  - Liens vers `/pricing`, `/demo`, `/guides`, `/villes`, `/glossaire-immobilier`, `/cgu`, `/mentions-legales`, `/politique-confidentialite`.

---

## 4. Métriques Mesurées de la Page Actuelle

| Métrique | Valeur mesurée `[LAB MEASURED]` | Commentaire |
| :--- | :--- | :--- |
| **Volume de mots (Word count)** | **2 154 mots** | Extrêmement verbeux, répétitions massives. |
| **Hauteur Desktop (1440px)** | **8 180 px** | 10 sections empilées, défilement interminable. |
| **Hauteur Mobile (390px)** | **14 759 px** | Expérience mobile excessivement lourde. |
| **Nombre de nœuds DOM** | **1 842 éléments** | Surcharge DOM importante. |
| **Nombre total de liens `<a>`** | **45 liens** | Nombreux liens d'ancres et liens footer. |
| **Architecture technique** | Server Component avec 7 `dynamic-wrappers` | Dépendances `framer-motion` clientes lourdes. |

---

## 5. Captures de Référence Visuelle (Avant Migration)

- Desktop 1440px : `docs/migrations/homepage-b3/captures/before_1440.png`
- Mobile 390px (iPhone) : `docs/migrations/homepage-b3/captures/before_390.png`

---

## 6. Comportements & Invariants à Préserver Absolument

1. **Routage Next.js :** Page racine `/` (`src/app/page.tsx`), Server Component avec ISR (`revalidate = 3600`).
2. **SEO technique :**
   - URL canonique `https://www.rentready.fr`
   - Balise title et meta description fortes pour la gestion locative
   - JSON-LD `@graph` (`Organization` + `WebSite`)
   - JSON-LD `FAQPage` pour l'affichage des snippets de recherche Google (avec questions conformes à la vérité produit)
   - Liens internes indispensables vers `/outils/calculateur-irl` et les simulateurs
   - Liens légaux dans le footer (`/cgu`, `/mentions-legales`, `/politique-confidentialite`)
3. **Parcours d'inscription :** Tout CTA d'essai gratuit doit router proprement vers `/register` (avec préservation des UTM et sans forcer la carte bancaire).
4. **Accessibilité :** Lien d'évitement `#main` / `#main-content`, conformité des contrastes et de la hiérarchie des titres (un seul H1).
5. **Analytics & Performance :** Ne pas briser Vercel Analytics (`<Analytics />`), Web Vitals (`<WebVitalsProvider />`) ni le bandeau de consentement (`<CookieConsent />`).
