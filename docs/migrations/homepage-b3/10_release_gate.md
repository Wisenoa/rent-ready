# 10 — Grille de Contrôle Pré-Déploiement (Release Gate)

Date : Octobre 2026  
Branche de travail : `feature/homepage-b3-migration`  
Statut actuel : **PHASE A (Implémentation & Validation) — 100 % ACHEVÉE**  
Statut déploiement : **EN ATTENTE D'AUTORISATION HUMAINE EXPLICITE**

---

## 1. Grille de Conformité Formelle

| Critère | Exigence | Statut | Preuve vérifiée |
| :--- | :--- | :---: | :--- |
| **Product Truth** | Zéro mention de Factur-X, simulateur Jeanbrun ou grand livre | **VALIDÉ** | Audit du code, zéro allégation spéculative |
| **Vérité Métier** | Essai 14j sans CB, Art. 21 quittance/reçu, Art. 17-1 INSEE IRL | **VALIDÉ** | `register-actions.ts`, `quittance-actions.tsx`, `irl-calculator.ts` |
| **Tarifs Réels** | Starter 9 €/89 €, Pro 15 €/149 € identiques à Stripe | **VALIDÉ** | `src/lib/stripe.ts` (`PLANS`), test unitaire Vitest passant |
| **SEO — Metadata** | `<title>`, meta description, canonical, OpenGraph, Twitter | **VALIDÉ** | `<title>Logiciel de gestion locative pour propriétaires bailleurs</title>` |
| **SEO — Schema.org** | JSON-LD `@graph` avec Organization, WebSite et FAQPage | **VALIDÉ** | Test de validation et rendu HTML vérifié |
| **Performance** | Réduction drastique du DOM et volume textuel | **VALIDÉ** | DOM : 524 (-71.5 %), Hauteur : 3 968 px (-51.5 %) |
| **Accessibilité** | WCAG 2.2 AA (Skip-link, aria-live, contrastes > 4.5:1) | **VALIDÉ** | Audit 07, contrastes vérifiés (12.8:1 sur corps de texte) |
| **Architecture** | Server Components majoritaires, hydratation isolée | **VALIDÉ** | 7 RSC / 3 Client Components |
| **Analytics** | Événements conformes RGPD, zéro PII, conversion instrumentée | **VALIDÉ** | `src/lib/analytics/homepage-tracker.ts` |
| **Tests Unitaires** | Vitest au vert sur l'intégrité de la migration | **VALIDÉ** | `src/__tests__/lib/homepage-b3-migration.test.ts` (4/4 pass) |
| **Tests E2E** | Playwright au vert sur les parcours marketing et widgets B.3 | **VALIDÉ** | `marketing.spec.ts` (6/6 pass), `homepage-b3-flow.spec.ts` (4/4 pass) |
| **Compilation** | TypeScript strict sans erreur | **VALIDÉ** | `pnpm exec tsc --noEmit` code de sortie 0 |
| **Linters** | ESLint sans warning ni erreur | **VALIDÉ** | `pnpm exec eslint` code de sortie 0 |
| **Réversibilité** | Procédure de rollback atomique documentée | **VALIDÉ** | Aucun composant ancien supprimé, rollback en 1 commande |

---

## 2. Décision Finale Phase A

- [x] Implémentation terminée sans compromis sur la DA B.1 ni les règles de vérité produit.
- [x] Toutes les captures multi-résolutions générées (`after_1440`, `after_1920`, `after_768`, `after_390`, `after_360`, `demo_before`, `demo_resolved`).
- [x] Galerie visuelle comparative créée dans `docs/migrations/homepage-b3/gallery.html`.
- [x] **Arrêt strict :** Aucun push sur `master` ni déploiement en production sans accord explicite du responsable produit / technique.
