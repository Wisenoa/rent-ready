# 02 — Audit SEO Technique (Architecture, Crawl & Indexation)

Date : Octobre 2026  
Branche : `audit/seo-growth-engine`  
Périmètre : 430 URLs publiques, App Router Next.js 15, scripts d'audit et configuration serveur

---

## 1. Matrice des Problèmes Techniques Identifiés

| ID | Problème constaté | Gravité | Preuve / Fichier concerné | Impact Business / SEO | Correctif recommandé | Risque | Effort |
| :---: | :--- | :---: | :--- | :--- | :--- | :---: | :---: |
| **TECH-01** | **Fuite de pages prototypes dans le sitemap public** | **CRITIQUE** | `src/data/routes.ts` & `scripts/gen-routes.mjs` (L.43-58) | 13 URLs `/design-preview/*` envoyées à Googlebot dans `sitemap.xml`. Ces pages ont `noindex`, générant des alertes GSC et gaspillant le budget de crawl. | Ajouter `"/design-preview"` dans `PRIVATE_PREFIXES` (`scripts/gen-routes.mjs`) et dans `src/app/robots.ts`. | NUL | 5 min |
| **TECH-02** | **Crash du vérificateur de métadonnées CI** | **MAJEUR** | `seo-checks/meta-validator.js` (L.69-74, 230) | Échec de `pnpm seo:all` avec `TypeError: Cannot read properties of null (reading 'title')` sur 51 pages utilisant la fonction App Router `generateMetadata()`. | Adapter l'extracteur de métadonnées pour gérer `generateMetadata` ou analyser les exports exécutés. | NUL | 30 min |
| **TECH-03** | **Règle H1 défaillante & coquille cyrillique dans `seo-lint.js`** | **MOYEN** | `seo-checks/seo-lint.js` (L.147, L.157) | 1. Faux positifs "No H1 found" sur les H1 multilignes.<br>2. Coquille `вета` à la ligne 157 invalidant le contrôle hiérarchique H1-H6. | 1. Remplacer `.*?` par `[\s\S]*?` dans la détection H1.<br>2. Nettoyer la chaîne `вета` dans la regex de niveau de titre. | NUL | 10 min |
| **TECH-04** | **`link-checker.js` incapable de fonctionner hors ligne** | **MINEUR** | `seo-checks/link-checker.js` (L.31) | Lance des `fetch()` vers `http://localhost:3000` et reporte 150 erreurs quand aucun serveur local ne tourne. | Ajouter un mode d'analyse statique des routes locales (vérification contre `routes.ts`). | NUL | 15 min |
| **TECH-05** | **Absence de maillage géographique latéral (Pages Villes)** | **MAJEUR** | `src/app/(marketing)/gestion-locative/[ville]/page.tsx` | 200 pages villes n'ont aucun lien vers les villes voisines de la même région, créant des branches orphelines. | Ajouter un bloc "Autres villes en [Région]" reliant les 5 villes les plus proches. | FAIBLE | 1 h |

---

## 2. Analyse Approfondie de la Défaillance TECH-01 (Sitemap Leak)

### Constat dans le code réel :
Dans [`scripts/gen-routes.mjs`](file:///home/ubuntu/rent-ready/scripts/gen-routes.mjs#L43-L58), la liste des préfixes exclus de l'indexation est :
```javascript
const PRIVATE_PREFIXES = [
  "/api", "/billing", "/dashboard", "/expenses", "/fiscal",
  "/leases", "/login", "/maintenance", "/offline", "/portal",
  "/properties", "/register", "/settings", "/tenants",
];
```
Le dossier `src/app/design-preview/` contient 13 routes de travail créées pour les phases de design (ex: `/design-preview/a`, `/b`, `/c`, `/b-plus`, `/system-inventory`, `/wave2`, `/b3`, etc.).
Puisque `/design-preview` ne figure pas dans `PRIVATE_PREFIXES` :
1. `gen-routes.mjs` enregistre ces 13 routes dans `src/data/routes.ts`.
2. [`src/app/sitemap.ts`](file:///home/ubuntu/rent-ready/src/app/sitemap.ts) publie ces 13 URLs dans le fichier `sitemap.xml` servi aux moteurs de recherche.
3. Chaque page prototype exporte pourtant :
   ```typescript
   export const metadata = { robots: { index: false, follow: false } };
   ```
4. Résultat : Googlebot reçoit l'ordre simultané d'indexer (via le sitemap) et de ne pas indexer (via la balise meta), déclenchant l'alerte Search Console *"URL envoyée marquée noindex"*.

---

## 3. Analyse de l'Indexabilité & des Canonicals

- **Balise canonique :**  
  Toutes les pages marketing utilisent la fonction centralisée `baseMetadata()` dans [`src/lib/seo/metadata.ts`](file:///home/ubuntu/rent-ready/src/lib/seo/metadata.ts), garantissant :
  - `canonical: https://www.rentready.fr${url}`
  - `og:url: https://www.rentready.fr${url}`
  - `alternates.languages: { fr: ..., "fr-FR": ... }`
- **Normalisation des redirections :**  
  Dans [`next.config.ts`](file:///home/ubuntu/rent-ready/next.config.ts), 18 règles de redirection 301 sont en place pour traiter les anciens doublons et les slugs accentués (ex: `/blog/gestion-compte-banque-s%c3%a9par%c3%a9` → `/blog/gestion-compte-banque-separe`).
- **Données structurées (Schema.org) :**  
  Le script `seo-checks/schema-validator.js` a analysé 100 fichiers : **0 erreur** de syntaxe JSON-LD.
