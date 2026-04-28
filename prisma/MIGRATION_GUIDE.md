# Prisma Migration Guide

> Production-ready database migration workflow for RentReady.
> Applies to: PostgreSQL (Neon), Prisma 7.x, deployed via GitHub Actions + Vercel.

---

## Table of Contents

1. [Migration Naming Conventions](#1-migration-naming-conventions)
2. [Migration Ordering Rules](#2-migration-ordering-rules)
3. [Multi-Environment Strategy](#3-multi-environment-strategy)
4. [Schema Versioning Policy](#4-schema-versioning-policy)
5. [Rollback Procedures](#5-rollback-procedures)
6. [Emergency Rollback Runbook](#6-emergency-rollback-runbook)
7. [CI / CD Integration](#7-ci--cd-integration)
8. [Migration Testing in CI](#8-migration-testing-in-ci)

---

## 1. Migration Naming Conventions

All migrations must follow this pattern:

```
YYYYMMDDHHMMSS_<category>_<short_description>
```

Where:
- `YYYYMMDDHHMMSS` — UTC timestamp at creation time (not the current local time)
- `category` — one of: `init`, `add`, `remove`, `update`, `migrate`, `fix`, `seed`
- `short_description` — kebab-case, max 3 words, describes the change

### Categories

| Category | Use When |
|---|---|
| `init` | First migration (initial schema) |
| `add` | Adding new models or optional fields |
| `remove` | Removing models or fields |
| `update` | Changing field types, constraints, defaults |
| `migrate` | Data transformation (float→decimal, enum renaming) |
| `fix` | Correcting a previous bad migration |
| `seed` | Purely data seeding (rare) |

### Examples

```
20260329145855_init                          ← project init
20260408085919_add_unit_guarantor_org       ← add Unit, Guarantor, Organization
20260420183852_add_email_log                 ← add EmailLog model
20260421000000_add_stripe_webhook_event     ← add StripeWebhookEvent model
20260423200000_migrate_float_to_decimal     ← migrate Float→Decimal for money
```

### Forbidden Patterns

- ❌ `fix_schema_bug` (no timestamp, no category)
- ❌ `2026_04_08_add_new_fields` (underscores instead of hyphens)
- ❌ `migration1`, `migration2` (non-descriptive)
- ❌ Re-using timestamps (use `date +%Y%m%d%H%M%S` to generate fresh ones)

---

## 2. Migration Ordering Rules

Migrations run **in filename order** (lexicographic, which matches timestamp order). To preserve correctness:

### Rule 1: Never Modify Applied Migrations

Once a migration is applied to any environment, **its files must never be changed**.
If a migration is wrong, write a new fix migration that corrects it.

### Rule 2: Idempotent Migrations

All migrations must be safe to re-run. Use `CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`, etc.

```sql
-- ✅ Good — idempotent
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "metadata" JSONB DEFAULT '{}';

-- ❌ Bad — will fail if column already exists
ALTER TABLE "Payment" ADD COLUMN "metadata" JSONB DEFAULT '{}';
```

### Rule 3: Data Migration Rule

Data transformations (migrate) must:
1. Add new column with correct type first
2. Backfill data in same migration
3. Remove old column in a **separate** migration

Never rename a column in a single atomic step — PostgreSQL does not have `ALTER TABLE RENAME COLUMN IF EXISTS` that is safe across runs.

### Rule 4: Enum Changes

Enums are immutable in PostgreSQL. To change an enum value:
1. Add new enum value in one migration
2. Update all rows in a separate migration
3. Remove old value in a third migration (optional, or keep it as a no-op)

---

## 3. Multi-Environment Strategy

RentReady uses three environments:

| Env | URL | Database | Deployment Trigger |
|---|---|---|---|
| `dev` | localhost:3003 | Neon dev branch | `pnpm prisma migrate dev` (local) |
| `staging` | staging.rentready.io | Neon staging | Push to `develop` branch |
| `production` | rentready.io | Neon prod | Push to `main` branch |

### Development Workflow

```bash
# 1. Always start from a clean schema state
git checkout develop
git pull
pnpm install
pnpm exec prisma migrate reset  # ⚠️ destroys local data — OK in dev

# 2. Make schema changes
# ... edit prisma/schema.prisma ...

# 3. Create a new migration
pnpm exec prisma migrate dev --name <name>

# 4. Review generated SQL in prisma/migrations/<name>/migration.sql
# 5. Commit both schema change + migration folder
git add prisma/schema.prisma prisma/migrations/
git commit -m "prisma: <name>"
```

### Staging Workflow

Staging migrations run **automatically** via GitHub Actions on every push to `develop`:

```yaml
# deploy.yml — deploy-staging job
- name: Run Prisma migrations (staging)
  run: pnpm exec prisma migrate deploy
  env:
    DATABASE_URL: ${{ secrets.NEON_STAGING_DATABASE_URL }}
```

### Production Workflow

Production migrations run **automatically** after staging succeeds:

```yaml
# deploy.yml — deploy-production job
- name: Run Prisma migrations (production)
  run: pnpm exec prisma migrate deploy
  env:
    DATABASE_URL: ${{ secrets.NEON_PROD_DATABASE_URL }}
```

### Golden Rule: Schema Must Match Migrations

The migration files and `schema.prisma` must always be in sync:

```bash
# After any schema change, always run:
pnpm exec prisma validate

# Before committing, run:
pnpm exec prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-migrations prisma/migrations --exit-code
```

This diff check is enforced in CI (see Section 8).

---

## 4. Schema Versioning Policy

### Version Alignment

- `schema.prisma` and migration files in the same commit.
- The migration history in `_prisma_migrations` table is the source of truth for applied migrations.
- Never manually edit `_prisma_migrations` or migration SQL files after they are applied.

### Baseline (Initial State)

The existing migrations already form a baseline:

| Migration | Description |
|---|---|
| `20260329145855_init` | Initial schema |
| `20260408085919_add_unit_guarantor_org` | Unit, Guarantor, Organization models |
| `20260420183852_add_email_log` | EmailLog model |
| `20260421000000_add_stripe_webhook_event` | StripeWebhookEvent model |
| `20260423200000_migrate_float_to_decimal` | Float→Decimal for money fields |

### Zero-Downtime Migrations

For large tables (millions of rows), use the expand-contract pattern:

1. **Expand** — Add new column/table (non-blocking)
2. **Backfill** — Update code to write to both old and new
3. **Contract** — Remove old column/table in a later sprint (after code is fully migrated)

---

## 5. Rollback Procedures

### Types of Rollbacks

| Type | When | How |
|---|---|---|
| **Code rollback** | Migration SQL is correct but code is broken | Revert code, redeploy (migrations already applied, keep them) |
| **Migration rollback** | Migration SQL is wrong/destructive | `prisma migrate resolve --rolled-back` + corrective migration |
| **Full DB rollback** | Catastrophic data loss | Restore from Neon point-in-time backup |

### Rule: Never Roll Back Migration Files

Do not delete migration files from `prisma/migrations/`. If a migration is bad:
1. Note the failed migration name
2. Create a new corrective migration
3. Mark the failed one as rolled-back: `prisma migrate resolve --rolled-back <migration-name>`

---

## 6. Emergency Rollback Runbook

> Full runbook: [MIGRATION_ROLLBACK_RUNBOOK.md](./MIGRATION_ROLLBACK_RUNBOOK.md)

Quick reference:

### Scenario A: Migration Applied but Code Not Yet Deployed

1. **Do NOT run `prisma migrate deploy`** — the migration is already applied
2. Fix the schema in `prisma/schema.prisma`
3. Create a corrective migration: `pnpm exec prisma migrate dev --name fix_<original_name>`
4. Open a hotfix PR targeting `main`

### Scenario B: Migration Applied, App Deployed, Data is Corrupted

1. Identify the bad migration name from the error
2. Open Neon console → Point-in-time restore
3. Restore to a point just before the bad migration
4. Create a corrective migration
5. Apply to restored DB
6. Redeploy

### Scenario C: Want to Undo a Migration Without Restoring DB

```bash
# Mark migration as rolled back (Prisma records this, doesn't undo SQL)
pnpm exec prisma migrate resolve --rolled-back <migration_name>

# Then write a corrective migration
pnpm exec prisma migrate dev --name fix_<original_name>
```

---

## 7. CI / CD Integration

### Automatic Migration Run (Deploy Pipeline)

Migrations run automatically in `deploy.yml`:

```
develop branch → prisma migrate deploy to staging → smoke test → auto-deploy
main branch    → prisma migrate deploy to staging → if OK → prisma migrate deploy to prod
```

### Pre-Deployment Validation

Before running `migrate deploy`, the CI validates:

1. **Schema is clean** — `prisma validate` passes
2. **No unapplied migrations** — local schema matches migration history
3. **Migration is syntactically valid** — no broken SQL
4. **Generated client is up to date** — `prisma generate` succeeds

### Protect Production

- Production migrations require a **green staging deploy first** (implicit `needs: deploy-staging`).
- No manual `migrate deploy` to production without a staging test.
- Emergency override requires two engineers to approve (SRE + CTO).

---

## 8. Migration Testing in CI

### Job: `migration-validate`

Add this job to `.github/workflows/ci.yml`:

```yaml
# ========================================
# Migration Validation
# ========================================
migration-validate:
  name: Migration Validate
  runs-on: ubuntu-latest
  steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Setup pnpm
      uses: pnpm/action-setup@v4
      with:
        version: ${{ env.PNPM_VERSION }}

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: "pnpm"

    - name: Install dependencies
      run: pnpm install --frozen-lockfile

    - name: Generate Prisma Client
      run: pnpm exec prisma generate

    - name: Validate Prisma Schema
      run: pnpm exec prisma validate

    - name: Check for uncommitted migrations
      run: |
        # Ensure no migration files are uncommitted
        git diff --exit-code --name-only -- prisma/migrations/ || {
          echo "ERROR: Uncommitted migration files found. Commit migrations first."
          exit 1
        }

    - name: Check schema-migration alignment
      run: pnpm exec prisma migrate diff \
        --from-schema-datasource prisma/schema.prisma \
        --to-migrations prisma/migrations \
        --exit-code
```

### When Migrations Are Required

Migrations are **required** when:
- Adding a new model
- Adding a required field (non-nullable, no default)
- Changing a column type
- Adding an index on existing columns
- Changing an enum value

Migrations are **not required** when:
- Adding an optional field with a default
- Adding a new enum value (extend only)
- Changing comments or documentation
- Adding a relation where the FK is already nullable

---

## Appendix: Useful Commands

```bash
# Preview migration SQL without applying
pnpm exec prisma migrate diff \
  --from-schema-datasource prisma/schema.prisma \
  --to-migrations prisma/migrations

# Apply migrations locally (dev)
pnpm exec prisma migrate dev --name <name>

# Apply migrations to a specific DB
DATABASE_URL=<url> pnpm exec prisma migrate deploy

# Check migration status
pnpm exec prisma migrate status

# Reset dev DB (⚠️ destroys data)
pnpm exec prisma migrate reset

# Create a blank migration for custom SQL
pnpm exec prisma migrate dev --name <name> --create-only
```
