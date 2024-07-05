export type ParsedSubmittedInput =
  | InvalidInput
  | SubmitMoveInput
  | SubmitIncrementInput
  | JoinWorldInput;
export interface InvalidInput {
  input: 'invalidString';
}

export interface JoinWorldInput {
  input: 'joinWorld';
}

export interface SubmitMoveInput {
  input: 'submitMove';
  x: number;
  y: number;
}
export interface SubmitIncrementInput {
  input: 'submitIncrement';
  x: number;
  y: number;
}
