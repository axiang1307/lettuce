#!/usr/bin/env bash
# Runs the Postman collection against a local Supabase stack, exactly the way CI does.
#
#   supabase start            # once, from the repo root (needs Docker)
#   npm run test:api:local    # from api/
#
# It creates a fresh test user, starts its own copy of the API on API_PORT (default 3001, so it
# can run beside `npm run dev`) pointed at the local stack, runs Newman, then stops the API.
# It never reads api/.env and refuses non-local databases, so it can't touch the hosted project.
set -euo pipefail

cd "$(dirname "$0")/.."
API_PORT="${API_PORT:-3001}"

# The local stack's URLs and keys. They're fixed development values, not secrets.
if ! status_env="$(supabase status -o env 2>/dev/null)"; then
  echo "Local Supabase isn't running. Start it from the repo root with: supabase start" >&2
  exit 1
fi
eval "$status_env"

case "$DB_URL" in
  *@127.0.0.1:*|*@localhost:*) ;;
  *) echo "Refusing to run: DB_URL from 'supabase status' isn't a local database." >&2; exit 1 ;;
esac

if curl -s -o /dev/null "http://localhost:$API_PORT/"; then
  echo "Port $API_PORT is already in use; set API_PORT to a free port." >&2
  exit 1
fi

# A new user per run, so reruns never collide. The metadata fills the profile through the
# on_auth_user_created trigger, which this run therefore also tests.
run_id="$(date +%s)_$RANDOM"
test_email="test_$run_id@example.com"
test_password="$(openssl rand -hex 16)"
curl -sS --fail-with-body -o /dev/null -X POST "$API_URL/auth/v1/admin/users" \
  -H "apikey: $SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$test_email\",\"password\":\"$test_password\",\"email_confirm\":true,\"user_metadata\":{\"full_name\":\"Test User\",\"username\":\"test_$run_id\"}}"

# The API gets its config from the environment only; DOTENV_CONFIG_PATH=/dev/null keeps dotenv
# from loading api/.env (the hosted project's credentials).
api_log="$(mktemp)"
PORT="$API_PORT" \
  SUPABASE_URL="$API_URL" \
  SUPABASE_SERVICE_ROLE_KEY="$SERVICE_ROLE_KEY" \
  DATABASE_URL="$DB_URL" \
  DOTENV_CONFIG_PATH=/dev/null \
  DOTENV_CONFIG_QUIET=true \
  node --import tsx src/index.ts > "$api_log" 2>&1 &
api_pid=$!
trap 'kill "$api_pid" 2>/dev/null || true; rm -f "$api_log"' EXIT

# There's no public health route, so any HTTP answer (a 401) means the server is up.
for _ in $(seq 1 30); do
  curl -s -o /dev/null "http://localhost:$API_PORT/" && break
  if ! kill -0 "$api_pid" 2>/dev/null; then
    echo "The API exited during startup:" >&2
    cat "$api_log" >&2
    exit 1
  fi
  sleep 1
done

if ! npx newman run postman/lettuce-api.postman_collection.json \
  --env-var "base_url=http://localhost:$API_PORT" \
  --env-var "supabase_url=$API_URL" \
  --env-var "anon_key=$ANON_KEY" \
  --env-var "test_email=$test_email" \
  --env-var "test_password=$test_password"; then
  echo "--- API log" >&2
  cat "$api_log" >&2
  exit 1
fi
