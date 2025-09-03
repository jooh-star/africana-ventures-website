from flask import Blueprint, render_template, request, redirect, url_for, flash, session, current_app
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import check_password_hash
from Backend.models import db
from Backend.models.user import User
from Backend.models.content import (
    Contact,
    Testimonial,
    WebsiteImage,
    TeamMember,
    Service,
    CompanyInfo,
    WebsiteContent,
    FAQ,
)
from Backend.models.product import Product
import os
from werkzeug.utils import secure_filename
from datetime import datetime
from Backend.utils.helpers import allowed_file, save_uploaded_file
from sqlalchemy import text

admin = Blueprint('admin', __name__)

def category_to_slug(category: str) -> str:
    """Map human-friendly category to a frontend-friendly slug used for filtering."""
    mapping = {
        'Horticulture': 'horticulture',
        'Cereals & Legumes': 'cereals',
        'Oilseeds & Nuts': 'oilseeds',
        'Farm Inputs': 'inputs',
    }
    return mapping.get(category, secure_filename((category or '').lower()))

@admin.route('/system/management/access', methods=['GET', 'POST'])
def admin_login():
    if current_user.is_authenticated and current_user.is_admin:
        return redirect(url_for('admin.admin_dashboard'))
    
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        user = User.query.filter_by(username=username).first()
        
        if user and check_password_hash(user.password_hash, password) and user.is_admin:
            login_user(user)
            return redirect(url_for('admin.admin_dashboard'))
        else:
            flash('Invalid username or password', 'danger')
    
    return render_template('admin/login.html')

@admin.route('/admin/logout')
@login_required
def admin_logout():
    logout_user()
    return redirect(url_for('main.index'))

@admin.route('/admin/dashboard')
@login_required
def admin_dashboard():
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    # Get statistics for dashboard
    total_contacts = Contact.query.count()
    unread_contacts = Contact.query.filter_by(is_read=False).count()
    total_testimonials = Testimonial.query.count()
    pending_testimonials = Testimonial.query.filter_by(is_approved=False).count()
    
    # Get recent contacts
    recent_contacts = Contact.query.order_by(Contact.created_at.desc()).limit(5).all()
    
    return render_template('admin/dashboard.html', 
                           total_contacts=total_contacts,
                           unread_contacts=unread_contacts,
                           total_testimonials=total_testimonials,
                           pending_testimonials=pending_testimonials,
                           recent_contacts=recent_contacts)

@admin.route('/admin/contacts')
@login_required
def admin_contacts():
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    contacts = Contact.query.order_by(Contact.created_at.desc()).all()
    return render_template('admin/contacts.html', contacts=contacts)

@admin.route('/admin/contact/<int:contact_id>/mark-read')
@login_required
def mark_contact_read(contact_id):
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    contact = Contact.query.get_or_404(contact_id)
    contact.is_read = True
    db.session.commit()
    return redirect(url_for('admin.admin_contacts'))

@admin.route('/admin/company-info', methods=['GET', 'POST'])
@login_required
def admin_company_info():
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    company_info = CompanyInfo.query.first()
    if not company_info:
        # Handle legacy schemas where 'company_name' exists and is NOT NULL
        def table_has_column(table: str, column: str) -> bool:
            result = db.session.execute(text(f"PRAGMA table_info({table})")).all()
            return any(row[1] == column for row in result)
        if table_has_column('company_info', 'company_name'):
            db.session.execute(
                text("INSERT INTO company_info (name, company_name) VALUES (:n, :cn)"),
                {"n": "Africana Ventures", "cn": "Africana Ventures"}
            )
            db.session.commit()
            company_info = CompanyInfo.query.first()
        else:
            company_info = CompanyInfo(name='Africana Ventures')
            db.session.add(company_info)
            db.session.commit()
    
    if request.method == 'POST':
        # Map fields that exist; ignore extras to avoid errors with current schema
        company_name = request.form.get('company_name')
        if company_name:
            company_info.name = company_name
        company_info.address = request.form.get('address')
        company_info.phone = request.form.get('phone')
        company_info.email = request.form.get('email')
        company_info.facebook = request.form.get('facebook')
        company_info.twitter = request.form.get('twitter')
        company_info.instagram = request.form.get('instagram')
        company_info.linkedin = request.form.get('linkedin')
        
        # Handle logo upload
        if 'logo' in request.files:
            file = request.files['logo']
            if file and file.filename != '' and allowed_file(file.filename):
                if getattr(company_info, 'logo_filename', None):
                    try:
                        os.remove(os.path.join(current_app.config['UPLOAD_FOLDER'], company_info.logo_filename))
                    except Exception:
                        pass
                filename = secure_filename(file.filename)
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                company_info.logo_filename = f"logo_{timestamp}_{filename}"
                file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], company_info.logo_filename))
        
        # Handle favicon upload
        if 'favicon' in request.files:
            file = request.files['favicon']
            if file and file.filename != '' and allowed_file(file.filename):
                if getattr(company_info, 'favicon_filename', None):
                    try:
                        os.remove(os.path.join(current_app.config['UPLOAD_FOLDER'], company_info.favicon_filename))
                    except Exception:
                        pass
                filename = secure_filename(file.filename)
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                company_info.favicon_filename = f"favicon_{timestamp}_{filename}"
                file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], company_info.favicon_filename))
        
        db.session.commit()
        flash('Company information updated successfully!', 'success')
        return redirect(url_for('admin.admin_company_info'))
    
    return render_template('admin/company_info.html', company_info=company_info)

@admin.route('/admin/testimonials', methods=['GET', 'POST'])
@login_required
def admin_testimonials():
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    testimonials = Testimonial.query.order_by(Testimonial.created_at.desc()).all()
    return render_template('admin/testimonials.html', testimonials=testimonials)

@admin.route('/admin/testimonial/<int:testimonial_id>/approve', methods=['GET', 'POST'])
@login_required
def approve_testimonial(testimonial_id):
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    testimonial = Testimonial.query.get_or_404(testimonial_id)
    testimonial.is_approved = True
    db.session.commit()
    flash('Testimonial approved successfully!')
    return redirect(url_for('admin.admin_testimonials'))

