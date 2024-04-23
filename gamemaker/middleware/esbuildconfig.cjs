const esbuild = require("esbuild");

const {
  config,
} = require("@paima/build-utils/middleware-esbuildconfig.template");

esbuild.build({
  ...config,
  // ES modules cannot be used as a Game Maker extension.
  format: "iife",
  globalName: "middleware",
});
