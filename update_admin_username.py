from app import app, db, User

with app.app_context():
    # Find the admin user
    admin = User.query.filter_by(email='admin@africanaventures.com').first()
    
    if admin:
        # Update the username
        admin.username = 'admin'
        db.session.commit()
        print(f"Username updated to 'admin' for user with email: {admin.email}")
    else:
        print("Admin user not found")