/** Types generated for queries found in "src/queries/update.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type NumberOrString = number | string;

/** 'UpdateUserStateCurrentTokenId' parameters type */
export interface IUpdateUserStateCurrentTokenIdParams {
  wallet: string;
}

/** 'UpdateUserStateCurrentTokenId' return type */
export type IUpdateUserStateCurrentTokenIdResult = void;

/** 'UpdateUserStateCurrentTokenId' query type */
export interface IUpdateUserStateCurrentTokenIdQuery {
  params: IUpdateUserStateCurrentTokenIdParams;
  result: IUpdateUserStateCurrentTokenIdResult;
}

const updateUserStateCurrentTokenIdIR: any = {"usedParamSet":{"wallet":true},"params":[{"name":"wallet","required":true,"transform":{"type":"scalar"},"locs":[{"a":88,"b":95}]}],"statement":"UPDATE global_user_state\nSET currentUserTokenId = currentUserTokenId + 1\nWHERE wallet = :wallet!"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE global_user_state
 * SET currentUserTokenId = currentUserTokenId + 1
 * WHERE wallet = :wallet!
 * ```
 */
export const updateUserStateCurrentTokenId = new PreparedQuery<IUpdateUserStateCurrentTokenIdParams,IUpdateUserStateCurrentTokenIdResult>(updateUserStateCurrentTokenIdIR);


/** 'UpdateDexOrder' parameters type */
export interface IUpdateDexOrderParams {
  newAmount: NumberOrString;
  orderId: number;
}

/** 'UpdateDexOrder' return type */
export type IUpdateDexOrderResult = void;

/** 'UpdateDexOrder' query type */
export interface IUpdateDexOrderQuery {
  params: IUpdateDexOrderParams;
  result: IUpdateDexOrderResult;
}

const updateDexOrderIR: any = {"usedParamSet":{"newAmount":true,"orderId":true},"params":[{"name":"newAmount","required":true,"transform":{"type":"scalar"},"locs":[{"a":30,"b":40}]},{"name":"orderId","required":true,"transform":{"type":"scalar"},"locs":[{"a":58,"b":66}]}],"statement":"UPDATE dex_order\nSET amount = :newAmount!\nWHERE orderId = :orderId!"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE dex_order
 * SET amount = :newAmount!
 * WHERE orderId = :orderId!
 * ```
 */
export const updateDexOrder = new PreparedQuery<IUpdateDexOrderParams,IUpdateDexOrderResult>(updateDexOrderIR);


