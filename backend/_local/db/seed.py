"""
Database seeding script for local development.

Seed data is stored in CSV files in the `_local/db/seeds/` directory.
"""

# Add backend directory to sys.path so we can import from app
import sys
from pathlib import Path

# Add the backend directory (parent of _local) to Python path
BACKEND_DIR = Path(__file__).parent.parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import csv
from datetime import datetime
from typing import Optional, List, Dict
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import SessionLocal, engine
from app.models import Base
from app.models.user import User, Citizenship, Residence, Relationship
from app.models.thread import Thread
from app.models.dementia_daycare import DementiaDaycare
from app.models.review import Review, ReviewSource, ReviewableType
from app.models.bookmark import Bookmark

# Path to seeds directory
SEEDS_DIR = Path(__file__).parent / "seeds"


def parse_array(value: str) -> List[str]:
    """Parse a pipe-separated string into a list."""
    if not value or value.strip() == "":
        return []
    return [item.strip() for item in value.split("|") if item.strip()]


def parse_int(value: str) -> Optional[int]:
    """Parse a string to integer, returning None if empty."""
    if not value or value.strip() == "":
        return None
    return int(value.strip())


def parse_float(value: str) -> float:
    """Parse a string to float."""
    return float(value.strip())


def parse_datetime(value: str) -> datetime:
    """Parse a datetime string in format YYYY-MM-DD HH:MM:SS."""
    if not value or value.strip() == "":
        return datetime.now()
    return datetime.strptime(value.strip(), "%Y-%m-%d %H:%M:%S")


