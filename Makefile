.PHONY: install build dev dev-front dev-back run clean all

VENV := backend/venv
PY   := $(VENV)/bin/python3.12
PIP  := $(VENV)/bin/pip
UV   := $(VENV)/bin/uvicorn

# ==========================
# === Install             ===
# ==========================

install: install-back install-front

install-back:
	python3.12 -m venv $(VENV) && $(PIP) install -U pip && $(PIP) install -r backend/requirements.txt

install-front:
	cd frontend && npm install

# ==========================
# === Dev                 ===
# ==========================

# Run both: open two terminals -> `make dev-front` and `make dev-back`.
dev:
	@echo "run 'make dev-front' and 'make dev-back' in two terminals"

dev-front:
	cd frontend && npm run dev

dev-back:
	$(UV) backend.main:app --reload --host 0.0.0.0 --port 8787

# ==========================
# === Build               ===
# ==========================

build:
	cd frontend && npm run build

# ==========================
# === Clean               ===
# ==========================

clean:
	rm -rf $(VENV) frontend/node_modules frontend/dist
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true

all: install build
