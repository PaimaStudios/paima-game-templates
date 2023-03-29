import type { ParserRecord } from 'paima-sdk/paima-utils-backend';
import { PaimaParser } from 'paima-sdk/paima-utils-backend';
import type {
  ClosedLobbyInput,
  CreatedLobbyInput,
  JoinedLobbyInput,
  ParsedSubmittedInput,
  SubmittedMovesInput,
  UserStats,
  ZombieRound,
} from './types';

const myGrammar = `
createdLobby        = c|numOfRounds|roundLength|playTimePerPlayer|isHidden?|isPractice?|playerOneIsWhite?
joinedLobby         = j|*lobbyID
closedLobby         = cs|*lobbyID
submittedMoves      = s|*lobbyID|roundNumber|pgnMove
zombieScheduledData = z|*lobbyID
userScheduledData   = u|*user|result
`;

const createdLobby: ParserRecord<CreatedLobbyInput> = {
  numOfRounds: PaimaParser.NumberParser(3, 1000),
  roundLength: PaimaParser.DefaultRoundLength(),
  playTimePerPlayer: PaimaParser.NumberParser(1, 10000),
  isHidden: PaimaParser.TrueFalseParser(false),
  isPractice: PaimaParser.TrueFalseParser(false),
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
  pgnMove: PaimaParser.RegexParser(/^[a-zA-Z0-9 ]+$/),
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
};

const parserCommands: Record<string, ParserRecord<ParsedSubmittedInput>> = {
  createdLobby,
  joinedLobby,
  closedLobby,
  submittedMoves,
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
