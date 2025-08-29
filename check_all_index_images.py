from Backend.models.content import WebsiteImage
from app import app

with app.app_context():
    images = WebsiteImage.query.filter_by(page_name='index').all()
    print('All Index Page Images:')
    for img in images:
        print(f'- {img.filename} ({img.section_name}/{img.subsection_name}) - Active: {img.is_active}')
        print(f'  Relative path: {img.relative_path}')
        print(f'  File path: {img.get_file_path()}')
        print()