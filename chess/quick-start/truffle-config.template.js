const privateKey = process.env.PRIVATE_KEY;
if (privateKey == null || typeof privateKey !== 'string') {
  throw new Error('Missing ENV variable PRIVATE_KEY');
}
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  contracts_directory: './src/contract',
  contracts_build_directory: './build',
  migrations_directory: './src/migrations',
  compilers: {
    solc: {
      version: '0.8.13',
      evmVersion: 'berlin',
    },
  },
  contract_config: {
    // TODO: modify these values as specified in the docs
    owner: '[WALLET]',
    fee: 10n ** 14n,
  },
  networks: {
    ganache: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*',
    },
    // TODO: modify the target network as required as specified in the docs
    testnet: {
      provider: () =>
        new HDWalletProvider({
          privateKeys: [privateKey],
          providerOrUrl: '[RPC_URL]',
        }),
      network_id: '[NETWORK_ID]',
    },
  },
};
