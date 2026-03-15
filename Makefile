.PHONY: help doctor dev dev-detach db-up db-down migrate-seed

help:
	@echo "CareCompass local dev shortcuts"
	@echo ""
	@echo "  make doctor       				Preflight checks (tools/Docker/ports)"
	@echo "  make dev          				DB -> migrate -> seed -> backend+frontend"
	@echo "  make dev-noseed 					Start servers without db seeding"
	@echo "  make dev-detach   				Start servers in background and exit"
	@echo "  make dev-detach-noseed 	Start servers in background without db seeding and exit"
	@echo "  make db-up        				Start Postgres (docker compose up -d)"
	@echo "  make migrate-seed 				Run alembic + seed"
	@echo "  make db-down      				Stop Postgres (docker compose down)"

doctor:
	bash .cursor/skills/setup-local/scripts/doctor.sh

dev:
	bash .cursor/skills/setup-local/scripts/dev.sh

dev-noseed:
	bash .cursor/skills/setup-local/scripts/dev.sh --skip-seed

dev-detach:
	bash .cursor/skills/setup-local/scripts/dev.sh --detach

dev-detach-noseed:
	bash .cursor/skills/setup-local/scripts/dev.sh --detach  --skip-seed

db-up:
	bash .cursor/skills/setup-local/scripts/db-up.sh

db-down:
	bash .cursor/skills/setup-local/scripts/db-down.sh

migrate-seed:
	bash .cursor/skills/setup-local/scripts/db-migrate-seed.sh

