from Backend.models.content import WebsiteImage
from app import app

with app.app_context():
    # Check for images with subsection names that Block 1 template is looking for
    marketplace_image = WebsiteImage.query.filter_by(page_name='index', section_name='core_focus_areas', subsection_name='marketplace').first()
    agri_marketplace_image = WebsiteImage.query.filter_by(page_name='index', section_name='core_focus_areas', subsection_name='agri_marketplace').first()
    
    if marketplace_image:
        print(f'Found image with subsection "marketplace": {marketplace_image.filename}')
        print(f'Relative path: {marketplace_image.relative_path}')
        print(f'Active: {marketplace_image.is_active}')
    elif agri_marketplace_image:
        print(f'Found image with subsection "agri_marketplace": {agri_marketplace_image.filename}')
        print(f'Relative path: {agri_marketplace_image.relative_path}')
        print(f'Active: {agri_marketplace_image.is_active}')
    else:
        print('No image found with subsection name "marketplace" or "agri_marketplace"')
        
    # Check all core focus area images
    images = WebsiteImage.query.filter_by(page_name='index', section_name='core_focus_areas').all()
    print(f'\nAll core focus area images:')
    for img in images:
        print(f'- {img.filename} (subsection: {img.subsection_name}) - Active: {img.is_active}')