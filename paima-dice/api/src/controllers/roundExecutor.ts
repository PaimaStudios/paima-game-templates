import { Controller, Get, Query, Route, ValidateError } from 'tsoa';
import { requirePool, getLobbyById, getRoundMoves } from '@dice/db';
import { isLeft } from 'fp-ts/Either';
import { psqlInt } from '../validation.js';
import type { RoundExecutorBackendData } from '@dice/utils';
import { getBlockHeights } from '@paima/sdk/db';
import { getMatch, getRound } from '@dice/db/src/select.queries.js';

type Response = RoundExecutorBackendData | Error;

interface Error {
  error:
  | 'lobby not found'
  | 'bad round number'
  | 'round not found'
  | 'match not found'
  | 'internal error';
}

@Route('round_executor')
export class RoundExecutorController extends Controller {
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
    const [lobby] = await getLobbyById.run({ lobby_id: lobbyID }, pool);
    const [match] = await getMatch.run(
      { lobby_id: lobbyID, match_within_lobby: matchWithinLobby },
      pool
    );
    if (!lobby) {
      return { error: 'lobby not found' };
    }
    if (match == null) {
      return { error: 'match not found' };
    }

    const [last_round_data] =
      roundWithinMatch === 0
        ? [undefined]
        : await getRound.run(
          {
            lobby_id: lobbyID,
            match_within_lobby: matchWithinLobby,
            round_within_match: roundWithinMatch - 1,
          },
          pool
        );

    const seedBlockHeight =
      roundWithinMatch === 0
        ? match.starting_block_height
        : last_round_data?.execution_block_height;
    if (seedBlockHeight == null) {
      return { error: 'internal error' };
    }

    const [seedBlockRow] = await getBlockHeights.run({ block_heights: [seedBlockHeight] }, pool);
    const seed = seedBlockRow.seed;
    const moves = await getRoundMoves.run(
      {
        lobby_id: lobbyID,
        match_within_lobby: matchWithinLobby,
        round_within_match: roundWithinMatch,
      },
      pool
    );
    return {
      lobby,
      moves,
      seed,
    };
  }
}
