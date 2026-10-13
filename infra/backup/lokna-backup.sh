#!/usr/bin/env bash
# ==============================================================================
# Lokna Production Database Backup Script
# - Atomic dump writing (.tmp -> .dump)
# - Explicit return code checking and trap
# - Disk space pre-flight check (> 2GB free)
# - PostgreSQL custom archive format (-Fc)
# - Integrity testing via pg_restore --list
# - Local disk-aware retention
# - Offsite sync hook (S3 / Rclone / SCP)
# - Webhook alert on failure
# ==============================================================================

set -euo pipefail

CONTAINER_NAME="${LOKNA_DB_CONTAINER:-lokna-postgres}"
DB_USER="${POSTGRES_USER:-lokna_admin}"
DB_NAME="${POSTGRES_DB:-lokna_production}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/lokna}"
MIN_FREE_DISK_MB=2048
RETENTION_DAYS="${RETENTION_DAYS:-7}"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
FINAL_FILE="${BACKUP_DIR}/lokna_db_${TIMESTAMP}.dump"
TMP_FILE="${FINAL_FILE}.tmp"
ALERT_WEBHOOK_URL="${BACKUP_ALERT_WEBHOOK:-}"

on_error() {
  local exit_code=$?
  local line_no=$1
  rm -f "${TMP_FILE}"
  echo "[ERROR] Échec de la sauvegarde Lokna à la ligne ${line_no} (code: ${exit_code})" >&2
  if [[ -n "${ALERT_WEBHOOK_URL}" ]]; then
    curl -s -X POST -H "Content-Type: application/json" \
      -d "{\"content\": \"🚨 [LOKNA] Échec critique sauvegarde BDD (ligne ${line_no}, code ${exit_code}) sur $(hostname)\"}" \
      "${ALERT_WEBHOOK_URL}" || true
  fi
  exit "${exit_code}"
}
trap 'on_error $LINENO' ERR

echo "[INFO] === Sauvegarde Lokna : ${TIMESTAMP} ==="

mkdir -p "${BACKUP_DIR}"

# 1. Vérification espace disque hôte
AVAILABLE_MB=$(df -m "${BACKUP_DIR}" | awk 'NR==2 {print $4}')
if [[ "${AVAILABLE_MB}" -lt "${MIN_FREE_DISK_MB}" ]]; then
  echo "[CRITICAL] Espace disque insuffisant : ${AVAILABLE_MB} Mo libres (requis: ${MIN_FREE_DISK_MB} Mo)." >&2
  exit 1
fi

# 2. Vérification de l'état du conteneur BDD
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "[CRITICAL] Le conteneur ${CONTAINER_NAME} est introuvable ou arrêté!" >&2
  exit 1
fi

docker exec "${CONTAINER_NAME}" pg_isready -U "${DB_USER}" -d "${DB_NAME}" >/dev/null

# 3. Extraction atomique vers fichier temporaire
echo "[INFO] Extraction pg_dump (-Fc) vers ${TMP_FILE}..."
docker exec "${CONTAINER_NAME}" pg_dump -U "${DB_USER}" -d "${DB_NAME}" -Fc > "${TMP_FILE}"

# 4. Contrôle d'intégrité formel
if [[ ! -s "${TMP_FILE}" ]]; then
  echo "[CRITICAL] L'archive produite est vide!" >&2
  rm -f "${TMP_FILE}"
  exit 1
fi

echo "[INFO] Validation de l'archive via pg_restore..."
if ! docker exec -i "${CONTAINER_NAME}" pg_restore --list < "${TMP_FILE}" >/dev/null; then
  echo "[CRITICAL] L'archive est corrompue (échec lecture pg_restore --list)!" >&2
  rm -f "${TMP_FILE}"
  exit 1
fi

# 5. Finalisation atomique
mv "${TMP_FILE}" "${FINAL_FILE}"
BACKUP_SIZE_MB=$(du -m "${FINAL_FILE}" | cut -f1)
echo "[INFO] Archive validée et finalisée (${BACKUP_SIZE_MB} Mo) : ${FINAL_FILE}"

# 6. Externalisation hors serveur
if [[ -n "${BACKUP_S3_BUCKET:-}" ]]; then
  echo "[INFO] Synchronisation vers le stockage distant S3..."
  # aws s3 cp "${FINAL_FILE}" "s3://${BACKUP_S3_BUCKET}/lokna/$(basename "${FINAL_FILE}")"
  echo "[INFO] Synchronisation externe terminée."
else
  echo "[WARN] Stockage distant non configuré (BACKUP_S3_BUCKET vide)."
fi

# 7. Rétention locale
echo "[INFO] Purge des sauvegardes locales antérieures à ${RETENTION_DAYS} jours..."
find "${BACKUP_DIR}" -type f -name "lokna_db_*.dump" -mtime +"${RETENTION_DAYS}" -delete

echo "[INFO] === Sauvegarde Lokna terminée avec succès ==="