@admin.route('/admin/testimonial/<int:testimonial_id>/delete', methods=['GET', 'POST'])
@login_required
def delete_testimonial(testimonial_id):
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    testimonial = Testimonial.query.get_or_404(testimonial_id)
    
    # Delete photo file if exists
    if testimonial.photo_filename:
        try:
            os.remove(os.path.join(current_app.config['UPLOAD_FOLDER'], testimonial.photo_filename))
        except Exception:
            pass
    
    db.session.delete(testimonial)
    db.session.commit()
    flash('Testimonial deleted successfully!')
    return redirect(url_for('admin.admin_testimonials'))

@admin.route('/admin/images', methods=['GET', 'POST'])
@login_required
def admin_images():
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    # Get filter parameters
    page_filter = request.args.get('page', '')
    section_filter = request.args.get('section', '')
    type_filter = request.args.get('type', '')
    
    # Build query with filters
    query = WebsiteImage.query
    
    if page_filter:
        query = query.filter(WebsiteImage.page_name == page_filter)
    if section_filter:
        query = query.filter(WebsiteImage.section_name == section_filter)
    if type_filter:
        query = query.filter(WebsiteImage.image_type == type_filter)
    
    images = query.order_by(WebsiteImage.page_name, WebsiteImage.section_name, WebsiteImage.display_order, WebsiteImage.created_at.desc()).all()
    
    # Get unique values for filter dropdowns
    pages = db.session.query(WebsiteImage.page_name).distinct().all()
    
    if page_filter == 'products':
        sections = [('product_cards',)]
        types = [('product',)]
    else:
        sections = db.session.query(WebsiteImage.section_name).distinct().all()
        types = db.session.query(WebsiteImage.image_type).distinct().all()
    
    # Handle POST request for adding new images
    if request.method == 'POST':
        title = request.form['title']
        page_name = request.form['page_name']
        section_name = request.form['section_name']
        subsection_name = request.form.get('subsection_name', '')
        description = request.form['description']
        alt_text = request.form.get('alt_text', '')
        usage_context = request.form.get('usage_context', '')
        image_type = request.form['image_type']
        display_order = int(request.form.get('display_order', 0))
        
        if 'image_file' in request.files:
            file = request.files['image_file']
            if file and file.filename != '' and allowed_file(file.filename):
                from Backend.utils.helpers import save_page_file
                
                # Use organized folder structure
                base_upload_folder = os.path.join(current_app.root_path, 'Frontend', 'static', 'uploads')
                new_filename, relative_path = save_page_file(
                    file, 
                    base_upload_folder, 
                    page_name, 
                    section_name, 
                    f"{page_name}_{section_name}"
                )
                
                if not new_filename:
                    flash('Error saving file. Please try again.', 'error')
                    return redirect(request.url)
                
                # Create new WebsiteImage record
                new_image = WebsiteImage(
                    filename=new_filename,
                    original_filename=file.filename,
                    relative_path=relative_path,
                    page_name=page_name,
                    section_name=section_name,
                    subsection_name=subsection_name,
                    description=description,
                    alt_text=alt_text,
                    usage_context=usage_context,
                    image_type=image_type,
                    display_order=display_order,
                    section=section_name  # For legacy compatibility
                )
                
                # Get file size
                file.seek(0)
                new_image.file_size = len(file.read())
                
                # Reset file pointer after reading for size
                file.seek(0)
                
                db.session.add(new_image)
                db.session.commit()
                flash('Image added successfully!', 'success')
                return redirect(url_for('admin.admin_images'))
            else:
                flash('Please select a valid image file.', 'error')
    
    return render_template('admin/images.html', 
                         images=images,
                         pages=[p[0] for p in pages],
                         sections=[s[0] for s in sections],
                         types=[t[0] for t in types],
                         current_page=page_filter,
                         current_section=section_filter,
                         current_type=type_filter)

@admin.route('/admin/image/<int:image_id>/edit', methods=['GET', 'POST'])
@login_required
def edit_image(image_id):
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    image = WebsiteImage.query.get_or_404(image_id)
    
    if request.method == 'POST':
        image.page_name = request.form['page_name']
        image.section_name = request.form['section_name']
        image.subsection_name = request.form.get('subsection_name', '')
        image.description = request.form['description']
        image.alt_text = request.form.get('alt_text', '')
        image.usage_context = request.form.get('usage_context', '')
        image.image_type = request.form['image_type']
        image.display_order = int(request.form.get('display_order', 0))
        image.is_active = 'is_active' in request.form
        image.is_featured = 'is_featured' in request.form
        
        # Handle file replacement
        if 'image_file' in request.files:
            file = request.files['image_file']
            if file and file.filename != '' and allowed_file(file.filename):
                # Delete old file using the model's method
                old_file_path = image.get_file_path()
                try:
                    if os.path.exists(old_file_path):
                        os.remove(old_file_path)
                except Exception:
                    pass
                
                # Save new file using organized structure
                from Backend.utils.helpers import save_page_file
                base_upload_folder = os.path.join(current_app.root_path, 'Frontend', 'static', 'uploads')
                new_filename, relative_path = save_page_file(
                    file, 
                    base_upload_folder, 
                    image.page_name, 
                    image.section_name, 
                    f"{image.page_name}_{image.section_name}"
                )
                
                if new_filename:
                    image.filename = new_filename
                    image.original_filename = file.filename
                    image.relative_path = relative_path
                    # Get file size
                    file.seek(0)
                    image.file_size = len(file.read())
        
        # Update legacy section field for compatibility
        image.section = image.section_name
        
        db.session.commit()
        flash('Image updated successfully!', 'success')
        return redirect(url_for('admin.admin_images'))
    
    return render_template('admin/edit_image.html', image=image)

@admin.route('/admin/image/<int:image_id>/delete', methods=['GET', 'POST'])
@login_required
def delete_image(image_id):
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    image = WebsiteImage.query.get_or_404(image_id)
    
    # Get the return URL parameter or construct default
    return_url = request.args.get('return_url')
    if not return_url:
        # If no return_url provided, try to determine from image page_name
        if image.page_name:
            return_url = url_for('admin.admin_page_photos', page_name=image.page_name)
        else:
            return_url = url_for('admin.admin_images')
    
    # Delete file using the model's method to handle both old and new structure
    try:
        file_path = image.get_file_path()
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception:
        pass
    
    db.session.delete(image)
    db.session.commit()
    flash('Image deleted successfully!', 'success')
    return redirect(return_url)

