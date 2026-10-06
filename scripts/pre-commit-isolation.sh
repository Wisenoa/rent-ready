#!/usr/bin/env bash
# PRE-COMMIT — refuse a contaminated commit from leaving the shared checkout.
#
# Why this exists
# ---------------
# The Kanban board's default_workdir is the main checkout, and MEASURED on this
# board: 17 cards with workspace_kind=dir, 13 scratch, and ZERO worktree. So no
# card has ever been dispatched into an isolated worktree — every writing card
# ran in the shared tree. That is the structural cause of the contamination, not
# carelessness:
#
#   08f9b74 "Un seul prix pour l'entite" -> also carried another agent's E2E specs
#   11862c7 "Choisir un bien"            -> also carried another agent's E2E specs
#
# workspace-guard.sh is the pre-flight check, but it is opt-in: nothing called it.
# A git hook is not. It fires for every `git commit` in this repository, whoever
# runs it, in any tool — so it catches the case the guard could not: a worker
# that simply did not think to call it.
#
# It is deliberately narrow. It refuses a commit made in the MAIN checkout.
# That is the one situation that cannot be legitimate for a card, because
# master is the landing branch: a commit landing there is, by definition, not
# isolated. Commits inside card worktrees are untouched.
#
# Escape hatch, explicit and loud:
#   RR_ALLOW_SHARED_COMMIT=1 git commit ...   # humans landing on master
#
# Install:  scripts/install-commit-guard.sh
# Remove:   rm .git/hooks/pre-commit

ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || exit 0
COMMON="$(git rev-parse --path-format=absolute --git-common-dir 2>/dev/null || true)"
MAIN="$(cd "$(dirname "$COMMON")" 2>/dev/null && pwd -P)"

# Outside a git repo, or unable to resolve it: stay out of the way.
[[ -n "${ROOT:-}" && -n "${MAIN:-}" ]] || exit 0

if [[ "$ROOT" != "$MAIN" ]]; then
  # Inside a card worktree: this is the isolated case. Nothing to say.
  exit 0
fi

if [[ "${RR_ALLOW_SHARED_COMMIT:-0}" == "1" ]]; then
  echo "pre-commit: shared commit allowed by RR_ALLOW_SHARED_COMMIT=1" >&2
  exit 0
fi

BRANCH="$(git symbolic-ref --quiet --short HEAD 2>/dev/null || echo '(detached)')"

cat >&2 <<EOF
pre-commit: REFUSED

  This commit would land directly on the SHARED checkout:

    repo   : $MAIN
    branch : $BRANCH

  Measured on the rent-ready board: 17 cards with workspace_kind=dir, 0 with
  worktree. The board's default_workdir IS this checkout, so a card that does
  not ask for a worktree runs here — together with every other agent, sharing
  one .git/index and one working tree. 'git add -A' from another agent then
  sweeps this uncommitted work into ITS commit, and the commit message
  describes something else entirely. That has happened twice on this repo.

  If this is a card's work, it belongs in its own worktree:

    git worktree add .worktrees/<task-id> -b kanban/<task-id>
    scripts/kanban-workspace.sh
    scripts/workspace-guard.sh --task <task-id> --write

  If you are a human landing reviewed work on master, or this repository is
  being used single-agent on purpose, say so explicitly:

    RR_ALLOW_SHARED_COMMIT=1 git commit -m "..."

  Nothing was committed. No file was staged by this hook.
EOF

exit 1
