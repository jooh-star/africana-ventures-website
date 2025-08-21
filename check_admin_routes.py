import requests

# Base URL
base_url = 'http://127.0.0.1:5000'

# List of routes to check
routes = [
    '/admin/dashboard',
    '/admin/contacts',
    '/admin/testimonials',
    '/admin/images',
    '/admin/team',
    '/admin/services',
    '/admin/content',
    '/admin/faqs',
    '/admin/company-info'
]

# Check each route
for route in routes:
    url = base_url + route
    try:
        response = requests.get(url)
        status = response.status_code
        if status == 200:
            result = 'OK'
        elif status == 302:
            result = 'Redirect (expected for protected routes)'
        else:
            result = f'Error: {status}'
    except Exception as e:
        result = f'Exception: {str(e)}'
    
    print(f'{route}: {result}')

print('\nRoute check complete!')