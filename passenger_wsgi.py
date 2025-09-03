import sys
import os

# Ensure the app directory is on sys.path
APP_DIR = os.path.dirname(os.path.abspath(__file__))
if APP_DIR not in sys.path:
	sys.path.insert(0, APP_DIR)

# cPanel Passenger expects 'application' callable
from app import app as application  # noqa: E402


