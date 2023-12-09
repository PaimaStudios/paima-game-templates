import type { MatchExecutor, RoundExecutor } from '@paima/sdk/executors';
import { matchExecutor } from '@paima/sdk/executors';
import Prando from '@paima/sdk/prando';

import { extractMatchEnvironment, initRoundExecutor, processTick } from '@dice/game-logic';
import {
  type MatchExecutorData,
  type RoundExecutorData,
  type MatchState,
  type TickEvent,
  genPermutation,
} from '@dice/utils';

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
      turn: matchTurnOrder[i],
      points: 0,
      score: 0,
    })),
    properRound: 0,
    turn: 0,
    result: undefined,
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
