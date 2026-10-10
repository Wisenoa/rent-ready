# Plan de Bascule de Domaine & Infrastructure — Lokna

Ce plan décrit les étapes requises pour la future mise en production de Lokna (`lokna.fr`) sur le serveur de production hébergeant déjà Facturama, sans impact sur ce dernier.

> [!IMPORTANT]
> **Ce document est une feuille de route préparatoire.** Aucune de ces opérations ne doit être exécutée sans validation explicite préalable.

---

## 1. Configuration DNS (Zone OVH)

Créer les enregistrements DNS suivants dans la zone DNS de `lokna.fr` chez OVH :

| Type | Sous-domaine / Nom | Valeur Cible | TTL | Commentaire |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` (racine) | `51.159.26.166` (IP du serveur) | 3600 | Pointe vers le Caddy du serveur |
| **CNAME** | `www` | `lokna.fr.` | 3600 | Redirigé vers la racine |
| **TXT** | `resend._domainkey` | Valeur fournie par Resend | 3600 | Signature DKIM pour les emails Lokna |
| **TXT** | `_dmarc` | `"v=DMARC1; p=quarantine; rua=mailto:dmarc@lokna.fr"` | 3600 | Politique DMARC |
| **TXT** | `@` (SPF) | `"v=spf1 include:resend.com ~all"` | 3600 | Autorisation d'envoi Resend |

---

## 2. Configuration Reverse Proxy Caddy

Le serveur utilise un Caddy global mutualisé. Le fichier [`infra/caddy/lokna.Caddyfile`](file:///home/ubuntu/rent-ready/infra/caddy/lokna.Caddyfile) est prêt à être intégré dans la configuration du Caddy hôte :

```caddy
# ==============================================================================
# Lokna Caddy Configuration
# Reverse proxy vers le port 3019 exposé sur la passerelle Docker
# ==============================================================================

www.lokna.fr {
    redir https://lokna.fr{uri} permanent
}

lokna.fr {
    encode zstd gzip
    reverse_proxy host.docker.internal:3019
}
```

*Remarque de sécurité* : Le conteneur Next.js Lokna écoute sur `172.17.0.1:3019` (port privé sur la passerelle du pont Docker), interdisant toute exposition directe sur l'interface publique d'Internet.

---

## 3. Configuration Stripe en Production

1. Créer le compte produit "Lokna" sur le Dashboard Stripe Live.
2. Créer les 4 identifiants de prix :
   - `STRIPE_STARTER_MONTHLY_PRICE_ID` (9 € / mois)
   - `STRIPE_STARTER_ANNUAL_PRICE_ID` (89 € / an)
   - `STRIPE_PRO_MONTHLY_PRICE_ID` (19 € / mois)
   - `STRIPE_PRO_ANNUAL_PRICE_ID` (149 € / an)
3. Configurer l'endpoint Webhook Stripe :
   - URL : `https://lokna.fr/api/stripe/webhook`
   - Événements écoutés : `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`.
   - Récupérer `STRIPE_WEBHOOK_SECRET` (`whsec_...`).

---

## 4. Configuration Resend

1. Ajouter le domaine `lokna.fr` dans l'interface Resend.
2. Vérifier les enregistrements DNS (DKIM, SPF, MX).
3. Obtenir la clé API de production `RESEND_API_KEY` (`re_...`).
4. Configurer l'adresse expéditrice officielle : `notifications@lokna.fr`.
