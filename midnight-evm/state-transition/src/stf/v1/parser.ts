import type { ParserRecord } from '@paima/sdk/concise.js';
import { PaimaParser } from '@paima/sdk/concise.js';
import type { MidnightIncrementInput, ParsedSubmittedInput, EvmIncrementInput } from './types.js';

const myGrammar = `
  midnightIncrement = midnight_increment|raw
  evmIncrement = evm|wallet
`;

const midnightIncrement: ParserRecord<MidnightIncrementInput> = {
  // raw = {"tag":"array","content":[{"tag":"cell","content":{"value":[{"0":7}],"alignment":[{"tag":"bytes","length":8}]}}]}
  raw: PaimaParser.NCharsParser(1, 2000),
};

const evmIncrement: ParserRecord<EvmIncrementInput> = {
  // wallet = "abc1234"
  wallet: PaimaParser.WalletAddress(),
};

const parserCommands: Record<string, ParserRecord<ParsedSubmittedInput>> = {
  midnightIncrement,
  evmIncrement,
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
