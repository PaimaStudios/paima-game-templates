import type { ParserRecord } from '@paima/sdk/concise';
import { PaimaParser } from '@paima/sdk/concise';
import type {
  ClosedLobbyInput,
  CreatedLobbyInput,
  GenericPaymentInput,
  JoinedLobbyInput,
  NftMintInput,
  ParsedSubmittedInput,
  ParsedSubmittedInputRaw,
  PracticeMovesInput,
  SetTradeNftCardsInput,
  SubmittedMovesInput,
  TradeNftMintInput,
  TransferTradeNftInput,
  UserStatsInput,
  ZombieRoundInput,
} from './types';
import { SAFE_NUMBER } from '@cards/utils';
import { PARSER_KEYS, PARSER_PREFIXES } from '@cards/game-logic';
import type { ValuesType } from 'utility-types';

/** Grammar entry prefix */
function pref(key: ValuesType<typeof PARSER_KEYS>): string {
  return `${key} = ${PARSER_PREFIXES[key]}|`;
}

const myGrammar = `
${pref(PARSER_KEYS.accountMint)}address|tokenId
${pref(PARSER_KEYS.tradeNftMint)}address|tokenId
${pref(
  PARSER_KEYS.createdLobby
)}creatorNftId|creatorCommitments|numOfRounds|turnLength|isHidden?|isPractice?
${pref(PARSER_KEYS.joinedLobby)}nftId|*lobbyID|commitments
${pref(PARSER_KEYS.closedLobby)}*lobbyID
${pref(PARSER_KEYS.submittedMoves)}nftId|*lobbyID|matchWithinLobby|roundWithinMatch|move
${pref(PARSER_KEYS.practiceMoves)}*lobbyID|matchWithinLobby|roundWithinMatch
${pref(PARSER_KEYS.zombieScheduledData)}*lobbyID
${pref(PARSER_KEYS.userScheduledData)}*user|result
${pref(PARSER_KEYS.setTradeNftCards)}tradeNftId|cards
`;

const accountMint: ParserRecord<NftMintInput> = {
  address: PaimaParser.WalletAddress(),
  tokenId: PaimaParser.NumberParser(),
};
const tradeNftMint: ParserRecord<TradeNftMintInput> = {
  address: PaimaParser.WalletAddress(),
  tokenId: PaimaParser.NumberParser(),
};
const createdLobby: ParserRecord<CreatedLobbyInput> = {
  creatorNftId: PaimaParser.NumberParser(),
  creatorCommitments: PaimaParser.NCharsParser(0, 1000),
  numOfRounds: PaimaParser.NumberParser(0, 1000),
  turnLength: PaimaParser.NumberParser(1, 10000),
  isHidden: PaimaParser.TrueFalseParser(false),
  isPractice: PaimaParser.TrueFalseParser(false),
};
const joinedLobby: ParserRecord<JoinedLobbyInput> = {
  nftId: PaimaParser.NumberParser(),
  lobbyID: PaimaParser.NCharsParser(12, 12),
  commitments: PaimaParser.NCharsParser(0, 1000),
};
const closedLobby: ParserRecord<ClosedLobbyInput> = {
  lobbyID: PaimaParser.NCharsParser(12, 12),
};
const submittedMoves: ParserRecord<SubmittedMovesInput> = {
  nftId: PaimaParser.NumberParser(),
  lobbyID: PaimaParser.NCharsParser(12, 12),
  matchWithinLobby: PaimaParser.NumberParser(0, SAFE_NUMBER),
  roundWithinMatch: PaimaParser.NumberParser(0, SAFE_NUMBER),
  move: PaimaParser.NCharsParser(0, 1000),
};
const practiceMoves: ParserRecord<PracticeMovesInput> = {
  lobbyID: PaimaParser.NCharsParser(12, 12),
  matchWithinLobby: PaimaParser.NumberParser(0, SAFE_NUMBER),
  roundWithinMatch: PaimaParser.NumberParser(0, SAFE_NUMBER),
};
const zombieScheduledData: ParserRecord<ZombieRoundInput> = {
  lobbyID: PaimaParser.NCharsParser(12, 12),
};
const userScheduledData: ParserRecord<UserStatsInput> = {
  nftId: PaimaParser.NumberParser(),
  result: PaimaParser.RegexParser(/^[w|t|l]$/),
};
const setTradeNftCards: ParserRecord<SetTradeNftCardsInput> = {
  tradeNftId: PaimaParser.NumberParser(),
  cards: PaimaParser.ArrayParser({
    item: PaimaParser.NumberParser(),
  }),
};

