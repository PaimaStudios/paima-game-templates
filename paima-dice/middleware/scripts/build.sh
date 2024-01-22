set -eu

cd ..
npm run build
cd middleware

DOTENV_CONFIG_PATH="../../.env.${NETWORK:-localhost}" node --require dotenv/config ./esbuildconfig.cjs
echo "Finished Packaging"
