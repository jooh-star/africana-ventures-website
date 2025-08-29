#!/usr/bin/env python3
"""
Comprehensive migration to update WebsiteImage table with all required columns
"""

import os
import sqlite3
from datetime import datetime
import shutil

def get_db_path():
    """Get the database path"""
    project_root = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(project_root, 'instance', 'africana_ventures.db')

def backup_database():
    """Create a backup of the database before migration"""
    db_path = get_db_path()
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return False
    
    backup_path = f"{db_path}.backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    try:
        shutil.copy2(db_path, backup_path)
        print(f"Database backed up to: {backup_path}")
        return True
    except Exception as e:
        print(f"Error creating backup: {e}")
        return False

def get_current_columns(cursor):
    """Get current column names in website_image table"""
    cursor.execute("PRAGMA table_info(website_image)")
    return [column[1] for column in cursor.fetchall()]

def update_website_image_schema():
    """Update WebsiteImage table schema to match the model"""
    db_path = get_db_path()
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        current_columns = get_current_columns(cursor)
        print(f"Current columns: {current_columns}")
        
        # Define all required columns based on the model
        required_columns = {
            'id': 'INTEGER PRIMARY KEY',
            'filename': 'VARCHAR(255) NOT NULL',
            'original_filename': 'VARCHAR(255) NOT NULL', 
            'relative_path': 'VARCHAR(500)',
            'page_name': 'VARCHAR(100) NOT NULL DEFAULT ""',
            'section_name': 'VARCHAR(100) NOT NULL DEFAULT ""',
            'subsection_name': 'VARCHAR(100)',
            'description': 'TEXT NOT NULL DEFAULT ""',
            'alt_text': 'VARCHAR(255)',
            'usage_context': 'TEXT',
            'image_type': 'VARCHAR(50) NOT NULL DEFAULT "static"',
            'section': 'VARCHAR(50)',  # Legacy field
            'display_order': 'INTEGER DEFAULT 0',
            'is_active': 'BOOLEAN DEFAULT 1',
            'is_featured': 'BOOLEAN DEFAULT 0',
            'file_size': 'INTEGER',
            'width': 'INTEGER',
            'height': 'INTEGER',
            'created_at': 'DATETIME',
            'last_modified': 'DATETIME'
        }
        
        # Add missing columns
        added_columns = []
        for column_name, column_def in required_columns.items():
            if column_name not in current_columns:
                try:
                    # Extract just the type and constraints part (skip PRIMARY KEY for ALTER TABLE)
                    if 'PRIMARY KEY' in column_def:
                        continue  # Skip primary key column as it should already exist
                    
                    cursor.execute(f"ALTER TABLE website_image ADD COLUMN {column_name} {column_def}")
                    added_columns.append(column_name)
                    print(f"Added column: {column_name}")
                except Exception as e:
                    print(f"Error adding column {column_name}: {e}")
        
        # Update existing records with default values for new NOT NULL columns
        if 'page_name' in added_columns:
            cursor.execute("UPDATE website_image SET page_name = 'index' WHERE page_name = '' OR page_name IS NULL")
        
        if 'section_name' in added_columns:
            cursor.execute("UPDATE website_image SET section_name = section WHERE section_name = '' OR section_name IS NULL")
        
        if 'description' in added_columns:
            cursor.execute("UPDATE website_image SET description = 'Legacy image' WHERE description = '' OR description IS NULL")
        
        if 'image_type' in added_columns:
            cursor.execute("UPDATE website_image SET image_type = 'static' WHERE image_type = '' OR image_type IS NULL")
        
        conn.commit()
        
        # Verify the update
        final_columns = get_current_columns(cursor)
        print(f"Final columns: {final_columns}")
        print(f"Successfully added {len(added_columns)} columns: {added_columns}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"Error updating schema: {e}")
        if 'conn' in locals():
            conn.close()
        return False

def main():
    """Main migration function"""
    print("Starting comprehensive WebsiteImage schema update...")
    
    # Create backup
    if not backup_database():
        print("Failed to create database backup. Aborting migration.")
        return False
    
    # Update schema
    if not update_website_image_schema():
        print("Failed to update database schema. Migration aborted.")
        return False
    
    print("\nMigration completed successfully!")
    print("You can now restart the Flask application.")
    
    return True

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)