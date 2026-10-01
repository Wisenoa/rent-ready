"""Shared helpers for the verify-*.py runtime checks.

The verification scripts spawn `node` children that read
`process.env.DATABASE_URL`. CI sets that variable; a local shell usually does
not, and the child then dies with a Prisma "DatabaseNotReachable" stack trace
that reads like a product bug rather than a missing variable. Loading `.env`
here means the scripts work the same way locally and in CI.
"""

import os
import re

# The default `python3` on this machine is 3.9, which does not support PEP 604
# (`str | None`) in annotations at runtime. Use typing.Optional so the scripts run
# on the system interpreter as well as on CI.
from typing import Optional

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load_env(path: Optional[str] = None) -> None:
    """Export variables from .env without overwriting the real environment."""
    env_path = path or os.path.join(ROOT, ".env")
    if not os.path.exists(env_path):
        return
    for line in open(env_path):
        m = re.match(r"^([A-Z_][A-Z0-9_]*)=(.*)$", line.strip())
        if m and not os.environ.get(m.group(1)):
            os.environ[m.group(1)] = m.group(2).strip().strip('"').strip("'")
