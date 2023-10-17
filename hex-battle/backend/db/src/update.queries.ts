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


