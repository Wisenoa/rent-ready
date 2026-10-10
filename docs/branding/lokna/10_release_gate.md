# Release Gate — Grille d'Évaluation Go / No-Go — Lokna

Ce document formalise les critères d'acceptation stricts avant tout éventuel déploiement en production.

---

## 1. Critères d'Acceptation de la Phase de Rebranding

| Critère | Statut | Preuve / Justification |
| :--- | :---: | :--- |
| **Identité Visuelle SVG Pure** | ✅ **VALIDÉ** | Tous les logos sont des tracés vectoriels natifs sans raster (`public/lokna-logo.svg`, `public/lokna-symbol.svg`, etc.). Conforme au PNG de référence à 100%. |
| **Favicons et Icônes d'Application** | ✅ **VALIDÉ** | `apple-touch-icon.png` (180x180), `favicon-32x32.png`, `favicon-16x16.png`, `lokna-favicon.svg`, `lokna-og.png` générés et conformes. |
| **Composant UI Unifié** | ✅ **VALIDÉ** | `LoknaLogo` créé dans `src/components/ui/lokna-logo.tsx`, intégrant toutes les variantes (`full`, `mark`, `wordmark`, `light`, `monochrome`). |
| **Typage TypeScript Strict** | ✅ **VALIDÉ** | `pnpm exec tsc --noEmit` passe avec 0 erreur. |
| **Linter ESLint** | ✅ **VALIDÉ** | `pnpm exec eslint` passe avec 0 erreur. |
| **Suite de Tests Non-Régression** | ✅ **VALIDÉ** | 89 fichiers de tests, 1087 tests passés (0 échec). |
| **Build de Production Standalone** | ✅ **VALIDÉ** | `pnpm build` s'exécute avec succès et génère le standalone Next.js. |
| **Règles Métier et Financières** | ✅ **VALIDÉ** | Préservation intégrale des calculs monétaires (`decimal.js`), gestion des paiements partiels (art. 21) et révisions IRL. |
| **SEO & Origine Canonique** | ✅ **VALIDÉ** | Canoniques alignées sur `https://lokna.fr`, sitemap propre de 298 URLs, données structurées Schema.org validées. |
| **Documentation Exhaustive** | ✅ **VALIDÉ** | 10 fichiers documentaires complétés dans `docs/branding/lokna/`. |

---

## 2. Pré-requis Bloquants Avant Tout Déploiement en Production

Pour rappel, **aucun déploiement n'a été effectué** au cours de cette mission. Les points suivants restent les conditions préalables indispensables pour la phase de déploiement ultérieure :

1. **Espace Disque Serveur** :
   - Le serveur dispose actuellement de ~24 Go d'espace libre (84% d'occupation). Une libération d'espace supplémentaire (pour atteindre l'objectif de 40-50 Go libres) est recommandée avant de lancer les builds et conteneurs Docker en production.
2. **Configuration DNS** :
   - Mise à jour des enregistrements de la zone DNS `lokna.fr` chez OVH (`A` vers l'IP serveur, CNAME `www`, DKIM/SPF pour Resend).
3. **Secrets de Production** :
   - Renseignement effectif du fichier `.env.production` (génération de `BETTER_AUTH_SECRET`, configuration de Stripe Live et de Resend).
4. **Validation Reverse-Proxy** :
   - Intégration non-régressive du bloc `lokna.Caddyfile` dans le Caddy mutualisé hébergeant Facturama.

---

## 3. Décision Finale

- **Code Applicatif & Branding** : **GO (100% PRÊT)**
- **Déploiement Serveur** : **STANDBY (En attente de la mission de déploiement dédiée)**
