# Frontend Page Section Mapping

This document maps the actual sections found in frontend templates to ensure consistency in the photo management system.

## Index Page (index.html)

### Main Sections:
- **hero**: Hero Section with 3 rotating video backgrounds and curtain slide transitions
- **services_overview**: Services Overview with flowing cards (Agricultural Technology, Market Access, Financial Services, Training & Education, Supply Chain)
- **about_preview**: About Us preview section
- **core_focus_areas**: Core Focus Areas with 7 interactive blocks
- **impact_projects**: Impact Projects section with community-driven project showcases
- **faq**: FAQ Section with 4 question cards
- **cta_support**: Call to Action - Support Us section with donation stats
- **stories_insights**: Stories & Insights with 3 story cards (Climate, Community, Technology)
- **contact_form**: Contact Form Section

### Common Subsections:
- **hero**: video_1, video_2, video_3 (rotating backgrounds), slide_indicators, curtain_transitions
- **services_overview**: agricultural_technology, market_access, financial_services, training_education, supply_chain
- **about_preview**: about_africana_ventures (team image and company description)
- **core_focus_areas**: block_1 (Agri-Marketplace Platform), block_2 (Smart Logistics & Distribution), block_3 (Advisory & Consulting), block_4 (Access to Inputs & Finance), block_5 (Training & Capacity Building), block_6 (Data & Traceability), block_7 (Value Addition & Processing)
- **stories_insights**: story_1_climate, story_2_community, story_3_technology
- **floating_elements**: background_patterns, glassmorphism_effects

## About Page (about.html)

### Main Sections:
- **hero**: Hero Section
- **our_story**: Our Story/Journey section
- **principles**: Our Principles with 6 principle cards with floating animations
- **impact_timeline**: Impact Timeline with animated timeline items
- **team**: Our Team section
- **business_model**: Business Model cards
- **advantages**: Our Advantages section
- **testimonials**: Testimonials carousel
- **join_us**: Join Us section
- **contact**: Contact section

### Common Subsections:
- **principles**: principle_1, principle_2, principle_3, principle_4, principle_5, principle_6
- **timeline**: timeline_item_1, timeline_item_2, timeline_item_3
- **team**: team_member_photos, team_backgrounds
- **testimonials**: testimonial_1, testimonial_2, testimonial_3, testimonial_navigation

## Services Page (services.html)

### Main Sections:
- **hero_slideshow**: Hero Section with 3-slide carousel
- **methodology_infographic**: Methodology Infographic section with 8-step framework
- **process_steps**: Process Steps (Assessment & Planning, Implementation, etc.)
- **service_cards**: Individual service showcases
- **implementation**: Implementation details
- **background_patterns**: Background patterns and floating elements

### Common Subsections:
- **hero_slideshow**: slide_1_innovation, slide_2_marketplace, slide_3_data_advisory
- **process_steps**: step_1_assessment, step_2_implementation, step_3_monitoring, etc.
- **methodology**: framework_cards, infographic_elements

## Products Page (products.html)

### Main Sections:
- **hero**: Hero Section
- **category_filters**: Category filter buttons (All Products, Fresh Produce, Processed Foods, Farm Inputs)
- **product_cards**: Product showcase cards
- **fresh_produce**: Fresh produce category (Maize, Fresh Fish, Vegetables)
- **processed_foods**: Processed foods category (Coffee, etc.)
- **farm_inputs**: Farm inputs category (Seeds, Tools, Fertilizers)
- **product_badges**: Product badges and quality labels

### Common Subsections:
- **product_cards**: maize_card, fish_card, coffee_card, vegetables_card, inputs_card
- **badges**: premium_grade, export_quality, non_gmo, organic, fair_trade
- **categories**: fresh_filter, processed_filter, inputs_filter

## Contact Page (contact.html)

### Main Sections:
- **hero**: Hero Section
- **contact_form**: Detailed contact form section
- **contact_cards**: Contact information cards (Phone, Email, Location)
- **office_hours**: Office Hours & Additional Information
- **contact_methods**: Multiple ways to connect

### Common Subsections:
- **contact_form**: form_fields, service_selection, submit_button
- **contact_cards**: phone_card, email_card, location_card
- **contact_info**: office_hours, business_info

## Solutions Page (solutions.html)

### Main Sections:
- **hero**: Hero Section
- **core_solutions**: Core Solutions Grid with 7 solution cards
- **agri_marketplace**: Agri-Marketplace Platform solution
- **smart_logistics**: Smart Logistics & Distribution solution
- **advisory_consulting**: Advisory & Consulting solution
- **input_finance**: Input Access & Agri-Finance solution
- **training_capacity**: Training & Capacity Building solution
- **data_iot**: Data, IoT & Traceability solution
- **value_addition**: Value Addition & Processing solution

### Common Subsections:
- **solution_cards**: marketplace_card, logistics_card, advisory_card, finance_card, training_card, iot_card, processing_card
- **glassmorphism**: card_backgrounds, hover_effects

## Base/Navigation (base.html)

### Main Sections:
- **navigation**: Main navigation bar
- **header**: Header elements and branding
- **footer**: Footer sections
- **global**: Global elements used across all pages

### Common Subsections:
- **navigation**: nav_logo, nav_menu, nav_mobile, nav_buttons
- **header**: site_branding, global_header
- **footer**: footer_links, footer_social, footer_contact
- **global**: loading_screens, scroll_indicators, background_elements

## Image Type Categories

### By Function:
- **hero**: Large background images, video fallbacks
- **background**: Section backgrounds, overlay images
- **product**: Product photos, feature showcases
- **static**: Fixed content images
- **dynamic**: Slideshow, carousel images

### By Section:
- **navigation**: Logos, icons, branding elements
- **content**: Section-specific images
- **decoration**: Floating elements, patterns, glassmorphism effects
- **interactive**: Hover states, animation elements

## Naming Conventions

### File Naming:
- `{page}_{section}_{subsection}_{type}_{number}.{ext}`
- Example: `index_hero_video_background_1.mp4`
- Example: `about_team_member_photo_1.jpg`
- Example: `services_methodology_step_illustration_2.png`

### Database Fields:
- **page_name**: index, about, services, products, contact, solutions, base
- **section_name**: Use main section names from this mapping
- **subsection_name**: Use subsection names or custom descriptors
- **image_type**: hero, background, product, static, dynamic
- **usage_context**: Additional context about where/how the image is used

This mapping ensures consistency between the frontend templates and the photo management system, making it easy for administrators to organize and manage images according to the actual page structure.