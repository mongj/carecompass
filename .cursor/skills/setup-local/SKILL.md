---
name: setup-local
description: Set up the full local CareCompass development environment by starting PostgreSQL via backend/_local/db/docker-compose.yml, running Alembic migrations and seed scripts inside the backend Pipenv virtual environment, and launching both backend and frontend dev servers in watch mode. Use when the user wants to bootstrap or reset the local stack, or asks to start the app end-to-end.
---

# Setup Local CareCompass Environment

## When to Use This Skill

Use this skill whenever you need to:

- Start the **local PostgreSQL database** using the project's Docker Compose file
- Run **Alembic migrations** against that database
- Run the **database seeding** script
- Start the **backend** in watch/reload mode
- Start the **frontend** in watch/reload mode

## Preferred: Use the scripts

This skill includes scripts so you can run the whole workflow next time with one command (no interactive `pipenv shell` required — the scripts use `pipenv run ...`).

## Even faster: use Makefile shortcuts

From the repo root:

```bash
make help
make doctor
make dev
```

Other handy targets:

```bash
make db-up
make migrate-seed
make db-down
make dev-detach
```

From the repo root:

```bash
bash .cursor/skills/setup-local/scripts/dev.sh
```

Useful options:

```bash
# Skip seeding (faster)
bash .cursor/skills/setup-local/scripts/dev.sh --skip-seed

# Skip DB startup (if you already have Postgres running)
bash .cursor/skills/setup-local/scripts/dev.sh --skip-db
```

Other scripts:

```bash
# Start DB and wait until it's healthy
bash .cursor/skills/setup-local/scripts/db-up.sh

# Stop DB (docker compose down)
bash .cursor/skills/setup-local/scripts/db-down.sh

# Run migrations + seed only
bash .cursor/skills/setup-local/scripts/db-migrate-seed.sh

# Preflight checks (tools installed, Docker running, ports free)
bash .cursor/skills/setup-local/scripts/doctor.sh
```

Always perform these steps **from the repository root**:

```bash
cd /Users/loongluangkhot/Downloads/dev/carecompass
```

Adjust the path only if the repository root changes.

---

## Quick Checklist

Follow these steps in order:

1. **Start PostgreSQL via Docker Compose**
2. **Activate backend Pipenv virtual environment**
3. **Run Alembic migrations**
4. **Run DB seeding script**
5. **Start backend in watch mode**
6. **Start frontend in watch mode**

Try to detect already-running services and avoid starting duplicate servers when possible.

---

## Detailed Steps

### 1. Start PostgreSQL via Docker Compose

From the **repo root** (`carecompass`), start the local Postgres container defined in `backend/_local/db/docker-compose.yml`:

```bash
cd backend
docker-compose -f _local/db/docker-compose.yml up -d
cd ..
```

Guidelines:
- Prefer `up -d` so the database runs in the background.
- If the containers are already running, `up -d` is safe and idempotent.

### 2. Activate Backend Pipenv Virtual Environment

Before running any Python commands in the backend (including Alembic and seeding), **you must activate the Pipenv environment**.

From the **repo root**:

```bash
cd backend
pipenv shell
```

Important:
- The `pipenv shell` command is **interactive** and opens a new subshell.
- When using tools that cannot maintain an interactive shell across commands, either:
  - Run all subsequent backend commands in the same interactive terminal session, **or**
  - Use `pipenv run <command>` instead of relying on an activated shell.

If interactive shells are not possible for the current execution environment, prefer:

```bash
cd backend
pipenv run <command>
```

and apply this pattern to the Alembic and seeding commands below.

Tip: the scripts in `.cursor/skills/setup-local/scripts/` already use `pipenv run ...`, so you only need `pipenv shell` if you’re running commands manually.

### 3. Run Alembic Migrations

With the backend environment active (via `pipenv shell` or `pipenv run`), apply all database migrations:

Interactive shell approach:

```bash
cd backend
alembic upgrade head
```

Non-interactive approach (preferred when you cannot maintain `pipenv shell` state in tools):

```bash
cd backend
pipenv run alembic upgrade head
```

Notes:
- Run this **after** the Postgres container is up.
- If migrations fail, inspect the error output and do not proceed to seeding or starting servers until resolved.

### 4. Run DB Seeding Script

After successful migrations, run the seed script at `backend/_local/db/seed/seed.py` against the same database.

Interactive shell approach:

```bash
cd backend
python _local/db/seed/seed.py
```

Non-interactive approach:

```bash
cd backend
pipenv run python _local/db/seed/seed.py
```

Guidelines:
- Only run seeding on **local** environments.
- If the script is re-runnable, it can be used to refresh local data; otherwise, follow any idempotency guidance inside the script.

### 5. Start Backend in Watch Mode

Start the FastAPI backend in development/watch mode so that code changes trigger automatic reloads.

Preferred (if using the FastAPI CLI as described in `AGENTS.md`):

```bash
cd backend
pipenv run fastapi dev app/main.py
```

Alternative patterns (only if the project changes its recommended commands):

- Using `uvicorn` directly:

```bash
cd backend
pipenv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Guidelines:
- Run this in a **long-lived terminal** or a background command.
- Ensure only **one** backend dev server is running to avoid port conflicts.

### 6. Start Frontend in Watch Mode

From the repo root, start the Next.js frontend dev server in watch mode:

```bash
cd frontend
npm run dev
```

Guidelines:
- This should run on `localhost:3000` by default.
- Run it in its own long-lived terminal or background process.

---

## Recommended Terminal Layout

When possible, use separate terminals for long-running processes:

1. **DB + migrations + seeding**
   - Start Postgres
   - Run Alembic migrations
   - Run seeding
2. **Backend dev server**
   - `pipenv run fastapi dev app/main.py`
3. **Frontend dev server**
   - `npm run dev`

Keep these terminals open while developing so the stack remains running.

---

## Example Complete Session

From a clean shell (no Pipenv shell active) at the repo root:

```bash
cd /Users/loongluangkhot/Downloads/dev/carecompass

# 1) Start Postgres
cd backend
docker-compose -f _local/db/docker-compose.yml up -d

# 2) Run migrations
pipenv run alembic upgrade head

# 3) Seed DB
pipenv run python _local/db/seed/seed.py

# 4) Start backend dev server (keep running)
pipenv run fastapi dev app/main.py
```

In a **separate** terminal:

```bash
cd /Users/loongluangkhot/Downloads/dev/carecompass/frontend
npm run dev
```

This results in:
- PostgreSQL running in Docker
- Migrations applied
- Database seeded
- Backend API running in watch mode
- Frontend running in watch mode

---

## Agent Notes

- Prefer **non-interactive** `pipenv run ...` forms when working through tools that cannot maintain shell state across commands.
- Only use `pipenv shell` when you know you are operating in an interactive terminal where subsequent commands share the same environment.
- If any step fails (Docker, Alembic, seeding, or dev servers), stop and surface the error clearly instead of continuing with the remaining steps.

