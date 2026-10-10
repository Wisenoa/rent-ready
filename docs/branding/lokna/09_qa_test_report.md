# Rapport d'Assurance Qualité & Tests de Non-Régression — Lokna

**Date d'exécution** : 10 Octobre 2026  
**Branche** : `feat/lokna-rebranding`  
**Environnement de test** : Node.js 20, Next.js 15 App Router, Vitest, TypeScript 5.8  

---

## 1. Synthèse Globale des Contrôles

| Type de Test / Contrôle | Commande Exécutée | Résultat | Détails / Métriques |
| :--- | :--- | :--- | :--- |
| **Vérification Typage Strict** | `pnpm exec tsc --noEmit` | **SUCCÈS (Code 0)** | 0 erreur TypeScript sur l'ensemble du projet. |
| **Linter Applicatif** | `pnpm exec eslint` | **SUCCÈS (Code 0)** | 0 erreur, 13 avertissements acceptés (hooks RHF / images locales). |
| **Tests Unitaires & Domaine** | `pnpm vitest run src/__tests__/lib/` | **SUCCÈS (Code 0)** | **89 fichiers de tests validés**<br>**1087 tests passés avec succès** (0 échec). |
| **Tests HTML Rendu & SEO** | `src/__tests__/lib/rendered-html.test.ts` | **SUCCÈS (Code 0)** | 171 tests passés sur serveur standalone de production. |
| **Tests Cohérence Tarifs & Sitemaps** | `src/__tests__/lib/pricing-consistency.test.ts` | **SUCCÈS (Code 0)** | 17 tests passés. |
| **Tests Intégrité Homepage B.3** | `src/__tests__/lib/homepage-b3-migration.test.ts` | **SUCCÈS (Code 0)** | 4 tests passés. |
| **Compilation de Production** | `pnpm build` | **SUCCÈS (Code 0)** | 298 routes statiques/SSG générées sans erreur de compilation. |

---

## 2. Invariants Métier & Financiers Validés

1. **Calculs Monétaires (`decimal.js`)** :
   - Rapprochement bancaire au centime près.
   - Ventilation stricte loyer principal nu / provisions pour charges.
   - Zéro arrondissement à virgule flottante sur l'ensemble des suites comptables.
2. **Règle Légale Article 21 (Quittances & Acomptes)** :
   - Paiement 100% ➔ Quittance libératoire complète générée.
   - Paiement partiel (< 100%) ➔ Reçu d'acompte émis avec solde résiduel clairement affiché. Aucune quittance complète indue.
3. **Formule INSEE Révision Annuelle IRL** :
   - Application de la formule officielle : `Nouveau loyer = Ancien loyer × (IRL_n / IRL_n-1)`.
   - Indexation automatique selon les derniers indices officiels publiés.

---

## 3. Conformité SEO Technique & Schema.org

1. **Balises Canoniques** : 100% des pages publiques pointent sur `https://lokna.fr/...`.
2. **Titres Dédupliqués** : Aucun dédoublement de suffixe (`"Page | Lokna"` uniforme).
3. **Sitemap XML** : 298 URLs publiques indexables, 0 route privée fuyante, 0 duplication.
4. **Graph Schema.org** : Structure JSON-LD `Organization`, `WebSite`, `SoftwareApplication` conforme aux exigences Google Rich Results.
