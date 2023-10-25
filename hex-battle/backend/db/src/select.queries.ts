/** Types generated for queries found in "src/queries/select.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type NumberOrString = number | string;

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
  seed: string | null;
  started_block_height: number | null;
  time_limit: number;
  units: string;
}

/** 'GetMyActiveLobbies' query type */
export interface IGetMyActiveLobbiesQuery {
  params: IGetMyActiveLobbiesParams;
  result: IGetMyActiveLobbiesResult;
}

const getMyActiveLobbiesIR: any = {"usedParamSet":{"player_wallet":true},"params":[{"name":"player_wallet","required":true,"transform":{"type":"scalar"},"locs":[{"a":383,"b":397}]}],"statement":"SELECT \n    lobby_player.lobby_id, \n    lobby_state, \n    num_of_players, \n    current_round, \n    lobby_creator, \n    lobby_player.player_wallet \n    units,\n    buildings,\n    gold,\n    init_tiles,\n    time_limit,\n    round_limit,\n    started_block_height,\n    seed\nFROM lobby_player\nINNER JOIN lobby as LL ON LL.lobby_id = lobby_player.lobby_id \nWHERE lobby_player.player_wallet = :player_wallet!\nAND (LL.lobby_state = 'active' OR LL.lobby_state = 'open')\nORDER BY created_at DESC"};

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
 *     started_block_height,
 *     seed
 * FROM lobby_player
 * INNER JOIN lobby as LL ON LL.lobby_id = lobby_player.lobby_id 
 * WHERE lobby_player.player_wallet = :player_wallet!
 * AND (LL.lobby_state = 'active' OR LL.lobby_state = 'open')
 * ORDER BY created_at DESC
 * ```
 */
export const getMyActiveLobbies = new PreparedQuery<IGetMyActiveLobbiesParams,IGetMyActiveLobbiesResult>(getMyActiveLobbiesIR);


/** 'GetGameState' parameters type */
export interface IGetGameStateParams {
  lobby_id: string;
}

/** 'GetGameState' return type */
export interface IGetGameStateResult {
  current_round: number;
  lobby_state: string | null;
}

/** 'GetGameState' query type */
export interface IGetGameStateQuery {
  params: IGetGameStateParams;
  result: IGetGameStateResult;
}

const getGameStateIR: any = {"usedParamSet":{"lobby_id":true},"params":[{"name":"lobby_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":62,"b":71}]}],"statement":"SELECT lobby_state, current_round FROM lobby\nWHERE lobby_id = :lobby_id!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT lobby_state, current_round FROM lobby
 * WHERE lobby_id = :lobby_id!
 * ```
 */
export const getGameState = new PreparedQuery<IGetGameStateParams,IGetGameStateResult>(getGameStateIR);


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
  seed: string | null;
  time_limit: number;
  units: string | null;
}

/** 'GetOpenLobbies' query type */
export interface IGetOpenLobbiesQuery {
  params: IGetOpenLobbiesParams;
  result: IGetOpenLobbiesResult;
}

const getOpenLobbiesIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT \n    lobby_creator,\n    lobby_id, \n    lobby_state, \n    num_of_players,  \n    units,\n    buildings,\n    gold,\n    init_tiles,\n    time_limit,\n    round_limit,\n    creation_block_height, \n    seed\nFROM lobby \nwhere lobby_state = 'open'\nAND created_at > now() - interval '1 day' \nORDER BY created_at DESC"};

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
 *     creation_block_height, 
 *     seed
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
  seed: string | null;
  started_block_height: number | null;
  time_limit: number;
  units: string | null;
}

/** 'GetLobbyLean' query type */
export interface IGetLobbyLeanQuery {
  params: IGetLobbyLeanParams;
  result: IGetLobbyLeanResult;
}

const getLobbyLeanIR: any = {"usedParamSet":{"lobby_id":true},"params":[{"name":"lobby_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":287,"b":296}]}],"statement":"SELECT lobby_id,\n    current_round, \n    created_at, \n    lobby_creator, \n    lobby_state, \n    game_winner, \n    num_of_players, \n    units, \n    buildings, \n    gold, \n    init_tiles, \n    time_limit, \n    round_limit, \n    started_block_height, \n    seed\nFROM lobby \nWHERE lobby_id = :lobby_id!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT lobby_id,
 *     current_round, 
 *     created_at, 
 *     lobby_creator, 
 *     lobby_state, 
 *     game_winner, 
 *     num_of_players, 
 *     units, 
 *     buildings, 
 *     gold, 
 *     init_tiles, 
 *     time_limit, 
 *     round_limit, 
 *     started_block_height, 
 *     seed
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
  seed: string | null;
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
  seed: string | null;
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


/** 'GetPlayerByWallet' parameters type */
export interface IGetPlayerByWalletParams {
  wallet: string;
}

