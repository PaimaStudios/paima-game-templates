import type { Pool } from 'pg';

import parse from './parser.js';
import type Prando from '@paima/sdk/prando';
import type { SubmittedChainData } from '@paima/sdk/utils';
import {
  createdLobby,
  joinedLobby,
  closedLobby,
  submittedMoves,
  scheduledData,
} from './transition';
import type { SQLUpdate } from '@paima/node-sdk/db';
import type { Events } from '@chess/events';
import { precompiles } from '@chess/precompiles';
import { JoinedLobby } from '@chess/events';
import { encodeEventForStf } from '@paima/events';

// entrypoint for your state machine
export default async function (
  inputData: SubmittedChainData,
  header: { blockHeight: number; timestamp: number },
  randomnessGenerator: Prando,
  dbConn: Pool
): Promise<{ stateTransitions: SQLUpdate[]; events: Events }> {
  console.log(inputData, 'parsing input data');
  const user = inputData.userAddress.toLowerCase();
  const parsed = parse(inputData.inputData);
  console.log(`Processing input string: ${inputData.inputData}`);
  console.log(`Input string parsed as: ${parsed.input}`);

  const events = [] as Events;

  switch (parsed.input) {
    case 'createdLobby':
      return {
        stateTransitions: await createdLobby(
          user,
          header.blockHeight,
          parsed,
          randomnessGenerator,
          events
        ),
        events,
      };
    case 'joinedLobby':
      events.push(
        encodeEventForStf({
          from: precompiles.default,
          topic: JoinedLobby,
          data: {
            lobbyId: parsed.lobbyID,
            player: user,
          },
        })
      );
      return {
        stateTransitions: await joinedLobby(user, header.blockHeight, parsed, dbConn),
        events,
      };
    case 'closedLobby':
      return { stateTransitions: await closedLobby(user, parsed, dbConn), events: [] };
    case 'submittedMoves':
      return {
        stateTransitions: await submittedMoves(
          user,
          header.blockHeight,
          parsed,
          dbConn,
          randomnessGenerator,
          events
        ),
        events,
      };
    case 'scheduledData': {
      if (!inputData.scheduled) return { stateTransitions: [], events: [] };

      return {
        stateTransitions: await scheduledData(
          header.blockHeight,
          parsed,
          dbConn,
          randomnessGenerator,
          events
        ),
        events,
      };
    }
    default:
      return { stateTransitions: [], events: [] };
  }
}
