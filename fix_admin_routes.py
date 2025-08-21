import re
import os

def fix_admin_routes():
    admin_file_path = os.path.join('Backend', 'routes', 'admin.py')
    
    with open(admin_file_path, 'r') as file:
        content = file.read()
    
    # Replace @admin.route('/admin/...') with @admin.route('/...')
    pattern = r"@admin\.route\('(/admin)(/[^']*)'\)"
    replacement = r"@admin.route('\2')"
    
    updated_content = re.sub(pattern, replacement, content)
    
    # Count the number of replacements
    original_matches = re.findall(pattern, content)
    updated_matches = re.findall(r"@admin\.route\('(/[^']*)'\)", updated_content)
    
    print(f"Found {len(original_matches)} routes with '/admin/' prefix")
    
    # Write the updated content back to the file
    with open(admin_file_path, 'w') as file:
        file.write(updated_content)
    
    print(f"Updated {len(original_matches)} routes in {admin_file_path}")

if __name__ == '__main__':
    fix_admin_routes()