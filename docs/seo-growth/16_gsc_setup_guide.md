# Guide de Configuration — Google Search Console API & Monitoring

Ce document décrit la configuration technique, les prérequis d'authentification et les bonnes pratiques opérationnelles pour exécuter `scripts/monitor-gsc.mjs` dans RentReady.

---

## 1. État Actuel de Connexion

| Statut | Valeur |
|---|---|
| **Connexion active** | ❌ **Non connectée** (Aucune clé de service présente dans l'environnement) |
| **Comportement script** | Sortie propre avec code d'erreur `2` et message d'aide explicite |
| **Simulations / Fake data** | **Aucune**. Aucune donnée fictive d'impression, clic ou ranking n'est injectée. |

---

## 2. Architecture de `scripts/monitor-gsc.mjs`

Le script interroge l'API officielle Google Search Console (`Search Analytics: query`) via le SDK `googleapis` :
- **Période analysée :** Fenêtre glissante de 28 jours (J-28 à J-1) comparée à la période précédente (WoW - Week over Week / Period over Period).
- **Données extraites :**
  - Top 20 requêtes par volume d'impressions, clics, CTR, position moyenne et delta.
  - Top 20 pages par clics.
  - Répartition par type d'appareil (DESKTOP, MOBILE, TABLET).
  - Détection des baisses de ranking significatives (> 10 positions par défaut).
  - Identification des requêtes et pages à fort potentiel (fortes impressions, CTR < 2%).
- **Modes de sortie :**
  - Console CLI formatée.
  - JSON structuré (`--json`) pour ingestion automatisée.
  - Alerte Slack (`--alert-slack` via `SLACK_WEBHOOK_URL`).

---

## 3. Prérequis Google Cloud & Search Console

### Étape 1 : Google Cloud Console
1. Rendez-vous sur la console Google Cloud ([console.cloud.google.com](https://console.cloud.google.com)).
2. Sélectionnez ou créez le projet Google Cloud dédié (ex: `rentready-seo-production`).
3. Activez l'API **Google Search Console API** (identifiant: `searchconsole.googleapis.com` / `webmasters.googleapis.com`).

### Étape 2 : Création du Service Account (Compte de service)
1. Allez dans **IAM & Administration** > **Comptes de service**.
2. Créez un compte de service, par exemple : `rentready-gsc-monitor@rentready-seo-production.iam.gserviceaccount.com`.
3. Aucun rôle IAM GCP global n'est nécessaire (l'accès aux données de recherche se configure dans la Search Console elle-même).
4. Créez une nouvelle clé au format **JSON** et téléchargez le fichier en lieu sûr.

### Étape 3 : Attribution des droits dans Google Search Console
1. Ouvrez Google Search Console ([search.google.com/search-console](https://search.google.com/search-console)).
2. Sélectionnez la propriété RentReady :
   - Propriété Domaine : `sc-domain:rentready.fr` (recommandé)
   - Ou Propriété Préfixe d'URL : `https://www.rentready.fr/`
3. Allez dans **Paramètres** > **Utilisateurs et autorisations**.
4. Cliquez sur **Ajouter un utilisateur**.
5. Renseignez l'adresse email du Service Account : `rentready-gsc-monitor@rentready-seo-production.iam.gserviceaccount.com`.
6. Attribuez le droit **Lecture** (ou **Total** si restreint pose un problème de lecture API).

---

## 4. Variables d'Environnement

Le script supporte deux méthodes d'authentification :

### Option A : Service Account JSON (Recommandé pour CI/CD et production)
```bash
export GOOGLE_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"rentready-gsc-monitor@...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token"}'
```
*Note : La valeur doit être la chaîne JSON complète minifiée sur une seule ligne ou passée via un secret manager.*

### Option B : Jeton d'accès OAuth2 pré-généré (Utile en debug local)
```bash
export GOOGLE_OAUTH_ACCESS_TOKEN="ya29.a0AfH6SM..."
```
*Généré par exemple via : `gcloud auth print-access-token --scopes=https://www.googleapis.com/auth/webmasters.readonly`.*

### Variables de Configuration Additionnelles

| Variable | Défaut | Description |
|---|---|---|
| `GSC_SITE_URL` ou `GSC_SITE` | `sc-domain:rentready.fr` | Identifiant de la propriété GSC. |
| `SLACK_WEBHOOK_URL` | *(vide)* | URL de webhook Slack pour notifications. |
| `RANKING_DROP_THRESHOLD` | `10` | Seuil de chute de position pour déclencher une alerte. |

---

## 5. Sécurité et Gestion des Secrets

- **RÈGLE ABSOLUE :** Ne jamais commiter le fichier JSON du service account ni sa clé privée dans le dépôt git.
- Dans GitHub Actions : stocker le JSON dans `GOOGLE_SERVICE_ACCOUNT_JSON` comme GitHub Secret chiffré.
- Ne pas afficher la clé dans les logs de CI (les scripts masquent les secrets et ne dumpent jamais les variables d'environnement brutes).

---

## 6. Diagnostic et Codes d'Erreur

### Code de sortie 2 : Erreur d'authentification
```text
Fatal error: No GSC credentials found. Set GOOGLE_OAUTH_ACCESS_TOKEN or GOOGLE_SERVICE_ACCOUNT_JSON env var.
```
**Cause :** Aucune variable d'authentification n'a été injectée.  
**Action :** Définir `GOOGLE_SERVICE_ACCOUNT_JSON` dans l'environnement d'exécution.

### Erreur HTTP 403 : Forbidden / User does not have sufficient permission
```text
GSC API error 403: User does not have sufficient permissions for this site.
```
**Cause :** L'adresse email du Service Account n'a pas été ajoutée comme utilisateur dans Google Search Console pour la propriété ciblée.  
**Action :** Vérifier dans Search Console > Paramètres > Utilisateurs que l'email exact du Service Account est bien listé sur `sc-domain:rentready.fr`.

### Erreur HTTP 404 : Site not found
```text
GSC API error 404: Requested entity was not found.
```
**Cause :** La propriété spécifiée (`GSC_SITE_URL`) ne correspond pas exactement au type de propriété configuré dans GSC.  
**Action :** Si la propriété GSC est un préfixe d'URL (`https://www.rentready.fr/`), passer `GSC_SITE_URL="https://www.rentready.fr/"`.

### Quotas & Rate Limits API
- **Quota Search Analytics :** 1 200 requêtes par minute (QPM) par projet GCP, 20 requêtes par seconde (QPS).
- Le script effectue 4 requêtes par exécution (query WoW, pages, devices) ; le risque de saturation est nul en usage hebdomadaire standard.
