from Backend.models.content import WebsiteImage
from app import app

with app.app_context():
    # Fix the image with subsection "block_2"
    image = WebsiteImage.query.filter_by(page_name='index', section_name='core_focus_areas', subsection_name='block_2').first()
    if image:
        print(f'Found image with subsection "block_2": {image.filename}')
        # Update the subsection name to "logistics" to match what the template expects
        image.subsection_name = 'logistics'
        from Backend.models import db
        db.session.commit()
        print('Updated subsection name to "logistics"')
    else:
        print('No image found with subsection name "block_2"')
        
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