def read_csv(file_path: Path) -> List[Dict[str, str]]:
    """Read a CSV file and return a list of dictionaries."""
    if not file_path.exists():
        raise FileNotFoundError(f"Seed file not found: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        return list(reader)


def seed_users(db: Session) -> list[User]:
    """Seed users table with sample data from CSV."""
    # Truncate table with CASCADE to handle foreign key constraints
    try:
        db.execute(text('TRUNCATE TABLE users RESTART IDENTITY CASCADE'))
        db.commit()
    except Exception:
        # Table might not exist yet, which is fine
        db.rollback()
    
    csv_path = SEEDS_DIR / "users.csv"
    rows = read_csv(csv_path)
    
    users = []
    for row in rows:
        user = User(
            clerk_id=row["clerk_id"],
            citizenship=Citizenship[row["citizenship"]] if row.get("citizenship") else None,
            care_recipient_age=parse_int(row.get("care_recipient_age", "")),
            care_recipient_citizenship=Citizenship[row["care_recipient_citizenship"]] if row.get("care_recipient_citizenship") else None,
            care_recipient_residence=Residence[row["care_recipient_residence"]] if row.get("care_recipient_residence") else None,
            care_recipient_relationship=Relationship[row["care_recipient_relationship"]] if row.get("care_recipient_relationship") else None,
            household_size=parse_int(row.get("household_size", "")),
            total_monthly_household_income=parse_int(row.get("total_monthly_household_income", "")),
            annual_property_value=parse_int(row.get("annual_property_value", "")),
            monthly_pchi=parse_int(row.get("monthly_pchi", "")),
        )
        users.append(user)
    
    db.add_all(users)
    db.commit()
    print(f"✓ Seeded {len(users)} users from {csv_path.name}")
    return users


def seed_threads(db: Session, users: list[User]) -> list[Thread]:
    """Seed threads table with sample data from CSV."""
    # Truncate table with CASCADE to handle foreign key constraints
    try:
        db.execute(text('TRUNCATE TABLE threads RESTART IDENTITY CASCADE'))
        db.commit()
    except Exception:
        # Table might not exist yet, which is fine
        db.rollback()
    
    csv_path = SEEDS_DIR / "threads.csv"
    rows = read_csv(csv_path)
    
    threads = []
    for row in rows:
        thread = Thread(
            thread_id=row["thread_id"],
            user_id=row["user_clerk_id"],
            title=row["title"],
        )
        threads.append(thread)
    
    db.add_all(threads)
    db.commit()
    print(f"✓ Seeded {len(threads)} threads from {csv_path.name}")
    return threads


def seed_dementia_daycare(db: Session) -> list[DementiaDaycare]:
    """Seed dementia_daycare table with sample data from CSV."""
    # Truncate table with CASCADE to handle foreign key constraints
    try:
        db.execute(text('TRUNCATE TABLE dementia_daycare RESTART IDENTITY CASCADE'))
        db.commit()
    except Exception:
        # Table might not exist yet, which is fine
        db.rollback()
    
    csv_path = SEEDS_DIR / "dementia_daycare.csv"
    rows = read_csv(csv_path)
    
    daycares = []
    for row in rows:
        daycare = DementiaDaycare(
            friendly_id=row["friendly_id"],
            name=row["name"],
            phone=row.get("phone") or None,
            email=row.get("email") or None,
            website=row.get("website") or None,
            lat=parse_float(row["lat"]),
            lng=parse_float(row["lng"]),
            operating_hours=parse_array(row.get("operating_hours", "")),
            building_name=row.get("building_name") or None,
            block=row.get("block") or None,
            postal_code=row["postal_code"],
            street_name=row.get("street_name") or None,
            unit_no=row.get("unit_no") or None,
            availability=row.get("availability") or None,
            google_map_place_id=row.get("google_map_place_id") or None,
            photos=parse_array(row.get("photos", "")),
            min_price=parse_int(row.get("min_price", "")),
            max_price=parse_int(row.get("max_price", "")),
            description=row.get("description") or None,
        )
        daycares.append(daycare)
    
    db.add_all(daycares)
    db.commit()
    print(f"✓ Seeded {len(daycares)} dementia daycare centres from {csv_path.name}")
    return daycares


def seed_reviews(db: Session, daycares: list[DementiaDaycare]) -> list[Review]:
    """Seed reviews table with sample data from CSV."""
    # Truncate table with CASCADE to handle foreign key constraints
    try:
        db.execute(text('TRUNCATE TABLE reviews RESTART IDENTITY CASCADE'))
        db.commit()
    except Exception:
        # Table might not exist yet, which is fine
        db.rollback()
    
    # Create a mapping of friendly_id to DementiaDaycare for quick lookup
    daycare_map = {daycare.friendly_id: daycare for daycare in daycares}
    
    csv_path = SEEDS_DIR / "reviews.csv"
    rows = read_csv(csv_path)
    
    reviews = []
    for row in rows:
        target_daycare = daycare_map[row["target_friendly_id"]]
        
        review = Review(
            review_source=ReviewSource[row["review_source"]],
            target_id=target_daycare.id,
            target_type=ReviewableType[row["target_type"]],
            content=row.get("content") or None,
            overall_rating=int(row["overall_rating"]),
            author_name=row["author_name"],
            author_id=row.get("author_id") or None,
            google_review_id=row.get("google_review_id") or None,
            google_author_url=row.get("google_author_url") or None,
            google_author_photo_url=row.get("google_author_photo_url") or None,
            published_time=parse_datetime(row.get("published_time", "")),
        )
        reviews.append(review)
    
    db.add_all(reviews)
    db.commit()
    print(f"✓ Seeded {len(reviews)} reviews from {csv_path.name}")
    return reviews


def seed_bookmarks(db: Session, users: list[User], daycares: list[DementiaDaycare]) -> list[Bookmark]:
    """Seed bookmarks table with sample data from CSV."""
    # Truncate table with CASCADE to handle foreign key constraints
    try:
        db.execute(text('TRUNCATE TABLE bookmarks RESTART IDENTITY CASCADE'))
        db.commit()
    except Exception:
        # Table might not exist yet, which is fine
        db.rollback()
    
    # Create a mapping of friendly_id to DementiaDaycare for quick lookup
    daycare_map = {daycare.friendly_id: daycare for daycare in daycares}
    
    csv_path = SEEDS_DIR / "bookmarks.csv"
    rows = read_csv(csv_path)
    
    bookmarks = []
    for row in rows:
        target_daycare = daycare_map[row["target_friendly_id"]]
        
        bookmark = Bookmark(
            user_id=row["user_clerk_id"],
            target_id=target_daycare.id,
            target_type=ReviewableType[row["target_type"]],
            title=row["title"],
            link=row["link"],
        )
        bookmarks.append(bookmark)
    
    db.add_all(bookmarks)
    db.commit()
    print(f"✓ Seeded {len(bookmarks)} bookmarks from {csv_path.name}")
    return bookmarks


def seed_all() -> None:
    """Seed all tables with sample data."""
    print("🌱 Starting database seeding...")
    
    db = SessionLocal()
    try:
        # Ensure tables exist
        Base.metadata.create_all(bind=engine)
        
        # Seed in order (respecting foreign key dependencies)
        # Each seed function truncates its own table before seeding
        users = seed_users(db)
        threads = seed_threads(db, users)
        daycares = seed_dementia_daycare(db)
        reviews = seed_reviews(db, daycares)
        bookmarks = seed_bookmarks(db, users, daycares)
        
        print("\n✅ Database seeding completed successfully!")
        
    except Exception as e:
        db.rollback()
        print(f"\n❌ Error during seeding: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_all()

