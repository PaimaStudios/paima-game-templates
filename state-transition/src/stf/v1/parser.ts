import { PaimaParser } from '@paima/sdk/concise';
import type { InvalidInput, ParsedSubmittedInput } from './types.js';

const myGrammar = `gainedExperience = xp|*address|experience`;

const parserCommands = {
  gainedExperience: {
    address: PaimaParser.WalletAddress(),
    experience: PaimaParser.NumberParser(1, 5),
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
