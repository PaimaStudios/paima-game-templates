/** Types generated for queries found in "src/queries/update.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'UpdateLobbyToActive' parameters type */
export interface IUpdateLobbyToActiveParams {
  lobby_id: string;
  started_block_height: number;
}

/** 'UpdateLobbyToActive' return type */
export type IUpdateLobbyToActiveResult = void;

/** 'UpdateLobbyToActive' query type */
export interface IUpdateLobbyToActiveQuery {
  params: IUpdateLobbyToActiveParams;
  result: IUpdateLobbyToActiveResult;
}

const updateLobbyToActiveIR: any = {"usedParamSet":{"started_block_height":true,"lobby_id":true},"params":[{"name":"started_block_height","required":true,"transform":{"type":"scalar"},"locs":[{"a":64,"b":85}]},{"name":"lobby_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":104,"b":113}]}],"statement":"UPDATE lobby\nSET lobby_state = 'active', started_block_height = :started_block_height!\nWHERE lobby_id = :lobby_id!"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE lobby
 * SET lobby_state = 'active', started_block_height = :started_block_height!
 * WHERE lobby_id = :lobby_id!
 * ```
 */
export const updateLobbyToActive = new PreparedQuery<IUpdateLobbyToActiveParams,IUpdateLobbyToActiveResult>(updateLobbyToActiveIR);


/** 'UpdateLobbyToClosed' parameters type */
export interface IUpdateLobbyToClosedParams {
  lobby_id: string;
}

/** 'UpdateLobbyToClosed' return type */
export type IUpdateLobbyToClosedResult = void;

/** 'UpdateLobbyToClosed' query type */
export interface IUpdateLobbyToClosedQuery {
  params: IUpdateLobbyToClosedParams;
  result: IUpdateLobbyToClosedResult;
}

const updateLobbyToClosedIR: any = {"usedParamSet":{"lobby_id":true},"params":[{"name":"lobby_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":57,"b":66}]}],"statement":"UPDATE lobby\nSET lobby_state = 'closed'\nWHERE lobby_id = :lobby_id!"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE lobby
 * SET lobby_state = 'closed'
 * WHERE lobby_id = :lobby_id!
 * ```
 */
export const updateLobbyToClosed = new PreparedQuery<IUpdateLobbyToClosedParams,IUpdateLobbyToClosedResult>(updateLobbyToClosedIR);


/** 'UpdateLobbyWinner' parameters type */
export interface IUpdateLobbyWinnerParams {
  game_winner: string;
  lobby_id: string;
}

/** 'UpdateLobbyWinner' return type */
export type IUpdateLobbyWinnerResult = void;

/** 'UpdateLobbyWinner' query type */
export interface IUpdateLobbyWinnerQuery {
  params: IUpdateLobbyWinnerParams;
  result: IUpdateLobbyWinnerResult;
}

const updateLobbyWinnerIR: any = {"usedParamSet":{"game_winner":true,"lobby_id":true},"params":[{"name":"game_winner","required":true,"transform":{"type":"scalar"},"locs":[{"a":31,"b":43}]},{"name":"lobby_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":88,"b":97}]}],"statement":"UPDATE lobby\nSET game_winner = :game_winner!,\nlobby_state = 'finished'\nWHERE lobby_id = :lobby_id!"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE lobby
 * SET game_winner = :game_winner!,
 * lobby_state = 'finished'
 * WHERE lobby_id = :lobby_id!
 * ```
 */
export const updateLobbyWinner = new PreparedQuery<IUpdateLobbyWinnerParams,IUpdateLobbyWinnerResult>(updateLobbyWinnerIR);


/** 'UpdateLobbyGameState' parameters type */
export interface IUpdateLobbyGameStateParams {
  current_round: number;
  game_state: string;
  lobby_id: string;
}

/** 'UpdateLobbyGameState' return type */
export type IUpdateLobbyGameStateResult = void;

/** 'UpdateLobbyGameState' query type */
export interface IUpdateLobbyGameStateQuery {
  params: IUpdateLobbyGameStateParams;
  result: IUpdateLobbyGameStateResult;
}

const updateLobbyGameStateIR: any = {"usedParamSet":{"game_state":true,"current_round":true,"lobby_id":true},"params":[{"name":"game_state","required":true,"transform":{"type":"scalar"},"locs":[{"a":31,"b":42}]},{"name":"current_round","required":true,"transform":{"type":"scalar"},"locs":[{"a":61,"b":75}]},{"name":"lobby_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":94,"b":103}]}],"statement":"UPDATE lobby\nSET \ngame_state = :game_state!,\ncurrent_round = :current_round!\nWHERE lobby_id = :lobby_id!"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE lobby
 * SET 
 * game_state = :game_state!,
 * current_round = :current_round!
 * WHERE lobby_id = :lobby_id!
 * ```
 */
