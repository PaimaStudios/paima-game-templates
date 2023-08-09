const { polyfillNode } = require("esbuild-plugin-polyfill-node");

const define = { global: "window" };
// To replace process.env calls in middleware with variable values during build time
for (const variable in process.env) {
  define[`process.env.${variable}`] = JSON.stringify(process.env[variable]);
}

// Verify env file is filled out
if (
  !process.env.CONTRACT_ADDRESS ||
  !process.env.CHAIN_URI ||
  !process.env.CHAIN_ID ||
  !process.env.BACKEND_URI
)
  throw new Error("Please ensure you have filled out your .env file");

const esbuild = require("esbuild");
const { dtsPlugin } = require("esbuild-plugin-d.ts");
const config = {
  // JS output from previous compilation step used here instead of index.ts to have more control over the TS build process
  entryPoints: ["build/index.js"],
  bundle: true,
  format: "esm",
  define,
  outfile: "packaged/middleware.js",
  plugins: [polyfillNode({}), dtsPlugin()],
  external: ["pg-native"],
};

esbuild.build(config);
