from app import app, db, User

with app.app_context():
    # Check all users
    users = User.query.all()
    print(f"Total users: {len(users)}")
    
    for user in users:
        print(f"User: {user.username}, Email: {user.email}, Is Admin: {user.is_admin}")