const esbuild = require("esbuild");
const { config } = require("@paima/build-utils/middleware-esbuildconfig.template");
esbuild.build({
  ...config,
  sourcemap: true,
  outfile: undefined,
  outdir: './packaged',
  entryPoints: {
    'middleware': 'build/index.js',
    'worker': 'build/worker.js',
  },
});
