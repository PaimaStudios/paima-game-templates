/** Types generated for queries found in "src/queries/select.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'GetMyActiveLobbies' parameters type */
export interface IGetMyActiveLobbiesParams {
  player_wallet: string;
}

/** 'GetMyActiveLobbies' return type */
export interface IGetMyActiveLobbiesResult {
  buildings: string | null;
  current_round: number;
  gold: number;
  init_tiles: number;
  lobby_creator: string;
  lobby_id: string;
  lobby_state: string | null;
  num_of_players: number;
  round_limit: number;
  started_block_height: number | null;
  time_limit: number;
  units: string;
}

/** 'GetMyActiveLobbies' query type */
export interface IGetMyActiveLobbiesQuery {
  params: IGetMyActiveLobbiesParams;
  result: IGetMyActiveLobbiesResult;
}

const getMyActiveLobbiesIR: any = {"usedParamSet":{"player_wallet":true},"params":[{"name":"player_wallet","required":true,"transform":{"type":"scalar"},"locs":[{"a":373,"b":387}]}],"statement":"SELECT \n    lobby_player.lobby_id, \n    lobby_state, \n    num_of_players, \n    current_round, \n    lobby_creator, \n    lobby_player.player_wallet \n    units,\n    buildings,\n    gold,\n    init_tiles,\n    time_limit,\n    round_limit,\n    started_block_height\nFROM lobby_player\nINNER JOIN lobby as LL ON LL.lobby_id = lobby_player.lobby_id \nWHERE lobby_player.player_wallet = :player_wallet!\nAND (LL.lobby_state = 'active' OR LL.lobby_state = 'open')\nORDER BY created_at DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT 
 *     lobby_player.lobby_id, 
 *     lobby_state, 
 *     num_of_players, 
 *     current_round, 
 *     lobby_creator, 
 *     lobby_player.player_wallet 
 *     units,
 *     buildings,
 *     gold,
 *     init_tiles,
 *     time_limit,
 *     round_limit,
 *     started_block_height
 * FROM lobby_player
 * INNER JOIN lobby as LL ON LL.lobby_id = lobby_player.lobby_id 
 * WHERE lobby_player.player_wallet = :player_wallet!
 * AND (LL.lobby_state = 'active' OR LL.lobby_state = 'open')
 * ORDER BY created_at DESC
 * ```
 */
export const getMyActiveLobbies = new PreparedQuery<IGetMyActiveLobbiesParams,IGetMyActiveLobbiesResult>(getMyActiveLobbiesIR);


/** 'GetOpenLobbies' parameters type */
export type IGetOpenLobbiesParams = void;

/** 'GetOpenLobbies' return type */
export interface IGetOpenLobbiesResult {
  buildings: string | null;
  creation_block_height: number;
  gold: number;
  init_tiles: number;
  lobby_creator: string;
  lobby_id: string;
  lobby_state: string | null;
  num_of_players: number;
  round_limit: number;
  time_limit: number;
  units: string | null;
}

/** 'GetOpenLobbies' query type */
export interface IGetOpenLobbiesQuery {
  params: IGetOpenLobbiesParams;
  result: IGetOpenLobbiesResult;
}

const getOpenLobbiesIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT \n    lobby_creator,\n    lobby_id, \n    lobby_state, \n    num_of_players,  \n    units,\n    buildings,\n    gold,\n    init_tiles,\n    time_limit,\n    round_limit,\n    creation_block_height\nFROM lobby \nwhere lobby_state = 'open'\nAND created_at > now() - interval '1 day' \nORDER BY created_at DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT 
 *     lobby_creator,
 *     lobby_id, 
 *     lobby_state, 
 *     num_of_players,  
 *     units,
 *     buildings,
 *     gold,
 *     init_tiles,
 *     time_limit,
 *     round_limit,
 *     creation_block_height
 * FROM lobby 
 * where lobby_state = 'open'
 * AND created_at > now() - interval '1 day' 
 * ORDER BY created_at DESC
 * ```
 */
export const getOpenLobbies = new PreparedQuery<IGetOpenLobbiesParams,IGetOpenLobbiesResult>(getOpenLobbiesIR);


/** 'GetLatestCreatedLobby' parameters type */
export interface IGetLatestCreatedLobbyParams {
  lobby_creator: string;
}

/** 'GetLatestCreatedLobby' return type */
export interface IGetLatestCreatedLobbyResult {
  current_round: number;
  lobby_creator: string;
  lobby_id: string;
  lobby_state: string | null;
  num_of_players: number;
}

/** 'GetLatestCreatedLobby' query type */
export interface IGetLatestCreatedLobbyQuery {
  params: IGetLatestCreatedLobbyParams;
  result: IGetLatestCreatedLobbyResult;
}

const getLatestCreatedLobbyIR: any = {"usedParamSet":{"lobby_creator":true},"params":[{"name":"lobby_creator","required":true,"transform":{"type":"scalar"},"locs":[{"a":133,"b":147}]}],"statement":"SELECT lobby_id, lobby_state, num_of_players, current_round, lobby_creator FROM lobby\nWHERE lobby_state = 'open'\nAND lobby_creator = :lobby_creator!\nAND created_at > now() - interval '1 day'\nORDER BY created_at DESC\nLIMIT 1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT lobby_id, lobby_state, num_of_players, current_round, lobby_creator FROM lobby
 * WHERE lobby_state = 'open'
 * AND lobby_creator = :lobby_creator!
 * AND created_at > now() - interval '1 day'
 * ORDER BY created_at DESC
 * LIMIT 1
 * ```
 */
export const getLatestCreatedLobby = new PreparedQuery<IGetLatestCreatedLobbyParams,IGetLatestCreatedLobbyResult>(getLatestCreatedLobbyIR);


/** 'GetLobbyMap' parameters type */
export interface IGetLobbyMapParams {
  lobby_id: string;
}

/** 'GetLobbyMap' return type */
export interface IGetLobbyMapResult {
  lobby_id: string;
  map: string | null;
}

/** 'GetLobbyMap' query type */
export interface IGetLobbyMapQuery {
  params: IGetLobbyMapParams;
  result: IGetLobbyMapResult;
}

const getLobbyMapIR: any = {"usedParamSet":{"lobby_id":true},"params":[{"name":"lobby_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":51,"b":60}]}],"statement":"SELECT lobby_id, map \nFROM lobby \nWHERE lobby_id = :lobby_id!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT lobby_id, map 
 * FROM lobby 
 * WHERE lobby_id = :lobby_id!
 * ```
 */
export const getLobbyMap = new PreparedQuery<IGetLobbyMapParams,IGetLobbyMapResult>(getLobbyMapIR);


/** 'GetLobbyGameState' parameters type */
export interface IGetLobbyGameStateParams {
  lobby_id: string;
}

/** 'GetLobbyGameState' return type */
export interface IGetLobbyGameStateResult {
  game_state: string;
  lobby_id: string;
}

/** 'GetLobbyGameState' query type */
export interface IGetLobbyGameStateQuery {
  params: IGetLobbyGameStateParams;
  result: IGetLobbyGameStateResult;
}

const getLobbyGameStateIR: any = {"usedParamSet":{"lobby_id":true},"params":[{"name":"lobby_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":56,"b":65}]}],"statement":"SELECT lobby_id, game_state\nFROM lobby\nWHERE lobby_id = :lobby_id!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT lobby_id, game_state
 * FROM lobby
 * WHERE lobby_id = :lobby_id!
 * ```
 */
export const getLobbyGameState = new PreparedQuery<IGetLobbyGameStateParams,IGetLobbyGameStateResult>(getLobbyGameStateIR);


/** 'GetLobbyLean' parameters type */
export interface IGetLobbyLeanParams {
  lobby_id: string;
}

/** 'GetLobbyLean' return type */
export interface IGetLobbyLeanResult {
  buildings: string | null;
  created_at: Date;
  current_round: number;
  game_winner: string | null;
  gold: number;
  init_tiles: number;
  lobby_creator: string;
  lobby_id: string;
  lobby_state: string | null;
  num_of_players: number;
  round_limit: number;
  started_block_height: number | null;
  time_limit: number;
  units: string | null;
}

/** 'GetLobbyLean' query type */
export interface IGetLobbyLeanQuery {
  params: IGetLobbyLeanParams;
  result: IGetLobbyLeanResult;
}

const getLobbyLeanIR: any = {"usedParamSet":{"lobby_id":true},"params":[{"name":"lobby_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":212,"b":221}]}],"statement":"SELECT lobby_id, current_round, created_at, lobby_creator, lobby_state, game_winner, num_of_players, units, buildings, gold, init_tiles, time_limit, round_limit, started_block_height\nFROM lobby \nWHERE lobby_id = :lobby_id!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT lobby_id, current_round, created_at, lobby_creator, lobby_state, game_winner, num_of_players, units, buildings, gold, init_tiles, time_limit, round_limit, started_block_height
 * FROM lobby 
 * WHERE lobby_id = :lobby_id!
 * ```
 */
export const getLobbyLean = new PreparedQuery<IGetLobbyLeanParams,IGetLobbyLeanResult>(getLobbyLeanIR);


/** 'MyJoinedGames' parameters type */
export interface IMyJoinedGamesParams {
  lobby_id: string;
  player_wallet: string;
}

/** 'MyJoinedGames' return type */
export interface IMyJoinedGamesResult {
  id: number;
  lobby_id: string;
  player_wallet: string;
}

/** 'MyJoinedGames' query type */
export interface IMyJoinedGamesQuery {
  params: IMyJoinedGamesParams;
  result: IMyJoinedGamesResult;
}

const myJoinedGamesIR: any = {"usedParamSet":{"lobby_id":true,"player_wallet":true},"params":[{"name":"lobby_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":45,"b":54}]},{"name":"player_wallet","required":true,"transform":{"type":"scalar"},"locs":[{"a":76,"b":90}]}],"statement":"SELECT * FROM lobby_player \nWHERE lobby_id = :lobby_id!\nAND player_wallet = :player_wallet!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM lobby_player 
 * WHERE lobby_id = :lobby_id!
 * AND player_wallet = :player_wallet!
 * ```
 */
export const myJoinedGames = new PreparedQuery<IMyJoinedGamesParams,IMyJoinedGamesResult>(myJoinedGamesIR);


/** 'GetLobbyPlayers' parameters type */
export interface IGetLobbyPlayersParams {
  lobby_id: string;
}

/** 'GetLobbyPlayers' return type */
export interface IGetLobbyPlayersResult {
  id: number;
  lobby_id: string;
  player_wallet: string;
}

/** 'GetLobbyPlayers' query type */
export interface IGetLobbyPlayersQuery {
  params: IGetLobbyPlayersParams;
  result: IGetLobbyPlayersResult;
}

const getLobbyPlayersIR: any = {"usedParamSet":{"lobby_id":true},"params":[{"name":"lobby_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":45,"b":54}]}],"statement":"SELECT * FROM lobby_player \nWHERE lobby_id = :lobby_id!\nORDER BY id ASC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM lobby_player 
 * WHERE lobby_id = :lobby_id!
 * ORDER BY id ASC
 * ```
 */
