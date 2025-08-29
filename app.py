# app.py
import os
from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime
from markupsafe import Markup, escape
import json
import logging

# Get the absolute path to the directory containing app.py
project_root = os.path.dirname(os.path.abspath(__file__))
frontend_folder = os.path.join(project_root, 'Frontend')

# Initialize Flask app, specifying the template and static folders
app = Flask(
    __name__,
    template_folder=os.path.join(frontend_folder, 'templates'),
    static_folder=os.path.join(frontend_folder, 'static')
)

# Configuration
# Replace this
app.config['SECRET_KEY'] = 'your-secret-key-here-change-in-production'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///africana_ventures.db'

# With this
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'fallback-dev-key-not-for-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI', 'sqlite:///africana_ventures.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(frontend_folder, 'static', 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize extensions
from flask_wtf.csrf import CSRFProtect

# Initialize extensions
csrf = CSRFProtect(app)
from Backend.models import db
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'admin.admin_login'
db.init_app(app)

# Register blueprints
from Backend.routes.admin import admin
from Backend.routes.main import main
app.register_blueprint(admin)
app.register_blueprint(main)

from Backend.models.user import User
from Backend.models.content import Contact, Testimonial

def perform_sqlite_migrations():
    """Lightweight migrations for sqlite to add missing columns after model changes."""
    from sqlalchemy import text
    # Use a transactional connection so schema changes persist
    with db.engine.begin() as conn:
        def column_exists(table_name: str, column_name: str) -> bool:
            result = conn.exec_driver_sql(f"PRAGMA table_info({table_name})").all()
            existing = {row[1] for row in result}  # row[1] is column name
            return column_name in existing

        # Service.description/icon columns
        if not column_exists('service', 'description'):
            conn.exec_driver_sql("ALTER TABLE service ADD COLUMN description TEXT")
        if not column_exists('service', 'icon'):
            conn.exec_driver_sql("ALTER TABLE service ADD COLUMN icon VARCHAR(50)")

        # TeamMember.phone/twitter if missing
        if not column_exists('team_member', 'phone'):
            conn.exec_driver_sql("ALTER TABLE team_member ADD COLUMN phone VARCHAR(20)")
        if not column_exists('team_member', 'twitter'):
            conn.exec_driver_sql("ALTER TABLE team_member ADD COLUMN twitter VARCHAR(255)")

        # CompanyInfo logo/favicon if missing
        if not column_exists('company_info', 'logo_filename'):
            conn.exec_driver_sql("ALTER TABLE company_info ADD COLUMN logo_filename VARCHAR(255)")
        if not column_exists('company_info', 'favicon_filename'):
            conn.exec_driver_sql("ALTER TABLE company_info ADD COLUMN favicon_filename VARCHAR(255)")
        if not column_exists('company_info', 'last_updated'):
            conn.exec_driver_sql("ALTER TABLE company_info ADD COLUMN last_updated DATETIME")
        # CompanyInfo name column, backfill from legacy company_name if present
        if not column_exists('company_info', 'name'):
            conn.exec_driver_sql("ALTER TABLE company_info ADD COLUMN name VARCHAR(100)")
            # backfill if legacy column exists
            legacy_cols = {row[1] for row in conn.exec_driver_sql("PRAGMA table_info(company_info)").all()}
            if 'company_name' in legacy_cols:
                conn.exec_driver_sql("UPDATE company_info SET name = company_name WHERE name IS NULL OR name = ''")

        # WebsiteImage enhanced fields for comprehensive image management
        if not column_exists('website_image', 'page_name'):
            conn.exec_driver_sql("ALTER TABLE website_image ADD COLUMN page_name VARCHAR(100)")
        if not column_exists('website_image', 'section_name'):
            conn.exec_driver_sql("ALTER TABLE website_image ADD COLUMN section_name VARCHAR(100)")
        if not column_exists('website_image', 'subsection_name'):
            conn.exec_driver_sql("ALTER TABLE website_image ADD COLUMN subsection_name VARCHAR(100)")
        if not column_exists('website_image', 'alt_text'):
            conn.exec_driver_sql("ALTER TABLE website_image ADD COLUMN alt_text VARCHAR(255)")
        if not column_exists('website_image', 'usage_context'):
            conn.exec_driver_sql("ALTER TABLE website_image ADD COLUMN usage_context TEXT")
        if not column_exists('website_image', 'image_type'):
            conn.exec_driver_sql("ALTER TABLE website_image ADD COLUMN image_type VARCHAR(50) DEFAULT 'static'")
        if not column_exists('website_image', 'display_order'):
            conn.exec_driver_sql("ALTER TABLE website_image ADD COLUMN display_order INTEGER DEFAULT 0")
        if not column_exists('website_image', 'is_active'):
            conn.exec_driver_sql("ALTER TABLE website_image ADD COLUMN is_active BOOLEAN DEFAULT 1")
        if not column_exists('website_image', 'is_featured'):
            conn.exec_driver_sql("ALTER TABLE website_image ADD COLUMN is_featured BOOLEAN DEFAULT 0")
        if not column_exists('website_image', 'file_size'):
            conn.exec_driver_sql("ALTER TABLE website_image ADD COLUMN file_size INTEGER")
        if not column_exists('website_image', 'width'):
            conn.exec_driver_sql("ALTER TABLE website_image ADD COLUMN width INTEGER")
        if not column_exists('website_image', 'height'):
            conn.exec_driver_sql("ALTER TABLE website_image ADD COLUMN height INTEGER")
        if not column_exists('website_image', 'last_modified'):
            conn.exec_driver_sql("ALTER TABLE website_image ADD COLUMN last_modified DATETIME")
        
        # Update existing WebsiteImage records with default values for new required fields
        # Set page_name and section_name based on existing section field for backward compatibility
        conn.exec_driver_sql("""
            UPDATE website_image 
            SET page_name = CASE 
                WHEN section = 'hero' THEN 'index'
                WHEN section = 'about' THEN 'about'
                WHEN section = 'services' THEN 'services'
                WHEN section = 'team' THEN 'about'
                WHEN section = 'contact' THEN 'contact'
                WHEN section = 'gallery' THEN 'gallery'
                WHEN section = 'background' THEN 'index'
                WHEN section = 'logo' THEN 'base'
                ELSE 'index'
            END,
            section_name = COALESCE(section, 'hero'),
            description = COALESCE(description, 'Website image'),
            image_type = CASE
                WHEN section = 'hero' THEN 'hero'
                WHEN section = 'background' THEN 'background'
                WHEN section = 'logo' THEN 'static'
                ELSE 'static'
            END
            WHERE page_name IS NULL OR section_name IS NULL
        """)
        
        # Add admin photo field to User table if missing
        if not column_exists('user', 'photo_filename'):
            conn.exec_driver_sql("ALTER TABLE user ADD COLUMN photo_filename VARCHAR(255)")

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Create database tables
# Replace this section at the bottom of your imports/setup

