import { Controller, Get, Query, Route, ValidateError } from 'tsoa';
import { requirePool, getLobbyById, getRoundMoves } from '@dice/db';
import { isLeft } from 'fp-ts/Either';
import { psqlInt } from '../validation.js';
import type { RoundStatusData } from '@dice/utils';
import { getRound } from '@dice/db/src/select.queries.js';

type Response = RoundStatusData | Error;

interface Error {
  error: 'round not found' | 'lobby not found';
}

@Route('round_status')
export class RoundStatusController extends Controller {
  @Get()
  public async get(
    @Query() lobbyID: string,
    @Query() matchWithinLobby: number,
    @Query() roundWithinMatch: number
  ): Promise<Response> {
    const valMatch = psqlInt.decode(matchWithinLobby);
    if (isLeft(valMatch)) {
      throw new ValidateError({ matchWithinLobby: { message: 'invalid number' } }, '');
    }
    const valRound = psqlInt.decode(roundWithinMatch);
    if (isLeft(valRound)) {
      throw new ValidateError({ roundWithinMatch: { message: 'invalid number' } }, '');
    }

    const pool = requirePool();

    const [roundData] = await getRound.run(
      {
        lobby_id: lobbyID,
        match_within_lobby: matchWithinLobby,
        round_within_match: roundWithinMatch,
      },
      pool
    );
    const [lobby] = await getLobbyById.run({ lobby_id: lobbyID }, pool);
    if (!lobby || !roundData) return { error: 'lobby not found' };
    else {
      const moves = await getRoundMoves.run(
        {
          lobby_id: lobbyID,
          match_within_lobby: matchWithinLobby,
          round_within_match: roundWithinMatch,
        },
        pool
      );
      const uniqueIds = Array.from(new Set(moves.map(m => m.nft_id)));
      return {
        executed: !!roundData.execution_block_height,
        usersWhoSubmittedMoves: uniqueIds,
        roundStarted: roundData.starting_block_height,
        roundLength: lobby.round_length,
      };
    }
  }
}