@admin.route('/admin/api/photos/<page_name>/<section_name>')
@login_required
def api_photos_by_section(page_name, section_name):
    """API endpoint to get photos for a specific page and section"""
    if not current_user.is_admin:
        return {'error': 'Unauthorized'}, 403
    
    try:
        # Query photos for the specific page and section
        photos = WebsiteImage.query.filter_by(
            page_name=page_name,
            section_name=section_name
        ).order_by(
            WebsiteImage.display_order.asc(),
            WebsiteImage.created_at.desc()
        ).all()
        
        # Convert to JSON-serializable format
        photos_data = []
        for photo in photos:
            photo_data = {
                'id': photo.id,
                'filename': photo.filename,
                'original_filename': photo.original_filename,
                'page_name': photo.page_name,
                'section_name': photo.section_name,
                'subsection_name': photo.subsection_name or '',
                'description': photo.description or '',
                'alt_text': photo.alt_text or '',
                'usage_context': photo.usage_context or '',
                'image_type': photo.image_type or 'static',
                'display_order': photo.display_order or 0,
                'is_active': photo.is_active,
                'is_featured': photo.is_featured,
                'created_at': photo.created_at.isoformat() if photo.created_at else None
            }
            photos_data.append(photo_data)
        
        return {
            'success': True,
            'photos': photos_data,
            'count': len(photos_data),
            'page_name': page_name,
            'section_name': section_name
        }
        
    except Exception as e:
        current_app.logger.error(f'Error fetching photos for {page_name}/{section_name}: {str(e)}')
        return {'error': 'Failed to fetch photos'}, 500

@admin.route('/admin/pages/<page_name>/upload', methods=['GET', 'POST'])
@login_required
def admin_upload_page_photo(page_name):
    """Upload or replace a photo for a specific page"""
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    # Consolidation: products photos managed via Products CRUD only
    if page_name == 'products':
        flash('Manage product photos via Products. Page Photos for products is disabled.', 'info')
        return redirect(url_for('admin.admin_products'))
    
    if request.method == 'POST':
        try:
            # Get form data
            title = request.form.get('title', '').strip()
            section_name = request.form.get('section_name', '').strip()
            subsection_name = request.form.get('subsection_name', '').strip()
            description = request.form.get('description', '').strip()
            alt_text = request.form.get('alt_text', '').strip()
            usage_context = request.form.get('usage_context', '').strip()
            image_type = request.form.get('image_type', 'static')
            display_order = int(request.form.get('display_order', 0))
            is_featured = 'is_featured' in request.form
            is_active = 'is_active' in request.form
            
            # Check if this is a replacement
            action_mode = request.form.get('action_mode', 'new')
            replacing_photo_id = request.form.get('replacing_photo_id')
            
            # Validate required fields
            if not title or not section_name:
                flash('Title and section are required.', 'error')
                return redirect(request.url)
            
            # Handle file upload
            if 'image_file' not in request.files:
                flash('Please select a file to upload.', 'error')
                return redirect(request.url)
            
            file = request.files['image_file']
            if file.filename == '':
                flash('Please select a file to upload.', 'error')
                return redirect(request.url)
            
            if not allowed_file(file.filename):
                flash('Invalid file type. Please upload an image file.', 'error')
                return redirect(request.url)
            
            # Save the uploaded file using organized folder structure
            filename = secure_filename(file.filename)
            from Backend.utils.helpers import save_page_file
            
            # Use uploads folder with page-specific structure
            base_upload_folder = os.path.join(current_app.root_path, 'Frontend', 'static', 'uploads')
            new_filename, relative_path = save_page_file(
                file, 
                base_upload_folder, 
                page_name, 
                section_name, 
                f"{page_name}_{section_name}"
            )
            
            if not new_filename:
                flash('Error saving file. Please try again.', 'error')
                return redirect(request.url)
            
            if action_mode == 'replace' and replacing_photo_id:
                # Replace existing photo
                existing_photo = WebsiteImage.query.get(replacing_photo_id)
                if existing_photo:
                    # Delete old file
                    old_file_path = existing_photo.get_file_path()
                    try:
                        if os.path.exists(old_file_path):
                            os.remove(old_file_path)
                    except Exception:
                        pass  # File might not exist
                    
                    # Update existing record with new organized structure
                    existing_photo.filename = new_filename
                    existing_photo.original_filename = file.filename
                    existing_photo.relative_path = relative_path
                    existing_photo.description = description or existing_photo.description
                    existing_photo.alt_text = alt_text or existing_photo.alt_text
                    existing_photo.usage_context = usage_context or existing_photo.usage_context
                    existing_photo.image_type = image_type
                    existing_photo.display_order = display_order
                    existing_photo.is_featured = is_featured
                    existing_photo.is_active = is_active
                    # Reset file pointer to get size
                    file.seek(0)
                    existing_photo.file_size = len(file.read())
                    
                    db.session.commit()
                    flash(f'Photo "{existing_photo.original_filename}" replaced successfully!', 'success')
                else:
                    flash('Photo to replace not found.', 'error')
            else:
                # Create new photo record with organized structure
                new_photo = WebsiteImage(
                    filename=new_filename,
                    original_filename=file.filename,
                    relative_path=relative_path,
                    page_name=page_name,
                    section_name=section_name,
                    subsection_name=subsection_name,
                    description=description,
                    alt_text=alt_text,
                    usage_context=usage_context,
                    image_type=image_type,
                    display_order=display_order,
                    is_featured=is_featured,
                    is_active=is_active,
                    section=section_name  # For legacy compatibility
                )
                
                # Get file size
                file.seek(0)
                new_photo.file_size = len(file.read())
                
                db.session.add(new_photo)
                db.session.commit()
                flash(f'Photo "{file.filename}" uploaded successfully to {page_name}/{section_name}!', 'success')
            
            return redirect(url_for('admin.admin_page_photos', page_name=page_name))
            
        except Exception as e:
            current_app.logger.error(f'Error uploading photo: {str(e)}')
            flash('An error occurred while uploading the photo.', 'error')
            return redirect(request.url)
    
    # GET request - show upload form
    return render_template('admin/upload_page_photo.html', page_name=page_name)

