import { Controller, Get, Query, Route } from 'tsoa';
import { getLobbyById, getLobbyPlayers, requirePool } from '@dice/db';
import { isLobbyWithStateProps, type LobbyPlayer, type LobbyState } from '@dice/utils';
import { getMatch, getRound } from '@dice/db/src/select.queries';
import { getBlockHeights } from '@paima/node-sdk/db';

interface getLobbyStateResponse {
  // returns null if missing state properties, use lobbyRaw for any lobby
  lobby: LobbyState | null;
}

@Route('lobby_state')
export class LobbyStateController extends Controller {
  @Get()
  public async get(@Query() lobbyID: string): Promise<getLobbyStateResponse> {
    const pool = requirePool();
    const [[lobby], rawPlayers] = await Promise.all([
      getLobbyById.run({ lobby_id: lobbyID }, pool),
      getLobbyPlayers.run({ lobby_id: lobbyID }, pool),
    ]);
    if (!lobby) return { lobby: null };

    if (!isLobbyWithStateProps(lobby)) return { lobby: null };

    const [match] = await getMatch.run(
      {
        lobby_id: lobbyID,
        match_within_lobby: lobby.current_match,
      },
      pool
    );

    const [last_round_data] =
      lobby.current_round === 0
        ? [undefined]
        : await getRound.run(
          {
            lobby_id: lobbyID,
            match_within_lobby: lobby.current_match,
            round_within_match: lobby.current_round - 1,
          },
          pool
        );

    const seedBlockHeight =
      lobby.current_round === 0
        ? match.starting_block_height
        : last_round_data?.execution_block_height;

    if (seedBlockHeight == null) {
      return { lobby: null };
    }
    const [seedBlockRow] = await getBlockHeights.run({ block_heights: [seedBlockHeight] }, pool);
    const roundSeed = seedBlockRow.seed;

    const players: LobbyPlayer[] = rawPlayers.map(raw => ({
      nftId: raw.nft_id,
      points: raw.points,
      score: raw.score,
      turn: raw.turn ?? undefined,
    }));

    return {
      lobby: {
        ...lobby,
        roundSeed,
        players,
      },
    };
  }
}
