# 12 — Top 10 des Actions d'Exécution par ROI & Effort

Date : Octobre 2026  
Branche : `audit/seo-growth-engine`  
Périmètre : Plan d'action priorisé, prêt pour la mise en œuvre après validation humaine

---

## 1. Matrice Décisionnelle Impact / Effort

```text
  IMPACT
    ▲
    │  [ACT-01] Sitemap leak        [ACT-02] CTA Générateur quittance
    │  [ACT-05] Fix CI validator    [ACT-03] Vrais concurrents comparatif
    │                               [ACT-04] CTA Lettre relance
    │                               [ACT-06] CTA contextuel blog
    │                               [ACT-07] Page RentReady vs Rentila
    │
    │  [ACT-08] Fix regex seo-lint  [ACT-09] Maillage latéral 12 villes
    │                               [ACT-10] Setup credentials GSC
    └──────────────────────────────────────────────────────────────► EFFORT
```

---

## 2. Tableau Détaillé des 10 Actions Prioritaires

| ID | Action | Catégorie | Fichiers cibles | Constat résolu | Effort estimé | Risque | Impact Business & SEO |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: | :---: |
| **ACT-01** | **Bloquer les pages `/design-preview` dans le sitemap public** | Technique | [`scripts/gen-routes.mjs`](file:///home/ubuntu/rent-ready/scripts/gen-routes.mjs), [`src/app/robots.ts`](file:///home/ubuntu/rent-ready/src/app/robots.ts) | Élimine les 13 URLs privées `noindex` envoyées à Googlebot dans `sitemap.xml`. | 10 min | Nul | **IMMÉDIAT** (Hygiène de crawl) |
| **ACT-02** | **Ajouter l'encart d'automatisation sur le générateur de quittance** | Conversion | [`src/app/(marketing)/outils/generateur-quittance/page.tsx`](file:///home/ubuntu/rent-ready/src/app/(marketing)/outils/generateur-quittance/page.tsx) | Met fin à la fuite d'utilisateurs qui téléchargent sans découvrir RentReady. | 45 min | Faible | **TRÈS ÉLEVÉ** (Activation qualifiée) |
| **ACT-03** | **Remplacer les concurrents fictifs par les vrais acteurs de marché** | Contenu / Confiance | [`src/app/(marketing)/comparatif/logiciel-gestion-locative/page.tsx`](file:///home/ubuntu/rent-ready/src/app/(marketing)/comparatif/logiciel-gestion-locative/page.tsx) | Remplace « Apfer » et « Tecoo » par Rentila, BailFacile, GérerSeul avec analyse loyale. | 1 h 30 | Faible | **TRÈS ÉLEVÉ** (Crédibilité & Taux de clic) |
| **ACT-04** | **Ajouter l'encart d'alerte impayé sur l'outil lettre de relance** | Conversion | [`src/app/(marketing)/outils/lettre-relance-loyer/page.tsx`](file:///home/ubuntu/rent-ready/src/app/(marketing)/outils/lettre-relance-loyer/page.tsx) | Propose l'automatisation des relances bancaires dès la copie du courrier. | 45 min | Faible | **ÉLEVÉ** (Alignement valeur produit) |
| **ACT-05** | **Corriger le crash de `meta-validator.js` sur `generateMetadata()`** | CI / Outillage | [`seo-checks/meta-validator.js`](file:///home/ubuntu/rent-ready/seo-checks/meta-validator.js) | Répare le script de validation qui crashe sur 51 pages App Router. | 30 min | Nul | **ÉLEVÉ** (Intégrité des tests CI) |
| **ACT-06** | **Mapper les catégories d'articles de blog vers les outils gratuits adéquats** | Maillage / UX | [`src/lib/editorial-cta.ts`](file:///home/ubuntu/rent-ready/src/lib/editorial-cta.ts) | Remplace le bouton générique brut `/register` par l'outil pertinent (IRL, Quittance, Bail). | 1 h | Faible | **ÉLEVÉ** (Valorisation du corpus blog) |
| **ACT-07** | **Créer la page comparative ciblée `/comparatif/rentready-vs-rentila`** | Acquisition | `src/app/(marketing)/comparatif/rentready-vs-rentila/page.tsx` | Capter les recherches de substitution du leader historique (alternative Rentila). | 2 h 30 | Faible | **ÉLEVÉ** (Trafic à très forte intention) |
| **ACT-08** | **Corriger les regex H1 multiligne et la coquille cyrillique dans `seo-lint.js`** | CI / Lint | [`seo-checks/seo-lint.js`](file:///home/ubuntu/rent-ready/seo-checks/seo-lint.js) | Supprime les faux positifs H1 et nettoie la règle hiérarchique H1-H6. | 15 min | Nul | **MOYEN** (Fiabilité du linter) |
| **ACT-09** | **Intégrer le maillage latéral sur les 12 métropoles sous encadrement** | Maillage | [`src/app/(marketing)/gestion-locative/[ville]/page.tsx`](file:///home/ubuntu/rent-ready/src/app/(marketing)/gestion-locative/%5Bville%5D/page.tsx) | Relie les communes limitrophes d'une même région (ex: Paris ↔ banlieues proches). | 1 h 30 | Faible | **MOYEN** (Désenclavement géographique) |
| **ACT-10** | **Activer le compte de service Google Search Console en environnement** | Données | `GOOGLE_SERVICE_ACCOUNT_JSON` dans `.env.local` | Action humaine nécessaire pour débloquer les positions réelles et clics. | 10 min | Nul | **FONDAMENTAL** (Alimente le moteur de croissance) |

---

## 3. Découpage Recommandé pour l'Implémentation

- **Sprint 1 (Immédiat — 1 heure) :** Correctifs techniques d'hygiène et CI (**ACT-01**, **ACT-05**, **ACT-08**).
- **Sprint 2 (Priorité conversion — 3 heures) :** Passerelles produits sur les outils et blog (**ACT-02**, **ACT-04**, **ACT-06**).
- **Sprint 3 (Autorité & Concurrence — 4 heures) :** Refonte comparatif marché et page Rentila (**ACT-03**, **ACT-07**).
- **En parallèle :** Configuration du compte de service Search Console par l'administrateur (**ACT-10**).
