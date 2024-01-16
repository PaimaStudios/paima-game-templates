set -eu

cd ..
npm run build
cd middleware

DOTENV_CONFIG_PATH=../../.env.${NODE_ENV:-development} npx paima-build-middleware
