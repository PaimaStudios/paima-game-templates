export type ParsedSubmittedInput = InvalidInput | ClickInput | TickInput;

export interface InvalidInput {
  input: 'invalidString';
}

export interface ClickInput {
  input: 'click';
  card: number;
}

export interface TickInput {
  input: 'tick';
  n: number;
}
