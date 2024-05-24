import type { InvalidInput } from '@game/utils';
import { PaimaParser } from '@paima/sdk/concise';
import type { ParsedSubmittedInput } from './types';

const myGrammar = `
  gainedExperience = xp|*address|experience
  sudokuEvent = mge|data
  sudokuAction = mga|data
`;

const PaimaParser_JSON = (keyName: string, input: string) => JSON.parse(input);

const parserCommands = {
  gainedExperience: {
    address: PaimaParser.WalletAddress(),
    experience: PaimaParser.NumberParser(1, 5),
  },
  sudokuEvent: {
    data: PaimaParser_JSON,
  },
  sudokuAction: {
    data: PaimaParser_JSON,
  },
};

const myParser = new PaimaParser(myGrammar, parserCommands);
export function isInvalid(input: ParsedSubmittedInput): input is InvalidInput {
  return (input as InvalidInput).input == 'invalidString';
}

function parse(s: string): ParsedSubmittedInput {
  try {
    const parsed = myParser.start(s);
    return { input: parsed.command, ...parsed.args } as any;
  } catch (e) {
    console.log(e, 'Parsing error');
    return { input: 'invalidString' };
  }
}

export default parse;
