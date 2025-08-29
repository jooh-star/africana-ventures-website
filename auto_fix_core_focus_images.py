#!/usr/bin/env python3
"""
Auto-fix script for core focus area images
Run this script periodically to ensure all core focus area images 
have the correct subsection names that match what the template expects.
"""

from Backend.models.content import WebsiteImage
from app import app

# Mapping of incorrect/generic names to correct template-expected names
subsection_mapping = {
    # Generic block names (most common issue)
    'block_1': 'marketplace',
    'block_2': 'logistics', 
    'block_3': 'advisory',
    'block_4': 'finance',
    'block_5': 'training',
    'block_6': 'data',
    'block_7': 'value_addition',
    
    # Partial matches and variations
    'market': 'marketplace',
    'logistic': 'logistics',
    'consult': 'advisory', 
    'financ': 'finance',
    'train': 'training',
    'capac': 'capacity',
    'trace': 'traceability',
    'process': 'processing',
    'value': 'value_addition',
    'agri_market': 'agri_marketplace',
    'smart_logistic': 'smart_logistics',
    'smart_logistics': 'smart_logistics',
    'input': 'inputs',
}

def fix_subsection_name(current_name):
    """
    Fix subsection name to match template expectations
    Returns the corrected name or the original if no fix is needed
    """
    # Exact match
    if current_name in subsection_mapping:
        return subsection_mapping[current_name]
    
    # Partial match (check if any key is contained in current_name)
    current_lower = current_name.lower()
    for key, value in subsection_mapping.items():
        if key in current_lower and len(key) > 3:  # Only match if key is substantial
            return value
    
    # No fix needed
    return current_name

def main():
    """Main function to fix all core focus area images"""
    with app.app_context():
        # Get all core focus area images
        images = WebsiteImage.query.filter_by(
            page_name='index', 
            section_name='core_focus_areas'
        ).all()
        
        if not images:
            print("No core focus area images found.")
            return
            
        print(f"Checking {len(images)} core focus area images...")
        fixes_made = []
        
        for img in images:
            original_name = img.subsection_name
            corrected_name = fix_subsection_name(original_name)
            
            if original_name != corrected_name:
                print(f"Fixing image: {img.filename}")
                print(f"  Old subsection: '{original_name}'")
                print(f"  New subsection: '{corrected_name}'")
                
                img.subsection_name = corrected_name
                fixes_made.append({
                    'filename': img.filename,
                    'old': original_name,
                    'new': corrected_name
                })
        
        # Save changes if any fixes were made
        if fixes_made:
            from Backend.models import db
            db.session.commit()
            print(f"\nSuccessfully fixed {len(fixes_made)} images.")
            
            # Print summary of fixes
            print("\nFix Summary:")
            for fix in fixes_made:
                print(f"  - {fix['filename']}: '{fix['old']}' → '{fix['new']}'")
        else:
            print("No fixes needed. All images have correct subsection names.")

if __name__ == "__main__":
    main()