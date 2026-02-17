#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
source "$SCRIPT_DIR/_common.sh"

log "Running preflight checks"

require_cmd docker
require_cmd pipenv
require_cmd npm

ensure_docker_running

log "Checking required files exist"
[[ -f "$COMPOSE_FILE" ]] || die "Missing compose file: $COMPOSE_FILE"
[[ -f "$BACKEND_DIR/alembic.ini" ]] || die "Missing backend alembic.ini"
[[ -f "$BACKEND_DIR/_local/db/seed/seed.py" ]] || die "Missing seed script"
[[ -d "$FRONTEND_DIR" ]] || die "Missing frontend directory"

log "Checking common dev ports"
port_in_use() {
  local port="$1"
  if ! command -v lsof >/dev/null 2>&1; then
    log "lsof not found; skipping port checks."
    return 2
  fi
  lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1
}

check_port_status() {
  local port="$1"
  local name="$2"

  if port_in_use "$port"; then
    log "Port $port ($name): IN USE (this is OK if already running)"
    return 0
  fi

  local rc=$?
  if [[ $rc -eq 2 ]]; then
    return 0
  fi

  log "Port $port ($name): free"
}

check_port_status 5432 "postgres"
check_port_status 8000 "backend"
check_port_status 3000 "frontend"

if docker inspect "$DB_CONTAINER_NAME" >/dev/null 2>&1; then
  status="$(docker inspect --format='{{.State.Status}} {{if .State.Health}}{{.State.Health.Status}}{{end}}' "$DB_CONTAINER_NAME" 2>/dev/null || true)"
  log "Docker container $DB_CONTAINER_NAME: $status"
fi

log "OK: environment looks ready."

