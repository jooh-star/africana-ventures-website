from Backend.models.content import WebsiteImage
from app import app

with app.app_context():
    # Check for the specific image
    image = WebsiteImage.query.filter_by(page_name='index', section_name='core_focus_areas', subsection_name='advisory').first()
    if image:
        print(f'Found image: {image.filename}')
        print(f'Relative path: {image.relative_path}')
        print(f'File path: {image.get_file_path()}')
        print(f'URL path: {image.get_url_path()}')
    else:
        print('No image found with subsection name "advisory"')
        
    # Check all core focus area images
    images = WebsiteImage.query.filter_by(page_name='index', section_name='core_focus_areas').all()
    print(f'\nAll core focus area images:')
    for img in images:
        print(f'- {img.filename} (subsection: {img.subsection_name}) - Active: {img.is_active}')