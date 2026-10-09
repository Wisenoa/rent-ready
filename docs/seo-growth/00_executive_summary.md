# 00 — Synthèse Exécutive : RentReady SEO Intelligence & Growth Engine

Date : Octobre 2026  
Branche de travail : `audit/seo-growth-engine`  
Périmètre audité : **430 URLs publiques uniques**, code Next.js 15, scripts d'audit, bases de données statiques et SERPs Google France

---

## 1. Verdict Global

RentReady dispose d'une base technique solide et d'un catalogue de contenus et d'outils particulièrement riche (430 URLs publiques, 119 articles approfondis, 16 outils interactifs en libre accès).

Cependant, **le potentiel d'acquisition organique est actuellement bridé par 3 goulets d'étranglement majeurs** :
1. **Une rupture de conversion sur les outils gratuits :** Plus de la moitié des outils interactifs (dont le générateur de quittances et la lettre de relance d'impayé) ne comportent aucun bouton ni passerelle vers le produit. Les visiteurs consomment la valeur gratuitement et quittent le site.
2. **Un désert de maillage interne dans les articles de blog :** 89,9 % des articles (107 sur 119) n'ont aucun lien interne dans leur texte, créant des impasses de crawl et empêchant la transmission de l'autorité vers les outils et les pages monétaires.
3. **Des anomalies de crédibilité et d'indexation :** La page de comparatif de marché cite des noms de concurrents fictifs (« Apfer », « Tecoo »), tandis que 13 URLs de prototypes de design privés avec `noindex` fuient dans le `sitemap.xml` public.

---

## 2. Couverture des Données & Méthodologie

Conformément à la règle absolue **Zéro donnée inventée** :
- **Inventaire exhaustif reproductible :** Généré par [`scripts/seo/generate_seo_inventory.mjs`](file:///home/ubuntu/rent-ready/scripts/seo/generate_seo_inventory.mjs) en 4 fichiers CSV complets dans `docs/seo-growth/data/`.
- **Search Console :** Explicitée comme `SOURCE UNAVAILABLE`. Aucun volume de recherche ni position Google n'a été inventé. Les classements d'opportunités sont tous labellisés `HYPOTHESIS ONLY (CODE-BACKED)`.
- **Zéro modification de production :** Tous les livrables sont confinés dans `docs/seo-growth/` et `scripts/seo/` sur la branche isolée `audit/seo-growth-engine`.

---

## 3. Top 5 des Constats (Findings)

1. **TECH-01 (Fuite Sitemap Critique) :** 13 URLs de maquettes `/design-preview/*` sont injectées dans le `sitemap.xml` public alors qu'elles sont balisées `noindex`, gaspillant le budget de crawl et provoquant des alertes Google Search Console.
2. **CONV-01 (Rupture des Outils Gratuits) :** Le générateur de quittance (`/outils/generateur-quittance`) et la lettre de relance d'impayé (`/outils/lettre-relance-loyer`) n'ont aucun CTA vers le produit.
3. **MESH-01 (Désert de Liens dans le Blog) :** 107 articles sur 119 ne comportent aucun lien interne in-content (taux d'isolement de 89,9 %).
4. **COMP-01 (Faux Concurrents sur le Comparatif) :** `/comparatif/logiciel-gestion-locative` compare RentReady à des concurrents imaginaires au lieu des leaders réels (Rentila, BailFacile, GérerSeul).
5. **TECH-02 (Crash de la CI SEO) :** Le script CI `meta-validator.js` crashe sur 51 pages car il ne prend pas en charge la fonction App Router `generateMetadata()`.

---

## 4. Top 10 des Actions Business Prioritaires

1. **ACT-01 :** Exclure `/design-preview` du sitemap public dans `scripts/gen-routes.mjs` (Effort: 10 min — Risque: 0).
2. **ACT-02 :** Ajouter l'encart d'automatisation des quittances mensuelles sur `/outils/generateur-quittance` (Effort: 45 min).
3. **ACT-03 :** Remplacer les concurrents fictifs par Rentila, BailFacile et GérerSeul sur la page comparatif (Effort: 1h30).
4. **ACT-04 :** Ajouter l'encart d'alerte et de suivi des paiements sur `/outils/lettre-relance-loyer` (Effort: 45 min).
5. **ACT-05 :** Corriger le crash du script CI `meta-validator.js` sur `generateMetadata()` (Effort: 30 min).
6. **ACT-06 :** Connecter les catégories d'articles de blog aux outils gratuits pertinents via `src/lib/editorial-cta.ts` (Effort: 1h).
7. **ACT-07 :** Créer la page comparative dédiée `/comparatif/rentready-vs-rentila` pour capter les mécontents du freemium (Effort: 2h30).
8. **ACT-08 :** Nettoyer les expressions régulières défaillantes dans `seo-checks/seo-lint.js` (Effort: 15 min).
9. **ACT-09 :** Intégrer un maillage régional transversal sur les 12 métropoles sous encadrement effectif (Effort: 1h30).
10. **ACT-10 :** Fournir le compte de service Google Search Console (`GOOGLE_SERVICE_ACCOUNT_JSON`) en configuration (Action humaine : 10 min).

---

## 5. Architecture du Moteur de Croissance

Un système léger, sans dépendance lourde ni usine à gaz :
- **Scripts d'inventaire :** `scripts/seo/generate_seo_inventory.mjs` (reproductible, exécution < 500 ms).
- **Quality Gate CI :** `pnpm seo:check` validant les balises canoniques, métadonnées, titres et liens morts avant merge.
- **Rituel Hebdomadaire (30 min) :** Extraction du delta GSC le lundi, identification des requêtes en position 4-10, priorisation de 3 à 5 actions chirurgicales.

---

## 6. Prochaine Mission Recommandée

Lancer le **Sprint 1 d'Implémentation & Conversion** portant sur les 4 actions à ROI immédiat :
- Résolution de la fuite sitemap (`ACT-01`) et de la CI (`ACT-05`).
- Intégration des ponts produits sur les deux outils majeurs (`ACT-02` et `ACT-04`).
- Assainissement de la page de comparatif logiciel avec les vrais acteurs de marché (`ACT-03`).
