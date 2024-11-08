# SQLAlchemy models
import importlib
from pathlib import Path
from app.models.base import Base

# Get the directory containing this __init__.py file
models_dir = Path(__file__).parent

# Get all .py files in the directory
py_files = [
    f.stem for f in models_dir.glob("*.py")
    if f.is_file() and f.suffix == '.py'
    and f.stem not in ['__init__', 'base', 'util']  # Exclude __init__.py, base.py, and util.py
]

# Dynamically import all modules
for module_name in py_files:
    # Import the module using the full path
    module = importlib.import_module(f"app.models.{module_name}")