/** 'GetPlayerByWallet' return type */
export interface IGetPlayerByWalletResult {
  draws: number;
  last_block_height: number;
  losses: number;
  played_games: number;
  wallet: string;
  wins: number;
}

/** 'GetPlayerByWallet' query type */
export interface IGetPlayerByWalletQuery {
  params: IGetPlayerByWalletParams;
  result: IGetPlayerByWalletResult;
}

const getPlayerByWalletIR: any = {"usedParamSet":{"wallet":true},"params":[{"name":"wallet","required":true,"transform":{"type":"scalar"},"locs":[{"a":37,"b":44}]}],"statement":"SELECT * FROM player \nWHERE wallet = :wallet!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM player 
 * WHERE wallet = :wallet!
 * ```
 */
export const getPlayerByWallet = new PreparedQuery<IGetPlayerByWalletParams,IGetPlayerByWalletResult>(getPlayerByWalletIR);


/** 'GetPlayersByGamesPlayed' parameters type */
export interface IGetPlayersByGamesPlayedParams {
  limit: NumberOrString;
  offset: NumberOrString;
}

/** 'GetPlayersByGamesPlayed' return type */
export interface IGetPlayersByGamesPlayedResult {
  draws: number;
  last_block_height: number;
  losses: number;
  played_games: number;
  wallet: string;
  wins: number;
}

/** 'GetPlayersByGamesPlayed' query type */
export interface IGetPlayersByGamesPlayedQuery {
  params: IGetPlayersByGamesPlayedParams;
  result: IGetPlayersByGamesPlayedResult;
}

const getPlayersByGamesPlayedIR: any = {"usedParamSet":{"limit":true,"offset":true},"params":[{"name":"limit","required":true,"transform":{"type":"scalar"},"locs":[{"a":55,"b":61}]},{"name":"offset","required":true,"transform":{"type":"scalar"},"locs":[{"a":70,"b":77}]}],"statement":"SELECT * FROM player \nORDER BY played_games DESC\nLIMIT :limit!\nOFFSET :offset!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM player 
 * ORDER BY played_games DESC
 * LIMIT :limit!
 * OFFSET :offset!
 * ```
 */
export const getPlayersByGamesPlayed = new PreparedQuery<IGetPlayersByGamesPlayedParams,IGetPlayersByGamesPlayedResult>(getPlayersByGamesPlayedIR);


/** 'GetPlayersByLatest' parameters type */
export interface IGetPlayersByLatestParams {
  limit: NumberOrString;
  offset: NumberOrString;
}

/** 'GetPlayersByLatest' return type */
export interface IGetPlayersByLatestResult {
  draws: number;
  last_block_height: number;
  losses: number;
  played_games: number;
  wallet: string;
  wins: number;
}

/** 'GetPlayersByLatest' query type */
export interface IGetPlayersByLatestQuery {
  params: IGetPlayersByLatestParams;
  result: IGetPlayersByLatestResult;
}

const getPlayersByLatestIR: any = {"usedParamSet":{"limit":true,"offset":true},"params":[{"name":"limit","required":true,"transform":{"type":"scalar"},"locs":[{"a":60,"b":66}]},{"name":"offset","required":true,"transform":{"type":"scalar"},"locs":[{"a":75,"b":82}]}],"statement":"SELECT * FROM player \nORDER BY last_block_height DESC\nLIMIT :limit!\nOFFSET :offset!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM player 
 * ORDER BY last_block_height DESC
 * LIMIT :limit!
 * OFFSET :offset!
 * ```
 */
export const getPlayersByLatest = new PreparedQuery<IGetPlayersByLatestParams,IGetPlayersByLatestResult>(getPlayersByLatestIR);


/** 'GetPlayersByWins' parameters type */
export interface IGetPlayersByWinsParams {
  limit: NumberOrString;
  offset: NumberOrString;
}

/** 'GetPlayersByWins' return type */
export interface IGetPlayersByWinsResult {
  draws: number;
  last_block_height: number;
  losses: number;
  played_games: number;
  wallet: string;
  wins: number;
}

/** 'GetPlayersByWins' query type */
export interface IGetPlayersByWinsQuery {
  params: IGetPlayersByWinsParams;
  result: IGetPlayersByWinsResult;
}

const getPlayersByWinsIR: any = {"usedParamSet":{"limit":true,"offset":true},"params":[{"name":"limit","required":true,"transform":{"type":"scalar"},"locs":[{"a":46,"b":52}]},{"name":"offset","required":true,"transform":{"type":"scalar"},"locs":[{"a":61,"b":68}]}],"statement":"SELECT * FROM player\nORDER BY wins DESC\nLIMIT :limit!\nOFFSET :offset!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM player
 * ORDER BY wins DESC
 * LIMIT :limit!
 * OFFSET :offset!
 * ```
 */
export const getPlayersByWins = new PreparedQuery<IGetPlayersByWinsParams,IGetPlayersByWinsResult>(getPlayersByWinsIR);


