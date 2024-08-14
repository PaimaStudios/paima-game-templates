import type { InvalidInput } from '@game/utils';
import { JsonProof } from 'o1js';

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

export interface SudokuProof {
  input: 'sudokuProof';
  data: JsonProof;
}

export type ParsedSubmittedInput = SudokuEvent | SudokuAction | SudokuProof | InvalidInput;
