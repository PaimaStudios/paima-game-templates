const esbuild = require("esbuild");
const {
  generateConfig,
} = require("@paima/build-utils/standalone-esbuildconfig.template");

const { config, outFiles, workspace } = generateConfig(
  "api",
  "state-transition"
);
esbuild.build({
  ...config,
  sourcemap: true,
  loader: {
    ...config.loader,
    ".node": "file",
  },
  inject: [
    ...config.inject ?? [],
    './import_meta_url.js',
  ],
  define: {
    ...config.define,
    "import.meta.url": 'import_meta_url'
  },
  assetNames: '[name]',
});

console.log(
  `\x1b[32m${workspace}\x1b[0m bundled to packaged/${outFiles[workspace]}`
);
