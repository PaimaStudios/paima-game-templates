export type ParsedSubmittedInput = InvalidInput | JoinWorldInput | SubmitMineAttemptInput;

export interface InvalidInput {
  input: 'invalidString';
}

export interface JoinWorldInput {
  input: 'joinWorld';
}

export interface SubmitMineAttemptInput {
  input: 'submitMineAttempt';
}
