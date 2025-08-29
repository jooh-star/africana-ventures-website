# 📁 Organized Upload Folder Structure Guide

## 🎯 Overview

Your website now has a fully organized folder structure for managing photos. Each page has its own dedicated folder with section-specific subfolders, making it easy to maintain and locate images.

## 📂 Folder Structure

```
Frontend/static/uploads/
├── index/                    # Homepage images
│   ├── hero/                 # Hero section backgrounds
│   ├── services_overview/    # Services overview section images  
│   ├── about_preview/        # About preview section
│   ├── products/            # Products showcase
│   ├── core_focus_areas/    # Core focus areas section
│   ├── impact_projects/     # Impact projects section
│   ├── faq/                 # FAQ section images
│   ├── support/             # Support section
│   ├── stories/             # Stories section
│   └── contact/             # Contact section
│
├── about/                   # About page images
│   ├── hero/                # Hero background
│   ├── story/               # Our story section
│   ├── mission_vision/      # Mission & vision cards
│   ├── values/              # Core values section
│   ├── team/                # Team member photos
│   ├── statistics/          # Statistics section
│   ├── principles/          # Principles section
│   ├── partners/            # Partners & supporters
│   ├── testimonials/        # Testimonials section
│   └── join_us/             # Join us section
│
├── services/                # Services page images
│   ├── hero/                # Hero background
│   ├── methodology/         # Methodology section
│   ├── process/             # Process framework
│   ├── showcase/            # Service showcase cards
│   ├── expertise/           # Expertise nodes
│   └── testimonials/        # Testimonials section
│
├── products/                # Products page images
│   ├── hero/                # Hero background
│   ├── categories/          # Category filters
│   ├── horticulture/        # Horticulture products
│   ├── cereals_legumes/     # Cereals & legumes
│   ├── oilseeds_nuts/       # Oilseeds & nuts
│   └── gallery/             # Product gallery
│
├── contact/                 # Contact page images
│   ├── hero/                # Hero background
│   ├── form/                # Form section
│   ├── info/                # Contact information
│   ├── location/            # Location images
│   └── social/              # Social media section
│
├── solutions/               # Solutions page images
│   ├── hero/                # Hero background
│   ├── core_solutions/      # Core solutions grid
│   ├── marketplace/         # Agri-marketplace
│   ├── logistics/           # Smart logistics
│   ├── advisory/            # Advisory & consulting
│   ├── finance/             # Input access & finance
│   ├── training/            # Training & capacity building
│   ├── data/                # Data & traceability
│   └── value_addition/      # Value addition & processing
│
└── base/                    # Global/shared images
    ├── logos/               # Site logos
    ├── navigation/          # Navigation elements
    ├── footer/              # Footer elements
    └── global/              # Global backgrounds/patterns
```

## 🚀 How to Upload Photos (Admin Guide)

### Step 1: Access Admin Panel
1. Go to `/admin/pages`
2. Login with admin credentials

### Step 2: Select Page
Click on the page you want to manage:
- **Index** (Homepage)
- **About** (About page)
- **Services** (Services page)
- **Products** (Products page)
- **Contact** (Contact page)
- **Solutions** (Solutions page)

### Step 3: Upload Photo
1. Click "Upload New Photo" or the "+" button
2. Fill in the form:
   - **Photo Title**: Descriptive name
   - **Section Name**: Choose from available sections (see structure above)
   - **Subsection Name**: Specific element (optional but recommended)
   - **Description**: What the image is for
   - **Alt Text**: Accessibility description
3. Select your image file
4. Click "Upload Photo"

## 🎯 Section Mapping for Admin-Managed Areas

### Index Page (Homepage)
- **Section 2**: `services_overview` → Subsections: `agricultural_technology`, `market_access`, `financial_services`, `training_education`, `supply_chain`
- **Section 3**: `about_preview` → Subsections: `about`, `team`
- **Section 4**: `products` → Subsections: `horticulture`, `cereals_legumes`, `oilseeds_nuts`
- **Section 5**: `core_focus_areas` → Subsections: `marketplace`, `logistics`, `advisory`, `finance`, `training`, `data`, `value_addition`

### About Page
- **Hero Background**: `hero` → Subsection: `background`
- **Partners Section**: `partners` → Subsections: `partners_supporters`, `logos`

## 🔄 Automatic File Organization

When you upload a photo:
1. **File Naming**: Automatically timestamped (e.g., `index_hero_20250828_194500_myimage.jpg`)
2. **Folder Creation**: Automatically placed in correct folder (e.g., `uploads/index/hero/`)
3. **Database Entry**: Records page, section, and file path
4. **Website Display**: Immediately available on the website

## 💡 Benefits of This System

### For Admins:
- ✅ **Easy Organization**: Know exactly where each image belongs
- ✅ **No Technical Skills Required**: Upload through simple web interface
- ✅ **Instant Updates**: Changes appear immediately on website
- ✅ **File Management**: Easy to find and replace images

### For Developers:
- ✅ **Clean Structure**: Organized, maintainable file system
- ✅ **Scalable**: Easy to add new pages/sections
- ✅ **Automated**: No manual file management needed
- ✅ **Fallback Support**: Graceful degradation if images missing

### For Website Performance:
- ✅ **Optimized Loading**: Images served from organized paths
- ✅ **Better Caching**: Structured URLs for browser caching
- ✅ **Easy CDN Integration**: Ready for content delivery networks
- ✅ **Version Control**: Timestamped files prevent conflicts

## 🛠️ Technical Details

### File Path Examples:
- Original upload: `myimage.jpg`
- Stored as: `uploads/index/hero/index_hero_20250828_194500_myimage.jpg`
- Database path: `index/hero/index_hero_20250828_194500_myimage.jpg`
- Website URL: `/static/uploads/index/hero/index_hero_20250828_194500_myimage.jpg`

### Database Fields:
- `filename`: Timestamped filename
- `original_filename`: Original uploaded name
- `relative_path`: Organized folder path
- `page_name`: Target page (index, about, etc.)
- `section_name`: Target section (hero, products, etc.)
- `subsection_name`: Specific element (optional)

## 📞 Support

If you need help with uploading or organizing images:
1. Check this guide first
2. Test with a small image file
3. Ensure you're using correct section names
4. Contact technical support if issues persist

---

**🎉 This organized system will save significant maintenance costs by allowing non-technical users to manage all website images independently!**