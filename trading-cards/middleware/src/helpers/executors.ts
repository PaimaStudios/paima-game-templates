import type { MatchExecutor, RoundExecutor } from '@paima/sdk/executors';
import { matchExecutor } from '@paima/sdk/executors';
import Prando from '@paima/sdk/prando';

import {
  INITIAL_HIT_POINTS,
  extractMatchEnvironment,
  initRoundExecutor,
  initialCurrentDeck,
  processTick,
} from '@cards/game-logic';
import {
  type MatchExecutorData,
  type RoundExecutorData,
  type MatchState,
  type TickEvent,
  genPermutation,
} from '@cards/game-logic';

export function buildRoundExecutor(data: RoundExecutorData): RoundExecutor<MatchState, TickEvent> {
  const seed = data.seed;
  const randomnessGenerator = new Prando(seed);
  return initRoundExecutor(data.lobby, data.matchState, data.moves, randomnessGenerator);
}

export function buildMatchExecutor({
  lobby,
  moves,
  seeds,
}: MatchExecutorData): MatchExecutor<MatchState, TickEvent> {
  console.log(seeds, 'seeds used for the match executor at the middleware');

  const randomnessGenerator = new Prando(seeds[0].seed);
  const matchTurnOrder = genPermutation(lobby.players.length, randomnessGenerator);
  const initialState: MatchState = {
    players: lobby.players.map((player, i) => ({
      nftId: player.nftId,
      hitPoints: INITIAL_HIT_POINTS,
      startingCommitments: player.startingCommitments,
      currentDeck: initialCurrentDeck(),
      currentHand: [],
      currentBoard: [],
      currentDraw: 0,
      currentResult: undefined,
      botLocalDeck: player.botLocalDeck,
      turn: matchTurnOrder[i],
    })),
    properRound: 0,
    turn: 0,
    txEventMove: undefined,
  };

  const paimaMoves = moves.map(move => ({
    ...move,
    round: move.round_within_match,
  }));

  return matchExecutor.initialize(
    extractMatchEnvironment(lobby),
    lobby.num_of_rounds,
    initialState,
    seeds,
    paimaMoves,
    processTick
  );
}
