import { task, type HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox-viem';
import '@nomicfoundation/hardhat-ignition-viem';
import 'hardhat-dependency-compiler';
import 'hardhat-interact';
import 'hardhat-abi-exporter';

import * as dotenv from 'dotenv';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { ChildProcess, spawn } from 'child_process';
import { open } from 'fs/promises';

const testnet: Record<string, string> = {};
const mainnet: Record<string, string> = {};
dotenv.config({ path: './../.env.testnet', processEnv: testnet });
dotenv.config({ path: './../.env.mainnet', processEnv: mainnet });

const config: HardhatUserConfig = {
  solidity: '0.8.20',
  paths: {
    sources: './solidity',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
    ignition: './ignition',
  },
  networks: {
    // note: localhost / hardhat networks exist implicitly
    // hardhat is in-process (temporal) created for single commands. localhost is persisted by `npx hardhat node`
    hardhat: {
      mining: {
        auto: true,
        interval: 2000,
      },
    },
    testnet: {
      url: testnet.CHAIN_URI ?? '',
      accounts: testnet.DEPLOYER_PRIVATE_KEY == null ? [] : [testnet.DEPLOYER_PRIVATE_KEY],
    },
    production: {
      url: mainnet.CHAIN_URI ?? '',
      accounts: mainnet.DEPLOYER_PRIVATE_KEY == null ? [] : [mainnet.DEPLOYER_PRIVATE_KEY],
    },
  },
  dependencyCompiler: {
    paths: ['@paima/evm-contracts/contracts/PaimaL2Contract.sol'],
  },
  abiExporter: {
    path: './abi',
    runOnCompile: true,
    tsWrapper: true,
    clear: true,
    flat: false,
  },
};

// Override `node` task to also run a fresh deploy-to-localhost, for easier dev.
task('node').setAction(async (args, hre: HardhatRuntimeEnvironment, runSuper) => {
  // It would be simpler here to run ignition in-process with hre.run(),
  // but this would leave no record for `hardhat interact` to use.
  let ignition: ChildProcess;
  process.on('exit', () => ignition?.kill());

  // Boot the Hardhat node.
  const node = runSuper.isDefined ? runSuper() : hre.run('node');
  // Technically a race here for hardhat-node to listen on the socket
  // before hardhat-ignition tries to connect. If needed, sleep here.
  ignition = spawn(
    'hardhat',
    [
      'ignition',
      'deploy',
      './ignition/modules/deploy.ts',
      '--parameters', './ignition/parameters.json',
      '--network', 'localhost',
      '--reset',  // So we don't have to manually rm -rf the deploy journal.
    ],
    {
      stdio: 'inherit',
    }
  );
  await new Promise<void>((resolve, reject) => {
    ignition.on('exit', (code, signal) => {
      if (signal !== null) {
        reject(`hardhat ignition: exit signal ${signal}`);
      } else if (code !== 0) {
        reject(`hardhat ignition: exit code ${code}`);
      } else {
        resolve();
      }
    });
  });
  // Create contracts.stamp now that it's done.
  await (await open('contracts.stamp', 'w')).close();
  // Now the contracts are deployed, and `npx hardhat interact --network localhost` works.
  // Just be the node for the rest of time.
  await node;
});

export default config;
