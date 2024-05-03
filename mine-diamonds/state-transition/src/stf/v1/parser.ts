import { PaimaParser } from '@paima/sdk/concise';
import type { ParsedSubmittedInput } from './types';

const myGrammar = `
        submitMineAttempt      = m|
        orderCreated           = oc|payload
        orderFilled            = of|payload
        assetMinted            = am|payload
        assetTransferred       = at|payload
`;

const parserCommands = {
  joinWorld: {},
  submitMineAttempt: {},
  orderCreated: {
    payload: (_: string, input: string) => {
      return JSON.parse(input);
    },
  },
  orderFilled: {
    payload: (_: string, input: string) => {
      return JSON.parse(input);
    },
  },
  assetMinted: {
    payload: (_: string, input: string) => {
      return JSON.parse(input);
    },
  },
  assetTransferred: {
    payload: (_: string, input: string) => {
      return JSON.parse(input);
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
