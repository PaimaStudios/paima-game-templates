#!/bin/sh
set -eu

npm run build

BUNDLE_WORKSPACE=api node ./esbuildconfig.cjs
BUNDLE_WORKSPACE=state-transition node ./esbuildconfig.cjs

cp api/src/tsoa/swagger.json ./packaged/openapi.json

o1js=$(npm -w state-transition ls --silent --parseable o1js | head -1)
cp "$o1js/dist/node/bindings/compiled/_node_bindings/plonk_wasm_bg.wasm" packaged/

rm -rf ../packaged
mv -f ./packaged ..

echo "✅ Game code bundled and packaged in the parent folder."
echo "To start your game node, simply use: ./paima-engine run"
