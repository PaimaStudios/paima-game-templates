set -eu

cd ..
npm run build
cd middleware

DOTENV_CONFIG_PATH=../../.env.${NODE_ENV:-development} npx paima-build-middleware

cp -R packaged/middleware.js ../frontend/paimaMiddleware.js

echo "Frontend-ready Middleware (Without Exports) Prepared In: packaged/middleware.js"
