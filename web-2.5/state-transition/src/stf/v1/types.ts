import type { InvalidInput } from '@game/utils';
import type { WalletAddress } from 'paima-sdk/paima-utils';

export interface GainExperienceInput {
  input: 'gainedExperience';
  address: WalletAddress;
  experience: number;
}

export interface ChangeNameInput {
  input: 'changedName';
  address: WalletAddress;
  name: string;
}

export type ParsedSubmittedInput = GainExperienceInput | ChangeNameInput | InvalidInput;
