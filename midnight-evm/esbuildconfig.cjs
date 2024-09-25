const esbuild = require("esbuild");

esbuild.build({
  platform: "node",
  entryPoints: [`game/src/index.ts`],
  bundle: true,
  outfile: `packaged/index.cjs`,
  format: "cjs",
  treeShaking: true,
  external: ["pg-native"],
});

const {
  copyAssetsForBundle,
} = require("@paima/build-utils/scripts/copyAssets.cjs");

copyAssetsForBundle("packaged");
