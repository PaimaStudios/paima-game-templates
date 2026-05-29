import { generatePrecompile } from '@paima/sdk/precompiles';

export const precompiles = {
  ...generatePrecompile('foo'),
} as const;
