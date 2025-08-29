from Backend.models.content import WebsiteImage
from app import app

with app.app_context():
    images = WebsiteImage.query.filter_by(page_name='index', section_name='core_focus_areas').all()
    print('Core Focus Areas Images:')
    for img in images:
        print(f'- {img.filename} ({img.subsection_name}) - Active: {img.is_active}')