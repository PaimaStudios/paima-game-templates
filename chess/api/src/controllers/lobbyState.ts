import { Controller, Get, Query, Route } from 'tsoa';
import { getLobbyById, getRoundData, requirePool } from '@chess/db';
import type { LobbyStateQuery } from '@chess/utils';
import { getLobbyRounds } from '@chess/db/src/select.queries';
import { getLatestProcessedBlockHeight } from 'paima-sdk/paima-db';

interface Response {
  lobby: LobbyStateQuery | null;
}

// TODO: final match state player_one_elapsed_time and player_two_elapsed_time
// TODO: lobby state -> w: {...}, b: {...} for easier FE handling?
@Route('lobby_state')
export class LobbyStatecontroller extends Controller {
  @Get()
  public async get(@Query() lobbyID: string): Promise<Response> {
    const pool = requirePool();
    const [lobby] = await getLobbyById.run({ lobby_id: lobbyID }, pool);
    if (!lobby) return { lobby: null };

    const [[round_data], [latestBlockHeight], lobbyRounds] = await Promise.all([
      getRoundData.run({ lobby_id: lobbyID, round_number: lobby.current_round }, pool),
      getLatestProcessedBlockHeight.run(undefined, pool),
      getLobbyRounds.run({ lobby_id: lobbyID }, pool),
    ]);

    const elapsedTime = lobbyRounds.reduce(
      (acc, { round_within_match, starting_block_height, execution_block_height }) => {
        const executionBlock = execution_block_height ?? latestBlockHeight.block_height;
        const elapsedBlocks = executionBlock - starting_block_height;
        if (round_within_match % 2 === 1) {
          return {
            ...acc,
            player_one: acc.player_one + elapsedBlocks,
          };
        } else {
          return {
            ...acc,
            player_two: acc.player_two + elapsedBlocks,
          };
        }
      },
      { player_one: 0, player_two: 0 }
    );

    return {
      lobby: {
        ...lobby,
        round_start_height: round_data?.starting_block_height || 0,
        remaining_blocks: {
          player_one: lobby.play_time_per_player - elapsedTime.player_one,
          player_two: lobby.play_time_per_player - elapsedTime.player_two,
        },
      },
    };
  }
}
