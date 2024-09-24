set -eu

cd ..
npm run build
cd middleware

DOTENV_CONFIG_PATH=../../.env.${NETWORK:-localhost} npx paima-build-middleware

OUT=../frontend/src/paima
rm -rf $OUT/
mkdir $OUT/
cp packaged/middleware.js $OUT/middleware.js
rsync -ar --include='*/' --include='*.d.ts' --exclude='*' build/ $OUT/
mv $OUT/index.d.ts $OUT/middleware.d.ts
