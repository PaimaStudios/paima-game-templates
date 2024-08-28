export type ParsedSubmittedInput = InvalidInput | CreateLocationInput;

export interface InvalidInput {
  input: 'invalidString';
}

export interface CreateLocationInput {
  input: 'createLocation';
  lat: string;
  lon: string;
  title: string;
  description: string;
}