import type { ParserRecord } from '@paima/sdk/concise';
import { PaimaParser } from '@paima/sdk/concise';
import type {
  ClosedLobbyInput,
  CreatedLobbyInput,
  JoinedLobbyInput,
  NftMintInput,
  ParsedSubmittedInput,
  PracticeMovesInput,
  SubmittedMovesInput,
  UserStats,
  ZombieRound,
} from './types';
import { SAFE_NUMBER } from '@dice/utils';
import { ENV } from '@paima/sdk/utils';

const myGrammar = `
nftMint             = nftmint|address|tokenId
createdLobby        = c|creatorNftId|numOfRounds|roundLength|playTimePerPlayer|isHidden?|isPractice?
joinedLobby         = j|nftId|*lobbyID
closedLobby         = cs|*lobbyID
submittedMoves      = s|nftId|*lobbyID|matchWithinLobby|roundWithinMatch|rollAgain
practiceMoves       = p|*lobbyID|matchWithinLobby|roundWithinMatch
zombieScheduledData = z|*lobbyID
userScheduledData   = u|*user|result
`;

const nftMint: ParserRecord<NftMintInput> = {
  address: PaimaParser.WalletAddress(),
  tokenId: PaimaParser.NumberParser(),
};
const createdLobby: ParserRecord<CreatedLobbyInput> = {
  creatorNftId: PaimaParser.NumberParser(),
  numOfRounds: PaimaParser.NumberParser(0, 1000),
  roundLength: PaimaParser.DefaultRoundLength(ENV.BLOCK_TIME),
  playTimePerPlayer: PaimaParser.NumberParser(1, 10000),
  isHidden: PaimaParser.TrueFalseParser(false),
  isPractice: PaimaParser.TrueFalseParser(false),
};
const joinedLobby: ParserRecord<JoinedLobbyInput> = {
  nftId: PaimaParser.NumberParser(),
  lobbyID: PaimaParser.NCharsParser(12, 12),
};
const closedLobby: ParserRecord<ClosedLobbyInput> = {
  lobbyID: PaimaParser.NCharsParser(12, 12),
};
const submittedMoves: ParserRecord<SubmittedMovesInput> = {
  nftId: PaimaParser.NumberParser(),
  lobbyID: PaimaParser.NCharsParser(12, 12),
  matchWithinLobby: PaimaParser.NumberParser(0, SAFE_NUMBER),
  roundWithinMatch: PaimaParser.NumberParser(0, SAFE_NUMBER),
  rollAgain: PaimaParser.TrueFalseParser(),
};
const practiceMoves: ParserRecord<PracticeMovesInput> = {
  lobbyID: PaimaParser.NCharsParser(12, 12),
  matchWithinLobby: PaimaParser.NumberParser(0, SAFE_NUMBER),
  roundWithinMatch: PaimaParser.NumberParser(0, SAFE_NUMBER),
};
const zombieScheduledData: ParserRecord<ZombieRound> = {
  renameCommand: 'scheduledData',
  effect: 'zombie',
  lobbyID: PaimaParser.NCharsParser(12, 12),
};
const userScheduledData: ParserRecord<UserStats> = {
  renameCommand: 'scheduledData',
  effect: 'stats',
  nftId: PaimaParser.NumberParser(),
  result: PaimaParser.RegexParser(/^[w|t|l]$/),
};

const parserCommands: Record<string, ParserRecord<ParsedSubmittedInput>> = {
  nftMint,
  createdLobby,
  joinedLobby,
  closedLobby,
  submittedMoves,
  practiceMoves,
  zombieScheduledData,
  userScheduledData,
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
