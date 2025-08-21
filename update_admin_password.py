from app import app, db, User
from werkzeug.security import generate_password_hash

with app.app_context():
    # Find the admin user
    admin = User.query.filter_by(email='admin@africanaventures.com').first()
    
    if admin:
        # Update the password
        admin.password_hash = generate_password_hash('admin123')
        db.session.commit()
        print(f"Password updated for user: {admin.username}")
    else:
        print("Admin user not found")