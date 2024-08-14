/** Types generated for queries found in "src/queries/select.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'GetUserStats' parameters type */
export interface IGetUserStatsParams {
  wallet?: string | null | void;
}

/** 'GetUserStats' return type */
export interface IGetUserStatsResult {
  wallet: string;
  x: number;
  y: number;
}

/** 'GetUserStats' query type */
export interface IGetUserStatsQuery {
  params: IGetUserStatsParams;
  result: IGetUserStatsResult;
}

const getUserStatsIR: any = {"usedParamSet":{"wallet":true},"params":[{"name":"wallet","required":false,"transform":{"type":"scalar"},"locs":[{"a":47,"b":53}]}],"statement":"SELECT * FROM global_user_state\nWHERE wallet = :wallet"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM global_user_state
 * WHERE wallet = :wallet
 * ```
 */
export const getUserStats = new PreparedQuery<IGetUserStatsParams,IGetUserStatsResult>(getUserStatsIR);


/** 'GetWorldStats' parameters type */
export type IGetWorldStatsParams = void;

/** 'GetWorldStats' return type */
export interface IGetWorldStatsResult {
  can_visit: boolean;
  counter: number;
  x: number;
  y: number;
}

/** 'GetWorldStats' query type */
export interface IGetWorldStatsQuery {
  params: IGetWorldStatsParams;
  result: IGetWorldStatsResult;
}

const getWorldStatsIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT * FROM global_world_state\nWHERE can_visit = TRUE"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM global_world_state
 * WHERE can_visit = TRUE
 * ```
 */
export const getWorldStats = new PreparedQuery<IGetWorldStatsParams,IGetWorldStatsResult>(getWorldStatsIR);


