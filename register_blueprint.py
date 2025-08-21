from app import app
from Backend.routes.admin import admin

# Register the admin blueprint
app.register_blueprint(admin)
print("Admin blueprint registered successfully!")