import { Controller, Get, Path, Post, Query, Route, SuccessResponse } from 'tsoa';
import { requirePool, getLobbyById, getMatchSeeds, getMovesByLobby } from '@chess/db';
import type { MatchExecutorData } from '@chess/utils';

type GetMatchExecutorResponse = MatchExecutorData | null;

@Route('match_executor')
export class MatchExecutorController extends Controller {
  @Get()
  public async get(@Query() lobbyID: string): Promise<GetMatchExecutorResponse> {
    const pool = requirePool();
    const [lobby] = await getLobbyById.run({ lobby_id: lobbyID }, pool);
    if (!lobby) {
      return null;
    }

    const rounds = await getMatchSeeds.run({ lobby_id: lobbyID }, pool);
    const seeds = rounds.map(round => ({
      seed: round.seed,
      block_height: round.block_height,
      round: round.round_within_match,
    }));
    const moves = await getMovesByLobby.run({ lobby_id: lobbyID }, pool);
    return { lobby, seeds, moves };
  }
}
