from Backend.models.content import WebsiteImage
from app import app

with app.app_context():
    # Find the image with subsection "block_1"
    image = WebsiteImage.query.filter_by(page_name='index', section_name='core_focus_areas', subsection_name='block_1').first()
    if image:
        print(f'Found image with subsection "block_1": {image.filename}')
        # Update the subsection name to "marketplace" to match what the template expects
        image.subsection_name = 'marketplace'
        from Backend.models import db
        db.session.commit()
        print('Updated subsection name to "marketplace"')
    else:
        print('No image found with subsection name "block_1"')