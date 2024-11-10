import logging

from dotenv import load_dotenv

from google_maps import fetch_and_sync_places_data

def main():
    logging.basicConfig(level=logging.INFO)
    load_dotenv()
    
    # Jobs
    fetch_and_sync_places_data()

if __name__ == "__main__":
    main()