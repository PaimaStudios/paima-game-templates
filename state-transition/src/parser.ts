import { PaimaParser } from '@paima/sdk/concise';
import type { InvalidInput, ParsedSubmittedInput } from './types.js';

const myGrammar = `
  fork = fork|body
  paint = paint|body
`;

const PaimaParser_JSON = (keyName: string, input: string) => JSON.parse(input);

const parserCommands = {
  fork: {
    body: PaimaParser_JSON,
  },
  paint: {
    body: PaimaParser_JSON,
  },
};

const myParser = new PaimaParser(myGrammar, parserCommands);
export function isInvalid(input: ParsedSubmittedInput): input is InvalidInput {
  return (input as InvalidInput).input == 'invalidString';
}

export default function parse(s: string): ParsedSubmittedInput {
  try {
    const parsed = myParser.start(s);
    return { input: parsed.command, ...parsed.args } as any;
  } catch (e) {
    console.log(e, 'Parsing error');
    return { input: 'invalidString' };
  }
}
