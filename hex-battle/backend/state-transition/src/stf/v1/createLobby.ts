import type {
  ICreateLobbyParams,
  IAddPlayerToLobbyParams,
  ICreatePlayerParams,
} from '@hexbattle/db';
import { addPlayerToLobby, createPlayer, getPlayerByWallet } from '@hexbattle/db';
import type { SQLUpdate } from '@paima/sdk/db';
import type Prando from '@paima/sdk/prando';
import type { WalletAddress } from '@paima/sdk/utils';
import type { Pool } from 'pg';
import type { CreateLobbyInput } from './types';
import { createLobby as _createLobby } from '@hexbattle/db';

export async function createLobby(
  user: WalletAddress,
  blockHeight: number,
  parsed: CreateLobbyInput,
  dbConn: Pool,
  randomnessGenerator: Prando
): Promise<SQLUpdate[]> {
  const lobby_id = randomnessGenerator.nextString(12);
  const numOfPlayers = parsed.numOfPlayers;
  const sql: SQLUpdate[] = [];

  const _createLobbyParams: ICreateLobbyParams = {
    created_at: new Date(),
    creation_block_height: blockHeight,
    lobby_creator: user,
    lobby_id,
    map: parsed.map,
    num_of_players: numOfPlayers,
    buildings: parsed.buildings,
    gold: parsed.gold,
    init_tiles: parsed.initTiles,
    round_limit: parsed.roundLimit,
    time_limit: parsed.timeLimit,
    units: parsed.units,
  };

  const addPlayerToLobbyParams: IAddPlayerToLobbyParams = {
    lobby_id,
    player_wallet: user,
  };

  const createLobbySQL: SQLUpdate = [_createLobby, _createLobbyParams];
  const addPlayerToLobbySQL: SQLUpdate = [addPlayerToLobby, addPlayerToLobbyParams];
  sql.push(createLobbySQL);
  sql.push(addPlayerToLobbySQL);

  // leaderboard
  const [player] = await getPlayerByWallet.run({ wallet: user }, dbConn);
  if (!player) {
    const createPlayerParams: ICreatePlayerParams = {
      block_height: blockHeight,
      wallet: user,
    };
    const addPlayerToSQL: SQLUpdate = [createPlayer, createPlayerParams];
    sql.push(addPlayerToSQL);
  }

  return sql;
}
