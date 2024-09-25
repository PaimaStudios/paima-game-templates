import gameStateTransitionV1 from '@midnightevm/state-transition';
import { runPaimaEngine } from '@paima/node-sdk/engine.js';
import RegisterRoutes from '@midnightevm/api';
import { precompiles } from './precompiles.js';
import openapi from '@midnightevm/api/src/tsoa/swagger.json';

const events = {};

(async (): Promise<void> => {
  await runPaimaEngine(gameStateTransitionV1, precompiles, events, openapi, {
    default: RegisterRoutes,
  });
})();
