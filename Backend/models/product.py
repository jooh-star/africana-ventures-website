from datetime import datetime
from Backend.models import db
from Backend.models.content import WebsiteImage # Import WebsiteImage

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(50), nullable=False) # Horticulture, Cereals & Legumes, Oilseeds & Nuts, Farm Inputs
    name = db.Column(db.String(100), nullable=False)
    short_description = db.Column(db.String(255), nullable=False)
    detailed_description = db.Column(db.Text, nullable=True)
    price = db.Column(db.String(50), nullable=False) # e.g., "10 USD", "5000 TZS"
    unit_of_measure = db.Column(db.String(50), nullable=False) # kg, bag, litre, piece, etc.
    stock_status = db.Column(db.String(20), nullable=False) # In Stock, Out of Stock
    
    # Relationship to WebsiteImage for the product image
    image_id = db.Column(db.Integer, db.ForeignKey('website_image.id'), nullable=True)
    image = db.relationship('WebsiteImage', backref='product_image', uselist=False) # Changed backref to avoid conflict

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_modified = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_deleted = db.Column(db.Boolean, default=False, nullable=False)

    __table_args__ = (
        db.Index('ix_product_category_name', 'category', 'name', unique=True),
    )

    def __repr__(self):
        return f'<Product {self.name} ({self.category})>'
