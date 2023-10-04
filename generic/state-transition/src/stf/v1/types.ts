import type { InvalidInput } from '@game/utils';
import type { WalletAddress } from '@paima/sdk/utils';

export type InputTypes = 'xp';

export interface GainExperienceInput {
  input: 'gainedExperience';
  address: WalletAddress;
  experience: number;
}

export type ParsedSubmittedInput = GainExperienceInput | InvalidInput;
