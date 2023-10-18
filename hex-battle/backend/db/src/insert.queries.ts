/** Types generated for queries found in "src/queries/insert.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type DateOrString = Date | string;

/** 'CreateLobby' parameters type */
export interface ICreateLobbyParams {
  buildings: string;
  created_at: DateOrString;
  creation_block_height: number;
  gold: number;
  init_tiles: number;
  lobby_creator: string;
  lobby_id: string;
  map: string;
  num_of_players: number;
  round_limit: number;
  time_limit: number;
  units: string;
}

/** 'CreateLobby' return type */
export type ICreateLobbyResult = void;

/** 'CreateLobby' query type */
export interface ICreateLobbyQuery {
  params: ICreateLobbyParams;
  result: ICreateLobbyResult;
}

const createLobbyIR: any = {"usedParamSet":{"lobby_id":true,"num_of_players":true,"created_at":true,"creation_block_height":true,"lobby_creator":true,"map":true,"units":true,"buildings":true,"gold":true,"init_tiles":true,"time_limit":true,"round_limit":true},"params":[{"name":"lobby_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":301,"b":310}]},{"name":"num_of_players","required":true,"transform":{"type":"scalar"},"locs":[{"a":318,"b":333}]},{"name":"created_at","required":true,"transform":{"type":"scalar"},"locs":[{"a":349,"b":360}]},{"name":"creation_block_height","required":true,"transform":{"type":"scalar"},"locs":[{"a":368,"b":390}]},{"name":"lobby_creator","required":true,"transform":{"type":"scalar"},"locs":[{"a":398,"b":412}]},{"name":"map","required":true,"transform":{"type":"scalar"},"locs":[{"a":453,"b":457}]},{"name":"units","required":true,"transform":{"type":"scalar"},"locs":[{"a":465,"b":471}]},{"name":"buildings","required":true,"transform":{"type":"scalar"},"locs":[{"a":479,"b":489}]},{"name":"gold","required":true,"transform":{"type":"scalar"},"locs":[{"a":497,"b":502}]},{"name":"init_tiles","required":true,"transform":{"type":"scalar"},"locs":[{"a":509,"b":520}]},{"name":"time_limit","required":true,"transform":{"type":"scalar"},"locs":[{"a":528,"b":539}]},{"name":"round_limit","required":true,"transform":{"type":"scalar"},"locs":[{"a":546,"b":558}]}],"statement":"INSERT INTO lobby(\n    lobby_id, \n    num_of_players, \n    current_round, \n    created_at, \n    creation_block_height, \n    lobby_creator, \n    lobby_state, \n    game_state, \n    game_winner, \n    map,\n    units,\n    buildings,\n    gold,\n    init_tiles,\n    time_limit,\n    round_limit\n) VALUES (\n    :lobby_id!, \n    :num_of_players!, \n    0, \n    :created_at!, \n    :creation_block_height!, \n    :lobby_creator!, \n    'open', \n    '', \n    NULL, \n    :map!, \n    :units!, \n    :buildings!, \n    :gold!,\n    :init_tiles!, \n    :time_limit!,\n    :round_limit!\n)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO lobby(
 *     lobby_id, 
 *     num_of_players, 
 *     current_round, 
 *     created_at, 
 *     creation_block_height, 
 *     lobby_creator, 
 *     lobby_state, 
 *     game_state, 
 *     game_winner, 
 *     map,
 *     units,
 *     buildings,
 *     gold,
 *     init_tiles,
 *     time_limit,
 *     round_limit
 * ) VALUES (
 *     :lobby_id!, 
 *     :num_of_players!, 
 *     0, 
 *     :created_at!, 
 *     :creation_block_height!, 
 *     :lobby_creator!, 
 *     'open', 
 *     '', 
 *     NULL, 
 *     :map!, 
 *     :units!, 
 *     :buildings!, 
 *     :gold!,
 *     :init_tiles!, 
 *     :time_limit!,
 *     :round_limit!
 * )
 * ```
 */
export const createLobby = new PreparedQuery<ICreateLobbyParams,ICreateLobbyResult>(createLobbyIR);


/** 'AddPlayerToLobby' parameters type */
export interface IAddPlayerToLobbyParams {
  lobby_id: string;
  player_wallet: string;
}

/** 'AddPlayerToLobby' return type */
export type IAddPlayerToLobbyResult = void;

/** 'AddPlayerToLobby' query type */
export interface IAddPlayerToLobbyQuery {
  params: IAddPlayerToLobbyParams;
  result: IAddPlayerToLobbyResult;
}

const addPlayerToLobbyIR: any = {"usedParamSet":{"lobby_id":true,"player_wallet":true},"params":[{"name":"lobby_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":59,"b":68}]},{"name":"player_wallet","required":true,"transform":{"type":"scalar"},"locs":[{"a":71,"b":85}]}],"statement":"INSERT INTO lobby_player(lobby_id, player_wallet) \nVALUES (:lobby_id!, :player_wallet!)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO lobby_player(lobby_id, player_wallet) 
 * VALUES (:lobby_id!, :player_wallet!)
 * ```
 */
