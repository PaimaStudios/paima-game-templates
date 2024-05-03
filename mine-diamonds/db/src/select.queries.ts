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


/** 'GetUserAssetStats' parameters type */
export interface IGetUserAssetStatsParams {
  userTokenId?: number | null | void;
  wallet?: string | null | void;
}

/** 'GetUserAssetStats' return type */
export interface IGetUserAssetStatsResult {
  amount: number;
  assettokenid: number;
  usertokenid: number;
  wallet: string;
}

/** 'GetUserAssetStats' query type */
export interface IGetUserAssetStatsQuery {
  params: IGetUserAssetStatsParams;
  result: IGetUserAssetStatsResult;
}

const getUserAssetStatsIR: any = {"usedParamSet":{"wallet":true,"userTokenId":true},"params":[{"name":"wallet","required":false,"transform":{"type":"scalar"},"locs":[{"a":47,"b":53}]},{"name":"userTokenId","required":false,"transform":{"type":"scalar"},"locs":[{"a":73,"b":84}]}],"statement":"SELECT * FROM asset_token_state\nWHERE wallet = :wallet AND userTokenId = :userTokenId"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM asset_token_state
 * WHERE wallet = :wallet AND userTokenId = :userTokenId
 * ```
 */
export const getUserAssetStats = new PreparedQuery<IGetUserAssetStatsParams,IGetUserAssetStatsResult>(getUserAssetStatsIR);


/** 'GetUserValidMintedAssets' parameters type */
export interface IGetUserValidMintedAssetsParams {
  wallet?: string | null | void;
}

/** 'GetUserValidMintedAssets' return type */
export interface IGetUserValidMintedAssetsResult {
  amount: number;
  assettokenid: number;
}

/** 'GetUserValidMintedAssets' query type */
export interface IGetUserValidMintedAssetsQuery {
  params: IGetUserValidMintedAssetsParams;
  result: IGetUserValidMintedAssetsResult;
}

const getUserValidMintedAssetsIR: any = {"usedParamSet":{"wallet":true},"params":[{"name":"wallet","required":false,"transform":{"type":"scalar"},"locs":[{"a":185,"b":191}]}],"statement":"SELECT a.assetTokenId, a.amount FROM asset_token_state as a JOIN user_token_state as u\nON a.wallet = u.wallet AND a.userTokenId = u.userTokenId AND a.amount = u.amount\nWHERE a.wallet = :wallet AND u.isDiamond = TRUE"};

/**
 * Query generated from SQL:
 * ```
 * SELECT a.assetTokenId, a.amount FROM asset_token_state as a JOIN user_token_state as u
 * ON a.wallet = u.wallet AND a.userTokenId = u.userTokenId AND a.amount = u.amount
 * WHERE a.wallet = :wallet AND u.isDiamond = TRUE
 * ```
 */
export const getUserValidMintedAssets = new PreparedQuery<IGetUserValidMintedAssetsParams,IGetUserValidMintedAssetsResult>(getUserValidMintedAssetsIR);


/** 'GetDexOrders' parameters type */
export type IGetDexOrdersParams = void;

/** 'GetDexOrders' return type */
export interface IGetDexOrdersResult {
  amount: string;
  assettokenid: number;
  orderid: number;
  price: string;
  seller: string;
}

/** 'GetDexOrders' query type */
export interface IGetDexOrdersQuery {
  params: IGetDexOrdersParams;
  result: IGetDexOrdersResult;
}

const getDexOrdersIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT * FROM dex_order\nWHERE amount <> '0'"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM dex_order
 * WHERE amount <> '0'
 * ```
 */
export const getDexOrders = new PreparedQuery<IGetDexOrdersParams,IGetDexOrdersResult>(getDexOrdersIR);


