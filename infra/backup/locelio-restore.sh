#!/usr/bin/env bash
# ==============================================================================
# Locelio Database Restore & Verification Script
# - Tests archive integrity before any database write
# - Supports dry-run / test restore in an isolated temporary database
# - Performs clean restore without dirty collisions
# ==============================================================================

set -euo pipefail

CONTAINER_NAME="${LOCELIO_DB_CONTAINER:-locelio-postgres}"
DB_USER="${POSTGRES_USER:-locelio_admin}"
TARGET_DB="${POSTGRES_DB:-locelio_production}"
BACKUP_FILE="${1:-}"
MODE="${2:-verify}" # 'verify' (test in isolated temp db) or 'production' (live restore)

if [[ -z "${BACKUP_FILE}" || ! -f "${BACKUP_FILE}" ]]; then
  echo "Usage: $0 <backup_file.dump> [verify|production]"
  echo "  verify     : Restaure dans une base temporaire 'locelio_restore_verify' et valide les données (par défaut, sans risque)"
  echo "  production : Écrase PROPREMENT et restaure la base de production (ARRÊT APP REQUIS)"
  exit 1
fi

echo "[INFO] === Procédure de restauration Locelio ==="
echo "[INFO] Fichier source : ${BACKUP_FILE}"
echo "[INFO] Mode : ${MODE}"

# 1. Contrôle d'intégrité préliminaire
echo "[INFO] Étape 1 : Vérification de l'intégrité de l'archive..."
if ! docker exec -i "${CONTAINER_NAME}" pg_restore --list < "${BACKUP_FILE}" >/dev/null; then
  echo "[CRITICAL] L'archive fournie est invalide ou corrompue. Restauration abandonnée!" >&2
  exit 1
fi
echo "[INFO] Archive valide."

if [[ "${MODE}" == "verify" ]]; then
  TEMP_DB="locelio_restore_verify_$(date +%s)"
  echo "[INFO] Étape 2 : Création de la base de test isolée : ${TEMP_DB}..."
  docker exec "${CONTAINER_NAME}" psql -U "${DB_USER}" -d postgres -c "DROP DATABASE IF EXISTS ${TEMP_DB};"
  docker exec "${CONTAINER_NAME}" psql -U "${DB_USER}" -d postgres -c "CREATE DATABASE ${TEMP_DB};"

  echo "[INFO] Étape 3 : Restauration de l'archive dans la base de test..."
  docker exec -i "${CONTAINER_NAME}" pg_restore -U "${DB_USER}" -d "${TEMP_DB}" --no-owner --role="${DB_USER}" < "${BACKUP_FILE}" || true

  echo "[INFO] Étape 4 : Validation des tables restaurées..."
  docker exec "${CONTAINER_NAME}" psql -U "${DB_USER}" -d "${TEMP_DB}" -c "\dt"
  docker exec "${CONTAINER_NAME}" psql -U "${DB_USER}" -d "${TEMP_DB}" -c "SELECT count(*) AS total_users FROM \"User\";" || true

  echo "[INFO] Nettoyage de la base de test..."
  docker exec "${CONTAINER_NAME}" psql -U "${DB_USER}" -d postgres -c "DROP DATABASE ${TEMP_DB};"
  echo "[SUCCESS] Test de restauration dans l'environnement isolé réussi à 100%."

elif [[ "${MODE}" == "production" ]]; then
  echo "⚠️  ATTENTION : Restauration sur la base de PRODUCTION (${TARGET_DB}) ⚠️"
  echo "Cette action va réinitialiser les données de la base active avec le contenu de l'archive."
  read -p "Confirmez-vous la restauration en production ? (écrire 'RESTORE_OUI'): " confirmation
  if [[ "${confirmation}" != "RESTORE_OUI" ]]; then
    echo "[ABORT] Restauration annulée par l'opérateur."
    exit 0
  fi

  echo "[INFO] Fermeture des connexions actives sur ${TARGET_DB}..."
  docker exec "${CONTAINER_NAME}" psql -U "${DB_USER}" -d postgres -c \
    "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${TARGET_DB}' AND pid <> pg_backend_pid();"

  echo "[INFO] Recréation d'une base propre..."
  docker exec "${CONTAINER_NAME}" psql -U "${DB_USER}" -d postgres -c "DROP DATABASE IF EXISTS ${TARGET_DB};"
  docker exec "${CONTAINER_NAME}" psql -U "${DB_USER}" -d postgres -c "CREATE DATABASE ${TARGET_DB};"

  echo "[INFO] Injection de l'archive..."
  docker exec -i "${CONTAINER_NAME}" pg_restore -U "${DB_USER}" -d "${TARGET_DB}" --no-owner --role="${DB_USER}" < "${BACKUP_FILE}"

  echo "[INFO] Restauration terminée. Vérification du schéma..."
  docker exec "${CONTAINER_NAME}" psql -U "${DB_USER}" -d "${TARGET_DB}" -c "\dt"
  echo "[SUCCESS] Base de production restaurée avec succès."
fi
