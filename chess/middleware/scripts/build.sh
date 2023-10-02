cd ..
npm run build
cd middleware

DOTENV_CONFIG_PATH=../../.env.$NODE_ENV npx -c ../node_modules/paima-sdk/node_modules/.bin/paima-build-middleware

cp packaged/middleware.js $OUT/middleware.js
rsync -ar --include='*/' --include='*.d.ts' --exclude='*' build/ $OUT/
mv $OUT/index.d.ts $OUT/middleware.d.ts
