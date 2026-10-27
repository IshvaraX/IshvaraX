;#!/usr/bin/env bash
# Run the IshvaraX frontend (Next.js) and backend (FastAPI) locally.
#
#   ./dev.sh                     # both
#   ./dev.sh --backend-only
#   ./dev.sh --frontend-only
#   ./dev.sh --api-port 8001 --web-port 3001
#   BACKEND_DIR=/path/to/BACKEND ./dev.sh
#
# Backend: creates backend/.venv on first run, installs requirements.txt when it
# changes, loads BACKEND/.env + .env.local and starts uvicorn with --reload.
# Frontend: npm install if node_modules is missing, then `next dev` pointed at
# the local API. Ctrl+C stops both.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$ROOT/main"
BACKEND_DIR="${BACKEND_DIR:-$ROOT/../BACKEND}"
BACKEND_APP="$BACKEND_DIR/backend"
API_PORT="${API_PORT:-8000}"
WEB_PORT="${WEB_PORT:-3000}"
MODE="all"
SKIP_INSTALL=0

usage() { sed -n '2,13p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    --backend-only)  MODE="backend" ;;
    --frontend-only) MODE="frontend" ;;
    --skip-install)  SKIP_INSTALL=1 ;;
    --api-port)      API_PORT="$2"; shift ;;
    --web-port)      WEB_PORT="$2"; shift ;;
    -h|--help)       usage; exit 0 ;;
    *) echo "unknown option: $1" >&2; usage >&2; exit 1 ;;
  esac
  shift
done

require() {
  command -v "$1" >/dev/null 2>&1 || { echo "error: '$1' not found on PATH. $2" >&2; exit 1; }
}

# KEY=value / KEY="value" / export KEY=value; comments and blank lines skipped.
# Later calls override earlier ones, so call in reverse precedence order.
load_env() {
  [[ -f "$1" ]] || return 0
  local line key val
  while IFS= read -r line || [[ -n "$line" ]]; do
    line="${line%$'\r'}"
    [[ "$line" =~ ^[[:space:]]*(#|$) ]] && continue
    if [[ "$line" =~ ^[[:space:]]*(export[[:space:]]+)?([A-Za-z_][A-Za-z0-9_]*)[[:space:]]*=[[:space:]]*(.*)$ ]]; then
      key="${BASH_REMATCH[2]}"
      val="${BASH_REMATCH[3]}"
      val="${val%"${val##*[![:space:]]}"}"
      if [[ "$val" =~ ^\"(.*)\"$ ]] || [[ "$val" =~ ^\'(.*)\'$ ]]; then val="${BASH_REMATCH[1]}"; fi
      export "$key=$val"
    fi
  done < "$1"
}

BACKEND_PID=""
cleanup() {
  if [[ -n "$BACKEND_PID" ]] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    # uvicorn --reload forks a worker; take the children down too.
    command -v pkill >/dev/null 2>&1 && pkill -P "$BACKEND_PID" 2>/dev/null || true
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM;

# ---- Backend -----------------------------------------------------------------
if [[ "$MODE" != "frontend" ]]; then
  [[ -f "$BACKEND_APP/main.py" ]] || { echo "error: backend not found at '$BACKEND_APP' (set BACKEND_DIR)" >&2; exit 1; }

  VENV="$BACKEND_APP/.venv"
  PY="$VENV/bin/python"; [[ -x "$PY" ]] || PY="$VENV/Scripts/python.exe"
  if [[ ! -x "$PY" ]]; then
    PYTHON="$(command -v python3 || command -v python || true)"
    [[ -n "$PYTHON" ]] || { echo "error: python not found. Install Python 3.12+" >&2; exit 1; }
    echo "[backend] creating virtualenv at $VENV"
    "$PYTHON" -m venv "$VENV"
    PY="$VENV/bin/python"; [[ -x "$PY" ]] || PY="$VENV/Scripts/python.exe"
  fi

  REQ="$BACKEND_APP/requirements.txt"
  STAMP="$VENV/.requirements.stamp"
  if [[ $SKIP_INSTALL -eq 0 && ( ! -f "$STAMP" || "$REQ" -nt "$STAMP" ) ]]; then
    echo "[backend] installing requirements"
    "$PY" -m pip install --quiet --disable-pip-version-check -r "$REQ"
    touch "$STAMP"
  fi

  # Precedence: .env.local > .env
  load_env "$BACKEND_DIR/.env"
  load_env "$BACKEND_DIR/.env.local"
  for required in DATABASE_URL SECRET_KEY; do
    [[ -n "${!required:-}" ]] || { echo "error: $required is not set. Add it to $BACKEND_DIR/.env.local" >&2; exit 1; }
  done
  if (( ${#SECRET_KEY} < 32 )); then
    cat >&2 <<EOF
error: SECRET_KEY must be at least 32 characters (the one in .env is a placeholder). Generate one with:
  python -c "import secrets; print(secrets.token_urlsafe(48))"
and put SECRET_KEY=<value> in $BACKEND_DIR/.env.local
EOF
    exit 1
  fi
  # Password-reset links should point at the local frontend, not production.
  export APP_BASE_URL="http://localhost:$WEB_PORT"
  # The backend logs emoji at startup; non-UTF-8 consoles (Git Bash on Windows) would crash.
  export PYTHONUTF8=1

  echo "[backend] http://localhost:$API_PORT  (docs: /docs)"
  ( cd "$BACKEND_APP" && exec "$PY" -m uvicorn main:app --reload --host 127.0.0.1 --port "$API_PORT" ) &
  BACKEND_PID=$!
fi

# ---- Frontend ----------------------------------------------------------------
if [[ "$MODE" != "backend" ]]; then
  require npm "Install Node.js 20+ from https://nodejs.org/"
  cd "$FRONTEND_DIR"
  if [[ $SKIP_INSTALL -eq 0 && ! -d node_modules ]]; then
    echo "[frontend] installing npm packages"
    npm install
  fi
  export NEXT_PUBLIC_API_BASE_URL="http://localhost:$API_PORT"
  echo "[frontend] http://localhost:$WEB_PORT"
  npm run dev -- --port "$WEB_PORT"
else
  wait "$BACKEND_PID"
fi
