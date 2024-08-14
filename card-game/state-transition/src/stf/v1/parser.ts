import { PaimaParser } from '@paima/sdk/concise';
import type { ParsedSubmittedInput } from './types';

const myGrammar = `
        click = click|*card
        tick = tick|n
`;

const parserCommands = {
  tick: {
    n: PaimaParser.NumberParser(0),
  },
  click: {
    card: PaimaParser.NumberParser(0, 10),
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
