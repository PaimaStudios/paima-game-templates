const fs = require('node:fs');

if (!process.env.CHAIN_URI) {
  throw new Error('CHAIN_URI is not set');
}
if (!process.env.CHAIN_ID) {
  throw new Error('CHAIN_ID is not set');
}
if (!process.env.CONTRACT_ADDRESS) {
  throw new Error('CONTRACT_ADDRESS is not set');
}
if (process.env.EMULATED_BLOCKS && !['true', 'false'].includes(process.env.EMULATED_BLOCKS)) {
  throw new Error('EMULATED_BLOCKS must be "true" or "false"');
}

const env = __dirname + '/.env.docker';
let data = fs
  .readFileSync(env, 'utf8')
  .replace(/CHAIN_URI=.*/, `CHAIN_URI="${process.env.CHAIN_URI}"`)
  .replace(/CHAIN_ID=.*/, `CHAIN_ID="${process.env.CHAIN_ID}"`)
  .replace(/CONTRACT_ADDRESS=.*/, `CONTRACT_ADDRESS="${process.env.CONTRACT_ADDRESS}"`)
  .replace(
    /STORAGE_CONTRACT_ADDRESS=.*/,
    `STORAGE_CONTRACT_ADDRESS="${process.env.CONTRACT_ADDRESS}"`
  );

data += `\nEMULATED_BLOCKS=${process.env.EMULATED_BLOCKS ? '"true"' : '"false"'}\n`;
fs.writeFileSync(env, data, 'utf8');
