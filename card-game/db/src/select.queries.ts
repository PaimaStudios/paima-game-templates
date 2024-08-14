/** Types generated for queries found in "src/queries/select.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'GetUserStats' parameters type */
export interface IGetUserStatsParams {
  wallet?: string | null | void;
}

/** 'GetUserStats' return type */
export interface IGetUserStatsResult {
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


/** 'GetCards' parameters type */
export type IGetCardsParams = void;

/** 'GetCards' return type */
export interface IGetCardsResult {
  card: number;
  upwards: boolean;
}

/** 'GetCards' query type */
export interface IGetCardsQuery {
  params: IGetCardsParams;
  result: IGetCardsResult;
}

const getCardsIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT * FROM global_cards"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM global_cards
 * ```
 */
export const getCards = new PreparedQuery<IGetCardsParams,IGetCardsResult>(getCardsIR);


