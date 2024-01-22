import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import EnvironmentPlugin from 'vite-plugin-environment';
import type { EnvVarDefaults } from 'vite-plugin-environment';

// https://github.com/ElMassimo/vite-plugin-environment/issues/15#issuecomment-1902831069
import { config } from 'dotenv';
config({ path: `${process.cwd()}/../../.env.${process.env.NETWORK || 'localhost'}` });

const stdPaimaEnvVars = [
  'NETWORK',
  'CHAIN_URI',
  'CHAIN_EXPLORER_URI',
  'CHAIN_NAME',
  'CHAIN_ID',
  'CHAIN_CURRENCY_NAME',
  'CHAIN_CURRENCY_SYMBOL',
  'CHAIN_CURRENCY_DECIMALS',
  'BLOCK_TIME',
  'CONTRACT_ADDRESS',
  'START_BLOCKHEIGHT',
  'BACKEND_URI',
  'WEBSERVER_PORT',
];
const appSpecific = ['NATIVE_NFT_SALE_PROXY', 'ERC20_NFT_SALE_PROXY', 'NFT'];
const envVarsToInclude = [
  // put the ENV vars you want to expose here
  ...stdPaimaEnvVars,
  ...appSpecific,
];
const esbuildEnvs = Object.fromEntries(
  envVarsToInclude.map(key => [`process.env.${key}`, JSON.stringify(process.env[key])])
);
esbuildEnvs[`process.env.NETWORK`] = esbuildEnvs[`process.env.NETWORK`] ?? 'localhost'; // default value

const viteEnvMap: EnvVarDefaults = Object.fromEntries(
  envVarsToInclude.map(entry => [entry, undefined])
);
viteEnvMap['NETWORK'] = viteEnvMap['NETWORK'] ?? 'localhost'; // default value

// https://vitejs.dev/config/
export default defineConfig({
  // in combination with the EnvironmentPlugin, it makes process.env available and loads everything from .env file
  // additionally loads .env.localhost (or other network) based on the --mode argument to vite
  envDir: '../..',
  plugins: [react(), EnvironmentPlugin(viteEnvMap)],
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    exclude: ['pg-native'],
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
        // TODO: include the SECURITY_NAMESPACE once we export it
        // https://github.com/PaimaStudios/paima-game-templates/issues/58
        ...esbuildEnvs,
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        // Enable rollup polyfills plugin
        // used during production bundling
        rollupNodePolyFill(),
      ],
      external: ['@polkadot/x-globalThis'],
    },
  },
});
