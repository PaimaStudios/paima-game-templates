import type {
  IGetPlayersByGamesPlayedResult,
  IGetPlayersByLatestResult,
  IGetPlayersByWinsResult,
} from '@hexbattle/db';
import {
  getPlayerByWallet,
  getPlayersByGamesPlayed,
  getPlayersByLatest,
  getPlayersByWins,
  requirePool,
} from '@hexbattle/db';
import { Controller, Get, Query, Route } from 'tsoa';

@Route('leaderboard')
export class LeaderboardController extends Controller {
  @Get('/wins')
  public async getLeaderboardByWins(@Query() wallet: string): Promise<{
    players: IGetPlayersByWinsResult[];
  }> {
    const pool = requirePool();
    const players = await getPlayersByWins.run(
      {
        limit: 100,
        offset: 0,
      },
      pool
    );

    players.forEach((p, index) => {
      (p as any).rank = String(index + 1);
    });

    if (wallet && !players.find(p => p.wallet === wallet)) {
      const [me] = await getPlayerByWallet.run({ wallet }, pool);
      if (me) {
        (me as any).rank = '-';
        players.push(me);
        players.sort((a, b) => b.wins - a.wins);
      }
    }

    return { players };
  }

  @Get('/played')
  public async getLeaderboardByPlayed(@Query() wallet: string): Promise<{
    players: IGetPlayersByGamesPlayedResult[];
  }> {
    const pool = requirePool();
    const players = await getPlayersByGamesPlayed.run(
      {
        limit: 100,
        offset: 0,
      },
      pool
    );

    players.forEach((p, index) => {
      (p as any).rank = String(index + 1);
    });

    if (wallet && !players.find(p => p.wallet === wallet)) {
      const [me] = await getPlayerByWallet.run({ wallet }, pool);
      if (me) {
        (me as any).rank = '-';
        players.push(me);
        players.sort((a, b) => b.played_games - a.played_games);
      }
    }

    return { players };
  }

  @Get('/latest')
  public async getLeaderboardByLatest(@Query() wallet: string): Promise<{
    players: IGetPlayersByLatestResult[];
  }> {
    const pool = requirePool();
    const players = await getPlayersByLatest.run(
      {
        limit: 100,
        offset: 0,
      },
      pool
    );

    players.forEach((p, index) => {
      (p as any).rank = String(index + 1);
    });

    if (wallet && !players.find(p => p.wallet === wallet)) {
      const [me] = await getPlayerByWallet.run({ wallet }, pool);
      if (me) {
        (me as any).rank = '-';
        players.push(me);
        players.sort((a, b) => b.last_block_height - a.last_block_height);
      }
    }
    return { players };
  }
}
