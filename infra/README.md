# ========================================
# Infrastructure Documentation for Phase 3
# ========================================

## Overview

This infrastructure setup supports Phase 3 features including AI capabilities, open banking integration, tenant portal, and production-scale deployment.

## Architecture Components

### 1. Application Stack

- **Framework**: Next.js 16 with standalone output
- **Runtime**: Node.js 20 Alpine (Docker)
- **ORM**: Prisma with PostgreSQL
- **Cache**: Redis for sessions and rate limiting
- **Storage**: MinIO (S3-compatible) for documents

### 2. Database Layer

#### Connection Pooling

Configure in `DATABASE_URL`:

```
postgresql://user:password@host:5432/db?pgbouncer=true&connection_limit=10&pool_timeout=30
```

#### Indexes for Dashboard Queries

Key indexes created in `infra/db/init.sql`:

- `idx_transaction_user_status` - Owner dashboard KPIs
- `idx_lease_property_status` - Occupancy tracking
- `idx_expense_user_date` - Expense tracking per property
- `idx_document_status` - AI extraction pipeline
- `idx_maintenance_tenant_status` - Tenant portal maintenance

#### Recommended: PgBouncer

For production, add PgBouncer:

```yaml
pgbouncer:
  image: bitnami/pgbouncer:latest
  environment:
    POSTGRESQL_HOST: postgres
    POSTGRESQL_PORT: 5432
    PGBOUNCER_DATABASE: rentready
    PGBOUNCER_MAX_CLIENT_CONN: 100
    PGBOUNCER_DEFAULT_POOL_SIZE: 20
    PGBOUNCER_POOL_MODE: transaction
```

### 3. Webhook Infrastructure

#### Bridge / Powens Bank Integration

Endpoints:

- `POST /api/webhooks/bank/bridge` - Bridge bank webhooks
- `POST /api/webhooks/bank/powens` - Powens bank webhooks

Security:

- HMAC signature verification
- Rate limiting: 1000 req/min (configurable in Nginx)
- Request logging in `BankWebhookEvent` table

#### Stripe Webhooks

- `POST /api/webhooks/stripe` - Stripe payment webhooks
- Rate limiting: 10 req/min (lower than bank webhooks)

### 4. CDN & Performance

#### Static Assets (Next.js)

```nginx
location /_next/static/ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

#### Image Optimization

Configured in `next.config.ts`:

- Formats: AVIF, WebP
- Responsive sizes
- 30-day cache TTL

#### Compression

Gzip enabled in Nginx:

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_comp_level 6;
```

### 5. Security Configuration

#### Rate Limiting

Per Nginx config:

- Global API: 100 req/min
- Banking webhooks: 1000 req/min
- Stripe webhooks: 10 req/min

Per Application (in `infra/security/config.js`):

- Global: 100 req/min
- Tenant API: 200 req/min
- Authentication: 10 req/15min

#### CORS

Configured for:

- Origin: Whitelisted domain only
- Credentials: Enabled
- Methods: Standard REST methods
- Headers: X-Tenant-ID, X-Request-ID for tracing

#### Content Security Policy

Restrictions:

- Scripts: Self + Stripe
- Styles: Self + inline (for Next.js)
- Images: Self + data: + https
- Frames: Stripe only
- Connections: Self + https

### 6. Monitoring Stack

#### Prometheus Scrapes

- App metrics: `/api/metrics`
- PostgreSQL Exporter: Port 9187
- Redis Exporter: Port 9121
- Node Exporter: Port 9100
- Nginx Exporter: Port 9113

#### Alert Rules

Alerts configured for:

- High error rate (>5% for 5min)
- High response time (P95 >3s for 5min)
- Database connections near limit (>80%)
- Redis high memory (>90%)
- CPU/memory/disk thresholds

### 7. Deployment

#### Local Development

```bash
docker-compose up -d
npx prisma migrate dev
npm run dev
```

#### Staging

```bash
docker-compose -f docker-compose.yml -f docker-compose.staging.yml up -d
./infra/scripts/deploy.sh
```

#### Production

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
./infra/scripts/deploy.sh
```

### 8. Environment Variables

Required secrets (see `.env.template`):

**Core:**
- `POSTGRES_PASSWORD` - Database password
- `BETTER_AUTH_SECRET` - Auth secret (32+ chars)
- `NEXT_PUBLIC_APP_URL` - Public URL

**AI:**
- `OPENAI_API_KEY` - OpenAI API key

**Payments:**
- `STRIPE_SECRET_KEY` - Stripe secret
- `STRIPE_WEBHOOK_SECRET` - Webhook secret
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Publishable key

**Banking:**
- `BRIDGE_API_KEY` - Bridge API key
- `BRIDGE_WEBHOOK_SECRET` - Bridge webhook secret
- `POWENS_API_KEY` - Powens API key
- `POWENS_WEBHOOK_SECRET` - Powens webhook secret

**Monitoring:**
- `SENTRY_DSN` - Sentry DSN (optional)

### 9. Backup Strategy

#### Database Backups

```bash
# Daily backup script
./infra/scripts/backup.sh

# Retention: 7 days local
# Upload to S3 if configured
```

#### File Storage Backup

MinIO supports:

- Versioning
- Replication
- S3-compatible backup tools

### 10. Scaling Strategy

#### Horizontal Scaling

1. **App Instances**: Increase replicas in `docker-compose.prod.yml`
   ```yaml
   deploy:
     replicas: 3
   ```

2. **Load Balancer**: Nginx upstream with least_conn

3. **Database**: Add read replicas
   ```sql
   CREATE PUBLICATION app_publication FOR ALL TABLES;
   ```

4. **Redis**: Cluster mode for high availability

#### Vertical Scaling

Adjust resource limits in `docker-compose.prod.yml`:

```yaml
deploy:
  resources:
    limits:
      cpus: '4'
      memory: 8G
```

### 11. Disaster Recovery

#### Database

- Daily backups with 7-day retention
- Point-in-time recovery with WAL archiving
- Cross-region replication (production)

#### Application

- Container images stored in registry
- Infrastructure as code (this repo)
- Automated deployments via scripts

### 12. Checklist Before Production

- [ ] Set all secrets in `.env`
- [ ] Configure SSL certificates in Nginx
- [ ] Set up Redis password
- [ ] Configure MinIO with SSL
- [ ] Enable database SSL
- [ ] Set up Sentry for error tracking
- [ ] Configure Prometheus/Grafana
- [ ] Set up alerting channels
- [ ] Test webhook endpoints
- [ ] Verify rate limiting
- [ ] Test backup/restore procedures
- [ ] Set up log aggregation
- [ ] Configure CDN (CloudFront/Fastly)
- [ ] Review security headers
- [ ] Load test critical endpoints
- [ ] Set up database read replicas
- [ ] Configure auto-scaling policies

### 13. Support Contacts

For infrastructure issues:
- CTO: (Your CTO agent)
- DevOps: (Your DevOps agent)

## Quick Start

```bash
# Copy environment template
cp .env.template .env.local

# Set required secrets
# Edit .env.local with your values

# Start services
docker-compose up -d

# Run migrations
npx prisma migrate deploy

# Check health
curl http://localhost:3000/api/health
```

## Monitoring Endpoints

- Health: `GET /api/health`
- Metrics: `GET /api/metrics` (Prometheus)
- Status: `GET /api/status` (detailed status)