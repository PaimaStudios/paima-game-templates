cd ..
npm run build
cd middleware

DOTENV_CONFIG_PATH=../../.env.$NODE_ENV npx paima-build-middleware
echo "Finished Packaging"
