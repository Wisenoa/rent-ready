#!/usr/bin/env bash
# Garde-fou AVANT suppression d'un worktree ou d'une branche de carte.
#
# Erreur observee en session : une branche portant un commit non merge a ete
# supprimee sur la seule foi de `git log master..HEAD`, qui affiche un travail
# deja cherry-pickle. Les deux mesures doivent concorder AVANT toute suppression.
#
# Usage : scripts/worktree-safe-remove.sh <branche|worktree>
set -uo pipefail

TARGET="${1:?usage: worktree-safe-remove.sh <branche|worktree>}"

cd "$(git rev-parse --show-toplevel)" || exit 1

# 1. Localiser la branche, qu'elle soit dans un worktree ou non.
WT=""
for d in .worktrees/*/; do
  [ -d "$d" ] || continue
  b=$(git -C "$d" rev-parse --abbrev-ref HEAD 2>/dev/null)
  [ "$b" = "$TARGET" ] && WT="${d%/}"
done

# Une cible qui n'existe ni comme worktree ni comme branche ne doit surtout pas
# faire tomber le script sur l'etat du master : la premiere version le faisait, et
# sortait avec 0 en laissant croire que tout etait propre.
if [ -z "$WT" ] && ! git rev-parse --verify --quiet "$TARGET" >/dev/null; then
  echo "cible introuvable: $TARGET"
  echo "ni worktree dans .worktrees/, ni branche locale."
  exit 4
fi

IN_WT=0
[ -n "$WT" ] && IN_WT=1

echo "=== 1. TRAVAIL NON COMMITTE ==="
if [ "$IN_WT" = 1 ]; then
  # `-C $WT` fait afficher les chemins relativement au worktree, ce qui donne
  # « ../../scripts/… » dans la sortie. On ramene tout au racine du depot.
  DIRTY=$(git -C "$WT" status --short --untracked-files=all | sed "s| ../../|  |; s| \.\./\.\./| |")
else
  DIRTY=$(git status --short)
fi
if [ -n "$DIRTY" ]; then
  echo "$DIRTY"
  echo "-> SAUVEGARDE REQUISE avant suppression."
  exit 2
fi
echo "propre"

echo "=== 2. COMMITS UNIQUES (git log master..HEAD) ==="
LOG=$(git log "master..$TARGET" --oneline)
[ -n "$LOG" ] && echo "$LOG" || echo "aucun"

echo "=== 3. PATCHES NON APPLIQUES (git cherry) ==="
CHERRY=$(git cherry master "$TARGET" 2>/dev/null)
PATCH=$(echo "$CHERRY" | grep -c '^+' || true)
echo "$PATCH patch(s) marque(s) non applique(s) par git cherry"

echo "=== 4. DIFF REEL CONTRE master (contenu, pas etiquette) ==="
# `git cherry` seul ne suffit pas : un patch peut avoir ete integre autrement
# (cherry-pick, squash, reecriture). La seule preuve est le contenu des fichiers.
DIFFSTAT=$(git diff master "$TARGET" --stat 2>/dev/null | tail -1)
echo "${DIFFSTAT:-identique a master}"

echo "=== VERDICT ==="
if [ -n "$LOG" ] && [ "${PATCH:-0}" -gt 0 ] && [ -n "$DIFFSTAT" ]; then
  echo "TRAVAIL UNIQUE PRESENT — ne pas supprimer sans land / cherry-pick / sauvegarde."
  exit 3
fi
if [ -n "$LOG" ] && [ -n "$DIFFSTAT" ]; then
  echo "Diff reel malgre des commits partages : INSPECTER le contenu avant de conclure."
  exit 3
fi
echo "aucun travail unique detecte — suppression autorisee"