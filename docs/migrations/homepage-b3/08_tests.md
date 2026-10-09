# 08 — Stratégie & Rapport de Tests Automatisés

Date : Octobre 2026  
Branche : `feature/homepage-b3-migration`

---

## 1. Périmètre de Test

La suite de tests mise en place pour la migration B.3 couvre trois niveaux :
1. **Tests unitaires et de cohérence des données (Vitest) :**
   - Fichier : `src/__tests__/lib/homepage-b3-migration.test.ts`
   - Vérifie la stricte conformité des 4 FAQ (absence de termes non prouvés comme Factur-X, Jeanbrun, Grand livre).
   - Vérifie la génération du graphe JSON-LD Schema.org (`Organization`, `WebSite`, `FAQPage`).
   - Vérifie l'égalité stricte des montants Starter/Pro affichés avec `PLANS` dans `src/lib/stripe.ts` (9 € / 89 € et 15 € / 149 €).
   - Vérifie la robustesse de l'émetteur d'événements analytiques côté Node / SSR (zéro crash).

2. **Tests d'intégration et parcours existants (Playwright) :**
   - Fichier : `src/__tests__/e2e/marketing.spec.ts`
   - Vérifie le chargement de la homepage sans aucune erreur console Javascript.
   - Vérifie la conformité de la balise `<title>`.
   - Vérifie la présence des boutons CTA menant vers `/register`.
   - Vérifie l'accès à la page de connexion `/login`.

3. **Tests end-to-end dédiés aux widgets B.3 (Playwright) :**
   - Fichier : `src/__tests__/e2e/homepage-b3-flow.spec.ts`
   - Valide la hiérarchie H1 unique et le skip link d'accessibilité.
   - Valide la machine à états de la démonstration interactive (transition d'état *Attention* vers *Resolved* lors du clic sur « Régulariser »).
   - Valide la bascule tarifaire Mensuel / Annuel (passage dynamique des montants de 9 € / 15 € à 89 € / 149 €).
   - Valide l'accordéon accessible FAQ (`aria-expanded`, visibilité des panneaux).

---

## 2. Commandes d'exécution

```bash
# Exécuter les tests unitaires de la migration :
pnpm vitest run src/__tests__/lib/homepage-b3-migration.test.ts

# Exécuter les tests E2E marketing :
PLAYWRIGHT_BASE_URL=http://localhost:4908 npx playwright test src/__tests__/e2e/marketing.spec.ts

# Exécuter les tests E2E des flux B.3 :
PLAYWRIGHT_BASE_URL=http://localhost:4908 npx playwright test src/__tests__/e2e/homepage-b3-flow.spec.ts
```
