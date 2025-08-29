#!/usr/bin/env python3
"""
Database migration to add relative_path column to WebsiteImage table
This supports the new page-specific folder organization structure
"""

import os
import sys
import sqlite3
from datetime import datetime

def get_db_path():
    """Get the database path"""
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(project_root, 'instance', 'africana_ventures.db')

def backup_database():
    """Create a backup of the database before migration"""
    db_path = get_db_path()
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return False
    
    backup_path = f"{db_path}.backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    try:
        import shutil
        shutil.copy2(db_path, backup_path)
        print(f"Database backed up to: {backup_path}")
        return True
    except Exception as e:
        print(f"Error creating backup: {e}")
        return False

def add_relative_path_column():
    """Add relative_path column to WebsiteImage table"""
    db_path = get_db_path()
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if column already exists
        cursor.execute("PRAGMA table_info(website_image)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'relative_path' in columns:
            print("Column 'relative_path' already exists in WebsiteImage table")
            conn.close()
            return True
        
        # Add the new column
        cursor.execute("""
            ALTER TABLE website_image 
            ADD COLUMN relative_path VARCHAR(500) NULL
        """)
        
        print("Successfully added 'relative_path' column to WebsiteImage table")
        
        # Optional: Migrate existing images to new structure
        # For now, we'll leave relative_path as NULL for existing images
        # They will continue to work with the legacy path structure
        
        conn.commit()
        conn.close()
        return True
        
    except Exception as e:
        print(f"Error adding column: {e}")
        if 'conn' in locals():
            conn.close()
        return False

def migrate_existing_images():
    """
    Optional migration to move existing images to organized folder structure
    This function can be run separately after the column is added
    """
    db_path = get_db_path()
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Get all existing images
        cursor.execute("""
            SELECT id, filename, page_name, section_name 
            FROM website_image 
            WHERE relative_path IS NULL
        """)
        
        images = cursor.fetchall()
        print(f"Found {len(images)} images to potentially migrate")
        
        for image_id, filename, page_name, section_name in images:
            # Create organized folder structure
            old_path = os.path.join(project_root, 'Frontend', 'static', 'images', filename)
            new_folder = os.path.join(project_root, 'Frontend', 'static', 'uploads', page_name, section_name)
            new_path = os.path.join(new_folder, filename)
            
            if os.path.exists(old_path):
                try:
                    # Create directory structure
                    os.makedirs(new_folder, exist_ok=True)
                    
                    # Move file
                    import shutil
                    shutil.move(old_path, new_path)
                    
                    # Update database with relative path
                    relative_path = os.path.join(page_name, section_name, filename).replace('\\', '/')
                    cursor.execute("""
                        UPDATE website_image 
                        SET relative_path = ? 
                        WHERE id = ?
                    """, (relative_path, image_id))
                    
                    print(f"Migrated: {filename} -> {relative_path}")
                    
                except Exception as e:
                    print(f"Error migrating {filename}: {e}")
            else:
                print(f"File not found: {filename}")
        
        conn.commit()
        conn.close()
        print("Migration completed!")
        return True
        
    except Exception as e:
        print(f"Error during migration: {e}")
        if 'conn' in locals():
            conn.close()
        return False

def main():
    """Main migration function"""
    print("Starting database migration: Adding relative_path column to WebsiteImage")
    
    # Create backup
    if not backup_database():
        print("Failed to create database backup. Aborting migration.")
        return False
    
    # Add column
    if not add_relative_path_column():
        print("Failed to add relative_path column. Migration aborted.")
        return False
    
    print("\nMigration completed successfully!")
    print("\nNext steps:")
    print("1. Test that the application starts correctly")
    print("2. Upload new images through the admin panel")
    print("3. Optionally run migrate_existing_images() to move existing files")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)