@admin.route('/admin/images/populate-initial-data')
@login_required
def populate_initial_image_data():
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    # Initial image data based on the comprehensive catalog
    initial_images = [
        # Logo
        {'filename': 'logo.png', 'page': 'base', 'section': 'navigation', 'subsection': 'header', 'desc': 'Site logo in navigation header', 'type': 'static', 'alt': 'Africana Ventures Logo'},
        
        # Index Page Images
        {'filename': '101678.jpg', 'page': 'index', 'section': 'hero', 'subsection': 'video_fallback_1', 'desc': 'Background fallback for hero video section 1', 'type': 'background', 'alt': 'Agricultural landscape'},
        {'filename': '416767.jpg', 'page': 'index', 'section': 'hero', 'subsection': 'video_fallback_2', 'desc': 'Background fallback for hero video section 2', 'type': 'background', 'alt': 'Farm operations'},
        {'filename': '113898.jpg', 'page': 'index', 'section': 'hero', 'subsection': 'video_fallback_3', 'desc': 'Background fallback for hero video section 3', 'type': 'background', 'alt': 'Agricultural technology'},
        # Services Overview Section (5 main service cards)
        {'filename': '579959.jpg', 'page': 'index', 'section': 'services_overview', 'subsection': 'agricultural_technology', 'desc': 'Agricultural Technology service card image', 'type': 'product', 'alt': 'Agricultural Technology'},
        {'filename': '240173.jpg', 'page': 'index', 'section': 'services_overview', 'subsection': 'market_access', 'desc': 'Market Access service card image', 'type': 'product', 'alt': 'Market Access'},
        {'filename': '416769.jpg', 'page': 'index', 'section': 'services_overview', 'subsection': 'financial_services', 'desc': 'Financial Services card image', 'type': 'product', 'alt': 'Financial Services'},
        {'filename': '53397.jpg', 'page': 'index', 'section': 'services_overview', 'subsection': 'training_education', 'desc': 'Training & Education service card image', 'type': 'product', 'alt': 'Training & Education'},
        {'filename': '526297.jpg', 'page': 'index', 'section': 'services_overview', 'subsection': 'supply_chain', 'desc': 'Supply Chain service card image', 'type': 'product', 'alt': 'Supply Chain'},
        
        # About Preview Section
        {'filename': 'our-team-1.jpg', 'page': 'index', 'section': 'about_preview', 'subsection': 'about_africana_ventures', 'desc': 'About Africana Ventures main image showcasing the team', 'type': 'static', 'alt': 'About Africana Ventures'},
        
        # Innovation Section (separate from services)
        {'filename': '101678.jpg', 'page': 'index', 'section': 'innovation', 'subsection': 'smart_agriculture', 'desc': 'Smart Agriculture Technology feature image', 'type': 'product', 'alt': 'Smart Agriculture Technology'},
        {'filename': '113898.jpg', 'page': 'index', 'section': 'innovation', 'subsection': 'market_access', 'desc': 'Market Access feature image', 'type': 'product', 'alt': 'Market Access'},
        {'filename': '141689.jpg', 'page': 'index', 'section': 'solutions', 'subsection': 'hero', 'desc': 'Solutions section hero image', 'type': 'hero', 'alt': 'Agricultural solutions'},
        {'filename': 'our-team-1.jpg', 'page': 'index', 'section': 'team', 'subsection': 'main_photo', 'desc': 'Main team photo for about section', 'type': 'static', 'alt': 'Africana Ventures Team'},
        {'filename': '416769.jpg', 'page': 'index', 'section': 'products', 'subsection': 'horticulture', 'desc': 'Horticulture products showcase', 'type': 'product', 'alt': 'Horticulture Products'},
        {'filename': '526297.jpg', 'page': 'index', 'section': 'products', 'subsection': 'cereals_legumes', 'desc': 'Cereals and legumes showcase', 'type': 'product', 'alt': 'Cereals & Legumes'},
        {'filename': '53396.jpg', 'page': 'index', 'section': 'products', 'subsection': 'oilseeds_nuts', 'desc': 'Oilseeds and nuts showcase', 'type': 'product', 'alt': 'Oilseeds & Nuts'},
        {'filename': '416760.jpg', 'page': 'index', 'section': 'focus', 'subsection': 'block_2', 'desc': 'Core focus area background - coffee/agricultural processing', 'type': 'background', 'alt': 'Agricultural processing'},
        
        # About Page Images
        {'filename': '101678.jpg', 'page': 'about', 'section': 'hero', 'subsection': 'background', 'desc': 'About page hero background via CSS variable', 'type': 'background', 'alt': 'Agricultural landscape'},
        {'filename': '113898.jpg', 'page': 'about', 'section': 'testimonials', 'subsection': 'background', 'desc': 'Testimonials section background with overlay', 'type': 'background', 'alt': 'Agricultural technology'},
        {'filename': '53397.jpg', 'page': 'about', 'section': 'join_us', 'subsection': 'background', 'desc': 'Join us section background via CSS variable', 'type': 'background', 'alt': 'Team collaboration'},
        {'filename': 'contact-bg.jpg', 'page': 'about', 'section': 'contact', 'subsection': 'background', 'desc': 'Contact section background via CSS variable', 'type': 'background', 'alt': 'Contact background'},
        {'filename': 'placeholder-team.jpg', 'page': 'about', 'section': 'team', 'subsection': 'fallback', 'desc': 'Fallback image for team members without photos', 'type': 'static', 'alt': 'Team member placeholder'},
        
        # Contact Page Images
        {'filename': '416767.jpg', 'page': 'contact', 'section': 'hero', 'subsection': 'background', 'desc': 'Contact page hero background with overlay', 'type': 'background', 'alt': 'Farm operations'},
        
        # Products Page Images
        {'filename': 'maize.png', 'page': 'products', 'section': 'hero', 'subsection': 'background', 'desc': 'Products page hero background', 'type': 'background', 'alt': 'Premium Maize'},
        {'filename': 'maize.png', 'page': 'products', 'section': 'product_cards', 'subsection': 'maize', 'desc': 'Premium Maize product card', 'type': 'product', 'alt': 'Premium Maize'},
        {'filename': '113898.jpg', 'page': 'products', 'section': 'product_cards', 'subsection': 'fish', 'desc': 'Fresh Fish product card', 'type': 'product', 'alt': 'Fresh Fish'},
        {'filename': '416760.jpg', 'page': 'products', 'section': 'product_cards', 'subsection': 'coffee', 'desc': 'Premium Coffee product card', 'type': 'product', 'alt': 'Premium Coffee'},
        {'filename': '141689.jpg', 'page': 'products', 'section': 'product_cards', 'subsection': 'vegetables', 'desc': 'Fresh Vegetables product card', 'type': 'product', 'alt': 'Fresh Vegetables'},
    ]
    
    # Check if data already exists
    existing_count = WebsiteImage.query.count()
    if existing_count > 0:
        flash(f'Image data already exists ({existing_count} images). Clear database first if you want to repopulate.', 'warning')
        return redirect(url_for('admin.admin_images'))
    
    # Add initial image records
    added_count = 0
    for img_data in initial_images:
        # Check if file exists
        file_path = os.path.join(current_app.root_path, 'Frontend', 'static', 'images', img_data['filename'])
        if os.path.exists(file_path):
            new_image = WebsiteImage(
                filename=img_data['filename'],
                original_filename=img_data['filename'],
                page_name=img_data['page'],
                section_name=img_data['section'],
                subsection_name=img_data['subsection'],
                description=img_data['desc'],
                alt_text=img_data['alt'],
                image_type=img_data['type'],
                section=img_data['section']  # Legacy compatibility
            )
            db.session.add(new_image)
            added_count += 1
        else:
            flash(f'Warning: File {img_data["filename"]} not found in images directory', 'warning')
    
    try:
        db.session.commit()
        flash(f'Successfully added {added_count} image records to the database!', 'success')
    except Exception as e:
        db.session.rollback()
        flash(f'Error adding image data: {str(e)}', 'error')
    
    return redirect(url_for('admin.admin_images'))

