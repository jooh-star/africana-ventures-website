#!/usr/bin/env python3
"""
Debug script to check market access image specifically
"""

import os
import sys

# Add the project root to the Python path
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)

from app import app
from Backend.models import db
from Backend.models.content import WebsiteImage

def debug_market_access():
    with app.app_context():
        print("=" * 60)
        print("DEBUGGING MARKET ACCESS IMAGE")
        print("=" * 60)
        
        # Check what the frontend expects
        print("Frontend template expects:")
        print("  Page: 'index'")
        print("  Section: 'services_overview'")
        print("  Subsection: 'market_access_photo_240173' OR 'market_access'")
        print()
        
        # Check for services_overview section images
        services_images = WebsiteImage.query.filter_by(
            page_name='index',
            section_name='services_overview',
            is_active=True
        ).all()
        
        print(f"Found {len(services_images)} active images in services_overview section:")
        print()
        
        if not services_images:
            print("❌ NO IMAGES FOUND in services_overview section!")
            print("\nPlease upload images via admin panel:")
            print("1. Go to admin panel -> Upload Page Photo -> Index")
            print("2. Select 'services_overview' as section")
            print("3. Select 'Market Access' as subsection")
            return
        
        # List all services_overview images
        for img in services_images:
            subsection = img.subsection_name or 'no-subsection'
            filename = img.filename or 'no-filename'
            active = "✅ Active" if img.is_active else "❌ Inactive"
            
            print(f"📷 {subsection} -> {filename} ({active})")
            
            # Check if file exists
            file_path = os.path.join(project_root, 'Frontend', 'static', 'images', filename)
            file_exists = "✅ Exists" if os.path.exists(file_path) else "❌ Missing"
            print(f"   File: {file_exists} ({file_path})")
            print()
        
        # Check specifically for market access
        market_access_specific = WebsiteImage.query.filter_by(
            page_name='index',
            section_name='services_overview',
            subsection_name='market_access_photo_240173',
            is_active=True
        ).first()
        
        market_access_generic = WebsiteImage.query.filter_by(
            page_name='index',
            section_name='services_overview', 
            subsection_name='market_access',
            is_active=True
        ).first()
        
        print("=" * 40)
        print("MARKET ACCESS SPECIFIC CHECK:")
        print("=" * 40)
        
        if market_access_specific:
            print("✅ FOUND market_access_photo_240173:")
            print(f"   ID: {market_access_specific.id}")
            print(f"   Filename: {market_access_specific.filename}")
        else:
            print("❌ NOT FOUND: market_access_photo_240173")
            
        if market_access_generic:
            print("✅ FOUND market_access:")
            print(f"   ID: {market_access_generic.id}")
            print(f"   Filename: {market_access_generic.filename}")
        else:
            print("❌ NOT FOUND: market_access")
            
        if not market_access_specific and not market_access_generic:
            print("\n🔍 LOOKING FOR SIMILAR NAMES...")
            similar = WebsiteImage.query.filter(
                WebsiteImage.page_name == 'index',
                WebsiteImage.section_name == 'services_overview',
                WebsiteImage.subsection_name.like('%market%'),
                WebsiteImage.is_active == True
            ).all()
            
            if similar:
                print("Found similar market-related images:")
                for img in similar:
                    print(f"  - {img.subsection_name} -> {img.filename}")
            else:
                print("No market-related images found.")
                
        print("\n" + "=" * 60)
        print("NEXT STEPS:")
        print("=" * 60)
        if not market_access_specific and not market_access_generic:
            print("1. Upload market access image via admin panel")
            print("2. Select Page: 'index'")
            print("3. Select Section: 'services_overview'")
            print("4. Select Subsection: 'Market Access'")
            print("5. Make sure image is marked as 'Active'")
        else:
            print("Image exists in database. Check:")
            print("1. Flask app is running and restarted")
            print("2. Browser cache cleared")
            print("3. Image file actually exists in static/images/")

if __name__ == '__main__':
    debug_market_access()