export const getLobbyPlayers = new PreparedQuery<IGetLobbyPlayersParams,IGetLobbyPlayersResult>(getLobbyPlayersIR);


/** 'GetLobbyRounds' parameters type */
export interface IGetLobbyRoundsParams {
  lobby_id: string;
}

/** 'GetLobbyRounds' return type */
export interface IGetLobbyRoundsResult {
  block_height: number;
  id: number;
  lobby_id: string;
  move: string;
  round: number;
  wallet: string;
}

/** 'GetLobbyRounds' query type */
export interface IGetLobbyRoundsQuery {
  params: IGetLobbyRoundsParams;
  result: IGetLobbyRoundsResult;
}

const getLobbyRoundsIR: any = {"usedParamSet":{"lobby_id":true},"params":[{"name":"lobby_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":38,"b":47}]}],"statement":"SELECT * FROM round \nWHERE lobby_id = :lobby_id!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM round 
 * WHERE lobby_id = :lobby_id!
 * ```
 */
export const getLobbyRounds = new PreparedQuery<IGetLobbyRoundsParams,IGetLobbyRoundsResult>(getLobbyRoundsIR);


/** 'GetMovesForRound' parameters type */
export interface IGetMovesForRoundParams {
  lobby_id: string;
  round: number;
}

/** 'GetMovesForRound' return type */
export interface IGetMovesForRoundResult {
  block_height: number;
  id: number;
  lobby_id: string;
  move: string;
  round: number;
  wallet: string;
}

/** 'GetMovesForRound' query type */
export interface IGetMovesForRoundQuery {
  params: IGetMovesForRoundParams;
  result: IGetMovesForRoundResult;
}

const getMovesForRoundIR: any = {"usedParamSet":{"lobby_id":true,"round":true},"params":[{"name":"lobby_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":38,"b":47}]},{"name":"round","required":true,"transform":{"type":"scalar"},"locs":[{"a":61,"b":67}]}],"statement":"SELECT * FROM round \nWHERE lobby_id = :lobby_id!\nAND round = :round!\nLIMIT 1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM round 
 * WHERE lobby_id = :lobby_id!
 * AND round = :round!
 * LIMIT 1
 * ```
 */
export const getMovesForRound = new PreparedQuery<IGetMovesForRoundParams,IGetMovesForRoundResult>(getMovesForRoundIR);


