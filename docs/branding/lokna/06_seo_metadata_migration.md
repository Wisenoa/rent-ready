# Migration SEO & Métadonnées Techniques — Lokna

Ce document détaille la configuration SEO, les balises canoniques, les sitemaps et les données structurées Schema.org mis à niveau pour `lokna.fr`.

---

## 1. Origine Canonique Unique (`SITE_URL`)

La constante canonique est centralisée dans [`src/data/entity.ts`](file:///home/ubuntu/rent-ready/src/data/entity.ts) :
```typescript
export const SITE_NAME = "Lokna";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") ||
  "https://lokna.fr";
```

### Règles d'Invariance :
- Toutes les balises `<link rel="canonical" href="...">` dérivent directement de `SITE_URL`.
- En environnement de test ou de staging, la variable d'environnement `NEXT_PUBLIC_SITE_URL` prévaut, avec fallback strict sur `https://lokna.fr`.
- Aucune URL en dur (`hardcoded origin`) ne persiste dans les métadonnées de page.

---

## 2. Robots.txt et Sitemap XML

- **Fichier `src/app/robots.ts`** :
  - Autorise l'indexation de la totalité des surfaces publiques et documentaires.
  - Interdit l'accès aux surfaces privées (`/dashboard`, `/leases`, `/properties`, `/tenants`, `/maintenance`, `/fiscal`, `/settings`, `/portal`, `/api`).
  - Déclare l'URL du sitemap : `https://lokna.fr/sitemap.xml`.
- **Fichier `src/app/sitemap.ts`** :
  - Génère de manière statique et prédictible l'ensemble des 298 routes indexables.
  - Intègre le hub `/villes`, les 50 pages baux, les 50 pages quittances, les 50 pages gestion locative, le glossaire, le blog et les outils.
  - Préserve une étanchéité absolue : aucune route authentifiée ni URL fantôme.

---

## 3. Données Structurées Schema.org (JSON-LD)

L'architecture JSON-LD a été mise à jour dans [`src/lib/seo/structured-data.ts`](file:///home/ubuntu/rent-ready/src/lib/seo/structured-data.ts) et [`src/components/seo/organization-schema.tsx`](file:///home/ubuntu/rent-ready/src/components/seo/organization-schema.tsx) :

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://lokna.fr/#organization",
      "name": "Lokna",
      "url": "https://lokna.fr",
      "logo": "https://lokna.fr/logo.svg",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "contact@lokna.fr",
        "availableLanguage": "French"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://lokna.fr/#website",
      "name": "Lokna",
      "url": "https://lokna.fr",
      "publisher": {
        "@id": "https://lokna.fr/#organization"
      }
    },
    {
      "@type": "SoftwareApplication",
      "name": "Lokna",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "9",
        "priceCurrency": "EUR"
      }
    }
  ]
}
```

---

## 4. Redirections et Continuité de Référencement

Dans [`next.config.ts`](file:///home/ubuntu/rent-ready/next.config.ts), les redirections d'anciennes routes ou d'expérimentations sont formalisées en redirections permanentes HTTP 301 :
- `/comparatif/locelio-vs-legalplace` ➔ `/comparatif/lokna-vs-legalplace` (Permanent 301).
- Déduplication automatique des suffixes de marque dans les balises titre (aucun dédoublement `"Page | Lokna | Lokna"`).
