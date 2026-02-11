# FastAPI server

---

## Local development

### 1. Environment variables

```bash
cp .env.template .env
```

Then fill in your `.env`. In particular:

- **OpenAI:** Get `OPENAI_API_KEY` and `OPENAI_ASSISTANT_ID` from AWS Secrets Manager (boto3 automation not set up yet) and add them to `.env`.
- **Database:** Add the DB variables from step 3 (or your own Postgres values) after starting the database.

### 2. Dependencies and virtual environment

```bash
pipenv install
pipenv shell
```

### 3. Database

#### 3.1. Hosting

##### Option A: Docker Compose (recommended)

```bash
docker-compose -f _local/db/docker-compose.yml up -d
```

This starts a PostgreSQL 15 container. Add these to your `.env`:

| Variable     | Value        |
| ------------ | ------------ |
| `DB_USER`    | `postgres`   |
| `DB_PASSWORD`| `postgres`   |
| `DB_HOST`    | `localhost`  |
| `DB_PORT`    | `5432`       |
| `DB_NAME`    | `postgres`   |
| `DB_SSLMODE` | `disable`    |

##### Option B: Your own PostgreSQL

Use your own method to run a Postgres instance and set the same variables in `.env`.

#### 3.2. Migrations

The project uses Alembic; migration files live in `app/migrations/versions`. After the DB is running:

- **Up:** `alembic upgrade head`
- **Down:** `alembic downgrade <step>`
- **Autogenerate:** `alembic revision --autogenerate -m <migration-name>`

Alembic does not handle enums well: it does not drop enum types on downgrade and does not update enums when new values are added.

#### 3.3. Seeding (optional)

To load sample data locally: run `alembic upgrade head` (if needed), then `python _local/db/seed/seed.py`. See `_local/db/seed/README.md` for details.

### 4. Run the server

```bash
fastapi dev app/main.py
```

---

## Deployment

The project uses GitHub Actions for CI/CD.

### CI workflow

- Runs on pull requests, on pushes to `main` when `backend/**` changes, or on manual trigger via `workflow_dispatch`.
- Builds and pushes Docker images to the registry.
- See `.github/workflows/backend-ci.yml` for more details.

### CD workflow

- Runs on manual trigger via `workflow_dispatch`.
- Deploys the Docker image to the target server.
- Runs database migrations before starting the new container.
- See `.github/workflows/backend-cd.yml` for more details.

### Required GitHub configuration

**Secrets**
- `DEPLOY_HOST` – Deployment server hostname or IP.
- `DEPLOY_USER` – SSH username on the deployment server.
- `DEPLOY_SSH_KEY` – SSH private key for the deployment server.
- `DEPLOY_PORT` – SSH port (optional; default 22).
