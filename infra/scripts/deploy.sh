#!/bin/bash
# ========================================
# Deploy Script for Production
# ========================================

set -e

APP_NAME="rent-ready"
DEPLOY_ENV="${DEPLOY_ENV:-production}"
COMPOSE_FILE="docker-compose.prod.yml"

echo "🚀 Deploying $APP_NAME to $DEPLOY_ENV environment..."

# ========================================
# Pre-deployment Checks
# ========================================

echo "✋ Running pre-deployment checks..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running"
    exit 1
fi

# Check if secrets are set
if [ -z "$POSTGRES_PASSWORD" ] || [ -z "$BETTER_AUTH_SECRET" ]; then
    echo "❌ Required secrets not set. Please set POSTGRES_PASSWORD and BETTER_AUTH_SECRET"
    exit 1
fi

# Pull latest images
echo "📦 Pulling latest images..."
docker compose -f docker-compose.yml -f $COMPOSE_FILE pull

# ========================================
# Database Migrations
# ========================================

echo "🔄 Running database migrations..."
docker compose -f docker-compose.yml -f $COMPOSE_FILE exec -T app npx prisma migrate deploy

# ========================================
# Deployment
# ========================================

echo "🚢 Deploying application..."
docker compose -f docker-compose.yml -f $COMPOSE_FILE up -d --remove-orphans --no-deps --build app

echo "⏳ Waiting for health check..."
sleep 10

# ========================================
# Health Check
# ========================================

HEALTH_URL="http://localhost:3000/api/health"
MAX_RETRIES=30
RETRY_COUNT=0

echo "🏥 Performing health check..."
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -f "$HEALTH_URL" > /dev/null 2>&1; then
        echo "✅ Health check passed!"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "⏳ Attempt $RETRY_COUNT/$MAX_RETRIES..."
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "❌ Health check failed. Rolling back..."
    docker compose -f docker-compose.yml -f $COMPOSE_FILE logs --tail=100 app
    exit 1
fi

# ========================================
# Post-deployment
# ========================================

echo "🧹 Cleaning up old images..."
docker image prune -f

echo "✅ Deployment successful!"
echo "📊 Monitor at: https://monitoring.your-domain.com"
echo "🏥 Health: $HEALTH_URL"