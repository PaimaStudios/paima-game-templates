#!/bin/bash
set -euo pipefail

# Boot postgres
trap "docker compose down database" EXIT
docker compose down database
if ! docker compose up database --wait; then
    docker compose logs database --no-log-prefix
    exit 1
fi

"$@"
