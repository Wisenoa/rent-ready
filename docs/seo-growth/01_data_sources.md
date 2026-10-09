# 01 — Audit des Sources de Données SEO & Analytics

Date : Octobre 2026  
Branche d'audit : `audit/seo-growth-engine`  
Statut général : **AUDIT REPRODUCTIBLE — ZÉRO DONNÉE INVENTÉE**

---

## 1. Inventaire et Statut des Sources

| Source de données | Statut | Méthode d'accès | Métriques disponibles | Plage de dates | Fiabilité |
| :--- | :---: | :--- | :--- | :--- | :--- |
| **Google Search Console (GSC)** | `SOURCE UNAVAILABLE` | Script prêt (`scripts/monitor-gsc.mjs`), clés manquantes | Clics, impressions, CTR, positions réelles | N/A | Non connectée |
| **Google Analytics (GA4)** | `AVAILABLE_NOT_CONNECTED` | Variables d'environnement / CSP préparée | Sessions, conversions, engagement | N/A | Non connectée |
| **Plausible Analytics** | `CONNECTED` (Client-side) | `window.plausible` via `homepage-tracker.ts` | Événements de conversion personnalisés | Temps réel | Élevée (sans cookie) |
| **Base de données interne (Prisma)** | `CONNECTED` | Prisma ORM (`User`, `Property`, `Lease`, etc.) | Inscriptions, baux créés, paiements réels | Complète | Absolue (100 %) |
| **Arborescence Routes & CMS** | `CONNECTED` | `src/data/routes.ts`, `articles.ts`, `cities.json` | 430 URLs, types, slugs, dates, contenu | Versionnée Git | Absolue (100 %) |
| **Outil de suivi SERP / Mots-clés** | `SOURCE UNAVAILABLE` | Aucune API tierce configurée (Ahrefs, Semrush, SE Ranking) | Volumes mensuels, KD, suivi de rangs | N/A | Hypothèses uniquement |
| **Backlinks tiers** | `SOURCE UNAVAILABLE` | Aucun fournisseur de graphe de liens connecté | Domaines référents, ancres, autorité | N/A | Inconnue |
| **Live SERP Google (Sonde Web)** | `CONNECTED` (Recherche ponctuelle) | Requêtes directes sur requêtes cibles | Acteurs en place, formats dominants | Octobre 2026 | Élevée (instantanée) |

---

## 2. Procédure de Connexion de Google Search Console

Le script d'extraction [`scripts/monitor-gsc.mjs`](file:///home/ubuntu/rent-ready/scripts/monitor-gsc.mjs) est déjà implémenté et prêt pour l'automatisation. Il nécessite l'un des deux mécanismes d'authentification suivants :

### Option A : Compte de service Google Cloud (Recommandé pour CI & Agents)
1. Créer un compte de service dans Google Cloud Console avec l'API *Google Search Console API* activée.
2. Ajouter l'adresse email du compte de service comme utilisateur avec droits de lecture dans Google Search Console pour la propriété `sc-domain:rentready.fr`.
3. Définir la variable d'environnement :
   ```bash
   GOOGLE_SERVICE_ACCOUNT_JSON='{"type": "service_account", "project_id": "...", ...}'
   ```
4. Exécuter : `node scripts/monitor-gsc.mjs --json`

### Option B : Token d'accès OAuth2 (Usage ponctuel / Développement)
1. Générer un token d'accès OAuth2 avec le scope `https://www.googleapis.com/auth/webmasters.readonly`.
2. Définir :
   ```bash
   GOOGLE_OAUTH_ACCESS_TOKEN="ya29...."
   ```

---

## 3. Démarcation Stricte : Faits observés vs Hypothèses

Conformément à la règle absolue n°1 (*Aucune donnée inventée*) :
- **Faits observés et prouvés :**
  - Les 430 URLs publiques du site.
  - La structure du code, des métadonnées, du maillage interne et des composants.
  - Les concurrents réels observés sur la SERP Google France en octobre 2026 (Rentila, BailFacile, GérerSeul, Monsieur Hugo, etc.).
- **Indisponibles (marqués explicitement N/A) :**
  - Volumes exacts de recherche Google (marqués `N/A (GSC_UNAVAILABLE)`).
  - Positions actuelles et clics historiques Google.
  - Métriques de trafic estimé par des outils tiers.
