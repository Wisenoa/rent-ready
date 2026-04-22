# RentReady — Gestion Locative Intelligente

> Logiciel de gestion locative pour propriétaires, gestionnaires et agences immobilières.
> Site: [https://www.rentready.fr](https://www.rentready.fr)

---

## 1. Produit

RentReady est une plateforme SaaS de gestion locative conçue pour:

- **Propriétaires** — Gérez vos biens, suivez vos locataires, générez des quittances
- **Gestionnaires** — Automatisez les relances, suivez les paiements, gérez les maintenance
- **Agences** — Workspace multi-utilisateurs, portail owner, exports comptables

### Fonctionnalités Principales

| Module | Description |
|--------|-------------|
| **Propriétés** | Inventaire des biens, units multi-logements |
| **Locataires** | Portail locataire, gestion des garants |
| **Baux** | Création, renewal, révision IRL |
| **Paiements** | Suivi des loyers, reçus/quittances PDF, relances automatiques |
| **Maintenance** | Tickets d'intervention, états des lieux |
| **Comptabilité** | Exports, charges récupérables, déclaration fiscale |
| **Facturation** | Abonnements Stripe, portail de facturation |

---

## 2. Stack Technique

| Couche | Technologie |
|--------|-------------|
| **Framework** | Next.js 15.5.9 (App Router, TypeScript) |
| **Styling** | Tailwind CSS v4, shadcn/ui |
| **Base de données** | PostgreSQL via Prisma 7.6 (Neon) |
| **Auth** | Better Auth 1.5.6 (credentials + OAuth) |
| **Paiements** | Stripe (subscriptions + webhooks) |
| **Email** | Resend |
| **AI** | OpenAI (`@ai-sdk/openai`) |
| **Documents** | `@react-pdf/renderer` (quittances, reçus) |
| **Storage** | MinIO (S3-compatible, local dev) |
| **Banque** | Bridge/Powens API (DSP2, sync bancaire) |
| **Monitoring** | Sentry |
| **File d'attente** | Redis |

---

## 3. Developpement

### 3.1 Prerequisites

- Node.js 20+
- pnpm 10+
- Docker & Docker Compose (pour la stack locale)

### 3.2 Installation

```bash
# Cloner le repo
git clone git@github.com:Wisenoa/rent-ready.git
cd rent-ready

# Installer les dépendances
pnpm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditez .env avec vos credentials

# Démarrer la stack locale (PostgreSQL, Redis, MinIO)
docker compose up -d

# Initialiser la base de données
pnpm prisma migrate dev

# Démarrer le serveur de développement
pnpm dev
```

Le serveur de développement écoute sur **http://localhost:3003** (pas 3000).

### 3.3 Commandes Utiles

```bash
pnpm dev          # Serveur dev (port 3003)
pnpm build        # Build production
pnpm start        # Démarrer en production
pnpm lint         # Lint ESLint
pnpm test         # Tests unitaires (Vitest)
pnpm test:e2e     # Tests E2E (Playwright)

# SEO checks
pnpm seo:meta     # Valider les meta tags
pnpm seo:lint     # Linter SEO
pnpm seo:schema   # Valider le schema structured data
pnpm seo:links    # Vérifier les liens
pnpm seo:all      # Tous les checks SEO
```

### 3.4 Structure du Projet

```
rent-ready/
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (marketing)/   # Pages marketing (SEO)
│   │   ├── (dashboard)/   # App dashboard (protégé)
│   │   ├── api/           # API routes
│   │   └── ...
│   ├── components/        # Composants React
│   ├── lib/               # Utils, helpers, API clients
│   ├── data/              # Données statiques (glossary, FAQs)
│   └── __tests__/         # Tests
├── prisma/
│   └── schema.prisma       # Schema base de données
├── docs/                   # Documentation interne
├── seo-docs/               # Documentation SEO
└── scripts/                # Scripts utilitaires
```

---

## 4. Documentation

| Sujet | Emplacement |
|-------|-------------|
| Architecture technique | `docs/V1_TECHNICAL_ARCHITECTURE_BLUEPRINT.md` |
| Design system | `docs/design/BUILD_DESIGN_SYSTEM.md` |
| Stack technique | `docs/tech-stack.md` |
| API REST | `docs/API_OPENAPI_SPEC.yaml`, `seo-docs/API_README.md` |
| SEO | `seo-docs/00-master-content-strategy.md` |
| Roadmap produit | `docs/PRODUCT_ROADMAP.md` |
| Modèle de données | `docs/DATABASE_DESIGN.md` |
| Audit documentation | `DOCUMENTATION_AUDIT.md` |

---

## 5. Architecture API

### Endpoints Publics (Marketing)

```
GET  /api/glossary                    # Liste des termes de glossaire
GET  /api/glossary/:slug              # Terme détaillé
GET  /api/property-types              # Types de propriétés
GET  /api/property-types/:slug        # Guide type propriété
GET  /api/seo/organization/schema    # Schema Org
GET  /api/seo/template/:slug/schema  # Schema HowTo (templates)
GET  /api/seo/calculator/:slug/schema # Schema WebApplication (calculateurs)
GET  /api/seo/faq/:slug/schema       # Schema FAQPage
POST /api/seo/events                 # Analytics SEO
```

### Endpoints Protégés (Auth Requis)

```
# Auth
POST /api/auth/*                     # Better Auth endpoints

# Ressources
GET|POST   /api/properties
GET|PATCH|DELETE /api/properties/:id
GET|POST   /api/leases
GET|PATCH|DELETE /api/leases/:id
GET|POST   /api/tenants
GET|PATCH|DELETE /api/tenants/:id
GET|POST   /api/transactions
GET|PATCH|DELETE /api/transactions/:id

# Facturation
POST /api/stripe/checkout            # Session Stripe checkout
POST /api/stripe/portal             # Customer portal
POST /api/stripe/webhook             # Webhooks Stripe

# Documents
GET|POST /api/documents
GET|DELETE /api/documents/:id
```

---

## 6. Deployment

### Développement

```bash
pnpm dev  # http://localhost:3003
```

### Docker (Local Stack)

```bash
docker compose up -d        # Démarrer toute la stack
docker compose down         # Arrêter
docker compose logs -f     # Voir les logs
```

### Production

Le projet est configuré pour être déployé sur Vercel ou Docker.

**Vercel:**
```bash
vercel deploy
```

**Docker:**
```bash
docker build -t rent-ready .
docker run -p 3000:3000 rent-ready
```

---

## 7. Tests

### Unitaires (Vitest)

```bash
pnpm test
pnpm test:watch   # Mode watch
pnpm test:coverage # Coverage report
```

### E2E (Playwright)

```bash
pnpm test:e2e           # Lancer les tests
pnpm test:e2e --ui      # Lancer avec UI
```

---

## 8. Contribuer

1. Créer une branche: `git checkout -b feat/ma-fonctionnalite`
2. Commits atomiques avec messages descriptifs
3. Push et PR vers `master`
4. CI vérifie lint, types, et tests

### Règles de Commit

- `feat:` — Nouvelle fonctionnalité
- `fix:` — Correction de bug
- `docs:` — Documentation
- `refactor:` — Refactoring
- `seo:` — Amélioration SEO
- `chore:` — Tâche de maintenance

---

## 9. Équipe & Contact

- **Produit:** RentReady — [https://www.rentready.fr](https://www.rentready.fr)
- **Support:** support@rentready.fr
- **Repo:** [GitHub - Wisenoa/rent-ready](https://github.com/Wisenoa/rent-ready)

---

## 10. Licence

Propriétaire — Tous droits réservés (Wisenoa)
