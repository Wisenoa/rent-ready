# RentReady — Inventaire & Décisions d'Adaptation des Composants B.3

**Source :** `src/app/design-preview/b3/components/`  
**Cible :** `src/components/marketing/home/`  
**Objectif :** Transformer le prototype en composants de production modulaires, typés, accessibles et conformes aux conventions Next.js App Router (RSC en priorité).

---

## 1. Tableau d'Arbitrage des Composants

| Composant B.3 | Rôle en prototype | Statut Migration | Composant de Production | Type (RSC/Client) | Justification & Adaptations requises |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `B3Navbar.tsx` | Barre de navigation sticky avec ancres et CTAs | **ADAPT** | `HomeNavbar.tsx` | **Server Component** | Élimination de `"use client"`. Liens fiabilisés, skip-link vers `#main-content`, CTA `/register`. |
| `B3Hero.tsx` | En-tête avec H1, sous-titre, CTA principal et démo | **ADAPT** | `HomeHero.tsx` | **Server Component** | Le conteneur du hero est un RSC statique pour un LCP optimal. Il embarque la démo interactive client. |
| `B3InteractiveDemo.tsx` | Démonstration dynamique du cycle mensuel | **ADAPT** | `HomeDemo.tsx` | **Client Component** | Données 100% fictives isolées. Mention discrète « Démonstration interactive ». Accessibilité clavier, support `aria-live` pour annoncer la résolution. Zéro appel réseau/API. |
| `B3ProductMoments.tsx` | Signature de marque + 3 moments produit forts | **ADAPT** | `HomeProductMoments.tsx` | **Server Component** | Élimination de `"use client"`. Rendu purement HTML/CSS pour supprimer tout JS client inutile. |
| `B3LegalTrust.tsx` | Section juridique et sécurité sans card soup | **ADAPT** | `HomeTrust.tsx` | **Server Component** | Titre aligné sur la directive : *« Des documents justes, des règles claires. »*. Aucun JS client. |
| `B3FreeTools.tsx` | Passerelle vers les calculateurs en accès libre | **ADAPT** | `HomeTools.tsx` | **Server Component** | Liens canoniques vers `/outils/calculateur-irl` et `/outils/generateur-quittance`. Zéro JS client. |
| `B3Pricing.tsx` | Tarification transparente Starter & Pro avec toggle | **ADAPT** | `HomePricing.tsx` | **Client Component** | Client uniquement pour l'interactivité du toggle Mensuel/Annuel. Liens d'inscription `/register?plan=starter` et `/register?plan=pro`. |
| `B3Faq.tsx` | FAQ concise des bailleurs (4 questions) | **ADAPT** | `HomeFaq.tsx` | **Client Component** | Accordion interactif accessible. Synchronisé avec le composant JSON-LD `FAQPage` pour Google. |
| `B3FinalCta.tsx` | Appel à l'action final avec réassurance | **ADAPT** | `HomeFinalCTA.tsx` | **Server Component** | Purement statique. CTA direct vers `/register`. |
| `B3Footer.tsx` | Pied de page marketing et légal | **ADAPT** | `HomeFooter.tsx` | **Server Component** | Liens SEO internes complets (outils, guides, villes, mentions légales, RGPD, CGU). |
| `B3Homepage.tsx` | Assemblage prototype | **REWRITE** | `src/app/page.tsx` | **Server Component** | La page racine assemble directement les Server Components et Client Components avec injection JSON-LD et métadonnées SEO. |

---

## 2. Règles de Bundle & Code-Splitting

1. **Minimisation de la surface `use client` :**
   - 7 sections sur 10 sont de purs Server Components (`HomeNavbar`, `HomeHero`, `HomeProductMoments`, `HomeTrust`, `HomeTools`, `HomeFinalCTA`, `HomeFooter`).
   - Seuls 3 composants requièrent du JavaScript côté client :
     - `HomeDemo` (résolution interactive au clic / clavier)
     - `HomePricing` (bascule mensuel/annuel)
     - `HomeFaq` (ouverture/fermeture des réponses)
2. **Aucune bibliothèque d'animation lourde :**
   - Zéro dépendance à `framer-motion` sur la homepage. Les transitions de rétraction de la démo utilisent les transitions CSS natives Tailwind (`transition-all duration-200`).
3. **Zéro fuite de données (Data Leak Guard) :**
   - La démonstration ne consomme aucune prop serveur issue de sessions utilisateurs. Les trois logements (Paris 11e, Lyon 3e, Nantes) sont des constantes immuables définies côté client.
