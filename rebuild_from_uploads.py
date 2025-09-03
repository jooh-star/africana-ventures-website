import os
import re
from pathlib import Path
from datetime import datetime

from app import app
from Backend.models import db
from Backend.models.content import WebsiteImage
from Backend.models.product import Product

ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}

# Map upload subfolder to (page_name, section_name)
FOLDER_TO_PAGE_SECTION = {
    'index': ('index', 'gallery'),
    'about': ('about', 'about'),
    'services': ('services', 'services'),
    'solutions': ('solutions', 'solutions'),
    'contact': ('contact', 'contact'),
    'team': ('about', 'team'),
    'base': ('base', 'base'),
    'products': ('products', 'product_cards'),
}


def is_image(path: Path) -> bool:
    return path.suffix.lower() in ALLOWED_EXTENSIONS


def normalize_title(name: str) -> str:
    base = name.rsplit('.', 1)[0]
    base = base.replace('-', ' ').replace('_', ' ')
    return base.title()


def main() -> None:
    project_root = Path(__file__).resolve().parent
    uploads_dir = project_root / 'Frontend' / 'static' / 'uploads'

    if not uploads_dir.exists():
        print(f"Uploads directory not found: {uploads_dir}")
        return

    created_images = 0
    created_products = 0

    with app.app_context():
        # Ensure upload folder exists as configured
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

        for folder, (page_name, section_name) in FOLDER_TO_PAGE_SECTION.items():
            folder_path = uploads_dir / folder
            if not folder_path.exists():
                continue

            for path in folder_path.rglob('*'):
                if path.is_dir() or not is_image(path):
                    continue

                filename = path.name
                relative_path = str(path.relative_to(project_root / 'Frontend' / 'static'))

                # Create WebsiteImage if missing (by filename & relative_path)
                img = WebsiteImage.query.filter_by(filename=filename).first()
                if img is None:
                    img = WebsiteImage(
                        filename=filename,
                        original_filename=filename,
                        relative_path=relative_path.replace('\\', '/'),
                        page_name=page_name,
                        section_name=section_name,
                        description=normalize_title(filename),
                        alt_text=normalize_title(filename),
                        usage_context=f"Recovered from uploads/{folder}",
                        image_type='product' if folder == 'products' else 'static',
                        display_order=0,
                        is_active=True,
                        is_featured=False,
                        created_at=datetime.utcnow(),
                    )
                    # legacy not-null section fallback if present in schema
                    if hasattr(img, 'section') and img.section is None:
                        img.section = section_name
                    db.session.add(img)
                    try:
                        db.session.flush()  # assign id for product link
                        created_images += 1
                    except Exception:
                        db.session.rollback()
                        continue

                # For products: create a basic Product if missing for this image
                if folder == 'products':
                    prod = Product.query.filter_by(image_id=img.id).first()
                    if prod is None:
                        base_name = normalize_title(filename)
                        prod = Product(
                            category='Uncategorized',
                            name=base_name,
                            short_description=base_name,
                            detailed_description=None,
                            price='',
                            unit_of_measure='piece',
                            stock_status='In Stock',
                            image_id=img.id,
                            is_deleted=False,
                        )
                        db.session.add(prod)
                        created_products += 1

        db.session.commit()

    print(f"Created {created_images} WebsiteImage records, {created_products} Product records.")


if __name__ == '__main__':
    main()


