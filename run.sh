#!/bin/bash
# Virasetu Startup Script

echo "========================================================="
echo "  Starting Virasetu - Heritage & Traditional Arts"
echo "========================================================="

# Ensure SQLite database is created and seeded
python3 database/seed_data.py

# Launch server
python3 app.py
