from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app
from Backend.models import db
from Backend.models.content import Contact, Testimonial, WebsiteContent, Service, CompanyInfo, TeamMember, WebsiteImage
import os
from werkzeug.utils import secure_filename
from datetime import datetime
from Backend.utils.helpers import allowed_file
from itertools import groupby
from operator import attrgetter

main = Blueprint('main', __name__)

@main.route('/')
def index():
    services = Service.query.filter_by(is_active=True).order_by(Service.display_order).limit(3).all()
    testimonials = Testimonial.query.filter_by(is_approved=True).order_by(Testimonial.created_at.desc()).limit(3).all()
    company_info = CompanyInfo.query.first()
    about_content = WebsiteContent.query.filter_by(section='about').first()
    hero_images = WebsiteImage.query.filter_by(section='hero', is_active=True).order_by(WebsiteImage.is_featured.desc(), WebsiteImage.display_order, WebsiteImage.created_at.desc()).all()
    gallery_images = WebsiteImage.query.filter_by(section='gallery', is_active=True).order_by(WebsiteImage.display_order, WebsiteImage.created_at.desc()).all()
    
    # Organize images by section and subsection for easy template access
    admin_images = {}
    all_images = WebsiteImage.query.filter_by(is_active=True).all()
    for img in all_images:
        section = img.section_name or img.section  # Support both new and legacy field names
        subsection = img.subsection_name or 'default'
        if section not in admin_images:
            admin_images[section] = {}
        if subsection not in admin_images[section]:
            admin_images[section][subsection] = []
        admin_images[section][subsection].append(img)
    
    return render_template('index.html', 
                           services=services, 
                           testimonials=testimonials,
                           company_info=company_info,
                           about_content=about_content,
                           hero_images=hero_images,
                           gallery_images=gallery_images,
                           admin_images=admin_images)

@main.route('/about')
def about_page():
    team_members = TeamMember.query.filter_by(is_active=True).order_by(TeamMember.display_order).all()
    about_content = WebsiteContent.query.filter_by(section='about').first()
    mission = WebsiteContent.query.filter_by(section='mission').first()
    vision = WebsiteContent.query.filter_by(section='vision').first()
    company_info = CompanyInfo.query.first()
    about_images = WebsiteImage.query.filter_by(section='about', is_active=True).order_by(WebsiteImage.display_order, WebsiteImage.created_at.desc()).all()
    testimonials = Testimonial.query.filter_by(is_approved=True).order_by(Testimonial.created_at.desc()).limit(6).all()


    if not team_members:
        team_members = [
            TeamMember(name='John Doe', position='CEO', bio='Lorem ipsum dolor sit amet, consectetur adipiscing elit.', photo_filename='our-team-1.jpg', linkedin='#', twitter='#', email='john.doe@example.com'),
            TeamMember(name='Jane Smith', position='CTO', bio='Lorem ipsum dolor sit amet, consectetur adipiscing elit.', photo_filename='our-team-2.jpg', linkedin='#', twitter='#', email='jane.smith@example.com'),
            TeamMember(name='Peter Jones', position='COO', bio='Lorem ipsum dolor sit amet, consectetur adipiscing elit.', photo_filename='our-team-3.jpg', linkedin='#', twitter='#', email='peter.jones@example.com')
        ]

    if not testimonials:
        testimonials = [
            Testimonial(name='Sarah Lee', location='Kenya', title='Farmer', testimonial='Lorem ipsum dolor sit amet, consectetur adipiscing elit.', photo_filename='101678.jpg'),
            Testimonial(name='David Chen', location='Tanzania', title='Entrepreneur', testimonial='Lorem ipsum dolor sit amet, consectetur adipiscing elit.', photo_filename='113898.jpg'),
            Testimonial(name='Maria Garcia', location='Uganda', title='Co-op Leader', testimonial='Lorem ipsum dolor sit amet, consectetur adipiscing elit.', photo_filename='141689.jpg')
        ]

    # Get the specific hero image for the about page
    hero_image = WebsiteImage.query.filter_by(
        page_name='about', 
        section_name='hero', 
        is_active=True
    ).order_by(WebsiteImage.created_at.desc()).first()
    
    # Organize admin images for the about page
    admin_images = {}
    all_images = WebsiteImage.query.filter_by(is_active=True).all()
    for img in all_images:
        section = img.section_name or img.section  # Support both new and legacy field names
        subsection = img.subsection_name or 'default'
        if section not in admin_images:
            admin_images[section] = {}
        if subsection not in admin_images[section]:
            admin_images[section][subsection] = []
        admin_images[section][subsection].append(img)

    return render_template('about.html', 
                           team_members=team_members,
                           about_content=about_content,
                           mission=mission,
                           vision=vision,
                           company_info=company_info,
                           testimonials=testimonials,
                           hero_image=hero_image,
                           admin_images=admin_images)

