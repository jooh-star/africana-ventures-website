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