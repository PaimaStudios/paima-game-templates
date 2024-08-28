import { PaimaParser } from '@paima/sdk/concise';
import type { ParsedSubmittedInput } from './types';

const myGrammar = `
        createLocation = @c|lat|lon|title|description
`;

const parserCommands = {
  createLocation: {
    lat: PaimaParser.NCharsParser(1, 40),
    lon: PaimaParser.NCharsParser(1, 40),
    title: PaimaParser.NCharsParser(1,100),
    description: PaimaParser.NCharsParser(1,1000),
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
