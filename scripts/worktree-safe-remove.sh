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
#
# It used to be a scan of `.worktrees/*/`:
#
#   for d in .worktrees/*/; do … done
#
# which is a guess at where worktrees live. A worktree anywhere else — /tmp, or
# the per-mission folders an agent fleet creates under ~/.codex/worktrees/ — was
# simply not found, so the target was treated as a BARE BRANCH and the dirty check
# below fell through to `git status` in whatever directory the script was invoked
# from. That is the main checkout. So an unrelated `AGENTS.md` edit in the main
# checkout blocked the removal of a worktree that was itself clean and fully
# landed. Observed on this repo: the guard reported "SAUVEGARDE REQUISE" for a
# branch whose worktree sat in /tmp, listing two files that had nothing to do
# with it.
#
# `git worktree list --porcelain` is the authoritative mapping and knows about
# every registered worktree, wherever it is. The question is "is this branch
# checked out somewhere", not "did someone put it in the directory I expected".
WT=""
WT_BRANCH=""
while IFS= read -r wt_path; do
  b=$(git -C "$wt_path" rev-parse --abbrev-ref HEAD 2>/dev/null) || continue
  if [ "$b" = "$TARGET" ]; then
    WT="$wt_path"
    WT_BRANCH="$b"
    break
  fi
done < <(git worktree list --porcelain | sed -n 's/^worktree //p')

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
  # `-C $WT` affiche les chemins relativement au worktree (« ../../scripts/… »),
  # ce qui pollue la sortie. On ramene tout au racine du depot.
  #
  # The two substitutions are separated by `;` INSIDE the quoted script. Writing
  # a space there instead makes it one substitution whose replacement text is
  # "  | s| \.\./\.\./| |", sed rejects it with "bad flag in substitute
  # command", and $DIRTY comes back EMPTY — so a dirty worktree is reported
  # "propre" and authorised for deletion. That is the exact failure this script
  # exists to prevent, introduced by an edit that looked cosmetic.
  #
  # So the status must be fail-closed: if the command errors, the answer is
  # "cannot prove it is clean", which is a refusal. A check that cannot answer
  # must never read as a pass.
  if ! DIRTY_RAW=$(git -C "$WT" status --short --untracked-files=all 2>&1); then
    echo "  impossible de lire l'etat de $WT :"
    echo "$DIRTY_RAW" | sed 's/^/  | /'
    echo "-> ETAT INCONNU. Refus de supprimer : une verification qui ne repond pas"
    echo "   ne vaut pas une verification qui repond 'propre'."
    exit 5
  fi
  DIRTY=$(printf '%s\n' "$DIRTY_RAW" | sed "s| ../../|  |; s| \.\./\.\./| |")
else
  # BARE BRANCH: there is no worktree to be dirty, so the only thing that can
  # block is uncommitted work reachable from where the script was invoked.
  #
  # That used to be `git status --short`, which answers a question about the
  # CURRENT checkout — the main one, in practice. An unrelated edit there blocked
  # a branch that had nothing uncommitted of its own. The question relevant to a
  # bare branch is whether the branch differs from the trunk, which is question 4
  # below and is about CONTENT, not about somebody else's working tree. So the
  # main checkout's state is deliberately not consulted here.
  DIRTY=""
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