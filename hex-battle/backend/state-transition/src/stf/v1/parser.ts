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

const myGrammar = `
  createLobby         = c|numOfPlayers|units|buildings|gold|initTiles|map|timeLimit|roundLimit
  joinLobby           = j|*lobbyID
  submitMoves         = m|*lobbyID|roundNumber|move
  surrender           = x|*lobbyID
  zombieScheduledData = z|*lobbyID|roundNumber
`;

const createLobby: ParserRecord<CreateLobbyInput> = {
  numOfPlayers: PaimaParser.NumberParser(2, 5),
  units: PaimaParser.RegexParser(/^[ABCD]*$/),
  buildings: (_: string, input: string) => {
    if (!input) throw new Error('Invalid buildings (I)');
    if (!input.length) throw new Error('Invalid buildings (II)');
    const buildings = input.split('');
    const validBuildings = ['b', 'F', 'T', 't'];
    let baseCount = 0;
    buildings.forEach(b => {
      if (!validBuildings.includes(b)) throw new Error('Invalid buildings (III)');
      if (b === 'b') baseCount++;
    });
    if (baseCount !== 1) throw new Error('Invalid buildings (IV)');
    return input;
  },
  gold: PaimaParser.NumberParser(0, 9999),
  initTiles: PaimaParser.NumberParser(1, 100),
  timeLimit: PaimaParser.NumberParser(10, 9999),
  roundLimit: PaimaParser.NumberParser(10, 9999),
  map: (_: string, input: string) => {
    // map format q#r,q#r,q#r,...
    if (!input) throw new Error('Invalid map');
    const coords: { q: number; r: number; s: number }[] = input.split(',').map(part => {
      const parts = part.split('#');
      if (parts.length !== 2) throw new Error('Invalid coords');
      const q = parseInt(parts[0], 10);
      const r = parseInt(parts[1], 10);
      if (String(q) !== parts[0]) throw new Error('Invalid value I ' + parts.join(' '));
      if (String(r) !== parts[1]) throw new Error('Invalid value II ' + parts.join(' '));

      return { q, r, s: -(q + r) };
    });

    return JSON.stringify(coords);
  },
};
const joinLobby: ParserRecord<JoinLobbyInput> = {
  lobbyID: PaimaParser.NCharsParser(12, 12),
};
const surrender: ParserRecord<SurrenderInput> = {
  lobbyID: PaimaParser.NCharsParser(12, 12),
};
const submitMoves: ParserRecord<SubmitMovesInput> = {
  lobbyID: PaimaParser.NCharsParser(12, 12),
  roundNumber: PaimaParser.NumberParser(0, 9999),
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
      const build = part.match(/^([ABCDFtT])(-?\d+)#(-?\d+)$/);
      if (build) {
        // is command to build unit or building at target
        const targetQ = parseInt(build[2], 10);
        const targetR = parseInt(build[3], 10);
        const targetS = -(targetQ + targetR);
        return JSON.stringify({ targetQ, targetR, targetS, build: build[1] });
      }

      const move = part.match(/^(-?\d+)#(-?\d+)#(-?\d+)#(-?\d+)$/);
      if (move) {
        const targetQ = parseInt(move[1], 10);
        const targetR = parseInt(move[2], 10);
        const targetS = -(targetQ + targetR);
        const originQ = parseInt(move[3], 10);
        const originR = parseInt(move[4], 10);
        const originS = -(originQ + originR);
        return JSON.stringify({ targetQ, targetR, targetS, originQ, originR, originS });
      }
      throw new Error(`Invalid move: ${part}`);
    });
  },
};

const zombieScheduledData: ParserRecord<ZombieScheduledInput> = {
  lobbyID: PaimaParser.NCharsParser(12, 12),
  roundNumber: PaimaParser.NumberParser(0, 9999),
};

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
