import { PaimaParser } from '@paima/sdk/concise';
import type { ParsedSubmittedInput } from './types';

const myGrammar = `
        joinWorld       = j|
        submitMove      = @m||x|y
        submitIncrement = i|*x|*y
`;

const parserCommands = {
  joinWorld: {},
  submitMove: {
    x: PaimaParser.NumberParser(0, 100),
    y: PaimaParser.NumberParser(0, 100),
  },
  submitIncrement: {
    x: PaimaParser.NumberParser(0, 100),
    y: PaimaParser.NumberParser(0, 100),
  },
};

const myParser = new PaimaParser(myGrammar, parserCommands);

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
