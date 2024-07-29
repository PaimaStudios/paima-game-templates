#!/bin/sh
set -eu

cd ..
npm run build
cd middleware
node build/build_worker.js

DOTENV_CONFIG_PATH=../../.env.${NETWORK:-localhost} npx paima-build-middleware
