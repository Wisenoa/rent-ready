#!/usr/bin/env bash
# Adversity test for scripts/worktree-safe-remove.sh.
#
# The false refusal: a worktree that is itself clean and fully landed was blocked
# because the MAIN checkout had an unrelated uncommitted edit. The guard located
# worktrees by scanning `.worktrees/*/`, so a worktree living anywhere else was
# treated as a bare branch, and the bare-branch path ran `git status` — a question
# about the caller's checkout, i.e. the main one.
#
# This builds the matrix, runs the real guard, and asserts what it decides. It
# touches only a throwaway repository in a temp directory; the real checkout is
# never involved.
set -uo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
GUARD="$ROOT_DIR/scripts/worktree-safe-remove.sh"

SANDBOX="$(mktemp -d -t wt-guard-test.XXXXXX)"
REPO="$SANDBOX/repo"
WT="$SANDBOX/wt"
FAILURES=0

cleanup() {
  # Detach every worktree first, or rmdir complains.
  for d in "$REPO" "$WT"/A "$WT"/B "$WT"/C "$WT"/D; do
    [ -d "$d" ] && git -C "$REPO" worktree remove --force "$d" 2>/dev/null
  done
  rm -rf "$SANDBOX"
}
trap cleanup EXIT

check() { # <label> <expected: allow|refuse> <actual exit code>
  local label="$1" expected="$2" code="$3"
  if [ "$expected" = "allow" ] && [ "$code" -eq 0 ]; then
    echo "  OK    $label -> autorise (0)"
  elif [ "$expected" = "refuse" ] && [ "$code" -ne 0 ]; then
    echo "  OK    $label -> refuse ($code)"
  else
    echo "  ECHEC $label -> attendu $expected, obtenu code $code"
    FAILURES=$((FAILURES + 1))
  fi
}

mkdir -p "$REPO" "$WT"
cd "$REPO"
git init -q -b master .
git config user.email "guard@test.local"
git config user.name "guard"
mkdir -p scripts
cp "$GUARD" scripts/
git add -A
git commit -qm "init"

# ---------------------------------------------------------------- the matrix
# A: clean, fully landed on master
git worktree add -q "$WT/A" -b wt/A
( cd "$WT/A" && echo a > a.txt && git add -A && git commit -qm "travail A" )
git merge -q --ff-only wt/A

# B: dirty — uncommitted work that must never be lost
git worktree add -q "$WT/B" -b wt/B
( cd "$WT/B" && echo b > b.txt && git add -A && git commit -qm "travail B" )
git merge -q --ff-only wt/B
( cd "$WT/B" && echo "modification non commitée" >> b.txt )

# C: clean, but carries a commit that is NOT on the trunk
git worktree add -q "$WT/C" -b wt/C
( cd "$WT/C" && echo c > c.txt && git add -A && git commit -qm "travail C non atterri" )

# D: bare branch, no worktree at all, fully landed
git branch wt/D master

# The main checkout is dirty — an unrelated file, belonging to nobody here.
echo "modification etrangere" >> AGENTS.md

echo "=== worktree-safe-remove.sh : matrice d'adversite ==="
echo "main checkout volontairement sale : $(git status --short | tr '\n' ' ')"

( cd "$REPO" && bash scripts/worktree-safe-remove.sh wt/A >/dev/null 2>&1 ); check "A propre + atterri (main sale)" allow $?
( cd "$REPO" && bash scripts/worktree-safe-remove.sh wt/B >/dev/null 2>&1 ); check "B sale" refuse $?
( cd "$REPO" && bash scripts/worktree-safe-remove.sh wt/C >/dev/null 2>&1 ); check "C commit unique non atterri" refuse $?
( cd "$REPO" && bash scripts/worktree-safe-remove.sh wt/D >/dev/null 2>&1 ); check "D branche nue, atterrie (main sale)" allow $?
( cd "$REPO" && bash scripts/worktree-safe-remove.sh wt/inexistant >/dev/null 2>&1 ); check "cible inexistante" refuse $?

echo "=== le travail de B est-il intact ? ==="
if [ -f "$WT/B/b.txt" ] && grep -q "non commitée" "$WT/B/b.txt"; then
  echo "  OK    le fichier non commité de B a survécu"
else
  echo "  ECHEC le travail de B a disparu"
  FAILURES=$((FAILURES + 1))
fi

echo "=== le commit de C est-il intact ? ==="
if git -C "$WT/C" rev-parse --verify --quiet HEAD >/dev/null 2>&1 && \
   [ "$(git rev-list --count master..wt/C)" -ge 1 ]; then
  echo "  OK    le commit unique de C est toujours sur sa branche"
else
  echo "  ECHEC le commit de C a disparu"
  FAILURES=$((FAILURES + 1))
fi

echo "=== AGENTS.md du main a-t-il ete touche ? ==="
if [ -f "$REPO/AGENTS.md" ] && grep -q "modification etrangere" "$REPO/AGENTS.md"; then
  echo "  OK    intact"
else
  echo "  ECHEC AGENTS.md a ete altere"
  FAILURES=$((FAILURES + 1))
fi

echo
if [ "$FAILURES" -eq 0 ]; then
  echo "toutes les decisions sont correctes"
else
  echo "$FAILURES decision(s) incorrecte(s)"
fi
exit "$FAILURES"
