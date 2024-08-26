set -eu

cd ..
npm run build
cd middleware

DOTENV_CONFIG_PATH=../../.env.${NETWORK:-localhost} npx paima-build-middleware

cp -R packaged/middleware.js ../frontend/paimaMiddleware.js

echo "Frontend-ready Middleware (Without Exports) Prepared In: packaged/middleware.js"
