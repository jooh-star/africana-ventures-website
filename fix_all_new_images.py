from Backend.models.content import WebsiteImage
from app import app

# Mapping of incorrect names to correct names
fixes = {
    'block_4': 'finance',      # Access to Inputs & Finance
    'block_5': 'training',     # Training & Capacity Building
    'block_6': 'data',         # Data & Traceability
    'block_7': 'value_addition' # Value Addition & Processing
}

with app.app_context():
    fixed_count = 0
    
    # Fix each incorrectly named image
    for old_name, new_name in fixes.items():
        image = WebsiteImage.query.filter_by(
            page_name='index', 
            section_name='core_focus_areas', 
            subsection_name=old_name
        ).first()
        
        if image:
            print(f'Found image with subsection "{old_name}": {image.filename}')
            image.subsection_name = new_name
            print(f'Updated subsection name to "{new_name}"')
            fixed_count += 1
        else:
            print(f'No image found with subsection name "{old_name}"')
    
    # Commit all changes
    if fixed_count > 0:
        from Backend.models import db
        db.session.commit()
        print(f'\nSuccessfully fixed {fixed_count} images.')
    else:
        print('\nNo images needed fixing.')
        
    # Run validation again to confirm all images are now correct
    print('\nRe-running validation...')
    images = WebsiteImage.query.filter_by(page_name='index', section_name='core_focus_areas').all()
    valid_subsections = {
        'marketplace', 'agri_marketplace',     # Block 1
        'logistics', 'smart_logistics',        # Block 2  
        'advisory', 'consulting',              # Block 3
        'finance', 'inputs',                   # Block 4
        'training', 'capacity',                # Block 5
        'data', 'traceability',                # Block 6
        'value_addition', 'processing'         # Block 7
    }
    
    valid_count = 0
    invalid_count = 0
    
    for img in images:
        if img.subsection_name in valid_subsections:
            valid_count += 1
            print(f"✓ VALID - {img.filename} (subsection: '{img.subsection_name}')")
        else:
            invalid_count += 1
            print(f"✗ INVALID - {img.filename} (subsection: '{img.subsection_name}')")
    
    print(f"\nFinal Validation Summary:")
    print(f"  Valid images: {valid_count}")
    print(f"  Invalid images: {invalid_count}")
    print(f"  Total images: {len(images)}")