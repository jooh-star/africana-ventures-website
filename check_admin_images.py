#!/usr/bin/env python3
"""
Script to check what admin images exist in the database
"""

import os
import sys

# Add the project root to the Python path
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)

from app import app
from Backend.models import db
from Backend.models.content import WebsiteImage

def check_admin_images():
    with app.app_context():
        # Get all active images
        images = WebsiteImage.query.filter_by(is_active=True).all()
        
        print(f"Found {len(images)} active admin images in database:\n")
        
        if not images:
            print("❌ No admin images found in database!")
            print("\nTo add images, go to the admin panel:")
            print("1. Navigate to http://localhost:5000/system/management/access")
            print("2. Login to admin panel")
            print("3. Go to 'Upload Page Photo' -> Index page")
            print("4. Select 'services_overview' as section")
            print("5. Select 'Agricultural Technology - 579959.jpg (Smart Farming Solutions)' as subsection")
            return
        
        # Group by page and section
        grouped = {}
        for img in images:
            page = img.page_name or 'unknown'
            section = img.section_name or img.section or 'unknown'
            
            if page not in grouped:
                grouped[page] = {}
            if section not in grouped[page]:
                grouped[page][section] = []
            
            grouped[page][section].append(img)
        
        # Display organized results
        for page_name, sections in grouped.items():
            print(f"📄 PAGE: {page_name}")
            for section_name, section_images in sections.items():
                print(f"  📂 SECTION: {section_name}")
                for img in section_images:
                    subsection = img.subsection_name or 'no-subsection'
                    filename = img.filename or 'no-filename'
                    print(f"    🖼️  Subsection: '{subsection}' -> {filename}")
                print()
        
        # Check specifically for the Agricultural Technology image
        print("=" * 60)
        print("CHECKING FOR AGRICULTURAL TECHNOLOGY IMAGE:")
        print("=" * 60)
        
        # What the frontend is looking for:
        expected_page = 'index'
        expected_section = 'services_overview'
        expected_subsection = 'agri_tech_photo_579959'
        
        print(f"Frontend is looking for:")
        print(f"  Page: '{expected_page}'")
        print(f"  Section: '{expected_section}'")  
        print(f"  Subsection: '{expected_subsection}'")
        print()
        
        # Check if it exists
        agri_tech_image = WebsiteImage.query.filter_by(
            page_name=expected_page,
            section_name=expected_section,
            subsection_name=expected_subsection,
            is_active=True
        ).first()
        
        if agri_tech_image:
            print(f"✅ FOUND! Agricultural Technology image exists:")
            print(f"   ID: {agri_tech_image.id}")
            print(f"   Filename: {agri_tech_image.filename}")
            print(f"   Page: {agri_tech_image.page_name}")
            print(f"   Section: {agri_tech_image.section_name}")
            print(f"   Subsection: {agri_tech_image.subsection_name}")
            print(f"   Active: {agri_tech_image.is_active}")
            
            # Check if file exists
            file_path = os.path.join(project_root, 'Frontend', 'static', 'images', agri_tech_image.filename)
            if os.path.exists(file_path):
                print(f"   File exists: ✅ {file_path}")
            else:
                print(f"   File missing: ❌ {file_path}")
                
        else:
            print("❌ NOT FOUND! Agricultural Technology image is missing.")
            print("\nPossible issues:")
            print("1. Image not uploaded through admin panel")
            print("2. Wrong page/section/subsection selected during upload")
            print("3. Image is inactive")
            
            # Check for similar images
            print("\nLooking for similar images...")
            similar = WebsiteImage.query.filter(
                WebsiteImage.page_name.like('%index%')
            ).filter(
                WebsiteImage.section_name.like('%services%')
            ).all()
            
            if similar:
                print("Found similar images:")
                for img in similar:
                    print(f"  - {img.page_name}/{img.section_name}/{img.subsection_name} -> {img.filename}")
            else:
                print("No similar images found.")
        
        print("\n" + "=" * 60)
        print("NEXT STEPS:")
        print("=" * 60)
        print("If image is missing, add it via admin panel with EXACT names:")
        print("  Page: 'index'")
        print("  Section: 'services_overview'") 
        print("  Subsection: 'agri_tech_photo_579959'")

if __name__ == '__main__':
    print("Checking admin images in database...")
    check_admin_images()