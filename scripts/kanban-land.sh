#!/usr/bin/env bash
# Land this card's worktree branch onto the shared trunk (master).
#
# Why this exists
# ---------------
# A `workspace_kind: worktree` card commits to its OWN branch
# (`wt/<task-id>` or `rent-ready/<task-id>-<slug>`). That isolation is the
# point — but it means the commit does NOT appear in the main checkout, and
# the NEXT card branches from the trunk and would not see this card's work.
# Verified 2026-10-03: a commit made in a worktree was reachable only from
# its own branch; `ls` in the main checkout did not see the file.
#
# So a worktree card is not done when its tests are green. It is done when its
# branch is on the trunk. This script does that fast-forward, and refuses
# anything that would need a real merge decision (a human decides that).
#
# Usage
# -----
#   scripts/kanban-land.sh            # land this worktree's branch onto master
#   scripts/kanban-land.sh --check    # report only, change nothing
#   scripts/kanban-land.sh --branch X # land branch X instead of the current one
#
set -euo pipefail

CHECK_ONLY=0
BRANCH=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --check) CHECK_ONLY=1; shift ;;
    --branch) BRANCH="${2:?--branch needs a name}"; shift 2 ;;
    *) echo "kanban-land: unknown argument: $1" >&2; exit 2 ;;
  esac
done

die() { echo "kanban-land: $*" >&2; exit 1; }

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
MAIN="$(dirname "$(git -C "$ROOT" rev-parse --path-format=absolute --git-common-dir)")"
TRUNK="$(git -C "$MAIN" symbolic-ref --quiet --short HEAD || true)"

if [[ "$ROOT" == "$MAIN" ]]; then
  # Already on the trunk: nothing to land, and refusing keeps the script honest.
  echo "kanban-land: already in the main checkout ($ROOT) on ${TRUNK:-detached HEAD}."
  echo "  Nothing to land — your commits are already on the shared tree."
  exit 0
fi

if [[ -z "$BRANCH" ]]; then
  BRANCH="$(git -C "$ROOT" symbolic-ref --quiet --short HEAD || true)"
  [[ -n "$BRANCH" ]] || die "detached HEAD in this worktree — pass --branch <name>."
fi

# Refuse to land a dirty tree: the commit must already be made, or the card is
# not finished. Landing a dirty tree would silently drop the uncommitted part.
if [[ -n "$(git -C "$ROOT" status --porcelain)" ]]; then
  die "worktree has uncommitted changes — commit them (or discard) before landing:
$(git -C "$ROOT" status --short | head -20)"
fi

if ! git -C "$ROOT" rev-parse --verify --quiet "$BRANCH" >/dev/null; then
  die "branch '$BRANCH' does not exist in this worktree."
fi

BASE="$(git -C "$MAIN" symbolic-ref --quiet --short HEAD || true)"
[[ -n "$BASE" ]] || die "the main checkout ($MAIN) is on a detached HEAD — check it out before landing."

if git -C "$MAIN" merge-base --is-ancestor "$BRANCH" "$BASE" 2>/dev/null; then
  echo "kanban-land: '$BRANCH' is already contained in '$BASE' — nothing to do."
  exit 0
fi

if [[ $CHECK_ONLY -eq 1 ]]; then
  echo "would fast-forward '$BASE' to '$BRANCH':"
  git -C "$MAIN" log --oneline "$BASE..$BRANCH" | sed 's/^/  /'
  exit 0
fi

# Fast-forward only, and only when the trunk has NOT moved past our base: a
# non-ff merge is a real integration decision that belongs to a human, not to
# a shell script running inside an agent's card.
# The trunk may itself be dirty (another card mid-edit in a `dir:` workspace).
# Refuse rather than let git abort halfway with a confusing message.
if [[ -n "$(git -C "$MAIN" status --porcelain)" ]]; then
  die "the main checkout ($MAIN) has uncommitted changes — a fast-forward would
     conflict with them. Land after the other card commits or is archived.
$(git -C "$MAIN" status --short | head -10)"
fi

if ! git -C "$MAIN" merge-base --is-ancestor "$BASE" "$BRANCH" 2>/dev/null; then
  die "'$BASE' has moved since this worktree was created and does not contain the
     worktree's commits — this needs a real merge or a rebase, decided by a human.
     Nothing was changed.
     Commits on '$BRANCH' not on '$BASE':
$(git -C "$MAIN" log --oneline "$BASE..$BRANCH" | sed 's/^/  /' | head -20)"
fi

echo "landing '$BRANCH' onto '$BASE':"
git -C "$MAIN" log --oneline "$BASE..$BRANCH" | sed 's/^/  /'
git -C "$MAIN" merge --ff-only "$BRANCH"
echo "ok — '$BASE' is now at $(git -C "$MAIN" rev-parse --short HEAD)."
echo "Remember: 'git worktree remove' on a finished card frees ~2 GB of .next."