"""
Virasetu Backend Configuration
Loads settings, database paths, and AI API keys.
"""

import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "database", "virasetu.db")
STATIC_DIR = os.path.join(BASE_DIR, "frontend", "static")
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

# Optional AI API keys (Google Gemini / OpenAI)
# Falls back automatically to rich mock AI engine if keys are not set
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")

# Server settings
PORT = int(os.environ.get("PORT", 8080))
HOST = os.environ.get("HOST", "0.0.0.0")
DEBUG = os.environ.get("DEBUG", "true").lower() in ("true", "1", "yes")
