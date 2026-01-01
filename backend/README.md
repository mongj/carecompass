# FastAPI server

## Local development
1. Set up the environment variables
    ```
    cp .env.template .env
    ```

2. Start a local postgres database

   **Option A: Using Docker Compose (Recommended)**
   ```
   docker-compose -f _local/docker-compose.yml up -d
   ```
   
   This will start a PostgreSQL 15 container. The database credentials are:
   - `DB_USER=postgres`
   - `DB_PASSWORD=postgres`
   - `DB_HOST=localhost`
   - `DB_PORT=5432`
   - `DB_NAME=postgres`
   - `DB_SSLMODE=disable`

   Add the database credentials above to your `.env` file.
   
   **Option B: Use your own PostgreSQL instance**
   
   Use your own preferred method of spinning up a postgres instance.

3. Get the OpenAI credentials from AWS Secret Manager. Will eventually use boto3 for this but haven't set it up yet
    ```
    OPENAI_API_KEY= 
    OPENAI_ASSISTANT_ID=
    ```

4. Install dependencies and create the virtual environment
    ```
    pipenv install
    ```

5. Activate the virtual environment
    ```
    pipenv shell
    ```

6. Run the server
    ```
    fastapi dev app/main.py
    ```

## Database migrations
The project uses alembic to manage database schema changes. Migration files are stored at `app/migrations/versions`

Migrate up
```
alembic upgrade head
```

Migrate down
```
alembic downgrade <step>
```

To autogenerate migrations based on the latest models
```
alembic revision --autogenerate -m <migration-name>
```

Note: alembic does not work very well with enums. Specifically:
- it does not drop the enum type when migrating downwards
- it does not update enum when new values are added

## Database seeding
For local development, you can seed the database with sample data.

Seed data is stored in CSV files located in `_local/db/seeds/`. This makes it easy to:
- View and understand the data structure
- Edit seed data without modifying code
- Review changes in pull requests

After running migrations, seed the database:
```
python _local/db/seed.py
```

The seed script will:
- Verify tables exist (creates them if needed)
- Truncate all tables (using CASCADE to handle foreign key constraints)
- Read seed data from CSV files in `_local/db/seeds/`
- Seed sample data for all tables (users, threads, dementia_daycare, reviews, bookmarks)

**Note:** The script will truncate existing data before seeding, so all existing records will be deleted and replaced with the seed data.

### Seed Data Files
- `_local/db/seeds/users.csv` - User records
- `_local/db/seeds/threads.csv` - Chat threads
- `_local/db/seeds/dementia_daycare.csv` - Dementia daycare centres
- `_local/db/seeds/reviews.csv` - Reviews
- `_local/db/seeds/bookmarks.csv` - Bookmarks

See `_local/db/seeds/README.md` for details on CSV format and conventions.

## Deployment
todo