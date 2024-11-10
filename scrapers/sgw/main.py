from dotenv import load_dotenv

from dementia_day_care import fetch_and_sync_daycare_data

def main():
    load_dotenv()
    
    # Jobs
    fetch_and_sync_daycare_data()

if __name__ == "__main__":
    main()