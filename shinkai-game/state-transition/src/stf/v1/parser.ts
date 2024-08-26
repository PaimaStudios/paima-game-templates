import { PaimaParser } from '@paima/sdk/concise';
import type { ParsedSubmittedInput } from './types';

const myGrammar = `
        newGame = g|*x
        ai = ai|target|id|response
        tick = tick|n
`;

const parserCommands = {
  tick: {
    n: PaimaParser.NumberParser(0),
  },
  ai: {
    target: PaimaParser.NCharsParser(0, 100),
    id: PaimaParser.NumberParser(1, 100000),
    response: PaimaParser.NCharsParser(0, 1000),
  },
  newGame: {
    x: (_: string, input: string) => {
      if (input === 'x') return true;
      throw new Error('constant parameter expected');
    },
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
