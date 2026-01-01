# Seed Data Files

This directory contains CSV files with sample data for database seeding.

The seed script (`../seed.py`) will:
1. Truncate each table (using CASCADE to handle foreign key constraints)
2. Reset auto-increment sequences
3. Load data from these CSV files

## File Structure

- `users.csv` - Sample user records
- `threads.csv` - Sample chat threads (references users by `user_clerk_id`)
- `dementia_daycare.csv` - Sample dementia daycare centres
- `reviews.csv` - Sample reviews (references daycares by `target_friendly_id`)
- `bookmarks.csv` - Sample bookmarks (references users and daycares)

## CSV Format Notes

### Arrays
Array fields (like `operating_hours` and `photos`) use pipe (`|`) as the separator.

Example:
```
"Monday: 8:00 AM - 6:00 PM|Tuesday: 8:00 AM - 6:00 PM"
```

### Empty Values
Empty/nullable fields can be left empty in the CSV.

### Enums
Enum values should match the exact enum value (e.g., `CITIZEN`, `PR`, `HOME`, `PARENT`).

### Foreign Key References
- Threads reference users by `user_clerk_id` (not the database ID)
- Reviews reference daycares by `target_friendly_id` (not the database ID)
- Bookmarks reference users by `user_clerk_id` and daycares by `target_friendly_id`

### Dates
Dates should be in format: `YYYY-MM-DD HH:MM:SS`

Example: `2024-11-01 10:00:00`

