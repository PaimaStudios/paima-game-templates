npm run build

BUNDLE_WORKSPACE=api node ./esbuildconfig.cjs

BUNDLE_WORKSPACE=state-transition node ./esbuildconfig.cjs

rm -rf ../packaged
mv -f ./packaged ..

mkdir -p ../packaged/migrations
cp ./db/migrations/*.sql ../packaged/migrations/

echo "✅ Game code bundled and packaged in the parent folder."
echo "To start your game node, simply use: ./paima-engine run"
