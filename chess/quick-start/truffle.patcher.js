const fs = require('node:fs');

if (!process.env.WALLET) {
  throw new Error('Missing ENV variable WALLET');
}
if (!process.env.RPC_URL) {
  throw new Error('Missing ENV variable RPC_URL');
}
if (!process.env.CHAIN_ID) {
  throw new Error('Missing ENV variable CHAIN_ID');
}

const truffleTemplate = __dirname + '/truffle-config.template.js';
const truffleTarget = __dirname + '/truffle-config.js';
const data = fs
  .readFileSync(truffleTemplate, 'utf8')
  .replace(/\[WALLET\]/, process.env.WALLET)
  .replace(/\[RPC_URL\]/, process.env.RPC_URL)
  .replace(/'\[NETWORK_ID\]'/, process.env.CHAIN_ID);
fs.writeFileSync(truffleTarget, data, 'utf8');
