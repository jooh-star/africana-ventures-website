#!/usr/bin/env python3
"""
Setup organized folder structure for uploads
Creates page-specific folders and section subfolders for better organization
"""

import os

def create_upload_structure():
    """Create the organized folder structure for uploads"""
    
    # Base upload directory
    base_upload_path = os.path.join('Frontend', 'static', 'uploads')
    
    # Define page structure with their sections
    page_structure = {
        'index': [
            'hero',
            'services_overview', 
            'about_preview',
            'products',
            'core_focus_areas',
            'impact_projects',
            'faq',
            'support',
            'stories',
            'contact'
        ],
        'about': [
            'hero',
            'story',
            'mission_vision',
            'values',
            'team',
            'statistics',
            'principles',
            'partners',
            'testimonials',
            'join_us'
        ],
        'services': [
            'hero',
            'methodology',
            'process',
            'showcase',
            'expertise',
            'testimonials'
        ],
        'products': [
            'hero',
            'categories',
            'horticulture',
            'cereals_legumes',
            'oilseeds_nuts',
            'gallery'
        ],
        'contact': [
            'hero',
            'form',
            'info',
            'location',
            'social'
        ],
        'solutions': [
            'hero',
            'core_solutions',
            'marketplace',
            'logistics',
            'advisory',
            'finance',
            'training',
            'data',
            'value_addition'
        ],
        'base': [
            'logos',
            'navigation',
            'footer',
            'global'
        ]
    }
    
    created_folders = []
    
    # Create folder structure
    for page_name, sections in page_structure.items():
        # Create page folder
        page_folder = os.path.join(base_upload_path, page_name)
        os.makedirs(page_folder, exist_ok=True)
        created_folders.append(page_folder)
        
        # Create section subfolders
        for section_name in sections:
            section_folder = os.path.join(page_folder, section_name)
            os.makedirs(section_folder, exist_ok=True)
            created_folders.append(section_folder)
    
    return created_folders

def create_gitkeep_files(folders):
    """Create .gitkeep files in empty folders to ensure they're tracked by git"""
    for folder in folders:
        gitkeep_path = os.path.join(folder, '.gitkeep')
        if not os.path.exists(gitkeep_path):
            with open(gitkeep_path, 'w') as f:
                f.write('# Keep this folder in git\n')

def main():
    """Main setup function"""
    print("Setting up organized upload folder structure...")
    
    try:
        created_folders = create_upload_structure()
        create_gitkeep_files(created_folders)
        
        print(f"\n✅ Successfully created {len(created_folders)} folders!")
        print("\n📁 Folder structure created:")
        print("Frontend/static/uploads/")
        
        # Show the structure
        for folder in sorted(created_folders):
            relative_path = folder.replace('Frontend/static/uploads/', '').replace('\\', '/')
            if '/' in relative_path:
                page, section = relative_path.split('/', 1)
                print(f"  ├── {page}/")
                print(f"  │   └── {section}/")
            else:
                print(f"  ├── {relative_path}/")
        
        print("\n📝 Usage Guidelines:")
        print("• Index page sections: hero, services_overview, about_preview, products, core_focus_areas")
        print("• About page sections: hero, story, team, partners, testimonials")
        print("• Services page sections: hero, methodology, showcase, expertise")
        print("• Products page sections: hero, categories, horticulture, cereals_legumes, oilseeds_nuts")
        print("• Contact page sections: hero, form, info, location")
        print("• Solutions page sections: hero, core_solutions, marketplace, logistics, advisory")
        
        print("\n🎯 Admin Upload Instructions:")
        print("1. Go to /admin/pages")
        print("2. Select the page (Index, About, etc.)")
        print("3. Upload photos with correct section names")
        print("4. Files will be automatically organized in the proper folders")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creating folder structure: {e}")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print("\n✨ Setup completed successfully!")
    else:
        print("\n💥 Setup failed!")