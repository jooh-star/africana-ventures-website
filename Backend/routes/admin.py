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
import os
from werkzeug.utils import secure_filename
from datetime import datetime
from Backend.utils.helpers import allowed_file, save_uploaded_file
from sqlalchemy import text

admin = Blueprint('admin', __name__)

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
    
    images = WebsiteImage.query.order_by(WebsiteImage.created_at.desc()).all()
    return render_template('admin/images.html', images=images)

@admin.route('/admin/image/<int:image_id>/delete', methods=['GET', 'POST'])
@login_required
def delete_image(image_id):
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    image = WebsiteImage.query.get_or_404(image_id)
    
    # Delete file
    try:
        os.remove(os.path.join(current_app.config['UPLOAD_FOLDER'], image.filename))
    except Exception:
        pass
    
    db.session.delete(image)
    db.session.commit()
    flash('Image deleted successfully!')
    return redirect(url_for('admin.admin_images'))

@admin.route('/admin/image/<int:image_id>/toggle', methods=['GET', 'POST'])
@login_required
def toggle_image(image_id):
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    image = WebsiteImage.query.get_or_404(image_id)
    image.is_active = not image.is_active
    db.session.commit()
    flash(f'Image {"activated" if image.is_active else "deactivated"} successfully!')
    return redirect(url_for('admin.admin_images'))

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
    
    if file.filename == '':
        flash('No file selected')
        return redirect(url_for('admin.admin_images'))
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{section}_{timestamp}_{filename}"
        file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
        
        image = WebsiteImage(
            filename=filename,
            original_filename=file.filename,
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

@admin.route('/admin/image/<int:image_id>/edit', methods=['GET', 'POST'])
@login_required
def edit_image(image_id):
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
    image = WebsiteImage.query.get_or_404(image_id)
    
    if request.method == 'POST':
        image.section = request.form['section']
        image.description = request.form.get('description', '')
        image.alt_text = request.form.get('alt_text', '')
        image.display_order = request.form.get('display_order', 0)
        image.is_active = 'is_active' in request.form
        image.is_featured = 'is_featured' in request.form
        
        db.session.commit()
        flash('Image updated successfully!')
        return redirect(url_for('admin.admin_images'))
    
    return render_template('admin/edit_image.html', image=image)

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