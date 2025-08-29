import os
import logging
from datetime import datetime
from werkzeug.utils import secure_filename

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

def allowed_file(filename):
    """Check if the file extension is allowed"""
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_uploaded_file(file, upload_folder, prefix=''):
    """Save an uploaded file with a timestamp and return the filename"""
    if file and file.filename != '' and allowed_file(file.filename):
        try:
            filename = secure_filename(file.filename)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            new_filename = f"{prefix}_{timestamp}_{filename}" if prefix else f"{timestamp}_{filename}"
            file_path = os.path.join(upload_folder, new_filename)
            file.save(file_path)
            logger.info(f"File saved successfully: {new_filename}")
            return new_filename
        except Exception as e:
            logger.error(f"Error saving file: {str(e)}")
            return None
    return None

def save_page_file(file, base_upload_folder, page_name, section_name=None, prefix=''):
    """Save an uploaded file in page-specific folder structure with timestamp and return the filename and relative path"""
    if file and file.filename != '' and allowed_file(file.filename):
        try:
            # Create page-specific folder structure
            page_folder = os.path.join(base_upload_folder, page_name)
            if section_name:
                upload_folder = os.path.join(page_folder, section_name)
            else:
                upload_folder = page_folder
            
            # Create directories if they don't exist
            os.makedirs(upload_folder, exist_ok=True)
            
            # Generate filename with timestamp
            filename = secure_filename(file.filename)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            if prefix:
                new_filename = f"{prefix}_{timestamp}_{filename}"
            else:
                new_filename = f"{timestamp}_{filename}"
            
            # Save file
            file_path = os.path.join(upload_folder, new_filename)
            file.save(file_path)
            
            # Calculate relative path for database storage
            if section_name:
                relative_path = os.path.join(page_name, section_name, new_filename).replace('\\', '/')
            else:
                relative_path = os.path.join(page_name, new_filename).replace('\\', '/')
            
            logger.info(f"File saved successfully in organized structure: {relative_path}")
            return new_filename, relative_path
        except Exception as e:
            logger.error(f"Error saving file in page structure: {str(e)}")
            return None, None
    return None, None