@admin.route('/admin/image/<int:image_id>/toggle', methods=['GET', 'POST'])
@login_required
def toggle_image(image_id):
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    image = WebsiteImage.query.get_or_404(image_id)
    image.is_active = not image.is_active
    db.session.commit()
    
    # Get the return URL parameter or construct default
    return_url = request.args.get('return_url')
    if not return_url:
        # If no return_url provided, try to determine from image page_name
        if image.page_name:
            return_url = url_for('admin.admin_page_photos', page_name=image.page_name)
        else:
            return_url = url_for('admin.admin_images')
    
    flash(f'Image "{image.filename}" {"activated" if image.is_active else "deactivated"} successfully!', 'success')
    return redirect(return_url)

# Team Management Routes

@admin.route('/admin/team', methods=['GET', 'POST'])
@login_required
def admin_team():
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    team_members = TeamMember.query.order_by(TeamMember.display_order, TeamMember.name).all()
    return render_template('admin/team.html', team_members=team_members)

@admin.route('/admin/team/add', methods=['GET', 'POST'])
@login_required
def add_team_member():
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    if request.method == 'POST':
        name = request.form['name']
        position = request.form['position']
        bio = request.form['bio']
        email = request.form['email']
        phone = request.form['phone']
        linkedin = request.form['linkedin']
        twitter = request.form['twitter']
        display_order = request.form.get('display_order', 0)
        
        photo_filename = None
        if 'photo' in request.files:
            file = request.files['photo']
            if file and file.filename != '' and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                photo_filename = f"team_{timestamp}_{filename}"
                file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], photo_filename))
        
        team_member = TeamMember(
            name=name,
            position=position,
            bio=bio,
            photo_filename=photo_filename,
            email=email,
            phone=phone,
            linkedin=linkedin,
            twitter=twitter,
            display_order=display_order
        )
        db.session.add(team_member)
        db.session.commit()
        flash('Team member added successfully!')
        return redirect(url_for('admin.admin_team'))
    
    return render_template('admin/add_team_member.html')

@admin.route('/admin/team/<int:member_id>/edit', methods=['GET', 'POST'])
@login_required
def edit_team_member(member_id):
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    member = TeamMember.query.get_or_404(member_id)
    
    if request.method == 'POST':
        member.name = request.form['name']
        member.position = request.form['position']
        member.bio = request.form['bio']
        member.email = request.form['email']
        member.phone = request.form['phone']
        member.linkedin = request.form['linkedin']
        member.twitter = request.form['twitter']
        member.display_order = request.form.get('display_order', 0)
        
        if 'photo' in request.files:
            file = request.files['photo']
            if file and file.filename != '' and allowed_file(file.filename):
                # Delete old photo if exists
                if member.photo_filename:
                    try:
                        os.remove(os.path.join(current_app.config['UPLOAD_FOLDER'], member.photo_filename))
                    except Exception:
                        pass
                filename = secure_filename(file.filename)
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                member.photo_filename = f"team_{timestamp}_{filename}"
                file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], member.photo_filename))
        
        db.session.commit()
        flash('Team member updated successfully!')
        return redirect(url_for('admin.admin_team'))
    
    return render_template('admin/edit_team_member.html', member=member)

@admin.route('/admin/team/<int:member_id>/delete', methods=['GET', 'POST'])
@login_required
def delete_team_member(member_id):
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    member = TeamMember.query.get_or_404(member_id)
    
    if member.photo_filename:
        try:
            os.remove(os.path.join(current_app.config['UPLOAD_FOLDER'], member.photo_filename))
        except Exception:
            pass
    
    db.session.delete(member)
    db.session.commit()
    flash('Team member deleted successfully!')
    return redirect(url_for('admin.admin_team'))

# Services Management Routes

@admin.route('/admin/services', methods=['GET', 'POST'])
@login_required
def admin_services():
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    services = Service.query.order_by(Service.display_order, Service.title).all()
    return render_template('admin/services.html', services=services)

@admin.route('/admin/services/add', methods=['GET', 'POST'])
@login_required
def add_service():
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    if request.method == 'POST':
        title = request.form['title']
        description = request.form['description']
        icon = request.form['icon']
        display_order = request.form.get('display_order', 0)
        
        image_filename = None
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '' and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                image_filename = f"service_{timestamp}_{filename}"
                file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], image_filename))
        
        service = Service(
            title=title,
            description=description,
            icon=icon,
            image_filename=image_filename,
            display_order=display_order
        )
        db.session.add(service)
        db.session.commit()
        flash('Service added successfully!')
        return redirect(url_for('admin.admin_services'))
    
    return render_template('admin/add_service.html')

