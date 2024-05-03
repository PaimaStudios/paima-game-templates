/** Types generated for queries found in "src/queries/insert.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type NumberOrString = number | string;

/** 'CreateGlobalUserState' parameters type */
export interface ICreateGlobalUserStateParams {
  wallet: string;
}

/** 'CreateGlobalUserState' return type */
export type ICreateGlobalUserStateResult = void;

/** 'CreateGlobalUserState' query type */
export interface ICreateGlobalUserStateQuery {
  params: ICreateGlobalUserStateParams;
  result: ICreateGlobalUserStateResult;
}

const createGlobalUserStateIR: any = {"usedParamSet":{"wallet":true},"params":[{"name":"wallet","required":true,"transform":{"type":"scalar"},"locs":[{"a":53,"b":60}]}],"statement":"INSERT INTO global_user_state (\n  wallet\n) VALUES (\n :wallet!\n)\nON CONFLICT(wallet)\nDO NOTHING"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO global_user_state (
 *   wallet
 * ) VALUES (
 *  :wallet!
 * )
 * ON CONFLICT(wallet)
 * DO NOTHING
 * ```
 */
export const createGlobalUserState = new PreparedQuery<ICreateGlobalUserStateParams,ICreateGlobalUserStateResult>(createGlobalUserStateIR);


/** 'CreateUserTokenState' parameters type */
export interface ICreateUserTokenStateParams {
  amount: number;
  isDiamond: boolean;
  wallet: string;
}

/** 'CreateUserTokenState' return type */
export type ICreateUserTokenStateResult = void;

/** 'CreateUserTokenState' query type */
export interface ICreateUserTokenStateQuery {
  params: ICreateUserTokenStateParams;
  result: ICreateUserTokenStateResult;
}

const createUserTokenStateIR: any = {"usedParamSet":{"wallet":true,"amount":true,"isDiamond":true},"params":[{"name":"wallet","required":true,"transform":{"type":"scalar"},"locs":[{"a":91,"b":98},{"a":168,"b":174}]},{"name":"amount","required":true,"transform":{"type":"scalar"},"locs":[{"a":180,"b":187}]},{"name":"isDiamond","required":true,"transform":{"type":"scalar"},"locs":[{"a":192,"b":202}]}],"statement":"INSERT INTO user_token_state (\n  wallet,\n  userTokenId,\n  amount,\n  isDiamond\n) VALUES (\n  :wallet!,\n  (SELECT currentUserTokenId FROM global_user_state WHERE wallet = :wallet),\n  :amount!,\n  :isDiamond!\n)\nON CONFLICT (wallet, userTokenId)\nDO NOTHING"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO user_token_state (
 *   wallet,
 *   userTokenId,
 *   amount,
 *   isDiamond
 * ) VALUES (
 *   :wallet!,
 *   (SELECT currentUserTokenId FROM global_user_state WHERE wallet = :wallet),
 *   :amount!,
 *   :isDiamond!
 * )
 * ON CONFLICT (wallet, userTokenId)
 * DO NOTHING
 * ```
 */
export const createUserTokenState = new PreparedQuery<ICreateUserTokenStateParams,ICreateUserTokenStateResult>(createUserTokenStateIR);


/** 'CreateAssetTokenState' parameters type */
export interface ICreateAssetTokenStateParams {
  amount: number;
  assetTokenId: number;
  userTokenId: number;
  wallet: string;
}

/** 'CreateAssetTokenState' return type */
export type ICreateAssetTokenStateResult = void;

/** 'CreateAssetTokenState' query type */
export interface ICreateAssetTokenStateQuery {
  params: ICreateAssetTokenStateParams;
  result: ICreateAssetTokenStateResult;
}

const createAssetTokenStateIR: any = {"usedParamSet":{"assetTokenId":true,"wallet":true,"userTokenId":true,"amount":true},"params":[{"name":"assetTokenId","required":true,"transform":{"type":"scalar"},"locs":[{"a":95,"b":108}]},{"name":"wallet","required":true,"transform":{"type":"scalar"},"locs":[{"a":113,"b":120}]},{"name":"userTokenId","required":true,"transform":{"type":"scalar"},"locs":[{"a":125,"b":137}]},{"name":"amount","required":true,"transform":{"type":"scalar"},"locs":[{"a":142,"b":149}]}],"statement":"INSERT INTO asset_token_state (\n  assetTokenId,\n  wallet,\n  userTokenId,\n  amount\n) VALUES (\n  :assetTokenId!,\n  :wallet!,\n  :userTokenId!,\n  :amount!\n)\nON CONFLICT(assetTokenId)\nDO NOTHING"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO asset_token_state (
 *   assetTokenId,
 *   wallet,
 *   userTokenId,
 *   amount
 * ) VALUES (
 *   :assetTokenId!,
 *   :wallet!,
 *   :userTokenId!,
 *   :amount!
 * )
 * ON CONFLICT(assetTokenId)
 * DO NOTHING
 * ```
 */
export const createAssetTokenState = new PreparedQuery<ICreateAssetTokenStateParams,ICreateAssetTokenStateResult>(createAssetTokenStateIR);


/** 'CreateDexOrder' parameters type */
export interface ICreateDexOrderParams {
  amount: NumberOrString;
  assetTokenId: number;
  orderId: number;
  price: string;
  seller: string;
}

/** 'CreateDexOrder' return type */
export type ICreateDexOrderResult = void;

/** 'CreateDexOrder' query type */
export interface ICreateDexOrderQuery {
  params: ICreateDexOrderParams;
  result: ICreateDexOrderResult;
}

const createDexOrderIR: any = {"usedParamSet":{"orderId":true,"seller":true,"assetTokenId":true,"amount":true,"price":true},"params":[{"name":"orderId","required":true,"transform":{"type":"scalar"},"locs":[{"a":92,"b":100}]},{"name":"seller","required":true,"transform":{"type":"scalar"},"locs":[{"a":105,"b":112}]},{"name":"assetTokenId","required":true,"transform":{"type":"scalar"},"locs":[{"a":117,"b":130}]},{"name":"amount","required":true,"transform":{"type":"scalar"},"locs":[{"a":135,"b":142}]},{"name":"price","required":true,"transform":{"type":"scalar"},"locs":[{"a":147,"b":153}]}],"statement":"INSERT INTO dex_order (\n  orderId,\n  seller,\n  assetTokenId,\n  amount,\n  price\n) VALUES (\n  :orderId!,\n  :seller!,\n  :assetTokenId!,\n  :amount!,\n  :price!\n)\nON CONFLICT(orderId)\nDO NOTHING"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO dex_order (
 *   orderId,
 *   seller,
 *   assetTokenId,
 *   amount,
 *   price
 * ) VALUES (
 *   :orderId!,
 *   :seller!,
 *   :assetTokenId!,
 *   :amount!,
 *   :price!
 * )
 * ON CONFLICT(orderId)
 * DO NOTHING
 * ```
 */
export const createDexOrder = new PreparedQuery<ICreateDexOrderParams,ICreateDexOrderResult>(createDexOrderIR);


