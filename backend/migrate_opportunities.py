#!/usr/bin/env python3
"""
Migration script to add new columns to the opportunities table.
Run this script to update the database schema.
"""

import sqlite3
import os
from datetime import datetime

def migrate_database():
    """Add new columns to the opportunities table"""
    
    # Path to the database
    db_path = os.path.join('instance', 'alumni_connect.db')
    
    if not os.path.exists(db_path):
        print("Database not found. Please run the application first to create the database.")
        return
    
    try:
        # Connect to the database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if new columns already exist
        cursor.execute("PRAGMA table_info(opportunities)")
        columns = [column[1] for column in cursor.fetchall()]
        
        new_columns = [
            ('company', 'VARCHAR(100)'),
            ('location', 'VARCHAR(100)'),
            ('duration', 'VARCHAR(50)'),
            ('stipend', 'VARCHAR(100)'),
            ('requirements', 'TEXT'),
            ('deadline', 'DATE')
        ]
        
        # Add new columns if they don't exist
        for column_name, column_type in new_columns:
            if column_name not in columns:
                try:
                    cursor.execute(f"ALTER TABLE opportunities ADD COLUMN {column_name} {column_type}")
                    print(f"Added column: {column_name}")
                except sqlite3.Error as e:
                    print(f"Error adding column {column_name}: {e}")
            else:
                print(f"Column {column_name} already exists")
        
        # Commit changes
        conn.commit()
        print("Database migration completed successfully!")
        
    except sqlite3.Error as e:
        print(f"Database error: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    print("Starting database migration...")
    migrate_database()
    print("Migration completed!")
