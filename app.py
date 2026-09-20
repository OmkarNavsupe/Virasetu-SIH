"""
Virasetu - AI-Powered Heritage and Traditional Arts Platform
Root Entry Point

Local development:
    python3 app.py

Vercel / Gunicorn / any WSGI host:
    The 'app' variable below is the WSGI callable.
"""

import os
import sys

# Ensure current workspace root is in python path
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from backend.app import VirasetuAPI

# ── WSGI entry point (required by Vercel, Gunicorn, uWSGI, etc.) ──────────────
app = VirasetuAPI()

# ── Local dev server ───────────────────────────────────────────────────────────
if __name__ == "__main__":
    from backend.app import main
    main()
