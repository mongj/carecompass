#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../../" && pwd)"

BACKEND_DIR="$REPO_ROOT/backend"
FRONTEND_DIR="$REPO_ROOT/frontend"
COMPOSE_FILE="$BACKEND_DIR/_local/db/docker-compose.yml"
DB_CONTAINER_NAME="carecompass-db"

log() {
  printf "\n[setup-local] %s\n" "$*"
}

die() {
  printf "\n[setup-local] ERROR: %s\n" "$*" >&2
  exit 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "Missing required command: $1"
}

check_port_free() {
  local port="$1"
  if command -v lsof >/dev/null 2>&1; then
    if lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
      die "Port $port is already in use. Stop the process using it (or change the port) and retry."
    fi
  fi
}

compose_cmd() {
  if docker compose version >/dev/null 2>&1; then
    printf "docker compose"
    return 0
  fi
  if command -v docker-compose >/dev/null 2>&1; then
    printf "docker-compose"
    return 0
  fi
  die "Neither 'docker compose' nor 'docker-compose' is available."
}

ensure_docker_running() {
  require_cmd docker

  if docker info >/dev/null 2>&1; then
    return 0
  fi

  log "Docker daemon not reachable. Attempting to start Docker Desktop..."

  # Best-effort (may fail depending on environment); user can start Docker manually.
  if command -v open >/dev/null 2>&1; then
    open -a Docker >/dev/null 2>&1 || true
    open "/Applications/Docker.app" >/dev/null 2>&1 || true
  fi

  for _ in {1..60}; do
    if docker info >/dev/null 2>&1; then
      return 0
    fi
    sleep 2
  done

  die "Docker daemon is not running. Please start Docker Desktop, then retry."
}

db_up() {
  ensure_docker_running
  local compose
  compose="$(compose_cmd)"
  log "Starting Postgres (compose file: $COMPOSE_FILE)"
  (cd "$BACKEND_DIR" && $compose -f "$COMPOSE_FILE" up -d)
}

db_down() {
  ensure_docker_running
  local compose
  compose="$(compose_cmd)"
  log "Stopping Postgres (compose file: $COMPOSE_FILE)"
  (cd "$BACKEND_DIR" && $compose -f "$COMPOSE_FILE" down)
}

db_wait_healthy() {
  ensure_docker_running

  log "Waiting for Postgres container healthcheck to pass ($DB_CONTAINER_NAME)"
  for _ in {1..60}; do
    # If healthcheck not yet present, treat as "starting".
    local status=""
    status="$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}no-healthcheck{{end}}' "$DB_CONTAINER_NAME" 2>/dev/null || true)"

    case "$status" in
      healthy)
        log "Postgres is healthy."
        return 0
        ;;
      unhealthy)
        die "Postgres container is unhealthy. Check: docker logs $DB_CONTAINER_NAME"
        ;;
      *)
        sleep 2
        ;;
    esac
  done

  die "Timed out waiting for Postgres to become healthy. Check: docker logs $DB_CONTAINER_NAME"
}

backend_migrate() {
  require_cmd pipenv
  log "Running Alembic migrations"
  (cd "$BACKEND_DIR" && pipenv run alembic upgrade head)
}

backend_seed() {
  require_cmd pipenv
  log "Running DB seed script"
  (cd "$BACKEND_DIR" && pipenv run python _local/db/seed/seed.py)
}

start_backend_dev() {
  require_cmd pipenv
  check_port_free 8000
  log "Starting backend dev server (watch mode) on http://127.0.0.1:8000"
  (cd "$BACKEND_DIR" && pipenv run fastapi dev app/main.py)
}

start_frontend_dev() {
  require_cmd npm
  check_port_free 3000
  log "Starting frontend dev server (watch mode) on http://localhost:3000"
  (cd "$FRONTEND_DIR" && npm run dev)
}

