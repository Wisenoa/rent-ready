# Audit Sécurité, Authentification & Isolation Multi-Tenant — Lokna

Ce document consigne les vérifications de sécurité, les politiques de cookies, les flux d'authentification et l'isolation des secrets pour Lokna.

---

## 1. Sécurité de l'Authentification (Better Auth)

- **Secret d'application** : `BETTER_AUTH_SECRET` (chaîne aléatoire cryptographique de 32+ caractères).
- **Origine d'authentification (`BETTER_AUTH_URL`)** : Doit correspondre strictement à l'origine officielle `https://lokna.fr`.
- **Nom de cookie de session** : `better-auth.session_token`.
  - Attributs obligatoires en production : `HttpOnly`, `Secure`, `SameSite=Lax`.
- **Révocation et rotation** : Les sessions invalides ou expirées sont révoquées côté serveur en base de données PostgreSQL.

---

## 2. Consentement Cookies & RGPD

- **Nouvelle clé de stockage local** : `lokna_cookie_consent`.
- **Mécanisme de rétrocompatibilité** :
  ```typescript
  const COOKIE_KEY = "lokna_cookie_consent";
  const LEGACY_COOKIE_KEYS = ["locelio_cookie_consent", "rentready_cookie_consent"];
  ```
  Les utilisateurs ayant déjà exprimé leur choix sur une version préliminaire ne subissent aucune ré-interruption intempestive.
- **Nature des cookies** : Aucun cookie publicitaire ni traceur tiers. Strictement limité aux cookies de session et de sécurité.

---

## 3. Isolation Absolue avec Facturama et Services Hôtes

Le serveur héberge actuellement Facturama ainsi que d'autres services. L'isolation de Lokna est garantie à trois niveaux :

1. **Réseau Docker (`lokna_internal`)** :
   - Le conteneur de base de données `lokna-postgres` n'expose **aucun port sur l'hôte** (`ports: []`).
   - Il n'est accessible que par `lokna-migrator` et `lokna-app` via le bridge isolé `lokna_internal`.
   - Il est totalement invisible depuis le conteneur Facturama ou tout autre réseau Docker du serveur.
2. **Volumes de données persistants (`lokna_postgres_data`)** :
   - Volume Docker dédié et nommé, sans partage de point de montage avec Facturama.
3. **Secrets et Variables d'Environnement** :
   - Fichier `.env.production` strictement isolé dans le répertoire de l'application, ignoré par Git (`.gitignore`).
   - Mots de passe et rôles PostgreSQL indépendants (`lokna_admin`, `lokna_production`).

---

## 4. Politique de Sécurité du Contenu (CSP)

- La directive CSP de Next.js maintient des contraintes strictes.
- `connect-src` : Restreint à `'self'`, aux API bancaires DSP2 autorisées, à Stripe et à `data:` (strictement requis pour l'aperçu dynamique des flux de quittances PDF).
- Zéro faiblesse d'injection de script (`script-src` sans `'unsafe-eval'`).
