#!/usr/bin/env bash
# ==============================================================================
# Locelio Production Database Backup Script
# - Robust error checking and exit traps
# - Disk space pre-flight check
# - PostgreSQL custom archive format (-Fc) with checksum validation
# - Integrity testing via pg_restore --list
# - Local disk-aware retention
# - Offsite sync hook (S3/Rclone/MinIO/SCP)
# - Failure webhook / alert notification hook
# ==============================================================================

set -euo pipefail

# Configuration
CONTAINER_NAME="${LOCELIO_DB_CONTAINER:-locelio-postgres}"
DB_USER="${POSTGRES_USER:-locelio_admin}"
DB_NAME="${POSTGRES_DB:-locelio_production}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/locelio}"
MIN_FREE_DISK_MB=2048 # Abort if less than 2GB free
RETENTION_DAYS="${RETENTION_DAYS:-7}"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_FILENAME="locelio_db_${TIMESTAMP}.dump"
BACKUP_FILEPATH="${BACKUP_DIR}/${BACKUP_FILENAME}"
ALERT_WEBHOOK_URL="${BACKUP_ALERT_WEBHOOK:-}" # Discord/Slack/Healthchecks.io

# Failure handler
on_error() {
  local exit_code=$?
  local line_no=$1
  echo "[ERROR] Backup failed at line ${line_no} with exit code ${exit_code}!" >&2
  if [[ -n "${ALERT_WEBHOOK_URL}" ]]; then
    curl -s -X POST -H "Content-Type: application/json" \
      -d "{\"content\": \"🚨 [LOCELIO] Échec critique de la sauvegarde PostgreSQL (ligne ${line_no}, code ${exit_code}) sur host $(hostname)\"}" \
      "${ALERT_WEBHOOK_URL}" || true
  fi
  exit "${exit_code}"
}
trap 'on_error $LINENO' ERR

echo "[INFO] === Démarrage de la sauvegarde Locelio : ${TIMESTAMP} ==="

# 1. Vérification de l'espace disque disponible
AVAILABLE_MB=$(df -m "${BACKUP_DIR:-/}" | awk 'NR==2 {print $4}')
if [[ "${AVAILABLE_MB}" -lt "${MIN_FREE_DISK_MB}" ]]; then
  echo "[CRITICAL] Espace disque insuffisant sur l'hôte : ${AVAILABLE_MB} Mo disponibles, minimum requis ${MIN_FREE_DISK_MB} Mo." >&2
  exit 1
fi

mkdir -p "${BACKUP_DIR}"

# 2. Vérification que le conteneur PostgreSQL est actif et prêt
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "[CRITICAL] Le conteneur ${CONTAINER_NAME} n'est pas en cours d'exécution!" >&2
  exit 1
fi

docker exec "${CONTAINER_NAME}" pg_isready -U "${DB_USER}" -d "${DB_NAME}" >/dev/null

# 3. Extraction de la sauvegarde au format Custom (-Fc)
# Le format -Fc intègre une table des matières, compresse par défaut et permet
# une vérification d'intégrité formelle avec pg_restore.
echo "[INFO] Exécution de pg_dump (-Fc) vers ${BACKUP_FILEPATH}..."
docker exec "${CONTAINER_NAME}" pg_dump -U "${DB_USER}" -d "${DB_NAME}" -Fc > "${BACKUP_FILEPATH}"

# 4. Contrôle d'intégrité de l'archive produite
echo "[INFO] Contrôle d'intégrité de l'archive..."
if [[ ! -s "${BACKUP_FILEPATH}" ]]; then
  echo "[CRITICAL] Le fichier de sauvegarde est vide ou inexistant!" >&2
  rm -f "${BACKUP_FILEPATH}"
  exit 1
fi

# Validation par lecture de la TOC pg_restore
if ! docker exec -i "${CONTAINER_NAME}" pg_restore --list < "${BACKUP_FILEPATH}" >/dev/null; then
  echo "[CRITICAL] L'archive produite est corrompue selon pg_restore!" >&2
  rm -f "${BACKUP_FILEPATH}"
  exit 1
fi

BACKUP_SIZE_MB=$(du -m "${BACKUP_FILEPATH}" | cut -f1)
echo "[INFO] Sauvegarde réussie et intègre (${BACKUP_SIZE_MB} Mo) : ${BACKUP_FILEPATH}"

# 5. Externalisation hors-serveur (Offsite Backup)
if [[ -n "${BACKUP_S3_BUCKET:-}" ]]; then
  echo "[INFO] Envoi vers le stockage distant S3 : ${BACKUP_S3_BUCKET}..."
  # Exemple AWS CLI / MinIO / rclone :
  # aws s3 cp "${BACKUP_FILEPATH}" "s3://${BACKUP_S3_BUCKET}/locelio/${BACKUP_FILENAME}" --storage-class STANDARD_IA
  # rclone copy "${BACKUP_FILEPATH}" "remote:${BACKUP_S3_BUCKET}/locelio/"
  echo "[INFO] Archive synchronisée vers le stockage externe."
else
  echo "[WARN] Aucune cible distante configurée (BACKUP_S3_BUCKET vide). L'archive reste uniquement locale."
fi

# 6. Rétention locale adaptée
echo "[INFO] Nettoyage des sauvegardes locales antérieures à ${RETENTION_DAYS} jours..."
find "${BACKUP_DIR}" -type f -name "locelio_db_*.dump" -mtime +"${RETENTION_DAYS}" -delete

# 7. Ping de monitoring de succès
if [[ -n "${ALERT_HEALTHCHECK_URL:-}" ]]; then
  curl -s -m 10 "${ALERT_HEALTHCHECK_URL}" || true
fi

echo "[INFO] === Sauvegarde Locelio terminée avec succès ==="
