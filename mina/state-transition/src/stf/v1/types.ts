import type { InvalidInput } from '@game/utils';
import type { WalletAddress } from '@paima/sdk/utils';

export type InputTypes = 'xp';

export interface GainExperienceInput {
  input: 'gainedExperience';
  address: WalletAddress;
  experience: number;
}

export type MinaDescriptor = [index: string, value: string];

export interface SudokuEvent {
  input: 'sudokuEvent';
  data: {
    txHash: string;
    /** Index is the position in the events table. */
    data: MinaDescriptor[];
  }
}

export interface SudokuAction {
  input: 'sudokuAction';
  data: {
    txHash: string;
    /** Index is the sequence number of the action. */
    data: MinaDescriptor[];
  };
}

export type ParsedSubmittedInput = GainExperienceInput | SudokuEvent | SudokuAction | InvalidInput;
