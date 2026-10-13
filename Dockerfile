# ==============================================================================
# Lokna Production Dockerfile (Multi-stage)
# Next.js 15 App Router Standalone + Dedicated Prisma Migrator
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Base Alpine with Node.js & PNPM
# ------------------------------------------------------------------------------
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

# ------------------------------------------------------------------------------
# Stage 2: Install dependencies
# ------------------------------------------------------------------------------
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY prisma.config.ts ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

# ------------------------------------------------------------------------------
# Stage 3: Builder
# ------------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time public variables (safe public constants)
ARG NEXT_PUBLIC_SITE_URL=https://lokna.fr
ARG NEXT_PUBLIC_APP_URL=https://lokna.fr
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""

ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV DATABASE_URL="postgresql://placeholder:placeholder@127.0.0.1:5432/lokna_production?schema=public"
ENV BETTER_AUTH_SECRET="build_secret_placeholder_for_next_static_build_only"

# Generate Prisma Client
RUN pnpm exec prisma generate

# Build Next.js application
RUN pnpm run build

# ------------------------------------------------------------------------------
# Stage 4: Dedicated Migrator (Executes prisma migrate deploy before app starts)
# ------------------------------------------------------------------------------
FROM base AS migrator
WORKDIR /app

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml ./
COPY prisma.config.ts ./
COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma

CMD ["pnpm", "exec", "prisma", "migrate", "deploy"]

# ------------------------------------------------------------------------------
# Stage 5: Production Runner (Non-root Next.js Standalone)
# ------------------------------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache wget libc6-compat openssl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Unprivileged system user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public static files
COPY --from=builder /app/public ./public

# Setup prerender cache directory permissions
RUN mkdir -p .next && chown -R nextjs:nodejs .next

# Copy standalone build and static chunks
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Ensure Prisma schema, migrations, and CLI are present in the runner
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --chown=nextjs:nodejs prisma.config.ts ./
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]