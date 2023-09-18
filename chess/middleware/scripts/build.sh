cd ..
npm run build
cd middleware

DOTENV_CONFIG_PATH=../../.env.$NODE_ENV npx -c ../node_modules/paima-sdk/node_modules/.bin/paima-build-middleware

cp packaged/middleware.js ../frontend/src/paima/middleware.js
