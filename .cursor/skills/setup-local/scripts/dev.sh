#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
source "$SCRIPT_DIR/_common.sh"

SKIP_DB=0
SKIP_MIGRATE=0
SKIP_SEED=0
SKIP_BACKEND=0
SKIP_FRONTEND=0
DETACH=0

usage() {
  cat <<'EOF'
Usage:
  bash .cursor/skills/setup-local/scripts/dev.sh [options]

Options:
  --skip-db        Do not start Postgres via docker compose
  --skip-migrate   Do not run alembic upgrade head
  --skip-seed      Do not run the seed script
  --skip-backend   Do not start the backend dev server
  --skip-frontend  Do not start the frontend dev server
  --detach         Start servers in background and exit
  -h, --help       Show this help

Behavior:
  - Starts DB (unless --skip-db), waits for healthcheck
  - Runs migrations + seeding (unless skipped)
  - Starts backend + frontend dev servers
  - By default, frontend runs in the foreground; Ctrl+C triggers cleanup
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-db) SKIP_DB=1; shift ;;
    --skip-migrate) SKIP_MIGRATE=1; shift ;;
    --skip-seed) SKIP_SEED=1; shift ;;
    --skip-backend) SKIP_BACKEND=1; shift ;;
    --skip-frontend) SKIP_FRONTEND=1; shift ;;
    --detach) DETACH=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) die "Unknown option: $1 (use --help)" ;;
  esac
done

if [[ "$SKIP_DB" -eq 0 ]]; then
  db_up
  db_wait_healthy
else
  log "Skipping DB startup (--skip-db)"
fi

if [[ "$SKIP_MIGRATE" -eq 0 ]]; then
  backend_migrate
else
  log "Skipping migrations (--skip-migrate)"
fi

if [[ "$SKIP_SEED" -eq 0 ]]; then
  backend_seed
else
  log "Skipping seeding (--skip-seed)"
fi

BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
  if [[ -n "${FRONTEND_PID:-}" ]]; then
    log "Stopping frontend (pid=$FRONTEND_PID)"
    kill "$FRONTEND_PID" >/dev/null 2>&1 || true
  fi

  if [[ -n "${BACKEND_PID:-}" ]]; then
    log "Stopping backend (pid=$BACKEND_PID)"
    kill "$BACKEND_PID" >/dev/null 2>&1 || true
    # Best-effort: also stop direct children if any.
    if command -v pkill >/dev/null 2>&1; then
      pkill -TERM -P "$BACKEND_PID" >/dev/null 2>&1 || true
    fi
  fi
}
trap cleanup INT TERM EXIT

if [[ "$SKIP_BACKEND" -eq 0 ]]; then
  log "Starting backend in background"
  start_backend_dev &
  BACKEND_PID="$!"
else
  log "Skipping backend (--skip-backend)"
fi

if [[ "$SKIP_FRONTEND" -eq 0 ]]; then
  if [[ "$DETACH" -eq 1 ]]; then
    log "Starting frontend in background (--detach)"
    start_frontend_dev &
    FRONTEND_PID="$!"
    log "Detached. Backend pid=${BACKEND_PID:-n/a}, Frontend pid=${FRONTEND_PID:-n/a}"
    exit 0
  fi

  start_frontend_dev
else
  log "Skipping frontend (--skip-frontend)"
  log "Nothing left to run in foreground; exiting."
  exit 0
fi

