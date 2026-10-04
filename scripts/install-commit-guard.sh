#!/usr/bin/env bash
# Install the pre-commit isolation guard into this repository's git hooks.
# Idempotent. Prints what it did.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
HOOKS="$(git -C "$ROOT" rev-parse --path-format=absolute --git-common-dir)/hooks"
TARGET="$HOOKS/pre-commit"
SRC="$ROOT/scripts/pre-commit-isolation.sh"

[[ -f "$SRC" ]] || { echo "missing $SRC" >&2; exit 1; }
mkdir -p "$HOOKS"

if [[ -e "$TARGET" && ! -f "$TARGET/scripts/pre-commit-isolation.sh" ]] && \
   ! grep -q 'pre-commit: REFUSED' "$TARGET" 2>/dev/null; then
  # Never silently overwrite someone else's hook.
  echo "ERROR: $TARGET already exists and is not ours." >&2
  echo "  Merge manually, or move it aside:" >&2
  echo "    mv $TARGET $TARGET.orig" >&2
  exit 1
fi

cp "$SRC" "$TARGET"
chmod +x "$TARGET"
echo "installed: $TARGET"
echo
echo "Test it in this repo:"
echo "  git commit -m x        # in main checkout -> REFUSED"
echo "  (inside .worktrees/<id>) -> allowed, that is the isolated case"
echo "  RR_ALLOW_SHARED_COMMIT=1 git commit -m x   # human landing on master"
