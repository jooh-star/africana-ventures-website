# Africana Ventures Website

A comprehensive agricultural services website for East Africa, featuring a modern design, admin panel, and contact management system. The project includes a test suite to ensure functionality works as expected.

## 🌟 Features

### Frontend
- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **Modern UI**: Green Leaf Kenya inspired design with smooth animations
- **Performance Optimized**: Lazy loading, image optimization, and preloading
- **Interactive Elements**: Smooth scrolling, hover effects, and form validation

### Pages
- **Homepage**: Hero section, services overview, about us, core values, testimonials
- **About Page**: Company story, mission, vision, team, and statistics
- **Services Page**: Detailed service offerings with process flow
- **Contact Page**: Contact forms, testimonials submission, FAQ section

### Admin Panel
- **Secure Authentication**: Login system with password hashing
- **Dashboard**: Statistics overview and recent activity
- **Contact Management**: View and manage all contact form submissions
- **Testimonials Management**: Approve, edit, and delete customer testimonials
- **Image Management**: Upload, organize, and manage website images
- **Database Integration**: SQLite database with SQLAlchemy ORM

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd africana-venture_website
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Access the website**
   - Main website: http://localhost:5000
   - Admin panel: http://localhost:5000/admin/login

### Default Admin Credentials
- **Username**: admin
- **Password**: admin123

⚠️ **Important**: Change the default password in production!

### Changing Admin Password
To change the admin password:
1. Log in to the admin panel
2. Click on your username in the top-right corner
3. Select "Change Password" from the dropdown menu
4. Enter your current password and new password
5. Click "Change Password" to save

## 🧪 Testing

The project includes a test suite to verify the functionality of routes and features.

### Running Tests

```bash
# Run all tests
python -m unittest discover tests

# Run tests with verbose output
python -m unittest discover tests -v

# Run a specific test
python -m unittest tests.test_routes.RoutesTestCase.test_contact_submission
```

### Test Coverage

Tests cover key functionality including:
- Route accessibility (home, about, services, contact pages)
- Admin authentication (login/logout)
- Form submissions (contact form)
- Error handling

### Recent Fixes

- Fixed admin login error message to display "Invalid username or password" for consistency
- Enhanced contact form submission to properly display success messages
- Added flash message display section to base template for better user feedback

## 📁 Project Structure

```
africana-venture_website/
├── app.py                          # Main Flask application
├── requirements.txt                # Python dependencies
├── README.md                      # Project documentation
├── africana_ventures.db           # SQLite database (created automatically)
├── tests/                         # Test suite
│   └── test_routes.py            # Route tests
├── Frontend/
│   ├── templates/                 # HTML templates
│   │   ├── base.html             # Base template
│   │   ├── index.html            # Homepage
│   │   ├── about.html            # About page
│   │   ├── services.html         # Services page
│   │   ├── contact.html          # Contact page
│   │   └── admin/                # Admin templates
│   │       ├── base.html         # Admin base template
│   │       ├── login.html        # Admin login
│   │       ├── dashboard.html    # Admin dashboard
│   │       ├── contacts.html     # Contact management
│   │       ├── testimonials.html # Testimonial management
│   │       └── images.html       # Image management
│   └── static/                   # Static files
│       ├── css/                  # Stylesheets
│       │   ├── style.css         # Main styles
│       │   ├── about.css         # About page styles
│       │   ├── services.css      # Services page styles
│       │   ├── contact.css       # Contact page styles
│       │   └── core-values.css   # Core values styles
│       ├── js/                   # JavaScript files
│       │   ├── main.js           # Main JavaScript
│       │   ├── about.js          # About page scripts
│       │   ├── services.js       # Services page scripts
│       │   ├── contact.js        # Contact form handling
│       │   └── core-values.js    # Core values scripts
│       ├── images/               # Website images
│       └── uploads/              # User uploaded content
└── greenleafkenya.org/           # Reference design files
```

## 🛠️ Maintenance

### Common Issues and Solutions

