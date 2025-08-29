from Backend.models.content import WebsiteImage
from app import app

with app.app_context():
    # Check all core focus area images
    images = WebsiteImage.query.filter_by(page_name='index', section_name='core_focus_areas').all()
    print(f'All core focus area images:')
    for img in images:
        print(f'- {img.filename} (subsection: {img.subsection_name}) - Active: {img.is_active}')