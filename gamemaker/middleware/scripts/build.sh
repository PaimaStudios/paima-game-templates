#!/bin/sh
set -eu

(cd .. && npm run build)

DOTENV_CONFIG_PATH=../../.env.${NETWORK:-localhost} npx paima-build-middleware