- **Flash Messages Not Displaying**: Ensure the flash message section is properly included in the base template
- **Form Submission Errors**: Check both the route handling in app.py and the JavaScript form handling in contact.js
- **Database Issues**: Verify SQLAlchemy models and database connections

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎨 Design Features

### Color Palette
- **Primary Green**: #013220 (Dark Green)
- **Secondary Green**: #008C51 (Bright Green)
- **Text Color**: #36454F (Dark Gray)
- **Accent Color**: #52320A (Brown)

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Heading Font**: Roboto Condensed
- **Body Font**: Inter

### Responsive Breakpoints
- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///africana_ventures.db
UPLOAD_FOLDER=Frontend/static/uploads
MAX_CONTENT_LENGTH=16777216
```

### Database
The application uses SQLite by default. For production, consider using PostgreSQL or MySQL:

```python
# PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@localhost/dbname'

# MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://user:password@localhost/dbname'
```

## 📊 Database Models

### User
- Admin user management with authentication

### Contact
- Contact form submissions with read/unread status

### Testimonial
- Customer testimonials with approval system

### WebsiteImage
- Image management with categorization and status

## 🛠️ Admin Panel Features

### Dashboard
- Total contacts, unread messages, testimonials statistics
- Recent contact submissions
- Quick action buttons

### Contact Management
- View all contact form submissions
- Mark messages as read/unread
- Reply directly via email
- Filter and search functionality

### Testimonial Management
- Approve/reject customer testimonials
- Upload and manage testimonial photos
- Edit testimonial content
- Bulk operations

### Image Management
- Upload images for different sections
- Categorize images (hero, about, services, etc.)
- Activate/deactivate images
- Preview and delete images
- File size and type validation

## 🔒 Security Features

- **Password Hashing**: Secure password storage with Werkzeug
- **Session Management**: Flask-Login for user sessions
- **CSRF Protection**: Cross-Site Request Forgery protection for all forms
- **File Upload Security**: File type and size validation
- **SQL Injection Protection**: SQLAlchemy ORM
- **XSS Protection**: Jinja2 template escaping

## 🚀 Deployment

### Production Setup

1. **Set up a production server**
   ```bash
   # Install Gunicorn
   pip install gunicorn
   
   # Run with Gunicorn
   gunicorn -w 4 -b 0.0.0.0:8000 app:app
   ```

2. **Configure Nginx** (example)
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
       
       location /static {
           alias /path/to/your/static/files;
       }
   }
   ```

3. **Set up SSL certificate**
   ```bash
   # Using Let's Encrypt
   sudo certbot --nginx -d yourdomain.com
   ```

### Environment Variables for Production
```env
FLASK_ENV=production
SECRET_KEY=your-very-secure-secret-key
DATABASE_URL=postgresql://user:password@localhost/dbname
```

## 📝 API Endpoints

### Public Endpoints
- `GET /` - Homepage
- `GET /about` - About page
- `GET /services` - Services page
- `GET /contact` - Contact page
- `POST /submit_contact` - Contact form submission
- `POST /submit_testimonial` - Testimonial submission

### Admin Endpoints (Protected)
- `GET /admin/login` - Admin login page
- `POST /admin/login` - Admin authentication
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/contacts` - Contact management
- `GET /admin/testimonials` - Testimonial management
- `GET /admin/images` - Image management
- `POST /admin/upload_image` - Image upload
- Various admin action endpoints

## 🐛 Troubleshooting

### Common Issues

1. **Database not created**
   ```bash
   # The database is created automatically when you first run the app
   # If issues persist, delete the .db file and restart
   ```

2. **Upload folder not found**
   ```bash
   # Create the uploads directory
   mkdir -p Frontend/static/uploads
   ```

3. **Permission errors**
   ```bash
   # Ensure proper permissions on upload folder
   chmod 755 Frontend/static/uploads
   ```

4. **Static files not loading**
   - Check file paths in templates
   - Ensure files exist in static directory
   - Clear browser cache

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Email: support@africanaventures.com
- Website: https://africanaventures.com

## 🔄 Updates

### Version 1.0.0
- Initial release with complete website
- Admin panel with full functionality
- Contact and testimonial management
- Image upload and management system
- Responsive design implementation
