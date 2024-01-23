import { Controller, Get, Query, Route, ValidateError } from 'tsoa';
import { requirePool, getLobbyById, getRoundData, getRoundMoves } from '@chess/db';
import { isLeft } from 'fp-ts/Either';
import { psqlNum } from '../validation.js';
import type { RoundExecutorData } from '@chess/utils';
import { getBlockHeights } from '@paima/node-sdk/db';

type GetRoundExecutorResponse = RoundExecutorData | RoundExecutorError;

interface RoundExecutorError {
  error: 'lobby not found' | 'bad round number' | 'round not found';
}

@Route('round_executor')
export class RoundExecutorController extends Controller {
  @Get()
  public async get(@Query() lobbyID: string, @Query() round: number): Promise<GetRoundExecutorResponse> {
    const valRound = psqlNum.decode(round);
    if (isLeft(valRound) || !(round > 0)) {
      throw new ValidateError({ round: { message: 'invalid number' } }, '');
    }

    const pool = requirePool();
    const [lobby] = await getLobbyById.run({ lobby_id: lobbyID }, pool);
    if (!lobby) {
      return { error: 'lobby not found' };
    }

    const [round_data] = await getRoundData.run({ lobby_id: lobbyID, round_number: round }, pool);
    if (!round_data) {
      return { error: 'round not found' };
    }

    const [block_height] = await getBlockHeights.run(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      { block_heights: [round_data.execution_block_height!] },
      pool
    );
    const moves = await getRoundMoves.run({ lobby_id: lobbyID, round: round }, pool);
    return {
      lobby,
      match_state: round_data.match_state,
      moves,
      block_height,
    };
  }
}
