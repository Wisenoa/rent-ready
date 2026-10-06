#!/usr/bin/env bash
# PRE-FLIGHT GUARD — refuse to let a WRITING agent run in a shared worktree.
#
# Why this exists
# ---------------
# Three scripts already protected worktrees: kanban-workspace.sh (prepare),
# kanban-land.sh (fast-forward onto master), worktree-safe-remove.sh (refuse to
# delete unique work). All three are OPT-IN — the agent has to remember to run
# them. Nothing ran BEFORE an agent started writing.
#
# So the isolation was a rule the agents followed, not a property they had.
# Twice in one session, an agent ran `git add` and swept another agent's
# uncommitted files into its own commit:
#
#   08f9b74 "Un seul prix pour l'entite : 9 EUR/mois"   -> also carried a tenant
#             card click fix, a rate-limit change, 4 E2E specs
#   11862c7 "Choisir un bien affichait son identifiant" -> also carried 2 E2E specs
#
# Both times the code was fine and the HISTORY was wrong: the commit message
# described something other than its content, and the agent that had written the
# files found "nothing added to commit".
#
# There is exactly one cause: two agents with one .git/index and one working
# tree. No rule fixes that. Only a check that runs first and fails closed.
#
# Usage
# -----
#   scripts/workspace-guard.sh --task <id> [--write|--read] [--profile <name>]
#
#   --task     the card/task id being executed (deterministic ownership key)
#   --write    the agent will modify files (default). This is the strict mode.
#   --read     the agent only inspects (reviewer). Main checkout is allowed.
#   --profile  agent profile name, for the error message only
#
# Exit codes
#   0  isolation OK, or a read-only task in the main checkout
#   3  writing task in the MAIN checkout          (the demonstrated incident)
#   4  writing task in ANOTHER task's worktree     (cross-contamination)
#   5  worktree/branch do not match the task id    (ambiguous ownership)
#   2  bad usage

set -uo pipefail

TASK=""; MODE="write"; PROFILE="${HERMES_PROFILE:-unknown}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --task)    TASK="${2:?--task needs a value}"; shift 2 ;;
    --profile) PROFILE="${2:?--profile needs a value}"; shift 2 ;;
    --write)   MODE="write"; shift ;;
    --read)    MODE="read";  shift ;;
    *) echo "workspace-guard: unknown argument: $1" >&2; exit 2 ;;
  esac
done

if [[ -z "$TASK" ]]; then
  echo "workspace-guard: --task <id> is required." >&2
  echo "  There is no safe default: without a task id there is no way to tell" >&2
  echo "  whose worktree this is, and a guard that guesses is worse than none." >&2
  exit 2
fi

# ── Resolve this checkout ────────────────────────────────────────────────────
# ROOT must be the CALLER'S working tree, not the directory this script lives
# in. Resolving from BASH_SOURCE made the guard answer "main checkout" whenever
# it was invoked from the main tree, even with the agent's cwd inside a card
# worktree — a bypass, and a wrong answer. The proof script caught it: sections
# 2 and 3 both got 3 instead of 4 and 0.
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd -P)"
ROOT="$(cd "$ROOT" && pwd -P)"
COMMON="$(git -C "$ROOT" rev-parse --path-format=absolute --git-common-dir 2>/dev/null || true)"
[[ -n "$COMMON" ]] || { echo "workspace-guard: not a git checkout ($ROOT)" >&2; exit 2; }
MAIN="$(cd "$(dirname "$COMMON")" && pwd -P)"
BRANCH="$(git -C "$ROOT" symbolic-ref --quiet --short HEAD 2>/dev/null || echo '(detached)')"
WT_COUNT="$(git -C "$MAIN" worktree list --porcelain | grep -c '^worktree ' || true)"

refuse() { # refuse <code> <message...>
  local code="$1"; shift
  {
    echo "workspace-guard: REFUSED (exit $code)"
    echo
    echo "  task    : $TASK"
    echo "  profile : $PROFILE"
    echo "  mode    : $MODE"
    echo "  cwd     : $ROOT"
    echo "  branch  : $BRANCH"
    echo "  worktrees in repo: $WT_COUNT"
    echo
    echo "$@"
    echo
    echo "  This is a FAIL-CLOSED check. There is no warning mode for a writing"
    echo "  agent: an agent that can modify the shared checkout can also commit"
    echo "  another agent's uncommitted work, which has already happened twice."
    echo
    echo "  Run from a task worktree:"
    echo "    git -C $MAIN worktree add $MAIN/.worktrees/$TASK -b kanban/$TASK"
    echo "    scripts/kanban-workspace.sh"
    echo "  then re-run this guard from there."
  } >&2
  exit "$code"
}

# ── Read-only tasks: the main checkout is exactly what they are for ──────────
if [[ "$MODE" == "read" ]]; then
  echo "workspace-guard: OK (read-only) task=$TASK profile=$PROFILE cwd=$ROOT"
  exit 0
fi

# ── Writing task in the shared main checkout — the demonstrated incident ─────
if [[ "$ROOT" == "$MAIN" ]]; then
  refuse 3 "This is a WRITING task running in the SHARED MAIN CHECKOUT.

master is the landing branch. Every agent that writes here shares one
.git/index, one working tree and one .next with every other agent, whether they
touch the same files or not."
fi

# ── Ownership: does this worktree belong to THIS task? ───────────────────────
# Ownership is the task id in the directory name. Not a heuristic about branches
# or commit messages — a value that is written down when the worktree is created
# and cannot be changed by accident afterwards.
if [[ "$(basename "$ROOT")" != "$TASK" ]]; then
  # A worktree whose name is not this task's id. Either someone else's card, or
  # a hand-made directory. Both are refused: we cannot prove ownership, and an
  # unprovable workspace is how the contamination happened.
  refuse 4 "This worktree belongs to ANOTHER task.

  this worktree : $(basename "$ROOT")
  this task     : $TASK

Task B running in task A's worktree writes into A's .git/index. Whatever B
commits, A is responsible for."
fi

# ── Branch must match the task too ───────────────────────────────────────────
if [[ "$BRANCH" != "kanban/$TASK" && "$BRANCH" != "wt/$TASK" ]]; then
  refuse 5 "Branch '$BRANCH' does not match task '$TASK'.

Expected 'kanban/$TASK'. A branch named after the task keeps 'git log' readable:
a commit that lands on master under someone else's message has no owner left."
fi

echo "workspace-guard: OK task=$TASK profile=$PROFILE"
echo "  cwd    : $ROOT"
echo "  branch : $BRANCH"
echo "  .next  : $ROOT/.next (isolated from $MAIN/.next)"
exit 0