@admin.route('/admin/services/<int:service_id>/edit', methods=['GET', 'POST'])
@login_required
def edit_service(service_id):
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    service = Service.query.get_or_404(service_id)
    
    if request.method == 'POST':
        service.title = request.form['title']
        service.description = request.form['description']
        service.icon = request.form['icon']
        service.display_order = request.form.get('display_order', 0)
        
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '' and allowed_file(file.filename):
                if service.image_filename:
                    try:
                        os.remove(os.path.join(current_app.config['UPLOAD_FOLDER'], service.image_filename))
                    except Exception:
                        pass
                filename = secure_filename(file.filename)
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                service.image_filename = f"service_{timestamp}_{filename}"
                file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], service.image_filename))
        
        db.session.commit()
        flash('Service updated successfully!')
        return redirect(url_for('admin.admin_services'))
    
    return render_template('admin/edit_service.html', service=service)

@admin.route('/admin/services/<int:service_id>/delete', methods=['GET', 'POST'])
@login_required
def delete_service(service_id):
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    service = Service.query.get_or_404(service_id)
    
    if service.image_filename:
        try:
            os.remove(os.path.join(current_app.config['UPLOAD_FOLDER'], service.image_filename))
        except Exception:
            pass
    
    db.session.delete(service)
    db.session.commit()
    flash('Service deleted successfully!')
    return redirect(url_for('admin.admin_services'))

# Website Content Management Routes

@admin.route('/admin/content', methods=['GET', 'POST'])
@login_required
def admin_content():
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    content = WebsiteContent.query.order_by(WebsiteContent.section, WebsiteContent.title).all()
    return render_template('admin/content.html', content=content)

@admin.route('/admin/content/edit/<int:content_id>', methods=['GET', 'POST'])
@login_required
def edit_content(content_id):
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    content_item = WebsiteContent.query.get_or_404(content_id)
    
    if request.method == 'POST':
        content_item.content = request.form['content']
        db.session.commit()
        flash('Content updated successfully!')
        return redirect(url_for('admin.admin_content'))
    
    return render_template('admin/edit_content.html', content_item=content_item)

# FAQ Management Routes

@admin.route('/admin/faqs', methods=['GET', 'POST'])
@login_required
def admin_faqs():
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    faqs = FAQ.query.order_by(FAQ.display_order, FAQ.question).all()
    return render_template('admin/faqs.html', faqs=faqs)

@admin.route('/admin/faqs/add', methods=['GET', 'POST'])
@login_required
def add_faq():
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    if request.method == 'POST':
        question = request.form['question']
        answer = request.form['answer']
        category = request.form['category']
        display_order = request.form.get('display_order', 0)
        
        faq = FAQ(
            question=question,
            answer=answer,
            category=category,
            display_order=display_order
        )
        db.session.add(faq)
        db.session.commit()
        flash('FAQ added successfully!')
        return redirect(url_for('admin.admin_faqs'))
    
    return render_template('admin/add_faq.html')

@admin.route('/admin/faqs/<int:faq_id>/edit', methods=['GET', 'POST'])
@login_required
def edit_faq(faq_id):
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    faq = FAQ.query.get_or_404(faq_id)
    
    if request.method == 'POST':
        faq.question = request.form['question']
        faq.answer = request.form['answer']
        faq.category = request.form['category']
        faq.display_order = request.form.get('display_order', 0)
        faq.is_active = 'is_active' in request.form
        
        db.session.commit()
        flash('FAQ updated successfully!')
        return redirect(url_for('admin.admin_faqs'))
    
    return render_template('admin/edit_faq.html', faq=faq)

@admin.route('/admin/faqs/<int:faq_id>/delete', methods=['GET', 'POST'])
@login_required
def delete_faq(faq_id):
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    faq = FAQ.query.get_or_404(faq_id)
    db.session.delete(faq)
    db.session.commit()
    flash('FAQ deleted successfully!')
    return redirect(url_for('admin.admin_faqs'))


# Product Management Routes
@admin.route('/admin/products')
@login_required
def admin_products():
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    products = Product.query.filter_by(is_deleted=False).order_by(Product.category, Product.name).all()
    return render_template('admin/products.html', products=products)

@admin.route('/admin/products/add', methods=['GET', 'POST'])
@login_required
def add_product():
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    categories = ["Horticulture", "Cereals & Legumes", "Oilseeds & Nuts", "Farm Inputs"]
    stock_statuses = ["In Stock", "Out of Stock"]

    if request.method == 'POST':
        name = request.form['name']
        category = request.form['category']
        short_description = request.form['short_description']
        detailed_description = request.form.get('detailed_description')
        price = request.form['price']
        unit_of_measure = request.form['unit_of_measure']
        stock_status = request.form['stock_status']
        
        image_file = request.files.get('image_file')
        
        product_image = None
        if image_file and image_file.filename != '' and allowed_file(image_file.filename):
            from Backend.utils.helpers import save_page_file
            
            # Define page and section for product images
            page_name = 'products'
            section_name = 'product_cards' # Or a more specific section if needed, e.g., category.lower()
            
            base_upload_folder = os.path.join(current_app.root_path, 'Frontend', 'static', 'uploads')
            new_filename, relative_path = save_page_file(
                image_file, 
                base_upload_folder, 
                page_name, 
                section_name, 
                f"{page_name}_{section_name}_{secure_filename(name)}" # Use product name for unique prefix
            )
            
            if new_filename:
                product_image = WebsiteImage(
                    filename=new_filename,
                    original_filename=image_file.filename,
                    relative_path=relative_path,
                    page_name=page_name,
                    section_name=section_name,
                    subsection_name=category_to_slug(category),
                    description=name,
                    alt_text=name,
                    usage_context=short_description,
                    image_type='product',
                    section=section_name, # legacy compatibility
                    display_order=0, # Can be improved later
                    is_active=True
                )
                db.session.add(product_image)
                db.session.flush() # Flush to get product_image.id before committing Product
        
        new_product = Product(
            name=name,
            category=category,
            short_description=short_description,
            detailed_description=detailed_description,
            price=price,
            unit_of_measure=unit_of_measure,
            stock_status=stock_status,
            image=product_image # Link the WebsiteImage object
        )
        
        db.session.add(new_product)
        db.session.commit()
        flash('Product added successfully!', 'success')
        return redirect(url_for('admin.admin_products'))
    
    return render_template('admin/add_product.html', categories=categories, stock_statuses=stock_statuses)

