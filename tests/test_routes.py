import unittest
import os
import tempfile
from app import app, db
from Backend.models.user import User
from Backend.models.content import Contact, Service
from werkzeug.security import generate_password_hash

class RoutesTestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False  # Disable CSRF for testing
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.client = app.test_client()
        with app.app_context():
            db.create_all()
            
            # Create test admin user
            admin = User(
                username='testadmin',
                email='testadmin@example.com',
                password_hash=generate_password_hash('testpassword'),
                is_admin=True
            )
            db.session.add(admin)
            
            # Create test service
            service = Service(

                title='Test Service',
                description='This is a test service',  # Changed from short_description
                icon='fa-test',  # Changed from icon_class
                is_active=True
            )
            db.session.add(service)
            db.session.commit()
    
    def tearDown(self):
        with app.app_context():
            db.drop_all()
    
    def test_index_route(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Africana Ventures', response.data)
    
    def test_about_route(self):
        response = self.client.get('/about')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'About', response.data)
    
    def test_services_route(self):
        response = self.client.get('/services')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Services', response.data)
        self.assertIn(b'Test Service', response.data)
    
    def test_contact_route(self):
        response = self.client.get('/contact')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Contact', response.data)
    
    def test_contact_submission(self):
        response = self.client.post('/contact', data={
            'first_name': 'Test',
            'last_name': 'User',
            'email': 'test@example.com',
            'phone': '1234567890',
            'company': 'Test Company',
            'service': 'Test Service',
            'message': 'This is a test message'
        }, follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Thank you for your message', response.data)
        
        with app.app_context():
            contact = Contact.query.filter_by(email='test@example.com').first()
            self.assertIsNotNone(contact)
            self.assertEqual(contact.first_name, 'Test')
    
    def test_admin_login(self):
        response = self.client.post('/system/management/access', data={
            'username': 'testadmin',
            'password': 'testpassword'
        }, follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Dashboard', response.data)
    
    def test_admin_login_invalid(self):
        response = self.client.post('/system/management/access', data={
            'username': 'testadmin',
            'password': 'wrongpassword'
        }, follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Invalid username or password', response.data)

if __name__ == '__main__':
    unittest.main()