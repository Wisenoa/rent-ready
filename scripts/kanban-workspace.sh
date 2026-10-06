#!/usr/bin/env bash
# Prepare this card's git worktree so `pnpm build` / `pnpm test` work.
#
# Why this exists
# ---------------
# Hermes Kanban materialises a card's `workspace_kind: worktree` as a linked git
# worktree under <repo>/.worktrees/<task-id>. That gives each card its OWN
# working tree and its OWN `.next`, which is the point: two agents building or
# testing in the same tree corrupt each other (observed 2026-10-03 on the
# quittance card family: a vanished `.next/BUILD_ID` and a 87s run where 6-12s
# was normal, neither owned by anyone).
#
# But a fresh worktree has NO `node_modules` (2.7 GB, gitignored) and no `.env`.
# The dispatcher does not link them. Without this script every card burns its
# first minutes rediscovering `pnpm install` — or worse, silently installs a
# second copy of the dependency tree inside its worktree.
#
# Usage
# -----
#   scripts/kanban-workspace.sh            # verify + repair this worktree
#   scripts/kanban-workspace.sh --check    # exit 1 if not ready, change nothing
#
set -euo pipefail

CHECK_ONLY=0
[[ "${1:-}" == "--check" ]] && CHECK_ONLY=1

# Resolve the worktree root (this script's dir is <root>/scripts/).
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
MAIN="$(git -C "$ROOT" rev-parse --path-format=absolute --git-common-dir)"
MAIN="$(dirname "$MAIN")"

die() { echo "kanban-workspace: $*" >&2; exit 1; }

# Refuse to run in the main checkout: the whole point is that the main tree is
# shared. Running builds there is what caused the original collisions.
if [[ "$ROOT" == "$MAIN" ]]; then
  die "this is the MAIN checkout ($ROOT), not a card worktree.
     Builds here are shared with every other running card — that is the bug
     this script exists to prevent. Use a worktree under $MAIN/.worktrees/."
fi

link() { # link <relative-path> <description>
  local rel="$1" desc="$2" target="$MAIN/$1" dest="$ROOT/$1"
  if [[ ! -e "$target" ]]; then
    echo "  skip   $desc (no $rel in main checkout)"
    return 0
  fi
  if [[ -L "$dest" ]]; then
    local now; now="$(readlink "$dest")"
    if [[ "$now" == "$target" ]]; then
      echo "  ok     $desc"
      return 0
    fi
    rm "$dest"
  elif [[ -e "$dest" ]]; then
    echo "  ok     $desc (real dir, left alone)"
    return 0
  fi
  if [[ $CHECK_ONLY -eq 1 ]]; then
    die "missing: $rel — run without --check to repair"
  fi
  ln -s "$target" "$dest"
  echo "  linked $desc -> $rel"
}

echo "workspace: $ROOT"
echo "main repo: $MAIN"
link node_modules "node_modules (pnpm store, shared read-mostly)"
link .env         ".env (local secrets, never committed)"

# A worktree carries its own .next; make sure we are not silently reusing the
# main tree's build output through a stray symlink.
if [[ -L "$ROOT/.next" ]]; then
  die ".next is a symlink in a card worktree — that reintroduces the shared-build bug. Remove it: rm $ROOT/.next"
fi

# git status must not offer sibling cards for staging.
if ! git -C "$ROOT" check-ignore -q .worktrees 2>/dev/null; then
  :
fi
if git -C "$ROOT" status --porcelain | grep -q '^?? \.worktrees/'; then
  die ".worktrees/ is not gitignored — 'git add -A' would stage sibling cards. Add /.worktrees/ to .gitignore."
fi

echo "ready."