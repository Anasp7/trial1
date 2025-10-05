#!/usr/bin/env python3
"""
Test script to verify opportunity creation and retrieval.
"""

import sqlite3
import os
from datetime import datetime

def test_database():
    """Test the database structure and data"""
    
    # Path to the database
    db_path = os.path.join('instance', 'alumni_connect.db')
    
    if not os.path.exists(db_path):
        print("Database not found. Please run the application first to create the database.")
        return
    
    try:
        # Connect to the database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check opportunities table structure
        cursor.execute("PRAGMA table_info(opportunities)")
        columns = cursor.fetchall()
        
        print("Opportunities table structure:")
        for column in columns:
            print(f"  {column[1]} ({column[2]})")
        
        # Check if there are any opportunities
        cursor.execute("SELECT COUNT(*) FROM opportunities")
        count = cursor.fetchone()[0]
        print(f"\nTotal opportunities in database: {count}")
        
        if count > 0:
            # Show sample opportunities
            cursor.execute("SELECT id, type, title, company, location, duration, stipend FROM opportunities LIMIT 5")
            opportunities = cursor.fetchall()
            
            print("\nSample opportunities:")
            for opp in opportunities:
                print(f"  ID: {opp[0]}, Type: {opp[1]}, Title: {opp[2]}")
                if opp[3]: print(f"    Company: {opp[3]}")
                if opp[4]: print(f"    Location: {opp[4]}")
                if opp[5]: print(f"    Duration: {opp[5]}")
                if opp[6]: print(f"    Stipend: {opp[6]}")
                print()
        
        # Check if new columns exist
        column_names = [col[1] for col in columns]
        new_columns = ['company', 'location', 'duration', 'stipend', 'requirements', 'deadline']
        
        print("New columns status:")
        for col in new_columns:
            if col in column_names:
                print(f"  ✓ {col} - exists")
            else:
                print(f"  ✗ {col} - missing")
        
    except sqlite3.Error as e:
        print(f"Database error: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    print("Testing database structure...")
    test_database()
    print("Test completed!")
