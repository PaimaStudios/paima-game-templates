/** Types generated for queries found in "src/queries/select.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'GetUserStats' parameters type */
export interface IGetUserStatsParams {
  wallet?: string | null | void;
}

/** 'GetUserStats' return type */
export interface IGetUserStatsResult {
  currentusertokenid: number;
  wallet: string;
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


/** 'GetUserTokenStats' parameters type */
export interface IGetUserTokenStatsParams {
  userTokenId?: number | null | void;
  wallet?: string | null | void;
}

/** 'GetUserTokenStats' return type */
export interface IGetUserTokenStatsResult {
  amount: number;
  isdiamond: boolean;
  usertokenid: number;
  wallet: string;
}

/** 'GetUserTokenStats' query type */
export interface IGetUserTokenStatsQuery {
  params: IGetUserTokenStatsParams;
  result: IGetUserTokenStatsResult;
}

const getUserTokenStatsIR: any = {"usedParamSet":{"wallet":true,"userTokenId":true},"params":[{"name":"wallet","required":false,"transform":{"type":"scalar"},"locs":[{"a":46,"b":52}]},{"name":"userTokenId","required":false,"transform":{"type":"scalar"},"locs":[{"a":72,"b":83}]}],"statement":"SELECT * FROM user_token_state\nWHERE wallet = :wallet AND userTokenId = :userTokenId"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM user_token_state
 * WHERE wallet = :wallet AND userTokenId = :userTokenId
 * ```
 */
export const getUserTokenStats = new PreparedQuery<IGetUserTokenStatsParams,IGetUserTokenStatsResult>(getUserTokenStatsIR);


