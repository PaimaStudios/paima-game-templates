set -eu

npm run build

BUNDLE_WORKSPACE=api node ./esbuildconfig.cjs
BUNDLE_WORKSPACE=state-transition node ./esbuildconfig.cjs
BUNDLE_WORKSPACE=precompiles node ./esbuildconfig.cjs

cp api/src/tsoa/swagger.json ./packaged/openapi.json

rm -rf ../packaged
mv -f ./packaged ..

mkdir -p ../packaged/migrations
cp -r ./db/migrations/* ../packaged/migrations/ 2>/dev/null || :

echo "✅ Game code bundled and packaged in the parent folder."
echo "To start your game node, simply use: ./paima-engine run"