export const addPlayerToLobby = new PreparedQuery<IAddPlayerToLobbyParams,IAddPlayerToLobbyResult>(addPlayerToLobbyIR);


/** 'CreateRound' parameters type */
export interface ICreateRoundParams {
  block_height: number;
  lobby_id: string;
  move: string;
  round: number;
  wallet: string;
}

/** 'CreateRound' return type */
export type ICreateRoundResult = void;

/** 'CreateRound' query type */
export interface ICreateRoundQuery {
  params: ICreateRoundParams;
  result: ICreateRoundResult;
}

const createRoundIR: any = {"usedParamSet":{"lobby_id":true,"wallet":true,"move":true,"round":true,"block_height":true},"params":[{"name":"lobby_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":71,"b":80}]},{"name":"wallet","required":true,"transform":{"type":"scalar"},"locs":[{"a":83,"b":90}]},{"name":"move","required":true,"transform":{"type":"scalar"},"locs":[{"a":93,"b":98}]},{"name":"round","required":true,"transform":{"type":"scalar"},"locs":[{"a":101,"b":107}]},{"name":"block_height","required":true,"transform":{"type":"scalar"},"locs":[{"a":110,"b":123}]}],"statement":"INSERT INTO round(lobby_id, wallet, move, round, block_height)\nVALUES (:lobby_id!, :wallet!, :move!, :round!, :block_height!)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO round(lobby_id, wallet, move, round, block_height)
 * VALUES (:lobby_id!, :wallet!, :move!, :round!, :block_height!)
 * ```
 */
export const createRound = new PreparedQuery<ICreateRoundParams,ICreateRoundResult>(createRoundIR);


/** 'CreatePlayer' parameters type */
export interface ICreatePlayerParams {
  block_height: number;
  wallet: string;
}

/** 'CreatePlayer' return type */
export type ICreatePlayerResult = void;

/** 'CreatePlayer' query type */
export interface ICreatePlayerQuery {
  params: ICreatePlayerParams;
  result: ICreatePlayerResult;
}

const createPlayerIR: any = {"usedParamSet":{"wallet":true,"block_height":true},"params":[{"name":"wallet","required":true,"transform":{"type":"scalar"},"locs":[{"a":54,"b":61}]},{"name":"block_height","required":true,"transform":{"type":"scalar"},"locs":[{"a":64,"b":77}]}],"statement":"INSERT INTO player(wallet, last_block_height)\nVALUES (:wallet!, :block_height!)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO player(wallet, last_block_height)
 * VALUES (:wallet!, :block_height!)
 * ```
 */
export const createPlayer = new PreparedQuery<ICreatePlayerParams,ICreatePlayerResult>(createPlayerIR);


