#!/usr/bin/env bash
# Allocate a deterministic, collision-free port and record its PID, per task.
#
# Why this exists
# ---------------
# Worktrees isolate .next, but not sockets. Two `next dev` both default to 3000
# (and Playwright's webServer to 3003), so two isolated workers still fight over
# one port — the build isolation problem, half solved.
#
# This is not a reservation service. It is: derive a port from the task id,
# verify nothing is listening, refuse rather than fall back, and write a pidfile
# so cleanup can kill ONE task's processes without touching anyone else's.
#
# Never `pkill node` / `killall node`: this Mac runs other projects and tools.
#
# Usage
# -----
#   eval "$(scripts/task-port.sh <task-id>)"      # sets RR_PORT
#   scripts/task-port.sh <task-id> --kill         # kill only this task's pids
#   scripts/task-port.sh --list                   # show tracked task processes
#
# Port = 4000 + (crc32(task-id) mod 1000), so 4000..4999. Deterministic: the
# same task always gets the same port, which makes a failing run reproducible
# instead of mysterious.

set -uo pipefail

PIDDIR="${RR_PIDDIR:-${TMPDIR:-/tmp}/rr-task-pids}"
mkdir -p "$PIDDIR"

port_for() {
  # cksum is a CRC; stable across runs, no dependency on python/zlib.
  local sum; sum="$(printf '%s' "$1" | cksum | awk '{print $1}')"
  echo $(( 4000 + sum % 1000 ))
}

list_all() {
  if [[ -d "$PIDDIR" ]]; then
    for f in "$PIDDIR"/*.pid; do
      [[ -e "$f" ]] || continue
      local task port pid
      IFS=' ' read -r task port pid < "$f" 2>/dev/null || continue
      local state="dead"
      kill -0 "$pid" 2>/dev/null && state="alive"
      printf '  %-14s port=%-6s pid=%-8s %s\n' "$task" "$port" "$pid" "$state"
    done
  fi
}

# Accept the flags in either order. The usage line said `<task-id> --kill` while
# the case matched `--kill <task-id>`; a caller following the documentation got
# the default branch, which reported "already running" and killed nothing.
# MEASURED: "RESULT apres kill t_b : A=alive B=alive" — B survived.
if [[ "${1:-}" != --* && "${2:-}" == --* ]]; then
  set -- "$2" "$1"
fi

case "${1:-}" in
  --list)
    echo "task processes (pid dir: $PIDDIR):"
    list_all
    exit 0 ;;
  --kill)
    TASK="${2:?--kill needs a task id}"
    F="$PIDDIR/$TASK.pid"
    [[ -f "$F" ]] || { echo "no pidfile for $TASK — nothing tracked"; exit 0; }
    IFS=' ' read -r T P PID < "$F"
    # Kill the whole process group when we started one, else the pid alone.
    # Never a broad pattern: only what this task recorded.
    if kill -0 "$PID" 2>/dev/null; then
      kill -TERM "-$PID" 2>/dev/null || kill -TERM "$PID" 2>/dev/null
      sleep 1
      kill -0 "$PID" 2>/dev/null && { kill -KILL "-$PID" 2>/dev/null || kill -KILL "$PID" 2>/dev/null; }
      echo "killed task=$T pid=$PID port=$P"
    else
      echo "task=$T pid=$PID already dead (stale pidfile)"
    fi
    rm -f "$F"
    exit 0 ;;
esac

TASK="${1:?usage: task-port.sh <task-id> | --kill <task-id> | --list}"
PORT="$(port_for "$TASK")"
F="$PIDDIR/$TASK.pid"

# If our own record already holds a live pid, reuse it: a restarted task keeps
# its port instead of silently drifting to another one.
if [[ -f "$F" ]]; then
  IFS=' ' read -r T P PID < "$F"
  if kill -0 "$PID" 2>/dev/null; then
    echo "RR_PORT=$P; export RR_PORT"
    echo "# task $T already running (pid $PID)" >&2
    exit 0
  fi
fi

# Refuse rather than fall back. A collision must be visible, not papered over —
# silently moving to another port is how two agents end up sharing a server.
if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "task-port: port $PORT is already in use by another task." >&2
  echo "  derived from task id '$TASK' (4000 + crc % 1000), so this is either a" >&2
  echo "  stale process or another task whose crc collided. Refusing instead of" >&2
  echo "  picking a different port: two agents must never share a server." >&2
  echo "  inspect:  lsof -nP -iTCP:$PORT -sTCP:LISTEN" >&2
  exit 1
fi

# Record now; the caller writes its server pid in after spawning.
echo "$TASK $PORT $$" > "$F"
echo "RR_PORT=$PORT; export RR_PORT"
echo "# pid dir: $PIDDIR/$TASK.pid (task $TASK, port $PORT)" >&2
