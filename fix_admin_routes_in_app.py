import re

# Define the file path
app_file_path = 'app.py'

# Read the content of app.py
with open(app_file_path, 'r', encoding='utf-8') as file:
    content = file.read()

# Find all admin routes in app.py and move them to admin.py
admin_routes = []
route_pattern = r'@app\.route\(\'(/admin/[^\']*)\',?\s*(?:methods=\[[^\]]*\])?\)\s*@login_required\s*def\s+([^\(\s]+)\([^\)]*\):\s*(?:if\s+not\s+current_user\.is_admin:\s*return\s+redirect\(url_for\([^\)]+\)\)\s*)?([^@]*?)(?=@|$)'

matches = re.finditer(route_pattern, content, re.DOTALL)

for match in matches:
    route_path = match.group(1)
    function_name = match.group(2)
    function_body = match.group(3).strip()
    
    admin_routes.append({
        'path': route_path,
        'function_name': function_name,
        'function_body': function_body
    })

# Replace admin routes in app.py with comments
for route in admin_routes:
    route_pattern = r'@app\.route\(\'{}\',?\s*(?:methods=\[[^\]]*\])?\)\s*@login_required\s*def\s+{}\([^\)]*\):\s*(?:if\s+not\s+current_user\.is_admin:\s*return\s+redirect\(url_for\([^\)]+\)\)\s*)?[^@]*?(?=@|$)'.format(
        re.escape(route['path']), 
        re.escape(route['function_name'])
    )
    
    replacement = f"# {route['function_name']} route is now handled by the admin blueprint\n\n"
    content = re.sub(route_pattern, replacement, content, flags=re.DOTALL)

# Update url_for references in app.py
for route in admin_routes:
    # Replace url_for('function_name') with url_for('admin.function_name')
    content = re.sub(
        r"url_for\(['\"]{}['\"]\)".format(re.escape(route['function_name'])),
        f"url_for('admin.{route['function_name']}')",
        content
    )

# Write the updated content back to app.py
with open(app_file_path, 'w', encoding='utf-8') as file:
    file.write(content)

print(f"Updated app.py: Removed {len(admin_routes)} admin routes and updated url_for references")

# Now update the admin.py file to include these routes
admin_file_path = 'Backend/routes/admin.py'

# Read the content of admin.py
with open(admin_file_path, 'r', encoding='utf-8') as file:
    admin_content = file.read()

# Check if the routes already exist in admin.py
new_routes_added = 0
for route in admin_routes:
    # Check if the route already exists
    if f"@admin.route('{route['path']}')" in admin_content or f"@admin.route('{route['path'].replace('/admin', '')}')" in admin_content:
        print(f"Route {route['path']} already exists in admin.py, skipping")
        continue
    
    # Add the route to admin.py
    route_code = f"""@admin.route('{route['path'].replace('/admin', '')}', methods=['GET', 'POST'])
@login_required
def {route['function_name']}():
    if not current_user.is_admin:
        return redirect(url_for('admin.admin_login'))
    
{route['function_body']}
"""
    
    # Append the route to the end of admin.py
    admin_content += "\n" + route_code
    new_routes_added += 1

# Write the updated content back to admin.py
with open(admin_file_path, 'w', encoding='utf-8') as file:
    file.write(admin_content)

print(f"Updated admin.py: Added {new_routes_added} new routes")
print("Done!")