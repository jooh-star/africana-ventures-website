from datetime import datetime
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
    section = db.Column(db.String(50), nullable=False)  # hero, about, services, team, etc.
    description = db.Column(db.String(255))
    alt_text = db.Column(db.String(255))  # For accessibility
    display_order = db.Column(db.Integer, default=0)  # For ordering images
    is_active = db.Column(db.Boolean, default=True)
    is_featured = db.Column(db.Boolean, default=False)  # For hero/featured images
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

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