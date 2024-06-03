#!/bin/bash
set -euo pipefail
shopt -s nullglob

# Boot postgres
trap "docker compose down database" EXIT
docker compose down database
if ! docker compose up database --wait; then
    docker compose logs database --no-log-prefix
    exit 1
fi

# Apply migrations in order
process() {
    echo "-- $1"
    docker compose exec -T database psql -v ON_ERROR_STOP=1 -f - <"$1" >/dev/null
}
#process ../node_modules/@paima/db/migrations/up.sql
process migrations/init/init.sql
for fname in migrations/[0-9].sql migrations/[0-9][0-9].sql; do
    process "$fname"
done

"$@"
