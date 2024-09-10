import gameStateTransitionV1 from '@chess/state-transition';
import { runPaimaEngine } from '@paima/node-sdk/engine.js';
import RegisterRoutes from '@chess/api';
import { precompiles } from './precompiles.js';
import openapi from '@chess/api/src/tsoa/swagger.json';

const events = {};

(async (): Promise<void> => {
  await runPaimaEngine(gameStateTransitionV1, precompiles, events, openapi, {
    default: RegisterRoutes,
  });
})();
