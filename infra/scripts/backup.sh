#!/bin/bash
# ========================================
# Database Backup Script
# ========================================

set -e

BACKUP_DIR="/backups/postgres"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/rent-ready_$TIMESTAMP.sql.gz"

echo "🗄️ Starting PostgreSQL backup..."

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup database
docker compose exec -T postgres pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" | gzip > "$BACKUP_FILE"

# Keep last 7 days of backups
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +7 -delete

echo "✅ Backup created: $BACKUP_FILE"

# Upload to S3 (if configured)
if [ -n "$BACKUP_S3_BUCKET" ]; then
    echo "☁️ Uploading backup to S3..."
    aws s3 cp "$BACKUP_FILE" "s3://$BACKUP_S3_BUCKET/postgres/"
    echo "✅ Backup uploaded to S3"
fi

# ========================================
# Backup Verification
# ========================================

BACKUP_SIZE=$(stat -f%z "$BACKUP_FILE" 2>/dev/null || stat -c%s "$BACKUP_FILE" 2>/dev/null)
if [ "$BACKUP_SIZE" -lt 1000 ]; then
    echo "⚠️ Warning: Backup size is suspiciously small ($BACKUP_SIZE bytes)"
    exit 1
fi

echo "📊 Backup size: $BACKUP_SIZE bytes"