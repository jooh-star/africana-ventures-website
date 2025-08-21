import requests

# Base URL
base_url = 'http://127.0.0.1:5000'

# Route to check
route = '/system/management/access'

# Check the route
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