import { build } from 'esbuild';

await build({
  entryPoints: ['build/mina.worker.js'],
  outfile: 'build/mina.worker.txt',
  bundle: true,
  format: 'esm',
});
