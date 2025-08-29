#!/usr/bin/env python3
"""
Temporary script to add admin image records that match the frontend template requirements.
This script will add WebsiteImage records for sections 2-5 of the index page.
"""

import os
import sys

# Add the project root to the Python path
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)

from app import app
from Backend.models import db
from Backend.models.content import WebsiteImage

def add_admin_images():
    with app.app_context():
        # Define the specific images that our frontend template is looking for
        admin_images = [
            # Services Overview Section (Section 2)
            {
                'filename': '579959.jpg',
                'original_filename': '579959.jpg',
                'page_name': 'index',
                'section_name': 'services_overview',
                'subsection_name': 'agri_tech_photo_579959',
                'description': 'Agricultural Technology - Smart Farming Solutions',
                'alt_text': 'Agricultural Technology',
                'image_type': 'product',
                'display_order': 1,
                'is_active': True
            },
            {
                'filename': '240173.jpg',
                'original_filename': '240173.jpg',
                'page_name': 'index',
                'section_name': 'services_overview',
                'subsection_name': 'market_access_photo_240173',
                'description': 'Market Access - Connecting Farmers to Markets',
                'alt_text': 'Market Access',
                'image_type': 'product',
                'display_order': 2,
                'is_active': True
            },
            {
                'filename': '141689.jpg',
                'original_filename': '141689.jpg',
                'page_name': 'index',
                'section_name': 'services_overview',
                'subsection_name': 'financial_services_photo_141689',
                'description': 'Financial Services - Agricultural Financing Solutions',
                'alt_text': 'Financial Services',
                'image_type': 'product',
                'display_order': 3,
                'is_active': True
            },
            {
                'filename': 'our-team-1.jpg',
                'original_filename': 'our-team-1.jpg',
                'page_name': 'index',
                'section_name': 'services_overview',
                'subsection_name': 'training_photo_our_team_1',
                'description': 'Training & Education - Capacity Building Programs',
                'alt_text': 'Training & Education',
                'image_type': 'product',
                'display_order': 4,
                'is_active': True
            },
            {
                'filename': '416767.jpg',
                'original_filename': '416767.jpg',
                'page_name': 'index',
                'section_name': 'services_overview',
                'subsection_name': 'supply_chain_photo_416767',
                'description': 'Supply Chain - Logistics and Distribution',
                'alt_text': 'Supply Chain',
                'image_type': 'product',
                'display_order': 5,
                'is_active': True
            },
            
            # About Preview Section (Section 3)
            {
                'filename': 'our-team-1.jpg',
                'original_filename': 'our-team-1.jpg',
                'page_name': 'index',
                'section_name': 'about_preview',
                'subsection_name': 'about_africana_ventures',
                'description': 'About Africana Ventures - Our Team and Mission',
                'alt_text': 'About Africana Ventures',
                'image_type': 'static',
                'display_order': 1,
                'is_active': True
            },
            
            # Products Section (Section 4)
            {
                'filename': '416769.jpg',
                'original_filename': '416769.jpg',
                'page_name': 'index',
                'section_name': 'products',
                'subsection_name': 'horticulture_photo_416769',
                'description': 'Horticulture Products - Fresh Produce and Vegetables',
                'alt_text': 'Horticulture Products',
                'image_type': 'product',
                'display_order': 1,
                'is_active': True
            },
            {
                'filename': '526297.jpg',
                'original_filename': '526297.jpg',
                'page_name': 'index',
                'section_name': 'products',
                'subsection_name': 'cereals_legumes_photo_526297',
                'description': 'Cereals & Legumes - Grains and Protein Crops',
                'alt_text': 'Cereals & Legumes',
                'image_type': 'product',
                'display_order': 2,
                'is_active': True
            },
            {
                'filename': '53396.jpg',
                'original_filename': '53396.jpg',
                'page_name': 'index',
                'section_name': 'products',
                'subsection_name': 'oilseeds_nuts_photo_53396',
                'description': 'Oilseeds & Nuts - Value-Added Agricultural Products',
                'alt_text': 'Oilseeds & Nuts',
                'image_type': 'product',
                'display_order': 3,
                'is_active': True
            },
            
            # Core Focus Areas Section (Section 5)
            {
                'filename': '113898.jpg',
                'original_filename': '113898.jpg',
                'page_name': 'index',
                'section_name': 'core_focus_areas',
                'subsection_name': 'block_1',
                'description': 'Agri-Marketplace Platform - Connecting Farmers to Markets',
                'alt_text': 'Agri-Marketplace Platform',
                'image_type': 'background',
                'display_order': 1,
                'is_active': True
            },
            {
                'filename': '416760.jpg',
                'original_filename': '416760.jpg',
                'page_name': 'index',
                'section_name': 'core_focus_areas',
                'subsection_name': 'block_2',
                'description': 'Smart Logistics & Distribution - Efficient Supply Chains',
                'alt_text': 'Smart Logistics & Distribution',
                'image_type': 'background',
                'display_order': 2,
                'is_active': True
            },
            {
                'filename': 'our-team-1.jpg',
                'original_filename': 'our-team-1.jpg',
                'page_name': 'index',
                'section_name': 'core_focus_areas',
                'subsection_name': 'block_3',
                'description': 'Advisory & Consulting - Expert Guidance and Support',
                'alt_text': 'Advisory & Consulting',
                'image_type': 'background',
                'display_order': 3,
                'is_active': True
            },
            {
                'filename': '240173.jpg',
                'original_filename': '240173.jpg',
                'page_name': 'index',
                'section_name': 'core_focus_areas',
                'subsection_name': 'block_4',
                'description': 'Access to Inputs & Finance - Agricultural Resources',
                'alt_text': 'Access to Inputs & Finance',
                'image_type': 'background',
                'display_order': 4,
                'is_active': True
            },
            {
                'filename': '53396.jpg',
                'original_filename': '53396.jpg',
                'page_name': 'index',
                'section_name': 'core_focus_areas',
                'subsection_name': 'block_5',
                'description': 'Training & Capacity Building - Skills Development',
                'alt_text': 'Training & Capacity Building',
                'image_type': 'background',
                'display_order': 5,
                'is_active': True
            },
            {
                'filename': '416767.jpg',
                'original_filename': '416767.jpg',
                'page_name': 'index',
                'section_name': 'core_focus_areas',
                'subsection_name': 'block_6',
                'description': 'Data & Traceability - Information Systems',
                'alt_text': 'Data & Traceability',
                'image_type': 'background',
                'display_order': 6,
                'is_active': True
            },
            {
                'filename': 'maize.png',
                'original_filename': 'maize.png',
                'page_name': 'index',
                'section_name': 'core_focus_areas',
                'subsection_name': 'block_7',
                'description': 'Value Addition & Processing - Agricultural Processing',
                'alt_text': 'Value Addition & Processing',
                'image_type': 'background',
                'display_order': 7,
                'is_active': True
            }
        ]
        
        # Check if images already exist to avoid duplicates
        added_count = 0
        skipped_count = 0
        
        for img_data in admin_images:
            # Check if this exact record already exists
            existing_image = WebsiteImage.query.filter_by(
                page_name=img_data['page_name'],
                section_name=img_data['section_name'],
                subsection_name=img_data['subsection_name'],
                filename=img_data['filename']
            ).first()
            
            if existing_image:
                print(f"Skipping existing image: {img_data['filename']} - {img_data['section_name']}/{img_data['subsection_name']}")
                skipped_count += 1
                continue
            
            # Check if the image file actually exists
            image_path = os.path.join(project_root, 'Frontend', 'static', 'images', img_data['filename'])
            if not os.path.exists(image_path):
                print(f"Warning: Image file not found: {img_data['filename']}")
                continue
            
            # Create new WebsiteImage record
            new_image = WebsiteImage(**img_data)
            new_image.section = img_data['section_name']  # Legacy compatibility
            
            db.session.add(new_image)
            added_count += 1
            print(f"Added: {img_data['filename']} - {img_data['section_name']}/{img_data['subsection_name']}")
        
        try:
            db.session.commit()
            print(f"\nSuccess! Added {added_count} new admin image records.")
            print(f"Skipped {skipped_count} existing records.")
            print("You should now see admin-managed images instead of hardcoded ones on sections 2-5 of the index page.")
        except Exception as e:
            db.session.rollback()
            print(f"Error adding image records: {str(e)}")
            return False
        
        return True

if __name__ == '__main__':
    print("Adding admin image records for sections 2-5 of the index page...")
    success = add_admin_images()
    if success:
        print("\nAdmin images have been added successfully!")
        print("Now restart your Flask application and you should see the admin-managed images.")
    else:
        print("\nFailed to add admin images. Check the error messages above.")