export const updateLobbyGameState = new PreparedQuery<IUpdateLobbyGameStateParams,IUpdateLobbyGameStateResult>(updateLobbyGameStateIR);


/** 'UpdatePlayerWin' parameters type */
export interface IUpdatePlayerWinParams {
  last_block_height: number;
  wallet: string;
}

/** 'UpdatePlayerWin' return type */
export type IUpdatePlayerWinResult = void;

/** 'UpdatePlayerWin' query type */
export interface IUpdatePlayerWinQuery {
  params: IUpdatePlayerWinParams;
  result: IUpdatePlayerWinResult;
}

const updatePlayerWinIR: any = {"usedParamSet":{"last_block_height":true,"wallet":true},"params":[{"name":"last_block_height","required":true,"transform":{"type":"scalar"},"locs":[{"a":88,"b":106}]},{"name":"wallet","required":true,"transform":{"type":"scalar"},"locs":[{"a":123,"b":130}]}],"statement":"UPDATE player\nSET wins = wins + 1,\nplayed_games = played_games + 1,\nlast_block_height = :last_block_height!\nWHERE wallet = :wallet!"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE player
 * SET wins = wins + 1,
 * played_games = played_games + 1,
 * last_block_height = :last_block_height!
 * WHERE wallet = :wallet!
 * ```
 */
export const updatePlayerWin = new PreparedQuery<IUpdatePlayerWinParams,IUpdatePlayerWinResult>(updatePlayerWinIR);


/** 'UpdatePlayerLoss' parameters type */
export interface IUpdatePlayerLossParams {
  last_block_height: number;
  wallet: string;
}

/** 'UpdatePlayerLoss' return type */
export type IUpdatePlayerLossResult = void;

/** 'UpdatePlayerLoss' query type */
export interface IUpdatePlayerLossQuery {
  params: IUpdatePlayerLossParams;
  result: IUpdatePlayerLossResult;
}

const updatePlayerLossIR: any = {"usedParamSet":{"last_block_height":true,"wallet":true},"params":[{"name":"last_block_height","required":true,"transform":{"type":"scalar"},"locs":[{"a":92,"b":110}]},{"name":"wallet","required":true,"transform":{"type":"scalar"},"locs":[{"a":127,"b":134}]}],"statement":"UPDATE player\nSET losses = losses + 1,\nplayed_games = played_games + 1,\nlast_block_height = :last_block_height!\nWHERE wallet = :wallet!"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE player
 * SET losses = losses + 1,
 * played_games = played_games + 1,
 * last_block_height = :last_block_height!
 * WHERE wallet = :wallet!
 * ```
 */
export const updatePlayerLoss = new PreparedQuery<IUpdatePlayerLossParams,IUpdatePlayerLossResult>(updatePlayerLossIR);


/** 'UpdatePlayerDraw' parameters type */
export interface IUpdatePlayerDrawParams {
  last_block_height: number;
  wallet: string;
}

/** 'UpdatePlayerDraw' return type */
export type IUpdatePlayerDrawResult = void;

/** 'UpdatePlayerDraw' query type */
export interface IUpdatePlayerDrawQuery {
  params: IUpdatePlayerDrawParams;
  result: IUpdatePlayerDrawResult;
}

const updatePlayerDrawIR: any = {"usedParamSet":{"last_block_height":true,"wallet":true},"params":[{"name":"last_block_height","required":true,"transform":{"type":"scalar"},"locs":[{"a":90,"b":108}]},{"name":"wallet","required":true,"transform":{"type":"scalar"},"locs":[{"a":125,"b":132}]}],"statement":"UPDATE player\nSET draws = draws + 1,\nplayed_games = played_games + 1,\nlast_block_height = :last_block_height!\nWHERE wallet = :wallet!"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE player
 * SET draws = draws + 1,
 * played_games = played_games + 1,
 * last_block_height = :last_block_height!
 * WHERE wallet = :wallet!
 * ```
 */
export const updatePlayerDraw = new PreparedQuery<IUpdatePlayerDrawParams,IUpdatePlayerDrawResult>(updatePlayerDrawIR);


