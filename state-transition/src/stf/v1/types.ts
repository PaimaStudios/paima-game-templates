import type { WalletAddress } from '@paima/sdk/utils';

export interface InvalidInput {
  input: 'invalidString';
}

export interface GainExperienceInput {
  input: 'gainedExperience';
  address: WalletAddress;
  experience: number;
}

export type ParsedSubmittedInput = GainExperienceInput | InvalidInput;
