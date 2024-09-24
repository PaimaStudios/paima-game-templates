import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';

// https://vitejs.dev/config/
export default defineConfig({
  cacheDir: './.vite',
  build: {
    target: 'esnext',
  },
  plugins: [react(), viteCommonjs()],
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
  },
  define: {},
});
