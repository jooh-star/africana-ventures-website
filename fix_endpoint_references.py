from flask import Flask
import os
import re

# Define the template directory
template_dir = os.path.join(os.getcwd(), 'Frontend', 'templates', 'admin')

# List of admin routes that need to be prefixed with 'admin.'
admin_routes = [
    'admin_dashboard',
    'admin_contacts',
    'admin_testimonials',
    'admin_images',
    'admin_team',
    'admin_services',
    'admin_content',
    'admin_faqs',
    'admin_company_info',  # This should match the function name in the Blueprint
    'admin_logout',
    'change_admin_password',
    'mark_contact_read',
    # Add any other admin routes here
]

# Function to update endpoint references in a file
def update_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Count original matches
    original_matches = 0
    for route in admin_routes:
        pattern = r"request\.endpoint\s*==\s*['\"]({})['\"]".format(route)
        original_matches += len(re.findall(pattern, content))
    
    # Replace request.endpoint == 'route_name' with request.endpoint == 'admin.route_name'
    updated_content = content
    replacements = 0
    for route in admin_routes:
        pattern = r"request\.endpoint\s*==\s*['\"]({})['\"]".format(route)
        replacement = r"request.endpoint == 'admin.\1'"
        new_content = re.sub(pattern, replacement, updated_content)
        if new_content != updated_content:
            replacements += len(re.findall(pattern, updated_content))
            updated_content = new_content
    
    # Only write to the file if changes were made
    if content != updated_content:
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(updated_content)
        return True, replacements
    return False, 0

# Process all template files
def process_templates():
    total_files = 0
    updated_files = 0
    total_replacements = 0
    
    # Walk through the template directory
    for root, dirs, files in os.walk(template_dir):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                total_files += 1
                updated, replacements = update_file(file_path)
                if updated:
                    updated_files += 1
                    total_replacements += replacements
                    print(f"Updated {file_path} - {replacements} replacements")
    
    print(f"\nSummary:\n{updated_files} of {total_files} files updated\n{total_replacements} total endpoint references fixed")

if __name__ == '__main__':
    print("Starting to fix endpoint references in admin templates...")
    process_templates()
    print("Done!")