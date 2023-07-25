import type { InvalidInput } from '@game/utils';
import { PaimaParser } from 'paima-sdk/paima-concise';
import type { ParsedSubmittedInput } from './types';

const myGrammar = `
changedName = r|*address|name
gainedExperience = xp|*address|experience
`;

const parserCommands = {
  gainedExperience: {
    address: PaimaParser.WalletAddress(),
    experience: PaimaParser.NumberParser(1, 999),
  },
  changedName: {
    address: PaimaParser.WalletAddress(),
    name: PaimaParser.NCharsParser(1, 50),
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
