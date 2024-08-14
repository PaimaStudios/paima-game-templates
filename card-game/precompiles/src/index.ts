import { generatePrecompiles } from '@paima/sdk/precompiles';

export enum PrecompileNames {
  GameTick = 'game-tick',
}

export const precompiles = generatePrecompiles(PrecompileNames);