@main.route('/services')
def services_page():
    services = Service.query.filter_by(is_active=True).order_by(Service.display_order).all()
    company_info = CompanyInfo.query.first()
    services_images = WebsiteImage.query.filter_by(section='services', is_active=True).order_by(WebsiteImage.display_order, WebsiteImage.created_at.desc()).all()
    testimonials = Testimonial.query.filter_by(is_approved=True).order_by(Testimonial.created_at.desc()).limit(6).all()

    # Predefined services content (titles and descriptions)
    default_services = [
        {
            'title': 'Smart Logistics & Distribution',
            'short_description': 'Efficient farm-to-market transport networks using intelligent routing and real-time tracking.',
            'description': 'Efficient farm-to-market transport networks using intelligent routing, cold-chain support, and real-time tracking to ensure fresh produce reaches markets on time with minimum post-harvest loss.'
        },
        {
            'title': 'Agri-Marketplace Platform',
            'short_description': 'A digital trading platform connecting smallholder farmers directly with buyers and processors.',
            'description': 'A digital trading platform connecting smallholder farmers directly with buyers, processors, wholesalers, and exporters — enabling transparent pricing, secure payments, and wider market access.'
        },
        {
            'title': 'Advisory & Consulting Services',
            'short_description': 'Expert guidance on Good Agricultural Practices (GAP), export compliance, and market intelligence.',
            'description': 'Expert guidance on Good Agricultural Practices (GAP), export compliance & certification, climate-smart farming, and market intelligence and forecasting.'
        },
        {
            'title': 'Access to Inputs & Financing',
            'short_description': 'Linking farmers to trusted input suppliers and micro-financing partners for affordable inputs and credit.',
            'description': 'Linking farmers to trusted input suppliers (seeds, fertilizers, equipment) and micro-financing partners for affordable inputs and short-term credit.'
        },
        {
            'title': 'Training & Capacity Building',
            'short_description': 'Tailored training on digital agriculture tools, post-harvest handling, and business mindset.',
            'description': 'Equipping farmers with modern agricultural techniques, business management skills, and sustainable practices through comprehensive training programs and workshops.'
        },
        {
            'title': 'Data, Analytics & Traceability',
            'short_description': 'Collecting farm-level data for insights and providing traceability services for local and export markets.',
            'description': 'IoT, satellite, and field reporting tools collect farm-level data for insights and provide traceability services for local and export markets.'
        },
        {
            'title': 'Value-Addition & Processing Linkages',
            'short_description': 'Connecting farmers to aggregation centers and processing facilities for improved quality and higher prices.',
            'description': 'Connecting farmers to aggregation centers and processing facilities for improved quality, grading, packaging, and preservation to fetch higher prices.'
        }
    ]

    # Map existing Service rows by lowercased title to image filename (admin can upload/select per service)
    service_title_to_image = {}
    for s in services:
        if s.title:
            key = s.title.strip().lower()
            if s.image_filename:
                service_title_to_image[key] = s.image_filename

    # Build preset_services with associated images chosen by admin if available
    preset_services = []
    for idx, ds in enumerate(default_services):
        image_filename = service_title_to_image.get(ds['title'].strip().lower())
        if not image_filename and idx < len(services_images):
            image_filename = services_images[idx].filename
        preset_services.append({
            'title': ds['title'],
            'description': ds['description'],
            'image_filename': image_filename
        })

    expertise_nodes = [
        {
            'title': 'Agri-Marketplace Platform',
            'description': 'A digital trading platform connecting smallholder farmers directly with buyers, processors, wholesalers, and exporters — enabling transparent pricing, secure payments, and wider market access. Acting as an intermediary between producers and consumers to bridge the gap between local farmers and global buyers.',
            'image_filename': '416767.jpg' # Market Access
        },
        {
            'title': 'Smart Logistics & Distribution',
            'description': 'Efficient farm-to-market transport networks using intelligent routing, cold-chain support, and real-time tracking to ensure fresh produce reaches markets on time with minimum post-harvest loss. Leveraging advanced digital platforms and AI-powered analytics to streamline the movement of agricultural produce from farm to market.',
            'image_filename': '416769.jpg' # Sustainable Farming
        },
        {
            'title': 'Value-Added Services',
            'description': 'Data analytics, agricultural advisory, and agri-financing solutions to optimize farming operations and improve productivity. Offering insights into market trends, crop performance, and expert advice on improving agricultural practices.',
            'image_filename': '416770.jpg' # Value Chain Optimization
        },
        {
            'title': 'B2B Partnerships',
            'description': 'Strategic collaborations with wholesalers, retailers, and exporters to expand market reach and facilitate large-scale distribution. Partnerships key to expanding market access, enabling products to be sold on a larger scale.',
            'image_filename': '526297.jpg' # Climate Resilience
        },
        {
            'title': 'Training & Capacity Building',
            'description': 'Equipping farmers with modern agricultural techniques, business management skills, and sustainable practices through comprehensive training programs. Direct engagement with smallholder farmers to ensure equitable compensation and tailored solutions.',
            'image_filename': '53397.jpg' # Digital Agriculture
        },
        {
            'title': 'Sustainable Agriculture',
            'description': 'Promoting eco-friendly farming practices that protect soil health and biodiversity while increasing yields through climate-smart techniques. Emphasizing sustainable farming practices that protect natural resources for future generations.',
            'image_filename': '53401.jpg' # Community Empowerment
        }
    ]

    return render_template('services.html', preset_services=preset_services, company_info=company_info, services_images=services_images, testimonials=testimonials, expertise_nodes=expertise_nodes)

