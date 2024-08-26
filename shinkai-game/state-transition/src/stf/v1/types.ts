export type ParsedSubmittedInput = InvalidInput | NewGameInput | AIInput | TickInput;

export interface InvalidInput {
  input: 'invalidString';
}

export interface NewGameInput {
  input: 'newGame';
}

export interface AIInput {
  input: 'ai';
  target: string;
  id: number;
  response: string;
}

export interface TickInput {
  input: 'tick';
  n: number;
}
