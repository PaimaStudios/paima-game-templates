import type { ParserRecord } from '@paima/sdk/concise';
import { PaimaParser } from '@paima/sdk/concise';
import type {
  BotMove,
  ClosedLobbyInput,
  CreatedLobbyInput,
  JoinedLobbyInput,
  ParsedSubmittedInput,
  SubmittedMovesInput,
  UserStats,
  ZombieRound,
} from './types';
import { ENV } from '@paima/sdk/utils';

const myGrammar = `
createdLobby        = c|numOfRounds|roundLength|playTimePerPlayer|isHidden?|isPractice?|botDifficulty|playerOneIsWhite?
joinedLobby         = j|*lobbyID
closedLobby         = cs|*lobbyID
submittedMoves      = s|*lobbyID|roundNumber|pgnMove
zombieScheduledData = z|*lobbyID
userScheduledData   = u|*user|result|ratingChange
scheduledBotMove   = sb|*lobbyID|roundNumber
`;

const createdLobby: ParserRecord<CreatedLobbyInput> = {
  numOfRounds: PaimaParser.NumberParser(3, 1000),
  roundLength: PaimaParser.DefaultRoundLength(ENV.BLOCK_TIME),
  playTimePerPlayer: PaimaParser.NumberParser(1, 100000),
  isHidden: PaimaParser.TrueFalseParser(false),
  isPractice: PaimaParser.TrueFalseParser(false),
  botDifficulty: PaimaParser.NumberParser(0, 3),
  playerOneIsWhite: PaimaParser.TrueFalseParser(true),
};
const joinedLobby: ParserRecord<JoinedLobbyInput> = {
  lobbyID: PaimaParser.NCharsParser(12, 12),
};
const closedLobby: ParserRecord<ClosedLobbyInput> = {
  lobbyID: PaimaParser.NCharsParser(12, 12),
};
const submittedMoves: ParserRecord<SubmittedMovesInput> = {
  lobbyID: PaimaParser.NCharsParser(12, 12),
  roundNumber: PaimaParser.NumberParser(1, 10000),
  // PGN http://www.saremba.de/chessgml/standards/pgn/pgn-complete.htm
  // move validity checked by external library, out of scope for this parser.
  pgnMove: PaimaParser.NCharsParser(2, 255),
};
const zombieScheduledData: ParserRecord<ZombieRound> = {
  renameCommand: 'scheduledData',
  effect: 'zombie',
  lobbyID: PaimaParser.NCharsParser(12, 12),
};
const userScheduledData: ParserRecord<UserStats> = {
  renameCommand: 'scheduledData',
  effect: 'stats',
  user: PaimaParser.WalletAddress(),
  result: PaimaParser.RegexParser(/^[w|t|l]$/),
  ratingChange: PaimaParser.NumberParser(),
};
const scheduledBotMove: ParserRecord<BotMove> = {
  renameCommand: 'scheduledData',
  effect: 'move',
  lobbyID: PaimaParser.NCharsParser(12, 12),
  roundNumber: PaimaParser.NumberParser(1, 10000),
};

const parserCommands: Record<string, ParserRecord<ParsedSubmittedInput>> = {
  createdLobby,
  joinedLobby,
  closedLobby,
  submittedMoves,
  zombieScheduledData,
  userScheduledData,
  scheduledBotMove,
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
