import type { ParserRecord } from '@paima/sdk/concise';
import type { ParsedSubmittedInput } from './types';

import { PaimaParser } from '@paima/sdk/concise';
import type {
  CreateLobbyInput,
  JoinLobbyInput,
  SubmitMovesInput,
  SurrenderInput,
  ZombieScheduledInput,
} from './types';
// import { ENV } from '@paima/sdk/utils';

const myGrammar = `
  createLobby         = c|numOfPlayers
  joinLobby           = j|*lobbyID
  submitMoves         = m|*lobbyID|roundNumber|move
  surrender           = x|*lobbyID
  zombieScheduledData = z|*lobbyID
`;

const createLobby: ParserRecord<CreateLobbyInput> = {
  numOfPlayers: PaimaParser.NumberParser(2, 4),
};
const joinLobby: ParserRecord<JoinLobbyInput> = {
  lobbyID: PaimaParser.NCharsParser(12, 12),
};
const surrender: ParserRecord<SurrenderInput> = {
  lobbyID: PaimaParser.NCharsParser(12, 12),
};
const submitMoves: ParserRecord<SubmitMovesInput> = {
  lobbyID: PaimaParser.NCharsParser(12, 12),
  roundNumber: PaimaParser.NumberParser(1, 10000),
  move: (_: string, input: string) => {
    const parts = input.split(',');
    // format1: [build_type][q_target]#[r_target]
    // format2: [q_target]#[r_target]#[q_origin]#[r_origin]
    // e.g., move unit 0,0,0 to 1,-1,0 => 0#0#1#-1
    // e.g., build unit A at 0,0,0 => A0#0
    //
    // q: int, r: int, NOTE: s = -(q + r)
    //
    // build_type:
    //   Built Unit Power1: "A" Power2: "B" Power3: "C" Power4: "D"
    //   Build Farm "F"
    //   Build Tower "t" | "T" {tower 1 or 2}

    return parts.map(part => {
      const build = part.match(/^([ABCDFtT])(-?\d+)(-?\d+)$/);
      if (build) {
        // is command to build unit or building at target
        const targetQ = parseInt(build[1], 10);
        const targetR = parseInt(build[2], 10);
        const targetS = -(targetQ + targetR);
        return JSON.stringify({ targetQ, targetR, targetS, build: build[0] });
      }

      const move = part.match(/^(-?\d+)#(-?\d+)#(-?\d+)#(-?\d+)$/);
      if (move) {
        const targetQ = parseInt(move[1], 10);
        const targetR = parseInt(move[2], 10);
        const targetS = -(targetQ + targetR);
        const originQ = parseInt(move[3], 10);
        const originR = parseInt(move[4], 10);
        const originS = -(originQ + originR);
        JSON.stringify({ targetQ, targetR, targetS, originQ, originR, originS });
      }
      throw new Error(`Invalid move: ${part}`);
    });
  },
};
// const closedLobby: ParserRecord<ClosedLobbyInput> = {
//   lobbyID: PaimaParser.NCharsParser(12, 12),
// };
// const submittedMoves: ParserRecord<SubmittedMovesInput> = {
//   lobbyID: PaimaParser.NCharsParser(12, 12),
//   roundNumber: PaimaParser.NumberParser(1, 10000),
//   // PGN http://www.saremba.de/chessgml/standards/pgn/pgn-complete.htm
//   // move validity checked by external library, out of scope for this parser.
//   pgnMove: PaimaParser.NCharsParser(2, 255),
// };
const zombieScheduledData: ParserRecord<ZombieScheduledInput> = {
  lobbyID: PaimaParser.NCharsParser(12, 12),
};
// const userScheduledData: ParserRecord<UserStats> = {
//   renameCommand: 'scheduledData',
//   effect: 'stats',
//   user: PaimaParser.WalletAddress(),
//   result: PaimaParser.RegexParser(/^[w|t|l]$/),
//   ratingChange: PaimaParser.NumberParser(),
// };
// const scheduledBotMove: ParserRecord<BotMove> = {
//   renameCommand: 'scheduledData',
//   effect: 'move',
//   lobbyID: PaimaParser.NCharsParser(12, 12),
//   roundNumber: PaimaParser.NumberParser(1, 10000),
// };

const parserCommands: Record<string, ParserRecord<ParsedSubmittedInput>> = {
  createLobby,
  joinLobby,
  surrender,
  submitMoves,
  zombieScheduledData,
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
