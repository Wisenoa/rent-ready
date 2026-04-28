# Emergency Migration Rollback Runbook

> How to recover from a bad migration in any environment.
> Time-sensitive — follow steps in order. Stay calm, communicate early.

---

## Severity Classification

| Severity | Description | Example | Response Time |
|---|---|---|---|
| **P0 — Critical** | Data corruption, total outage | Column dropped, data loss | Immediate (< 15 min) |
| **P1 — High** | Partial outage, degraded functionality | Index missing, FK constraint blocking | < 1 hour |
| **P2 — Medium** | Non-blocking issue | Extra column, wrong default | < 1 business day |

---

## Pre-Flight Checklist (Do These in Parallel)

- [ ] Notify `#engineering` Slack channel: "Initiating DB rollback for [env]: [brief cause]"
- [ ] Identify the bad migration: run name, timestamp, what it changed
- [ ] Identify impact: which tables/columns are affected, how many rows
- [ ] Get two approvals (SRE + CTO for production P0/P1)
- [ ] If data is corrupted: **do not run corrective migrations first — restore from backup first**

---

## Scenario 1: Development / Staging — Bad Migration, DB Not Yet in Production

**Applies to:** `dev`, `staging` environments, migration just applied and caught before production.

### Step 1: Stop the bleeding

```bash
# Check what migrations are applied
DATABASE_URL=$STAGING_DB_URL pnpm exec prisma migrate status

# Identify the bad migration name
# e.g., 20260428120000_add_biiling_code
```

### Step 2: Mark the bad migration as rolled back

```bash
DATABASE_URL=$STAGING_DB_URL pnpm exec prisma migrate resolve --rolled-back 20260428120000_add_biiling_code
```

### Step 3: Revert schema.prisma

```bash
git checkout develop -- prisma/schema.prisma
# Or revert to the commit before the bad migration
git revert <commit-hash> --no-edit
```

### Step 4: Create a corrective migration (if needed)

```bash
pnpm exec prisma migrate dev --name fix_biiling_code_typo
# Review the SQL in the generated migration file before applying
```

### Step 5: Re-apply

```bash
# Test in staging first
DATABASE_URL=$STAGING_DB_URL pnpm exec prisma migrate deploy

# Verify with:
DATABASE_URL=$STAGING_DB_URL pnpm exec prisma migrate status
```

### Step 6: Notify

Post in `#engineering`: "Rollback complete for staging. [Brief cause]. No data loss."

---

## Scenario 2: Production — Migration Applied, No Data Loss Yet

**Applies to:** Production, migration is wrong but no data has been permanently lost.

### Step 1: Declare incident

Open a P1 incident. Notify `#engineering` + CTO.

### Step 2: Prevent further damage

If the migration is blocking writes (e.g., adding a NOT NULL column without a default):

```bash
# Option A: If the app is still running, hot-fix to add a default
# (do this via a new corrective migration, not manual SQL)

# Option B: Rollback the app to the previous version
# This stops writes to the old schema, preventing further inconsistency
vercel rollback <previous-deployment-id> --token=$VERCEL_TOKEN
```

### Step 3: Mark the bad migration as rolled back

```bash
DATABASE_URL=$PROD_DB_URL pnpm exec prisma migrate resolve --rolled-back <migration-name>
```

### Step 4: Create a corrective migration

```bash
# Locally, from the previous good commit
git checkout main
git pull
pnpm exec prisma migrate dev --name fix_<original_name>
# Review the SQL carefully before committing
```

### Step 5: Test in staging

```bash
# Apply corrective migration to staging first
DATABASE_URL=$STAGING_DB_URL pnpm exec prisma migrate deploy
# Verify the app works correctly on staging
```

### Step 6: Apply to production (with approvals)

After staging verification + two engineering approvals:

```bash
DATABASE_URL=$PROD_DB_URL pnpm exec prisma migrate deploy
```

### Step 7: Redeploy the app

```bash
vercel deploy --prod --token=$VERCEL_TOKEN
# or via GitHub Actions: push the fix commit
```

---

## Scenario 3: Production — Data Loss or Corruption

**Applies to:** P0 incidents. Act fast. Data is being lost or already lost.

### Step 0: Immediate communication

- Notify `#engineering`, CTO, CEO immediately
- Set a war room Slack thread
- Assign roles: Incident Commander, DB Lead, App Lead

### Step 1: Protect the current state

**Do NOT attempt corrective migrations while data is still being written.**

```bash
# Scale to zero if possible to stop writes
# (In Vercel: pause the project or use a maintenance page)

# Take a snapshot/backup of the current (broken) DB state
# Neon: create a branch / restore point from just before the bad migration
```

### Step 2: Restore from point-in-time backup (Neon)

Neon supports point-in-time restore (PITR) on every plan.

```bash
# Via Neon API — restore to a specific timestamp
# https://neon.tech/docs/guides/branching-pitr

# 1. Create a new branch from the last good state
neon branches create \
  --project-id <project-id> \
  --parent-id <production-branch-id> \
  --timestamp "2026-04-28T09:00:00Z" \
  --name restore-point-$(date +%Y%m%d%H%M)

# 2. Verify the restored branch has the correct schema
DATABASE_URL=<restored-branch-url> pnpm exec prisma migrate status

# 3. Verify data is intact
DATABASE_URL=<restored-branch-url> pnpm exec prisma db execute --stdin <<< "SELECT COUNT(*) FROM \"User\";"
```

### Step 3: Promote the restored branch

```bash
# Update the connection string secret
# In Vercel: update NEON_PROD_DATABASE_URL env var to point to the restored branch

# Alternatively, use Neon to re-branch:
# Promote the restored PITR branch as the new production branch
neon branches update <restored-branch-id> --role production
```

### Step 4: Apply corrective migration to restored DB

```bash
DATABASE_URL=<restored-url> pnpm exec prisma migrate deploy
```

### Step 5: Validate

```bash
# Run integrity checks
DATABASE_URL=<restored-url> pnpm exec prisma db execute --stdin <<< "SELECT COUNT(*) FROM \"User\"; SELECT COUNT(*) FROM \"Property\"; SELECT COUNT(*) FROM \"Lease\";"
```

### Step 6: Redeploy

```bash
# Redeploy the app pointing to the restored DB
vercel deploy --prod --token=$VERCEL_TOKEN
```

### Step 7: Post-mortem

Within 24 hours:
1. Document the root cause
2. Identify what failed: no backup? no review? wrong SQL?
3. Add a preventive control (schema review? migration test? extra approval?)
4. Schedule a retro

---

## Rollback Decision Tree

```
Was the migration applied to production?
├── NO → Mark rolled back locally, fix schema, re-deploy
│        (Scenario 1)
└── YES → Is data corrupted?
          ├── NO → Mark rolled back, corrective migration, re-deploy
          │        (Scenario 2)
          └── YES → Stop writes, PITR restore, validate, re-deploy
                   (Scenario 3)
```

---

## Key Contacts (Update before using)

| Role | Name | Contact |
|---|---|---|
| CTO | — | — |
| SRE / DevOps | — | — |
| Neon Support | — | support@neon.tech |

---

## Prevention Controls (Post-Incident)

After every incident, add at least one preventive control:

1. **Schema review** — Require PR review from a second engineer for any migration touching > 100k rows
2. **Migration dry-run** — Always run `prisma migrate diff` locally before committing
3. **Staging gate** — Production migrations never run without a successful staging run
4. **Large table guard** — Block migrations on tables with > 1M rows without explicit SRE sign-off
5. **Backup verification** — Test restoring from PITR backup quarterly
