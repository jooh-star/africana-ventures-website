from Backend.models.content import WebsiteImage
from app import app

# Mapping of generic block names to template-expected names
subsection_mapping = {
    'block_1': 'marketplace',      # Agri-Marketplace Platform
    'block_2': 'logistics',        # Smart Logistics & Distribution
    'block_3': 'advisory',         # Advisory & Consulting
    'block_4': 'finance',          # Access to Inputs & Finance
    'block_5': 'training',         # Training & Capacity Building
    'block_6': 'data',             # Data & Traceability
    'block_7': 'value_addition',   # Value Addition & Processing
    
    # Also handle any partial matches
    'market': 'marketplace',
    'logistic': 'logistics',
    'consult': 'advisory',
    'financ': 'finance',
    'train': 'training',
    'capac': 'capacity',
    'trace': 'traceability',
    'process': 'processing',
    'value': 'value_addition',
    'data': 'data',
    'advisory': 'advisory',
    'agri_market': 'agri_marketplace',
    'smart_logistic': 'smart_logistics',
    'smart_logistics': 'smart_logistics',
    'inputs': 'inputs',
}

def get_expected_subsection_name(current_name):
    """Get the expected subsection name based on current name"""
    # Direct mapping
    if current_name in subsection_mapping:
        return subsection_mapping[current_name]
    
    # Partial matching
    for key, value in subsection_mapping.items():
        if key in current_name.lower():
            return value
    
    # If no match found, return current name
    return current_name

with app.app_context():
    # Get all core focus area images
    images = WebsiteImage.query.filter_by(page_name='index', section_name='core_focus_areas').all()
    
    print(f'Found {len(images)} core focus area images to process:')
    
    updated_count = 0
    for img in images:
        original_subsection = img.subsection_name
        expected_subsection = get_expected_subsection_name(original_subsection)
        
        print(f'- {img.filename}')
        print(f'  Current subsection: "{original_subsection}"')
        print(f'  Expected subsection: "{expected_subsection}"')
        
        # Update if different
        if original_subsection != expected_subsection:
            img.subsection_name = expected_subsection
            print(f'  UPDATED to: "{expected_subsection}"')
            updated_count += 1
        else:
            print(f'  No change needed')
        print()
    
    # Commit changes if any updates were made
    if updated_count > 0:
        from Backend.models import db
        db.session.commit()
        print(f'Successfully updated {updated_count} images.')
    else:
        print('No updates were needed.')
    
    print('\nFinal state of all core focus area images:')
    images = WebsiteImage.query.filter_by(page_name='index', section_name='core_focus_areas').all()
    for img in images:
        print(f'- {img.filename} (subsection: {img.subsection_name}) - Active: {img.is_active}')