import { Controller, Get, Query, Route } from 'tsoa';

import type {
  IGetOpenLobbiesResult,
  IGetLobbyPlayersResult,
  IGetLobbyRoundsResult,
  IGetLatestCreatedLobbyResult,
  IGetMyActiveLobbiesResult,
  IGetLobbyLeanResult,
  IGetLobbyMapResult,
} from '@hexbattle/db';

import {
  getLobbyLean,
  getLobbyMap,
  getOpenLobbies,
  requirePool,
  getLobbyPlayers,
  getLobbyRounds,
  getLatestCreatedLobby,
  getMyActiveLobbies,
  myJoinedGames,
} from '@hexbattle/db';

@Route('lobby')
export class LobbyController extends Controller {
  @Get()
  public async getOpen(@Query() wallet: string): Promise<{
    lobbies: IGetOpenLobbiesResult[];
  }> {
    const pool = requirePool();
    const lobbies = await getOpenLobbies.run(undefined, pool);

    const joined = (
      await Promise.all(
        lobbies.map(l => {
          return myJoinedGames.run(
            {
              lobby_id: l.lobby_id,
              player_wallet: wallet,
            },
            pool
          );
        })
      )
    ).flat();

    // substract lobbies - myJoinedGames
    return {
      lobbies: lobbies.filter(l => !joined.find(j => j.lobby_id === l.lobby_id)),
    };
  }

  @Get('/my_games')
  public async getMyGames(@Query() wallet: string): Promise<{
    lobbies: IGetMyActiveLobbiesResult[];
  }> {
    const pool = requirePool();
    const lobbies = await getMyActiveLobbies.run({ player_wallet: wallet }, pool);

    const players = (
      await Promise.all(lobbies.map(l => getLobbyPlayers.run({ lobby_id: l.lobby_id }, pool)))
    ).flat();

    lobbies.forEach(l => {
      (l as any).activePlayers = players.filter(p => p.lobby_id === l.lobby_id).length;
    });

    return { lobbies };
  }

  @Get('/map')
  public async getLobbyMap(@Query() lobby_id: string): Promise<{
    lobby: IGetLobbyMapResult;
  }> {
    const pool = requirePool();
    const [lobby] = await getLobbyMap.run({ lobby_id }, pool);
    return { lobby };
  }

  @Get('/id')
  public async getLobby(@Query() lobby_id: string): Promise<{
    lobby: IGetLobbyLeanResult;
    players: IGetLobbyPlayersResult[];
    rounds: IGetLobbyRoundsResult[];
  }> {
    const pool = requirePool();
    const [lobby] = await getLobbyLean.run({ lobby_id }, pool);
    const players = await getLobbyPlayers.run({ lobby_id }, pool);
    const rounds = await getLobbyRounds.run({ lobby_id }, pool);
    return { lobby, players, rounds };
  }

  @Get('/get_latest_created_lobby')
  public async getLatestCreatedLobby(@Query() wallet: string): Promise<{
    lobby: IGetLatestCreatedLobbyResult;
  }> {
    const pool = requirePool();
    const [lobby] = await getLatestCreatedLobby.run(
      {
        lobby_creator: wallet,
      },
      pool
    );

    return { lobby };
  }
}