@admin.route('/admin/products/<int:product_id>/edit', methods=['GET', 'POST'])
@login_required
def edit_product(product_id):
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    product = Product.query.filter_by(id=product_id, is_deleted=False).first_or_404()
    categories = ["Horticulture", "Cereals & Legumes", "Oilseeds & Nuts", "Farm Inputs"]
    stock_statuses = ["In Stock", "Out of Stock"]

    if request.method == 'POST':
        product.name = request.form['name']
        product.category = request.form['category']
        product.short_description = request.form['short_description']
        product.detailed_description = request.form.get('detailed_description')
        product.price = request.form['price']
        product.unit_of_measure = request.form['unit_of_measure']
        product.stock_status = request.form['stock_status']
        
        image_file = request.files.get('image_file')
        
        if image_file and image_file.filename != '' and allowed_file(image_file.filename):
            from Backend.utils.helpers import save_page_file
            
            page_name = 'products'
            section_name = 'product_cards'
            
            base_upload_folder = os.path.join(current_app.root_path, 'Frontend', 'static', 'uploads')
            
            # Delete old image if it exists
            if product.image:
                old_file_path = product.image.get_file_path()
                try:
                    if os.path.exists(old_file_path):
                        os.remove(old_file_path)
                    db.session.delete(product.image) # Delete old WebsiteImage record
                except Exception as e:
                    current_app.logger.error(f"Error deleting old product image: {e}")
            
            new_filename, relative_path = save_page_file(
                image_file, 
                base_upload_folder, 
                page_name, 
                section_name, 
                f"{page_name}_{section_name}_{secure_filename(product.name)}"
            )
            
            if new_filename:
                new_product_image = WebsiteImage(
                    filename=new_filename,
                    original_filename=image_file.filename,
                    relative_path=relative_path,
                    page_name=page_name,
                    section_name=section_name,
                    subsection_name=category_to_slug(product.category),
                    description=product.name,
                    alt_text=product.name,
                    usage_context=product.short_description,
                    image_type='product',
                    section=section_name, # legacy compatibility
                    display_order=0,
                    is_active=True
                )
                db.session.add(new_product_image)
                product.image = new_product_image # Link new WebsiteImage object
        
        db.session.commit()
        flash('Product updated successfully!', 'success')
        return redirect(url_for('admin.admin_products'))
    
    return render_template('admin/edit_product.html', product=product, categories=categories, stock_statuses=stock_statuses)

@admin.route('/admin/products/<int:product_id>/delete', methods=['POST'])
@login_required
def delete_product(product_id):
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    product = Product.query.filter_by(id=product_id, is_deleted=False).first_or_404()
    
    # Delete associated image if it exists
    if product.image:
        file_path = product.image.get_file_path()
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
            db.session.delete(product.image) # Delete WebsiteImage record
        except Exception as e:
            current_app.logger.error(f"Error deleting product image file: {e}")
            
    product.is_deleted = True
    db.session.commit()
    flash('Product deleted successfully!', 'success')
    return redirect(url_for('admin.admin_products'))

# Enhanced Image Management

# Enhanced Image Management

@admin.route('/admin/upload_image', methods=['GET', 'POST'])
@login_required
def upload_image():
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    if 'image' not in request.files:
        flash('No file selected')
        return redirect(url_for('admin.admin_images'))
    
    file = request.files['image']
    section = request.form['section']
    description = request.form.get('description', '')
    alt_text = request.form.get('alt_text', '')
    display_order = request.form.get('display_order', 0)
    is_featured = 'is_featured' in request.form
    
    # Check if page_name is provided for organized structure
    page_name = request.form.get('page_name', '')
    section_name = request.form.get('section_name', section)  # Use section_name if provided, otherwise use legacy section
    
    if file.filename == '':
        flash('No file selected')
        return redirect(url_for('admin.admin_images'))
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        if page_name and section_name:
            # Use organized folder structure
            new_filename = f"{page_name}_{section_name}_{timestamp}_{filename}"
            uploads_dir = os.path.join(current_app.root_path, 'Frontend', 'static', 'uploads', page_name, section_name)
            os.makedirs(uploads_dir, exist_ok=True)
            file_path = os.path.join(uploads_dir, new_filename)
            file.save(file_path)
            relative_path = f"{page_name}/{section_name}/{new_filename}"
        else:
            # Use legacy system for compatibility
            new_filename = f"{section}_{timestamp}_{filename}"
            file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], new_filename))
            relative_path = None
        
        image = WebsiteImage(
            filename=new_filename,
            original_filename=file.filename,
            relative_path=relative_path,
            page_name=page_name or '',
            section_name=section_name or '',
            section=section,
            description=description,
            alt_text=alt_text,
            display_order=display_order,
            is_featured=is_featured
        )
        db.session.add(image)
        db.session.commit()
        flash('Image uploaded successfully!')
    else:
        flash('Invalid file type')
    
    return redirect(url_for('admin.admin_images'))



from datetime import datetime

@admin.route('/admin/change-password', methods=['GET', 'POST'])
@login_required
def change_admin_password():
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    if request.method == 'POST':
        current_password = request.form['current_password']
        new_password = request.form['new_password']
        confirm_password = request.form['confirm_password']
        
        # Verify current password
        if not check_password_hash(current_user.password_hash, current_password):
            flash('Current password is incorrect', 'danger')
            return redirect(url_for('admin.change_admin_password'))
        
        # Verify new password matches confirmation
        if new_password != confirm_password:
            flash('New passwords do not match', 'danger')
            return redirect(url_for('admin.change_admin_password'))
        
        # Update password
        from werkzeug.security import generate_password_hash
        current_user.password_hash = generate_password_hash(new_password)
        db.session.commit()
        
        flash('Password changed successfully', 'success')
        return redirect(url_for('admin.admin_dashboard'))
    
    return render_template('admin/change_password.html')

# Page-wise Photo Management Routes

@admin.route('/admin/pages')
@login_required
def admin_pages():
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    # Get page statistics
    page_stats = {}
    pages = ['index', 'about', 'services', 'contact', 'solutions']
    
    for page in pages:
        images = WebsiteImage.query.filter_by(page_name=page).all()
        page_stats[page] = {
            'total_images': len(images),
            'active_images': len([img for img in images if img.is_active]),
            'featured_images': len([img for img in images if img.is_featured]),
            'sections': list(set([img.section_name for img in images if img.section_name]))
        }
    
    return render_template('admin/pages.html', page_stats=page_stats, pages=pages)

