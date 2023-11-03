cd ..
npm run build
cd middleware

DOTENV_CONFIG_PATH="../../.env.$NODE_ENV" node --require dotenv/config ./esbuildconfig.cjs
echo "Finished Packaging"
