#!/bin/sh
set -eu

(cd .. && npm run build)

# Build middleware with Paima's process.
DOTENV_CONFIG_PATH=../../.env.${NETWORK:-localhost} npx paima-build-middleware

# Append Game Maker binding functions.
{
	cat <<-EOF
		function PaimaMW(functionName) {
			const f = window['middleware']['default'][functionName];
			if (typeof f !== 'function') {
                throw new Error('missing: middleware.default.' + functionName);
            } else {
                return window['middleware']['jsToGm'](f);
            }
		}
	EOF
} >>packaged/middleware.js

# Copy to frontend source directory.
mkdir -p ../frontend/extensions/PaimaMW/
cp packaged/middleware.js ../frontend/extensions/PaimaMW/PaimaMW.js
# Copy to frontend target directory, if being served from CLI.
mkdir -p ../frontend/gm_cli_build/html5game/
cp packaged/middleware.js ../frontend/gm_cli_build/html5game/tph_PaimaMW.js
