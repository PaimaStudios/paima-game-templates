import gameStateTransitionV1 from '@game/state-transition';
import { runPaimaEngine } from '@paima/node-sdk/engine';
import RegisterRoutes from '@game/api';
import { precompiles } from '@game/precompiles';
import { events } from '@game/events';
import openapi from '@game/api/src/tsoa/swagger.json';

(async (): Promise<void> => {
  await runPaimaEngine(gameStateTransitionV1, precompiles, events, openapi, {
    default: RegisterRoutes,
  });
})();
