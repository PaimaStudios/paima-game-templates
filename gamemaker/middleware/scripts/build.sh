#!/bin/sh
set -eu

(cd .. && npm run build)

# Build middleware with Paima's process.
DOTENV_CONFIG_PATH=../../.env.${NETWORK:-localhost} npx paima-build-middleware

# Append Game Maker binding functions.
{
	cat <<-EOF
		const mw_default__ = eval('middleware').default;
		function PaimaMW(functionName, ...args) {
			const f = mw_default__[functionName];
			if (typeof f !== 'function') {
                throw new Error('missing: ' + functionName + " " + JSON.stringify(args));
            } else {
                return f(...args);
            }
		}
		function PaimaMWSync(functionName, ...args) {
			const f = mw_default__[functionName];
            if (typeof f !== 'function') {
                throw new Error('missing: ' + functionName + " " + JSON.stringify(args));
            } else {
                return f(...args);
            }
		}
		function PaimaInit() {
			middleware.default.initMiddlewareCore('example-game', '1.0.0');
		}
	EOF
} >>packaged/middleware.js

# Copy to frontend source directory.
mkdir -p ../frontend/extensions/PaimaMW/
cp packaged/middleware.js ../frontend/extensions/PaimaMW/PaimaMW.js
# Copy to frontend target directory.
mkdir -p ../frontend/gm_cli_build/html5game/
cp packaged/middleware.js ../frontend/gm_cli_build/html5game/tph_PaimaMW.js