# REMOVE THESE LINES
# with app.app_context():
#     db.create_all()
#     create_admin_if_not_exists()

# REMOVE THIS BLOCK
# @app.before_first_request
# def initialize_app():
#     with app.app_context():
#         db.create_all()
#         create_admin_if_not_exists()

# Function to create admin user if it doesn't exist
def create_admin_if_not_exists():
    # Check if any admin user exists first (not just username 'admin')
    admin_exists = User.query.filter_by(is_admin=True).first() is not None
    
    if not admin_exists:
        admin_user = User(
            username='admin',
            email='admin@africanaventures.com',
            password_hash=generate_password_hash('admin123'),  # Change this in production!
            is_admin=True
        )
        db.session.add(admin_user)
        db.session.commit()
        print("Admin user created!")

# ADD THIS INSTEAD - Create a function to initialize the database
def initialize_app(app):
    with app.app_context():
        # Run migrations first
        try:
            perform_sqlite_migrations()
        except Exception as e:
            print(f"Migration warning: {e}")
        
        # Then create tables and admin
        db.create_all()
        # Only create admin if not in testing mode
        if not app.config.get('TESTING'):
            create_admin_if_not_exists()

# Page routes are handled by the 'main' blueprint

# Contact form submission
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Then in your routes
@app.route('/submit_contact', methods=['POST'])
def submit_contact():
    try:
        contact = Contact(
            first_name=request.form['firstName'],
            last_name=request.form['lastName'],
            email=request.form['email'],
            phone=request.form.get('phone', ''),
            company=request.form.get('company', ''),
            service=request.form['service'],
            message=request.form['message']
        )
        db.session.add(contact)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Thank you for your message! We will get back to you soon.'})
    except Exception as e:
        logger.error(f"Error in submit_contact: {str(e)}")
        return jsonify({'success': False, 'message': 'An error occurred. Please try again.'})

# Testimonial form submission
@app.route('/submit_testimonial', methods=['POST'])
def submit_testimonial():
    try:
        photo_filename = None
        if 'photo' in request.files and request.files['photo'].filename:
            file = request.files['photo']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                filename = f"testimonial_{timestamp}_{filename}"
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                photo_filename = filename

        testimonial = Testimonial(
            name=request.form['name'],
            location=request.form['location'],
            title=request.form.get('title', ''),
            testimonial=request.form['testimonial'],
            rating=request.form.get('rating', 5),
            photo_filename=photo_filename
        )
        db.session.add(testimonial)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Thank you for your testimonial! It will be reviewed and posted soon.'})
    except Exception as e:
        return jsonify({'success': False, 'message': 'An error occurred. Please try again.'})

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Admin routes are now handled by the admin blueprint

# Admin logout route is now handled by the admin blueprint

# Admin change password route is now handled by the admin blueprint

# Admin dashboard route is now handled by the admin blueprint

# admin_contacts route is now handled by the admin blueprint

# mark_contact_read route is now handled by the admin blueprint

# admin_testimonials route is now handled by the admin blueprint

# approve_testimonial route is now handled by the admin blueprint

# delete_testimonial route is now handled by the admin blueprint

# admin_images route is now handled by the admin blueprint

# delete_image route is now handled by the admin blueprint

# toggle_image route is now handled by the admin blueprint

# admin_team route is now handled by the admin blueprint

# add_team_member route is now handled by the admin blueprint

# edit_team_member route is now handled by the admin blueprint

# delete_team_member route is now handled by the admin blueprint

# admin_services route is now handled by the admin blueprint

# add_service route is now handled by the admin blueprint

# edit_service route is now handled by the admin blueprint

# delete_service route is now handled by the admin blueprint

# admin_content route is now handled by the admin blueprint

# edit_content route is now handled by the admin blueprint

# admin_faqs route is now handled by the admin blueprint

# add_faq route is now handled by the admin blueprint

# edit_faq route is now handled by the admin blueprint

# delete_faq route is now handled by the admin blueprint

# upload_image route is now handled by the admin blueprint

# edit_image route is now handled by the admin blueprint

@app.context_processor
def inject_now():
    return {'now': datetime.utcnow()}

# Jinja filter: convert newlines to <br>
@app.template_filter('nl2br')
def nl2br_filter(text):
    if text is None:
        return ''
    return Markup(escape(text).replace('\n', '<br>\n'))

# Initialize the application
initialize_app(app)

if __name__ == '__main__':
    app.run(debug=True)
