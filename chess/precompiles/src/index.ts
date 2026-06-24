import { generatePrecompiles } from '@paima/precompiles';

export enum PrecompileNames {
  Default = 'default',
}

export const precompiles = generatePrecompiles(PrecompileNames);
