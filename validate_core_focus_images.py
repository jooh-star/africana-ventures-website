#!/usr/bin/env python3
"""
Validation script for core focus area images
Run this script to check if all core focus area images have correct subsection names.
"""

from Backend.models.content import WebsiteImage
from app import app

# Valid subsection names that the template expects
VALID_SUBSECTIONS = {
    'marketplace', 'agri_marketplace',     # Block 1
    'logistics', 'smart_logistics',        # Block 2  
    'advisory', 'consulting',              # Block 3
    'finance', 'inputs',                   # Block 4
    'training', 'capacity',                # Block 5
    'data', 'traceability',                # Block 6
    'value_addition', 'processing'         # Block 7
}

# Block mapping for better error reporting
BLOCK_MAPPING = {
    'marketplace': 'Block 1: Agri-Marketplace Platform',
    'agri_marketplace': 'Block 1: Agri-Marketplace Platform',
    'logistics': 'Block 2: Smart Logistics & Distribution', 
    'smart_logistics': 'Block 2: Smart Logistics & Distribution',
    'advisory': 'Block 3: Advisory & Consulting',
    'consulting': 'Block 3: Advisory & Consulting',
    'finance': 'Block 4: Access to Inputs & Finance',
    'inputs': 'Block 4: Access to Inputs & Finance',
    'training': 'Block 5: Training & Capacity Building',
    'capacity': 'Block 5: Training & Capacity Building', 
    'data': 'Block 6: Data & Traceability',
    'traceability': 'Block 6: Data & Traceability',
    'value_addition': 'Block 7: Value Addition & Processing',
    'processing': 'Block 7: Value Addition & Processing'
}

def validate_images():
    """Validate all core focus area images"""
    with app.app_context():
        # Get all core focus area images
        images = WebsiteImage.query.filter_by(
            page_name='index', 
            section_name='core_focus_areas'
        ).all()
        
        if not images:
            print("No core focus area images found.")
            return
            
        print(f"Validating {len(images)} core focus area images...\n")
        
        valid_count = 0
        invalid_count = 0
        
        for img in images:
            subsection = img.subsection_name
            is_valid = subsection in VALID_SUBSECTIONS
            
            status = "✓ VALID" if is_valid else "✗ INVALID"
            block_info = BLOCK_MAPPING.get(subsection, "Unknown Block")
            
            print(f"{status} - {img.filename}")
            print(f"  Subsection: '{subsection}' ({block_info})")
            
            if not is_valid:
                invalid_count += 1
                suggestions = [valid for valid in VALID_SUBSECTIONS if valid.startswith(subsection[:3])]
                if suggestions:
                    print(f"  Suggested corrections: {', '.join(suggestions)}")
                else:
                    print(f"  Valid options: {', '.join(sorted(VALID_SUBSECTIONS))}")
            else:
                valid_count += 1
            
            print()
        
        print(f"Validation Summary:")
        print(f"  Valid images: {valid_count}")
        print(f"  Invalid images: {invalid_count}")
        print(f"  Total images: {len(images)}")
        
        if invalid_count > 0:
            print(f"\nTo fix invalid images, update their subsection names to match the valid options listed above.")
            print(f"Refer to CORE_FOCUS_AREAS_UPLOAD_GUIDE.md for detailed instructions.")

if __name__ == "__main__":
    validate_images()