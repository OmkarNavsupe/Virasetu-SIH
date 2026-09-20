"""
Virasetu Database Helper Module
Provides managed SQLite connections, query execution, and dictionary serialization.
"""

import sqlite3
from backend.config import DB_PATH
from database.seed_data import init_db


def get_db_connection():
    """Returns a SQLite connection with Row factory enabled."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def ensure_db_initialized():
    """Verifies that the database has tables and data; auto-initializes if missing."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM heritage_sites")
        count = cursor.fetchone()[0]
        if count == 0:
            init_db()
    except sqlite3.OperationalError:
        init_db()
    finally:
        conn.close()


def query_all(query, params=()):
    """Executes a query and returns a list of dictionaries."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(query, params)
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()


def query_one(query, params=()):
    """Executes a query and returns a single dictionary or None."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(query, params)
        row = cursor.fetchone()
        return dict(row) if row else None
    finally:
        conn.close()


def execute_write(query, params=()):
    """Executes an INSERT, UPDATE, or DELETE query and returns lastrowid."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(query, params)
        conn.commit()
        return cursor.lastrowid
    finally:
        conn.close()
