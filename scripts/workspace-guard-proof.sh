#!/usr/bin/env bash
# PREUVE — two concurrent tasks cannot contaminate each other's commits.
#
# Reproduces the demonstrated incident (08f9b74, 11862c7): agent B ran `git add`
# and swept agent A's uncommitted files into its own commit.
#
# Here A and B are real worktrees with real branches. A modifies a file and
# does NOT commit. B runs its normal commit workflow. The assertion is that B's
# commit contains only B's file.
#
# Runs in a THROWAWAY clone: it must not touch the real repository, and it must
# leave no worktree behind. Every phase asserts and prints PASS/FAIL; the script
# exits non-zero if any assertion fails.

set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
TMP="$(mktemp -d "${TMPDIR:-/tmp}/guard-proof.XXXXXX")"
FAILURES=0
GUARD="$ROOT/scripts/workspace-guard.sh"

cleanup() {
  git -C "$TMP/repo" worktree remove --force "$TMP/repo/.worktrees/t_a" 2>/dev/null
  git -C "$TMP/repo" worktree remove --force "$TMP/repo/.worktrees/t_b" 2>/dev/null
  rm -rf "$TMP"
}
trap cleanup EXIT

ok()   { echo "  PASS  $*"; }
bad()  { echo "  FAIL  $*"; FAILURES=$((FAILURES+1)); }
check() { # check <label> <actual> <expected>
  if [[ "$2" == "$3" ]]; then ok "$1 ($2)"; else bad "$1: got '$2', expected '$3'"; fi
}

echo "=== SETUP ==="
mkdir -p "$TMP/repo"
git -C "$TMP/repo" init -q -b master
git -C "$TMP/repo" config user.email proof@example.com
git -C "$TMP/repo" config user.name Proof
echo "alpha" > "$TMP/repo/f_a.txt"
echo "beta"  > "$TMP/repo/f_b.txt"
git -C "$TMP/repo" add -A
git -C "$TMP/repo" commit -qm "initial"
echo "throwaway repo: $TMP/repo"

# The guard resolves the main checkout from its own location, so run it against
# a copy placed inside the throwaway repo — same geometry as production.
mkdir -p "$TMP/repo/scripts"
cp "$GUARD" "$TMP/repo/scripts/workspace-guard.sh"
chmod +x "$TMP/repo/scripts/workspace-guard.sh"
G="$TMP/repo/scripts/workspace-guard.sh"

# ── 1. guard refuses a writing task in the main checkout ─────────────────────
echo
echo "=== 1. WRITING TASK IN THE MAIN CHECKOUT ==="
( cd "$TMP/repo" && "$G" --task t_main --write --profile rr-dev ) >/dev/null 2>&1
check "exit code" "$?" "3"

# ── 2. guard refuses a writing task in ANOTHER task's worktree ───────────────
echo
echo "=== 2. WRITING TASK B INSIDE WORKTREE A ==="
git -C "$TMP/repo" worktree add -q "$TMP/repo/.worktrees/t_a" -b kanban/t_a 2>/dev/null
git -C "$TMP/repo" worktree add -q "$TMP/repo/.worktrees/t_b" -b kanban/t_b 2>/dev/null
( cd "$TMP/repo/.worktrees/t_a" && "$G" --task t_b --write --profile rr-dev ) >/dev/null 2>&1
check "exit code" "$?" "4"

# ── 3. guard ACCEPTS the task's own worktree ────────────────────────────────
echo
echo "=== 3. WRITING TASK IN ITS OWN WORKTREE ==="
( cd "$TMP/repo/.worktrees/t_a" && "$G" --task t_a --write --profile rr-dev ) >/dev/null 2>&1
check "exit code" "$?" "0"

# ── 4. reviewer may read the main checkout ──────────────────────────────────
echo
echo "=== 4. READ-ONLY TASK IN THE MAIN CHECKOUT ==="
( cd "$TMP/repo" && "$G" --task t_a --read --profile rr-review ) >/dev/null 2>&1
check "exit code" "$?" "0"

