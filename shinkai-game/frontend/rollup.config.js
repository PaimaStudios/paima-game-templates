import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import dotenv from 'dotenv';
import injectProcessEnv from 'rollup-plugin-inject-process-env';

dotenv.config({ path: '../../.env.local' });
export default {
  input: 'src/index.ts',
  output: {
    dir: 'build',
    format: 'esm',
  },
  plugins: [
    typescript({ module: 'ESNext' }),
    json(),
    commonjs(),
    nodeResolve({ browser: true }),
    injectProcessEnv(process.env),
  ],
  watch: {
    buildDelay: 1000,
  },
};
