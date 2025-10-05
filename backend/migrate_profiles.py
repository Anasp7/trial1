#!/usr/bin/env python3
"""
Migration script to add new common profile columns to alumni_profiles and student_profiles.
Run this once after pulling the latest code changes.
"""

import os
import sqlite3


DB_PATH = os.path.join(os.path.dirname(__file__), 'instance', 'alumni_connect.db')


def column_exists(cursor, table, column):
    cursor.execute(f"PRAGMA table_info({table})")
    cols = [row[1] for row in cursor.fetchall()]
    return column in cols


def add_column_if_missing(cursor, table, column, coltype):
    if not column_exists(cursor, table, column):
        cursor.execute(f"ALTER TABLE {table} ADD COLUMN {column} {coltype}")
        print(f"Added {table}.{column} ({coltype})")
    else:
        print(f"{table}.{column} already exists, skipping")


def migrate():
    if not os.path.exists(DB_PATH):
        print("Database not found at:", DB_PATH)
        print("Start the app once to create the DB, then rerun this script.")
        return

    conn = sqlite3.connect(DB_PATH)
    try:
        cursor = conn.cursor()

        # Alumni profile columns
        alumni_cols = [
            ("phone", "TEXT"),
            ("location", "TEXT"),
            ("bio", "TEXT"),
            ("linkedin", "TEXT"),
            ("github", "TEXT"),
            ("profile_pic", "TEXT"),
        ]
        for col, coltype in alumni_cols:
            add_column_if_missing(cursor, 'alumni_profiles', col, coltype)

        # Student profile columns
        student_cols = [
            ("phone", "TEXT"),
            ("location", "TEXT"),
            ("bio", "TEXT"),
            ("linkedin", "TEXT"),
            ("github", "TEXT"),
            ("profile_pic", "TEXT"),
        ]
        for col, coltype in student_cols:
            add_column_if_missing(cursor, 'student_profiles', col, coltype)

        conn.commit()
        print("Profile migration completed successfully.")
    finally:
        conn.close()


if __name__ == '__main__':
    migrate()


