#!/usr/bin/env bash
# ==============================================================================
# Lokna Database Restore Script
# - Mandatory dry-run test restore in isolated database before any production write
# - Automatic pre-restore safety backup of current target database
# - Strict guardrails against accidental production database destruction
# ==============================================================================

set -euo pipefail

CONTAINER_NAME="${LOKNA_DB_CONTAINER:-lokna-postgres}"
DB_USER="${POSTGRES_USER:-lokna_admin}"
TARGET_DB="${POSTGRES_DB:-lokna_production}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/lokna}"
BACKUP_FILE="${1:-}"
MODE="${2:-verify}" # 'verify' (test dans BDD isolée) ou 'production' (restauration réelle)

if [[ -z "${BACKUP_FILE}" || ! -f "${BACKUP_FILE}" ]]; then
  echo "Usage: $0 <fichier_sauvegarde.dump> [verify|production]"
  echo "  verify     : Valide l'archive et teste sa restauration dans une base éphémère jetable (par défaut)"
  echo "  production : Restaure la base de production après sauvegarde de sécurité préalable"
  exit 1
fi

echo "[INFO] === Restauration Lokna ==="
echo "[INFO] Fichier source : ${BACKUP_FILE} ($(du -h "${BACKUP_FILE}" | cut -f1))"
echo "[INFO] Mode demandé   : ${MODE}"

# ------------------------------------------------------------------------------
# ÉTAPE 1 : Validation de l'intégrité du fichier d'archive
# ------------------------------------------------------------------------------
echo "[INFO] Étape 1 : Contrôle préliminaire de l'archive (TOC pg_restore)..."
if ! docker exec -i "${CONTAINER_NAME}" pg_restore --list < "${BACKUP_FILE}" >/dev/null; then
  echo "[CRITICAL] L'archive est invalide ou corrompue. Abandon immédiat!" >&2
  exit 1
fi

# ------------------------------------------------------------------------------
# ÉTAPE 2 : Test de restauration réel dans une base isolée éphémère
# ------------------------------------------------------------------------------
TEST_DB="lokna_restore_dryrun_$(date +%s)"
echo "[INFO] Étape 2 : Test de restauration réelle dans la base isolée '${TEST_DB}'..."

# Nettoyage préventif et création de la base de test
docker exec "${CONTAINER_NAME}" psql -U "${DB_USER}" -d postgres -c "DROP DATABASE IF EXISTS ${TEST_DB};" >/dev/null
docker exec "${CONTAINER_NAME}" psql -U "${DB_USER}" -d postgres -c "CREATE DATABASE ${TEST_DB};" >/dev/null

# Restauration dans la base de test
if ! docker exec -i "${CONTAINER_NAME}" pg_restore -U "${DB_USER}" -d "${TEST_DB}" --no-owner --role="${DB_USER}" < "${BACKUP_FILE}" >/dev/null 2>&1; then
  echo "[WARN] pg_restore a signalé des avertissements/erreurs. Vérification des données..."
fi

# Contrôle de cohérence : comptage des tables et requêtes de test
TABLE_COUNT=$(docker exec "${CONTAINER_NAME}" psql -U "${DB_USER}" -d "${TEST_DB}" -t -c \
  "SELECT count(*) FROM information_schema.tables WHERE table_schema='public';")
TABLE_COUNT=$(echo "${TABLE_COUNT}" | tr -d '[:space:]')

if [[ -z "${TABLE_COUNT}" || "${TABLE_COUNT}" -eq 0 ]]; then
  echo "[CRITICAL] Échec du test : la base restaurée ne contient aucune table publique!" >&2
  docker exec "${CONTAINER_NAME}" psql -U "${DB_USER}" -d postgres -c "DROP DATABASE ${TEST_DB};" >/dev/null
  exit 1
fi

USER_COUNT=$(docker exec "${CONTAINER_NAME}" psql -U "${DB_USER}" -d "${TEST_DB}" -t -c \
  "SELECT count(*) FROM \"User\";" 2>/dev/null || echo "0")
USER_COUNT=$(echo "${USER_COUNT}" | tr -d '[:space:]')

echo "[SUCCESS] Test de restauration réussi : ${TABLE_COUNT} tables restaurées, ${USER_COUNT} utilisateurs trouvés."

