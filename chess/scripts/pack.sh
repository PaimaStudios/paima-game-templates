set -eu

rm -fr ./packaged

npm run build

node esbuildconfig.cjs

echo "✅ Game code bundled and packaged in the packaged folder."
echo "To start your game node, simply use: node packaged/index.cjs"
