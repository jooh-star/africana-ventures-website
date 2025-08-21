from app import app, db, User
from werkzeug.security import generate_password_hash

with app.app_context():
    # Find the admin user
    admin_user = User.query.filter_by(is_admin=True).first()
    
    if admin_user:
        # Update username and password
        admin_user.username = 'vj'
        admin_user.password_hash = generate_password_hash('admin@africanaventures.com')
        
        # Commit changes
        db.session.commit()
        
        print(f"Admin credentials updated successfully!")
        print(f"Username: {admin_user.username}")
        print(f"Email: {admin_user.email}")
    else:
        print("No admin user found.")