@main.route('/solutions')
def solutions_page():
    return render_template('solutions.html')

@main.route('/products')
def products_page():
    """Products page showcasing agricultural products."""
    # Get company info for the page
    company_info = CompanyInfo.query.first()
    
    # Get product-related images from the database
    product_images = WebsiteImage.query.filter_by(section='products', is_active=True).order_by(WebsiteImage.display_order, WebsiteImage.created_at.desc()).all()
    
    return render_template('products.html', 
                           company_info=company_info,
                           product_images=product_images)

@main.route('/contact', methods=['GET', 'POST'])
def contact_page():
    if request.method == 'POST':
        contact = Contact(
            first_name=request.form['first_name'],
            last_name=request.form['last_name'],
            email=request.form['email'],
            phone=request.form.get('phone', ''),
            company=request.form.get('company', ''),
            service=request.form['service'],
            message=request.form['message']
        )
        db.session.add(contact)
        db.session.commit()
        flash('Thank you for your message! We will get back to you soon.', 'success')
        return redirect(url_for('main.contact_page'))
    
    services = Service.query.filter_by(is_active=True).all()
    company_info = CompanyInfo.query.first()
    contact_images = WebsiteImage.query.filter_by(section='contact', is_active=True).order_by(WebsiteImage.display_order, WebsiteImage.created_at.desc()).all()
    return render_template('contact.html', services=services, company_info=company_info, contact_images=contact_images)

@main.route('/gallery')
def gallery_page():
    # Get all active images
    all_images = WebsiteImage.query.filter_by(is_active=True).order_by(
        WebsiteImage.section,
        WebsiteImage.display_order,
        WebsiteImage.created_at.desc()
    ).all()
    
    # Group images by section
    images_by_section = {}
    for section, images in groupby(all_images, attrgetter('section')):
        images_by_section[section] = list(images)
    
    company_info = CompanyInfo.query.first()
    return render_template('gallery.html', 
                          images_by_section=images_by_section,
                          company_info=company_info)

@main.route('/submit-testimonial', methods=['POST'])
def submit_testimonial():
    name = request.form['name']
    location = request.form['location']
    title = request.form.get('title', '')
    testimonial_text = request.form['testimonial']
    rating = int(request.form.get('rating', 5))
    
    photo_filename = None
    if 'photo' in request.files:
        photo = request.files['photo']
        if photo.filename != '':
            if photo and allowed_file(photo.filename):
                filename = secure_filename(photo.filename)
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                photo_filename = f"testimonial_{timestamp}_{filename}"
                photo.save(os.path.join(current_app.config['UPLOAD_FOLDER'], photo_filename))
    
    testimonial = Testimonial(
        name=name,
        location=location,
        title=title,
        testimonial=testimonial_text,
        photo_filename=photo_filename,
        rating=rating,
        is_approved=False  # Requires admin approval
    )
    
    db.session.add(testimonial)
    db.session.commit()
    
    flash('Thank you for your testimonial! It will be reviewed and published soon.', 'success')
    return redirect(url_for('main.index'))