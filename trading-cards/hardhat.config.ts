import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox-viem';
import '@nomicfoundation/hardhat-ignition-viem';
import 'hardhat-dependency-compiler';
import 'hardhat-interact';

import * as dotenv from 'dotenv';

const testnet: Record<string, string> = {};
const mainnet: Record<string, string> = {};
dotenv.config({ path: './../.env.testnet', processEnv: testnet });
dotenv.config({ path: './../.env.mainnet', processEnv: mainnet });

const config: HardhatUserConfig = {
  solidity: '0.8.20',
  paths: {
    sources: './contracts/evm/solidity',
    tests: './contracts/evm/test',
    cache: './contracts/evm/cache',
    artifacts: './contracts/evm/artifacts',
    ignition: './contracts/evm/ignition',
  },
  networks: {
    // note: localhost / hardhat networks exist implicitly
    testnet: {
      url: testnet.CHAIN_URI ?? "",
      accounts: testnet.DEPLOYER_PRIVATE_KEY == null ? [] : [testnet.DEPLOYER_PRIVATE_KEY],
    },
    production: {
      url: mainnet.CHAIN_URI ?? "",
      accounts: mainnet.DEPLOYER_PRIVATE_KEY == null ? [] : [mainnet.DEPLOYER_PRIVATE_KEY],
    },
  },
  dependencyCompiler: {
    paths: [
      '@paima/evm-contracts/contracts/PaimaL2Contract.sol',
      '@paima/evm-contracts/contracts/Nft.sol',
      '@paima/evm-contracts/contracts/NativeNftSale.sol',
      '@paima/evm-contracts/contracts/Proxy/NativeProxy.sol',
      '@paima/evm-contracts/contracts/GenericPayment.sol',
      '@paima/evm-contracts/contracts/Proxy/GenericPaymentProxy.sol',
    ],
  },
};

export default config;
