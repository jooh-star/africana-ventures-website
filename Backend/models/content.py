from datetime import datetime
import os
from Backend.models import db

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20))
    company = db.Column(db.String(100))
    service = db.Column(db.String(50), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_read = db.Column(db.Boolean, default=False)

class Testimonial(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(100))
    testimonial = db.Column(db.Text, nullable=False)
    photo_filename = db.Column(db.String(255))
    rating = db.Column(db.Integer, default=5)  # 1-5 star rating
    is_approved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class WebsiteImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    relative_path = db.Column(db.String(500), nullable=True)  # Stores page/section/filename for organized structure
    
    # Enhanced organization fields
    page_name = db.Column(db.String(100), nullable=False)  # 'index', 'about', 'services', 'products', 'contact'
    section_name = db.Column(db.String(100), nullable=False)  # 'hero', 'team', 'testimonials', 'products'
    subsection_name = db.Column(db.String(100), nullable=True)  # 'slide_1', 'slide_2', 'card_1', specific position
    
    # Content details
    description = db.Column(db.Text, nullable=False)  # Detailed description of image purpose
    alt_text = db.Column(db.String(255))  # For accessibility
    usage_context = db.Column(db.Text, nullable=True)  # Additional context about where/how it's used
    
    # Image classification
    image_type = db.Column(db.String(50), nullable=False, default='static')  # 'static', 'dynamic', 'background', 'product', 'hero'
    
    # Legacy section field for backward compatibility
    section = db.Column(db.String(50), nullable=True, index=True)  # Keeping for legacy compatibility
    
    # Display and management
    display_order = db.Column(db.Integer, default=0, index=True)  # For ordering images within sections
    is_active = db.Column(db.Boolean, default=True, index=True)
    is_featured = db.Column(db.Boolean, default=False)  # For hero/featured images
    
    # File metadata
    file_size = db.Column(db.Integer, nullable=True)
    width = db.Column(db.Integer, nullable=True)
    height = db.Column(db.Integer, nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_modified = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        db.Index('ix_websiteimage_page_section_active_order', 'page_name', 'section_name', 'is_active', 'display_order'),
    )
    
    def __repr__(self):
        return f'<WebsiteImage {self.filename} - {self.page_name}/{self.section_name}>' 
    
    def get_file_path(self):
        """Get the full file path for this image"""
        if self.relative_path:
            # New organized structure: uploads/page/section/filename
            return os.path.join('Frontend', 'static', 'uploads', self.relative_path)
        else:
            # Legacy structure: images/filename
            return os.path.join('Frontend', 'static', 'images', self.filename)
    
    def get_url_path(self):
        """Get the URL path for use in templates"""
        if self.relative_path:
            # New organized structure
            return f"uploads/{self.relative_path}"
        else:
            # Legacy structure
            return f"images/{self.filename}"
    
    def to_dict(self):
        """Convert to dictionary for API responses"""
        return {
            'id': self.id,
            'filename': self.filename,
            'original_filename': self.original_filename,
            'relative_path': self.relative_path,
            'page_name': self.page_name,
            'section_name': self.section_name,
            'subsection_name': self.subsection_name,
            'description': self.description,
            'alt_text': self.alt_text,
            'usage_context': self.usage_context,
            'image_type': self.image_type,
            'display_order': self.display_order,
            'is_active': self.is_active,
            'is_featured': self.is_featured,
            'file_size': self.file_size,
            'width': self.width,
            'height': self.height,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_modified': self.last_modified.isoformat() if self.last_modified else None
        }

class TeamMember(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    position = db.Column(db.String(100), nullable=False)
    bio = db.Column(db.Text)
    photo_filename = db.Column(db.String(255))
    email = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    linkedin = db.Column(db.String(255))
    twitter = db.Column(db.String(255))
    display_order = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    icon = db.Column(db.String(50))  # Font Awesome icon class
    image_filename = db.Column(db.String(255))
    display_order = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class WebsiteContent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    section = db.Column(db.String(50), nullable=False)  # about, mission, vision, etc.
    title = db.Column(db.String(100))
    content = db.Column(db.Text, nullable=False)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class FAQ(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(255), nullable=False)
    answer = db.Column(db.Text, nullable=False)
    display_order = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class CompanyInfo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.Text)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(120))
    facebook = db.Column(db.String(255))
    twitter = db.Column(db.String(255))
    linkedin = db.Column(db.String(255))
    instagram = db.Column(db.String(255))
    logo_filename = db.Column(db.String(255))
    favicon_filename = db.Column(db.String(255))
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)