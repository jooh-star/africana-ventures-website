from app import app, db, User

with app.app_context():
    admin = User.query.filter_by(username='admin').first()
    print(f'Admin exists: {admin is not None}')
    if admin:
        print(f'Admin details: {admin.username}, {admin.email}, {admin.is_admin}')
    else:
        print('No admin user found')