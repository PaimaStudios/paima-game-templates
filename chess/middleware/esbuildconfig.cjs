const esbuild = require("esbuild");
const {
  config,
} = require("paima-sdk/paima-build-utils/build/middleware-esbuildconfig.template.cjs");
esbuild.build(config);
