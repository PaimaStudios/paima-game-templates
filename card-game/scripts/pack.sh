set -eu

rm -fr ./packaged

npm run build

node esbuildconfig.cjs

mkdir -p ./packaged/migrations
cp -r ./db/migrations/* ./packaged/migrations/ 2>/dev/null || :

echo "✅ Game code bundled and packaged in the packaged folder."
echo "To start your game node, simply use: node packaged/index.cjs"
