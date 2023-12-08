import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

import { config } from 'dotenv';
config({ path: `${process.cwd()}/../../.env.${process.env.NODE_ENV || 'development'}` });

const envs = Object.fromEntries(
  [
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
  ].map(key => [`process.env.${key}`, JSON.stringify(process.env[key])])
);

// https://vitejs.dev/config/
export default defineConfig({
  // in combination with the EnvironmentPlugin makes process.env available and loads everything from .env file in root folder into it
  // but it must start with VITE_
  // additionally loads .env.development or .env.production automatically
  envDir: '../..',
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    exclude: ['pg-native'],
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
        ...envs,
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
