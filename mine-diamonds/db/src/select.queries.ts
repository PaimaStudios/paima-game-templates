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
  user?: string | null | void;
  userTokenId?: number | null | void;
}

/** 'GetUserAssetStats' return type */
export interface IGetUserAssetStatsResult {
  amount: number;
  assettokenid: number;
  minter: string;
  usertokenid: number;
}

/** 'GetUserAssetStats' query type */
export interface IGetUserAssetStatsQuery {
  params: IGetUserAssetStatsParams;
  result: IGetUserAssetStatsResult;
}

const getUserAssetStatsIR: any = {"usedParamSet":{"user":true,"userTokenId":true},"params":[{"name":"user","required":false,"transform":{"type":"scalar"},"locs":[{"a":47,"b":51}]},{"name":"userTokenId","required":false,"transform":{"type":"scalar"},"locs":[{"a":71,"b":82}]}],"statement":"SELECT * FROM asset_token_state\nWHERE minter = :user AND userTokenId = :userTokenId"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM asset_token_state
 * WHERE minter = :user AND userTokenId = :userTokenId
 * ```
 */
export const getUserAssetStats = new PreparedQuery<IGetUserAssetStatsParams,IGetUserAssetStatsResult>(getUserAssetStatsIR);


/** 'GetUserValidMintedAssets' parameters type */
export interface IGetUserValidMintedAssetsParams {
  user?: string | null | void;
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

const getUserValidMintedAssetsIR: any = {"usedParamSet":{"user":true},"params":[{"name":"user","required":false,"transform":{"type":"scalar"},"locs":[{"a":252,"b":256}]}],"statement":"SELECT o.assetTokenId, o.amount FROM asset_token_ownership as o\nJOIN asset_token_state as a\nON o.assetTokenId = a.assetTokenId\nJOIN user_token_state as u\nON a.minter = u.wallet AND a.userTokenId = u.userTokenId AND a.amount = u.amount\nWHERE o.wallet = :user AND u.isDiamond = TRUE AND o.amount <> '0'"};

/**
 * Query generated from SQL:
 * ```
 * SELECT o.assetTokenId, o.amount FROM asset_token_ownership as o
 * JOIN asset_token_state as a
 * ON o.assetTokenId = a.assetTokenId
 * JOIN user_token_state as u
 * ON a.minter = u.wallet AND a.userTokenId = u.userTokenId AND a.amount = u.amount
 * WHERE o.wallet = :user AND u.isDiamond = TRUE AND o.amount <> '0'
 * ```
 */
export const getUserValidMintedAssets = new PreparedQuery<IGetUserValidMintedAssetsParams,IGetUserValidMintedAssetsResult>(getUserValidMintedAssetsIR);


/** 'GetDexOrders' parameters type */
export type IGetDexOrdersParams = void;

/** 'GetDexOrders' return type */
export interface IGetDexOrdersResult {
  amount: number;
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

const getDexOrdersIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT * FROM dex_order\nWHERE amount > 0\nORDER BY price::NUMERIC ASC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM dex_order
 * WHERE amount > 0
 * ORDER BY price::NUMERIC ASC
 * ```
 */
export const getDexOrders = new PreparedQuery<IGetDexOrdersParams,IGetDexOrdersResult>(getDexOrdersIR);