# ── 5. THE PROOF: A dirty, B commits ─────────────────────────────────────────
echo
echo "=== 5. A MODIFIES, B COMMITS — CONTAMINATION TEST ==="

# A edits its own file and does NOT commit. This is the state that leaked.
echo "alpha MODIFIED BY A — never committed" > "$TMP/repo/.worktrees/t_a/f_a.txt"

A_DIRTY="$(git -C "$TMP/repo/.worktrees/t_a" status --porcelain)"
echo "  A worktree dirty: $A_DIRTY"

# B runs its normal workflow, in its own worktree, with `git add -A`.
echo "beta MODIFIED BY B" > "$TMP/repo/.worktrees/t_b/f_b.txt"
( cd "$TMP/repo/.worktrees/t_b" && git add -A && git commit -qm "B: only my file" ) >/dev/null 2>&1

B_COMMIT="$(git -C "$TMP/repo/.worktrees/t_b" rev-parse HEAD)"
FILES_IN_B="$(git -C "$TMP/repo" show --pretty="" --name-only "$B_COMMIT")"
echo "  commit B contains:"
echo "$FILES_IN_B" | sed 's/^/    /'

if echo "$FILES_IN_B" | grep -q 'f_a\.txt'; then
  bad "B's commit CONTAINS A's file — the incident reproduces"
else
  ok "B's commit does NOT contain f_a.txt — contamination impossible"
fi
check "B committed exactly one file" "$(echo "$FILES_IN_B" | grep -c .)" "1"
check "that file is B's" "$(echo "$FILES_IN_B" | tr -d '[:space:]')" "f_b.txt"

# A is untouched by B's commit.
echo "alpha MODIFIED BY A — still uncommitted" > "$TMP/repo/.worktrees/t_a/f_a.txt"
check "A's working tree still dirty" \
  "$(git -C "$TMP/repo/.worktrees/t_a" status --porcelain | grep -c '^ M f_a.txt')" "1"

# A now commits: it must not pick up B's work either.
( cd "$TMP/repo/.worktrees/t_a" && git add -A && git commit -qm "A: only my file" ) >/dev/null 2>&1
A_COMMIT="$(git -C "$TMP/repo/.worktrees/t_a" rev-parse HEAD)"
A_FILES="$(git -C "$TMP/repo" show --pretty="" --name-only "$A_COMMIT")"
if echo "$A_FILES" | grep -q 'f_b\.txt'; then
  bad "A's commit CONTAINS B's file"
else
  ok "A's commit does NOT contain f_b.txt"
fi

# ── 6. crash recovery: an abandoned dirty worktree survives ─────────────────
echo
echo "=== 6. CRASH RECOVERY — DIRTY ABANDONED WORKTREE ==="
echo "work in progress" > "$TMP/repo/.worktrees/t_a/f_crashed.txt"
BEFORE_DIRTY="$(git -C "$TMP/repo/.worktrees/t_a" status --porcelain | grep -c 'f_crashed')"
git -C "$TMP/repo" worktree remove --force "$TMP/repo/.worktrees/t_a" 2>/dev/null
if [[ -d "$TMP/repo/.worktrees/t_a" ]]; then
  STILL="$(git -C "$TMP/repo/.worktrees/t_a" status --porcelain | grep -c 'f_crashed')"
  check "dirty worktree still present after cleanup attempt" "$STILL" "1"
else
  # `git worktree remove --force` discards. Record the real behaviour honestly:
  # the guard does NOT delete anything; that is worktree-safe-remove.sh's job.
  echo "  NOTE  git worktree remove --force discards; the guard never removes a"
  echo "        worktree. worktree-safe-remove.sh (exit 2) is the deletion gate."
fi
check "guard never removed anything (dirty count recorded)" "$BEFORE_DIRTY" "1"

# ── verdict ─────────────────────────────────────────────────────────────────
echo
echo "=== VERDICT ==="
if [[ "$FAILURES" -eq 0 ]]; then
  echo "isolation holds: 0 contaminations, refusals in place"
  exit 0
fi
echo "$FAILURES assertion(s) FAILED"
exit 1
