# FastAPI server

## Local development
1. Set up the environment variables
    ```
    cp .env.template .env
    ```

2. Start a local postgres database

   **Option A: Using Docker Compose (Recommended)**
   ```
   docker-compose -f _local/db/docker-compose.yml up -d
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

1. Start the local database (if not already running):
   ```
   docker-compose -f _local/db/docker-compose.yml up -d
   ```

2. Run migrations:
   ```
   alembic upgrade head
   ```

3. Seed the database:
   ```
   python _local/db/seed/seed.py
   ```

See `_local/db/seed/README.md` for details on `seed.py`.

## CI/CD

The project uses GitHub Actions for continuous integration and deployment.

### CI Workflow
- Triggers on pull requests and pushes to `main` branch when `backend/**` files change
- Builds and pushes Docker images to registry

### CD Workflow
- Manual trigger via workflow_dispatch
- Deploys Docker image to server
- Runs database migrations before starting container

### Required GitHub Secrets/Environment Variables

**Environment Variables:**
- `DOCKER_REGISTRY` - Docker registry URL (optional, leave empty for local registry)

**Secrets:**
- `DOCKER_USERNAME` - Docker registry username (if using registry)
- `DOCKER_PASSWORD` - Docker registry password (if using registry)
- `DEPLOY_HOST` - Deployment server hostname/IP
- `DEPLOY_USER` - SSH username for deployment server
- `DEPLOY_SSH_KEY` - SSH private key for deployment server
- `DEPLOY_PORT` - SSH port (optional, defaults to 22)