const parserCommands: Partial<
  Record<ValuesType<typeof PARSER_KEYS>, ParserRecord<ParsedSubmittedInputRaw>>
> = {
  [PARSER_KEYS.accountMint]: accountMint,
  [PARSER_KEYS.tradeNftMint]: tradeNftMint,
  [PARSER_KEYS.createdLobby]: createdLobby,
  [PARSER_KEYS.joinedLobby]: joinedLobby,
  [PARSER_KEYS.closedLobby]: closedLobby,
  [PARSER_KEYS.submittedMoves]: submittedMoves,
  [PARSER_KEYS.practiceMoves]: practiceMoves,
  [PARSER_KEYS.zombieScheduledData]: zombieScheduledData,
  [PARSER_KEYS.userScheduledData]: userScheduledData,
  [PARSER_KEYS.setTradeNftCards]: setTradeNftCards,
};

/**
 * PaimaParser seems unable to accept some of the characters in stringified JSON
 * so we parse it manually here.
 */
function manualParse(input: string): undefined | GenericPaymentInput | TransferTradeNftInput {
  const parts = input.split('|');

  if (parts.length !== 2) return;

  const manuallyParsedPrefixes: string[] = [
    PARSER_PREFIXES[PARSER_KEYS.genericPayment],
    PARSER_PREFIXES[PARSER_KEYS.transferTradeNft],
  ];
  if (!manuallyParsedPrefixes.includes(parts[0])) return;

  try {
    const parsed = JSON.parse(parts[1]);

    if (parts[0] === PARSER_PREFIXES[PARSER_KEYS.genericPayment]) {
      if (
        !Object.hasOwn(parsed, 'message') ||
        !Object.hasOwn(parsed, 'payer') ||
        !Object.hasOwn(parsed, 'amount') ||
        typeof parsed.message !== 'string' ||
        typeof parsed.payer !== 'string' ||
        typeof parsed.amount !== 'string'
      ) {
        return;
      }
      const amount = BigInt(parsed.amount);

      return {
        input: PARSER_KEYS.genericPayment,
        message: parsed.message,
        payer: parsed.payer,
        amount,
      };
    }

    if (parts[0] === PARSER_PREFIXES[PARSER_KEYS.transferTradeNft]) {
      if (
        !Object.hasOwn(parsed, 'from') ||
        !Object.hasOwn(parsed, 'to') ||
        !Object.hasOwn(parsed, 'tokenId') ||
        typeof parsed.from !== 'string' ||
        typeof parsed.to !== 'string' ||
        typeof parsed.tokenId !== 'string'
      ) {
        return;
      }
      const tradeNftId = Number.parseInt(parsed.tokenId);

      return {
        input: PARSER_KEYS.transferTradeNft,
        from: parsed.from,
        to: parsed.to,
        tradeNftId,
      };
    }
  } catch (e) {
    return;
  }
}

const myParser = new PaimaParser(myGrammar, parserCommands);

function parse(s: string): ParsedSubmittedInput {
  const manuallyParsed = manualParse(s);
  if (manuallyParsed != null) return manuallyParsed;

  try {
    const parsed = myParser.start(s);
    if (parsed.command === PARSER_KEYS.createdLobby) {
      const { creatorCommitments, ...rest } = parsed.args;
      return {
        input: parsed.command,
        ...(rest as any),
        creatorCommitments: new Uint8Array(Buffer.from(creatorCommitments as string, 'base64')),
      };
    }

    if (parsed.command === PARSER_KEYS.joinedLobby) {
      const { commitments, ...rest } = parsed.args;

      return {
        input: parsed.command,
        ...(rest as any),
        commitments: new Uint8Array(Buffer.from(commitments as string, 'base64')),
      };
    }

    return { input: parsed.command, ...parsed.args } as any;
  } catch (e) {
    console.log(e, 'Parsing error');
    return { input: 'invalidString' };
  }
}

export default parse;
