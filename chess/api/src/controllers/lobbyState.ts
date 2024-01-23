import { Controller, Get, Query, Route } from 'tsoa';
import { getLobbyById, getRoundData, requirePool } from '@chess/db';
import type { Timer } from '@chess/utils';
import { updateTimer, type LobbyStateQuery } from '@chess/utils';
import { getLobbyRounds } from '@chess/db';
import { getLatestProcessedBlockHeight } from '@paima/node-sdk/db';

interface GetLobbyStateResponse {
  lobby: LobbyStateQuery | null;
}

@Route('lobby_state')
export class LobbyStateController extends Controller {
  @Get()
  public async get(@Query() lobbyID: string): Promise<GetLobbyStateResponse> {
    const pool = requirePool();
    const [lobby] = await getLobbyById.run({ lobby_id: lobbyID }, pool);
    if (!lobby) return { lobby: null };

    const [[round_data], [latestBlockHeight], lobbyRounds] = await Promise.all([
      getRoundData.run({ lobby_id: lobbyID, round_number: lobby.current_round }, pool),
      getLatestProcessedBlockHeight.run(undefined, pool),
      getLobbyRounds.run({ lobby_id: lobbyID }, pool),
    ]);

    const initialTimer: Timer = {
      player_one_blocks_left: lobby.play_time_per_player,
      player_two_blocks_left: lobby.play_time_per_player,
    };
    const latestRound = lobbyRounds[lobbyRounds.length - 1];
    const timer = updateTimer(
      latestRound ?? initialTimer,
      latestBlockHeight.block_height,
      lobby.player_one_iswhite
    );

    return {
      lobby: {
        ...lobby,
        round_start_height: round_data?.starting_block_height || 0,
        remaining_blocks: {
          w: lobby.player_one_iswhite ? timer.player_one_blocks_left : timer.player_two_blocks_left,
          b: lobby.player_one_iswhite ? timer.player_two_blocks_left : timer.player_one_blocks_left,
        },
      },
    };
  }
}
