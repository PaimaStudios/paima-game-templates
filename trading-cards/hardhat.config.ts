import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox-viem';
import '@nomicfoundation/hardhat-ignition';
import 'hardhat-dependency-compiler';
import 'hardhat-interact';

import * as dotenv from 'dotenv';

const development: Record<string, string> = {};
const production: Record<string, string> = {};
dotenv.config({ path: './../.env.development', processEnv: development });
dotenv.config({ path: './../.env.production', processEnv: production });

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
    development: {
      url: development.CHAIN_URI,
      accounts:
        development.DEPLOYER_PRIVATE_KEY == null ? [] : [`0x${development.DEPLOYER_PRIVATE_KEY}`],
    },
    production: {
      url: production.CHAIN_URI,
      accounts:
        production.DEPLOYER_PRIVATE_KEY == null ? [] : [`0x${production.DEPLOYER_PRIVATE_KEY}`],
    },
  },
  dependencyCompiler: {
    // paths: ['@openzeppelin/contracts/token/ERC20/ERC20.sol'],
  },
};

export default config;
