import { PaimaParser } from '@paima/sdk/concise';
import type { ParsedSubmittedInput } from './types';

const myGrammar = `
        purchase_item = @pay|wallet|item_id|amount
`;

const parserCommands = {
  purchase_item: {
    wallet: PaimaParser.WalletAddress(),
    item_id: PaimaParser.NumberParser(1, 1000),
    amount: PaimaParser.NumberParser(1, 10000000),
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
