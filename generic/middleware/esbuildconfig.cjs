const esbuild = require("esbuild");
const {
  config,
} = require("@paima/build-utils/middleware-esbuildconfig.template");
config.format = 'cjs';
esbuild.build(config);
