export type ParsedSubmittedInput = MidnightIncrementInput | EvmIncrementInput | InvalidInput;

export interface InvalidInput {
  input: 'invalidString';
}

export interface MidnightIncrementInput {
  input: 'midnightIncrement';
  raw: string;
}

export interface EvmIncrementInput {
  input: 'evmIncrement';
  wallet: string;
}
