# 13 — Architecture du Moteur de Croissance SEO (Growth Engine)

Date : Octobre 2026  
Branche : `audit/seo-growth-engine`  
Statut : **ARCHITECTURE LÉGÈRE & MODULAIRE (SANS FRAMEWORK COMPLEXE NI DÉPENDANCE LOURDE)**

---

## 1. Principes Directeurs de l'Architecture

Conformément à AGENTS.md n°25 (*Dependencies*) et n°37 (*Product honesty*) :
1. **Zéro framework d'agent lourd :** Pas de dépendance tierce complexe (LangChain, AutoGPT, CrewAI). Tout repose sur des scripts Node.js natifs (`.mjs`) ultra-rapides et déterministes.
2. **Reproductibilité totale :** N'importe quel développeur ou agent peut relancer l'inventaire en 1 commande locale :
   ```bash
   node scripts/seo/generate_seo_inventory.mjs
   ```
3. **Sécurité d'automatisation stricte :** Le moteur propose, audite et contrôle. Il **n'écrit jamais directement en production** sans revue humaine préalable.

---

## 2. Schéma Fonctionnel du Pipeline SEO

```text
               SOURCES DE VÉRITÉ
     ┌───────────────────┬───────────────────┐
     ▼                   ▼                   ▼
 [Code Next.js]     [Markdown CMS]     [Google Search Console]
 (Routes, Meta)     (119 Articles)     (API via Service Account)
     │                   │                   │
     └───────────────────┼───────────────────┘
                         ▼
             SCRIPTS D'INTELLIGENCE SEO (scripts/seo/)
    ┌────────────────────────────────────────────────────────┐
    │ 1. generate_seo_inventory.mjs (Inventaire URLs & Liens) │
    │ 2. monitor-gsc.mjs (Extraction clics / positions GSC)  │
    │ 3. quality-gate.mjs (Validation technique CI / Pre-push)│
    └────────────────────────────────────────────────────────┘
                         │
                         ▼
              DONNÉES STRUCTURÉES (docs/seo-growth/data/)
    ┌────────────────────────────────────────────────────────┐
    │ - url_inventory.csv (430 URLs classées)                │
    │ - internal_links.csv (Graphe de maillage interne)      │
    │ - content_inventory.csv (Métadonnées de contenu)      │
    │ - keyword_opportunities.csv (Priorités d'action)       │
    └────────────────────────────────────────────────────────┘
                         │
                         ▼
               REVUE & VALIDATION HUMAINE
                         │
                         ▼
           BRANCH DÉDIÉE ──► TESTS CI ──► MERGE MASTER
```

---

## 3. Composants Techniques du Moteur

### 3.1 Script d'Inventaire Exhaustif (`scripts/seo/generate_seo_inventory.mjs`)
- **Rôle :** Analyse statique du code source à chaque release.
- **Entrées :** `src/data/routes.ts`, `src/data/articles.ts`, `src/data/articles-meta.ts`, `src/data/cities.json`, `src/data/glossary.json`.
- **Sorties :** Régénération atomique des 4 fichiers CSV de référence dans `docs/seo-growth/data/`.
- **Temps d'exécution :** < 500 ms (pur JavaScript V8 synchrone/streams).

### 3.2 Moniteur Search Console (`scripts/monitor-gsc.mjs`)
- **Rôle :** Récupération périodique (hebdomadaire) des métriques de performance Google.
- **Authentification :** Variable `GOOGLE_SERVICE_ACCOUNT_JSON` ou `GOOGLE_OAUTH_ACCESS_TOKEN`.
- **Capacités :** Détection des opportunités "Position 4 à 10" (mots-clés proches du podium), suivi des baisses de clics.

### 3.3 Quality Gate SEO CI (`seo-checks/`)
Intégré dans le cycle de validation continu avant tout déploiement :
```bash
pnpm seo:check
```
- Vérifie l'absence de routes privées dans le sitemap (`TECH-01`).
- Valide l'unicité et le format des balises de titre (30 à 65 caractères) et méta-descriptions (120 à 165 caractères).
- Contrôle l'arborescence des titres H1-H6 sans saut de niveau.
- Vérifie que tous les liens internes markdown pointent vers des routes existantes dans `src/data/routes.ts`.

---

## 4. Politique de Sécurité et de Suppression

- **Aucune suppression automatique :** Si une URL doit être dépréciée, elle doit être explicitement redirigée via `next.config.ts` (règle 301) et validée par un humain.
- **Préservation des Canonicals :** La fonction `baseMetadata()` dans `src/lib/seo/metadata.ts` est le point d'ancrage unique. Aucun composant individuel ne doit surcharger manuellement l'URL canonique sans justification documentée.
- **Intégrité de la Homepage B.3 :** La page d'accueil de production ne doit pas être altérée pour des expérimentations SEO opportunistes qui dégraderaient l'expérience utilisateur ou les performances de conversion.
