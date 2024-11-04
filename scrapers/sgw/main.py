import os
import sys

import requests

# Add the project root to Python path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../"))
sys.path.append(project_root)

def main():
    from sgw.scraper import fetch_schemes

    schemes = fetch_schemes()
    print(schemes)

if __name__ == "__main__":
    main()