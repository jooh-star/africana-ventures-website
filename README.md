# Africana Ventures Website – cPanel Deployment Guide

Production-ready Flask app with Tailwind UI, admin panel, and SQLite/MySQL support. This guide explains how to deploy on cPanel (Passenger Python) and what to upload.

## What to Upload to cPanel
- `app.py` (Flask application)
- `passenger_wsgi.py` (Passenger entrypoint)
- `Backend/` (all models, routes, utils)
- `Frontend/` (templates and static files)
- `requirements.txt`
- `.env` (create from `.env.example` with your real values)
- Optionally: `instance/` if you are using SQLite and want to ship a seed DB

Do NOT upload local dev folders like `venv/`, `node_modules/`, database backups, or one-off scripts.

## Environment Variables
Create `.env` in the project root on cPanel (File Manager → create file) based on `.env.example`:
```
SECRET_KEY=change-me-in-production
DATABASE_URI=sqlite:////home/USER/path/to/app/instance/africana_ventures.db
FLASK_ENV=production
MAX_CONTENT_LENGTH=16777216
```
Notes:
- For MySQL on cPanel, use: `DATABASE_URI=mysql+pymysql://DB_USER:DB_PASS@localhost/DB_NAME`
- Ensure the uploads directory exists: `Frontend/static/uploads`

## Passenger (Python App) Setup on cPanel
1. cPanel → Setup Python App (or Application Manager).
2. Select Python version (3.10+ recommended).
3. Application root: the folder containing `passenger_wsgi.py`.
4. Application startup file: `passenger_wsgi.py` (auto-detected in most themes).
5. Application entry point: `application` (already provided).
6. Click Create. Then open the virtualenv shell in the cPanel UI and run:
   ```
   pip install -r requirements.txt
   ```
7. Restart the application from the cPanel UI after edits.

### Logs on cPanel
- App logs are written to `instance/logs/app.log` (inside your app root).
- Ensure the `instance/` directory is writable by the app user.

## Local Development (Optional)
```
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python app.py
```
Visit `http://localhost:5000` and `http://localhost:5000/admin/login`.

Default admin is auto-created if none exists:
- Username: `admin`
- Password: `admin123` (change in production!)

## Switching to MySQL on cPanel
1. Create a MySQL database and user in cPanel, grant privileges.
2. Set `DATABASE_URI` in `.env`:
```
DATABASE_URI=mysql+pymysql://DB_USER:DB_PASS@localhost/DB_NAME
```
3. Restart the app from cPanel.

## Tailwind/CSS
- Tailwind is precompiled and included in `Frontend/static/css/dist`. No Node is required on cPanel.
- If you change styles, rebuild locally and upload the updated CSS.

## File Uploads
- Uploads are stored under `Frontend/static/uploads`. Keep write permissions (755/775).
- Images uploaded in Admin are immediately used on public pages.

## Security
- Set a strong `SECRET_KEY` in `.env`.
- CSRF protection is enabled for all forms.
- Only allowed file types are accepted for uploads.

## Troubleshooting on cPanel
- 500 error: Check Error Log in cPanel and ensure Passenger app restarted.
- Module not found: Make sure `pip install -r requirements.txt` ran inside the cPanel Python app environment.
- Static files not loading: Confirm `Frontend/` is inside the app root and template paths are intact.

## Project Structure (runtime)
```
africana-venture_website/
├── app.py
├── passenger_wsgi.py
├── Backend/
├── Frontend/
├── requirements.txt
├── .env (not committed)
└── instance/ (optional for SQLite)
```

## Credentials & Configuration
- Admin user: created automatically if none exists; change the password immediately.
- `.env` holds all secrets (not committed): DB URI, secret key, limits.

## License and Support
- Internal project; configure according to your hosting.