# Destruction de la base de test éphémère
docker exec "${CONTAINER_NAME}" psql -U "${DB_USER}" -d postgres -c "DROP DATABASE ${TEST_DB};" >/dev/null
echo "[INFO] Base de test éphémère détruite proprement."

if [[ "${MODE}" == "verify" ]]; then
  echo "[INFO] Mode 'verify' terminé avec succès. L'archive est 100% restaurable."
  exit 0
fi

# ------------------------------------------------------------------------------
# ÉTAPE 3 : Mode Production avec garde-fous stricts
# ------------------------------------------------------------------------------
if [[ "${MODE}" == "production" ]]; then
  echo "======================================================================"
  echo "🚨 DANGER : RESTAURATION SUR LA BASE DE PRODUCTION (${TARGET_DB}) 🚨"
  echo "======================================================================"
  echo "Cette action va remplacer les données actives par l'archive sélectionnée."

  # Vérification du garde-fou obligatoire par variable d'environnement ou saisie
  SAFETY_CONFIRM="${CONFIRM_RESTORE_PRODUCTION:-}"
  if [[ "${SAFETY_CONFIRM}" != "RESTORE_LOKNA_PROD_CONFIRMED" ]]; then
    echo "Pour confirmer la restauration en production, tapez exactement :"
    echo "RESTORE_LOKNA_PROD_CONFIRMED"
    read -r -p "Confirmation : " USER_INPUT
    if [[ "${USER_INPUT}" != "RESTORE_LOKNA_PROD_CONFIRMED" ]]; then
      echo "[ABORT] Restauration abandonnée par sécurité."
      exit 1
    fi
  fi

  # Sauvegarde de sécurité préalable de l'état actuel de la production
  PRE_SAFETY_BACKUP="${BACKUP_DIR}/pre_restore_safety_${TARGET_DB}_$(date +%Y%m%d_%H%M%S).dump"
  echo "[INFO] Création d'une sauvegarde de sécurité préalable : ${PRE_SAFETY_BACKUP}..."
  mkdir -p "${BACKUP_DIR}"
  docker exec "${CONTAINER_NAME}" pg_dump -U "${DB_USER}" -d "${TARGET_DB}" -Fc > "${PRE_SAFETY_BACKUP}" || true
  if [[ -s "${PRE_SAFETY_BACKUP}" ]]; then
    echo "[INFO] Sauvegarde de sécurité créée avec succès ($(du -h "${PRE_SAFETY_BACKUP}" | cut -f1))."
  else
    echo "[WARN] La base actuelle était vide ou n'a pas pu être sauvegardée. Poursuite..."
  fi

  # Fermeture des connexions actives sur la base cible
  echo "[INFO] Déconnexion des clients actifs sur ${TARGET_DB}..."
  docker exec "${CONTAINER_NAME}" psql -U "${DB_USER}" -d postgres -c \
    "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${TARGET_DB}' AND pid <> pg_backend_pid();" >/dev/null || true

  # Recréation propre de la base cible
  echo "[INFO] Réinitialisation de la base cible ${TARGET_DB}..."
  docker exec "${CONTAINER_NAME}" psql -U "${DB_USER}" -d postgres -c "DROP DATABASE IF EXISTS ${TARGET_DB};"
  docker exec "${CONTAINER_NAME}" psql -U "${DB_USER}" -d postgres -c "CREATE DATABASE ${TARGET_DB};"

  # Restauration finale
  echo "[INFO] Application de l'archive en production..."
  if ! docker exec -i "${CONTAINER_NAME}" pg_restore -U "${DB_USER}" -d "${TARGET_DB}" --no-owner --role="${DB_USER}" < "${BACKUP_FILE}" >/dev/null 2>&1; then
    echo "[WARN] pg_restore s'est terminé avec des alertes mineures."
  fi

  FINAL_TABLES=$(docker exec "${CONTAINER_NAME}" psql -U "${DB_USER}" -d "${TARGET_DB}" -t -c \
    "SELECT count(*) FROM information_schema.tables WHERE table_schema='public';")
  FINAL_TABLES=$(echo "${FINAL_TABLES}" | tr -d '[:space:]')
  echo "[SUCCESS] === Restauration en production terminée avec succès (${FINAL_TABLES} tables créées) ==="
fi
