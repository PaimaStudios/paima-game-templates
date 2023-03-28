/** Types generated for queries found in "src/queries/select.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetLatestBlockData' parameters type */
export type IGetLatestBlockDataParams = void;

/** 'GetLatestBlockData' return type */
export interface IGetLatestBlockDataResult {
  block_height: number;
  done: boolean;
  seed: string;
}

/** 'GetLatestBlockData' query type */
export interface IGetLatestBlockDataQuery {
  params: IGetLatestBlockDataParams;
  result: IGetLatestBlockDataResult;
}

const getLatestBlockDataIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT * FROM block_heights \nORDER BY block_height DESC\nLIMIT 1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM block_heights 
 * ORDER BY block_height DESC
 * LIMIT 1
 * ```
 */
export const getLatestBlockData = new PreparedQuery<IGetLatestBlockDataParams,IGetLatestBlockDataResult>(getLatestBlockDataIR);


/** 'GetLatestProcessedBlockHeight' parameters type */
export type IGetLatestProcessedBlockHeightParams = void;

/** 'GetLatestProcessedBlockHeight' return type */
export interface IGetLatestProcessedBlockHeightResult {
  block_height: number;
  done: boolean;
  seed: string;
}

/** 'GetLatestProcessedBlockHeight' query type */
export interface IGetLatestProcessedBlockHeightQuery {
  params: IGetLatestProcessedBlockHeightParams;
  result: IGetLatestProcessedBlockHeightResult;
}

const getLatestProcessedBlockHeightIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT * FROM block_heights \nWHERE done IS TRUE\nORDER BY block_height DESC\nLIMIT 1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM block_heights 
 * WHERE done IS TRUE
 * ORDER BY block_height DESC
 * LIMIT 1
 * ```
 */
export const getLatestProcessedBlockHeight = new PreparedQuery<IGetLatestProcessedBlockHeightParams,IGetLatestProcessedBlockHeightResult>(getLatestProcessedBlockHeightIR);


/** 'GetBlockData' parameters type */
export interface IGetBlockDataParams {
  block_height: number | null | void;
}

/** 'GetBlockData' return type */
export interface IGetBlockDataResult {
  block_height: number;
  done: boolean;
  seed: string;
}

/** 'GetBlockData' query type */
export interface IGetBlockDataQuery {
  params: IGetBlockDataParams;
  result: IGetBlockDataResult;
}

const getBlockDataIR: any = {"usedParamSet":{"block_height":true},"params":[{"name":"block_height","required":false,"transform":{"type":"scalar"},"locs":[{"a":50,"b":62}]}],"statement":"SELECT * FROM block_heights \nWHERE block_height = :block_height"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM block_heights 
 * WHERE block_height = :block_height
 * ```
 */
export const getBlockData = new PreparedQuery<IGetBlockDataParams,IGetBlockDataResult>(getBlockDataIR);


/** 'GetUserStats' parameters type */
export interface IGetUserStatsParams {
  wallet: string | null | void;
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


