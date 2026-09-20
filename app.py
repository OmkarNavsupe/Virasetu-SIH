"""
Virasetu - AI-Powered Heritage and Traditional Arts Platform
Root Entry Point
Run this script to start the backend API and serve the frontend:
    python3 app.py
"""

import os
import sys

# Ensure current workspace root is in python path
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from backend.app import main

if __name__ == "__main__":
    main()
