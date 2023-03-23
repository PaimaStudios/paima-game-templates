import type { InvalidInput } from '@game/utils';

export type InputTypes = 'xp';

export interface GainExperienceInput {
  input: 'gainedExperience';
  address: string;
  experience: number;
}

export type ParsedSubmittedInput = GainExperienceInput | InvalidInput;