@admin.route('/admin/pages/<page_name>')
@login_required
def admin_page_photos(page_name):
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    # Validate page name
    valid_pages = ['index', 'about', 'services', 'products', 'contact', 'solutions', 'base']
    if page_name not in valid_pages:
        flash(f'Invalid page: {page_name}', 'error')
        return redirect(url_for('admin.admin_pages'))
    
    # Redirect products page photos to Admin Products to avoid duplicate management
    if page_name == 'products':
        flash('Manage product cards in Products. Page Photos for products has been consolidated.', 'info')
        return redirect(url_for('admin.admin_products'))

    # Get images for this page
    images = WebsiteImage.query.filter_by(page_name=page_name).filter(WebsiteImage.image_type != 'product').order_by(
        WebsiteImage.section_name, WebsiteImage.display_order, WebsiteImage.created_at.desc()
    ).all()
    
    # Group images by section
    sections = {}
    for image in images:
        section = image.section_name or 'uncategorized'
        if page_name == 'products' and section != 'product_cards':
            continue # Only show product_cards for products page
        if section not in sections:
            sections[section] = []
        sections[section].append(image)
    
    return render_template('admin/page_photos.html', 
                         page_name=page_name, 
                         images=images, 
                         sections=sections)

@admin.route('/admin/pages/<page_name>/upload', methods=['GET', 'POST'])
@login_required
def upload_page_photo(page_name):
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    # Validate page name
    valid_pages = ['index', 'about', 'services', 'products', 'contact', 'solutions', 'base']
    if page_name not in valid_pages:
        flash(f'Invalid page: {page_name}', 'error')
        return redirect(url_for('admin.admin_pages'))
    
    # For products page, disallow uploads here and point to Products management
    if page_name == 'products':
        flash('Upload product photos via Products → Add Product to keep data consistent.', 'info')
        return redirect(url_for('admin.admin_products'))

    if request.method == 'POST':
        title = request.form['title']
        section_name = request.form['section_name']
        subsection_name = request.form.get('subsection_name', '')
        description = request.form['description']
        alt_text = request.form.get('alt_text', '')
        usage_context = request.form.get('usage_context', '')
        image_type = request.form.get('image_type', 'static') # Changed to .get with default
        display_order = int(request.form.get('display_order', 0))
        is_featured = 'is_featured' in request.form
        is_active = 'is_active' in request.form
        
        # Specific validation for products page images
        if page_name == 'products':
            if section_name != 'product_cards':
                flash('For products page, section must be \'product_cards\'.', 'error')
                return redirect(request.url)
            if image_type != 'product':
                flash('For products page images, type must be \'product\'.', 'error')
                return redirect(request.url)
        
        if 'image_file' in request.files:
            file = request.files['image_file']
            if file and file.filename != '' and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                new_filename = f"{page_name}_{section_name}_{timestamp}_{filename}"
                
                # Create organized folder structure
                uploads_dir = os.path.join(current_app.root_path, 'Frontend', 'static', 'uploads', page_name, section_name)
                os.makedirs(uploads_dir, exist_ok=True)
                
                # Save file to organized location
                file_path = os.path.join(uploads_dir, new_filename)
                file.save(file_path)
                
                # Set relative path for organized structure
                relative_path = f"{page_name}/{section_name}/{new_filename}"
                
                # Create new WebsiteImage record
                new_image = WebsiteImage(
                    filename=new_filename,
                    original_filename=file.filename,
                    relative_path=relative_path,
                    page_name=page_name,
                    section_name=section_name,
                    subsection_name=subsection_name,
                    description=description,
                    alt_text=alt_text,
                    usage_context=usage_context,
                    image_type=image_type,
                    display_order=display_order,
                    is_featured=is_featured,
                    is_active=is_active, # Added is_active
                    file_size=len(file.read()),
                    section=section_name  # For legacy compatibility
                )
                
                # Reset file pointer after reading for size
                file.seek(0)
                
                db.session.add(new_image)
                db.session.commit()
                flash('Image uploaded successfully!', 'success')
                return redirect(url_for('admin.admin_page_photos', page_name=page_name))
            else:
                flash('Please select a valid image file.', 'error')
    
    # GET request - show upload form
    if page_name == 'products':
        sections = ['product_cards']
    else:
        existing_sections = db.session.query(WebsiteImage.section_name).filter_by(page_name=page_name).distinct().all()
        sections = [s[0] for s in existing_sections if s[0]]
    
    return render_template('admin/upload_page_photo.html', 
                         page_name=page_name, 
                         sections=sections)

# Section Migration Utility Route
@admin.route('/admin/migrate-sections')
@login_required
def migrate_sections():
    """Utility route to migrate existing image sections to match frontend template structure"""
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    # Define section mappings from old names to new names based on frontend analysis
    section_migrations = {
        # Index page migrations
        'services': 'services_overview',
        'about': 'about_preview',
        'core_focus': 'core_focus_areas',
        'cta': 'cta_support',
        'stories': 'stories_insights',
        'contact': 'contact_form',
        
        # About page migrations
        'journey': 'our_story',
        
        # Services page migrations
        'hero': 'hero_slideshow',  # Only for services page
        'process': 'process_steps',
        
        # Products page migrations
        'categories': 'category_filters',
        'features': 'product_badges',
        
        # Contact page migrations
        'location': 'contact_cards',
        'info': 'office_hours',
        
        # Solutions page migrations
        'solutions': 'core_solutions',
        'benefits': 'value_addition',
        
        # Base/navigation migrations
        'global': 'global'
    }
    
    migrations_performed = 0
    
    for old_section, new_section in section_migrations.items():
        images_to_update = WebsiteImage.query.filter_by(section_name=old_section).all()
        
        for image in images_to_update:
            # Special handling for hero -> hero_slideshow (only for services page)
            if old_section == 'hero' and image.page_name != 'services':
                continue
                
            image.section_name = new_section
            # Also update the legacy section field for compatibility
            image.section = new_section
            migrations_performed += 1
    
    if migrations_performed > 0:
        db.session.commit()
        flash(f'Successfully migrated {migrations_performed} image section names to match frontend templates!', 'success')
    else:
        flash('No sections needed migration.', 'info')
    
    return redirect(url_for('admin.admin_pages'))