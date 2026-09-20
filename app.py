"""
Virasetu - AI-Powered Heritage and Traditional Arts Platform
Root Entry Point (Vercel WSGI)
"""

import os
import sys
import json
import traceback

# Ensure the project root is on the Python path
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

# ── Defensive boot-up ────────────────────────────────────────────────────────
# If ANY import or initialization step fails, we expose the full traceback as
# a JSON response instead of Vercel's opaque "FUNCTION_INVOCATION_FAILED".
# Visit /api/health or any URL to see the error in plain text.
_boot_error = None

try:
    from backend.app import VirasetuAPI
    _real_app = VirasetuAPI()
except Exception:
    _boot_error = traceback.format_exc()
    _real_app = None
    print("[Virasetu] BOOT ERROR:\n" + _boot_error, flush=True)


def app(environ, start_response):
    """WSGI entry point — required by Vercel, Gunicorn, uWSGI, etc."""
    if _boot_error is not None:
        # Surface the exact boot error as JSON so it's visible in the browser
        body = json.dumps({
            "error": "Virasetu failed to initialize. See detail for traceback.",
            "detail": _boot_error,
        }, indent=2).encode("utf-8")
        start_response("500 Internal Server Error", [
            ("Content-Type", "application/json; charset=utf-8"),
            ("Content-Length", str(len(body))),
            ("Access-Control-Allow-Origin", "*"),
        ])
        return [body]
    return _real_app(environ, start_response)


# ── Local dev server ──────────────────────────────────────────────────────────
if __name__ == "__main__":
    try:
        from backend.app import main
        main()
    except Exception as e:
        print(f"[Virasetu] Failed to start dev server: {e}", flush=True)
        raise
