cd ..
npm run build
cd middleware

DOTENV_CONFIG_PATH=../../.env.$NODE_ENV npx paima-build-middleware

cp -R packaged/paimaMiddleware.js ../frontend/

echo "Frontend-ready Middleware (Without Exports) Prepared In: packaged/paimaMiddleware.js"
